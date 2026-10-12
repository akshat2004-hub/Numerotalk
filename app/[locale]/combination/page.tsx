'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { GitMerge, Sparkles, Briefcase, Heart, CheckCircle2, Shield, Palette } from 'lucide-react';
import { SectionHeader } from '@/frontend/components/ui/SectionHeader';
import { NumberBadge } from '@/frontend/components/ui/NumberBadge';
import { PredictionCard } from '@/frontend/components/ui/PredictionCard';
import { ProfileEmptyBanner } from '@/frontend/components/ProfileEmptyBanner';
import { useNumerologyStore } from '@/frontend/store/useNumerologyStore';
import { calculateMulank, calculateBhagyank, getNumberRelationship, NUMBER_RELATIONSHIPS, numerologyService } from '@/frontend';
import { CombinationReading } from '@/types';

export default function CombinationPage() {
  const t = useTranslations('combinationPage');
  const tp = useTranslations('profile');
  const locale = (useLocale() || 'en') as 'en' | 'hi';
  const profile = useNumerologyStore((s) => s.profile);

  const mulank = profile.dob ? calculateMulank(profile.dob).mulank : 5;
  const bhagyank = profile.dob ? calculateBhagyank(profile.dob).bhagyank : 3;

  const [reading, setReading] = useState<CombinationReading | null>(null);

  const relation = getNumberRelationship(mulank, bhagyank);
  const mulankInfo = NUMBER_RELATIONSHIPS[mulank];
  const bhagyankInfo = NUMBER_RELATIONSHIPS[bhagyank];

  useEffect(() => {
    numerologyService.getCombinationReading(mulank, bhagyank, locale).then(setReading);
  }, [mulank, bhagyank, locale]);

  const getRelationBadge = () => {
    if (relation === 'friendly') {
      return { text: locale === 'hi' ? 'परम मित्र संबंध' : 'Harmonious Alliance', color: 'emerald' as const };
    }
    if (relation === 'enemy') {
      return { text: locale === 'hi' ? 'विपरीत ग्रह संबंध' : 'Challenging Friction', color: 'crimson' as const };
    }
    return { text: locale === 'hi' ? 'तटस्थ संबंध' : 'Neutral Resonance', color: 'gold' as const };
  };

  const badge = getRelationBadge();

  // Combined friendly, neutral, and enemy numbers
  const allFriends = Array.from(new Set([...(mulankInfo?.friends || []), ...(bhagyankInfo?.friends || [])]));
  const allNeutrals = Array.from(new Set([...(mulankInfo?.neutrals || []), ...(bhagyankInfo?.neutrals || [])]));
  const allEnemies = Array.from(new Set([...(mulankInfo?.enemies || []), ...(bhagyankInfo?.enemies || [])]));

  return (
    <div className="space-y-6 sm:space-y-7">
      <SectionHeader
        title={locale === 'hi' ? 'संयोजन भविष्यफल' : 'Combination Prediction'}
        goldTitle={locale === 'hi' ? '(नामांक और भाग्यांक)' : '(Destiny & Life Path)'}
        subtitle={t('subtitle')}
        icon={<GitMerge className="w-5 h-5 stroke-[1.5]" />}
      />

      <ProfileEmptyBanner />

      {/* Synthesis Banner */}
      <div className="vedic-card p-4 sm:p-5">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="text-center">
              <span className="text-[10.5px] text-[var(--gold)] font-semibold block mb-1">{tp('mulank')}</span>
              <NumberBadge number={mulank} size="lg" subLabel={mulankInfo?.rulerEn} />
            </div>

            <div className="text-lg font-serif font-black text-[var(--text-muted)]">✕</div>

            <div className="text-center">
              <span className="text-[10.5px] text-[var(--gold)] font-semibold block mb-1">{tp('bhagyank')}</span>
              <NumberBadge number={bhagyank} size="lg" subLabel={bhagyankInfo?.rulerEn} />
            </div>
          </div>

          <div className="text-center md:text-right space-y-1">
            <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10.5px] font-semibold border ${
              badge.color === 'emerald'
                ? 'bg-[var(--success-bg)] text-[var(--success-text)] border-[var(--success-border)]'
                : badge.color === 'crimson'
                ? 'bg-[var(--warn-bg)] text-[var(--warn-text)] border-[var(--warn-border)]'
                : 'bg-[var(--chip-bg)] text-[var(--gold)] border-[var(--border)]'
            }`}>
              {badge.text}
            </span>
            <h3 className="font-serif text-base sm:text-lg font-bold text-[var(--heading)]">
              {reading ? (locale === 'hi' ? reading.title.hi : reading.title.en) : `Driver ${mulank} x Conductor ${bhagyank}`}
            </h3>
            <p className="text-[11.5px] text-[var(--text-muted)] max-w-md">
              {locale === 'hi' ? 'आंतरिक प्रेरणा और बाह्य भाग्य का संगम' : 'Intersection of subconscious instinct and external life path'}
            </p>
          </div>
        </div>
      </div>

      {/* 3 CHIP GROUPS: Friendly, Neutral, Enemy numbers */}
      <div className="vedic-card p-4 sm:p-5 space-y-3">
        <h4 className="font-serif text-sm font-semibold text-[var(--heading)]">
          {locale === 'hi' ? 'ग्रह संबंध वर्गीकरण (मित्र, तटस्थ, शत्रु)' : 'Planetary Relationship Matrix (Friendly, Neutral, Enemy)'}
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Friendly Group */}
          <div className="p-3 rounded-2xl bg-[var(--success-bg)] border border-[var(--success-border)] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[var(--success-text)]">
                {locale === 'hi' ? 'मित्र अंक (Friendly)' : 'Friendly Numbers'}
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-[var(--surface)] text-[var(--success-text)] font-bold">
                {allFriends.length}
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {allFriends.map((num) => (
                <span
                  key={num}
                  className="w-7 h-7 rounded-xl bg-[var(--surface)] border border-[var(--success-border)] text-[var(--success-text)] font-bold text-xs flex items-center justify-center shadow-xs"
                >
                  {num}
                </span>
              ))}
            </div>
          </div>

          {/* Neutral Group */}
          <div className="p-3 rounded-2xl bg-[var(--warn-bg)] border border-[var(--warn-border)] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[var(--warn-text)]">
                {locale === 'hi' ? 'तटस्थ अंक (Neutral)' : 'Neutral Numbers'}
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-[var(--surface)] text-[var(--warn-text)] font-bold">
                {allNeutrals.length}
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {allNeutrals.map((num) => (
                <span
                  key={num}
                  className="w-7 h-7 rounded-xl bg-[var(--surface)] border border-[var(--warn-border)] text-[var(--warn-text)] font-bold text-xs flex items-center justify-center shadow-xs"
                >
                  {num}
                </span>
              ))}
            </div>
          </div>

          {/* Enemy Group */}
          <div className="p-3 rounded-2xl bg-[var(--neutral-bg)] border border-[var(--neutral-border)] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[var(--neutral-text)]">
                {locale === 'hi' ? 'शत्रु अंक (Enemy)' : 'Enemy Numbers'}
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-[var(--surface)] text-[var(--neutral-text)] font-bold">
                {allEnemies.length}
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {allEnemies.length > 0 ? (
                allEnemies.map((num) => (
                  <span
                    key={num}
                    className="w-7 h-7 rounded-xl bg-[var(--surface)] border border-[var(--neutral-border)] text-[var(--neutral-text)] font-bold text-xs flex items-center justify-center shadow-xs"
                  >
                    {num}
                  </span>
                ))
              ) : (
                <span className="text-xs text-[var(--text-muted)] italic">
                  {locale === 'hi' ? 'कोई शत्रु अंक नहीं' : 'No inimical numbers'}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Lucky Color Swatches & Lucky Numbers */}
      <div className="vedic-card p-4 sm:p-5 space-y-3">
        <h4 className="font-serif text-sm font-semibold text-[var(--heading)] flex items-center gap-1.5">
          <Palette className="w-4 h-4 text-[var(--gold)] stroke-[1.5]" />
          <span>{locale === 'hi' ? 'शुभ रंग एवं शुभ अंक संरेखण' : 'Lucky Color Swatches & Numbers'}</span>
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-2xl bg-[var(--surface)] border border-[var(--border)] space-y-2">
            <span className="font-serif font-bold text-[var(--heading)] block text-xs">
              {locale === 'hi' ? `मूलांक ${mulank} (${mulankInfo?.rulerHi})` : `Driver ${mulank} (${mulankInfo?.rulerEn})`}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-[var(--text-muted)]">{locale === 'hi' ? 'शुभ रंग:' : 'Lucky Colors:'}</span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {(locale === 'hi' ? mulankInfo?.luckyColorsHi : mulankInfo?.luckyColorsEn)?.map((col, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded-lg bg-[var(--chip-bg)] border border-[var(--border)] text-[var(--heading)] text-[11px] font-semibold"
                  >
                    {col}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[var(--text-muted)]">{locale === 'hi' ? 'शुभ अंक:' : 'Lucky Numbers:'}</span>
              <span className="font-bold text-[var(--success-text)]">{mulankInfo?.friends.join(', ')}</span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-[var(--surface)] border border-[var(--border)] space-y-2">
            <span className="font-serif font-bold text-[var(--heading)] block text-xs">
              {locale === 'hi' ? `भाग्यांक ${bhagyank} (${bhagyankInfo?.rulerHi})` : `Conductor ${bhagyank} (${bhagyankInfo?.rulerEn})`}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-[var(--text-muted)]">{locale === 'hi' ? 'शुभ रंग:' : 'Lucky Colors:'}</span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {(locale === 'hi' ? bhagyankInfo?.luckyColorsHi : bhagyankInfo?.luckyColorsEn)?.map((col, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded-lg bg-[var(--chip-bg)] border border-[var(--border)] text-[var(--heading)] text-[11px] font-semibold"
                  >
                    {col}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[var(--text-muted)]">{locale === 'hi' ? 'शुभ अंक:' : 'Lucky Numbers:'}</span>
              <span className="font-bold text-[var(--success-text)]">{bhagyankInfo?.friends.join(', ')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Reading Breakdown: Single Combination Prediction Card with 4 Numbered Points */}
      {reading && (
        <PredictionCard
          title={locale === 'hi' ? 'संयोजन भविष्यफल' : 'Combination Prediction'}
          intro={
            locale === 'hi'
              ? 'मूलांक एवं भाग्यांक के संयुक्त प्रभाव से उत्पन्न समग्र जीवन ऊर्जा एवं करियर मार्गदर्शन'
              : 'Combined vibration of Driver & Conductor numbers revealing life synergy and strategic remedies'
          }
          itemKey="combination:combination_prediction"
          points={[
            {
              id: 'comb_pt_1',
              heading: locale === 'hi' ? 'संयुक्त ऊर्जा विश्लेषण' : 'Combined Energy Analysis',
              body: locale === 'hi' ? reading.synergyAnalysis.hi : reading.synergyAnalysis.en,
              itemKey: 'combination:point:combined_energy_analysis'
            },
            {
              id: 'comb_pt_2',
              heading: locale === 'hi' ? 'रणनीतिक करियर संरेखण' : 'Strategic Career Alignment',
              body: locale === 'hi' ? reading.careerGuidance.hi : reading.careerGuidance.en,
              itemKey: 'combination:point:strategic_career_alignment'
            },
            {
              id: 'comb_pt_3',
              heading: locale === 'hi' ? 'व्यक्तिगत एवं पारिवारिक जीवन' : 'Personal & Domestic Sphere',
              body: locale === 'hi' ? reading.personalLife.hi : reading.personalLife.en,
              itemKey: 'combination:point:personal_domestic_sphere'
            },
            {
              id: 'comb_pt_4',
              heading: locale === 'hi' ? 'समन्वय एवं संतुलनकारी उपाय' : 'Harmonizing Recommendations',
              body: reading.luckyRemedies.map((rem) => (locale === 'hi' ? rem.hi : rem.en)).join(' • '),
              itemKey: 'combination:point:harmonizing_recommendations'
            }
          ]}
        />
      )}
    </div>
  );
}
