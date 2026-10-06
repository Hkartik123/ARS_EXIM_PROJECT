import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';
import { getCurrentUser, checkRolePermission } from '@/lib/auth/session';
import { connectToDatabase } from '@/lib/db/mongodb';
import { Media } from '@/models/Media';
import { storageService } from '@/lib/storage/storage-service';
import { recordAuditLog } from '@/lib/audit/audit-logger';

const MEDIA_CATEGORIES = [
  'Insulation',
  'Scaffolding',
  'Coating & Painting',
  'Skilled Manpower',
  'Projects',
  'Industrial Sites',
  'Workforce',
  'Equipment',
  'General',
] as const;

const MAX_IMAGE_SIZE = 10 * 1024 * 1024;
export const runtime = 'nodejs';

async function authorizeMediaManagement() {
  const user = await getCurrentUser();
  if (!user) {
    return { response: NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED' } }, { status: 401 }) };
  }
  if (!checkRolePermission(user.role, ['SUPER_ADMIN', 'ADMIN_CONTENT'])) {
    return { response: NextResponse.json({ success: false, error: { code: 'FORBIDDEN' } }, { status: 403 }) };
  }
  return { user };
}

export async function GET() {
  const authorization = await authorizeMediaManagement();
  if ('response' in authorization) return authorization.response;

  try {
    await connectToDatabase();
    const media = await Media.find({ isDeleted: false })
      .sort({ displayOrder: 1, createdAt: -1 })
      .lean();
    return NextResponse.json({ success: true, data: { media } });
  } catch (error) {
    console.error('Failed to load media library:', error);
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Could not load the media library.' } },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const authorization = await authorizeMediaManagement();
  if ('response' in authorization) return authorization.response;
  const { user } = authorization;

  try {
    const formData = await request.formData();
    const file = formData.get('image');
    const title = String(formData.get('title') || '').trim();
    const altText = String(formData.get('altText') || '').trim();
    const caption = String(formData.get('caption') || '').trim();
    const category = String(formData.get('category') || 'General');
    const displayOrder = Number(formData.get('displayOrder') || 0);

    if (!(file instanceof File) || !file.size) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', message: 'Select an image to upload.' } },
        { status: 400 }
      );
    }
    if (file.size > MAX_IMAGE_SIZE) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', message: 'Images must be 10 MB or smaller.' } },
        { status: 400 }
      );
    }
    if (!title || title.length > 160 || altText.length > 250 || caption.length > 500) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', message: 'Enter a title (160 characters max), alt text (250 characters max), and optional description (500 characters max).' } },
        { status: 400 }
      );
    }
    if (!MEDIA_CATEGORIES.includes(category as (typeof MEDIA_CATEGORIES)[number])) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', message: 'Select a valid image category.' } },
        { status: 400 }
      );
    }
    if (!Number.isInteger(displayOrder) || displayOrder < 0 || displayOrder > 10000) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', message: 'Display order must be a whole number between 0 and 10000.' } },
        { status: 400 }
      );
    }

    const input = Buffer.from(await file.arrayBuffer());
    const image = sharp(input, { limitInputPixels: 40_000_000 });
    const metadata = await image.metadata();
    if (!metadata.width || !metadata.height || !['jpeg', 'png', 'webp', 'avif'].includes(metadata.format || '')) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', message: 'Upload a valid JPEG, PNG, WebP or AVIF image.' } },
        { status: 400 }
      );
    }

    const optimizedImage = await image.rotate().resize({ width: 2000, height: 2000, fit: 'inside', withoutEnlargement: true }).webp({ quality: 82 }).toBuffer();
    const uploaded = await storageService.uploadBuffer(optimizedImage, `${Date.now()}.webp`, 'image/webp', 'gallery');
    await connectToDatabase();
    const media = await Media.create({
      filename: uploaded.storageKey.split('/').pop(),
      originalName: file.name,
      mimeType: 'image/webp',
      fileSize: uploaded.fileSize,
      width: metadata.width,
      height: metadata.height,
      storageKey: uploaded.storageKey,
      url: uploaded.url,
      altText,
      caption,
      title,
      category,
      displayOrder,
      isActive: false,
      uploadedBy: user.userId,
      variants: [],
    });

    await recordAuditLog({
      userId: user.userId,
      userEmail: user.email,
      userRole: user.role,
      action: 'CREATE',
      entity: 'MEDIA',
      entityId: media._id.toString(),
      changesDiff: { after: { title, category, url: uploaded.url } },
    });

    return NextResponse.json({ success: true, data: { media } }, { status: 201 });
  } catch (error) {
    console.error('Failed to upload media:', error);
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Could not upload this image.' } },
      { status: 500 }
    );
  }
}
