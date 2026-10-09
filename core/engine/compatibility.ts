import { calculateMulank, calculateBhagyank, calculateDestinyNumber } from './numerology';
import { calculateVedicGrid, VedicGridResult } from './grid';
import friendlyEnemyRules from '@/mocks/rules/friendly-enemy-neutral.json';
import matchConclusionsData from '@/mocks/rules/match-conclusions.json';

export interface PillarConclusion {
  verdict: { en: string; hi: string };
  meaning: { en: string; hi: string };
  strengths: { en: string[]; hi: string[] };
  watchOut: { en: string[]; hi: string[] };
}

export interface MatchPillar {
  id: 'driver' | 'lifepath' | 'destiny' | 'exchangeable' | 'common';
  titleEn: string;
  titleHi: string;
  boyNumber: number;
  girlNumber: number;
  relation: 'friendly' | 'enemy' | 'neutral';
  score: number;
  max: 20;
  conclusion: PillarConclusion;
}

export interface MatchScoreResult {
  total: number;
  tier: 'Excellent' | 'Good' | 'Moderate' | 'Needs care';
  tierHi: string;
  pillars: MatchPillar[];
  exchangeable: {
    exchange1: {
      boyNumber: number;
      girlNumber: number;
      relation: 'friendly' | 'enemy' | 'neutral';
      score: number;
      max: 10;
    };
    exchange2: {
      girlNumber: number;
      boyNumber: number;
      relation: 'friendly' | 'enemy' | 'neutral';
      score: number;
      max: 10;
    };
    totalScore: number;
  };
  common: {
    commonNumbers: number[];
    boyOnlyNumbers: number[];
    girlOnlyNumbers: number[];
    score: number;
    max: 20;
  };
  missingInBoth: number[];
  boy: {
    name: string;
    dob: string;
    mulank: number;
    bhagyank: number;
    destinyNumber: number;
    grid: VedicGridResult;
  };
  girl: {
    name: string;
    dob: string;
    mulank: number;
    bhagyank: number;
    destinyNumber: number;
    grid: VedicGridResult;
  };
  summaryEn: string;
  summaryHi: string;
  topStrengthsEn: string[];
  topStrengthsHi: string[];
  topCautionsEn: string[];
  topCautionsHi: string[];
  remedies: string[];
}

export interface NumberRelationshipInfo {
  number: number;
  rulerEn: string;
  rulerHi: string;
  friends: number[];
  enemies: number[];
  neutrals: number[];
  luckyColorsEn: string[];
  luckyColorsHi: string[];
  luckyDaysEn: string[];
  luckyDaysHi: string[];
  luckyNumbers: number[];
  gemstoneEn: string;
  gemstoneHi: string;
  deityEn: string;
  deityHi: string;
}

export const NUMBER_RELATIONSHIPS: Record<number, NumberRelationshipInfo> = {
  1: {
    number: 1,
    rulerEn: 'Sun (Surya)',
    rulerHi: 'सूर्य',
    friends: [1, 2, 3, 5, 9],
    enemies: [8, 6],
    neutrals: [4, 7],
    luckyColorsEn: ['Gold', 'Orange', 'Yellow', 'Copper'],
    luckyColorsHi: ['सुनहरा', 'नारंगी', 'पीला', 'तांबई'],
    luckyDaysEn: ['Sunday', 'Monday'],
    luckyDaysHi: ['रविवार', 'सोमवार'],
    luckyNumbers: [1, 2, 3, 9],
    gemstoneEn: 'Ruby (Manikya)',
    gemstoneHi: 'माणिक्य',
    deityEn: 'Surya Deva',
    deityHi: 'सूर्य देव'
  },
  2: {
    number: 2,
    rulerEn: 'Moon (Chandra)',
    rulerHi: 'चन्द्र',
    friends: [1, 2, 3, 5],
    enemies: [4, 8, 9],
    neutrals: [6, 7],
    luckyColorsEn: ['White', 'Cream', 'Silver', 'Light Green'],
    luckyColorsHi: ['सफेद', 'क्रीम', 'चांदी', 'हल्का हरा'],
    luckyDaysEn: ['Monday', 'Sunday'],
    luckyDaysHi: ['सोमवार', 'रविवार'],
    luckyNumbers: [1, 2, 5],
    gemstoneEn: 'Pearl (Moti)',
    gemstoneHi: 'मोती',
    deityEn: 'Shiva / Chandra',
    deityHi: 'भगवान शिव / चंद्र'
  },
  3: {
    number: 3,
    rulerEn: 'Jupiter (Brihaspati / Guru)',
    rulerHi: 'बृहस्पति (गुरु)',
    friends: [1, 2, 3, 5, 9],
    enemies: [6],
    neutrals: [4, 7, 8],
    luckyColorsEn: ['Yellow', 'Saffron', 'Amber', 'Golden-Yellow'],
    luckyColorsHi: ['पीला', 'केसरिया', 'अंबर', 'हल्दी जैसा'],
    luckyDaysEn: ['Thursday', 'Tuesday'],
    luckyDaysHi: ['गुरुवार', 'मंगलवार'],
    luckyNumbers: [3, 1, 9],
    gemstoneEn: 'Yellow Sapphire (Pukhraj)',
    gemstoneHi: 'पुखराज',
    deityEn: 'Lord Vishnu / Brihaspati',
    deityHi: 'भगवान विष्णु / देवगुरु'
  },
  4: {
    number: 4,
    rulerEn: 'Rahu (North Node)',
    rulerHi: 'राहु',
    friends: [5, 6, 7, 8],
    enemies: [1, 2, 9],
    neutrals: [3, 4],
    luckyColorsEn: ['Electric Blue', 'Grey', 'Khaki', 'Dark Violet'],
    luckyColorsHi: ['नीला', 'स्लेटी', 'खाकी', 'गहरा बैंगनी'],
    luckyDaysEn: ['Saturday', 'Sunday'],
    luckyDaysHi: ['शनिवार', 'रविवार'],
    luckyNumbers: [4, 5, 6],
    gemstoneEn: 'Hessonite (Gomed)',
    gemstoneHi: 'गोमेद',
    deityEn: 'Bhairav / Saraswati',
    deityHi: 'भैरव / माँ सरस्वती'
  },
  5: {
    number: 5,
    rulerEn: 'Mercury (Budh)',
    rulerHi: 'बुध',
    friends: [1, 3, 4, 5, 6],
    enemies: [],
    neutrals: [2, 7, 8, 9],
    luckyColorsEn: ['Emerald Green', 'Light Green', 'Mint', 'Turquoise'],
    luckyColorsHi: ['पन्ना हरा', 'हल्का हरा', 'पिस्ता', 'फिरोजी'],
    luckyDaysEn: ['Wednesday', 'Friday'],
    luckyDaysHi: ['बुधवार', 'शुक्रवार'],
    luckyNumbers: [5, 1, 6],
    gemstoneEn: 'Emerald (Panna)',
    gemstoneHi: 'पन्ना',
    deityEn: 'Lord Ganesha / Budh',
    deityHi: 'भगवान गणेश'
  },
  6: {
    number: 6,
    rulerEn: 'Venus (Shukra)',
    rulerHi: 'शुक्र',
    friends: [4, 5, 6, 7, 8],
    enemies: [1, 3],
    neutrals: [2, 9],
    luckyColorsEn: ['Diamond White', 'Pastel Pink', 'Light Blue', 'Silver'],
    luckyColorsHi: ['चमकीला सफेद', 'गुलाबी', 'आसमानी', 'रुपहला'],
    luckyDaysEn: ['Friday', 'Wednesday'],
    luckyDaysHi: ['शुक्रवार', 'बुधवार'],
    luckyNumbers: [6, 5, 7],
    gemstoneEn: 'Diamond / Opal (Heera / Upal)',
    gemstoneHi: 'हीरा / ओपल',
    deityEn: 'Maa Lakshmi',
    deityHi: 'माँ लक्ष्मी'
  },
  7: {
    number: 7,
    rulerEn: 'Ketu (South Node)',
    rulerHi: 'केतु',
    friends: [1, 4, 5, 6],
    enemies: [2, 9],
    neutrals: [3, 7, 8],
    luckyColorsEn: ['Smoky White', 'Light Green', 'Pastel Shades'],
    luckyColorsHi: ['धूम्र श्वेत', 'हल्का हरा', 'हल्के शांत रंग'],
    luckyDaysEn: ['Monday', 'Wednesday'],
    luckyDaysHi: ['सोमवार', 'बुधवार'],
    luckyNumbers: [7, 5, 1],
    gemstoneEn: "Cat's Eye (Lehsuniya)",
    gemstoneHi: 'लहसुनिया',
    deityEn: 'Lord Ganesha / Narasimha',
    deityHi: 'गणेश / नृसिंह भगवान'
  },
  8: {
    number: 8,
    rulerEn: 'Saturn (Shani)',
    rulerHi: 'शनि',
    friends: [4, 5, 6, 7],
    enemies: [1, 2, 9],
    neutrals: [3, 8],
    luckyColorsEn: ['Dark Navy Blue', 'Black', 'Steel Grey', 'Dark Purple'],
    luckyColorsHi: ['गहरा नीला', 'काला', 'स्टील ग्रे', 'गहरा जामुनी'],
    luckyDaysEn: ['Saturday', 'Friday'],
    luckyDaysHi: ['शनिवार', 'शुक्रवार'],
    luckyNumbers: [8, 5, 6],
    gemstoneEn: 'Blue Sapphire (Neelam)',
    gemstoneHi: 'नीलम',
    deityEn: 'Lord Shani / Hanuman',
    deityHi: 'शनि देव / हनुमान जी'
  },
  9: {
    number: 9,
    rulerEn: 'Mars (Mangal)',
    rulerHi: 'मंगल',
    friends: [1, 2, 3, 5],
    enemies: [4, 7, 8],
    neutrals: [6, 9],
    luckyColorsEn: ['Red', 'Crimson', 'Coral', 'Maroon'],
    luckyColorsHi: ['लाल', 'सिंदूरी', 'मूंगा रंग', 'मैरून'],
    luckyDaysEn: ['Tuesday', 'Thursday'],
    luckyDaysHi: ['मंगलवार', 'गुरुवार'],
    luckyNumbers: [9, 1, 3],
    gemstoneEn: 'Red Coral (Moonga)',
    gemstoneHi: 'मूंगा',
    deityEn: 'Hanuman Ji / Kartikeya',
    deityHi: 'हनुमान जी / कार्तिकेय'
  }
};

export function getNumberRelationship(numA: number, numB: number): 'friendly' | 'enemy' | 'neutral' {
  const info = NUMBER_RELATIONSHIPS[numA];
  if (!info) return 'neutral';
  if (info.friends.includes(numB)) return 'friendly';
  if (info.enemies.includes(numB)) return 'enemy';
  return 'neutral';
}

export interface MatchProfileInput {
  name: string;
  dob: string;
}

export interface MatchMakingResult {
  boy: {
    name: string;
    dob: string;
    mulank: number;
    bhagyank: number;
    destinyNumber: number;
    grid: VedicGridResult;
  };
  girl: {
    name: string;
    dob: string;
    mulank: number;
    bhagyank: number;
    destinyNumber: number;
    grid: VedicGridResult;
  };
  mulankCompat: {
    score: number;
    relation: 'friendly' | 'enemy' | 'neutral';
    labelEn: string;
    labelHi: string;
  };
  bhagyankCompat: {
    score: number;
    relation: 'friendly' | 'enemy' | 'neutral';
    labelEn: string;
    labelHi: string;
  };
  destinyCompat: {
    score: number;
    relation: 'friendly' | 'enemy' | 'neutral';
    labelEn: string;
    labelHi: string;
  };
  crossCompat: {
    score: number;
    relation: 'friendly' | 'enemy' | 'neutral';
    labelEn: string;
    labelHi: string;
  };
  commonNumbers: number[];
  boyFillsGirlMissing: number[];
  girlFillsBoyMissing: number[];
  totalScore: number; // 0 to 100
  verdictEn: 'Highly Auspicious' | 'Good Compatibility' | 'Moderate / Remedy Recommended' | 'Challenging Match';
  verdictHi: 'अत्यंत शुभ' | 'उत्तम सामंजस्य' | 'मध्यम / उपाय अनुशंसित' | 'सावधानी व उपाय आवश्यक';
  analysisEn: string;
  analysisHi: string;
  remedyAdviceEn: string;
  remedyAdviceHi: string;
}

export function getPillarConclusion(numA: number, numB: number, fallbackRelation: 'friendly' | 'enemy' | 'neutral'): PillarConclusion {
  const key = `${numA}-${numB}`;
  const data = (matchConclusionsData as unknown as Record<string, PillarConclusion>)[key];
  if (data) {
    return {
      verdict: data.verdict,
      meaning: data.meaning,
      strengths: data.strengths,
      watchOut: data.watchOut
    };
  }
  if (fallbackRelation === 'friendly') {
    return {
      verdict: {
        en: `Harmonious Vedic synergy uniting number ${numA} and number ${numB}.`,
        hi: `अंक ${numA} और अंक ${numB} के मध्य अत्यंत शुभ व अनुकूल वैदिक तालमेल।`
      },
      meaning: {
        en: `This pairing naturally cultivates mutual appreciation, shared life vision, and smooth domestic harmony. Both partners uplift each other effortlessly.`,
        hi: `यह संयोग स्वाभाविक रूप से एक-दूसरे के प्रति सम्मान, साझा दृष्टिकोण और पारिवारिक शांति को बढ़ाता है। दोनों साथी एक-दूसरे के लक्ष्यों में सहजता से सहयोग करते हैं।`
      },
      strengths: {
        en: [`Organic emotional resonance and aligned priorities.`, `Shared enthusiasm for family growth and financial security.`],
        hi: [`सहज भावनात्मक जुड़ाव और जीवन की समान प्राथमिकताएं।`, `पारिवारिक समृद्धि और सुरक्षा के लिए मिलकर काम करने की तत्परता।`]
      },
      watchOut: {
        en: [`Ensure independent hobbies are maintained so you don't become overly co-dependent.`],
        hi: [`अत्यधिक निर्भरता से बचने के लिए अपनी व्यक्तिगत रुचियों को भी समय दें।`]
      }
    };
  }
  if (fallbackRelation === 'enemy') {
    return {
      verdict: {
        en: `Dynamic contrast requiring conscious patience and clear boundaries.`,
        hi: `विरोधी ऊर्जाओं का संगम, जिसमें सजग धैर्य और परस्पर सम्मान की आवश्यकता है।`
      },
      meaning: {
        en: `This pairing brings contrasting planetary impulses that can spark occasional misunderstanding. Conscious listening and Vedic remedies bridge differences.`,
        hi: `यह मेल अलग-अलग ग्रहों के स्वभाव के कारण कभी-कभी वैचारिक मतभेद ला सकता है। धैर्यपूर्वक संवाद और वैदिक उपाय इस दूरी को पाटते हैं।`
      },
      strengths: {
        en: [`Offers immense opportunities for soul evolution, patience, and maturity.`],
        hi: [`धैर्य, परिपक्वता और आत्म-सुधार के गहरे अवसर प्रदान करता है।`]
      },
      watchOut: {
        en: [`Guard against stubborn ego clashes and trying to forcefully change the other partner.`],
        hi: [`अहंकार के टकराव और एक-दूसरे को जबरन बदलने की कोशिश से बचें।`]
      }
    };
  }
  return {
    verdict: {
      en: `Balanced and stable alliance with complementary differences.`,
      hi: `पूरक गुणों के साथ संतुलित, व्यावहारिक और स्थिर संबंध।`
    },
    meaning: {
      en: `The union is practical, steady, and grounded in mutual respect without intense friction. Roles and expectations are well-balanced.`,
      hi: `यह रिश्ता व्यावहारिक और स्थिर है, जो आपसी समझ और मर्यादा पर टिका है। दोनों साथी मिलकर सुखद जीवन का निर्माण करते हैं।`
    },
    strengths: {
      en: [`Complementary strengths that balance individual blind spots.`],
      hi: [`एक-दूसरे की कमियों को पूरा करने वाले पूरक गुण।`]
    },
    watchOut: {
      en: [`Avoid viewing the partnership solely as a pragmatic checklist; nourish emotional intimacy.`],
      hi: [`रिश्ते को केवल कर्तव्यों तक सीमित न रखें; भावनात्मक गर्माहट बनाए रखें।`]
    }
  };
}

export function matchScore(
  boyInput: MatchProfileInput,
  girlInput: MatchProfileInput
): MatchScoreResult {
  const boyMulank = calculateMulank(boyInput.dob).mulank;
  const boyBhagyank = calculateBhagyank(boyInput.dob).bhagyank;
  const boyDestiny = calculateDestinyNumber(boyInput.name).destinyNumber;
  const boyGrid = calculateVedicGrid(boyInput.dob);

  const girlMulank = calculateMulank(girlInput.dob).mulank;
  const girlBhagyank = calculateBhagyank(girlInput.dob).bhagyank;
  const girlDestiny = calculateDestinyNumber(girlInput.name).destinyNumber;
  const girlGrid = calculateVedicGrid(girlInput.dob);

  const pointsConfig = (friendlyEnemyRules.points as { friendly: number; neutral: number; enemy: number }) || {
    friendly: 20,
    neutral: 12,
    enemy: 5
  };

  // Pillar 1: Driver ↔ Driver (Mulank) — max 20
  const driverRel = getNumberRelationship(boyMulank, girlMulank);
  const driverScore = pointsConfig[driverRel];
  const driverConclusion = getPillarConclusion(boyMulank, girlMulank, driverRel);

  // Pillar 2: Life Path ↔ Life Path (Conductor / Bhagyank) — max 20
  const lifepathRel = getNumberRelationship(boyBhagyank, girlBhagyank);
  const lifepathScore = pointsConfig[lifepathRel];
  const lifepathConclusion = getPillarConclusion(boyBhagyank, girlBhagyank, lifepathRel);

  // Pillar 3: Destiny ↔ Destiny (Name number) — max 20
  const destinyRel = getNumberRelationship(boyDestiny, girlDestiny);
  const destinyScore = pointsConfig[destinyRel];
  const destinyConclusion = getPillarConclusion(boyDestiny, girlDestiny, destinyRel);

  // Pillar 4: Exchangeable Numbers (Boy Mulank × Girl Bhagyank and Girl Mulank × Boy Bhagyank) — max 20
  const ex1Rel = getNumberRelationship(boyMulank, girlBhagyank);
  const ex2Rel = getNumberRelationship(girlMulank, boyBhagyank);
  const halfPoints = { friendly: 10, neutral: 6, enemy: 2.5 };
  const ex1Score = halfPoints[ex1Rel];
  const ex2Score = halfPoints[ex2Rel];
  const exchangeableScore = Math.round(ex1Score + ex2Score);
  const exchangeableRel: 'friendly' | 'enemy' | 'neutral' =
    ex1Rel === 'friendly' && ex2Rel === 'friendly'
      ? 'friendly'
      : ex1Rel === 'enemy' && ex2Rel === 'enemy'
      ? 'enemy'
      : ex1Rel === 'friendly' || ex2Rel === 'friendly'
      ? 'friendly'
      : 'neutral';
  const exchangeableConclusion = getPillarConclusion(boyMulank, girlBhagyank, exchangeableRel);

  // Pillar 5: Common Numbers (digits present in BOTH Vedic grids) — max 20
  const boyPresent = new Set(boyGrid.presentNumbers);
  const girlPresent = new Set(girlGrid.presentNumbers);
  const commonNumbers = boyGrid.presentNumbers.filter(n => girlPresent.has(n));
  const boyOnlyNumbers = boyGrid.presentNumbers.filter(n => !girlPresent.has(n));
  const girlOnlyNumbers = girlGrid.presentNumbers.filter(n => !boyPresent.has(n));

  // Digits 1-9 missing in both grids
  const missingInBoth = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter(n => !boyPresent.has(n) && !girlPresent.has(n));

  // Common score by overlap count: 5 pts per common digit up to 20
  const commonScore = Math.min(20, commonNumbers.length * 5);
  const commonRel: 'friendly' | 'enemy' | 'neutral' =
    commonNumbers.length >= 4 ? 'friendly' : commonNumbers.length >= 2 ? 'neutral' : 'enemy';
  const commonConclusion = {
    verdict: {
      en: `Shared grid resonance with ${commonNumbers.length} overlapping numbers (${commonNumbers.join(', ') || 'None'}).`,
      hi: `${commonNumbers.length} समान उपस्थित अंकों (${commonNumbers.join(', ') || 'कोई नहीं'}) के साथ ग्रिड सामंजस्य।`
    },
    meaning: {
      en: `Digits appearing in both grids create natural mutual understanding in lifestyle, temperament, and daily habits. ${
        missingInBoth.length > 0
          ? `Mutual missing numbers (${missingInBoth.join(', ')}) should be balanced with remedial gemstones or colors.`
          : 'Energy grid coverage is well-rounded.'
      }`,
      hi: `दोनों ग्रिडों में उपस्थित अंक जीवनशैली और दैनिक व्यवहार में सहज सामंजस्य उत्पन्न करते हैं। ${
        missingInBoth.length > 0
          ? `दोनों में अनुपस्थित अंक (${missingInBoth.join(', ')}) को उपाय व रंगों से संतुलित करें।`
          : 'ग्रिड ऊर्जा समग्र रूप से संतुलित है।'
      }`
    },
    strengths: {
      en: [`Common vibrational ground across ${commonNumbers.length} distinct life dimensions.`],
      hi: [`${commonNumbers.length} प्रमुख जीवन क्षेत्रों में स्वाभाविक मानसिक तालमेल।`]
    },
    watchOut: {
      en: [
        missingInBoth.length > 0
          ? `Both partners lack vibration of digits ${missingInBoth.join(', ')}; conscious effort needed here.`
          : 'Maintain balance across present active planes.'
      ],
      hi: [
        missingInBoth.length > 0
          ? `दोनों में अंक ${missingInBoth.join(', ')} की कमी है; इस दिशा में सजग प्रयास की आवश्यकता है।`
          : 'सक्रिय ऊर्जा तलों में संतुलन बनाए रखें।'
      ]
    }
  };

  const total = Math.min(100, Math.max(0, Math.round(driverScore + lifepathScore + destinyScore + exchangeableScore + commonScore)));

  let tier: 'Excellent' | 'Good' | 'Moderate' | 'Needs care' = 'Moderate';
  let tierHi = 'मध्यम / संतुलन आवश्यक';
  if (total >= 80) {
    tier = 'Excellent';
    tierHi = 'उत्कृष्ट सामंजस्य';
  } else if (total >= 65) {
    tier = 'Good';
    tierHi = 'उत्तम अनुकूलता';
  } else if (total >= 50) {
    tier = 'Moderate';
    tierHi = 'मध्यम / संतुलन आवश्यक';
  } else {
    tier = 'Needs care';
    tierHi = 'सावधानी व वैदिक उपाय आवश्यक';
  }

  const pillars: MatchPillar[] = [
    {
      id: 'driver',
      titleEn: 'Driver ↔ Driver (Mulank)',
      titleHi: 'ड्राइवर ↔ ड्राइवर (मूलांक)',
      boyNumber: boyMulank,
      girlNumber: girlMulank,
      relation: driverRel,
      score: driverScore,
      max: 20,
      conclusion: driverConclusion
    },
    {
      id: 'lifepath',
      titleEn: 'Life Path ↔ Life Path (Conductor / Bhagyank)',
      titleHi: 'लाइफ पाथ ↔ लाइफ पाथ (कंडक्टर / भाग्यांक)',
      boyNumber: boyBhagyank,
      girlNumber: girlBhagyank,
      relation: lifepathRel,
      score: lifepathScore,
      max: 20,
      conclusion: lifepathConclusion
    },
    {
      id: 'destiny',
      titleEn: 'Destiny ↔ Destiny (Name number)',
      titleHi: 'डेस्टिनी ↔ डेस्टिनी (नामांक)',
      boyNumber: boyDestiny,
      girlNumber: girlDestiny,
      relation: destinyRel,
      score: destinyScore,
      max: 20,
      conclusion: destinyConclusion
    },
    {
      id: 'exchangeable',
      titleEn: 'Exchangeable Numbers',
      titleHi: 'परस्पर विनिमय अंक (क्रॉस संबंध)',
      boyNumber: boyMulank,
      girlNumber: girlBhagyank,
      relation: exchangeableRel,
      score: exchangeableScore,
      max: 20,
      conclusion: exchangeableConclusion
    },
    {
      id: 'common',
      titleEn: 'Common Numbers',
      titleHi: 'समान उपस्थित अंक (वैदिक ग्रिड)',
      boyNumber: commonNumbers.length,
      girlNumber: commonNumbers.length,
      relation: commonRel,
      score: commonScore,
      max: 20,
      conclusion: commonConclusion
    }
  ];

  let summaryEn = '';
  let summaryHi = '';
  if (total >= 80) {
    summaryEn = `Outstanding compatibility score of ${total}/100. The core Vedic pillars—Driver, Life Path, and Destiny—radiate harmonious synergy, promising emotional depth, mutual prosperity, and enduring joy.`;
    summaryHi = `${total}/100 का उत्कृष्ट सामंजस्य स्कोर। मूलांक, भाग्यांक और नामांक के मध्य श्रेष्ठ ऊर्जा तालमेल है, जो दांपत्य जीवन में सुख, समृद्धि और गहरा प्रेम सुनिश्चित करता है।`;
  } else if (total >= 65) {
    summaryEn = `Solid Vedic compatibility score of ${total}/100. This union possesses natural supportive momentum. With constructive dialogue and mutual respect for differences, life goals will flourish.`;
    summaryHi = `${total}/100 का उत्तम अनुकूलता स्कोर। यह संबंध स्वाभाविक रूप से सकारात्मक है। परस्पर संवाद और सम्मान से जीवन के सभी लक्ष्य सिद्ध होंगे।`;
  } else if (total >= 50) {
    summaryEn = `Moderate compatibility score of ${total}/100. Complementary dynamics provide stability, though contrasting instincts require conscious patience and shared agreements on finances and routines.`;
    summaryHi = `${total}/100 का मध्यम स्कोर। रिश्ते में स्थिरता है, किंतु विपरीत स्वभाव के कारण धैर्य और वित्तीय व पारिवारिक मामलों में स्पष्ट सहमति आवश्यक है।`;
  } else {
    summaryEn = `Challenging compatibility score of ${total}/100. Pronounced planetary differences demand conscious understanding, mature conflict resolution, and dedicated Vedic harmonizing remedies.`;
    summaryHi = `${total}/100 का स्कोर। ग्रहों के विपरीत स्वभाव के कारण वैचारिक मतभेद संभव हैं। परिपक्व समझ और नियमित वैदिक उपायों से सामंजस्य स्थापित करें।`;
  }

  const topStrengthsEn: string[] = [
    driverRel === 'friendly' ? 'Strong mutual understanding between core Driver numbers.' : 'Dynamic personality interplay encouraging maturity.',
    lifepathRel === 'friendly' ? 'Aligned life goals and cohesive long-term destiny path.' : 'Practical division of life responsibilities.',
    commonNumbers.length >= 3 ? `Shared resonance across ${commonNumbers.length} common grid numbers.` : 'Diverse perspectives that protect against common blind spots.'
  ];

  const topStrengthsHi: string[] = [
    driverRel === 'friendly' ? 'मूलांक के मध्य प्रगाढ़ मित्रवत स्वभाव व सहज समझ।' : 'व्यक्तित्व का सुंदर संतुलन जो परिपक्वता लाता है।',
    lifepathRel === 'friendly' ? 'भाग्यांक का तालमेल जीवन लक्ष्यों को साझा दिशा देता है।' : 'पारिवारिक कर्तव्यों का व्यावहारिक व संतुलित विभाजन।',
    commonNumbers.length >= 3 ? `${commonNumbers.length} समान ग्रिड अंकों के कारण सहज वैचारिक तालमेल।` : 'विभिन्न दृष्टिकोण जो जीवन के अंधेरे कोनों को उजागर करते हैं।'
  ];

  const topCautionsEn: string[] = [
    driverRel === 'enemy' ? 'Avoid impulsive reactions and ego confrontations during disagreements.' : 'Keep communication open to avoid unspoken assumptions.',
    destinyRel === 'enemy' ? 'Acknowledge different social communication styles calmly.' : 'Schedule quality time away from routine pressures.',
    missingInBoth.length > 0 ? `Both partners lack numbers [${missingInBoth.join(', ')}]; practice conscious balance in those areas.` : 'Ensure healthy independence alongside togetherness.'
  ];

  const topCautionsHi: string[] = [
    driverRel === 'enemy' ? 'मतभेद के समय अहंकार के टकराव और जल्दबाजी में प्रतिक्रिया से बचें।' : 'संवाद में पारदर्शिता रखें ताकि गलतफहमी न हो।',
    destinyRel === 'enemy' ? 'सामाजिक व्यवहार और बोलचाल में एक-दूसरे की शैली का सम्मान करें।' : 'दैनिक तनाव से हटकर साथ में समय अवश्य बिताएं।',
    missingInBoth.length > 0 ? `दोनों में अंक [${missingInBoth.join(', ')}] की कमी है; उन क्षेत्रों में अतिरिक्त सजगता रखें।` : 'एक-दूसरे के व्यक्तिगत स्पेस का सम्मान करें।'
  ];

  const remedies: string[] = [];
  if (driverRel === 'enemy' || lifepathRel === 'enemy') {
    remedies.push('Place a harmonizing Rose Quartz crystal in the southwest bedroom corner.');
    remedies.push('Recite the Gayatri Mantra or Mahamrityunjaya Mantra together on Sundays.');
  }
  if (missingInBoth.includes(5)) {
    remedies.push('Keep an indoor green plant or emerald stone to strengthen communication (Number 5).');
  }
  if (missingInBoth.includes(6)) {
    remedies.push('Light white camphor or sandalwood incense on Friday evenings for Venusian bliss (Number 6).');
  }
  if (missingInBoth.includes(1) || missingInBoth.includes(9)) {
    remedies.push('Offer water to the rising sun together to infuse vital solar-martial vigor.');
  }
  if (remedies.length < 3) {
    remedies.push('Perform charity or feed cows/birds together on Thursdays to invoke Jupiterian grace.');
    remedies.push('Decorate domestic spaces with soothing pastel tones (cream, light yellow, mint green).');
  }

  return {
    total,
    tier,
    tierHi,
    pillars,
    exchangeable: {
      exchange1: {
        boyNumber: boyMulank,
        girlNumber: girlBhagyank,
        relation: ex1Rel,
        score: ex1Score,
        max: 10
      },
      exchange2: {
        girlNumber: girlMulank,
        boyNumber: boyBhagyank,
        relation: ex2Rel,
        score: ex2Score,
        max: 10
      },
      totalScore: exchangeableScore
    },
    common: {
      commonNumbers,
      boyOnlyNumbers,
      girlOnlyNumbers,
      score: commonScore,
      max: 20
    },
    missingInBoth,
    boy: {
      name: boyInput.name,
      dob: boyInput.dob,
      mulank: boyMulank,
      bhagyank: boyBhagyank,
      destinyNumber: boyDestiny,
      grid: boyGrid
    },
    girl: {
      name: girlInput.name,
      dob: girlInput.dob,
      mulank: girlMulank,
      bhagyank: girlBhagyank,
      destinyNumber: girlDestiny,
      grid: girlGrid
    },
    summaryEn,
    summaryHi,
    topStrengthsEn,
    topStrengthsHi,
    topCautionsEn,
    topCautionsHi,
    remedies: remedies.slice(0, 4)
  };
}

export function calculateMatchMaking(
  boyInput: MatchProfileInput,
  girlInput: MatchProfileInput
): MatchMakingResult & MatchScoreResult {
  const scoreRes = matchScore(boyInput, girlInput);

  return {
    ...scoreRes,
    totalScore: scoreRes.total,
    mulankCompat: {
      score: scoreRes.pillars[0].score,
      relation: scoreRes.pillars[0].relation,
      labelEn: scoreRes.pillars[0].conclusion.verdict.en,
      labelHi: scoreRes.pillars[0].conclusion.verdict.hi
    },
    bhagyankCompat: {
      score: scoreRes.pillars[1].score,
      relation: scoreRes.pillars[1].relation,
      labelEn: scoreRes.pillars[1].conclusion.verdict.en,
      labelHi: scoreRes.pillars[1].conclusion.verdict.hi
    },
    destinyCompat: {
      score: scoreRes.pillars[2].score,
      relation: scoreRes.pillars[2].relation,
      labelEn: scoreRes.pillars[2].conclusion.verdict.en,
      labelHi: scoreRes.pillars[2].conclusion.verdict.hi
    },
    crossCompat: {
      score: scoreRes.pillars[3].score,
      relation: scoreRes.pillars[3].relation,
      labelEn: scoreRes.pillars[3].conclusion.verdict.en,
      labelHi: scoreRes.pillars[3].conclusion.verdict.hi
    },
    commonNumbers: scoreRes.common.commonNumbers,
    boyFillsGirlMissing: scoreRes.common.boyOnlyNumbers,
    girlFillsBoyMissing: scoreRes.common.girlOnlyNumbers,
    verdictEn:
      scoreRes.tier === 'Excellent'
        ? 'Highly Auspicious'
        : scoreRes.tier === 'Good'
        ? 'Good Compatibility'
        : scoreRes.tier === 'Moderate'
        ? 'Moderate / Remedy Recommended'
        : 'Challenging Match',
    verdictHi:
      scoreRes.tier === 'Excellent'
        ? 'अत्यंत शुभ'
        : scoreRes.tier === 'Good'
        ? 'उत्तम सामंजस्य'
        : scoreRes.tier === 'Moderate'
        ? 'मध्यम / उपाय अनुशंसित'
        : 'सावधानी व उपाय आवश्यक',
    analysisEn: scoreRes.summaryEn,
    analysisHi: scoreRes.summaryHi,
    remedyAdviceEn: scoreRes.remedies.join(' '),
    remedyAdviceHi: scoreRes.remedies.join(' ')
  };
}
