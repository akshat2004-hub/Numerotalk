'use client';

import React from 'react';
import { Check } from 'lucide-react';
import { useNumerologyStore } from '@/frontend/store/useNumerologyStore';
import { cn } from '@/frontend/utils';

export interface ReportCheckboxProps {
  itemKey: string;
  className?: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  title?: string;
}

export function ReportCheckbox({
  itemKey,
  className,
  checked: controlledChecked,
  onChange,
  title = 'Include in report'
}: ReportCheckboxProps) {
  const reportSelection = useNumerologyStore((s) => s.reportSelection) || [];
  const toggleReportItem = useNumerologyStore((s) => s.toggleReportItem);

  const isChecked = controlledChecked !== undefined
    ? controlledChecked
    : reportSelection.includes(itemKey);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onChange) {
      onChange(!isChecked);
    } else {
      toggleReportItem(itemKey);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      e.stopPropagation();
      if (onChange) {
        onChange(!isChecked);
      } else {
        toggleReportItem(itemKey);
      }
    }
  };

  return (
    <div
      role="checkbox"
      aria-checked={isChecked}
      aria-label="Include in report"
      tabIndex={0}
      title={title}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={cn(
        'w-[18px] h-[18px] rounded-[5px] flex items-center justify-center shrink-0 cursor-pointer transition-all select-none border focus:outline-hidden focus:ring-2 focus:ring-[var(--gold)]/40',
        isChecked
          ? 'bg-[var(--gold)] border-[var(--gold)] text-white shadow-xs'
          : 'bg-[var(--surface)] border-[var(--border)] hover:border-[var(--gold)]/70 text-transparent',
        className
      )}
    >
      <Check
        className={cn(
          'w-3.5 h-3.5 stroke-[2.5] transition-transform duration-150',
          isChecked ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
        )}
      />
    </div>
  );
}
