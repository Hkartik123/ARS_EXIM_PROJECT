import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import { connectToDatabase } from '@/lib/db/mongodb';
import { User } from '@/models/User';

export async function GET() {
  const session = await getCurrentUser();

  if (!session) {
    return NextResponse.json(
      { success: false, error: { code: 'UNAUTHORIZED', message: 'No active session.' } },
      { status: 401 }
    );
  }

  try {
    await connectToDatabase();
    const user = await User.findById(session.userId).select('-passwordHash');

    if (!user || !user.isActive) {
      return NextResponse.json(
        { success: false, error: { code: 'FORBIDDEN', message: 'User not active or not found.' } },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      data: { user },
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: err.message } },
      { status: 500 }
    );
  }
}
