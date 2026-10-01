import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser, checkRolePermission } from '@/lib/auth/session';
import { connectToDatabase } from '@/lib/db/mongodb';
import { Project } from '@/models/Project';
import { projectSchema } from '@/validators/project.schema';
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
    const project = await Project.findById(params.id).lean();
    if (!project || project.isDeleted) {
      return NextResponse.json({ success: false, error: { code: 'NOT_FOUND' } }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: { project } });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: { message: err.message } }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: RouteProps) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED' } }, { status: 401 });
  }

  if (!checkRolePermission(user.role, ['SUPER_ADMIN', 'ADMIN_CONTENT'])) {
    return NextResponse.json({ success: false, error: { code: 'FORBIDDEN' } }, { status: 403 });
  }

  try {
    const body = await req.json();
    await connectToDatabase();
    const existing = await Project.findById(params.id);
    if (!existing || existing.isDeleted) {
      return NextResponse.json({ success: false, error: { code: 'NOT_FOUND' } }, { status: 404 });
    }

    const before = existing.toObject();
    Object.assign(existing, body);

    if (body.publishStatus === 'PUBLISHED' && !existing.publishedAt) {
      existing.publishedAt = new Date();
    }

    await existing.save();

    await recordAuditLog({
      userId: user.userId,
      userEmail: user.email,
      userRole: user.role,
      action: 'UPDATE',
      entity: 'PROJECT',
      entityId: existing._id.toString(),
      changesDiff: { before, after: body },
    });

    return NextResponse.json({ success: true, data: { project: existing } });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: { message: err.message } }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: RouteProps) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED' } }, { status: 401 });
  }

  if (!checkRolePermission(user.role, ['SUPER_ADMIN'])) {
    return NextResponse.json({ success: false, error: { code: 'FORBIDDEN' } }, { status: 403 });
  }

  try {
    await connectToDatabase();
    const project = await Project.findById(params.id);
    if (!project) {
      return NextResponse.json({ success: false, error: { code: 'NOT_FOUND' } }, { status: 404 });
    }

    // Soft delete
    project.isDeleted = true;
    await project.save();

    await recordAuditLog({
      userId: user.userId,
      userEmail: user.email,
      userRole: user.role,
      action: 'DELETE',
      entity: 'PROJECT',
      entityId: project._id.toString(),
    });

    return NextResponse.json({ success: true, data: { message: 'Project soft-deleted successfully.' } });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: { message: err.message } }, { status: 500 });
  }
}
