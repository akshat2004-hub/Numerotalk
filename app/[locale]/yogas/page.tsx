'use client';

import React, { useMemo, useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import {
  Grid,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Check,
  Plus,
  ExternalLink,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { SectionHeader } from '@/frontend/components/ui/SectionHeader';
import { ProfileEmptyBanner } from '@/frontend/components/ProfileEmptyBanner';
import { VedicGrid } from '@/frontend/components/VedicGrid';
import { useNumerologyStore } from '@/frontend/store/useNumerologyStore';
import { calculateVedicGrid, yogStatus } from '@/core';
import yogsData from '@/mocks/rules/yogs.json';
import remedyMapData from '@/mocks/rules/remedy-map.json';

interface YogItem {
  id: string;
  name: { en: string; hi: string };
  digits: [number, number, number];
  theme: { en: string; hi: string } | string;
  prediction: {
    formed: { en: string; hi: string };
    partial: { en: string; hi: string };
    inactive: { en: string; hi: string };
  };
  tip: { en: string; hi: string };
  verify: boolean;
}

interface RemedyMapEntry {
  id: string;
  digit: number;
  label: { en: string; hi: string };
}

export default function YogasPage() {
  const t = useTranslations('yogasPage');
  const locale = (useLocale() || 'en') as 'en' | 'hi';
  const profile = useNumerologyStore((s) => s.profile);
  const reportSections = useNumerologyStore((s) => s.reportSections);
  const toggleReportSection = useNumerologyStore((s) => s.toggleReportSection);

  const [activeYogId, setActiveYogId] = useState<string>('');
  const jumpBarScrollRef = useRef<HTMLDivElement>(null);

  const dob = profile.dob || '1995-10-23';
  const grid = useMemo(() => calculateVedicGrid(dob), [dob]);

  const yogasList = (yogsData.yogas || []) as YogItem[];
  const remedyMap = (remedyMapData.yog || {}) as Record<string, RemedyMapEntry[]>;

  // Compute status for all yogs in the fixed order of yogs.json (do NOT re-sort)
  const evaluatedYogas = useMemo(() => {
    return yogasList.map((yog) => {
      const statusInfo = yogStatus(grid, yog.digits);
      return {
        yog,
        ...statusInfo,
      };
    });
  }, [grid, yogasList]);

  // Aggregate counts dynamically from yogs.json length (never hardcode 8)
  const totalCount = evaluatedYogas.length;
  const formedCount = evaluatedYogas.filter((y) => y.status === 'formed').length;
  const partialCount = evaluatedYogas.filter((y) => y.status === 'partial').length;
  const notFormedCount = evaluatedYogas.filter((y) => y.status === 'inactive').length;

  // Deduplicated aggregated remedies from all partial and not-formed yogs
  const aggregatedRemedies = useMemo(() => {
    const map = new Map<string, RemedyMapEntry & { forYogs: string[] }>();

    evaluatedYogas.forEach(({ yog, status, missing }) => {
      if (status !== 'formed') {
        const yogRemedies = remedyMap[yog.id] || [];
        // Only include remedies that address the missing digits of this yog
        yogRemedies.forEach((rem) => {
          if (missing.includes(rem.digit)) {
            const existing = map.get(rem.id);
            const yogLabel = yog.name[locale];
            if (existing) {
              if (!existing.forYogs.includes(yogLabel)) {
                existing.forYogs.push(yogLabel);
              }
            } else {
              map.set(rem.id, {
                ...rem,
                forYogs: [yogLabel],
              });
            }
          }
        });
      }
    });

    return Array.from(map.values());
  }, [evaluatedYogas, remedyMap, locale]);

  // Check if all aggregated remedies are added to report
  const allRemediesInReport = useMemo(() => {
    if (aggregatedRemedies.length === 0) return false;
    return aggregatedRemedies.every((rem) => !!reportSections[`remedy_${rem.id}`]);
  }, [aggregatedRemedies, reportSections]);

  const handleAddAllRemediesToReport = () => {
    aggregatedRemedies.forEach((rem) => {
      const key = `remedy_${rem.id}`;
      if (!reportSections[key]) {
        toggleReportSection(key);
      }
    });
  };

  // IntersectionObserver to highlight active yog chip currently in view
  useEffect(() => {
    if (evaluatedYogas.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries.find((entry) => entry.isIntersecting);
        if (visibleEntry) {
          const id = visibleEntry.target.id.replace('yog-', '');
          setActiveYogId(id);
        }
      },
      {
        rootMargin: '-100px 0px -55% 0px',
        threshold: 0.1,
      }
    );

    evaluatedYogas.forEach(({ yog }) => {
      const el = document.getElementById(`yog-${yog.id}`);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [evaluatedYogas]);

  const scrollJumpBar = (offset: number) => {
    if (jumpBarScrollRef.current) {
      jumpBarScrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-6 sm:space-y-7 pb-12">
      <SectionHeader
        title={t('title')}
        subtitle={t('subtitle')}
        icon={<Grid className="w-5 h-5 stroke-[1.5]" />}
      />

      <ProfileEmptyBanner />

      {/* 1. Summary Tiles: White tiles with hairline border, status text colors, 36px numbers, equal heights */}
      <div className="grid grid-cols-3 gap-2.5 sm:gap-4 items-stretch">
        {/* Formed */}
        <div className="vedic-card h-full flex flex-col items-center justify-center p-3.5 sm:p-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] text-center shadow-xs">
          <div className="flex items-center justify-center gap-1.5 mb-1.5">
            <span className="w-2 h-2 rounded-full bg-[var(--success-text)] shrink-0" />
            <span className="text-[11px] sm:text-xs font-semibold text-[var(--success-text)]">
              {t('formedCount')}
            </span>
          </div>
          <div className="text-[36px] leading-tight font-bold font-serif text-[var(--success-text)] lining-nums">
            {formedCount}
            <span className="text-xs sm:text-sm font-sans font-normal text-[var(--text-muted)] ml-1">
              / {totalCount}
            </span>
          </div>
        </div>

        {/* Partial */}
        <div className="vedic-card h-full flex flex-col items-center justify-center p-3.5 sm:p-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] text-center shadow-xs">
          <div className="flex items-center justify-center gap-1.5 mb-1.5">
            <span className="w-2 h-2 rounded-full bg-[var(--warn-text)] shrink-0" />
            <span className="text-[11px] sm:text-xs font-semibold text-[var(--warn-text)]">
              {t('partialCount')}
            </span>
          </div>
          <div className="text-[36px] leading-tight font-bold font-serif text-[var(--warn-text)] lining-nums">
            {partialCount}
            <span className="text-xs sm:text-sm font-sans font-normal text-[var(--text-muted)] ml-1">
              / {totalCount}
            </span>
          </div>
        </div>

        {/* Not formed */}
        <div className="vedic-card h-full flex flex-col items-center justify-center p-3.5 sm:p-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] text-center shadow-xs">
          <div className="flex items-center justify-center gap-1.5 mb-1.5">
            <span className="w-2 h-2 rounded-full bg-[var(--neutral-text)] shrink-0" />
            <span className="text-[11px] sm:text-xs font-semibold text-[var(--neutral-text)]">
              {t('notFormedCount')}
            </span>
          </div>
          <div className="text-[36px] leading-tight font-bold font-serif text-[var(--neutral-text)] lining-nums">
            {notFormedCount}
            <span className="text-xs sm:text-sm font-sans font-normal text-[var(--text-muted)] ml-1">
              / {totalCount}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Jump Bar: bg var(--surface), 1px var(--border), radius 16px, sticky with shadow, scrollbar-width: none, fade edges, desktop arrows */}
      <div className="sticky top-14 sm:top-16 z-30 bg-[var(--surface)] border border-[var(--border)] rounded-[16px] shadow-xs px-2.5 sm:px-4 py-2 relative">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-[var(--text-muted)] shrink-0 hidden sm:inline mr-1">
            {t('jumpBar')}
          </span>

          {/* Desktop scroll left arrow */}
          <button
            type="button"
            onClick={() => scrollJumpBar(-180)}
            className="hidden md:flex items-center justify-center w-6 h-6 rounded-full bg-[var(--surface)] border border-[var(--border)] hover:bg-[var(--active-bg)] text-[var(--heading)] cursor-pointer shrink-0 z-20 transition-all shadow-2xs"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-3.5 h-3.5 stroke-[2]" />
          </button>

          {/* Scrollable container with edge fades and no native scrollbar */}
          <div className="relative flex-1 min-w-0 overflow-hidden">
            {/* Left fade gradient */}
            <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-[var(--surface)] to-transparent z-10" />

            <div
              ref={jumpBarScrollRef}
              className="flex items-center gap-2 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden scroll-smooth py-0.5 px-2"
            >
              {evaluatedYogas.map(({ yog, status }) => {
                const isActive = activeYogId === yog.id;
                const dotColor =
                  status === 'formed'
                    ? 'bg-[var(--success-text)]'
                    : status === 'partial'
                    ? 'bg-[var(--warn-text)]'
                    : 'bg-[var(--neutral-text)]';

                return (
                  <button
                    key={yog.id}
                    type="button"
                    onClick={() => {
                      const target = document.getElementById(`yog-${yog.id}`);
                      if (target) {
                        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }
                      setActiveYogId(yog.id);
                    }}
                    className={`shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[13px] font-medium transition-all cursor-pointer whitespace-nowrap ${
                      isActive
                        ? 'border-[1.5px] border-[var(--gold)] bg-[var(--active-bg)] text-[var(--heading)] font-semibold shadow-2xs'
                        : 'bg-[var(--surface)] border border-[var(--border)] text-[var(--text)] hover:bg-[var(--active-bg)]'
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${dotColor} shrink-0`} />
                    <span>{yog.name[locale]}</span>
                  </button>
                );
              })}
            </div>

            {/* Right fade gradient */}
            <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-[var(--surface)] to-transparent z-10" />
          </div>

          {/* Desktop scroll right arrow */}
          <button
            type="button"
            onClick={() => scrollJumpBar(180)}
            className="hidden md:flex items-center justify-center w-6 h-6 rounded-full bg-[var(--surface)] border border-[var(--border)] hover:bg-[var(--active-bg)] text-[var(--heading)] cursor-pointer shrink-0 z-20 transition-all shadow-2xs"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-3.5 h-3.5 stroke-[2]" />
          </button>
        </div>
      </div>

      {/* 3. The Yog Section Cards: radius 24px, left accent bar 4px, soft warm shadow, light theme tokens */}
      <div className="space-y-6">
        {evaluatedYogas.map(({ yog, status, count, missing }) => {
          const isFormed = status === 'formed';
          const isPartial = status === 'partial';

          const accentBg = isFormed
            ? 'var(--success-text)'
            : isPartial
            ? 'var(--gold)'
            : 'var(--neutral-text)';

          const statusBadge = isFormed ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[var(--success-bg)] text-[var(--success-text)] border border-[var(--success-border)]">
              <CheckCircle2 className="w-3.5 h-3.5 text-[var(--success-text)]" />
              <span>{t('formedBadge', { present: count, total: yog.digits.length })}</span>
            </span>
          ) : isPartial ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[var(--warn-bg)] text-[var(--warn-text)] border border-[var(--warn-border)]">
              <AlertCircle className="w-3.5 h-3.5 text-[var(--warn-text)]" />
              <span>{t('partialBadge', { present: count, total: yog.digits.length })}</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[var(--neutral-bg)] text-[var(--neutral-text)] border border-[var(--neutral-border)]">
              <HelpCircle className="w-3.5 h-3.5 text-[var(--neutral-text)]" />
              <span>{t('notFormedBadge', { present: count, total: yog.digits.length })}</span>
            </span>
          );

          const sectionReportKey = `module6_yoga_${yog.id}`;
          const isAddedToReport = !!reportSections[sectionReportKey];

          // Theme text localized
          const themeText = typeof yog.theme === 'object' ? yog.theme[locale] : yog.theme;

          // Prediction text replacement for {missing}
          const rawPrediction = yog.prediction[isFormed ? 'formed' : isPartial ? 'partial' : 'inactive'][locale];
          const missingFormatted = missing.length > 0 ? missing.join(' · ') : '';
          const predictionText = rawPrediction.replace(/\{missing\}/g, missingFormatted);

          // Dedicated remedies for this yog
          const yogRemedies = (remedyMap[yog.id] || []).filter((rem) => missing.includes(rem.digit));

          return (
            <section
              key={yog.id}
              id={`yog-${yog.id}`}
              className="scroll-mt-32 relative bg-[var(--surface)] rounded-[24px] border border-[var(--border)] shadow-[0_4px_24px_rgba(190,130,20,0.08)] p-5 sm:p-6 transition-all duration-300 overflow-hidden"
            >
              {/* 4px Left Accent Bar */}
              <div
                className="absolute left-0 top-0 bottom-0 w-1 rounded-l-[24px]"
                style={{ backgroundColor: accentBg }}
              />

              {/* Header row: yog name (22px serif) + theme chip on left; status chip + sm outline Add to report on right */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-5 border-b border-[var(--border)]">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h3 className="font-serif font-bold text-[22px] text-[var(--heading)] tracking-tight leading-tight">
                    {yog.name[locale]}
                  </h3>
                  {themeText && (
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[var(--chip-bg)] text-[var(--heading)] border border-[var(--border)]">
                      {themeText}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2.5 self-start sm:self-auto shrink-0">
                  {statusBadge}
                  <button
                    type="button"
                    onClick={() => toggleReportSection(sectionReportKey)}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer shadow-2xs ${
                      isAddedToReport
                        ? 'bg-[var(--success-bg)] text-[var(--success-text)] border border-[var(--success-border)]'
                        : 'bg-[var(--surface)] text-[var(--gold-deep)] hover:bg-[var(--chip-bg)] border border-[var(--gold)]'
                    }`}
                  >
                    {isAddedToReport ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-[var(--success-text)]" />
                        <span>{t('inReport')}</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5 text-[var(--gold-deep)]" />
                        <span>{t('addToReport')}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Body in 2 columns on desktop (grid left ~240px, text right); 1 column on mobile */}
              <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] lg:grid-cols-[260px_1fr] gap-6 items-start">
                {/* LEFT: This yog's OWN <VedicGrid/> */}
                <div className="w-full flex flex-col items-center justify-center">
                  <VedicGrid
                    dob={dob}
                    locale={locale}
                    size="sm"
                    hideControls={true}
                    hideStats={true}
                    yogDigits={yog.digits}
                    caption={`${t('digitsCaption')}: ${yog.digits.join(' · ')}`}
                    className="w-full max-w-[240px] shadow-none border border-[var(--border)] p-3 rounded-2xl bg-[var(--surface)]"
                  />
                </div>

                {/* RIGHT: Prediction (15px, line-height 1.7) + Missing chips + Remedy chips + Tip box */}
                <div className="space-y-4">
                  {/* Prediction heading (14px uppercase tracking) + text */}
                  <div className="space-y-1.5">
                    <h4 className="font-serif font-bold text-[14px] uppercase tracking-wider text-[var(--gold-deep)] flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-[var(--gold)]" />
                      <span>{t('predictionHeading')}</span>
                    </h4>
                    <p className="text-[15px] leading-[1.7] text-[var(--text)]">
                      {predictionText}
                    </p>
                  </div>

                  {/* Missing digits chips (only if any) */}
                  {missing.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <span className="text-xs font-semibold text-[var(--warn-text)] shrink-0">
                        {t('missingDigits')}:
                      </span>
                      {missing.map((digit) => (
                        <span
                          key={digit}
                          className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-bold font-mono lining-nums bg-[var(--warn-bg)] text-[var(--warn-text)] border border-[var(--warn-border)]"
                        >
                          #{digit}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Remedies chips (only if partial or not formed; link to /remedies#<id>) */}
                  {!isFormed && yogRemedies.length > 0 && (
                    <div className="space-y-2 pt-1 border-t border-[var(--border)]">
                      <span className="text-xs font-semibold text-[var(--gold-deep)] block">
                        {t('remedies')}:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {yogRemedies.map((rem) => (
                          <Link
                            key={rem.id}
                            href={`/${locale}/remedies#${rem.id}`}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[var(--chip-bg)] text-[var(--heading)] hover:bg-[var(--active-bg)] hover:border-[var(--gold)] border border-[var(--border)] transition-all cursor-pointer shadow-2xs group"
                          >
                            <Sparkles className="w-3.5 h-3.5 text-[var(--gold)] shrink-0" />
                            <span className="font-bold text-[var(--heading)]">#{rem.digit}</span>
                            <span>{rem.label[locale]}</span>
                            <ExternalLink className="w-3 h-3 text-[var(--text-muted)] group-hover:text-[var(--gold)] ml-0.5" />
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Formed yog tip: "How to keep it strong" (success-bg, border 1px of success at 25% opacity, text success-text) */}
                  {isFormed && yog.tip && (
                    <div className="p-3.5 rounded-xl bg-[var(--success-bg)] border border-[var(--success-border)] text-[var(--success-text)] flex items-start gap-2.5">
                      <Sparkles className="w-4 h-4 text-[var(--success-text)] shrink-0 mt-0.5" />
                      <div className="space-y-0.5">
                        <span className="font-bold text-[var(--success-text)] block text-xs">
                          {t('keepStrong')}
                        </span>
                        <p className="leading-relaxed text-[13px] text-[var(--success-text)]">
                          {yog.tip[locale]}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </section>
          );
        })}
      </div>

      {/* 4. Bottom: "Recommended remedies" strip aggregated from all partial/not-formed yogs */}
      {aggregatedRemedies.length > 0 && (
        <div className="vedic-card p-5 sm:p-6 rounded-[24px] border border-[var(--border)] space-y-4 bg-[var(--surface)]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[var(--border)]">
            <div>
              <h3 className="font-serif font-bold text-base sm:text-lg text-[var(--heading)] flex items-center gap-2">
                <Sparkles className="w-4.5 h-4.5 text-[var(--gold)]" />
                <span>{t('recommendedRemedies')}</span>
              </h3>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">
                {t('recommendedRemediesSubtitle')}
              </p>
            </div>

            <button
              type="button"
              onClick={handleAddAllRemediesToReport}
              disabled={allRemediesInReport}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                allRemediesInReport
                  ? 'bg-[var(--success-bg)] text-[var(--success-text)] border border-[var(--success-border)] cursor-default'
                  : 'btn-gold-gradient shadow-2xs'
              }`}
            >
              {allRemediesInReport ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[var(--success-text)]" />
                  <span>{t('allRemediesAdded')}</span>
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5 text-white" />
                  <span>{t('addAllToReport')}</span>
                </>
              )}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {aggregatedRemedies.map((rem) => {
              const isAdded = !!reportSections[`remedy_${rem.id}`];

              return (
                <div
                  key={rem.id}
                  className="p-3.5 rounded-xl bg-[var(--surface)] border border-[var(--border)] flex flex-col justify-between gap-2.5 transition-all hover:border-[var(--gold)]"
                >
                  <div>
                    <div className="flex items-center justify-between gap-1.5 mb-1.5">
                      <span className="px-2 py-0.5 rounded-md text-[10.5px] font-bold font-mono lining-nums bg-[var(--chip-bg)] text-[var(--heading)] border border-[var(--border)]">
                        #{rem.digit}
                      </span>
                      <Link
                        href={`/${locale}/remedies#${rem.id}`}
                        className="text-[11px] font-medium text-[var(--gold)] hover:underline inline-flex items-center gap-0.5"
                      >
                        <span>{locale === 'hi' ? 'विवरण' : 'Details'}</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </div>

                    <h5 className="font-serif font-bold text-xs sm:text-sm text-[var(--heading)] leading-snug">
                      {rem.label[locale]}
                    </h5>

                    <p className="text-[11px] text-[var(--text-muted)] mt-1 truncate">
                      {locale === 'hi' ? 'संबंधित योग: ' : 'Addresses: '}
                      {rem.forYogs.join(', ')}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleReportSection(`remedy_${rem.id}`)}
                    className={`w-full inline-flex items-center justify-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer shadow-2xs ${
                      isAdded
                        ? 'bg-[var(--success-bg)] text-[var(--success-text)] border border-[var(--success-border)]'
                        : 'bg-[var(--surface)] text-[var(--gold-deep)] hover:bg-[var(--chip-bg)] border border-[var(--gold)]'
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-[var(--success-text)]" />
                        <span>{t('inReport')}</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5 text-[var(--gold-deep)]" />
                        <span>{t('addToReport')}</span>
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
