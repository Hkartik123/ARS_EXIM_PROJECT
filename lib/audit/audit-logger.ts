import { AuditLog } from '@/models/AuditLog';
import { connectToDatabase } from '@/lib/db/mongodb';

export interface AuditLogParams {
  userId: any;
  userEmail: string;
  userRole: string;
  action: string;
  entity: string;
  entityId?: string;
  ipAddress?: string;
  userAgent?: string;
  changesDiff?: Record<string, unknown>;
}

export async function recordAuditLog(params: AuditLogParams): Promise<void> {
  try {
    await connectToDatabase();
    await AuditLog.create({
      userId: params.userId,
      userEmail: params.userEmail,
      userRole: params.userRole,
      action: params.action,
      entity: params.entity,
      entityId: params.entityId,
      ipAddress: params.ipAddress || '127.0.0.1',
      userAgent: params.userAgent,
      changesDiff: params.changesDiff,
    });
  } catch (err) {
    console.error('Failed to write audit log record:', err);
    // Never crash the primary transaction due to audit logging failure
  }
}
