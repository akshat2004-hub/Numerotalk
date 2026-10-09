'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Link, usePathname, useRouter } from '@/i18n/routing';
import { useLocale } from 'next-intl';
import {
  Menu,
  FileText,
  User,
  ChevronDown,
  HelpCircle,
  Bell,
  Sparkles,
  Phone,
  Check
} from 'lucide-react';
import { SunMandalaIcon } from './SunMandalaIcon';
import { HelpModal } from './HelpModal';
import { useNumerologyStore } from '@/lib/store/useNumerologyStore';
import { calculateMulank, calculateBhagyank } from '@/lib/engine';
import { cn } from '@/lib/utils';

interface HeaderProps {
  onToggleSidebar?: () => void;
  onOpenHelp?: () => void;
}

export function Header({ onToggleSidebar, onOpenHelp }: HeaderProps) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const profile = useNumerologyStore((s) => s.profile);

  // Help Modal State
  const [helpOpen, setHelpOpen] = useState(false);

  // Dropdown States
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);

  const userRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Force light theme only as specified
    document.documentElement.classList.remove('dark');
    localStorage.setItem('numerotalk-theme', 'light');

    const handleClickOutside = (e: MouseEvent) => {
      if (userRef.current && !userRef.current.contains(e.target as Node)) {
        setUserDropdownOpen(false);
      }
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifDropdownOpen(false);
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

  const mulank = profile.dob ? calculateMulank(profile.dob).mulank : 5;
  const bhagyank = profile.dob ? calculateBhagyank(profile.dob).bhagyank : 3;
  const userName = profile.name || 'Rahul Sharma';

  const triggerHelp = () => {
    if (onOpenHelp) onOpenHelp();
    else setHelpOpen(true);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full h-[52px] bg-[var(--surface)] border-b border-[var(--border)] shadow-xs transition-colors">
        <div className="max-w-[1440px] h-full mx-auto px-3 sm:px-5 lg:px-6 flex items-center justify-between gap-2.5">
          
          {/* Left: Mobile Toggle + Logo + Clean Tagline */}
          <div className="flex items-center gap-2">
            {onToggleSidebar && (
              <button
                type="button"
                onClick={onToggleSidebar}
                className="lg:hidden p-1 rounded-lg text-[var(--text-muted)] hover:text-[var(--heading)] hover:bg-[var(--bg)] border border-[var(--border)] transition-colors cursor-pointer"
                aria-label="Toggle navigation menu"
              >
                <Menu className="w-4 h-4 stroke-[2]" />
              </button>
            )}

            <Link href="/" className="flex items-center gap-1.5 group select-none">
              {/* Clean Gold Sun Icon */}
              <div className="w-7 h-7 rounded-lg bg-[var(--chip-bg)] flex items-center justify-center shrink-0 border border-[var(--border)]">
                <SunMandalaIcon size={18} className="w-4 h-4 text-[var(--gold)]" />
              </div>

              {/* Wordmark and Tagline */}
              <div className="flex flex-col leading-none">
                <div className="flex items-baseline">
                  <span className="font-serif font-bold text-sm sm:text-base tracking-tight text-[var(--heading)]">
                    Numero
                  </span>
                  <span className="font-serif font-bold text-sm sm:text-base tracking-tight text-[var(--gold)] ml-0.5">
                    Talk
                  </span>
                </div>
                <span className="text-[9.5px] font-normal text-[var(--text-muted)] tracking-tight mt-0.5">
                  {locale === 'hi' ? 'वैदिक ज्ञान · आधुनिक जीवन' : 'Vedic Wisdom for Modern Life'}
                </span>
              </div>
            </Link>
          </div>

          {/* Center / Right: Compact SaaS Controls */}
          <div className="flex items-center gap-2">
            
            {/* User Profile + Mulank/Bhagyank */}
            <div className="relative" ref={userRef}>
              <button
                type="button"
                onClick={() => setUserDropdownOpen((v) => !v)}
                className="hidden md:flex items-center gap-1.5 h-8 px-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--bg)] transition-colors text-[11.5px] cursor-pointer select-none"
                aria-expanded={userDropdownOpen}
              >
                <div className="w-4 h-4 rounded-full bg-[var(--chip-bg)] text-[var(--gold)] flex items-center justify-center font-bold text-[9px]">
                  <User className="w-2.5 h-2.5 stroke-[2]" />
                </div>
                <span className="font-medium text-[var(--heading)] max-w-[100px] truncate">
                  {userName}
                </span>
                <ChevronDown className="w-3 h-3 text-[var(--text-muted)] shrink-0" />

                {/* Hairline Divider */}
                <div className="w-px h-2.5 bg-[var(--border)] mx-0.5" />

                {/* Mulank & Bhagyank Compact Pills */}
                <div className="flex items-center gap-1 text-[10.5px]">
                  <span className="text-[var(--text-muted)]">M:</span>
                  <span className="px-1.5 py-0.2 rounded bg-[var(--chip-bg)] text-[var(--gold)] font-bold text-[10px] border border-[var(--border)]">
                    {mulank}
                  </span>
                  <span className="text-[var(--text-muted)] ml-0.5">B:</span>
                  <span className="px-1.5 py-0.2 rounded bg-[var(--chip-bg)] text-[var(--gold)] font-bold text-[10px] border border-[var(--border)]">
                    {bhagyank}
                  </span>
                </div>
              </button>

              {/* User Dropdown */}
              {userDropdownOpen && (
                <div className="absolute right-0 mt-1.5 w-56 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-xl p-2.5 z-50 text-xs animate-in fade-in">
                  <div className="flex items-center gap-2 pb-2 mb-2 border-b border-[var(--border)]">
                    <div className="w-7 h-7 rounded-full bg-[var(--chip-bg)] text-[var(--gold)] flex items-center justify-center font-bold text-xs">
                      {userName.charAt(0)}
                    </div>
                    <div className="truncate">
                      <p className="font-bold text-[var(--heading)] truncate">{userName}</p>
                      <p className="text-[10.5px] text-[var(--text-muted)] flex items-center gap-1">
                        <Phone className="w-2.5 h-2.5 text-[var(--gold)]" />
                        <span>{profile.mobile || '9876543210'}</span>
                      </p>
                    </div>
                  </div>

                  <div className="space-y-1 pb-2 border-b border-[var(--border)] text-[var(--text)]">
                    <div className="flex items-center justify-between py-1 px-2 rounded-lg bg-[var(--bg)]">
                      <span>{locale === 'hi' ? 'जन्म तिथि' : 'Date of Birth'}:</span>
                      <strong className="text-[var(--heading)] font-mono">{profile.dob || '1995-10-23'}</strong>
                    </div>
                    <div className="flex items-center justify-between py-1 px-2 rounded-lg bg-[var(--bg)]">
                      <span>{locale === 'hi' ? 'पद्धति' : 'System'}:</span>
                      <strong className="text-[var(--gold)] capitalize">{profile.destinySystem || 'Chaldean'}</strong>
                    </div>
                  </div>

                  <Link
                    href="/"
                    onClick={() => setUserDropdownOpen(false)}
                    className="mt-2 w-full flex items-center justify-center gap-1.5 py-1.5 rounded-xl bg-[var(--chip-bg)] text-[var(--gold)] font-semibold hover:bg-[var(--active-bg)] transition-colors"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>{locale === 'hi' ? 'प्रोफ़ाइल संपादित करें' : 'Edit Profile'}</span>
                  </Link>
                </div>
              )}
            </div>

            {/* Language Selector */}
            <div className="relative" ref={langRef}>
              <button
                type="button"
                onClick={() => setLangDropdownOpen((v) => !v)}
                className="flex items-center gap-1 h-8 px-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--bg)] transition-colors text-xs font-semibold text-[var(--heading)] cursor-pointer"
                aria-label="Language selector"
              >
                <span>{locale === 'hi' ? 'हिंदी' : 'EN'}</span>
                <ChevronDown className="w-3 h-3 text-[var(--text-muted)]" />
              </button>

              {langDropdownOpen && (
                <div className="absolute right-0 mt-1.5 w-28 rounded-xl bg-[var(--surface)] border border-[var(--border)] shadow-xl p-1 z-50 text-xs animate-in fade-in">
                  <button
                    type="button"
                    onClick={() => handleSwitchLanguage('en')}
                    className={cn(
                      'w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg transition-colors font-medium cursor-pointer',
                      locale === 'en'
                        ? 'bg-[var(--chip-bg)] text-[var(--gold)] font-bold'
                        : 'text-[var(--text)] hover:bg-[var(--bg)]'
                    )}
                  >
                    <span>English</span>
                    {locale === 'en' && <Check className="w-3 h-3 text-[var(--gold)]" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSwitchLanguage('hi')}
                    className={cn(
                      'w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg transition-colors font-medium cursor-pointer',
                      locale === 'hi'
                        ? 'bg-[var(--chip-bg)] text-[var(--gold)] font-bold'
                        : 'text-[var(--text)] hover:bg-[var(--bg)]'
                    )}
                  >
                    <span>हिंदी</span>
                    {locale === 'hi' && <Check className="w-3 h-3 text-[var(--gold)]" />}
                  </button>
                </div>
              )}
            </div>

            {/* Help "?" Button: Opens Help POPUP Modal */}
            <button
              type="button"
              onClick={triggerHelp}
              title={locale === 'hi' ? 'मार्गदर्शन एवं सहायता' : 'Vedic Help & Guide'}
              className="w-8 h-8 rounded-xl border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--bg)] flex items-center justify-center text-[var(--heading)] hover:text-[var(--gold)] transition-colors cursor-pointer select-none"
              aria-label="Help"
            >
              <HelpCircle className="w-4 h-4 stroke-[2]" />
            </button>

            {/* Notification Button */}
            <div className="relative" ref={notifRef}>
              <button
                type="button"
                onClick={() => setNotifDropdownOpen((v) => !v)}
                className="w-8 h-8 rounded-xl border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--bg)] flex items-center justify-center text-[var(--heading)] transition-colors relative cursor-pointer"
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4 stroke-[2]" />
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 absolute top-1.5 right-1.5" />
              </button>

              {notifDropdownOpen && (
                <div className="absolute right-0 mt-1.5 w-64 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-xl p-2.5 z-50 text-xs animate-in fade-in">
                  <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-[var(--border)]">
                    <span className="font-bold text-[var(--heading)]">Notifications</span>
                    <span className="text-[10px] text-[var(--gold)] font-semibold">1 New</span>
                  </div>
                  <div className="p-2 rounded-xl bg-[var(--bg)] border border-[var(--border)] flex items-start gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-[var(--gold)] shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-[var(--heading)]">
                        {locale === 'hi' ? 'वैदिक ग्रिड तैयार है' : 'Vedic Grid Ready'}
                      </p>
                      <p className="text-[10.5px] text-[var(--text-muted)] mt-0.5 leading-snug">
                        {locale === 'hi' ? 'मूलांक 5 और भाग्यांक 3 ऊर्जा सक्रिय है।' : 'Mulank 5 & Bhagyank 3 active.'}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Report CTA Button */}
            <Link
              href="/report"
              className="btn-gold-gradient h-8 px-3 rounded-xl text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all"
            >
              <FileText className="w-3 h-3 stroke-[2]" />
              <span>{locale === 'hi' ? 'रिपोर्ट' : 'Report'}</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Floating Help Modal */}
      <HelpModal isOpen={helpOpen} onClose={() => setHelpOpen(false)} />
    </>
  );
}

// Alias AppHeader as requested
export const AppHeader = Header;
