#!/usr/bin/env node
/**
 * build-printables.mjs — generate print-ready, mobile-friendly HTML files
 * from the SVG templates in content/fieldbook-templates/.
 *
 * Zero dependencies. The pages are designed to:
 *   1. Print cleanly on A4 (no margins, true 210mm × 297mm).
 *   2. View comfortably on a phone, tablet or desktop — the A4 sheet scales
 *      to the viewport width while keeping its aspect ratio, so the whole
 *      page is always visible without horizontal scroll.
 *   3. Offer a one-tap "Save as PDF / print" button that hands off to the
 *      browser's native print-to-PDF sheet.
 *
 * Output:
 *   app/public/printables/<template>.html — one per page, mobile-responsive + printable.
 *   app/public/printables/fieldbook.html  — all pages bundled, one tap to print.
 *   app/public/printables/index.html      — catalog, with share + dark-mode support.
 *
 * Vite copies app/public/ into app/dist/ at build time, so the printables
 * are included in the service-worker precache when built after this script runs.
 */

import { readdir, readFile, writeFile, mkdir } from 'node:fs/promises';
import { join, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..');
const templatesDir = join(root, 'content', 'fieldbook-templates');
const outDir = join(root, 'app', 'public', 'printables');

const sharedStyles = `
  @page { size: A4; margin: 0; }

  :root {
    --paper: #ffffff;
    --paper-ink: #1a1a1a;
    --mat: #f2efe8;
    --ink: #1a1a1a;
    --muted: #555;
    --rule: #c8bfa9;
  }
  @media (prefers-color-scheme: dark) {
    :root {
      --mat: #11131a;
      --ink: #efe9da;
      --muted: #aea99b;
      --rule: #39404f;
    }
  }

  * { box-sizing: border-box; }
  html, body { margin: 0; padding: 0; background: var(--mat); color: var(--ink); }
  body {
    font-family: Georgia, 'Times New Roman', serif;
    line-height: 1.5;
    -webkit-font-smoothing: antialiased;
  }

  .bar {
    max-width: calc(210mm + 32px);
    margin: 0 auto;
    padding: 14px 16px 0;
    display: flex;
    gap: 10px;
    align-items: center;
    flex-wrap: wrap;
    font-size: 15px;
  }
  .bar a, .bar button {
    font: inherit;
    color: var(--ink);
    background: transparent;
    border: 1px solid var(--rule);
    border-radius: 2px;
    padding: 7px 12px;
    text-decoration: none;
    cursor: pointer;
  }
  .bar a:hover, .bar button:hover { border-color: currentColor; }
  .bar .spacer { flex: 1 1 auto; }
  .bar .title { color: var(--muted); font-style: italic; }

  /* A4 sheet. Fluid on small screens, fixed 210mm above the breakpoint. */
  .sheet {
    width: min(210mm, calc(100vw - 32px));
    aspect-ratio: 210 / 297;
    margin: 16px auto;
    background: var(--paper);
    color: var(--paper-ink);
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.12);
    overflow: hidden;
    page-break-after: always;
  }
  .sheet:last-child { page-break-after: auto; }
  .sheet > svg {
    display: block;
    width: 100%;
    height: 100%;
  }

  .hint {
    max-width: calc(210mm + 32px);
    margin: 0 auto;
    padding: 0 16px 24px;
    color: var(--muted);
    font-size: 14px;
  }

  @media print {
    html, body { background: #fff; }
    .bar, .hint { display: none !important; }
    .sheet {
      width: 210mm;
      height: 297mm;
      aspect-ratio: auto;
      margin: 0;
      box-shadow: none;
      background: #fff;
    }
    .sheet > svg { width: 210mm; height: 297mm; }
  }
`;

const actionBar = (titleText) => `<div class="bar">
  <a href="./" aria-label="Back to all printables">← all printables</a>
  <span class="title">${escapeHtml(titleText)}</span>
  <span class="spacer"></span>
  <button type="button" id="print-btn">Save as PDF / print</button>
</div>
<script>document.getElementById('print-btn').addEventListener('click', function(){ window.print(); });</script>
`;

const hint = `<p class="hint">
  Tap <strong>Save as PDF / print</strong> above to save this page to your phone,
  share it, or send it to a printer. For the paper Fieldbook, print at A4, margins zero.
</p>
`;

const pageShellStart = (title, headTitle) => `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="color-scheme" content="light dark">
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; style-src 'unsafe-inline'; script-src 'unsafe-inline'; img-src 'self' data:; frame-ancestors 'none'">
<title>${escapeHtml(headTitle)}</title>
<style>${sharedStyles}</style>
</head>
<body>
${actionBar(title)}`;

const pageShellEnd = `${hint}</body></html>\n`;

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}

function humaniseStem(stem) {
  return stem.replace(/^\d+-/, '').replace(/-/g, ' ');
}

async function run() {
  await mkdir(outDir, { recursive: true });

  const entries = (await readdir(templatesDir))
    .filter((name) => name.endsWith('.svg'))
    .sort();

  if (entries.length === 0) {
    console.error('No SVG templates found in', templatesDir);
    process.exit(1);
  }

  const allPages = [];

  for (const name of entries) {
    const svg = await readFile(join(templatesDir, name), 'utf8');
    const stem = basename(name, '.svg');
    const human = humaniseStem(stem);
    const title = `${human} — WayFare printable`;
    const single =
      pageShellStart(human, title) +
      `<div class="sheet">${svg}</div>\n` +
      pageShellEnd;
    await writeFile(join(outDir, `${stem}.html`), single);
    allPages.push(`<div class="sheet">${svg}</div>`);
    console.log('wrote', `${stem}.html`);
  }

  const bundle =
    pageShellStart('all pages', 'WayFare Fieldbook — all pages') +
    allPages.join('\n') +
    pageShellEnd;
  await writeFile(join(outDir, 'fieldbook.html'), bundle);
  console.log('wrote', 'fieldbook.html');

  const indexStyles = `
    :root {
      --bg: #f5efe3;
      --ink: #1a1a1a;
      --muted: #555;
      --rule: #c8bfa9;
      --card: #ffffff;
    }
    @media (prefers-color-scheme: dark) {
      :root {
        --bg: #11131a;
        --ink: #efe9da;
        --muted: #aea99b;
        --rule: #39404f;
        --card: #1a1e28;
      }
    }
    * { box-sizing: border-box; }
    html, body { margin: 0; padding: 0; }
    body {
      font-family: Georgia, 'Times New Roman', serif;
      background: var(--bg);
      color: var(--ink);
      line-height: 1.55;
      -webkit-font-smoothing: antialiased;
    }
    .wrap {
      max-width: 680px;
      margin: 0 auto;
      padding: clamp(1.25rem, 4vw, 2.25rem) 1.25rem 4rem;
    }
    h1 { font-size: clamp(1.5rem, 5vw, 1.9rem); letter-spacing: 0.01em; margin: 0.4rem 0 0.6rem; }
    h2 { font-size: 1.15rem; margin: 2rem 0 0.5rem; }
    a { color: inherit; text-underline-offset: 2px; }
    a:focus-visible { outline: 2px solid currentColor; outline-offset: 2px; }
    .muted { color: var(--muted); }
    .small { font-size: 0.9rem; }
    .callout {
      border: 1px solid var(--rule);
      background: var(--card);
      padding: 0.9rem 1rem;
      margin: 1.2rem 0;
      border-radius: 2px;
    }
    ul.pages {
      list-style: none;
      padding: 0;
      margin: 0.6rem 0 0;
      display: grid;
      grid-template-columns: 1fr;
      gap: 0.5rem;
    }
    @media (min-width: 520px) {
      ul.pages { grid-template-columns: 1fr 1fr; }
    }
    ul.pages a {
      display: block;
      padding: 0.75rem 0.9rem;
      border: 1px solid var(--rule);
      background: var(--card);
      border-radius: 2px;
      text-decoration: none;
    }
    ul.pages a:hover { border-color: currentColor; }
    ul.pages .name { display: block; font-size: 1rem; }
    ul.pages .num { display: block; font-size: 0.75rem; letter-spacing: 0.08em; text-transform: uppercase; color: var(--muted); margin-bottom: 0.2rem; }
    code { font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; font-size: 0.9em; }
  `;

  const cards = entries
    .map((name) => {
      const stem = basename(name, '.svg');
      const numMatch = stem.match(/^(\d+)-/);
      const num = numMatch ? numMatch[1] : '';
      const human = humaniseStem(stem);
      return `      <li><a href="${stem}.html">
        ${num ? `<span class="num">page ${escapeHtml(num)}</span>` : ''}
        <span class="name">${escapeHtml(human)}</span>
      </a></li>`;
    })
    .join('\n');

  const index = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="color-scheme" content="light dark">
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; style-src 'unsafe-inline'; script-src 'none'; img-src 'self' data:; frame-ancestors 'none'">
<title>WayFare printables</title>
<meta name="description" content="The WayFare Fieldbook pages — view on any phone, or print on A4 for the paper book.">
<style>${indexStyles}</style>
</head>
<body>
  <div class="wrap">
    <p class="muted small"><a href="../">← WayFare app</a></p>
    <h1>Fieldbook — printable pages</h1>
    <p class="muted">
      View any page on your phone, or save as PDF to share with family. Print on A4, punch, and drop in a ring binder.
    </p>

    <div class="callout">
      <strong>The whole book in one file:</strong>
      <a href="fieldbook.html">open the bundle →</a>
      <div class="small muted">All pages together. Save or print in one go.</div>
    </div>

    <h2>Or open one page at a time</h2>
    <ul class="pages">
${cards}
    </ul>

    <p class="muted small" style="margin-top:2rem">
      These pages are generated from SVGs in <code>content/fieldbook-templates/</code>.
      Edit the SVGs and re-run <code>node scripts/build-printables.mjs</code> to regenerate.
    </p>
  </div>
</body>
</html>
`;
  await writeFile(join(outDir, 'index.html'), index);
  console.log('wrote', 'index.html');

  const readme = [
    '# printables/',
    '',
    'Generated by `node scripts/build-printables.mjs`.',
    '',
    '- One `.html` per template page — mobile-responsive, shareable, printable.',
    '- `fieldbook.html` bundles them all for a single print job.',
    '- `index.html` is the catalog page (links to each).',
    '',
    '## To view on a phone',
    '',
    'Open `index.html` (e.g. `https://<site>/printables/`) and tap any page. Each page',
    'scales to fit the screen and has a **Save as PDF / print** button that opens the',
    "browser's native share/print sheet.",
    '',
    '## To print',
    '',
    '1. Open `fieldbook.html` (or a single page) in a browser.',
    '2. Print → choose A4 → "Save as PDF" or send to a printer.',
    '3. Print margins should already be zero; if your browser overrides, set them to zero in the print dialog.',
    '',
    '(This directory is regenerated; edit the SVGs in `content/fieldbook-templates/` instead.)',
    ''
  ].join('\n');
  await writeFile(join(outDir, 'README.md'), readme);
  console.log('wrote', 'README.md');
  console.log(`\nDone. Open app/public/printables/index.html to browse, or fieldbook.html to print everything.`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
