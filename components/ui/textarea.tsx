import React, { forwardRef, TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
  label?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, label, id, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={id} className="block text-xs font-semibold uppercase tracking-wider text-steel-700 mb-1.5">
            {label} {props.required && <span className="text-safety-red">*</span>}
          </label>
        )}
        <textarea
          id={id}
          ref={ref}
          className={cn(
            'flex min-h-[120px] w-full rounded border border-steel-300 bg-white px-3.5 py-2.5 text-sm text-navy-950 transition-colors placeholder:text-steel-400 focus:border-navy-700 focus:outline-none focus:ring-1 focus:ring-navy-700 disabled:cursor-not-allowed disabled:bg-steel-100 disabled:opacity-50',
            error && 'border-safety-red focus:border-safety-red focus:ring-safety-red',
            className
          )}
          {...props}
        />
        {error && <p className="mt-1.5 text-xs font-medium text-safety-red">{error}</p>}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
