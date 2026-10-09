'use client';

import React, { useState, useMemo, memo } from 'react';
import { Sun } from 'lucide-react';
import { cn } from '@/frontend/utils';
import { calculateVedicGrid, VedicGridResult, GridCell } from '@/core/engine/grid';
import { detectYogas } from '@/core/engine/yogas';

export interface VedicGridProps {
  dob: string;
  defaultIncludeMulankBhagyank?: boolean;
  locale?: 'en' | 'hi';
  onCellClick?: (cell: GridCell) => void;
  className?: string;
  highlightMissing?: boolean;
  highlightRepeating?: boolean;
  highlightYogLines?: boolean;
  size?: 'sm' | 'md' | 'lg';
  title?: string;
  caption?: string;
  additionalDigits?: number[];
  newlyAddedNumber?: number;
  digitHighlights?: Record<number, 'support' | 'hurdle' | 'dasha' | 'custom'>;
  hideControls?: boolean;
  hideStats?: boolean;
}

export function VedicGrid({
  dob,
  defaultIncludeMulankBhagyank = true,
  locale = 'en',
  onCellClick,
  className,
  highlightMissing = false,
  highlightRepeating = false,
  highlightYogLines = false,
  size = 'md',
  title,
  caption,
  additionalDigits = [],
  newlyAddedNumber,
  digitHighlights,
  hideControls = false,
  hideStats = false
}: VedicGridProps) {
  const [includeDriverConductor, setIncludeDriverConductor] = useState(defaultIncludeMulankBhagyank);
  const [selectedCell, setSelectedCell] = useState<GridCell | null>(null);

  // Stable key for additionalDigits array so useMemo dependency is correct
  const additionalDigitsKey = additionalDigits.join(',');

  const gridResult: VedicGridResult = useMemo(
    () => calculateVedicGrid(dob || '1995-10-23', includeDriverConductor, undefined, additionalDigits),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dob, includeDriverConductor, additionalDigitsKey]
  );
  const activeYogas = useMemo(() => detectYogas(gridResult).fullYogas, [gridResult]);

  const handleCellSelect = (cell: GridCell) => {
    setSelectedCell(cell);
    if (onCellClick) onCellClick(cell);
  };

  const sizeClasses = {
    sm: 'max-w-[220px] text-xs',
    md: 'max-w-[280px] sm:max-w-[310px] text-sm',
    lg: 'max-w-[360px] text-base'
  }[size];

  const cellHeightClass = {
    sm: 'p-1.5 min-h-[58px]',
    md: 'p-2 sm:p-2.5 min-h-[74px]',
    lg: 'p-3.5 min-h-[92px]'
  }[size];

  const numeralSizeClass = {
    sm: 'text-sm sm:text-base',
    md: 'text-lg sm:text-xl',
    lg: 'text-2xl sm:text-3xl'
  }[size];

  return (
    <div className={cn('vedic-card p-4 sm:p-5 flex flex-col items-center rounded-[24px]', className)}>
      {/* Header controls & summary */}
      {!hideControls && (
        <div className="w-full flex flex-wrap items-center justify-between gap-2.5 mb-3.5 pb-2.5 border-b border-[var(--border)]">
          <div>
            <h3 className="font-serif text-[15px] sm:text-base font-semibold text-[var(--heading)] flex items-center gap-1.5">
              <Sun className="w-3.5 h-3.5 text-[var(--gold)] stroke-[2]" />
              <span>
                {title || (locale === 'hi' ? 'वैदिक अंक ग्रिड' : 'Vedic Almanac Grid')}
              </span>
            </h3>
            <p className="text-[11px] text-[var(--text-muted)]">
              {caption || (locale === 'hi'
                ? 'भारतीय विन्यास: 3-1-9 / 6-7-5 / 2-8-4'
                : 'Indian Layout: 3 1 9 / 6 7 5 / 2 8 4')}
            </p>
          </div>

          {/* Driver/Conductor Switch */}
          <div className="flex items-center gap-2.5">
            <label className="flex items-center gap-1.5 cursor-pointer select-none text-[11px] text-[var(--text-muted)]">
              <input
                type="checkbox"
                checked={includeDriverConductor}
                onChange={(e) => setIncludeDriverConductor(e.target.checked)}
                className="w-3.5 h-3.5 accent-[var(--gold)] rounded border-[var(--border)]"
              />
              <span className="font-medium text-[var(--text)]">
                {locale === 'hi' ? 'मूलांक/भाग्यांक' : 'Driver/Conductor'}
              </span>
            </label>
          </div>
        </div>
      )}

      {/* Grid Status Pills */}
      {!hideStats && (
        <div className="w-full grid grid-cols-3 gap-2 mb-3.5 text-center text-xs">
          <div className="p-1.5 sm:p-2 rounded-xl bg-[var(--bg)] border border-[var(--border)]">
            <span className="text-[10px] font-medium text-[var(--text-muted)] block">
              {locale === 'hi' ? 'उपस्थित' : 'Present'}
            </span>
            <span className="font-serif font-bold text-sm sm:text-base text-[var(--heading)]">
              {gridResult.presentNumbers.length} / 9
            </span>
          </div>

          <div className="p-1.5 sm:p-2 rounded-xl bg-[var(--bg)] border border-[var(--border)]">
            <span className="text-[10px] font-medium text-[var(--text-muted)] block">
              {locale === 'hi' ? 'अनुपस्थित' : 'Missing'}
            </span>
            <span className="font-serif font-bold text-sm sm:text-base text-[#E11D48]">
              {gridResult.missingNumbers.length}
            </span>
          </div>

          <div className="p-1.5 sm:p-2 rounded-xl bg-[var(--bg)] border border-[var(--border)]">
            <span className="text-[10px] font-medium text-[var(--text-muted)] block">
              {locale === 'hi' ? 'दोहराव' : 'Repeating'}
            </span>
            <span className="font-serif font-bold text-sm sm:text-base text-[var(--gold)]">
              {gridResult.repeatingNumbers.length}
            </span>
          </div>
        </div>
      )}

      {/* 3x3 Vedic Grid Container with optional Yog Lines SVG Overlay */}
      <div className={cn('w-full relative', sizeClasses)}>
        <div className="grid grid-cols-3 border border-[var(--border)] bg-[var(--border)] gap-[1.5px] rounded-xl overflow-hidden shadow-xs relative z-0">
          {gridResult.matrix.map((row, rowIdx) =>
            row.map((cell, colIdx) => {
              const isSelected = selectedCell?.number === cell.number;
              const isHighlightedMissing = highlightMissing && !cell.isPresent;
              const isHighlightedRepeating = highlightRepeating && cell.isRepeating;
              const isNewlyAdded = newlyAddedNumber === cell.number;
              const customHighlight = digitHighlights ? digitHighlights[cell.number] : undefined;

              return (
                <button
                  key={`${rowIdx}-${colIdx}`}
                  type="button"
                  onClick={() => handleCellSelect(cell)}
                  className={cn(
                    'aspect-square flex flex-col items-center justify-between transition-all select-none relative cursor-pointer bg-[var(--surface)]',
                    cellHeightClass,
                    isSelected && 'ring-2 ring-[var(--gold)] z-10',
                    isNewlyAdded && 'ring-2 ring-[var(--gold)] bg-[var(--active-bg)]/40 z-10',
                    customHighlight === 'support' && 'ring-2 ring-[var(--gold)] bg-[var(--chip-bg)]/50',
                    customHighlight === 'hurdle' && 'ring-2 ring-rose-400/80 bg-rose-50/40',
                    isHighlightedMissing && 'bg-rose-50/50',
                    isHighlightedRepeating && 'bg-[var(--chip-bg)]/40',
                    !cell.isPresent && !isNewlyAdded && 'opacity-65'
                  )}
                >
                  {/* Top Sector Label & Count Badge */}
                  <div className="w-full flex items-center justify-between text-[9px] text-[var(--text-muted)]">
                    <span className="font-semibold text-[var(--gold)]">
                      #{cell.number}
                    </span>
                    <div className="flex items-center gap-1">
                      {isNewlyAdded && (
                        <span className="px-1 py-0.2 rounded-full text-[8.5px] bg-[var(--gold)] text-white font-bold animate-pulse">
                          Dasha
                        </span>
                      )}
                      {cell.isPresent && cell.isRepeating && (
                        <span className="px-1.5 py-0.2 rounded-full text-[9px] bg-[var(--chip-bg)] text-[var(--gold)] font-bold border border-[var(--border)]">
                          ×{cell.count}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Middle Numeral Display */}
                  <div className="flex flex-col items-center justify-center my-auto">
                    {cell.isPresent ? (
                      <span className={cn('font-serif font-bold text-[var(--heading)] tracking-tight', numeralSizeClass)}>
                        {cell.digitsDisplay}
                      </span>
                    ) : (
                      <div className="w-7 h-7 rounded-full border border-dashed border-[var(--border)] flex items-center justify-center text-[10px] font-serif text-[var(--text-muted)] bg-[var(--bg)]/50">
                        —
                      </div>
                    )}
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Yog Lines drawn as Gold Overlay Lines */}
        {highlightYogLines && activeYogas.length > 0 && (
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none z-20"
            viewBox="0 0 300 300"
            fill="none"
          >
            {activeYogas.map((yoga) => {
              // Row 1 (top), Row 2 (middle), Row 3 (bottom)
              if (yoga.id.includes('mental') || yoga.category.includes('1')) {
                return (
                  <line
                    key={yoga.id}
                    x1="25" y1="50" x2="275" y2="50"
                    stroke="#E8A317"
                    strokeWidth="3.5"
                    strokeDasharray="4 2"
                    className="drop-shadow-sm animate-pulse"
                  />
                );
              }
              if (yoga.id.includes('emotional') || yoga.category.includes('2')) {
                return (
                  <line
                    key={yoga.id}
                    x1="25" y1="150" x2="275" y2="150"
                    stroke="#E8A317"
                    strokeWidth="3.5"
                    strokeDasharray="4 2"
                    className="drop-shadow-sm animate-pulse"
                  />
                );
              }
              if (yoga.id.includes('practical') || yoga.category.includes('3')) {
                return (
                  <line
                    key={yoga.id}
                    x1="25" y1="250" x2="275" y2="250"
                    stroke="#E8A317"
                    strokeWidth="3.5"
                    strokeDasharray="4 2"
                    className="drop-shadow-sm animate-pulse"
                  />
                );
              }
              if (yoga.id.includes('rajayoga_golden')) {
                return (
                  <line
                    key={yoga.id}
                    x1="50" y1="50" x2="250" y2="250"
                    stroke="#E8A317"
                    strokeWidth="4"
                    className="drop-shadow-sm animate-pulse"
                  />
                );
              }
              return null;
            })}
          </svg>
        )}
      </div>

      {/* Selected Cell Detail Drawer / Tooltip */}
      {selectedCell && (
        <div className="w-full mt-3 p-2.5 rounded-xl bg-[var(--bg)] border border-[var(--border)] text-xs flex items-center justify-between">
          <div>
            <span className="font-bold font-serif text-[var(--heading)] mr-1.5">
              Sector #{selectedCell.number}:
            </span>
            <span className="text-[var(--text-muted)]">
              {locale === 'hi' ? selectedCell.significanceHi : selectedCell.significanceEn}
            </span>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[var(--chip-bg)] text-[var(--gold)] border border-[var(--border)]">
            {selectedCell.element}
          </span>
        </div>
      )}
    </div>
  );
}

// Wrap with memo so parent re-renders don't re-paint the expensive SVG grid
export const VedicGridMemo = memo(VedicGrid);
