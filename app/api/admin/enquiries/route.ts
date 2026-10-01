import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser, checkRolePermission } from '@/lib/auth/session';
import { connectToDatabase } from '@/lib/db/mongodb';
import { Enquiry } from '@/models/Enquiry';

export async function GET(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED' } }, { status: 401 });
  }

  if (!checkRolePermission(user.role, ['SUPER_ADMIN', 'SALES_BD', 'VIEWER'])) {
    return NextResponse.json({ success: false, error: { code: 'FORBIDDEN' } }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status');
  const type = searchParams.get('type');
  const search = searchParams.get('search');

  try {
    await connectToDatabase();
    const query: any = {};

    if (status && status !== 'ALL') {
      query.status = status;
    }

    if (type && type !== 'ALL') {
      query.type = type;
    }

    if (search) {
      query.$or = [
        { referenceNumber: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const enquiries = await Enquiry.find(query).sort({ createdAt: -1 }).limit(100).lean();
    return NextResponse.json({ success: true, data: { enquiries } });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: { message: err.message } }, { status: 500 });
  }
}
