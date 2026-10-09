import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { scanRepository, BANNED_PATTERNS } from '../scripts/check-banned-terms.mjs';

const ROOT = path.resolve(__dirname, '..');

const ALL_PAGE_ROUTES = [
  '',
  'combination',
  'destiny',
  'events',
  'help',
  'match-making',
  'missing',
  'mobile',
  'name',
  'number',
  'pin-password',
  'profession',
  'remedies',
  'repeating',
  'report',
  'time',
  'user-detail',
  'vastu',
  'yearly',
  'yogas'
];

describe('PURGE PASS: Banned Terms Guardrail', () => {
  it('repository scanner finds ZERO matches for any banned term or variant', () => {
    const matches = scanRepository(ROOT);
    if (matches.length > 0) {
      console.error('Found banned terms:', matches);
    }
    expect(matches).toEqual([]);
  });

  it('localization files (en.json, hi.json) contain ZERO banned terms', () => {
    const en = fs.readFileSync(path.join(ROOT, 'messages/en.json'), 'utf8');
    const hi = fs.readFileSync(path.join(ROOT, 'messages/hi.json'), 'utf8');

    for (const pattern of BANNED_PATTERNS) {
      expect(pattern.regex.test(en)).toBe(false);
      expect(pattern.regex.test(hi)).toBe(false);
    }
  });

  it('all 20 page files across app/[locale] have zero banned terms in code, metadata, alt text, or aria-labels', () => {
    const localeDir = path.join(ROOT, 'app/[locale]');
    for (const route of ALL_PAGE_ROUTES) {
      const pageFile = route === '' ? path.join(localeDir, 'page.tsx') : path.join(localeDir, route, 'page.tsx');
      expect(fs.existsSync(pageFile)).toBe(true);
      const code = fs.readFileSync(pageFile, 'utf8');
      for (const pattern of BANNED_PATTERNS) {
        const matches = code.match(pattern.regex);
        expect(matches, `Found banned term in ${pageFile}: ${matches}`).toBeNull();
      }
    }
  });

  it('PDF report generator code and strings contain zero banned terms', () => {
    const reportPage = fs.readFileSync(path.join(ROOT, 'app/[locale]/report/page.tsx'), 'utf8');
    for (const pattern of BANNED_PATTERNS) {
      expect(pattern.regex.test(reportPage)).toBe(false);
    }
  });

  it('all live server routes (EN & HI) contain zero banned terms in HTML, title, meta, alt, aria-label', async () => {
    // If the dev server is active, test live HTML responses
    const isServerUp = await fetch('http://localhost:3000/en')
      .then(res => res.status === 200)
      .catch(() => false);

    if (!isServerUp) {
      // If server is not running during CI test run, skip live fetch (static checks pass above)
      return;
    }

    for (const locale of ['en', 'hi']) {
      for (const route of ALL_PAGE_ROUTES) {
        const url = `http://localhost:3000/${locale}${route ? `/${route}` : ''}`;
        const res = await fetch(url);
        expect(res.status).toBe(200);
        const html = await res.text();

        // 1. Check full rendered page HTML
        for (const pattern of BANNED_PATTERNS) {
          const match = html.match(pattern.regex);
          expect(match, `Banned term found on ${url}: ${match}`).toBeNull();
        }

        // 2. Check title tags
        const titleMatch = html.match(/<title[^>]*>(.*?)<\/title>/i);
        if (titleMatch) {
          for (const pattern of BANNED_PATTERNS) {
            expect(pattern.regex.test(titleMatch[1])).toBe(false);
          }
        }

        // 3. Check meta tags
        const metaMatches = html.matchAll(/<meta[^>]+content=["']([^"']+)["'][^>]*>/gi);
        for (const m of metaMatches) {
          for (const pattern of BANNED_PATTERNS) {
            expect(pattern.regex.test(m[1])).toBe(false);
          }
        }

        // 4. Check aria-labels
        const ariaMatches = html.matchAll(/aria-label=["']([^"']+)["']/gi);
        for (const m of ariaMatches) {
          for (const pattern of BANNED_PATTERNS) {
            expect(pattern.regex.test(m[1])).toBe(false);
          }
        }

        // 5. Check alt text
        const altMatches = html.matchAll(/alt=["']([^"']+)["']/gi);
        for (const m of altMatches) {
          for (const pattern of BANNED_PATTERNS) {
            expect(pattern.regex.test(m[1])).toBe(false);
          }
        }
      }
    }
  }, 120000);
});
