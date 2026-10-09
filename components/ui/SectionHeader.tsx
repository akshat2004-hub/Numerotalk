'use client';

import React from 'react';
import { CosmicOrbit } from '@/components/CosmicOrbit';
import { cn } from '@/lib/utils';

interface SectionHeaderProps {
  title: string;
  goldTitle?: string;
  subtitle?: string;
  badge?: string;
  icon?: React.ReactNode;
  showOrbit?: boolean;
  className?: string;
}

export function SectionHeader({
  title,
  goldTitle,
  subtitle,
  badge = 'VEDIC ALMANAC · MODULE 01',
  icon,
  showOrbit = true,
  className
}: SectionHeaderProps) {
  let primaryTitle = title;
  let secondaryTitle = goldTitle;

  if (!secondaryTitle && title.includes('&')) {
    const parts = title.split('&');
    primaryTitle = parts[0] + '&';
    secondaryTitle = parts.slice(1).join('&').trim();
  }

  return (
    <div
      className={cn(
        'relative mb-4 sm:mb-5 select-none flex items-start justify-between gap-4',
        className
      )}
    >
      <div className="z-10 max-w-[640px]">
        {/* Top small eyebrow: 10px uppercase letter spacing Gold */}
        {badge && (
          <div className="mb-1">
            <span className="text-[10px] font-semibold tracking-wider uppercase text-[var(--gold)]">
              {badge}
            </span>
          </div>
        )}

        {/* Main heading: Playfair Display, heading navy with gold second half */}
        <h1 className="font-serif text-xl sm:text-2xl lg:text-[26px] font-semibold tracking-tight text-[var(--heading)] leading-[1.25]">
          <span>{primaryTitle}{' '}</span>
          {secondaryTitle && (
            <span className="text-[var(--gold)]">{secondaryTitle}</span>
          )}
        </h1>

        {/* Subtitle */}
        {subtitle && (
          <p className="mt-1 text-[12px] sm:text-[12.5px] text-[var(--text-muted)] max-w-[600px] leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>

      {/* Decorative Vedic Element: upper-right, CosmicOrbit */}
      {showOrbit && (
        <div className="hidden md:block shrink-0 pointer-events-none mt-0">
          <CosmicOrbit size={120} />
        </div>
      )}
    </div>
  );
}

// Alias PageHeader as requested
export const PageHeader = SectionHeader;
