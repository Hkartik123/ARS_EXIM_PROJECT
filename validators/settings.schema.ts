import { z } from 'zod';

export const siteSettingSchema = z.object({
  companyName: z.string().min(2).max(100),
  tagline: z.string().min(10).max(250),
  phone: z.string().min(5).max(30),
  email: z.string().email(),
  whatsapp: z.string().max(30).optional().or(z.literal('')),
  address: z.object({
    street: z.string().min(2),
    city: z.string().min(2),
    country: z.string().min(2),
    postalCode: z.string().optional().or(z.literal('')),
  }),
  workingHours: z.string().min(5),
  socialLinks: z.object({
    linkedin: z.string().optional().or(z.literal('')),
    twitter: z.string().optional().or(z.literal('')),
    youtube: z.string().optional().or(z.literal('')),
  }),
  notificationEmails: z.object({
    quotes: z.string().email(),
    careers: z.string().email(),
    general: z.string().email(),
  }),
  safetyMetrics: z.object({
    safeWorkHours: z.string().min(2),
    ltiFreeDays: z.string().min(1),
    certifiedSafetyStandards: z.array(z.string()),
  }),
  analytics: z.object({
    googleAnalyticsId: z.string().optional().or(z.literal('')),
  }),
});
