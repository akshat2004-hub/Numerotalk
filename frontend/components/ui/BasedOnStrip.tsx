'use client';

import React from 'react';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { Sparkles, ArrowRight, AlertTriangle } from 'lucide-react';
import { cn } from '@/frontend/utils';
import { PredictionSource } from '@/core/types';

export interface BasedOnStripItem {
  label: { en: string; hi: string } | string;
  value?: number | string;
  source?: PredictionSource;
  href?: string;
}

export interface BasedOnStripProps {
  items: BasedOnStripItem[];
  className?: string;
  locale?: 'en' | 'hi';
  missingPrompt?: {
    en: string;
    hi: string;
    actionText?: { en: string; hi: string };
    href?: string;
  };
}

export function BasedOnStrip({
  items,
  className,
  locale: propLocale,
  missingPrompt
}: BasedOnStripProps) {
  const systemLocale = useLocale() as 'en' | 'hi';
  const locale = propLocale || systemLocale || 'en';

  return (
    <div className={cn('space-y-2', className)}>
      <div
        data-page-based-on-strip
        className="flex flex-wrap items-center gap-2 p-1.5 px-3 rounded-2xl sm:rounded-full bg-[var(--surface)] border border-[var(--border)] text-xs text-[var(--text-muted)] shadow-2xs"
      >
        <div className="flex items-center gap-1.5 font-medium text-[var(--heading)] shrink-0">
          <Sparkles className="w-3.5 h-3.5 text-[var(--gold)] shrink-0" />
          <span className="font-semibold">
            {locale === 'hi' ? 'इस पृष्ठ का आधार:' : 'This page uses:'}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {items.map((item, idx) => {
            const labelStr = typeof item.label === 'string' ? item.label : (locale === 'hi' ? item.label.hi : item.label.en);
            const targetHref = item.href || `/${locale}/user-detail`;

            return (
              <React.Fragment key={idx}>
                {idx > 0 && <span className="text-[var(--border)] font-bold">·</span>}
                <Link
                  href={targetHref}
                  title={locale === 'hi' ? 'मॉड्यूल 1 (उपयोगकर्ता विवरण) में देखें' : 'View in Module 1 (User Detail)'}
                  className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[var(--chip-bg)] text-[var(--heading)] hover:bg-[var(--active-bg)] border border-[var(--border)] transition-all cursor-pointer group"
                >
                  <span className="font-medium group-hover:text-[var(--gold-deep)]">
                    {labelStr}
                  </span>
                  {item.value !== undefined && item.value !== null && (
                    <span
                      data-badge
                      className="w-4 h-4 rounded-full bg-[var(--gold)] text-[var(--heading)] font-bold text-[10px] flex items-center justify-center font-mono lining-nums"
                    >
                      {item.value}
                    </span>
                  )}
                </Link>
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {missingPrompt && (
        <div
          data-missing-prompt
          className="p-3 rounded-2xl bg-[var(--warn-bg)] border border-[var(--warn-border)] text-xs text-[var(--warn-text)] flex items-center justify-between gap-3 shadow-2xs"
        >
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-[var(--warn-text)]" />
            <span className="font-medium">
              {locale === 'hi' ? missingPrompt.hi : missingPrompt.en}
            </span>
          </div>
          <Link
            href={missingPrompt.href || `/${locale}/user-detail`}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[var(--surface)] text-[var(--heading)] font-semibold border border-[var(--border)] hover:border-[var(--gold)] shrink-0 transition-colors"
          >
            <span>
              {missingPrompt.actionText
                ? (locale === 'hi' ? missingPrompt.actionText.hi : missingPrompt.actionText.en)
                : (locale === 'hi' ? 'मॉड्यूल 1 में जोड़ें' : 'Set in Module 1')}
            </span>
            <ArrowRight className="w-3 h-3 text-[var(--gold)]" />
          </Link>
        </div>
      )}
    </div>
  );
}
