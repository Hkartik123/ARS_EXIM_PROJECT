import { afterEach, describe, expect, it, vi } from 'vitest';
import { StorageConfigurationError, StorageService } from './storage-service';

describe('StorageService', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('rejects local filesystem storage in production rather than writing ephemeral files', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    vi.stubEnv('STORAGE_PROVIDER', 'local');

    await expect(
      new StorageService().uploadBuffer(Buffer.from('image'), 'image.webp', 'image/webp', 'gallery')
    ).rejects.toBeInstanceOf(StorageConfigurationError);
  });

  it('requires complete persistent storage configuration', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    vi.stubEnv('STORAGE_PROVIDER', 'r2');
    vi.stubEnv('S3_ENDPOINT', '');
    vi.stubEnv('S3_REGION', '');
    vi.stubEnv('S3_BUCKET', '');
    vi.stubEnv('S3_ACCESS_KEY_ID', '');
    vi.stubEnv('S3_SECRET_ACCESS_KEY', '');

    await expect(
      new StorageService().uploadBuffer(Buffer.from('image'), 'image.webp', 'image/webp', 'gallery')
    ).rejects.toThrow('S3 storage configuration is incomplete');
  });
});
