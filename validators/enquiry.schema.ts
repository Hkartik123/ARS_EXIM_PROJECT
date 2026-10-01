import { z } from 'zod';

export const quoteEnquirySchema = z.object({
  name: z.string().min(2, 'Contact name must be at least 2 characters.').max(100).trim(),
  company: z.string().min(2, 'Company name is required.').max(150).trim(),
  email: z.string().email('Valid business email address is required.').trim().toLowerCase(),
  phone: z.string().min(7, 'Contact phone number must be at least 7 digits.').max(30).trim(),
  country: z.string().min(2, 'Country or territory is required.').trim(),
  projectName: z.string().max(200).optional().or(z.literal('')),
  projectType: z.string().min(1, 'Please select a project type.').max(100),
  industry: z.string().max(100).optional().or(z.literal('')),
  location: z.string().max(150).optional().or(z.literal('')),
  requiredServices: z
    .array(z.string())
    .min(1, 'Please select at least one required industrial service.'),
  expectedStartDate: z.string().optional().or(z.literal('')),
  projectDuration: z.string().optional().or(z.literal('')),
  scopeDescription: z
    .string()
    .min(20, 'Please describe your project scope in at least 20 characters.')
    .max(5000),
  consent: z.literal(true, {
    errorMap: () => ({ message: 'You must confirm consent to process project data.' }),
  }),
  turnstileToken: z.string().optional(),
});

export const contactEnquirySchema = z.object({
  name: z.string().min(2, 'Name is required.').max(100).trim(),
  company: z.string().min(2, 'Company is required.').max(150).trim(),
  email: z.string().email('Valid email is required.').trim().toLowerCase(),
  phone: z.string().min(7, 'Phone number is required.').max(30).trim(),
  country: z.string().min(2, 'Country is required.').trim(),
  serviceCategory: z.string().optional(),
  message: z.string().min(15, 'Message must be at least 15 characters long.').max(3000),
  consent: z.literal(true, {
    errorMap: () => ({ message: 'You must consent to be contacted regarding your inquiry.' }),
  }),
  turnstileToken: z.string().optional(),
});

export const updateEnquiryStatusSchema = z.object({
  status: z.enum(['NEW', 'CONTACTED', 'UNDER_REVIEW', 'CLOSED', 'SPAM', 'ARCHIVED']),
  note: z.string().max(1000).optional(),
});
