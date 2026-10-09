import { describe, it, expect } from 'vitest';
import {
  calculateMulank,
  calculateBhagyank,
  calculateDestinyNumber,
  nameNumber,
  suggestNameVariants,
  reduceToSingleDigit,
  parseDob
} from '../core/engine/numerology';
import { calculateVedicGrid, VEDIC_INDIAN_LAYOUT } from '../core/engine/grid';
import { detectYogas } from '../core/engine/yogas';
import { getNumberRelationship, calculateMatchMaking, matchScore } from '../core/engine/compatibility';
import { calculateYearlyPrediction, calculatePersonalYear } from '../core/engine/dasha';
import { analyzeMobileNumber } from '../core/engine/mobile';
import { transliterateDevanagari } from '../core/engine/transliteration';
import { getNumberMeaning } from '../core/engine/meanings108';
import { calculateTimeNumerology } from '../core/engine/timeNumerology';
import { calculateVastuNumerology } from '../core/engine/vastu';
import { calculateEventPredictions } from '../core/engine/events';
import {
  generateSecurePin,
  generateSecurePassword
} from '../core/engine/security';
import { recommendProfessions, evaluateSingleProfession } from '../core/engine/profession';

import React from 'react';
import { renderToString } from 'react-dom/server';
import { CompoundNumber } from '../frontend/components/ui/CompoundNumber';

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

    it('calculates Mulank (Driver Number) accurately with compound & reduced', () => {
      // 23rd -> 2 + 3 = 5
      const res1 = calculateMulank('1995-10-23');
      expect(res1.mulank).toBe(5);
      expect(res1.dayNumber).toBe(23);
      expect(res1.compound).toBe(23);
      expect(res1.reduced).toBe(5);

      // 29th -> 2 + 9 = 11 -> 1 + 1 = 2
      const res2 = calculateMulank('1990-08-29');
      expect(res2.mulank).toBe(2);
      expect(res2.compound).toBe(29);
      expect(res2.reduced).toBe(2);

      // 7th -> single digit 7
      const res3 = calculateMulank('2001-01-07');
      expect(res3.mulank).toBe(7);
      expect(res3.compound).toBe(7);
      expect(res3.reduced).toBe(7);
    });

    it('compound(23-10-1995) returns { compound, reduced } and the rendered UI contains no "/" between the two numbers', () => {
      const res = calculateMulank('1995-10-23');
      expect(res.compound).toBe(23);
      expect(res.reduced).toBe(5);
      expect(res.mulank).toBe(5);

      const html = renderToString(React.createElement(CompoundNumber, { compound: res.compound, reduced: res.reduced }));
      // Extract text content from the rendered HTML
      const textContent = html.replace(/<[^>]*>/g, '');
      expect(textContent).toContain('23');
      expect(textContent).toContain('5');
      expect(textContent).not.toContain('/');
    });

    it('calculates Bhagyank (Conductor Number / Life Path) accurately', () => {
      // 1995-10-23: digits 2,3,1,0,1,9,9,5 -> sum = 30 -> 3+0 = 3
      const res = calculateBhagyank('1995-10-23');
      expect(res.rawSum).toBe(30);
      expect(res.bhagyank).toBe(3);
      expect(res.compound).toBe(30);
      expect(res.reduced).toBe(3);
    });

    it('reduces multi-digit numbers to single digit', () => {
      expect(reduceToSingleDigit(99)).toBe(9); // 9+9=18 -> 1+8=9
      expect(reduceToSingleDigit(55)).toBe(1); // 5+5=10 -> 1+0=1
      expect(reduceToSingleDigit(7)).toBe(7);
    });
  });

  describe('Name & Destiny Calculations with Transliteration', () => {
    it('nameNumber("RAHUL SHARMA") -> words RAHUL = 17 -> 8, SHARMA = 16 -> 7, compound 33, reduced 6', () => {
      const res = nameNumber('RAHUL SHARMA');
      expect(res.words.length).toBe(2);

      const rahul = res.words[0];
      expect(rahul.word).toBe('RAHUL');
      expect(rahul.subtotal).toBe(17);
      expect(rahul.reduced).toBe(8);

      const sharma = res.words[1];
      expect(sharma.word).toBe('SHARMA');
      expect(sharma.subtotal).toBe(16);
      expect(sharma.reduced).toBe(7);

      expect(res.compound).toBe(33);
      expect(res.reduced).toBe(6);
    });

    it('calculates nameNumber for two more names accurately', () => {
      // 1. "ABHISHEK VERMA"
      const res1 = nameNumber('ABHISHEK VERMA');
      expect(res1.words[0].word).toBe('ABHISHEK');
      expect(res1.words[0].subtotal).toBe(24);
      expect(res1.words[0].reduced).toBe(6);
      expect(res1.words[1].word).toBe('VERMA');
      expect(res1.words[1].subtotal).toBe(18);
      expect(res1.words[1].reduced).toBe(9);
      expect(res1.compound).toBe(42);
      expect(res1.reduced).toBe(6);

      // 2. "AMIT KUMAR"
      const res2 = nameNumber('AMIT KUMAR');
      expect(res2.words[0].word).toBe('AMIT');
      expect(res2.words[0].subtotal).toBe(10);
      expect(res2.words[0].reduced).toBe(1);
      expect(res2.words[1].word).toBe('KUMAR');
      expect(res2.words[1].subtotal).toBe(15);
      expect(res2.words[1].reduced).toBe(6);
      expect(res2.compound).toBe(25);
      expect(res2.reduced).toBe(7);
    });

    it('suggestNameVariants returns only variants friendly with both birth numbers', () => {
      // Profile with DOB 1995-10-23: Mulank 5, Bhagyank 3
      const profile = { dob: '1995-10-23', mulank: 5, bhagyank: 3 };
      const suggestions = suggestNameVariants('Rahul Sharma', profile);

      expect(suggestions.length).toBeGreaterThan(0);
      expect(suggestions.length).toBeLessThanOrEqual(5);

      for (const sug of suggestions) {
        expect(sug.harmonyMulank).toBe('friendly');
        expect(sug.harmonyBhagyank).toBe('friendly');
        expect(sug.changeMade).toBeDefined();
        expect(sug.suggestedName).not.toBe('Rahul Sharma');
      }
    });

    it('UI renders no "/" between compound and reduced for name number', () => {
      const res = nameNumber('RAHUL SHARMA');
      const html = renderToString(React.createElement(CompoundNumber, { compound: res.compound, reduced: res.reduced }));
      const textContent = html.replace(/<[^>]*>/g, '');
      expect(textContent).toContain('33');
      expect(textContent).toContain('6');
      expect(textContent).not.toContain('/');
    });

    it('transliterates Devanagari "राहुल" and computes same destiny', () => {
      const translit = transliterateDevanagari('राहुल');
      expect(translit.isDevanagari).toBe(true);
      expect(translit.transliterated).toBe('RAHUL');

      const res = calculateDestinyNumber('राहुल');
      expect(res.transliteratedName).toBe('RAHUL');
      expect(res.destinyNumber).toBe(8);
    });
  });

  describe('Indian Vedic 3x3 Grid', () => {
    it('generates 3x3 layout with correct coordinates', () => {
      expect(VEDIC_INDIAN_LAYOUT).toEqual([
        [3, 1, 9],
        [6, 7, 5],
        [2, 8, 4]
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

      expect(grid.matrix[1][0].number).toBe(6);
      expect(grid.matrix[1][0].isPresent).toBe(false);
      expect(grid.matrix[1][1].number).toBe(7);
      expect(grid.matrix[1][1].isPresent).toBe(false);
      expect(grid.matrix[1][2].number).toBe(5);
      expect(grid.matrix[1][2].count).toBe(2);

      expect(grid.matrix[2][0].number).toBe(2);
      expect(grid.matrix[2][0].isPresent).toBe(true);
      expect(grid.matrix[2][1].number).toBe(8);
      expect(grid.matrix[2][1].isPresent).toBe(false);
      expect(grid.matrix[2][2].number).toBe(4);
      expect(grid.matrix[2][2].isPresent).toBe(false);
    });
  });

  describe('Vedic Yogas Detection', () => {
    it('detects full, partial, and inactive yogas', () => {
      const grid = calculateVedicGrid('1995-10-23', true);
      const { yogas, fullYogas, partialYogas } = detectYogas(grid);

      expect(yogas.length).toBe(8);

      // Mental Plane: 3 - 1 - 9 -> all three present!
      const mentalPlane = yogas.find(y => y.id === 'mental_plane');
      expect(mentalPlane).toBeDefined();
      expect(mentalPlane?.status).toBe('full');
      expect(mentalPlane?.percentage).toBe(100);
      expect(fullYogas.some(y => y.id === 'mental_plane')).toBe(true);

      // Thought plane: 3 - 6 - 2 -> 3 & 2 present, 6 missing -> partial
      const thoughtPlane = yogas.find(y => y.id === 'thought_plane');
      expect(thoughtPlane?.status).toBe('partial');
      expect(partialYogas.some(y => y.id === 'thought_plane')).toBe(true);
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

    it('computes matchScore for 3 distinct couples across 5 pillars, exchangeable, common, and tiers', () => {
      const couple1 = matchScore(
        { name: 'Rahul Sharma', dob: '1995-10-23' },
        { name: 'Priya Patel', dob: '1997-06-15' }
      );
      expect(couple1.pillars.length).toBe(5);
      expect(couple1.total).toBeGreaterThanOrEqual(0);
      expect(couple1.total).toBeLessThanOrEqual(100);
      expect(couple1.tier).toBeDefined();
      expect(couple1.pillars.map((p) => p.id)).toEqual([
        'driver',
        'lifepath',
        'destiny',
        'exchangeable',
        'common'
      ]);
      expect(couple1.exchangeable.exchange1.boyNumber).toBe(couple1.pillars[0].boyNumber);
      expect(couple1.common.commonNumbers).toBeDefined();
      expect(couple1.missingInBoth).toBeDefined();

      const couple2 = matchScore(
        { name: 'Amit Verma', dob: '1990-01-01' },
        { name: 'Sneha Singh', dob: '1992-04-04' }
      );
      expect(couple2.pillars.length).toBe(5);
      expect(couple2.total).toBeGreaterThanOrEqual(0);
      expect(couple2.total).toBeLessThanOrEqual(100);
      expect(['Excellent', 'Good', 'Moderate', 'Needs care']).toContain(couple2.tier);

      const couple3 = matchScore(
        { name: 'Vikram Malhotra', dob: '1988-12-09' },
        { name: 'Ananya Das', dob: '1994-03-27' }
      );
      expect(couple3.pillars.length).toBe(5);
      expect(couple3.total).toBeGreaterThanOrEqual(0);
      expect(couple3.total).toBeLessThanOrEqual(100);
      expect(couple3.summaryEn).toBeDefined();
      expect(couple3.summaryHi).toBeDefined();
      expect(couple3.topStrengthsEn.length).toBeGreaterThanOrEqual(2);
      expect(couple3.topCautionsEn.length).toBeGreaterThanOrEqual(2);
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
      expect(res.compound).toBe(45);
      expect(res.reduced).toBe(9);
      expect(res.pairs.length).toBe(9);
      expect(res.chargingDirectionEn).toBeDefined();
    });

    it('generates secure profession-based passwords and pins with lucky digit sum reduction constraint', () => {
      // PIN 4-digit constraint to lucky sum 5
      const pin4 = generateSecurePin(4, 5);
      expect(pin4.pin.length).toBe(4);
      expect(reduceToSingleDigit(pin4.sum)).toBe(5);
      expect(pin4.reduced).toBe(5);

      // PIN 6-digit constraint to lucky sum 8
      const pin6 = generateSecurePin(6, 8);
      expect(pin6.pin.length).toBe(6);
      expect(reduceToSingleDigit(pin6.sum)).toBe(8);
      expect(pin6.reduced).toBe(8);

      // Password with lengths 8, 14, 20
      const pwd8 = generateSecurePassword({ length: 8, includeUppercase: true, includeSymbols: true, targetLuckyNumber: 3 });
      expect(pwd8.password.length).toBe(8);
      expect(pwd8.reduced).toBe(3);

      const pwd14 = generateSecurePassword({ length: 14, includeUppercase: false, includeSymbols: true, targetLuckyNumber: 6 });
      expect(pwd14.password.length).toBe(14);
      expect(pwd14.reduced).toBe(6);
      expect(/[A-Z]/.test(pwd14.password)).toBe(false);

      const pwd20 = generateSecurePassword({ length: 20, includeUppercase: true, includeSymbols: false, targetLuckyNumber: 1 });
      expect(pwd20.password.length).toBe(20);
      expect(pwd20.reduced).toBe(1);
    });
  });

  describe('Profession Recommendation Engine', () => {
    it('recommends top 3 ranked professions for profile with birth time', () => {
      const profile = {
        name: 'Rahul Sharma',
        dob: '1995-10-23',
        birthTime: '10:30'
      };
      const recs = recommendProfessions(profile, 3);
      expect(recs.length).toBe(3);
      expect(recs[0].score).toBeGreaterThanOrEqual(recs[1].score);
      expect(recs[1].score).toBeGreaterThanOrEqual(recs[2].score);
      expect(recs[0].reasonsEn.length).toBeGreaterThanOrEqual(2);
      expect(recs[0].reasonsHi.length).toBeGreaterThanOrEqual(2);
      expect(recs[0].luckyWorkNumbers.length).toBeGreaterThan(0);
    });

    it('recommends professions deterministically for profile without birth time', () => {
      const profileNoTime = {
        name: 'Priya Patel',
        dob: '1997-06-15',
        birthTime: ''
      };
      const recs = recommendProfessions(profileNoTime, 3);
      expect(recs.length).toBe(3);
      expect(recs[0].score).toBeGreaterThan(50);
      expect(recs[0].reasonsEn[0]).toBeDefined();
    });

    it('evaluates another single profession against profile', () => {
      const profile = {
        name: 'Amit Verma',
        dob: '1990-01-01',
        birthTime: '14:15'
      };
      const evaluated = evaluateSingleProfession('investment_banker', profile);
      expect(evaluated).not.toBeNull();
      expect(evaluated?.profession.id).toBe('investment_banker');
      expect(evaluated?.score).toBeGreaterThanOrEqual(50);
      expect(evaluated?.score).toBeLessThanOrEqual(100);
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

    it('evaluates vastu directions from Vedic grid', () => {
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
