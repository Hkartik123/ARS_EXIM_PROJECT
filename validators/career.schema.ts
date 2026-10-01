import { z } from 'zod';

export const careerSchema = z.object({
  title: z.string().min(5).max(150).trim(),
  slug: z
    .string()
    .min(3)
    .regex(/^[a-z0-9-]+$/)
    .trim(),
  department: z.string().min(2).max(100),
  location: z.string().min(2).max(100),
  employmentType: z.enum(['Full-time', 'Contract', 'Rotational']),
  experienceRequired: z.string().min(2).max(100),
  overview: z.string().min(20).max(2000),
  responsibilities: z.array(z.string()).min(1),
  requirements: z.array(z.string()).min(1),
  closingDate: z.string().optional().or(z.literal('')),
  isOpen: z.boolean().default(true),
});

export const applicationSchema = z.object({
  jobId: z.string().optional(),
  jobTitle: z.string().min(2),
  candidateName: z.string().min(2, 'Name is required.').max(100).trim(),
  email: z.string().email('Valid email is required.').trim().toLowerCase(),
  phone: z.string().min(7, 'Phone number is required.').max(30).trim(),
  currentLocation: z.string().min(2, 'Current location is required.').trim(),
  yearsOfExperience: z.number().min(0).max(50),
  coverLetter: z.string().max(3000).optional(),
});
