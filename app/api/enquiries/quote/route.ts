import type { IEnquiryFile } from '@/models/Enquiry';
import { prisma } from '@/lib/db/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { quoteEnquirySchema } from '@/validators/enquiry.schema';
import { generateEnquiryReference } from '@/lib/utils';
import { storageService } from '@/lib/storage/storage-service';
import { emailService } from '@/lib/email/email-service';
import { checkRateLimit } from '@/lib/security/rate-limiter';
import { Prisma } from '@prisma/client';

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';

  // 1. Rate limiting: 5 submissions per hour per IP
  const rateLimit = checkRateLimit(`quote-${ip}`, { windowMs: 60 * 60 * 1000, maxRequests: 5 });
  if (!rateLimit.allowed) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'RATE_LIMIT_EXCEEDED',
          message: 'Quotation submission rate limit reached. Please wait before submitting another request.',
        },
      },
      { status: 429 }
    );
  }

  try {
    const formData = await req.formData();

    const rawServices = formData.get('requiredServices') as string;
    let parsedServices: string[] = [];
    try {
      parsedServices = rawServices ? JSON.parse(rawServices) : [];
    } catch {
      parsedServices = rawServices ? [rawServices] : [];
    }

    const payload = {
      name: (formData.get('name') as string) || '',
      company: (formData.get('company') as string) || '',
      email: (formData.get('email') as string) || '',
      phone: (formData.get('phone') as string) || '',
      country: (formData.get('country') as string) || '',
      projectName: (formData.get('projectName') as string) || undefined,
      projectType: (formData.get('projectType') as string) || undefined,
      industry: (formData.get('industry') as string) || undefined,
      location: (formData.get('location') as string) || undefined,
      requiredServices: parsedServices,
      expectedStartDate: (formData.get('expectedStartDate') as string) || undefined,
      projectDuration: (formData.get('projectDuration') as string) || undefined,
      scopeDescription: (formData.get('scopeDescription') as string) || '',
      consent: formData.get('consent') === 'true',
      turnstileToken: (formData.get('turnstileToken') as string) || undefined,
    };

    // 2. Validate payload
    const validated = quoteEnquirySchema.safeParse(payload);
    if (!validated.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid quotation parameters submitted.',
            details: validated.error.flatten(),
          },
        },
        { status: 400 }
      );
    }

    // 3. Process file attachments (up to 5 files, 10MB per file)
    const files = formData.getAll('files') as File[];
    const savedAttachments: IEnquiryFile[] = [];

    for (const file of files) {
      if (file && file.size > 0) {
        const validation = storageService.validateFile({
          size: file.size,
          type: file.type,
          name: file.name,
        });

        if (!validation.valid) {
          return NextResponse.json(
            { success: false, error: { code: 'FILE_VALIDATION_ERROR', message: validation.error } },
            { status: 400 }
          );
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const uploaded = await storageService.uploadBuffer(buffer, file.name, file.type, 'quotes');

        savedAttachments.push({
          originalName: uploaded.originalName,
          storageKey: uploaded.storageKey,
          fileSize: uploaded.fileSize,
          mimeType: uploaded.mimeType,
        });
      }
    }
    // 4. Generate unique atomic reference number: QR-YYYY-XXXXXX
    const referenceNumber = generateEnquiryReference('QR');

    // 5. DATABASE-FIRST RESILIENCE: Save the record before triggering external services
    const enquiry = await prisma.enquiry.create({ data: {
      referenceNumber,
      type: 'QUOTE',
      status: 'NEW',
      name: validated.data.name,
      company: validated.data.company,
      email: validated.data.email,
      phone: validated.data.phone,
      country: validated.data.country,
      projectName: validated.data.projectName,
      projectType: validated.data.projectType,
      industry: validated.data.industry,
      location: validated.data.location,
      requiredServices: validated.data.requiredServices,
      expectedStartDate: validated.data.expectedStartDate,
      projectDuration: validated.data.projectDuration,
      scopeDescription: validated.data.scopeDescription,
      attachments: savedAttachments as unknown as Prisma.InputJsonValue,
      ipAddress: ip,
      userAgent: req.headers.get('user-agent') || undefined,
      emailDispatched: false,
    } });

    // 6. Asynchronously dispatch transactional emails without blocking client response
    (async () => {
      try {
        const adminEmail = process.env.SALES_NOTIFY_EMAIL || 'info@arsexim.com';
        // Send alert to admin
        await emailService.sendEmail({
          to: adminEmail,
          subject: `[NEW RFQ ${referenceNumber}] ${validated.data.company} - ${validated.data.name}`,
          html: emailService.generateQuoteAdminHtml({
            referenceNumber,
            name: validated.data.name,
            company: validated.data.company,
            email: validated.data.email,
            phone: validated.data.phone,
            country: validated.data.country,
            projectName: validated.data.projectName,
            projectType: validated.data.projectType,
            industry: validated.data.industry,
            requiredServices: validated.data.requiredServices,
            scopeDescription: validated.data.scopeDescription,
            attachmentsCount: savedAttachments.length,
          }),
        });

        // Send confirmation to customer
        await emailService.sendEmail({
          to: validated.data.email,
          subject: `ARS EXIM Quotation Request Received [${referenceNumber}]`,
          html: emailService.generateQuoteCustomerHtml({
            referenceNumber,
            name: validated.data.name,
            company: validated.data.company,
          }),
        });

        await prisma.enquiry.update({
          where: { id: enquiry.id },
          data: { emailDispatched: true },
        });
      } catch (emailErr: any) {
        console.error('Email notification failure for enquiry:', emailErr);
        await prisma.enquiry.update({
          where: { id: enquiry.id },
          data: { emailDispatchError: emailErr?.message || 'Email delivery failed' },
        });
      }
    })();

    // 7. Return 201 Created with Reference Number
    return NextResponse.json(
      {
        success: true,
        data: {
          referenceNumber,
          message: 'Quotation request successfully registered.',
        },
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error('Quotation submission error:', err);
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: err.message || 'Quotation could not be processed.' } },
      { status: 500 }
    );
  }
}
