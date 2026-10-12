'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { ChevronDown, Calendar, Check } from 'lucide-react';
import { cn } from '@/frontend/utils';

export interface YearSelectorProps {
  selectedYear: number;
  onChange: (year: number) => void;
  birthYear?: number;
  className?: string;
  locale?: 'en' | 'hi';
}

/**
 * Compact Year Range Selector Component:
 * - Displays single pill: "YYYY/YYYY+1" (e.g. "2026/2027") with chevron
 * - Opens scrollable popover (max-height 320px) listing ranges from birthYear to +30 years
 * - "Current" year range badge
 * - Selected item highlighted and auto-scrolled into view
 * - Closes on outside click or Esc
 */
export function YearSelector({
  selectedYear,
  onChange,
  birthYear,
  className,
  locale = 'en'
}: YearSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const selectedItemRef = useRef<HTMLButtonElement>(null);

  const currentYear = useMemo(() => new Date().getFullYear(), []);
  const startYear = Math.min(birthYear || currentYear - 30, currentYear - 10);
  const endYear = currentYear + 30;

  // Generate list of available years
  const yearOptions = useMemo(() => {
    const list: number[] = [];
    for (let y = startYear; y <= endYear; y++) {
      list.push(y);
    }
    return list;
  }, [startYear, endYear]);

  // Close on outside click or Esc
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  // Scroll selected item into view on open
  useEffect(() => {
    if (isOpen && selectedItemRef.current) {
      selectedItemRef.current.scrollIntoView({ block: 'nearest' });
    }
  }, [isOpen]);

  const displayRange = `${selectedYear}/${selectedYear + 1}`;

  return (
    <div className={cn('relative inline-block select-none', className)} ref={containerRef}>
      {/* Trigger Pill */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={cn(
          'h-[38px] px-3.5 rounded-[12px] border inline-flex flex-row items-center justify-center gap-2 cursor-pointer transition-all lining-nums whitespace-nowrap select-none leading-none shrink-0',
          'bg-[var(--surface)] text-[var(--heading)] font-serif font-bold text-sm shadow-xs',
          isOpen
            ? 'border-[var(--gold)] ring-2 ring-[var(--gold)]/20 shadow-md'
            : 'border-[var(--border)] hover:border-[var(--gold)]/60 hover:bg-[var(--chip-bg)]/20'
        )}
      >
        <span className="shrink-0 flex items-center justify-center leading-none [&>svg]:block [&>svg]:shrink-0 [&>svg]:m-0">
          <Calendar className="w-3.5 h-3.5 text-[var(--gold)] shrink-0" />
        </span>
        <span className="font-mono tracking-wide whitespace-nowrap leading-none">{displayRange}</span>
        {selectedYear === currentYear && (
          <span className="px-1.5 py-0.2 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-sans font-bold border border-emerald-200 uppercase whitespace-nowrap leading-none">
            {locale === 'hi' ? 'वर्तमान' : 'Current'}
          </span>
        )}
        <span className="shrink-0 flex items-center justify-center leading-none [&>svg]:block [&>svg]:shrink-0 [&>svg]:m-0">
          <ChevronDown
            className={cn(
              'w-3.5 h-3.5 text-[var(--text-muted)] transition-transform duration-200 shrink-0',
              isOpen && 'rotate-180 text-[var(--gold)]'
            )}
          />
        </span>
      </button>

      {/* Popover Dropdown */}
      {isOpen && (
        <div
          role="listbox"
          tabIndex={-1}
          className={cn(
            'absolute right-0 sm:left-0 mt-1.5 z-40 w-56 max-w-[calc(100vw-32px)] overflow-y-auto overscroll-contain rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-1.5 shadow-xl',
            'divide-y divide-[var(--border)]/40 [scrollbar-width:thin] [scrollbar-color:rgba(201,131,16,0.3)_transparent]'
          )}
        >
          {yearOptions.map((year) => {
            const isSelected = year === selectedYear;
            const isCurrent = year === currentYear;
            const label = `${year}/${year + 1}`;

            return (
              <button
                key={year}
                ref={isSelected ? selectedItemRef : undefined}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => {
                  onChange(year);
                  setIsOpen(false);
                }}
                className={cn(
                  'w-full px-3 py-2 rounded-xl text-left text-xs font-mono flex items-center justify-between transition-colors cursor-pointer lining-nums',
                  isSelected
                    ? 'bg-[var(--chip-bg)] text-[var(--gold)] font-bold ring-1 ring-[var(--gold)]/40'
                    : 'text-[var(--heading)] hover:bg-[var(--surface-muted)]'
                )}
              >
                <div className="flex items-center gap-2">
                  <span>{label}</span>
                  {isCurrent && (
                    <span className="px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-800 text-[9.5px] font-sans font-bold border border-emerald-200">
                      {locale === 'hi' ? 'वर्तमान' : 'Current'}
                    </span>
                  )}
                </div>

                {isSelected && <Check className="w-3.5 h-3.5 text-[var(--gold)] shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
