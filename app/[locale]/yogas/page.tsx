'use client';

import React, { useMemo } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Grid, Sparkles, CheckCircle2, Clock, XCircle, Table } from 'lucide-react';
import { SectionHeader } from '@/frontend/components/ui/SectionHeader';
import { PredictionCard } from '@/frontend/components/ui/PredictionCard';
import { ProfileEmptyBanner } from '@/frontend/components/ProfileEmptyBanner';
import { VedicGrid } from '@/frontend/components/VedicGrid';
import { useNumerologyStore } from '@/frontend/store/useNumerologyStore';
import { calculateVedicGrid, detectYogas } from '@/frontend';

export default function YogasPage() {
  const t = useTranslations('yogasPage');
  const locale = (useLocale() || 'en') as 'en' | 'hi';
  const profile = useNumerologyStore((s) => s.profile);

  const dob = profile.dob || '1995-10-23';
  const grid = useMemo(() => calculateVedicGrid(dob), [dob]);
  const { yogas, fullYogas, partialYogas, inactiveYogas } = useMemo(() => detectYogas(grid), [grid]);

  return (
    <div className="space-y-6 sm:space-y-7">
      <SectionHeader
        title={t('title')}
        subtitle={t('subtitle')}
        icon={<Grid className="w-5 h-5 stroke-[1.5]" />}
      />

      <ProfileEmptyBanner />

      {/* Grid with Yog lines drawn + Summary Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
        <div className="lg:col-span-1">
          <VedicGrid
            dob={dob}
            locale={locale}
            highlightYogLines={true}
            title={locale === 'hi' ? 'वैदिक योग ग्रिड (स्वर्ण रेखाएं)' : 'Vedic Grid (Yog Lines Overlay)'}
            caption={locale === 'hi' ? 'स्वर्ण रेखाएं पूर्ण सक्रिय योग दर्शाती हैं' : 'Gold overlay lines indicate active energetic planes'}
          />
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div className="grid grid-cols-3 gap-2.5">
            <div className="vedic-card p-3 sm:p-4 text-center">
              <span className="text-[10px] font-semibold text-emerald-700 block mb-0.5">
                {t('fullYogasCount')}
              </span>
              <span className="text-xl sm:text-2xl font-bold font-serif text-emerald-800">
                {fullYogas.length}
              </span>
            </div>

            <div className="vedic-card p-3 sm:p-4 text-center">
              <span className="text-[10px] font-semibold text-[var(--gold)] block mb-0.5">
                {t('partialYogasCount')}
              </span>
              <span className="text-xl sm:text-2xl font-bold font-serif text-[var(--gold)]">
                {partialYogas.length}
              </span>
            </div>

            <div className="vedic-card p-3 sm:p-4 text-center">
              <span className="text-[10px] font-semibold text-[var(--text-muted)] block mb-0.5">
                {locale === 'hi' ? 'निष्क्रिय तल' : 'Inactive Planes'}
              </span>
              <span className="text-xl sm:text-2xl font-bold font-serif text-[var(--text-muted)]">
                {inactiveYogas.length}
              </span>
            </div>
          </div>

          {/* Active full yogas callout */}
          {fullYogas.length > 0 && (
            <div className="vedic-card p-3.5 sm:p-4 space-y-2 border-emerald-300 bg-emerald-50/50">
              <h4 className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                {locale === 'hi' ? 'विशेष पूर्ण सक्रिय योग' : 'Major Fully Activated Yogas'}
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {fullYogas.map((y) => (
                  <span
                    key={y.id}
                    className="px-2.5 py-1 rounded-xl text-[11px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300"
                  >
                    {locale === 'hi' ? y.nameHi : y.nameEn} ({y.numbers.join('-')})
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Reference Table of all possible Yogs with found ones highlighted */}
      <div className="vedic-card p-4 sm:p-5 space-y-3">
        <h3 className="text-sm font-bold font-serif text-[var(--heading)] flex items-center gap-1.5">
          <Table className="w-4 h-4 text-[var(--gold)]" />
          <span>{locale === 'hi' ? 'समस्त वैदिक योग संदर्भ सारणी (सक्रियता अनुसार)' : 'All 8 Vedic Yogas Reference Table'}</span>
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[var(--border)] text-[var(--text-muted)] text-[11px]">
                <th className="py-2 px-3 font-semibold">{locale === 'hi' ? 'योग नाम' : 'Yoga Name'}</th>
                <th className="py-2 px-3 font-semibold">{locale === 'hi' ? 'अंक तल' : 'Plane Digits'}</th>
                <th className="py-2 px-3 font-semibold">{locale === 'hi' ? 'प्रकार' : 'Category'}</th>
                <th className="py-2 px-3 font-semibold">{locale === 'hi' ? 'स्थिति' : 'Status'}</th>
                <th className="py-2 px-3 font-semibold">{locale === 'hi' ? 'प्रभाव' : 'Significance'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {yogas.map((y) => {
                const isFull = y.status === 'full';
                const isPartial = y.status === 'partial';
                return (
                  <tr
                    key={y.id}
                    className={
                      isFull
                        ? 'bg-emerald-50/70 font-medium'
                        : isPartial
                        ? 'bg-amber-50/50'
                        : 'opacity-70'
                    }
                  >
                    <td className="py-2.5 px-3 font-serif font-bold text-[var(--heading)]">
                      {locale === 'hi' ? y.nameHi : y.nameEn}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-[var(--gold)] font-bold">
                      {y.numbers.join(' - ')}
                    </td>
                    <td className="py-2.5 px-3 text-[var(--text-muted)]">
                      {locale === 'hi' ? y.categoryHi : y.category}
                    </td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          isFull
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : isPartial
                            ? 'bg-amber-100 text-amber-800 border border-amber-300'
                            : 'bg-[var(--chip-bg)] text-[var(--text-muted)]'
                        }`}
                      >
                        {isFull
                          ? (locale === 'hi' ? 'पूर्ण 100%' : '100% Full')
                          : isPartial
                          ? (locale === 'hi' ? 'आंशिक 66%' : '66% Partial')
                          : (locale === 'hi' ? 'अनुपस्थित' : 'Inactive')}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-[var(--text)] text-[11.5px] max-w-xs truncate">
                      {locale === 'hi' ? y.impactHi : y.impactEn}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detailed Yogas Cards */}
      <div className="space-y-3">
        <h3 className="text-base sm:text-lg font-bold font-serif text-[var(--heading)] flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-[var(--gold)]" />
          {t('allYogasTitle')}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {yogas.map((yoga) => {
            const isFull = yoga.status === 'full';
            const isPartial = yoga.status === 'partial';

            return (
              <PredictionCard
                key={yoga.id}
                title={locale === 'hi' ? yoga.nameHi : yoga.nameEn}
                badge={
                  isFull
                    ? (locale === 'hi' ? 'पूर्ण सक्रिय 100%' : '100% Full')
                    : isPartial
                    ? (locale === 'hi' ? 'आंशिक 66%' : '66% Partial')
                    : (locale === 'hi' ? 'निष्क्रिय' : 'Inactive')
                }
                badgeVariant={isFull ? 'emerald' : isPartial ? 'gold' : 'indigo'}
                sectionKey={`module6_yoga_${yoga.id}`}
                icon={
                  isFull ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : isPartial ? (
                    <Clock className="w-4 h-4 text-[var(--gold)]" />
                  ) : (
                    <XCircle className="w-4 h-4 text-[var(--text-muted)] opacity-60" />
                  )
                }
                footer={
                  <div className="w-full flex items-center justify-between text-[11px]">
                    <span className="text-[var(--text-muted)]">
                      Plane: <strong>{yoga.numbers.join(' - ')}</strong>
                    </span>
                    <span className="text-[var(--text-muted)]">
                      {locale === 'hi' ? yoga.categoryHi : yoga.category}
                    </span>
                  </div>
                }
              >
                <div className="space-y-2">
                  <p className="text-[var(--text)] text-[12px] sm:text-[12.5px] leading-relaxed">
                    {locale === 'hi' ? yoga.descriptionHi : yoga.descriptionEn}
                  </p>

                  <div className="p-2.5 rounded-xl bg-[var(--surface)] border border-[var(--border)] space-y-0.5">
                    <span className="text-[10.5px] font-bold text-[var(--gold)] block">
                      {t('planeImpact')}
                    </span>
                    <p className="text-[11.5px] text-[var(--text)] leading-relaxed">
                      {locale === 'hi' ? yoga.impactHi : yoga.impactEn}
                    </p>
                  </div>
                </div>
              </PredictionCard>
            );
          })}
        </div>
      </div>
    </div>
  );
}
