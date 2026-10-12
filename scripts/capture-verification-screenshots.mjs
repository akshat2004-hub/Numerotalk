import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const artifactDir = 'C:\\Users\\hp\\.gemini\\antigravity-ide\\brain\\d6ba26f8-6ca8-43bc-86d6-211e5ae9b846';

if (!fs.existsSync(artifactDir)) {
  fs.mkdirSync(artifactDir, { recursive: true });
}

async function capture(url, width, height, outputFile) {
  return new Promise((resolve, reject) => {
    const tempProfile = path.join(process.cwd(), 'temp-chrome-cap-' + Math.random().toString(36).substring(7));
    const args = [
      '--headless=new',
      '--disable-gpu',
      '--no-sandbox',
      `--user-data-dir=${tempProfile}`,
      `--window-size=${width},${height}`,
      `--screenshot=${outputFile}`,
      '--virtual-time-budget=6000',
      '--run-all-compositor-stages-before-draw',
      url
    ];

    const proc = spawn(chromePath, args);

    proc.on('close', (code) => {
      try {
        if (fs.existsSync(tempProfile)) {
          fs.rmSync(tempProfile, { recursive: true, force: true });
        }
      } catch {}

      if (fs.existsSync(outputFile)) {
        console.log(`✅ [${width}px] Captured ${url} -> ${path.basename(outputFile)} (${fs.statSync(outputFile).size} bytes)`);
        resolve(outputFile);
      } else {
        console.error(`❌ Failed to capture ${url} (exit code ${code})`);
        resolve(null);
      }
    });

    proc.on('error', (err) => {
      try {
        if (fs.existsSync(tempProfile)) {
          fs.rmSync(tempProfile, { recursive: true, force: true });
        }
      } catch {}
      reject(err);
    });
  });
}

async function main() {
  const views = [
    { name: '01_home_dashboard', path: '/' },
    { name: '02_vastu', path: '/vastu' },
    { name: '03_remedies', path: '/remedies' },
    { name: '04_matchmaking', path: '/match-making' },
    { name: '05_pin_password', path: '/pin-password' }
  ];

  for (const view of views) {
    // EN Desktop (1440) & Mobile (390)
    await capture(`http://localhost:3000/en${view.path}`, 1440, 900, path.join(artifactDir, `${view.name}_en_1440.png`));
    await capture(`http://localhost:3000/en${view.path}`, 390, 844, path.join(artifactDir, `${view.name}_en_390.png`));

    // HI Desktop (1440) & Mobile (390)
    await capture(`http://localhost:3000/hi${view.path}`, 1440, 900, path.join(artifactDir, `${view.name}_hi_1440.png`));
    await capture(`http://localhost:3000/hi${view.path}`, 390, 844, path.join(artifactDir, `${view.name}_hi_390.png`));
  }

  console.log(`\n🎉 All verification screenshots saved to ${artifactDir}`);
}

main().catch(console.error);
