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
            <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider block mb-0.5">
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
                className="border-dashed border-[var(--gold)] text-amber-800"
              />
            ))}
          </div>
        </div>
      </div>

      {grid.missingNumbers.length === 0 ? (
        <div className="vedic-card p-8 text-center space-y-2">
          <CheckCircle className="w-8 h-8 text-emerald-600 mx-auto stroke-[1.5]" />
          <h3 className="font-serif text-base font-bold text-[var(--heading)]">{t('noMissing')}</h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {missingReadings.map((reading) => (
            <PredictionCard
              key={reading.number}
              title={`${locale === 'hi' ? 'अनुपस्थित अंक' : 'Missing Number'} ${reading.number}`}
              badge={`Sector ${reading.number}`}
              badgeVariant="gold"
              sectionKey={`module4_missing_${reading.number}`}
              icon={<ShieldAlert className="w-4 h-4 text-amber-600 stroke-[1.5]" />}
            >
              <div className="space-y-3">
                <div>
                  <span className="text-[10.5px] font-bold text-[var(--text-muted)] uppercase tracking-wider block mb-0.5">
                    {t('impactTitle')}
                  </span>
                  <p className="text-[12.5px] text-[var(--heading)] leading-relaxed font-medium">
                    {locale === 'hi' ? reading.deficiencyImpact.hi : reading.deficiencyImpact.en}
                  </p>
                  <p className="text-[11.5px] text-[var(--text)] mt-1.5 leading-relaxed">
                    {locale === 'hi' ? reading.psychologicalEffect.hi : reading.psychologicalEffect.en}
                  </p>
                </div>

                <div className="pt-2 border-t border-[var(--border)]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10.5px] font-bold text-[var(--gold)] uppercase tracking-wider">
                      {t('remediesTitle')}
                    </span>
                  </div>

                  {/* Linked Remedy Chips */}
                  <div className="flex flex-wrap gap-1.5 mb-2.5">
                    {reading.remedies.map((rem, idx) => (
                      <Link
                        key={idx}
                        href="/remedies"
                        className="px-2 py-0.5 rounded-lg bg-[var(--chip-bg)] border border-[var(--border)] text-[10.5px] font-semibold text-[var(--heading)] hover:bg-[var(--active-bg)] transition-colors flex items-center gap-1"
                      >
                        <span className="text-[var(--gold)]">✦</span>
                        <span>{locale === 'hi' ? rem.typeHi : rem.type}</span>
                      </Link>
                    ))}
                  </div>

                  <div className="space-y-1.5">
                    {reading.remedies.map((rem, idx) => (
                      <div key={idx} className="p-2.5 rounded-xl bg-[var(--surface)] border border-[var(--border)] space-y-0.5">
                        <span className="text-xs font-bold text-[var(--gold)]">
                          {locale === 'hi' ? rem.typeHi : rem.type}:
                        </span>
                        <p className="text-[11.5px] text-[var(--text)] leading-relaxed">
                          {locale === 'hi' ? rem.action.hi : rem.action.en}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </PredictionCard>
          ))}
        </div>
      )}
    </div>
  );
}
