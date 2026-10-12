'use client';

import React, { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';
import { cn } from '@/frontend/utils';

export function ThemeToggle({ className }: { className?: string }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    document.documentElement.classList.remove('dark');
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

  const label = theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={label}
      title={label}
      className={cn(
        'w-10 h-10 rounded-[12px] inline-flex flex-row items-center justify-center shrink-0 border transition-all duration-150',
        'bg-white border-[#F3E3C4] text-[#14213D] hover:border-[#E8A317] hover:bg-[#FFF6E3] shadow-xs cursor-pointer select-none leading-none',
        '[&_svg]:block [&_svg]:shrink-0 [&_svg]:m-0',
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
