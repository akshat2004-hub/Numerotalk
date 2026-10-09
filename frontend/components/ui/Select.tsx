'use client';

import React, { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/frontend/utils';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  wrapperClassName?: string;
}

/**
 * Standardized Compact Select Component:
 * - Height: 40px, Radius: 10px, Text: 15px
 * - Padding: 0 36px 0 12px (or pl-10 if icon)
 * - Label: 12.5px font-medium muted with 6px gap
 * - Custom styled chevron, gold focus ring
 */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, icon, className, wrapperClassName, id, children, ...props }, ref) => {
    const selectId = id || (label ? label.toLowerCase().replace(/[^a-z0-9]/g, '-') : undefined);

    return (
      <div className={cn('w-full flex flex-col gap-1.5', wrapperClassName)}>
        {label && (
          <label
            htmlFor={selectId}
            className="text-[12.5px] font-medium text-[var(--text-muted)] select-none leading-normal block"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center w-full">
          {icon && (
            <div className="absolute left-3 flex items-center pointer-events-none text-[var(--gold)] shrink-0">
              {icon}
            </div>
          )}
          <select
            ref={ref}
            id={selectId}
            className={cn(
              'h-[40px] w-full rounded-[10px] border border-[var(--input-border)] bg-[var(--surface)] text-[15px] text-[var(--text)] transition-all outline-hidden appearance-none cursor-pointer',
              icon ? 'pl-9 pr-9' : 'pl-3 pr-9',
              'focus:border-[var(--gold)] focus:ring-2 focus:ring-[var(--gold)]/20',
              error && 'border-rose-400 focus:border-rose-500 focus:ring-rose-200',
              className
            )}
            {...props}
          >
            {children}
          </select>
          <div className="absolute right-3 pointer-events-none text-[var(--text-muted)] flex items-center">
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
        {error && <span className="text-xs text-rose-600 mt-0.5">{error}</span>}
      </div>
    );
  }
);

Select.displayName = 'Select';
