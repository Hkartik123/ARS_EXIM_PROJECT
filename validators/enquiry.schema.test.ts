import { describe, expect, it } from 'vitest';
import { contactEnquirySchema, quoteEnquirySchema } from './enquiry.schema';

const validContact = {
  name: '  Ananya Rao  ',
  company: '  Example Engineering  ',
  email: '  ANANYA@example.com ',
  phone: '+91 9764 425 426',
  country: 'India',
  serviceCategory: 'General Inquiry',
  message: 'Please contact me about an upcoming project.',
  consent: true,
};

const validQuote = {
  name: 'Ananya Rao',
  company: 'Example Engineering',
  email: 'ananya@example.com',
  phone: '+91 9764 425 426',
  country: 'India',
  projectType: 'New build / capital project',
  requiredServices: ['Insulation - Hot'],
  scopeDescription: 'We need insulation for a new industrial facility.',
  consent: true,
};

describe('enquiry schemas', () => {
  it('trims and normalizes valid contact submissions', () => {
    expect(contactEnquirySchema.parse(validContact)).toMatchObject({
      name: 'Ananya Rao',
      company: 'Example Engineering',
      email: 'ananya@example.com',
    });
  });

  it('rejects invalid contact fields and missing consent', () => {
    const result = contactEnquirySchema.safeParse({
      ...validContact,
      email: 'not-an-email',
      consent: false,
    });

    expect(result.success).toBe(false);
  });

  it('accepts a valid quotation submission', () => {
    expect(quoteEnquirySchema.safeParse(validQuote).success).toBe(true);
  });

  it('rejects quotation submissions without services or valid scope', () => {
    const result = quoteEnquirySchema.safeParse({
      ...validQuote,
      requiredServices: [],
      scopeDescription: 'too short',
    });

    expect(result.success).toBe(false);
  });
});
