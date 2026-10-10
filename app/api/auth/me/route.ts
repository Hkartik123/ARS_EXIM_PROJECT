import { prisma } from '@/lib/db/prisma';
import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';

export async function GET() {
  const session = await getCurrentUser();

  if (!session) {
    return NextResponse.json(
      { success: false, error: { code: 'UNAUTHORIZED', message: 'No active session.' } },
      { status: 401 }
    );
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      omit: { passwordHash: true },
    });

    if (!user || !user.isActive) {
      return NextResponse.json(
        { success: false, error: { code: 'FORBIDDEN', message: 'User not active or not found.' } },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      data: { user: user ? { ...user, _id: user.id } : user },
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: err.message } },
      { status: 500 }
    );
  }
}
