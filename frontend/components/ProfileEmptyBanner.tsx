'use client';

import React from 'react';
import { Link } from '@/i18n/routing';
import { User, AlertCircle, ArrowRight } from 'lucide-react';
import { useNumerologyStore } from '@/lib/store/useNumerologyStore';
import { useLocale } from 'next-intl';

export function ProfileEmptyBanner({ locale: propLocale }: { locale?: 'en' | 'hi' } = {}) {
  const profile = useNumerologyStore((s) => s.profile);
  const hookLocale = useLocale();
  const locale = propLocale || hookLocale;

  const isProfileEmpty = !profile?.name?.trim() || !profile?.dob?.trim();

  if (!isProfileEmpty) return null;

  return (
    <div className="mb-5 p-3.5 sm:p-4 rounded-[20px] bg-[var(--chip-bg)] border border-[var(--border)] flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs animate-in fade-in">
      <div className="flex items-center gap-2.5 text-center sm:text-left">
        <div className="w-8 h-8 rounded-full bg-[var(--surface)] text-[var(--gold)] flex items-center justify-center shrink-0 border border-[var(--border)]">
          <AlertCircle className="w-4 h-4 stroke-[2]" />
        </div>
        <div>
          <h4 className="font-serif font-bold text-xs sm:text-sm text-[var(--heading)]">
            {locale === 'hi' ? 'कृपया पहले अपना विवरण भरें' : 'Fill your details first'}
          </h4>
          <p className="text-[11px] text-[var(--text-muted)]">
            {locale === 'hi'
              ? 'सटीक वैदिक भविष्यवाणियों के लिए मॉड्यूल 01 में अपना नाम और जन्मतिथि दर्ज करें।'
              : 'Enter your name and DOB in Module 1 to unlock personalized readings across all modules.'}
          </p>
        </div>
      </div>

      <Link
        href="/"
        className="btn-gold-gradient px-3.5 py-1.5 rounded-xl text-xs font-semibold shrink-0 flex items-center gap-1.5 shadow-xs"
      >
        <span>{locale === 'hi' ? 'मॉड्यूल 01 पर जाएं' : 'Go to Module 1'}</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </Link>
    </div>
  );
}
