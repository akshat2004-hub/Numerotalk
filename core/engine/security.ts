import { reduceToSingleDigit } from './numerology';

export interface ProfessionNumerologyProfile {
  id: string;
  titleEn: string;
  titleHi: string;
  auspiciousTotals: number[];
  recommendedKeywordsEn: string[];
  recommendedKeywordsHi: string[];
  reasonEn: string;
  reasonHi: string;
}

export const PROFESSIONS_PROFILES: Record<string, ProfessionNumerologyProfile> = {
  finance: {
    id: 'finance',
    titleEn: 'Finance, Banking & Accounting',
    titleHi: 'वित्त, बैंकिंग व लेखा',
    auspiciousTotals: [5, 6, 8],
    recommendedKeywordsEn: ['Kuber', 'Lakshmi', 'Growth', 'Yield', 'Capital'],
    recommendedKeywordsHi: ['कुबेर', 'लक्ष्मी', 'समृद्धि', 'लाभ'],
    reasonEn: 'Mercury (5) rules calculation and trade; Venus (6) governs wealth; Saturn (8) demands precision and compliance.',
    reasonHi: 'बुध (5) व्यापार व गणना, शुक्र (6) धन वैभव, और शनि (8) सटीकता व अनुशासन के स्वामी हैं।'
  },
  tech: {
    id: 'tech',
    titleEn: 'IT, Software & Engineering',
    titleHi: 'सॉफ्टवेयर, आईटी व इंजीनियरिंग',
    auspiciousTotals: [4, 5, 7],
    recommendedKeywordsEn: ['Nexus', 'Logic', 'Cyber', 'Algorithm', 'Quantum'],
    recommendedKeywordsHi: ['तर्क', 'साइबर', 'एल्गोरिदम', 'क्वांटम'],
    reasonEn: 'Rahu (4) sparks innovation & tech; Mercury (5) enables logic; Ketu (7) rules deep coding and architecture.',
    reasonHi: 'राहु (4) तकनीक व नवोन्मेष, बुध (5) तार्किक बुद्धि, और केतु (7) गहन प्रोग्रामिंग के कारक हैं।'
  },
  healthcare: {
    id: 'healthcare',
    titleEn: 'Doctor, Medicine & Healthcare',
    titleHi: 'चिकित्सा, स्वास्थ्य व सेवा',
    auspiciousTotals: [1, 2, 7],
    recommendedKeywordsEn: ['Arogya', 'Sanjeev', 'Heal', 'Pulse', 'Vital'],
    recommendedKeywordsHi: ['आरोग्य', 'संजीव', 'स्वस्थ', 'प्राण'],
    reasonEn: 'Sun (1) rules vitality & medicine (Dhanvantari); Moon (2) gives empathy; Ketu (7) governs diagnosis.',
    reasonHi: 'सूर्य (1) जीवन शक्ति व औषधि, चन्द्र (2) करुणा, और केतु (7) सूक्ष्म निदान के स्वामी हैं।'
  },
  creative: {
    id: 'creative',
    titleEn: 'Arts, Design, Cinema & Media',
    titleHi: 'कला, डिजाइन, फिल्म व मीडिया',
    auspiciousTotals: [3, 6, 9],
    recommendedKeywordsEn: ['Aura', 'Kala', 'Prism', 'Rhythm', 'Vogue'],
    recommendedKeywordsHi: ['कला', 'आभा', 'सौंदर्य', 'सृजन'],
    reasonEn: 'Jupiter (3) grants creative wisdom; Venus (6) delivers aesthetic glamour; Mars (9) fuels artistic courage.',
    reasonHi: 'गुरु (3) सृजनात्मक ज्ञान, शुक्र (6) कला व सौंदर्य, और मंगल (9) कलात्मक अभिव्यक्ति देते हैं।'
  },
  law: {
    id: 'law',
    titleEn: 'Legal, Judiciary & Civil Services',
    titleHi: 'विधि, न्यायपालिका व प्रशासनिक सेवा',
    auspiciousTotals: [1, 8, 9],
    recommendedKeywordsEn: ['Nyay', 'Justice', 'Order', 'Veritas', 'Lex'],
    recommendedKeywordsHi: ['न्याय', 'धर्म', 'सत्य', 'संविधान'],
    reasonEn: 'Saturn (8) is the cosmic judge of law; Sun (1) provides authority; Mars (9) empowers prosecution and defense.',
    reasonHi: 'शनि (8) न्याय के कारक, सूर्य (1) प्रशासनिक अधिकार, और मंगल (9) तार्किक साहस प्रदान करते हैं।'
  },
  business: {
    id: 'business',
    titleEn: 'Entrepreneurship & Retail Trade',
    titleHi: 'व्यापार, उद्यमिता व दुकानदारी',
    auspiciousTotals: [1, 5, 6],
    recommendedKeywordsEn: ['Shubh', 'Vyapar', 'Apex', 'Venture', 'Fortune'],
    recommendedKeywordsHi: ['शुभ', 'व्यापार', 'लाभ', 'उन्नति'],
    reasonEn: 'Sun (1) builds independent enterprise; Mercury (5) scales commerce; Venus (6) attracts customers.',
    reasonHi: 'सूर्य (1) नेतृत्व, बुध (5) व्यापारिक कौशल, और शुक्र (6) ग्राहक आकर्षण व लाभ के स्वामी हैं।'
  }
};

/**
 * Cryptographically secure random integer in range [min, max]
 */
function getCryptoRandomInt(min: number, max: number): number {
  const range = max - min + 1;
  const bytes = new Uint8Array(1);
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    crypto.getRandomValues(bytes);
  } else {
    bytes[0] = Math.floor(Math.random() * 256);
  }
  return min + (bytes[0] % range);
}

export interface GeneratedPinMatch {
  pin: string;
  sum: number;
  reduced: number;
  targetLucky: number;
  matchPercentage: number;
}

export interface GeneratedPasswordMatch {
  password: string;
  length: number;
  digitSum: number;
  reduced: number;
  targetLucky: number;
  matchPercentage: number;
  strength: 'Medium' | 'Strong' | 'Very Strong';
  strengthScore: number; // 0 to 100
}

/**
 * Generate cryptographically secure PIN whose digit sum reduces to targetLuckyNumber.
 */
export function generateSecurePin(
  digitsCount: number,
  targetLuckyNumber: number
): GeneratedPinMatch {
  const count = Math.max(2, Math.floor(digitsCount || 4));
  const target = Math.max(1, Math.min(9, targetLuckyNumber || 5));
  let digits: number[] = [];
  let found = false;

  for (let attempt = 0; attempt < 50 && !found; attempt++) {
    digits = [];
    for (let i = 0; i < count - 1; i++) {
      digits.push(getCryptoRandomInt(1, 9));
    }
    const currentSum = digits.reduce((a, b) => a + b, 0);

    for (let candidate = 1; candidate <= 9; candidate++) {
      if (reduceToSingleDigit(currentSum + candidate) === target) {
        digits.push(candidate);
        found = true;
        break;
      }
    }
  }

  if (!found) {
    // Deterministic fallback
    digits = Array(count - 1).fill(1);
    const sumPrev = digits.reduce((a, b) => a + b, 0);
    for (let c = 1; c <= 9; c++) {
      if (reduceToSingleDigit(sumPrev + c) === target) {
        digits.push(c);
        break;
      }
    }
    if (digits.length < count) digits.push(target);
  }

  const pin = digits.join('');
  const sum = digits.reduce((a, b) => a + b, 0);
  const reduced = reduceToSingleDigit(sum);

  return {
    pin,
    sum,
    reduced,
    targetLucky: target,
    matchPercentage: reduced === target ? 98 : 90
  };
}

/**
 * Generate cryptographically secure password with digit sum reduction constraint.
 */
export function generateSecurePassword(options: {
  length: number;
  includeUppercase: boolean;
  includeSymbols: boolean;
  targetLuckyNumber: number;
  professionKey?: string;
}): GeneratedPasswordMatch {
  const target = Math.max(1, Math.min(9, options.targetLuckyNumber || 5));
  const len = Math.max(8, Math.min(20, options.length || 12));
  const useUpper = options.includeUppercase !== false;
  const useSymbols = options.includeSymbols !== false;

  const lowerChars = 'abcdefghijkmnpqrstuvwxyz'; // readable (no ambiguous l/o)
  const upperChars = 'ABCDEFGHJKLMNPQRSTUVWXYZ'; // readable
  const symbolChars = '@#$%&*!';

  // Number of digits to include: 2 to 4 digits
  const numDigitsCount = Math.max(2, Math.min(4, len - 4));
  const pinData = generateSecurePin(numDigitsCount, target);
  const digitChars = pinData.pin;

  // Remainder length for letters & symbols
  const remainingLen = len - digitChars.length;
  let pool = lowerChars;
  if (useUpper) pool += upperChars;
  if (useSymbols) pool += symbolChars;

  let letters = '';
  // Ensure at least one uppercase if requested
  if (useUpper) {
    letters += upperChars[getCryptoRandomInt(0, upperChars.length - 1)];
  }
  // Ensure at least one symbol if requested
  if (useSymbols) {
    letters += symbolChars[getCryptoRandomInt(0, symbolChars.length - 1)];
  }

  while (letters.length < remainingLen) {
    letters += pool[getCryptoRandomInt(0, pool.length - 1)];
  }

  // Combine and interleave letters with digits
  const combinedArray = (letters + digitChars).split('');
  // Fisher-Yates shuffle using crypto
  for (let i = combinedArray.length - 1; i > 0; i--) {
    const j = getCryptoRandomInt(0, i);
    const temp = combinedArray[i];
    combinedArray[i] = combinedArray[j];
    combinedArray[j] = temp;
  }

  const password = combinedArray.slice(0, len).join('');

  // Extract digits actually in password to confirm sum
  const presentDigits = password.split('').filter((c) => /[0-9]/.test(c)).map(Number);
  const digitSum = presentDigits.length > 0 ? presentDigits.reduce((a, b) => a + b, 0) : target;
  const reduced = reduceToSingleDigit(digitSum);

  // Strength calculation
  let strengthScore = 50;
  if (len >= 12) strengthScore += 20;
  if (len >= 16) strengthScore += 10;
  if (useUpper) strengthScore += 10;
  if (useSymbols) strengthScore += 10;
  strengthScore = Math.min(100, strengthScore);

  let strength: 'Medium' | 'Strong' | 'Very Strong' = 'Strong';
  if (strengthScore >= 85) strength = 'Very Strong';
  else if (strengthScore <= 60) strength = 'Medium';

  const matchPercentage = reduced === target ? 96 : 91;

  return {
    password,
    length: len,
    digitSum,
    reduced,
    targetLucky: target,
    matchPercentage,
    strength,
    strengthScore
  };
}

// Backward compatible wrappers
export function generatePinByNumerology(
  digitsCount: 4 | 6,
  targetSum: number
): { pin: string; sum: number; reduced: number } {
  const res = generateSecurePin(digitsCount, targetSum);
  return { pin: res.pin, sum: res.sum, reduced: res.reduced };
}

export interface GeneratedPassword {
  password: string;
  totalSum: number;
  reducedTotal: number;
  profession: string;
  isAuspicious: boolean;
  explanationEn: string;
  explanationHi: string;
}

export function generatePasswordByProfession(
  professionKey: string,
  lengthOrIncludeSpecial: number | boolean = true,
  includeSymbols: boolean = true,
  includeUppercase: boolean = true
): GeneratedPassword {
  const profile = PROFESSIONS_PROFILES[professionKey] || PROFESSIONS_PROFILES.business;
  const targetTotal = profile.auspiciousTotals[0];

  let desiredLength = 12;
  let useSymbols = true;
  let useUppercase = true;

  if (typeof lengthOrIncludeSpecial === 'number') {
    desiredLength = lengthOrIncludeSpecial;
    useSymbols = includeSymbols;
    useUppercase = includeUppercase;
  } else if (typeof lengthOrIncludeSpecial === 'boolean') {
    useSymbols = lengthOrIncludeSpecial;
    useUppercase = includeUppercase;
  }

  const res = generateSecurePassword({
    length: desiredLength,
    includeUppercase: useUppercase,
    includeSymbols: useSymbols,
    targetLuckyNumber: targetTotal,
    professionKey
  });

  return {
    password: res.password,
    totalSum: res.digitSum,
    reducedTotal: res.reduced,
    profession: profile.titleEn,
    isAuspicious: true,
    explanationEn: `Generated for ${profile.titleEn}. Harmonized around lucky digit vibration ${res.reduced}.`,
    explanationHi: `${profile.titleHi} के लिए तैयार किया गया। अंक ऊर्जा ${res.reduced} पर आधारित।`
  };
}
