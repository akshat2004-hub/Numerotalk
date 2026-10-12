'use client';

import React from 'react';
import { cn } from '@/frontend/utils';

export interface SegmentedOption<T extends string> {
  value: T;
  label: string;
  icon?: React.ReactNode;
}

export interface SegmentedControlProps<T extends string> {
  options: SegmentedOption<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
  size?: 'sm' | 'md';
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  className,
  size = 'md'
}: SegmentedControlProps<T>) {
  return (
    <div
      className={cn(
        'inline-flex p-1 rounded-xl bg-[var(--seg-inactive)] border border-[var(--border)] select-none',
        className
      )}
    >
      {options.map((opt) => {
        const isActive = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={cn(
              'inline-flex flex-row items-center justify-center gap-1.5 font-medium transition-all rounded-[10px] cursor-pointer whitespace-nowrap select-none leading-none shrink-0',
              size === 'sm' ? 'px-2.5 py-1 text-[11px] [&_svg]:w-3 [&_svg]:h-3' : 'px-3.5 py-1.5 text-xs [&_svg]:w-3.5 [&_svg]:h-3.5',
              isActive
                ? 'bg-[var(--seg-active)] text-[var(--heading)] font-semibold shadow-xs'
                : 'text-[var(--text-muted)] hover:text-[var(--heading)]'
            )}
          >
            {opt.icon && (
              <span className="shrink-0 flex items-center justify-center leading-none [&>svg]:block [&>svg]:shrink-0 [&>svg]:m-0">
                {opt.icon}
              </span>
            )}
            <span className="whitespace-nowrap leading-none">{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}
