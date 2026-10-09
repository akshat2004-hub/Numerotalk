'use client';

import React, { useState } from 'react';
import { FileText, Check, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNumerologyStore } from '@/lib/store/useNumerologyStore';

export interface PredictionCardProps {
  title: string;
  subtitle?: string;
  prediction?: string;
  badge?: string;
  badgeVariant?: 'gold' | 'emerald' | 'crimson' | 'indigo';
  icon?: React.ReactNode;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  sectionKey?: string;
  reportSectionKey?: string;
  showAddToReport?: boolean;
  locale?: 'en' | 'hi';
}

export function PredictionCard({
  title,
  subtitle,
  prediction,
  badge,
  badgeVariant = 'gold',
  icon,
  children,
  footer,
  className,
  sectionKey,
  reportSectionKey,
  showAddToReport = true,
  locale = 'en'
}: PredictionCardProps) {
  const toggleReportSection = useNumerologyStore((s) => s.toggleReportSection);
  const reportSections = useNumerologyStore((s) => s.reportSections);
  const [justAdded, setJustAdded] = useState(false);

  const effectiveSectionKey = sectionKey || reportSectionKey || title.toLowerCase().replace(/[^a-z0-9]/g, '');
  const isIncluded = reportSections ? !!reportSections[effectiveSectionKey] : false;

  const handleToggleReport = () => {
    toggleReportSection(effectiveSectionKey);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1800);
  };

  const badgeClasses = {
    gold: 'bg-[var(--chip-bg)] text-[var(--gold)] border-[var(--border)]',
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    crimson: 'bg-rose-50 text-rose-700 border-rose-200',
    indigo: 'bg-[var(--bg)] text-[var(--text-muted)] border-[var(--border)]',
  };

  return (
    <div
      className={cn(
        'vedic-card p-4 sm:p-5 flex flex-col justify-between rounded-[24px] relative overflow-hidden',
        className
      )}
    >
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5">
            {icon && (
              <div className="w-7 h-7 rounded-lg bg-[var(--bg)] border border-[var(--border)] flex items-center justify-center text-[var(--gold)] shrink-0">
                {icon}
              </div>
            )}
            <div>
              <h3 className="font-serif text-[15px] sm:text-base font-semibold text-[var(--heading)] tracking-tight">
                {title}
              </h3>
              {subtitle && (
                <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {badge && (
              <span
                className={cn(
                  'px-2 py-0.5 rounded-full text-[10.5px] font-semibold border',
                  badgeClasses[badgeVariant]
                )}
              >
                {badge}
              </span>
            )}

            {showAddToReport && (
              <button
                type="button"
                onClick={handleToggleReport}
                title={isIncluded ? 'Remove from report' : 'Add to report'}
                className={cn(
                  'px-2 py-0.5 rounded-full text-[10px] font-medium border transition-all flex items-center gap-1 cursor-pointer select-none',
                  isIncluded
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                    : 'bg-[var(--surface)] text-[var(--text-muted)] border-[var(--border)] hover:bg-[var(--bg)] hover:text-[var(--heading)]'
                )}
              >
                {isIncluded ? (
                  <>
                    <Check className="w-2.5 h-2.5 stroke-[2.5]" />
                    <span>In Report</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-2.5 h-2.5 stroke-[2.5]" />
                    <span>Add to report</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        <div className="text-[12.5px] sm:text-[13px] leading-relaxed text-[var(--text)] space-y-2.5">
          {prediction ? (
            <p className="whitespace-pre-line">{prediction}</p>
          ) : (
            children
          )}
        </div>
      </div>

      {footer && (
        <div className="mt-3.5 pt-2.5 border-t border-[var(--border)] flex items-center justify-between text-[11px] text-[var(--text-muted)]">
          {footer}
        </div>
      )}
    </div>
  );
}
