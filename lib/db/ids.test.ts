import { describe, expect, it } from 'vitest';
import { isValidDatabaseId } from './ids';

describe('isValidDatabaseId', () => {
  it('accepts UUID database IDs', () => {
    expect(isValidDatabaseId('550e8400-e29b-41d4-a716-446655440000')).toBe(true);
  });

  it('rejects Mongo ObjectIds and malformed values', () => {
    expect(isValidDatabaseId('507f1f77bcf86cd799439011')).toBe(false);
    expect(isValidDatabaseId('not-an-id')).toBe(false);
  });
});
