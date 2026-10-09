'use client';

import React, { useTransition } from 'react';
import { usePathname, useRouter } from '@/i18n/routing';
import { useLocale } from 'next-intl';
import { Languages } from 'lucide-react';
import { cn } from '@/frontend/utils';

interface LanguageSwitcherProps {
  className?: string;
}

export function LanguageSwitcher({ className }: LanguageSwitcherProps) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const handleSwitch = (nextLocale: 'en' | 'hi') => {
    if (nextLocale === locale) return;

    if (typeof window !== 'undefined') {
      localStorage.setItem('NEXT_LOCALE', nextLocale);
      document.cookie = `NEXT_LOCALE=${nextLocale}; path=/; max-age=31536000; SameSite=Lax`;
    }

    startTransition(() => {
      router.replace(pathname, { locale: nextLocale });
    });
  };

  return (
    <div
      className={cn(
        'inline-flex items-center p-0.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--color-gold-hairline)] text-xs font-semibold select-none shadow-xs',
        isPending && 'opacity-60 pointer-events-none',
        className
      )}
    >
      <div className="pl-2 pr-1 text-[var(--color-primary-deep)]">
        <Languages className="w-3.5 h-3.5 stroke-[1.5]" />
      </div>

      <button
        type="button"
        onClick={() => handleSwitch('en')}
        className={cn(
          'px-2.5 py-1 rounded-lg transition-all duration-150 font-medium',
          locale === 'en'
            ? 'bg-[var(--color-primary)] text-[#3A2A14] font-bold shadow-xs'
            : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-surface-alt)]'
        )}
      >
        EN
      </button>

      <button
        type="button"
        onClick={() => handleSwitch('hi')}
        className={cn(
          'px-2.5 py-1 rounded-lg transition-all duration-150 font-medium',
          locale === 'hi'
            ? 'bg-[var(--color-primary)] text-[#3A2A14] font-bold shadow-xs'
            : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-surface-alt)]'
        )}
      >
        हिंदी
      </button>
    </div>
  );
}
