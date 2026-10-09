'use client';

import React from 'react';
import { cn } from '@/frontend/utils';

export interface ComparisonRow {
  parameter: string;
  sideA: React.ReactNode;
  sideB: React.ReactNode;
  status?: 'match' | 'neutral' | 'clash';
}

interface ComparisonTableProps {
  titleA: string;
  titleB: string;
  rows: ComparisonRow[];
  className?: string;
}

export function ComparisonTable({
  titleA,
  titleB,
  rows,
  className
}: ComparisonTableProps) {
  return (
    <div className={cn('vedic-card overflow-hidden rounded-xl', className)}>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-[#F8FAFC] text-[11px] font-semibold text-[#475569] uppercase tracking-wider border-b border-[#E5E7EB]">
              <th className="py-2.5 px-4">Parameter</th>
              <th className="py-2.5 px-4 text-center">{titleA}</th>
              <th className="py-2.5 px-4 text-center">{titleB}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E7EB]">
            {rows.map((row, idx) => (
              <tr
                key={idx}
                className={cn(
                  'transition-colors hover:bg-[#FFFDF9]',
                  idx % 2 === 0 ? 'bg-white' : 'bg-[#FAFAFA]'
                )}
              >
                <td className="py-2.5 px-4 font-medium text-[#0F172A]">
                  {row.parameter}
                </td>
                <td className="py-2.5 px-4 text-center text-[#475569]">
                  {row.sideA}
                </td>
                <td className="py-2.5 px-4 text-center text-[#475569]">
                  {row.sideB}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
