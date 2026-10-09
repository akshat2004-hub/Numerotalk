'use client';

import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SectionPickerItem {
  id: string;
  number: number;
  labelEn: string;
  labelHi: string;
  checked: boolean;
}

interface PdfSectionPickerProps {
  sections: SectionPickerItem[];
  onToggle: (id: string) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  currentLocale?: 'en' | 'hi';
  className?: string;
}

export function PdfSectionPicker({
  sections,
  onToggle,
  onSelectAll,
  onDeselectAll,
  currentLocale = 'en',
  className
}: PdfSectionPickerProps) {
  return (
    <div className={cn('vedic-card p-5 sm:p-6 space-y-4 rounded-[24px]', className)}>
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[var(--border)]">
        <div>
          <h4 className="font-serif text-base sm:text-lg font-bold text-[var(--heading)]">
            {currentLocale === 'hi' ? 'पीडीएफ अनुभाग चयन (1 - 16, 18)' : 'Report Sections Selection (1 - 16, 18)'}
          </h4>
          <p className="text-xs text-[var(--text-muted)]">
            {currentLocale === 'hi'
              ? 'चुनें कि रिपोर्ट में कौन से मॉड्यूल और गणनाएं सम्मिलित करनी हैं'
              : 'Select which modules and readings to include in your personalized dossier'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onSelectAll}
            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-[var(--chip-bg)] text-[var(--gold)] border border-[var(--border)] hover:bg-[var(--active-bg)] transition-colors cursor-pointer"
          >
            {currentLocale === 'hi' ? 'सभी चुनें' : 'Select All'}
          </button>
          <button
            type="button"
            onClick={onDeselectAll}
            className="px-3 py-1.5 rounded-xl text-xs font-medium bg-[var(--surface)] text-[var(--text-muted)] border border-[var(--border)] hover:bg-[var(--bg)] transition-colors cursor-pointer"
          >
            {currentLocale === 'hi' ? 'सभी हटाएं' : 'Deselect All'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
        {sections.map((sec) => (
          <label
            key={sec.id}
            onClick={() => onToggle(sec.id)}
            className={cn(
              'flex items-center gap-3 p-3 rounded-2xl border text-xs sm:text-sm cursor-pointer select-none transition-all',
              sec.checked
                ? 'bg-[var(--chip-bg)]/40 border-[var(--gold)] text-[var(--heading)] font-semibold shadow-xs'
                : 'bg-[var(--surface)] border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--gold)]'
            )}
          >
            <div
              className={cn(
                'w-5 h-5 rounded-md flex items-center justify-center border transition-colors shrink-0',
                sec.checked
                  ? 'bg-[var(--gold)] border-[var(--gold)] text-white'
                  : 'border-[var(--input-border)] bg-[var(--surface)]'
              )}
            >
              {sec.checked && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
            </div>

            <div className="flex items-center gap-2 truncate">
              <span className="w-5 h-5 rounded-full bg-[var(--bg)] text-[var(--gold)] font-serif text-[11px] font-bold flex items-center justify-center shrink-0 border border-[var(--border)]">
                {sec.number}
              </span>
              <span className="truncate text-xs sm:text-sm">
                {currentLocale === 'hi' ? sec.labelHi : sec.labelEn}
              </span>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}
