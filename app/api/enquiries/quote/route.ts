import type { IEnquiryFile } from '@/models/Enquiry';
import { prisma } from '@/lib/db/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { quoteEnquirySchema } from '@/validators/enquiry.schema';
import { generateEnquiryReference } from '@/lib/utils';
import { StorageConfigurationError, storageService } from '@/lib/storage/storage-service';
import { emailService } from '@/lib/email/email-service';
import { checkRateLimit } from '@/lib/security/rate-limiter';
import { Prisma } from '@prisma/client';
import {
  addRequestId,
  createRequestId,
  logDatabaseFailure,
  logRequestFailure,
} from '@/lib/api/request-diagnostics';

export async function POST(req: NextRequest) {
  const requestId = createRequestId();
  const respond = (body: unknown, init?: ResponseInit) =>
    addRequestId(NextResponse.json(body, init), requestId);
  const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';

  // 1. Rate limiting: 5 submissions per hour per IP
  const rateLimit = checkRateLimit(`quote-${ip}`, { windowMs: 60 * 60 * 1000, maxRequests: 5 });
  if (!rateLimit.allowed) {
    return respond(
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
    let formData: FormData;
    try {
      formData = await req.formData();
    } catch {
      return respond(
        { success: false, error: { code: 'INVALID_FORM_DATA', message: 'The quotation form submission was not valid.' } },
        { status: 400 }
      );
    }

    const getString = (key: string) => {
      const value = formData.get(key);
      return typeof value === 'string' ? value : '';
    };
    const rawServices = getString('requiredServices');
    let parsedServices: string[] = [];
    try {
      const parsed: unknown = rawServices ? JSON.parse(rawServices) : [];
      parsedServices = Array.isArray(parsed) && parsed.every((value) => typeof value === 'string')
        ? parsed
        : [];
    } catch {
      parsedServices = [];
    }

    const payload = {
      name: getString('name'),
      company: getString('company'),
      email: getString('email'),
      phone: getString('phone'),
      country: getString('country'),
      projectName: getString('projectName') || undefined,
      projectType: getString('projectType') || undefined,
      industry: getString('industry') || undefined,
      location: getString('location') || undefined,
      requiredServices: parsedServices,
      expectedStartDate: getString('expectedStartDate') || undefined,
      projectDuration: getString('projectDuration') || undefined,
      scopeDescription: getString('scopeDescription'),
      consent: getString('consent') === 'true',
      turnstileToken: getString('turnstileToken') || undefined,
    };

    // 2. Validate payload
    const validated = quoteEnquirySchema.safeParse(payload);
    if (!validated.success) {
      return respond(
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
    const rawFiles = formData.getAll('files');
    if (rawFiles.some((file) => typeof file === 'string')) {
      return respond(
        { success: false, error: { code: 'FILE_VALIDATION_ERROR', message: 'Invalid file attachment submitted.' } },
        { status: 400 }
      );
    }
    const files = rawFiles as File[];
    if (files.length > 5) {
      return respond(
        { success: false, error: { code: 'FILE_VALIDATION_ERROR', message: 'A maximum of 5 files may be uploaded.' } },
        { status: 400 }
      );
    }
    const totalUploadSize = files.reduce((total, file) => total + (file.size > 0 ? file.size : 0), 0);
    if (totalUploadSize > 25 * 1024 * 1024) {
      return respond(
        { success: false, error: { code: 'FILE_VALIDATION_ERROR', message: 'Total upload size cannot exceed 25MB.' } },
        { status: 400 }
      );
    }
    const savedAttachments: IEnquiryFile[] = [];

    for (const file of files) {
      if (file && file.size > 0) {
        const validation = storageService.validateFile({
          size: file.size,
          type: file.type,
          name: file.name,
        });

        if (!validation.valid) {
          return respond(
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
    try {
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

      // Email delivery happens only after PostgreSQL confirms the insert.
      void (async () => {
        try {
          const adminEmail = process.env.SALES_NOTIFY_EMAIL || 'info@arsexim.com';
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
        } catch (emailError) {
          logRequestFailure(emailError, {
            requestId,
            endpoint: '/api/enquiries/quote',
            operation: 'dispatch_email',
          });
          const details = emailError as { message?: string };
          await prisma.enquiry.update({
            where: { id: enquiry.id },
            data: { emailDispatchError: details.message || 'Email delivery failed' },
          }).catch((updateError: unknown) => {
            logRequestFailure(updateError, {
              requestId,
              endpoint: '/api/enquiries/quote',
              operation: 'record_email_failure',
            });
          });
        }
      })();

      return respond(
        {
          success: true,
          data: {
            referenceNumber,
            message: 'Quotation request successfully registered.',
          },
        },
        { status: 201 }
      );
    } catch (err) {
      const failure = logDatabaseFailure(err, {
        requestId,
        endpoint: '/api/enquiries/quote',
        operation: 'prisma.enquiry.create',
      });
      return respond(
        {
          success: false,
          error: {
            code: failure.code,
            category: failure.category,
            message: failure.message,
            requestId,
          },
        },
        { status: failure.status }
      );
    }

  } catch (err) {
    if (err instanceof StorageConfigurationError) {
      return respond(
        { success: false, error: { code: 'STORAGE_UNAVAILABLE', message: 'File uploads are temporarily unavailable. Please try again later.', requestId } },
        { status: 503 }
      );
    }
    logRequestFailure(err, {
      requestId,
      endpoint: '/api/enquiries/quote',
      operation: 'parse_validate_or_upload_request',
    });
    return respond(
      {
        success: false,
        error: {
          code: 'SERVER_ERROR',
          message: 'The quotation request could not be processed.',
          requestId,
        },
      },
      { status: 500 }
    );
  }
}
