'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Crown, Sparkles, Briefcase, Heart, CheckCircle2 } from 'lucide-react';
import { SectionHeader } from '@/frontend/components/ui/SectionHeader';
import { NumberBadge } from '@/frontend/components/ui/NumberBadge';
import { CompoundNumber } from '@/frontend/components/ui/CompoundNumber';
import { PredictionCard } from '@/frontend/components/ui/PredictionCard';
import { ProfileEmptyBanner } from '@/frontend/components/ProfileEmptyBanner';
import { useNumerologyStore } from '@/frontend/store/useNumerologyStore';
import { calculateDestinyNumber, numerologyService } from '@/frontend';
import { DestinyReading } from '@/core/types';

export default function DestinyPage() {
  const t = useTranslations('destinyPage');
  const locale = (useLocale() || 'en') as 'en' | 'hi';
  const { profile } = useNumerologyStore();

  const [destinyReading, setDestinyReading] = useState<DestinyReading | null>(null);

  const destinyCalc = useMemo(
    () => calculateDestinyNumber(profile.name || 'Rahul Sharma'),
    [profile.name]
  );

  useEffect(() => {
    numerologyService.getDestinyReading(destinyCalc.destinyNumber, locale).then(setDestinyReading);
  }, [destinyCalc.destinyNumber, locale]);

  return (
    <div className="space-y-6 sm:space-y-7">
      <SectionHeader
        title={t('title')}
        subtitle={t('subtitle')}
        icon={<Crown className="w-5 h-5 stroke-[1.5]" />}
      />

      <ProfileEmptyBanner />

      {/* Top Banner: Name & Number Card */}
      <div className="vedic-card p-4 sm:p-5">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center md:text-left">
            <span className="text-[10px] font-bold text-[var(--gold)] uppercase tracking-wider font-sans">
              {locale === 'hi' ? 'वैदिक नामांक पद्धति' : 'Vedic Destiny Standard'}
            </span>
            <h2 className="font-serif text-lg sm:text-xl font-bold text-[var(--heading)]">
              {profile.name || 'Rahul Sharma'}
            </h2>
            {destinyCalc.isDevanagari && (
              <p className="text-[11px] font-mono text-[var(--text-muted)]">
                Transliteration: <strong className="text-[var(--gold)]">{destinyCalc.transliteratedName}</strong>
              </p>
            )}
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-[10px] text-[var(--text-muted)] block">{t('compoundLabel')}</span>
              <CompoundNumber compound={destinyCalc.compound} reduced={destinyCalc.reduced} size="sm" />
            </div>
            <NumberBadge number={destinyCalc.destinyNumber} size="lg" />
          </div>
        </div>

        {/* Letter Breakdown */}
        <div className="mt-4 pt-3.5 border-t border-[var(--border)]">
          <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider block mb-2 font-sans">
            {t('breakdownTitle')}
          </span>
          <div className="flex flex-wrap gap-1.5">
            {destinyCalc.letterBreakdown.map((item, idx) => (
              <div
                key={idx}
                className="px-2.5 py-1 rounded-xl bg-[var(--surface)] border border-[var(--border)] flex flex-col items-center min-w-[2rem]"
              >
                <span className="font-serif text-xs font-bold text-[var(--heading)]">{item.char}</span>
                <span className="text-[10px] font-mono font-bold text-[var(--gold)]">
                  {item.value}
                </span>
              </div>
            ))}
            <div className="px-3 py-1 rounded-xl bg-[var(--chip-bg)] border border-[var(--border)] flex items-center gap-1.5">
              <span className="text-[10px] text-[var(--heading)] font-semibold">{t('compoundLabel')}</span>
              <CompoundNumber compound={destinyCalc.compound} reduced={destinyCalc.reduced} size="sm" />
            </div>
          </div>
        </div>
      </div>

      {/* Reading Grid */}
      {destinyReading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Life Mission */}
          <PredictionCard
            title={t('missionTitle')}
            badge={`Destiny ${destinyReading.number}`}
            badgeVariant="gold"
            sectionKey="module2_mission"
            icon={<Sparkles className="w-4 h-4 text-[var(--gold)] stroke-[1.5]" />}
          >
            <p className="text-[var(--text)] leading-relaxed text-[12.5px]">
              {locale === 'hi' ? destinyReading.lifeMission.hi : destinyReading.lifeMission.en}
            </p>
          </PredictionCard>

          {/* Core Strengths */}
          <PredictionCard
            title={t('strengthsTitle')}
            badge="Superpowers"
            badgeVariant="emerald"
            sectionKey="module2_strengths"
            icon={<Crown className="w-4 h-4 text-emerald-600 stroke-[1.5]" />}
          >
            <ul className="space-y-1.5 text-[12.5px]">
              {destinyReading.coreStrengths.map((str, i) => (
                <li key={i} className="flex items-start gap-2 text-[var(--text)]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 stroke-[1.5] shrink-0 mt-0.5" />
                  <span>{locale === 'hi' ? str.hi : str.en}</span>
                </li>
              ))}
            </ul>
          </PredictionCard>

          {/* Career Avenues */}
          <PredictionCard
            title={t('careerTitle')}
            badge="Professional Scope"
            badgeVariant="indigo"
            sectionKey="module2_career"
            icon={<Briefcase className="w-4 h-4 text-[var(--gold)] stroke-[1.5]" />}
          >
            <ul className="space-y-1.5 text-[12.5px] text-[var(--text)]">
              {destinyReading.careerAvenues.map((car, i) => (
                <li key={i} className="p-2 rounded-xl bg-[var(--surface)] border border-[var(--border)]">
                  {locale === 'hi' ? car.hi : car.en}
                </li>
              ))}
            </ul>
          </PredictionCard>

          {/* Relationship Style */}
          <PredictionCard
            title={t('relationshipTitle')}
            badge="Social Dynamics"
            badgeVariant="crimson"
            sectionKey="module2_relationship"
            icon={<Heart className="w-4 h-4 text-rose-500 stroke-[1.5]" />}
          >
            <p className="text-[var(--text)] leading-relaxed text-[12.5px]">
              {locale === 'hi' ? destinyReading.relationshipStyle.hi : destinyReading.relationshipStyle.en}
            </p>
          </PredictionCard>
        </div>
      )}
    </div>
  );
}
