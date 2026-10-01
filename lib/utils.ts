import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateStringOrDate: string | Date | undefined): string {
  if (!dateStringOrDate) return 'N/A';
  const d = new Date(dateStringOrDate);
  if (isNaN(d.getTime())) return 'N/A';
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(d);
}

export function formatDateTime(dateStringOrDate: string | Date | undefined): string {
  if (!dateStringOrDate) return 'N/A';
  const d = new Date(dateStringOrDate);
  if (isNaN(d.getTime())) return 'N/A';
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
}

export function generateEnquiryReference(prefix: 'QR' | 'CR' = 'QR'): string {
  const year = new Date().getFullYear();
  const randomSuffix = Math.floor(100000 + Math.random() * 900000);
  return `${prefix}-${year}-${randomSuffix}`;
}

export function sanitizeText(input: string): string {
  if (!input) return '';
  return input
    .replace(/<[^>]*>/g, '') // Strip HTML tags
    .trim();
}
