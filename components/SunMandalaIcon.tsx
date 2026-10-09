'use client';

import React from 'react';

export function SunMandalaIcon({ className = 'w-9 h-9', size = 36 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 44 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Outer Radiating Sun Rays (16 rays) */}
      {Array.from({ length: 16 }).map((_, i) => {
        const angle = (i * 360) / 16;
        const isLong = i % 2 === 0;
        const r1 = 17.5;
        const r2 = isLong ? 21.5 : 19.5;
        const rad = (angle * Math.PI) / 180;
        const x1 = 22 + Math.cos(rad) * r1;
        const y1 = 22 + Math.sin(rad) * r1;
        const x2 = 22 + Math.cos(rad) * r2;
        const y2 = 22 + Math.sin(rad) * r2;
        return (
          <line
            key={`ray-${i}`}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="#E8A317"
            strokeWidth={isLong ? 1.5 : 1.1}
            strokeLinecap="round"
          />
        );
      })}

      {/* Outer Ring */}
      <circle cx="22" cy="22" r="16.5" stroke="#E8A317" strokeWidth="1.2" />
      <circle cx="22" cy="22" r="14.5" stroke="#E8A317" strokeWidth="0.8" strokeDasharray="1.5 1.5" />

      {/* Middle Petal Ring (8 lotus petals) */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i * 360) / 8;
        return (
          <path
            key={`petal-${i}`}
            d="M 20.5 10 C 21 8.5 23 8.5 23.5 10 C 23.5 11 20.5 11 20.5 10 Z"
            transform={`rotate(${angle} 22 22)`}
            fill="#F0B53A"
            stroke="#C98310"
            strokeWidth="0.5"
          />
        );
      })}

      {/* Inner Circles */}
      <circle cx="22" cy="22" r="9.5" stroke="#E8A317" strokeWidth="1" fill="#FFFBF2" />
      <circle cx="22" cy="22" r="6" fill="#F0B53A" />
      <circle cx="22" cy="22" r="3.2" fill="#C98310" />
      <circle cx="22" cy="22" r="1.4" fill="#FFFFFF" />
    </svg>
  );
}
