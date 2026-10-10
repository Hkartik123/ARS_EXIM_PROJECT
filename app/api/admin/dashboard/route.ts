import { prisma } from '@/lib/db/prisma';
import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import { withLegacyId } from '@/lib/db/legacy-id';

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json(
      { success: false, error: { code: 'UNAUTHORIZED', message: 'Authentication required.' } },
      { status: 401 }
    );
  }

  try {
    const [
      totalQuotes,
      newQuotes,
      totalProjects,
      totalApplications,
      recentEnquiries,
      recentAuditLogs,
    ] = await Promise.all([
      prisma.enquiry.count({ where: { type: 'QUOTE' } }),
      prisma.enquiry.count({ where: { type: 'QUOTE', status: 'NEW' } }),
      prisma.project.count({ where: { isDeleted: false } }),
      prisma.application.count(),
      prisma.enquiry.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        include: { notes: { select: { authorId: true, authorName: true, note: true, createdAt: true } } },
      }),
      prisma.auditLog.findMany({ orderBy: { createdAt: 'desc' }, take: 5 }),
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
        recentEnquiries: recentEnquiries.map(withLegacyId),
        recentAuditLogs: recentAuditLogs.map(withLegacyId),
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
