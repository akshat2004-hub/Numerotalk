'use client';

import React, { useState, useMemo } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import {
  CalendarCheck,
  Sparkles,
  ChevronDown,
  ChevronUp,
  X,
  PlusCircle,
  Baby,
  Coins,
  Landmark,
  History,
  HeartHandshake,
  Users,
  Flame,
  Milestone,
  Hash,
  Activity,
  Plane,
  Heart,
  Home,
  Briefcase,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { SectionHeader } from '@/frontend/components/ui/SectionHeader';
import { VedicGrid } from '@/frontend/components/VedicGrid';
import { ProfileEmptyBanner } from '@/frontend/components/ProfileEmptyBanner';
import { ScoreMeter } from '@/frontend/components/ui/ScoreMeter';
import { Modal } from '@/frontend/components/ui/Modal';
import { YearSelector } from '@/frontend/components/ui/YearSelector';
import { useNumerologyStore } from '@/frontend/store/useNumerologyStore';
import {
  ALL_EVENTS,
  EventRule,
  eventScore,
  calculateAllEventScores,
  EventScoreResult,
  getYearBeforeBirthReading,
  getMarriageLoveReading,
  getAllEventsLifeTimeline,
  getWordNumberImpact
} from '@/core/engine/events';

// Map icon to event ID
const EVENT_ICONS: Record<string, React.ReactNode> = {
  bacha: <Baby className="w-5 h-5 text-[var(--gold)]" />,
  dhan_vikas: <Coins className="w-5 h-5 text-[var(--gold)]" />,
  sarkari_naukri: <Landmark className="w-5 h-5 text-[var(--gold)]" />,
  year_before_birth: <History className="w-5 h-5 text-[var(--gold)]" />,
  marriage_life: <HeartHandshake className="w-5 h-5 text-[var(--gold)]" />,
  family_cooperation: <Users className="w-5 h-5 text-[var(--gold)]" />,
  affair: <Flame className="w-5 h-5 text-[var(--gold)]" />,
  all_events_by_dob: <Milestone className="w-5 h-5 text-[var(--gold)]" />,
  word_number: <Hash className="w-5 h-5 text-[var(--gold)]" />,
  health: <Activity className="w-5 h-5 text-[var(--gold)]" />,
  tour_travel: <Plane className="w-5 h-5 text-[var(--gold)]" />,
  marriage_love: <Heart className="w-5 h-5 text-[var(--gold)]" />,
  money_purchase: <Home className="w-5 h-5 text-[var(--gold)]" />,
  business: <Briefcase className="w-5 h-5 text-[var(--gold)]" />
};

export default function EventsPage() {
  const t = useTranslations('eventsPage');
  const locale = (useLocale() || 'en') as 'en' | 'hi';
  const profile = useNumerologyStore((s) => s.profile);
  const toggleReportSection = useNumerologyStore((s) => s.toggleReportSection);
  const reportSections = useNumerologyStore((s) => s.reportSections);
  const addCustomRemedy = useNumerologyStore((s) => s.addCustomRemedy);

  const isProfileEmpty = !profile.name || !profile.dob;
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const [activeEventModal, setActiveEventModal] = useState<EventScoreResult | null>(null);
  const [showReasonsAccordion, setShowReasonsAccordion] = useState<boolean>(true);
  const [pickedWordNumber, setPickedWordNumber] = useState<number>(5);

  const birthYear = profile.dob ? parseInt(profile.dob.split('-')[0], 10) : undefined;

  // Memoize all heavy engine calls — only recompute when dependencies change
  const { scores, strongest, weakest, topRemedies } = useMemo(
    () => calculateAllEventScores(profile, selectedYear),
    [profile, selectedYear]
  );

  // Special event readings
  const karmicReading = useMemo(
    () => getYearBeforeBirthReading(profile.dob || '1995-10-23'),
    [profile.dob]
  );
  const loveMarriageReading = useMemo(
    () => getMarriageLoveReading(profile, selectedYear),
    [profile, selectedYear]
  );
  const lifeTimeline = useMemo(
    () => getAllEventsLifeTimeline(profile.dob || '1995-10-23'),
    [profile.dob]
  );
  const wordImpact = useMemo(
    () => getWordNumberImpact(pickedWordNumber, profile),
    [pickedWordNumber, profile]
  );

  const handleAddAllTopRemedies = () => {
    for (const rem of topRemedies) {
      addCustomRemedy(rem);
    }
    toggleReportSection('events_prescriptions');
  };

  return (
    <div className="space-y-6 sm:space-y-7">
      <SectionHeader
        title={locale === 'hi' ? '14 जीवन घटनाएं एवं सूक्ष्म फलादेश' : '14 Life Event Predictions & Scorer'}
        subtitle={
          locale === 'hi'
            ? 'वैदिक अंक ग्रिड, दशा प्रभाव और ग्रह मित्रता के आधार पर 14 प्रमुख जीवन क्षेत्रों का वैज्ञानिक विश्लेषण'
            : 'Scientific scoring of 14 core life dimensions derived from Vedic grid, Dasha alignment, and planetary affinities'
        }
        icon={<CalendarCheck className="w-5 h-5 sm:w-6 sm:h-6" />}
      />

      {isProfileEmpty && <ProfileEmptyBanner locale={locale} />}

      {/* Top Bar: VedicGrid (Profile) + Year Selector + Summary Strip */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Profile Vedic Grid */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <VedicGrid
            dob={profile.dob}
            locale={locale}
            title={locale === 'hi' ? 'व्यक्तिगत वैदिक ग्रिड' : 'Profile Vedic Grid'}
            caption={locale === 'hi' ? 'जीवन घटनाओं के फलादेश का आधार' : 'Matrix basis for event scoring'}
            size="sm"
          />
        </div>

        {/* Year Selector & Strongest/Weakest Summary */}
        <div className="lg:col-span-7 space-y-4">
          {/* Year Picker */}
          <div className="vedic-card p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-bold text-[var(--gold)] uppercase tracking-wider block">
                {locale === 'hi' ? 'विश्लेषण वर्ष चुनें' : 'Analysis Target Year'}
              </span>
              <h3 className="text-base font-bold font-serif text-[var(--heading)]">
                {locale === 'hi' ? `वर्ष ${selectedYear}/${selectedYear + 1} की दशा प्रभाव गणना` : `Target Year ${selectedYear}/${selectedYear + 1} Influence`}
              </h3>
            </div>
            <div>
              <YearSelector
                selectedYear={selectedYear}
                onChange={setSelectedYear}
                birthYear={birthYear}
                locale={locale}
              />
            </div>
          </div>

          {/* Summary Strip (Strongest 3 vs Weakest 3) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Strongest 3 */}
            <div className="vedic-card p-4 space-y-2.5 border-l-4 border-l-[var(--success-text)]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[var(--success-text)] flex items-center gap-1.5 font-serif">
                  <TrendingUp className="w-4 h-4" />
                  {locale === 'hi' ? 'शीर्ष 3 अनुकूल क्षेत्र (Strongest)' : 'Top 3 Strongest Events'}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[var(--success-bg)] text-[var(--success-text)] border border-[var(--success-border)]">
                  High Potency
                </span>
              </div>
              <div className="space-y-1.5">
                {strongest.map((st) => (
                  <div
                    key={`str-${st.event.id}`}
                    className="p-2 rounded-lg bg-[var(--bg)] border border-[var(--border)] flex items-center justify-between text-xs cursor-pointer hover:bg-[var(--chip-bg)]/40 transition-colors"
                    onClick={() => setActiveEventModal(st)}
                  >
                    <span className="font-semibold text-[var(--heading)]">
                      {locale === 'hi' ? st.event.name.hi : st.event.name.en}
                    </span>
                    <span className="font-serif font-bold text-[var(--success-text)]">{st.score}/100</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Weakest 3 */}
            <div className="vedic-card p-4 space-y-2.5 border-l-4 border-l-[var(--warn-text)]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[var(--warn-text)] flex items-center gap-1.5 font-serif">
                  <AlertTriangle className="w-4 h-4" />
                  {locale === 'hi' ? 'उपाय योग्य 3 क्षेत्र (Weakest)' : '3 Weakest / Caution Events'}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[var(--warn-bg)] text-[var(--warn-text)] border border-[var(--warn-border)]">
                  Remedy Advised
                </span>
              </div>
              <div className="space-y-1.5">
                {weakest.map((wk) => (
                  <div
                    key={`wk-${wk.event.id}`}
                    className="p-2 rounded-lg bg-[var(--bg)] border border-[var(--border)] flex items-center justify-between text-xs cursor-pointer hover:bg-[var(--chip-bg)]/40 transition-colors"
                    onClick={() => setActiveEventModal(wk)}
                  >
                    <span className="font-semibold text-[var(--heading)]">
                      {locale === 'hi' ? wk.event.name.hi : wk.event.name.en}
                    </span>
                    <span className="font-serif font-bold text-[var(--warn-text)]">{wk.score}/100</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 14 Event Cards Responsive Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold font-serif text-[var(--heading)] flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[var(--gold)]" />
            {locale === 'hi' ? '14 जीवन क्षेत्रों का संपूर्ण स्कोर' : '14 Life Dimension Forecast Cards'}
          </h3>
          <span className="text-xs text-[var(--text-muted)]">
            {locale === 'hi' ? 'विस्तृत विश्लेषण हेतु कार्ड पर क्लिक करें' : 'Click card to view reasons & remedies'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {scores.map((item) => {
            const isHigh = item.level === 'High';
            const isLow = item.level === 'Low';
            const badgeColor = isHigh
              ? 'bg-[var(--success-bg)] text-[var(--success-text)] border border-[var(--success-border)]'
              : isLow
              ? 'bg-[var(--warn-bg)] text-[var(--warn-text)] border border-[var(--warn-border)]'
              : 'bg-[var(--chip-bg)] text-[var(--gold)] border border-[var(--border)]';

            return (
              <div
                key={item.event.id}
                className="vedic-card p-4 flex flex-col justify-between space-y-3 hover:shadow-md transition-all cursor-pointer group"
                onClick={() => setActiveEventModal(item)}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="p-2 rounded-xl bg-[var(--bg)] border border-[var(--border)]">
                      {EVENT_ICONS[item.event.id] || <Sparkles className="w-5 h-5 text-[var(--gold)]" />}
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badgeColor}`}>
                      {locale === 'hi' ? item.levelHi : item.level} ({item.score}%)
                    </span>
                  </div>

                  <div>
                    <h4 className="font-serif font-bold text-sm text-[var(--heading)] group-hover:text-[var(--gold)] transition-colors">
                      {locale === 'hi' ? item.event.name.hi : item.event.name.en}
                    </h4>
                  </div>

                  <ScoreMeter score={item.score} showLabel={false} size="sm" />

                  {/* 2-line prediction preview */}
                  <p className="text-xs text-[var(--text-muted)] line-clamp-2 leading-relaxed">
                    {locale === 'hi' ? item.prediction.hi : item.prediction.en}
                  </p>
                </div>

                <div className="pt-2 border-t border-[var(--border)] flex items-center justify-between text-xs">
                  <span className="text-[10px] text-[var(--gold)] font-medium">
                    {locale === 'hi' ? 'क्लिक करके विवरण देखें' : 'Click to inspect'}
                  </span>
                  <span className="text-[10px] text-[var(--text-muted)]">
                    {item.reasons.length} {locale === 'hi' ? 'प्रभाव कारक' : 'factors'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Section: Prescription according to results (Weakest 3 auto-aggregated) */}
      <div className="vedic-card p-5 sm:p-6 space-y-4 border-t-4 border-t-[var(--gold)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[var(--border)]">
          <div>
            <h3 className="text-base sm:text-lg font-bold font-serif text-[var(--heading)] flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[var(--gold)]" />
              {locale === 'hi' ? 'परिणामों के आधार पर एकीकृत वैदिक उपाय' : 'Prescription According to Results'}
            </h3>
            <p className="text-xs text-[var(--text-muted)]">
              {locale === 'hi'
                ? 'न्यूनतम स्कोर वाले 3 क्षेत्रों से एकत्रित, विशिष्ट व प्रभावी उपाय (Deduplicated)'
                : 'Auto-aggregated top remedies derived from your weakest 3 life dimensions'}
            </p>
          </div>

          <button
            type="button"
            onClick={handleAddAllTopRemedies}
            className="btn-gold-gradient px-4 py-2 rounded-xl text-xs font-bold text-white shadow-xs hover:shadow transition-all flex items-center gap-1.5 cursor-pointer w-fit"
          >
            <PlusCircle className="w-4 h-4" />
            {reportSections?.['events_prescriptions']
              ? locale === 'hi'
                ? '✓ रिपोर्ट में जोड़ दिया गया'
                : '✓ Added to Report'
              : locale === 'hi'
              ? 'सभी उपाय रिपोर्ट में जोड़ें'
              : 'Add All to Report'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {topRemedies.map((remedy, idx) => (
            <Link
              key={`rem-${idx}`}
              href={`/${locale}/remedies`}
              className="p-3.5 rounded-2xl bg-[var(--bg)] border border-[var(--border)] hover:border-[var(--gold)] hover:-translate-y-0.5 transition-all flex items-start gap-2.5 text-xs group cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-[var(--gold)]/40"
            >
              <span className="w-5 h-5 rounded-full bg-[var(--chip-bg)] text-[var(--gold)] font-bold flex items-center justify-center shrink-0 text-[11px]">
                {idx + 1}
              </span>
              <div className="space-y-1.5 flex-1">
                <span className="font-semibold text-[var(--heading)] block group-hover:text-[var(--gold)] transition-colors">{remedy}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* DETAIL DRAWER / MODAL */}
      <Modal
        isOpen={!!activeEventModal}
        onClose={() => setActiveEventModal(null)}
        title={
          activeEventModal ? (
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[var(--chip-bg)] text-[var(--gold)] border border-[var(--border)] flex items-center justify-center shrink-0">
                {EVENT_ICONS[activeEventModal.event.id] || <Sparkles className="w-4 h-4 text-[var(--gold)]" />}
              </div>
              <div className="min-w-0">
                <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--gold)]">
                  {locale === 'hi' ? `इवेंट विवरण • वर्ष ${selectedYear}` : `Event Detail • Year ${selectedYear}`}
                </div>
                <h3 className="text-base sm:text-lg font-bold font-serif text-[var(--heading)] truncate">
                  {locale === 'hi' ? activeEventModal.event.name.hi : activeEventModal.event.name.en}
                </h3>
              </div>
            </div>
          ) : undefined
        }
        footer={
          activeEventModal ? (
            <div className="flex items-center justify-between w-full gap-2">
              <button
                type="button"
                onClick={() => {
                  for (const p of activeEventModal.prescriptions) {
                    addCustomRemedy(p);
                  }
                  toggleReportSection(`event_${activeEventModal.event.id}`);
                }}
                className="text-xs font-bold text-[var(--gold)] hover:underline inline-flex items-center gap-1.5 cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                {reportSections?.[`event_${activeEventModal.event.id}`]
                  ? locale === 'hi'
                    ? '✓ रिपोर्ट में जोड़ा गया'
                    : '✓ Added to Report'
                  : locale === 'hi'
                  ? 'रिपोर्ट में जोड़ें'
                  : 'Add to Report'}
              </button>
              <button
                type="button"
                onClick={() => setActiveEventModal(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-[var(--surface)] text-[var(--heading)] border border-[var(--border)] hover:bg-[var(--chip-bg)] transition-colors cursor-pointer"
              >
                {locale === 'hi' ? 'बंद करें' : 'Close'}
              </button>
            </div>
          ) : undefined
        }
      >
        {activeEventModal && (
          <div className="space-y-4 text-xs">
            {/* Score Banner */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-[var(--bg)] border border-[var(--border)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[11px] text-[var(--text-muted)] block font-medium">
                  {locale === 'hi' ? 'गणना स्तर एवं स्कोर' : 'Computed Score & Dimension Level'}
                </span>
                <div className="text-lg sm:text-xl font-serif font-bold text-[var(--heading)] flex items-center gap-2">
                  <span>{activeEventModal.score} / 100</span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[var(--chip-bg)] text-[var(--gold)] border border-[var(--border)]">
                    {locale === 'hi' ? activeEventModal.levelHi : activeEventModal.level}
                  </span>
                </div>
              </div>
              <div className="w-full sm:w-56">
                <ScoreMeter score={activeEventModal.score} showLabel={false} />
              </div>
            </div>

            {/* Grid with highlighted Support (Gold) and Hurdle (Red) digits */}
            <div className="space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-1.5">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-[var(--gold)] font-serif">
                  {locale === 'hi' ? 'सक्रिय अंक ग्रिड (सहायक = स्वर्ण, बाधक = लाल)' : 'Vedic Grid Analysis'}
                </h4>
                <div className="flex flex-wrap items-center gap-2.5 text-[10px] text-[var(--text-muted)]">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-[var(--gold)]" /> Support ({activeEventModal.event.supportDigits.join(', ')})
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-[var(--warn-text)]" /> Hurdle ({activeEventModal.event.hurdleDigits.join(', ') || 'None'})
                  </span>
                </div>
              </div>

              <div className="flex justify-center py-1">
                <VedicGrid
                  dob={profile.dob}
                  size="sm"
                  locale={locale}
                  hideControls={true}
                  hideStats={true}
                  digitHighlights={(() => {
                    const map: Record<number, 'support' | 'hurdle'> = {};
                    activeEventModal.event.supportDigits.forEach((d) => (map[d] = 'support'));
                    activeEventModal.event.hurdleDigits.forEach((d) => (map[d] = 'hurdle'));
                    return map;
                  })()}
                />
              </div>
            </div>

            {/* Full Prediction Text */}
            <div className="space-y-1.5 p-3.5 sm:p-4 rounded-2xl bg-[var(--chip-bg)]/30 border border-[var(--border)]">
              <h4 className="text-[11px] font-bold text-[var(--heading)] font-serif uppercase tracking-wider">
                {locale === 'hi' ? 'सूक्ष्म फलादेश' : 'Detailed Reading & Prediction'}
              </h4>
              <p className="text-xs sm:text-[13px] text-[var(--text)] leading-relaxed">
                {locale === 'hi' ? activeEventModal.prediction.hi : activeEventModal.prediction.en}
              </p>
            </div>

            {/* "Why this score" Expandable List of Reasons */}
            <div className="space-y-2 border border-[var(--border)] rounded-2xl p-3.5 bg-[var(--bg)]">
              <button
                type="button"
                onClick={() => setShowReasonsAccordion(!showReasonsAccordion)}
                className="w-full flex items-center justify-between text-xs font-bold font-serif text-[var(--heading)] cursor-pointer"
              >
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[var(--gold)]" />
                  {locale === 'hi' ? 'यह स्कोर क्यों मिला? (Why this score)' : 'Why this score? (Point Breakdown)'}
                </span>
                {showReasonsAccordion ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>

              {showReasonsAccordion && (
                <div className="pt-2 space-y-1.5 border-t border-[var(--border)]">
                  {activeEventModal.reasons.map((reason, idx) => (
                    <div
                      key={`rs-${idx}`}
                      className="text-xs text-[var(--text-muted)] flex items-start gap-2"
                    >
                      <span className="text-[var(--gold)] font-bold shrink-0">•</span>
                      <span>{reason}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Prescriptions List */}
            <div className="space-y-2">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-[var(--gold)] font-serif">
                {locale === 'hi' ? 'अनुशंसित वैदिक उपाय' : 'Prescribed Remedial Actions'}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {activeEventModal.prescriptions.map((pres, idx) => (
                  <div
                    key={`pres-${idx}`}
                    className="p-2.5 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-xs flex items-start gap-2"
                  >
                    <span className="text-[var(--gold)] font-bold shrink-0">✓</span>
                    <span className="text-[var(--heading)]">{pres}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 10-Year Projections Timeline */}
            <div className="space-y-2 p-3.5 rounded-2xl bg-[var(--bg)] border border-[var(--border)]">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-[var(--heading)] font-serif">
                {locale === 'hi' ? 'आगामी 10 वर्षों का चक्र' : 'Next 10-Year Cycle Timeline'}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-[11px] font-semibold text-[var(--success-text)] block mb-1">
                    {locale === 'hi' ? 'अनुकूल वर्ष:' : 'Favourable Years:'}
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {activeEventModal.favourableYears.length > 0 ? (
                      activeEventModal.favourableYears.map((yr) => (
                        <span
                          key={`fav-${yr}`}
                          className="px-2 py-0.5 rounded-md bg-[var(--success-bg)] text-[var(--success-text)] border border-[var(--success-border)] text-xs font-bold font-serif"
                        >
                          {yr}
                        </span>
                      ))
                    ) : (
                      <span className="text-[var(--text-muted)] text-[11px]">Consistent steady efforts required</span>
                    )}
                  </div>
                </div>

                <div>
                  <span className="text-[11px] font-semibold text-[var(--warn-text)] block mb-1">
                    {locale === 'hi' ? 'सावधानी के वर्ष:' : 'Caution Periods:'}
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {activeEventModal.cautionPeriods.length > 0 ? (
                      activeEventModal.cautionPeriods.map((cp) => (
                        <span
                          key={`caut-${cp}`}
                          className="px-2 py-0.5 rounded-md bg-[var(--warn-bg)] text-[var(--warn-text)] border border-[var(--warn-border)] text-xs font-bold font-serif"
                        >
                          {cp}
                        </span>
                      ))
                    ) : (
                      <span className="text-[var(--success-text)] text-[11px]">Clear skies, no adverse hurdle cycles</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Special Event 4: Year Before Birth Details */}
            {activeEventModal.event.id === 'year_before_birth' && (
              <div className="p-3.5 rounded-2xl bg-[var(--chip-bg)]/40 border border-[var(--border)] space-y-1.5">
                <h4 className="text-[11px] font-bold text-[var(--gold)] font-serif uppercase tracking-wider">
                  {locale === 'hi' ? `पूर्वजन्म वर्ष ${karmicReading.karmicYear} का कर्म-विश्लेषण` : `Pre-Birth Karma Reading (${karmicReading.karmicYear})`}
                </h4>
                <p className="text-xs text-[var(--heading)] leading-relaxed">
                  {locale === 'hi' ? karmicReading.readingHi : karmicReading.readingEn}
                </p>
              </div>
            )}

            {/* Special Event 12: Love vs Arranged Marriage Meters */}
            {activeEventModal.event.id === 'marriage_love' && (
              <div className="p-3.5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] space-y-3">
                <h4 className="text-[11px] font-bold text-[var(--gold)] font-serif uppercase tracking-wider">
                  {locale === 'hi' ? 'प्रेम विवाह बनाम पारंपरिक विवाह अनुपात' : 'Love vs Arranged Marriage Comparison'}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span>{locale === 'hi' ? 'प्रेम विवाह' : 'Love Marriage'}</span>
                      <span className="text-[var(--gold)]">{loveMarriageReading.lovePct}%</span>
                    </div>
                    <ScoreMeter score={loveMarriageReading.lovePct} showLabel={false} />
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span>{locale === 'hi' ? 'पारंपरिक विवाह' : 'Arranged Marriage'}</span>
                      <span className="text-[var(--gold-deep)]">{loveMarriageReading.arrangedPct}%</span>
                    </div>
                    <ScoreMeter score={loveMarriageReading.arrangedPct} showLabel={false} />
                  </div>
                </div>
                <p className="text-xs text-[var(--text-muted)]">
                  {locale === 'hi' ? loveMarriageReading.verdictHi : loveMarriageReading.verdictEn}
                </p>
              </div>
            )}

            {/* Special Event 8: Comprehensive 0-90 Life Timeline */}
            {activeEventModal.event.id === 'all_events_by_dob' && (
              <div className="p-3.5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] space-y-2.5">
                <h4 className="text-[11px] font-bold text-[var(--gold)] font-serif uppercase tracking-wider">
                  {locale === 'hi' ? 'आयु-वार जीवन समयरेखा (0-90 वर्ष)' : 'Age-Wise Life Timeline (0-90 Years)'}
                </h4>
                <div className="flex gap-2 overflow-x-auto pb-2 max-w-full">
                  {lifeTimeline.map((item) => (
                    <div
                      key={`age-${item.age}`}
                      className="min-w-[120px] p-2 rounded-xl bg-[var(--bg)] border border-[var(--border)] text-xs space-y-1 shrink-0"
                    >
                      <span className="text-[10px] font-bold text-[var(--gold)] block">
                        Age {item.age} ({item.calendarYear})
                      </span>
                      <span className="font-bold font-serif text-[var(--heading)] block text-[11px] truncate">
                        {locale === 'hi' ? item.labelHi : item.labelEn}
                      </span>
                      <span className="text-[10px] text-[var(--text-muted)] block">
                        Dasha #{item.dashaNumber}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Special Event 9: Word Number Impact */}
            {activeEventModal.event.id === 'word_number' && (
              <div className="p-3.5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-[11px] font-bold text-[var(--gold)] font-serif uppercase tracking-wider">
                    {locale === 'hi' ? 'अंक 1-9 का चयन करें' : 'Pick a Number (1 to 9)'}
                  </h4>
                  <span className="text-xs font-semibold text-[var(--heading)] font-serif">
                    Selected: #{pickedWordNumber}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                    <button
                      key={`num-${num}`}
                      type="button"
                      onClick={() => setPickedWordNumber(num)}
                      className={`w-8 h-8 rounded-full font-serif font-bold text-xs border transition-all cursor-pointer ${
                        pickedWordNumber === num
                          ? 'bg-[var(--gold)] text-white border-[var(--gold-deep)] shadow-xs'
                          : 'bg-[var(--bg)] text-[var(--text-muted)] border-[var(--border)] hover:bg-[var(--chip-bg)]'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
                <div className="p-3 rounded-xl bg-[var(--chip-bg)]/40 border border-[var(--border)] text-xs space-y-1">
                  <span className="font-bold text-[var(--heading)] block">
                    {locale === 'hi' ? wordImpact.name.hi : wordImpact.name.en}
                  </span>
                  <p className="text-[var(--text-muted)] leading-relaxed">
                    {locale === 'hi' ? wordImpact.adviceHi : wordImpact.adviceEn}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
