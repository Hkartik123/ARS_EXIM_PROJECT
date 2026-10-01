import { NextRequest, NextResponse } from 'next/server';
import { SESSION_COOKIE_OPTIONS, getCurrentUser } from '@/lib/auth/session';
import { recordAuditLog } from '@/lib/audit/audit-logger';

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();

  if (user) {
    await recordAuditLog({
      userId: user.userId,
      userEmail: user.email,
      userRole: user.role,
      action: 'LOGOUT',
      entity: 'USER',
      entityId: user.userId,
      ipAddress: req.headers.get('x-forwarded-for') || '127.0.0.1',
    });
  }

  const response = NextResponse.json({
    success: true,
    data: { message: 'Logged out successfully.' },
  });

  response.cookies.set({
    ...SESSION_COOKIE_OPTIONS,
    value: '',
    maxAge: 0,
  });

  return response;
}
