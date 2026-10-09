import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { calculateVedicGrid } from '../core/engine/grid';
import { yogStatus } from '../core/engine/yogas';
import yogsData from '../core/mocks/rules/yogs.json';
import remedyMapData from '../core/mocks/rules/remedy-map.json';

const ROOT = path.resolve(__dirname, '..');

describe('Yogas Page Redesign Guardrails & Logic', () => {
  const yogasPageSource = fs.readFileSync(
    path.join(ROOT, 'app/[locale]/yogas/page.tsx'),
    'utf8'
  );
  const yogsJsonContent = fs.readFileSync(
    path.join(ROOT, 'core/mocks/rules/yogs.json'),
    'utf8'
  );

  it('no <table> tag exists in yogas page source or markup', () => {
    expect(yogasPageSource.includes('<table')).toBe(false);
    expect(yogasPageSource.includes('</table>')).toBe(false);
    expect(yogasPageSource.includes('<tbody')).toBe(false);
    expect(yogasPageSource.includes('<thead')).toBe(false);
  });

  it('no "Plane" or "Cosmic Plane" or "तल" plane term appears anywhere in yogs.json or yogas page', () => {
    // Check case-insensitive "plane" in yogas page code
    const planeRegex = /\bplane\b|\bplanes\b|\bcosmic plane\b/i;
    expect(planeRegex.test(yogasPageSource)).toBe(false);

    // Check in yogs.json
    expect(planeRegex.test(yogsJsonContent)).toBe(false);
    expect(/ब्रह्मांडीय तल/.test(yogsJsonContent)).toBe(false);
    expect(/ज्ञान \/ विचार तल/.test(yogsJsonContent)).toBe(false);
  });

  it('number of rendered yog sections equals yogs.json length (never hardcoded 8)', () => {
    const totalYogsInJson = yogsData.yogas.length;
    expect(totalYogsInJson).toBeGreaterThanOrEqual(1);

    // Verify yogas page uses dynamic length
    expect(yogasPageSource).toContain('yogasList.map');
    expect(yogasPageSource).toContain('totalCount');
    expect(yogasPageSource).not.toMatch(/count:\s*8\b/);
  });

  it('each section maps its own grid with exactly its yog digits', () => {
    expect(yogasPageSource).toContain('yogDigits={yog.digits}');
    expect(yogasPageSource).toContain('size="sm"');
    expect(yogasPageSource).toContain('hideControls={true}');
    expect(yogasPageSource).toContain('hideStats={true}');

    for (const yog of yogsData.yogas) {
      expect(yog.digits).toHaveLength(3);
      expect(yog.digits.every((d: number) => d >= 1 && d <= 9)).toBe(true);
      expect(yog.prediction.formed.en.length).toBeGreaterThan(50);
      expect(yog.prediction.partial.en.length).toBeGreaterThan(50);
      expect(yog.prediction.inactive.en.length).toBeGreaterThan(50);
      expect(yog.tip.en.length).toBeGreaterThan(15);
      expect(yog.tip.hi.length).toBeGreaterThan(15);
    }
  });

  it('correctly calculates status for DOB 23-10-1995 (1995-10-23)', () => {
    const grid = calculateVedicGrid('1995-10-23', true);
    // Digits from 23-10-1995: 2, 3, 1, 1, 9, 9, 5; Driver 5, Conductor 3
    // Present: 1, 2, 3, 5, 9; Missing: 4, 6, 7, 8

    const mental = yogsData.yogas.find((y) => y.id === 'mental');
    expect(mental).toBeDefined();
    const mentalStatus = yogStatus(grid, mental!.digits as [number, number, number]);
    expect(mentalStatus.status).toBe('formed');
    expect(mentalStatus.count).toBe(3);
    expect(mentalStatus.missing).toEqual([]);

    const vision = yogsData.yogas.find((y) => y.id === 'vision');
    expect(vision).toBeDefined();
    const visionStatus = yogStatus(grid, vision!.digits as [number, number, number]);
    expect(visionStatus.status).toBe('partial');
    expect(visionStatus.count).toBe(2);
    expect(visionStatus.missing).toEqual([6]);

    const emotional = yogsData.yogas.find((y) => y.id === 'emotional');
    expect(emotional).toBeDefined();
    const emotionalStatus = yogStatus(grid, emotional!.digits as [number, number, number]);
    expect(emotionalStatus.status).toBe('inactive');
    expect(emotionalStatus.count).toBe(1); // 5 present, 6 & 7 missing
  });

  it('correctly detects multiple formed yogs for DOB 1974-03-29', () => {
    const grid = calculateVedicGrid('1974-03-29', true);
    // Digits: 1, 9, 7, 4, 3, 2, 9; Driver: 2, Conductor: 8
    // Present: 1, 2, 3, 4, 7, 8, 9; Missing: 5, 6

    const formedList = yogsData.yogas.filter((yog) => {
      const res = yogStatus(grid, yog.digits as [number, number, number]);
      return res.status === 'formed';
    });

    // Forms 5 full yogas: Mental (3-1-9), Willpower (1-7-8), Practical (2-8-4), Golden Rajayoga (3-7-4), Silver Rajayoga (9-7-2)
    expect(formedList.length).toBe(5);
    const formedIds = formedList.map((y) => y.id);
    expect(formedIds).toContain('mental');
    expect(formedIds).toContain('willpower');
    expect(formedIds).toContain('practical');
    expect(formedIds).toContain('rajayoga_golden');
    expect(formedIds).toContain('silver_rajayoga');
  });

  it('remedy-map.json maps all yog IDs and remedies link correctly to /remedies#<id>', () => {
    for (const yog of yogsData.yogas) {
      const remedies = (remedyMapData.yog as Record<string, Array<{ id: string; digit: number }>>)[yog.id];
      expect(remedies).toBeDefined();
      expect(remedies.length).toBe(3);
      for (const rem of remedies) {
        expect(rem.id.startsWith('rem_')).toBe(true);
        expect(yog.digits).toContain(rem.digit);
      }
    }
  });
});
