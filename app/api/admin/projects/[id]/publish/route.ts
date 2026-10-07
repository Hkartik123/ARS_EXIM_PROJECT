import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser, checkRolePermission } from '@/lib/auth/session';
import { connectToDatabase } from '@/lib/db/mongodb';
import { Project } from '@/models/Project';
import { normalizeProjectRecord } from '@/lib/projects/normalize';

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

    await connectToDatabase();
    const project = await Project.findById(params.id);
    if (!project || project.isDeleted) {
      return NextResponse.json({ success: false, error: { code: 'NOT_FOUND' } }, { status: 404 });
    }

    project.published = Boolean(shouldPublish);
    project.publishStatus = shouldPublish ? 'PUBLISHED' : 'DRAFT';
    project.publishedAt = shouldPublish ? project.publishedAt || new Date() : undefined;
    await project.save();

    return NextResponse.json({ success: true, data: { project: normalizeProjectRecord(project.toObject()) } });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: { code: 'SERVER_ERROR', message: error.message } }, { status: 500 });
  }
}
