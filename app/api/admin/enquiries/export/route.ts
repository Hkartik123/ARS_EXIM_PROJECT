import { prisma } from '@/lib/db/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser, checkRolePermission } from '@/lib/auth/session';
import { recordAuditLog } from '@/lib/audit/audit-logger';

export async function GET(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED' } }, { status: 401 });
  }

  if (!checkRolePermission(user.role, ['SUPER_ADMIN', 'SALES_BD'])) {
    return NextResponse.json({ success: false, error: { code: 'FORBIDDEN' } }, { status: 403 });
  }

  try {
    const enquiries = await prisma.enquiry.findMany({ orderBy: { createdAt: 'desc' } });

    const headers = [
      'Reference Number',
      'Date Submitted',
      'Type',
      'Status',
      'Contact Name',
      'Company',
      'Email',
      'Phone',
      'Country',
      'Industry',
      'Project Name',
      'Required Services',
      'Expected Start Date',
      'Scope Description',
    ];

    const escapeCsv = (val: any) => {
      if (val === null || val === undefined) return '""';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    };

    const rows = enquiries.map((e) => [
      escapeCsv(e.referenceNumber),
      escapeCsv(new Date(e.createdAt).toISOString()),
      escapeCsv(e.type),
      escapeCsv(e.status),
      escapeCsv(e.name),
      escapeCsv(e.company),
      escapeCsv(e.email),
      escapeCsv(e.phone),
      escapeCsv(e.country),
      escapeCsv(e.industry || ''),
      escapeCsv(e.projectName || ''),
      escapeCsv(e.requiredServices?.join(', ') || ''),
      escapeCsv(e.expectedStartDate || ''),
      escapeCsv(e.scopeDescription.replace(/\n/g, ' ')),
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

    await recordAuditLog({
      userId: user.userId,
      userEmail: user.email,
      userRole: user.role,
      action: 'EXPORT',
      entity: 'ENQUIRY',
    });

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="ars_exim_enquiries_${Date.now()}.csv"`,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: { message: err.message } }, { status: 500 });
  }
}
