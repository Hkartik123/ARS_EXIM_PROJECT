import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import { User } from '@/models/User';
import { comparePassword, hashPassword } from '@/lib/auth/passwords';
import { createSessionToken, SESSION_COOKIE_OPTIONS } from '@/lib/auth/session';
import { loginSchema } from '@/validators/auth.schema';
import { checkRateLimit } from '@/lib/security/rate-limiter';
import { recordAuditLog } from '@/lib/audit/audit-logger';

async function ensureInitialAdminUser(email: string, password: string) {
  const existingUser = await User.findOne({ email });
  if (existingUser) return existingUser;

  const passwordHash = await hashPassword(password);
  return User.create({
    email,
    passwordHash,
    name: 'ARS EXIM Lead Administrator',
    role: 'SUPER_ADMIN',
    isActive: true,
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

    await connectToDatabase();

    const adminEmail = process.env.ADMIN_INITIAL_EMAIL;
    const adminPassword = process.env.ADMIN_INITIAL_PASSWORD;

    let user = await User.findOne({ email: validated.data.email });
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
      user.failedLoginAttempts += 1;
      if (user.failedLoginAttempts >= 5) {
        user.lockoutUntil = new Date(Date.now() + 30 * 60 * 1000); // 30 min lockout
      }
      await user.save();

      await recordAuditLog({
        userId: user._id,
        userEmail: user.email,
        userRole: user.role,
        action: 'FAILED_LOGIN',
        entity: 'USER',
        entityId: user._id.toString(),
        ipAddress: ip,
        userAgent: req.headers.get('user-agent') || undefined,
      });

      return NextResponse.json(
        { success: false, error: { code: 'INVALID_CREDENTIALS', message: 'Invalid credentials.' } },
        { status: 401 }
      );
    }

    // Reset failed attempts on success
    user.failedLoginAttempts = 0;
    user.lockoutUntil = undefined;
    user.lastLoginAt = new Date();
    user.lastLoginIp = ip;
    await user.save();

    const token = createSessionToken({
      userId: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role,
    });

    await recordAuditLog({
      userId: user._id,
      userEmail: user.email,
      userRole: user.role,
      action: 'LOGIN',
      entity: 'USER',
      entityId: user._id.toString(),
      ipAddress: ip,
      userAgent: req.headers.get('user-agent') || undefined,
    });

    const response = NextResponse.json({
      success: true,
      data: {
        user: {
          id: user._id,
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
