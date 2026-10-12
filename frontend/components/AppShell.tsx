'use client';

import React, { useState } from 'react';
import { usePathname } from '@/i18n/routing';
import { Link } from '@/i18n/routing';
import { useLocale } from 'next-intl';
import { Home, LayoutGrid, FileText, User } from 'lucide-react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { WaveBackground } from './WaveBackground';
import { cn } from '@/frontend/utils';

export function AppShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const locale = useLocale();

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFBF6] text-[#0F172A] relative overflow-x-hidden">
      {/* Subtle ambient gradient decoration */}
      <WaveBackground />

      {/* Full-width clean SaaS Header (Sticky at top) */}
      <Header onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />

      {/* Main Layout Container */}
      <div className="flex-1 flex w-full relative z-10 pt-[var(--header-h)] pb-[calc(5.5rem+env(safe-area-inset-bottom))] lg:pb-0 lg:pl-[var(--sidebar-w)]">
        {/* Sidebar (Fixed on desktop & drawer on mobile) */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Content Area */}
        <main className="flex-1 min-w-0 max-w-[1440px] mx-auto w-full px-3 sm:px-6 lg:px-8 py-3.5 sm:py-6 overflow-x-hidden">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Tab Bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E5E7EB] shadow-sm flex items-center justify-around h-[calc(3.5rem+env(safe-area-inset-bottom))] pb-[env(safe-area-inset-bottom)] px-2 select-none">
        <Link
          href="/"
          className={cn(
            'inline-flex flex-row items-center justify-center flex-1 h-full min-h-[40px] gap-1 text-[11px] font-medium transition-colors whitespace-nowrap select-none leading-none',
            pathname === '/'
              ? 'text-[#D97706] font-semibold'
              : 'text-[#64748B]'
          )}
        >
          <Home className="w-3.5 h-3.5 stroke-[1.75] shrink-0 block m-0" />
          <span className="whitespace-nowrap leading-none">{locale === 'hi' ? 'गृह' : 'Home'}</span>
        </Link>

        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          className="inline-flex flex-row items-center justify-center flex-1 h-full min-h-[40px] gap-1 text-[11px] font-medium text-[#64748B] hover:text-[#0F172A] transition-colors whitespace-nowrap select-none leading-none cursor-pointer"
        >
          <LayoutGrid className="w-3.5 h-3.5 stroke-[1.75] shrink-0 block m-0" />
          <span className="whitespace-nowrap leading-none">{locale === 'hi' ? 'अनुभाग' : 'Menu'}</span>
        </button>

        <Link
          href="/report"
          className={cn(
            'inline-flex flex-row items-center justify-center flex-1 h-full min-h-[40px] gap-1 text-[11px] font-medium transition-colors whitespace-nowrap select-none leading-none',
            pathname === '/report'
              ? 'text-[#D97706] font-semibold'
              : 'text-[#64748B]'
          )}
        >
          <FileText className="w-3.5 h-3.5 stroke-[1.75] shrink-0 block m-0" />
          <span className="whitespace-nowrap leading-none">{locale === 'hi' ? 'रिपोर्ट' : 'Report'}</span>
        </Link>

        <Link
          href="/"
          className={cn(
            'inline-flex flex-row items-center justify-center flex-1 h-full min-h-[40px] gap-1 text-[11px] font-medium transition-colors whitespace-nowrap select-none leading-none',
            pathname === '/'
              ? 'text-[#D97706] font-semibold'
              : 'text-[#64748B]'
          )}
        >
          <User className="w-3.5 h-3.5 stroke-[1.75] shrink-0 block m-0" />
          <span className="whitespace-nowrap leading-none">{locale === 'hi' ? 'प्रोफ़ाइल' : 'Profile'}</span>
        </Link>
      </nav>
    </div>
  );
}
