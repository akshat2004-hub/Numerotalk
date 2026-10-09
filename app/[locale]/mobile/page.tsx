'use client';

import React, { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Smartphone, Sparkles, Compass, Image as ImageIcon, CheckCircle, Scale, AlertTriangle } from 'lucide-react';
import { SectionHeader } from '@/frontend/components/ui/SectionHeader';
import { NumberBadge } from '@/frontend/components/ui/NumberBadge';
import { CompoundNumber } from '@/frontend/components/ui/CompoundNumber';
import { ProfileEmptyBanner } from '@/frontend/components/ProfileEmptyBanner';
import { useNumerologyStore } from '@/frontend/store/useNumerologyStore';
import { analyzeMobileNumber, calculateMulank, MobileAnalysisResult } from '@/frontend';
import pairMeaningsData from '@/mocks/rules/pair-meanings.json';

export default function MobilePage() {
  const t = useTranslations('mobilePage');
  const locale = (useLocale() || 'en') as 'en' | 'hi';
  const profile = useNumerologyStore((s) => s.profile);

  const [inputMobile, setInputMobile] = useState(profile.mobile || '9876543210');

  const mulank = profile.dob ? calculateMulank(profile.dob).mulank : 1;
  const analysis: MobileAnalysisResult = analyzeMobileNumber(inputMobile, mulank);

  // Screensaver cards with colors & themes
  const screensavers = [
    {
      id: 1,
      title: locale === 'hi' ? 'स्वर्ण सूर्योदय' : 'Golden Sunrise',
      colors: ['#F0B53A', '#C98310', '#FFF1CC'],
      bg: 'linear-gradient(135deg, #FDE9C4 0%, #F0B53A 50%, #C98310 100%)',
      symbol: '☀️',
    },
    {
      id: 2,
      title: locale === 'hi' ? 'वैदिक श्री यंत्र' : 'Sacred Mandala',
      colors: ['#8A7F6E', '#E8A317', '#FFFAF3'],
      bg: 'linear-gradient(135deg, #FFFAF3 0%, #F3E3C4 50%, #E8A317 100%)',
      symbol: '☸️',
    },
    {
      id: 3,
      title: locale === 'hi' ? 'ब्रह्मांडीय कमल' : 'Cosmic Lotus',
      colors: ['#E9E2FA', '#F0B53A', '#FFFFFF'],
      bg: 'linear-gradient(135deg, #E9E2FA 0%, #FFF1CC 60%, #F0B53A 100%)',
      symbol: '🪷',
    },
    {
      id: 4,
      title: locale === 'hi' ? 'समृद्धि कुबेर' : 'Prosperity Aura',
      colors: ['#2B2B3A', '#E8A317', '#14213D'],
      bg: 'linear-gradient(135deg, #14213D 0%, #2B2B3A 50%, #E8A317 100%)',
      symbol: '✨',
    },
  ];

  // Directions for the compass
  const directions = [
    { label: 'N', name: 'North', angle: 0 },
    { label: 'NE', name: 'North-East', angle: 45 },
    { label: 'E', name: 'East', angle: 90 },
    { label: 'SE', name: 'South-East', angle: 135 },
    { label: 'S', name: 'South', angle: 180 },
    { label: 'SW', name: 'South-West', angle: 225 },
    { label: 'W', name: 'West', angle: 270 },
    { label: 'NW', name: 'North-West', angle: 315 },
  ];

  const targetDir = analysis.chargingDirectionEn.toUpperCase();

  const emptyStates = pairMeaningsData.emptyState as Record<string, { en: string; hi: string }>;

  return (
    <div className="space-y-6 sm:space-y-7">
      <SectionHeader
        title={t('title')}
        subtitle={t('subtitle')}
        icon={<Smartphone className="w-5 h-5 stroke-[1.5]" />}
      />

      <ProfileEmptyBanner />

      {/* Input bar */}
      <div className="vedic-card p-4 sm:p-5 space-y-2">
        <label className="block text-[13px] font-medium text-[var(--text-muted)]">
          {locale === 'hi' ? '10 अंकों का मोबाइल नंबर दर्ज करें' : 'Enter Mobile Number'}
        </label>
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <input
            type="text"
            value={inputMobile}
            maxLength={10}
            onChange={(e) => setInputMobile(e.target.value.replace(/\D/g, ''))}
            placeholder={locale === 'hi' ? '10 अंकों का मोबाइल नंबर दर्ज करें...' : 'Enter 10 digit mobile...'}
            className="flex-1 w-full h-[44px] px-[14px] rounded-[12px] bg-[var(--surface)] border border-[var(--input-border)] text-[16px] font-mono text-[var(--heading)] placeholder:text-[var(--text-muted)] focus:border-[var(--gold)] focus:ring-2 focus:ring-[var(--gold)]/20 outline-hidden transition-all leading-[1.5] lining-nums"
          />
          <button
            type="button"
            onClick={() => setInputMobile(profile.mobile || '9876543210')}
            className="btn-gold-gradient h-[44px] px-5 rounded-[12px] text-[15px] font-semibold flex items-center justify-center gap-2 cursor-pointer shrink-0 w-full sm:w-auto shadow-[0_4px_12px_rgba(201,131,16,0.25)]"
          >
            <Sparkles className="w-4 h-4 stroke-[2]" />
            <span>{locale === 'hi' ? 'कंपन विश्लेषण करें' : 'Analyze Vibrations'}</span>
          </button>
        </div>
      </div>

      {/* Overview Card */}
      <div className="vedic-card p-4 sm:p-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          <div className="text-center md:text-left space-y-1">
            <span className="text-[11px] text-[var(--text-muted)]">{t('totalSum')}</span>
            <div className="font-serif text-2xl font-bold text-[var(--heading)] lining-nums">
              {analysis.digitSum}
            </div>
            <div className="text-[11px] text-[var(--gold)] font-medium flex items-center justify-center md:justify-start gap-1">
              <span>{locale === 'hi' ? 'संयुक्त अंक:' : 'Compound:'}</span>
              <CompoundNumber compound={analysis.compound} reduced={analysis.reduced} size="sm" />
            </div>
          </div>

          <div className="flex flex-col items-center justify-center">
            <span className="text-[11px] text-[var(--text-muted)] mb-1">
              {locale === 'hi' ? 'अंतिम मूल अंक' : 'Final Reduced Root'}
            </span>
            <NumberBadge number={analysis.reducedTotal} size="lg" variant="gold" />
          </div>

          <div className="text-center md:text-right space-y-1.5">
            <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
              analysis.isFavorableTotal
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                : 'bg-[var(--chip-bg)] text-[var(--gold)] border-[var(--border)]'
            }`}>
              {analysis.isFavorableTotal ? (locale === 'hi' ? 'अत्यंत शुभ व्यापारिक अंक' : 'Highly Auspicious') : (locale === 'hi' ? 'सामान्य अंक योग' : 'Moderate Commercial')}
            </span>
            <p className="text-[11.5px] text-[var(--text-muted)] leading-relaxed max-w-sm ml-auto">
              {locale === 'hi' ? analysis.generalVerdictHi : analysis.generalVerdictEn}
            </p>
          </div>
        </div>
      </div>

      {/* Charging Direction with Compass Visual + Screensaver Gallery */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Visual Compass Card */}
        <div className="vedic-card p-4 sm:p-5 space-y-4">
          <div className="flex items-center gap-2 text-[var(--gold)]">
            <Compass className="w-4 h-4 text-[var(--gold)]" />
            <h4 className="text-sm font-bold font-serif text-[var(--heading)]">{t('chargingDirection')}</h4>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-5 justify-between">
            {/* Circular Compass Visual */}
            <div className="relative w-36 h-36 rounded-full border-2 border-dashed border-[var(--border)] bg-[var(--surface)] flex items-center justify-center shadow-inner shrink-0">
              <div className="absolute inset-2 rounded-full border border-[var(--border)]/60" />
              <div className="w-12 h-12 rounded-full bg-[var(--chip-bg)] border border-[var(--border)] flex items-center justify-center font-bold text-[10px] text-[var(--gold)]">
                {analysis.chargingDirectionEn.slice(0, 4)}
              </div>

              {directions.map((d) => {
                const isHighlight = targetDir.includes(d.label) || targetDir.includes(d.name.toUpperCase());
                return (
                  <div
                    key={d.label}
                    className="absolute text-[9px] font-bold"
                    style={{
                      transform: `rotate(${d.angle}deg) translate(0, -56px) rotate(-${d.angle}deg)`,
                    }}
                  >
                    <span
                      className={`px-1 py-0.5 rounded ${
                        isHighlight
                          ? 'bg-[var(--gold)] text-slate-900 font-extrabold shadow-xs scale-110'
                          : 'text-[var(--text-muted)]'
                      }`}
                    >
                      {d.label}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="space-y-1.5 text-center sm:text-left">
              <span className="text-[10px] uppercase font-bold text-[var(--gold)] tracking-wider">
                {locale === 'hi' ? 'सर्वोत्तम चार्जिंग दिशा' : 'Optimal Alignment Direction'}
              </span>
              <p className="text-base font-serif font-bold text-[var(--heading)]">
                {locale === 'hi' ? analysis.chargingDirectionHi : analysis.chargingDirectionEn}
              </p>
              <p className="text-[11.5px] text-[var(--text-muted)] leading-relaxed">
                {locale === 'hi'
                  ? 'इस दिशा में फोन रखकर चार्ज करने से आपकी जन्म ऊर्जा (मूलांक) के साथ अनुकूलता बढ़ती है।'
                  : 'Charging your phone facing this direction harmonizes device electromagnetic waves with your birth driver.'}
              </p>
            </div>
          </div>
        </div>

        {/* Favourable Screensaver Gallery with Swatches */}
        <div className="vedic-card p-4 sm:p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[var(--gold)]">
              <ImageIcon className="w-4 h-4 text-[var(--gold)]" />
              <h4 className="text-sm font-bold font-serif text-[var(--heading)]">{t('favourableScreensaver')}</h4>
            </div>
            <span className="text-[10.5px] text-[var(--gold)] font-bold">
              {locale === 'hi' ? analysis.screensaverSuggestionHi : analysis.screensaverSuggestionEn}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
            {screensavers.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl border border-[var(--border)] overflow-hidden bg-[var(--surface)] shadow-xs flex flex-col group transition-all hover:scale-[1.02]"
              >
                <div
                  className="h-20 flex items-center justify-center text-2xl relative"
                  style={{ background: item.bg }}
                >
                  <span className="drop-shadow-md">{item.symbol}</span>
                </div>
                <div className="p-2 space-y-1">
                  <span className="text-[10px] font-bold text-[var(--heading)] block truncate">
                    {item.title}
                  </span>
                  <div className="flex items-center gap-1">
                    {item.colors.map((c, idx) => (
                      <span
                        key={idx}
                        className="w-3 h-3 rounded-full border border-black/10 inline-block"
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <p className="text-[11px] text-[var(--text-muted)] leading-relaxed pt-1">
            {locale === 'hi'
              ? 'यह वॉलपेपर आपके अवचेतन मन को सकारात्मक ऊर्जा और लक्ष्य स्पष्टता प्रदान करता है।'
              : 'Applying these harmonic visuals stimulates your subconscious mind with continuous prosperity signals.'}
          </p>
        </div>
      </div>

      {/* PART B: Adjacent Digit Pairs Analysis - Clean Two-Column Redesign */}
      <div className="space-y-4 pt-2">
        {/* Section Heading & Summary Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base sm:text-lg font-serif font-bold text-[var(--heading)] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[var(--gold)]" />
              <span>{locale === 'hi' ? 'सन्निकट अंक युग्म विश्लेषण' : 'Adjacent Digit Pairs Analysis'}</span>
            </h3>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              {locale === 'hi'
                ? 'मोबाइल संख्या के प्रत्येक क्रमिक अंक जोड़े का सूक्ष्म ऊर्जा प्रभाव'
                : 'Micro-vibrational influence of consecutive digit pairs in the mobile sequence'}
            </p>
          </div>

          {/* Summary bar chips + total reduced number */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-2xs">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>{locale === 'hi' ? 'शुभ' : 'Auspicious'}</span>
              <span className="lining-nums font-bold ml-0.5">{analysis.auspiciousPairsCount}</span>
            </span>

            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200 shadow-2xs">
              <Scale className="w-3.5 h-3.5 text-amber-600" />
              <span>{locale === 'hi' ? 'सामान्य' : 'Neutral'}</span>
              <span className="lining-nums font-bold ml-0.5">{analysis.neutralPairsCount}</span>
            </span>

            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-800 border border-rose-200 shadow-2xs">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
              <span>{locale === 'hi' ? 'चुनौतीपूर्ण' : 'Challenging'}</span>
              <span className="lining-nums font-bold ml-0.5">{analysis.challengingPairsCount}</span>
            </span>

            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-[var(--chip-bg)] text-[var(--heading)] border border-[var(--border)] shadow-2xs">
              <span className="text-[var(--text-muted)]">{locale === 'hi' ? 'कुल योग:' : 'Total:'}</span>
              <span className="font-bold text-[var(--gold)] lining-nums">
                {analysis.digitSum} → {analysis.reducedTotal}
              </span>
            </span>
          </div>
        </div>

        {/* Two Equal-Height Columns: Left Auspicious, Right Neutral */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
          {/* LEFT: Auspicious Pairs */}
          <div className="vedic-card border-t-[3px] border-t-emerald-500 p-0 flex flex-col overflow-hidden shadow-xs">
            {/* Column Header */}
            <div className="p-4 border-b border-[var(--border)] bg-[var(--surface-muted)]/30 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <h4 className="font-serif font-bold text-[15px] text-[var(--heading)]">
                  {locale === 'hi' ? 'शुभ अंक युग्म' : 'Auspicious Pairs'}
                </h4>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 lining-nums">
                {analysis.auspiciousPairsCount}
              </span>
            </div>

            {/* Hairline-separated Rows */}
            <div className="flex-1 divide-y divide-[var(--border)]">
              {analysis.auspiciousPairs.length > 0 ? (
                analysis.auspiciousPairs.map((p, idx) => (
                  <div
                    key={`ausp-${idx}`}
                    className="p-3.5 flex items-center gap-3.5 hover:bg-[var(--surface-muted)]/40 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-xl bg-[var(--surface-muted)] border border-[var(--border)] font-mono font-bold text-base text-[var(--heading)] flex items-center justify-center shrink-0 lining-nums shadow-2xs">
                      {p.pair}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[11px] text-[var(--text-muted)] font-medium lining-nums">
                          {p.positionLabel}
                        </span>
                        <span className="text-[10px] text-[var(--text-muted)]">•</span>
                        <span className="text-[11px] font-semibold text-emerald-700 lining-nums">
                          {p.sumDisplay}
                        </span>
                      </div>
                      <h5 className="text-[13px] font-bold text-[var(--heading)] truncate">
                        {locale === 'hi' ? p.titleHi : p.titleEn}
                      </h5>
                      <p className="text-[11.5px] text-[var(--text-muted)] truncate">
                        {locale === 'hi' ? p.descriptionHi : p.descriptionEn}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-xs text-[var(--text-muted)] italic">
                  {emptyStates.auspicious?.[locale] || 'No auspicious pairs detected.'}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: Neutral Pairs */}
          <div className="vedic-card border-t-[3px] border-t-[var(--gold)] p-0 flex flex-col overflow-hidden shadow-xs">
            {/* Column Header */}
            <div className="p-4 border-b border-[var(--border)] bg-[var(--surface-muted)]/30 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Scale className="w-4 h-4 text-[var(--gold)] shrink-0" />
                <h4 className="font-serif font-bold text-[15px] text-[var(--heading)]">
                  {locale === 'hi' ? 'सामान्य अंक युग्म' : 'Neutral Pairs'}
                </h4>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 lining-nums">
                {analysis.neutralPairsCount}
              </span>
            </div>

            {/* Hairline-separated Rows */}
            <div className="flex-1 divide-y divide-[var(--border)]">
              {analysis.neutralPairs.length > 0 ? (
                analysis.neutralPairs.map((p, idx) => (
                  <div
                    key={`neut-${idx}`}
                    className="p-3.5 flex items-center gap-3.5 hover:bg-[var(--surface-muted)]/40 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-xl bg-[var(--surface-muted)] border border-[var(--border)] font-mono font-bold text-base text-[var(--heading)] flex items-center justify-center shrink-0 lining-nums shadow-2xs">
                      {p.pair}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[11px] text-[var(--text-muted)] font-medium lining-nums">
                          {p.positionLabel}
                        </span>
                        <span className="text-[10px] text-[var(--text-muted)]">•</span>
                        <span className="text-[11px] font-semibold text-[var(--gold)] lining-nums">
                          {p.sumDisplay}
                        </span>
                      </div>
                      <h5 className="text-[13px] font-bold text-[var(--heading)] truncate">
                        {locale === 'hi' ? p.titleHi : p.titleEn}
                      </h5>
                      <p className="text-[11.5px] text-[var(--text-muted)] truncate">
                        {locale === 'hi' ? p.descriptionHi : p.descriptionEn}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-xs text-[var(--text-muted)] italic">
                  {emptyStates.neutral?.[locale] || 'No neutral pairs detected.'}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Challenging Pairs: Full-width section below ONLY when count > 0 */}
        {analysis.challengingPairsCount > 0 && (
          <div className="vedic-card border-t-[3px] border-t-rose-500 p-0 overflow-hidden shadow-xs mt-3">
            <div className="p-4 border-b border-[var(--border)] bg-rose-50/40 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <h4 className="font-serif font-bold text-[15px] text-rose-950">
                  {locale === 'hi' ? 'चुनौतीपूर्ण अंक युग्म (सावधानी)' : 'Challenging Pairs (Friction Warning)'}
                </h4>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300 lining-nums">
                {analysis.challengingPairsCount}
              </span>
            </div>

            <div className="divide-y divide-[var(--border)]">
              {analysis.challengingPairs.map((p, idx) => (
                <div
                  key={`chall-${idx}`}
                  className="p-3.5 flex items-center gap-3.5 hover:bg-rose-50/20 transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200 font-mono font-bold text-base text-rose-900 flex items-center justify-center shrink-0 lining-nums shadow-2xs">
                    {p.pair}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[11px] text-[var(--text-muted)] font-medium lining-nums">
                        {p.positionLabel}
                      </span>
                      <span className="text-[10px] text-[var(--text-muted)]">•</span>
                      <span className="text-[11px] font-semibold text-rose-700 lining-nums">
                        {p.sumDisplay}
                      </span>
                    </div>
                    <h5 className="text-[13px] font-bold text-[var(--heading)] truncate">
                      {locale === 'hi' ? p.titleHi : p.titleEn}
                    </h5>
                    <p className="text-[11.5px] text-[var(--text-muted)] truncate">
                      {locale === 'hi' ? p.descriptionHi : p.descriptionEn}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
