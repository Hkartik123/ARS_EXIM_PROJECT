import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IFaq extends Document {
  question: string;
  answer: string;
  category: 'General' | 'Industrial Insulation' | 'Passive Fire Protection' | 'Scaffolding' | 'Safety & HSE';
  pageAssignment?: string;
  order: number;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const FaqSchema = new Schema<IFaq>(
  {
    question: { type: String, required: true, trim: true },
    answer: { type: String, required: true },
    category: {
      type: String,
      required: true,
      enum: ['General', 'Industrial Insulation', 'Passive Fire Protection', 'Scaffolding', 'Safety & HSE'],
      default: 'General',
      index: true,
    },
    pageAssignment: { type: String },
    order: { type: Number, default: 0, index: true },
    isPublished: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

export const Faq: Model<IFaq> =
  mongoose.models.Faq || mongoose.model<IFaq>('Faq', FaqSchema);
