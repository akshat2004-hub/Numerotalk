import { Locale, NumberReading, DestinyReading, CombinationReading, MissingNumberReading, RepeatingNumberReading, RemedyMasterItem, HelpTipItem } from '@/types';
import numbersData from '@/mocks/numbers.json';
import destinyData from '@/mocks/destiny.json';
import combinationsData from '@/mocks/combinations.json';
import missingData from '@/mocks/missing.json';
import repeatingData from '@/mocks/repeating.json';
import remediesData from '@/mocks/remedies.json';
import helpData from '@/mocks/help.json';
import {
  calculateMulank,
  calculateBhagyank,
  calculateDestinyNumber,
  calculateVedicGrid,
  detectYogas,
  getNumberRelationship,
  calculateMatchMaking,
  calculateYearlyPrediction,
  analyzeMobileNumber,
  calculateTimeNumerology,
  calculateVastuNumerology,
  calculateEventPredictions,
  getNumberMeaning,
  generatePasswordByProfession,
  generatePinByNumerology,
  MatchProfileInput
} from '@/lib/engine';

export const numerologyService = {
  /**
   * Fetches the core Number Reading (planet, positive/negative traits, lucky attributes).
   */
  async getNumberReading(num: number, _locale: Locale = 'en'): Promise<NumberReading | null> {
    const safeNum = Math.min(9, Math.max(1, num));
    const found = (numbersData as any[]).find(item => item.number === safeNum);
    return found || null;
  },

  /**
   * Fetches Destiny Number reading by Chaldean / Pythagorean system.
   */
  async getDestinyReading(destinyNum: number, _system: 'chaldean' | 'pythagorean' = 'chaldean', _locale: Locale = 'en'): Promise<DestinyReading | null> {
    const safeNum = Math.min(9, Math.max(1, destinyNum));
    const found = (destinyData as any[]).find(item => item.number === safeNum);
    return found || null;
  },

  /**
   * Fetches combination reading for Driver (Mulank) x Conductor (Bhagyank).
   */
  async getCombinationReading(mulank: number, bhagyank: number, _locale: Locale = 'en'): Promise<CombinationReading> {
    const rel = getNumberRelationship(mulank, bhagyank);
    const found = (combinationsData as any[]).find(
      c => c.mulank === mulank && c.bhagyank === bhagyank
    );

    if (found) return found;

    // Harmonious procedural fallback if specific pair entry not pre-cached
    const isFriendly = rel === 'friendly';
    return {
      mulank,
      bhagyank,
      relationType: rel,
      title: {
        en: `Mulank ${mulank} x Bhagyank ${bhagyank} Combination`,
        hi: `मूलांक ${mulank} और भाग्यांक ${bhagyank} का संयोग`
      },
      synergyAnalysis: {
        en: isFriendly
          ? `Driver ${mulank} and Conductor ${bhagyank} share harmonious planetary resonance, creating natural flow in career moves and personal endeavors.`
          : `Driver ${mulank} and Conductor ${bhagyank} possess contrasting planetary temperaments. Success requires deliberate balance and focused remedies.`,
        hi: isFriendly
          ? `मूलांक ${mulank} और भाग्यांक ${bhagyank} के मध्य शुभ ग्रह संबंध है। यह संयोग जीवन में प्रगति और संतुलित सफलता प्रदान करता है।`
          : `मूलांक ${mulank} और भाग्यांक ${bhagyank} में भिन्न ग्रह ऊर्जाएं हैं। संयम और सुझाए गए उपायों से जीवन में सामंजस्य स्थापित होगा।`
      },
      careerGuidance: {
        en: `Blend the natural instincts of Number ${mulank} with the destiny direction of Number ${bhagyank}.`,
        hi: `अंक ${mulank} की स्वाभाविक प्रतिभा को अंक ${bhagyank} के भाग्य मार्ग के साथ जोड़कर आगे बढ़ें।`
      },
      personalLife: {
        en: `Cultivate mutual listening and avoid letting ego or rigidity dominate close discussions.`,
        hi: `संबंधों में अहंकार से बचें और परस्पर संवाद को प्राथमिकता दें।`
      },
      luckyRemedies: [
        { en: `Adopt balancing color shades of Number ${mulank}`, hi: `अंक ${mulank} के अनुकूल रंगों का प्रयोग करें` },
        { en: `Strengthen positive planetary vibrations through charity`, hi: `दान-पुण्य के माध्यम से ग्रह शांति बनाए रखें` }
      ]
    };
  },

  /**
   * Fetches missing numbers analysis and remedies for given missing digits.
   */
  async getMissingNumberRemedies(missingNumbers: number[], _locale: Locale = 'en'): Promise<MissingNumberReading[]> {
    return (missingData as any[]).filter(item => missingNumbers.includes(item.number));
  },

  /**
   * Fetches repeating numbers analysis for digits that appear > 1 time.
   */
  async getRepeatingNumberReadings(
    repeatingList: Array<{ number: number; count: number }>,
    _locale: Locale = 'en'
  ): Promise<RepeatingNumberReading[]> {
    const results: RepeatingNumberReading[] = [];

    for (const item of repeatingList) {
      const match = (repeatingData as any[]).find(
        r => r.number === item.number && (r.frequency === item.count || (item.count >= 3 && r.frequency === 3))
      ) || (repeatingData as any[]).find(r => r.number === item.number);

      if (match) {
        results.push({
          number: item.number,
          frequency: item.count,
          nature: match.nature,
          overloadImpact: match.overloadImpact,
          groundingRemedy: match.groundingRemedy
        });
      }
    }

    return results;
  },

  /**
   * Searches and filters the Master Remedies List.
   */
  async getRemediesMasterList(
    filters?: { query?: string; category?: string; number?: number },
    _locale: Locale = 'en'
  ): Promise<RemedyMasterItem[]> {
    let list = remediesData as RemedyMasterItem[];

    if (filters?.category && filters.category !== 'all') {
      list = list.filter(r => r.category.toLowerCase() === filters.category?.toLowerCase());
    }

    if (filters?.number && filters.number > 0) {
      list = list.filter(r => r.governingNumber === filters.number);
    }

    if (filters?.query && filters.query.trim() !== '') {
      const q = filters.query.toLowerCase().trim();
      list = list.filter(r =>
        r.title.en.toLowerCase().includes(q) ||
        r.title.hi.toLowerCase().includes(q) ||
        r.overview.en.toLowerCase().includes(q) ||
        r.overview.hi.toLowerCase().includes(q)
      );
    }

    return list;
  },

  /**
   * Fetches Numerology Guidance & Tips.
   */
  async getHelpTips(_locale: Locale = 'en'): Promise<HelpTipItem[]> {
    return helpData as HelpTipItem[];
  },

  /**
   * Direct calculation engine proxies (pure, unit-tested, client-side ready)
   */
  calculateMulank(dob: string) {
    return calculateMulank(dob);
  },

  calculateBhagyank(dob: string) {
    return calculateBhagyank(dob);
  },

  calculateDestinyNumber(name: string, system: 'chaldean' | 'pythagorean' = 'chaldean') {
    return calculateDestinyNumber(name, system);
  },

  calculateVedicGrid(dob: string, includeMulankBhagyank: boolean = true) {
    return calculateVedicGrid(dob, includeMulankBhagyank);
  },

  detectYogas(gridResult: any) {
    return detectYogas(gridResult);
  },

  calculateMatchMaking(boy: MatchProfileInput, girl: MatchProfileInput) {
    return calculateMatchMaking(boy, girl);
  },

  calculateYearlyPrediction(dob: string, targetYear: number) {
    return calculateYearlyPrediction(dob, targetYear);
  },

  analyzeMobileNumber(mobile: string, mulank: number) {
    return analyzeMobileNumber(mobile, mulank);
  },

  calculateVastuNumerology(dob: string) {
    return calculateVastuNumerology(dob);
  },

  calculateTimeNumerology(hours: number, minutes: number) {
    return calculateTimeNumerology(hours, minutes);
  },

  getNumberMeaning(num: number) {
    return getNumberMeaning(num);
  },

  calculateEventPredictions(dob: string) {
    return calculateEventPredictions(dob);
  },

  generatePasswordByProfession(profession: string) {
    return generatePasswordByProfession(profession);
  },

  generatePinByNumerology(digits: 4 | 6, sum: number) {
    return generatePinByNumerology(digits, sum);
  }
};
