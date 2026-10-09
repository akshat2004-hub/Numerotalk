'use client';

import React from 'react';

export function LotusIcon({ className = 'w-9 h-9', size = 36 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Delicate Vedic Lotus Flower in Gold Line Art */}
      {/* Center petal */}
      <path
        d="M20 7C20 7 24 16 24 23C24 25.5 22.2 27.5 20 27.5C17.8 27.5 16 25.5 16 23C16 16 20 7 20 7Z"
        stroke="#E8A317"
        strokeWidth="1.4"
        fill="#FFF9EE"
      />
      {/* Inner left petal */}
      <path
        d="M20 15C17 15 12 19 12 24C12 26.5 14 28 16.5 28C18.5 28 20 26 20 25"
        stroke="#E8A317"
        strokeWidth="1.3"
      />
      {/* Inner right petal */}
      <path
        d="M20 15C23 15 28 19 28 24C28 26.5 26 28 23.5 28C21.5 28 20 26 20 25"
        stroke="#E8A317"
        strokeWidth="1.3"
      />
      {/* Outer left petal */}
      <path
        d="M17 21C13 21 7 23 7 27C7 29.5 10 30.5 13 30.5C16 30.5 19 28 19 26"
        stroke="#E8A317"
        strokeWidth="1.2"
      />
      {/* Outer right petal */}
      <path
        d="M23 21C27 21 33 23 33 27C33 29.5 30 30.5 27 30.5C24 30.5 21 28 21 26"
        stroke="#E8A317"
        strokeWidth="1.2"
      />
      {/* Base water line / pedestal arc */}
      <path
        d="M11 31C16 33 24 33 29 31"
        stroke="#C98310"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  );
}
