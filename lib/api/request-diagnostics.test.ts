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
});
