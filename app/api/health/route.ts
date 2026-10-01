import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';

export async function GET() {
  const startTime = Date.now();
  let dbStatus = 'DISCONNECTED';

  try {
    const conn = await connectToDatabase();
    if (conn.connection.readyState === 1) {
      dbStatus = 'CONNECTED';
    }
  } catch (err: any) {
    dbStatus = `ERROR: ${err.message}`;
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
