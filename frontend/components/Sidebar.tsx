'use client';

import React, { useState, useRef, useEffect } from 'react';
import { usePathname } from '@/i18n/routing';
import { Link } from '@/i18n/routing';
import { useLocale } from 'next-intl';
import {
  User,
  Crown,
  GitMerge,
  EyeOff,
  Repeat,
  Grid,
  FileSignature,
  Heart,
  Smartphone,
  Briefcase,
  KeyRound,
  Calendar,
  Home,
  Clock,
  Hash,
  Sparkles,
  HelpCircle,
  Pill,
  FileText,
  X,
  ChevronDown,
  Phone,
  Edit3,
  Trash2,
  AlertTriangle
} from 'lucide-react';
import { Modal } from '@/frontend/components/ui/Modal';
import { Button } from '@/frontend/components/ui/Button';
import { useNumerologyStore } from '@/frontend/store/useNumerologyStore';
import { cn } from '@/frontend/utils';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  onOpenHelp?: () => void;
}

export function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const pathname = usePathname();
  const locale = useLocale();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [showConfirmClear, setShowConfirmClear] = useState(false);
  const userDropdownRef = useRef<HTMLDivElement>(null);
  const navContainerRef = useRef<HTMLDivElement>(null);
  const activeItemRef = useRef<HTMLAnchorElement>(null);

  const profile = useNumerologyStore((s) => s.profile);
  const resetProfile = useNumerologyStore((s) => s.resetProfile);
  const userName = profile.name || 'Rahul Sharma';

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(e.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // On route change, scroll active item into view inside the sidebar only (not the page)
  useEffect(() => {
    if (activeItemRef.current && navContainerRef.current) {
      const container = navContainerRef.current;
      const item = activeItemRef.current;
      const itemTop = item.offsetTop;
      const itemHeight = item.offsetHeight;
      const containerScrollTop = container.scrollTop;
      const containerHeight = container.clientHeight;

      if (itemTop < containerScrollTop) {
        container.scrollTop = itemTop;
      } else if (itemTop + itemHeight > containerScrollTop + containerHeight) {
        container.scrollTop = itemTop + itemHeight - containerHeight;
      }
    }
  }, [pathname]);

  const formatDob = (dobStr?: string) => {
    if (!dobStr) return '23 Oct 1995';
    try {
      const [y, m, d] = dobStr.split('-');
      if (!y || !m || !d) return dobStr;
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const monthName = months[parseInt(m, 10) - 1] || m;
      return `${parseInt(d, 10)} ${monthName} ${y}`;
    } catch {
      return dobStr;
    }
  };

  const formatTime = (timeStr?: string) => {
    if (!timeStr) return '10:30 AM';
    try {
      const [h, m] = timeStr.split(':');
      if (h === undefined || m === undefined) return timeStr;
      const hour = parseInt(h, 10);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const formattedHour = hour % 12 || 12;
      return `${formattedHour}:${m.padStart(2, '0')} ${ampm}`;
    } catch {
      return timeStr;
    }
  };

  const handleClearData = () => {
    resetProfile();
    setShowConfirmClear(false);
    setUserDropdownOpen(false);
  };

  const navItems = [
    { href: '/', labelEn: 'User Detail', labelHi: 'उपयोगकर्ता विवरण', icon: User, isModal: false },
    { href: '/destiny', labelEn: 'Destiny (Namank)', labelHi: 'भाग्यांक (नामांक)', icon: Crown, isModal: false },
    { href: '/combination', labelEn: 'Combination Prediction', labelHi: 'संयोजन भविष्यफल', icon: GitMerge, isModal: false },
    { href: '/missing', labelEn: 'Missing Numbers', labelHi: 'अनुपस्थित अंक', icon: EyeOff, isModal: false },
    { href: '/repeating', labelEn: 'Repeating Numbers', labelHi: 'पुनरावृत्त अंक', icon: Repeat, isModal: false },
    { href: '/yogas', labelEn: 'Yogas Grid', labelHi: 'योग ग्रिड', icon: Grid, isModal: false },
    { href: '/name', labelEn: 'Name Numerology', labelHi: 'नाम अंकशास्त्र', icon: FileSignature, isModal: false },
    { href: '/match-making', labelEn: 'Match Making', labelHi: 'कुंडली मिलान', icon: Heart, isModal: false },
    { href: '/mobile', labelEn: 'Mobile Number', labelHi: 'मोबाइल अंक', icon: Smartphone, isModal: false },
    { href: '/profession', labelEn: 'Profession', labelHi: 'कार्यक्षेत्र', icon: Briefcase, isModal: false },
    { href: '/pin-password', labelEn: 'PIN & Password', labelHi: 'पिन और पासवर्ड', icon: KeyRound, isModal: false },
    { href: '/yearly', labelEn: 'Yearly', labelHi: 'वार्षिक फलादेश', icon: Calendar, isModal: false },
    { href: '/vastu', labelEn: 'Vastu', labelHi: 'वास्तु शास्त्र', icon: Home, isModal: false },
    { href: '/time', labelEn: 'Time', labelHi: 'शुभ समय / मुहूर्त', icon: Clock, isModal: false },
    { href: '/number', labelEn: 'Number 1-108', labelHi: 'अंक 1-108 रहस्य', icon: Hash, isModal: false },
    { href: '/events', labelEn: 'Events', labelHi: 'जीवन घटनाएं', icon: Sparkles, isModal: false },
    { href: '/help', labelEn: 'Help & Guide', labelHi: 'सहायता और गाइड', icon: HelpCircle, isModal: false },
    { href: '/remedies', labelEn: 'Remedies', labelHi: 'वैदिक उपाय', icon: Pill, isModal: false },
    { href: '/report', labelEn: 'Final Report', labelHi: 'संपूर्ण रिपोर्ट', icon: FileText, isModal: false },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-50 bg-black/30 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Sidebar Container: Sticky at top 52px, height 100vh - 52px, scrolls independently */}
      <aside
        className={cn(
          'fixed lg:sticky top-0 lg:top-[52px] left-0 z-50 lg:z-30 h-screen lg:h-[calc(100vh-52px)] w-[218px]',
          'bg-[var(--surface)] border-r border-[var(--border)]',
          'flex flex-col select-none transition-transform duration-200 ease-in-out shrink-0 self-start',
          'overscroll-contain',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Mobile Header in Drawer */}
        <div className="flex items-center justify-between p-3 border-b border-[var(--border)] bg-[var(--surface)] lg:hidden">
          <span className="font-serif font-bold text-xs text-[var(--heading)]">
            {locale === 'hi' ? 'वैदिक अनुभाग' : 'Vedic Sections'}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-[var(--text-muted)] hover:text-[var(--heading)] border border-[var(--border)]"
          >
            <X className="w-3.5 h-3.5 stroke-[1.5]" />
          </button>
        </div>

        {/* User Detail Profile Dropdown Section */}
        <div className="relative px-2.5 pt-2.5 pb-2 border-b border-[var(--border)] shrink-0" ref={userDropdownRef}>
          <button
            type="button"
            onClick={() => setUserDropdownOpen((v) => !v)}
            className={cn(
              'w-full flex items-center justify-between p-2 rounded-xl transition-all cursor-pointer border select-none text-left',
              userDropdownOpen
                ? 'bg-[var(--chip-bg)]/80 border-[var(--gold)]/60 shadow-xs ring-1 ring-[var(--gold)]/20'
                : 'bg-[var(--bg)] border-[var(--border)] hover:border-[var(--gold)]/40 hover:bg-[var(--chip-bg)]/30'
            )}
            aria-expanded={userDropdownOpen}
            aria-label="Toggle user details dropdown"
          >
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 text-[var(--gold)] flex items-center justify-center font-bold text-xs border border-[var(--gold)]/30 shrink-0 shadow-2xs">
                {userName.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-xs text-[var(--heading)] truncate leading-tight">
                  {userName}
                </p>
                <span className="text-[10px] text-[var(--gold)] font-medium block truncate mt-0.5">
                  {locale === 'hi' ? 'विवरण देखें' : 'View Details'}
                </span>
              </div>
            </div>
            <ChevronDown
              className={cn(
                'w-3.5 h-3.5 text-[var(--text-muted)] transition-transform duration-200 shrink-0 ml-1',
                userDropdownOpen && 'rotate-180 text-[var(--gold)]'
              )}
            />
          </button>

          {/* User Details Dropdown Panel */}
          {userDropdownOpen && (
            <div className="absolute left-2.5 right-2.5 top-[calc(100%+4px)] z-50 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-xl p-3 text-xs animate-in fade-in slide-in-from-top-1">
              {/* Header inside dropdown */}
              <div className="flex items-center gap-2.5 pb-2.5 mb-2.5 border-b border-[var(--border)]">
                <div className="w-9 h-9 rounded-xl bg-[var(--chip-bg)] text-[var(--gold)] flex items-center justify-center font-bold text-sm border border-[var(--border)] shrink-0">
                  {userName.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-xs text-[var(--heading)] truncate leading-tight">
                    {userName}
                  </p>
                  <p className="text-[10.5px] text-[var(--text-muted)] flex items-center gap-1 mt-0.5 truncate">
                    <Phone className="w-2.5 h-2.5 text-[var(--gold)] shrink-0" />
                    <span>{profile.mobile || '9876543210'}</span>
                  </p>
                </div>
              </div>

              {/* Detail Items: DOB, Time */}
              <div className="space-y-1.5 pb-2.5 mb-2.5 border-b border-[var(--border)] text-[var(--text)]">
                <div className="flex items-center justify-between p-1.5 rounded-lg bg-[var(--bg)] border border-[var(--border)]/60 text-[11px]">
                  <span className="text-[var(--text-muted)] flex items-center gap-1.5">
                    <Calendar className="w-3 h-3 text-[var(--gold)] shrink-0" />
                    <span>{locale === 'hi' ? 'जन्म तिथि' : 'Date of Birth'}</span>
                  </span>
                  <span className="font-semibold text-[var(--heading)] font-mono text-[10.5px]">
                    {formatDob(profile.dob)}
                  </span>
                </div>

                <div className="flex items-center justify-between p-1.5 rounded-lg bg-[var(--bg)] border border-[var(--border)]/60 text-[11px]">
                  <span className="text-[var(--text-muted)] flex items-center gap-1.5">
                    <Clock className="w-3 h-3 text-[var(--gold)] shrink-0" />
                    <span>{locale === 'hi' ? 'जन्म समय' : 'Birth Time'}</span>
                  </span>
                  <span className="font-semibold text-[var(--heading)] font-mono text-[10.5px]">
                    {formatTime(profile.birthTime)}
                  </span>
                </div>
              </div>

              {/* Action Buttons: Edit & Clear Data */}
              <div className="space-y-1.5">
                <Link
                  href="/"
                  onClick={() => {
                    setUserDropdownOpen(false);
                    if (onClose) onClose();
                  }}
                  className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl bg-[var(--chip-bg)] text-[var(--gold)] hover:bg-[var(--active-bg)] font-semibold text-xs border border-[var(--gold)]/30 transition-colors shadow-2xs"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>{locale === 'hi' ? 'विवरण संपादित करें' : 'Edit Details'}</span>
                </Link>

                <button
                  type="button"
                  onClick={() => setShowConfirmClear(true)}
                  className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl text-rose-600 hover:bg-rose-50 font-semibold text-xs border border-rose-200 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>{locale === 'hi' ? 'डेटा हटाएं' : 'Clear My Data'}</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Section Header */}
        <div className="px-3.5 pt-2.5 pb-1 shrink-0">
          <span className="text-[9.5px] font-bold uppercase tracking-wider text-[var(--gold)]">
            {locale === 'hi' ? 'वैदिक विश्लेषण' : 'Vedic Analytics'}
          </span>
        </div>

        {/* Navigation list (Independent scrolling, thin gold hover scrollbar, overscroll contained) */}
        <div
          ref={navContainerRef}
          className="flex-1 overflow-y-auto overscroll-contain px-1.5 py-0.5 space-y-0.5 sidebar-scroll"
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              (pathname === item.href ||
                (item.href === '/' && pathname === '/user-detail') ||
                (item.href === '/user-detail' && pathname === '/'));

            return (
              <Link
                key={item.href}
                href={item.href}
                ref={isActive ? activeItemRef : undefined}
                onClick={onClose}
                className={cn(
                  'flex items-center gap-2 px-2.5 py-1.5 rounded-lg transition-all group relative',
                  isActive
                    ? 'bg-[var(--active-bg)] text-[var(--heading)] font-semibold'
                    : 'text-[var(--text)] hover:bg-[var(--chip-bg)]/40 hover:text-[var(--heading)]'
                )}
              >
                {isActive && (
                  <span className="absolute left-0 top-1 bottom-1 w-[3px] rounded-r-xs bg-[var(--gold)]" />
                )}

                <Icon
                  className={cn(
                    'w-3.5 h-3.5 shrink-0 stroke-[2] transition-colors',
                    isActive
                      ? 'text-[var(--gold)]'
                      : 'text-[var(--text-muted)] group-hover:text-[var(--gold)]'
                  )}
                />

                <span className="truncate text-[11.5px]">
                  {locale === 'hi' ? item.labelHi : item.labelEn}
                </span>
              </Link>
            );
          })}
        </div>

        {/* Pinned Bottom Lotus Footer block outside scrolling list */}
        <div className="p-2.5 pb-8 sm:pb-8 border-t border-[var(--border)] bg-[var(--surface)] text-[10px] text-[var(--text-muted)] text-center leading-relaxed shrink-0">
          <span className="font-semibold text-[var(--heading)] block text-[10.5px]">
            {locale === 'hi'
              ? 'शुद्ध वैदिक सिद्धांत · प्राचीन ज्ञान · आधुनिक मार्गदर्शन'
              : 'Pure Vedic Principles · Ancient Wisdom · Modern Guidance'}
          </span>
        </div>
      </aside>

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
