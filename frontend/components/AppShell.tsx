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
    <div className="min-h-screen flex flex-col bg-[#FFFBF6] text-[#0F172A] relative">
      {/* Subtle ambient gradient decoration */}
      <WaveBackground />

      {/* Full-width clean SaaS Header (Sticky at top) */}
      <Header onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />

      {/* Main Layout Container */}
      <div className="flex-1 flex max-w-[1440px] w-full mx-auto relative z-10 pb-16 lg:pb-0">
        {/* Sidebar (Fixed/Sticky at top 52px, scrolls independently) */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Content Area */}
        <main className="flex-1 min-w-0 px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Tab Bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E5E7EB] shadow-sm flex items-center justify-around h-14 px-2 select-none">
        <Link
          href="/"
          className={cn(
            'flex flex-col items-center justify-center flex-1 h-full min-h-[40px] gap-0.5 text-[10.5px] font-medium transition-colors',
            pathname === '/'
              ? 'text-[#D97706] font-semibold'
              : 'text-[#64748B]'
          )}
        >
          <Home className="w-4 h-4 stroke-[1.75]" />
          <span>{locale === 'hi' ? 'गृह' : 'Home'}</span>
        </Link>

        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          className="flex flex-col items-center justify-center flex-1 h-full min-h-[40px] gap-0.5 text-[10.5px] font-medium text-[#64748B] hover:text-[#0F172A] transition-colors"
        >
          <LayoutGrid className="w-4 h-4 stroke-[1.75]" />
          <span>{locale === 'hi' ? 'अनुभाग' : 'Menu'}</span>
        </button>

        <Link
          href="/report"
          className={cn(
            'flex flex-col items-center justify-center flex-1 h-full min-h-[40px] gap-0.5 text-[10.5px] font-medium transition-colors',
            pathname === '/report'
              ? 'text-[#D97706] font-semibold'
              : 'text-[#64748B]'
          )}
        >
          <FileText className="w-4 h-4 stroke-[1.75]" />
          <span>{locale === 'hi' ? 'रिपोर्ट' : 'Report'}</span>
        </Link>

        <Link
          href="/"
          className={cn(
            'flex flex-col items-center justify-center flex-1 h-full min-h-[40px] gap-0.5 text-[10.5px] font-medium transition-colors',
            pathname === '/'
              ? 'text-[#D97706] font-semibold'
              : 'text-[#64748B]'
          )}
        >
          <User className="w-4 h-4 stroke-[1.75]" />
          <span>{locale === 'hi' ? 'प्रोफ़ाइल' : 'Profile'}</span>
        </Link>
      </nav>
    </div>
  );
}
