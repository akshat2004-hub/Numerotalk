'use client';

import React from 'react';
import { cn } from '@/frontend/utils';

export interface CompoundNumberProps {
  compound?: number;
  reduced?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * Shared CompoundNumber component.
 * Displays compound vibration: large serif numeral for compound number (e.g. 23),
 * arrow "→", and small gold circle badge with the reduced single digit (e.g. 5): [ 23 → (5) ].
 * If the number is already a single digit (no compound), renders just that digit, with no arrow or badge.
 * Contains no "/" or fraction format anywhere.
 */
export function CompoundNumber({
  compound,
  reduced,
  size = 'md',
  className
}: CompoundNumberProps) {
  if (compound === undefined && reduced === undefined) return null;

  const comp = compound ?? reduced!;
  const red = reduced ?? compound!;

  // If already a single digit (no compound), show just that digit, with no arrow or badge
  const isSingleDigit = comp <= 9 || comp === red;

  if (isSingleDigit) {
    return (
      <span
        data-testid="single-number"
        className={cn(
          'font-serif font-bold text-[var(--gold)] tabular-nums lining-nums',
          size === 'lg' ? 'text-2xl sm:text-3xl' : size === 'sm' ? 'text-xs sm:text-sm' : 'text-base sm:text-lg',
          className
        )}
      >
        {comp}
      </span>
    );
  }

  return (
    <span
      data-testid="compound-number"
      className={cn(
        'inline-flex items-center gap-1.5 tabular-nums lining-nums select-none align-middle',
        className
      )}
    >
      <span
        className={cn(
          'font-serif font-bold text-[var(--heading)] leading-none',
          size === 'lg' ? 'text-2xl sm:text-3xl' : size === 'sm' ? 'text-xs sm:text-sm font-semibold' : 'text-base sm:text-lg'
        )}
      >
        {comp}
      </span>
      <span
        className={cn(
          'text-[var(--gold)] font-medium leading-none',
          size === 'lg' ? 'text-base sm:text-lg' : size === 'sm' ? 'text-[11px]' : 'text-sm'
        )}
      >
        →
      </span>
      <span
        className={cn(
          'inline-flex items-center justify-center rounded-full bg-[var(--chip-bg)] border border-[var(--gold)]/50 text-[var(--gold)] font-serif font-bold shadow-2xs leading-none shrink-0',
          size === 'lg'
            ? 'w-7 h-7 sm:w-8 sm:h-8 text-sm sm:text-base'
            : size === 'sm'
            ? 'w-4 h-4 text-[10px]'
            : 'w-5 h-5 text-xs'
        )}
      >
        {red}
      </span>
    </span>
  );
}
