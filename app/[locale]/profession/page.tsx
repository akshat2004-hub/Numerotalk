'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import {
  Briefcase,
  Sparkles,
  Clock,
  Check,
  Copy,
  Search,
  Star,
  ShieldAlert,
  TrendingUp,
  FileText,
  KeyRound,
  ArrowRight
} from 'lucide-react';
import { SectionHeader } from '@/frontend/components/ui/SectionHeader';
import { NumberBadge } from '@/frontend/components/ui/NumberBadge';
import { ProfileEmptyBanner } from '@/frontend/components/ProfileEmptyBanner';
import { Select } from '@/frontend/components/ui/Select';
import { useNumerologyStore } from '@/frontend/store/useNumerologyStore';
import {
  recommendProfessions,
  evaluateSingleProfession,
  PROFESSIONS_LIST,
  RecommendedProfessionResult
} from '@/core/engine/profession';
import { generateSecurePassword, GeneratedPasswordMatch } from '@/core/engine/security';

export default function ProfessionPage() {
  const t = useTranslations('professionPage');
  const locale = (useLocale() || 'en') as 'en' | 'hi';

  const profile = useNumerologyStore((s) => s.profile);
  const setProfile = useNumerologyStore((s) => s.setProfile);
  const storedProfession = useNumerologyStore((s) => s.selectedProfession);
  const setSelectedProfession = useNumerologyStore((s) => s.setSelectedProfession);
  const toggleReportSection = useNumerologyStore((s) => s.toggleReportSection);
  const reportSections = useNumerologyStore((s) => s.reportSections);

  // Birth time inline editor
  const [inlineTime, setInlineTime] = useState(profile.birthTime || '');
  const hasBirthTime = Boolean(profile.birthTime && profile.birthTime.includes(':'));

  const handleSaveBirthTime = () => {
    if (inlineTime) {
      setProfile({ birthTime: inlineTime });
    }
  };

  // Top recommendations from engine
  const recommendations: RecommendedProfessionResult[] = useMemo(() => {
    return recommendProfessions(profile, 3);
  }, [profile]);

  // Active selected profession id
  const [selectedProfId, setSelectedProfId] = useState<string>(
    storedProfession || recommendations[0]?.profession.id || 'tech_entrepreneur'
  );

  useEffect(() => {
    if (storedProfession) {
      setSelectedProfId(storedProfession);
    } else if (recommendations[0]?.profession.id) {
      setSelectedProfId(recommendations[0]?.profession.id);
    }
  }, [storedProfession, recommendations]);

  const activeResult: RecommendedProfessionResult | null = useMemo(() => {
    // If selected is among top 3, use it directly
    const foundInTop = recommendations.find((r) => r.profession.id === selectedProfId);
    if (foundInTop) return foundInTop;
    // Otherwise evaluate using single evaluator
    return evaluateSingleProfession(selectedProfId, profile) || recommendations[0] || null;
  }, [selectedProfId, recommendations, profile]);

  // Passwords for the selected profession
  const [passwords, setPasswords] = useState<GeneratedPasswordMatch[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [addedReport, setAddedReport] = useState<boolean>(false);

  useEffect(() => {
    if (activeResult) {
      const lucky = activeResult.luckyWorkNumbers[0] || 5;
      const p1 = generateSecurePassword({ length: 14, includeUppercase: true, includeSymbols: true, targetLuckyNumber: lucky });
      const p2 = generateSecurePassword({ length: 12, includeUppercase: true, includeSymbols: true, targetLuckyNumber: lucky });
      const p3 = generateSecurePassword({ length: 16, includeUppercase: true, includeSymbols: true, targetLuckyNumber: lucky });
      setPasswords([p1, p2, p3]);
    }
  }, [activeResult]);

  const copyPassword = (pwd: string, idx: number) => {
    navigator.clipboard.writeText(pwd);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleSelectProfession = (profId: string) => {
    setSelectedProfId(profId);
    setSelectedProfession(profId);
  };

  const handleAddToReport = () => {
    if (!reportSections.profession) {
      toggleReportSection('profession');
    }
    setAddedReport(true);
    setTimeout(() => setAddedReport(false), 2500);
  };

  // Secondary "Check another profession" searchable dropdown
  const [otherProfSearch, setOtherProfSearch] = useState('');
  const [otherProfId, setOtherProfId] = useState('');
  const evaluatedOther = useMemo(() => {
    if (!otherProfId) return null;
    return evaluateSingleProfession(otherProfId, profile);
  }, [otherProfId, profile]);

  const filteredOtherProfessions = useMemo(() => {
    const q = otherProfSearch.toLowerCase().trim();
    return PROFESSIONS_LIST.filter(
      (p) =>
        p.name.en.toLowerCase().includes(q) ||
        p.name.hi.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    );
  }, [otherProfSearch]);

  return (
    <div className="space-y-6 sm:space-y-7">
      <SectionHeader
        title={locale === 'hi' ? 'कार्यक्षेत्र एवं' : 'Profession &'}
        goldTitle={locale === 'hi' ? 'करियर' : 'Career'}
        subtitle={
          locale === 'hi'
            ? 'आपकी जन्म तिथि, नामांक एवं जन्म समय पर आधारित सर्वश्रेष्ठ करियर संरेखण।'
            : 'Astrological and numerological alignment for optimal career choices and workspace energy.'
        }
        icon={<Briefcase className="w-5 h-5 stroke-[1.5]" />}
      />

      <ProfileEmptyBanner />

      {/* Inline Birth Time Card if missing */}
      {!hasBirthTime && (
        <div className="vedic-card p-4 sm:p-5 border border-[var(--border)] bg-[var(--chip-bg)]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-[var(--chip-bg)] text-[var(--gold)] flex items-center justify-center shrink-0 mt-0.5">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-sm text-[var(--heading)]">
                {locale === 'hi' ? 'सटीक मिलान हेतु जन्म समय जोड़ें' : 'Add your birth time for a sharper match'}
              </h4>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">
                {locale === 'hi'
                  ? 'वर्तमान सिफारिशें जन्मतिथि व नामांक पर आधारित हैं। जन्म समय जोड़ने से समय-अंक सक्रिय होगा।'
                  : 'Recommendations are currently based on DOB & Name. Adding birth time factors in your Time Number for peak cosmic precision.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
            <input
              type="time"
              value={inlineTime}
              onChange={(e) => setInlineTime(e.target.value)}
              className="h-[38px] px-3 rounded-xl bg-[var(--surface)] border border-[var(--input-border)] text-xs text-[var(--heading)] focus:border-[var(--gold)] outline-hidden font-mono"
            />
            <button
              type="button"
              onClick={handleSaveBirthTime}
              className="btn-gold-gradient h-[38px] px-4 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{locale === 'hi' ? 'सुरक्षित करें' : 'Save Time'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Section: "Best Professions for You" */}
      <div className="space-y-4">
        <div>
          <h3 className="font-serif font-bold text-base sm:text-lg text-[var(--heading)] flex items-center gap-2">
            <Sparkles className="w-4.5 h-4.5 text-[var(--gold)]" />
            <span>{locale === 'hi' ? 'आपके लिए सर्वश्रेष्ठ कार्यक्षेत्र' : 'Best Professions for You'}</span>
          </h3>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            {locale === 'hi'
              ? 'मूलांक, भाग्यांक, नामांक और ग्रिड अंकों के आधार पर शीर्ष अनुशंसित करियर'
              : 'Ranked career domains tailored to your Driver, Life Path, Destiny, and Birth Vedic Grid'}
          </p>
        </div>

        {/* 3 Ranked Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recommendations.map((rec, idx) => {
            const isSelected = selectedProfId === rec.profession.id;
            const reasons = locale === 'hi' ? rec.reasonsHi : rec.reasonsEn;
            const rankLabel = idx === 0 ? '#1 Top Match' : idx === 1 ? '#2 Best Fit' : '#3 Prime Path';
            const rankLabelHi = idx === 0 ? '#1 शीर्ष संरेखण' : idx === 1 ? '#2 अनुकूल क्षेत्र' : '#3 शुभ मार्ग';

            return (
              <div
                key={rec.profession.id}
                onClick={() => handleSelectProfession(rec.profession.id)}
                className={`vedic-card p-5 cursor-pointer transition-all flex flex-col justify-between relative overflow-hidden ${
                  isSelected
                    ? 'ring-2 ring-[var(--gold)] border-[var(--gold)] shadow-md bg-[var(--surface)]'
                    : 'hover:border-[var(--gold)]/60 hover:shadow-xs'
                }`}
              >
                {/* Top Rank Badge & Match % */}
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide ${
                        idx === 0
                          ? 'bg-[var(--chip-bg)] text-[var(--heading)] border border-[var(--gold)]'
                          : 'bg-[var(--chip-bg)] text-[var(--heading)] border border-[var(--border)]'
                      }`}
                    >
                      {locale === 'hi' ? rankLabelHi : rankLabel}
                    </span>

                    {/* Match Score Indicator */}
                    <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[var(--success-bg)] text-[var(--success-text)] border border-[var(--success-border)]">
                      <span className="font-serif font-bold text-xs lining-nums">{rec.score}%</span>
                      <span className="text-[10px] uppercase font-bold text-[var(--success-text)]">Match</span>
                    </div>
                  </div>

                  {/* Profession Title & Icon */}
                  <div className="flex items-center gap-2.5 mb-2.5">
                    <span className="text-2xl">{rec.profession.icon}</span>
                    <h4 className="font-serif font-bold text-base text-[var(--heading)] leading-snug">
                      {rec.profession.name[locale]}
                    </h4>
                  </div>

                  {/* Category Pill */}
                  <span className="inline-block text-[10px] uppercase tracking-wider font-bold text-[var(--gold)] bg-[var(--chip-bg)] px-2 py-0.5 rounded-md border border-[var(--border)] mb-3">
                    {rec.profession.category.replace('_', ' ')}
                  </span>

                  {/* "Why this fits" Bullets */}
                  <div className="space-y-1.5 border-t border-[var(--border)] pt-3 mb-4">
                    <span className="text-[11px] font-bold text-[var(--text-muted)] block uppercase tracking-wider">
                      {locale === 'hi' ? 'अनुकूलता का कारण:' : 'Why this fits:'}
                    </span>
                    <ul className="space-y-1">
                      {reasons.slice(0, 3).map((r, rIdx) => (
                        <li key={rIdx} className="text-xs text-[var(--heading)] flex items-start gap-1.5 leading-relaxed">
                          <span className="text-[var(--gold)] font-bold shrink-0 mt-0.5">•</span>
                          <span>{r}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Footer Action Hint */}
                <div className="pt-2 border-t border-[var(--border)] flex items-center justify-between text-xs">
                  <span className={`font-semibold ${isSelected ? 'text-[var(--gold)]' : 'text-[var(--text-muted)]'}`}>
                    {isSelected
                      ? locale === 'hi'
                        ? 'चयनित कार्यक्षेत्र ✓'
                        : 'Selected Profile ✓'
                      : locale === 'hi'
                      ? 'विस्तार देखने हेतु क्लिक करें'
                      : 'Click to inspect'}
                  </span>
                  <ArrowRight className={`w-3.5 h-3.5 ${isSelected ? 'text-[var(--gold)]' : 'text-[var(--text-muted)]'}`} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Profession Detailed Analysis Section */}
      {activeResult && (
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif font-bold text-base sm:text-lg text-[var(--heading)] flex items-center gap-2">
                <span className="text-xl">{activeResult.profession.icon}</span>
                <span>
                  {locale === 'hi' ? 'विस्तृत विश्लेषण:' : 'Detailed Career Forecast:'}{' '}
                  <span className="text-[var(--gold)]">{activeResult.profession.name[locale]}</span>
                </span>
              </h3>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">
                {locale === 'hi'
                  ? 'सफलता चक्र, अनुकूल अंक व रंग तथा डिजिटल सुरक्षा संरेखण'
                  : 'Growth timelines, workspace vibrations, favorable colors, and password tuning'}
              </p>
            </div>

            <button
              type="button"
              onClick={handleAddToReport}
              className="btn-gold-gradient px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              {addedReport ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>{locale === 'hi' ? 'रिपोर्ट में जोड़ा गया' : 'Added to Report'}</span>
                </>
              ) : (
                <>
                  <FileText className="w-3.5 h-3.5" />
                  <span>{locale === 'hi' ? 'रिपोर्ट में जोड़ें' : 'Add to Report'}</span>
                </>
              )}
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Left: Predictions, Growth Period & Workspace Vibes */}
            <div className="vedic-card p-5 space-y-4 flex flex-col justify-between">
              <div className="space-y-3.5">
                {/* Growth Period */}
                <div className="p-3 rounded-xl bg-[var(--surface-muted)]/50 border border-[var(--border)] flex items-start gap-3">
                  <TrendingUp className="w-4 h-4 text-[var(--success-text)] shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-serif font-bold text-xs text-[var(--heading)]">
                      {locale === 'hi' ? 'सर्वोत्तम विकास काल (Peak Growth Period)' : 'Peak Growth Period'}
                    </h5>
                    <p className="text-xs text-[var(--text-muted)] mt-0.5 lining-nums">
                      {locale === 'hi' ? activeResult.growthPeriodHi : activeResult.growthPeriodEn}
                    </p>
                  </div>
                </div>

                {/* Core Strengths */}
                <div className="space-y-1.5">
                  <h5 className="text-xs font-bold text-[var(--heading)] uppercase tracking-wider flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5 text-[var(--gold)]" />
                    <span>{locale === 'hi' ? 'करियर शक्ति बिंदु' : 'Core Strengths & Influence'}</span>
                  </h5>
                  <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                    {locale === 'hi'
                      ? 'आपकी अंतर्निहित संख्यात्मक ऊर्जा इस कार्यक्षेत्र में दीर्घकालिक स्थिरता, नवाचार और नेतृत्व प्रदान करती है।'
                      : 'Your inherent vibrations provide resilience, analytical clarity, and commercial instinct in this domain.'}
                  </p>
                </div>

                {/* Caution */}
                <div className="space-y-1.5">
                  <h5 className="text-xs font-bold text-[var(--warn-text)] uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldAlert className="w-3.5 h-3.5 text-[var(--warn-text)]" />
                    <span>{locale === 'hi' ? 'सावधानी व संतुलन' : 'Cautions & Balance'}</span>
                  </h5>
                  <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                    {locale === 'hi'
                      ? 'अति-उत्साह या तनाव में अचानक वित्तीय निर्णय लेने से बचें। कार्यस्थल पर नियमित ध्यान रखें।'
                      : 'Avoid impulsive contracts during unfavorable transit periods; maintain structured documentation.'}
                  </p>
                </div>
              </div>

              {/* Lucky Numbers & Colors for Work */}
              <div className="pt-3 border-t border-[var(--border)] flex flex-wrap items-center justify-between gap-3">
                <div>
                  <span className="text-[11px] font-bold text-[var(--text-muted)] block mb-1">
                    {locale === 'hi' ? 'कार्य हेतु शुभ अंक:' : 'Lucky Work Numbers:'}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {activeResult.luckyWorkNumbers.map((num) => (
                      <NumberBadge key={num} number={num} size="sm" variant="gold" />
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-[11px] font-bold text-[var(--text-muted)] block mb-1">
                    {locale === 'hi' ? 'शुभ कार्य रंग:' : 'Favorable Workspace Colors:'}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {(locale === 'hi' ? activeResult.luckyWorkColorsHi : activeResult.luckyWorkColorsEn).map(
                      (col, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-md bg-[var(--chip-bg)] border border-[var(--border)] text-[11px] font-semibold text-[var(--heading)]"
                        >
                          {col}
                        </span>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right: 3 Suggested Passwords */}
            <div className="vedic-card p-5 space-y-3.5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-[var(--border)]">
                  <div className="flex items-center gap-2">
                    <KeyRound className="w-4 h-4 text-[var(--gold)]" />
                    <h4 className="font-serif font-bold text-sm text-[var(--heading)]">
                      {locale === 'hi' ? 'सुझाए गए कार्य पासवर्ड (3 विकल्प)' : 'Suggested Work Passwords (3 Matches)'}
                    </h4>
                  </div>
                  <span className="text-[11px] text-[var(--gold)] font-bold lining-nums">
                    Lucky Sum: {activeResult.luckyWorkNumbers[0]}
                  </span>
                </div>

                <div className="space-y-2.5 pt-3">
                  {passwords.map((pwd, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-[var(--surface-muted)]/40 border border-[var(--border)] flex items-center justify-between gap-3"
                    >
                      <div className="min-w-0">
                        <span className="font-mono text-sm font-bold text-[var(--heading)] tracking-wider block truncate select-all lining-nums">
                          {pwd.password}
                        </span>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] text-[var(--text-muted)] lining-nums">
                            Sum {pwd.digitSum} → {pwd.reduced}
                          </span>
                          <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-[var(--success-bg)] text-[var(--success-text)] border border-[var(--success-border)]">
                            {pwd.strength}
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => copyPassword(pwd.password, idx)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--gold)] transition-colors cursor-pointer shrink-0 text-[var(--heading)]"
                      >
                        {copiedIndex === idx ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-[var(--success-text)]" />
                            <span className="text-[var(--success-text)] font-bold">{locale === 'hi' ? 'कॉपी' : 'Copied'}</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                            <span>{locale === 'hi' ? 'कॉपी' : 'Copy'}</span>
                          </>
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <p className="text-[11px] text-[var(--text-muted)] leading-relaxed pt-2">
                {locale === 'hi'
                  ? 'ये पासवर्ड इस चुने गए कार्यक्षेत्र के शुभ योग और आपकी जन्म ऊर्जा के तालमेल पर आधारित हैं।'
                  : 'Harmonized around your top domain numbers for enhanced professional clarity and digital asset protection.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Secondary "Check another profession" searchable dropdown */}
      <div className="vedic-card p-4 sm:p-5 space-y-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h4 className="font-serif font-bold text-sm sm:text-base text-[var(--heading)] flex items-center gap-2">
              <Search className="w-4 h-4 text-[var(--gold)]" />
              <span>{locale === 'hi' ? 'अन्य कार्यक्षेत्र की अनुकूलता जांचें' : 'Check Another Profession'}</span>
            </h4>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              {locale === 'hi'
                ? 'सूची में से किसी भी अन्य कार्यक्षेत्र का अपनी जन्म कुंडली से मिलान देखें'
                : 'Evaluate any profession from our comprehensive catalogue against your numerology profile'}
            </p>
          </div>

          <div className="w-full sm:w-72">
            <Select
              value={otherProfId}
              onChange={(e) => setOtherProfId(e.target.value)}
            >
              <option value="">{locale === 'hi' ? '-- कोई अन्य कार्यक्षेत्र चुनें --' : '-- Select another profession --'}</option>
              {PROFESSIONS_LIST.map((p) => (
                <option key={`opt-${p.id}`} value={p.id}>
                  {p.icon} {p.name[locale]} ({p.category.replace('_', ' ')})
                </option>
              ))}
            </Select>
          </div>
        </div>

        {/* Evaluated Result for Selected Other Profession */}
        {evaluatedOther && (
          <div className="p-4 rounded-xl bg-[var(--surface-muted)]/40 border border-[var(--border)] space-y-3 mt-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">{evaluatedOther.profession.icon}</span>
                <div>
                  <h5 className="font-serif font-bold text-sm text-[var(--heading)]">
                    {evaluatedOther.profession.name[locale]}
                  </h5>
                  <span className="text-[10.5px] text-[var(--gold)] uppercase font-semibold">
                    {evaluatedOther.profession.category.replace('_', ' ')}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-[var(--success-bg)] text-[var(--success-text)] border border-[var(--success-border)] lining-nums">
                  {evaluatedOther.score}% Match
                </span>
                <button
                  type="button"
                  onClick={() => handleSelectProfession(evaluatedOther.profession.id)}
                  className="btn-gold-gradient px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer shadow-xs"
                >
                  {locale === 'hi' ? 'इसे चुनें' : 'Select'}
                </button>
              </div>
            </div>

            <div className="space-y-1 pt-1 border-t border-[var(--border)]/60">
              <span className="text-[11px] font-bold text-[var(--text-muted)] block">
                {locale === 'hi' ? 'अनुकूलता विश्लेषण:' : 'Compatibility Analysis:'}
              </span>
              <ul className="space-y-1">
                {(locale === 'hi' ? evaluatedOther.reasonsHi : evaluatedOther.reasonsEn).map((r, i) => (
                  <li key={i} className="text-xs text-[var(--heading)] flex items-start gap-1.5 leading-relaxed">
                    <span className="text-[var(--gold)] font-bold shrink-0">•</span>
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
