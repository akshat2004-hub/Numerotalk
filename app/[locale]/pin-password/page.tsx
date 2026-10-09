'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { KeyRound, RefreshCw, Copy, Check, ShieldCheck, Sparkles, SlidersHorizontal, FileText } from 'lucide-react';
import { SectionHeader } from '@/frontend/components/ui/SectionHeader';
import { ProfileEmptyBanner } from '@/frontend/components/ProfileEmptyBanner';
import { Select } from '@/frontend/components/ui/Select';
import { useNumerologyStore } from '@/frontend/store/useNumerologyStore';
import { recommendProfessions, PROFESSIONS_LIST, ProfessionItem } from '@/core/engine/profession';
import { generateSecurePassword, generateSecurePin, GeneratedPasswordMatch, GeneratedPinMatch } from '@/core/engine/security';

export default function PinPasswordPage() {
  const t = useTranslations('pinPasswordPage');
  const locale = (useLocale() || 'en') as 'en' | 'hi';

  const profile = useNumerologyStore((s) => s.profile);
  const storedProfession = useNumerologyStore((s) => s.selectedProfession);
  const setSelectedProfession = useNumerologyStore((s) => s.setSelectedProfession);
  const toggleReportSection = useNumerologyStore((s) => s.toggleReportSection);
  const reportSections = useNumerologyStore((s) => s.reportSections);

  // Recommendations from Module 10
  const recommendedList = useMemo(() => recommendProfessions(profile, 3), [profile]);
  const topRecommendedId = recommendedList[0]?.profession.id || 'tech_entrepreneur';

  // Active Profession selection
  const [selectedProfId, setSelectedProfId] = useState<string>(storedProfession || topRecommendedId);

  useEffect(() => {
    if (storedProfession) {
      setSelectedProfId(storedProfession);
    } else if (topRecommendedId) {
      setSelectedProfId(topRecommendedId);
    }
  }, [storedProfession, topRecommendedId]);

  const activeProfession = useMemo(() => {
    return PROFESSIONS_LIST.find((p) => p.id === selectedProfId) || PROFESSIONS_LIST[0];
  }, [selectedProfId]);

  // Lucky target sum for the chosen profession
  const luckyTargetSum = useMemo(() => {
    return activeProfession.favourableMulank[0] || activeProfession.favourableBhagyank[0] || 5;
  }, [activeProfession]);

  // Options row state
  const [pwdLength, setPwdLength] = useState<number>(14);
  const [useUppercase, setUseUppercase] = useState<boolean>(true);
  const [useSymbols, setUseSymbols] = useState<boolean>(true);

  // Results state: 3 passwords + 2 PINs (4-digit, 6-digit)
  const [passwords, setPasswords] = useState<GeneratedPasswordMatch[]>([]);
  const [pin4, setPin4] = useState<GeneratedPinMatch | null>(null);
  const [pin6, setPin6] = useState<GeneratedPinMatch | null>(null);

  // Copy feedback state
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [addedReport, setAddedReport] = useState<boolean>(false);

  // Generator handler
  const generateAll = useCallback(() => {
    const p1 = generateSecurePassword({
      length: pwdLength,
      includeUppercase: useUppercase,
      includeSymbols: useSymbols,
      targetLuckyNumber: luckyTargetSum,
      professionKey: selectedProfId
    });
    const p2 = generateSecurePassword({
      length: pwdLength,
      includeUppercase: useUppercase,
      includeSymbols: useSymbols,
      targetLuckyNumber: luckyTargetSum,
      professionKey: selectedProfId
    });
    const p3 = generateSecurePassword({
      length: pwdLength,
      includeUppercase: useUppercase,
      includeSymbols: useSymbols,
      targetLuckyNumber: luckyTargetSum,
      professionKey: selectedProfId
    });

    const pin4Item = generateSecurePin(4, luckyTargetSum);
    const pin6Item = generateSecurePin(6, luckyTargetSum);

    setPasswords([p1, p2, p3]);
    setPin4(pin4Item);
    setPin6(pin6Item);
  }, [pwdLength, useUppercase, useSymbols, luckyTargetSum, selectedProfId]);

  // Auto-generate on load or when profession / lucky sum changes
  useEffect(() => {
    generateAll();
  }, [generateAll]);

  // Regenerate single password row
  const regeneratePasswordRow = (index: number) => {
    const updated = generateSecurePassword({
      length: pwdLength,
      includeUppercase: useUppercase,
      includeSymbols: useSymbols,
      targetLuckyNumber: luckyTargetSum,
      professionKey: selectedProfId
    });
    setPasswords((prev) => {
      const copy = [...prev];
      copy[index] = updated;
      return copy;
    });
  };

  // Regenerate single PIN row
  const regeneratePinRow = (digits: 4 | 6) => {
    if (digits === 4) {
      setPin4(generateSecurePin(4, luckyTargetSum));
    } else {
      setPin6(generateSecurePin(6, luckyTargetSum));
    }
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleAddToReport = () => {
    if (!reportSections.pinPassword) {
      toggleReportSection('pinPassword');
    }
    setAddedReport(true);
    setTimeout(() => setAddedReport(false), 2500);
  };

  // Build partitioned profession dropdown options
  const recommendedIds = useMemo(() => new Set(recommendedList.map((r) => r.profession.id)), [recommendedList]);
  const otherProfessions = useMemo(() => PROFESSIONS_LIST.filter((p) => !recommendedIds.has(p.id)), [recommendedIds]);

  return (
    <div className="space-y-6 sm:space-y-7">
      <SectionHeader
        title={locale === 'hi' ? 'पिन और' : 'PIN &'}
        goldTitle={locale === 'hi' ? 'पासवर्ड' : 'Password'}
        subtitle={
          locale === 'hi'
            ? 'सुरक्षित पासवर्ड और 4/6-अंकीय पिन आपके शुभ अंकों के अनुकूल।'
            : 'Secure passwords and 4/6-digit PINs matched to your lucky numbers.'
        }
        icon={<KeyRound className="w-5 h-5 stroke-[1.5]" />}
      />

      <ProfileEmptyBanner />

      {/* Single Flow Controls Card */}
      <div className="vedic-card p-5 space-y-5">
        {/* Step 1: Profession Dropdown */}
        <Select
          label={locale === 'hi' ? 'कार्यक्षेत्र का चयन करें' : 'Select Profession'}
          value={selectedProfId}
          onChange={(e) => {
            const newId = e.target.value;
            setSelectedProfId(newId);
            setSelectedProfession(newId);
          }}
        >
          <optgroup label={locale === 'hi' ? '✨ आपकी जन्म कुंडली अनुसार अनुशंसित' : '✨ Recommended for Your Profile'}>
            {recommendedList.map((rec) => (
              <option key={`rec-${rec.profession.id}`} value={rec.profession.id}>
                {rec.profession.icon} {rec.profession.name[locale]} ({Math.round(rec.score)}% Match)
              </option>
            ))}
          </optgroup>
          <optgroup label={locale === 'hi' ? 'अन्य कार्यक्षेत्र' : 'All Other Professions'}>
            {otherProfessions.map((prof) => (
              <option key={`other-${prof.id}`} value={prof.id}>
                {prof.icon} {prof.name[locale]}
              </option>
            ))}
          </optgroup>
        </Select>

        {/* Step 2: Options Row */}
        <div className="pt-2 border-t border-[var(--border)] flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          {/* Length Slider */}
          <div className="flex-1 max-w-sm space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[var(--heading)] flex items-center gap-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5 text-[var(--gold)]" />
                <span>{locale === 'hi' ? 'पासवर्ड की लंबाई:' : 'Password Length:'}</span>
              </span>
              <span className="font-mono font-bold text-xs px-2 py-0.5 rounded-md bg-[var(--chip-bg)] border border-[var(--border)] text-[var(--gold)] lining-nums">
                {pwdLength}
              </span>
            </div>
            <input
              type="range"
              min={8}
              max={20}
              value={pwdLength}
              onChange={(e) => setPwdLength(Number(e.target.value))}
              className="w-full h-2 bg-[var(--surface-muted)] rounded-lg appearance-none cursor-pointer accent-[var(--gold)]"
            />
            <div className="flex justify-between text-[10px] text-[var(--text-muted)] font-mono lining-nums">
              <span>8</span>
              <span>14</span>
              <span>20</span>
            </div>
          </div>

          {/* Toggles: Uppercase and Symbols */}
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={useUppercase}
                onChange={(e) => setUseUppercase(e.target.checked)}
                className="w-4 h-4 rounded text-[var(--gold)] border-[var(--border)] focus:ring-[var(--gold)] accent-[var(--gold)]"
              />
              <span className="text-xs font-medium text-[var(--heading)]">
                {locale === 'hi' ? 'बड़े अक्षर (A-Z)' : 'Uppercase (A-Z)'}
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={useSymbols}
                onChange={(e) => setUseSymbols(e.target.checked)}
                className="w-4 h-4 rounded text-[var(--gold)] border-[var(--border)] focus:ring-[var(--gold)] accent-[var(--gold)]"
              />
              <span className="text-xs font-medium text-[var(--heading)]">
                {locale === 'hi' ? 'विशेष चिन्ह (@#$)' : 'Symbols (@#$)'}
              </span>
            </label>
          </div>

          {/* One Medium Gold Generate Button */}
          <button
            type="button"
            onClick={generateAll}
            className="btn-gold-gradient h-[42px] px-6 rounded-[12px] text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer shrink-0 shadow-[0_4px_12px_rgba(201,131,16,0.25)] hover:scale-[1.01] active:scale-[0.99] transition-all"
          >
            <Sparkles className="w-4 h-4 stroke-[2]" />
            <span>{locale === 'hi' ? 'बनाएं' : 'Generate'}</span>
          </button>
        </div>
      </div>

      {/* Results Section: "Password Matches" */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-serif font-bold text-base sm:text-lg text-[var(--heading)] flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[var(--gold)]" />
            <span>{locale === 'hi' ? 'पासवर्ड मैच' : 'Password Matches'}</span>
          </h3>

          <div className="flex items-center gap-2">
            <span className="text-xs text-[var(--text-muted)] font-medium">
              {locale === 'hi' ? 'शुभ अंक योग:' : 'Harmonized Lucky Sum:'}
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-[var(--chip-bg)] border border-[var(--gold)]/40 text-xs font-bold text-[var(--gold)] lining-nums">
              {luckyTargetSum}
            </span>
          </div>
        </div>

        {/* ONE Card with 2 Groups: 3 Passwords + 2 PINs */}
        <div className="vedic-card p-0 overflow-hidden divide-y divide-[var(--border)] shadow-xs">
          {/* Group 1 Header: Passwords */}
          <div className="p-3.5 bg-[var(--surface-muted)]/40 flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider font-bold text-[var(--gold)]">
              {locale === 'hi' ? 'सुरक्षित पासवर्ड (3 विकल्प)' : 'Secure Passwords (3 Matches)'}
            </span>
            <span className="text-[11px] text-[var(--text-muted)]">
              {locale === 'hi' ? 'अंक योग लक्षित शुभ अंक से मेल खाता है' : 'Digit sums harmonize with lucky vibrations'}
            </span>
          </div>

          {/* 3 Password Rows */}
          {passwords.map((pwd, idx) => {
            const rowKey = `pwd-${idx}`;
            const isCopied = copiedKey === rowKey;
            return (
              <div
                key={rowKey}
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[var(--surface-muted)]/20 transition-colors"
              >
                {/* Value */}
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-6 text-xs text-[var(--text-muted)] font-mono text-center shrink-0 lining-nums">
                    #{idx + 1}
                  </span>
                  <span className="font-mono text-[16px] font-bold text-[var(--heading)] tracking-wider select-all truncate lining-nums">
                    {pwd.password}
                  </span>
                </div>

                {/* Badges + Actions */}
                <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                  {/* Match Badge */}
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[var(--success-bg)] text-[var(--success-text)] border border-[var(--success-border)] lining-nums">
                    Match {pwd.matchPercentage}%
                  </span>

                  {/* Strength Meter Badge */}
                  <span
                    className={`px-2 py-0.5 rounded-md text-xs font-medium border ${
                      pwd.strength === 'Very Strong'
                        ? 'bg-[var(--success-bg)] text-[var(--success-text)] border border-[var(--success-border)]'
                        : pwd.strength === 'Strong'
                        ? 'bg-[var(--active-bg)] text-[var(--gold-deep)] border border-[var(--gold)]'
                        : 'bg-[var(--chip-bg)] text-[var(--warn-text)] border border-[var(--warn-border)]'
                    }`}
                  >
                    {pwd.strength}
                  </span>

                  {/* Per-row regenerate */}
                  <button
                    type="button"
                    onClick={() => regeneratePasswordRow(idx)}
                    title={locale === 'hi' ? 'नया पासवर्ड बनाएं' : 'Regenerate this password'}
                    className="p-1.5 rounded-lg border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--gold)] hover:border-[var(--gold)] transition-colors cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>

                  {/* Copy Button */}
                  <button
                    type="button"
                    onClick={() => copyToClipboard(pwd.password, rowKey)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[var(--surface-muted)] border border-[var(--border)] hover:border-[var(--gold)] transition-colors cursor-pointer text-[var(--heading)]"
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-[var(--success-text)]" />
                        <span className="text-[var(--success-text)] font-bold">{locale === 'hi' ? 'कॉपी हुआ' : 'Copied'}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                        <span>{locale === 'hi' ? 'कॉपी' : 'Copy'}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}

          {/* Group 2 Header: PINs */}
          <div className="p-3.5 bg-[var(--surface-muted)]/40 flex items-center justify-between border-t border-[var(--border)]">
            <span className="text-xs uppercase tracking-wider font-bold text-[var(--gold)]">
              {locale === 'hi' ? 'शुभ अंक पिन (4 व 6 अंक)' : 'Auspicious PIN Matches (4 & 6 Digits)'}
            </span>
            <span className="text-[11px] text-[var(--text-muted)]">
              {locale === 'hi' ? 'एटीएम व मोबाइल लॉक के लिए अनुकूल' : 'Optimized for bank cards, safes & mobile lock'}
            </span>
          </div>

          {/* PIN 4 Row */}
          {pin4 && (
            <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[var(--surface-muted)]/20 transition-colors">
              <div className="flex items-center gap-3">
                <span className="px-2 py-0.5 rounded-md bg-[var(--surface-muted)] text-[11px] font-bold text-[var(--text-muted)] shrink-0">
                  4-Digit
                </span>
                <span className="font-mono text-[16px] font-bold text-[var(--heading)] tracking-[0.25em] select-all lining-nums">
                  {pin4.pin}
                </span>
                <span className="text-xs text-[var(--text-muted)] lining-nums">
                  (Sum {pin4.sum} → {pin4.reduced})
                </span>
              </div>

              <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[var(--success-bg)] text-[var(--success-text)] border border-[var(--success-border)] lining-nums">
                  Match {pin4.matchPercentage}%
                </span>

                <button
                  type="button"
                  onClick={() => regeneratePinRow(4)}
                  title={locale === 'hi' ? 'नया 4-अंकीय पिन बनाएं' : 'Regenerate 4-digit PIN'}
                  className="p-1.5 rounded-lg border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--gold)] hover:border-[var(--gold)] transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => copyToClipboard(pin4.pin, 'pin-4')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[var(--surface-muted)] border border-[var(--border)] hover:border-[var(--gold)] transition-colors cursor-pointer text-[var(--heading)]"
                >
                  {copiedKey === 'pin-4' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[var(--success-text)]" />
                      <span className="text-[var(--success-text)] font-bold">{locale === 'hi' ? 'कॉपी हुआ' : 'Copied'}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                      <span>{locale === 'hi' ? 'कॉपी' : 'Copy'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* PIN 6 Row */}
          {pin6 && (
            <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[var(--surface-muted)]/20 transition-colors">
              <div className="flex items-center gap-3">
                <span className="px-2 py-0.5 rounded-md bg-[var(--surface-muted)] text-[11px] font-bold text-[var(--text-muted)] shrink-0">
                  6-Digit
                </span>
                <span className="font-mono text-[16px] font-bold text-[var(--heading)] tracking-[0.25em] select-all lining-nums">
                  {pin6.pin}
                </span>
                <span className="text-xs text-[var(--text-muted)] lining-nums">
                  (Sum {pin6.sum} → {pin6.reduced})
                </span>
              </div>

              <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[var(--success-bg)] text-[var(--success-text)] border border-[var(--success-border)] lining-nums">
                  Match {pin6.matchPercentage}%
                </span>

                <button
                  type="button"
                  onClick={() => regeneratePinRow(6)}
                  title={locale === 'hi' ? 'नया 6-अंकीय पिन बनाएं' : 'Regenerate 6-digit PIN'}
                  className="p-1.5 rounded-lg border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--gold)] hover:border-[var(--gold)] transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => copyToClipboard(pin6.pin, 'pin-6')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[var(--surface-muted)] border border-[var(--border)] hover:border-[var(--gold)] transition-colors cursor-pointer text-[var(--heading)]"
                >
                  {copiedKey === 'pin-6' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[var(--success-text)]" />
                      <span className="text-[var(--success-text)] font-bold">{locale === 'hi' ? 'कॉपी हुआ' : 'Copied'}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                      <span>{locale === 'hi' ? 'कॉपी' : 'Copy'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Add to Report Button */}
        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={handleAddToReport}
            className="btn-gold-gradient px-5 py-2.5 rounded-[12px] text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-xs hover:scale-[1.01] transition-transform"
          >
            {addedReport ? (
              <>
                <Check className="w-4 h-4 text-white" />
                <span>{locale === 'hi' ? 'रिपोर्ट में जोड़ा गया!' : 'Added to Report!'}</span>
              </>
            ) : (
              <>
                <FileText className="w-4 h-4" />
                <span>{locale === 'hi' ? 'रिपोर्ट में जोड़ें' : 'Add to Report'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
