'use client';

import React, { forwardRef } from 'react';
import { cn } from '@/frontend/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  rightElement?: React.ReactNode;
  wrapperClassName?: string;
}

/**
 * Standardized Compact Input Component:
 * - Height: 40px, Radius: 10px, Text: 15px (line-height 1.5)
 * - Padding: 0 12px, Color: var(--text), Placeholder: var(--text-muted)
 * - Label above: 12.5px muted with 6px gap
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, rightElement, className, wrapperClassName, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/[^a-z0-9]/g, '-') : undefined);

    return (
      <div className={cn('w-full flex flex-col gap-1.5', wrapperClassName)}>
        {label && (
          <label
            htmlFor={inputId}
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
          <input
            ref={ref}
            id={inputId}
            className={cn(
              'h-[40px] w-full rounded-[10px] border border-[var(--input-border)] bg-[var(--surface)] text-[15px] text-[var(--text)] placeholder-[var(--text-muted)] leading-[1.5] transition-all outline-hidden',
              icon ? 'pl-9 pr-3' : rightElement ? 'pl-3 pr-9' : 'px-3',
              'focus:border-[var(--gold)] focus:ring-2 focus:ring-[var(--gold)]/20',
              error && 'border-rose-400 focus:border-rose-500 focus:ring-rose-200',
              className
            )}
            {...props}
          />
          {rightElement && (
            <div className="absolute right-3 flex items-center text-[var(--text-muted)]">
              {rightElement}
            </div>
          )}
        </div>
        {error && (
          <span className="text-xs text-rose-600 mt-0.5">{error}</span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
