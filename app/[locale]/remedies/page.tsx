'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Sparkles, PlusCircle, Check, Clock, Plus } from 'lucide-react';
import { SectionHeader } from '@/frontend/components/ui/SectionHeader';
import { NumberBadge } from '@/frontend/components/ui/NumberBadge';
import { Button } from '@/frontend/components/ui/Button';
import { Input } from '@/frontend/components/ui/Input';
import { Select } from '@/frontend/components/ui/Select';
import { useNumerologyStore } from '@/frontend/store/useNumerologyStore';
import { numerologyService } from '@/frontend';
import { RemedyMasterItem } from '@/types';

export default function RemediesPage() {
  const t = useTranslations('remediesPage');
  const locale = (useLocale() || 'en') as 'en' | 'hi';
  const { reportSections, toggleReportSection, addCustomRemedy } = useNumerologyStore();

  const [remedies, setRemedies] = useState<RemedyMasterItem[]>([]);

  // Add custom remedy state
  const [customTitle, setCustomTitle] = useState('');
  const [customCategory, setCustomCategory] = useState<'color' | 'gemstone' | 'mantra' | 'donation' | 'habit' | 'direction'>('mantra');
  const [customDesc, setCustomDesc] = useState('');
  const [customAdded, setCustomAdded] = useState(false);

  useEffect(() => {
    numerologyService
      .getRemediesMasterList({}, locale)
      .then(setRemedies);
  }, [locale]);

  // Handle deep-linking (#remedy_id)
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash) {
      const id = window.location.hash.replace('#', '');
      const el = document.getElementById(id);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          el.classList.add('ring-2', 'ring-[var(--gold)]');
          setTimeout(() => el.classList.remove('ring-2', 'ring-[var(--gold)]'), 2500);
        }, 300);
      }
    }
  }, [remedies]);

  // Grouped sections by category
  const groupedRemedies = useMemo(() => {
    const map = new Map<string, { titleEn: string; titleHi: string; items: RemedyMasterItem[] }>();

    remedies.forEach((rem) => {
      const catKey = rem.category || 'General';
      if (!map.has(catKey)) {
        map.set(catKey, {
          titleEn: rem.category || 'General Lifestyle & Vedic Practices',
          titleHi: rem.categoryHi || rem.category || 'दैनिक आचरण व वैदिक उपाय',
          items: []
        });
      }
      map.get(catKey)!.items.push(rem);
    });

    return Array.from(map.values());
  }, [remedies]);

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
        title={locale === 'hi' ? 'वैदिक' : 'Vedic'}
        goldTitle={locale === 'hi' ? 'उपाय' : 'Remedies'}
        subtitle={
          locale === 'hi'
            ? 'दैनिक जीवन, रंग, धातु व मंत्रों के समन्वय द्वारा ऊर्जा संतुलन।'
            : 'Astrological harmonies, lifestyle adjustments, gemstones, and Vedic mantras for energy alignment.'
        }
        icon={<Sparkles className="w-5 h-5 stroke-[1.5]" />}
      />

      {/* Add Custom Remedy Form Card — Compact & Premium */}
      <div className="vedic-card p-4 sm:p-5 space-y-3.5">
        <h3 className="font-serif text-sm sm:text-base font-bold text-[var(--heading)] flex items-center gap-2">
          <PlusCircle className="w-4 h-4 text-[var(--gold)] shrink-0" />
          <span>{locale === 'hi' ? 'व्यक्तिगत उपाय जोड़ें (रिपोर्ट हेतु)' : 'Add Custom Remedy (For Report)'}</span>
        </h3>

        <form onSubmit={handleAddCustomRemedy} className="flex flex-col lg:flex-row items-end gap-3 w-full">
          {/* Category Select: 180px on desktop */}
          <div className="w-full lg:w-[180px] shrink-0">
            <Select
              label={locale === 'hi' ? 'श्रेणी' : 'Category'}
              value={customCategory}
              onChange={(e) => setCustomCategory(e.target.value as any)}
            >
              <option value="color">{locale === 'hi' ? 'Color (रंग)' : 'Color Therapy'}</option>
              <option value="gemstone">{locale === 'hi' ? 'Gemstone (रत्न)' : 'Gemstone'}</option>
              <option value="mantra">{locale === 'hi' ? 'Mantra (मंत्र)' : 'Mantra & Chanting'}</option>
              <option value="donation">{locale === 'hi' ? 'Donation (दान)' : 'Donation & Charity'}</option>
              <option value="habit">{locale === 'hi' ? 'Habit (आचरण)' : 'Habit & Lifestyle'}</option>
              <option value="direction">{locale === 'hi' ? 'Direction (दिशा)' : 'Vastu & Direction'}</option>
            </Select>
          </div>

          {/* Title Input: flex-1 */}
          <div className="w-full lg:flex-1 min-w-0">
            <Input
              label={locale === 'hi' ? 'उपाय शीर्षक' : 'Remedy Title'}
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
              placeholder="e.g. गायत्री मंत्र 108 जप / Water Offering"
              required
            />
          </div>

          {/* Description Input: flex-2 */}
          <div className="w-full lg:flex-[2] min-w-0">
            <Input
              label={locale === 'hi' ? 'विस्तार / विधि' : 'Description / Method'}
              value={customDesc}
              onChange={(e) => setCustomDesc(e.target.value)}
              placeholder="e.g. सूर्योदय के समय पूर्व दिशा की ओर..."
            />
          </div>

          {/* Submit Button: Single line, icon 16px inline left, md button (40px high, 14px text, px 16) */}
          <div className="w-full lg:w-auto shrink-0">
            <Button
              type="submit"
              variant="primary"
              size="md"
              className="w-full lg:w-auto whitespace-nowrap"
            >
              {customAdded ? (
                <>
                  <Check className="w-4 h-4 mr-1.5" />
                  <span>{locale === 'hi' ? 'जोड़ा गया!' : 'Added!'}</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-1.5" />
                  <span>{locale === 'hi' ? 'रिपोर्ट में जोड़ें' : 'Add to Report'}</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </div>

      {/* Grouped Remedy Sections by Category — No Filter UI */}
      <div className="space-y-7">
        {groupedRemedies.map((group, gIdx) => (
          <div key={`grp-${gIdx}`} className="space-y-3.5">
            {/* Category Heading */}
            <div className="flex items-center gap-2 pb-1 border-b border-[var(--border)]">
              <span className="w-2 h-2 rounded-full bg-[var(--gold)]" />
              <h3 className="font-serif font-bold text-base sm:text-lg text-[var(--heading)]">
                {locale === 'hi' ? group.titleHi : group.titleEn}
              </h3>
              <span className="text-xs text-[var(--text-muted)] font-mono ml-auto lining-nums">
                ({group.items.length})
              </span>
            </div>

            {/* Remedies Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {group.items.map((rem) => {
                const sectionKey = `remedy_${rem.id}`;
                const isAdded = !!reportSections?.[sectionKey];

                return (
                  <div
                    key={rem.id}
                    id={rem.id}
                    className="vedic-card p-4 sm:p-5 flex flex-col justify-between space-y-3 transition-all scroll-mt-24"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3 pb-2.5 border-b border-[var(--border)]">
                        <div>
                          <span className="text-[9.5px] font-bold px-2 py-0.5 rounded-full bg-[var(--chip-bg)] text-[var(--gold)] border border-[var(--border)]">
                            {locale === 'hi' ? rem.categoryHi || rem.category : rem.category}
                          </span>
                          <h4 className="text-sm sm:text-base font-bold font-serif text-[var(--heading)] mt-1.5">
                            {locale === 'hi' ? rem.title.hi : rem.title.en}
                          </h4>
                        </div>

                        <NumberBadge number={rem.governingNumber} size="sm" variant="gold" />
                      </div>

                      <p className="text-[12px] sm:text-[12.5px] text-[var(--text)] leading-relaxed mt-2.5">
                        {locale === 'hi' ? rem.overview.hi : rem.overview.en}
                      </p>

                      <div className="mt-2.5 p-3 rounded-xl bg-[var(--surface-muted)]/50 border border-[var(--border)] text-xs space-y-0.5">
                        <span className="font-bold text-[var(--gold)] block">{t('method')}</span>
                        <p className="text-[var(--text)] leading-relaxed">
                          {locale === 'hi' ? rem.method.hi : rem.method.en}
                        </p>
                      </div>
                    </div>

                    <div className="pt-2.5 border-t border-[var(--border)] flex items-center justify-between text-xs text-[var(--text-muted)]">
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-[var(--gold)] shrink-0" />
                        <span>{locale === 'hi' ? rem.bestDayTime.hi : rem.bestDayTime.en}</span>
                      </span>

                      <button
                        type="button"
                        onClick={() => toggleReportSection(sectionKey)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                          isAdded
                            ? 'bg-[var(--success-bg)] text-[var(--success-text)] border border-[var(--success-border)]'
                            : 'bg-[var(--chip-bg)] text-[var(--gold)] hover:bg-[var(--active-bg)] border border-[var(--border)]'
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
        ))}
      </div>
    </div>
  );
}
