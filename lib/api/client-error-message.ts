type ApiErrorPayload = {
  error?: {
    message?: unknown;
    requestId?: unknown;
    details?: {
      fieldErrors?: unknown;
      formErrors?: unknown;
    };
  };
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

export function getApiErrorMessage(payload: unknown, fallback: string): string {
  if (!isRecord(payload)) return fallback;

  const error = (payload as ApiErrorPayload).error;
  if (!error) return fallback;

  const messages: string[] = [];
  const fieldErrors = error.details?.fieldErrors;
  if (isRecord(fieldErrors)) {
    for (const value of Object.values(fieldErrors)) {
      if (Array.isArray(value)) {
        messages.push(...value.filter((item): item is string => typeof item === 'string'));
      }
    }
  }
  const formErrors = error.details?.formErrors;
  if (Array.isArray(formErrors)) {
    messages.push(...formErrors.filter((item): item is string => typeof item === 'string'));
  }

  const message = messages.length > 0
    ? messages.join(' ')
    : typeof error.message === 'string'
      ? error.message
      : fallback;
  const requestId = typeof error.requestId === 'string' ? error.requestId : undefined;

  return requestId ? `${message} (Reference: ${requestId})` : message;
}
