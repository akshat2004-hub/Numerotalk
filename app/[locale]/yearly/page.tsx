'use client';

import React, { useState, useMemo } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { CalendarDays, Sparkles, Compass, CheckCircle2, Repeat, Layers } from 'lucide-react';
import { SectionHeader } from '@/frontend/components/ui/SectionHeader';
import { NumberBadge } from '@/frontend/components/ui/NumberBadge';
import { VedicGrid } from '@/frontend/components/VedicGrid';
import { ProfileEmptyBanner } from '@/frontend/components/ProfileEmptyBanner';
import { PredictionCard } from '@/frontend/components/ui/PredictionCard';
import { YearSelector } from '@/frontend/components/ui/YearSelector';
import { useNumerologyStore } from '@/frontend/store/useNumerologyStore';
import { calculateYearlyPrediction, YearlyPredictionResult, DashaPeriod } from '@/core/engine/dasha';

export default function YearlyPage() {
  const t = useTranslations('yearlyPage');
  const locale = (useLocale() || 'en') as 'en' | 'hi';
  const profile = useNumerologyStore((s) => s.profile);
  const isProfileEmpty = !profile.name || !profile.dob;

  const currentYear = new Date().getFullYear();
  const [targetYear, setTargetYear] = useState<number>(currentYear);

  const dob = profile.dob || '1995-10-23';
  const birthYear = profile.dob ? parseInt(profile.dob.split('-')[0], 10) : undefined;
  const prediction: YearlyPredictionResult = useMemo(
    () => calculateYearlyPrediction(dob, targetYear),
    [dob, targetYear]
  );

  const dashaLevels: DashaPeriod[] = [
    prediction.mahadasha,
    prediction.antardasha,
    prediction.pratyantraDasha
  ];

  return (
    <div className="space-y-6 sm:space-y-7">
      <SectionHeader
        title={t('title')}
        subtitle={t('subtitle')}
        icon={<CalendarDays className="w-5 h-5 sm:w-6 sm:h-6" />}
      />

      {isProfileEmpty && <ProfileEmptyBanner locale={locale} />}

      {/* Year Picker Ribbon */}
      <div className="vedic-card p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="text-[10px] font-bold text-[var(--gold)] uppercase tracking-wider block mb-0.5">
            {t('selectYear')}
          </span>
          <h3 className="text-base sm:text-lg font-bold font-serif text-[var(--heading)]">
            {locale === 'hi' ? `वर्ष ${targetYear}/${targetYear + 1} का सूक्ष्म विश्लेषण` : `Cosmic Reading for Year ${targetYear}/${targetYear + 1}`}
          </h3>
        </div>

        <div>
          <YearSelector
            selectedYear={targetYear}
            onChange={setTargetYear}
            birthYear={birthYear}
            locale={locale}
          />
        </div>
      </div>

      {/* Personal Year Banner */}
      <div className="vedic-card p-4 sm:p-5">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left space-y-1.5">
            <span className="text-[10px] font-bold text-[var(--gold)] uppercase tracking-wider">
              {t('personalYearLabel')}
            </span>
            <div className="text-xl sm:text-2xl font-bold font-serif text-[var(--heading)] flex items-center gap-2.5 justify-center md:justify-start">
              <span>{locale === 'hi' ? `पर्सनल ईयर ${prediction.personalYear}` : `Personal Year ${prediction.personalYear}`}</span>
              <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[var(--chip-bg)] text-[var(--gold)] border border-[var(--border)]">
                {locale === 'hi' ? prediction.personalYearRulerHi : prediction.personalYearRulerEn}
              </span>
            </div>
            <p className="text-xs text-[var(--text-muted)] max-w-xl leading-relaxed">
              {locale === 'hi' ? prediction.summaryHi : prediction.summaryEn}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <NumberBadge number={prediction.personalYear} size="lg" variant="gold" />
          </div>
        </div>
      </div>

      {/* Nested Dasha Timeline */}
      <div className="vedic-card p-4 sm:p-5 space-y-3">
        <h3 className="text-sm sm:text-base font-bold font-serif text-[var(--heading)] flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[var(--gold)]" />
          {locale === 'hi' ? 'दशा पदानुक्रम एवं सक्रिय समयरेखा' : 'Dasha Hierarchy & Active Timeline'}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {dashaLevels.map((dasha, idx) => (
            <div
              key={dasha.level}
              className="p-3.5 rounded-2xl bg-[var(--bg)] border border-[var(--border)] space-y-1.5 relative overflow-hidden"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--gold)]">
                  {idx + 1}. {locale === 'hi' ? dasha.levelHi : dasha.level}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--chip-bg)] text-[var(--gold)] font-bold">
                  #{dasha.rulingNumber}
                </span>
              </div>
              <div className="font-serif font-bold text-sm text-[var(--heading)]">
                {locale === 'hi' ? dasha.periodLabelHi : dasha.periodLabel}
              </div>
              <div className="text-[11px] text-[var(--text-muted)]">
                {locale === 'hi' ? dasha.rulerPlanetHi : dasha.rulerPlanetEn}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Three Stacked Levels: Mahadasha, Antardasha, Pratyantar Dasha */}
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold font-serif text-[var(--heading)] flex items-center gap-2">
            <Layers className="w-4 h-4 text-[var(--gold)]" />
            {locale === 'hi' ? 'तीनों दशा स्तर (व्यक्तिगत ग्रिड सहित)' : 'Three Stacked Dasha Levels (with Individual Grids)'}
          </h3>
          <span className="text-xs text-[var(--text-muted)]">
            {locale === 'hi' ? 'दशा अंक ग्रिड में हाइलाइट किया गया है' : 'Dasha digit highlighted in each grid'}
          </span>
        </div>

        {dashaLevels.map((dasha, index) => (
          <div key={dasha.level} className="vedic-card p-5 sm:p-6 space-y-4">
            {/* Level Title Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[var(--border)]">
              <div className="flex items-center gap-3">
                <NumberBadge number={dasha.rulingNumber} size="md" variant="gold" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[var(--gold)] uppercase tracking-wider">
                      Level {index + 1}
                    </span>
                    <span className="text-xs text-[var(--text-muted)]">•</span>
                    <span className="text-xs font-semibold text-[var(--text-muted)]">
                      {locale === 'hi' ? dasha.periodLabelHi : dasha.periodLabel}
                    </span>
                  </div>
                  <h4 className="text-base sm:text-lg font-bold font-serif text-[var(--heading)]">
                    {locale === 'hi' ? dasha.levelHi : dasha.level} — {locale === 'hi' ? dasha.rulerPlanetHi : dasha.rulerPlanetEn} (अंक {dasha.rulingNumber})
                  </h4>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-[var(--chip-bg)] text-[var(--gold)] border border-[var(--border)]">
                {locale === 'hi' ? `सक्रिय अंक ${dasha.rulingNumber}` : `Active Digit: ${dasha.rulingNumber}`}
              </span>
            </div>

            {/* Grid + Prediction side by side */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
              {/* That Level's Own Vedic Grid with newly added number highlighted */}
              <div className="lg:col-span-5 flex flex-col items-center">
                <VedicGrid
                  dob={dob}
                  additionalDigits={[dasha.rulingNumber]}
                  newlyAddedNumber={dasha.rulingNumber}
                  size="sm"
                  title={locale === 'hi' ? `${dasha.levelHi} ग्रिड` : `${dasha.level} Grid`}
                  caption={locale === 'hi' ? `जन्म ग्रिड + दशा अंक ${dasha.rulingNumber}` : `Birth Grid + Dasha #${dasha.rulingNumber}`}
                  locale={locale}
                  hideControls={true}
                  hideStats={true}
                />
              </div>

              {/* Prediction details */}
              <div className="lg:col-span-7 space-y-3">
                <PredictionCard
                  title={locale === 'hi' ? `${dasha.levelHi} प्रभाव एवं फलकथन` : `${dasha.level} Impact & Reading`}
                  subtitle={locale === 'hi' ? `ग्रह स्वामी: ${dasha.rulerPlanetHi}` : `Ruling Planet: ${dasha.rulerPlanetEn}`}
                  prediction={locale === 'hi' ? `${dasha.descriptionHi}\n\nविशेष प्रभाव: ${dasha.meaningHi}` : `${dasha.descriptionEn}\n\nKey Influence: ${dasha.meaningEn}`}
                  sectionKey={`yearly_dasha_${dasha.level.toLowerCase()}`}
                  locale={locale}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Yearly Grid & Activated Yogas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
        <div className="space-y-3">
          <h3 className="text-sm font-bold font-serif text-[var(--heading)]">
            {t('yearlyGridTitle', { year: targetYear })}
          </h3>
          <VedicGrid
            dob={`${targetYear}-10-23`}
            locale={locale}
            title={locale === 'hi' ? `वर्ष ${targetYear} की वार्षिक ग्रिड` : `Annual Grid for ${targetYear}`}
            caption={locale === 'hi' ? `वर्ष ${targetYear} के अंकों से निर्मित ग्रिड` : `Derived from digits of year ${targetYear}`}
          />
        </div>

        <div className="vedic-card p-4 sm:p-5 space-y-4">
          <div className="flex items-center justify-between pb-2.5 border-b border-[var(--border)]">
            <h3 className="text-sm font-bold font-serif text-[var(--heading)] flex items-center gap-2">
              <Compass className="w-4 h-4 text-[var(--gold)]" />
              {t('yearlyYogasTitle')}
            </h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--chip-bg)] text-[var(--gold)] font-bold">
              {prediction.yearlyYogas.filter((y) => y.status !== 'inactive').length} Active
            </span>
          </div>

          <p className="text-xs text-[var(--text-muted)] leading-relaxed">
            {locale === 'hi'
              ? 'इस वर्ष सक्रिय ऊर्जा तल जो आपके लक्ष्यों और वित्तीय प्रयासों को गति प्रदान करेंगे:'
              : 'Active planes of energy influencing events and strategic timing this year:'}
          </p>

          <div className="space-y-2 pt-1">
            {prediction.yearlyYogas
              .filter((y) => y.status !== 'inactive')
              .map((y) => (
                <div
                  key={y.id}
                  className="p-3 rounded-xl bg-[var(--bg)] border border-[var(--border)] flex items-start gap-2.5"
                >
                  <CheckCircle2 className="w-4 h-4 text-[var(--success-text)] shrink-0 mt-0.5" />
                  <div className="text-xs space-y-0.5">
                    <span className="font-bold text-[var(--heading)] font-serif block">
                      {locale === 'hi' ? y.nameHi : y.nameEn} ({y.numbers.join('-')})
                    </span>
                    <p className="text-[var(--text-muted)] leading-relaxed text-[11.5px]">
                      {locale === 'hi' ? y.impactHi : y.impactEn}
                    </p>
                  </div>
                </div>
              ))}
          </div>

          {/* Yogas from repeating numbers in that year */}
          {prediction.repeatingYogas.length > 0 && (
            <div className="pt-3 border-t border-[var(--border)] space-y-2">
              <h4 className="text-xs font-bold font-serif text-[var(--heading)] flex items-center gap-1.5">
                <Repeat className="w-3.5 h-3.5 text-[var(--gold)]" />
                {locale === 'hi' ? 'दोहराव अंकों से बने विशेष योग' : 'Yogas from Repeating Digits'}
              </h4>
              <div className="space-y-1.5">
                {prediction.repeatingYogas.map((ry) => (
                  <div
                    key={`rep-${ry.id}`}
                    className="p-2.5 rounded-lg bg-[var(--chip-bg)]/40 border border-[var(--border)] text-xs text-[var(--heading)] flex items-center justify-between"
                  >
                    <span className="font-semibold">{locale === 'hi' ? ry.nameHi : ry.nameEn}</span>
                    <span className="text-[10px] text-[var(--gold)] font-bold">Amplified ×2</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
