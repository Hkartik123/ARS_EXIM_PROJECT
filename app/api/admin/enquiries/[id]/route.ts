import { prisma } from '@/lib/db/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser, checkRolePermission } from '@/lib/auth/session';
import { recordAuditLog } from '@/lib/audit/audit-logger';
import { isValidDatabaseId } from '@/lib/db/ids';
import { withLegacyId } from '@/lib/db/legacy-id';

interface RouteProps {
  params: { id: string };
}

export async function GET(req: NextRequest, { params }: RouteProps) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED' } }, { status: 401 });
  }

  try {
    if (!isValidDatabaseId(params.id)) {
      return NextResponse.json({ success: false, error: { code: 'NOT_FOUND' } }, { status: 404 });
    }
    const enquiry = await prisma.enquiry.findUnique({
      where: { id: params.id },
      include: { notes: { select: { authorId: true, authorName: true, note: true, createdAt: true } } },
    });
    if (!enquiry) {
      return NextResponse.json({ success: false, error: { code: 'NOT_FOUND' } }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: { enquiry: withLegacyId(enquiry) } });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: { message: err.message } }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: RouteProps) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED' } }, { status: 401 });
  }

  if (!checkRolePermission(user.role, ['SUPER_ADMIN', 'SALES_BD'])) {
    return NextResponse.json({ success: false, error: { code: 'FORBIDDEN' } }, { status: 403 });
  }

  try {
    if (!isValidDatabaseId(params.id)) {
      return NextResponse.json({ success: false, error: { code: 'NOT_FOUND' } }, { status: 404 });
    }
    const body = await req.json();
    const enquiry = await prisma.enquiry.findUnique({
      where: { id: params.id },
      include: { notes: { select: { authorId: true, authorName: true, note: true, createdAt: true } } },
    });

    if (!enquiry) {
      return NextResponse.json({ success: false, error: { code: 'NOT_FOUND' } }, { status: 404 });
    }

    const previousStatus = enquiry.status;

    const validStatuses = ['NEW', 'CONTACTED', 'UNDER_REVIEW', 'CLOSED', 'SPAM', 'ARCHIVED'];
    if (body.status && !validStatuses.includes(body.status)) {
      return NextResponse.json({ success: false, error: { code: 'VALIDATION_ERROR' } }, { status: 400 });
    }

    const updatedEnquiry = await prisma.enquiry.update({
      where: { id: enquiry.id },
      data: {
        ...(body.status ? { status: body.status } : {}),
        ...(body.note
          ? { notes: { create: { authorId: user.userId, authorName: user.name, note: body.note } } }
          : {}),
      },
      include: { notes: { select: { authorId: true, authorName: true, note: true, createdAt: true } } },
    });

    await recordAuditLog({
      userId: user.userId,
      userEmail: user.email,
      userRole: user.role,
      action: 'STATUS_CHANGE',
      entity: 'ENQUIRY',
      entityId: enquiry.id,
      changesDiff: {
        status: { before: previousStatus, after: updatedEnquiry.status },
        newNote: body.note || null,
      },
    });

    return NextResponse.json({ success: true, data: { enquiry: withLegacyId(updatedEnquiry) } });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: { message: err.message } }, { status: 500 });
  }
}
