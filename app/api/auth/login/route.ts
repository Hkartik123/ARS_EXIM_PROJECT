import { prisma } from '@/lib/db/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { comparePassword, hashPassword } from '@/lib/auth/passwords';
import { createSessionToken, SESSION_COOKIE_OPTIONS } from '@/lib/auth/session';
import { loginSchema } from '@/validators/auth.schema';
import { checkRateLimit } from '@/lib/security/rate-limiter';
import { recordAuditLog } from '@/lib/audit/audit-logger';
import type { UserRole } from '@/models/User';

async function ensureInitialAdminUser(email: string, password: string) {
  const existingUser = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  if (existingUser) return existingUser;

  const passwordHash = await hashPassword(password);
  return prisma.user.create({
    data: {
      email: email.toLowerCase(),
      passwordHash,
      name: 'ARS EXIM Lead Administrator',
      role: 'SUPER_ADMIN',
      isActive: true,
    },
  });
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';

  // 1. Rate limiting: 10 attempts per 15 minutes per IP
  const rateLimit = checkRateLimit(`login-${ip}`, { windowMs: 15 * 60 * 1000, maxRequests: 10 });
  if (!rateLimit.allowed) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'RATE_LIMIT_EXCEEDED',
          message: 'Too many failed login attempts. Please wait before retrying.',
        },
      },
      { status: 429 }
    );
  }

  try {
    const body = await req.json();
    const validated = loginSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid email or password format.',
            details: validated.error.flatten(),
          },
        },
        { status: 400 }
      );
    }
    const adminEmail = process.env.ADMIN_INITIAL_EMAIL;
    const adminPassword = process.env.ADMIN_INITIAL_PASSWORD;

    let user = await prisma.user.findUnique({ where: { email: validated.data.email.toLowerCase() } });
    if (!user && adminEmail && adminPassword && validated.data.email.toLowerCase() === adminEmail.toLowerCase()) {
      user = await ensureInitialAdminUser(adminEmail, adminPassword);
    }

    if (!user) {
      return NextResponse.json(
        { success: false, error: { code: 'INVALID_CREDENTIALS', message: 'Invalid credentials.' } },
        { status: 401 }
      );
    }

    if (!user.isActive) {
      return NextResponse.json(
        { success: false, error: { code: 'ACCOUNT_DEACTIVATED', message: 'Account is deactivated.' } },
        { status: 403 }
      );
    }

    // Check lockout
    if (user.lockoutUntil && user.lockoutUntil > new Date()) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'ACCOUNT_LOCKED',
            message: 'Account temporarily locked due to excessive failed attempts. Please try again later.',
          },
        },
        { status: 403 }
      );
    }

    const passwordMatches = await comparePassword(validated.data.password, user.passwordHash);

    if (!passwordMatches) {
      const failedLoginAttempts = user.failedLoginAttempts + 1;
      await prisma.user.update({
        where: { id: user.id },
        data: {
          failedLoginAttempts,
          lockoutUntil: failedLoginAttempts >= 5 ? new Date(Date.now() + 30 * 60 * 1000) : user.lockoutUntil,
        },
      });

      await recordAuditLog({
        userId: user.id,
        userEmail: user.email,
        userRole: user.role,
        action: 'FAILED_LOGIN',
        entity: 'USER',
        entityId: user.id,
        ipAddress: ip,
        userAgent: req.headers.get('user-agent') || undefined,
      });

      return NextResponse.json(
        { success: false, error: { code: 'INVALID_CREDENTIALS', message: 'Invalid credentials.' } },
        { status: 401 }
      );
    }

    // Reset failed attempts on success
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { failedLoginAttempts: 0, lockoutUntil: null, lastLoginAt: new Date(), lastLoginIp: ip },
    });

    const token = createSessionToken({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role as UserRole,
    });

    await recordAuditLog({
      userId: user.id,
      userEmail: user.email,
      userRole: user.role,
      action: 'LOGIN',
      entity: 'USER',
      entityId: user.id,
      ipAddress: ip,
      userAgent: req.headers.get('user-agent') || undefined,
    });

    const response = NextResponse.json({
      success: true,
      data: {
        user: {
          id: updatedUser.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      },
    });

    response.cookies.set({
      ...SESSION_COOKIE_OPTIONS,
      value: token,
    });

    return response;
  } catch (err: any) {
    console.error('Login error:', err);
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Authentication service encountered an error.' } },
      { status: 500 }
    );
  }
}
