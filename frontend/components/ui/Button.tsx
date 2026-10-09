'use client';

import React, { forwardRef } from 'react';
import { cn } from '@/frontend/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
}

/**
 * Standardized Compact Button Component:
 * - sm: 32px high, 13px text, px 12
 * - md: 40px high, 14px text, px 16 (default)
 * - lg: 48px high, 15px text, px 24 (ONLY for main CTA like Module 1 Calculate Dashboard)
 * Radius: 10px, soft shadow for primary, icons 16px inline.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      icon,
      className,
      type = 'button',
      ...props
    },
    ref
  ) => {
    const sizeClasses = {
      sm: 'h-[32px] px-[12px] text-[13px] gap-1.5',
      md: 'h-[40px] px-[16px] text-[14px] gap-2',
      lg: 'h-[48px] px-[24px] text-[15px] gap-2.5 shadow-[0_4px_12px_rgba(201,131,16,0.25)]'
    }[size];

    const variantClasses = {
      primary:
        'btn-gold-gradient text-white border-0 shadow-[0_4px_12px_rgba(201,131,16,0.25)] hover:brightness-105 active:scale-[0.99]',
      secondary:
        'bg-[var(--surface)] text-[var(--text)] border border-[var(--border)] hover:bg-[var(--chip-bg)]/40 hover:border-[var(--gold)]/40 active:scale-[0.99]',
      outline:
        'bg-transparent text-[var(--gold)] border border-[var(--gold)] hover:bg-[var(--chip-bg)]/30 active:scale-[0.99]',
      ghost:
        'bg-transparent text-[var(--text-muted)] hover:text-[var(--heading)] hover:bg-[var(--chip-bg)]/20 border-0'
    }[variant];

    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          'inline-flex items-center justify-center font-semibold rounded-[10px] transition-all cursor-pointer select-none leading-none disabled:opacity-50 disabled:pointer-events-none',
          sizeClasses,
          variantClasses,
          className
        )}
        {...props}
      >
        {icon && (
          <span className="shrink-0 [&>svg]:w-4 [&>svg]:h-4 [&>svg]:stroke-[2]">
            {icon}
          </span>
        )}
        <span>{children}</span>
      </button>
    );
  }
);

Button.displayName = 'Button';
