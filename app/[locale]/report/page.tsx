'use client';

import React, { useState, useRef, useMemo, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import {
  FileSpreadsheet,
  Download,
  Plus,
  Trash2,
  Sparkles,
  Check,
  Globe,
  Shield,
  Crown,
  GitMerge,
  EyeOff,
  Repeat,
  Grid,
  FileSignature,
  Heart,
  Smartphone,
  Briefcase,
  KeyRound,
  Calendar,
  Home,
  Clock,
  Hash
} from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { SectionHeader } from '@/frontend/components/ui/SectionHeader';
import { PdfSectionPicker, SectionPickerItem } from '@/frontend/components/ui/PdfSectionPicker';
import { NumberBadge } from '@/frontend/components/ui/NumberBadge';
import { CompoundNumber } from '@/frontend/components/ui/CompoundNumber';
import { VedicGrid } from '@/frontend/components/VedicGrid';
import { ProfileEmptyBanner } from '@/frontend/components/ProfileEmptyBanner';
import { useNumerologyStore } from '@/frontend/store/useNumerologyStore';
import {
  calculateMulank,
  calculateBhagyank,
  calculateDestinyNumber,
  calculateVedicGrid,
  detectYogas,
  calculateYearlyPrediction,
  analyzeMobileNumber,
  calculateVastuNumerology,
  calculateTimeNumerology,
  getNumberMeaning,
  generatePinByNumerology,
  generatePasswordByProfession,
  getNumberRelationship,
  NUMBER_RELATIONSHIPS,
  calculateAllEventScores,
  numerologyService
} from '@/frontend';
import {
  DestinyReading,
  CombinationReading,
  MissingNumberReading,
  RepeatingNumberReading,
  RemedyMasterItem
} from '@/types';

export default function FinalReportPage() {
  const t = useTranslations('reportPage');
  const tc = useTranslations('common');
  const locale = (useLocale() || 'en') as 'en' | 'hi';

  const {
    profile,
    customRemedies,
    addCustomRemedy,
    removeCustomRemedy,
    reportSections,
    toggleReportSection,
    selectAllReportSections,
    deselectAllReportSections
  } = useNumerologyStore();

  const isProfileEmpty = !profile.name || !profile.dob;
  const [newRemedyInput, setNewRemedyInput] = useState('');
  const [exportLanguage, setExportLanguage] = useState<'en' | 'hi'>(locale);
  const [isDownloading, setIsDownloading] = useState(false);

  const previewRef = useRef<HTMLDivElement>(null);

  // Core Math Calculations
  const mulank = useMemo(
    () => profile.dob ? calculateMulank(profile.dob) : { mulank: 5, compound: 23, reduced: 5, dayNumber: 23 },
    [profile.dob]
  );
  const bhagyank = useMemo(
    () => profile.dob ? calculateBhagyank(profile.dob) : { bhagyank: 3, compound: 30, reduced: 3, rawSum: 30 },
    [profile.dob]
  );
  const destiny = useMemo(
    () => calculateDestinyNumber(profile.name || 'Rahul Sharma'),
    [profile.name]
  );
  const grid = useMemo(
    () => calculateVedicGrid(profile.dob || '1995-10-23'),
    [profile.dob]
  );
  const yogasResult = useMemo(() => detectYogas(grid), [grid]);
  const eventsResult = useMemo(() => calculateAllEventScores(profile), [profile]);
  const yearlyResult = useMemo(() => calculateYearlyPrediction(profile.dob || '1995-10-23'), [profile.dob]);
  const mobileResult = useMemo(() => analyzeMobileNumber(profile.mobile || '9876543210', mulank.mulank), [profile.mobile, mulank.mulank]);
  const vastuResult = useMemo(() => calculateVastuNumerology(profile.dob || '1995-10-23'), [profile.dob]);
  
  const birthHours = profile.birthTime ? parseInt(profile.birthTime.split(':')[0], 10) : 10;
  const birthMins = profile.birthTime ? parseInt(profile.birthTime.split(':')[1], 10) : 30;
  const timeResult = useMemo(() => calculateTimeNumerology(birthHours, birthMins), [birthHours, birthMins]);

  const mulankMeaning = useMemo(() => getNumberMeaning(mulank.mulank), [mulank.mulank]);
  const bhagyankMeaning = useMemo(() => getNumberMeaning(bhagyank.bhagyank), [bhagyank.bhagyank]);
  const [reportDate, setReportDate] = useState('2026-10-09');
  useEffect(() => {
    setReportDate(new Date().toLocaleDateString());
  }, []);

  const pin4 = useMemo(() => {
    // Deterministic 4-digit PIN harmonized with Driver Number to prevent SSR hydration mismatch
    const d1 = ((mulank.mulank * 2) % 9) || 1;
    const d2 = ((mulank.mulank * 3) % 9) || 2;
    const d3 = ((mulank.mulank * 4) % 9) || 3;
    let d4 = 1;
    for (let c = 1; c <= 9; c++) {
      if (((d1 + d2 + d3 + c - 1) % 9) + 1 === mulank.mulank) {
        d4 = c;
        break;
      }
    }
    const pin = `${d1}${d2}${d3}${d4}`;
    const sum = d1 + d2 + d3 + d4;
    return { pin, sum };
  }, [mulank.mulank]);

  const pin6 = useMemo(() => {
    // Deterministic 6-digit PIN harmonized with Conductor Number to prevent SSR hydration mismatch
    const d1 = ((bhagyank.bhagyank * 2) % 9) || 1;
    const d2 = ((bhagyank.bhagyank * 3) % 9) || 2;
    const d3 = ((bhagyank.bhagyank * 4) % 9) || 3;
    const d4 = ((bhagyank.bhagyank * 5) % 9) || 4;
    const d5 = ((bhagyank.bhagyank * 6) % 9) || 5;
    let d6 = 1;
    for (let c = 1; c <= 9; c++) {
      if (((d1 + d2 + d3 + d4 + d5 + c - 1) % 9) + 1 === bhagyank.bhagyank) {
        d6 = c;
        break;
      }
    }
    const pin = `${d1}${d2}${d3}${d4}${d5}${d6}`;
    const sum = d1 + d2 + d3 + d4 + d5 + d6;
    return { pin, sum };
  }, [bhagyank.bhagyank]);

  const relationType = useMemo(() => getNumberRelationship(mulank.mulank, bhagyank.bhagyank), [mulank.mulank, bhagyank.bhagyank]);
  const mulankRelations = useMemo(() => NUMBER_RELATIONSHIPS[mulank.mulank] || { friends: [1, 2], neutrals: [3, 9], enemies: [4, 8] }, [mulank.mulank]);

  // Async Mock Readings State
  const [destinyReading, setDestinyReading] = useState<DestinyReading | null>(null);
  const [combinationReading, setCombinationReading] = useState<CombinationReading | null>(null);
  const [missingRemedies, setMissingRemedies] = useState<MissingNumberReading[]>([]);
  const [repeatingReadings, setRepeatingReadings] = useState<RepeatingNumberReading[]>([]);
  const [remediesMasterList, setRemediesMasterList] = useState<RemedyMasterItem[]>([]);

  useEffect(() => {
    numerologyService.getDestinyReading(destiny.destinyNumber, exportLanguage).then(setDestinyReading);
    numerologyService.getCombinationReading(mulank.mulank, bhagyank.bhagyank, exportLanguage).then(setCombinationReading);
    numerologyService.getMissingNumberRemedies(grid.missingNumbers, exportLanguage).then(setMissingRemedies);
    numerologyService.getRepeatingNumberReadings(grid.repeatingNumbers, exportLanguage).then(setRepeatingReadings);
    numerologyService.getRemediesMasterList({ number: mulank.mulank }, exportLanguage).then(setRemediesMasterList);
  }, [destiny.destinyNumber, mulank.mulank, bhagyank.bhagyank, grid.missingNumbers, grid.repeatingNumbers, exportLanguage]);

  // Sections list according to prompt: 1 to 16, and 18 (17 is Help popup)
  const sectionsList: SectionPickerItem[] = [
    { id: 'userDetail', number: 1, labelEn: 'User Detail & 3x3 Grid', labelHi: 'उपयोगकर्ता विवरण व ग्रिड', checked: !!reportSections.userDetail },
    { id: 'destiny', number: 2, labelEn: 'Destiny (Namank)', labelHi: 'नामांक विश्लेषण', checked: !!reportSections.destiny },
    { id: 'combination', number: 3, labelEn: 'Combination Prediction (Destiny & Life Path)', labelHi: 'संयोजन भविष्यफल (नामांक और भाग्यांक)', checked: !!reportSections.combination },
    { id: 'missing', number: 4, labelEn: 'Missing Numbers & Remedies', labelHi: 'अनुपस्थित अंक व उपाय', checked: !!reportSections.missing },
    { id: 'repeating', number: 5, labelEn: 'Repeating Numbers', labelHi: 'दोहराए गए अंक', checked: !!reportSections.repeating },
    { id: 'yogas', number: 6, labelEn: 'Vedic Yogas Grid', labelHi: 'वैदिक योग (8 ऊर्जा तल)', checked: !!reportSections.yogas },
    { id: 'nameNumerology', number: 7, labelEn: 'Name Numerology', labelHi: 'नाम अंकशास्त्र विश्लेषण', checked: !!reportSections.nameNumerology },
    { id: 'matchMaking', number: 8, labelEn: 'Match Making Summary', labelHi: 'गुण मिलान सारांश', checked: !!reportSections.matchMaking },
    { id: 'mobile', number: 9, labelEn: 'Mobile Numerology', labelHi: 'मोबाइल अंक व दिशा', checked: !!reportSections.mobile },
    { id: 'profession', number: 10, labelEn: 'Profession Alignment', labelHi: 'व्यवसाय व पासवर्ड', checked: !!reportSections.profession },
    { id: 'pinPassword', number: 11, labelEn: 'PIN & Password', labelHi: 'सुरक्षित पिन व पासवर्ड', checked: !!reportSections.pinPassword },
    { id: 'yearly', number: 12, labelEn: 'Yearly Dasha Cycle', labelHi: 'वार्षिक दशा चक्र', checked: !!reportSections.yearly },
    { id: 'vastu', number: 13, labelEn: 'Vastu Directions', labelHi: 'वास्तु दिशा संतुलन', checked: !!reportSections.vastu },
    { id: 'time', number: 14, labelEn: 'Time Numerology (Hora)', labelHi: 'समय अंक व होरा', checked: !!reportSections.time },
    { id: 'numberMeanings', number: 15, labelEn: 'Number 1-108 Oracle', labelHi: '1 से 108 अंक रहस्य', checked: !!reportSections.numberMeanings },
    { id: 'events', number: 16, labelEn: '14 Life Events Scorer', labelHi: '14 जीवन घटनाएं', checked: !!reportSections.events },
    { id: 'remedies', number: 18, labelEn: 'Prescribed Remedies Master', labelHi: 'अनुशंसित उपाय सूची', checked: !!reportSections.remedies }
  ];

  const handleAddRemedy = (e: React.FormEvent) => {
    e.preventDefault();
    if (newRemedyInput.trim()) {
      addCustomRemedy(newRemedyInput);
      setNewRemedyInput('');
    }
  };

  const handleDownloadPdf = async () => {
    if (!previewRef.current) return;
    setIsDownloading(true);

    try {
      const element = previewRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
        backgroundColor: null,
        onclone: (clonedDoc, clonedElement) => {
          // 1. Sanitize all <style> tags to eliminate unsupported modern color functions (oklab, oklch)
          const styleTags = clonedDoc.getElementsByTagName('style');
          for (let i = 0; i < styleTags.length; i++) {
            const tag = styleTags[i];
            if (tag.textContent) {
              tag.textContent = tag.textContent
                .replace(/oklab\([^)]+\)/gi, 'var(--heading)')
                .replace(/oklch\([^)]+\)/gi, 'var(--gold)');
            }
          }

          // 2. Normalize computed colors on all cloned elements
          const allElements = clonedElement.querySelectorAll('*');
          allElements.forEach((el) => {
            const htmlEl = el as HTMLElement;
            try {
              const comp = window.getComputedStyle(htmlEl);
              ['color', 'backgroundColor', 'borderColor', 'outlineColor', 'fill', 'stroke'].forEach((prop) => {
                const val = (comp as any)[prop];
                if (val && typeof val === 'string' && (val.includes('oklab') || val.includes('oklch'))) {
                  if (prop === 'backgroundColor') {
                    htmlEl.style.backgroundColor = 'var(--surface)';
                  } else if (prop === 'borderColor') {
                    htmlEl.style.borderColor = 'var(--border)';
                  } else if (prop === 'fill' || prop === 'stroke') {
                    (htmlEl.style as any)[prop] = 'var(--gold)';
                  } else {
                    htmlEl.style.color = 'var(--heading)';
                  }
                }
              });
            } catch {
              // ignore computed style read errors
            }
          });
        }
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`NumeroTalk_Report_${(profile.name || 'User').replace(/[^a-zA-Z0-9]/g, '_')}_${exportLanguage.toUpperCase()}.pdf`);
    } catch (err: any) {
      console.error('PDF generation error', err);
      if (typeof window !== 'undefined') {
        window.print();
      }
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-7">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <SectionHeader
          title={locale === 'hi' ? 'वैदिक रिपोर्ट संकलन एवं संपूर्ण पीडीएफ' : 'Comprehensive Dossier & Full PDF Export'}
          subtitle={
            locale === 'hi'
              ? 'सभी 17 अनुभागों का विस्तृत डेटा, कुंडली विश्लेषण, दशा, वास्तु एवं उपाय एक ही दस्तावेज में'
              : 'Complete multi-module dossier including destiny, yogas, dasha, vastu, events, remedies, and security'
          }
          icon={<FileSpreadsheet className="w-5 h-5 sm:w-6 sm:h-6" />}
          className="mb-0"
        />

        <div className="flex items-center gap-2">
          {/* Language selector for PDF export */}
          <div className="flex items-center gap-1 p-0.5 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-xs font-semibold">
            <Globe className="w-3.5 h-3.5 text-[var(--gold)] ml-1.5" />
            <button
              type="button"
              onClick={() => setExportLanguage('en')}
              className={`px-2.5 py-1 rounded-lg cursor-pointer transition-colors ${
                exportLanguage === 'en'
                  ? 'bg-[var(--chip-bg)] text-[var(--gold)] font-bold'
                  : 'text-[var(--text-muted)] hover:text-[var(--heading)]'
              }`}
            >
              English
            </button>
            <button
              type="button"
              onClick={() => setExportLanguage('hi')}
              className={`px-2.5 py-1 rounded-lg cursor-pointer transition-colors ${
                exportLanguage === 'hi'
                  ? 'bg-[var(--chip-bg)] text-[var(--heading)] font-bold'
                  : 'text-[var(--text-muted)] hover:text-[var(--heading)]'
              }`}
            >
              हिंदी
            </button>
          </div>

          <button
            type="button"
            onClick={handleDownloadPdf}
            disabled={isDownloading}
            className="btn-gold-gradient h-[38px] px-4 text-xs font-semibold flex items-center gap-1.5 shrink-0 disabled:opacity-50 cursor-pointer rounded-xl text-white shadow-xs"
          >
            <Download className="w-4 h-4" />
            <span>
              {isDownloading
                ? (locale === 'hi' ? 'संपूर्ण पीडीएफ बन रही है...' : 'Generating Full PDF...')
                : (locale === 'hi' ? 'संपूर्ण पीडीएफ डाउनलोड करें' : 'Download Complete PDF')}
            </span>
          </button>
        </div>
      </div>

      {isProfileEmpty && <ProfileEmptyBanner locale={locale} />}

      {/* Checkbox Section Picker */}
      <PdfSectionPicker
        sections={sectionsList}
        onToggle={toggleReportSection}
        onSelectAll={selectAllReportSections}
        onDeselectAll={deselectAllReportSections}
        currentLocale={exportLanguage}
      />

      {/* Add Custom Remedy Box */}
      <div className="vedic-card p-5 space-y-3.5 rounded-[24px]">
        <div>
          <h4 className="text-sm font-bold font-serif text-[var(--heading)] flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[var(--gold)]" />
            {locale === 'hi' ? 'कस्टम उपाय जोड़ें (रिपोर्ट में शामिल होगा)' : 'Add Custom Remedy (Appended to Report)'}
          </h4>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            {locale === 'hi'
              ? 'ज्योतिषी की विशेष सलाह या अपना व्यक्तिगत नियम रिपोर्ट में नीचे जोड़ें'
              : 'Add personal prescriptions or astrologer notes directly to the final dossier'}
          </p>
        </div>

        <form onSubmit={handleAddRemedy} className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={newRemedyInput}
            onChange={(e) => setNewRemedyInput(e.target.value)}
            placeholder={
              locale === 'hi'
                ? 'उदा. प्रतिदिन प्रातः काल सूर्य देव को जल अर्पित करें...'
                : 'e.g. Ring brass bell every morning with Gayatri Mantra...'
            }
            className="flex-1 px-3.5 py-2 text-xs rounded-xl bg-[var(--surface)] border border-[var(--input-border)] text-[var(--heading)] placeholder:text-[var(--text-muted)] focus:outline-hidden focus:border-[var(--gold)]"
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-[var(--chip-bg)] border border-[var(--border)] text-[var(--gold)] text-xs font-semibold hover:bg-[var(--active-bg)] transition-colors flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{locale === 'hi' ? 'जोड़ें' : 'Add Note'}</span>
          </button>
        </form>

        {customRemedies.length > 0 && (
          <div className="space-y-1.5 pt-2 border-t border-[var(--border)]">
            <span className="text-xs font-semibold text-[var(--text-muted)] block">
              {locale === 'hi' ? 'कस्टम उपायों की सूची' : 'Appended Remedies'} ({customRemedies.length}):
            </span>
            <div className="space-y-1.5">
              {customRemedies.map((rem, i) => (
                <div
                  key={i}
                  className="p-3 rounded-xl bg-[var(--bg)] border border-[var(--border)] flex items-center justify-between gap-2 text-xs text-[var(--heading)]"
                >
                  <span className="truncate">{rem}</span>
                  <button
                    type="button"
                    onClick={() => removeCustomRemedy(i)}
                    className="text-[var(--warn-text)] hover:opacity-80 p-1 cursor-pointer transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Live Preview Container (Captured by html2canvas + jsPDF) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold font-serif text-[var(--heading)] flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[var(--gold)]" />
            {locale === 'hi' ? 'लाइव संपूर्ण रिपोर्ट पूर्वावलोकन (प्रिंट प्रति)' : 'Live Dossier Document Preview (Print Ready)'}
          </h3>
          <span className="text-xs text-[var(--text-muted)]">
            {locale === 'hi' ? 'ए4 प्रारूप अनुसार स्वचालित पृष्ठ विभाजन' : 'Formatted as multi-page A4 dossier'}
          </span>
        </div>

        <div
          ref={previewRef}
          className="p-6 sm:p-10 rounded-[24px] bg-[var(--bg)] border-2 border-[var(--border)] text-[var(--heading)] space-y-8 shadow-sm relative overflow-hidden font-sans"
        >
          {/* Subtle printed mandala watermark 5% */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.04] flex items-center justify-center">
            <svg viewBox="0 0 400 400" className="w-[520px] h-[520px] stroke-[var(--gold)] fill-none" strokeWidth="1.5">
              <circle cx="200" cy="200" r="185" />
              <circle cx="200" cy="200" r="145" />
              <circle cx="200" cy="200" r="105" />
              <circle cx="200" cy="200" r="65" />
              <circle cx="200" cy="200" r="25" />
              <polygon points="200,15 360,295 40,295" />
              <polygon points="200,385 360,105 40,105" />
              <rect x="90" y="90" width="220" height="220" />
            </svg>
          </div>

          {/* ========================================================
              COVER / HEADER OF REPORT DOCUMENT
          ======================================================== */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-5 border-b-2 border-[var(--border)] relative z-10">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-5 h-5 rounded-full bg-[var(--chip-bg)] border border-[var(--gold)] flex items-center justify-center text-[var(--gold)] text-[10px] font-serif font-black">
                  ॐ
                </span>
                <span className="text-[11px] font-bold text-[var(--gold)] uppercase tracking-wider font-serif">
                  NumeroTalk • Comprehensive Vedic Almanac Dossier
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[var(--heading)] tracking-tight">
                {profile.name || 'User Profile'}
              </h1>
              <p className="text-xs text-[var(--text-muted)] mt-1 font-medium">
                DOB: <strong className="text-[var(--heading)]">{profile.dob || '1995-10-23'}</strong> • Mobile:{' '}
                <strong className="text-[var(--heading)]">{profile.mobile || '9876543210'}</strong> • Date:{' '}
                <strong className="text-[var(--heading)]" suppressHydrationWarning>{reportDate}</strong>
              </p>
            </div>

            <div className="flex items-center gap-3">
              <NumberBadge number={mulank.mulank} size="md" variant="gold" subLabel="Mulank" />
              <NumberBadge number={bhagyank.bhagyank} size="md" variant="gold" subLabel="Bhagyank" />
              <NumberBadge number={destiny.destinyNumber} size="md" variant="gold" subLabel="Destiny" />
            </div>
          </div>

          {/* ========================================================
              SECTION 1: USER DETAIL & 3x3 VEDIC GRID
          ======================================================== */}
          {reportSections.userDetail && (
            <div className="space-y-3 pb-6 border-b border-[var(--border)] relative z-10">
              <h3 className="text-base font-bold font-serif text-[var(--gold)] flex items-center gap-2">
                <Grid className="w-4 h-4 text-[var(--gold)]" />
                01. {exportLanguage === 'hi' ? 'उपयोगकर्ता विवरण एवं वैदिक 3x3 अंक ग्रिड' : 'User Detail & Vedic 3x3 Energy Grid'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-center">
                <div className="flex justify-center bg-white p-3 rounded-2xl border border-[var(--border)]">
                  <VedicGrid dob={profile.dob} locale={exportLanguage} size="sm" hideControls={true} hideStats={true} />
                </div>
                <div className="space-y-2 text-xs text-[var(--text)] bg-white p-4 rounded-xl border border-[var(--border)]">
                  <div className="flex justify-between items-center border-b border-[var(--border)] pb-1">
                    <span className="text-[var(--text-muted)]">Mulank (Driver Number):</span>
                    <strong className="text-[var(--heading)] inline-flex items-center gap-1.5">
                      <CompoundNumber compound={mulank.compound} reduced={mulank.mulank} size="sm" />
                    </strong>
                  </div>
                  <div className="flex justify-between items-center border-b border-[var(--border)] pb-1">
                    <span className="text-[var(--text-muted)]">Bhagyank (Conductor Number):</span>
                    <strong className="text-[var(--heading)] inline-flex items-center gap-1.5">
                      <CompoundNumber compound={bhagyank.compound} reduced={bhagyank.bhagyank} size="sm" />
                    </strong>
                  </div>
                  <div className="flex justify-between items-center border-b border-[var(--border)] pb-1">
                    <span className="text-[var(--text-muted)]">Destiny (Namank):</span>
                    <strong className="text-[var(--heading)] inline-flex items-center gap-1.5">
                      <CompoundNumber compound={destiny.compound} reduced={destiny.destinyNumber} size="sm" />
                    </strong>
                  </div>
                  <p className="flex justify-between border-b border-[var(--border)] pb-1">
                    <span className="text-[var(--text-muted)]">Present Grid Numbers:</span>
                    <strong className="text-[var(--success-text)]">{grid.presentNumbers.join(', ') || 'None'}</strong>
                  </p>
                  <p className="flex justify-between border-b border-[var(--border)] pb-1">
                    <span className="text-[var(--text-muted)]">Missing Numbers:</span>
                    <strong className="text-[var(--warn-text)]">{grid.missingNumbers.join(', ') || 'None'}</strong>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-[var(--text-muted)]">Repeating Numbers:</span>
                    <strong className="text-[var(--warn-text)]">{grid.repeatingNumbers.map((r) => `${r.number} (×${r.count})`).join(', ') || 'None'}</strong>
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              SECTION 2: DESTINY NUMBER (NAMANK)
          ======================================================== */}
          {reportSections.destiny && (
            <div className="space-y-3 pb-6 border-b border-[var(--border)] relative z-10">
              <h3 className="text-base font-bold font-serif text-[var(--gold)] flex items-center gap-2">
                <Crown className="w-4 h-4 text-[var(--gold)]" />
                02. {exportLanguage === 'hi' ? 'नामांक विश्लेषण (Destiny Number)' : 'Destiny Number (Namank) Analysis'}
              </h3>
              <div className="p-4 rounded-xl bg-white border border-[var(--border)] space-y-3 text-xs">
                <div className="flex items-center justify-between border-b border-[var(--border)] pb-2">
                  <span className="font-bold text-[var(--heading)] text-sm">
                    {destinyReading ? (exportLanguage === 'hi' ? destinyReading.title.hi : destinyReading.title.en) : `Destiny Number ${destiny.destinyNumber}`}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-[var(--chip-bg)] text-[var(--gold)] font-semibold text-[11px] inline-flex items-center gap-1.5">
                    <CompoundNumber compound={destiny.compound} reduced={destiny.destinyNumber} size="sm" />
                  </span>
                </div>
                <p className="text-[var(--text)] leading-relaxed">
                  <strong>Life Mission: </strong>
                  {destinyReading ? (exportLanguage === 'hi' ? destinyReading.lifeMission.hi : destinyReading.lifeMission.en) : 'Leading with strategic wisdom and inspiring those around you.'}
                </p>
                {destinyReading?.coreStrengths && (
                  <div className="space-y-1">
                    <span className="font-semibold text-[var(--text-muted)]">Core Strengths:</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
                      {destinyReading.coreStrengths.map((str, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 text-[var(--heading)]">
                          <Check className="w-3.5 h-3.5 text-[var(--success-text)] shrink-0" />
                          <span>{exportLanguage === 'hi' ? str.hi : str.en}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {destinyReading?.careerAvenues && (
                  <div className="pt-1">
                    <span className="font-semibold text-[var(--text-muted)]">Career Avenues: </span>
                    <span className="text-[var(--heading)]">
                      {destinyReading.careerAvenues.map(c => exportLanguage === 'hi' ? c.hi : c.en).join(', ')}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ========================================================
              SECTION 3: COMBINATION (MULANK x BHAGYANK)
          ======================================================== */}
          {reportSections.combination && (
            <div className="space-y-3 pb-6 border-b border-[var(--border)] relative z-10">
              <h3 className="text-base font-bold font-serif text-[var(--gold)] flex items-center gap-2">
                <GitMerge className="w-4 h-4 text-[var(--gold)]" />
                03. {exportLanguage === 'hi' ? 'संयोजन भविष्यफल (नामांक और भाग्यांक)' : 'Combination Prediction (Destiny & Life Path)'}
              </h3>
              <div className="p-4 rounded-xl bg-white border border-[var(--border)] space-y-2.5 text-xs">
                <div className="flex items-center justify-between border-b border-[var(--border)] pb-2">
                  <span className="font-bold text-[var(--heading)] text-sm">
                    {combinationReading ? (exportLanguage === 'hi' ? combinationReading.title.hi : combinationReading.title.en) : `Mulank ${mulank.mulank} x Bhagyank ${bhagyank.bhagyank}`}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-[var(--chip-bg)] text-[var(--gold)] font-semibold uppercase text-[11px]">
                    Relation: {relationType}
                  </span>
                </div>
                <p className="text-[var(--text)] leading-relaxed">
                  <strong>{exportLanguage === 'hi' ? 'संयुक्त विश्लेषण: ' : 'Combined Vibration: '}</strong>
                  {combinationReading ? (exportLanguage === 'hi' ? combinationReading.synergyAnalysis.hi : combinationReading.synergyAnalysis.en) : 'Harmonious alliance blending leadership with destiny.'}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="p-2.5 rounded-lg bg-[var(--bg)] border border-[var(--border)]">
                    <strong className="text-[var(--gold)] block mb-1">Career Strategy:</strong>
                    <span className="text-[var(--text)]">
                      {combinationReading ? (exportLanguage === 'hi' ? combinationReading.careerGuidance.hi : combinationReading.careerGuidance.en) : 'Strategic planning aligns instinct with destiny.'}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[var(--bg)] border border-[var(--border)]">
                    <strong className="text-[var(--gold)] block mb-1">Personal Life:</strong>
                    <span className="text-[var(--text)]">
                      {combinationReading ? (exportLanguage === 'hi' ? combinationReading.personalLife.hi : combinationReading.personalLife.en) : 'Open listening dissolves natural differences.'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              SECTION 4: MISSING NUMBERS & REMEDIES
          ======================================================== */}
          {reportSections.missing && (
            <div className="space-y-3 pb-6 border-b border-[var(--border)] relative z-10">
              <h3 className="text-base font-bold font-serif text-[var(--gold)] flex items-center gap-2">
                <EyeOff className="w-4 h-4 text-[var(--gold)]" />
                04. {exportLanguage === 'hi' ? 'अनुपस्थित अंक एवं सुधारात्मक उपाय' : 'Missing Numbers & Remedial Blueprint'}
              </h3>
              {missingRemedies.length === 0 ? (
                <div className="p-3 rounded-xl bg-white border border-[var(--border)] text-xs text-[var(--success-text)]">
                  {exportLanguage === 'hi' ? 'बधाई! आपके वैदिक ग्रिड में कोई प्रमुख अंक अनुपस्थित नहीं है।' : 'All key numerological vibrations are present in your chart.'}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {missingRemedies.map((item) => (
                    <div key={item.number} className="p-3.5 rounded-xl bg-white border border-[var(--border)] space-y-2">
                      <div className="flex items-center justify-between border-b border-[var(--border)] pb-1.5">
                        <span className="font-bold text-[var(--heading)] text-sm">
                          {exportLanguage === 'hi' ? `अंक ${item.number} अनुपस्थित` : `Missing Number ${item.number}`}
                        </span>
                        <span className="text-[10px] font-semibold text-[var(--warn-text)] bg-[var(--warn-bg)] px-1.5 py-0.5 rounded">Deficient</span>
                      </div>
                      <p className="text-[var(--text-muted)]">
                        <strong>Impact: </strong>
                        {exportLanguage === 'hi' ? item.deficiencyImpact.hi : item.deficiencyImpact.en}
                      </p>
                      <div className="space-y-1 pt-1">
                        <strong className="text-[var(--gold)] block">Remedies:</strong>
                        {item.remedies.slice(0, 2).map((rem, ridx) => (
                          <div key={ridx} className="flex items-start gap-1.5 text-[var(--text)]">
                            <Check className="w-3 h-3 text-[var(--success-text)] shrink-0 mt-0.5" />
                            <span>{exportLanguage === 'hi' ? rem.action.hi : rem.action.en}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ========================================================
              SECTION 5: REPEATING NUMBERS
          ======================================================== */}
          {reportSections.repeating && (
            <div className="space-y-3 pb-6 border-b border-[var(--border)] relative z-10">
              <h3 className="text-base font-bold font-serif text-[var(--gold)] flex items-center gap-2">
                <Repeat className="w-4 h-4 text-[var(--gold)]" />
                05. {exportLanguage === 'hi' ? 'पुनरावृत्त अंक एवं ऊर्जा संतुलन' : 'Repeating Numbers & Energy Balancing'}
              </h3>
              {repeatingReadings.length === 0 ? (
                <div className="p-3 rounded-xl bg-white border border-[var(--border)] text-xs text-[var(--success-text)]">
                  {exportLanguage === 'hi' ? 'कोई अंक अत्यधिक दोहराया नहीं गया है; संतुलित ऊर्जा प्रवाह।' : 'No hyper-repeating digits detected; natural balanced flow.'}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {repeatingReadings.map((rep) => (
                    <div key={rep.number} className="p-3.5 rounded-xl bg-white border border-[var(--border)] space-y-2">
                      <div className="flex items-center justify-between border-b border-[var(--border)] pb-1.5">
                        <span className="font-bold text-[var(--heading)] text-sm">
                          Digit {rep.number} (Appears {rep.frequency}×)
                        </span>
                        <span className="text-[10px] font-semibold text-[var(--warn-text)] bg-[var(--warn-bg)] px-1.5 py-0.5 rounded">High Vibration</span>
                      </div>
                      <p className="text-[var(--text)]">
                        <strong>Nature: </strong>{exportLanguage === 'hi' ? rep.nature.hi : rep.nature.en}
                      </p>
                      <p className="text-[var(--text-muted)]">
                        <strong>Overload Effect: </strong>{exportLanguage === 'hi' ? rep.overloadImpact.hi : rep.overloadImpact.en}
                      </p>
                      <div className="p-2 rounded bg-[var(--bg)] border border-[var(--border)] text-[var(--heading)]">
                        <strong>Grounding Remedy: </strong>
                        {exportLanguage === 'hi' ? rep.groundingRemedy.hi : rep.groundingRemedy.en}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ========================================================
              SECTION 6: YOGAS ACTIVE
          ======================================================== */}
          {reportSections.yogas && (
            <div className="space-y-3 pb-6 border-b border-[var(--border)] relative z-10">
              <h3 className="text-base font-bold font-serif text-[var(--gold)] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[var(--gold)]" />
                06. {exportLanguage === 'hi' ? 'वैदिक ऊर्जा तल एवं योग (8 Yogas)' : 'Active Vedic Energy Planes & Yogas'}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {yogasResult.yogas.map((y) => (
                  <div key={y.id} className="p-3 rounded-xl bg-white border border-[var(--border)] space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold font-serif text-[var(--heading)] text-xs">
                        {exportLanguage === 'hi' ? y.nameHi : y.nameEn} ({y.numbers.join('-')})
                      </span>
                      <span className={`text-[10px] font-semibold px-1.5 py-0.2 rounded ${y.status === 'full' ? 'bg-[var(--success-bg)] text-[var(--success-text)]' : 'bg-[var(--neutral-bg)] text-[var(--neutral-text)]'}`}>
                        {y.status === 'full' ? 'Full' : y.status === 'partial' ? 'Partial' : 'Inactive'}
                      </span>
                    </div>
                    <p className="text-[var(--text-muted)] text-[11px] leading-relaxed">
                      {exportLanguage === 'hi' ? y.impactHi : y.impactEn}
                    </p>
                    <p className="text-[11px] text-[var(--warn-text)]">
                      <strong>Plan: </strong>{exportLanguage === 'hi' ? y.descriptionHi : y.descriptionEn}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================
              SECTION 7: NAME NUMEROLOGY
          ======================================================== */}
          {reportSections.nameNumerology && (
            <div className="space-y-3 pb-6 border-b border-[var(--border)] relative z-10">
              <h3 className="text-base font-bold font-serif text-[var(--gold)] flex items-center gap-2">
                <FileSignature className="w-4 h-4 text-[var(--gold)]" />
                07. {exportLanguage === 'hi' ? 'नाम अंकशास्त्र एवं अक्षर कंपन' : 'Name Numerology Breakdown'}
              </h3>
              <div className="p-4 rounded-xl bg-white border border-[var(--border)] space-y-3 text-xs">
                <p className="text-[var(--text-muted)]">
                  Detailed letter value breakdown for <strong>{destiny.originalName}</strong>:
                </p>
                <div className="flex flex-wrap gap-2">
                  {destiny.letterBreakdown.map((item, idx) => (
                    <div key={idx} className="flex flex-col items-center justify-center w-8 h-10 rounded-lg bg-[var(--bg)] border border-[var(--border)]">
                      <span className="font-bold text-xs text-[var(--heading)]">{item.char}</span>
                      <span className="text-[10px] font-semibold text-[var(--gold)]">{item.value}</span>
                    </div>
                  ))}
                </div>
                <div className="p-2.5 rounded-lg bg-[var(--bg)] border border-[var(--border)] flex justify-between items-center">
                  <span className="font-semibold text-[var(--heading)]">Compound Name Number:</span>
                  <span className="font-bold font-serif text-[var(--gold)] text-sm">{destiny.compoundNumber} &rarr; Root {destiny.destinyNumber}</span>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              SECTION 8: MATCH-MAKING & RELATIONSHIPS
          ======================================================== */}
          {reportSections.matchMaking && (
            <div className="space-y-3 pb-6 border-b border-[var(--border)] relative z-10">
              <h3 className="text-base font-bold font-serif text-[var(--gold)] flex items-center gap-2">
                <Heart className="w-4 h-4 text-[var(--gold)]" />
                08. {exportLanguage === 'hi' ? 'गुण मिलान एवं संबंध अनुकूलता' : 'Match-Making & Partnership Harmonics'}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-white border border-[var(--border)] text-center space-y-1">
                  <span className="text-[var(--success-text)] font-bold block">Favorable Allies</span>
                  <span className="text-base font-serif font-bold text-[var(--heading)]">
                    {mulankRelations.friends.join(', ')}
                  </span>
                  <p className="text-[10px] text-[var(--text-muted)]">Best compatibility in marriage & partnership</p>
                </div>
                <div className="p-3 rounded-xl bg-white border border-[var(--border)] text-center space-y-1">
                  <span className="text-[var(--warn-text)] font-bold block">Neutral Allies</span>
                  <span className="text-base font-serif font-bold text-[var(--heading)]">
                    {mulankRelations.neutrals.join(', ')}
                  </span>
                  <p className="text-[10px] text-[var(--text-muted)]">Balanced mutual support with conscious communication</p>
                </div>
                <div className="p-3 rounded-xl bg-white border border-[var(--border)] text-center space-y-1">
                  <span className="text-[var(--warn-text)] font-bold block">Friction / Warning</span>
                  <span className="text-base font-serif font-bold text-[var(--heading)]">
                    {mulankRelations.enemies.join(', ')}
                  </span>
                  <p className="text-[10px] text-[var(--text-muted)]">Needs deliberate patience and remedies to harmonize</p>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              SECTION 9: MOBILE NUMEROLOGY
          ======================================================== */}
          {reportSections.mobile && (
            <div className="space-y-3 pb-6 border-b border-[var(--border)] relative z-10">
              <h3 className="text-base font-bold font-serif text-[var(--gold)] flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-[var(--gold)]" />
                09. {exportLanguage === 'hi' ? 'मोबाइल अंकशास्त्र एवं दिशा कंपन' : 'Mobile Number Energetics'}
              </h3>
              <div className="p-4 rounded-xl bg-white border border-[var(--border)] space-y-2.5 text-xs">
                <div className="flex items-center justify-between border-b border-[var(--border)] pb-2">
                  <span className="font-bold text-[var(--heading)]">
                    Mobile: {mobileResult.rawNumber}
                  </span>
                  <span className="font-serif font-bold text-[var(--gold)]">
                    Total: {mobileResult.digitSum} &rarr; Root {mobileResult.reducedTotal}
                  </span>
                </div>
                <p className="text-[var(--text)]">
                  <strong>Compatibility with Driver {mulank.mulank}: </strong>
                  {mobileResult.isFavorableTotal ? 'Highly Harmonious' : 'Moderate / Requires Protective Color Cases'}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-[11px]">
                  <div className="p-2 rounded bg-[var(--bg)] border border-[var(--border)]">
                    <strong>Charging Direction: </strong>
                    {exportLanguage === 'hi' ? mobileResult.chargingDirectionHi : mobileResult.chargingDirectionEn}
                  </div>
                  <div className="p-2 rounded bg-[var(--bg)] border border-[var(--border)]">
                    <strong>Recommended Wallpaper: </strong>
                    {exportLanguage === 'hi' ? mobileResult.screensaverSuggestionHi : mobileResult.screensaverSuggestionEn}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              SECTION 10: PROFESSION ALIGNMENT
          ======================================================== */}
          {reportSections.profession && (
            <div className="space-y-3 pb-6 border-b border-[var(--border)] relative z-10">
              <h3 className="text-base font-bold font-serif text-[var(--gold)] flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-[var(--gold)]" />
                10. {exportLanguage === 'hi' ? 'व्यवसाय एवं कार्यक्षेत्र संरेखण' : 'Vedic Career & Profession Alignment'}
              </h3>
              <div className="p-4 rounded-xl bg-white border border-[var(--border)] space-y-2 text-xs">
                <p className="text-[var(--text)] leading-relaxed">
                  Based on Driver <strong>{mulank.mulank}</strong> and Conductor <strong>{bhagyank.bhagyank}</strong>, your planetary blueprint excels in:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  <div className="p-2.5 rounded-lg bg-[var(--bg)] border border-[var(--border)]">
                    <strong className="text-[var(--heading)] block mb-1">Primary Sectors:</strong>
                    <span className="text-[var(--text-muted)]">Strategic Leadership, Administration, IT & Innovation, Advisory Services</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[var(--bg)] border border-[var(--border)]">
                    <strong className="text-[var(--heading)] block mb-1">Success Catalyst:</strong>
                    <span className="text-[var(--text-muted)]">Direct decisions, independent ownership, disciplined timelines</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              SECTION 11: PIN & PASSWORD SECURITY
          ======================================================== */}
          {reportSections.pinPassword && (
            <div className="space-y-3 pb-6 border-b border-[var(--border)] relative z-10">
              <h3 className="text-base font-bold font-serif text-[var(--gold)] flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-[var(--gold)]" />
                11. {exportLanguage === 'hi' ? 'शुभ पिन एवं सुरक्षा कोड' : 'Auspicious PIN & Security Harmonics'}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-white border border-[var(--border)] space-y-1">
                  <span className="text-[var(--text-muted)] block font-medium">Auspicious 4-Digit Security PIN</span>
                  <span className="text-lg font-mono font-bold text-[var(--gold)] tracking-widest">{pin4.pin}</span>
                  <p className="text-[10px] text-[var(--text-muted)]">Sum reduces to {pin4.sum} (Harmonizes with Driver Number)</p>
                </div>
                <div className="p-3.5 rounded-xl bg-white border border-[var(--border)] space-y-1">
                  <span className="text-[var(--text-muted)] block font-medium">Auspicious 6-Digit Banking PIN</span>
                  <span className="text-lg font-mono font-bold text-[var(--gold)] tracking-widest">{pin6.pin}</span>
                  <p className="text-[10px] text-[var(--text-muted)]">Sum reduces to {pin6.sum} (Harmonizes with Conductor Number)</p>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              SECTION 12: YEARLY DASHA CYCLE
          ======================================================== */}
          {reportSections.yearly && (
            <div className="space-y-3 pb-6 border-b border-[var(--border)] relative z-10">
              <h3 className="text-base font-bold font-serif text-[var(--gold)] flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[var(--gold)]" />
                12. {exportLanguage === 'hi' ? 'वार्षिक दशा चक्र एवं भविष्यकथन' : 'Yearly Planetary Dasha Cycle'}
              </h3>
              <div className="p-4 rounded-xl bg-white border border-[var(--border)] space-y-3 text-xs">
                <div className="flex items-center justify-between border-b border-[var(--border)] pb-2">
                  <span className="font-bold text-[var(--heading)] text-sm">
                    Year {yearlyResult.targetYear} &bull; Personal Year {yearlyResult.personalYear}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-[var(--chip-bg)] text-[var(--gold)] font-semibold text-[11px]">
                    Ruler: {exportLanguage === 'hi' ? yearlyResult.personalYearRulerHi : yearlyResult.personalYearRulerEn}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div className="p-2.5 rounded bg-[var(--bg)] border border-[var(--border)]">
                    <strong className="text-[var(--gold)] block">Mahadasha (9 Yr):</strong>
                    <span className="text-[var(--heading)]">{exportLanguage === 'hi' ? yearlyResult.mahadasha.rulerPlanetHi : yearlyResult.mahadasha.rulerPlanetEn} ({yearlyResult.mahadasha.periodLabel})</span>
                  </div>
                  <div className="p-2.5 rounded bg-[var(--bg)] border border-[var(--border)]">
                    <strong className="text-[var(--gold)] block">Antardasha (Annual):</strong>
                    <span className="text-[var(--heading)]">{exportLanguage === 'hi' ? yearlyResult.antardasha.rulerPlanetHi : yearlyResult.antardasha.rulerPlanetEn}</span>
                  </div>
                  <div className="p-2.5 rounded bg-[var(--bg)] border border-[var(--border)]">
                    <strong className="text-[var(--gold)] block">Pratyantra (Sub):</strong>
                    <span className="text-[var(--heading)]">{exportLanguage === 'hi' ? yearlyResult.pratyantraDasha.rulerPlanetHi : yearlyResult.pratyantraDasha.rulerPlanetEn}</span>
                  </div>
                </div>
                <p className="text-[var(--text-muted)] leading-relaxed pt-1">
                  <strong>Strategic Advice: </strong>
                  {exportLanguage === 'hi' ? yearlyResult.summaryHi : yearlyResult.summaryEn}
                </p>
              </div>
            </div>
          )}

          {/* ========================================================
              SECTION 13: VASTU DIRECTIONS
          ======================================================== */}
          {reportSections.vastu && (
            <div className="space-y-3 pb-6 border-b border-[var(--border)] relative z-10">
              <h3 className="text-base font-bold font-serif text-[var(--gold)] flex items-center gap-2">
                <Home className="w-4 h-4 text-[var(--gold)]" />
                13. {exportLanguage === 'hi' ? 'वास्तु दिशा संरेखण एवं गृह संतुलन' : 'Vastu Directional Harmonics'}
              </h3>
              <div className="p-4 rounded-xl bg-white border border-[var(--border)] space-y-3 text-xs">
                <p className="text-[var(--text-muted)]">
                  Governing Element: <strong>{exportLanguage === 'hi' ? vastuResult.elementDominanceHi : vastuResult.elementDominanceEn}</strong>
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {vastuResult.directions.slice(0, 4).map((d) => (
                    <div key={d.number} className="p-2.5 rounded bg-[var(--bg)] border border-[var(--border)] space-y-1">
                      <div className="flex justify-between items-center">
                        <strong className="text-[var(--heading)]">{exportLanguage === 'hi' ? d.directionHi : d.directionEn}</strong>
                        <span className="text-[10px] font-semibold text-[var(--gold)]">{exportLanguage === 'hi' ? d.statusHi : d.status}</span>
                      </div>
                      <p className="text-[var(--text-muted)] text-[11px]">{exportLanguage === 'hi' ? d.roomUsageHi : d.roomUsageEn}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              SECTION 14: TIME NUMEROLOGY (HORA)
          ======================================================== */}
          {reportSections.time && (
            <div className="space-y-3 pb-6 border-b border-[var(--border)] relative z-10">
              <h3 className="text-base font-bold font-serif text-[var(--gold)] flex items-center gap-2">
                <Clock className="w-4 h-4 text-[var(--gold)]" />
                14. {exportLanguage === 'hi' ? 'समय अंकशास्त्र एवं होरा मुहूर्त' : 'Time Numerology & Auspicious Hora'}
              </h3>
              <div className="p-4 rounded-xl bg-white border border-[var(--border)] space-y-2.5 text-xs">
                <div className="flex items-center justify-between border-b border-[var(--border)] pb-2">
                  <span className="font-bold text-[var(--heading)]">
                    Birth Time {profile.birthTime || '10:30'} &bull; Planetary Ruler
                  </span>
                  <span className="text-xs font-serif font-bold text-[var(--gold)]">
                    {exportLanguage === 'hi' ? timeResult.planetaryHourHi : timeResult.planetaryHourEn}
                  </span>
                </div>
                <p className="text-[var(--text-muted)] leading-relaxed">
                  <strong>Quality: </strong>{exportLanguage === 'hi' ? timeResult.omenQualityHi : timeResult.omenQuality}
                </p>
                <p className="text-[var(--text)] leading-relaxed">
                  <strong>Daily Guidance: </strong>{exportLanguage === 'hi' ? timeResult.guidanceHi : timeResult.guidanceEn}
                </p>
              </div>
            </div>
          )}

          {/* ========================================================
              SECTION 15: NUMBER 1-108 ORACLE
          ======================================================== */}
          {reportSections.numberMeanings && (
            <div className="space-y-3 pb-6 border-b border-[var(--border)] relative z-10">
              <h3 className="text-base font-bold font-serif text-[var(--gold)] flex items-center gap-2">
                <Hash className="w-4 h-4 text-[var(--gold)]" />
                15. {exportLanguage === 'hi' ? '1 से 108 अंक रहस्य एवं वैदिक अर्थ' : 'Sacred 1-108 Oracle Meanings'}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-white border border-[var(--border)] space-y-1.5">
                  <span className="font-bold text-[var(--heading)] block text-sm">
                    Driver Number {mulank.mulank} Archetype
                  </span>
                  <p className="text-[var(--text-muted)] leading-relaxed">
                    {mulankMeaning ? (exportLanguage === 'hi' ? mulankMeaning.meaningHi : mulankMeaning.meaningEn) : 'Governed by primal solar/lunar force of initiative.'}
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-white border border-[var(--border)] space-y-1.5">
                  <span className="font-bold text-[var(--heading)] block text-sm">
                    Conductor Number {bhagyank.bhagyank} Archetype
                  </span>
                  <p className="text-[var(--text-muted)] leading-relaxed">
                    {bhagyankMeaning ? (exportLanguage === 'hi' ? bhagyankMeaning.meaningHi : bhagyankMeaning.meaningEn) : 'Governed by destiny rhythm shaping lifelong evolution.'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              SECTION 16: 14 LIFE EVENTS
          ======================================================== */}
          {reportSections.events && (
            <div className="space-y-3 pb-6 border-b border-[var(--border)] relative z-10">
              <h3 className="text-base font-bold font-serif text-[var(--gold)] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[var(--gold)]" />
                16. {exportLanguage === 'hi' ? '14 जीवन घटनाएं एवं स्कोर' : '14 Life Dimensions & Readiness Scores'}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 text-xs">
                {eventsResult.scores.map((ev) => (
                  <div key={ev.event.id} className="p-2.5 rounded-lg bg-white border border-[var(--border)] flex justify-between items-center">
                    <span className="font-semibold text-[var(--heading)]">
                      {exportLanguage === 'hi' ? ev.event.name.hi : ev.event.name.en}
                    </span>
                    <span className="font-serif font-bold text-[var(--gold)]">{ev.score}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================
              SECTION 18: PRESCRIBED REMEDIES MASTER
          ======================================================== */}
          {reportSections.remedies && (
            <div className="space-y-3 pb-6 border-b border-[var(--border)] relative z-10">
              <h3 className="text-base font-bold font-serif text-[var(--gold)] flex items-center gap-2">
                <Shield className="w-4 h-4 text-[var(--gold)]" />
                18. {exportLanguage === 'hi' ? 'वैदिक उपाय एवं अनुशंसाएं' : 'Prescribed Master Remedial Protocol'}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {remediesMasterList.slice(0, 4).map((rem) => (
                  <div key={rem.id} className="p-3.5 rounded-xl bg-white border border-[var(--border)] space-y-1.5">
                    <div className="flex justify-between items-center border-b border-[var(--border)] pb-1">
                      <strong className="text-[var(--heading)]">{exportLanguage === 'hi' ? rem.title.hi : rem.title.en}</strong>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-[var(--chip-bg)] text-[var(--gold)] font-semibold">{rem.category}</span>
                    </div>
                    <p className="text-[var(--text-muted)] text-[11px]">{exportLanguage === 'hi' ? rem.overview.hi : rem.overview.en}</p>
                    <p className="text-[11px] text-[var(--text)]">
                      <strong>Method: </strong>{exportLanguage === 'hi' ? rem.method.hi : rem.method.en}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================
              CUSTOM APPENDED REMEDIES
          ======================================================== */}
          {customRemedies.length > 0 && (
            <div className="space-y-3 pb-4 relative z-10">
              <h3 className="text-base font-bold font-serif text-[var(--heading)] flex items-center gap-2">
                <Check className="w-4 h-4 text-[var(--success-text)]" />
                {exportLanguage === 'hi' ? 'व्यक्तिगत / ज्योतिषी विशेष निर्देश' : 'Personalized Astrologer Notes'}
              </h3>
              <div className="space-y-2 text-xs">
                {customRemedies.map((cr, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-white border border-[var(--border)] text-[var(--text)] flex items-start gap-2.5"
                  >
                    <Check className="w-4 h-4 text-[var(--success-text)] shrink-0 mt-0.5" />
                    <span className="text-xs leading-relaxed">{cr}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Document Footer Disclaimer */}
          <div className="pt-5 border-t-2 border-[var(--border)] text-[10px] text-[var(--text-muted)] text-center leading-relaxed relative z-10 space-y-1">
            <p>
              {exportLanguage === 'hi'
                ? 'यह फलादेश केवल मार्गदर्शन एवं ज्ञानवर्धन हेतु प्रस्तुत किया गया है।'
                : 'For guidance and empowerment. Results derived through ancient Vedic almanac harmonic algorithms.'}
            </p>
            <p className="font-serif text-[var(--gold)] font-semibold">
              NumeroTalk • Vedic Numerology Platform • ॐ तत्सत्
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
