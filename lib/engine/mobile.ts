import { reduceToSingleDigit } from './numerology';

export interface MobilePairAnalysis {
  pair: string;
  sum: number;
  quality: 'auspicious' | 'neutral' | 'caution';
  meaningEn: string;
  meaningHi: string;
}

export interface MobileAnalysisResult {
  rawNumber: string;
  cleanDigits: number[];
  digitSum: number;
  reducedTotal: number;
  compoundStr: string;
  isFavorableTotal: boolean;
  chargingDirectionEn: string;
  chargingDirectionHi: string;
  screensaverSuggestionEn: string;
  screensaverSuggestionHi: string;
  pairs: MobilePairAnalysis[];
  auspiciousPairsCount: number;
  cautionPairsCount: number;
  generalVerdictEn: string;
  generalVerdictHi: string;
}

// Well known Vedic mobile pair energies
export const PAIR_MEANINGS: Record<string, { quality: 'auspicious' | 'neutral' | 'caution'; en: string; hi: string }> = {
  '15': { quality: 'auspicious', en: 'Leadership & Commercial Luck (Sun + Budh)', hi: 'बुधादित्य प्रभाव, व्यापार व नेतृत्व में लाभ' },
  '51': { quality: 'auspicious', en: 'Quick thinking & Wealth creation', hi: 'तीव्र बुद्धि और धन संचय' },
  '37': { quality: 'auspicious', en: 'Spiritual knowledge & Intuitive brilliance', hi: 'आध्यात्मिक ज्ञान व अंतर्ज्ञान' },
  '73': { quality: 'auspicious', en: 'Respect, Mentorship & Wise counsel', hi: 'मान-सम्मान और उच्च ज्ञान' },
  '24': { quality: 'caution', en: 'Emotional restlessness & Sudden anxiety', hi: 'मानसिक अशांति व अचानक तनाव' },
  '42': { quality: 'caution', en: 'Mood swings & Indecisiveness', hi: 'मन में संशय व अनिर्णय की स्थिति' },
  '18': { quality: 'caution', en: 'Sun-Saturn friction, Delays in recognition', hi: 'सूर्य-शनि टकराव, कार्यों में विलंब' },
  '81': { quality: 'caution', en: 'Heavy struggle before reward', hi: 'कड़ा संघर्ष और उत्तरदायित्व का भार' },
  '36': { quality: 'caution', en: 'Guru-Shukra ideological discord', hi: 'गुरु-शुक्र मतभेद, वैचारिक द्वंद्व' },
  '63': { quality: 'caution', en: 'Financial expenditure & Conflicting values', hi: 'अनावश्यक व्यय व विचारों में द्वंद्व' },
  '47': { quality: 'auspicious', en: 'Deep technical research & Occult insight', hi: 'गहन शोध, तकनीकी व गूढ़ विद्या में सफलता' },
  '74': { quality: 'auspicious', en: 'Innovative solutions & Analytical flair', hi: 'नवाचार और विश्लेषणात्मक दक्षता' },
  '56': { quality: 'auspicious', en: 'Mercury-Venus luxury, Business & Charisma', hi: 'लक्ष्मी-योग, व्यापार और आकर्षण' },
  '65': { quality: 'auspicious', en: 'Financial liquidity & Social connections', hi: 'व्यापारिक लाभ व सामाजिक प्रतिष्ठा' },
  '28': { quality: 'caution', en: 'Moon-Saturn depression / Melancholy wave', hi: 'विष योग प्रभाव, मानसिक तनाव' },
  '82': { quality: 'caution', en: 'Emotional burden & Hesitation', hi: 'भावनात्मक भारीपन व असमंजस' },
};

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
  const compoundStr = digitSum > 9 ? `${digitSum}/${reducedTotal}` : `${reducedTotal}`;

  // Numbers 1, 3, 5, 6 are generally favorable mobile totals in commercial numerology
  const isFavorableTotal = [1, 3, 5, 6].includes(reducedTotal);

  // Analyze pairs
  const pairs: MobilePairAnalysis[] = [];
  let auspiciousCount = 0;
  let cautionCount = 0;

  for (let i = 0; i < cleanDigits.length - 1; i++) {
    const pairStr = `${cleanDigits[i]}${cleanDigits[i + 1]}`;
    const sum = reduceToSingleDigit(cleanDigits[i] + cleanDigits[i + 1]);

    if (PAIR_MEANINGS[pairStr]) {
      const info = PAIR_MEANINGS[pairStr];
      if (info.quality === 'auspicious') auspiciousCount++;
      if (info.quality === 'caution') cautionCount++;

      pairs.push({
        pair: pairStr,
        sum,
        quality: info.quality,
        meaningEn: info.en,
        meaningHi: info.hi
      });
    } else {
      // Default neutral pair analysis
      const quality: 'auspicious' | 'neutral' | 'caution' = [1, 5, 6].includes(sum) ? 'auspicious' : 'neutral';
      if (quality === 'auspicious') auspiciousCount++;
      pairs.push({
        pair: pairStr,
        sum,
        quality,
        meaningEn: `Combined vibration of ${sum}. Balanced influence.`,
        meaningHi: `संयुक्त कंपन ${sum}। संतुलित प्रभाव।`
      });
    }
  }

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
    compoundStr,
    isFavorableTotal,
    chargingDirectionEn: dirInfo.en,
    chargingDirectionHi: dirInfo.hi,
    screensaverSuggestionEn: dirInfo.wallpaperEn,
    screensaverSuggestionHi: dirInfo.wallpaperHi,
    pairs,
    auspiciousPairsCount: auspiciousCount,
    cautionPairsCount: cautionCount,
    generalVerdictEn,
    generalVerdictHi
  };
}
