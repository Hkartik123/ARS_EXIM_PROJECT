import { prisma } from '@/lib/db/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser, checkRolePermission } from '@/lib/auth/session';
import { siteSettingSchema } from '@/validators/settings.schema';
import { recordAuditLog } from '@/lib/audit/audit-logger';

export async function GET() {
  try {
    const settings = await prisma.siteSetting.findFirst();
    return NextResponse.json({ success: true, data: { settings } });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: { message: err.message } }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED' } }, { status: 401 });
  }

  if (!checkRolePermission(user.role, ['SUPER_ADMIN'])) {
    return NextResponse.json({ success: false, error: { code: 'FORBIDDEN' } }, { status: 403 });
  }

  try {
    const body = await req.json();
    const validated = siteSettingSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', details: validated.error.flatten() } },
        { status: 400 }
      );
    }
    const currentSettings = await prisma.siteSetting.findFirst();
    const settings = currentSettings
      ? await prisma.siteSetting.update({
          where: { id: currentSettings.id },
          data: validated.data as any,
        })
      : await prisma.siteSetting.create({ data: validated.data as any });

    await recordAuditLog({
      userId: user.userId,
      userEmail: user.email,
      userRole: user.role,
      action: 'UPDATE',
      entity: 'SETTING',
      changesDiff: { after: validated.data },
    });

    return NextResponse.json({ success: true, data: { settings } });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: { message: err.message } }, { status: 500 });
  }
}
