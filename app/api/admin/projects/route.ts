import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser, checkRolePermission } from '@/lib/auth/session';
import { connectToDatabase } from '@/lib/db/mongodb';
import { Project } from '@/models/Project';
import { projectSchema } from '@/validators/project.schema';
import { recordAuditLog } from '@/lib/audit/audit-logger';

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json(
      { success: false, error: { code: 'UNAUTHORIZED', message: 'Authentication required.' } },
      { status: 401 }
    );
  }

  try {
    await connectToDatabase();
    const projects = await Project.find({ isDeleted: false }).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ success: true, data: { projects } });
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
    const validated = projectSchema.safeParse(body);

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

    await connectToDatabase();

    const existing = await Project.findOne({ slug: validated.data.slug });
    if (existing) {
      return NextResponse.json(
        { success: false, error: { code: 'CONFLICT', message: 'A project with this slug already exists.' } },
        { status: 409 }
      );
    }

    const project = await Project.create({
      ...validated.data,
      publishedAt: validated.data.publishStatus === 'PUBLISHED' ? new Date() : undefined,
    });

    await recordAuditLog({
      userId: user.userId,
      userEmail: user.email,
      userRole: user.role,
      action: 'CREATE',
      entity: 'PROJECT',
      entityId: project._id.toString(),
      changesDiff: { after: validated.data },
    });

    return NextResponse.json({ success: true, data: { project } }, { status: 201 });
  } catch (err: any) {
    console.error('Project create error:', err);
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: err.message } },
      { status: 500 }
    );
  }
}
