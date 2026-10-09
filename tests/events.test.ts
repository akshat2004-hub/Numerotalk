import { describe, it, expect } from 'vitest';
import { eventScore, ALL_EVENTS, calculateAllEventScores } from '../lib/engine/events';
import { SAMPLE_PROFILES } from './fixtures/profiles';

describe('Life Events Engine (Module 16)', () => {
  it('has 14 configured events from rules/events.json', () => {
    expect(ALL_EVENTS.length).toBe(14);
    const eventIds = ALL_EVENTS.map(e => e.id);
    expect(eventIds).toContain('bacha');
    expect(eventIds).toContain('dhan_vikas');
    expect(eventIds).toContain('sarkari_naukri');
    expect(eventIds).toContain('year_before_birth');
    expect(eventIds).toContain('marriage_life');
    expect(eventIds).toContain('family_cooperation');
    expect(eventIds).toContain('affair');
    expect(eventIds).toContain('all_events_by_dob');
    expect(eventIds).toContain('word_number');
    expect(eventIds).toContain('health');
    expect(eventIds).toContain('tour_travel');
    expect(eventIds).toContain('marriage_love');
    expect(eventIds).toContain('money_purchase');
    expect(eventIds).toContain('business');
  });

  it('is deterministic: same input produces exact same output', () => {
    const profile = SAMPLE_PROFILES[0];
    const event = ALL_EVENTS[0];
    const res1 = eventScore(event, profile, 2026);
    const res2 = eventScore(event, profile, 2026);

    expect(res1.score).toBe(res2.score);
    expect(res1.level).toBe(res2.level);
    expect(res1.reasons).toEqual(res2.reasons);
    expect(res1.favourableYears).toEqual(res2.favourableYears);
  });

  it('correctly maps level thresholds: <40 Low, 40-70 Medium, >70 High', () => {
    for (const profile of SAMPLE_PROFILES) {
      const { scores } = calculateAllEventScores(profile, 2026);
      for (const res of scores) {
        expect(res.score).toBeGreaterThanOrEqual(0);
        expect(res.score).toBeLessThanOrEqual(100);

        if (res.score < 40) {
          expect(res.level).toBe('Low');
          expect(res.levelHi).toBe('निम्न');
        } else if (res.score > 70) {
          expect(res.level).toBe('High');
          expect(res.levelHi).toBe('उच्च');
        } else {
          expect(res.level).toBe('Medium');
          expect(res.levelHi).toBe('मध्यम');
        }

        // Reasons array should not be empty
        expect(res.reasons.length).toBeGreaterThan(0);
      }
    }
  });

  it('auto-aggregates deduplicated top remedies from weakest 3 events', () => {
    const profile = SAMPLE_PROFILES[1];
    const { weakest, topRemedies } = calculateAllEventScores(profile, 2026);

    expect(weakest.length).toBe(3);
    expect(topRemedies.length).toBeGreaterThan(0);
    // Ensure uniqueness
    const uniqueSet = new Set(topRemedies);
    expect(uniqueSet.size).toBe(topRemedies.length);
  });
});
