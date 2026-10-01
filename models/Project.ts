import mongoose, { Schema, Document, Model } from 'mongoose';

export type IndustryType =
  | 'Oil & Gas'
  | 'Petrochemical'
  | 'Power Generation'
  | 'Heavy Manufacturing'
  | 'Marine & Offshore'
  | 'Infrastructure';

export interface IProject extends Document {
  slug: string;
  title: string;
  client?: string;
  clientPublishable: boolean;
  industry: IndustryType;
  country: string;
  location: string;
  services: string[]; // e.g. ['industrial-insulation', 'scaffolding']
  shortDescription: string;
  scopeOfWork: string[];
  technicalChallenges: string[];
  executionApproach: string;
  safetyConsiderations: string[];
  featuredImage: string;
  galleryImages: string[];
  isFeatured: boolean;
  publishStatus: 'DRAFT' | 'REVIEW' | 'PUBLISHED' | 'ARCHIVED';
  publishedAt?: Date;
  isDeleted: boolean;
  seo: {
    title: string;
    metaDescription: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>(
  {
    slug: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true, trim: true },
    client: { type: String, trim: true },
    clientPublishable: { type: Boolean, default: false },
    industry: {
      type: String,
      required: true,
      enum: [
        'Oil & Gas',
        'Petrochemical',
        'Power Generation',
        'Heavy Manufacturing',
        'Marine & Offshore',
        'Infrastructure',
      ],
      index: true,
    },
    country: { type: String, required: true, index: true },
    location: { type: String, required: true },
    services: [{ type: String, required: true, index: true }],
    shortDescription: { type: String, required: true },
    scopeOfWork: [{ type: String, required: true }],
    technicalChallenges: [{ type: String }],
    executionApproach: { type: String, required: true },
    safetyConsiderations: [{ type: String }],
    featuredImage: { type: String, required: true },
    galleryImages: [{ type: String }],
    isFeatured: { type: Boolean, default: false, index: true },
    publishStatus: {
      type: String,
      enum: ['DRAFT', 'REVIEW', 'PUBLISHED', 'ARCHIVED'],
      default: 'DRAFT',
      index: true,
    },
    publishedAt: { type: Date },
    isDeleted: { type: Boolean, default: false, index: true },
    seo: {
      title: { type: String, required: true },
      metaDescription: { type: String, required: true },
    },
  },
  { timestamps: true }
);

ProjectSchema.index({ publishStatus: 1, isDeleted: 1, isFeatured: -1, createdAt: -1 });
ProjectSchema.index({ publishStatus: 1, isDeleted: 1, services: 1 });
ProjectSchema.index({ publishStatus: 1, isDeleted: 1, industry: 1 });

export const Project: Model<IProject> =
  mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema);
