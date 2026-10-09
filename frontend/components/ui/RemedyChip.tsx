'use client';

import React from 'react';
import { Gem, Flame, Heart, Compass, HeartHandshake, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

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
      return <Gem className="w-3 h-3 stroke-[2] text-[#D97706]" />;
    }
    if (c.includes('mantra') || c.includes('मंत्र')) {
      return <Flame className="w-3 h-3 stroke-[2] text-[#D97706]" />;
    }
    if (c.includes('charity') || c.includes('daan') || c.includes('दान') || c.includes('सेवा')) {
      return <HeartHandshake className="w-3 h-3 stroke-[2] text-[#D97706]" />;
    }
    if (c.includes('vastu') || c.includes('दिशा') || c.includes('वास्तु')) {
      return <Compass className="w-3 h-3 stroke-[2] text-[#D97706]" />;
    }
    return <Sparkles className="w-3 h-3 stroke-[2] text-[#D97706]" />;
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11.5px] font-medium',
        'bg-[#FFFDF9] border border-[#F1E7D6] text-[#0F172A]',
        'hover:border-[#D97706] hover:bg-[#FFF2D6]',
        'transition-all duration-150 select-none text-left shadow-2xs cursor-pointer',
        className
      )}
    >
      <span className="shrink-0">{getCategoryIcon(category)}</span>
      <span className="text-[#D97706] font-semibold">{category}:</span>
      <span className="truncate max-w-xs text-[#475569]">{label}</span>
    </button>
  );
}
