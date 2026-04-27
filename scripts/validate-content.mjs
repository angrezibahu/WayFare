#!/usr/bin/env node
/**
 * validate-content.mjs — advisory cross-reference checker for WayFare content.
 *
 * Loads sky-objects.yaml, experiments.yaml, printables.yaml, challenges/deck.yaml,
 * and the front-matter of every chapter, then prints a warning to stderr for each
 * dangling reference. Always exits 0 (advisory only).
 *
 * Requires js-yaml. If not installed at the project root, run: cd app && npm install
 */

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { join, dirname } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

// --- Load js-yaml from app/node_modules or root node_modules ---
let yaml;
try {
  // Try root node_modules first (if js-yaml added as root devDependency)
  const req = createRequire(join(root, 'package.json'));
  yaml = req('js-yaml');
} catch {
  try {
    // Fall back to app/node_modules (available after `npm run app:install`)
    const req = createRequire(join(root, 'app', 'package.json'));
    yaml = req('js-yaml');
  } catch {
    console.error(
      'validate-content: js-yaml not found.\n' +
      '  Run one of:\n' +
      '    npm install          (if js-yaml is in root devDependencies)\n' +
      '    npm run app:install  (to install the app\'s dependencies)'
    );
    process.exit(0);
  }
}

// ----------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------

function loadYaml(relPath) {
  const abs = join(root, relPath);
  return yaml.load(readFileSync(abs, 'utf8'));
}

function walkDir(dir) {
  const results = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      results.push(...walkDir(full));
    } else {
      results.push(full);
    }
  }
  return results;
}

const FRONT_MATTER_RE = /^---\r?\n([\s\S]*?)\r?\n---/;

function parseFrontMatter(src) {
  const m = src.match(FRONT_MATTER_RE);
  if (!m) return {};
  return yaml.load(m[1]) ?? {};
}

let warnings = 0;
function warn(msg) {
  warnings++;
  process.stderr.write(`WARN  ${msg}\n`);
}

function checkRefs(refs, validSet, refKind, sourceLabel) {
  if (!refs) return;
  const arr = Array.isArray(refs) ? refs : [refs];
  for (const ref of arr) {
    if (typeof ref !== 'string') continue;
    if (!validSet.has(ref)) {
      warn(`${sourceLabel}: dangling ${refKind} → "${ref}"`);
    }
  }
}

// ----------------------------------------------------------------
// 1. Load registries
// ----------------------------------------------------------------

const skyObjectsDoc = loadYaml('content/sky-objects.yaml');
const skyObjectIds = new Set(
  (skyObjectsDoc.sky_objects ?? []).map((o) => o.id)
);

const experimentsDoc = loadYaml('content/experiments.yaml');
const experimentIds = new Set(
  (experimentsDoc.experiments ?? []).map((e) => e.id)
);

const deckDoc = loadYaml('content/challenges/deck.yaml');
const cardIds = new Set(
  (deckDoc.cards ?? []).map((c) => c.id)
);

const chaptersDir = join(root, 'content', 'chapters');
const chapterFiles = walkDir(chaptersDir).filter((f) => f.endsWith('.md'));
const chapterIds = new Set();
const chapterMetas = [];
for (const file of chapterFiles) {
  const src = readFileSync(file, 'utf8');
  const meta = parseFrontMatter(src);
  if (meta.id) {
    chapterIds.add(meta.id);
    chapterMetas.push({ file, meta });
  } else {
    warn(`Chapter missing id: ${file}`);
  }
}

// ----------------------------------------------------------------
// 2. Check sky-objects cross-references
// ----------------------------------------------------------------

for (const obj of (skyObjectsDoc.sky_objects ?? [])) {
  const label = `sky-objects[${obj.id}]`;
  checkRefs(obj.related_sky_objects, skyObjectIds, 'related_sky_objects', label);
}

// ----------------------------------------------------------------
// 3. Check experiments cross-references
// ----------------------------------------------------------------

for (const exp of (experimentsDoc.experiments ?? [])) {
  const label = `experiments[${exp.id}]`;
  checkRefs(exp.related_sky_objects, skyObjectIds, 'related_sky_objects', label);
  checkRefs(exp.suggested_experiments, experimentIds, 'suggested_experiments', label);
  if (exp.deck_card != null) {
    checkRefs(exp.deck_card, cardIds, 'deck_card', label);
  }
}

// ----------------------------------------------------------------
// 4. Check printables cross-references
// ----------------------------------------------------------------

const printablesDoc = loadYaml('content/printables.yaml');
for (const p of (printablesDoc.printables ?? [])) {
  const label = `printables[${p.id}]`;
  checkRefs(p.related_chapters, chapterIds, 'related_chapters', label);
  checkRefs(p.related_experiments, experimentIds, 'related_experiments', label);
}

// ----------------------------------------------------------------
// 5. Check chapter front-matter cross-references
// ----------------------------------------------------------------

for (const { file, meta } of chapterMetas) {
  const rel = file.replace(root + '/', '');
  const label = `chapter[${meta.id}] (${rel})`;
  checkRefs(meta.related_sky_objects, skyObjectIds, 'related_sky_objects', label);
  checkRefs(meta.suggested_experiments, experimentIds, 'suggested_experiments', label);
  checkRefs(meta.related_chapters, chapterIds, 'related_chapters', label);
  checkRefs(meta.related_experiments, experimentIds, 'related_experiments', label);

  // unlock.field_trigger.any_of[].challenge_id
  const anyOf = meta.unlock?.field_trigger?.any_of ?? [];
  for (const trigger of anyOf) {
    if (trigger.challenge_id != null) {
      if (!cardIds.has(trigger.challenge_id)) {
        warn(`${label}: dangling challenge_id → "${trigger.challenge_id}"`);
      }
    }
  }
}

// ----------------------------------------------------------------
// Summary
// ----------------------------------------------------------------

if (warnings === 0) {
  process.stderr.write('validate-content: all cross-references OK\n');
} else {
  process.stderr.write(`validate-content: ${warnings} warning(s) found\n`);
}

process.exit(0);
