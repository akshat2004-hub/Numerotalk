'use client';

import React from 'react';
import { CosmicOrbit } from '@/frontend/components/CosmicOrbit';
import { cn } from '@/frontend/utils';

export interface SectionHeaderProps {
  title: string;
  goldTitle?: string;
  subtitle?: string;
  badge?: string; // Kept for prop compatibility, but deliberately NEVER rendered
  _icon?: React.ReactNode;
  icon?: React.ReactNode;
  showOrbit?: boolean;
  className?: string;
}

export function SectionHeader({
  title,
  goldTitle,
  subtitle,
  _icon,
  icon,
  showOrbit = true,
  className
}: SectionHeaderProps) {
  let primaryTitle = title;
  let secondaryTitle = goldTitle;

  // Split title if parent passed gold part in parentheses or with &
  if (!secondaryTitle) {
    if (title.includes('(') && title.endsWith(')')) {
      const idx = title.indexOf('(');
      primaryTitle = title.substring(0, idx).trim();
      secondaryTitle = title.substring(idx).trim();
    } else if (title.includes('&')) {
      const parts = title.split('&');
      primaryTitle = parts[0] + '&';
      secondaryTitle = parts.slice(1).join('&').trim();
    }
  }

  return (
    <div
      className={cn(
        'relative mb-4 sm:mb-5 select-none flex items-start justify-between gap-4',
        className
      )}
    >
      <div className="z-10 max-w-[640px]">
        {/* Main heading: Playfair Display, heading navy with gold second half */}
        <h1 className="font-serif text-xl sm:text-2xl lg:text-[26px] font-semibold tracking-tight text-[var(--heading)] leading-[1.25] flex items-center gap-2.5">
          {icon && <span className="text-[var(--gold)] shrink-0">{icon}</span>}
          <span>{primaryTitle}{' '}</span>
          {secondaryTitle && (
            <span className="text-[var(--gold)]">{secondaryTitle}</span>
          )}
        </h1>

        {/* Short gold underline */}
        <div className="w-10 h-0.5 bg-[var(--gold)] rounded-full mt-2 mb-1.5" />

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
