import { z } from 'zod';

export const projectSchema = z.object({
  title: z.string().min(5, 'Project title is required.').max(200).trim(),
  slug: z
    .string()
    .min(3, 'Slug is required.')
    .regex(/^[a-z0-9-]+$/, 'Slug must only contain lowercase letters, numbers, and hyphens.')
    .trim(),
  client: z.string().max(150).optional().or(z.literal('')),
  clientPublishable: z.boolean().default(false),
  industry: z.enum([
    'Oil & Gas',
    'Petrochemical',
    'Power Generation',
    'Heavy Manufacturing',
    'Marine & Offshore',
    'Infrastructure',
  ]),
  country: z.string().min(2, 'Country is required.').trim(),
  location: z.string().min(2, 'Location is required.').trim(),
  services: z.array(z.string()).min(1, 'At least one service must be tagged.'),
  shortDescription: z.string().min(20, 'Short description is required.').max(500),
  scopeOfWork: z.array(z.string()).min(1, 'At least one scope item is required.'),
  technicalChallenges: z.array(z.string()).default([]),
  executionApproach: z.string().min(30, 'Execution approach details are required.'),
  safetyConsiderations: z.array(z.string()).default([]),
  featuredImage: z.string().min(1, 'Featured image is required.'),
  galleryImages: z.array(z.string()).default([]),
  isFeatured: z.boolean().default(false),
  publishStatus: z.enum(['DRAFT', 'REVIEW', 'PUBLISHED', 'ARCHIVED']).default('DRAFT'),
  seo: z.object({
    title: z.string().min(5).max(120),
    metaDescription: z.string().min(20).max(300),
  }),
});
