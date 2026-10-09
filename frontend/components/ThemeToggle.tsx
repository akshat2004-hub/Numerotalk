'use client';

import React, { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';
import { cn } from '@/frontend/utils';

export function ThemeToggle({ className }: { className?: string }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    document.documentElement.classList.remove('dark');
    localStorage.setItem('numerotalk-theme', 'light');
    setTheme('light');
  }, []);

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    localStorage.setItem('numerotalk-theme', next);
    if (next === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
      className={cn(
        'w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center border transition-all duration-150',
        'bg-white border-[#F3E3C4] text-[#14213D] hover:border-[#E8A317] hover:bg-[#FFF6E3] shadow-xs cursor-pointer',
        className
      )}
    >
      {theme === 'light' ? (
        <Moon className="w-4 h-4 stroke-[1.5]" />
      ) : (
        <Sun className="w-4 h-4 stroke-[1.5] text-amber-500" />
      )}
    </button>
  );
}
