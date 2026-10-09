'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { ShieldCheck, Info } from 'lucide-react';
import { useNumerologyStore } from '@/frontend/store/useNumerologyStore';

export function DisclaimerFooter() {
  const t = useTranslations('common');
  const tp = useTranslations('profile');
  const resetProfile = useNumerologyStore((s) => s.resetProfile);

  return (
    <footer className="w-full mt-8 border-t border-[var(--border)] bg-[var(--surface)] py-3.5 px-4 sm:px-6 lg:px-8 text-[11px] text-[var(--text-muted)] transition-colors relative z-10">
      <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Left: Brand & Disclaimer */}
        <div className="flex items-center gap-2 text-center md:text-left">
          <Info className="w-3.5 h-3.5 text-[var(--gold)] stroke-[2] shrink-0" />
          <p className="leading-relaxed">
            <span className="font-semibold text-[var(--heading)]">Disclaimer: </span>
            For guidance and entertainment only. {t('disclaimer')}
          </p>
        </div>

        {/* Right: DPDP compliance note & Clear data button */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-1 text-emerald-700 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 stroke-[2]" />
            <span>DPDP Compliant (Local Storage)</span>
          </div>

          <button
            type="button"
            onClick={resetProfile}
            className="text-[11px] text-rose-600 hover:underline underline-offset-4 transition-colors font-medium cursor-pointer"
          >
            {tp('deleteMyData')}
          </button>
        </div>
      </div>
    </footer>
  );
}
