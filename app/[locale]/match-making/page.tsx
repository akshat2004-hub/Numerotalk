'use client';

import React, { useState, useRef, useMemo } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { 
  HeartHandshake, 
  Sparkles, 
  Download, 
  Heart, 
  Users, 
  CheckCircle2, 
  Loader2,
  Calendar,
  Layers,
  ArrowRightLeft,
  ShieldCheck,
  Check,
  Plus,
  AlertTriangle,
  Flame,
  Award
} from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { SectionHeader } from '@/frontend/components/ui/SectionHeader';
import { CircularScoreMeter } from '@/frontend/components/ui/CircularScoreMeter';
import { VedicGrid } from '@/frontend/components/VedicGrid';
import { RemedyChip } from '@/frontend/components/ui/RemedyChip';
import { Input } from '@/frontend/components/ui/Input';
import { DateInput } from '@/frontend/components/ui/DateInput';
import { useNumerologyStore } from '@/frontend/store/useNumerologyStore';
import { matchScore, MatchScoreResult, MatchPillar } from '@/core/engine/compatibility';

export default function MatchMakingPage() {
  const t = useTranslations('matchMakingPage');
  const tc = useTranslations('common');
  const locale = (useLocale() || 'en') as 'en' | 'hi';
  const { reportSections, toggleReportSection } = useNumerologyStore();

  const [boyName, setBoyName] = useState('Rahul Sharma');
  const [boyDob, setBoyDob] = useState('1995-10-23');
  const [girlName, setGirlName] = useState('Pooja Verma');
  const [girlDob, setGirlDob] = useState('1997-06-15');

  const [isExporting, setIsExporting] = useState(false);
  const pdfRef = useRef<HTMLDivElement>(null);

  // Memoize comprehensive match score calculation
  const matchResult: MatchScoreResult = useMemo(
    () => matchScore(
      { name: boyName.trim() || 'Boy', dob: boyDob || '1995-01-01' },
      { name: girlName.trim() || 'Girl', dob: girlDob || '1995-01-01' }
    ),
    [boyName, boyDob, girlName, girlDob]
  );

  const handleExportPdf = async () => {
    if (!pdfRef.current || isExporting) return;
    setIsExporting(true);
    try {
      const element = pdfRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: null,
        logging: false,
        windowWidth: 1200
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      const cleanBoy = (boyName || 'Boy').replace(/[^a-zA-Z0-9]/g, '_');
      const cleanGirl = (girlName || 'Girl').replace(/[^a-zA-Z0-9]/g, '_');
      pdf.save(`NumeroTalk_Match_Report_${cleanBoy}_and_${cleanGirl}.pdf`);
    } catch (err) {
      console.error('PDF export failed', err);
    } finally {
      setIsExporting(false);
    }
  };

  const getRelationBadge = (relation: 'friendly' | 'enemy' | 'neutral') => {
    if (relation === 'friendly') {
      return {
        bg: 'bg-[var(--success-bg)] text-[var(--success-text)] border-[var(--success-border)]',
        label: locale === 'hi' ? 'मित्रवत (Friendly)' : 'Friendly'
      };
    }
    if (relation === 'enemy') {
      return {
        bg: 'bg-[var(--warn-bg)] text-[var(--warn-text)] border-[var(--warn-border)]',
        label: locale === 'hi' ? 'शत्रु / विरोधी (Enemy)' : 'Enemy / Friction'
      };
    }
    return {
      bg: 'bg-[var(--neutral-bg)] text-[var(--neutral-text)] border-[var(--neutral-border)]',
      label: locale === 'hi' ? 'सामान्य (Neutral)' : 'Neutral'
    };
  };

  const todayStr = useMemo(() => new Date().toLocaleDateString(locale === 'hi' ? 'hi-IN' : 'en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }), [locale]);

  return (
    <div className="space-y-6 sm:space-y-7">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <SectionHeader
          title={locale === 'hi' ? 'वैदिक गुण मिलान एवं संबंध विश्लेषण' : 'Vedic Compatibility & Match Making'}
          subtitle={
            locale === 'hi'
              ? 'मूलांक, भाग्यांक, नामांक और वैदिक ग्रिड के 5 प्रमुख स्तंभों पर आधारित 100 अंकों का वैज्ञानिक विश्लेषण'
              : 'Scientific 100-point compatibility evaluation across 5 Vedic pillars: Driver, Life Path, Destiny, Exchangeable, and Common energies.'
          }
          icon={<HeartHandshake className="w-5 h-5 stroke-[1.5]" />}
          className="mb-0"
        />

        {/* Quick Top Export Button: md = 44px, 15px text */}
        <button
          type="button"
          onClick={handleExportPdf}
          disabled={isExporting}
          className="btn-gold-gradient h-[44px] px-5 text-[15px] font-semibold flex items-center gap-2 shrink-0 disabled:opacity-50 cursor-pointer rounded-[12px] shadow-[0_4px_12px_rgba(201,131,16,0.25)] transition-all hover:scale-[1.01] active:scale-[0.99]"
        >
          {isExporting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Download className="w-4 h-4 stroke-[2]" />
          )}
          <span>
            {isExporting 
              ? (locale === 'hi' ? 'पीडीएफ तैयार हो रहा है...' : 'Generating PDF...') 
              : (locale === 'hi' ? 'मैच रिपोर्ट डाउनलोड (PDF)' : 'Export Match Report (PDF)')}
          </span>
        </button>
      </div>

      {/* Partner Input Form Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Partner 1 (Boy) */}
        <div className="vedic-card p-4 sm:p-5 space-y-3.5 border-t-2 border-t-[var(--gold)]">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold font-serif text-[var(--heading)] flex items-center gap-2">
              <Users className="w-4 h-4 text-[var(--gold)]" />
              <span>{locale === 'hi' ? 'साथी 1 का विवरण' : 'Partner 1 Details'}</span>
            </h3>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-[var(--chip-bg)] text-[var(--gold)] border border-[var(--border)]">
              Partner 1
            </span>
          </div>

          <div className="space-y-3">
            <div>
              <Input
                label={locale === 'hi' ? 'पूरा नाम' : 'Full Name'}
                value={boyName}
                onChange={(e) => setBoyName(e.target.value)}
                placeholder="Rahul Sharma"
              />
              <span className="text-[11px] text-[var(--text-muted)] block mt-1">
                {locale === 'hi' ? 'नामांक गणना हेतु प्रयुक्त' : 'Used for Destiny number'}
              </span>
            </div>
            <div>
              <DateInput
                label={locale === 'hi' ? 'जन्म तिथि' : 'Date of Birth'}
                value={boyDob}
                onChange={(iso) => setBoyDob(iso)}
              />
            </div>
          </div>

          {/* Profile Header Chips: 3 badges with lining numerals */}
          <div className="flex flex-wrap items-center justify-between pt-2 border-t border-[var(--border)] text-xs gap-2">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-[var(--text-muted)]">
                {locale === 'hi' ? 'ड्राइवर (मूलांक):' : 'Driver (Mulank):'}
              </span>
              <span className="w-6 h-6 rounded-full bg-[var(--chip-bg)] text-[var(--gold)] font-serif font-bold text-xs flex items-center justify-center border border-[var(--border)] tabular-nums lining-nums">
                {matchResult.boy.mulank}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-[var(--text-muted)]">
                {locale === 'hi' ? 'कंडक्टर (भाग्यांक):' : 'Conductor (Bhagyank):'}
              </span>
              <span className="w-6 h-6 rounded-full bg-[var(--chip-bg)] text-[var(--gold)] font-serif font-bold text-xs flex items-center justify-center border border-[var(--border)] tabular-nums lining-nums">
                {matchResult.boy.bhagyank}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-[var(--text-muted)]">
                {locale === 'hi' ? 'डेस्टिनी (नामांक):' : 'Destiny (Namank):'}
              </span>
              <span className="w-6 h-6 rounded-full bg-[var(--chip-bg)] text-[var(--gold)] font-serif font-bold text-xs flex items-center justify-center border border-[var(--border)] tabular-nums lining-nums">
                {matchResult.boy.destinyNumber}
              </span>
            </div>
          </div>
        </div>

        {/* Partner 2 (Girl) */}
        <div className="vedic-card p-4 sm:p-5 space-y-3.5 border-t-2 border-t-[var(--gold)]">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold font-serif text-[var(--heading)] flex items-center gap-2">
              <Heart className="w-4 h-4 text-[var(--gold)]" />
              <span>{locale === 'hi' ? 'साथी 2 का विवरण' : 'Partner 2 Details'}</span>
            </h3>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-[var(--chip-bg)] text-[var(--gold-deep)] border border-[var(--gold)]">
              Partner 2
            </span>
          </div>

          <div className="space-y-3">
            <div>
              <Input
                label={locale === 'hi' ? 'पूरा नाम' : 'Full Name'}
                value={girlName}
                onChange={(e) => setGirlName(e.target.value)}
                placeholder="Pooja Verma"
              />
              <span className="text-[11px] text-[var(--text-muted)] block mt-1">
                {locale === 'hi' ? 'नामांक गणना हेतु प्रयुक्त' : 'Used for Destiny number'}
              </span>
            </div>
            <div>
              <DateInput
                label={locale === 'hi' ? 'जन्म तिथि' : 'Date of Birth'}
                value={girlDob}
                onChange={(iso) => setGirlDob(iso)}
              />
            </div>
          </div>

          {/* Profile Header Chips: 3 badges with lining numerals */}
          <div className="flex flex-wrap items-center justify-between pt-2 border-t border-[var(--border)] text-xs gap-2">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-[var(--text-muted)]">
                {locale === 'hi' ? 'ड्राइवर (मूलांक):' : 'Driver (Mulank):'}
              </span>
              <span className="w-6 h-6 rounded-full bg-[var(--chip-bg)] text-[var(--gold-deep)] font-serif font-bold text-xs flex items-center justify-center border border-[var(--gold)] tabular-nums lining-nums">
                {matchResult.girl.mulank}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-[var(--text-muted)]">
                {locale === 'hi' ? 'कंडक्टर (भाग्यांक):' : 'Conductor (Bhagyank):'}
              </span>
              <span className="w-6 h-6 rounded-full bg-[var(--chip-bg)] text-[var(--gold-deep)] font-serif font-bold text-xs flex items-center justify-center border border-[var(--gold)] tabular-nums lining-nums">
                {matchResult.girl.bhagyank}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-[var(--text-muted)]">
                {locale === 'hi' ? 'डेस्टिनी (नामांक):' : 'Destiny (Namank):'}
              </span>
              <span className="w-6 h-6 rounded-full bg-[var(--chip-bg)] text-[var(--gold-deep)] font-serif font-bold text-xs flex items-center justify-center border border-[var(--gold)] tabular-nums lining-nums">
                {matchResult.girl.destinyNumber}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION: Compatibility Pillars (Total 100 points, 2-column grid on desktop) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-bold font-serif text-[var(--heading)] flex items-center gap-2">
              <Layers className="w-5 h-5 text-[var(--gold)]" />
              <span>{locale === 'hi' ? 'अनुकूलता के 5 स्तंभ' : 'Compatibility Pillars'}</span>
            </h2>
            <p className="text-xs text-[var(--text-muted)]">
              {locale === 'hi'
                ? 'वैदिक अंकशास्त्र के 5 स्वतंत्र आयामों पर आधारित विस्तृत मूल्यांकन (प्रत्येक 20 अंक, कुल 100 अंक)'
                : 'Evaluated across 5 foundational Vedic dimensions (20 points each, 100 total)'}
            </p>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-[var(--chip-bg)] text-[var(--gold)] border border-[var(--border)] tabular-nums lining-nums">
            Score: {matchResult.total}/100
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {matchResult.pillars.map((pillar) => {
            const relBadge = getRelationBadge(pillar.relation);
            const reportKey = `match_pillar_${pillar.id}`;
            const isAdded = !!reportSections[reportKey];

            return (
              <div
                key={pillar.id}
                className="vedic-card p-4 sm:p-5 space-y-4 flex flex-col justify-between border-t-2 border-t-[var(--gold)]"
              >
                {/* 1. Header: title + relation badge + score x/20 */}
                <div className="flex items-start justify-between gap-3 pb-3 border-b border-[var(--border)]">
                  <div>
                    <h3 className="font-serif font-bold text-sm sm:text-base text-[var(--heading)]">
                      {locale === 'hi' ? pillar.titleHi : pillar.titleEn}
                    </h3>
                    <span className="text-[10px] text-[var(--text-muted)] block mt-0.5">
                      Pillar Weight: 20 Points
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${relBadge.bg}`}>
                      {relBadge.label}
                    </span>
                    <span className="font-serif font-bold text-sm sm:text-base text-[var(--gold)] tabular-nums lining-nums">
                      {pillar.score}/20
                    </span>
                  </div>
                </div>

                {/* 2. Number strip: Boy's number ⇄ Girl's number with names */}
                <div className="p-3 rounded-xl bg-[var(--bg)] border border-[var(--border)] flex items-center justify-around text-center">
                  <div className="flex-1">
                    <span className="text-[11px] text-[var(--text-muted)] block truncate max-w-[130px] mx-auto">
                      {boyName || 'Partner 1'}
                    </span>
                    <span className="font-serif font-bold text-xl sm:text-2xl text-[var(--heading)] tabular-nums lining-nums">
                      {pillar.boyNumber}
                    </span>
                  </div>

                  <ArrowRightLeft className="w-4 h-4 text-[var(--gold)] shrink-0 mx-2" />

                  <div className="flex-1">
                    <span className="text-[11px] text-[var(--text-muted)] block truncate max-w-[130px] mx-auto">
                      {girlName || 'Partner 2'}
                    </span>
                    <span className="font-serif font-bold text-xl sm:text-2xl text-[var(--heading)] tabular-nums lining-nums">
                      {pillar.girlNumber}
                    </span>
                  </div>
                </div>

                {/* 3. Mini grids side by side with highlighted cells */}
                {pillar.id === 'exchangeable' ? (
                  /* For Exchangeable card: show two exchanges */
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-[var(--gold)] uppercase tracking-wider block">
                      {locale === 'hi' ? 'दोहरा ऊर्जा विनिमय (Dual Energy Cross)' : 'Dual Energy Cross Exchange'}
                    </span>
                    <div className="grid grid-cols-2 gap-3 p-2.5 rounded-xl bg-[var(--surface)] border border-[var(--border)]">
                      <div className="text-center space-y-1">
                        <span className="text-[10px] text-[var(--text-muted)] block">
                          Boy Mulank ({matchResult.boy.mulank}) × Girl Bhagyank ({matchResult.girl.bhagyank})
                        </span>
                        <div className="flex justify-center">
                          <VedicGrid
                            dob={boyDob}
                            size="sm"
                            hideControls={true}
                            hideStats={true}
                            digitHighlights={{ [matchResult.boy.mulank]: 'support' }}
                          />
                        </div>
                      </div>
                      <div className="text-center space-y-1">
                        <span className="text-[10px] text-[var(--text-muted)] block">
                          Girl Mulank ({matchResult.girl.mulank}) × Boy Bhagyank ({matchResult.boy.bhagyank})
                        </span>
                        <div className="flex justify-center">
                          <VedicGrid
                            dob={girlDob}
                            size="sm"
                            hideControls={true}
                            hideStats={true}
                            digitHighlights={{ [matchResult.girl.mulank]: 'support' }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ) : pillar.id === 'common' ? (
                  /* For Common numbers: show common digits highlighted gold, faded rest */
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-[var(--gold)] uppercase tracking-wider block">
                      {locale === 'hi' ? 'समान सक्रिय ऊर्जा तल (Common Resonance)' : 'Common Vedic Resonance'}
                    </span>
                    <div className="grid grid-cols-2 gap-3 p-2.5 rounded-xl bg-[var(--surface)] border border-[var(--border)]">
                      <div className="text-center space-y-1">
                        <span className="text-[10px] text-[var(--text-muted)] block truncate">
                          {boyName || 'Partner 1'} ({matchResult.common.commonNumbers.length} Common)
                        </span>
                        <div className="flex justify-center">
                          <VedicGrid
                            dob={boyDob}
                            size="sm"
                            hideControls={true}
                            hideStats={true}
                            digitHighlights={matchResult.common.commonNumbers.reduce((acc, num) => ({ ...acc, [num]: 'support' }), {})}
                          />
                        </div>
                      </div>
                      <div className="text-center space-y-1">
                        <span className="text-[10px] text-[var(--text-muted)] block truncate">
                          {girlName || 'Partner 2'} ({matchResult.common.commonNumbers.length} Common)
                        </span>
                        <div className="flex justify-center">
                          <VedicGrid
                            dob={girlDob}
                            size="sm"
                            hideControls={true}
                            hideStats={true}
                            digitHighlights={matchResult.common.commonNumbers.reduce((acc, num) => ({ ...acc, [num]: 'support' }), {})}
                          />
                        </div>
                      </div>
                    </div>
                    {matchResult.missingInBoth.length > 0 && (
                      <div className="pt-1 flex flex-wrap items-center gap-1.5 text-[11px]">
                        <span className="text-[var(--warn-text)] font-medium">
                          {locale === 'hi' ? 'दोनों में अनुपस्थित अंक:' : 'Missing in Both:'}
                        </span>
                        {matchResult.missingInBoth.map((mNum) => (
                          <span
                            key={mNum}
                            className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[var(--warn-bg)] text-[var(--warn-text)] border border-[var(--warn-border)]"
                          >
                            Number {mNum}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  /* Standard 2 Mini grids side by side */
                  <div className="grid grid-cols-2 gap-3 p-2.5 rounded-xl bg-[var(--surface)] border border-[var(--border)]">
                    <div className="text-center space-y-1">
                      <span className="text-[10px] text-[var(--text-muted)] block truncate">
                        {boyName || 'Partner 1'} ({pillar.boyNumber})
                      </span>
                      <div className="flex justify-center">
                        <VedicGrid
                          dob={boyDob}
                          size="sm"
                          hideControls={true}
                          hideStats={true}
                          digitHighlights={{ [pillar.boyNumber]: 'support' }}
                        />
                      </div>
                      <span className="text-[9.5px] text-[var(--text-muted)] block">
                        Highlighted: {pillar.boyNumber}
                      </span>
                    </div>

                    <div className="text-center space-y-1">
                      <span className="text-[10px] text-[var(--text-muted)] block truncate">
                        {girlName || 'Partner 2'} ({pillar.girlNumber})
                      </span>
                      <div className="flex justify-center">
                        <VedicGrid
                          dob={girlDob}
                          size="sm"
                          hideControls={true}
                          hideStats={true}
                          digitHighlights={{ [pillar.girlNumber]: 'support' }}
                        />
                      </div>
                      <span className="text-[9.5px] text-[var(--text-muted)] block">
                        Highlighted: {pillar.girlNumber}
                      </span>
                    </div>
                  </div>
                )}

                {/* 4. CONCLUSION block (detailed) */}
                <div className="p-3.5 rounded-xl bg-[var(--bg)] border border-[var(--border)] space-y-2 text-xs">
                  {/* Verdict */}
                  <div>
                    <span className="text-[10px] font-bold text-[var(--gold)] uppercase tracking-wider block">
                      {locale === 'hi' ? 'निर्णय (Verdict)' : 'Verdict'}
                    </span>
                    <p className="font-semibold text-[var(--heading)] leading-snug">
                      {locale === 'hi' ? pillar.conclusion.verdict.hi : pillar.conclusion.verdict.en}
                    </p>
                  </div>

                  {/* What it means */}
                  <p className="text-[var(--text)] leading-relaxed text-[11.5px]">
                    {locale === 'hi' ? pillar.conclusion.meaning.hi : pillar.conclusion.meaning.en}
                  </p>

                  {/* Strengths & Watch Out Bullets */}
                  <div className="pt-2 border-t border-[var(--border)] grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                    <div className="space-y-1">
                      <span className="font-bold text-[var(--success-text)] flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        {locale === 'hi' ? 'सकारात्मक पक्ष' : 'Strengths'}
                      </span>
                      <ul className="space-y-0.5 text-[var(--text)]">
                        {(locale === 'hi' ? pillar.conclusion.strengths.hi : pillar.conclusion.strengths.en).map((str, idx) => (
                          <li key={idx} className="leading-tight">• {str}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-1">
                      <span className="font-bold text-[var(--warn-text)] flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        {locale === 'hi' ? 'सावधानी व सुझाव' : 'Watch Out'}
                      </span>
                      <ul className="space-y-0.5 text-[var(--text-muted)]">
                        {(locale === 'hi' ? pillar.conclusion.watchOut.hi : pillar.conclusion.watchOut.en).map((wo, idx) => (
                          <li key={idx} className="leading-tight">• {wo}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* 5. Add to report button */}
                <div className="pt-2 border-t border-[var(--border)] flex justify-end">
                  <button
                    type="button"
                    onClick={() => toggleReportSection(reportKey)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      isAdded
                        ? 'bg-[var(--success-bg)] text-[var(--success-text)] border border-[var(--success-border)]'
                        : 'bg-[var(--surface)] text-[var(--gold)] hover:bg-[var(--chip-bg)] border border-[var(--border)]'
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-[var(--success-text)]" />
                        <span>{locale === 'hi' ? 'रिपोर्ट में शामिल' : 'In Report'}</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5 text-[var(--gold)]" />
                        <span>{locale === 'hi' ? 'रिपोर्ट में जोड़ें' : 'Add to report'}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* OVERALL CONCLUSION CARD (Score gauge / 100, tier, summary, top 3 strengths, top 3 cautions, remedies) */}
      <div className="vedic-card p-5 sm:p-6 space-y-5 border-t-4 border-t-[var(--gold)]">
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-5 pb-4 border-b border-[var(--border)]">
          <div className="space-y-1.5 flex-1">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-[var(--gold)]" />
              <span className="text-xs font-bold text-[var(--gold)] uppercase tracking-wider">
                {locale === 'hi' ? 'समग्र वैदिक मिलान निष्कर्ष' : 'Overall Match Verdict'}
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-serif text-[var(--heading)]">
              {locale === 'hi' ? matchResult.tierHi : matchResult.tier} ({matchResult.total}/100)
            </h3>
            <p className="text-xs sm:text-sm text-[var(--text)] leading-relaxed max-w-2xl">
              {locale === 'hi' ? matchResult.summaryHi : matchResult.summaryEn}
            </p>
          </div>

          <div className="shrink-0 flex flex-col items-center">
            <CircularScoreMeter
              score={matchResult.total}
              size={110}
              label={locale === 'hi' ? 'अनुकूलता' : 'Compatibility'}
            />
            <span className="text-[11px] font-bold text-[var(--gold)] mt-1.5">
              Tier: {matchResult.tier}
            </span>
          </div>
        </div>

        {/* Top 3 Strengths & Top 3 Cautions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)] space-y-2">
            <span className="text-xs font-bold text-[var(--success-text)] flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[var(--success-text)]" />
              {locale === 'hi' ? 'शीर्ष 3 सकारात्मक शक्तियां' : 'Top 3 Relationship Strengths'}
            </span>
            <ul className="space-y-1.5 text-xs text-[var(--text)]">
              {(locale === 'hi' ? matchResult.topStrengthsHi : matchResult.topStrengthsEn).map((str, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-[var(--success-text)] font-bold">✓</span>
                  <span>{str}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)] space-y-2">
            <span className="text-xs font-bold text-[var(--warn-text)] flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-[var(--warn-text)]" />
              {locale === 'hi' ? 'शीर्ष 3 सावधानी के बिंदु' : 'Top 3 Planetary Cautions'}
            </span>
            <ul className="space-y-1.5 text-xs text-[var(--text)]">
              {(locale === 'hi' ? matchResult.topCautionsHi : matchResult.topCautionsEn).map((caut, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-[var(--warn-text)] font-bold">!</span>
                  <span>{caut}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Recommended Remedies */}
        <div className="space-y-2 pt-2 border-t border-[var(--border)]">
          <span className="text-xs font-bold text-[var(--gold)] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            {locale === 'hi' ? 'अनुशंसित वैदिक उपाय (Harmonizing Remedies)' : 'Prescribed Harmonizing Remedies'}
          </span>
          <div className="flex flex-wrap gap-2">
            {matchResult.remedies.map((rem, idx) => (
              <RemedyChip
                key={idx}
                category={idx % 2 === 0 ? 'Vedic Harmony' : 'Crystal & Color'}
                label={rem}
              />
            ))}
          </div>
        </div>
      </div>

      {/* DEDICATED PDF REPORT EXPORT BANNER */}
      <div className="vedic-card p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-[var(--surface)] border border-[var(--gold)]/30">
        <div className="space-y-0.5">
          <h3 className="font-serif font-bold text-sm sm:text-base text-[var(--heading)] flex items-center gap-2">
            <Download className="w-4 h-4 text-[var(--gold)]" />
            <span>{locale === 'hi' ? 'समग्र गुण मिलान पीडीएफ रिपोर्ट' : 'Dedicated Match Making PDF Report'}</span>
          </h3>
          <p className="text-[14px] text-[var(--text-muted)]">
            {locale === 'hi'
              ? 'पाँचों स्तंभों, ग्रिड तालमेल और वैदिक उपायों सहित विस्तृत वैवाहिक विश्लेषण डाउनलोड करें।'
              : 'Download the comprehensive multi-pillar match dossier with dual grids, scoring meters, and prescribed remedies.'}
          </p>
        </div>

        <button
          type="button"
          onClick={handleExportPdf}
          disabled={isExporting}
          className="btn-gold-gradient h-[44px] px-5 text-[15px] font-semibold flex items-center gap-2 shrink-0 disabled:opacity-50 cursor-pointer rounded-[12px] shadow-[0_4px_12px_rgba(201,131,16,0.25)] transition-all hover:scale-[1.01] active:scale-[0.99]"
        >
          {isExporting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Download className="w-4 h-4 stroke-[2]" />
          )}
          <span>
            {isExporting 
              ? (locale === 'hi' ? 'पीडीएफ तैयार हो रहा है...' : 'Generating PDF...') 
              : (locale === 'hi' ? 'मैच रिपोर्ट डाउनलोड (PDF)' : 'Export Match Report (PDF)')}
          </span>
        </button>
      </div>

      {/* HIDDEN PRINT/PDF TEMPLATE (Captured by html2canvas + jsPDF) */}
      <div style={{ position: 'absolute', left: '-9999px', top: '-9999px', width: '1100px' }}>
        <div ref={pdfRef} className="p-8 bg-[var(--bg)] text-[var(--heading)] space-y-6 font-sans">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b-2 border-[var(--gold)]">
            <div>
              <span className="text-[11px] font-bold text-[var(--gold)] uppercase tracking-widest block">
                NUMEROTALK VEDIC COMPATIBILITY DOSSIER
              </span>
              <h1 className="text-2xl font-serif font-bold text-[var(--heading)]">
                Kundali & Numerological Match Report
              </h1>
            </div>
            <div className="text-right text-xs text-[var(--text-muted)]">
              <span className="block font-semibold">Date: {todayStr}</span>
              <span className="block">DPDP Local Compliance</span>
            </div>
          </div>

          {/* Profile Strip */}
          <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)]">
            <div className="space-y-1 border-r border-[var(--border)] pr-4">
              <span className="text-xs font-bold text-[var(--gold)]">Partner 1 (Boy)</span>
              <h3 className="text-base font-bold text-[var(--heading)]">{boyName}</h3>
              <p className="text-xs text-[var(--text-muted)]">DOB: {boyDob} | Driver: {matchResult.boy.mulank} | Life Path: {matchResult.boy.bhagyank} | Destiny: {matchResult.boy.destinyNumber}</p>
            </div>
            <div className="space-y-1 pl-4">
              <span className="text-xs font-bold text-[var(--gold)]">Partner 2 (Girl)</span>
              <h3 className="text-base font-bold text-[var(--heading)]">{girlName}</h3>
              <p className="text-xs text-[var(--text-muted)]">DOB: {girlDob} | Driver: {matchResult.girl.mulank} | Life Path: {matchResult.girl.bhagyank} | Destiny: {matchResult.girl.destinyNumber}</p>
            </div>
          </div>

          {/* Overall Score Box */}
          <div className="p-5 rounded-xl bg-[var(--surface)] border-2 border-[var(--gold)] flex items-center justify-between">
            <div className="space-y-1 max-w-xl">
              <span className="text-xs font-bold text-[var(--gold)] uppercase tracking-wider block">Compatibility Synthesis</span>
              <h2 className="text-xl font-bold font-serif text-[var(--heading)]">
                {matchResult.tier} Compatibility — {matchResult.total}/100
              </h2>
              <p className="text-xs text-[var(--text)] leading-relaxed">
                {matchResult.summaryEn}
              </p>
            </div>
            <div className="text-center p-3 rounded-xl bg-[var(--chip-bg)] border border-[var(--gold)]">
              <span className="text-3xl font-serif font-bold text-[var(--heading)] block">{matchResult.total}</span>
              <span className="text-[10px] font-bold text-[var(--gold)] uppercase">Out of 100</span>
            </div>
          </div>

          {/* 5 Pillars Summary */}
          <div className="space-y-3">
            <h3 className="text-base font-serif font-bold text-[var(--heading)] border-b border-[var(--border)] pb-1">
              5 Core Vedic Compatibility Pillars
            </h3>
            <div className="grid grid-cols-1 gap-3">
              {matchResult.pillars.map((p) => (
                <div key={p.id} className="p-3.5 rounded-xl bg-[var(--surface)] border border-[var(--border)] space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[var(--heading)] text-sm">{p.titleEn}</span>
                    <span className="font-bold text-[var(--gold)]">{p.score}/20 ({p.relation.toUpperCase()})</span>
                  </div>
                  <p className="text-[var(--text)] leading-relaxed">
                    <strong>Verdict: </strong>{p.conclusion.verdict.en}
                  </p>
                  <p className="text-[var(--text-muted)] text-[11px] leading-relaxed">
                    {p.conclusion.meaning.en}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Prescribed Remedies */}
          <div className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)] space-y-2 text-xs">
            <span className="font-bold text-[var(--gold)] block">Prescribed Harmonizing Remedies:</span>
            <ul className="space-y-1 text-[var(--text)]">
              {matchResult.remedies.map((rem, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-[var(--gold)] font-bold">•</span>
                  <span>{rem}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Statutory Footer */}
          <div className="pt-4 border-t border-[var(--border)] text-center text-[10px] text-[var(--text-muted)]">
            NumeroTalk Vedic Match Matrix • For consultative & informational purposes • Generated on {todayStr}
          </div>
        </div>
      </div>
    </div>
  );
}
