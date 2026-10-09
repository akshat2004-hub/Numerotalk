'use client';

import React, { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { BookOpen, Sparkles, Check, Plus } from 'lucide-react';
import { SectionHeader } from '@/frontend/components/ui/SectionHeader';
import { NumberBadge } from '@/frontend/components/ui/NumberBadge';
import { PredictionCard } from '@/frontend/components/ui/PredictionCard';
import { useNumerologyStore } from '@/frontend/store/useNumerologyStore';
import { getNumberMeaning, NumberMeaningInfo } from '@/core/engine/meanings108';

export default function NumberMeaningPage() {
  const t = useTranslations('numberMeaningsPage');
  const locale = (useLocale() || 'en') as 'en' | 'hi';
  const { reportSections, toggleReportSection } = useNumerologyStore();

  const [selectedBead, setSelectedBead] = useState<number>(23);
  const meaning: NumberMeaningInfo = getNumberMeaning(selectedBead);

  const sectionKey = `number_108_${selectedBead}`;
  const isAdded = !!reportSections?.[sectionKey];

  // Array of 1 to 108 for the Mala
  const allBeads = Array.from({ length: 108 }, (_, i) => i + 1);

  return (
    <div className="space-y-6 sm:space-y-7">
      <SectionHeader
        title={t('title')}
        subtitle={t('subtitle')}
        icon={<BookOpen className="w-5 h-5 stroke-[1.5]" />}
      />

      {/* 108 Mala Beads Interactive Grid */}
      <div className="vedic-card p-4 sm:p-5 space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pb-2 border-b border-[var(--border)]">
          <div>
            <h3 className="font-serif text-sm sm:text-base font-bold text-[var(--heading)] flex items-center gap-2">
              <span className="text-[var(--gold)] text-lg">📿</span>
              <span>{locale === 'hi' ? '108 वैदिक मनका माला (क्लिक कर अंक चुनें)' : 'Sacred Mala Grid (Click Any of 108 Beads)'}</span>
            </h3>
            <p className="text-[11px] text-[var(--text-muted)]">
              {locale === 'hi'
                ? 'वैदिक परंपरा में 108 ब्रह्मांडीय आवृत्तियां संपूर्ण सृष्टि का प्रतिनिधित्व करती हैं।'
                : '108 cosmic frequencies in Vedic cosmology spanning divine astral harmonics.'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-[var(--text-muted)]">Selected Bead:</span>
            <span className="w-8 h-8 rounded-full bg-[var(--gold)] text-slate-900 font-extrabold text-sm flex items-center justify-center shadow-xs">
              {selectedBead}
            </span>
          </div>
        </div>

        {/* The 108 Beads Grid */}
        <div className="grid grid-cols-9 sm:grid-cols-12 md:grid-cols-18 gap-1.5 p-2 rounded-2xl bg-[var(--surface)] border border-[var(--border)] max-h-56 overflow-y-auto scrollbar-thin">
          {allBeads.map((bead) => {
            const isSelected = selectedBead === bead;
            return (
              <button
                key={bead}
                type="button"
                onClick={() => setSelectedBead(bead)}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-serif font-bold transition-all cursor-pointer relative ${
                  isSelected
                    ? 'bg-gradient-to-br from-[#F0B53A] to-[#C98310] text-slate-950 font-black ring-2 ring-[var(--gold)] shadow-md scale-110 z-10'
                    : 'bg-[var(--chip-bg)] text-[var(--heading)] hover:bg-[var(--active-bg)] hover:scale-105 border border-[var(--border)]/60'
                }`}
                title={`Bead #${bead}`}
              >
                {bead}
              </button>
            );
          })}
        </div>
      </div>

      {/* Meaning & Prediction Display */}
      <div className="vedic-card p-4 sm:p-5 space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-4 border-b border-[var(--border)]">
          <div className="space-y-1 text-center md:text-left">
            <span className="text-[10px] font-bold text-[var(--gold)] uppercase tracking-wider">
              {locale === 'hi' ? meaning.statusHi : meaning.status}
            </span>
            <h2 className="text-xl sm:text-2xl font-bold font-serif text-[var(--heading)]">
              {meaning.number} — {locale === 'hi' ? meaning.titleHi : meaning.titleEn}
            </h2>
            <p className="text-[11.5px] text-[var(--text-muted)] font-serif">
              Root Planet: <strong className="text-[var(--gold)]">{locale === 'hi' ? meaning.rulerHi : meaning.rulerEn}</strong> (Compound Root {meaning.reduced})
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => toggleReportSection(sectionKey)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                isAdded
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                  : 'bg-[var(--chip-bg)] text-[var(--gold)] hover:bg-[var(--active-bg)] border border-[var(--border)]'
              }`}
            >
              {isAdded ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Plus className="w-3.5 h-3.5" />}
              <span>{isAdded ? (locale === 'hi' ? 'रिपोर्ट में शामिल' : 'In Report') : (locale === 'hi' ? 'रिपोर्ट में जोड़ें' : 'Add to report')}</span>
            </button>
            <NumberBadge number={meaning.number} size="lg" variant="gold" />
          </div>
        </div>

        {/* Esoteric Meaning */}
        <div className="space-y-1.5">
          <h4 className="text-xs font-bold font-serif text-[var(--heading)] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[var(--gold)]" />
            {t('esotericMeaning')}
          </h4>
          <p className="text-xs sm:text-[12.5px] text-[var(--text)] leading-relaxed max-w-4xl">
            {locale === 'hi' ? meaning.meaningHi : meaning.meaningEn}
          </p>
        </div>

        {/* Key Themes Chips */}
        <div className="pt-1">
          <span className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider block mb-1.5">
            {t('keyThemes')}
          </span>
          <div className="flex flex-wrap gap-1.5">
            {(locale === 'hi' ? meaning.keyThemesHi : meaning.keyThemesEn).map((th, i) => (
              <span
                key={i}
                className="px-2.5 py-1 rounded-xl bg-[var(--chip-bg)] border border-[var(--border)] text-[11px] text-[var(--heading)] font-semibold"
              >
                {th}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
