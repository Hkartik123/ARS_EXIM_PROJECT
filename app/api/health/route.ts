import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { addRequestId, createRequestId, logDatabaseFailure } from '@/lib/api/request-diagnostics';

export const dynamic = 'force-dynamic';

export async function GET() {
  const requestId = createRequestId();
  const startTime = Date.now();
  let dbStatus = 'DISCONNECTED';
  let dbCategory: string | undefined;
  let dbErrorCode: string | undefined;

  try {
    await prisma.$queryRaw`SELECT 1`;
    dbStatus = 'CONNECTED';
  } catch (err) {
    const failure = logDatabaseFailure(err, {
      requestId,
      endpoint: '/api/health',
      operation: 'prisma.$queryRaw',
    });
    dbCategory = failure.category;
    dbErrorCode = failure.prismaCode;
  }

  const responseTime = Date.now() - startTime;

  return addRequestId(NextResponse.json({
    status: dbStatus === 'CONNECTED' ? 'HEALTHY' : 'DEGRADED',
    timestamp: new Date().toISOString(),
    uptimeSeconds: process.uptime(),
    database: dbStatus,
    databaseCategory: dbCategory,
    databaseErrorCode: dbErrorCode,
    responseTimeMs: responseTime,
    environment: process.env.NODE_ENV,
    requestId,
  }), requestId);
}
