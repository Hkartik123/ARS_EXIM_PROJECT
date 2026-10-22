import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

export interface UploadResult {
  storageKey: string;
  url: string;
  originalName: string;
  fileSize: number;
  mimeType: string;
}

const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'image/jpeg',
  'image/png',
  'image/webp',
];

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const MIME_TYPES_BY_EXTENSION: Record<string, string> = {
  '.doc': 'application/msword',
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.pdf': 'application/pdf',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.xls': 'application/vnd.ms-excel',
  '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
};

type S3Configuration = {
  client: S3Client;
  bucket: string;
  publicUrl?: string;
};

export class StorageConfigurationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'StorageConfigurationError';
  }
}

export class StorageService {
  private localUploadDir = path.join(process.cwd(), 'public', 'uploads');
  private client: S3Client | null = null;

  validateFile(file: { size: number; type: string; name: string }): { valid: boolean; error?: string } {
    if (file.size > MAX_FILE_SIZE) {
      return { valid: false, error: `File "${file.name}" exceeds maximum allowed size of 10MB.` };
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type.toLowerCase())) {
      return {
        valid: false,
        error: `File type "${file.type}" is not permitted. Only PDF, DOC, DOCX, XLS, XLSX, JPG, PNG are allowed.`,
      };
    }

    const ext = path.extname(file.name).toLowerCase();
    const bannedExt = ['.exe', '.js', '.bat', '.cmd', '.sh', '.zip', '.tar', '.docm', '.xlsm', '.vbs'];
    if (bannedExt.includes(ext)) {
      return { valid: false, error: `Extension "${ext}" is strictly forbidden for security reasons.` };
    }

    return { valid: true };
  }

  async uploadBuffer(
    buffer: Buffer,
    originalName: string,
    mimeType: string,
    folder: string = 'enquiries'
  ): Promise<UploadResult> {
    if (!/^[a-z0-9-]+$/.test(folder)) {
      throw new Error('Invalid storage folder.');
    }

    const ext = path.extname(originalName).toLowerCase() || '.bin';
    const randomName = `${crypto.randomUUID()}${ext}`;
    const storageKey = `${folder}/${randomName}`;
    const provider = this.getProvider();

    if (provider === 'local') {
      const targetFolder = path.join(this.localUploadDir, folder);
      await fs.promises.mkdir(targetFolder, { recursive: true });
      await fs.promises.writeFile(path.join(targetFolder, randomName), buffer);
      return {
        storageKey,
        url: folder === 'gallery' ? `/uploads/${storageKey}` : this.getAdminDownloadUrl(storageKey),
        originalName,
        fileSize: buffer.length,
        mimeType,
      };
    }

    const config = this.getS3Configuration(folder === 'gallery');
    await config.client.send(
      new PutObjectCommand({
        Bucket: config.bucket,
        Key: storageKey,
        Body: buffer,
        ContentLength: buffer.length,
        ContentType: mimeType,
        CacheControl: folder === 'gallery' ? 'public, max-age=31536000, immutable' : 'private, no-store',
      })
    );

    return {
      storageKey,
      url: folder === 'gallery'
        ? `${config.publicUrl}/${storageKey.split('/').map(encodeURIComponent).join('/')}`
        : this.getAdminDownloadUrl(storageKey),
      originalName,
      fileSize: buffer.length,
      mimeType,
    };
  }

  async downloadBuffer(storageKey: string): Promise<{ buffer: Buffer; contentType: string }> {
    if (!this.isSafeStorageKey(storageKey)) {
      throw new Error('Invalid storage key.');
    }

    if (this.getProvider() === 'local') {
      const filePath = path.resolve(this.localUploadDir, storageKey);
      const relativePath = path.relative(this.localUploadDir, filePath);
      if (relativePath.startsWith('..') || path.isAbsolute(relativePath)) {
        throw new Error('Invalid storage key.');
      }
      return {
        buffer: await fs.promises.readFile(filePath),
        contentType: MIME_TYPES_BY_EXTENSION[path.extname(filePath).toLowerCase()] || 'application/octet-stream',
      };
    }

    const { client, bucket } = this.getS3Configuration();
    const result = await client.send(new GetObjectCommand({ Bucket: bucket, Key: storageKey }));
    if (!result.Body) {
      throw new Error('Stored file has no content.');
    }
    const bytes = await result.Body.transformToByteArray();
    return {
      buffer: Buffer.from(bytes),
      contentType: result.ContentType || MIME_TYPES_BY_EXTENSION[path.extname(storageKey).toLowerCase()] || 'application/octet-stream',
    };
  }

  getAdminDownloadUrl(storageKey: string): string {
    return `/api/admin/storage/download?key=${encodeURIComponent(storageKey)}`;
  }

  private getProvider(): 'local' | 's3' | 'r2' {
    const provider = (process.env.STORAGE_PROVIDER || '').toLowerCase();
    if (provider === 's3' || provider === 'r2') return provider;
    if (provider === 'local' && process.env.NODE_ENV !== 'production') return 'local';
    if (!provider && process.env.NODE_ENV !== 'production') return 'local';
    throw new StorageConfigurationError(
      'Persistent file storage is not configured. Set STORAGE_PROVIDER to s3 or r2 and configure its bucket credentials.'
    );
  }

  private getS3Configuration(requirePublicUrl = false): S3Configuration {
    const provider = (process.env.STORAGE_PROVIDER || '').toLowerCase();
    const bucket = process.env.S3_BUCKET;
    const accessKeyId = process.env.S3_ACCESS_KEY_ID;
    const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY;
    const endpoint = process.env.S3_ENDPOINT;
    const region = process.env.S3_REGION || (provider === 'r2' ? 'auto' : '');
    const publicUrl = process.env.S3_PUBLIC_URL?.replace(/\/+$/, '');

    if (!bucket || !accessKeyId || !secretAccessKey || !region || (provider === 'r2' && !endpoint)) {
      throw new StorageConfigurationError(
        'S3 storage configuration is incomplete. Check S3_BUCKET, S3_REGION, S3_ENDPOINT, and S3 credentials.'
      );
    }
    if (requirePublicUrl && !publicUrl) {
      throw new StorageConfigurationError('S3_PUBLIC_URL must point to the public read-only domain for gallery images.');
    }

    if (!this.client) {
      this.client = new S3Client({
        region,
        endpoint,
        forcePathStyle: provider === 'r2',
        credentials: { accessKeyId, secretAccessKey },
      });
    }

    return { client: this.client, bucket, publicUrl };
  }

  private isSafeStorageKey(storageKey: string): boolean {
    return /^(resumes|quotes)\/[a-f0-9-]+\.[a-z0-9]+$/i.test(storageKey);
  }
}

export const storageService = new StorageService();
