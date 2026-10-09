'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface FormCardProps {
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export function FormCard({
  title,
  subtitle,
  icon,
  children,
  footer,
  className
}: FormCardProps) {
  return (
    <div className={cn('vedic-card p-5 sm:p-6 rounded-[24px]', className)}>
      {(title || icon) && (
        <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-[var(--border)]">
          <div className="flex items-center gap-2.5">
            {icon && (
              <div className="w-8 h-8 rounded-xl bg-[var(--chip-bg)] border border-[var(--border)] flex items-center justify-center text-[var(--gold)] shrink-0">
                {icon}
              </div>
            )}
            <div>
              {title && (
                <h3 className="font-serif text-base font-bold text-[var(--heading)]">
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="text-[11px] text-[var(--text-muted)]">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      <div>{children}</div>

      {footer && (
        <div className="mt-4 pt-3.5 border-t border-[var(--border)]">
          {footer}
        </div>
      )}
    </div>
  );
}
