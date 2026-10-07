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
  category?: string;
  client?: string;
  clientName?: string;
  clientPublishable: boolean;
  industry?: IndustryType | string;
  country?: string;
  location: string;
  status?: 'UPCOMING' | 'ONGOING' | 'COMPLETED' | 'DRAFT' | 'REVIEW' | 'PUBLISHED' | 'ARCHIVED';
  services: string[];
  shortDescription: string;
  description?: string;
  scopeOfWork: string[];
  technicalChallenges: string[];
  executionApproach?: string;
  safetyConsiderations: string[];
  coverImage?: string;
  featuredImage?: string;
  coverImageIsIllustrative?: boolean;
  galleryImages: string[];
  isFeatured: boolean;
  featured?: boolean;
  published?: boolean;
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
    category: { type: String, default: 'Other', index: true },
    client: { type: String, trim: true },
    clientName: { type: String, trim: true },
    clientPublishable: { type: Boolean, default: false },
    industry: {
      type: String,
      enum: [
        'Oil & Gas',
        'Petrochemical',
        'Power Generation',
        'Heavy Manufacturing',
        'Marine & Offshore',
        'Infrastructure',
        'Other',
      ],
      default: 'Other',
      index: true,
    },
    country: { type: String, default: '', index: true },
    location: { type: String, default: '' },
    status: {
      type: String,
      enum: ['UPCOMING', 'ONGOING', 'COMPLETED', 'DRAFT', 'REVIEW', 'PUBLISHED', 'ARCHIVED'],
      index: true,
    },
    services: [{ type: String, default: [], index: true }],
    shortDescription: { type: String, default: '' },
    description: { type: String, default: '' },
    scopeOfWork: [{ type: String, default: [] }],
    technicalChallenges: [{ type: String }],
    executionApproach: { type: String, default: '' },
    safetyConsiderations: [{ type: String }],
    coverImage: { type: String, default: '' },
    featuredImage: { type: String, default: '/images/industrial-site-team.webp' },
    coverImageIsIllustrative: { type: Boolean, default: false },
    galleryImages: [{ type: String }],
    isFeatured: { type: Boolean, default: false, index: true },
    featured: { type: Boolean, default: false },
    published: { type: Boolean, default: false, index: true },
    publishStatus: {
      type: String,
      enum: ['DRAFT', 'REVIEW', 'PUBLISHED', 'ARCHIVED'],
      default: 'DRAFT',
      index: true,
    },
    publishedAt: { type: Date },
    isDeleted: { type: Boolean, default: false, index: true },
    seo: {
      title: { type: String, default: '' },
      metaDescription: { type: String, default: '' },
    },
  },
  { timestamps: true }
);

ProjectSchema.pre('save', function (next) {
  if (this.published === undefined) {
    this.published = this.publishStatus === 'PUBLISHED';
  }

  if (this.publishStatus === 'PUBLISHED') {
    this.published = true;
    if (!this.publishedAt) this.publishedAt = new Date();
  }

  if (this.published === false && this.publishStatus === 'PUBLISHED') {
    this.publishStatus = 'DRAFT';
  }

  if (!this.featuredImage && this.coverImage) {
    this.featuredImage = this.coverImage;
  }

  if (!this.coverImage && this.featuredImage) {
    this.coverImage = this.featuredImage;
  }

  if (!this.isFeatured && this.featured) {
    this.isFeatured = this.featured;
  }

  next();
});

ProjectSchema.index({ publishStatus: 1, isDeleted: 1, isFeatured: -1, createdAt: -1 });
ProjectSchema.index({ published: 1, isDeleted: 1, createdAt: -1 });
ProjectSchema.index({ publishStatus: 1, isDeleted: 1, services: 1 });
ProjectSchema.index({ publishStatus: 1, isDeleted: 1, industry: 1 });

export const Project: Model<IProject> =
  mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema);
