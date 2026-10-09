import { calculateVedicGrid, VedicGridResult } from './grid';
import { calculateMulank, calculateBhagyank, parseDob } from './numerology';
import { calculatePersonalYear } from './dasha';
import { detectYogas } from './yogas';
import eventsConfig from '@/core/mocks/rules/events.json';
import friendlyEnemyConfig from '@/core/mocks/rules/friendly_enemy.json';

export interface EventRule {
  id: string;
  name: { en: string; hi: string };
  supportDigits: number[];
  hurdleDigits: number[];
  planetaryNumbers: number[];
  requiredYogs: string[];
  weightConfig: {
    support: number;
    hurdle: number;
    planetary: number;
  };
  predictionByLevel: {
    low: { en: string; hi: string };
    medium: { en: string; hi: string };
    high: { en: string; hi: string };
  };
  prescriptions: string[];
  favourableYearsRule: string;
}

export interface EventScoreResult {
  event: EventRule;
  score: number; // 0 - 100
  level: 'Low' | 'Medium' | 'High';
  levelHi: 'निम्न' | 'मध्यम' | 'उच्च';
  reasons: string[];
  favourableAges: number[];
  favourableYears: number[];
  cautionPeriods: string[];
  prediction: { en: string; hi: string };
  prescriptions: string[];
}

export interface ProfileInput {
  name?: string;
  dob: string;
  birthTime?: string;
}

export const ALL_EVENTS: EventRule[] = (eventsConfig.events || []) as EventRule[];

export const WORD_ORACLE: Record<number, { en: string; hi: string }> = {
  1: { en: 'Sankalpa (Initiative): Bold new leadership door opens. Take charge.', hi: 'संकल्प: नए नेतृत्व का द्वार खुलेगा। स्वयं आगे बढ़कर पहल करें।' },
  2: { en: 'Samman (Harmony): Emotional union, peace, and gracious cooperation.', hi: 'सम्मान व शांति: भावनात्मक संतुलन और मधुर सहयोग प्राप्त होगा।' },
  3: { en: 'Vidya (Wisdom): Learning, guidance of an enlightened mentor or elder.', hi: 'विद्या व ज्ञान: गुरुजनों का आशीर्वाद तथा उच्च ज्ञान की प्राप्ति होगी।' },
  4: { en: 'Niyojan (Discipline): Practical structure, building durable foundations.', hi: 'नियोजन: कठोर अनुशासन और दीर्घकालिक सुदृढ़ नींव का निर्माण होगा।' },
  5: { en: 'Parivartan (Momentum): Quick positive change, commercial agility, travels.', hi: 'परिवर्तन: अनुकूल बदलाव, व्यापारिक गति और सुखद यात्रा के योग।' },
  6: { en: 'Samriddhi (Luxury): Love, joyful celebrations, aesthetic bliss, and wealth.', hi: 'समृद्धि व प्रेम: पारिवारिक उत्सव, भौतिक सुख-साधनों की प्राप्ति।' },
  7: { en: 'Anusandhan (Intuition): Spiritual awakening, breakthroughs in research.', hi: 'अनुसंधान: अंतर्ज्ञान का उदय तथा गूढ़ रहस्यों में सफलता मिलेगी।' },
  8: { en: 'Nyay (Justice): Fair karmic reward, patience rewarded with massive gains.', hi: 'न्याय व कर्म: धैर्यपूर्वक किए गए परिश्रम का फल निश्चित मिलेगा।' },
  9: { en: 'Vijaya (Triumph): Courageous culmination, victory in trials, noble fame.', hi: 'विजय: साहस से शत्रुओं पर विजय और सामाजिक यश में वृद्धि होगी।' },
};

export function calculateEventPredictions(dob: string | Date) {
  const result = calculateAllEventScores({ dob: typeof dob === 'string' ? dob : dob.toISOString().split('T')[0] });
  return {
    events: result.scores.map(s => ({
      id: s.event.id,
      titleEn: s.event.name.en,
      titleHi: s.event.name.hi,
      status: s.level === 'High' ? 'Highly Favorable' : s.level === 'Medium' ? 'Moderate / Favorable with Effort' : 'Remedy Needed',
      predictionEn: s.prediction.en,
      predictionHi: s.prediction.hi
    })),
    wordOracleMap: WORD_ORACLE
  };
}

/**
 * Pure function: calculates event score (0-100), level, reasons, and timeline.
 * Deterministic: same inputs produce identical results.
 * Level thresholds: <40 Low, 40-70 Medium, >70 High.
 */
export function eventScore(
  event: EventRule,
  profile: ProfileInput,
  year: number = new Date().getFullYear()
): EventScoreResult {
  const dob = profile.dob || '1995-10-23';
  const { year: birthYear } = parseDob(dob);
  const grid = calculateVedicGrid(dob, true);
  const { counts } = grid;
  const { mulank } = calculateMulank(dob);
  const { bhagyank } = calculateBhagyank(dob);
  const { yogas: allDetectedYogas } = detectYogas(grid);
  const activeYogas = allDetectedYogas.map((y) => y.id);

  const reasons: string[] = [];
  let baseScore = 32;

  // 1. Support Digits Evaluation
  for (const digit of event.supportDigits) {
    const count = counts[digit] || 0;
    if (count > 0) {
      const pts = Math.min(count, 2) * (event.weightConfig.support || 15);
      baseScore += pts;
      reasons.push(
        count > 1
          ? `Digit ${digit} present ${count} times in grid: +${pts}`
          : `Support digit ${digit} present in grid: +${pts}`
      );
    } else {
      baseScore -= 4;
      reasons.push(`Support digit ${digit} is absent in grid: -4`);
    }
  }

  // 2. Hurdle Digits Evaluation
  for (const digit of event.hurdleDigits) {
    const count = counts[digit] || 0;
    if (count > 0) {
      const penalty = Math.abs(event.weightConfig.hurdle || 10) * Math.min(count, 2);
      baseScore -= penalty;
      reasons.push(`Hurdle digit ${digit} present in grid (${count}x): -${penalty}`);
    }
  }

  // 3. Planetary Friendship with Mulank and Bhagyank
  const matrix = (friendlyEnemyConfig.matrix as Record<
    string,
    { friendly: number[]; neutral: number[]; enemy: number[] }
  >) || {};

  const mulankRel = matrix[String(mulank)];
  const bhagyankRel = matrix[String(bhagyank)];

  for (const pNum of event.planetaryNumbers) {
    if (mulankRel) {
      if (mulankRel.friendly.includes(pNum)) {
        baseScore += 6;
        reasons.push(`Mulank ${mulank} is friendly with key number ${pNum}: +6`);
      } else if (mulankRel.enemy.includes(pNum)) {
        baseScore -= 6;
        reasons.push(`Mulank ${mulank} has friction with key number ${pNum}: -6`);
      }
    }

    if (bhagyankRel) {
      if (bhagyankRel.friendly.includes(pNum)) {
        baseScore += 5;
        reasons.push(`Bhagyank ${bhagyank} supports planetary number ${pNum}: +5`);
      } else if (bhagyankRel.enemy.includes(pNum)) {
        baseScore -= 5;
        reasons.push(`Bhagyank ${bhagyank} conflicts with planetary number ${pNum}: -5`);
      }
    }
  }

  // 4. Required Yogas
  for (const yog of event.requiredYogs) {
    if (activeYogas.some((ay) => ay.toLowerCase().includes(yog.toLowerCase()))) {
      baseScore += 10;
      reasons.push(`Associated auspicious yoga (${yog}) active in Vedic grid: +10`);
    }
  }

  // 5. Current Year Alignment (Antardasha / Personal Year)
  const personalYear = calculatePersonalYear(dob, year);
  if (event.supportDigits.includes(personalYear) || event.planetaryNumbers.includes(personalYear)) {
    baseScore += 6;
    reasons.push(`Current Personal Year ${personalYear} (${year}) energetically aligns: +6`);
  } else if (event.hurdleDigits.includes(personalYear)) {
    baseScore -= 5;
    reasons.push(`Current Personal Year ${personalYear} (${year}) requires caution: -5`);
  }

  // Clamp strictly between 12 and 96
  const finalScore = Math.max(12, Math.min(96, Math.round(baseScore)));

  // Categorize according to strict prompt thresholds:
  // <40 Low, 40-70 Medium, >70 High
  let level: 'Low' | 'Medium' | 'High' = 'Medium';
  let levelHi: 'निम्न' | 'मध्यम' | 'उच्च' = 'मध्यम';

  if (finalScore < 40) {
    level = 'Low';
    levelHi = 'निम्न';
  } else if (finalScore > 70) {
    level = 'High';
    levelHi = 'उच्च';
  } else {
    level = 'Medium';
    levelHi = 'मध्यम';
  }

  const prediction =
    level === 'High'
      ? event.predictionByLevel.high
      : level === 'Medium'
      ? event.predictionByLevel.medium
      : event.predictionByLevel.low;

  // Timeline projections (next 10 years)
  const favourableYears: number[] = [];
  const cautionPeriods: string[] = [];
  const favourableAges: number[] = [];

  for (let i = 0; i < 10; i++) {
    const yr = year + i;
    const py = calculatePersonalYear(dob, yr);
    const ageAtYr = yr - birthYear;

    if (event.supportDigits.includes(py) || event.planetaryNumbers.includes(py)) {
      favourableYears.push(yr);
      if (ageAtYr > 0) favourableAges.push(ageAtYr);
    } else if (event.hurdleDigits.includes(py)) {
      cautionPeriods.push(`${yr} (PY ${py})`);
    }
  }

  return {
    event,
    score: finalScore,
    level,
    levelHi,
    reasons,
    favourableAges,
    favourableYears,
    cautionPeriods,
    prediction,
    prescriptions: event.prescriptions || []
  };
}

/**
 * Calculates scores for all 14 events.
 */
export function calculateAllEventScores(
  profile: ProfileInput,
  year: number = new Date().getFullYear()
): {
  scores: EventScoreResult[];
  strongest: EventScoreResult[];
  weakest: EventScoreResult[];
  topRemedies: string[];
} {
  const scores = ALL_EVENTS.map((event) => eventScore(event, profile, year));
  const sorted = [...scores].sort((a, b) => b.score - a.score);

  const strongest = sorted.slice(0, 3);
  const weakest = [...sorted].reverse().slice(0, 3);

  // Auto-aggregate top remedies from weakest 3 events, deduplicated
  const remediesSet = new Set<string>();
  for (const ev of weakest) {
    for (const rem of ev.prescriptions) {
      remediesSet.add(rem);
    }
  }

  return {
    scores,
    strongest,
    weakest,
    topRemedies: Array.from(remediesSet)
  };
}

/**
 * Special Event 4: Year Before Birth karmic reading
 */
export function getYearBeforeBirthReading(dob: string) {
  const { year: birthYear } = parseDob(dob);
  const karmicYear = birthYear - 1;
  const birthGrid = calculateVedicGrid(dob, true);
  const karmicGrid = calculateVedicGrid(`15-06-${karmicYear}`, false);

  const sharedDigits = birthGrid.presentNumbers.filter((n) =>
    karmicGrid.presentNumbers.includes(n)
  );

  return {
    karmicYear,
    karmicGrid,
    sharedDigits,
    readingEn: `Year ${karmicYear} represents your immediate pre-incarnate causal imprint. Digits [${sharedDigits.join(', ')}] carry over ancestral blessings, while numbers unique to your birth year define this incarnation's new lessons.`,
    readingHi: `जन्म पूर्व वर्ष ${karmicYear} आपकी पूर्व संचित चेतना को दर्शाता है। अंक [${sharedDigits.join(', ')}] पूर्वजन्म के संचित पुण्यों का वहन करते हैं, तथा आपके जन्म वर्ष के नए अंक इस जन्म की साधना का मार्ग प्रशस्त करते हैं।`
  };
}

/**
 * Special Event 12: Love vs Arranged Marriage breakdown
 */
export function getMarriageLoveReading(profile: ProfileInput, year: number = new Date().getFullYear()) {
  const dob = profile.dob || '1995-10-23';
  const grid = calculateVedicGrid(dob, true);
  const counts = grid.counts;

  // Love propensity driven by 5 (Mercury/agility), 6 (Venus/romance), 2 (Moon/emotion)
  const lovePower = (counts[5] || 0) * 15 + (counts[6] || 0) * 20 + (counts[2] || 0) * 12;
  // Arranged propensity driven by 3 (Jupiter/elders), 8 (Saturn/tradition), 1 (Sun/family pride)
  const arrangedPower = (counts[3] || 0) * 18 + (counts[8] || 0) * 15 + (counts[1] || 0) * 12;

  const total = Math.max(1, lovePower + arrangedPower);
  const lovePct = Math.round((lovePower / total) * 100);
  const arrangedPct = 100 - lovePct;

  return {
    lovePct,
    arrangedPct,
    verdictEn:
      lovePct >= 55
        ? 'Strong inclination towards self-chosen romantic partnership with high mutual connection.'
        : 'High compatibility with traditional elder-facilitated arranged marriage bringing lifelong stability.',
    verdictHi:
      lovePct >= 55
        ? 'मनपसंद साथी के साथ प्रेम विवाह के अत्यधिक प्रबल योग; पारस्परिक समझ गहरी रहेगी।'
        : 'पारंपरिक पारिवारिक सहमति से होने वाला विवाह अधिक सुदृढ़, सुखद और स्थाई सिद्ध होगा।'
  };
}

/**
 * Special Event 8: Comprehensive 0-90 Years timeline markers
 */
export function getAllEventsLifeTimeline(dob: string) {
  const { year: birthYear } = parseDob(dob);
  const { mulank } = calculateMulank(dob);

  const markers = [
    { age: 9, labelEn: 'Foundational Awakening', labelHi: 'प्राथमिक संस्कार व शिक्षा', type: 'milestone' },
    { age: 18, labelEn: 'Identity & Ambition Rise', labelHi: 'करियर दिशा व युवा ऊर्जा', type: 'peak' },
    { age: 27, labelEn: 'Career & Partnership Nexus', labelHi: 'कार्यक्षेत्र व विवाह योग', type: 'milestone' },
    { age: 36, labelEn: 'Golden Raj Yoga Maturation', labelHi: 'राजयोग परिपक्वता व स्थिरता', type: 'peak' },
    { age: 45, labelEn: 'Leadership & Asset Peak', labelHi: 'प्रतिष्ठा व संपत्ति विस्तार', type: 'peak' },
    { age: 54, labelEn: 'Wisdom & Strategic Mentorship', labelHi: 'मार्गदर्शन व सामाजिक सम्मान', type: 'milestone' },
    { age: 63, labelEn: 'Spiritual Harvest & Legacy', labelHi: 'आध्यात्मिक शांति व संचित फल', type: 'peak' },
    { age: 72, labelEn: 'Dharma Fulfillment', labelHi: 'धर्म साधना व सुखद संतोष', type: 'milestone' },
    { age: 81, labelEn: 'Transcendent Harmony', labelHi: 'पूर्ण तृप्ति व आत्मिक उत्कर्ष', type: 'peak' }
  ];

  return markers.map((m) => ({
    ...m,
    calendarYear: birthYear + m.age,
    dashaNumber: ((mulank - 1 + Math.floor(m.age / 9)) % 9) + 1
  }));
}

/**
 * Special Event 9: Word Number Oracle impact
 */
export function getWordNumberImpact(pickedNumber: number, profile: ProfileInput) {
  const dob = profile.dob || '1995-10-23';
  const grid = calculateVedicGrid(dob, true);
  const isPresent = (grid.counts[pickedNumber] || 0) > 0;
  const count = grid.counts[pickedNumber] || 0;

  const names: Record<number, { en: string; hi: string }> = {
    1: { en: 'Surya (Sun) - Leadership & Authority', hi: 'सूर्य - नेतृत्व व प्रशासनिक तेज' },
    2: { en: 'Chandra (Moon) - Emotion & Creativity', hi: 'चंद्र - संवेदनशीलता व कलात्मकता' },
    3: { en: 'Guru (Jupiter) - Wisdom & Counsel', hi: 'गुरु - ज्ञान व आध्यात्मिक प्रगति' },
    4: { en: 'Rahu - Innovation & Practical Genius', hi: 'राहु - तकनीकी मेधा व संगठन' },
    5: { en: 'Budh (Mercury) - Business & Agility', hi: 'बुध - व्यापार, संचार व संतुलन' },
    6: { en: 'Shukra (Venus) - Luxury & Harmony', hi: 'शुक्र - विलासिता, प्रेम व आकर्षण' },
    7: { en: 'Ketu - Intuition & Metaphysics', hi: 'केतु - अंतर्ज्ञान व शोध' },
    8: { en: 'Shani (Saturn) - Endurance & Justice', hi: 'शनि - कर्मफल व स्थायित्व' },
    9: { en: 'Mangal (Mars) - Courage & Culmination', hi: 'मंगल - पराक्रम, विजय व यश' }
  };

  return {
    pickedNumber,
    name: names[pickedNumber] || names[1],
    isPresent,
    count,
    adviceEn: isPresent
      ? `Number ${pickedNumber} is energized in your birth matrix (${count}x). Leveraging this vibration yields rapid breakthroughs in wealth, career, and relationships.`
      : `Number ${pickedNumber} is currently missing in your grid. Activate its vibration through color harmonization, mantras, and strategic signatures.`,
    adviceHi: isPresent
      ? `अंक ${pickedNumber} आपकी जन्म ग्रिड में उपस्थित है (${count} बार)। यह आपके जीवन में यश, धन और संबंधों में शक्ति प्रदान करता है।`
      : `अंक ${pickedNumber} आपकी ग्रिड में अनुपस्थित है। इसके अनुकूल रंग, रत्न अथवा मंत्र से इसे सक्रिय करने से रुके हुए कार्य सिद्ध होंगे।`
  };
}
