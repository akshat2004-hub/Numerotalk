'use client';

import React, { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { KeyRound, Sparkles, RefreshCw, Copy, Check, ShieldCheck, Lock } from 'lucide-react';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { NumberBadge } from '@/components/ui/NumberBadge';
import { ProfileEmptyBanner } from '@/components/ProfileEmptyBanner';
import { GoldButton } from '@/components/ui/GoldButton';
import { useNumerologyStore } from '@/lib/store/useNumerologyStore';
import { calculateMulank } from '@/lib';
import { generatePinByNumerology, generatePasswordByProfession, PROFESSIONS_PROFILES } from '@/lib/engine/security';

export default function PinPasswordPage() {
  const t = useTranslations('pinPasswordPage');
  const locale = (useLocale() || 'en') as 'en' | 'hi';
  const profile = useNumerologyStore((s) => s.profile);

  const mulank = profile.dob ? calculateMulank(profile.dob).mulank : 1;

  // Mode: Password vs PIN
  const [activeTab, setActiveTab] = useState<'password' | 'pin'>('password');

  // Password generator options
  const [selectedProf, setSelectedProf] = useState('tech');
  const [pwdLength, setPwdLength] = useState(14);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [copiedPwd, setCopiedPwd] = useState(false);

  // PIN generator options
  const [pinDigits, setPinDigits] = useState<4 | 6>(4);
  const [pinTargetSum, setPinTargetSum] = useState<number>(mulank || 5);
  const [copiedPin, setCopiedPin] = useState(false);

  const [pwdData, setPwdData] = useState(() =>
    generatePasswordByProfession('tech', 14, true, true)
  );
  const [pinData, setPinData] = useState(() =>
    generatePinByNumerology(4, mulank || 5)
  );

  const handleRegeneratePassword = () => {
    setPwdData(generatePasswordByProfession(selectedProf, pwdLength, includeSymbols, includeUppercase));
  };

  const handleRegeneratePin = () => {
    setPinData(generatePinByNumerology(pinDigits, pinTargetSum));
  };

  const copyPwd = () => {
    navigator.clipboard.writeText(pwdData.password);
    setCopiedPwd(true);
    setTimeout(() => setCopiedPwd(false), 2000);
  };

  const copyPin = () => {
    navigator.clipboard.writeText(pinData.pin);
    setCopiedPin(true);
    setTimeout(() => setCopiedPin(false), 2000);
  };

  // Strength score
  const getStrength = (length: number, hasSym: boolean, hasUpper: boolean) => {
    let score = 0;
    if (length >= 12) score += 40;
    else if (length >= 8) score += 25;
    if (hasSym) score += 30;
    if (hasUpper) score += 30;
    return score;
  };

  const strengthScore = getStrength(pwdLength, includeSymbols, includeUppercase);

  return (
    <div className="space-y-6 sm:space-y-7">
      <SectionHeader
        title={t('title')}
        subtitle={t('subtitle')}
        badge={locale === 'hi' ? 'सुरक्षा अंकशास्त्र 11' : 'SECURITY GENERATOR 11'}
        icon={<KeyRound className="w-5 h-5 stroke-[1.5]" />}
      />

      <ProfileEmptyBanner />

      {/* Mode Switcher */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setActiveTab('password')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'password'
              ? 'bg-[var(--gold)] text-slate-900 font-bold shadow-xs'
              : 'bg-[var(--surface)] text-[var(--text-muted)] border border-[var(--border)] hover:text-[var(--heading)]'
          }`}
        >
          {locale === 'hi' ? 'अंक ज्योतिष पासवर्ड मोड' : 'Numerology Password Mode'}
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('pin')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'pin'
              ? 'bg-[var(--gold)] text-slate-900 font-bold shadow-xs'
              : 'bg-[var(--surface)] text-[var(--text-muted)] border border-[var(--border)] hover:text-[var(--heading)]'
          }`}
        >
          {locale === 'hi' ? 'शुभ पिन कोड (4 / 6 अंक)' : 'Auspicious PIN Mode (4/6 Digits)'}
        </button>
      </div>

      {activeTab === 'password' ? (
        /* PASSWORD MODE */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Options Card */}
          <div className="vedic-card p-4 sm:p-5 space-y-4">
            <h3 className="font-serif text-sm sm:text-base font-bold text-[var(--heading)] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[var(--gold)]" />
              <span>{locale === 'hi' ? 'पासवर्ड विन्यास एवं सेटिंग्स' : 'Password Configuration & Parameters'}</span>
            </h3>

            {/* Profession Select */}
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-[var(--text-muted)]">
                {locale === 'hi' ? 'व्यवसाय संरेखण (Profession)' : 'Profession Alignment'}
              </label>
              <select
                value={selectedProf}
                onChange={(e) => setSelectedProf(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[var(--surface)] border border-[var(--input-border)] text-xs text-[var(--heading)] outline-hidden focus:border-[var(--gold)]"
              >
                {Object.entries(PROFESSIONS_PROFILES).map(([key, prof]) => (
                  <option key={key} value={key}>
                    {locale === 'hi' ? prof.titleHi : prof.titleEn}
                  </option>
                ))}
              </select>
            </div>

            {/* Length slider */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[var(--text-muted)]">{locale === 'hi' ? 'लंबाई' : 'Length'}:</span>
                <span className="font-mono font-bold text-[var(--gold)]">{pwdLength} chars</span>
              </div>
              <input
                type="range"
                min={8}
                max={24}
                value={pwdLength}
                onChange={(e) => setPwdLength(Number(e.target.value))}
                className="w-full accent-[var(--gold)]"
              />
            </div>

            {/* Checkboxes: symbols, uppercase */}
            <div className="grid grid-cols-2 gap-2 text-xs pt-1">
              <label className="flex items-center gap-2 p-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeSymbols}
                  onChange={(e) => setIncludeSymbols(e.target.checked)}
                  className="accent-[var(--gold)]"
                />
                <span className="text-[11px] text-[var(--heading)] font-medium">Symbols (!@#$)</span>
              </label>
              <label className="flex items-center gap-2 p-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeUppercase}
                  onChange={(e) => setIncludeUppercase(e.target.checked)}
                  className="accent-[var(--gold)]"
                />
                <span className="text-[11px] text-[var(--heading)] font-medium">Uppercase (A-Z)</span>
              </label>
            </div>

            <GoldButton
              type="button"
              onClick={handleRegeneratePassword}
              size="sm"
              className="w-full text-xs"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>{locale === 'hi' ? 'नया पासवर्ड बनाएं' : 'Regenerate Password'}</span>
            </GoldButton>
          </div>

          {/* Result & Strength Card */}
          <div className="vedic-card p-4 sm:p-5 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <span className="text-[10px] font-bold text-[var(--gold)] uppercase tracking-wider block">
                {locale === 'hi' ? 'वैदिक सुरक्षा कुंजी' : 'Numerological Password Output'}
              </span>

              {/* Password Display Box */}
              <div className="p-3.5 sm:p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border)] flex items-center justify-between gap-3 shadow-inner">
                <span className="font-mono text-sm sm:text-base font-bold text-[var(--heading)] break-all select-all">
                  {pwdData.password}
                </span>
                <button
                  type="button"
                  onClick={copyPwd}
                  className="p-2 rounded-xl bg-[var(--chip-bg)] border border-[var(--border)] text-[var(--gold)] hover:bg-[var(--active-bg)] transition-colors shrink-0 cursor-pointer"
                  title="Copy password"
                >
                  {copiedPwd ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              {/* Strength Meter */}
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[var(--text-muted)]">{locale === 'hi' ? 'सुरक्षा क्षमता' : 'Security Strength'}:</span>
                  <span className="font-bold text-emerald-700">
                    {strengthScore >= 80 ? 'Fortress Grade' : strengthScore >= 50 ? 'Strong' : 'Moderate'}
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-[var(--border)] overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${strengthScore}%`,
                      background: strengthScore >= 80 ? '#16A34A' : strengthScore >= 50 ? '#D97706' : '#EF4444',
                    }}
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-[11.5px] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[var(--text-muted)]">Chaldean Total:</span>
                  <span className="font-serif font-bold text-[var(--gold)] text-xs">
                    {pwdData.totalSum} → Root {pwdData.reducedTotal}
                  </span>
                </div>
                <p className="text-[var(--text-muted)] leading-relaxed text-[11px]">
                  {locale === 'hi' ? pwdData.explanationHi : pwdData.explanationEn}
                </p>
              </div>
            </div>

            <p className="text-[10.5px] text-[var(--text-muted)] italic">
              {locale === 'hi'
                ? 'यह पासवर्ड आपके मूलांक व कार्यक्षेत्र की शुभ तरंगों से सिंक है।'
                : 'Generated with sound-value vibrations aligned to your birth driver.'}
            </p>
          </div>
        </div>
      ) : (
        /* PIN MODE (4 or 6 DIGITS) */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="vedic-card p-4 sm:p-5 space-y-4">
            <h3 className="font-serif text-sm sm:text-base font-bold text-[var(--heading)] flex items-center gap-2">
              <Lock className="w-4 h-4 text-[var(--gold)]" />
              <span>{locale === 'hi' ? 'पिन कोड विन्यास (4 या 6 अंक)' : 'PIN Configuration (4 or 6 Digits)'}</span>
            </h3>

            {/* Length 4 or 6 */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-[var(--text-muted)]">
                {locale === 'hi' ? 'पिन लंबाई चुनें' : 'Select PIN Length'}
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPinDigits(4)}
                  className={`py-2 rounded-xl text-xs font-serif font-bold border transition-colors cursor-pointer ${
                    pinDigits === 4
                      ? 'bg-[var(--gold)] text-slate-900 font-bold border-[var(--gold)] shadow-xs'
                      : 'bg-[var(--surface)] text-[var(--text-muted)] border-[var(--border)] hover:bg-[var(--chip-bg)]/40'
                  }`}
                >
                  4 Digits (ATM / Phone)
                </button>
                <button
                  type="button"
                  onClick={() => setPinDigits(6)}
                  className={`py-2 rounded-xl text-xs font-serif font-bold border transition-colors cursor-pointer ${
                    pinDigits === 6
                      ? 'bg-[var(--gold)] text-slate-900 font-bold border-[var(--gold)] shadow-xs'
                      : 'bg-[var(--surface)] text-[var(--text-muted)] border-[var(--border)] hover:bg-[var(--chip-bg)]/40'
                  }`}
                >
                  6 Digits (UPI / Banking)
                </button>
              </div>
            </div>

            {/* Target Root Sum 1-9 */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-[var(--text-muted)]">
                {locale === 'hi' ? 'लक्षित शुभ योग (1 - 9)' : 'Target Root Sum (1 - 9)'}
              </label>
              <div className="grid grid-cols-9 gap-1 text-center">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setPinTargetSum(n)}
                    className={`py-1.5 rounded-xl text-xs font-bold font-serif border transition-colors cursor-pointer ${
                      pinTargetSum === n
                        ? 'bg-[var(--gold)] text-slate-900 font-extrabold border-[var(--gold)] shadow-xs'
                        : 'bg-[var(--surface)] text-[var(--text-muted)] border-[var(--border)] hover:bg-[var(--chip-bg)]/40'
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>

            <GoldButton
              type="button"
              onClick={handleRegeneratePin}
              size="sm"
              className="w-full text-xs"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>{locale === 'hi' ? 'नया शुभ पिन बनाएं' : 'Regenerate PIN'}</span>
            </GoldButton>
          </div>

          {/* PIN Output Card */}
          <div className="vedic-card p-4 sm:p-5 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <span className="text-[10px] font-bold text-[var(--gold)] uppercase tracking-wider block">
                {locale === 'hi' ? 'उत्पन्न शुभ पिन' : 'Generated Auspicious PIN'}
              </span>

              <div className="p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border)] flex items-center justify-between shadow-inner">
                <div>
                  <div className="font-mono text-3xl font-extrabold text-[var(--heading)] tracking-widest">
                    {pinData.pin}
                  </div>
                  <span className="text-[11px] text-[var(--text-muted)] mt-1 block">
                    Digit Sum: {pinData.sum} → Reduced: <strong className="text-[var(--gold)] font-bold">{pinData.reduced}</strong>
                  </span>
                </div>

                <button
                  type="button"
                  onClick={copyPin}
                  className="p-2.5 rounded-xl bg-[var(--chip-bg)] border border-[var(--border)] text-[var(--gold)] hover:bg-[var(--active-bg)] transition-colors cursor-pointer"
                  title="Copy PIN"
                >
                  {copiedPin ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              <div className="p-3 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-xs text-[var(--text)]">
                <span className="font-bold text-[var(--gold)] block mb-1">
                  {locale === 'hi' ? 'पिन प्रभाव एवं ऊर्जा' : 'Vedic PIN Significance'}
                </span>
                <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">
                  {locale === 'hi'
                    ? `यह पिन आपके चयनित योग ${pinTargetSum} पर आधारित है, जो धन संचय और लेनदेन में सकारात्मक स्थिरता लाता है।`
                    : `This ${pinDigits}-digit sequence reduces to planetary frequency ${pinTargetSum}, fostering financial stability and smooth authentication.`}
                </p>
              </div>
            </div>

            <p className="text-[10.5px] text-[var(--text-muted)] italic">
              {locale === 'hi'
                ? 'सुरक्षा कारणों से इस पिन को किसी के साथ साझा न करें।'
                : 'Keep your secret credentials confidential at all times.'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
