import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  const startTime = Date.now();
  let dbStatus = 'DISCONNECTED';

  try {
    await prisma.$queryRaw`SELECT 1`;
    dbStatus = 'CONNECTED';
  } catch (err) {
    const error = err as { name?: string; code?: string };
    console.error('Database health check failed:', {
      name: error.name,
      code: error.code,
    });
    dbStatus = 'DISCONNECTED';
  }

  const responseTime = Date.now() - startTime;

  return NextResponse.json({
    status: dbStatus === 'CONNECTED' ? 'HEALTHY' : 'DEGRADED',
    timestamp: new Date().toISOString(),
    uptimeSeconds: process.uptime(),
    database: dbStatus,
    responseTimeMs: responseTime,
    environment: process.env.NODE_ENV,
  });
}
