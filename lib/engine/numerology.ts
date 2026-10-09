import { transliterateDevanagari } from './transliteration';

/**
 * Chaldean numerology letter values (1 to 8; 9 is sacred and not assigned to individual letters).
 */
export const CHALDEAN_MAP: Record<string, number> = {
  A: 1, I: 1, J: 1, Q: 1, Y: 1,
  B: 2, K: 2, R: 2,
  C: 3, G: 3, L: 3, S: 3,
  D: 4, M: 4, T: 4,
  E: 5, H: 5, N: 5, X: 5,
  U: 6, V: 6, W: 6,
  O: 7, Z: 7,
  F: 8, P: 8
};

/**
 * Pythagorean numerology letter values (1 to 9).
 */
export const PYTHAGOREAN_MAP: Record<string, number> = {
  A: 1, J: 1, S: 1,
  B: 2, K: 2, T: 2,
  C: 3, L: 3, U: 3,
  D: 4, M: 4, V: 4,
  E: 5, N: 5, W: 5,
  F: 6, O: 6, X: 6,
  G: 7, P: 7, Y: 7,
  H: 8, Q: 8, Z: 8,
  I: 9, R: 9
};

/**
 * Reduces any positive integer down to a single digit (1 to 9).
 * E.g., 29 -> 11 -> 2.
 */
export function reduceToSingleDigit(n: number): number {
  if (n <= 0) return 0;
  let current = Math.abs(Math.floor(n));
  while (current > 9) {
    let sum = 0;
    while (current > 0) {
      sum += current % 10;
      current = Math.floor(current / 10);
    }
    current = sum;
  }
  return current;
}

/**
 * Parses DOB components (year, month, day).
 * Handles string formats like "YYYY-MM-DD", "DD/MM/YYYY", or Date object.
 */
export function parseDob(dob: string | Date): { year: number; month: number; day: number; digits: number[] } {
  let y = 0, m = 0, d = 0;

  if (dob instanceof Date) {
    y = dob.getFullYear();
    m = dob.getMonth() + 1;
    d = dob.getDate();
  } else if (typeof dob === 'string') {
    const clean = dob.trim();
    if (clean.includes('-')) {
      const parts = clean.split('-').map(Number);
      if (parts[0] > 31) {
        // YYYY-MM-DD
        y = parts[0];
        m = parts[1];
        d = parts[2];
      } else {
        // DD-MM-YYYY
        d = parts[0];
        m = parts[1];
        y = parts[2];
      }
    } else if (clean.includes('/')) {
      const parts = clean.split('/').map(Number);
      if (parts[2] > 31) {
        // DD/MM/YYYY
        d = parts[0];
        m = parts[1];
        y = parts[2];
      } else {
        // YYYY/MM/DD
        y = parts[0];
        m = parts[1];
        d = parts[2];
      }
    }
  }

  // Extract all digit numbers (ignoring 0 for grid counts later)
  const padDay = String(d).padStart(2, '0');
  const padMonth = String(m).padStart(2, '0');
  const padYear = String(y).padStart(4, '0');
  const allDigits = `${padDay}${padMonth}${padYear}`
    .split('')
    .map(Number)
    .filter(n => !isNaN(n));

  return { year: y, month: m, day: d, digits: allDigits };
}

/**
 * Calculates Mulank (Driver Number / Birth Day Number).
 * Sum of the day of birth, reduced to 1-9.
 * E.g., birth on 23rd -> 2 + 3 = 5.
 */
export function calculateMulank(dob: string | Date): {
  dayNumber: number;
  mulank: number;
  compoundStr: string;
} {
  const { day } = parseDob(dob);
  const mulank = reduceToSingleDigit(day);
  const compoundStr = day > 9 ? `${day}/${mulank}` : `${mulank}`;
  return {
    dayNumber: day,
    mulank,
    compoundStr
  };
}

/**
 * Calculates Bhagyank (Conductor Number / Life Path Number).
 * Sum of all digits in DOB (DD + MM + YYYY), reduced to 1-9.
 */
export function calculateBhagyank(dob: string | Date): {
  rawSum: number;
  bhagyank: number;
  compoundStr: string;
} {
  const { digits } = parseDob(dob);
  const rawSum = digits.reduce((acc, curr) => acc + curr, 0);
  const bhagyank = reduceToSingleDigit(rawSum);
  const compoundStr = rawSum > 9 ? `${rawSum}/${bhagyank}` : `${bhagyank}`;
  return {
    rawSum,
    bhagyank,
    compoundStr
  };
}

export interface DestinyCalculationResult {
  system: 'chaldean' | 'pythagorean';
  originalName: string;
  transliteratedName: string;
  isDevanagari: boolean;
  letterBreakdown: Array<{ char: string; value: number }>;
  compoundNumber: number;
  destinyNumber: number;
  compoundStr: string;
}

/**
 * Calculates Destiny / Name Number (Namank) using Chaldean or Pythagorean method.
 * Supports English and Devanagari (Hindi) input.
 */
export function calculateDestinyNumber(
  name: string,
  system: 'chaldean' | 'pythagorean' = 'chaldean'
): DestinyCalculationResult {
  const translit = transliterateDevanagari(name);
  const targetText = translit.transliterated;
  const map = system === 'chaldean' ? CHALDEAN_MAP : PYTHAGOREAN_MAP;

  const letterBreakdown: Array<{ char: string; value: number }> = [];
  let compoundNumber = 0;

  for (const char of targetText) {
    if (char === ' ') continue;
    const val = map[char] || 0;
    if (val > 0) {
      letterBreakdown.push({ char, value: val });
      compoundNumber += val;
    }
  }

  const destinyNumber = reduceToSingleDigit(compoundNumber);
  const compoundStr = compoundNumber > 9 ? `${compoundNumber}/${destinyNumber}` : `${destinyNumber}`;

  return {
    system,
    originalName: name,
    transliteratedName: targetText,
    isDevanagari: translit.isDevanagari,
    letterBreakdown,
    compoundNumber,
    destinyNumber,
    compoundStr
  };
}
