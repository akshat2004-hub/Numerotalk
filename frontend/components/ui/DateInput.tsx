'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Calendar } from 'lucide-react';
import { cn } from '@/frontend/utils';

export interface DateInputProps {
  value?: string; // ISO format "YYYY-MM-DD"
  onChange: (isoDate: string) => void;
  label?: string;
  error?: string;
  placeholder?: string;
  className?: string;
  wrapperClassName?: string;
  id?: string;
  required?: boolean;
  disabled?: boolean;
}

/**
 * Standardized DateInput:
 * - Always displays "DD/MM/YYYY" format (lining numerals, placeholder "DD/MM/YYYY")
 * - Masked typing + calendar popover (triggers native date picker under the hood)
 * - Stores and emits ISO "YYYY-MM-DD"
 * - Compact design: height 40px, text 15px, radius 10px, label 12.5px
 */
export function DateInput({
  value = '',
  onChange,
  label,
  error,
  placeholder = 'DD/MM/YYYY',
  className,
  wrapperClassName,
  id,
  required,
  disabled
}: DateInputProps) {
  // Convert ISO "YYYY-MM-DD" to "DD/MM/YYYY"
  const isoToDisplay = (iso: string): string => {
    if (!iso) return '';
    const parts = iso.split('-');
    if (parts.length === 3 && parts[0] && parts[1] && parts[2]) {
      return `${parts[2].padStart(2, '0')}/${parts[1].padStart(2, '0')}/${parts[0]}`;
    }
    return '';
  };

  // Convert "DD/MM/YYYY" to ISO "YYYY-MM-DD"
  const displayToIso = (disp: string): string | null => {
    const parts = disp.split('/');
    if (parts.length === 3) {
      const d = parseInt(parts[0], 10);
      const m = parseInt(parts[1], 10);
      const y = parseInt(parts[2], 10);
      if (d >= 1 && d <= 31 && m >= 1 && m <= 12 && y >= 1900 && y <= 2100) {
        return `${y.toString().padStart(4, '0')}-${m.toString().padStart(2, '0')}-${d.toString().padStart(2, '0')}`;
      }
    }
    return null;
  };

  const [displayValue, setDisplayValue] = useState<string>(isoToDisplay(value));
  const hiddenDateInputRef = useRef<HTMLInputElement>(null);
  const inputId = id || (label ? label.toLowerCase().replace(/[^a-z0-9]/g, '-') : undefined);

  useEffect(() => {
    setDisplayValue(isoToDisplay(value));
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value.replace(/\D/g, '');
    if (raw.length > 8) raw = raw.slice(0, 8);

    let formatted = '';
    if (raw.length > 0) {
      formatted += raw.slice(0, 2);
    }
    if (raw.length >= 3) {
      formatted += '/' + raw.slice(2, 4);
    }
    if (raw.length >= 5) {
      formatted += '/' + raw.slice(4, 8);
    }

    setDisplayValue(formatted);

    if (raw.length === 8) {
      const iso = displayToIso(formatted);
      if (iso) {
        onChange(iso);
      }
    } else if (raw.length === 0) {
      onChange('');
    }
  };

  const handleCalendarPickerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedIso = e.target.value;
    if (selectedIso) {
      setDisplayValue(isoToDisplay(selectedIso));
      onChange(selectedIso);
    }
  };

  const openPicker = () => {
    if (disabled) return;
    try {
      if (hiddenDateInputRef.current && 'showPicker' in HTMLInputElement.prototype) {
        hiddenDateInputRef.current.showPicker();
      } else {
        hiddenDateInputRef.current?.click();
      }
    } catch {
      hiddenDateInputRef.current?.focus();
    }
  };

  return (
    <div className={cn('w-full flex flex-col gap-1.5', wrapperClassName)}>
      {label && (
        <label
          htmlFor={inputId}
          className="text-[12.5px] font-medium text-[var(--text-muted)] select-none leading-normal block"
        >
          {label}
        </label>
      )}

      <div className="relative flex items-center w-full">
        <input
          id={inputId}
          type="text"
          inputMode="numeric"
          value={displayValue}
          onChange={handleInputChange}
          placeholder={placeholder}
          maxLength={10}
          disabled={disabled}
          required={required}
          className={cn(
            'h-[40px] w-full rounded-[10px] border border-[var(--input-border)] bg-[var(--surface)] text-[15px] font-mono text-[var(--text)] placeholder-[var(--text-muted)] px-3 pr-10 outline-hidden transition-all lining-nums',
            'focus:border-[var(--gold)] focus:ring-2 focus:ring-[var(--gold)]/20',
            error && 'border-rose-400 focus:border-rose-500 focus:ring-rose-200',
            className
          )}
        />

        {/* Calendar Picker Trigger Icon */}
        <button
          type="button"
          onClick={openPicker}
          disabled={disabled}
          tabIndex={-1}
          aria-label="Open calendar"
          className="absolute right-2.5 p-1 text-[var(--text-muted)] hover:text-[var(--gold)] transition-colors cursor-pointer shrink-0 disabled:opacity-50"
        >
          <Calendar className="w-4 h-4 stroke-[1.8]" />
        </button>

        {/* Hidden native input for browser calendar popover */}
        <input
          ref={hiddenDateInputRef}
          type="date"
          value={value}
          onChange={handleCalendarPickerChange}
          tabIndex={-1}
          aria-hidden="true"
          className="absolute opacity-0 pointer-events-none w-0 h-0"
        />
      </div>

      {error && <span className="text-xs text-rose-600 mt-0.5">{error}</span>}
    </div>
  );
}
