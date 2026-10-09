import { reduceToSingleDigit } from './numerology';

export interface NumberMeaningInfo {
  number: number;
  reduced: number;
  rulerEn: string;
  rulerHi: string;
  titleEn: string;
  titleHi: string;
  status: 'Highly Auspicious' | 'Auspicious' | 'Neutral' | 'Karmic / Caution';
  statusHi: 'अत्यंत शुभ' | 'शुभ' | 'सामान्य' | 'कार्मिक / सावधानी';
  meaningEn: string;
  meaningHi: string;
  keyThemesEn: string[];
  keyThemesHi: string[];
}

// Special classical compound names (Chaldean / Vedic tradition)
const CLASSIC_TITLES: Record<number, { en: string; hi: string; status: 'Highly Auspicious' | 'Auspicious' | 'Neutral' | 'Karmic / Caution'; statusHi: 'अत्यंत शुभ' | 'शुभ' | 'सामान्य' | 'कार्मिक / सावधानी' }> = {
  1: { en: 'The Crown of Creation', hi: 'सृजन का मुकुट', status: 'Highly Auspicious', statusHi: 'अत्यंत शुभ' },
  2: { en: 'The Mirror of Waters', hi: 'शीतल जलदर्पण', status: 'Auspicious', statusHi: 'शुभ' },
  3: { en: 'The Beacon of Wisdom', hi: 'ज्ञान का दीप', status: 'Highly Auspicious', statusHi: 'अत्यंत शुभ' },
  4: { en: 'The Cornerstone', hi: 'सुदृढ़ आधारशिला', status: 'Neutral', statusHi: 'सामान्य' },
  5: { en: 'The Winged Messenger', hi: 'तीव्रगामी दूत', status: 'Highly Auspicious', statusHi: 'अत्यंत शुभ' },
  6: { en: 'The Golden Lotus', hi: 'स्वर्ण कमल', status: 'Highly Auspicious', statusHi: 'अत्यंत शुभ' },
  7: { en: 'The Mystic Temple', hi: 'गूढ़ देवालय', status: 'Auspicious', statusHi: 'शुभ' },
  8: { en: 'The Cosmic Scales', hi: 'कर्म का न्यायदंड', status: 'Neutral', statusHi: 'सामान्य' },
  9: { en: 'The Sacred Flame', hi: 'पवित्र अग्नि', status: 'Highly Auspicious', statusHi: 'अत्यंत शुभ' },
  10: { en: 'The Wheel of Fortune', hi: 'भाग्य का पहिया', status: 'Highly Auspicious', statusHi: 'अत्यंत शुभ' },
  11: { en: 'The Master Illuminator', hi: 'मास्टर प्रज्ञा', status: 'Highly Auspicious', statusHi: 'अत्यंत शुभ' },
  12: { en: 'The Sacrificial Sage', hi: 'त्याग व विद्या', status: 'Neutral', statusHi: 'सामान्य' },
  13: { en: 'The Phoenix of Transformation', hi: 'कायाकल्प का प्रतीक', status: 'Karmic / Caution', statusHi: 'कार्मिक / सावधानी' },
  14: { en: 'The Temperance of Movement', hi: 'संतुलित गति', status: 'Karmic / Caution', statusHi: 'कार्मिक / सावधानी' },
  15: { en: 'The Magician of Magnetism', hi: 'आकर्षण का जादू', status: 'Highly Auspicious', statusHi: 'अत्यंत शुभ' },
  16: { en: 'The Shattered Citadel', hi: 'अहं मुक्ति व परीक्षा', status: 'Karmic / Caution', statusHi: 'कार्मिक / सावधानी' },
  17: { en: 'The Star of the Magi', hi: 'आशीर्वाद का सितारा', status: 'Highly Auspicious', statusHi: 'अत्यंत शुभ' },
  18: { en: 'The Eclipse of Illusions', hi: 'माया व संघर्ष', status: 'Karmic / Caution', statusHi: 'कार्मिक / सावधानी' },
  19: { en: 'The Radiant Prince of Heaven', hi: 'स्वर्णिम सूर्योदय', status: 'Highly Auspicious', statusHi: 'अत्यंत शुभ' },
  20: { en: 'The Awakening Herald', hi: 'चेतना का जागरण', status: 'Auspicious', statusHi: 'शुभ' },
  21: { en: 'The Crown of the Magi', hi: 'विजय का मुकुट', status: 'Highly Auspicious', statusHi: 'अत्यंत शुभ' },
  22: { en: 'The Master Builder', hi: 'महान निर्माता', status: 'Highly Auspicious', statusHi: 'अत्यंत शुभ' },
  23: { en: 'The Royal Star of the Lion', hi: 'सिंह का राजसी नक्षत्र', status: 'Highly Auspicious', statusHi: 'अत्यंत शुभ' },
  24: { en: 'The Hand of Love & Harmony', hi: 'स्नेह व मधुरता', status: 'Highly Auspicious', statusHi: 'अत्यंत शुभ' },
  25: { en: 'Wisdom Through Trial', hi: 'अनुभवजन्य प्रज्ञा', status: 'Auspicious', statusHi: 'शुभ' },
  26: { en: 'The Partnership Pillar', hi: 'सहयोग व साझेदारी', status: 'Neutral', statusHi: 'सामान्य' },
  27: { en: 'The Scepter of Mars', hi: 'अधिकार व पराक्रम', status: 'Highly Auspicious', statusHi: 'अत्यंत शुभ' },
  28: { en: 'The Trusting Pilgrim', hi: 'विश्वास व धैर्य', status: 'Neutral', statusHi: 'सामान्य' },
  29: { en: 'The Dual Reflections', hi: 'दोहरी चुनौती', status: 'Karmic / Caution', statusHi: 'कार्मिक / सावधानी' },
  30: { en: 'The Contemplative Sage', hi: 'मंथन व बौद्धिकता', status: 'Auspicious', statusHi: 'शुभ' },
  31: { en: 'The Solitary Thinker', hi: 'एकांत विचारक', status: 'Neutral', statusHi: 'सामान्य' },
  32: { en: 'The Resilient Messenger', hi: 'संचार व संगठन', status: 'Highly Auspicious', statusHi: 'अत्यंत शुभ' },
  33: { en: 'The Master Healer', hi: 'परम कल्याणकारी', status: 'Highly Auspicious', statusHi: 'अत्यंत शुभ' },
  37: { en: 'The Auspicious Concord', hi: 'शुभ मित्रता व प्रतिष्ठा', status: 'Highly Auspicious', statusHi: 'अत्यंत शुभ' },
  41: { en: 'The Catalyst of Progress', hi: 'प्रगति का प्रेरक', status: 'Highly Auspicious', statusHi: 'अत्यंत शुभ' },
  51: { en: 'The Warrior of Victory', hi: 'विजयी सेनापति', status: 'Highly Auspicious', statusHi: 'अत्यंत शुभ' },
  108: { en: 'The Sacred Cosmic Completion', hi: 'परम ब्रह्मांडीय पूर्णता', status: 'Highly Auspicious', statusHi: 'अत्यंत शुभ' },
};

const PLANET_NAMES: Record<number, { en: string; hi: string }> = {
  1: { en: 'Sun (Surya)', hi: 'सूर्य' },
  2: { en: 'Moon (Chandra)', hi: 'चन्द्र' },
  3: { en: 'Jupiter (Brihaspati)', hi: 'बृहस्पति' },
  4: { en: 'Rahu', hi: 'राहु' },
  5: { en: 'Mercury (Budh)', hi: 'बुध' },
  6: { en: 'Venus (Shukra)', hi: 'शुक्र' },
  7: { en: 'Ketu', hi: 'केतु' },
  8: { en: 'Saturn (Shani)', hi: 'शनि' },
  9: { en: 'Mars (Mangal)', hi: 'मंगल' }
};

/**
 * Returns complete numerological analysis for any number 1 to 108.
 */
export function getNumberMeaning(num: number): NumberMeaningInfo {
  const safeNum = Math.min(108, Math.max(1, Math.floor(num)));
  const reduced = reduceToSingleDigit(safeNum);
  const planet = PLANET_NAMES[reduced] || PLANET_NAMES[1];

  const classic = CLASSIC_TITLES[safeNum] || {
    en: `Vibrational Matrix of ${safeNum}`,
    hi: `संख्या ${safeNum} की ऊर्जा तरंग`,
    status: [1, 3, 5, 6].includes(reduced) ? 'Auspicious' : 'Neutral',
    statusHi: [1, 3, 5, 6].includes(reduced) ? 'शुभ' : 'सामान्य'
  };

  const meaningEn = `Number ${safeNum} reduces to base root ${reduced}, commanded by ${planet.en}. It manifests a unique fusion of digits ${safeNum > 9 ? String(safeNum).split('').join(' + ') : safeNum}. Known as '${classic.en}', it represents ${classic.status.toLowerCase()} spiritual energy, influencing professional momentum and personal clarity.`;
  const meaningHi = `संख्या ${safeNum} का मूल अंक ${reduced} है, जिसके स्वामी ${planet.hi} हैं। यह '${classic.hi}' के रूप में जानी जाती है। यह अंक व्यक्ति को जीवन में एकाग्रता, आंतरिक ऊर्जा और उचित निर्णय लेने की शक्ति प्रदान करता है।`;

  const keyThemesEn = [
    `Root: ${reduced} (${planet.en})`,
    classic.en,
    classic.status
  ];

  const keyThemesHi = [
    `मूलांक: ${reduced} (${planet.hi})`,
    classic.hi,
    classic.statusHi
  ];

  return {
    number: safeNum,
    reduced,
    rulerEn: planet.en,
    rulerHi: planet.hi,
    titleEn: classic.en,
    titleHi: classic.hi,
    status: classic.status,
    statusHi: classic.statusHi,
    meaningEn,
    meaningHi,
    keyThemesEn,
    keyThemesHi
  };
}
