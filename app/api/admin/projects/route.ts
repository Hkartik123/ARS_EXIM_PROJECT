import { prisma } from '@/lib/db/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser, checkRolePermission } from '@/lib/auth/session';
import { projectSchema } from '@/validators/project.schema';
import { recordAuditLog } from '@/lib/audit/audit-logger';
import { normalizeProjectForPersistence, normalizeProjectPayload, normalizeProjectRecord } from '@/lib/projects/normalize';

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json(
      { success: false, error: { code: 'UNAUTHORIZED', message: 'Authentication required.' } },
      { status: 401 }
    );
  }

  try {
    const projects = await prisma.project.findMany({
      where: { isDeleted: false },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ success: true, data: { projects: projects.map(normalizeProjectRecord) } });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: err.message } },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json(
      { success: false, error: { code: 'UNAUTHORIZED', message: 'Authentication required.' } },
      { status: 401 }
    );
  }

  if (!checkRolePermission(user.role, ['SUPER_ADMIN', 'ADMIN_CONTENT'])) {
    return NextResponse.json(
      { success: false, error: { code: 'FORBIDDEN', message: 'Insufficient role permissions.' } },
      { status: 403 }
    );
  }

  try {
    const body = await req.json();
    const normalizedBody = normalizeProjectPayload(body);
    const validated = projectSchema.safeParse(normalizedBody);

    if (!validated.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid project fields.',
            details: validated.error.flatten(),
          },
        },
        { status: 400 }
      );
    }
    const normalized = normalizeProjectForPersistence(validated.data);
    const existing = await prisma.project.findFirst({ where: { slug: normalized.slug, isDeleted: false } });
    if (existing) {
      return NextResponse.json(
        { success: false, error: { code: 'CONFLICT', message: 'A project with this slug already exists.' } },
        { status: 409 }
      );
    }

    const project = await prisma.project.create({
      data: normalized,
    });

    await recordAuditLog({
      userId: user.userId,
      userEmail: user.email,
      userRole: user.role,
      action: 'CREATE',
      entity: 'PROJECT',
      entityId: project.id,
      changesDiff: { after: normalizeProjectRecord(project) },
    });

    return NextResponse.json({ success: true, data: { project: normalizeProjectRecord(project) } }, { status: 201 });
  } catch (err: any) {
    console.error('Project create error:', err);
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: err.message } },
      { status: 500 }
    );
  }
}
