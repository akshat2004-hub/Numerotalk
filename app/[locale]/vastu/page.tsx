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
import { PredictionCard } from '@/frontend/components/ui/PredictionCard';
import { cn } from '@/frontend/utils';

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
              icon={<RefreshCw className="w-4 h-4 text-[var(--gold)]" />}
              onClick={() => {
                setInputName(profile.name || 'Rahul Sharma');
                setInputDob(profile.dob || '1995-10-23');
              }}
              className="w-full md:w-auto"
            >
              {locale === 'hi' ? 'प्रोफ़ाइल से रीसेट करें' : 'Reset to Profile'}
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

        <div className="lg:col-span-2 space-y-4">
          {/* 1. Empowered Directions Prediction (Green) */}
          {vastu.directions.filter((d) => d.status === 'Empowered').length > 0 && (
            <PredictionCard
              title={`${locale === 'hi' ? 'सशक्त दिशा भविष्यफल' : 'Empowered Directions Prediction'} (${vastu.directions.filter((d) => d.status === 'Empowered').length})`}
              intro={
                locale === 'hi'
                  ? 'जन्म ग्रिड में पूर्णतः सक्रिय और ऊर्जावान दिशाएं जो समृद्धि व सकारात्मकता प्रदान करती हैं'
                  : 'Cardinal zones strongly activated by birth digits bringing natural vitality and prosperity'
              }
              variant="strengths"
              itemKey="vastu:empowered_directions"
              points={vastu.directions
                .filter((d) => d.status === 'Empowered')
                .map((dir) => ({
                  id: `emp_${dir.number}`,
                  heading: locale === 'hi' ? dir.directionHi : dir.directionEn,
                  body: `${locale === 'hi' ? 'अनुशंसित कक्ष उपयोग:' : 'Recommended room usage:'} ${locale === 'hi' ? dir.roomUsageHi : dir.roomUsageEn}`,
                  subline: `${locale === 'hi' ? 'वास्तु उपाय:' : 'Vastu remedy:'} ${locale === 'hi' ? dir.remedyHi : dir.remedyEn}`,
                  itemKey: `vastu:dir:${dir.number}`
                }))}
            />
          )}

          {/* 2. Balanced Directions Prediction (Neutral) */}
          {vastu.directions.filter((d) => d.status === 'Balanced').length > 0 && (
            <PredictionCard
              title={`${locale === 'hi' ? 'संतुलित दिशा भविष्यफल' : 'Balanced Directions Prediction'} (${vastu.directions.filter((d) => d.status === 'Balanced').length})`}
              intro={
                locale === 'hi'
                  ? 'स्थिर और सामंजस्यपूर्ण दिशाएं जो नियमित कार्यों और स्थिरता के लिए उपयुक्त हैं'
                  : 'Harmonious cardinal zones maintaining steady grounding and consistent domestic balance'
              }
              itemKey="vastu:balanced_directions"
              points={vastu.directions
                .filter((d) => d.status === 'Balanced')
                .map((dir) => ({
                  id: `bal_${dir.number}`,
                  heading: locale === 'hi' ? dir.directionHi : dir.directionEn,
                  body: `${locale === 'hi' ? 'अनुशंसित कक्ष उपयोग:' : 'Recommended room usage:'} ${locale === 'hi' ? dir.roomUsageHi : dir.roomUsageEn}`,
                  subline: `${locale === 'hi' ? 'वास्तु उपाय:' : 'Vastu remedy:'} ${locale === 'hi' ? dir.remedyHi : dir.remedyEn}`,
                  itemKey: `vastu:dir:${dir.number}`
                }))}
            />
          )}

          {/* 3. Deficient / Missing Directions Prediction (Amber) */}
          {vastu.directions.filter((d) => d.status === 'Deficient / Missing').length > 0 && (
            <PredictionCard
              title={`${locale === 'hi' ? 'अभावग्रस्त / अनुपस्थित दिशा भविष्यफल' : 'Deficient / Missing Directions Prediction'} (${vastu.directions.filter((d) => d.status === 'Deficient / Missing').length})`}
              intro={
                locale === 'hi'
                  ? 'अंकों के अभाव वाली दिशाएं जहां संतुलन और वास्तु उपायों की आवश्यकता है'
                  : 'Zones lacking numeric activation requiring conscious remedial alignment and color therapy'
              }
              variant="cautions"
              itemKey="vastu:deficient_directions"
              points={vastu.directions
                .filter((d) => d.status === 'Deficient / Missing')
                .map((dir) => ({
                  id: `def_${dir.number}`,
                  heading: locale === 'hi' ? dir.directionHi : dir.directionEn,
                  body: `${locale === 'hi' ? 'अनुशंसित कक्ष उपयोग:' : 'Recommended room usage:'} ${locale === 'hi' ? dir.roomUsageHi : dir.roomUsageEn}`,
                  subline: `${locale === 'hi' ? 'वास्तु उपाय:' : 'Vastu remedy:'} ${locale === 'hi' ? dir.remedyHi : dir.remedyEn}`,
                  itemKey: `vastu:dir:${dir.number}`
                }))}
            />
          )}
        </div>
      </div>
    </div>
  );
}
