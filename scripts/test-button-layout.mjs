import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 9223;
const BASE_URL = 'http://localhost:3000';

const PAGES = [
  '/',
  '/destiny',
  '/yogas',
  '/remedies',
  '/name',
  '/mobile',
  '/vastu',
  '/match-making',
  '/yearly',
  '/events',
  '/pin-password',
  '/time',
  '/profession',
  '/number',
  '/report',
  '/combination',
  '/missing',
  '/repeating',
  '/help'
];

const LOCALES = ['en', 'hi'];
const VIEWPORTS = [
  { width: 1440, height: 900, name: 'desktop' },
  { width: 390, height: 844, name: 'mobile' }
];

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function getWsUrl() {
  for (let i = 0; i < 20; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${PORT}/json/list`);
      if (res.ok) {
        const data = await res.json();
        const page = data.find((d) => d.type === 'page') || data[0];
        if (page && page.webSocketDebuggerUrl) {
          return page.webSocketDebuggerUrl;
        }
      }
    } catch (e) {}
    await sleep(250);
  }
  throw new Error('Chrome remote debugging did not become ready');
}

class CDPClient {
  constructor(wsUrl) {
    this.wsUrl = wsUrl;
    this.id = 1;
    this.callbacks = new Map();
  }

  async connect() {
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(this.wsUrl);
      this.ws.onopen = () => resolve();
      this.ws.onerror = (e) => reject(e);
      this.ws.onmessage = (msg) => {
        const data = JSON.parse(msg.data);
        if (data.id && this.callbacks.has(data.id)) {
          const { res, rej } = this.callbacks.get(data.id);
          this.callbacks.delete(data.id);
          if (data.error) rej(data.error);
          else res(data.result);
        }
      };
    });
  }

  send(method, params = {}) {
    const id = this.id++;
    return new Promise((res, rej) => {
      this.callbacks.set(id, { res, rej });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  close() {
    if (this.ws) this.ws.close();
  }
}

async function run() {
  const tempProfile = path.join(process.cwd(), 'temp-chrome-test');
  if (fs.existsSync(tempProfile)) {
    try { fs.rmSync(tempProfile, { recursive: true, force: true }); } catch {}
  }

  const chromeProc = spawn(chromePath, [
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${tempProfile}`
  ]);

  try {
    const wsUrl = await getWsUrl();
    const cdp = new CDPClient(wsUrl);
    await cdp.connect();
    await cdp.send('Page.enable');
    await cdp.send('Runtime.enable');

    console.log(`\n🚀 Testing button layouts across ${PAGES.length} pages in EN & HI at 1440px and 390px...`);

    let totalButtonsChecked = 0;
    let issues = [];

    for (const locale of LOCALES) {
      for (const vp of VIEWPORTS) {
        await cdp.send('Emulation.setDeviceMetricsOverride', {
          width: vp.width,
          height: vp.height,
          deviceScaleFactor: 1,
          mobile: vp.name === 'mobile'
        });

        for (const pagePath of PAGES) {
          const url = `${BASE_URL}/${locale}${pagePath === '/' ? '' : pagePath}`;
          await cdp.send('Page.navigate', { url });
          await sleep(600); // Wait for page hydration & render

          // Evaluate layout inspection
          const evalResult = await cdp.send('Runtime.evaluate', {
            expression: `
              (() => {
                const buttons = Array.from(document.querySelectorAll('button, [role="button"]'));
                const results = [];

                for (const btn of buttons) {
                  // Skip hidden buttons or grid matrix cells
                  if (btn.offsetParent === null) continue;
                  if (btn.classList.contains('aspect-square')) continue; // VedicGrid cells

                  const rect = btn.getBoundingClientRect();
                  if (rect.width === 0 || rect.height === 0) continue;

                  const text = (btn.innerText || btn.textContent || '').trim();
                  const svg = btn.querySelector('svg');
                  const labelSpan = btn.querySelector('span:not(:empty)') || btn;

                  // 1. Check label line height vs offsetHeight (no text wrapping)
                  const spanStyle = window.getComputedStyle(labelSpan);
                  const computedLineHeight = parseFloat(spanStyle.lineHeight) || parseFloat(spanStyle.fontSize) * 1.2 || 16;
                  const isMultiline = labelSpan.offsetHeight > 1.5 * computedLineHeight;

                  // 2. Vertical centering check if both icon and text present
                  let verticalMisaligned = false;
                  let diff = 0;
                  if (svg && text.length > 0 && labelSpan !== btn) {
                    const svgRect = svg.getBoundingClientRect();
                    const spanRect = labelSpan.getBoundingClientRect();
                    const svgCenter = svgRect.top + svgRect.height / 2;
                    const spanCenter = spanRect.top + spanRect.height / 2;
                    diff = Math.abs(svgCenter - spanCenter);
                    if (diff > 3.5) {
                      verticalMisaligned = true;
                    }
                  }

                  // 3. Overflow check within container
                  const parent = btn.parentElement;
                  const parentWidth = parent ? parent.clientWidth : window.innerWidth;
                  const overflows = btn.offsetWidth > parentWidth + 4;

                  results.push({
                    text: text.slice(0, 30),
                    isMultiline,
                    verticalMisaligned,
                    diff: Math.round(diff * 10) / 10,
                    overflows,
                    width: Math.round(btn.offsetWidth),
                    parentWidth: Math.round(parentWidth)
                  });
                }
                return results;
              })()
            `,
            returnByValue: true
          });

          const results = evalResult.result.value || [];
          totalButtonsChecked += results.length;

          for (const item of results) {
            if (item.isMultiline) {
              issues.push(`[${locale}][${vp.name}][${pagePath}] "${item.text}": Label text wrapped into multiple lines`);
            }
            if (item.verticalMisaligned) {
              issues.push(`[${locale}][${vp.name}][${pagePath}] "${item.text}": Icon and label vertical center offset is ${item.diff}px (> 3px)`);
            }
            if (item.overflows) {
              issues.push(`[${locale}][${vp.name}][${pagePath}] "${item.text}": Button width (${item.width}px) overflows container (${item.parentWidth}px)`);
            }
          }
        }
      }
    }

    cdp.close();

    console.log(`\nChecked ${totalButtonsChecked} buttons across all views.`);
    if (issues.length > 0) {
      console.error(`\n❌ Found ${issues.length} button layout issues:`);
      for (const iss of issues.slice(0, 20)) {
        console.error(`  - ${iss}`);
      }
      if (issues.length > 20) {
        console.error(`  ... and ${issues.length - 20} more`);
      }
      process.exit(1);
    } else {
      console.log(`\n✅ PERFECT! All buttons pass guardrails:`);
      console.log(`  - 100% single line labels`);
      console.log(`  - Perfect icon & text vertical centering (diff <= 3px)`);
      console.log(`  - Zero container horizontal overflows`);
    }
  } finally {
    chromeProc.kill();
    try { fs.rmSync(tempProfile, { recursive: true, force: true }); } catch {}
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
