import { randomUUID } from 'node:crypto';
import { NextResponse } from 'next/server';

type ErrorDetails = {
  name?: string;
  code?: string;
  errorCode?: string;
  clientVersion?: string;
};

function getErrorDetails(error: unknown): ErrorDetails {
  if (!error || typeof error !== 'object') return {};
  const value = error as Record<string, unknown>;
  return {
    name: typeof value.name === 'string' ? value.name : undefined,
    code: typeof value.code === 'string' ? value.code : undefined,
    errorCode: typeof value.errorCode === 'string' ? value.errorCode : undefined,
    clientVersion: typeof value.clientVersion === 'string' ? value.clientVersion : undefined,
  };
}

export function createRequestId(): string {
  return randomUUID();
}

export function addRequestId<T>(response: NextResponse<T>, requestId: string): NextResponse<T> {
  response.headers.set('x-request-id', requestId);
  return response;
}

export function logDatabaseFailure(
  error: unknown,
  context: { requestId: string; endpoint: string; operation: string }
): { status: number; code: string; category: string; message: string; prismaCode?: string } {
  const details = getErrorDetails(error);
  const prismaCode = details.code || details.errorCode;
  let category = 'DATABASE_OPERATION_FAILED';
  let status = 503;
  let code = 'DATABASE_UNAVAILABLE';
  let message = 'We could not save your request right now. Please try again later.';

  if (prismaCode === 'P1000') {
    category = 'DATABASE_AUTHENTICATION_FAILED';
  } else if (prismaCode === 'P1001') {
    category = 'DATABASE_UNREACHABLE';
  } else if (prismaCode === 'P1002') {
    category = 'DATABASE_CONNECTION_TIMEOUT';
  } else if (prismaCode === 'P1008') {
    category = 'DATABASE_OPERATION_TIMEOUT';
  } else if (prismaCode === 'P1010') {
    category = 'DATABASE_ACCESS_DENIED';
  } else if (prismaCode === 'P1011') {
    category = 'DATABASE_TLS_FAILED';
  } else if (prismaCode === 'P1012') {
    category = 'DATABASE_CONFIGURATION_ERROR';
  } else if (prismaCode === 'P1017') {
    category = 'DATABASE_CONNECTION_CLOSED';
  } else if (prismaCode === 'P2021' || prismaCode === 'P2022') {
    category = 'DATABASE_SCHEMA_MISMATCH';
  } else if (prismaCode === 'P2024') {
    category = 'DATABASE_CONNECTION_POOL_TIMEOUT';
  } else if (prismaCode === 'P2002') {
    category = 'DATABASE_CONSTRAINT_CONFLICT';
    code = 'DUPLICATE_SUBMISSION';
    status = 409;
    message = 'This request may already have been received. Please wait before submitting again.';
  } else if (!details.name?.startsWith('Prisma')) {
    category = 'UNEXPECTED_DATABASE_FAILURE';
    status = 500;
    code = 'SERVER_ERROR';
    message = 'We could not process your request right now. Please try again later.';
  }

  console.error('Database operation failure', {
    ...context,
    category,
    prismaCode,
    errorName: details.name,
    clientVersion: details.clientVersion,
  });

  return { status, code, category, message, prismaCode };
}

export function logRequestFailure(
  error: unknown,
  context: { requestId: string; endpoint: string; operation: string }
): void {
  const details = getErrorDetails(error);
  console.error('Enquiry request failure', {
    ...context,
    category: 'UNEXPECTED_REQUEST_FAILURE',
    errorName: details.name,
    prismaCode: details.code || details.errorCode,
    clientVersion: details.clientVersion,
  });
}
