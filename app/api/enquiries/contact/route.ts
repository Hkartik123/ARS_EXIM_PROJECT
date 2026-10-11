import { prisma } from '@/lib/db/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { contactEnquirySchema } from '@/validators/enquiry.schema';
import { generateEnquiryReference } from '@/lib/utils';
import { emailService } from '@/lib/email/email-service';
import { checkRateLimit } from '@/lib/security/rate-limiter';
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

  // Rate limiting: 5 submissions per hour per IP
  const rateLimit = checkRateLimit(`contact-${ip}`, { windowMs: 60 * 60 * 1000, maxRequests: 5 });
  if (!rateLimit.allowed) {
    return respond(
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
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return respond(
        { success: false, error: { code: 'INVALID_JSON', message: 'The contact form submission was not valid JSON.' } },
        { status: 400 }
      );
    }

    const validated = contactEnquirySchema.safeParse(body);

    if (!validated.success) {
      return respond(
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
    try {
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

      // Email delivery happens only after PostgreSQL confirms the insert.
      void (async () => {
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
          logRequestFailure(err, {
            requestId,
            endpoint: '/api/enquiries/contact',
            operation: 'dispatch_email',
          });
        }
      })();

      return respond(
        {
          success: true,
          data: {
            referenceNumber,
            message: 'Your inquiry has been successfully transmitted.',
          },
        },
        { status: 201 }
      );
    } catch (err) {
      const failure = logDatabaseFailure(err, {
        requestId,
        endpoint: '/api/enquiries/contact',
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
    logRequestFailure(err, {
      requestId,
      endpoint: '/api/enquiries/contact',
      operation: 'parse_or_process_request',
    });
    return respond(
      {
        success: false,
        error: {
          code: 'SERVER_ERROR',
          message: 'The contact inquiry could not be processed.',
          requestId,
        },
      },
      { status: 500 }
    );
  }
}
