// Smoke test: opens the built playground (dist/test.html) in headless Chromium, visits components,
// reports page errors and saves screenshots to dist/shots/.
//   node scripts/check.mjs                  all components, errors only
//   node scripts/check.mjs Button TabMenu   only these, with screenshots on Prime and Noir
//   node scripts/check.mjs --all --shots    every component, with screenshots
// Chromium: CHROMIUM_PATH, else the newest Playwright download in ~/Library/Caches/ms-playwright
// (or ~/.cache/ms-playwright), else an installed Google Chrome.
import fs from 'fs';
import os from 'os';
import path from 'path';
import { chromium } from 'playwright-core';
import { PLAYGROUND } from '../paths.mjs';

function findChromium() {
  if (process.env.CHROMIUM_PATH) return { executablePath: process.env.CHROMIUM_PATH };
  for (const cache of [path.join(os.homedir(), 'Library/Caches/ms-playwright'), path.join(os.homedir(), '.cache/ms-playwright')]) {
    if (!fs.existsSync(cache)) continue;
    const dirs = fs.readdirSync(cache).filter(d => /^chromium-\d+$/.test(d)).sort((a, b) => +b.split('-')[1] - +a.split('-')[1]);
    for (const d of dirs) {
      for (const rel of ['chrome-mac/Chromium.app/Contents/MacOS/Chromium', 'chrome-mac-arm64/Chromium.app/Contents/MacOS/Chromium', 'chrome-linux/chrome']) {
        const p = path.join(cache, d, rel);
        if (fs.existsSync(p)) return { executablePath: p };
      }
    }
  }
  return { channel: 'chrome' };
}

const args = process.argv.slice(2);
const picked = args.filter(a => !a.startsWith('--'));
const shots = args.includes('--shots') || picked.length > 0;
const page0 = path.join(PLAYGROUND, 'dist/test.html');
if (!fs.existsSync(page0)) { console.error('dist/test.html missing. Run `npm run build` first.'); process.exit(1); }
const outDir = path.join(PLAYGROUND, 'dist/shots');
if (shots) fs.mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch(findChromium());
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
let current = '(load)';
page.on('pageerror', e => errors.push(`${current}: ${e.message.slice(0, 300)}`));
page.on('console', m => { if (m.type() === 'error') errors.push(`${current}: console: ${m.text().slice(0, 300)}`); });
await page.goto('file://' + page0);
await page.waitForSelector('.rail-item', { timeout: 20000 });
await page.waitForTimeout(1500);

const all = await page.$$eval('.rail-item > span:first-child', els => els.map(e => e.childNodes[0].textContent));
const names = picked.length ? picked : all;
const unknown = names.filter(n => !all.includes(n));
if (unknown.length) console.log('Not in the playground:', unknown.join(', '));
const presets = picked.length ? ['Prime', 'Noir'] : ['Prime'];
const slug = s => s.replace(/[^A-Za-z0-9]+/g, '-');
const crashed = [];

for (const preset of presets) {
  if (preset !== 'Prime') {
    await page.click('.tab:has-text("Theme")');
    await page.selectOption('#preset', preset);
    await page.waitForTimeout(800);
  }
  for (const n of names.filter(x => all.includes(x))) {
    current = `${n} (${preset})`;
    await page.evaluate(h => { location.hash = h; }, slug(n));
    await page.waitForTimeout(600);
    if (await page.$('.device-screen .crash')) crashed.push(current);
    if (shots) await page.locator('.device').screenshot({ path: path.join(outDir, `${slug(n)}-${preset}.png`) });
  }
}
await browser.close();

console.log(`Checked ${names.length} component(s) on ${presets.join(', ')}.`);
if (crashed.length) console.log('Render crashes:', crashed.join(', '));
if (errors.length) console.log('Errors:\n' + errors.join('\n'));
if (shots) console.log(`Screenshots: ${outDir}`);
process.exit(crashed.length || errors.length ? 1 : 0);
