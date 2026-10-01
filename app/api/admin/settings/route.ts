import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser, checkRolePermission } from '@/lib/auth/session';
import { connectToDatabase } from '@/lib/db/mongodb';
import { SiteSetting } from '@/models/SiteSetting';
import { siteSettingSchema } from '@/validators/settings.schema';
import { recordAuditLog } from '@/lib/audit/audit-logger';

export async function GET() {
  try {
    await connectToDatabase();
    const settings = await SiteSetting.findOne().lean();
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

    await connectToDatabase();
    let settings = await SiteSetting.findOne();
    if (!settings) {
      settings = new SiteSetting(validated.data);
    } else {
      Object.assign(settings, validated.data);
    }
    await settings.save();

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
