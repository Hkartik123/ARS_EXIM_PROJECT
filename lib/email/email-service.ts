import nodemailer from 'nodemailer';

export interface EmailPayload {
  to: string;
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
}

class EmailService {
  private transporter: nodemailer.Transporter | null = null;

  constructor() {
    if (process.env.SMTP_HOST && process.env.SMTP_USER) {
      this.transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587', 10),
        secure: process.env.SMTP_PORT === '465',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
    }
  }

  async sendEmail(payload: EmailPayload): Promise<{ success: boolean; messageId?: string; error?: string }> {
    const from = process.env.EMAIL_FROM || 'ARS EXIM Notifications <notifications@arsexim.com>';

    // In development or if SMTP is unconfigured, log the email cleanly to avoid crashes
    if (!this.transporter || process.env.EMAIL_PROVIDER === 'console') {
      console.log('--------------------------------------------------');
      console.log(`📨 [MOCK EMAIL DISPATCH]`);
      console.log(`To: ${payload.to}`);
      console.log(`Subject: ${payload.subject}`);
      console.log(`Reply-To: ${payload.replyTo || from}`);
      console.log(`HTML Preview:\n${payload.html.substring(0, 300)}...`);
      console.log('--------------------------------------------------');
      return { success: true, messageId: `mock-${Date.now()}` };
    }

    try {
      const info = await this.transporter.sendMail({
        from,
        to: payload.to,
        replyTo: payload.replyTo,
        subject: payload.subject,
        html: payload.html,
        text: payload.text || payload.html.replace(/<[^>]*>/g, ''),
      });
      return { success: true, messageId: info.messageId };
    } catch (err: any) {
      console.error('Email delivery error:', err);
      return { success: false, error: err?.message || 'Email delivery failed' };
    }
  }

  // Pre-built templates
  generateQuoteAdminHtml(enquiry: {
    referenceNumber: string;
    name: string;
    company: string;
    email: string;
    phone: string;
    country: string;
    projectName?: string;
    industry?: string;
    requiredServices?: string[];
    scopeDescription: string;
    attachmentsCount: number;
  }): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; background-color: #F1F3F5; margin: 0; padding: 20px; color: #1E232A; }
          .container { max-width: 650px; margin: 0 auto; background: #FFFFFF; border-top: 4px solid #C9A961; border-radius: 4px; box-shadow: 0 4px 12px rgba(16, 35, 63, 0.08); overflow: hidden; }
          .header { background: #10233F; color: #FFFFFF; padding: 24px 32px; }
          .header h1 { margin: 0; font-size: 20px; font-weight: 600; letter-spacing: 0.5px; }
          .badge { display: inline-block; background: #C9A961; color: #10233F; padding: 4px 10px; font-weight: 700; font-size: 13px; border-radius: 3px; margin-top: 8px; }
          .content { padding: 32px; }
          .data-table { width: 100%; border-collapse: collapse; margin-top: 16px; }
          .data-table th, .data-table td { padding: 10px 12px; text-align: left; border-bottom: 1px solid #F1F3F5; font-size: 14px; }
          .data-table th { width: 35%; color: #6B7480; font-weight: 600; background: #F8F9FA; }
          .scope-box { background: #F8F9FA; border-left: 3px solid #10233F; padding: 16px; margin-top: 20px; font-size: 14px; line-height: 1.6; }
          .footer { background: #F8F9FA; padding: 20px 32px; font-size: 12px; color: #6B7480; text-align: center; border-top: 1px solid #E5E7EB; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>ARS EXIM — Industrial Quotation Request</h1>
            <div class="badge">Reference: ${enquiry.referenceNumber}</div>
          </div>
          <div class="content">
            <p>A new industrial quotation request has been registered in the system:</p>
            <table class="data-table">
              <tr><th>Client Name</th><td>${enquiry.name}</td></tr>
              <tr><th>Company</th><td>${enquiry.company}</td></tr>
              <tr><th>Email</th><td><a href="mailto:${enquiry.email}">${enquiry.email}</a></td></tr>
              <tr><th>Phone</th><td>${enquiry.phone}</td></tr>
              <tr><th>Country</th><td>${enquiry.country}</td></tr>
              <tr><th>Project Name</th><td>${enquiry.projectName || 'Not specified'}</td></tr>
              <tr><th>Industry Sector</th><td>${enquiry.industry || 'Not specified'}</td></tr>
              <tr><th>Required Services</th><td>${enquiry.requiredServices?.join(', ') || 'N/A'}</td></tr>
              <tr><th>Attachments</th><td>${enquiry.attachmentsCount} file(s) uploaded</td></tr>
            </table>

            <h3 style="margin-top: 24px; font-size: 15px; color: #10233F;">Technical Scope & Requirements:</h3>
            <div class="scope-box">${enquiry.scopeDescription.replace(/\n/g, '<br>')}</div>
          </div>
          <div class="footer">
            This is an automated notification from the ARS EXIM Platform. Access the secure admin portal to review attachments and manage quotation status.
          </div>
        </div>
      </body>
      </html>
    `;
  }

  generateQuoteCustomerHtml(enquiry: {
    referenceNumber: string;
    name: string;
    company: string;
  }): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; background-color: #F1F3F5; margin: 0; padding: 20px; color: #1E232A; }
          .container { max-width: 600px; margin: 0 auto; background: #FFFFFF; border-top: 4px solid #C9A961; border-radius: 4px; box-shadow: 0 4px 12px rgba(16, 35, 63, 0.08); overflow: hidden; }
          .header { background: #10233F; color: #FFFFFF; padding: 28px 32px; text-align: center; }
          .badge { display: inline-block; background: #C9A961; color: #10233F; padding: 6px 14px; font-weight: 700; font-size: 14px; border-radius: 3px; margin-top: 12px; }
          .content { padding: 32px; line-height: 1.6; font-size: 15px; }
          .footer { background: #F8F9FA; padding: 20px 32px; font-size: 12px; color: #6B7480; text-align: center; border-top: 1px solid #E5E7EB; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin:0; font-size: 22px;">ARS EXIM</h1>
            <p style="margin: 4px 0 0; font-size: 13px; color: #D5DAE0;">Specialist Industrial Contractor</p>
            <div class="badge">Quotation Reference: ${enquiry.referenceNumber}</div>
          </div>
          <div class="content">
            <p>Dear ${enquiry.name},</p>
            <p>Thank you for requesting an industrial project quotation from ARS EXIM on behalf of <strong>${enquiry.company}</strong>.</p>
            <p>Your technical requirements have been logged into our engineering review queue under Reference <strong>${enquiry.referenceNumber}</strong>. Our estimating and technical proposals department is evaluating your scope and BoQ specifications.</p>
            <p>A specialist industrial engineer will be in contact with your team within 1 business day.</p>
            <p style="margin-top: 24px;">Sincerely,<br><strong>ARS EXIM Engineering & Estimating Team</strong><br><a href="https://arsexim.com" style="color: #10233F; text-decoration: none;">arsexim.com</a></p>
          </div>
          <div class="footer">
            ARS EXIM Industrial Contracting • Industrial Insulation • Passive Fire Protection • Scaffolding & Access
          </div>
        </div>
      </body>
      </html>
    `;
  }
}

export const emailService = new EmailService();
