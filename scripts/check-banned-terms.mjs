#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

export const BANNED_PATTERNS = [
  {
    name: 'Lo Shu family',
    regex: /lo\s*shu|loshu|lo-shu|lo_shu|luo\s*shu|luoshu|洛书|magic\s+square|ba\s*gua|bagua|लो\s*शू|लोशू|लो-शू|लोशु/i
  },
  {
    name: 'Chaldean family',
    regex: /chaldean|chaldaean|chaldian|cheiro|चाल्डियन|कैल्डियन|कल्डियन/i
  },
  {
    name: 'Pythagorean family',
    regex: /pythagor(ean|as|ian)|पायथागोरस|पाइथागोरस|पाइथागोरियन|पायथागोरियन/i
  }
];

const IGNORED_DIRS = new Set([
  '.git',
  '.next',
  'node_modules',
  '.gemini',
  'dist',
  'build',
  '.idea',
  '.vscode'
]);

function walk(dir) {
  let results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (IGNORED_DIRS.has(entry.name)) continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results = results.concat(walk(fullPath));
    } else {
      results.push(fullPath);
    }
  }
  return results;
}

export function scanRepository(rootDir = ROOT) {
  const allFiles = walk(rootDir);
  const matches = [];

  for (const filePath of allFiles) {
    const normalized = path.relative(rootDir, filePath).replace(/\\/g, '/');
    if (normalized === 'scripts/check-banned-terms.mjs' || normalized === 'tests/banned-terms.test.ts') {
      continue;
    }

    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const lines = content.split('\n');
      lines.forEach((line, idx) => {
        for (const pattern of BANNED_PATTERNS) {
          if (pattern.regex.test(line)) {
            matches.push({
              file: normalized,
              line: idx + 1,
              category: pattern.name,
              content: line.trim()
            });
          }
        }
      });
    } catch {
      // ignore unreadable/binary files
    }
  }

  return matches;
}

// When executed directly as CLI
if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(__filename)) {
  const matches = scanRepository();

  if (matches.length > 0) {
    console.error(`\n🚨 BANNED TERMS CHECK FAILED! Found ${matches.length} banned term occurrences:\n`);
    for (const m of matches) {
      console.error(`  ${m.file}:${m.line} [${m.category}] -> ${m.content}`);
    }
    console.error(`\nPlease purge all banned term occurrences and re-run.\n`);
    process.exit(1);
  } else {
    console.log(`✅ Banned terms check passed: 0 banned terms found in codebase.`);
    process.exit(0);
  }
}
