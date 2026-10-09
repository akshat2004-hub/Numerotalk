'use client';

import React, { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Smartphone, Sparkles, Compass, Image as ImageIcon, CheckCircle, AlertTriangle, ArrowUp } from 'lucide-react';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { NumberBadge } from '@/components/ui/NumberBadge';
import { PredictionCard } from '@/components/ui/PredictionCard';
import { ProfileEmptyBanner } from '@/components/ProfileEmptyBanner';
import { useNumerologyStore } from '@/lib/store/useNumerologyStore';
import { analyzeMobileNumber, calculateMulank, MobileAnalysisResult } from '@/lib';

export default function MobilePage() {
  const t = useTranslations('mobilePage');
  const locale = (useLocale() || 'en') as 'en' | 'hi';
  const profile = useNumerologyStore((s) => s.profile);

  const [inputMobile, setInputMobile] = useState(profile.mobile || '9876543210');

  const mulank = profile.dob ? calculateMulank(profile.dob).mulank : 1;
  const analysis: MobileAnalysisResult = analyzeMobileNumber(inputMobile, mulank);

  // Mock screensaver cards with colors & themes
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

  return (
    <div className="space-y-6 sm:space-y-7">
      <SectionHeader
        title={t('title')}
        subtitle={t('subtitle')}
        badge={locale === 'hi' ? 'मोबाइल अंक 09' : 'MOBILE FREQUENCY 09'}
        icon={<Smartphone className="w-5 h-5 stroke-[1.5]" />}
      />

      <ProfileEmptyBanner />

      {/* Input bar */}
      <div className="vedic-card p-4 sm:p-5 space-y-2.5">
        <label className="block text-[11px] font-semibold text-[var(--text-muted)]">
          {t('inputLabel')}
        </label>
        <div className="flex flex-col sm:flex-row gap-2.5">
          <input
            type="text"
            value={inputMobile}
            maxLength={10}
            onChange={(e) => setInputMobile(e.target.value.replace(/\D/g, ''))}
            placeholder="Enter 10 digit mobile..."
            className="flex-1 h-[40px] px-3.5 rounded-xl bg-[var(--surface)] border border-[var(--input-border)] text-xs font-mono text-[var(--heading)] focus:border-[var(--gold)] outline-hidden transition-all"
          />
          <button
            type="button"
            onClick={() => setInputMobile(profile.mobile || '9876543210')}
            className="btn-gold-gradient h-[40px] px-5 text-xs font-semibold rounded-xl cursor-pointer shrink-0"
          >
            {t('analyzeBtn')}
          </button>
        </div>
      </div>

      {/* Overview Card */}
      <div className="vedic-card p-4 sm:p-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          <div className="text-center md:text-left space-y-0.5">
            <span className="text-[11px] text-[var(--text-muted)]">{t('totalSum')}</span>
            <div className="font-serif text-2xl font-bold text-[var(--heading)]">
              {analysis.digitSum}
            </div>
            <span className="text-[11px] text-[var(--gold)] font-mono font-semibold">
              Compound: {analysis.compoundStr}
            </span>
          </div>

          <div className="flex flex-col items-center justify-center">
            <span className="text-[11px] text-[var(--text-muted)] mb-1">Final Reduced Root</span>
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
              {/* Compass Needle Rings */}
              <div className="absolute inset-2 rounded-full border border-[var(--border)]/60" />
              <div className="w-12 h-12 rounded-full bg-[var(--chip-bg)] border border-[var(--border)] flex items-center justify-center font-bold text-[10px] text-[var(--gold)]">
                {analysis.chargingDirectionEn.slice(0, 4)}
              </div>

              {/* 8 Cardinal Direction Markers */}
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

          {/* 4 Screensaver Mock Items */}
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

      {/* Adjacent Pairs Analysis */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm sm:text-base font-bold font-serif text-[var(--heading)] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[var(--gold)]" />
            {t('pairsTitle')}
          </h3>
          <div className="flex items-center gap-2 text-[11px]">
            <span className="text-emerald-700 font-semibold">
              {t('auspiciousPairs')}: {analysis.auspiciousPairsCount}
            </span>
            <span className="text-rose-700 font-semibold">
              {t('cautionPairs')}: {analysis.cautionPairsCount}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {analysis.pairs.map((p, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-2xl border flex items-start gap-2.5 ${
                p.quality === 'auspicious'
                  ? 'bg-emerald-50/70 border-emerald-200'
                  : p.quality === 'caution'
                  ? 'bg-rose-50/70 border-rose-200'
                  : 'bg-[var(--surface)] border-[var(--border)]'
              }`}
            >
              <div className="font-serif text-sm font-bold text-[var(--gold)] bg-[var(--surface)] px-2 py-0.5 rounded-xl border border-[var(--border)] shrink-0">
                {p.pair}
              </div>
              <div className="text-xs space-y-0.5">
                <span className={`font-semibold block text-[11px] ${
                  p.quality === 'auspicious' ? 'text-emerald-800' : p.quality === 'caution' ? 'text-rose-800' : 'text-[var(--heading)]'
                }`}>
                  Sum: {p.sum} • {p.quality.toUpperCase()}
                </span>
                <p className="text-[var(--text-muted)] text-[11px] leading-relaxed">
                  {locale === 'hi' ? p.meaningHi : p.meaningEn}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
