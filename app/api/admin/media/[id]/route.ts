import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
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
];
const MAX_IMAGE_SIZE = 10 * 1024 * 1024;
export const runtime = 'nodejs';

interface RouteProps {
  params: { id: string };
}

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

export async function PATCH(request: NextRequest, { params }: RouteProps) {
  const authorization = await authorizeMediaManagement();
  if ('response' in authorization) return authorization.response;
  const { user } = authorization;
  if (!mongoose.isValidObjectId(params.id)) {
    return NextResponse.json({ success: false, error: { code: 'NOT_FOUND' } }, { status: 404 });
  }

  try {
    const body = await request.json();
    const updates: Record<string, string | number | boolean> = {};
    if (typeof body.title === 'string' && body.title.trim() && body.title.length <= 160) updates.title = body.title.trim();
    if (typeof body.altText === 'string' && body.altText.length <= 250) updates.altText = body.altText.trim();
    if (typeof body.caption === 'string' && body.caption.length <= 500) updates.caption = body.caption.trim();
    if (typeof body.category === 'string' && MEDIA_CATEGORIES.includes(body.category)) updates.category = body.category;
    if (Number.isInteger(body.displayOrder) && body.displayOrder >= 0 && body.displayOrder <= 10000) updates.displayOrder = body.displayOrder;
    if (typeof body.isActive === 'boolean') updates.isActive = body.isActive;
    if (typeof body.isFeatured === 'boolean') updates.isFeatured = body.isFeatured;
    if (!Object.keys(updates).length) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', message: 'No valid media changes were provided.' } },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const media = await Media.findOneAndUpdate(
      { _id: params.id, isDeleted: false },
      { $set: updates },
      { new: true, runValidators: true }
    );
    if (!media) {
      return NextResponse.json({ success: false, error: { code: 'NOT_FOUND' } }, { status: 404 });
    }

    await recordAuditLog({
      userId: user.userId,
      userEmail: user.email,
      userRole: user.role,
      action: 'UPDATE',
      entity: 'MEDIA',
      entityId: media._id.toString(),
      changesDiff: { after: updates },
    });

    return NextResponse.json({ success: true, data: { media } });
  } catch (error) {
    console.error('Failed to update media:', error);
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Could not update this media item.' } },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest, { params }: RouteProps) {
  const authorization = await authorizeMediaManagement();
  if ('response' in authorization) return authorization.response;
  const { user } = authorization;
  if (!mongoose.isValidObjectId(params.id)) {
    return NextResponse.json({ success: false, error: { code: 'NOT_FOUND' } }, { status: 404 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('image');
    if (!(file instanceof File) || !file.size) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', message: 'Select a replacement image.' } },
        { status: 400 }
      );
    }
    if (file.size > MAX_IMAGE_SIZE) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', message: 'Images must be 10 MB or smaller.' } },
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
    const media = await Media.findOneAndUpdate(
      { _id: params.id, isDeleted: false },
      {
        $set: {
          filename: uploaded.storageKey.split('/').pop(),
          originalName: file.name,
          mimeType: 'image/webp',
          fileSize: uploaded.fileSize,
          width: metadata.width,
          height: metadata.height,
          storageKey: uploaded.storageKey,
          url: uploaded.url,
          variants: [],
        },
      },
      { new: true, runValidators: true }
    );
    if (!media) {
      return NextResponse.json({ success: false, error: { code: 'NOT_FOUND' } }, { status: 404 });
    }

    await recordAuditLog({
      userId: user.userId,
      userEmail: user.email,
      userRole: user.role,
      action: 'UPDATE',
      entity: 'MEDIA',
      entityId: media._id.toString(),
      changesDiff: { after: { url: uploaded.url, originalName: file.name } },
    });

    return NextResponse.json({ success: true, data: { media } });
  } catch (error) {
    console.error('Failed to replace media image:', error);
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Could not replace this image.' } },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteProps) {
  const authorization = await authorizeMediaManagement();
  if ('response' in authorization) return authorization.response;
  const { user } = authorization;
  if (!mongoose.isValidObjectId(params.id)) {
    return NextResponse.json({ success: false, error: { code: 'NOT_FOUND' } }, { status: 404 });
  }

  try {
    await connectToDatabase();
    const media = await Media.findOneAndUpdate(
      { _id: params.id, isDeleted: false },
      { $set: { isDeleted: true, isActive: false } },
      { new: true }
    );
    if (!media) {
      return NextResponse.json({ success: false, error: { code: 'NOT_FOUND' } }, { status: 404 });
    }

    await recordAuditLog({
      userId: user.userId,
      userEmail: user.email,
      userRole: user.role,
      action: 'DELETE',
      entity: 'MEDIA',
      entityId: media._id.toString(),
    });

    return NextResponse.json({ success: true, data: { message: 'Media item removed from the public gallery.' } });
  } catch (error) {
    console.error('Failed to delete media:', error);
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Could not delete this media item.' } },
      { status: 500 }
    );
  }
}
