#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

// Tailwind default palette color classes
// (bg|text|border|from|to|via|ring|fill|stroke)-(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-NNN
export const PALETTE_REGEX = /\b(?:bg|text|border|from|to|via|ring|fill|stroke)-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d+\b/;

// bg-black / text-black
export const BLACK_REGEX = /\b(?:bg|text)-black\b/;

// dark: prefixes
export const DARK_REGEX = /\bdark:/;

// hex / rgb / hsl color literals
export const HEX_REGEX = /#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3,4})\b/;
export const RGB_REGEX = /\brgba?\s*\([^)]*\)/;
export const HSL_REGEX = /\bhsla?\s*\([^)]*\)/;

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

// Allowed file patterns for token definitions
function isAllowedFile(normalizedPath) {
  const base = path.basename(normalizedPath);
  if (base === 'globals.css') return true;
  if (base.startsWith('tailwind.config')) return true;
  return false;
}

const SCANNED_EXTENSIONS = new Set([
  '.tsx',
  '.ts',
  '.jsx',
  '.js',
  '.mjs',
  '.css',
  '.html'
]);

function walk(dir) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (IGNORED_DIRS.has(entry.name)) continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results = results.concat(walk(fullPath));
    } else {
      const ext = path.extname(entry.name).toLowerCase();
      if (SCANNED_EXTENSIONS.has(ext)) {
        results.push(fullPath);
      }
    }
  }
  return results;
}

export function scanColors(rootDir = ROOT) {
  // Scans /app, /components, /lib
  const targetDirs = ['app', 'components', 'lib'];
  const allFiles = [];

  for (const d of targetDirs) {
    const fullDir = path.join(rootDir, d);
    if (fs.existsSync(fullDir)) {
      allFiles.push(...walk(fullDir));
    }
  }

  const matches = [];

  for (const filePath of allFiles) {
    const normalized = path.relative(rootDir, filePath).replace(/\\/g, '/');
    if (isAllowedFile(normalized)) {
      continue;
    }

    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const lines = content.split('\n');

      lines.forEach((line, idx) => {
        const lineNum = idx + 1;
        const trimmed = line.trim();

        // 1. Check Tailwind palette colors
        const paletteMatch = line.match(PALETTE_REGEX);
        if (paletteMatch) {
          matches.push({
            file: normalized,
            line: lineNum,
            type: 'tailwind-palette',
            match: paletteMatch[0],
            content: trimmed
          });
          return;
        }

        // 2. Check bg-black / text-black
        const blackMatch = line.match(BLACK_REGEX);
        if (blackMatch) {
          matches.push({
            file: normalized,
            line: lineNum,
            type: 'black-class',
            match: blackMatch[0],
            content: trimmed
          });
          return;
        }

        // 3. Check dark: variants
        const darkMatch = line.match(DARK_REGEX);
        if (darkMatch) {
          matches.push({
            file: normalized,
            line: lineNum,
            type: 'dark-prefix',
            match: 'dark:',
            content: trimmed
          });
          return;
        }

        // 4. Check hex color literals
        const hexMatch = line.match(HEX_REGEX);
        if (hexMatch) {
          matches.push({
            file: normalized,
            line: lineNum,
            type: 'hex-literal',
            match: hexMatch[0],
            content: trimmed
          });
          return;
        }

        // 5. Check rgb / rgba literals
        const rgbMatch = line.match(RGB_REGEX);
        if (rgbMatch) {
          matches.push({
            file: normalized,
            line: lineNum,
            type: 'rgb-literal',
            match: rgbMatch[0],
            content: trimmed
          });
          return;
        }

        // 6. Check hsl / hsla literals
        const hslMatch = line.match(HSL_REGEX);
        if (hslMatch) {
          matches.push({
            file: normalized,
            line: lineNum,
            type: 'hsl-literal',
            match: hslMatch[0],
            content: trimmed
          });
          return;
        }
      });
    } catch {
      // ignore unreadable files
    }
  }

  return matches;
}

// When executed directly as CLI
if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(__filename)) {
  const matches = scanColors();

  if (matches.length > 0) {
    console.error(`\n🚨 COLOR GUARDRAIL FAILED! Found ${matches.length} illegal color or dark occurrences:\n`);
    for (const m of matches) {
      console.error(`  ${m.file}:${m.line} [${m.type}: ${m.match}] -> ${m.content}`);
    }
    console.error(`\nPlease replace all hardcoded colors, dark variants, and palette colors with semantic tokens.\n`);
    process.exit(1);
  } else {
    console.log(`✅ Color guardrail passed: 0 illegal colors or dark variants found in scanned directories.`);
    process.exit(0);
  }
}
