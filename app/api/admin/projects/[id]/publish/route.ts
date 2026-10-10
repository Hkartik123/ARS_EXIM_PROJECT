import { prisma } from '@/lib/db/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser, checkRolePermission } from '@/lib/auth/session';
import { normalizeProjectForPersistence, normalizeProjectRecord } from '@/lib/projects/normalize';
import { isValidDatabaseId } from '@/lib/db/ids';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED' } }, { status: 401 });
  }

  if (!checkRolePermission(user.role, ['SUPER_ADMIN', 'ADMIN_CONTENT'])) {
    return NextResponse.json({ success: false, error: { code: 'FORBIDDEN' } }, { status: 403 });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const shouldPublish = body.published ?? body.publishStatus === 'PUBLISHED';
    if (!isValidDatabaseId(params.id)) return NextResponse.json({ success: false, error: { code: 'NOT_FOUND' } }, { status: 404 });
    const project = await prisma.project.findUnique({ where: { id: params.id } });
    if (!project || project.isDeleted) {
      return NextResponse.json({ success: false, error: { code: 'NOT_FOUND' } }, { status: 404 });
    }

    const updatedProject = await prisma.project.update({
      where: { id: project.id },
      data: normalizeProjectForPersistence({
        ...project,
        published: Boolean(shouldPublish),
        publishStatus: shouldPublish ? 'PUBLISHED' : 'DRAFT',
        publishedAt: shouldPublish ? project.publishedAt || new Date() : null,
      }, project),
    });

    return NextResponse.json({ success: true, data: { project: normalizeProjectRecord(updatedProject) } });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: { code: 'SERVER_ERROR', message: error.message } }, { status: 500 });
  }
}
