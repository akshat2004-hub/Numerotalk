import { parseDob, calculateMulank, calculateBhagyank } from './numerology';

export interface GridCell {
  number: number;
  count: number;
  digitsDisplay: string; // e.g., "44", "9", or ""
  isPresent: boolean;
  isRepeating: boolean;
  element: 'Wood' | 'Fire' | 'Earth' | 'Metal' | 'Water';
  direction: string;
  significanceEn: string;
  significanceHi: string;
}

export interface VedicGridResult {
  matrix: GridCell[][]; // 3x3 layout: Row 1 (4,9,2), Row 2 (3,5,7), Row 3 (8,1,6)
  flatCells: Record<number, GridCell>;
  counts: Record<number, number>;
  presentNumbers: number[];
  missingNumbers: number[];
  repeatingNumbers: Array<{ number: number; count: number }>;
  totalDigitsAnalyzed: number[];
  includedMulank: number;
  includedBhagyank: number;
}

// Indian Vedic layout (3 1 9 / 6 7 5 / 2 8 4) as specified
export const VEDIC_INDIAN_LAYOUT = [
  [3, 1, 9],
  [6, 7, 5],
  [2, 8, 4]
] as const;

// Traditional Lo Shu layout constants:
// [4, 9, 2]
// [3, 5, 7]
// [8, 1, 6]
export const LO_SHU_LAYOUT = [
  [4, 9, 2],
  [3, 5, 7],
  [8, 1, 6]
] as const;

export const NUMBER_ATTRIBUTES: Record<number, {
  element: 'Wood' | 'Fire' | 'Earth' | 'Metal' | 'Water';
  direction: string;
  significanceEn: string;
  significanceHi: string;
}> = {
  1: { element: 'Water', direction: 'North', significanceEn: 'Career, Communication, Opportunity', significanceHi: 'करियर, संचार, नए अवसर' },
  2: { element: 'Earth', direction: 'South-West', significanceEn: 'Relationships, Marriage, Sensitivity', significanceHi: 'संबंध, वैवाहिक सुख, संवेदनशीलता' },
  3: { element: 'Wood', direction: 'East', significanceEn: 'Knowledge, Planning, Family harmony', significanceHi: 'ज्ञान, योजना, पारिवारिक सामंजस्य' },
  4: { element: 'Wood', direction: 'South-East', significanceEn: 'Discipline, Wealth, Practical order', significanceHi: 'अनुशासन, धन संचय, संगठन' },
  5: { element: 'Earth', direction: 'Center', significanceEn: 'Stability, Balance, Adaptability', significanceHi: 'स्थिरता, संतुलन, अनुकूलनशीलता' },
  6: { element: 'Metal', direction: 'North-West', significanceEn: 'Luxury, Friends, New ventures', significanceHi: 'विलासिता, सहयोगी मित्र, सुख-सुविधा' },
  7: { element: 'Metal', direction: 'West', significanceEn: 'Spirituality, Intuition, Children', significanceHi: 'आध्यात्मिकता, अंतर्ज्ञान, संतान सुख' },
  8: { element: 'Earth', direction: 'North-East', significanceEn: 'Wisdom, Hard work, Spiritual knowledge', significanceHi: 'विवेक, कठिन परिश्रम, ज्ञान' },
  9: { element: 'Fire', direction: 'South', significanceEn: 'Fame, Energy, Humanitarian ideals', significanceHi: 'यश, ऊर्जा, सामाजिक ख्याति' },
};

/**
 * Generates Vedic / Lo Shu 3x3 Grid from DOB.
 * Optionally includes Mulank and Bhagyank in digit frequencies (standard in Vedic practice).
 */
export function calculateVedicGrid(
  dob: string | Date,
  includeMulankBhagyank: boolean = true,
  layout: 'vedic' | 'loshu' = 'vedic',
  additionalDigits: number[] = []
): VedicGridResult {
  const { digits } = parseDob(dob);
  const { mulank } = calculateMulank(dob);
  const { bhagyank } = calculateBhagyank(dob);

  // Filter out zeros, digits 1-9 only
  const baseDigits = digits.filter(d => d >= 1 && d <= 9);
  const allAnalyzed = [...baseDigits];

  if (includeMulankBhagyank) {
    if (mulank >= 1 && mulank <= 9) allAnalyzed.push(mulank);
    if (bhagyank >= 1 && bhagyank <= 9) allAnalyzed.push(bhagyank);
  }

  if (additionalDigits && additionalDigits.length > 0) {
    for (const d of additionalDigits) {
      if (d >= 1 && d <= 9) allAnalyzed.push(d);
    }
  }

  // Count frequencies
  const counts: Record<number, number> = {
    1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0
  };

  for (const digit of allAnalyzed) {
    counts[digit] = (counts[digit] || 0) + 1;
  }

  const presentNumbers: number[] = [];
  const missingNumbers: number[] = [];
  const repeatingNumbers: Array<{ number: number; count: number }> = [];
  const flatCells: Record<number, GridCell> = {};

  for (let n = 1; n <= 9; n++) {
    const c = counts[n];
    const isPresent = c > 0;
    const isRepeating = c > 1;

    if (isPresent) presentNumbers.push(n);
    else missingNumbers.push(n);

    if (isRepeating) repeatingNumbers.push({ number: n, count: c });

    const attr = NUMBER_ATTRIBUTES[n];
    flatCells[n] = {
      number: n,
      count: c,
      digitsDisplay: isPresent ? String(n).repeat(c) : '',
      isPresent,
      isRepeating,
      element: attr.element,
      direction: attr.direction,
      significanceEn: attr.significanceEn,
      significanceHi: attr.significanceHi
    };
  }

  // Build 3x3 matrix following selected layout:
  // Vedic Indian default: 3 1 9 / 6 7 5 / 2 8 4
  // Lo Shu: 4 9 2 / 3 5 7 / 8 1 6
  const activeLayout = layout === 'loshu' ? LO_SHU_LAYOUT : VEDIC_INDIAN_LAYOUT;
  const matrix: GridCell[][] = activeLayout.map(row =>
    row.map(num => flatCells[num])
  );

  return {
    matrix,
    flatCells,
    counts,
    presentNumbers,
    missingNumbers,
    repeatingNumbers,
    totalDigitsAnalyzed: allAnalyzed,
    includedMulank: mulank,
    includedBhagyank: bhagyank
  };
}
