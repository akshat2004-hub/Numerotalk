'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { EyeOff, ShieldAlert, CheckCircle, ArrowRight } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { SectionHeader } from '@/frontend/components/ui/SectionHeader';
import { NumberBadge } from '@/frontend/components/ui/NumberBadge';
import { PredictionCard } from '@/frontend/components/ui/PredictionCard';
import { ProfileEmptyBanner } from '@/frontend/components/ProfileEmptyBanner';
import { VedicGrid } from '@/frontend/components/VedicGrid';
import { useNumerologyStore } from '@/frontend/store/useNumerologyStore';
import { calculateVedicGrid, numerologyService } from '@/frontend';
import { MissingNumberReading } from '@/types';

export default function MissingPage() {
  const t = useTranslations('missingPage');
  const locale = (useLocale() || 'en') as 'en' | 'hi';
  const profile = useNumerologyStore((s) => s.profile);

  const dob = profile.dob || '1995-10-23';
  const grid = useMemo(() => calculateVedicGrid(dob), [dob]);
  const [missingReadings, setMissingReadings] = useState<MissingNumberReading[]>([]);

  useEffect(() => {
    numerologyService.getMissingNumberRemedies(grid.missingNumbers, locale).then(setMissingReadings);
  }, [grid.missingNumbers, locale]);

  return (
    <div className="space-y-6 sm:space-y-7">
      <SectionHeader
        title={t('title')}
        subtitle={t('subtitle')}
        icon={<EyeOff className="w-5 h-5 stroke-[1.5]" />}
      />

      <ProfileEmptyBanner />

      {/* Grid + Summary Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
        {/* Vedic Grid with missing cells highlighted */}
        <VedicGrid
          dob={dob}
          locale={locale}
          highlightMissing={true}
          title={locale === 'hi' ? 'वैदिक ग्रिड (अनुपस्थित अंक रेखांकित)' : 'Vedic Grid (Missing Highlighted)'}
          caption={locale === 'hi' ? 'डैश वृत्त से चिह्नित अंक ग्रिड में अनुपस्थित हैं' : 'Dashed circles denote absent frequencies'}
        />

        {/* Missing Numbers Summary Card */}
        <div className="vedic-card p-4 sm:p-5 space-y-4">
          <div>
            <span className="text-[10px] font-bold text-[var(--gold)] uppercase tracking-wider block mb-0.5">
              {locale === 'hi' ? 'ग्रिड में अनुपस्थित कुल अंक' : 'Total Missing Sectors'}
            </span>
            <h3 className="font-serif text-base sm:text-lg font-bold text-[var(--heading)]">
              {grid.missingNumbers.length} {locale === 'hi' ? 'अंक अनुपस्थित हैं' : 'Numbers Absent in 3x3 Grid'}
            </h3>
            <p className="text-xs text-[var(--text-muted)] mt-1">
              {locale === 'hi'
                ? 'इन अनुपस्थित अंकों के गुणों को विकसित करने हेतु संबंधित उपाय व रत्न अपनाएं।'
                : 'Adopt suitable gemstones, colors, and behavioral remedies to balance missing elemental energies.'}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {grid.missingNumbers.map((num) => (
              <NumberBadge
                key={num}
                number={num}
                size="md"
                className="border-dashed border-[var(--gold)] text-[var(--gold-deep)]"
              />
            ))}
          </div>
        </div>
      </div>

      {grid.missingNumbers.length === 0 ? (
        <div className="vedic-card p-8 text-center space-y-2">
          <CheckCircle className="w-8 h-8 text-[var(--success-text)] mx-auto stroke-[1.5]" />
          <h3 className="font-serif text-base font-bold text-[var(--heading)]">{t('noMissing')}</h3>
        </div>
      ) : (
        <PredictionCard
          title={locale === 'hi' ? 'अनुपस्थित अंक भविष्यफल' : 'Missing Number Prediction'}
          intro={
            locale === 'hi'
              ? 'जन्म ग्रिड में अनुपस्थित ऊर्जाओं का प्रभाव, मनोवैज्ञानिक प्रभाव एवं आवश्यक संतुलनकारी उपाय'
              : 'Deficiency impacts, psychological tendencies, and grounding remedial practices for missing digits'
          }
          itemKey="missing:missing_prediction"
          points={missingReadings.map((reading) => ({
            id: `missing_${reading.number}`,
            heading: `${locale === 'hi' ? 'अनुपस्थित अंक' : 'Missing Digit'} ${reading.number}`,
            body: `${locale === 'hi' ? reading.deficiencyImpact.hi : reading.deficiencyImpact.en} ${locale === 'hi' ? reading.psychologicalEffect.hi : reading.psychologicalEffect.en}`,
            subline: `${locale === 'hi' ? 'संतुलन अभ्यास / उपाय:' : 'Grounding practice:'} ${reading.remedies.map((r) => `${locale === 'hi' ? r.typeHi : r.type}: ${locale === 'hi' ? r.action.hi : r.action.en}`).join(' • ')}`,
            itemKey: `missing:digit:${reading.number}`
          }))}
        />
      )}
    </div>
  );
}
