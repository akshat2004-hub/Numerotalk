'use client';

import React, { forwardRef } from 'react';
import { cn } from '@/frontend/utils';

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon: React.ReactNode;
  'aria-label': string;
  tooltip?: string;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      icon,
      variant = 'secondary',
      size = 'md',
      'aria-label': ariaLabel,
      tooltip,
      className,
      type = 'button',
      ...props
    },
    ref
  ) => {
    const sizeClasses = {
      sm: 'w-8 h-8 text-[13px] [&_svg]:w-3.5 [&_svg]:h-3.5',
      md: 'w-10 h-10 text-sm [&_svg]:w-4 [&_svg]:h-4',
      lg: 'w-12 h-12 text-base [&_svg]:w-5 [&_svg]:h-5'
    }[size];

    const variantClasses = {
      primary:
        'btn-gold-gradient text-white border-0 shadow-[0_2px_8px_rgba(201,131,16,0.18)] hover:brightness-105 active:scale-[0.99]',
      secondary:
        'bg-[var(--surface)] text-[var(--text)] border border-[var(--border)] hover:bg-[var(--chip-bg)]/40 hover:border-[var(--gold)]/50 active:scale-[0.99] shadow-[0_1px_4px_rgba(201,131,16,0.06)]',
      outline:
        'bg-transparent text-[var(--gold)] border border-[var(--gold)] hover:bg-[var(--chip-bg)]/30 active:scale-[0.99]',
      ghost:
        'bg-transparent text-[var(--text-muted)] hover:text-[var(--heading)] hover:bg-[var(--chip-bg)]/25 border-0 active:scale-[0.99]'
    }[variant];

    return (
      <button
        ref={ref}
        type={type}
        aria-label={ariaLabel}
        title={tooltip || ariaLabel}
        className={cn(
          'inline-flex flex-row items-center justify-center shrink-0 rounded-[12px] transition-all cursor-pointer select-none disabled:opacity-50 disabled:pointer-events-none [&_svg]:block [&_svg]:shrink-0 [&_svg]:m-0',
          sizeClasses,
          variantClasses,
          className
        )}
        {...props}
      >
        {icon}
      </button>
    );
  }
);

IconButton.displayName = 'IconButton';
