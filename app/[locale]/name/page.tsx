'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { FileSignature, Sparkles, RefreshCw } from 'lucide-react';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { NumberBadge } from '@/components/ui/NumberBadge';
import { PredictionCard } from '@/components/ui/PredictionCard';
import { ProfileEmptyBanner } from '@/components/ProfileEmptyBanner';
import { useNumerologyStore } from '@/lib/store/useNumerologyStore';
import { calculateDestinyNumber, transliterateDevanagari, numerologyService } from '@/lib';
import { DestinyReading } from '@/types';

export default function NamePage() {
  const t = useTranslations('namePage');
  const locale = (useLocale() || 'en') as 'en' | 'hi';
  const profile = useNumerologyStore((s) => s.profile);

  const [testName, setTestName] = useState(profile.name || 'Rahul Sharma');
  const [reading, setReading] = useState<DestinyReading | null>(null);

  const chaldean = useMemo(() => calculateDestinyNumber(testName, 'chaldean'), [testName]);
  const pythagorean = useMemo(() => calculateDestinyNumber(testName, 'pythagorean'), [testName]);
  const translit = useMemo(() => transliterateDevanagari(testName), [testName]);

  useEffect(() => {
    numerologyService.getDestinyReading(chaldean.destinyNumber, 'chaldean', locale).then(setReading);
  }, [chaldean.destinyNumber, locale]);

  return (
    <div className="space-y-6 sm:space-y-7">
      <SectionHeader
        title={t('title')}
        subtitle={t('subtitle')}
        badge={locale === 'hi' ? 'नाम अंकशास्त्र 07' : 'NAME NUMEROLOGY 07'}
        icon={<FileSignature className="w-5 h-5 stroke-[1.5]" />}
      />

      <ProfileEmptyBanner />

      {/* Input box to test alternate spellings */}
      <div className="vedic-card p-4 sm:p-5 space-y-2.5">
        <label className="block text-[11px] font-semibold text-[var(--text-muted)]">
          {t('inputNameLabel')}
        </label>
        <div className="flex flex-col sm:flex-row gap-2.5">
          <input
            type="text"
            value={testName}
            onChange={(e) => setTestName(e.target.value)}
            placeholder="Type any name (e.g. Rahul / राहुल / Rahul K Sharma)..."
            className="flex-1 h-[40px] px-3.5 rounded-xl bg-[var(--surface)] border border-[var(--input-border)] focus:border-[var(--gold)] focus:ring-1 focus:ring-[var(--gold)] text-xs text-[var(--heading)] outline-hidden transition-all"
          />
          <button
            type="button"
            onClick={() => setTestName(profile.name || 'Rahul Sharma')}
            className="btn-vedic-secondary h-[40px] px-3.5 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
          >
            <RefreshCw className="w-3 h-3 text-[var(--gold)]" />
            <span>Reset to Profile</span>
          </button>
        </div>

        {translit.isDevanagari && (
          <p className="text-[11px] text-[var(--gold)] font-serif">
            Transliterated to Latin: <strong>{translit.transliterated}</strong>
          </p>
        )}
      </div>

      {/* Side-by-side Chaldean & Pythagorean calculation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Chaldean Box */}
        <div className="vedic-card p-4 sm:p-5 space-y-3.5">
          <div className="flex items-center justify-between pb-2.5 border-b border-[var(--border)]">
            <div>
              <span className="px-2 py-0.5 rounded-full text-[9.5px] font-bold bg-[var(--chip-bg)] text-[var(--gold)] border border-[var(--border)]">
                Primary Vedic Standard
              </span>
              <h3 className="text-sm sm:text-[15px] font-bold font-serif text-[var(--heading)] mt-1">
                {t('chaldeanTotal')}
              </h3>
            </div>
            <NumberBadge number={chaldean.destinyNumber} size="md" variant="gold" />
          </div>

          <div className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-[var(--surface)] border border-[var(--border)]">
            <span className="text-[var(--text-muted)] text-[11px]">Compound / Root:</span>
            <span className="text-[var(--gold)] font-serif font-bold text-sm">{chaldean.compoundStr}</span>
          </div>

          <div>
            <span className="text-[10.5px] font-semibold text-[var(--text-muted)] block mb-1.5">
              Letter Sound Values (1 to 8):
            </span>
            <div className="flex flex-wrap gap-1">
              {chaldean.letterBreakdown.map((l, i) => (
                <div key={i} className="px-2 py-1 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-[11px] flex items-center gap-1">
                  <span className="font-bold text-[var(--heading)]">{l.char}</span>
                  <span className="text-[var(--gold)] font-serif font-bold text-[10px]">={l.value}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="text-[11px] text-[var(--text)] leading-relaxed p-2.5 rounded-xl bg-[var(--surface)] border border-[var(--border)]">
            {locale === 'hi'
              ? `कील्डियन पद्धति में अक्षर ध्वनि कंपन के आधार पर कुल योग ${chaldean.compoundNumber} बना, जो एकल अंक ${chaldean.destinyNumber} पर संकुचित होता है।`
              : `In Chaldean numerology, the sound frequency total is ${chaldean.compoundNumber}, culminating in Root Destiny ${chaldean.destinyNumber}.`}
          </p>
        </div>

        {/* Pythagorean Box */}
        <div className="vedic-card p-4 sm:p-5 space-y-3.5">
          <div className="flex items-center justify-between pb-2.5 border-b border-[var(--border)]">
            <div>
              <span className="px-2 py-0.5 rounded-full text-[9.5px] font-bold bg-[var(--chip-bg)] text-[var(--text-muted)] border border-[var(--border)]">
                Western Alphabetical
              </span>
              <h3 className="text-sm sm:text-[15px] font-bold font-serif text-[var(--heading)] mt-1">
                {t('pythagoreanTotal')}
              </h3>
            </div>
            <NumberBadge number={pythagorean.destinyNumber} size="md" variant="gold" />
          </div>

          <div className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-[var(--surface)] border border-[var(--border)]">
            <span className="text-[var(--text-muted)] text-[11px]">Compound / Root:</span>
            <span className="text-[var(--gold)] font-serif font-bold text-sm">{pythagorean.compoundStr}</span>
          </div>

          <div>
            <span className="text-[10.5px] font-semibold text-[var(--text-muted)] block mb-1.5">
              Alphabetical Sequence Values (1 to 9):
            </span>
            <div className="flex flex-wrap gap-1">
              {pythagorean.letterBreakdown.map((l, i) => (
                <div key={i} className="px-2 py-1 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-[11px] flex items-center gap-1">
                  <span className="font-bold text-[var(--heading)]">{l.char}</span>
                  <span className="text-[var(--gold)] font-serif font-bold text-[10px]">={l.value}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="text-[11px] text-[var(--text)] leading-relaxed p-2.5 rounded-xl bg-[var(--surface)] border border-[var(--border)]">
            {locale === 'hi'
              ? `पाइथागोरियन पद्धति में वर्णमाला क्रम के आधार पर कुल योग ${pythagorean.compoundNumber} बना, जो एकल अंक ${pythagorean.destinyNumber} पर संकुचित होता है।`
              : `In Pythagorean numerology, the alphabetic order total is ${pythagorean.compoundNumber}, resulting in Root Destiny ${pythagorean.destinyNumber}.`}
          </p>
        </div>
      </div>

      {/* Reduced Number Prediction */}
      {reading && (
        <PredictionCard
          title={`${locale === 'hi' ? 'नामांक फलादेश' : 'Name Number Reading'} — ${reading.number}`}
          badge={`Vedic Total ${chaldean.destinyNumber}`}
          badgeVariant="gold"
          sectionKey="module7_name_prediction"
          icon={<Sparkles className="w-4 h-4 text-[var(--gold)]" />}
        >
          <div className="space-y-2 text-[12.5px] text-[var(--text)]">
            <p className="leading-relaxed">
              {locale === 'hi' ? reading.lifeMission.hi : reading.lifeMission.en}
            </p>
            <p className="text-[11.5px] text-[var(--text-muted)] leading-relaxed">
              {locale === 'hi' ? reading.relationshipStyle.hi : reading.relationshipStyle.en}
            </p>
          </div>
        </PredictionCard>
      )}
    </div>
  );
}
