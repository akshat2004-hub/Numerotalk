'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Repeat, Compass, CheckCircle } from 'lucide-react';
import { SectionHeader } from '@/frontend/components/ui/SectionHeader';
import { NumberBadge } from '@/frontend/components/ui/NumberBadge';
import { PredictionCard } from '@/frontend/components/ui/PredictionCard';
import { ProfileEmptyBanner } from '@/frontend/components/ProfileEmptyBanner';
import { VedicGrid } from '@/frontend/components/VedicGrid';
import { useNumerologyStore } from '@/frontend/store/useNumerologyStore';
import { calculateVedicGrid, numerologyService } from '@/frontend';
import { RepeatingNumberReading } from '@/types';

export default function RepeatingPage() {
  const t = useTranslations('repeatingPage');
  const locale = (useLocale() || 'en') as 'en' | 'hi';
  const profile = useNumerologyStore((s) => s.profile);

  const dob = profile.dob || '1995-10-23';
  const grid = useMemo(() => calculateVedicGrid(dob), [dob]);
  const [repeatingReadings, setRepeatingReadings] = useState<RepeatingNumberReading[]>([]);

  useEffect(() => {
    numerologyService.getRepeatingNumberReadings(grid.repeatingNumbers, locale).then(setRepeatingReadings);
  }, [grid.repeatingNumbers, locale]);

  return (
    <div className="space-y-6 sm:space-y-7">
      <SectionHeader
        title={t('title')}
        subtitle={t('subtitle')}
        icon={<Repeat className="w-5 h-5 stroke-[1.5]" />}
      />

      <ProfileEmptyBanner />

      {/* Grid + Repeating Summary Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
        {/* Vedic Grid with repeating cells highlighted */}
        <VedicGrid
          dob={dob}
          locale={locale}
          highlightRepeating={true}
          title={locale === 'hi' ? 'वैदिक ग्रिड (पुनरावृत्ति अंक)' : 'Vedic Grid (Repeating Highlighted)'}
          caption={locale === 'hi' ? 'दोहराए गए अंकों पर बारंबारता बैज प्रदर्शित हैं' : 'Repeating digits show multiplier badges'}
        />

        {/* Top Repeating Summary Card */}
        <div className="vedic-card p-4 sm:p-5 space-y-4">
          <div>
            <span className="text-[10px] font-bold text-[var(--gold)] uppercase tracking-wider block mb-0.5">
              {locale === 'hi' ? 'ग्रिड में दोहराव वाले अंक' : 'Amplified Vibrations in Grid'}
            </span>
            <h3 className="text-base sm:text-lg font-bold font-serif text-[var(--heading)]">
              {grid.repeatingNumbers.length} {locale === 'hi' ? 'अंक 2 या अधिक बार उपस्थित हैं' : 'Digits Occur Multiple Times'}
            </h3>
            <p className="text-xs text-[var(--text-muted)] mt-1">
              {locale === 'hi'
                ? 'किसी भी अंक की अत्यधिक आवृत्ति उस ग्रह की ऊर्जा का अतिप्रवाह दर्शाती है, जिसे संतुलित करना आवश्यक है।'
                : 'Excessive occurrence of any digit amplifies planetary energy, which requires grounding techniques.'}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {grid.repeatingNumbers.map((rep) => (
              <div
                key={rep.number}
                className="flex items-center gap-1.5 p-1.5 px-2.5 rounded-xl bg-[var(--surface)] border border-[var(--border)]"
              >
                <NumberBadge number={rep.number} size="sm" variant="gold" />
                <span className="text-xs font-serif font-bold text-[var(--gold)]">
                  ×{rep.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {grid.repeatingNumbers.length === 0 ? (
        <div className="vedic-card p-8 text-center space-y-2">
          <CheckCircle className="w-8 h-8 text-emerald-600 mx-auto stroke-[1.5]" />
          <h3 className="text-base font-serif font-bold text-[var(--heading)]">{t('noRepeating')}</h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {repeatingReadings.map((reading) => (
            <PredictionCard
              key={`${reading.number}-${reading.frequency}`}
              title={`${locale === 'hi' ? 'अंक' : 'Number'} ${reading.number} (${String(reading.number).repeat(reading.frequency)})`}
              badge={t('frequencyBadge', { count: reading.frequency })}
              badgeVariant="gold"
              sectionKey={`module5_repeating_${reading.number}_${reading.frequency}`}
              icon={<Repeat className="w-4 h-4 text-[var(--gold)] stroke-[1.5]" />}
            >
              <div className="space-y-3">
                <div>
                  <span className="text-[10.5px] font-bold text-[var(--gold)] uppercase tracking-wider block mb-0.5">
                    {locale === 'hi' ? reading.nature.hi : reading.nature.en}
                  </span>
                  <p className="text-[12.5px] text-[var(--text)] leading-relaxed">
                    {locale === 'hi' ? reading.overloadImpact.hi : reading.overloadImpact.en}
                  </p>
                </div>

                <div className="pt-2 border-t border-[var(--border)]">
                  <span className="text-[10.5px] font-bold text-emerald-700 uppercase tracking-wider block mb-1 flex items-center gap-1">
                    <Compass className="w-3 h-3 text-emerald-600" />
                    {t('groundingTitle')}
                  </span>
                  <p className="text-[11.5px] text-[var(--text)] leading-relaxed p-2.5 rounded-xl bg-[var(--surface)] border border-[var(--border)]">
                    {locale === 'hi' ? reading.groundingRemedy.hi : reading.groundingRemedy.en}
                  </p>
                </div>
              </div>
            </PredictionCard>
          ))}
        </div>
      )}
    </div>
  );
}
