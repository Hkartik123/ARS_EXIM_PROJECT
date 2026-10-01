import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IServiceCapability {
  title: string;
  description: string;
  standards?: string[];
}

export interface IServiceMethodology {
  stepNumber: number;
  title: string;
  description: string;
}

export interface IServiceFaq {
  question: string;
  answer: string;
}

export interface IService extends Document {
  slug: string; // 'industrial-insulation' | 'passive-fire-protection' | 'scaffolding'
  title: string;
  tagline: string;
  shortDescription: string;
  overview: string;
  applications: string[];
  capabilities: IServiceCapability[];
  methodology: IServiceMethodology[];
  safetyPractices: string[];
  qualityAssurance: string[];
  heroImageUrl: string;
  galleryUrls: string[];
  faqs: IServiceFaq[];
  seo: {
    title: string;
    metaDescription: string;
    keywords: string[];
  };
  order: number;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ServiceSchema = new Schema<IService>(
  {
    slug: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true, trim: true },
    tagline: { type: String, required: true },
    shortDescription: { type: String, required: true },
    overview: { type: String, required: true },
    applications: [{ type: String, required: true }],
    capabilities: [
      {
        title: { type: String, required: true },
        description: { type: String, required: true },
        standards: [{ type: String }],
      },
    ],
    methodology: [
      {
        stepNumber: { type: Number, required: true },
        title: { type: String, required: true },
        description: { type: String, required: true },
      },
    ],
    safetyPractices: [{ type: String, required: true }],
    qualityAssurance: [{ type: String, required: true }],
    heroImageUrl: { type: String, required: true },
    galleryUrls: [{ type: String }],
    faqs: [
      {
        question: { type: String, required: true },
        answer: { type: String, required: true },
      },
    ],
    seo: {
      title: { type: String, required: true },
      metaDescription: { type: String, required: true },
      keywords: [{ type: String }],
    },
    order: { type: Number, default: 0, index: true },
    isPublished: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

export const Service: Model<IService> =
  mongoose.models.Service || mongoose.model<IService>('Service', ServiceSchema);
