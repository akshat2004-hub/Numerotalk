'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import {
  FileSignature,
  RefreshCw,
  Check,
  Plus,
  Sparkles,
  Heart,
  Briefcase,
  ShieldAlert,
  User,
  Star,
  Compass,
  Clock,
  Layers,
  Sparkle
} from 'lucide-react';
import { SectionHeader } from '@/frontend/components/ui/SectionHeader';
import { CompoundNumber } from '@/frontend/components/ui/CompoundNumber';
import { ProfileEmptyBanner } from '@/frontend/components/ProfileEmptyBanner';
import { RemedyChip } from '@/frontend/components/ui/RemedyChip';
import { useNumerologyStore } from '@/frontend/store/useNumerologyStore';
import {
  nameNumber,
  suggestNameVariants,
  getHarmonyRelation,
  calculateMulank,
  calculateBhagyank,
  transliterateDevanagari,
  LETTER_VALUES_MAP
} from '@/core/engine';
import { cn } from '@/frontend/utils';

import namePredictionsData from '@/mocks/rules/name-predictions.json';
import compoundMeaningsData from '@/mocks/rules/compound-meanings.json';
import remediesData from '@/mocks/remedies.json';

const LABELS = {
  en: {
    title: 'Name Numerology (Namank)',
    subtitle: 'Analyze the sound vibration of your name and optimize it for harmony with your birth numbers.',
    nameToEvaluate: 'Name to Evaluate',
    resetToProfile: 'Reset to Profile',
    calculatedAs: 'Calculated as:',
    nameNumber: 'Name Number',
    harmonyTitle: 'Harmony with your birth numbers',
    vsMulank: 'Name Number vs Mulank',
    vsBhagyank: 'Name Number vs Bhagyank',
    letterBreakdown: 'Letter Breakdown',
    grandTotal: 'Grand Total',
    personalityNature: 'Personality & Nature',
    careerFinance: 'Career & Finance',
    relationships: 'Relationships',
    strengthsCautions: 'Strengths & Cautions',
    luckyNumbersTitle: 'Lucky name numbers for you',
    luckyLettersTitle: 'Lucky letters',
    correctionTitle: 'Name Correction Suggestions',
    suggestedSpelling: 'Suggested Spelling',
    totalReduced: 'Total → Reduced',
    harmonyBadges: 'Harmony',
    changeMade: 'Change Made',
    emptySuggestions: 'Your current name is harmoniously aligned with your birth numbers.',
    guidanceNote: 'Spelling suggestions are for guidance only.',
    remediesTitle: 'Harmonizing Remedies',
    addToReport: 'Add to Report',
    addedToReport: 'Added to Report'
  },
  hi: {
    title: 'नामांक विश्लेषण (Name Numerology)',
    subtitle: 'अपने नाम के ध्वनि कंपन का विश्लेषण करें और इसे अपने जन्म अंकों के साथ अनुकूलित करें।',
    nameToEvaluate: 'मूल्यांकन हेतु नाम',
    resetToProfile: 'प्रोफ़ाइल पर रीसेट करें',
    calculatedAs: 'गणना रूप:',
    nameNumber: 'नामांक',
    harmonyTitle: 'जन्म अंकों के साथ सामंजस्य',
    vsMulank: 'नामांक बनाम मूलांक',
    vsBhagyank: 'नामांक बनाम भाग्यांक',
    letterBreakdown: 'अक्षर-वार विभाजन',
    grandTotal: 'कुल योग',
    personalityNature: 'व्यक्तित्व एवं स्वभाव',
    careerFinance: 'करियर एवं वित्त',
    relationships: 'संबंध एवं दांपत्य',
    strengthsCautions: 'शक्तियां एवं सावधानियां',
    luckyNumbersTitle: 'आपके लिए शुभ नामांक',
    luckyLettersTitle: 'शुभ अक्षर',
    correctionTitle: 'नाम संशोधन सुझाव',
    suggestedSpelling: 'सुझाई गई वर्तनी',
    totalReduced: 'कुल योग → नामांक',
    harmonyBadges: 'सामंजस्य',
    changeMade: 'परिवर्तन',
    emptySuggestions: 'आपका वर्तमान नाम आपके जन्म अंकों के साथ पहले से ही अनुकूल है।',
    guidanceNote: 'वर्तनी सुझाव केवल मार्गदर्शन के लिए हैं।',
    remediesTitle: 'नामांक संतुलन उपाय',
    addToReport: 'रिपोर्ट में जोड़ें',
    addedToReport: 'रिपोर्ट में शामिल'
  }
} as const;

// Smooth count-up hook for Name Number display
function useCountUp(target: number, duration: number = 300) {
  const [count, setCount] = useState(target);

  useEffect(() => {
    let start = 1;
    const end = target;
    if (end <= 1) {
      setCount(end);
      return;
    }
    const stepTime = Math.max(20, Math.floor(duration / end));
    setCount(1);
    const timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start >= end) {
        clearInterval(timer);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [target, duration]);

  return count;
}

export default function NamePage() {
  const rawT = useTranslations('namePage');
  const locale = (useLocale() || 'en') as 'en' | 'hi';
  const lbl = LABELS[locale] || LABELS.en;
  const t = (key: keyof typeof LABELS['en']): string => {
    try {
      const val = rawT(key);
      if (val && !val.includes('namePage.')) return val;
    } catch {
      // fallback
    }
    return lbl[key] || key;
  };
  const profile = useNumerologyStore((s) => s.profile);
  const reportSections = useNumerologyStore((s) => s.reportSections);
  const toggleReportSection = useNumerologyStore((s) => s.toggleReportSection);

  const [testName, setTestName] = useState(profile.name || 'Rahul Sharma');

  // Sync with profile name when profile changes
  useEffect(() => {
    if (profile.name) {
      setTestName(profile.name);
    }
  }, [profile.name]);

  // Transliteration & Name Number calculations
  const translit = useMemo(() => transliterateDevanagari(testName), [testName]);
  const nameResult = useMemo(() => nameNumber(testName), [testName]);
  const animatedNumber = useCountUp(nameResult.reduced, 250);

  // Mulank & Bhagyank calculation
  const birthNumbers = useMemo(() => {
    const dob = profile.dob || '1995-10-23';
    const m = calculateMulank(dob);
    const b = calculateBhagyank(dob);
    return { mulank: m.mulank, bhagyank: b.bhagyank };
  }, [profile.dob]);

  // Harmony with Mulank & Bhagyank
  const mulankHarmony = useMemo(() => {
    return getHarmonyRelation(birthNumbers.mulank, nameResult.reduced);
  }, [birthNumbers.mulank, nameResult.reduced]);

  const bhagyankHarmony = useMemo(() => {
    return getHarmonyRelation(birthNumbers.bhagyank, nameResult.reduced);
  }, [birthNumbers.bhagyank, nameResult.reduced]);

  // Overall harmony status
  const overallHarmony = useMemo(() => {
    if (mulankHarmony === 'friendly' && bhagyankHarmony === 'friendly') {
      return {
        key: 'harmonious',
        labelEn: 'Harmonious',
        labelHi: 'अत्यंत अनुकूल',
        colorClass: 'bg-[var(--success-bg)] text-[var(--success-text)] border-[var(--success-border)]'
      };
    }
    if (mulankHarmony === 'enemy' || bhagyankHarmony === 'enemy') {
      return {
        key: 'needsAttention',
        labelEn: 'Needs Attention',
        labelHi: 'सुधार आवश्यक',
        colorClass: 'bg-[var(--warn-bg)] text-[var(--warn-text)] border-[var(--warn-border)]'
      };
    }
    return {
      key: 'balanced',
      labelEn: 'Balanced',
      labelHi: 'संतुलित',
      colorClass: 'bg-[var(--neutral-bg)] text-[var(--neutral-text)] border-[var(--neutral-border)]'
    };
  }, [mulankHarmony, bhagyankHarmony]);

  // Prediction data for Name Number
  const prediction = useMemo(() => {
    const key = String(nameResult.reduced);
    return (namePredictionsData as Record<string, any>)[key] || (namePredictionsData as Record<string, any>)['1'];
  }, [nameResult.reduced]);

  // Compound meaning strip (10-52)
  const compoundMeaning = useMemo(() => {
    if (nameResult.compound >= 10 && nameResult.compound <= 52) {
      const data = (compoundMeaningsData as Record<string, { en: string; hi: string }>)[String(nameResult.compound)];
      if (data) {
        return locale === 'hi' ? data.hi : data.en;
      }
    }
    return null;
  }, [nameResult.compound, locale]);

  // Lucky numbers and letters
  const { luckyNumbers, luckyLetters } = useMemo(() => {
    const nums: number[] = [];
    for (let i = 1; i <= 9; i++) {
      if (
        getHarmonyRelation(birthNumbers.mulank, i) === 'friendly' &&
        getHarmonyRelation(birthNumbers.bhagyank, i) === 'friendly'
      ) {
        nums.push(i);
      }
    }
    const letters: string[] = [];
    for (const [letter, val] of Object.entries(LETTER_VALUES_MAP)) {
      if (nums.includes(val) && !letters.includes(letter)) {
        letters.push(letter);
      }
    }
    letters.sort();
    return { luckyNumbers: nums, luckyLetters: letters };
  }, [birthNumbers.mulank, birthNumbers.bhagyank]);

  // Spelling suggestions
  const spellingSuggestions = useMemo(() => {
    return suggestNameVariants(testName, {
      dob: profile.dob || '1995-10-23',
      mulank: birthNumbers.mulank,
      bhagyank: birthNumbers.bhagyank
    });
  }, [testName, profile.dob, birthNumbers.mulank, birthNumbers.bhagyank]);

  // Harmonizing remedies for Name Number
  const nameRemedy = useMemo(() => {
    const matching = (remediesData as any[]).find((r) => r.governingNumber === nameResult.reduced);
    return matching || (remediesData as any[])[0];
  }, [nameResult.reduced]);

  // Report inclusion state
  const isIncludedInReport = reportSections ? !!reportSections.nameNumerology : false;

  const getRelationBadge = (relation: 'friendly' | 'neutral' | 'enemy') => {
    if (relation === 'friendly') {
      return (
        <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[var(--success-bg)] text-[var(--success-text)] border border-[var(--success-border)] inline-flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--success-text)]" />
          {locale === 'hi' ? 'मित्र (Friendly)' : 'Friendly'}
        </span>
      );
    }
    if (relation === 'enemy') {
      return (
        <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[var(--warn-bg)] text-[var(--warn-text)] border border-[var(--warn-border)] inline-flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--warn-text)]" />
          {locale === 'hi' ? 'शत्रु (Enemy)' : 'Enemy'}
        </span>
      );
    }
    return (
      <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[var(--neutral-bg)] text-[var(--neutral-text)] border border-[var(--neutral-border)] inline-flex items-center gap-1">
        <span className="w-1.5 h-1.5 rounded-full bg-[var(--neutral-text)]" />
        {locale === 'hi' ? 'सम (Neutral)' : 'Neutral'}
      </span>
    );
  };

  const getVerdictSentence = (relation: 'friendly' | 'neutral' | 'enemy', birthType: 'Mulank' | 'Bhagyank', birthNum: number) => {
    const nameNum = nameResult.reduced;
    const typeLabel = locale === 'hi' ? (birthType === 'Mulank' ? 'मूलांक' : 'भाग्यांक') : birthType;

    if (relation === 'friendly') {
      return locale === 'hi'
        ? `नामांक ${nameNum} आपके ${typeLabel} (${birthNum}) के साथ पूर्ण सामंजस्य व शुभ ऊर्जा निर्मित करता है।`
        : `Name Number ${nameNum} naturally enhances and amplifies your ${typeLabel} (${birthNum}) energy.`;
    }
    if (relation === 'enemy') {
      return locale === 'hi'
        ? `नामांक ${nameNum} आपके ${typeLabel} (${birthNum}) के साथ वैचारिक टकराव या संघर्ष उत्पन्न कर सकता है।`
        : `Name Number ${nameNum} creates conflicting vibrations with your ${typeLabel} (${birthNum}).`;
    }
    return locale === 'hi'
      ? `नामांक ${nameNum} आपके ${typeLabel} (${birthNum}) के साथ स्थिर और संतुलित संबंध बनाए रखता है।`
      : `Name Number ${nameNum} maintains a peaceful, balanced dynamic with ${typeLabel} (${birthNum}).`;
  };

  return (
    <div className="space-y-6 sm:space-y-7 pb-10">
      {/* Page Header Area with Add to Report button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <SectionHeader
          title={t('title')}
          subtitle={t('subtitle')}
          icon={<FileSignature className="w-5 h-5 stroke-[1.5]" />}
          className="mb-0"
        />

        <button
          type="button"
          onClick={() => toggleReportSection('nameNumerology')}
          className={cn(
            'h-[40px] px-4 rounded-[12px] text-[13px] font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shrink-0 self-start sm:self-center shadow-xs',
            isIncludedInReport
              ? 'bg-[var(--success-bg)] text-[var(--success-text)] border border-[var(--success-border)]'
              : 'bg-[var(--surface)] text-[var(--heading)] border border-[var(--border)] hover:border-[var(--gold)] hover:bg-[var(--active-bg)]'
          )}
        >
          {isIncludedInReport ? (
            <Check className="w-4 h-4 text-[var(--success-text)] stroke-[2.5]" />
          ) : (
            <Plus className="w-4 h-4 text-[var(--gold)] stroke-[2]" />
          )}
          <span>
            {isIncludedInReport ? t('addedToReport') : t('addToReport')}
          </span>
        </button>
      </div>

      <ProfileEmptyBanner />

      {/* a) INPUT ROW */}
      <div className="vedic-card p-4 sm:p-5 space-y-2">
        <label className="block text-[13px] font-medium text-[var(--text-muted)]">
          {t('nameToEvaluate')}
        </label>
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <input
            type="text"
            value={testName}
            onChange={(e) => setTestName(e.target.value)}
            placeholder={
              locale === 'hi'
                ? 'नाम दर्ज करें (जैसे: Rahul / राहुल / Rahul Sharma)...'
                : 'Type any name (e.g. Rahul / राहुल / Rahul Sharma)...'
            }
            className="flex-1 w-full h-[44px] px-[14px] rounded-[12px] bg-[var(--surface)] border border-[var(--input-border)] focus:border-[var(--gold)] focus:ring-2 focus:ring-[var(--gold)]/20 text-[16px] text-[var(--heading)] placeholder:text-[var(--text-muted)] leading-[1.5] outline-hidden transition-all"
          />
          <button
            type="button"
            onClick={() => setTestName(profile.name || 'Rahul Sharma')}
            className="btn-vedic-secondary h-[44px] px-5 rounded-[12px] text-[14px] font-semibold flex items-center justify-center gap-2 cursor-pointer shrink-0 w-full sm:w-auto"
          >
            <RefreshCw className="w-4 h-4 text-[var(--gold)] stroke-[2]" />
            <span>{t('resetToProfile')}</span>
          </button>
        </div>

        {translit.isDevanagari && (
          <p className="text-xs text-[var(--gold)] font-serif mt-1.5 flex items-center gap-1.5">
            <Sparkle className="w-3.5 h-3.5 text-[var(--gold)]" />
            <span>
              {t('calculatedAs')} <strong className="font-sans font-bold">{translit.transliterated}</strong>
            </span>
          </p>
        )}
      </div>

      {/* b) HERO RESULT CARD (white, gold hairline, 24px radius, 2 columns on desktop) */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-[24px] p-5 sm:p-7 shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 divide-y lg:divide-y-0 lg:divide-x divide-[var(--border)]">
          {/* Left Column: Big Name Number, Compound, Planet, Essence */}
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              {/* Peach circle with large serif gold numeral */}
              <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-full bg-[var(--chip-bg)] border-2 border-[var(--gold)] flex items-center justify-center shrink-0 shadow-inner">
                <span className="font-serif text-3xl sm:text-4xl font-bold text-[var(--gold-deep)] tabular-nums lining-nums">
                  {animatedNumber}
                </span>
              </div>

              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                    {t('nameNumber')}
                  </span>
                  <CompoundNumber compound={nameResult.compound} reduced={nameResult.reduced} size="sm" />
                </div>

                {/* Ruling planet chip */}
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[var(--chip-bg)] text-[var(--gold-deep)] border border-[var(--gold)]">
                  <Star className="w-3.5 h-3.5 fill-[var(--gold)] text-[var(--gold)]" />
                  <span>{locale === 'hi' ? prediction.planetHi : prediction.planetEn}</span>
                </div>
              </div>
            </div>

            {/* 2-line essence */}
            <div className="p-3.5 rounded-[14px] bg-[var(--surface-muted)] border border-[var(--border)]">
              <p className="text-[13px] leading-relaxed text-[var(--text)] whitespace-pre-line font-medium">
                {locale === 'hi' ? prediction.essenceHi : prediction.essenceEn}
              </p>
            </div>
          </div>

          {/* Right Column: Harmony with birth numbers */}
          <div className="pt-6 lg:pt-0 lg:pl-8 space-y-4">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-sm font-bold font-serif text-[var(--heading)] flex items-center gap-2">
                <Compass className="w-4 h-4 text-[var(--gold)]" />
                {t('harmonyTitle')}
              </h3>
              {/* Overall Chip */}
              <span
                className={cn(
                  'px-3 py-1 rounded-full text-xs font-bold border inline-flex items-center gap-1.5',
                  overallHarmony.colorClass
                )}
              >
                <span>{locale === 'hi' ? overallHarmony.labelHi : overallHarmony.labelEn}</span>
              </span>
            </div>

            <div className="space-y-3">
              {/* Row 1: Name Number vs Mulank */}
              <div className="p-3.5 rounded-[14px] bg-[var(--surface)] border border-[var(--border)] space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-[var(--heading)]">
                    {t('vsMulank')}{' '}
                    <span className="text-[var(--gold)] font-mono font-bold">
                      ({nameResult.reduced} vs {birthNumbers.mulank})
                    </span>
                  </span>
                  {getRelationBadge(mulankHarmony)}
                </div>
                <p className="text-[12.5px] text-[var(--text-muted)] leading-relaxed">
                  {getVerdictSentence(mulankHarmony, 'Mulank', birthNumbers.mulank)}
                </p>
              </div>

              {/* Row 2: Name Number vs Bhagyank */}
              <div className="p-3.5 rounded-[14px] bg-[var(--surface)] border border-[var(--border)] space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-[var(--heading)]">
                    {t('vsBhagyank')}{' '}
                    <span className="text-[var(--gold)] font-mono font-bold">
                      ({nameResult.reduced} vs {birthNumbers.bhagyank})
                    </span>
                  </span>
                  {getRelationBadge(bhagyankHarmony)}
                </div>
                <p className="text-[12.5px] text-[var(--text-muted)] leading-relaxed">
                  {getVerdictSentence(bhagyankHarmony, 'Bhagyank', birthNumbers.bhagyank)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* c) LETTER BREAKDOWN */}
      <div className="vedic-card p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
          <h3 className="text-sm sm:text-base font-bold font-serif text-[var(--heading)] flex items-center gap-2">
            <Layers className="w-4 h-4 text-[var(--gold)]" />
            {t('letterBreakdown')}
          </h3>
          <div className="flex items-center gap-3 text-xs">
            <span className="inline-flex items-center gap-1 text-[var(--text-muted)]">
              <span className="w-2.5 h-2.5 rounded-full bg-[var(--chip-bg)] border border-[var(--gold)]" />
              {locale === 'hi' ? 'स्वर (Vowels)' : 'Vowels'}
            </span>
            <span className="inline-flex items-center gap-1 text-[var(--text-muted)]">
              <span className="w-2.5 h-2.5 rounded-full bg-[var(--surface)] border border-[var(--border)]" />
              {locale === 'hi' ? 'व्यंजन (Consonants)' : 'Consonants'}
            </span>
          </div>
        </div>

        {/* Word rows */}
        <div className="space-y-3.5">
          {nameResult.words.map((wordObj, wIdx) => (
            <div
              key={wIdx}
              className="p-3.5 rounded-[14px] bg-[var(--surface)] border border-[var(--border)] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="space-y-1.5 flex-1">
                <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider block font-sans">
                  {wordObj.word}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {wordObj.letters.map((l, lIdx) => (
                    <div
                      key={lIdx}
                      className={cn(
                        'px-2.5 py-1 rounded-xl text-xs font-medium inline-flex items-center gap-1 transition-transform',
                        l.isVowel
                          ? 'bg-[var(--chip-bg)] border border-[var(--gold)] text-[var(--gold-deep)] font-semibold'
                          : 'bg-[var(--surface)] border border-[var(--border)] text-[var(--heading)]'
                      )}
                    >
                      <span className="font-bold">{l.ch}</span>
                      <span className="text-[var(--gold)] font-mono font-bold text-[11px] tabular-nums lining-nums">
                        ={l.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Word subtotal */}
              <div className="shrink-0 self-end sm:self-center px-3 py-1.5 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-xs font-semibold text-[var(--heading)]">
                <span className="text-[var(--text-muted)] mr-1">=</span>
                <span className="font-mono tabular-nums lining-nums">{wordObj.subtotal}</span>
                <span className="mx-1 text-[var(--gold)]">→</span>
                <span className="font-serif font-bold text-[var(--gold)] tabular-nums lining-nums">
                  {wordObj.reduced}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Grand Total Line (NO "/") */}
        <div className="pt-3 border-t border-[var(--border)] flex items-center justify-between flex-wrap gap-2 text-sm font-semibold">
          <span className="text-[var(--heading)]">{t('grandTotal')}:</span>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[var(--chip-bg)] border border-[var(--gold)] text-[var(--heading)]">
            <span className="text-xs text-[var(--text-muted)]">{locale === 'hi' ? 'कुल कंपन' : 'Total'}</span>
            <span className="font-mono font-bold tabular-nums lining-nums">{nameResult.compound}</span>
            <span className="text-[var(--gold)] font-bold">→</span>
            <span className="font-serif text-base font-bold text-[var(--gold-deep)] tabular-nums lining-nums">
              {nameResult.reduced}
            </span>
          </div>
        </div>
      </div>

      {/* d) PREDICTION SECTION (2x2 grid, 1 col mobile) + Compound Meaning Strip */}
      <div className="space-y-4">
        {/* Compound Number Meaning Strip (10-52) */}
        {compoundMeaning && (
          <div className="p-3.5 sm:p-4 rounded-[16px] bg-[var(--chip-bg)] border border-[var(--gold)]/40 flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-[var(--gold)] shrink-0" />
            <p className="text-[13px] leading-relaxed text-[var(--heading)]">
              <strong className="text-[var(--gold)] font-serif mr-1.5">
                {locale === 'hi' ? `संयुक्त अंक ${nameResult.compound} का प्रभाव:` : `Compound Vibration ${nameResult.compound}:`}
              </strong>
              {compoundMeaning}
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          {/* Card 1: Personality & Nature */}
          <div className="vedic-card p-5 space-y-2.5">
            <div className="flex items-center gap-2 text-sm font-bold font-serif text-[var(--heading)] border-b border-[var(--border)] pb-2.5">
              <User className="w-4 h-4 text-[var(--gold)]" />
              <h4>{t('personalityNature')}</h4>
            </div>
            <p className="text-[13px] leading-relaxed text-[var(--text)]">
              {locale === 'hi' ? prediction.sections.personality.hi : prediction.sections.personality.en}
            </p>
          </div>

          {/* Card 2: Career & Finance */}
          <div className="vedic-card p-5 space-y-2.5">
            <div className="flex items-center gap-2 text-sm font-bold font-serif text-[var(--heading)] border-b border-[var(--border)] pb-2.5">
              <Briefcase className="w-4 h-4 text-[var(--gold)]" />
              <h4>{t('careerFinance')}</h4>
            </div>
            <p className="text-[13px] leading-relaxed text-[var(--text)]">
              {locale === 'hi' ? prediction.sections.career.hi : prediction.sections.career.en}
            </p>
          </div>

          {/* Card 3: Relationships */}
          <div className="vedic-card p-5 space-y-2.5">
            <div className="flex items-center gap-2 text-sm font-bold font-serif text-[var(--heading)] border-b border-[var(--border)] pb-2.5">
              <Heart className="w-4 h-4 text-[var(--gold)]" />
              <h4>{t('relationships')}</h4>
            </div>
            <p className="text-[13px] leading-relaxed text-[var(--text)]">
              {locale === 'hi' ? prediction.sections.relationships.hi : prediction.sections.relationships.en}
            </p>
          </div>

          {/* Card 4: Strengths & Cautions */}
          <div className="vedic-card p-5 space-y-2.5">
            <div className="flex items-center gap-2 text-sm font-bold font-serif text-[var(--heading)] border-b border-[var(--border)] pb-2.5">
              <ShieldAlert className="w-4 h-4 text-[var(--warn-text)]" />
              <h4>{t('strengthsCautions')}</h4>
            </div>
            <p className="text-[13px] leading-relaxed text-[var(--text)]">
              {locale === 'hi' ? prediction.sections.cautions.hi : prediction.sections.cautions.en}
            </p>
          </div>
        </div>
      </div>

      {/* e) LUCKY LETTERS & NUMBERS */}
      <div className="vedic-card p-5 sm:p-6 space-y-4">
        <h3 className="text-sm sm:text-base font-bold font-serif text-[var(--heading)] flex items-center gap-2 border-b border-[var(--border)] pb-3">
          <Star className="w-4 h-4 text-[var(--gold)]" />
          {locale === 'hi' ? 'शुभ नामांक एवं अक्षर' : 'Lucky Name Numbers & Letters'}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Lucky numbers friendly with both Mulank and Bhagyank */}
          <div className="p-4 rounded-[14px] bg-[var(--surface)] border border-[var(--border)] space-y-2">
            <span className="text-xs font-semibold text-[var(--text-muted)] block">
              {t('luckyNumbersTitle')}
            </span>
            <div className="flex flex-wrap gap-2 pt-1">
              {luckyNumbers.map((num) => (
                <div
                  key={num}
                  className="w-9 h-9 rounded-full bg-[var(--chip-bg)] border border-[var(--gold)] flex items-center justify-center text-[var(--heading)] font-serif font-bold text-sm shadow-2xs tabular-nums lining-nums"
                >
                  {num}
                </div>
              ))}
            </div>
          </div>

          {/* Lucky letters corresponding to lucky numbers */}
          <div className="p-4 rounded-[14px] bg-[var(--surface)] border border-[var(--border)] space-y-2">
            <span className="text-xs font-semibold text-[var(--text-muted)] block">
              {t('luckyLettersTitle')}
            </span>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {luckyLetters.map((ch) => (
                <div
                  key={ch}
                  className="w-8 h-8 rounded-xl bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center text-[var(--heading)] font-bold text-xs shadow-2xs"
                >
                  {ch}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* f) NAME CORRECTION SUGGESTIONS (compact table desktop, stacked cards on mobile) */}
      <div className="vedic-card p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
          <h3 className="text-sm sm:text-base font-bold font-serif text-[var(--heading)] flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[var(--gold)]" />
            {t('correctionTitle')}
          </h3>
          <span className="text-xs text-[var(--text-muted)]">
            {locale === 'hi' ? 'अधिकतम 5 सुझाव' : 'Top 5 harmonized variants'}
          </span>
        </div>

        {spellingSuggestions.length > 0 ? (
          <div>
            {/* Desktop Table View */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[var(--border)] text-[var(--text-muted)] font-semibold">
                    <th className="py-2.5 px-3">{t('suggestedSpelling')}</th>
                    <th className="py-2.5 px-3">{t('totalReduced')}</th>
                    <th className="py-2.5 px-3">{t('harmonyBadges')}</th>
                    <th className="py-2.5 px-3">{t('changeMade')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  {spellingSuggestions.map((sug, idx) => (
                    <tr key={idx} className="hover:bg-[var(--surface)] transition-colors">
                      <td className="py-3 px-3 font-semibold text-[var(--heading)] text-sm">
                        {sug.suggestedName}
                      </td>
                      <td className="py-3 px-3">
                        <span className="inline-flex items-center gap-1 font-mono tabular-nums lining-nums">
                          <span>{sug.compound}</span>
                          <span className="text-[var(--gold)] font-bold">→</span>
                          <span className="font-serif font-bold text-[var(--gold)] text-sm">
                            {sug.reduced}
                          </span>
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="px-2 py-0.5 rounded-full text-[10.5px] font-semibold bg-[var(--success-bg)] text-[var(--success-text)] border border-[var(--success-border)]">
                            M: Friendly
                          </span>
                          <span className="px-2 py-0.5 rounded-full text-[10.5px] font-semibold bg-[var(--success-bg)] text-[var(--success-text)] border border-[var(--success-border)]">
                            B: Friendly
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-[var(--text-muted)] font-medium">
                        {sug.changeMade}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Stacked Cards (<640px) */}
            <div className="block sm:hidden space-y-3">
              {spellingSuggestions.map((sug, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-[14px] bg-[var(--surface)] border border-[var(--border)] space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[var(--heading)] text-sm">
                      {sug.suggestedName}
                    </span>
                    <span className="inline-flex items-center gap-1 font-mono tabular-nums lining-nums">
                      <span>{sug.compound}</span>
                      <span className="text-[var(--gold)] font-bold">→</span>
                      <span className="font-serif font-bold text-[var(--gold)] text-sm">
                        {sug.reduced}
                      </span>
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] pt-1 border-t border-[var(--border)]/60">
                    <span className="text-[var(--text-muted)]">{sug.changeMade}</span>
                    <div className="flex items-center gap-1">
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-[var(--success-bg)] text-[var(--success-text)] border border-[var(--success-border)]">
                        M: Friendly
                      </span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-[var(--success-bg)] text-[var(--success-text)] border border-[var(--success-border)]">
                        B: Friendly
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-[14px] bg-[var(--surface)] border border-[var(--border)] text-xs text-[var(--text-muted)] leading-relaxed text-center">
            {t('emptySuggestions')}
          </div>
        )}

        <p className="text-[11.5px] text-[var(--text-muted)] italic pt-1">
          {t('guidanceNote')}
        </p>
      </div>

      {/* g) REMEDIES FOR NAME NUMBER */}
      {nameRemedy && (
        <div className="vedic-card p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
            <h3 className="text-sm sm:text-base font-bold font-serif text-[var(--heading)] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[var(--gold)]" />
              {t('remediesTitle')} — {nameResult.reduced} ({locale === 'hi' ? prediction.planetHi : prediction.planetEn})
            </h3>
            <RemedyChip
              category={locale === 'hi' ? nameRemedy.categoryHi : nameRemedy.category}
              label={locale === 'hi' ? nameRemedy.title.hi : nameRemedy.title.en}
            />
          </div>

          <div className="space-y-3 text-[13px] text-[var(--text)] leading-relaxed">
            <p className="font-medium text-[var(--heading)]">
              {locale === 'hi' ? nameRemedy.overview.hi : nameRemedy.overview.en}
            </p>

            <div className="p-3.5 rounded-[14px] bg-[var(--surface)] border border-[var(--border)] space-y-1.5">
              <span className="text-xs font-semibold text-[var(--gold)] block">
                {locale === 'hi' ? 'वैदिक विधि:' : 'Recommended Practice:'}
              </span>
              <p className="text-xs text-[var(--text)] leading-relaxed">
                {locale === 'hi' ? nameRemedy.method.hi : nameRemedy.method.en}
              </p>
            </div>

            {nameRemedy.bestDayTime && (
              <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
                <Clock className="w-3.5 h-3.5 text-[var(--gold)] shrink-0" />
                <span>
                  <strong>{locale === 'hi' ? 'सर्वोत्तम समय:' : 'Optimal Timing:'}</strong>{' '}
                  {locale === 'hi' ? nameRemedy.bestDayTime.hi : nameRemedy.bestDayTime.en}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
