import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const artifactDir = 'C:\\Users\\hp\\.gemini\\antigravity-ide\\brain\\685c92a8-119f-4a9f-a03a-32edac3467e1';

async function capture(url, width, height, outputFile) {
  return new Promise((resolve, reject) => {
    const tempProfile = path.join(process.cwd(), 'temp-chrome-profile');
    const args = [
      '--headless=new',
      '--disable-gpu',
      '--no-sandbox',
      `--user-data-dir=${tempProfile}`,
      `--window-size=${width},${height}`,
      `--screenshot=${outputFile}`,
      '--virtual-time-budget=8000',
      '--run-all-compositor-stages-before-draw',
      url
    ];

    console.log(`Capturing ${url} at ${width}x${height} -> ${outputFile}`);
    const proc = spawn(chromePath, args);

    proc.stdout.on('data', (d) => console.log(d.toString()));
    proc.stderr.on('data', (d) => console.error(d.toString()));

    proc.on('close', (code) => {
      if (fs.existsSync(outputFile)) {
        console.log(`✅ Screenshot saved: ${outputFile} (${fs.statSync(outputFile).size} bytes)`);
        resolve(outputFile);
      } else {
        console.error(`❌ Screenshot not found: ${outputFile} (exit code ${code})`);
        resolve(null);
      }
    });

    proc.on('error', (err) => {
      console.error('Process error:', err);
      reject(err);
    });
  });
}

async function main() {
  const targets = [
    { url: 'http://localhost:3000/en/yogas', width: 1440, height: 900, file: path.join(artifactDir, 'yogas_en_1440.png') },
    { url: 'http://localhost:3000/en/yogas', width: 390, height: 844, file: path.join(artifactDir, 'yogas_en_390.png') },
    { url: 'http://localhost:3000/hi/yogas', width: 1440, height: 900, file: path.join(artifactDir, 'yogas_hi_1440.png') },
    { url: 'http://localhost:3000/hi/yogas', width: 390, height: 844, file: path.join(artifactDir, 'yogas_hi_390.png') },
  ];

  for (const t of targets) {
    await capture(t.url, t.width, t.height, t.file);
  }

  // Cleanup temp profile directory
  const tempProfile = path.join(process.cwd(), 'temp-chrome-profile');
  if (fs.existsSync(tempProfile)) {
    try {
      fs.rmSync(tempProfile, { recursive: true, force: true });
    } catch {}
  }
}

main().catch(console.error);
