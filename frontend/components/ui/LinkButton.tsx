'use client';

import React from 'react';
import { Link } from '@/i18n/routing';
import { cn } from '@/frontend/utils';

export interface LinkButtonProps extends React.ComponentProps<typeof Link> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  shortLabel?: React.ReactNode;
}

export function LinkButton({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  trailingIcon,
  shortLabel,
  className,
  ...props
}: LinkButtonProps) {
  const sizeClasses = {
    sm: 'h-8 px-3 text-[13px] gap-1.5 [&_svg]:w-3.5 [&_svg]:h-3.5 [&_svg]:shrink-0 [&_svg]:block [&_svg]:m-0',
    md: 'h-10 px-4 text-sm gap-2 [&_svg]:w-4 [&_svg]:h-4 [&_svg]:shrink-0 [&_svg]:block [&_svg]:m-0',
    lg: 'h-12 px-6 text-base gap-2.5 [&_svg]:w-4 [&_svg]:h-4 [&_svg]:shrink-0 [&_svg]:block [&_svg]:m-0'
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
    <Link
      className={cn(
        'inline-flex flex-row items-center justify-center whitespace-nowrap select-none leading-none rounded-[12px] font-semibold transition-all cursor-pointer w-auto shrink-0',
        sizeClasses,
        variantClasses,
        className
      )}
      {...props}
    >
      {icon && (
        <span className="shrink-0 flex items-center justify-center leading-none [&>svg]:block [&>svg]:shrink-0 [&>svg]:m-0">
          {icon}
        </span>
      )}

      {shortLabel ? (
        <>
          <span className="whitespace-nowrap leading-none truncate-none hidden sm:inline">
            {children}
          </span>
          <span className="whitespace-nowrap leading-none truncate-none sm:hidden">
            {shortLabel}
          </span>
        </>
      ) : (
        <span className="whitespace-nowrap leading-none truncate-none">
          {children}
        </span>
      )}

      {trailingIcon && (
        <span className="shrink-0 flex items-center justify-center leading-none [&>svg]:block [&>svg]:shrink-0 [&>svg]:m-0">
          {trailingIcon}
        </span>
      )}
    </Link>
  );
}
