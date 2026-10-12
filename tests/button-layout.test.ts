import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Button Layout & Guardrails', () => {
  it('should verify Button component enforces flex-row and whitespace-nowrap', () => {
    const buttonFile = path.resolve(__dirname, '../frontend/components/ui/Button.tsx');
    const content = fs.readFileSync(buttonFile, 'utf8');

    expect(content).toContain('inline-flex flex-row items-center justify-center');
    expect(content).toContain('whitespace-nowrap');
    expect(content).toContain('rounded-[12px]');
    expect(content).toContain('leading-none');
    expect(content).not.toContain('flex-col');
  });

  it('should verify globals.css has global button whitespace-nowrap and svg block shrink-0 rules', () => {
    const cssFile = path.resolve(__dirname, '../app/globals.css');
    const content = fs.readFileSync(cssFile, 'utf8');

    expect(content).toContain('button, [role="button"]');
    expect(content).toContain('white-space: nowrap');
    expect(content).toContain('display: block');
    expect(content).toContain('flex-shrink: 0');
  });

  it('should verify all tsx files pass button guardrails (no flex-col or block buttons)', () => {
    const root = path.resolve(__dirname, '..');
    const dirs = ['app', 'frontend'];

    function getAllFiles(dir: string): string[] {
      let results: string[] = [];
      if (!fs.existsSync(dir)) return results;
      const list = fs.readdirSync(dir);
      for (const file of list) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
          if (file !== 'node_modules' && file !== '.next') {
            results = results.concat(getAllFiles(fullPath));
          }
        } else if (file.endsWith('.tsx')) {
          results.push(fullPath);
        }
      }
      return results;
    }

    const files = dirs.flatMap((d) => getAllFiles(path.join(root, d)));
    const errors: string[] = [];

    for (const file of files) {
      const relPath = path.relative(root, file);
      if (relPath.includes('VedicGrid.tsx')) continue; // 3x3 matrix cells

      const content = fs.readFileSync(file, 'utf8');
      const buttonTags = content.match(/<button[\s\S]*?>/g) || [];
      for (const tag of buttonTags) {
        if (tag.includes('flex-col')) {
          errors.push(`${relPath}: Button with flex-col: ${tag.slice(0, 80)}`);
        }
        const classMatch = tag.match(/className=["']([^"']+)["']/);
        if (classMatch) {
          const classes = classMatch[1].split(/\s+/);
          if (classes.includes('block')) {
            errors.push(`${relPath}: Button with block: ${tag.slice(0, 80)}`);
          }
        }
      }

      const ButtonTags = content.match(/<Button[\s\S]*?>/g) || [];
      for (const tag of ButtonTags) {
        if (tag.includes('flex-col')) {
          errors.push(`${relPath}: <Button> with flex-col: ${tag.slice(0, 80)}`);
        }
      }
    }

    expect(errors).toEqual([]);
  });
});
