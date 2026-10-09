'use client';

import React, { useState, useMemo } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Clock, Sparkles, CheckCircle2 } from 'lucide-react';
import { SectionHeader } from '@/frontend/components/ui/SectionHeader';
import { NumberBadge } from '@/frontend/components/ui/NumberBadge';
import { PredictionCard } from '@/frontend/components/ui/PredictionCard';
import { ProfileEmptyBanner } from '@/frontend/components/ProfileEmptyBanner';
import { useNumerologyStore } from '@/frontend/store/useNumerologyStore';
import { calculateMulank, calculateBhagyank, getNumberRelationship } from '@/frontend';
import { calculateTimeNumerology, TimePredictionResult } from '@/core/engine/timeNumerology';

export default function TimePage() {
  const t = useTranslations('timePage');
  const locale = (useLocale() || 'en') as 'en' | 'hi';
  const profile = useNumerologyStore((s) => s.profile);

  // Parse birthTime if available, else current time
  const parseBirthTime = () => {
    if (profile.birthTime && profile.birthTime.includes(':')) {
      const [h, m] = profile.birthTime.split(':').map(Number);
      return { h: isNaN(h) ? 10 : h, m: isNaN(m) ? 30 : m };
    }
    const now = new Date();
    return { h: now.getHours(), m: now.getMinutes() };
  };

  const initial = parseBirthTime();
  const [hours, setHours] = useState(initial.h);
  const [minutes, setMinutes] = useState(initial.m);

  const mulank = useMemo(
    () => profile.dob ? calculateMulank(profile.dob).mulank : 5,
    [profile.dob]
  );
  const bhagyank = useMemo(
    () => profile.dob ? calculateBhagyank(profile.dob).bhagyank : 3,
    [profile.dob]
  );

  const timeResult: TimePredictionResult = useMemo(
    () => calculateTimeNumerology(hours, minutes),
    [hours, minutes]
  );

  // Relationships between Time Number and Mulank / Bhagyank
  const relationToMulank = useMemo(
    () => getNumberRelationship(timeResult.totalReduced, mulank),
    [timeResult.totalReduced, mulank]
  );
  const relationToBhagyank = useMemo(
    () => getNumberRelationship(timeResult.totalReduced, bhagyank),
    [timeResult.totalReduced, bhagyank]
  );

  const handleSetCurrent = () => {
    const current = new Date();
    setHours(current.getHours());
    setMinutes(current.getMinutes());
  };

  const getRelationBadge = (rel: string) => {
    if (rel === 'friendly') return { text: locale === 'hi' ? 'परम मित्र' : 'Harmonious Friend', color: 'emerald' };
    if (rel === 'enemy') return { text: locale === 'hi' ? 'विपरीत / शत्रु' : 'Inimical Friction', color: 'crimson' };
    return { text: locale === 'hi' ? 'तटस्थ' : 'Neutral Vibration', color: 'gold' };
  };

  const mulankBadge = getRelationBadge(relationToMulank);
  const bhagyankBadge = getRelationBadge(relationToBhagyank);

  return (
    <div className="space-y-6 sm:space-y-7">
      <SectionHeader
        title={t('title')}
        subtitle={t('subtitle')}
        icon={<Clock className="w-5 h-5 stroke-[1.5]" />}
      />

      <ProfileEmptyBanner />

      {/* Clock Input Card */}
      <div className="vedic-card p-4 sm:p-5 space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div>
              <label className="block text-[11px] font-semibold text-[var(--text-muted)] mb-0.5">{t('hours')}</label>
              <input
                type="number"
                min={0}
                max={23}
                value={hours}
                onChange={(e) => setHours(Math.min(23, Math.max(0, Number(e.target.value))))}
                className="w-20 px-3 py-1.5 h-[40px] rounded-xl bg-[var(--surface)] border border-[var(--input-border)] font-serif text-center text-lg font-bold text-[var(--heading)] focus:border-[var(--gold)] outline-hidden"
              />
            </div>
            <span className="text-xl font-bold text-[var(--gold)] mt-4">:</span>
            <div>
              <label className="block text-[11px] font-semibold text-[var(--text-muted)] mb-0.5">{t('minutes')}</label>
              <input
                type="number"
                min={0}
                max={59}
                value={minutes}
                onChange={(e) => setMinutes(Math.min(59, Math.max(0, Number(e.target.value))))}
                className="w-20 px-3 py-1.5 h-[40px] rounded-xl bg-[var(--surface)] border border-[var(--input-border)] font-serif text-center text-lg font-bold text-[var(--heading)] focus:border-[var(--gold)] outline-hidden"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={handleSetCurrent}
            className="btn-vedic-secondary px-4 py-2 h-[40px] text-xs font-semibold rounded-xl cursor-pointer"
          >
            {t('useCurrentTime')}
          </button>
        </div>
      </div>

      {/* Relation to Mulank & Bhagyank Banner */}
      <div className="vedic-card p-4 sm:p-5 space-y-3">
        <h4 className="font-serif text-sm font-semibold text-[var(--heading)]">
          {locale === 'hi' ? 'समय अंक का मूलांक व भाग्यांक से संबंध' : 'Relation of Time Number to Mulank & Bhagyank'}
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-2xl bg-[var(--surface)] border border-[var(--border)] flex items-center justify-between">
            <div>
              <span className="text-[10px] text-[var(--text-muted)] block">Time ({timeResult.totalReduced}) ↔ Mulank ({mulank})</span>
              <span className="font-bold text-[var(--heading)] text-xs mt-0.5 block">{mulankBadge.text}</span>
            </div>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
              mulankBadge.color === 'emerald' ? 'bg-[var(--success-bg)] text-[var(--success-text)] border border-[var(--success-border)]' :
              mulankBadge.color === 'crimson' ? 'bg-[var(--warn-bg)] text-[var(--warn-text)] border border-[var(--warn-border)]' :
              'bg-[var(--chip-bg)] text-[var(--gold)]'
            }`}>
              {relationToMulank.toUpperCase()}
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-[var(--surface)] border border-[var(--border)] flex items-center justify-between">
            <div>
              <span className="text-[10px] text-[var(--text-muted)] block">Time ({timeResult.totalReduced}) ↔ Bhagyank ({bhagyank})</span>
              <span className="font-bold text-[var(--heading)] text-xs mt-0.5 block">{bhagyankBadge.text}</span>
            </div>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
              bhagyankBadge.color === 'emerald' ? 'bg-[var(--success-bg)] text-[var(--success-text)] border border-[var(--success-border)]' :
              bhagyankBadge.color === 'crimson' ? 'bg-[var(--warn-bg)] text-[var(--warn-text)] border border-[var(--warn-border)]' :
              'bg-[var(--chip-bg)] text-[var(--gold)]'
            }`}>
              {relationToBhagyank.toUpperCase()}
            </span>
          </div>
        </div>
      </div>

      {/* Prediction Output */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
        {/* Timestamp & Root */}
        <div className="vedic-card p-4 sm:p-5 text-center space-y-3">
          <span className="text-[10px] font-bold text-[var(--gold)] uppercase tracking-wider block">
            {t('totalVibration')}
          </span>

          <div className="font-serif text-3xl font-bold text-[var(--heading)]">
            {timeResult.timeString}
          </div>

          <NumberBadge number={timeResult.totalReduced} size="lg" variant="gold" />

          <div className="text-[11px] text-[var(--text-muted)] font-serif pt-1">
            <span>Hour: {timeResult.hourReduced}</span>
            <span className="mx-1.5">•</span>
            <span>Min: {timeResult.minuteReduced}</span>
          </div>
        </div>

        {/* Hora & Quality */}
        <div className="md:col-span-2 space-y-4">
          <PredictionCard
            title={locale === 'hi' ? timeResult.omenQualityHi : timeResult.omenQuality}
            badge={locale === 'hi' ? timeResult.planetaryHourHi : timeResult.planetaryHourEn}
            badgeVariant={
              timeResult.omenQuality.includes('Auspicious')
                ? 'emerald'
                : timeResult.omenQuality.includes('Challenging')
                ? 'crimson'
                : 'gold'
            }
            sectionKey="module14_time_prediction"
            icon={<Sparkles className="w-4 h-4 text-[var(--gold)]" />}
          >
            <p className="text-xs sm:text-[12.5px] text-[var(--text)] leading-relaxed">
              {locale === 'hi' ? timeResult.guidanceHi : timeResult.guidanceEn}
            </p>

            <div className="pt-2.5 border-t border-[var(--border)] space-y-1.5">
              <span className="text-[10px] font-bold text-[var(--gold)] uppercase tracking-wider block">
                {t('bestSuitedFor')}
              </span>
              <ul className="space-y-1 text-xs">
                {(locale === 'hi' ? timeResult.bestSuitedForHi : timeResult.bestSuitedForEn).map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-[var(--heading)]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[var(--success-text)] shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </PredictionCard>
        </div>
      </div>
    </div>
  );
}
