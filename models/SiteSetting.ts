import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISiteSetting extends Document {
  companyName: string;
  tagline: string;
  phone: string;
  email: string;
  whatsapp?: string;
  address: {
    street: string;
    city: string;
    country: string;
    postalCode?: string;
  };
  workingHours: string;
  socialLinks: {
    linkedin?: string;
    twitter?: string;
    youtube?: string;
  };
  notificationEmails: {
    quotes: string;
    careers: string;
    general: string;
  };
  safetyMetrics: {
    safeWorkHours: string;
    ltiFreeDays: string;
    certifiedSafetyStandards: string[];
  };
  analytics: {
    googleAnalyticsId?: string;
  };
  updatedAt: Date;
}

const SiteSettingSchema = new Schema<ISiteSetting>(
  {
    companyName: { type: String, required: true, default: 'ARS EXIM' },
    tagline: {
      type: String,
      default: 'Specialist Industrial Contractor — Insulation, Passive Fire Protection & Scaffolding',
    },
    phone: { type: String, required: true, default: '+91 9764 425 426' },
    email: { type: String, required: true, default: 'info@arsexim.com' },
    whatsapp: { type: String, default: '+91 9764 425 426' },
    address: {
      street: { type: String, default: '' },
      city: { type: String, default: '' },
      country: { type: String, default: '' },
      postalCode: { type: String, default: '' },
    },
    workingHours: { type: String, default: '' },
    socialLinks: {
      linkedin: { type: String, default: '' },
      twitter: { type: String, default: '' },
      youtube: { type: String, default: '' },
    },
    notificationEmails: {
      quotes: { type: String, default: 'quotes@arsexim.com' },
      careers: { type: String, default: 'careers@arsexim.com' },
      general: { type: String, default: 'contact@arsexim.com' },
    },
    safetyMetrics: {
      safeWorkHours: { type: String, default: '' },
      ltiFreeDays: { type: String, default: '' },
      certifiedSafetyStandards: { type: [String], default: [] },
    },
    analytics: {
      googleAnalyticsId: { type: String, default: '' },
    },
  },
  { timestamps: true }
);

export const SiteSetting: Model<ISiteSetting> =
  mongoose.models.SiteSetting || mongoose.model<ISiteSetting>('SiteSetting', SiteSettingSchema);
