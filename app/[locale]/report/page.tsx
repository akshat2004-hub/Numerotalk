'use client';

import React, { useState, useRef, useMemo } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { FileSpreadsheet, Download, Plus, Trash2, Sparkles, Check, Globe, Shield } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { PdfSectionPicker, SectionPickerItem } from '@/components/ui/PdfSectionPicker';
import { NumberBadge } from '@/components/ui/NumberBadge';
import { VedicGrid } from '@/components/VedicGrid';
import { ProfileEmptyBanner } from '@/components/ProfileEmptyBanner';
import { useNumerologyStore } from '@/lib/store/useNumerologyStore';
import {
  calculateMulank,
  calculateBhagyank,
  calculateDestinyNumber,
  calculateVedicGrid,
  detectYogas
} from '@/lib';
import { calculateAllEventScores } from '@/lib/engine/events';

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

  const mulank = useMemo(
    () => profile.dob ? calculateMulank(profile.dob) : { mulank: 5, compoundStr: '23/5', dayNumber: 23 },
    [profile.dob]
  );
  const bhagyank = useMemo(
    () => profile.dob ? calculateBhagyank(profile.dob) : { bhagyank: 3, compoundStr: '30/3', rawSum: 30 },
    [profile.dob]
  );
  const destiny = useMemo(
    () => calculateDestinyNumber(profile.name || 'Rahul Sharma', profile.destinySystem || 'chaldean'),
    [profile.name, profile.destinySystem]
  );
  const grid = useMemo(
    () => calculateVedicGrid(profile.dob || '1995-10-23'),
    [profile.dob]
  );
  const yogasResult = useMemo(() => detectYogas(grid), [grid]);
  const eventsResult = useMemo(() => calculateAllEventScores(profile), [profile]);

  // Sections list according to prompt: 1 to 16, and 18 (17 is Help popup)
  const sectionsList: SectionPickerItem[] = [
    { id: 'userDetail', number: 1, labelEn: 'User Detail & Grid', labelHi: 'उपयोगकर्ता विवरण व ग्रिड', checked: !!reportSections.userDetail },
    { id: 'destiny', number: 2, labelEn: 'Destiny (Namank)', labelHi: 'नामांक विश्लेषण', checked: !!reportSections.destiny },
    { id: 'combination', number: 3, labelEn: 'Destiny x Life Path', labelHi: 'मूलांक x भाग्यांक समन्वय', checked: !!reportSections.combination },
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
        backgroundColor: '#FFFAF3'
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

      pdf.save(`NumeroTalk_Report_${profile.name || 'User'}_${exportLanguage.toUpperCase()}.pdf`);
    } catch (err) {
      console.error('PDF generation error', err);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-7">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <SectionHeader
          title={locale === 'hi' ? 'वैदिक रिपोर्ट संकलन एवं पीडीएफ' : 'Custom Report Dossier & PDF Export'}
          subtitle={
            locale === 'hi'
              ? 'अनुभागों का चयन करें, कस्टम उपाय जोड़ें एवं आइवरी स्वर्ण शैली में संपूर्ण रिपोर्ट डाउनलोड करें'
              : 'Select modules, append personalized remedies, and export an ivory-gold Vedic numerology dossier'
          }
          badge={locale === 'hi' ? 'रिपोर्ट संकलन 19' : 'Dossier Builder 19'}
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
                  ? 'bg-[var(--chip-bg)] text-[var(--heading)] font-bold'
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
            <span>{isDownloading ? (locale === 'hi' ? 'पीडीएफ बन रही है...' : 'Generating PDF...') : (locale === 'hi' ? 'पीडीएफ डाउनलोड करें' : 'Download PDF')}</span>
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
                ? 'उदा. प्रतिदिन प्रातः गायत्री मंत्र का 11 बार जप करें...'
                : 'e.g., Chant Gayatri Mantra 11 times every morning...'
            }
            className="flex-1 h-[40px] px-3.5 rounded-xl bg-[var(--surface)] border border-[var(--input-border)] text-xs text-[var(--heading)] outline-hidden focus:border-[var(--gold)]"
          />
          <button
            type="submit"
            className="btn-gold-gradient h-[40px] px-4 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shrink-0 cursor-pointer rounded-xl text-white"
          >
            <Plus className="w-4 h-4" />
            <span>{locale === 'hi' ? 'उपाय जोड़ें' : 'Add Remedy'}</span>
          </button>
        </form>

        {customRemedies.length > 0 && (
          <div className="space-y-2 pt-1">
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
                    className="text-rose-500 hover:text-rose-700 p-1 cursor-pointer transition-colors"
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
            {locale === 'hi' ? 'लाइव रिपोर्ट पूर्वावलोकन (आइवरी एवं स्वर्ण पृष्ठ)' : 'Live Dossier Preview (Ivory & Gold Page)'}
          </h3>
          <span className="text-xs text-[var(--text-muted)]">
            {locale === 'hi' ? 'पीडीएफ प्रारूप के अनुरूप' : 'Formatted as printable A4 PDF'}
          </span>
        </div>

        <div
          ref={previewRef}
          className="p-6 sm:p-10 rounded-[24px] bg-[#FFFAF3] border-2 border-[#EADFC8] text-[#14213D] space-y-7 shadow-sm relative overflow-hidden font-sans"
        >
          {/* Subtle printed mandala watermark 5% */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.05] flex items-center justify-center">
            <svg viewBox="0 0 400 400" className="w-[520px] h-[520px] stroke-[#E8A317] fill-none" strokeWidth="1.5">
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

          {/* Header of Report Document */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-5 border-b-2 border-[#EADFC8] relative z-10">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-5 h-5 rounded-full bg-[#FFF1CC] border border-[#E8A317] flex items-center justify-center text-[#E8A317] text-[10px] font-serif font-black">
                  ॐ
                </span>
                <span className="text-[11px] font-bold text-[#E8A317] uppercase tracking-wider font-serif">
                  NumeroTalk • Vedic Almanac Dossier
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#14213D] tracking-tight">
                {profile.name || 'User Profile'}
              </h1>
              <p className="text-xs text-[#8A7F6E] mt-1 font-medium">
                DOB: <strong className="text-[#14213D]">{profile.dob || '1995-10-23'}</strong> • Mobile:{' '}
                <strong className="text-[#14213D]">{profile.mobile || '9876543210'}</strong> • Date:{' '}
                <strong className="text-[#14213D]">{new Date().toLocaleDateString()}</strong>
              </p>
            </div>

            <div className="flex items-center gap-3">
              <NumberBadge number={mulank.mulank} size="md" variant="gold" subLabel="Mulank" />
              <NumberBadge number={bhagyank.bhagyank} size="md" variant="gold" subLabel="Bhagyank" />
              <NumberBadge number={destiny.destinyNumber} size="md" variant="gold" subLabel="Destiny" />
            </div>
          </div>

          {/* Section 1: User Detail & Grid */}
          {reportSections.userDetail && (
            <div className="space-y-3 pb-5 border-b border-[#EADFC8] relative z-10">
              <h3 className="text-base font-bold font-serif text-[#E8A317]">
                01. {exportLanguage === 'hi' ? 'वैदिक 3x3 अंक ग्रिड' : 'Vedic 3x3 Energy Grid'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-center">
                <div className="flex justify-center">
                  <VedicGrid dob={profile.dob} locale={exportLanguage} size="sm" hideControls={true} hideStats={true} />
                </div>
                <div className="space-y-2 text-xs text-[#2B2B3A] bg-white/70 p-4 rounded-xl border border-[#EADFC8]">
                  <p>
                    <strong className="text-[#8A7F6E]">Mulank (Driver):</strong> {mulank.mulank} (Compound {mulank.compoundStr})
                  </p>
                  <p>
                    <strong className="text-[#8A7F6E]">Bhagyank (Conductor):</strong> {bhagyank.bhagyank} (Compound {bhagyank.compoundStr})
                  </p>
                  <p>
                    <strong className="text-[#8A7F6E]">Destiny (Namank):</strong> {destiny.destinyNumber} ({destiny.system})
                  </p>
                  <p>
                    <strong className="text-[#8A7F6E]">Missing Numbers:</strong> {grid.missingNumbers.join(', ') || 'None'}
                  </p>
                  <p>
                    <strong className="text-[#8A7F6E]">Repeating Numbers:</strong>{' '}
                    {grid.repeatingNumbers.map((r) => `${r.number} (×${r.count})`).join(', ') || 'None'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Section 6: Yogas Active */}
          {reportSections.yogas && (
            <div className="space-y-3 pb-5 border-b border-[#EADFC8] relative z-10">
              <h3 className="text-base font-bold font-serif text-[#E8A317]">
                06. {exportLanguage === 'hi' ? 'सक्रिय योग एवं तल' : 'Active Vedic Planes & Yogas'}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {yogasResult.yogas.map((y) => (
                  <div key={y.id} className="p-3 rounded-xl bg-white/80 border border-[#EADFC8] space-y-1">
                    <span className="font-bold font-serif text-[#14213D] text-xs">
                      {exportLanguage === 'hi' ? y.nameHi : y.nameEn} ({y.numbers.join('-')})
                    </span>
                    <p className="text-[#8A7F6E] text-[11px] leading-relaxed">
                      {exportLanguage === 'hi' ? y.impactHi : y.impactEn}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 16: Life Events Summary */}
          {reportSections.events && (
            <div className="space-y-3 pb-5 border-b border-[#EADFC8] relative z-10">
              <h3 className="text-base font-bold font-serif text-[#E8A317]">
                16. {exportLanguage === 'hi' ? '14 जीवन घटनाएं एवं स्कोर' : '14 Life Dimensions & Readiness'}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 text-xs">
                {eventsResult.scores.slice(0, 6).map((ev) => (
                  <div key={ev.event.id} className="p-2.5 rounded-lg bg-white/80 border border-[#EADFC8] flex justify-between items-center">
                    <span className="font-semibold text-[#14213D]">
                      {exportLanguage === 'hi' ? ev.event.name.hi : ev.event.name.en}
                    </span>
                    <span className="font-serif font-bold text-[#E8A317]">{ev.score}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 18: Custom & Prescribed Remedies */}
          <div className="space-y-3 relative z-10">
            <h3 className="text-base font-bold font-serif text-[#14213D] flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#E8A317]" />
              {exportLanguage === 'hi' ? 'वैदिक उपाय एवं अनुशंसाएं' : 'Prescribed Remedial Protocol'}
            </h3>
            <div className="space-y-2 text-xs">
              {customRemedies.map((cr, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-white border border-[#EADFC8] text-[#2B2B3A] flex items-start gap-2.5"
                >
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="text-xs leading-relaxed">{cr}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Document Footer Disclaimer */}
          <div className="pt-5 border-t-2 border-[#EADFC8] text-[10px] text-[#8A7F6E] text-center leading-relaxed relative z-10 space-y-1">
            <p>
              {exportLanguage === 'hi'
                ? 'यह फलादेश केवल मार्गदर्शन एवं ज्ञानवर्धन हेतु प्रस्तुत किया गया है।'
                : 'For guidance and entertainment only. Results are derived from ancient Vedic almanac formulas.'}
            </p>
            <p className="font-serif text-[#E8A317] font-semibold">
              NumeroTalk • Vedic Numerology Platform • ॐ तत्सत्
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
