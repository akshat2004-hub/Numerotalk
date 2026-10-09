'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { HelpCircle, Sparkles, BookOpen, CheckCircle2, AlertCircle } from 'lucide-react';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { numerologyService } from '@/lib';
import { HelpTipItem } from '@/types';

export default function HelpPage() {
  const t = useTranslations('helpPage');
  const locale = (useLocale() || 'en') as 'en' | 'hi';

  const [tips, setTips] = useState<HelpTipItem[]>([]);

  useEffect(() => {
    numerologyService.getHelpTips(locale).then(setTips);
  }, [locale]);

  return (
    <div className="space-y-6 sm:space-y-7">
      <SectionHeader
        title={t('title')}
        subtitle={t('subtitle')}
        badge={locale === 'hi' ? 'मार्गदर्शन सूत्र 17' : 'Prediction Guide 17'}
        icon={<HelpCircle className="w-5 h-5 sm:w-6 sm:h-6" />}
      />

      <div className="space-y-3">
        {tips.map((tip, idx) => (
          <div key={tip.id} className="vedic-card p-3.5 sm:p-4 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-md bg-[var(--color-gold-soft)]/40 text-[var(--color-primary-deep)] font-serif font-bold text-[11px] flex items-center justify-center border border-[var(--color-gold-hairline)]">
                  0{idx + 1}
                </span>
                <h3 className="text-sm sm:text-base font-bold font-serif text-[var(--text-main)]">
                  {locale === 'hi' ? tip.topic.hi : tip.topic.en}
                </h3>
              </div>

              <span className="text-[9.5px] font-bold px-2 py-0.5 rounded-full border bg-[var(--color-gold-soft)]/30 text-[var(--color-primary-deep)] border-[var(--color-gold-hairline)]">
                {tip.importance}
              </span>
            </div>

            <p className="text-xs sm:text-[12.5px] text-[var(--text-muted)] leading-relaxed pl-8">
              {locale === 'hi' ? tip.content.hi : tip.content.en}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
