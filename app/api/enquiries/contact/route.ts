import { prisma } from '@/lib/db/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { contactEnquirySchema } from '@/validators/enquiry.schema';
import { generateEnquiryReference } from '@/lib/utils';
import { emailService } from '@/lib/email/email-service';
import { checkRateLimit } from '@/lib/security/rate-limiter';

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';

  // Rate limiting: 5 submissions per hour per IP
  const rateLimit = checkRateLimit(`contact-${ip}`, { windowMs: 60 * 60 * 1000, maxRequests: 5 });
  if (!rateLimit.allowed) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'RATE_LIMIT_EXCEEDED',
          message: 'Contact submission rate limit reached. Please wait before retrying.',
        },
      },
      { status: 429 }
    );
  }

  try {
    const body = await req.json();
    const validated = contactEnquirySchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid contact form details.',
            details: validated.error.flatten(),
          },
        },
        { status: 400 }
      );
    }
    const referenceNumber = generateEnquiryReference('CR');

    // Database-first commit
    const enquiry = await prisma.enquiry.create({ data: {
      referenceNumber,
      type: 'CONTACT',
      status: 'NEW',
      name: validated.data.name,
      company: validated.data.company,
      email: validated.data.email,
      phone: validated.data.phone,
      country: validated.data.country,
      requiredServices: validated.data.serviceCategory ? [validated.data.serviceCategory] : [],
      scopeDescription: validated.data.message,
      ipAddress: ip,
      userAgent: req.headers.get('user-agent') || undefined,
      emailDispatched: false,
    } });

    // Background transactional email dispatch
    (async () => {
      try {
        const adminEmail = process.env.EMAIL_FROM || 'info@arsexim.com';
        await emailService.sendEmail({
          to: adminEmail,
          subject: `[INQUIRY ${referenceNumber}] ${validated.data.company} - ${validated.data.name}`,
          html: `<p>New contact message from <strong>${validated.data.name}</strong> (${validated.data.company}):</p><p>${validated.data.message}</p>`,
        });
        await prisma.enquiry.update({
          where: { id: enquiry.id },
          data: { emailDispatched: true },
        });
      } catch (err) {
        console.error('Email dispatch error on contact inquiry:', err);
      }
    })();

    return NextResponse.json(
      {
        success: true,
        data: {
          referenceNumber,
          message: 'Your inquiry has been successfully transmitted.',
        },
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error('Contact inquiry error:', err);
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: err.message || 'Contact inquiry failed.' } },
      { status: 500 }
    );
  }
}
