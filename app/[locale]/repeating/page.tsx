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
          <CheckCircle className="w-8 h-8 text-[var(--success-text)] mx-auto stroke-[1.5]" />
          <h3 className="text-base font-serif font-bold text-[var(--heading)]">{t('noRepeating')}</h3>
        </div>
      ) : (
        <PredictionCard
          title={locale === 'hi' ? 'पुनरावृत्त अंक भविष्यफल' : 'Repeating Number Prediction'}
          intro={
            locale === 'hi'
              ? 'ग्रिड में एकाधिक बार आने वाले अंकों का प्रभाव, ऊर्जा अतिभार एवं संतुलनकारी अभ्यास'
              : 'Energetic intensity, cognitive amplification, and daily grounding practices for repeated digits'
          }
          itemKey="repeating:repeating_prediction"
          points={repeatingReadings.map((reading) => ({
            id: `rep_${reading.number}`,
            heading: `${locale === 'hi' ? 'अंक' : 'Digit'} ${reading.number} (${String(reading.number).repeat(reading.frequency)}) — ${locale === 'hi' ? reading.nature.hi : reading.nature.en}`,
            body: locale === 'hi' ? reading.overloadImpact.hi : reading.overloadImpact.en,
            subline: `${locale === 'hi' ? 'संतुलन अभ्यास:' : 'Grounding practice:'} ${locale === 'hi' ? reading.groundingRemedy.hi : reading.groundingRemedy.en}`,
            itemKey: `repeating:digit:${reading.number}`
          }))}
        />
      )}
    </div>
  );
}
