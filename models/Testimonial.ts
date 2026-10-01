import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ITestimonial extends Document {
  clientName: string;
  clientTitle: string;
  companyName: string;
  quote: string;
  projectSlug?: string;
  permissionConfirmed: boolean; // MANDATORY: PRD requires permission_confirmed=true before publishing
  isPublished: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const TestimonialSchema = new Schema<ITestimonial>(
  {
    clientName: { type: String, required: true, trim: true },
    clientTitle: { type: String, required: true, trim: true },
    companyName: { type: String, required: true, trim: true },
    quote: { type: String, required: true },
    projectSlug: { type: String },
    permissionConfirmed: { type: Boolean, required: true, default: false },
    isPublished: { type: Boolean, default: false, index: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Testimonial: Model<ITestimonial> =
  mongoose.models.Testimonial || mongoose.model<ITestimonial>('Testimonial', TestimonialSchema);
