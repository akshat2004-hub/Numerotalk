'use client';

import React from 'react';
import { Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DashaPeriod } from '@/lib/engine/dasha';

interface PeriodTimelineProps {
  periods: DashaPeriod[];
  className?: string;
}

export function PeriodTimeline({
  periods,
  className
}: PeriodTimelineProps) {
  return (
    <div className={cn('relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[1.5px] before:bg-[var(--color-primary)]', className)}>
      {periods.map((p, idx) => (
        <div key={idx} className="relative group">
          <div className="absolute -left-6 top-3 w-4 h-4 rounded-full bg-[var(--bg-surface)] border-2 border-[var(--color-primary)] transition-transform group-hover:scale-110 shadow-xs" />

          <div className="vedic-card p-5">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2 pb-2 border-b border-[var(--color-gold-hairline)]">
              <div className="flex items-center gap-2.5">
                <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-[var(--bg-tint-active)] text-[var(--color-primary-deep)] border border-[var(--color-gold-hairline)]">
                  {p.level} ({p.levelHi})
                </span>
                <span className="font-vedic-serif text-base font-bold text-[var(--text-main)]">
                  {p.rulerPlanetEn} ({p.rulerPlanetHi})
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] font-mono">
                <Calendar className="w-3.5 h-3.5 stroke-[1.5] text-[var(--color-primary-deep)]" />
                <span className="font-semibold">{p.startYear} – {p.endYear}</span>
              </div>
            </div>

            <p className="text-sm text-[var(--text-main)] leading-relaxed mb-1.5">
              {p.descriptionEn}
            </p>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              {p.descriptionHi}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
