import { calculateVedicGrid, VedicGridResult } from './grid';
import vastuDirectionsData from '../mocks/rules/vastu-directions.json';

export interface VastuDirectionAnalysis {
  directionEn: string;
  directionHi: string;
  number: number;
  element: string;
  roomUsageEn: string;
  roomUsageHi: string;
  status: 'Empowered' | 'Balanced' | 'Deficient / Missing';
  statusHi: 'अति ऊर्जावान' | 'संतुलित' | 'कमजोर / दोषयुक्त';
  remedyEn: string;
  remedyHi: string;
}

export interface VastuNumerologyResult {
  grid: VedicGridResult;
  directions: VastuDirectionAnalysis[];
  elementDominanceEn: string;
  elementDominanceHi: string;
  brahmasthanBalanceEn: string;
  brahmasthanBalanceHi: string;
  summaryEn: string;
  summaryHi: string;
}

export function calculateVastuNumerology(dob: string | Date): VastuNumerologyResult {
  const grid = calculateVedicGrid(dob);
  const { counts } = grid;

  const rawDirections = vastuDirectionsData.directions as Record<string, {
    directionEn: string;
    directionHi: string;
    elementEn: string;
    elementHi: string;
    roomUsageEn: string;
    roomUsageHi: string;
    remedyEn: string;
    remedyHi: string;
  }>;

  const directions: VastuDirectionAnalysis[] = [];

  for (let n = 1; n <= 9; n++) {
    const c = counts[n] || 0;
    const rule = rawDirections[String(n)];

    let status: VastuDirectionAnalysis['status'] = 'Deficient / Missing';
    let statusHi: VastuDirectionAnalysis['statusHi'] = 'कमजोर / दोषयुक्त';

    if (c >= 2) {
      status = 'Empowered';
      statusHi = 'अति ऊर्जावान';
    } else if (c === 1) {
      status = 'Balanced';
      statusHi = 'संतुलित';
    }

    directions.push({
      directionEn: `${rule.directionEn} (${rule.elementEn})`,
      directionHi: `${rule.directionHi} (${rule.elementHi})`,
      number: n,
      element: rule.elementEn,
      roomUsageEn: rule.roomUsageEn,
      roomUsageHi: rule.roomUsageHi,
      status,
      statusHi,
      remedyEn: rule.remedyEn,
      remedyHi: rule.remedyHi
    });
  }

  const hasCenter = (counts[5] || 0) > 0;
  const brahmasthanBalanceEn = hasCenter
    ? 'Center Brahmasthan (Number 5) is present and stable, radiating balance across all 8 zones.'
    : 'Center Brahmasthan (Number 5) is missing in your grid. Ensure the center of your house is open and uncluttered.';
  const brahmasthanBalanceHi = hasCenter
    ? 'ब्रह्मस्थान (अंक 5) ग्रिड में उपस्थित है, जो सभी दिशाओं में सकारात्मक संतुलन बनाए रखता है।'
    : 'ग्रिड में अंक 5 अनुपस्थित है। घर के मध्य भाग को पूर्णतः खाली और स्वच्छ रखें ताकि ऊर्जा का प्रवाह बना रहे।';

  return {
    grid,
    directions,
    elementDominanceEn: `Balanced across Vedic directions. Strengthen missing areas with spatial remedies.`,
    elementDominanceHi: `वैदिक दिशाओं में संतुलित प्रभाव। अनुपस्थित दिशाओं को वास्तु उपायों से सुदृढ़ करें।`,
    brahmasthanBalanceEn,
    brahmasthanBalanceHi,
    summaryEn: `Vastu numerology maps your personal cosmic grid onto living architecture. By harmonizing missing directions, domestic tranquility and financial flow naturally amplify.`,
    summaryHi: `वास्तु अंकज्योतिष आपकी जन्म ऊर्जा को आपके निवास के साथ जोड़ता है। अनुपस्थित दिशाओं के संतुलन से घर में सुख, शांति और समृद्धि की वृद्धि होती है।`
  };
}
