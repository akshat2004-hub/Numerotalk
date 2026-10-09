'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface NumberBadgeProps {
  number: number | string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'gold' | 'solar' | 'lunar' | 'mars' | 'mercury' | 'jupiter' | 'venus' | 'saturn' | 'neutral' | string;
  subLabel?: string;
  className?: string;
}

export function NumberBadge({
  number,
  size = 'md',
  subLabel,
  className
}: NumberBadgeProps) {
  const sizeClasses = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-8 h-8 text-sm',
    lg: 'w-11 h-11 text-lg',
    xl: 'w-14 h-14 text-2xl'
  };

  return (
    <div className="inline-flex flex-col items-center justify-center gap-1 select-none">
      {/* Clean circular badge with gold serif numeral */}
      <div
        className={cn(
          'rounded-full flex items-center justify-center font-serif font-semibold',
          'bg-[#FFFDF9] border border-[#FDE68A] text-[#D97706] shadow-2xs transition-transform hover:scale-105',
          sizeClasses[size],
          className
        )}
      >
        <span className="leading-none">{number}</span>
      </div>

      {subLabel && (
        <span className="text-[10px] font-medium text-[#64748B] text-center tracking-tight max-w-[4.5rem] truncate font-sans">
          {subLabel}
        </span>
      )}
    </div>
  );
}
