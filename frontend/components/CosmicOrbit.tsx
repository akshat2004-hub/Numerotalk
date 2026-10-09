'use client';

import React from 'react';
import { cn } from '@/frontend/utils';

interface CosmicOrbitProps {
  className?: string;
  size?: number;
}

export function CosmicOrbit({ className, size = 210 }: CosmicOrbitProps) {
  return (
    <div
      className={cn(
        'relative select-none pointer-events-none flex items-center justify-center shrink-0 opacity-30 transition-opacity',
        className
      )}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full overflow-visible"
      >
        {/* Subtle slow rotation of orbital geometry */}
        <g className="animate-orbit-slow origin-[100px_100px]">
          {/* Subtle Outer Orbit Ring */}
          <circle
            cx="100"
            cy="100"
            r="94"
            stroke="#D97706"
            strokeWidth="0.85"
            strokeDasharray="4 4"
          />

          {/* Middle Elliptical Orbit Ring */}
          <ellipse
            cx="100"
            cy="100"
            rx="82"
            ry="48"
            transform="rotate(-25 100 100)"
            stroke="#D97706"
            strokeWidth="0.85"
          />

          {/* Secondary Elliptical Orbit Ring */}
          <ellipse
            cx="100"
            cy="100"
            rx="70"
            ry="40"
            transform="rotate(35 100 100)"
            stroke="#D97706"
            strokeWidth="0.65"
            strokeDasharray="3 3"
          />

          {/* Constellation Dots */}
          <circle cx="26" cy="85" r="2.5" fill="#D97706" />
          <circle cx="174" cy="115" r="2.5" fill="#D97706" />
          <circle cx="100" cy="6" r="2" fill="#D97706" />
          <circle cx="142" cy="168" r="2" fill="#D97706" />

          {/* Subtle Star Sparkles */}
          <path
            d="M48 42 Q48 48 42 48 Q48 48 48 54 Q48 48 54 48 Q48 48 48 42Z"
            fill="#D97706"
          />
          <path
            d="M156 138 Q156 143 151 143 Q156 143 156 148 Q156 143 161 143 Q156 143 156 138Z"
            fill="#D97706"
          />
        </g>

        {/* Static Center Sacred Geometric Mandala */}
        <g transform="translate(100, 100)">
          {/* Concentric rings */}
          <circle cx="0" cy="0" r="34" stroke="#D97706" strokeWidth="0.9" />
          <circle cx="0" cy="0" r="26" stroke="#D97706" strokeWidth="0.7" strokeDasharray="2 2" />
          <circle cx="0" cy="0" r="17" stroke="#D97706" strokeWidth="0.7" />

          {/* 16 geometric ray spokes */}
          {Array.from({ length: 16 }).map((_, i) => {
            const angle = (i * 360) / 16;
            const rad = (angle * Math.PI) / 180;
            const isLong = i % 2 === 0;
            const r1 = 17;
            const r2 = isLong ? 34 : 28;
            const x1 = Math.cos(rad) * r1;
            const y1 = Math.sin(rad) * r1;
            const x2 = Math.cos(rad) * r2;
            const y2 = Math.sin(rad) * r2;
            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="#D97706"
                strokeWidth={isLong ? 0.9 : 0.6}
              />
            );
          })}

          {/* Center core point */}
          <circle cx="0" cy="0" r="4.5" fill="#D97706" />
          <circle cx="0" cy="0" r="1.8" fill="#FFFFFF" />
        </g>
      </svg>
    </div>
  );
}
