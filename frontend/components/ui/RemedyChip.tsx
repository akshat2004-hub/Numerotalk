'use client';

import React from 'react';
import { Gem, Flame, Heart, Compass, HeartHandshake, Sparkles } from 'lucide-react';
import { cn } from '@/frontend/utils';

interface RemedyChipProps {
  category: string;
  label: string;
  className?: string;
  onClick?: () => void;
}

export function RemedyChip({
  category,
  label,
  className,
  onClick
}: RemedyChipProps) {
  const getCategoryIcon = (cat: string) => {
    const c = cat.toLowerCase();
    if (c.includes('gem') || c.includes('crystal') || c.includes('रत्न')) {
      return <Gem className="w-3 h-3 stroke-[2] text-[var(--gold)]" />;
    }
    if (c.includes('mantra') || c.includes('मंत्र')) {
      return <Flame className="w-3 h-3 stroke-[2] text-[var(--gold)]" />;
    }
    if (c.includes('charity') || c.includes('daan') || c.includes('दान') || c.includes('सेवा')) {
      return <HeartHandshake className="w-3 h-3 stroke-[2] text-[var(--gold)]" />;
    }
    if (c.includes('vastu') || c.includes('दिशा') || c.includes('वास्तु')) {
      return <Compass className="w-3 h-3 stroke-[2] text-[var(--gold)]" />;
    }
    return <Sparkles className="w-3 h-3 stroke-[2] text-[var(--gold)]" />;
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11.5px] font-medium',
        'bg-[var(--chip-bg)] border border-[var(--border)] text-[var(--heading)]',
        'hover:border-[var(--gold)] hover:bg-[var(--active-bg)]',
        'transition-all duration-150 select-none text-left shadow-2xs cursor-pointer',
        className
      )}
    >
      <span className="shrink-0">{getCategoryIcon(category)}</span>
      <span className="text-[var(--gold)] font-semibold">{category}:</span>
      <span className="truncate max-w-xs text-[var(--text)]">{label}</span>
    </button>
  );
}
