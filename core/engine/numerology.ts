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

/**
 * Generates plain-text derivation string for Driver / Mulank.
 * E.g., Day 23 → 2 + 3 = 5, or Day 5 = 5.
 */
export function getDriverDerivation(dob: string | Date): string {
  const { day } = parseDob(dob);
  if (day <= 9) {
    return `Day ${day} = ${day}`;
  }
  const digits = String(day).split('').map(Number);
  const sum = digits.reduce((a, b) => a + b, 0);
  const reduced = reduceToSingleDigit(sum);
  if (sum > 9 && sum !== reduced) {
    return `Day ${day} → ${digits.join(' + ')} = ${sum} → ${reduced}`;
  }
  return `Day ${day} → ${digits.join(' + ')} = ${reduced}`;
}

/**
 * Generates plain-text derivation string for Conductor / Bhagyank.
 * E.g., Full date 23-10-1995 → 30 → 3.
 */
export function getConductorDerivation(dob: string | Date): string {
  const { day, month, year, digits } = parseDob(dob);
  const padDay = String(day).padStart(2, '0');
  const padMonth = String(month).padStart(2, '0');
  const rawSum = digits.reduce((a, b) => a + b, 0);
  const reduced = reduceToSingleDigit(rawSum);
  return `Full date ${padDay}-${padMonth}-${year} → ${rawSum} → ${reduced}`;
}

/**
 * Generates plain-text derivation string for Destiny / Namank.
 * E.g., RAHUL SHARMA → 33 → 6.
 */
export function getDestinyDerivation(name: string): string {
  const calc = nameNumber(name || 'Rahul Sharma');
  const upper = (calc.transliteratedName || name || 'Name').toUpperCase().trim();
  if (calc.compound > 9) {
    return `${upper} → ${calc.compound} → ${calc.reduced}`;
  }
  return `${upper} → ${calc.reduced}`;
}

export interface ConductorReadingItem {
  number: number;
  title: { en: string; hi: string };
  description: { en: string; hi: string };
  lifePurpose: { en: string; hi: string };
  favorablePath: { en: string; hi: string };
}

export const CONDUCTOR_READINGS: Record<number, ConductorReadingItem> = {
  1: {
    number: 1,
    title: { en: 'The Visionary Pioneer', hi: 'दूरदर्शी पथप्रदर्शक' },
    description: {
      en: 'Your life path is destined for authoritative leadership, trailblazing ventures, and independent achievement. The universe commands you to create paths where none exist.',
      hi: 'आपका जीवन पथ नेतृत्व, नवोन्मेष और स्वतंत्र उपलब्धियों के लिए निर्धारित है। ब्रह्मांड आपको स्वयं अपना मार्ग प्रशस्त करने की प्रेरणा देता है।'
    },
    lifePurpose: {
      en: 'Inspire and guide others through unwavering self-reliance and initiative.',
      hi: 'आत्मविश्वास और नवाचार के माध्यम से दूसरों को प्रेरित करना।'
    },
    favorablePath: {
      en: 'Entrepreneurship, administration, political diplomacy, and strategic innovation.',
      hi: 'उद्यमिता, प्रशासनिक सेवाएं, कूटनीति और रणनीतिक नवाचार।'
    }
  },
  2: {
    number: 2,
    title: { en: 'The Peacemaker & Diplomat', hi: 'शांतिदूत एवं कूटनीतिज्ञ' },
    description: {
      en: 'Your life path evolves through harmonious collaboration, deep empathy, and intuitive wisdom. You are the emotional anchor who unites divided realms.',
      hi: 'आपका जीवन पथ सामंजस्यपूर्ण साझेदारी, गहन सहानुभूति और सहज अंतर्ज्ञान के माध्यम से विकसित होता है।'
    },
    lifePurpose: {
      en: 'Bridge conflicts and restore cosmic balance through patient mediation.',
      hi: 'मतभेदों को दूर कर जीवन में शांति और संतुलन स्थापित करना।'
    },
    favorablePath: {
      en: 'Counseling, diplomacy, creative arts, healing, and human relations.',
      hi: 'परामर्श, कूटनीति, ललित कलाएं, हीलिंग और जनसंपर्क।'
    }
  },
  3: {
    number: 3,
    title: { en: 'The Creative Philosopher & Mentor', hi: 'सृजनशील दार्शनिक एवं मार्गदर्शक' },
    description: {
      en: 'Your destiny flows with profound wisdom, expressive creativity, and inspiring speech. You expand consciousness wherever you go and uplift society.',
      hi: 'आपका भाग्य गहन ज्ञान, अभिव्यक्ति की कला और प्रेरक वाणी से आलोकित है। आप जहां भी जाते हैं, सकारात्मक चेतना का विस्तार करते हैं।'
    },
    lifePurpose: {
      en: 'Educate, inspire joy, and communicate higher truth to the world.',
      hi: 'संसार को शिक्षित करना, आनंद का प्रसार करना और उच्च ज्ञान साझा करना।'
    },
    favorablePath: {
      en: 'Teaching, literature, public speaking, advisory roles, and higher counsel.',
      hi: 'शिक्षण, साहित्य, व्याख्यान, परामर्श और उच्च बौद्धिक कार्यक्षेत्र।'
    }
  },
  4: {
    number: 4,
    title: { en: 'The Master Architect & Disciplinarian', hi: 'दृढ़ शिल्पी एवं व्यवस्थापक' },
    description: {
      en: 'Your life path is structured around enduring foundations, meticulous discipline, and practical mastery. You turn abstract ideas into permanent realities.',
      hi: 'आपका जीवन पथ सुदृढ़ नींव, कठोर अनुशासन और व्यावहारिक दक्षता पर आधारित है। आप विचारों को ठोस यथार्थ में परिवर्तित करते हैं।'
    },
    lifePurpose: {
      en: 'Construct resilient structures and bring systematic order to chaotic environments.',
      hi: 'अव्यवस्थित परिस्थितियों में नियम, स्थिरता और सुदृढ़ प्रणाली स्थापित करना।'
    },
    favorablePath: {
      en: 'Engineering, law, infrastructure, project administration, and finance.',
      hi: 'अभियांत्रिकी, विधि, आधारभूत संरचना, परियोजना प्रबंधन और वित्त।'
    }
  },
  5: {
    number: 5,
    title: { en: 'The Catalyst of Commerce & Freedom', hi: 'व्यापार एवं स्वतंत्रता का प्रेरक' },
    description: {
      en: 'Your life path thrives on agile transformation, commercial intelligence, and versatile exploration. You excel where rapid change and communication intersect.',
      hi: 'आपका जीवन पथ गतिशील परिवर्तन, व्यापारिक बुद्धिमत्ता और बहुमुखी अन्वेषण से समृद्ध है। आप संवाद और त्वरित निर्णय क्षमता में उत्कृष्ट हैं।'
    },
    lifePurpose: {
      en: 'Embrace progressive change, network widely, and catalyze economic growth.',
      hi: 'प्रगतिशील परिवर्तनों को अपनाना, संबंधों का विस्तार करना और आर्थिक विकास को गति देना।'
    },
    favorablePath: {
      en: 'International trade, media, technology sales, travel, and financial investments.',
      hi: 'अंतरराष्ट्रीय व्यापार, मीडिया, तकनीकी विक्रय, यात्रा और वित्तीय निवेश।'
    }
  },
  6: {
    number: 6,
    title: { en: 'The Harmonic Guardian & Healer', hi: 'सौंदर्य, पोषण एवं सद्भाव का संरक्षक' },
    description: {
      en: 'Your destiny embodies domestic grace, aesthetic brilliance, and nurturing responsibility. You attract luxury, love, and harmonious environments naturally.',
      hi: 'आपका भाग्य पारिवारिक गरिमा, सौंदर्यबोध और सेवा भाव का प्रतीक है। आप स्वाभाविक रूप से समृद्धि, प्रेम और सामंजस्य को आकर्षित करते हैं।'
    },
    lifePurpose: {
      en: 'Nurture family and community while beautifying the material and social world.',
      hi: 'परिवार व समाज का पोषण करना और सांसारिक व सामाजिक वातावरण को सुंदर बनाना।'
    },
    favorablePath: {
      en: 'Design, hospitality, medicine, luxury goods, public welfare, and entertainment.',
      hi: 'डिजाइन, आतिथ्य, चिकित्सा, विलासिता, समाज कल्याण और कला क्षेत्र।'
    }
  },
  7: {
    number: 7,
    title: { en: 'The Mystic Researcher & Truth-Seeker', hi: 'रहस्यदर्शी शोधकर्ता एवं तत्वज्ञानी' },
    description: {
      en: 'Your life path is dedicated to introspection, intellectual inquiry, and spiritual realization. You look beyond surface appearances to reveal hidden truths.',
      hi: 'आपका जीवन पथ आत्मनिरीक्षण, बौद्धिक अन्वेषण और आध्यात्मिक अनुभूति को समर्पित है। आप बाह्य आवरण से परे जाकर सत्य का साक्षात्कार करते हैं।'
    },
    lifePurpose: {
      en: 'Uncover esoteric secrets, develop inner awareness, and share philosophical depth.',
      hi: 'गूढ़ सत्यों की खोज करना, अंतर्दृष्टि विकसित करना और दार्शनिक ज्ञान प्रदान करना।'
    },
    favorablePath: {
      en: 'Scientific research, analytics, metaphysics, psychology, and spiritual teaching.',
      hi: 'वैज्ञानिक शोध, विश्लेषण, पराविद्या, मनोविज्ञान और आध्यात्मिक चिंतन।'
    }
  },
  8: {
    number: 8,
    title: { en: 'The Sovereign Karmic Ruler', hi: 'कर्मयोगी शासक एवं न्यायप्रिय नियंत्रक' },
    description: {
      en: 'Your life path demands karmic mastery, immense perseverance, and material-spiritual equilibrium. You rise to formidable power through sheer endurance.',
      hi: 'आपका जीवन पथ कर्म के संतुलन, अपार धैर्य और भौतिक-आध्यात्मिक सामंजस्य की मांग करता है। आप सतत परिश्रम से असाधारण ऊंचाई प्राप्त करते हैं।'
    },
    lifePurpose: {
      en: 'Execute righteous authority, manage large-scale resources, and manifest enduring karma.',
      hi: 'न्यायपूर्ण शक्ति का संचालन करना, वृहद संसाधनों का प्रबंधन और स्थायी उपलब्धियां हासिल करना।'
    },
    favorablePath: {
      en: 'Real estate, judicial leadership, manufacturing, mining, and executive governance.',
      hi: 'रियल एस्टेट, न्यायिक क्षेत्र, विनिर्माण, उद्योग और कॉर्पोरेट प्रशासन।'
    }
  },
  9: {
    number: 9,
    title: { en: 'The Universal Humanitarian & Champion', hi: 'वैश्विक मानवतावादी एवं पराक्रमी योद्धा' },
    description: {
      en: 'Your life path encompasses universal compassion, fiery courage, and boundless philanthropy. You fight for the disenfranchised and complete grand life cycles.',
      hi: 'आपका जीवन पथ सार्वभौमिक करुणा, असीम साहस और उदार परोपकार का परिचायक है। आप समाज के उत्थान के लिए निर्भीकता से संघर्ष करते हैं।'
    },
    lifePurpose: {
      en: 'Serve humanity selflessly, lead courageous missions, and elevate global consciousness.',
      hi: 'मानवता की निःस्वार्थ सेवा, साहसिक अभियानों का नेतृत्व और चेतना का उन्नयन।'
    },
    favorablePath: {
      en: 'Defense, humanitarian leadership, sports, social activism, and healing arts.',
      hi: 'रक्षा सेवाएं, परोपकारी नेतृत्व, खेलकूद, सामाजिक आंदोलन और चिकित्सा विज्ञान।'
    }
  }
};

export function getConductorReading(bhagyank: number): ConductorReadingItem {
  const safe = Math.min(9, Math.max(1, bhagyank || 1));
  return CONDUCTOR_READINGS[safe] || CONDUCTOR_READINGS[3];
}

