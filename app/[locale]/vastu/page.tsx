'use client';

import React, { useState, useMemo } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Compass, Sparkles, Home, Check, Plus, RefreshCw } from 'lucide-react';
import { SectionHeader } from '@/frontend/components/ui/SectionHeader';
import { VedicGrid } from '@/frontend/components/VedicGrid';
import { ProfileEmptyBanner } from '@/frontend/components/ProfileEmptyBanner';
import { useNumerologyStore } from '@/frontend/store/useNumerologyStore';
import { calculateVastuNumerology, VastuNumerologyResult } from '@/core/engine/vastu';

import { Input } from '@/frontend/components/ui/Input';
import { DateInput } from '@/frontend/components/ui/DateInput';
import { Button } from '@/frontend/components/ui/Button';

export default function VastuPage() {
  const t = useTranslations('vastuPage');
  const locale = (useLocale() || 'en') as 'en' | 'hi';
  const { profile, reportSections, toggleReportSection } = useNumerologyStore();

  const [inputName, setInputName] = useState(profile.name || 'Rahul Sharma');
  const [inputDob, setInputDob] = useState(profile.dob || '1995-10-23');

  const vastu: VastuNumerologyResult = useMemo(
    () => calculateVastuNumerology(inputDob),
    [inputDob]
  );

  return (
    <div className="space-y-6 sm:space-y-7">
      <SectionHeader
        title={t('title')}
        subtitle={t('subtitle')}
        icon={<Compass className="w-5 h-5 stroke-[1.5]" />}
      />

      <ProfileEmptyBanner />

      {/* Inputs bar: [Full Name | Date of Birth | Reset to Profile] */}
      <div className="vedic-card p-4 sm:p-5">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-3 items-end">
          <Input
            label={locale === 'hi' ? 'नाम' : 'Full Name'}
            value={inputName}
            onChange={(e) => setInputName(e.target.value)}
          />

          <DateInput
            label={locale === 'hi' ? 'जन्म तिथि' : 'Date of Birth'}
            value={inputDob}
            onChange={(iso) => setInputDob(iso)}
          />

          <div>
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={() => {
                setInputName(profile.name || 'Rahul Sharma');
                setInputDob(profile.dob || '1995-10-23');
              }}
              className="w-full md:w-auto flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4 text-[var(--gold)] shrink-0" />
              <span>{locale === 'hi' ? 'प्रोफ़ाइल से रीसेट करें' : 'Reset to Profile'}</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Brahmasthan Status Banner */}
      <div className="vedic-card p-4 sm:p-5 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center md:text-left">
          <span className="text-[10px] font-bold text-[var(--gold)] uppercase tracking-wider">
            {t('brahmasthanStatus')}
          </span>
          <h3 className="text-base sm:text-lg font-bold font-serif text-[var(--heading)]">
            Center Sector (Brahmasthan) & Directions Balance
          </h3>
          <p className="text-[11.5px] sm:text-xs text-[var(--text-muted)] max-w-2xl leading-relaxed">
            {locale === 'hi' ? vastu.brahmasthanBalanceHi : vastu.brahmasthanBalanceEn}
          </p>
        </div>

        <div className="w-12 h-12 rounded-2xl bg-[var(--chip-bg)] border border-[var(--border)] flex items-center justify-center text-[var(--gold)] shrink-0 shadow-xs">
          <Home className="w-6 h-6" />
        </div>
      </div>

      {/* Grid + Spatial Direction Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
        <div className="lg:col-span-1">
          <VedicGrid
            dob={inputDob}
            locale={locale}
            title={locale === 'hi' ? 'वास्तु वैदिक ग्रिड' : 'Vastu Energy Grid'}
            caption={locale === 'hi' ? 'ग्रिड में उपस्थित अंक वास्तु दिशाओं को ऊर्जावान बनाते हैं' : 'Active digits empower their governing cardinal zones'}
          />
        </div>

        <div className="lg:col-span-2 space-y-3">
          <h3 className="text-base font-bold font-serif text-[var(--heading)] flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[var(--gold)]" />
            {t('directionsAnalysis')}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {vastu.directions.map((dir) => {
              const isEmpowered = dir.status === 'Empowered';
              const isDeficient = dir.status === 'Deficient / Missing';
              const sectionKey = `vastu_dir_${dir.number}`;
              const isAdded = !!reportSections?.[sectionKey];

              return (
                <div
                  key={dir.number}
                  className={`p-3.5 rounded-2xl border space-y-2 ${
                    isEmpowered
                      ? 'bg-emerald-50/60 border-emerald-200'
                      : isDeficient
                      ? 'bg-rose-50/60 border-rose-200'
                      : 'bg-[var(--surface)] border-[var(--border)]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold font-serif text-[var(--heading)]">
                      {locale === 'hi' ? dir.directionHi : dir.directionEn} (Sector {dir.number})
                    </span>
                    <span
                      className={`text-[9.5px] font-bold px-2 py-0.5 rounded-full border ${
                        isEmpowered
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                          : isDeficient
                          ? 'bg-rose-100 text-rose-800 border-rose-300'
                          : 'bg-[var(--chip-bg)] text-[var(--text-muted)] border-[var(--border)]'
                      }`}
                    >
                      {locale === 'hi' ? dir.statusHi : dir.status}
                    </span>
                  </div>

                  <p className="text-[11.5px] text-[var(--text)] leading-relaxed">
                    <strong className="text-[var(--heading)]">{t('roomRecommendation')}: </strong>
                    {locale === 'hi' ? dir.roomUsageHi : dir.roomUsageEn}
                  </p>

                  <div className="pt-1.5 text-[11px] text-[var(--gold)] font-medium leading-relaxed border-t border-[var(--border)]">
                    <strong className="text-[var(--heading)]">{t('directionRemedy')}: </strong>
                    {locale === 'hi' ? dir.remedyHi : dir.remedyEn}
                  </div>

                  <div className="pt-1 flex justify-end">
                    <button
                      type="button"
                      onClick={() => toggleReportSection(sectionKey)}
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold cursor-pointer ${
                        isAdded
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-[var(--surface)] border border-[var(--border)] text-[var(--gold)] hover:bg-[var(--chip-bg)]'
                      }`}
                    >
                      {isAdded ? <Check className="w-2.5 h-2.5" /> : <Plus className="w-2.5 h-2.5" />}
                      <span>{isAdded ? 'In Report' : 'Add to report'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
