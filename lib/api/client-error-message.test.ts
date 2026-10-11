import { describe, expect, it } from 'vitest';
import { getApiErrorMessage } from './client-error-message';

describe('getApiErrorMessage', () => {
  it('shows field validation messages', () => {
    expect(getApiErrorMessage({
      error: {
        message: 'Invalid request.',
        details: { fieldErrors: { email: ['Email is invalid.'] }, formErrors: [] },
      },
    }, 'Fallback')).toBe('Email is invalid.');
  });

  it('adds a safe request reference to persistence failures', () => {
    expect(getApiErrorMessage({
      error: { message: 'We could not save your request.', requestId: 'request-123' },
    }, 'Fallback')).toBe('We could not save your request. (Reference: request-123)');
  });

  it('uses the fallback for malformed API responses', () => {
    expect(getApiErrorMessage('<!doctype html>', 'Request failed.')).toBe('Request failed.');
  });
});
