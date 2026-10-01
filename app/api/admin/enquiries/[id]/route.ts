import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser, checkRolePermission } from '@/lib/auth/session';
import { connectToDatabase } from '@/lib/db/mongodb';
import { Enquiry } from '@/models/Enquiry';
import { recordAuditLog } from '@/lib/audit/audit-logger';

interface RouteProps {
  params: { id: string };
}

export async function GET(req: NextRequest, { params }: RouteProps) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED' } }, { status: 401 });
  }

  try {
    await connectToDatabase();
    const enquiry = await Enquiry.findById(params.id).lean();
    if (!enquiry) {
      return NextResponse.json({ success: false, error: { code: 'NOT_FOUND' } }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: { enquiry } });
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
    const body = await req.json();
    await connectToDatabase();
    const enquiry = await Enquiry.findById(params.id);

    if (!enquiry) {
      return NextResponse.json({ success: false, error: { code: 'NOT_FOUND' } }, { status: 404 });
    }

    const previousStatus = enquiry.status;

    if (body.status) {
      enquiry.status = body.status;
    }

    if (body.note) {
      enquiry.notes.push({
        authorId: user.userId as any,
        authorName: user.name,
        note: body.note,
        createdAt: new Date(),
      });
    }

    await enquiry.save();

    await recordAuditLog({
      userId: user.userId,
      userEmail: user.email,
      userRole: user.role,
      action: 'STATUS_CHANGE',
      entity: 'ENQUIRY',
      entityId: enquiry._id.toString(),
      changesDiff: {
        status: { before: previousStatus, after: enquiry.status },
        newNote: body.note || null,
      },
    });

    return NextResponse.json({ success: true, data: { enquiry } });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: { message: err.message } }, { status: 500 });
  }
}
