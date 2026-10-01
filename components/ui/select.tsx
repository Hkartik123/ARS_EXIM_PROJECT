import React, { forwardRef, SelectHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  error?: string;
  label?: string;
  options: { label: string; value: string }[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, error, label, id, options, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={id} className="block text-xs font-semibold uppercase tracking-wider text-steel-700 mb-1.5">
            {label} {props.required && <span className="text-safety-red">*</span>}
          </label>
        )}
        <select
          id={id}
          ref={ref}
          className={cn(
            'flex h-11 w-full rounded border border-steel-300 bg-white px-3.5 py-2 text-sm text-navy-950 transition-colors focus:border-navy-700 focus:outline-none focus:ring-1 focus:ring-navy-700 disabled:cursor-not-allowed disabled:bg-steel-100 disabled:opacity-50',
            error && 'border-safety-red focus:border-safety-red focus:ring-safety-red',
            className
          )}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && <p className="mt-1.5 text-xs font-medium text-safety-red">{error}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';
