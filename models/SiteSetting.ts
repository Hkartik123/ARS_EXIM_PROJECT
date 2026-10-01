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
    phone: { type: String, required: true, default: '+971 4 000 0000' },
    email: { type: String, required: true, default: 'contact@arsexim.com' },
    whatsapp: { type: String, default: '+971 50 000 0000' },
    address: {
      street: { type: String, default: 'Industrial Area 1' },
      city: { type: String, default: 'Dubai' },
      country: { type: String, default: 'United Arab Emirates' },
      postalCode: { type: String, default: '' },
    },
    workingHours: { type: String, default: 'Monday – Friday: 08:00 – 18:00 (GST)' },
    socialLinks: {
      linkedin: { type: String, default: 'https://linkedin.com/company/arsexim' },
      twitter: { type: String, default: '' },
      youtube: { type: String, default: '' },
    },
    notificationEmails: {
      quotes: { type: String, default: 'quotes@arsexim.com' },
      careers: { type: String, default: 'careers@arsexim.com' },
      general: { type: String, default: 'contact@arsexim.com' },
    },
    safetyMetrics: {
      safeWorkHours: { type: String, default: '2,500,000+' },
      ltiFreeDays: { type: String, default: '1,800+' },
      certifiedSafetyStandards: {
        type: [String],
        default: ['ISO 45001:2018', 'ISO 9001:2015', 'ISO 14001:2015'],
      },
    },
    analytics: {
      googleAnalyticsId: { type: String, default: '' },
    },
  },
  { timestamps: true }
);

export const SiteSetting: Model<ISiteSetting> =
  mongoose.models.SiteSetting || mongoose.model<ISiteSetting>('SiteSetting', SiteSettingSchema);
