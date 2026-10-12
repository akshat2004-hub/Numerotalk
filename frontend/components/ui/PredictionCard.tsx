'use client';

import React, { useState } from 'react';
import { useLocale } from 'next-intl';
import { cn } from '@/frontend/utils';
import { ReportCheckbox } from './ReportCheckbox';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { PredictionBasis, PredictionKind } from '@/core/types';

export interface PredictionPoint {
  id?: string | number;
  heading?: string;
  body: string;
  subline?: string;
  itemKey?: string;
}

export interface PredictionCardProps {
  title: string;
  intro?: string;
  subtitle?: string;
  points?: PredictionPoint[];
  children?: React.ReactNode;
  prediction?: string;
  body?: string;
  derivation?: string[] | string;
  sectionKey?: string;
  reportSectionKey?: string;
  itemKey?: string;
  locale?: 'en' | 'hi';
  className?: string;
  accent?: 'gold' | 'rose' | 'navy' | 'green' | 'amber';
  variant?: 'default' | 'strengths' | 'cautions';
  footer?: React.ReactNode;
  icon?: React.ReactNode;
  badge?: string;
  badgeVariant?: string;
  basis?: PredictionBasis;
  kind?: PredictionKind;
  personName?: string;
  addToReport?: boolean;
  showAddToReport?: boolean;
}

export function PredictionCard({
  title,
  intro,
  subtitle,
  points,
  children,
  prediction,
  body,
  derivation,
  sectionKey,
  reportSectionKey,
  itemKey,
  className,
  variant = 'default',
  footer
}: PredictionCardProps) {
  const currentLocale = useLocale() as 'en' | 'hi';
  const effectiveIntro = intro || subtitle;
  const effectiveBody = prediction || body;
  const cardKey = itemKey || sectionKey || reportSectionKey || `prediction:${title.toLowerCase().replace(/\s+/g, '_')}`;

  const [showAllDerivations, setShowAllDerivations] = useState(false);
  const effectiveDerivations = derivation
    ? Array.isArray(derivation)
      ? derivation
      : [derivation]
    : [];

  const variantStyles = {
    default: 'vedic-card p-4 sm:p-5 space-y-3',
    strengths: 'p-4 sm:p-5 rounded-2xl border border-emerald-200/90 bg-emerald-50/20 shadow-xs space-y-3',
    cautions: 'p-4 sm:p-5 rounded-2xl border border-amber-200/90 bg-amber-50/20 shadow-xs space-y-3'
  }[variant];

  const titleStyles = {
    default: 'text-[var(--heading)]',
    strengths: 'text-emerald-900',
    cautions: 'text-amber-900'
  }[variant];

  return (
    <div className={cn(variantStyles, className)}>
      {/* 1. Header with serif title + master checkbox */}
      <div className="flex items-center justify-between gap-3 pb-1 border-b border-[var(--border)]/60">
        <h3
          className={cn(
            'font-serif text-[16px] sm:text-[17px] font-bold tracking-tight leading-snug',
            titleStyles
          )}
        >
          {title}
        </h3>
        <ReportCheckbox itemKey={cardKey} title="Include this entire section in report" />
      </div>

      {/* 2. One plain intro line */}
      {effectiveIntro && (
        <p className="text-xs sm:text-[13px] text-[var(--text-muted)] leading-relaxed">
          {effectiveIntro}
        </p>
      )}

      {/* 3. NUMBERED points: [checkbox] [1.] bold heading, body under it, optional tinted sub-line */}
      {points && points.length > 0 ? (
        <div className="space-y-2.5 pt-1">
          {points.map((pt, idx) => {
            const pointKey = pt.itemKey || `${cardKey}:point_${idx + 1}`;
            return (
              <div
                key={pt.id ?? idx}
                className="flex items-start gap-2.5 p-3 rounded-xl bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--gold)]/40 transition-colors shadow-2xs"
              >
                <ReportCheckbox itemKey={pointKey} className="mt-0.5" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-1.5 flex-wrap">
                    <span className="font-serif font-bold text-xs text-[var(--gold)] lining-nums">
                      {idx + 1}.
                    </span>
                    {pt.heading && (
                      <span className="font-bold text-xs sm:text-[13px] text-[var(--heading)]">
                        {pt.heading}
                      </span>
                    )}
                  </div>
                  <p className="text-xs sm:text-[13px] text-[var(--text)] mt-0.5 leading-relaxed">
                    {pt.body}
                  </p>
                  {pt.subline && (
                    <div className="text-[11px] text-[var(--gold-deep)] mt-1 font-medium">
                      {pt.subline}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : effectiveBody ? (
        <div className="text-[14px] sm:text-[14.5px] leading-relaxed text-[var(--text)] font-sans whitespace-pre-line">
          {effectiveBody}
        </div>
      ) : (
        children
      )}

      {/* Derivation / Footer if provided */}
      {effectiveDerivations.length > 0 && (
        <div className="pt-2 border-t border-[var(--border)] text-[11px] text-[var(--text-muted)] font-mono leading-relaxed">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 flex-1 min-w-0">
              <span className="font-sans font-semibold text-[var(--heading)] shrink-0">
                {currentLocale === 'hi' ? 'आधार:' : 'Basis:'}
              </span>
              <span className="truncate text-[var(--gold-deep)] lining-nums">
                {effectiveDerivations[0]}
              </span>
            </div>
            {effectiveDerivations.length > 1 && (
              <button
                type="button"
                onClick={() => setShowAllDerivations(!showAllDerivations)}
                className="inline-flex items-center gap-0.5 text-[10px] text-[var(--gold)] hover:underline shrink-0 font-sans cursor-pointer"
              >
                <span>{showAllDerivations ? (currentLocale === 'hi' ? 'कम' : 'Less') : (currentLocale === 'hi' ? 'विस्तार' : 'More')}</span>
                {showAllDerivations ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>
            )}
          </div>
          {showAllDerivations && effectiveDerivations.length > 1 && (
            <div className="mt-1.5 p-2 rounded-lg bg-[var(--surface-muted)]/40 border border-[var(--border)] space-y-0.5">
              {effectiveDerivations.map((d, i) => (
                <div key={i} className="text-[10.5px] lining-nums">• {d}</div>
              ))}
            </div>
          )}
        </div>
      )}

      {footer && (
        <div className="pt-2 border-t border-[var(--border)] text-[11px] text-[var(--text-muted)]">
          {footer}
        </div>
      )}
    </div>
  );
}
