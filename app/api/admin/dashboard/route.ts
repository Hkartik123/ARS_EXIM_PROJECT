import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import { connectToDatabase } from '@/lib/db/mongodb';
import { Enquiry } from '@/models/Enquiry';
import { Project } from '@/models/Project';
import { Application } from '@/models/Application';
import { AuditLog } from '@/models/AuditLog';

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

    const [
      totalQuotes,
      newQuotes,
      totalProjects,
      totalApplications,
      recentEnquiries,
      recentAuditLogs,
    ] = await Promise.all([
      Enquiry.countDocuments({ type: 'QUOTE' }),
      Enquiry.countDocuments({ type: 'QUOTE', status: 'NEW' }),
      Project.countDocuments({ isDeleted: false }),
      Application.countDocuments(),
      Enquiry.find().sort({ createdAt: -1 }).limit(5).lean(),
      AuditLog.find().sort({ createdAt: -1 }).limit(5).lean(),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        metrics: {
          totalQuotes,
          newQuotes,
          totalProjects,
          totalApplications,
        },
        recentEnquiries,
        recentAuditLogs,
      },
    });
  } catch (err: any) {
    console.error('Admin dashboard error:', err);
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: err.message } },
      { status: 500 }
    );
  }
}
