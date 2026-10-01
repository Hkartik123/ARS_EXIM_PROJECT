import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address.').trim().toLowerCase(),
  password: z.string().min(8, 'Password must be at least 8 characters long.'),
});

export const createUserSchema = z.object({
  email: z.string().email('Valid email address required.').trim().toLowerCase(),
  password: z
    .string()
    .min(10, 'Password must be at least 10 characters long.')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter.')
    .regex(/[0-9]/, 'Password must contain at least one numeric character.')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character.'),
  name: z.string().min(2, 'Name must be at least 2 characters long.').trim(),
  role: z.enum(['SUPER_ADMIN', 'ADMIN_CONTENT', 'SALES_BD', 'HR', 'VIEWER']),
});

export const updatePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required.'),
  newPassword: z
    .string()
    .min(10, 'New password must be at least 10 characters long.')
    .regex(/[A-Z]/, 'Must contain at least one uppercase letter.')
    .regex(/[0-9]/, 'Must contain at least one numeric digit.')
    .regex(/[^A-Za-z0-9]/, 'Must contain at least one symbol.'),
});
