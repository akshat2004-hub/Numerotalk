'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface ScoreMeterProps {
  score: number; // 0 to 100
  label?: string;
  sublabel?: string;
  size?: 'sm' | 'md' | 'lg';
  showLevelBadge?: boolean;
  showLabel?: boolean;
  className?: string;
}

export function ScoreMeter({
  score,
  label,
  sublabel,
  size = 'md',
  showLevelBadge = true,
  showLabel = true,
  className
}: ScoreMeterProps) {
  const safeScore = Math.min(100, Math.max(0, Math.round(score)));

  const level = safeScore >= 70 ? 'High' : safeScore >= 40 ? 'Medium' : 'Low';
  const levelColor = {
    High: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    Medium: 'text-amber-800 bg-amber-50 border-amber-200',
    Low: 'text-rose-700 bg-rose-50 border-rose-200'
  }[level];

  const barColor =
    safeScore >= 70
      ? 'bg-gradient-to-r from-amber-400 to-emerald-500'
      : safeScore >= 40
      ? 'bg-gradient-to-r from-amber-400 to-amber-500'
      : 'bg-gradient-to-r from-rose-400 to-amber-400';

  const trackHeight = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-2.5'
  }[size];

  return (
    <div className={cn('w-full space-y-1.5', className)}>
      {showLabel && (
        <div className="flex items-center justify-between text-xs">
          <div>
            {label && (
              <span className="font-semibold text-[var(--heading)] block">
                {label}
              </span>
            )}
            {sublabel && (
              <span className="text-[10px] text-[var(--text-muted)]">
                {sublabel}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {showLevelBadge && (
              <span className={cn('text-[9.5px] font-bold px-2 py-0.5 rounded-full border', levelColor)}>
                {level}
              </span>
            )}
            <span className="font-serif font-bold text-sm text-[var(--heading)]">
              {safeScore}%
            </span>
          </div>
        </div>
      )}

      {/* Progress Track */}
      <div className={cn('w-full rounded-full bg-[var(--border)] overflow-hidden', trackHeight)}>
        <div
          className={cn('h-full rounded-full transition-all duration-500', barColor)}
          style={{ width: `${safeScore}%` }}
        />
      </div>
    </div>
  );
}
