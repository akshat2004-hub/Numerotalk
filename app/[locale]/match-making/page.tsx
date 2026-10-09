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
  FileText, 
  Loader2,
  Calendar,
  Layers,
  ArrowRightLeft,
  ShieldCheck
} from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { CircularScoreMeter } from '@/components/ui/CircularScoreMeter';
import { VedicGrid } from '@/components/VedicGrid';
import { calculateMatchMaking, MatchMakingResult } from '@/lib';

export default function MatchMakingPage() {
  const t = useTranslations('matchMakingPage');
  const tc = useTranslations('common');
  const locale = (useLocale() || 'en') as 'en' | 'hi';

  const [boyName, setBoyName] = useState('Rahul');
  const [boyDob, setBoyDob] = useState('1995-10-23');
  const [girlName, setGirlName] = useState('Pooja');
  const [girlDob, setGirlDob] = useState('1997-06-15');

  const [isExporting, setIsExporting] = useState(false);
  const pdfRef = useRef<HTMLDivElement>(null);

  // Memoize calculation to prevent unnecessary lag
  const result: MatchMakingResult = useMemo(
    () => calculateMatchMaking(
      { name: boyName || 'Boy', dob: boyDob || '1995-01-01' },
      { name: girlName || 'Girl', dob: girlDob || '1995-01-01' }
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
        backgroundColor: '#FFFAF3',
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
        bg: 'bg-emerald-50 text-emerald-800 border-emerald-300',
        label: locale === 'hi' ? 'मित्रवत (Friendly)' : 'Friendly'
      };
    }
    if (relation === 'enemy') {
      return {
        bg: 'bg-rose-50 text-rose-800 border-rose-300',
        label: locale === 'hi' ? 'शत्रु / विरोधी (Enemy)' : 'Enemy / Friction'
      };
    }
    return {
      bg: 'bg-amber-50 text-amber-800 border-amber-300',
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
          title={t('title')}
          subtitle={t('subtitle')}
          badge={locale === 'hi' ? 'वैदिक गुण मिलान 08' : 'MATCH MAKING 08'}
          icon={<HeartHandshake className="w-5 h-5 stroke-[1.5]" />}
          className="mb-0"
        />

        {/* Quick Top Export Button */}
        <button
          type="button"
          onClick={handleExportPdf}
          disabled={isExporting}
          className="btn-gold-gradient h-[40px] px-4 text-xs font-semibold flex items-center gap-2 shrink-0 disabled:opacity-50 cursor-pointer rounded-xl shadow-xs transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          {isExporting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Download className="w-4 h-4" />
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
        {/* Boy Input */}
        <div className="vedic-card p-4 sm:p-5 space-y-3.5 border-t-2 border-t-[var(--gold)]">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold font-serif text-[var(--heading)] flex items-center gap-2">
              <Users className="w-4 h-4 text-[var(--gold)]" />
              {t('boyDetails')}
            </h3>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-[var(--chip-bg)] text-[var(--gold)] border border-[var(--border)]">
              Partner 1
            </span>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-[11px] font-medium text-[var(--text-muted)] mb-1">
                {t('boyName')}
              </label>
              <input
                type="text"
                value={boyName}
                onChange={(e) => setBoyName(e.target.value)}
                placeholder="Rahul Sharma"
                className="w-full h-[38px] px-3.5 rounded-xl bg-[var(--surface)] border border-[var(--input-border)] text-xs text-[var(--heading)] focus:border-[var(--gold)] focus:ring-1 focus:ring-[var(--gold)] outline-hidden transition-all"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-[var(--text-muted)] mb-1">
                {t('boyDob')}
              </label>
              <input
                type="date"
                value={boyDob}
                onChange={(e) => setBoyDob(e.target.value)}
                className="w-full h-[38px] px-3.5 rounded-xl bg-[var(--surface)] border border-[var(--input-border)] text-xs text-[var(--heading)] focus:border-[var(--gold)] focus:ring-1 focus:ring-[var(--gold)] outline-hidden cursor-pointer transition-all"
              />
            </div>
          </div>

          {/* Quick Key Numbers Bar */}
          <div className="flex items-center justify-between pt-2 border-t border-[var(--border)] text-xs">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-[var(--text-muted)]">Driver (मूलांक):</span>
              <span className="w-6 h-6 rounded-full bg-[var(--chip-bg)] text-[var(--gold)] font-serif font-bold text-xs flex items-center justify-center border border-[var(--border)]">
                {result.boy.mulank}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-[var(--text-muted)]">Conductor (भाग्यांक):</span>
              <span className="w-6 h-6 rounded-full bg-[var(--chip-bg)] text-[var(--gold)] font-serif font-bold text-xs flex items-center justify-center border border-[var(--border)]">
                {result.boy.bhagyank}
              </span>
            </div>
          </div>
        </div>

        {/* Girl Input */}
        <div className="vedic-card p-4 sm:p-5 space-y-3.5 border-t-2 border-t-rose-400">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold font-serif text-[var(--heading)] flex items-center gap-2">
              <Heart className="w-4 h-4 text-rose-500" />
              {t('girlDetails')}
            </h3>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200">
              Partner 2
            </span>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-[11px] font-medium text-[var(--text-muted)] mb-1">
                {t('girlName')}
              </label>
              <input
                type="text"
                value={girlName}
                onChange={(e) => setGirlName(e.target.value)}
                placeholder="Pooja Verma"
                className="w-full h-[38px] px-3.5 rounded-xl bg-[var(--surface)] border border-[var(--input-border)] text-xs text-[var(--heading)] focus:border-rose-400 focus:ring-1 focus:ring-rose-400 outline-hidden transition-all"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-[var(--text-muted)] mb-1">
                {t('girlDob')}
              </label>
              <input
                type="date"
                value={girlDob}
                onChange={(e) => setGirlDob(e.target.value)}
                className="w-full h-[38px] px-3.5 rounded-xl bg-[var(--surface)] border border-[var(--input-border)] text-xs text-[var(--heading)] focus:border-rose-400 focus:ring-1 focus:ring-rose-400 outline-hidden cursor-pointer transition-all"
              />
            </div>
          </div>

          {/* Quick Key Numbers Bar */}
          <div className="flex items-center justify-between pt-2 border-t border-[var(--border)] text-xs">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-[var(--text-muted)]">Driver (मूलांक):</span>
              <span className="w-6 h-6 rounded-full bg-rose-50 text-rose-700 font-serif font-bold text-xs flex items-center justify-center border border-rose-200">
                {result.girl.mulank}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-[var(--text-muted)]">Conductor (भाग्यांक):</span>
              <span className="w-6 h-6 rounded-full bg-rose-50 text-rose-700 font-serif font-bold text-xs flex items-center justify-center border border-rose-200">
                {result.girl.bhagyank}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* PRIMARY ACTION BANNER: Dedicated Match Making Report Export Button */}
      <div className="vedic-card p-4 sm:p-5 bg-gradient-to-r from-[var(--surface)] via-[var(--bg)] to-[var(--surface)] border border-[var(--border)] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[var(--chip-bg)] border border-[var(--border)] flex items-center justify-center text-[var(--gold)] shrink-0 shadow-xs">
            <FileText className="w-5 h-5 stroke-[1.8]" />
          </div>
          <div>
            <h4 className="text-sm font-bold font-serif text-[var(--heading)]">
              {locale === 'hi' ? 'वैदिक गुण मिलान रिपोर्ट (PDF)' : 'Dedicated Match Making PDF Report'}
            </h4>
            <p className="text-[11px] text-[var(--text-muted)]">
              {locale === 'hi'
                ? `केवल ${boyName || 'वर'} और ${girlName || 'वधू'} की संपूर्ण गुण मिलान विश्लेषण रिपोर्ट डाउनलोड करें`
                : `Download complete matchmaking analysis, score breakdown, Vedic grids & remedies for ${boyName || 'Boy'} & ${girlName || 'Girl'}`}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleExportPdf}
          disabled={isExporting}
          className="btn-gold-gradient w-full sm:w-auto h-[44px] px-6 text-xs font-bold flex items-center justify-center gap-2 shrink-0 cursor-pointer rounded-xl shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
        >
          {isExporting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>{locale === 'hi' ? 'रिपोर्ट तैयार हो रही है...' : 'Generating Report...'}</span>
            </>
          ) : (
            <>
              <Download className="w-4 h-4 stroke-[2]" />
              <span>{locale === 'hi' ? 'एक्सपोर्ट मिलान रिपोर्ट (PDF)' : 'Export Match Report (PDF)'}</span>
            </>
          )}
        </button>
      </div>

      {/* PRINTABLE REPORT CONTAINER (Exported to PDF) */}
      <div 
        ref={pdfRef} 
        className="space-y-5 p-3 sm:p-6 rounded-[24px] bg-[var(--bg)] border border-[var(--border)] shadow-xs"
      >
        {/* PDF Header (Visible in print/export) */}
        <div className="pb-3 border-b border-[var(--border)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-1.5 text-[var(--gold)] font-serif font-bold text-base sm:text-lg">
              <Sparkles className="w-4 h-4" />
              <span>NumeroTalk Vedic Compatibility Report</span>
            </div>
            <p className="text-[11px] text-[var(--text-muted)]">
              {boyName} ({boyDob}) & {girlName} ({girlDob}) • Generated on {todayStr}
            </p>
          </div>
          <div className="flex items-center gap-1 text-[10px] text-[var(--text-muted)] px-2.5 py-1 rounded-full bg-[var(--surface)] border border-[var(--border)]">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Vedic Kundli & Numerology Alignment</span>
          </div>
        </div>

        {/* 1. HERO COMPATIBILITY SCORE CARD with CIRCULAR SCORE GAUGE */}
        <div className="vedic-card p-5 sm:p-7 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[radial-gradient(ellipse_at_top_right,_var(--gold)_0%,_transparent_70%)] opacity-10 pointer-events-none" />

          <div className="flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-10">
            {/* The Rounded Donut Circle Gauge */}
            <div className="shrink-0">
              <CircularScoreMeter
                score={result.totalScore}
                size={175}
                strokeWidth={12}
                label={locale === 'hi' ? 'समग्र गुण मिलान' : 'Overall Match'}
                verdict={locale === 'hi' ? result.verdictHi : result.verdictEn}
                locale={locale}
              />
            </div>

            {/* Score Breakdown & Synthesis */}
            <div className="flex-1 text-left space-y-3.5 max-w-xl">
              <div>
                <span className="text-[10px] font-bold text-[var(--gold)] tracking-widest uppercase block mb-1">
                  {t('totalScoreLabel')}
                </span>
                <h3 className="font-serif text-lg sm:text-xl font-bold text-[var(--heading)]">
                  {locale === 'hi' ? result.verdictHi : result.verdictEn}
                </h3>
                <p className="text-xs text-[var(--text)] leading-relaxed mt-1">
                  {locale === 'hi' ? result.analysisHi : result.analysisEn}
                </p>
              </div>

              {/* Score Metric Progress Pill Indicators */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-[var(--border)]">
                <div className="p-2 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-center">
                  <span className="text-[10px] text-[var(--text-muted)] block">Driver Bond</span>
                  <strong className="text-xs font-serif font-bold text-[var(--gold)]">
                    {result.mulankCompat.score}/30
                  </strong>
                </div>
                <div className="p-2 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-center">
                  <span className="text-[10px] text-[var(--text-muted)] block">Destiny Path</span>
                  <strong className="text-xs font-serif font-bold text-[var(--gold)]">
                    {result.bhagyankCompat.score}/30
                  </strong>
                </div>
                <div className="p-2 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-center">
                  <span className="text-[10px] text-[var(--text-muted)] block">Cross Dynamic</span>
                  <strong className="text-xs font-serif font-bold text-[var(--gold)]">
                    {result.crossCompat.score}/20
                  </strong>
                </div>
                <div className="p-2 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-center">
                  <span className="text-[10px] text-[var(--text-muted)] block">Grid Overlap</span>
                  <strong className="text-xs font-serif font-bold text-emerald-700">
                    {Math.max(0, result.totalScore - result.mulankCompat.score - result.bhagyankCompat.score - result.crossCompat.score)}/20
                  </strong>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. THREE KEY COMPARISON BLOCKS (Clean Number Badge Pairs, NO Cluttered Grids) */}
        <div className="space-y-3.5">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-sm sm:text-base font-bold text-[var(--heading)] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[var(--gold)]" />
              <span>{locale === 'hi' ? 'तीन प्रमुख वैदिक तुलनात्मक स्तंभ' : 'Three Key Vedic Compatibility Pillars'}</span>
            </h3>
            <span className="text-[10px] text-[var(--text-muted)]">
              Weight: 80 Points Total
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Pillar 1: Driver ↔ Driver */}
            {(() => {
              const rel = getRelationBadge(result.mulankCompat.relation);
              return (
                <div className="vedic-card p-4 space-y-3 flex flex-col justify-between border-t-2 border-t-[var(--gold)]">
                  <div>
                    <div className="flex items-center justify-between pb-2 border-b border-[var(--border)]">
                      <span className="text-xs font-bold font-serif text-[var(--heading)]">
                        1. Driver ↔ Driver
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${rel.bg}`}>
                        {rel.label}
                      </span>
                    </div>

                    {/* Clean Number Badge Pair */}
                    <div className="flex items-center justify-center gap-4 py-3.5 bg-[var(--bg)] rounded-xl my-2 border border-[var(--border)]">
                      <div className="text-center">
                        <span className="text-[10px] text-[var(--text-muted)] block mb-0.5">{boyName}</span>
                        <div className="w-10 h-10 rounded-full bg-[var(--chip-bg)] text-[var(--gold)] font-serif font-extrabold text-base flex items-center justify-center border-2 border-[var(--border)] shadow-xs mx-auto">
                          {result.boy.mulank}
                        </div>
                        <span className="text-[9px] text-[var(--text-muted)] block mt-0.5">Mulank</span>
                      </div>

                      <div className="flex flex-col items-center">
                        <ArrowRightLeft className="w-4 h-4 text-[var(--gold)] stroke-[2]" />
                        <span className="text-[10px] font-bold text-emerald-700 mt-1">
                          {result.mulankCompat.score}/30
                        </span>
                      </div>

                      <div className="text-center">
                        <span className="text-[10px] text-[var(--text-muted)] block mb-0.5">{girlName}</span>
                        <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-700 font-serif font-extrabold text-base flex items-center justify-center border-2 border-rose-200 shadow-xs mx-auto">
                          {result.girl.mulank}
                        </div>
                        <span className="text-[9px] text-[var(--text-muted)] block mt-0.5">Mulank</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-[11px] text-[var(--text)] leading-relaxed pt-2 border-t border-[var(--border)]">
                    {locale === 'hi' ? result.mulankCompat.labelHi : result.mulankCompat.labelEn}
                  </p>
                </div>
              );
            })()}

            {/* Pillar 2: Conductor ↔ Conductor */}
            {(() => {
              const rel = getRelationBadge(result.bhagyankCompat.relation);
              return (
                <div className="vedic-card p-4 space-y-3 flex flex-col justify-between border-t-2 border-t-[var(--gold)]">
                  <div>
                    <div className="flex items-center justify-between pb-2 border-b border-[var(--border)]">
                      <span className="text-xs font-bold font-serif text-[var(--heading)]">
                        2. Conductor ↔ Conductor
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${rel.bg}`}>
                        {rel.label}
                      </span>
                    </div>

                    {/* Clean Number Badge Pair */}
                    <div className="flex items-center justify-center gap-4 py-3.5 bg-[var(--bg)] rounded-xl my-2 border border-[var(--border)]">
                      <div className="text-center">
                        <span className="text-[10px] text-[var(--text-muted)] block mb-0.5">{boyName}</span>
                        <div className="w-10 h-10 rounded-full bg-[var(--chip-bg)] text-[var(--gold)] font-serif font-extrabold text-base flex items-center justify-center border-2 border-[var(--border)] shadow-xs mx-auto">
                          {result.boy.bhagyank}
                        </div>
                        <span className="text-[9px] text-[var(--text-muted)] block mt-0.5">Bhagyank</span>
                      </div>

                      <div className="flex flex-col items-center">
                        <ArrowRightLeft className="w-4 h-4 text-[var(--gold)] stroke-[2]" />
                        <span className="text-[10px] font-bold text-emerald-700 mt-1">
                          {result.bhagyankCompat.score}/30
                        </span>
                      </div>

                      <div className="text-center">
                        <span className="text-[10px] text-[var(--text-muted)] block mb-0.5">{girlName}</span>
                        <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-700 font-serif font-extrabold text-base flex items-center justify-center border-2 border-rose-200 shadow-xs mx-auto">
                          {result.girl.bhagyank}
                        </div>
                        <span className="text-[9px] text-[var(--text-muted)] block mt-0.5">Bhagyank</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-[11px] text-[var(--text)] leading-relaxed pt-2 border-t border-[var(--border)]">
                    {locale === 'hi' ? result.bhagyankCompat.labelHi : result.bhagyankCompat.labelEn}
                  </p>
                </div>
              );
            })()}

            {/* Pillar 3: Cross Driver ↔ Conductor */}
            {(() => {
              const rel = getRelationBadge(result.crossCompat.relation);
              return (
                <div className="vedic-card p-4 space-y-3 flex flex-col justify-between border-t-2 border-t-[var(--gold)]">
                  <div>
                    <div className="flex items-center justify-between pb-2 border-b border-[var(--border)]">
                      <span className="text-xs font-bold font-serif text-[var(--heading)]">
                        3. Cross Driver ↔ Conductor
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${rel.bg}`}>
                        {rel.label}
                      </span>
                    </div>

                    {/* Cross interaction display */}
                    <div className="flex items-center justify-center gap-4 py-3.5 bg-[var(--bg)] rounded-xl my-2 border border-[var(--border)]">
                      <div className="text-center">
                        <span className="text-[10px] text-[var(--text-muted)] block mb-0.5">Boy M × Girl B</span>
                        <div className="px-2.5 py-1 rounded-lg bg-[var(--surface)] text-[var(--gold)] font-serif font-bold text-xs border border-[var(--border)] shadow-xs">
                          {result.boy.mulank} × {result.girl.bhagyank}
                        </div>
                      </div>

                      <div className="flex flex-col items-center">
                        <Sparkles className="w-4 h-4 text-[var(--gold)]" />
                        <span className="text-[10px] font-bold text-emerald-700 mt-1">
                          {result.crossCompat.score}/20
                        </span>
                      </div>

                      <div className="text-center">
                        <span className="text-[10px] text-[var(--text-muted)] block mb-0.5">Girl M × Boy B</span>
                        <div className="px-2.5 py-1 rounded-lg bg-[var(--surface)] text-rose-700 font-serif font-bold text-xs border border-rose-200 shadow-xs">
                          {result.girl.mulank} × {result.boy.bhagyank}
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="text-[11px] text-[var(--text)] leading-relaxed pt-2 border-t border-[var(--border)]">
                    {locale === 'hi' ? result.crossCompat.labelHi : result.crossCompat.labelEn}
                  </p>
                </div>
              );
            })()}
          </div>
        </div>

        {/* 3. COMMON NUMBERS & MUTUAL FILLING */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Common Numbers */}
          <div className="vedic-card p-4 sm:p-5 space-y-2.5">
            <h4 className="text-xs font-bold font-serif text-[var(--gold)] flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-[var(--gold)]" />
              {t('commonNumbersTitle')}
            </h4>
            <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">
              {locale === 'hi'
                ? 'दोनों के ग्रिड में समान उपस्थित अंक जो प्राकृतिक वैचारिक सामंजस्य और सहज समझ बनाते हैं:'
                : 'Digits present in both partners grids creating natural common ground and shared thinking:'}
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              {result.commonNumbers.length > 0 ? (
                result.commonNumbers.map((num) => (
                  <span 
                    key={num}
                    className="w-8 h-8 rounded-full bg-[var(--chip-bg)] text-[var(--gold)] font-serif font-bold text-xs flex items-center justify-center border border-[var(--border)] shadow-xs"
                  >
                    {num}
                  </span>
                ))
              ) : (
                <span className="text-xs text-[var(--text-muted)] italic">
                  {locale === 'hi' ? 'कोई उभयनिष्ठ अंक नहीं' : 'No common digits present'}
                </span>
              )}
            </div>
          </div>

          {/* Mutual Complement / Exchangeable Numbers */}
          <div className="vedic-card p-4 sm:p-5 space-y-2.5">
            <h4 className="text-xs font-bold font-serif text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              {t('exchangeTitle')}
            </h4>
            <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">
              {locale === 'hi'
                ? 'एक-दूसरे के रिक्त खानों की पूर्ति — जहाँ एक पार्टनर दूसरे की कमियों को संबल प्रदान करता है:'
                : 'How each partner spiritually fills missing numeric voids in the other partner:'}
            </p>
            <div className="space-y-2 text-xs pt-1">
              <div className="flex items-center justify-between p-2 rounded-xl bg-[var(--surface)] border border-[var(--border)]">
                <span className="text-[var(--text-muted)] text-[11px]">
                  {boyName} fills {girlName}&apos;s voids:
                </span>
                <strong className="text-emerald-800 font-serif font-bold text-xs">
                  {result.boyFillsGirlMissing.length > 0 ? result.boyFillsGirlMissing.join(', ') : 'None'}
                </strong>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-[var(--surface)] border border-[var(--border)]">
                <span className="text-[var(--text-muted)] text-[11px]">
                  {girlName} fills {boyName}&apos;s voids:
                </span>
                <strong className="text-emerald-800 font-serif font-bold text-xs">
                  {result.girlFillsBoyMissing.length > 0 ? result.girlFillsBoyMissing.join(', ') : 'None'}
                </strong>
              </div>
            </div>
          </div>
        </div>

        {/* 4. FULL VEDIC GRIDS SIDE-BY-SIDE (Clean, centered, dedicated section) */}
        <div className="space-y-3.5 pt-2">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-sm sm:text-base font-bold text-[var(--heading)] flex items-center gap-2">
              <Layers className="w-4 h-4 text-[var(--gold)]" />
              <span>{locale === 'hi' ? 'दोनों कुंडलियों के वैदिक ग्रिड' : 'Vedic Numerology Grids Comparison'}</span>
            </h3>
            <span className="text-[10px] text-[var(--text-muted)]">
              Full 3×3 Planetary Matrices
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Boy's Vedic Grid Card */}
            <div className="vedic-card p-4 sm:p-5 space-y-3 border-t-2 border-t-[var(--gold)]">
              <div className="flex items-center justify-between pb-2 border-b border-[var(--border)]">
                <div>
                  <span className="text-xs font-bold font-serif text-[var(--heading)] block">
                    {boyName}&apos;s Vedic Grid
                  </span>
                  <span className="text-[10px] text-[var(--text-muted)]">
                    DOB: {boyDob} • Mulank: {result.boy.mulank} • Bhagyank: {result.boy.bhagyank}
                  </span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-[var(--chip-bg)] text-[var(--gold)] font-semibold border border-[var(--border)]">
                  Partner 1
                </span>
              </div>
              <div className="flex justify-center py-2">
                <VedicGrid dob={boyDob} locale={locale} hideControls={true} />
              </div>
            </div>

            {/* Girl's Vedic Grid Card */}
            <div className="vedic-card p-4 sm:p-5 space-y-3 border-t-2 border-t-rose-400">
              <div className="flex items-center justify-between pb-2 border-b border-[var(--border)]">
                <div>
                  <span className="text-xs font-bold font-serif text-[var(--heading)] block">
                    {girlName}&apos;s Vedic Grid
                  </span>
                  <span className="text-[10px] text-[var(--text-muted)]">
                    DOB: {girlDob} • Mulank: {result.girl.mulank} • Bhagyank: {result.girl.bhagyank}
                  </span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 font-semibold border border-rose-200">
                  Partner 2
                </span>
              </div>
              <div className="flex justify-center py-2">
                <VedicGrid dob={girlDob} locale={locale} hideControls={true} />
              </div>
            </div>
          </div>
        </div>

        {/* 5. HARMONIZING REMEDIES ADVICE */}
        <div className="vedic-card p-4 sm:p-5 space-y-2 border-l-4 border-l-[var(--gold)]">
          <h4 className="text-xs font-bold font-serif text-[var(--gold)] flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-[var(--gold)]" />
            {t('remedyAdvice')}
          </h4>
          <p className="text-xs text-[var(--text)] leading-relaxed">
            {locale === 'hi' ? result.remedyAdviceHi : result.remedyAdviceEn}
          </p>
        </div>

        {/* Report Footer Note */}
        <div className="text-center pt-2 text-[10px] text-[var(--text-muted)] border-t border-[var(--border)]">
          NumeroTalk Vedic Numerology Platform • Confidential Match Making Analysis • Not intended as legal advice
        </div>
      </div>
    </div>
  );
}
