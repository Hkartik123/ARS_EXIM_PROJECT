import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICareer extends Document {
  slug: string;
  title: string;
  department: string;
  location: string;
  employmentType: 'Full-time' | 'Contract' | 'Rotational';
  experienceRequired: string;
  overview: string;
  responsibilities: string[];
  requirements: string[];
  closingDate?: Date;
  isOpen: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CareerSchema = new Schema<ICareer>(
  {
    slug: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true, trim: true },
    department: { type: String, required: true, index: true },
    location: { type: String, required: true },
    employmentType: {
      type: String,
      required: true,
      enum: ['Full-time', 'Contract', 'Rotational'],
      default: 'Full-time',
    },
    experienceRequired: { type: String, required: true },
    overview: { type: String, required: true },
    responsibilities: [{ type: String, required: true }],
    requirements: [{ type: String, required: true }],
    closingDate: { type: Date },
    isOpen: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

export const Career: Model<ICareer> =
  mongoose.models.Career || mongoose.model<ICareer>('Career', CareerSchema);
