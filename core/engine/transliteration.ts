/**
 * Devanagari to Latin transliteration utility for Indian names.
 * Maps Hindi Devanagari vowels, consonants, and matras to standard Latin phonetics.
 */

const VOWELS: Record<string, string> = {
  'अ': 'A', 'आ': 'AA', 'इ': 'I', 'ई': 'EE', 'उ': 'U', 'ऊ': 'OO',
  'ऋ': 'RI', 'ए': 'E', 'ऐ': 'AI', 'ओ': 'O', 'औ': 'AU', 'अं': 'AN', 'अः': 'AH'
};

const MATRAS: Record<string, string> = {
  'ा': 'A', 'ि': 'I', 'ी': 'EE', 'ु': 'U', 'ू': 'OO',
  'ृ': 'RI', 'े': 'E', 'ै': 'AI', 'ो': 'O', 'ौ': 'AU',
  'ं': 'N', 'ँ': 'N', 'ः': 'H', '्': '' // Halant removes implicit vowel
};

const CONSONANTS: Record<string, string> = {
  'क': 'K', 'ख': 'KH', 'ग': 'G', 'घ': 'GH', 'ङ': 'NG',
  'च': 'CH', 'छ': 'CHH', 'ज': 'J', 'झ': 'JH', 'ञ': 'NY',
  'ट': 'T', 'ठ': 'TH', 'ड': 'D', 'ढ': 'DH', 'ण': 'N',
  'त': 'T', 'थ': 'TH', 'द': 'D', 'ध': 'DH', 'न': 'N',
  'प': 'P', 'फ': 'PH', 'ब': 'B', 'भ': 'BH', 'म': 'M',
  'य': 'Y', 'र': 'R', 'ल': 'L', 'व': 'V',
  'श': 'SH', 'ष': 'SH', 'स': 'S', 'ह': 'H',
  'क्ष': 'KSH', 'त्र': 'TR', 'ज्ञ': 'GY'
};

export interface TransliterationResult {
  original: string;
  transliterated: string;
  isDevanagari: boolean;
  charMapping: Array<{ devanagari: string; latin: string }>;
}

export function isDevanagariText(text: string): boolean {
  return /[\u0900-\u097F]/.test(text);
}

export function transliterateDevanagari(input: string): TransliterationResult {
  const trimmed = input.trim();
  const hasDevanagari = isDevanagariText(trimmed);

  if (!hasDevanagari) {
    const cleanLatin = trimmed.toUpperCase().replace(/[^A-Z\s]/g, '');
    return {
      original: input,
      transliterated: cleanLatin,
      isDevanagari: false,
      charMapping: cleanLatin.split('').map(c => ({ devanagari: c, latin: c }))
    };
  }

  let result = '';
  const charMapping: Array<{ devanagari: string; latin: string }> = [];
  const chars = Array.from(trimmed);

  for (let i = 0; i < chars.length; i++) {
    const char = chars[i];
    const nextChar = chars[i + 1];

    if (char === ' ') {
      result += ' ';
      charMapping.push({ devanagari: ' ', latin: ' ' });
      continue;
    }

    if (VOWELS[char]) {
      const lat = VOWELS[char];
      result += lat;
      charMapping.push({ devanagari: char, latin: lat });
    } else if (CONSONANTS[char]) {
      const baseConsonant = CONSONANTS[char];
      // Check if next char is a matra or halant
      if (nextChar && MATRAS[nextChar] !== undefined) {
        const matraVal = MATRAS[nextChar];
        result += baseConsonant + matraVal;
        charMapping.push({ devanagari: char + nextChar, latin: baseConsonant + matraVal });
        i++; // skip matra
      } else {
        // At the end of a word or before space, Indian names usually drop the inherent short 'a'
        const isEndOfWord = !nextChar || nextChar === ' ' || nextChar === '.';
        const latinAdd = isEndOfWord ? baseConsonant : baseConsonant + 'A';
        result += latinAdd;
        charMapping.push({ devanagari: char, latin: latinAdd });
      }
    } else if (MATRAS[char]) {
      const lat = MATRAS[char];
      result += lat;
      charMapping.push({ devanagari: char, latin: lat });
    } else if (/[a-zA-Z]/.test(char)) {
      result += char.toUpperCase();
      charMapping.push({ devanagari: char, latin: char.toUpperCase() });
    }
  }

  const cleanLatin = result.toUpperCase().replace(/[^A-Z\s]/g, '');

  return {
    original: input,
    transliterated: cleanLatin,
    isDevanagari: true,
    charMapping
  };
}
