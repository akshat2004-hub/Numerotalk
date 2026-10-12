'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Link, usePathname, useRouter } from '@/i18n/routing';
import { useLocale } from 'next-intl';
import {
  Menu,
  FileText,
  ChevronDown,
  HelpCircle,
  Check
} from 'lucide-react';
import { SunMandalaIcon } from './SunMandalaIcon';
import { LinkButton } from '@/frontend/components/ui/LinkButton';
import { useNumerologyStore } from '@/frontend/store/useNumerologyStore';
import { cn } from '@/frontend/utils';

interface HeaderProps {
  onToggleSidebar?: () => void;
  onOpenHelp?: () => void;
}

export function Header({ onToggleSidebar }: HeaderProps) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  // Dropdown States
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const langRef = useRef<HTMLDivElement>(null);
  const reportSelection = useNumerologyStore((s) => s.reportSelection) || [];

  useEffect(() => {
    setMounted(true);
    // Force light theme only as specified
    document.documentElement.classList.remove('dark');
    localStorage.setItem('numerotalk-theme', 'light');

    const handleClickOutside = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSwitchLanguage = (nextLocale: 'en' | 'hi') => {
    if (nextLocale === locale) {
      setLangDropdownOpen(false);
      return;
    }
    if (typeof window !== 'undefined') {
      localStorage.setItem('NEXT_LOCALE', nextLocale);
      document.cookie = `NEXT_LOCALE=${nextLocale}; path=/; max-age=31536000; SameSite=Lax`;
    }
    setLangDropdownOpen(false);
    router.replace(pathname, { locale: nextLocale });
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 w-full h-[52px] bg-[var(--surface)] border-b border-[var(--border)] shadow-xs transition-colors">
        <div className="max-w-[1440px] h-full mx-auto px-2.5 sm:px-5 lg:px-6 flex items-center justify-between gap-1.5 sm:gap-2.5">
          {/* Left: Mobile Toggle + Logo */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {onToggleSidebar && (
              <button
                type="button"
                onClick={onToggleSidebar}
                className="lg:hidden p-1.5 rounded-[10px] text-[var(--text-muted)] hover:text-[var(--heading)] hover:bg-[var(--bg)] border border-[var(--border)] transition-colors cursor-pointer inline-flex flex-row items-center justify-center shrink-0 leading-none [&_svg]:block [&_svg]:shrink-0 [&_svg]:m-0"
                aria-label="Toggle navigation menu"
              >
                <Menu className="w-4 h-4 stroke-[2]" />
              </button>
            )}

            <Link href="/" className="flex items-center gap-1.5 group select-none shrink-0">
              <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-[var(--chip-bg)] flex items-center justify-center shrink-0 border border-[var(--border)]">
                <SunMandalaIcon size={16} className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[var(--gold)]" />
              </div>

              <div className="flex flex-col leading-none">
                <div className="flex items-baseline">
                  <span className="font-serif font-bold text-sm sm:text-base tracking-tight text-[var(--heading)]">
                    Numero
                  </span>
                  <span className="font-serif font-bold text-sm sm:text-base tracking-tight text-[var(--gold)] ml-0.5">
                    Talk
                  </span>
                </div>
                <span className="text-[9.5px] font-normal text-[var(--text-muted)] tracking-tight mt-0.5 hidden md:inline">
                  {locale === 'hi' ? 'वैदिक ज्ञान · आधुनिक जीवन' : 'Vedic Wisdom for Modern Life'}
                </span>
              </div>
            </Link>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Language Selector */}
            <div className="relative" ref={langRef}>
              <button
                type="button"
                onClick={() => setLangDropdownOpen((v) => !v)}
                className="inline-flex flex-row items-center justify-center gap-1 h-7 sm:h-8 px-2 sm:px-2.5 rounded-[10px] sm:rounded-[12px] border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--bg)] transition-colors text-[11px] sm:text-xs font-semibold text-[var(--heading)] cursor-pointer select-none leading-none shrink-0 whitespace-nowrap"
                aria-label="Language selector"
              >
                <span className="whitespace-nowrap leading-none">{locale === 'hi' ? 'हिंदी' : 'EN'}</span>
                <ChevronDown className="w-3 h-3 text-[var(--text-muted)] shrink-0 block m-0" />
              </button>

              {langDropdownOpen && (
                <div className="absolute right-0 mt-1.5 w-28 rounded-xl bg-[var(--surface)] border border-[var(--border)] shadow-xl p-1 z-50 text-xs animate-in fade-in">
                  <button
                    type="button"
                    onClick={() => handleSwitchLanguage('en')}
                    className={cn(
                      'w-full inline-flex flex-row items-center justify-between px-2.5 py-1.5 rounded-lg transition-colors font-medium cursor-pointer whitespace-nowrap leading-none',
                      locale === 'en'
                        ? 'bg-[var(--chip-bg)] text-[var(--gold)] font-bold'
                        : 'text-[var(--text)] hover:bg-[var(--bg)]'
                    )}
                  >
                    <span>English</span>
                    {locale === 'en' && <Check className="w-3 h-3 text-[var(--gold)] shrink-0 block m-0" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSwitchLanguage('hi')}
                    className={cn(
                      'w-full inline-flex flex-row items-center justify-between px-2.5 py-1.5 rounded-lg transition-colors font-medium cursor-pointer whitespace-nowrap leading-none',
                      locale === 'hi'
                        ? 'bg-[var(--chip-bg)] text-[var(--gold)] font-bold'
                        : 'text-[var(--text)] hover:bg-[var(--bg)]'
                    )}
                  >
                    <span>हिंदी</span>
                    {locale === 'hi' && <Check className="w-3 h-3 text-[var(--gold)] shrink-0 block m-0" />}
                  </button>
                </div>
              )}
            </div>

            {/* Help "?" Button */}
            <Link
              href="/help"
              title={locale === 'hi' ? 'मार्गदर्शन एवं सहायता' : 'Vedic Help & Guide'}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-[10px] sm:rounded-[12px] border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--bg)] inline-flex flex-row items-center justify-center text-[var(--heading)] hover:text-[var(--gold)] transition-colors cursor-pointer select-none shrink-0 leading-none [&_svg]:block [&_svg]:shrink-0 [&_svg]:m-0"
              aria-label="Help & Guide"
            >
              <HelpCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2]" />
            </Link>

            {/* Report CTA Button */}
            <LinkButton
              href="/report"
              size="sm"
              variant="primary"
              className="h-7 sm:h-8 px-2 sm:px-3 text-xs"
              icon={<FileText className="w-3.5 h-3.5 stroke-[2]" />}
            >
              <span className="inline-flex items-center gap-1.5 leading-none">
                <span className="hidden min-[380px]:inline">{locale === 'hi' ? 'रिपोर्ट' : 'Report'}</span>
                {mounted && reportSelection.length > 0 && (
                  <span className="inline-flex items-center justify-center min-w-[15px] h-3.5 px-1 rounded-full text-[9.5px] font-bold bg-white text-[var(--gold)] leading-none shadow-2xs">
                    {reportSelection.length}
                  </span>
                )}
              </span>
            </LinkButton>
          </div>
        </div>
      </header>
  );
}

// Alias AppHeader as requested
export const AppHeader = Header;
