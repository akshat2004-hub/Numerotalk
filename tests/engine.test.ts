import { describe, it, expect } from 'vitest';
import {
  calculateMulank,
  calculateBhagyank,
  calculateDestinyNumber,
  reduceToSingleDigit,
  parseDob
} from '../lib/engine/numerology';
import { calculateVedicGrid, LO_SHU_LAYOUT } from '../lib/engine/grid';
import { detectYogas } from '../lib/engine/yogas';
import { getNumberRelationship, calculateMatchMaking } from '../lib/engine/compatibility';
import { calculateYearlyPrediction, calculatePersonalYear } from '../lib/engine/dasha';
import { analyzeMobileNumber } from '../lib/engine/mobile';
import { transliterateDevanagari } from '../lib/engine/transliteration';
import { getNumberMeaning } from '../lib/engine/meanings108';
import { calculateTimeNumerology } from '../lib/engine/timeNumerology';
import { calculateVastuNumerology } from '../lib/engine/vastu';
import { calculateEventPredictions } from '../lib/engine/events';
import { generatePasswordByProfession, generatePinByNumerology } from '../lib/engine/security';

describe('Vedic Numerology Engine', () => {
  describe('DOB & Driver / Conductor Calculations', () => {
    it('parses DOB correctly across string formats', () => {
      const p1 = parseDob('1995-10-23');
      expect(p1.year).toBe(1995);
      expect(p1.month).toBe(10);
      expect(p1.day).toBe(23);

      const p2 = parseDob('23/10/1995');
      expect(p2.year).toBe(1995);
      expect(p2.month).toBe(10);
      expect(p2.day).toBe(23);
    });

    it('calculates Mulank (Driver Number) accurately', () => {
      // 23rd -> 2 + 3 = 5
      const res1 = calculateMulank('1995-10-23');
      expect(res1.mulank).toBe(5);
      expect(res1.dayNumber).toBe(23);
      expect(res1.compoundStr).toBe('23/5');

      // 29th -> 2 + 9 = 11 -> 1 + 1 = 2
      const res2 = calculateMulank('1990-08-29');
      expect(res2.mulank).toBe(2);
      expect(res2.compoundStr).toBe('29/2');

      // 7th -> single digit 7
      const res3 = calculateMulank('2001-01-07');
      expect(res3.mulank).toBe(7);
      expect(res3.compoundStr).toBe('7');
    });

    it('calculates Bhagyank (Conductor Number / Life Path) accurately', () => {
      // 1995-10-23: digits 2,3,1,0,1,9,9,5 -> sum = 30 -> 3+0 = 3
      const res = calculateBhagyank('1995-10-23');
      expect(res.rawSum).toBe(30);
      expect(res.bhagyank).toBe(3);
      expect(res.compoundStr).toBe('30/3');
    });

    it('reduces multi-digit numbers to single digit', () => {
      expect(reduceToSingleDigit(99)).toBe(9); // 9+9=18 -> 1+8=9
      expect(reduceToSingleDigit(55)).toBe(1); // 5+5=10 -> 1+0=1
      expect(reduceToSingleDigit(7)).toBe(7);
    });
  });

  describe('Name & Destiny Calculations with Transliteration', () => {
    it('calculates Chaldean Destiny for English name "RAHUL"', () => {
      // R(2) + A(1) + H(5) + U(6) + L(3) = 17 -> 1+7 = 8
      const res = calculateDestinyNumber('RAHUL', 'chaldean');
      expect(res.compoundNumber).toBe(17);
      expect(res.destinyNumber).toBe(8);
      expect(res.compoundStr).toBe('17/8');
    });

    it('calculates Pythagorean Destiny for English name "RAHUL"', () => {
      // R(9) + A(1) + H(8) + U(3) + L(3) = 24 -> 2+4 = 6
      const res = calculateDestinyNumber('RAHUL', 'pythagorean');
      expect(res.compoundNumber).toBe(24);
      expect(res.destinyNumber).toBe(6);
      expect(res.compoundStr).toBe('24/6');
    });

    it('transliterates Devanagari "राहुल" and computes same destiny', () => {
      const translit = transliterateDevanagari('राहुल');
      expect(translit.isDevanagari).toBe(true);
      expect(translit.transliterated).toBe('RAHUL');

      const res = calculateDestinyNumber('राहुल', 'chaldean');
      expect(res.transliteratedName).toBe('RAHUL');
      expect(res.destinyNumber).toBe(8);
    });
  });

  describe('Lo Shu / Vedic 3x3 Grid', () => {
    it('generates 3x3 layout with correct coordinates', () => {
      expect(LO_SHU_LAYOUT).toEqual([
        [4, 9, 2],
        [3, 5, 7],
        [8, 1, 6]
      ]);
    });

    it('counts frequencies, missing, and repeating digits', () => {
      // DOB: 1995-10-23
      // Digits: 2, 3, 1, 1, 9, 9, 5 + Mulank(5) + Bhagyank(3)
      const grid = calculateVedicGrid('1995-10-23', true);

      expect(grid.counts[1]).toBe(2);
      expect(grid.counts[2]).toBe(1);
      expect(grid.counts[3]).toBe(2);
      expect(grid.counts[4]).toBe(0);
      expect(grid.counts[5]).toBe(2);
      expect(grid.counts[6]).toBe(0);
      expect(grid.counts[7]).toBe(0);
      expect(grid.counts[8]).toBe(0);
      expect(grid.counts[9]).toBe(2);

      expect(grid.missingNumbers).toEqual([4, 6, 7, 8]);
      expect(grid.repeatingNumbers.map(r => r.number)).toEqual([1, 3, 5, 9]);

      // Check 3x3 matrix layout (Indian Vedic: 3 1 9 / 6 7 5 / 2 8 4)
      expect(grid.matrix[0][0].number).toBe(3);
      expect(grid.matrix[0][0].isPresent).toBe(true);
      expect(grid.matrix[0][1].number).toBe(1);
      expect(grid.matrix[0][1].count).toBe(2);
      expect(grid.matrix[0][2].number).toBe(9);
      expect(grid.matrix[0][2].count).toBe(2);

      // Also test Lo Shu layout option
      const loShuGrid = calculateVedicGrid('1995-10-23', true, 'loshu');
      expect(loShuGrid.matrix[0][0].number).toBe(4);
      expect(loShuGrid.matrix[0][0].isPresent).toBe(false);
      expect(loShuGrid.matrix[0][1].number).toBe(9);
      expect(loShuGrid.matrix[0][1].count).toBe(2);
    });
  });

  describe('Vedic Yogas Detection', () => {
    it('detects full, partial, and inactive yogas', () => {
      const grid = calculateVedicGrid('1995-10-23', true);
      const { yogas, fullYogas, partialYogas } = detectYogas(grid);

      expect(yogas.length).toBe(8);

      // Will Power Plane: 9 - 5 - 1 -> all three present!
      const willPlane = yogas.find(y => y.id === 'will_plane');
      expect(willPlane).toBeDefined();
      expect(willPlane?.status).toBe('full');
      expect(willPlane?.percentage).toBe(100);
      expect(fullYogas.some(y => y.id === 'will_plane')).toBe(true);

      // Emotional plane: 3 - 5 - 7 -> 3 & 5 present, 7 missing -> partial
      const emotional = yogas.find(y => y.id === 'emotional_plane');
      expect(emotional?.status).toBe('partial');
      expect(partialYogas.some(y => y.id === 'emotional_plane')).toBe(true);
    });
  });

  describe('Number Relationships & Match Making', () => {
    it('identifies friendly and enemy numbers', () => {
      expect(getNumberRelationship(1, 9)).toBe('friendly'); // Sun & Mars
      expect(getNumberRelationship(1, 8)).toBe('enemy'); // Sun & Saturn
      expect(getNumberRelationship(5, 1)).toBe('friendly'); // Mercury & Sun
    });

    it('computes match making between boy and girl', () => {
      const result = calculateMatchMaking(
        { name: 'Rahul', dob: '1995-10-23' },
        { name: 'Priya', dob: '1997-06-15' }
      );

      expect(result.boy.mulank).toBe(5);
      expect(result.girl.mulank).toBe(6);
      expect(result.totalScore).toBeGreaterThanOrEqual(0);
      expect(result.totalScore).toBeLessThanOrEqual(100);
      expect(result.commonNumbers.length).toBeGreaterThan(0);
      expect(result.verdictEn).toBeDefined();
      expect(result.verdictHi).toBeDefined();
    });
  });

  describe('Dasha & Yearly Predictions', () => {
    it('computes personal year and dasha periods', () => {
      const py = calculatePersonalYear('1995-10-23', 2026);
      // Day 23 + Month 10 + Year 2026 = 23 + 10 + 2026 = 2059 -> 2+0+5+9 = 16 -> 7
      expect(py).toBe(7);

      const prediction = calculateYearlyPrediction('1995-10-23', 2026);
      expect(prediction.personalYear).toBe(7);
      expect(prediction.mahadasha).toBeDefined();
      expect(prediction.antardasha).toBeDefined();
      expect(prediction.pratyantraDasha).toBeDefined();
      expect(prediction.yearlyGrid.matrix.length).toBe(3);
    });
  });

  describe('Mobile Numerology & Security', () => {
    it('analyzes mobile total and pairs', () => {
      const res = analyzeMobileNumber('9876543210', 5);
      expect(res.cleanDigits.length).toBe(10);
      expect(res.reducedTotal).toBe(9); // 45 -> 9
      expect(res.pairs.length).toBe(9);
      expect(res.chargingDirectionEn).toBeDefined();
    });

    it('generates secure profession-based passwords and pins', () => {
      const pwd = generatePasswordByProfession('finance');
      expect(pwd.password.length).toBeGreaterThan(6);
      expect(pwd.profession).toBeDefined();

      const pin = generatePinByNumerology(4, 5);
      expect(pin.pin.length).toBe(4);
      expect(pin.reduced).toBe(5);
    });
  });

  describe('Specialized Modules (108 Meanings, Time, Vastu, Events)', () => {
    it('retrieves meaning for any number 1..108', () => {
      const m1 = getNumberMeaning(1);
      expect(m1.titleEn).toBe('The Crown of Creation');
      expect(m1.reduced).toBe(1);

      const m108 = getNumberMeaning(108);
      expect(m108.reduced).toBe(9);
      expect(m108.status).toBe('Highly Auspicious');
    });

    it('calculates time numerology hora', () => {
      const t = calculateTimeNumerology(14, 30);
      expect(t.totalReduced).toBe(8); // 14+30=44 -> 8
      expect(t.planetaryHourEn).toContain('Shani');
    });

    it('evaluates vastu directions from Lo Shu grid', () => {
      const vastu = calculateVastuNumerology('1995-10-23');
      expect(vastu.directions.length).toBe(9);
      expect(vastu.brahmasthanBalanceEn).toBeDefined();
    });

    it('evaluates life event predictions', () => {
      const events = calculateEventPredictions('1995-10-23');
      expect(events.events.length).toBeGreaterThanOrEqual(8);
      expect(events.wordOracleMap[1].en).toContain('Sankalpa');
    });
  });
});
