import professionsData from '@/mocks/rules/professions.json';
import { UserProfile } from '../types';
import { calculateMulank, calculateBhagyank, calculateDestinyNumber } from './numerology';
import { calculateVedicGrid } from './grid';
import { calculateTimeNumerology } from './timeNumerology';

export interface ProfessionItem {
  id: string;
  name: { en: string; hi: string };
  category: string;
  icon: string;
  favourableMulank: number[];
  favourableBhagyank: number[];
  favourableDestiny: number[];
  favourableTime: number[];
  supportDigits: number[];
  reasonTemplates: { en: string; hi: string };
}

export interface RecommendedProfessionResult {
  profession: ProfessionItem;
  score: number;
  reasonsEn: string[];
  reasonsHi: string[];
  reasons: string[]; // For backward compatibility / localized default
  growthPeriodEn: string;
  growthPeriodHi: string;
  luckyWorkNumbers: number[];
  luckyWorkColorsEn: string[];
  luckyWorkColorsHi: string[];
}

export const PROFESSIONS_LIST: ProfessionItem[] = professionsData as ProfessionItem[];

export function scoreProfession(
  prof: ProfessionItem,
  profile: Partial<UserProfile>,
  hasBirthTime: boolean,
  mulank: number,
  bhagyank: number,
  destiny: number,
  timeNumber: number | null,
  presentDigits: number[]
): { score: number; reasonsEn: string[]; reasonsHi: string[] } {
  let raw = 0;
  const reasonsEn: string[] = [];
  const reasonsHi: string[] = [];

  const mulankMatch = prof.favourableMulank.includes(mulank);
  const bhagyankMatch = prof.favourableBhagyank.includes(bhagyank);
  const destinyMatch = prof.favourableDestiny.includes(destiny);
  const timeMatch = timeNumber !== null && prof.favourableTime.includes(timeNumber);

  const matchedSupport = prof.supportDigits.filter((d) => presentDigits.includes(d));

  if (hasBirthTime) {
    if (mulankMatch) {
      raw += 30;
      reasonsEn.push(`Mulank ${mulank} directly supports core ${prof.category.replace('_', ' ')} capabilities.`);
      reasonsHi.push(`मूलांक ${mulank} इस कार्यक्षेत्र के अनुकूल आवश्यक स्वाभाविक प्रतिभा प्रदान करता है।`);
    }
    if (bhagyankMatch) {
      raw += 25;
      reasonsEn.push(`Life Path ${bhagyank} (Bhagyank) guides your destiny toward sustained achievement.`);
      reasonsHi.push(`भाग्यांक ${bhagyank} दीर्घकालिक जीवन यात्रा में स्थिर सफलता का मार्ग प्रशस्त करता है।`);
    }
    if (destinyMatch) {
      raw += 20;
      reasonsEn.push(`Destiny name vibration ${destiny} elevates your professional reputation and outreach.`);
      reasonsHi.push(`नामांक ${destiny} की ध्वनि ऊर्जा सामाजिक प्रतिष्ठा और कार्यक्षेत्र में प्रभाव बढ़ाती है।`);
    }
    if (timeMatch && timeNumber !== null) {
      raw += 15;
      reasonsEn.push(`Birth time number ${timeNumber} reinforces structural authority and strategic focus.`);
      reasonsHi.push(`जन्म समय अंक ${timeNumber} प्रशासनिक दृढ़ता और रणनीतिक निर्णय क्षमता को बल देता है।`);
    }
    raw += Math.min(10, matchedSupport.length * 5);
  } else {
    // When birth time is absent, re-weight DOB and Destiny
    if (mulankMatch) {
      raw += 35;
      reasonsEn.push(`Mulank ${mulank} directly supports core ${prof.category.replace('_', ' ')} capabilities.`);
      reasonsHi.push(`मूलांक ${mulank} इस कार्यक्षेत्र के अनुकूल आवश्यक स्वाभाविक प्रतिभा प्रदान करता है।`);
    }
    if (bhagyankMatch) {
      raw += 30;
      reasonsEn.push(`Life Path ${bhagyank} (Bhagyank) guides your destiny toward sustained achievement.`);
      reasonsHi.push(`भाग्यांक ${bhagyank} दीर्घकालिक जीवन यात्रा में स्थिर सफलता का मार्ग प्रशस्त करता है।`);
    }
    if (destinyMatch) {
      raw += 25;
      reasonsEn.push(`Destiny name vibration ${destiny} elevates your professional reputation and outreach.`);
      reasonsHi.push(`नामांक ${destiny} की ध्वनि ऊर्जा सामाजिक प्रतिष्ठा और कार्यक्षेत्र में प्रभाव बढ़ाती है।`);
    }
    raw += Math.min(10, matchedSupport.length * 5);
  }

  if (matchedSupport.length > 0) {
    reasonsEn.push(`Active Vedic grid numbers (${matchedSupport.join(', ')}) energize key practical execution.`);
    reasonsHi.push(`वैदिक ग्रिड के सक्रिय अंक (${matchedSupport.join(', ')}) व्यावहारिक दक्षता को बढ़ाते हैं।`);
  }

  // Ensure at least 2 clear reasons
  if (reasonsEn.length < 2) {
    reasonsEn.push(prof.reasonTemplates.en);
    reasonsHi.push(prof.reasonTemplates.hi);
  }

  // Deterministic score scaling (54% to 96%)
  const score = Math.min(97, Math.max(54, 52 + Math.round((raw / 100) * 44)));

  return { score, reasonsEn, reasonsHi };
}

export function recommendProfessions(
  profile: Partial<UserProfile>,
  n: number = 3
): RecommendedProfessionResult[] {
  const dob = profile.dob || '1995-10-23';
  const name = profile.name || 'User Profile';
  const mulank = calculateMulank(dob).mulank;
  const bhagyank = calculateBhagyank(dob).bhagyank;
  const destiny = calculateDestinyNumber(name).destinyNumber;
  const grid = calculateVedicGrid(dob);
  const presentDigits = grid.presentNumbers;

  const hasBirthTime = !!profile.birthTime && profile.birthTime.includes(':');
  let timeNumber: number | null = null;
  if (hasBirthTime) {
    const parts = (profile.birthTime || '10:30').split(':');
    const hrs = parseInt(parts[0], 10) || 10;
    const mins = parseInt(parts[1], 10) || 30;
    timeNumber = calculateTimeNumerology(hrs, mins).totalReduced;
  }

  const scoredList = PROFESSIONS_LIST.map((prof) => {
    const { score, reasonsEn, reasonsHi } = scoreProfession(
      prof,
      profile,
      hasBirthTime,
      mulank,
      bhagyank,
      destiny,
      timeNumber,
      presentDigits
    );

    const luckyWorkNumbers = Array.from(
      new Set([mulank, bhagyank, ...prof.favourableMulank.slice(0, 1)])
    );

    return {
      profession: prof,
      score,
      reasonsEn,
      reasonsHi,
      reasons: reasonsEn,
      growthPeriodEn: `Personal Years ${mulank}, ${bhagyank} & Ages ${20 + mulank * 3}, ${30 + bhagyank * 2}`,
      growthPeriodHi: `व्यक्तिगत वर्ष ${mulank}, ${bhagyank} एवं आयु वर्ष ${20 + mulank * 3}, ${30 + bhagyank * 2}`,
      luckyWorkNumbers,
      luckyWorkColorsEn: ['Navy Blue', 'Sovereign Gold', 'Emerald Green'],
      luckyWorkColorsHi: ['गहरा नीला', 'स्वर्णिम', 'पन्ना हरा']
    };
  });

  // Sort descending by score, deterministic tie-breaking by id
  scoredList.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.profession.id.localeCompare(b.profession.id);
  });

  return scoredList.slice(0, n);
}

export function evaluateSingleProfession(
  profId: string,
  profile: Partial<UserProfile>
): RecommendedProfessionResult | null {
  const prof = PROFESSIONS_LIST.find((p) => p.id === profId);
  if (!prof) return null;

  const dob = profile.dob || '1995-10-23';
  const name = profile.name || 'User Profile';
  const mulank = calculateMulank(dob).mulank;
  const bhagyank = calculateBhagyank(dob).bhagyank;
  const destiny = calculateDestinyNumber(name).destinyNumber;
  const grid = calculateVedicGrid(dob);
  const presentDigits = grid.presentNumbers;

  const hasBirthTime = !!profile.birthTime && profile.birthTime.includes(':');
  let timeNumber: number | null = null;
  if (hasBirthTime) {
    const parts = (profile.birthTime || '10:30').split(':');
    const hrs = parseInt(parts[0], 10) || 10;
    const mins = parseInt(parts[1], 10) || 30;
    timeNumber = calculateTimeNumerology(hrs, mins).totalReduced;
  }

  const { score, reasonsEn, reasonsHi } = scoreProfession(
    prof,
    profile,
    hasBirthTime,
    mulank,
    bhagyank,
    destiny,
    timeNumber,
    presentDigits
  );

  const luckyWorkNumbers = Array.from(
    new Set([mulank, bhagyank, ...prof.favourableMulank.slice(0, 1)])
  );

  return {
    profession: prof,
    score,
    reasonsEn,
    reasonsHi,
    reasons: reasonsEn,
    growthPeriodEn: `Personal Years ${mulank}, ${bhagyank} & Ages ${20 + mulank * 3}, ${30 + bhagyank * 2}`,
    growthPeriodHi: `व्यक्तिगत वर्ष ${mulank}, ${bhagyank} एवं आयु वर्ष ${20 + mulank * 3}, ${30 + bhagyank * 2}`,
    luckyWorkNumbers,
    luckyWorkColorsEn: ['Navy Blue', 'Sovereign Gold', 'Emerald Green'],
    luckyWorkColorsHi: ['गहरा नीला', 'स्वर्णिम', 'पन्ना हरा']
  };
}

