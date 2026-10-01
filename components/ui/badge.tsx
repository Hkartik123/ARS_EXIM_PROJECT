import React, { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'gold' | 'navy' | 'steel' | 'safety' | 'success';
}

export function Badge({ className, variant = 'steel', ...props }: BadgeProps) {
  const variants = {
    gold: 'bg-gold/15 text-navy-900 border border-gold/40 font-semibold',
    navy: 'bg-navy-900 text-white font-medium',
    steel: 'bg-steel-100 text-steel-700 border border-steel-200 font-medium',
    safety: 'bg-safety-light text-safety-red border border-safety-red/30 font-bold',
    success: 'bg-success-light text-success border border-success/30 font-semibold',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded text-xs tracking-wide uppercase',
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
