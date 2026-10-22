import { describe, expect, it, vi } from 'vitest';
import { logDatabaseFailure } from './request-diagnostics';

describe('logDatabaseFailure', () => {
  it('classifies credential failures without logging the error message', () => {
    const log = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    const failure = logDatabaseFailure(
      Object.assign(new Error('authentication failed at postgresql://user:secret@db.example.test/postgres'), {
        name: 'PrismaClientInitializationError',
        errorCode: 'P1000',
      }),
      { requestId: 'request-123', endpoint: '/api/enquiries/contact', operation: 'prisma.enquiry.create' }
    );

    expect(failure).toMatchObject({
      status: 503,
      code: 'DATABASE_UNAVAILABLE',
      category: 'DATABASE_AUTHENTICATION_FAILED',
    });
    expect(JSON.stringify(log.mock.calls)).not.toContain('secret');
    expect(JSON.stringify(log.mock.calls)).not.toContain('authentication failed');
    expect(JSON.stringify(log.mock.calls)).toContain('P1000');
    log.mockRestore();
  });

  it('classifies connection pool timeouts for production diagnosis', () => {
    const log = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const failure = logDatabaseFailure(
      Object.assign(new Error('connection pool timeout'), {
        name: 'PrismaClientKnownRequestError',
        code: 'P2024',
      }),
      { requestId: 'request-456', endpoint: '/api/health', operation: 'prisma.$queryRaw' }
    );

    expect(failure).toMatchObject({
      status: 503,
      code: 'DATABASE_UNAVAILABLE',
      category: 'DATABASE_CONNECTION_POOL_TIMEOUT',
      prismaCode: 'P2024',
    });
    expect(JSON.stringify(log.mock.calls)).not.toContain('connection pool timeout');
    log.mockRestore();
  });
});
