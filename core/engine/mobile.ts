import { reduceToSingleDigit } from './numerology';
import pairMeaningsData from '@/mocks/rules/pair-meanings.json';

export interface MobilePairAnalysis {
  pair: string;
  positionLabel: string;
  rawSum: number;
  reducedSum: number;
  sumDisplay: string;
  quality: 'auspicious' | 'neutral' | 'challenging';
  titleEn: string;
  titleHi: string;
  descriptionEn: string;
  descriptionHi: string;
  // Backward compatibility
  sum: number;
  meaningEn: string;
  meaningHi: string;
}

export interface MobileAnalysisResult {
  rawNumber: string;
  cleanDigits: number[];
  digitSum: number;
  reducedTotal: number;
  compound: number;
  reduced: number;
  compoundStr?: string;
  isFavorableTotal: boolean;
  chargingDirectionEn: string;
  chargingDirectionHi: string;
  screensaverSuggestionEn: string;
  screensaverSuggestionHi: string;
  pairs: MobilePairAnalysis[];
  auspiciousPairs: MobilePairAnalysis[];
  neutralPairs: MobilePairAnalysis[];
  challengingPairs: MobilePairAnalysis[];
  auspiciousPairsCount: number;
  neutralPairsCount: number;
  cautionPairsCount: number; // for backward compatibility
  challengingPairsCount: number;
  generalVerdictEn: string;
  generalVerdictHi: string;
}

export const CHARGING_DIRECTIONS: Record<number, { en: string; hi: string; wallpaperEn: string; wallpaperHi: string }> = {
  1: { en: 'East (Surya direction)', hi: 'पूर्व दिशा (सूर्य की दिशा)', wallpaperEn: 'Rising Sun, Flying Eagle or Golden Crown', wallpaperHi: 'उगता हुआ सूर्य, स्वर्ण मुकुट या स्वर्णिम आभा' },
  2: { en: 'North-West (Moon direction)', hi: 'उत्तर-पश्चिम (वायव्य कोण)', wallpaperEn: 'Full Moon over Calm Waters, Pearl White Waterfall', wallpaperHi: 'पूर्णिमा का चंद्रमा, शांत जलधारा या स्फटिक' },
  3: { en: 'North-East (Ishan - Guru direction)', hi: 'उत्तर-पूर्व (ईशान कोण)', wallpaperEn: 'Sacred Temple, Golden Om or Bodhi Tree', wallpaperHi: 'पवित्र मंदिर, स्वर्णिम ॐ या पीपल/वट वृक्ष' },
  4: { en: 'South-West (Rahu direction)', hi: 'दक्षिण-पश्चिम (नैऋत्य कोण)', wallpaperEn: 'Sturdy Mountain Peaks, Solid Geometric Fortress', wallpaperHi: 'ऊंचे सुदृढ़ पर्वत शिखर या मजबूत दुर्ग' },
  5: { en: 'North (Mercury - Kuber direction)', hi: 'उत्तर दिशा (कुबेर व बुध की दिशा)', wallpaperEn: 'Lush Green Bamboo Forest, Currency / Abundance mandala', wallpaperHi: 'हरा-भरा बांस का जंगल या कुबेर यंत्र/हरियाली' },
  6: { en: 'South-East (Venus direction)', hi: 'दक्षिण-पूर्व (आग्नेय कोण)', wallpaperEn: 'Pink Lotus, Sparkling Diamonds or Luxury Aesthetics', wallpaperHi: 'गुलाबी कमल, चमकता हीरा या सौंदर्य प्रतीक' },
  7: { en: 'North-East / West (Ketu direction)', hi: 'उत्तर-पूर्व या पश्चिम', wallpaperEn: 'Mystic Spiral Galaxy, Deep Meditation Icon', wallpaperHi: 'आकाशगंगा, ध्यान मुद्रा या शांति प्रतीक' },
  8: { en: 'West (Saturn direction)', hi: 'पश्चिम दिशा (शनि की दिशा)', wallpaperEn: 'Deep Blue Ocean, Sturdy Clock or Banyan Roots', wallpaperHi: 'गहरा नीला महासागर, पुरानी सुदृढ़ वृक्ष जड़ें' },
  9: { en: 'South (Mars direction)', hi: 'दक्षिण दिशा (मंगल की दिशा)', wallpaperEn: 'Roaring Lion, Blazing Flame or Crimson Horizon', wallpaperHi: 'गर्जना करता सिंह, प्रज्वलित दीप या लाल ध्वज' },
};

export function analyzeMobileNumber(mobile: string, userMulank: number = 1): MobileAnalysisResult {
  const cleanStr = mobile.replace(/\D/g, '');
  const cleanDigits = cleanStr.split('').map(Number);
  const digitSum = cleanDigits.reduce((acc, curr) => acc + curr, 0);
  const reducedTotal = reduceToSingleDigit(digitSum);
  const compound = digitSum;
  const reduced = reducedTotal;
  const compoundStr = digitSum > 9 ? `${digitSum}` : `${reducedTotal}`;

  // Numbers 1, 3, 5, 6 are generally favorable mobile totals in commercial numerology
  const isFavorableTotal = [1, 3, 5, 6].includes(reducedTotal);

  // Analyze pairs
  const pairs: MobilePairAnalysis[] = [];

  for (let i = 0; i < cleanDigits.length - 1; i++) {
    const d1 = cleanDigits[i];
    const d2 = cleanDigits[i + 1];
    const pairStr = `${d1}${d2}`;
    const positionLabel = `Digits ${i + 1}-${i + 2}`;
    const rawSum = d1 + d2;
    const reducedSum = reduceToSingleDigit(rawSum);
    const sumDisplay = rawSum > 9 ? `Sum ${rawSum} → ${reducedSum}` : `Sum ${reducedSum}`;

    let quality: 'auspicious' | 'neutral' | 'challenging' = 'neutral';
    let titleEn = '';
    let titleHi = '';
    let descriptionEn = '';
    let descriptionHi = '';
    interface PairInfo {
      quality: 'auspicious' | 'neutral' | 'challenging';
      titleEn: string;
      titleHi: string;
      descriptionEn: string;
      descriptionHi: string;
    }

    const specificMap = (pairMeaningsData.specificPairs as unknown as Record<string, PairInfo>) || {};
    const sumMap = (pairMeaningsData.sums as unknown as Record<string, PairInfo>) || {};

    if (specificMap[pairStr]) {
      const specific = specificMap[pairStr];
      quality = specific.quality;
      titleEn = specific.titleEn;
      titleHi = specific.titleHi;
      descriptionEn = specific.descriptionEn;
      descriptionHi = specific.descriptionHi;
    } else {
      const sumInfo = sumMap[String(reducedSum)] || {
        quality: 'neutral',
        titleEn: `Balanced Digit Synergy ${reducedSum}`,
        titleHi: `संतुलित अंक ऊर्जा ${reducedSum}`,
        descriptionEn: 'Provides steady operational focus without acute stress.',
        descriptionHi: 'स्थिर ऊर्जा व व्यावहारिक संतुलन प्रदान करता है।'
      };
      quality = sumInfo.quality;
      titleEn = sumInfo.titleEn;
      titleHi = sumInfo.titleHi;
      descriptionEn = sumInfo.descriptionEn;
      descriptionHi = sumInfo.descriptionHi;
    }

    pairs.push({
      pair: pairStr,
      positionLabel,
      rawSum,
      reducedSum,
      sumDisplay,
      quality,
      titleEn,
      titleHi,
      descriptionEn,
      descriptionHi,
      sum: reducedSum,
      meaningEn: descriptionEn,
      meaningHi: descriptionHi
    });
  }

  const auspiciousPairs = pairs.filter((p) => p.quality === 'auspicious');
  const neutralPairs = pairs.filter((p) => p.quality === 'neutral');
  const challengingPairs = pairs.filter((p) => p.quality === 'challenging');

  const dirInfo = CHARGING_DIRECTIONS[userMulank] || CHARGING_DIRECTIONS[1];

  const generalVerdictEn = isFavorableTotal
    ? `Mobile total ${reducedTotal} is highly auspicious for communications, business growth, and professional reach.`
    : `Mobile total ${reducedTotal} has mixed vibrations. Keep your wallpaper aligned and follow charging direction remedies.`;

  const generalVerdictHi = isFavorableTotal
    ? `मोबाइल का कुल योग ${reducedTotal} संचार, व्यापार विस्तार और सफलता के लिए अत्यंत शुभ है।`
    : `मोबाइल कुल योग ${reducedTotal} सामान्य प्रभाव देता है। अनुकूल वॉलपेपर व सही चार्जिंग दिशा का पालन करें।`;

  return {
    rawNumber: mobile,
    cleanDigits,
    digitSum,
    reducedTotal,
    compound,
    reduced,
    compoundStr,
    isFavorableTotal,
    chargingDirectionEn: dirInfo.en,
    chargingDirectionHi: dirInfo.hi,
    screensaverSuggestionEn: dirInfo.wallpaperEn,
    screensaverSuggestionHi: dirInfo.wallpaperHi,
    pairs,
    auspiciousPairs,
    neutralPairs,
    challengingPairs,
    auspiciousPairsCount: auspiciousPairs.length,
    neutralPairsCount: neutralPairs.length,
    cautionPairsCount: challengingPairs.length,
    challengingPairsCount: challengingPairs.length,
    generalVerdictEn,
    generalVerdictHi
  };
}
