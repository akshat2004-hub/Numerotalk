import { transliterateDevanagari } from './transliteration';

/**
 * Sacred Vedic letter phonetic values (1 to 8; 9 is sacred and unassigned to individual letters).
 */
export const LETTER_VALUES_MAP: Record<string, number> = {
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
  compound: number;
  reduced: number;
  compoundStr?: string;
} {
  const { day } = parseDob(dob);
  const mulank = reduceToSingleDigit(day);
  return {
    dayNumber: day,
    mulank,
    compound: day,
    reduced: mulank,
    compoundStr: day > 9 ? `${day}` : `${mulank}`
  };
}

/**
 * Calculates Bhagyank (Conductor Number / Life Path Number).
 * Sum of all digits in DOB (DD + MM + YYYY), reduced to 1-9.
 */
export function calculateBhagyank(dob: string | Date): {
  rawSum: number;
  bhagyank: number;
  compound: number;
  reduced: number;
  compoundStr?: string;
} {
  const { digits } = parseDob(dob);
  const rawSum = digits.reduce((acc, curr) => acc + curr, 0);
  const bhagyank = reduceToSingleDigit(rawSum);
  return {
    rawSum,
    bhagyank,
    compound: rawSum,
    reduced: bhagyank,
    compoundStr: rawSum > 9 ? `${rawSum}` : `${bhagyank}`
  };
}

import friendlyEnemyRules from '@/mocks/rules/friendly-enemy-neutral.json';
import spellingAlternatesData from '@/mocks/rules/spelling-alternates.json';

export interface LetterDetail {
  ch: string;
  value: number;
  isVowel: boolean;
}

export interface WordDetail {
  word: string;
  letters: LetterDetail[];
  subtotal: number;
  reduced: number;
}

export interface DestinyCalculationResult {
  words: WordDetail[];
  compound: number;
  reduced: number;
  originalName: string;
  transliteratedName: string;
  isDevanagari: boolean;
  letterBreakdown: Array<{ char: string; value: number }>;
  compoundNumber: number;
  destinyNumber: number;
  compoundStr?: string;
}

/**
 * Calculates Destiny / Name Number (Namank).
 * Breaks down name into words and individual letters with sacred phonetic values.
 * Reduces to single digit 1-9 (no master-number exceptions).
 */
export function nameNumber(name: string): DestinyCalculationResult {
  const translit = transliterateDevanagari(name || '');
  const targetText = translit.transliterated;

  // Split into words while retaining pure alphabetic characters
  const rawWords = targetText.trim().split(/\s+/).filter(Boolean);
  const words: WordDetail[] = [];
  const letterBreakdown: Array<{ char: string; value: number }> = [];

  for (const rawWord of rawWords) {
    const letters: LetterDetail[] = [];
    let subtotal = 0;

    for (const char of rawWord) {
      const upper = char.toUpperCase();
      const val = LETTER_VALUES_MAP[upper] || 0;
      if (val > 0) {
        const isVowel = 'AEIOU'.includes(upper);
        letters.push({ ch: upper, value: val, isVowel });
        letterBreakdown.push({ char: upper, value: val });
        subtotal += val;
      }
    }

    if (letters.length > 0) {
      words.push({
        word: rawWord,
        letters,
        subtotal,
        reduced: reduceToSingleDigit(subtotal)
      });
    }
  }

  const compound = words.reduce((acc, w) => acc + w.subtotal, 0);
  const reduced = reduceToSingleDigit(compound);

  return {
    words,
    compound,
    reduced,
    originalName: name,
    transliteratedName: targetText,
    isDevanagari: translit.isDevanagari,
    letterBreakdown,
    compoundNumber: compound,
    destinyNumber: reduced,
    compoundStr: compound > 9 ? `${compound}` : `${reduced}`
  };
}

/**
 * calculateDestinyNumber proxy for backward compatibility.
 */
export function calculateDestinyNumber(name: string): DestinyCalculationResult {
  return nameNumber(name);
}

export interface NameVariantSuggestion {
  suggestedName: string;
  compound: number;
  reduced: number;
  harmonyMulank: 'friendly' | 'neutral' | 'enemy';
  harmonyBhagyank: 'friendly' | 'neutral' | 'enemy';
  changeMade: string;
}

export function getHarmonyRelation(sourceNum: number, targetNum: number): 'friendly' | 'neutral' | 'enemy' {
  const relMap = (friendlyEnemyRules as any).relations?.[String(sourceNum)];
  if (!relMap) return 'neutral';
  if (relMap.friendly?.includes(targetNum)) return 'friendly';
  if (relMap.enemy?.includes(targetNum)) return 'enemy';
  return 'neutral';
}

/**
 * Generates spelling suggestions for a name that harmonize with birth numbers (Mulank & Bhagyank).
 * Keeps only variants whose Name Number is friendly with BOTH Mulank and Bhagyank.
 */
export function suggestNameVariants(
  name: string,
  profile: { dob?: string; mulank?: number; bhagyank?: number }
): NameVariantSuggestion[] {
  if (!name || !name.trim()) return [];

  let mulank = profile.mulank;
  let bhagyank = profile.bhagyank;

  if ((!mulank || !bhagyank) && profile.dob) {
    const m = calculateMulank(profile.dob);
    const b = calculateBhagyank(profile.dob);
    mulank = mulank || m.mulank;
    bhagyank = bhagyank || b.bhagyank;
  }

  if (!mulank || !bhagyank) return [];

  const rawWords = name.trim().split(/\s+/);
  if (rawWords.length === 0) return [];

  interface Candidate {
    name: string;
    changeMade: string;
  }

  const candidateMap = new Map<string, Candidate>();

  const addCandidate = (candWords: string[], changeMade: string) => {
    const formatted = candWords.join(' ');
    const key = formatted.toLowerCase();
    if (key !== name.trim().toLowerCase() && !candidateMap.has(key)) {
      candidateMap.set(key, { name: formatted, changeMade });
    }
  };

  // (1) Doubling a letter
  rawWords.forEach((word, wIdx) => {
    for (let i = 0; i < word.length; i++) {
      const ch = word[i];
      if (/^[a-zA-Z]$/.test(ch)) {
        const doubledWord = word.slice(0, i) + ch + word.slice(i);
        const newWords = [...rawWords];
        newWords[wIdx] = doubledWord;
        addCandidate(newWords, `Double '${ch.toUpperCase()}'`);
      }
    }
  });

  // (2) Adding a trailing a/h/i/y
  const trailingAdditions = ['a', 'h', 'i', 'y'];
  trailingAdditions.forEach((addChar) => {
    // Add to first word if multi-word
    if (rawWords.length > 1) {
      const newWords = [...rawWords];
      newWords[0] = newWords[0] + addChar;
      addCandidate(newWords, `+ ${addChar.toUpperCase()} to first name`);
    }
    // Add to end of entire name
    const newWordsEnd = [...rawWords];
    newWordsEnd[newWordsEnd.length - 1] = newWordsEnd[newWordsEnd.length - 1] + addChar;
    addCandidate(newWordsEnd, `+ ${addChar.toUpperCase()} at end`);
  });

  // (3) Dropping a non-initial letter
  rawWords.forEach((word, wIdx) => {
    if (word.length > 2) {
      for (let i = 1; i < word.length; i++) {
        const ch = word[i];
        if (/^[a-zA-Z]$/.test(ch)) {
          const droppedWord = word.slice(0, i) + word.slice(i + 1);
          const newWords = [...rawWords];
          newWords[wIdx] = droppedWord;
          addCandidate(newWords, `Drop '${ch.toUpperCase()}'`);
        }
      }
    }
  });

  // (4) Common Indian spelling alternates
  const alternates = (spellingAlternatesData as any).alternates || [];
  for (const alt of alternates) {
    const regex = new RegExp(alt.pattern, 'gi');
    if (regex.test(name)) {
      const replaced = name.replace(regex, (match) => {
        // preserve casing roughly
        if (match[0] === match[0].toUpperCase()) {
          return alt.replacement.charAt(0).toUpperCase() + alt.replacement.slice(1);
        }
        return alt.replacement;
      });
      const words = replaced.trim().split(/\s+/);
      addCandidate(words, `${alt.description || alt.pattern + ' → ' + alt.replacement}`);
    }
  }

  // Evaluate each candidate
  const validSuggestions: NameVariantSuggestion[] = [];

  for (const cand of candidateMap.values()) {
    const calc = nameNumber(cand.name);
    const harmM = getHarmonyRelation(mulank, calc.reduced);
    const harmB = getHarmonyRelation(bhagyank, calc.reduced);

    // Keep ONLY variants whose Name Number is friendly with BOTH Mulank and Bhagyank
    if (harmM === 'friendly' && harmB === 'friendly') {
      validSuggestions.push({
        suggestedName: cand.name,
        compound: calc.compound,
        reduced: calc.reduced,
        harmonyMulank: harmM,
        harmonyBhagyank: harmB,
        changeMade: cand.changeMade
      });
    }
  }

  // Rank by harmony (e.g. matching Mulank or Bhagyank directly) then smallest change
  validSuggestions.sort((a, b) => {
    const aMatchesBirth = (a.reduced === mulank || a.reduced === bhagyank) ? 1 : 0;
    const bMatchesBirth = (b.reduced === mulank || b.reduced === bhagyank) ? 1 : 0;
    if (bMatchesBirth !== aMatchesBirth) return bMatchesBirth - aMatchesBirth;

    const diffA = Math.abs(a.suggestedName.length - name.length);
    const diffB = Math.abs(b.suggestedName.length - name.length);
    return diffA - diffB;
  });

  return validSuggestions.slice(0, 5);
}
