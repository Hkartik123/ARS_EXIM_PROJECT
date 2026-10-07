import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser, checkRolePermission } from '@/lib/auth/session';
import { connectToDatabase } from '@/lib/db/mongodb';
import { Project } from '@/models/Project';
import { projectSchema } from '@/validators/project.schema';
import { recordAuditLog } from '@/lib/audit/audit-logger';
import { normalizeProjectPayload, normalizeProjectRecord } from '@/lib/projects/normalize';

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
    return NextResponse.json({ success: true, data: { project: normalizeProjectRecord(project) } });
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
    const normalizedBody = normalizeProjectPayload(body);
    const validated = projectSchema.partial().safeParse(normalizedBody);

    if (!validated.success) {
      return NextResponse.json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Invalid project update.', details: validated.error.flatten() } }, { status: 400 });
    }

    await connectToDatabase();
    const existing = await Project.findById(params.id);
    if (!existing || existing.isDeleted) {
      return NextResponse.json({ success: false, error: { code: 'NOT_FOUND' } }, { status: 404 });
    }

    const before = existing.toObject();
    const updates = normalizeProjectPayload({ ...existing.toObject(), ...validated.data });

    Object.assign(existing, updates);
    existing.published = existing.publishStatus === 'PUBLISHED' || Boolean(existing.published);
    if (existing.publishStatus === 'PUBLISHED' && !existing.publishedAt) {
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
      changesDiff: { before, after: normalizeProjectRecord(existing.toObject()) },
    });

    return NextResponse.json({ success: true, data: { project: normalizeProjectRecord(existing.toObject()) } });
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

    project.isDeleted = true;
    project.published = false;
    project.publishStatus = 'ARCHIVED';
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
