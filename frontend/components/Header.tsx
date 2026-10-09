'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Link, usePathname, useRouter } from '@/i18n/routing';
import { useLocale } from 'next-intl';
import {
  Menu,
  FileText,
  ChevronDown,
  HelpCircle,
  Check,
  User,
  Trash2,
  Calendar,
  Phone,
  AlertTriangle
} from 'lucide-react';
import { SunMandalaIcon } from './SunMandalaIcon';
import { Modal } from '@/frontend/components/ui/Modal';
import { Button } from '@/frontend/components/ui/Button';
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
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [showConfirmClear, setShowConfirmClear] = useState(false);

  const langRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  const profile = useNumerologyStore((s) => s.profile);
  const resetProfile = useNumerologyStore((s) => s.resetProfile);
  const userName = profile.name || 'Rahul Sharma';

  useEffect(() => {
    // Force light theme only as specified
    document.documentElement.classList.remove('dark');
    localStorage.setItem('numerotalk-theme', 'light');

    const handleClickOutside = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangDropdownOpen(false);
      }
      if (userRef.current && !userRef.current.contains(e.target as Node)) {
        setUserDropdownOpen(false);
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

  const handleClearData = () => {
    resetProfile();
    setShowConfirmClear(false);
    setUserDropdownOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full h-[52px] bg-[var(--surface)] border-b border-[var(--border)] shadow-xs transition-colors">
        <div className="max-w-[1440px] h-full mx-auto px-3 sm:px-5 lg:px-6 flex items-center justify-between gap-2.5">
          {/* Left: Mobile Toggle + Logo */}
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
              <div className="w-7 h-7 rounded-lg bg-[var(--chip-bg)] flex items-center justify-center shrink-0 border border-[var(--border)]">
                <SunMandalaIcon size={18} className="w-4 h-4 text-[var(--gold)]" />
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
                <span className="text-[9.5px] font-normal text-[var(--text-muted)] tracking-tight mt-0.5 hidden xs:inline">
                  {locale === 'hi' ? 'वैदिक ज्ञान · आधुनिक जीवन' : 'Vedic Wisdom for Modern Life'}
                </span>
              </div>
            </Link>
          </div>

          {/* Right: Actions & User Chip */}
          <div className="flex items-center gap-2">
            {/* User Chip with Dropdown */}
            <div className="relative" ref={userRef}>
              <button
                type="button"
                onClick={() => setUserDropdownOpen((v) => !v)}
                className="flex items-center gap-1.5 h-8 px-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--bg)] transition-colors text-xs font-semibold text-[var(--heading)] cursor-pointer select-none"
                aria-label="User menu"
              >
                <div className="w-5 h-5 rounded-full bg-[var(--chip-bg)] text-[var(--gold)] flex items-center justify-center font-bold text-[10px] shrink-0 border border-[var(--border)]">
                  {userName.charAt(0).toUpperCase()}
                </div>
                <span className="max-w-[80px] sm:max-w-[110px] truncate text-xs font-medium hidden xs:inline">
                  {userName}
                </span>
                <ChevronDown className="w-3 h-3 text-[var(--text-muted)]" />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-1.5 w-60 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-xl p-2.5 z-50 text-xs animate-in fade-in">
                  <div className="px-2 py-1.5 border-b border-[var(--border)] mb-1">
                    <p className="font-bold text-xs text-[var(--heading)] truncate">{userName}</p>
                    <p className="text-[11px] text-[var(--text-muted)] truncate flex items-center gap-1 mt-0.5">
                      <Phone className="w-2.5 h-2.5 text-[var(--gold)] shrink-0" />
                      <span>{profile.mobile || '9876543210'}</span>
                    </p>
                    <p className="text-[10.5px] text-[var(--text-muted)] truncate flex items-center gap-1 mt-0.5">
                      <Calendar className="w-2.5 h-2.5 text-[var(--gold)] shrink-0" />
                      <span>{profile.dob || '1995-10-23'}</span>
                    </p>
                  </div>

                  <Link
                    href="/"
                    onClick={() => setUserDropdownOpen(false)}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[var(--text)] hover:bg-[var(--chip-bg)]/40 hover:text-[var(--heading)] transition-colors text-[11.5px] font-medium"
                  >
                    <User className="w-3.5 h-3.5 text-[var(--gold)]" />
                    <span>{locale === 'hi' ? 'प्रोफ़ाइल विवरण' : 'Profile Details'}</span>
                  </Link>

                  <div className="pt-1 mt-1 border-t border-[var(--border)]">
                    <button
                      type="button"
                      onClick={() => setShowConfirmClear(true)}
                      className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors text-[11.5px] font-medium cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>{locale === 'hi' ? 'मेरा डेटा हटाएं' : 'Clear My Data'}</span>
                    </button>
                  </div>
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

            {/* Help "?" Button */}
            <Link
              href="/help"
              title={locale === 'hi' ? 'मार्गदर्शन एवं सहायता' : 'Vedic Help & Guide'}
              className="w-8 h-8 rounded-xl border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--bg)] flex items-center justify-center text-[var(--heading)] hover:text-[var(--gold)] transition-colors cursor-pointer select-none"
              aria-label="Help & Guide"
            >
              <HelpCircle className="w-4 h-4 stroke-[2]" />
            </Link>

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

      {/* Clear Data Confirmation Dialog via unified Modal */}
      <Modal
        isOpen={showConfirmClear}
        onClose={() => setShowConfirmClear(false)}
        maxWidthClassName="sm:max-w-md"
        title={
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-200 shrink-0">
              <AlertTriangle className="w-4 h-4 stroke-[2]" />
            </div>
            <span>{locale === 'hi' ? 'डेटा हटाने की पुष्टि' : 'Confirm Data Deletion'}</span>
          </div>
        }
        footer={
          <div className="flex items-center justify-end gap-2.5">
            <Button
              variant="secondary"
              size="md"
              onClick={() => setShowConfirmClear(false)}
            >
              {locale === 'hi' ? 'रद्द करें' : 'Cancel'}
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={handleClearData}
              className="bg-rose-600! hover:bg-rose-700! text-white!"
            >
              {locale === 'hi' ? 'हाँ, हटाएं' : 'Yes, Clear Data'}
            </Button>
          </div>
        }
      >
        <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
          {locale === 'hi'
            ? 'क्या आप वाकई अपना डेटा हटाना चाहते हैं? इससे आपकी सभी सहेजी गई प्रोफ़ाइल जानकारी रीसेट हो जाएगी।'
            : 'Are you sure you want to clear your data? This will reset all your stored profile information and calculations.'}
        </p>
      </Modal>
    </>
  );
}

// Alias AppHeader as requested
export const AppHeader = Header;
