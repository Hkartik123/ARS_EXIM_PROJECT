import { prisma } from '@/lib/db/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser, checkRolePermission } from '@/lib/auth/session';
import { projectSchema } from '@/validators/project.schema';
import { recordAuditLog } from '@/lib/audit/audit-logger';
import { normalizeProjectPayload, normalizeProjectRecord } from '@/lib/projects/normalize';
import { normalizeProjectForPersistence } from '@/lib/projects/normalize';
import { isValidDatabaseId } from '@/lib/db/ids';

interface RouteProps {
  params: { id: string };
}

export async function GET(req: NextRequest, { params }: RouteProps) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED' } }, { status: 401 });
  }

  try {
    if (!isValidDatabaseId(params.id)) return NextResponse.json({ success: false, error: { code: 'NOT_FOUND' } }, { status: 404 });
    const project = await prisma.project.findUnique({ where: { id: params.id } });
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
    if (!isValidDatabaseId(params.id)) return NextResponse.json({ success: false, error: { code: 'NOT_FOUND' } }, { status: 404 });
    const existing = await prisma.project.findUnique({ where: { id: params.id } });
    if (!existing || existing.isDeleted) {
      return NextResponse.json({ success: false, error: { code: 'NOT_FOUND' } }, { status: 404 });
    }

    const before = existing;
    const updates = normalizeProjectForPersistence(validated.data, existing);
    const updatedProject = await prisma.project.update({
      where: { id: existing.id },
      data: updates,
    });

    await recordAuditLog({
      userId: user.userId,
      userEmail: user.email,
      userRole: user.role,
      action: 'UPDATE',
      entity: 'PROJECT',
      entityId: existing.id,
      changesDiff: { before, after: normalizeProjectRecord(updatedProject) },
    });

    return NextResponse.json({ success: true, data: { project: normalizeProjectRecord(updatedProject) } });
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
    if (!isValidDatabaseId(params.id)) return NextResponse.json({ success: false, error: { code: 'NOT_FOUND' } }, { status: 404 });
    const project = await prisma.project.findUnique({ where: { id: params.id } });
    if (!project) {
      return NextResponse.json({ success: false, error: { code: 'NOT_FOUND' } }, { status: 404 });
    }

    await prisma.project.update({
      where: { id: project.id },
      data: { isDeleted: true, published: false, publishStatus: 'ARCHIVED' },
    });

    await recordAuditLog({
      userId: user.userId,
      userEmail: user.email,
      userRole: user.role,
      action: 'DELETE',
      entity: 'PROJECT',
      entityId: project.id,
    });

    return NextResponse.json({ success: true, data: { message: 'Project soft-deleted successfully.' } });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: { message: err.message } }, { status: 500 });
  }
}
