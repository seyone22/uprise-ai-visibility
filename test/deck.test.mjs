import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const indexHtml = fs.readFileSync(path.join(rootDir, 'site', 'index.html'), 'utf8');
const techHtml = fs.readFileSync(path.join(rootDir, 'site', 'technical.html'), 'utf8');
const answers = JSON.parse(fs.readFileSync(path.join(rootDir, 'pipeline', 'answers.json'), 'utf8'));
const ansFull = JSON.parse(fs.readFileSync(path.join(rootDir, 'pipeline', 'ans_full.json'), 'utf8'));
const metrics = JSON.parse(fs.readFileSync(path.join(rootDir, 'pipeline', 'metrics.json'), 'utf8'));
const citations = JSON.parse(fs.readFileSync(path.join(rootDir, 'pipeline', 'citations.json'), 'utf8'));
const serpAudit = JSON.parse(fs.readFileSync(path.join(rootDir, 'pipeline', 'serp_audit.json'), 'utf8'));

test('1. Empirical dataset integrity: N = 280 answers across 8 markets, 7 AI Search prompts, and 5 platforms with 0 empty rows', () => {
  assert.equal(answers.length, 280, 'answers.json must contain 280 records');
  assert.equal(ansFull.length, 280, 'ans_full.json must contain 280 records');
  assert.equal(serpAudit.length, 56, 'serp_audit.json must contain 56 Australian SERP checks');

  const emptyRows = ansFull.filter(a => !a.text || a.text.trim().length < 50);
  assert.equal(emptyRows.length, 0, 'Zero empty or truncated rows allowed in ans_full.json');

  const platforms = new Set(ansFull.map(a => a.platform));
  for (const p of ['aimode', 'chatgpt', 'perplexity', 'gemini', 'claude']) {
    assert.ok(platforms.has(p), `Missing platform ${p}`);
  }

  const prompts = new Set(ansFull.map(a => a.prompt));
  for (const q of ['geo_agency', 'ai_seo', 'chatgpt_visibility', 'ai_overviews', 'aeo_entity', 'b2b_legal_ai', 'ai_audit']) {
    assert.ok(prompts.has(q), `Missing AI Search prompt ${q}`);
  }

  assert.equal(metrics.national.answers, 280);
  assert.equal(metrics.national.lhdMentions, 38);
  assert.equal(metrics.national.cited, 61);
});

test('2. 30-Slide Master Deck Anatomy matches Ned Mehic LHD benchmark (Pages 1-30)', () => {
  const expectedIds = [
    'cover', 'why', 'method', 'national', 'map',
    'melbourne-intro', 'melbourne-board', 'melbourne-heat', 'melbourne-practice', 'melbourne-why',
    'market-sydney', 'market-brisbane', 'market-perth', 'market-adelaide', 'market-goldcoast', 'market-canberra', 'market-national',
    'pattern', 'trend', 'gap',
    'plan-intro', 'plan', 'ws-sources', 'ws-maps', 'ws-pages', 'ws-entity', 'roadmap', 'targets',
    'close', 'appendix'
  ];

  const slideMatches = [...indexHtml.matchAll(/<section class="slide [^"]*" id="([^"]+)"/g)].map(m => m[1]);
  assert.equal(slideMatches.length, 30, 'Deck must have exactly 30 slides');
  assert.deepEqual(slideMatches, expectedIds, 'Slide IDs must match the 30-slide canonical sequence');
});

test('3. Pages 21-28 forensic specificity: unredacted directories, 47 Cremorne reviews, URL plan, verbatim discrepancies & Optimising target', () => {
  // Slide 23 (ws-sources): exact cited domains
  assert.match(indexHtml, /semrush\.com/i);
  assert.match(indexHtml, /clutch\.co/i);
  assert.match(indexHtml, /thatware\.co/i);
  assert.match(indexHtml, /goodfirms\.co/i);
  assert.match(indexHtml, /webtonic\.io/i);
  assert.match(indexHtml, /25 leaked/i);

  // Slide 10 & 24 (ws-maps): 47 verified Cremorne reviews
  assert.match(indexHtml, /4\.9 \(47\)/);
  assert.match(indexHtml, /47 reviews \(4\.9★ · Cremorne HQ\)/);

  // Slide 25 (ws-pages): 36 zero pairs & specific URLs
  assert.match(indexHtml, /36 of 56 market/);
  assert.match(indexHtml, /\/ai-visibility-audit\//);
  assert.match(indexHtml, /\/geo-melbourne\//);

  // Slide 26 (ws-entity): live site discrepancies & verbatim quotes
  assert.match(indexHtml, /\$100K\+ Monthly Revenue in In 4 Months/);
  assert.match(indexHtml, /\$150K\+ Monthly Revenue/);
  assert.match(indexHtml, /dedicated Adelaide operations/);

  // Slide 28 (targets): realistic 12-month mid-table target overtaking Optimising
  assert.match(indexHtml, /overtake Optimising \(#6\) in Melbourne within 12 months/i);
});

test('4. Tier 2 Technical Dossier has 12 slides and matches N = 280 telemetry', () => {
  const techSlides = [...techHtml.matchAll(/<section id="([^"]+)" class="slide/g)].map(m => m[1]);
  assert.equal(techSlides.length, 12, 'Technical dossier must contain 12 slides');
  assert.match(techHtml, /N = 280/);
  assert.match(techHtml, /38 \/ 280/);
  assert.match(techHtml, /61 Cited/);
});
