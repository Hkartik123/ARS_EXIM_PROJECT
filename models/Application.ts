import mongoose, { Schema, Document, Model } from 'mongoose';

export type ApplicationStatus = 'SUBMITTED' | 'REVIEWING' | 'SHORTLISTED' | 'REJECTED' | 'HIRED';

export interface IApplication extends Document {
  jobId?: mongoose.Types.ObjectId;
  jobTitle: string;
  candidateName: string;
  email: string;
  phone: string;
  currentLocation: string;
  yearsOfExperience: number;
  resumeStorageKey: string;
  resumeOriginalName: string;
  coverLetter?: string;
  status: ApplicationStatus;
  internalNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ApplicationSchema = new Schema<IApplication>(
  {
    jobId: { type: Schema.Types.ObjectId, ref: 'Career' },
    jobTitle: { type: String, required: true },
    candidateName: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true, index: true },
    phone: { type: String, required: true, trim: true },
    currentLocation: { type: String, required: true },
    yearsOfExperience: { type: Number, required: true },
    resumeStorageKey: { type: String, required: true },
    resumeOriginalName: { type: String, required: true },
    coverLetter: { type: String },
    status: {
      type: String,
      enum: ['SUBMITTED', 'REVIEWING', 'SHORTLISTED', 'REJECTED', 'HIRED'],
      default: 'SUBMITTED',
      index: true,
    },
    internalNotes: { type: String },
  },
  { timestamps: true }
);

export const Application: Model<IApplication> =
  mongoose.models.Application || mongoose.model<IApplication>('Application', ApplicationSchema);
