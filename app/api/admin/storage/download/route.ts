import { NextRequest, NextResponse } from 'next/server';
import { checkRolePermission, getCurrentUser } from '@/lib/auth/session';
import { storageService } from '@/lib/storage/storage-service';
import type { UserRole } from '@/models/User';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json(
      { success: false, error: { code: 'UNAUTHORIZED', message: 'Authentication required.' } },
      { status: 401 }
    );
  }

  const storageKey = request.nextUrl.searchParams.get('key') || '';
  const folder = storageKey.split('/')[0];
  const allowedRoles: UserRole[] =
    folder === 'resumes'
      ? ['SUPER_ADMIN', 'HR']
      : folder === 'quotes'
        ? ['SUPER_ADMIN', 'SALES_BD']
        : [];

  if (!allowedRoles.length || !checkRolePermission(user.role, allowedRoles)) {
    return NextResponse.json(
      { success: false, error: { code: 'NOT_FOUND', message: 'The requested file was not found.' } },
      { status: 404 }
    );
  }

  try {
    const file = await storageService.downloadBuffer(storageKey);
    const filename = storageKey.split('/').pop() || 'download';
    return new NextResponse(new Uint8Array(file.buffer), {
      headers: {
        'Content-Type': file.contentType,
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'private, no-store',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (error) {
    console.error('Failed to download admin file:', {
      errorName: error instanceof Error ? error.name : 'UnknownError',
    });
    return NextResponse.json(
      { success: false, error: { code: 'NOT_FOUND', message: 'The requested file was not found.' } },
      { status: 404 }
    );
  }
}
