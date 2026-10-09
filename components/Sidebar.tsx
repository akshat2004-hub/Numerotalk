'use client';

import React, { useState } from 'react';
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
  X
} from 'lucide-react';
import { HelpModal } from './HelpModal';
import { cn } from '@/lib/utils';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  onOpenHelp?: () => void;
}

export function Sidebar({ isOpen = false, onClose, onOpenHelp }: SidebarProps) {
  const pathname = usePathname();
  const locale = useLocale();
  const [helpOpen, setHelpOpen] = useState(false);

  const handleHelpClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onClose) onClose();
    if (onOpenHelp) onOpenHelp();
    else setHelpOpen(true);
  };

  const navItems = [
    { href: '/', labelEn: 'User Detail', labelHi: 'उपयोगकर्ता विवरण', icon: User, isModal: false },
    { href: '/destiny', labelEn: 'Destiny (Namank)', labelHi: 'भाग्यांक (नामांक)', icon: Crown, isModal: false },
    { href: '/combination', labelEn: 'Destiny × Life Path', labelHi: 'भाग्यांक × मूलांक', icon: GitMerge, isModal: false },
    { href: '/missing', labelEn: 'Missing Numbers', labelHi: 'अनुपस्थित अंक', icon: EyeOff, isModal: false },
    { href: '/repeating', labelEn: 'Repeating Numbers', labelHi: 'पुनरावृत्त अंक', icon: Repeat, isModal: false },
    { href: '/yogas', labelEn: 'Yogas Grid', labelHi: 'योग ग्रिड', icon: Grid, isModal: false },
    { href: '/name', labelEn: 'Name Numerology', labelHi: 'नाम अंकशास्त्र', icon: FileSignature, isModal: false },
    { href: '/match-making', labelEn: 'Match Making', labelHi: 'कुंडली मिलान', icon: Heart, isModal: false },
    { href: '/mobile', labelEn: 'Mobile Number', labelHi: 'मोबाइल अंक', icon: Smartphone, isModal: false },
    { href: '/profession', labelEn: 'Profession', labelHi: 'कार्यक्षेत्र', icon: Briefcase, isModal: false },
    { href: '/pin-password', labelEn: 'Pin & Password', labelHi: 'पिन एवं पासवर्ड', icon: KeyRound, isModal: false },
    { href: '/yearly', labelEn: 'Yearly', labelHi: 'वार्षिक फलादेश', icon: Calendar, isModal: false },
    { href: '/vastu', labelEn: 'Vastu', labelHi: 'वास्तु शास्त्र', icon: Home, isModal: false },
    { href: '/time', labelEn: 'Time', labelHi: 'शुभ समय / मुहूर्त', icon: Clock, isModal: false },
    { href: '/number', labelEn: 'Number 1-108', labelHi: 'अंक 1-108 रहस्य', icon: Hash, isModal: false },
    { href: '/events', labelEn: 'Events', labelHi: 'जीवन घटनाएं', icon: Sparkles, isModal: false },
    { href: '#help', labelEn: 'Help & Guide', labelHi: 'सहायता एवं सूत्र', icon: HelpCircle, isModal: true },
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

      {/* Sidebar Container */}
      <aside
        className={cn(
          'fixed lg:sticky top-0 lg:top-[52px] left-0 z-50 lg:z-30 h-screen lg:h-[calc(100vh-52px)] w-[218px]',
          'bg-[var(--surface)] border-r border-[var(--border)]',
          'flex flex-col select-none transition-transform duration-200 ease-in-out shrink-0',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Mobile Header in Drawer */}
        <div className="flex items-center justify-between p-3 border-b border-[var(--border)] bg-[var(--surface)] lg:hidden">
          <span className="font-serif font-bold text-xs text-[var(--heading)]">
            {locale === 'hi' ? 'वैदिक मॉड्यूल' : 'Vedic Modules'}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-[var(--text-muted)] hover:text-[var(--heading)] border border-[var(--border)]"
          >
            <X className="w-3.5 h-3.5 stroke-[1.5]" />
          </button>
        </div>

        {/* Section Title */}
        <div className="px-3.5 pt-3 pb-1">
          <span className="text-[9.5px] font-bold uppercase tracking-wider text-[var(--gold)]">
            {locale === 'hi' ? 'वैदिक मॉड्यूल' : 'Vedic Modules'}
          </span>
        </div>

        {/* Navigation list (Compact, refined typography, custom thin scrollbar) */}
        <div className="flex-1 overflow-y-auto px-1.5 py-0.5 space-y-0.5 scrollbar-thin scrollbar-thumb-[var(--border)]">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              !item.isModal &&
              (pathname === item.href ||
                (item.href === '/' && pathname === '/user-detail') ||
                (item.href === '/user-detail' && pathname === '/'));

            if (item.isModal) {
              return (
                <button
                  key={item.href}
                  type="button"
                  onClick={handleHelpClick}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg transition-all group relative text-[var(--text)] hover:bg-[var(--chip-bg)]/40 hover:text-[var(--heading)] cursor-pointer text-left"
                >
                  <Icon className="w-3.5 h-3.5 shrink-0 stroke-[2] text-[var(--text-muted)] group-hover:text-[var(--gold)] transition-colors" />
                  <span className="truncate text-[11.5px]">
                    {locale === 'hi' ? item.labelHi : item.labelEn}
                  </span>
                  <span className="ml-auto text-[9px] px-1 py-0.2 rounded bg-[var(--chip-bg)] text-[var(--gold)] font-bold border border-[var(--border)]">
                    ?
                  </span>
                </button>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  'flex items-center gap-2 px-2.5 py-1.5 rounded-lg transition-all group relative',
                  isActive
                    ? 'bg-[var(--active-bg)] text-[var(--heading)] font-semibold'
                    : 'text-[var(--text)] hover:bg-[var(--chip-bg)]/40 hover:text-[var(--heading)]'
                )}
              >
                {/* 3px Gold Left Indicator for Active Item */}
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

        {/* Pinned Bottom Footer */}
        <div className="p-2.5 border-t border-[var(--border)] bg-[var(--surface)] text-[10px] text-[var(--text-muted)] text-center leading-relaxed">
          <span className="font-semibold text-[var(--heading)] block">
            {locale === 'hi' ? 'वैदिक एवं लो शू सिद्धांत' : 'Pure Vedic & Lo Shu'}
          </span>
          <span className="text-[9px] text-[var(--text-muted)]">Ancient Wisdom · Modern Guidance</span>
        </div>
      </aside>

      <HelpModal isOpen={helpOpen} onClose={() => setHelpOpen(false)} />
    </>
  );
}
