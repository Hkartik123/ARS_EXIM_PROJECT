import { z } from 'zod';

export const projectSchema = z.object({
  title: z.string().min(3, 'Project title is required.').max(200).trim(),
  slug: z
    .string()
    .min(1, 'Slug is required.')
    .regex(/^[a-z0-9-]+$/, 'Slug must only contain lowercase letters, numbers, and hyphens.')
    .trim()
    .optional()
    .or(z.literal('')),
  client: z.string().max(150).optional().or(z.literal('')),
  clientName: z.string().max(150).optional().or(z.literal('')),
  category: z.string().max(100).optional().or(z.literal('')),
  clientPublishable: z.boolean().optional().default(false),
  industry: z.string().max(80).optional().or(z.literal('')),
  country: z.string().min(2, 'Country is required.').trim().optional().or(z.literal('')),
  location: z.string().min(2, 'Location is required.').trim().optional().or(z.literal('')),
  status: z.enum(['UPCOMING', 'ONGOING', 'COMPLETED']).optional().or(z.literal('')),
  services: z.array(z.string()).default([]),
  shortDescription: z.string().min(10, 'Short description is required.').max(500).optional().or(z.literal('')),
  description: z.string().max(2000).optional().or(z.literal('')),
  scopeOfWork: z.array(z.string()).default([]),
  technicalChallenges: z.array(z.string()).default([]),
  executionApproach: z.string().max(5000).optional().or(z.literal('')),
  safetyConsiderations: z.array(z.string()).default([]),
  coverImage: z.string().max(500).optional().or(z.literal('')),
  featuredImage: z.string().max(500).optional().or(z.literal('')),
  coverImageIsIllustrative: z.boolean().optional().default(false),
  galleryImages: z.array(z.string()).default([]),
  isFeatured: z.boolean().optional().default(false),
  featured: z.boolean().optional().default(false),
  published: z.boolean().optional().default(false),
  publishStatus: z.enum(['DRAFT', 'REVIEW', 'PUBLISHED', 'ARCHIVED']).optional().default('DRAFT'),
  seo: z
    .object({
      title: z.string().min(5).max(120).optional().or(z.literal('')),
      metaDescription: z.string().min(20).max(300).optional().or(z.literal('')),
    })
    .optional()
    .default({ title: '', metaDescription: '' }),
});
