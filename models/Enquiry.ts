import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IEnquiryFile {
  originalName: string;
  storageKey: string;
  fileSize: number;
  mimeType: string;
}

export interface IEnquiryNote {
  authorId: mongoose.Types.ObjectId;
  authorName: string;
  note: string;
  createdAt: Date;
}

export type EnquiryStatus = 'NEW' | 'CONTACTED' | 'UNDER_REVIEW' | 'CLOSED' | 'SPAM' | 'ARCHIVED';
export type EnquiryType = 'QUOTE' | 'CONTACT';

export interface IEnquiry extends Document {
  referenceNumber: string;
  type: EnquiryType;
  status: EnquiryStatus;
  name: string;
  company: string;
  email: string;
  phone: string;
  country: string;
  projectName?: string;
  projectType?: string;
  industry?: string;
  location?: string;
  requiredServices?: string[];
  expectedStartDate?: string;
  projectDuration?: string;
  scopeDescription: string;
  attachments: IEnquiryFile[];
  notes: IEnquiryNote[];
  ipAddress: string;
  userAgent?: string;
  emailDispatched: boolean;
  emailDispatchError?: string;
  createdAt: Date;
  updatedAt: Date;
}

const EnquirySchema = new Schema<IEnquiry>(
  {
    referenceNumber: { type: String, required: true, unique: true, index: true },
    type: { type: String, enum: ['QUOTE', 'CONTACT'], required: true, index: true },
    status: {
      type: String,
      enum: ['NEW', 'CONTACTED', 'UNDER_REVIEW', 'CLOSED', 'SPAM', 'ARCHIVED'],
      default: 'NEW',
      index: true,
    },
    name: { type: String, required: true, trim: true },
    company: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true, index: true },
    phone: { type: String, required: true, trim: true },
    country: { type: String, required: true, trim: true },
    projectName: { type: String, trim: true },
    projectType: { type: String, trim: true },
    industry: { type: String, trim: true },
    location: { type: String, trim: true },
    requiredServices: [{ type: String }],
    expectedStartDate: { type: String },
    projectDuration: { type: String },
    scopeDescription: { type: String, required: true },
    attachments: [
      {
        originalName: { type: String, required: true },
        storageKey: { type: String, required: true },
        fileSize: { type: Number, required: true },
        mimeType: { type: String, required: true },
      },
    ],
    notes: [
      {
        authorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        authorName: { type: String, required: true },
        note: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    ipAddress: { type: String, required: true },
    userAgent: { type: String },
    emailDispatched: { type: Boolean, default: false },
    emailDispatchError: { type: String },
  },
  { timestamps: true }
);

EnquirySchema.index({ createdAt: -1, status: 1 });

export const Enquiry: Model<IEnquiry> =
  mongoose.models.Enquiry || mongoose.model<IEnquiry>('Enquiry', EnquirySchema);
