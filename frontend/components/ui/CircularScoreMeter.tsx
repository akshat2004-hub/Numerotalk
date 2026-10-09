'use client';

import React from 'react';
import { cn } from '@/frontend/utils';

export interface CircularScoreMeterProps {
  score: number; // 0 - 100
  size?: number; // diameter in px (e.g. 160)
  strokeWidth?: number; // width of ring (e.g. 10)
  label?: string;
  verdict?: string;
  className?: string;
  locale?: 'en' | 'hi';
}

export function CircularScoreMeter({
  score,
  size = 170,
  strokeWidth = 11,
  label,
  verdict,
  className,
  locale = 'en'
}: CircularScoreMeterProps) {
  const safeScore = Math.min(100, Math.max(0, Math.round(score)));

  // Radius and circumference
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (safeScore / 100) * circumference;

  // Determine color scheme
  const getColorGradient = (val: number) => {
    if (val >= 75) {
      return {
        gradientId: 'gauge-emerald-gold',
        startColor: '#10B981', // emerald
        endColor: '#F59E0B',   // amber gold
        textColor: 'text-emerald-700',
        badgeBg: 'bg-emerald-50 text-emerald-800 border-emerald-300'
      };
    }
    if (val >= 55) {
      return {
        gradientId: 'gauge-gold-amber',
        startColor: '#E8A317', // gold
        endColor: '#F59E0B',   // amber
        textColor: 'text-amber-700',
        badgeBg: 'bg-amber-50 text-amber-800 border-amber-300'
      };
    }
    if (val >= 40) {
      return {
        gradientId: 'gauge-amber-rose',
        startColor: '#F59E0B',
        endColor: '#F97316',
        textColor: 'text-orange-700',
        badgeBg: 'bg-orange-50 text-orange-800 border-orange-300'
      };
    }
    return {
      gradientId: 'gauge-rose',
      startColor: '#F43F5E',
      endColor: '#E11D48',
      textColor: 'text-rose-700',
      badgeBg: 'bg-rose-50 text-rose-800 border-rose-300'
    };
  };

  const scheme = getColorGradient(safeScore);

  return (
    <div className={cn('flex flex-col items-center justify-center select-none', className)}>
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        {/* SVG Circular Ring */}
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="transform -rotate-90 filter drop-shadow-sm transition-all duration-700"
        >
          <defs>
            <linearGradient id={scheme.gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={scheme.startColor} />
              <stop offset="100%" stopColor={scheme.endColor} />
            </linearGradient>
            <filter id="gauge-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#E8A317" floodOpacity="0.25" />
            </filter>
          </defs>

          {/* Background track circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            className="text-[var(--border)] opacity-60"
            strokeWidth={strokeWidth}
            fill="transparent"
          />

          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={`url(#${scheme.gradientId})`}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-out"
            filter="url(#gauge-glow)"
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-2 pointer-events-none">
          <span className="text-[10px] uppercase font-bold tracking-widest text-[var(--text-muted)]">
            {locale === 'hi' ? 'गुण मिलान' : 'MATCH'}
          </span>
          <div className="flex items-baseline justify-center gap-0.5 my-0.5">
            <span className={cn('font-serif font-extrabold text-3xl sm:text-4xl tracking-tight', scheme.textColor)}>
              {safeScore}
            </span>
            <span className="text-xs font-semibold text-[var(--text-muted)]">/100</span>
          </div>
          {label && (
            <span className="text-[10px] font-medium text-[var(--text-muted)] leading-tight max-w-[100px] truncate">
              {label}
            </span>
          )}
        </div>
      </div>

      {verdict && (
        <div className="mt-3 text-center">
          <span
            className={cn(
              'inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border shadow-xs',
              scheme.badgeBg
            )}
          >
            {verdict}
          </span>
        </div>
      )}
    </div>
  );
}
