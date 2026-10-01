import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

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

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB per file

export class StorageService {
  private localUploadDir: string;

  constructor() {
    this.localUploadDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(this.localUploadDir)) {
      fs.mkdirSync(this.localUploadDir, { recursive: true });
    }
  }

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

    // Check for dangerous extensions
    const ext = path.extname(file.name).toLowerCase();
    const bannedExts = ['.exe', '.js', '.bat', '.cmd', '.sh', '.zip', '.tar', '.docm', '.xlsm', '.vbs'];
    if (bannedExts.includes(ext)) {
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
    const ext = path.extname(originalName).toLowerCase() || '.bin';
    const randomName = `${crypto.randomUUID()}${ext}`;
    const storageKey = `${folder}/${randomName}`;

    const targetFolder = path.join(this.localUploadDir, folder);
    if (!fs.existsSync(targetFolder)) {
      fs.mkdirSync(targetFolder, { recursive: true });
    }

    const filePath = path.join(targetFolder, randomName);
    await fs.promises.writeFile(filePath, buffer);

    const publicUrl = `/uploads/${folder}/${randomName}`;

    return {
      storageKey,
      url: publicUrl,
      originalName,
      fileSize: buffer.length,
      mimeType,
    };
  }

  getSignedDownloadUrl(storageKey: string): string {
    // In local dev, maps to public upload path
    return `/uploads/${storageKey}`;
  }
}

export const storageService = new StorageService();
