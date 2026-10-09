import { parseDob, calculateMulank, calculateBhagyank, reduceToSingleDigit } from './numerology';
import { calculateVedicGrid, VedicGridResult } from './grid';
import { detectYogas, DetectedYoga } from './yogas';
import dashaConfig from '@/mocks/rules/dasha.json';

export interface DashaPeriod {
  level: 'Mahadasha' | 'Antardasha' | 'Pratyantra Dasha';
  levelHi: string;
  rulingNumber: number;
  rulerPlanetEn: string;
  rulerPlanetHi: string;
  startYear: number;
  endYear: number;
  periodLabel: string;
  periodLabelHi: string;
  descriptionEn: string;
  descriptionHi: string;
  meaningEn: string;
  meaningHi: string;
}

export interface YearlyPredictionResult {
  targetYear: number;
  personalYear: number;
  personalYearRulerEn: string;
  personalYearRulerHi: string;
  mahadasha: DashaPeriod;
  antardasha: DashaPeriod;
  pratyantraDasha: DashaPeriod;
  yearlyGrid: VedicGridResult;
  yearlyYogas: DetectedYoga[];
  repeatingYogas: DetectedYoga[];
  summaryEn: string;
  summaryHi: string;
}

const PLANET_NAMES: Record<number, { en: string; hi: string }> = {
  1: { en: 'Sun (Surya)', hi: 'सूर्य' },
  2: { en: 'Moon (Chandra)', hi: 'चन्द्र' },
  3: { en: 'Jupiter (Brihaspati)', hi: 'गुरु' },
  4: { en: 'Rahu', hi: 'राहु' },
  5: { en: 'Mercury (Budh)', hi: 'बुध' },
  6: { en: 'Venus (Shukra)', hi: 'शुक्र' },
  7: { en: 'Ketu', hi: 'केतु' },
  8: { en: 'Saturn (Shani)', hi: 'शनि' },
  9: { en: 'Mars (Mangal)', hi: 'मंगल' },
};

/**
 * Calculates Personal Year Number for a target year:
 * Day of Birth + Month of Birth + Target Year, reduced to single digit.
 */
export function calculatePersonalYear(dob: string | Date, targetYear: number): number {
  const { day, month } = parseDob(dob);
  const sum = day + month + targetYear;
  return reduceToSingleDigit(sum);
}

/**
 * Calculates Mahadasha, Antardasha, and Pratyantra Dasha for a given target year.
 */
export function calculateYearlyPrediction(
  dob: string | Date,
  targetYear: number = new Date().getFullYear()
): YearlyPredictionResult {
  const { year: birthYear } = parseDob(dob);
  const { mulank } = calculateMulank(dob);
  const { bhagyank } = calculateBhagyank(dob);

  const cycleYears = dashaConfig.dashaRules.cycleYears || 9;
  const age = Math.max(0, targetYear - birthYear);

  // Mahadasha cycle in Vedic Numerology:
  // Standard cycleYears (9-year) planetary cycle rooted at Mulank:
  const mdNumber = ((mulank - 1 + Math.floor(age / cycleYears)) % 9) + 1;
  const mdStart = birthYear + Math.floor(age / cycleYears) * cycleYears;
  const mdEnd = mdStart + cycleYears;

  // Antardasha is governed by Personal Year in current calendar cycle (DOB day + month + target year reduced)
  const personalYear = calculatePersonalYear(dob, targetYear);
  const adNumber = personalYear;
  const adStart = targetYear;
  const adEnd = targetYear + 1;

  // Pratyantra dasha is ruled by the blend of Mahadasha + Antardasha + Bhagyank
  const pdNumber = reduceToSingleDigit(mdNumber + adNumber + bhagyank);
  const pdStart = targetYear;
  const pdEnd = targetYear + 1;

  const mdPlanet = PLANET_NAMES[mdNumber] || { en: 'Sun', hi: 'सूर्य' };
  const adPlanet = PLANET_NAMES[adNumber] || { en: 'Mercury', hi: 'बुध' };
  const pdPlanet = PLANET_NAMES[pdNumber] || { en: 'Jupiter', hi: 'गुरु' };

  const meanings = (dashaConfig.dashaRules.dashaMeanings as Record<string, { en: string; hi: string }>) || {};
  const mdMeaning = meanings[String(mdNumber)] || { en: 'Period of active karmic lessons.', hi: 'कर्म फल एवं जीवन की दिशा निर्धारण का समय।' };
  const adMeaning = meanings[String(adNumber)] || { en: 'Annual catalyst for major milestones.', hi: 'वार्षिक उपलब्धियों और नए लक्ष्यों का समय।' };
  const pdMeaning = meanings[String(pdNumber)] || { en: 'Subtle daily rhythm and inner focus.', hi: 'दैनिक निर्णय व सूक्ष्म ऊर्जा प्रभाव।' };

  // Calculate year's combined Vedic Grid:
  const { day, month } = parseDob(dob);
  const yearString = `${String(day).padStart(2, '0')}-${String(month).padStart(2, '0')}-${targetYear}`;
  const yearlyGrid = calculateVedicGrid(yearString, true);
  const { yogas: yearlyYogas } = detectYogas(yearlyGrid);

  // Filter or detect yogas influenced by repeating numbers
  const repeatingDigitsSet = new Set(yearlyGrid.repeatingNumbers.map(r => r.number));
  const repeatingYogas = yearlyYogas.filter(y => y.numbers.some(n => repeatingDigitsSet.has(n)));

  const summaryEn = `Year ${targetYear} is influenced by Personal Year ${personalYear} under the rule of ${adPlanet.en}. With Mahadasha of ${mdPlanet.en}, this is a period for intentional action and strategic positioning.`;
  const summaryHi = `वर्ष ${targetYear} आपके लिए पर्सनल ईयर ${personalYear} और ${adPlanet.hi} के प्रभाव में है। ${mdPlanet.hi} की महादशा के साथ यह समय नई पहलों और संतुलित प्रगति के लिए श्रेष्ठ है।`;

  return {
    targetYear,
    personalYear,
    personalYearRulerEn: adPlanet.en,
    personalYearRulerHi: adPlanet.hi,
    mahadasha: {
      level: 'Mahadasha',
      levelHi: 'महादशा',
      rulingNumber: mdNumber,
      rulerPlanetEn: mdPlanet.en,
      rulerPlanetHi: mdPlanet.hi,
      startYear: mdStart,
      endYear: mdEnd,
      periodLabel: `${mdStart} – ${mdEnd}`,
      periodLabelHi: `${mdStart} – ${mdEnd}`,
      descriptionEn: `Major 9-year cycle governed by ${mdPlanet.en} (Number ${mdNumber}). Sets the overarching tone and spiritual-material backdrop.`,
      descriptionHi: `${mdPlanet.hi} (अंक ${mdNumber}) द्वारा शासित 9 वर्षीय मुख्य चक्र। यह आपके जीवन की मुख्य दिशा निर्धारित करता है।`,
      meaningEn: mdMeaning.en,
      meaningHi: mdMeaning.hi
    },
    antardasha: {
      level: 'Antardasha',
      levelHi: 'अंतर्दशा',
      rulingNumber: adNumber,
      rulerPlanetEn: adPlanet.en,
      rulerPlanetHi: adPlanet.hi,
      startYear: adStart,
      endYear: adEnd,
      periodLabel: `${targetYear}`,
      periodLabelHi: `वर्ष ${targetYear}`,
      descriptionEn: `Sub-period ruled by ${adPlanet.en} (Personal Year ${adNumber}). Influences key events, career shifts, and financial moves for ${targetYear}.`,
      descriptionHi: `${adPlanet.hi} (पर्सनल ईयर ${adNumber}) द्वारा शासित उप-चक्र। वर्ष ${targetYear} में मुख्य घटनाओं व करियर को दिशा देता है।`,
      meaningEn: adMeaning.en,
      meaningHi: adMeaning.hi
    },
    pratyantraDasha: {
      level: 'Pratyantra Dasha',
      levelHi: 'प्रत्यंतर दशा',
      rulingNumber: pdNumber,
      rulerPlanetEn: pdPlanet.en,
      rulerPlanetHi: pdPlanet.hi,
      startYear: pdStart,
      endYear: pdEnd,
      periodLabel: `${targetYear} (Sub-cycle)`,
      periodLabelHi: `${targetYear} (सूक्ष्म चक्र)`,
      descriptionEn: `Finer energy vibration of ${pdPlanet.en} (Number ${pdNumber}) guiding immediate decisions and day-to-day spiritual focus.`,
      descriptionHi: `${pdPlanet.hi} (अंक ${pdNumber}) का सूक्ष्म प्रभाव, जो तात्कालिक निर्णयों और मानसिक स्थिति को प्रभावित करता है।`,
      meaningEn: pdMeaning.en,
      meaningHi: pdMeaning.hi
    },
    yearlyGrid,
    yearlyYogas,
    repeatingYogas,
    summaryEn,
    summaryHi
  };
}
