'use client';

import React from 'react';

export function WaveBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden select-none z-0">
      {/* 1. TOP-RIGHT LAYERED GRADIENT WAVES */}
      <svg
        className="absolute top-0 right-0 w-[58vw] max-w-[880px] h-[480px] pointer-events-none opacity-85 transition-opacity"
        viewBox="0 0 880 480"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="wavePeachTop" x1="880" y1="0" x2="120" y2="400" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFE7C2" stopOpacity="0.80" />
            <stop offset="40%" stopColor="#FFF1D6" stopOpacity="0.50" />
            <stop offset="80%" stopColor="#FFFBF6" stopOpacity="0.10" />
            <stop offset="100%" stopColor="#FFFBF6" stopOpacity="0" />
          </linearGradient>

          <linearGradient id="waveLavenderTop" x1="780" y1="0" x2="40" y2="340" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#E8DCFA" stopOpacity="0.70" />
            <stop offset="50%" stopColor="#F3EBFC" stopOpacity="0.38" />
            <stop offset="100%" stopColor="#FFFBF6" stopOpacity="0" />
          </linearGradient>

          <linearGradient id="waveGoldStroke" x1="820" y1="40" x2="180" y2="320" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.35" />
            <stop offset="60%" stopColor="#FDE68A" stopOpacity="0.20" />
            <stop offset="100%" stopColor="#FFFBF6" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Soft Lavender Background Wave */}
        <path
          d="M880 0V270C760 300 640 230 510 260C380 290 260 370 0 330V0H880Z"
          fill="url(#waveLavenderTop)"
        />

        {/* Soft Peach Foreground Wave */}
        <path
          d="M880 0V200C740 240 630 170 490 210C360 240 230 340 70 310C20 305 0 295 0 295V0H880Z"
          fill="url(#wavePeachTop)"
        />

        {/* Delicate Golden Wave Accent Line */}
        <path
          d="M880 150C750 190 640 130 500 170C370 200 250 290 90 270"
          stroke="url(#waveGoldStroke)"
          strokeWidth="1.5"
          fill="none"
        />
      </svg>

      {/* 2. BOTTOM LAYERED GRADIENT WAVES (Richly frames the bottom empty space) */}
      <svg
        className="absolute bottom-0 left-0 right-0 w-full h-[280px] sm:h-[380px] pointer-events-none opacity-85 transition-opacity"
        viewBox="0 0 1440 380"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="wavePeachBottom" x1="720" y1="380" x2="720" y2="30" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFE7C2" stopOpacity="0.85" />
            <stop offset="40%" stopColor="#FFF1D6" stopOpacity="0.50" />
            <stop offset="75%" stopColor="#FFF8EC" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#FFFBF6" stopOpacity="0" />
          </linearGradient>

          <linearGradient id="waveLavenderBottom" x1="400" y1="380" x2="400" y2="50" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#E8DCFA" stopOpacity="0.75" />
            <stop offset="50%" stopColor="#F4ECFC" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#FFFBF6" stopOpacity="0" />
          </linearGradient>

          <linearGradient id="waveGoldBottom" x1="0" y1="220" x2="1440" y2="220" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFBF6" stopOpacity="0" />
            <stop offset="20%" stopColor="#F59E0B" stopOpacity="0.28" />
            <stop offset="65%" stopColor="#D97706" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#FFFBF6" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Lavender Base Swell */}
        <path
          d="M0 380V200C220 150 470 265 710 215C950 165 1190 275 1440 225V380H0Z"
          fill="url(#waveLavenderBottom)"
        />

        {/* Peach Flowing Wave */}
        <path
          d="M0 380V250C280 190 530 295 810 235C1070 180 1290 275 1440 245V380H0Z"
          fill="url(#wavePeachBottom)"
        />

        {/* Accent Golden Crest Curve */}
        <path
          d="M0 250C280 190 530 295 810 235C1070 180 1290 275 1440 245"
          stroke="url(#waveGoldBottom)"
          strokeWidth="1.5"
          fill="none"
        />
      </svg>

      {/* 3. Soft ambient luminous warm glow in right flank */}
      <div
        className="absolute top-1/2 -right-24 w-[460px] h-[460px] rounded-full blur-[110px] opacity-45 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, #FDE68A 0%, #EDE9FE 45%, transparent 70%)'
        }}
        aria-hidden="true"
      />
    </div>
  );
}
