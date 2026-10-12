import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const DIRS_TO_CHECK = ['app', 'frontend'];

function getAllFiles(dir, extensions = ['.tsx', '.jsx']) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      if (file !== 'node_modules' && file !== '.next') {
        results = results.concat(getAllFiles(fullPath, extensions));
      }
    } else {
      if (extensions.some((ext) => file.endsWith(ext))) {
        results.push(fullPath);
      }
    }
  }
  return results;
}

let errors = [];

const files = DIRS_TO_CHECK.flatMap((d) => getAllFiles(path.join(ROOT, d)));

for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  const relPath = path.relative(ROOT, file);

  // Check 1: No flex-col on <button
  const buttonTags = content.match(/<button[\s\S]*?>/g) || [];
  for (const tag of buttonTags) {
    // Exclude VedicGrid matrix cell which is a 3x3 square matrix display cell
    if (relPath.includes('VedicGrid.tsx')) continue;

    if (tag.includes('flex-col')) {
      errors.push(`${relPath}: Button must never use flex-col layout -> "${tag.slice(0, 100)}..."`);
    }

    // Check for display: block on button className (not [&_svg]:block or responsive variants like md:block)
    const classMatch = tag.match(/className=["']([^"']+)["']/);
    if (classMatch) {
      const classes = classMatch[1].split(/\s+/);
      if (classes.includes('block')) {
        errors.push(`${relPath}: Button must not use block layout -> "${tag.slice(0, 100)}..."`);
      }
    }
  }

  // Check 2: No flex-col on <Button
  const ButtonTags = content.match(/<Button[\s\S]*?>/g) || [];
  for (const tag of ButtonTags) {
    if (tag.includes('flex-col')) {
      errors.push(`${relPath}: <Button> must never use flex-col layout -> "${tag.slice(0, 100)}..."`);
    }
  }
}

if (errors.length > 0) {
  console.error('\n❌ Button Layout Guardrail Violations Found:');
  for (const err of errors) {
    console.error(`  - ${err}`);
  }
  process.exit(1);
} else {
  console.log(`\n✅ Button guardrails passed: 0 flex-col/block button violations across ${files.length} files.`);
}
