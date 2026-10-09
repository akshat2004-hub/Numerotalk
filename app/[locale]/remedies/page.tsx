'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Sparkles, Search, PlusCircle, Check, Clock, Plus, BookOpen } from 'lucide-react';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { NumberBadge } from '@/components/ui/NumberBadge';
import { GoldButton } from '@/components/ui/GoldButton';
import { useNumerologyStore } from '@/lib/store/useNumerologyStore';
import { numerologyService } from '@/lib';
import { RemedyMasterItem } from '@/types';

export default function RemediesPage() {
  const t = useTranslations('remediesPage');
  const locale = (useLocale() || 'en') as 'en' | 'hi';
  const { reportSections, toggleReportSection, addCustomRemedy } = useNumerologyStore();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedNumber, setSelectedNumber] = useState<number>(0);
  const [remedies, setRemedies] = useState<RemedyMasterItem[]>([]);

  // Add custom remedy state
  const [customTitle, setCustomTitle] = useState('');
  const [customCategory, setCustomCategory] = useState<'color' | 'gemstone' | 'mantra' | 'donation' | 'habit' | 'direction'>('mantra');
  const [customDesc, setCustomDesc] = useState('');
  const [customAdded, setCustomAdded] = useState(false);

  useEffect(() => {
    numerologyService
      .getRemediesMasterList(
        {
          query: search,
          category: selectedCategory,
          number: selectedNumber,
        },
        locale
      )
      .then(setRemedies);
  }, [search, selectedCategory, selectedNumber, locale]);

  const categories = [
    { id: 'all', labelEn: 'All Categories', labelHi: 'सभी श्रेणियां' },
    { id: 'color', labelEn: 'Color Therapy', labelHi: 'रंग चिकित्सा (Color)' },
    { id: 'gemstone', labelEn: 'Gemstones', labelHi: 'रत्न (Gemstone)' },
    { id: 'mantra', labelEn: 'Mantra & Chanting', labelHi: 'मंत्र एवं जप (Mantra)' },
    { id: 'donation', labelEn: 'Donation & Charity', labelHi: 'दान एवं सेवा (Donation)' },
    { id: 'habit', labelEn: 'Habit & Lifestyle', labelHi: 'दैनिक आचरण (Habit)' },
    { id: 'direction', labelEn: 'Vastu & Direction', labelHi: 'दिशा एवं वास्तु (Direction)' },
  ];

  const handleAddCustomRemedy = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTitle.trim()) return;
    addCustomRemedy(`${customCategory.toUpperCase()}: ${customTitle} — ${customDesc}`);
    setCustomTitle('');
    setCustomDesc('');
    setCustomAdded(true);
    setTimeout(() => setCustomAdded(false), 2500);
  };

  return (
    <div className="space-y-6 sm:space-y-7">
      <SectionHeader
        title={t('title')}
        subtitle={t('subtitle')}
        badge={locale === 'hi' ? 'उपाय महासंग्रह 18' : 'REMEDY MASTER 18'}
        icon={<Sparkles className="w-5 h-5 stroke-[1.5]" />}
      />

      {/* Filter and Search Bar */}
      <div className="vedic-card p-4 sm:p-5 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Search */}
          <div className="relative sm:col-span-1">
            <Search className="absolute left-3.5 top-3 w-3.5 h-3.5 text-[var(--text-muted)]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('searchPlaceholder')}
              className="w-full pl-9 pr-3 py-1.5 h-[40px] rounded-xl bg-[var(--surface)] border border-[var(--input-border)] text-xs text-[var(--heading)] outline-hidden focus:border-[var(--gold)]"
            />
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-1.5 h-[40px] rounded-xl bg-[var(--surface)] border border-[var(--input-border)] text-xs text-[var(--heading)] outline-hidden focus:border-[var(--gold)]"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {locale === 'hi' ? cat.labelHi : cat.labelEn}
                </option>
              ))}
            </select>
          </div>

          {/* Number Selector */}
          <div>
            <select
              value={selectedNumber}
              onChange={(e) => setSelectedNumber(Number(e.target.value))}
              className="w-full px-3 py-1.5 h-[40px] rounded-xl bg-[var(--surface)] border border-[var(--input-border)] text-xs text-[var(--heading)] outline-hidden focus:border-[var(--gold)]"
            >
              <option value={0}>
                {locale === 'hi' ? 'सभी अंक (1 - 9)' : 'All Numbers (1 - 9)'}
              </option>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                <option key={n} value={n}>
                  {locale === 'hi' ? `अंक ${n}` : `Number ${n}`}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick Filter Pill Buttons */}
        <div className="flex flex-wrap gap-1.5 pt-2 border-t border-[var(--border)]">
          {categories.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setSelectedCategory(c.id)}
              className={`px-2.5 py-1 rounded-full text-[10.5px] font-semibold transition-all cursor-pointer ${
                selectedCategory === c.id
                  ? 'bg-[var(--gold)] text-slate-900 font-bold shadow-xs'
                  : 'bg-[var(--surface)] border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--heading)]'
              }`}
            >
              {locale === 'hi' ? c.labelHi : c.labelEn}
            </button>
          ))}
        </div>
      </div>

      {/* Add Custom Remedy Form Card */}
      <div className="vedic-card p-4 sm:p-5 space-y-3">
        <h3 className="font-serif text-sm sm:text-base font-bold text-[var(--heading)] flex items-center gap-1.5">
          <PlusCircle className="w-4 h-4 text-[var(--gold)]" />
          <span>{locale === 'hi' ? 'व्यक्तिगत उपाय जोड़ें (रिपोर्ट हेतु)' : 'Add Custom Remedy (For Report)'}</span>
        </h3>
        <form onSubmit={handleAddCustomRemedy} className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
          <div>
            <label className="block text-[10.5px] text-[var(--text-muted)] font-medium mb-1">
              {locale === 'hi' ? 'श्रेणी' : 'Category'}
            </label>
            <select
              value={customCategory}
              onChange={(e) => setCustomCategory(e.target.value as any)}
              className="w-full px-3 py-1.5 h-[38px] rounded-xl bg-[var(--surface)] border border-[var(--input-border)] text-xs text-[var(--heading)] outline-hidden focus:border-[var(--gold)]"
            >
              <option value="color">Color (रंग)</option>
              <option value="gemstone">Gemstone (रत्न)</option>
              <option value="mantra">Mantra (मंत्र)</option>
              <option value="donation">Donation (दान)</option>
              <option value="habit">Habit (आचरण)</option>
              <option value="direction">Direction (दिशा)</option>
            </select>
          </div>

          <div>
            <label className="block text-[10.5px] text-[var(--text-muted)] font-medium mb-1">
              {locale === 'hi' ? 'उपाय शीर्षक' : 'Remedy Title'}
            </label>
            <input
              type="text"
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
              placeholder="e.g. गायत्री मंत्र 108 जप / Water Offering"
              className="w-full px-3 py-1.5 h-[38px] rounded-xl bg-[var(--surface)] border border-[var(--input-border)] text-xs text-[var(--heading)] outline-hidden focus:border-[var(--gold)]"
              required
            />
          </div>

          <div>
            <label className="block text-[10.5px] text-[var(--text-muted)] font-medium mb-1">
              {locale === 'hi' ? 'विस्तार / विधि' : 'Description / Method'}
            </label>
            <input
              type="text"
              value={customDesc}
              onChange={(e) => setCustomDesc(e.target.value)}
              placeholder="e.g. सूर्योदय के समय पूर्व दिशा की ओर..."
              className="w-full px-3 py-1.5 h-[38px] rounded-xl bg-[var(--surface)] border border-[var(--input-border)] text-xs text-[var(--heading)] outline-hidden focus:border-[var(--gold)]"
            />
          </div>

          <div>
            <GoldButton type="submit" size="sm" className="w-full h-[38px] text-xs">
              {customAdded ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>{locale === 'hi' ? 'जोड़ा गया!' : 'Added!'}</span>
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5" />
                  <span>{locale === 'hi' ? 'रिपोर्ट में जोड़ें' : 'Add to Report'}</span>
                </>
              )}
            </GoldButton>
          </div>
        </form>
      </div>

      {/* Remedies Cards Grid with "Add to report" */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {remedies.map((rem) => {
          const sectionKey = `remedy_${rem.id}`;
          const isAdded = !!reportSections?.[sectionKey];

          return (
            <div key={rem.id} className="vedic-card p-4 sm:p-5 flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-start justify-between gap-3 pb-2.5 border-b border-[var(--border)]">
                  <div>
                    <span className="text-[9.5px] font-bold px-2 py-0.5 rounded-full bg-[var(--chip-bg)] text-[var(--gold)] border border-[var(--border)]">
                      {rem.category}
                    </span>
                    <h3 className="text-sm sm:text-base font-bold font-serif text-[var(--heading)] mt-1">
                      {locale === 'hi' ? rem.title.hi : rem.title.en}
                    </h3>
                  </div>

                  <NumberBadge number={rem.governingNumber} size="sm" variant="gold" />
                </div>

                <p className="text-[11.5px] sm:text-xs text-[var(--text)] leading-relaxed mt-2.5">
                  {locale === 'hi' ? rem.overview.hi : rem.overview.en}
                </p>

                <div className="mt-2.5 p-2.5 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-[11px] space-y-0.5">
                  <span className="font-bold text-[var(--gold)] block">{t('method')}</span>
                  <p className="text-[var(--text)] leading-relaxed">
                    {locale === 'hi' ? rem.method.hi : rem.method.en}
                  </p>
                </div>
              </div>

              <div className="pt-2.5 border-t border-[var(--border)] flex items-center justify-between text-[11px] text-[var(--text-muted)]">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-[var(--gold)]" />
                  <span>{locale === 'hi' ? rem.bestDayTime.hi : rem.bestDayTime.en}</span>
                </span>

                <button
                  type="button"
                  onClick={() => toggleReportSection(sectionKey)}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10.5px] font-semibold transition-all cursor-pointer ${
                    isAdded
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                      : 'bg-[var(--chip-bg)] text-[var(--gold)] hover:bg-[var(--active-bg)] border border-[var(--border)]'
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span>{locale === 'hi' ? 'रिपोर्ट में शामिल' : 'In Report'}</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-3 h-3 text-[var(--gold)]" />
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
  );
}
