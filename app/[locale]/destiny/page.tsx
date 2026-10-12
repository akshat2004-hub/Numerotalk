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

      {/* Reading Grid: Single Destiny Prediction Card with 4 Numbered Points */}
      {destinyReading && (
        <PredictionCard
          title={locale === 'hi' ? 'भाग्यांक भविष्यफल' : 'Destiny Prediction'}
          intro={
            locale === 'hi'
              ? `भाग्यांक ${destinyReading.number} — जीवन का सर्वोच्च उद्देश्य, करियर एवं सामाजिक सामर्थ्य`
              : `Destiny Number ${destinyReading.number} — Comprehensive cosmic purpose, core strengths, and career avenues`
          }
          itemKey="destiny:destiny_prediction"
          points={[
            {
              id: 'destiny_pt_1',
              heading: locale === 'hi' ? 'जीवन उद्देश्य एवं पुकार' : 'Life Mission & Calling',
              body: locale === 'hi' ? destinyReading.lifeMission.hi : destinyReading.lifeMission.en,
              itemKey: 'destiny:point:life_mission'
            },
            {
              id: 'destiny_pt_2',
              heading: locale === 'hi' ? 'मूल शक्तियां' : 'Core Strengths',
              body: destinyReading.coreStrengths.map((str) => (locale === 'hi' ? str.hi : str.en)).join(' • '),
              itemKey: 'destiny:point:core_strengths'
            },
            {
              id: 'destiny_pt_3',
              heading: locale === 'hi' ? 'सर्वोत्तम करियर क्षेत्र' : 'Optimal Career Avenues',
              body: destinyReading.careerAvenues.map((car) => (locale === 'hi' ? car.hi : car.en)).join(' • '),
              itemKey: 'destiny:point:optimal_career_avenues'
            },
            {
              id: 'destiny_pt_4',
              heading: locale === 'hi' ? 'संबंध एवं सामाजिक व्यक्तित्व' : 'Relationship & Social Persona',
              body: locale === 'hi' ? destinyReading.relationshipStyle.hi : destinyReading.relationshipStyle.en,
              itemKey: 'destiny:point:relationship_social_persona'
            }
          ]}
        />
      )}
    </div>
  );
}
