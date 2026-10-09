import { VedicGridResult } from './grid';

export interface YogaDefinition {
  id: string;
  numbers: [number, number, number];
  nameEn: string;
  nameHi: string;
  category: 'Row Plane' | 'Column Plane' | 'Diagonal Plane';
  categoryHi: string;
  descriptionEn: string;
  descriptionHi: string;
  fullImpactEn: string;
  fullImpactHi: string;
  partialImpactEn: string;
  partialImpactHi: string;
}

export interface DetectedYoga {
  id: string;
  nameEn: string;
  nameHi: string;
  category: string;
  categoryHi: string;
  numbers: [number, number, number];
  presentNumbers: number[];
  missingNumbers: number[];
  status: 'full' | 'partial' | 'inactive';
  percentage: number;
  descriptionEn: string;
  descriptionHi: string;
  impactEn: string;
  impactHi: string;
}
export interface YogStatusResult {
  present: number[];
  missing: number[];
  count: number;
  status: 'formed' | 'partial' | 'inactive';
}

export function yogStatus(
  gridResult: VedicGridResult,
  digits: [number, number, number] | number[]
): YogStatusResult {
  const counts = gridResult.counts;
  const present = digits.filter((d) => (counts[d] || 0) > 0);
  const missing = digits.filter((d) => (counts[d] || 0) === 0);
  const count = present.length;

  let status: 'formed' | 'partial' | 'inactive' = 'inactive';
  if (count === 3) {
    status = 'formed';
  } else if (count === 2) {
    status = 'partial';
  } else {
    status = 'inactive';
  }

  return { present, missing, count, status };
}

export const YOGA_DEFINITIONS: YogaDefinition[] = [
  {
    id: 'mental_plane',
    numbers: [3, 1, 9],
    nameEn: 'Mental Plane (Intellectual Yoga)',
    nameHi: 'मानसिक योग (बौद्धिक तल)',
    category: 'Row Plane',
    categoryHi: 'क्षैतिज तल (पंक्ति 1)',
    descriptionEn: 'Formed by numbers 3, 1, and 9 (top row of Vedic grid). Governs memory, intellect, logical power, and brain sharpness.',
    descriptionHi: 'संख्या 3, 1 और 9 से निर्मित (वैदिक ग्रिड की प्रथम पंक्ति)। यह स्मरण शक्ति, तीक्ष्ण बुद्धि और विश्लेषणात्मक क्षमता का प्रतीक है।',
    fullImpactEn: 'Exceptional memory, sharp intellect, analytical brilliance, and clarity in complex problem solving.',
    fullImpactHi: 'उत्कृष्ट स्मरण शक्ति, तीव्र विश्लेषण क्षमता तथा जटिल समस्याओं में स्पष्ट निर्णय क्षमता।',
    partialImpactEn: 'Good intellectual inclination, but requires discipline to sustain deep concentration.',
    partialImpactHi: 'बौद्धिक रुचि अच्छी रहती है, किंतु एकाग्रता बनाए रखने के लिए सतत प्रयास आवश्यक होता है।'
  },
  {
    id: 'emotional_plane',
    numbers: [6, 7, 5],
    nameEn: 'Emotional Plane (Heart & Soul Yoga)',
    nameHi: 'भावनात्मक योग (हृदय व आत्मा तल)',
    category: 'Row Plane',
    categoryHi: 'क्षैतिज तल (पंक्ति 2)',
    descriptionEn: 'Formed by numbers 6, 7, and 5 (middle row of Vedic grid). Represents intuition, compassion, artistic sensitivity, and spiritual aura.',
    descriptionHi: 'संख्या 6, 7 और 5 से निर्मित (वैदिक ग्रिड की मध्य पंक्ति)। यह करुणा, अंतर्ज्ञान, संवेदनशीलता और आध्यात्मिक चेतना का प्रतिनिधित्व करता है।',
    fullImpactEn: 'Deep empathy, strong intuition, natural artistic flair, and profound emotional intelligence.',
    fullImpactHi: 'गहरी संवेदनशीलता, अचूक अंतर्ज्ञान, कलात्मक दृष्टि और भावनात्मक संतुलन।',
    partialImpactEn: 'Sensitive nature; feelings can fluctuate when under interpersonal pressure.',
    partialImpactHi: 'भावुक स्वभाव; तनाव में भावनाओं में उतार-चढ़ाव आ सकता है।'
  },
  {
    id: 'practical_plane',
    numbers: [2, 8, 4],
    nameEn: 'Practical Plane (Physical & Material Yoga)',
    nameHi: 'व्यावहारिक योग (कर्म व भौतिक तल)',
    category: 'Row Plane',
    categoryHi: 'क्षैतिज तल (पंक्ति 3)',
    descriptionEn: 'Formed by numbers 2, 8, and 4 (bottom row of Vedic grid). Directs hands-on execution, physical stamina, financial grounding, and craft.',
    descriptionHi: 'संख्या 2, 8 और 4 से निर्मित (वैदिक ग्रिड की अंतिम पंक्ति)। यह व्यावहारिक कौशल, शारीरिक ऊर्जा और भौतिक सफलता का योग है।',
    fullImpactEn: 'Master of execution, highly pragmatic, grounded financial vision, and excellent mechanical skills.',
    fullImpactHi: 'कुशल कार्य-निष्पादन, धरातलीय सोच, उत्कृष्ट वित्तीय प्रबंधन व भौतिक साधनों की प्राप्ति।',
    partialImpactEn: 'Practical abilities present, but financial discipline needs consistent habit building.',
    partialImpactHi: 'व्यावहारिक दक्षता रहती है, परंतु नियमित अनुशासन से ही पूर्ण लाभ मिलता है।'
  },
  {
    id: 'thought_plane',
    numbers: [3, 6, 2],
    nameEn: 'Thought Plane (Visionary Yoga)',
    nameHi: 'विचार योग (दूरदर्शी तल)',
    category: 'Column Plane',
    categoryHi: 'ऊर्ध्वाधर तल (स्तंभ 1)',
    descriptionEn: 'Formed by numbers 3, 6, and 2 (left column of Vedic grid). Signifies visionary ideas, strategic foresight, and organizational planning.',
    descriptionHi: 'संख्या 3, 6 और 2 से निर्मित (वैदिक ग्रिड का प्रथम स्तंभ)। यह दूरदर्शिता, रणनीति, नई योजनाओं और अनुसंधान का योग है।',
    fullImpactEn: 'Visionary strategist, deep conceptual thinker, never acts without a solid masterplan.',
    fullImpactHi: 'दूरदर्शी रणनीतिकार, गहरी योजना बनाने में माहिर तथा दूरगामी सोच के धनी।',
    partialImpactEn: 'Good brainstormer; requires active follow-through to bridge planning with execution.',
    partialImpactHi: 'विचार बहुत आते हैं; योजनाओं को मूर्त रूप देने के लिए सक्रिय कर्म की आवश्यकता है।'
  },
  {
    id: 'will_plane',
    numbers: [1, 7, 8],
    nameEn: 'Will Power Plane (Determination Yoga)',
    nameHi: 'दृढ़ संकल्प योग (इच्छाशक्ति तल)',
    category: 'Column Plane',
    categoryHi: 'ऊर्ध्वाधर तल (स्तंभ 2)',
    descriptionEn: 'Formed by numbers 1, 7, and 8 (middle column of Vedic grid). Governs persistence, unshakable willpower, courage, and triumph over hurdles.',
    descriptionHi: 'संख्या 1, 7 और 8 से निर्मित (वैदिक ग्रिड का मध्य स्तंभ)। यह अदम्य इच्छाशक्ति, सतत संघर्ष और विपरीत परिस्थितियों में विजय का योग है।',
    fullImpactEn: 'Iron willpower, resilience against any adversity, and unwavering drive until victory is achieved.',
    fullImpactHi: 'लौह इच्छाशक्ति, किसी भी चुनौती से न डिगने का हौसला और लक्ष्य प्राप्ति तक निरंतर प्रयास।',
    partialImpactEn: 'Determined in spurts; needs routine to avoid sudden drops in motivation.',
    partialImpactHi: 'उत्साह रहता है, परंतु निरंतरता बनाए रखने के लिए प्रेरक वातावरण की आवश्यकता होती है।'
  },
  {
    id: 'action_plane',
    numbers: [9, 5, 4],
    nameEn: 'Action Plane (Execution Yoga)',
    nameHi: 'कर्म योग (क्रियाशीलता तल)',
    category: 'Column Plane',
    categoryHi: 'ऊर्ध्वाधर तल (स्तंभ 3)',
    descriptionEn: 'Formed by numbers 9, 5, and 4 (right column of Vedic grid). Denotes immediate action, dynamism, physical movement, and speed of execution.',
    descriptionHi: 'संख्या 9, 5 और 4 से निर्मित (वैदिक ग्रिड का तृतीय स्तंभ)। यह त्वरित निर्णय, सक्रियता और विचारों को तुरंत व्यवहार में लाने का योग है।',
    fullImpactEn: 'Dynamic mover and shaker; translates thoughts directly into tangible actions with zero hesitation.',
    fullImpactHi: 'अत्यंत सक्रिय, तत्काल निर्णय लेकर कार्य शुरू करने वाले तथा क्रियान्वयन में कुशल।',
    partialImpactEn: 'Quick to respond, but sometimes acts before sufficient reflection.',
    partialImpactHi: 'कार्य करने में तत्पर, कभी-कभी बिना पूर्ण योजना के कदम उठा सकते हैं।'
  },
  {
    id: 'golden_raj_yoga',
    numbers: [3, 7, 4],
    nameEn: 'Golden Raj Yoga (Prosperity & Success Diagonal)',
    nameHi: 'स्वर्ण राज योग (समृद्धि व सर्वकल्याण विकर्ण)',
    category: 'Diagonal Plane',
    categoryHi: 'मुख्य विकर्ण (3-7-4)',
    descriptionEn: 'Formed by numbers 3, 7, and 4 (diagonal of Vedic grid). The most celebrated diagonal yoga in numerology representing complete success.',
    descriptionHi: 'संख्या 3, 7 और 4 से निर्मित (वैदिक ग्रिड का विकर्ण)। अंकज्योतिष का सर्वाधिक शुभ योग, जो जीवन में समग्र सफलता और समृद्धि लाता है।',
    fullImpactEn: 'Rare blessings: wealth, luxury, balance, high social standing, and harmonious family life.',
    fullImpactHi: 'अद्भुत सौभाग्य: प्रचुर धन-संपदा, सम्मान, पारिवारिक सुख और जीवन में स्वतः मिलने वाले सुअवसर।',
    partialImpactEn: 'Favorable foundation for growth; targeted remedies can unlock full potential.',
    partialImpactHi: 'उन्नति के अच्छे योग; अनुपस्थित अंक के उपाय करने से विशेष लाभ मिलता है।'
  },
  {
    id: 'silver_raj_yoga',
    numbers: [9, 7, 2],
    nameEn: 'Silver Raj Yoga (Property & Earth Plane)',
    nameHi: 'रजत राज योग (भूमि व संपत्ति विकर्ण)',
    category: 'Diagonal Plane',
    categoryHi: 'द्वितीयक विकर्ण (9-7-2)',
    descriptionEn: 'Formed by numbers 9, 7, and 2 (diagonal of Vedic grid). Associated with real estate, land ownership, inherited assets, and emotional endurance.',
    descriptionHi: 'संख्या 9, 7 और 2 से निर्मित (वैदिक ग्रिड का विकर्ण)। यह अचल संपत्ति, भूमि, भवन, पैतृक लाभ और भावनात्मक सुदृढ़ता का योग है।',
    fullImpactEn: 'Significant ownership of land and real estate, steady financial accumulation, and rock-solid grounding.',
    fullImpactHi: 'अचल संपत्ति, मकान-जमीन के विशेष लाभ, स्थायी धन संचय और जीवन में सुदृढ़ स्थिरता।',
    partialImpactEn: 'Potential to acquire land/property through disciplined investments.',
    partialImpactHi: 'नियोजित निवेश से अचल संपत्ति बनने के उत्तम अवसर बनते हैं।'
  }
];

export function detectYogas(gridResult: VedicGridResult): {
  yogas: DetectedYoga[];
  fullYogas: DetectedYoga[];
  partialYogas: DetectedYoga[];
  inactiveYogas: DetectedYoga[];
} {
  const { counts } = gridResult;

  const yogas: DetectedYoga[] = YOGA_DEFINITIONS.map(def => {
    const presentNumbers = def.numbers.filter(num => (counts[num] || 0) > 0);
    const missingNumbers = def.numbers.filter(num => (counts[num] || 0) === 0);

    let status: 'full' | 'partial' | 'inactive' = 'inactive';
    let percentage = 0;
    let impactEn = '';
    let impactHi = '';

    if (presentNumbers.length === 3) {
      status = 'full';
      percentage = 100;
      impactEn = def.fullImpactEn;
      impactHi = def.fullImpactHi;
    } else if (presentNumbers.length === 2) {
      status = 'partial';
      percentage = 66;
      impactEn = def.partialImpactEn;
      impactHi = def.partialImpactHi;
    } else {
      status = 'inactive';
      percentage = Math.round((presentNumbers.length / 3) * 100);
      impactEn = `Missing numbers: ${missingNumbers.join(', ')}. Need remedies to strengthen this energy.`;
      impactHi = `अनुपस्थित अंक: ${missingNumbers.join(', ')}। इस तल को सक्रिय करने हेतु उपाय करें।`;
    }

    return {
      id: def.id,
      nameEn: def.nameEn,
      nameHi: def.nameHi,
      category: def.category,
      categoryHi: def.categoryHi,
      numbers: def.numbers,
      presentNumbers,
      missingNumbers,
      status,
      percentage,
      descriptionEn: def.descriptionEn,
      descriptionHi: def.descriptionHi,
      impactEn,
      impactHi
    };
  });

  const fullYogas = yogas.filter(y => y.status === 'full');
  const partialYogas = yogas.filter(y => y.status === 'partial');
  const inactiveYogas = yogas.filter(y => y.status === 'inactive');

  return { yogas, fullYogas, partialYogas, inactiveYogas };
}
