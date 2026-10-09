'use client';

import React, { useState, useMemo } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Briefcase, KeyRound, Sparkles, RefreshCw, Copy, Check, Search } from 'lucide-react';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { NumberBadge } from '@/components/ui/NumberBadge';
import { PredictionCard } from '@/components/ui/PredictionCard';
import { ProfileEmptyBanner } from '@/components/ProfileEmptyBanner';
import { useNumerologyStore } from '@/lib/store/useNumerologyStore';
import { calculateMulank } from '@/lib';
import { PROFESSIONS_PROFILES, generatePasswordByProfession, GeneratedPassword } from '@/lib/engine/security';

export default function ProfessionPage() {
  const t = useTranslations('professionPage');
  const locale = (useLocale() || 'en') as 'en' | 'hi';
  const profile = useNumerologyStore((s) => s.profile);

  const mulank = profile.dob ? calculateMulank(profile.dob).mulank : 1;

  const [selectedProf, setSelectedProf] = useState('tech');
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // Generate 3 suggested passwords based on profession + mulank
  const [passwords, setPasswords] = useState<GeneratedPassword[]>(() => [
    generatePasswordByProfession('tech', 12, true, true),
    generatePasswordByProfession('tech', 14, true, false),
    generatePasswordByProfession('tech', 10, true, true),
  ]);

  const profileData = PROFESSIONS_PROFILES[selectedProf] || PROFESSIONS_PROFILES.tech;

  const filteredProfessions = useMemo(() => {
    return Object.entries(PROFESSIONS_PROFILES).filter(([key, prof]) => {
      const q = searchTerm.toLowerCase();
      return (
        prof.titleEn.toLowerCase().includes(q) ||
        prof.titleHi.includes(q) ||
        key.includes(q)
      );
    });
  }, [searchTerm]);

  const handleSelectProfession = (profKey: string) => {
    setSelectedProf(profKey);
    setPasswords([
      generatePasswordByProfession(profKey, 12, true, true),
      generatePasswordByProfession(profKey, 14, true, false),
      generatePasswordByProfession(profKey, 10, true, true),
    ]);
  };

  const handleRegenerate = () => {
    setPasswords([
      generatePasswordByProfession(selectedProf, 12, true, true),
      generatePasswordByProfession(selectedProf, 14, true, false),
      generatePasswordByProfession(selectedProf, 10, true, true),
    ]);
  };

  const copyToClipboard = (pwd: string, idx: number) => {
    navigator.clipboard.writeText(pwd);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="space-y-6 sm:space-y-7">
      <SectionHeader
        title={t('title')}
        subtitle={t('subtitle')}
        badge={locale === 'hi' ? 'व्यवसाय अंक 10' : 'CAREER VIBRATIONS 10'}
        icon={<Briefcase className="w-5 h-5 stroke-[1.5]" />}
      />

      <ProfileEmptyBanner />

      {/* Searchable Profession Dropdown & Selector */}
      <div className="vedic-card p-4 sm:p-5 space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <label className="text-xs font-semibold text-[var(--heading)]">
            {locale === 'hi' ? 'कार्यक्षेत्र चुनें (सर्च योग्य सूची)' : 'Select Profession (Searchable)'}
          </label>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-[var(--text-muted)]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={locale === 'hi' ? 'व्यवसाय खोजें...' : 'Search profession...'}
              className="w-full pl-9 pr-3 py-1.5 h-[36px] rounded-xl bg-[var(--surface)] border border-[var(--input-border)] text-xs text-[var(--heading)] outline-hidden focus:border-[var(--gold)]"
            />
          </div>
        </div>

        {/* Profession Chips / Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 pt-1">
          {filteredProfessions.map(([key, prof]) => (
            <button
              key={key}
              type="button"
              onClick={() => handleSelectProfession(key)}
              className={`p-2.5 rounded-xl text-xs font-serif font-bold border transition-all text-center flex flex-col items-center justify-center gap-0.5 cursor-pointer ${
                selectedProf === key
                  ? 'bg-[var(--active-bg)] text-[var(--heading)] border-[var(--gold)] shadow-xs'
                  : 'bg-[var(--surface)] text-[var(--text-muted)] border-[var(--border)] hover:bg-[var(--chip-bg)]/40 hover:text-[var(--heading)]'
              }`}
            >
              <span>{locale === 'hi' ? prof.titleHi : prof.titleEn}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Selected Profession Numerology Profile & Prediction */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Favorable Numbers & Rationale */}
        <div className="vedic-card p-4 sm:p-5 space-y-3.5">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-[var(--gold)] uppercase tracking-wider block mb-0.5">
                {locale === 'hi' ? profileData.titleHi : profileData.titleEn}
              </span>
              <h3 className="text-base font-bold font-serif text-[var(--heading)]">{t('auspiciousNumbers')}</h3>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-[var(--text-muted)] block">Driver Resonance</span>
              <span className="text-xs font-bold font-serif text-[var(--gold)]">Mulank {mulank}</span>
            </div>
          </div>

          <div className="flex gap-2">
            {profileData.auspiciousTotals.map((num) => (
              <NumberBadge key={num} number={num} size="md" variant="gold" />
            ))}
          </div>

          <div>
            <span className="text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider block mb-1.5">
              {t('recommendedKeywords')}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {(locale === 'hi' ? profileData.recommendedKeywordsHi : profileData.recommendedKeywordsEn).map((kw, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 rounded-lg bg-[var(--chip-bg)] border border-[var(--border)] text-[11px] text-[var(--heading)] font-medium"
                >
                  {kw}
                </span>
              ))}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[var(--surface)] border border-[var(--border)] space-y-0.5 text-[11.5px]">
            <span className="font-bold text-[var(--gold)] block">{t('rationale')}</span>
            <p className="text-[var(--text)] leading-relaxed">
              {locale === 'hi' ? profileData.reasonHi : profileData.reasonEn}
            </p>
          </div>
        </div>

        {/* 3 Suggested Passwords with Copy Buttons */}
        <div className="vedic-card p-4 sm:p-5 space-y-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-1 border-b border-[var(--border)]">
            <div>
              <span className="text-[10px] font-bold text-[var(--gold)] uppercase tracking-wider">
                Cryptographic Numerology (3 Variations)
              </span>
              <h3 className="text-base font-bold font-serif text-[var(--heading)]">{t('suggestedPassword')}</h3>
            </div>
            <button
              type="button"
              onClick={handleRegenerate}
              className="text-xs text-[var(--gold)] hover:underline flex items-center gap-1 font-semibold cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              <span>{t('generateNew')}</span>
            </button>
          </div>

          <div className="space-y-2.5">
            {passwords.map((pwd, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-[var(--surface)] border border-[var(--border)] space-y-1.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs sm:text-sm font-bold text-[var(--heading)] tracking-wider break-all select-all">
                    {pwd.password}
                  </span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(pwd.password, idx)}
                    className="p-1.5 rounded-lg bg-[var(--chip-bg)] border border-[var(--border)] text-[var(--gold)] hover:bg-[var(--active-bg)] transition-colors shrink-0 cursor-pointer"
                    title="Copy password"
                  >
                    {copiedIndex === idx ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
                <div className="flex items-center justify-between text-[10.5px] text-[var(--text-muted)] pt-1 border-t border-[var(--border)]/60">
                  <span>Chaldean Sum: <strong className="text-[var(--gold)]">{pwd.totalSum} = {pwd.reducedTotal}</strong></span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                    Strong Harmonic
                  </span>
                </div>
              </div>
            ))}
          </div>

          <p className="text-[11px] text-[var(--text-muted)] leading-relaxed pt-1">
            {locale === 'hi'
              ? 'ये पासवर्ड आपके कार्यक्षेत्र और मूलांक के शुभ अंकों के योग पर निर्मित हैं, जो डिजिटल सुरक्षा के साथ सकारात्मक ऊर्जा प्रदान करते हैं।'
              : 'These passwords combine industry vibration keywords with your favorable driver sum for enhanced digital prosperity.'}
          </p>
        </div>
      </div>
    </div>
  );
}
