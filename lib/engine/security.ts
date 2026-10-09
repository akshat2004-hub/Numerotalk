import { reduceToSingleDigit, CHALDEAN_MAP } from './numerology';

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

export interface GeneratedPassword {
  password: string;
  totalSum: number;
  reducedTotal: number;
  profession: string;
  isAuspicious: boolean;
  explanationEn: string;
  explanationHi: string;
}

export function generatePinByNumerology(
  digitsCount: 4 | 6,
  targetSum: number
): { pin: string; sum: number; reduced: number } {
  // Generate random digits that reduce to targetSum
  const digits: number[] = [];
  for (let i = 0; i < digitsCount - 1; i++) {
    digits.push(Math.floor(Math.random() * 9) + 1);
  }

  // Adjust last digit
  const currentSum = digits.reduce((a, b) => a + b, 0);
  for (let candidate = 1; candidate <= 9; candidate++) {
    if (reduceToSingleDigit(currentSum + candidate) === targetSum) {
      digits.push(candidate);
      break;
    }
  }

  if (digits.length < digitsCount) {
    digits.push(targetSum);
  }

  const pin = digits.join('');
  const sum = digits.reduce((a, b) => a + b, 0);
  return { pin, sum, reduced: reduceToSingleDigit(sum) };
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

  const keywords = profile.recommendedKeywordsEn;
  let baseKeyword = keywords[Math.floor(Math.random() * keywords.length)];
  if (!useUppercase) {
    baseKeyword = baseKeyword.toLowerCase();
  }

  const specialChars = ['#', '@', '$', '!'];
  const special = useSymbols ? specialChars[Math.floor(Math.random() * specialChars.length)] : '';

  // Generate digits to hit desired length and targetTotal
  const remainingDigits = Math.max(2, desiredLength - baseKeyword.length - (special ? 1 : 0));
  const pin = generatePinByNumerology(remainingDigits >= 6 ? 6 : 4, targetTotal).pin;
  const password = `${baseKeyword}${special}${pin}`.slice(0, Math.max(8, desiredLength));

  // Calculate Chaldean sum of password
  let totalSum = 0;
  for (const char of password.toUpperCase()) {
    if (CHALDEAN_MAP[char]) {
      totalSum += CHALDEAN_MAP[char];
    } else if (/[0-9]/.test(char)) {
      totalSum += Number(char);
    }
  }

  const reduced = reduceToSingleDigit(totalSum);
  const isAuspicious = profile.auspiciousTotals.includes(reduced);

  return {
    password,
    totalSum,
    reducedTotal: reduced,
    profession: profile.titleEn,
    isAuspicious,
    explanationEn: `Generated for ${profile.titleEn}. Anchored around vibrational total ${reduced}. ${profile.reasonEn}`,
    explanationHi: `${profile.titleHi} के लिए तैयार किया गया। अंक ऊर्जा ${reduced} पर आधारित। ${profile.reasonHi}`
  };
}
