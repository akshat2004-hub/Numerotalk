import { calculateMulank, calculateBhagyank, calculateDestinyNumber } from './numerology';
import { calculateVedicGrid, VedicGridResult } from './grid';

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

export function calculateMatchMaking(
  boyInput: MatchProfileInput,
  girlInput: MatchProfileInput
): MatchMakingResult {
  const boyMulank = calculateMulank(boyInput.dob).mulank;
  const boyBhagyank = calculateBhagyank(boyInput.dob).bhagyank;
  const boyDestiny = calculateDestinyNumber(boyInput.name).destinyNumber;
  const boyGrid = calculateVedicGrid(boyInput.dob);

  const girlMulank = calculateMulank(girlInput.dob).mulank;
  const girlBhagyank = calculateBhagyank(girlInput.dob).bhagyank;
  const girlDestiny = calculateDestinyNumber(girlInput.name).destinyNumber;
  const girlGrid = calculateVedicGrid(girlInput.dob);

  // 1. Mulank ↔ Mulank evaluation (up to 30 pts)
  const mRel = getNumberRelationship(boyMulank, girlMulank);
  let mScore = 18;
  let mLabelEn = 'Neutral Harmony';
  let mLabelHi = 'सामान्य सामंजस्य';
  if (mRel === 'friendly') {
    mScore = 30;
    mLabelEn = 'Strong Friendly Bond';
    mLabelHi = 'प्रगाढ़ मित्रवत संबंध';
  } else if (mRel === 'enemy') {
    mScore = 8;
    mLabelEn = 'Differing Temperaments';
    mLabelHi = 'विपरीत स्वभाव / मतभेद की संभावना';
  }

  // 2. Bhagyank ↔ Bhagyank evaluation (up to 30 pts)
  const bRel = getNumberRelationship(boyBhagyank, girlBhagyank);
  let bScore = 18;
  let bLabelEn = 'Neutral Destiny Path';
  let bLabelHi = 'सामान्य भाग्य संयोग';
  if (bRel === 'friendly') {
    bScore = 30;
    bLabelEn = 'Supportive Life Destiny';
    mLabelHi = 'सद्भावपूर्ण जीवन यात्रा';
  } else if (bRel === 'enemy') {
    bScore = 8;
    bLabelEn = 'Differing Life Directions';
    bLabelHi = 'जीवन लक्ष्यों में भिन्नता';
  }

  // 3. Cross Driver ↔ Conductor evaluation (up to 20 pts)
  const cross1 = getNumberRelationship(boyMulank, girlBhagyank);
  const cross2 = getNumberRelationship(girlMulank, boyBhagyank);
  let cScore = 12;
  let cRel: 'friendly' | 'enemy' | 'neutral' = 'neutral';
  let cLabelEn = 'Moderate Complementary Dynamics';
  let cLabelHi = 'सामान्य पूरक ऊर्जा';
  if (cross1 === 'friendly' || cross2 === 'friendly') {
    cScore = 20;
    cRel = 'friendly';
    cLabelEn = 'Harmonious Exchange Energy';
    cLabelHi = 'परस्पर पूरक श्रेष्ठ ऊर्जा';
  } else if (cross1 === 'enemy' && cross2 === 'enemy') {
    cScore = 5;
    cRel = 'enemy';
    cLabelEn = 'Cross-Energy Friction';
    cLabelHi = 'विरोधी पूरक प्रभाव';
  }

  // 4. Destiny evaluation (legacy compat reference)
  const dRel = getNumberRelationship(boyDestiny, girlDestiny);
  let dScore = 10;
  let dLabelEn = 'Moderate Name Harmony';
  let dLabelHi = 'सामान्य नामांक योग';
  if (dRel === 'friendly') {
    dScore = 20;
    dLabelEn = 'Favorable Name Vibrations';
    dLabelHi = 'अत्यंत अनुकूल नामांक ऊर्जा';
  } else if (dRel === 'enemy') {
    dScore = 5;
    dLabelEn = 'Conflicting Name Frequencies';
    dLabelHi = 'विरोधी नामांक प्रभाव';
  }

  // 5. Grid mutual complement & overlap (up to 20 pts)
  const boyPresent = new Set(boyGrid.presentNumbers);
  const girlPresent = new Set(girlGrid.presentNumbers);

  const commonNumbers = boyGrid.presentNumbers.filter(n => girlPresent.has(n));
  const boyFillsGirlMissing = boyGrid.presentNumbers.filter(n => !girlPresent.has(n));
  const girlFillsBoyMissing = girlGrid.presentNumbers.filter(n => !boyPresent.has(n));

  const gridOverlapScore = Math.min(20, Math.round(commonNumbers.length * 4.5 + (boyFillsGirlMissing.length + girlFillsBoyMissing.length) * 1.5));

  // Score = DriverDriver 30 + ConductorConductor 30 + cross 20 + grid overlap 20
  const totalScore = Math.min(100, Math.round(mScore + bScore + cScore + gridOverlapScore));

  let verdictEn: MatchMakingResult['verdictEn'] = 'Moderate / Remedy Recommended';
  let verdictHi: MatchMakingResult['verdictHi'] = 'मध्यम / उपाय अनुशंसित';
  let analysisEn = '';
  let analysisHi = '';

  if (totalScore >= 75) {
    verdictEn = 'Highly Auspicious';
    verdictHi = 'अत्यंत शुभ';
    analysisEn = `Outstanding compatibility between Mulank ${boyMulank} and ${girlMulank}. The energy grids complement each other seamlessly, creating emotional warmth, mutual prosperity, and long-term peace.`;
    analysisHi = `मूलांक ${boyMulank} और ${girlMulank} के मध्य अति उत्तम सामंजस्य है। दोनों के ग्रिड परस्पर पूरक हैं, जो दांपत्य जीवन में सुख, समृद्धि और परस्पर सम्मान प्रदान करते हैं।`;
  } else if (totalScore >= 60) {
    verdictEn = 'Good Compatibility';
    verdictHi = 'उत्तम सामंजस्य';
    analysisEn = `A balanced and supportive relationship. With mutual understanding and open communication, this union will flourish with stability and shared success.`;
    analysisHi = `एक संतुलित और अनुकूल वैवाहिक संबंध। परस्पर समझ और सहयोग से दांपत्य जीवन सुखमय और स्थिर रहेगा।`;
  } else if (totalScore >= 45) {
    verdictEn = 'Moderate / Remedy Recommended';
    verdictHi = 'मध्यम / उपाय अनुशंसित';
    analysisEn = `Average numeric resonance. While mutual affection can be nurtured, differences in opinions will occur. Following recommended harmonizing remedies will ensure domestic happiness.`;
    analysisHi = `औसत अंक अनुकूलता। आपसी प्रेम रहेगा, परंतु विचारों में भिन्नता आ सकती है। सुझाए गए सामंजस्य उपायों से दांपत्य में सुख शांति बनी रहेगी।`;
  } else {
    verdictEn = 'Challenging Match';
    verdictHi = 'सावधानी व उपाय आवश्यक';
    analysisEn = `Significant friction between planetary energies. Prone to ego clashes and misalignments unless specific astrological and numerological remedies are diligently adopted.`;
    analysisHi = `ग्रह ऊर्जाओं में टकराव के संकेत। अहं का टकराव या मतभेद संभव हैं। विवाह से पूर्व अथवा पश्चात् विशेष उपाय करने की सलाह दी जाती है।`;
  }

  const remedyAdviceEn = `Focus on harmonizing common missing energies (${[...boyGrid.missingNumbers, ...girlGrid.missingNumbers].slice(0, 3).join(', ')}). Wear matching balancing colors (${NUMBER_RELATIONSHIPS[boyMulank].luckyColorsEn[0]}, ${NUMBER_RELATIONSHIPS[girlMulank].luckyColorsEn[0]}).`;
  const remedyAdviceHi = `अनुपस्थित अंकों के संतुलन पर ध्यान दें। दोनों के लिए अनुकूल रंगों (${NUMBER_RELATIONSHIPS[boyMulank].luckyColorsHi[0]}, ${NUMBER_RELATIONSHIPS[girlMulank].luckyColorsHi[0]}) का प्रयोग करें।`;

  return {
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
    mulankCompat: {
      score: mScore,
      relation: mRel,
      labelEn: mLabelEn,
      labelHi: mLabelHi
    },
    bhagyankCompat: {
      score: bScore,
      relation: bRel,
      labelEn: bLabelEn,
      labelHi: bLabelHi
    },
    destinyCompat: {
      score: dScore,
      relation: dRel,
      labelEn: dLabelEn,
      labelHi: dLabelHi
    },
    crossCompat: {
      score: cScore,
      relation: cRel,
      labelEn: cLabelEn,
      labelHi: cLabelHi
    },
    commonNumbers,
    boyFillsGirlMissing,
    girlFillsBoyMissing,
    totalScore,
    verdictEn,
    verdictHi,
    analysisEn,
    analysisHi,
    remedyAdviceEn,
    remedyAdviceHi
  };
}
