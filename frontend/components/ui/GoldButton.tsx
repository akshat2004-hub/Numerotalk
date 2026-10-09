'use client';

import React from 'react';
import { cn } from '@/frontend/utils';

export interface GoldButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
}

export function GoldButton({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  className,
  ...props
}: GoldButtonProps) {
  const sizeClasses = {
    sm: 'h-8 px-3 text-xs gap-1.5',
    md: 'h-10 px-4 text-xs sm:text-[12.5px] gap-2',
    lg: 'h-11 px-5 text-sm gap-2.5'
  }[size];

  const variantClasses = {
    primary: 'btn-gold-gradient text-white shadow-sm',
    secondary: 'btn-vedic-secondary',
    outline: 'bg-transparent text-[var(--gold)] border border-[var(--gold)] hover:bg-[var(--chip-bg)]/30'
  }[variant];

  return (
    <button
      className={cn(
        'font-serif font-semibold rounded-[16px] inline-flex items-center justify-center transition-all cursor-pointer select-none active:scale-[0.99]',
        sizeClasses,
        variantClasses,
        className
      )}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </button>
  );
}
