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

  const content = (
    <>
      <span className="shrink-0 mt-0.5 flex items-center justify-center leading-none [&>svg]:block [&>svg]:shrink-0 [&>svg]:m-0">
        {getCategoryIcon(category)}
      </span>
      <span className="flex-1 min-w-0 leading-relaxed break-words whitespace-normal text-xs">
        <span className="text-[var(--gold)] font-bold mr-1.5">{category}:</span>
        <span className="text-[var(--text)] break-words">{label}</span>
      </span>
    </>
  );

  const sharedClasses = cn(
    'w-full max-w-full text-left inline-flex flex-row items-start gap-2 p-2.5 sm:px-3 sm:py-2 rounded-[12px] text-xs font-normal leading-relaxed break-words whitespace-normal',
    'bg-[var(--chip-bg)] border border-[var(--border)] text-[var(--heading)]',
    'transition-all duration-150 shadow-2xs',
    onClick && 'hover:border-[var(--gold)] hover:bg-[var(--active-bg)] cursor-pointer',
    className
  );

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={cn(sharedClasses, 'whitespace-normal')}
      >
        {content}
      </button>
    );
  }

  return (
    <div className={sharedClasses}>
      {content}
    </div>
  );
}
