import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IMediaVariant {
  width: number;
  format: 'webp' | 'avif' | 'jpeg';
  url: string;
  storageKey: string;
  fileSize: number;
}

export interface IMedia extends Document {
  filename: string;
  originalName: string;
  mimeType: string;
  fileSize: number;
  width?: number;
  height?: number;
  storageKey: string;
  url: string;
  blurDataUrl?: string;
  altText: string;
  caption?: string;
  variants: IMediaVariant[];
  uploadedBy: mongoose.Types.ObjectId;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const MediaSchema = new Schema<IMedia>(
  {
    filename: { type: String, required: true },
    originalName: { type: String, required: true },
    mimeType: { type: String, required: true },
    fileSize: { type: Number, required: true },
    width: { type: Number },
    height: { type: Number },
    storageKey: { type: String, required: true, unique: true },
    url: { type: String, required: true },
    blurDataUrl: { type: String },
    altText: { type: String, default: '' },
    caption: { type: String },
    variants: [
      {
        width: { type: Number, required: true },
        format: { type: String, required: true },
        url: { type: String, required: true },
        storageKey: { type: String, required: true },
        fileSize: { type: Number, required: true },
      },
    ],
    uploadedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    isDeleted: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

export const Media: Model<IMedia> =
  mongoose.models.Media || mongoose.model<IMedia>('Media', MediaSchema);
