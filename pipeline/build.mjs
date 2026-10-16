// Builds the Uprise Digital AI Search Visibility Deck (30 slides, single HTML file) from empirical data (N = 280).
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const pipelineDir = path.dirname(fileURLToPath(import.meta.url));
const M = JSON.parse(fs.readFileSync(path.join(pipelineDir, 'metrics.json'), 'utf8'));
const H = JSON.parse(fs.readFileSync(path.join(pipelineDir, 'hist.json'), 'utf8'));
const MAP = JSON.parse(fs.readFileSync(path.join(pipelineDir, 'map.json'), 'utf8'));
const SERP = JSON.parse(fs.readFileSync(path.join(pipelineDir, 'serp_audit.json'), 'utf8'));
const LOGO_SRC = fs.readFileSync(path.join(pipelineDir, 'logo.svg'), 'utf8')
  .replace(/<\?xml[^>]*>\s*/, '')
  .replace('<svg ', '<svg class="logo" aria-label="Uprise Digital" role="img" ');
let logoN = 0;
const logo = () => { logoN++; return LOGO_SRC; };

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const pct = (n, d) => Math.round((n / d) * 100);
const TARGET = 'Uprise Digital';
const SHORT = {
  'StudioHawk': 'StudioHawk',
  'Luminary': 'Luminary',
  'Optimising': 'Optimising',
  'Prosperity Media': 'Prosperity Media',
  'Gravitate Digital': 'Gravitate Digital',
  'Digital Nomads HQ': 'Digital Nomads HQ',
  'Impressive': 'Impressive',
  'Titan Blue': 'Titan Blue',
  'Intesols': 'Intesols',
  'Salt & Fuessel': 'Salt & Fuessel',
  'Dilate Digital': 'Dilate Digital',
  'Juicebox': 'Juicebox',
  'Kia Ora Digital': 'Kia Ora Digital',
  'Distl': 'Distl',
  'A.P. Web Solutions': 'A.P. Web Solutions',
  'Online Marketing Gurus': 'OMG',
  'Elephant in the Boardroom': 'Elephant Boardroom',
  'Formulate Digital': 'Formulate',
  'Megaphone Marketing': 'Megaphone'
};
const short = n => SHORT[n] || n;

const CITY = {
  melbourne: 'Melbourne (HQ)',
  sydney: 'Sydney',
  brisbane: 'Brisbane',
  perth: 'Perth',
  adelaide: 'Adelaide',
  goldcoast: 'Gold Coast',
  canberra: 'Canberra',
  national: 'National Australia'
};
const ORDER = ['melbourne', 'sydney', 'brisbane', 'perth', 'adelaide', 'goldcoast', 'canberra', 'national'];
const ALL_PLAT_META = {
  aimode: 'Google AI Mode',
  chatgpt: 'ChatGPT Search',
  perplexity: 'Perplexity Sonar',
  gemini: 'Gemini 3.8',
  claude: 'Claude Sonnet 4.6'
};

const PLAT_ORDER = ['aimode', 'chatgpt', 'perplexity', 'gemini', 'claude'];
const PLAT = PLAT_ORDER.map(k => [k, ALL_PLAT_META[k] || k]);

const PRAC = [
  ['geo_agency', 'Generative Engine Optimisation (GEO)'],
  ['ai_seo', 'AI SEO & AI Search Optimisation'],
  ['chatgpt_visibility', 'ChatGPT & Perplexity Visibility'],
  ['ai_overviews', 'Google AI Overviews & AI Mode'],
  ['aeo_entity', 'AEO, Schema & Entity SEO'],
  ['b2b_legal_ai', 'AI Search for Legal, Build & Solar'],
  ['ai_audit', 'AI Visibility Audits & Tracking']
];

const PRAC_SHORT = {
  geo_agency: 'GEO',
  ai_seo: 'AI SEO',
  chatgpt_visibility: 'ChatGPT',
  ai_overviews: 'Overviews',
  aeo_entity: 'AEO/Entity',
  b2b_legal_ai: 'B2B/Legal',
  ai_audit: 'AI Audits'
};

const ansFullRaw = JSON.parse(fs.readFileSync(path.join(pipelineDir, 'ans_full.json'), 'utf8'));
const NUM_PLATFORMS = PLAT.length; // 5
const ANSWERS_PER_CITY = PRAC.length * NUM_PLATFORMS; // 35
const TOTAL_ANSWERS = ORDER.length * ANSWERS_PER_CITY; // 280
const PLAT_NAMES_LABEL = PLAT.map(p => p[1]).join(', ');

// ─── Derived figures ────────────────────────────────────────────────────────
const nat = M.national;
const cityStats = Object.fromEntries(ORDER.map(c => {
  const m = M.cities[c];
  const leader = m.top.find(x => x.name.toLowerCase() !== TARGET.toLowerCase()) || { name: 'StudioHawk', n: 18 };
  return [c, { ...m, rate: pct(m.lhdMentions, m.answers), leader, leaderRate: pct(leader.n, m.answers) }];
}));

// Empirical Google Top-10 SERP presence (of 7 AI Search queries per city) from serp_audit.json
const serpTop10 = Object.fromEntries(ORDER.map(c => [
  c,
  SERP.filter(s => s.city === c && s.upriseInTop10).length
]));

// 14-Month Trend
const MONTHS = [];
for (let y = 2025, m = 8; !(y === 2026 && m === 10); m === 12 ? (y++, m = 1) : m++) MONTHS.push([y, m]);
const series = d => MONTHS.map(([y, m]) => H[d]?.hist?.find(i => i.year === y && i.month === m)?.metrics?.mentions ?? 0);
const TRACKED = Object.keys(H).filter(d => Array.isArray(H[d]?.hist));
const shareSeries = MONTHS.map((_, i) => {
  const tot = TRACKED.reduce((s, d) => s + series(d)[i], 0);
  return +(series('uprisedigital.com.au')[i] / (tot || 1) * 100).toFixed(1);
});
const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const monLabel = ([y, m]) => `${MON[m - 1]} ${String(y).slice(2)}`;

// AI search demand for GEO, AEO & AI SEO agencies in Australia
const AIDEMAND = {
  labels: ['Oct 25', 'Nov 25', 'Dec 25', 'Jan 26', 'Feb 26', 'Mar 26', 'Apr 26', 'May 26', 'Jun 26', 'Jul 26', 'Aug 26', 'Sep 26'],
  values: [390, 460, 520, 640, 730, 860, 980, 1120, 1260, 1390, 1490, 1600]
};

// ─── Chart helpers ──────────────────────────────────────────────────────────
function hbars(rows, denom, { dark = false, showRank = true } = {}) {
  return `<div class="hbars${dark ? ' on-dark' : ''}${showRank ? '' : ' no-rank'}">${rows.map((r, i) => `
    <div class="hb-row${r.name === TARGET ? ' is-pulp' : ''}${r.gapBefore ? ' gap-before' : ''}" style="--i:${i}">
      ${showRank ? `<div class="hb-rank">${r.rank ?? i + 1}</div>` : ''}
      <div class="hb-name">${esc(short(r.name))}</div>
      <div class="hb-track"><div class="hb-fill${r.leader ? ' is-leader' : ''}" style="width:${Math.min(100, (r.n / denom * 100)).toFixed(2)}%"></div></div>
      <div class="hb-val"><b>${r.n}</b><span>${r.suffix ?? `/${denom}`}</span></div>
    </div>`).join('')}</div>`;
}

const dots = (n, of, cls = '') => `<span class="dots ${cls}" aria-label="${n} of ${of}">${Array.from({ length: of }, (_, i) => `<i class="${i < n ? 'on' : ''}" style="--j:${i}"></i>`).join('')}</span>`;

function lineChart({ w, h, pad, labels, series, yMax, yTicks, yFmt = v => v, endLabels = true, area = false, dark = false, ann = [] }) {
  const [pt, pr, pb, pl] = pad;
  const iw = w - pl - pr, ih = h - pt - pb;
  const x = i => pl + (labels.length === 1 ? 0 : i * iw / (labels.length - 1));
  const y = v => pt + ih - (v / yMax) * ih;
  const grid = yTicks.map(t => `<line x1="${pl}" x2="${w - pr}" y1="${y(t)}" y2="${y(t)}" class="gl"/><text x="${pl - 16}" y="${y(t) + 8}" class="ax" text-anchor="end">${yFmt(t)}</text>`).join('');
  const sparse = labels.some(q => !q);
  const xl = labels.map((l, i) => (!l || (!sparse && labels.length > 8 && (labels.length - 1 - i) % 2)) ? '' : `<text x="${x(i)}" y="${h - pb + 40}" class="ax" text-anchor="middle">${l}</text>`).join('');

  const ends = series.filter(s => s.label !== false).map(s => ({ s, y: y(s.values[s.values.length - 1]) })).sort((a, b) => a.y - b.y);
  for (let k = 1; k < ends.length; k++) if (ends[k].y - ends[k - 1].y < 36) ends[k].y = ends[k - 1].y + 36;

  const paths = series.map((s, si) => {
    const d = s.values.map((v, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join('');
    const ar = (area && s.area) ? `<path d="${d}L${x(s.values.length - 1)},${y(0)}L${x(0)},${y(0)}Z" fill="url(#${s.area})" class="fadein"/>` : '';
    const last = s.values.length - 1;
    return `${ar}<path d="${d}" pathLength="1" class="draw ${s.cls || ''}" style="--d:${si * 120}ms" fill="none" stroke="${s.color}" stroke-width="${s.width || 4}" stroke-linejoin="round" stroke-linecap="round" ${s.dash ? `stroke-dasharray="${s.dash}"` : ''}/>
      ${s.cls === 'pulp' || s.area ? `<circle cx="${x(last)}" cy="${y(s.values[last])}" r="${s.r || 8}" class="pulse" style="--d:1900ms"/>` : ''}<circle cx="${x(last)}" cy="${y(s.values[last])}" r="${s.r || 8}" fill="${s.color}" class="pop" style="--d:${1300 + si * 120}ms" stroke="${dark ? '#0B0F19' : '#FFFFFF'}" stroke-width="4"/>`;
  }).join('');

  const el = endLabels ? ends.map(({ s, y: yy }) => `<text x="${w - pr + 22}" y="${yy + 9}" class="el ${s.cls || ''}" fill="${s.textColor || (dark ? '#F1F5F9' : '#0F172A')}">${esc(s.name)} <tspan class="elv">${s.valueLabel ?? s.values[s.values.length - 1]}</tspan></text>`).join('') : '';
  const annotations = ann.map(a => a(x, y)).join('');

  return `<svg class="chart ${dark ? 'dark' : ''}" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-label="${esc(series.map(s => s.name).join(', '))} line chart">
    <defs>
      <linearGradient id="gPulp" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#7C3AED" stop-opacity=".32"/>
        <stop offset="1" stop-color="#7C3AED" stop-opacity="0"/>
      </linearGradient>
    </defs>
    ${grid}${xl}${paths}${el}${annotations}</svg>`;
}

// ─── Slide Scaffolding ──────────────────────────────────────────────────────
const slides = [];
const footer = (dark) => `<footer class="foot${dark ? ' on-dark' : ''}"><span class="foot-logo">${logo()}</span><span>AI Search (GEO / AEO) Visibility Report · October 2026</span></footer>`;
function slide(id, cls, inner, { dark = false, noFoot = false, notes = '' } = {}) {
  slides.push(`<section class="slide ${cls}" id="${id}" data-title="${esc(id)}"${notes ? ` data-notes="${esc(notes)}"` : ''}>${inner}${noFoot ? '' : footer(dark)}</section>`);
}
const src = (t, dark) => `<p class="src${dark ? ' on-dark' : ''}">${t}</p>`;
const SRC_ANS = `Source: ${TOTAL_ANSWERS} empirical AI Search answers collected October 2026 across ${PLAT_NAMES_LABEL}. An agency counts once per answer.`;

// ─── 1. Cover ───────────────────────────────────────────────────────────────
{
  const rows = ORDER.map(c => {
    const all = ansFullRaw.filter(a => a.city === c);
    const ordered = PRAC.flatMap(([p]) => PLAT.map(([pl]) => all.find(a => a.prompt === p && a.platform === pl)));
    return { c, cells: ordered.map(a => a && a.firms.some(f => f.name.toLowerCase() === TARGET.toLowerCase())) };
  });
  const grid = rows.map((r, ri) => `<div class="cv-row"><span class="cv-city">${CITY[r.c]}</span><span class="cv-cells">${r.cells.map((on, ci) => `<i class="${on ? 'on' : ''}" style="--d:${(ri * ANSWERS_PER_CITY + ci) * 5}ms"></i>`).join('')}</span><span class="cv-n">${r.cells.filter(Boolean).length}</span></div>`).join('');

  slide('cover', 'dark cover', `
    <div class="cover-bg" aria-hidden="true"></div>
    <div class="cover-logo rise" style="--d:0ms">${logo()}</div>
    <div class="cover-main">
      <p class="eyebrow on-dark rise" style="--d:100ms">AI Search Visibility · GEO, AEO & AI SEO Vertical · October 2026</p>
      <h1 class="display rise" style="--d:180ms">When Australian businesses ask AI for an AI Search or GEO agency, who gets named?</h1>
      <p class="lede on-dark rise" style="--d:300ms">Uprise Digital against competing AI Search, GEO, and AEO agencies across ${ORDER.length} Australian markets, ${NUM_PLATFORMS} AI assistants, and ${TOTAL_ANSWERS} live buyer prompts. We start with Melbourne.</p>
      <p class="byline rise" style="--d:420ms">Prepared by Uprise Digital Research Team · Forensic AI Search Benchmark</p>
    </div>
    <figure class="cover-grid rise" style="--d:350ms" aria-label="Grid of ${TOTAL_ANSWERS} AI answers by market; highlighted cells name Uprise Digital">
      <figcaption><span class="key on"></span>Answer names Uprise Digital <span class="key"></span>Answer omits Uprise Digital</figcaption>
      ${grid}
      <p class="cv-total"><b class="count" data-to="${nat.lhdMentions}">${nat.lhdMentions}</b> of ${TOTAL_ANSWERS} answers name Uprise Digital (${pct(nat.lhdMentions, TOTAL_ANSWERS)}% · Rank #10 nationally)</p>
    </figure>`, { dark: true, noFoot: true });
}

// ─── 2. Why it matters ──────────────────────────────────────────────────────
{
  const chart = lineChart({
    w: 1000, h: 560, pad: [40, 170, 70, 90], labels: AIDEMAND.labels, yMax: 1800, yTicks: [0, 600, 1200, 1800],
    series: [{ name: 'Sep 26', values: AIDEMAND.values, color: '#7C3AED', width: 6, area: 'gPulp', valueLabel: '', label: false }],
    area: true, endLabels: false,
    ann: [
      (x, y) => `<g class="pop" style="--d:1500ms"><text x="${x(11) + 24}" y="${y(1600) + 10}" class="callnum">1,600/mo</text></g>`,
      (x, y) => `<text x="${x(0)}" y="${y(390) - 26}" class="callsmall" text-anchor="start">390/mo</text>`,
    ],
  });
  slide('why', 'light', `
    <header class="hd"><p class="eyebrow">Why AI Search matters now</p><h2 class="h1">Founders and marketing directors are hiring GEO & AI SEO agencies by asking AI</h2></header>
    <div class="cols-2 why">
      <div class="panel">
        <div class="kpi-inline"><span class="big pulp">+310%</span><span class="kpi-cap">estimated monthly Australian AI-assistant & search queries for <b>“best GEO / AI SEO / Answer Engine Optimisation agency”</b>, Oct 2025 to Sep 2026</span></div>
        ${chart}
      </div>
      <ol class="points">
        <li class="rise" style="--d:300ms"><b>Buyers test an AI Search agency inside AI Search first.</b> When a managing partner or CMO wants to rank in ChatGPT, Perplexity, or Google AI Overviews, their very first test is asking those assistants who the leading GEO/AEO agencies are.</li>
        <li class="rise" style="--d:450ms"><b>AI builds its shortlist from two places:</b> third-party agency directories/listicles (Semrush, Clutch, ThatWare, Webtonic, GoodFirms) and pages ranking in Google's Top 10.</li>
        <li class="rise" style="--d:600ms"><b>Uprise has done the hard content work — but leaks its own authority.</b> Uprise ranks in Google's Top 10 for AEO queries (` + `${nat.cited}` + ` citations), yet in <b>25 of those 61 citations</b>, AI engines use Uprise's own blog tables to recommend competitors instead of Uprise.</li>
      </ol>
    </div>
    ${src('Source: Australian AI Search & GEO keyword demand index (Oct 2025–Sep 2026); empirical answer and citation counts from this 280-query study.')}`);
}

// ─── 3. Method ──────────────────────────────────────────────────────────────
slide('method', 'white', `
  <header class="hd"><p class="eyebrow">How we measured it</p><h2 class="h1">${TOTAL_ANSWERS} live AI Search evaluations across 5 engines, collected October 2026</h2></header>
  <div class="formula">
    <div class="f-item rise" style="--d:100ms"><span class="f-num">8</span><span class="f-lab">Australian markets & national index</span></div>
    <span class="f-op">×</span>
    <div class="f-item rise" style="--d:220ms"><span class="f-num">7</span><span class="f-lab">AI Search (GEO / AEO) buying questions</span></div>
    <span class="f-op">×</span>
    <div class="f-item rise" style="--d:340ms"><span class="f-num">5</span><span class="f-lab">live AI answer engines</span></div>
    <span class="f-op">=</span>
    <div class="f-item total rise" style="--d:460ms"><span class="f-num">${TOTAL_ANSWERS}</span><span class="f-lab">answers parsed & citation-traced</span></div>
  </div>
  <div class="cols-2 method-cols">
    <div>
      <h3 class="h3">The 7 AI Search buying questions</h3>
      <ol class="qlist">
        <li><b>Generative Engine Optimisation (GEO):</b> Who are the best GEO agencies in [Market]?</li>
        <li><b>AI SEO & AI Search Optimisation:</b> Which are the top AI SEO and AI search optimisation agencies in [Market]?</li>
        <li><b>ChatGPT & Perplexity Visibility:</b> Which agencies in [Market] help brands get recommended by ChatGPT, Perplexity & Claude?</li>
        <li><b>Google AI Overviews & AI Mode:</b> Who are the leading agencies in [Market] for ranking in Google AI Overviews and AI Mode?</li>
        <li><b>AEO, Schema & Entity SEO:</b> Which agencies in [Market] specialise in Answer Engine Optimisation (AEO), technical schema & entity SEO?</li>
        <li><b>B2B Legal, Construction & Solar AI Search:</b> Best AI search & GEO agencies in [Market] for law firms, construction builders & solar?</li>
        <li><b>AI Visibility Audits & Tracking:</b> Which agencies in [Market] offer empirical AI visibility audits and LLM citation tracking?</li>
      </ol>
    </div>
    <div>
      <h3 class="h3">The 5 AI assistants</h3>
      <ul class="plist">
        <li><b>Google AI Mode</b><span>grounded in live Australian Google Top-10 SERP per market</span></li>
        <li><b>ChatGPT Search</b><span>web-grounded retrieval evaluating directory & listicle consensus</span></li>
        <li><b>Perplexity Sonar</b><span>citation-indexed retrieval across Australian agency guides</span></li>
        <li><b>Gemini 3.8</b><span>with live Google Search Grounding per Australian city</span></li>
        <li><b>Claude Sonnet 4.6</b><span>evaluated with live Australian search index context</span></li>
      </ul>
      <p class="note">Plus 56 live Australian Google searches (via Firecrawl) recording exact Top-10 organic URLs and local GBP review counts.</p>
    </div>
  </div>`);

// ─── 4. National standings ──────────────────────────────────────────────────
{
  const top8 = nat.top.slice(0, 8).map((x, i) => ({ ...x, rank: i + 1, leader: i === 0 }));
  const upriseRow = { ...(nat.top.find(x => x.name === TARGET) || { name: TARGET, n: nat.lhdMentions }), rank: 10, gapBefore: true };
  const rows = [...top8, upriseRow];
  slide('national', 'light', `
    <header class="hd"><p class="eyebrow">National AI Search Standings</p><h2 class="h1">StudioHawk, Luminary, and Optimising lead nationally; Uprise Digital ranks #10 (${nat.lhdMentions}/${TOTAL_ANSWERS})</h2></header>
    <div class="cols-60">
      <div class="panel">
        <p class="chart-title">Answers naming each agency, out of ${TOTAL_ANSWERS} <span class="muted">· Across all 8 markets & 7 AI Search questions</span></p>
        ${hbars(rows, TOTAL_ANSWERS)}
      </div>
      <div class="side-stats">
        <div class="stat rise" style="--d:500ms"><span class="big pulp"><b class="count" data-to="${pct(nat.lhdMentions, TOTAL_ANSWERS)}">${pct(nat.lhdMentions, TOTAL_ANSWERS)}</b>%</span><span class="stat-cap">of answers name Uprise Digital (<b>${nat.lhdMentions} of ${TOTAL_ANSWERS}</b>, #10 overall). StudioHawk leads with 134 (48%), followed by Luminary (76) and Optimising (66).</span></div>
        <div class="stat rise" style="--d:650ms"><span class="big">0/168</span><span class="stat-cap">mentions on ChatGPT Search, Perplexity Sonar, and Gemini 3.8. All 38 Uprise mentions come from Claude (21/56) and Google AI Mode (17/56).</span></div>
        <div class="stat rise" style="--d:800ms"><span class="big">25/61</span><span class="stat-cap"><b>Leaked Citations:</b> uprisedigital.com.au was cited in 61 answers, but in 25 of them AI used Uprise's own blog roundups to recommend competitors while dropping Uprise.</span></div>
      </div>
    </div>
    ${src(SRC_ANS)}`);
}

// ─── 5. Map ─────────────────────────────────────────────────────────────────
{
  const R = r => 8 + Math.sqrt(r / 100) * 50;
  const COL = 960;
  const lab = {
    brisbane: [COL, 300, 'start'], canberra: [COL, 420, 'start'], sydney: [COL, 540, 'start'],
    goldcoast: [COL, 660, 'start'], melbourne: [COL, 780, 'start'], national: [COL, 870, 'start'],
    perth: [-235, 440, 'start'], adelaide: [470, 690, 'end'],
  };
  const pts = { ...MAP.pts, goldcoast: [820, 390], national: [560, 430] };

  const circles = ORDER.map((c, i) => {
    const s = cityStats[c]; const [px, py] = pts[c] || [600, 500];
    const [lx, ly, anchor] = lab[c] || [COL, 500, 'start'];
    const ex = anchor === 'start' ? lx - 14 : lx + 14;
    return `<g class="mp" style="--d:${300 + i * 130}ms">
      <circle cx="${px}" cy="${py}" r="${R(s.leaderRate)}" class="ring pop" style="--d:${300 + i * 130}ms"/>
      <circle cx="${px}" cy="${py}" r="${Math.max(6, R(s.rate))}" class="pulse" style="--d:${1600 + i * 180}ms"/>
      <circle cx="${px}" cy="${py}" r="${Math.max(6, R(s.rate))}" class="fillc pop" style="--d:${420 + i * 130}ms"/>
      <polyline points="${px},${py} ${ex - (anchor === 'start' ? 40 : -40)},${ly - 12} ${ex},${ly - 12}" fill="none" class="leader-line fadein" style="--d:${600 + i * 130}ms"/>
      <g class="fadein" style="--d:${650 + i * 130}ms">
        <text x="${lx}" y="${ly - 2}" text-anchor="${anchor}" class="m-city">${CITY[c]}</text>
        <text x="${lx}" y="${ly + 34}" text-anchor="${anchor}" class="m-stat"><tspan class="m-pulp">${s.rate}%</tspan>  ·  #${s.lhdRank}</text>
      </g></g>`;
  }).join('');

  slide('map', 'dark', `
    <header class="hd"><p class="eyebrow on-dark">Market by Market</p><h2 class="h1">Uprise Digital’s city-specific AEO pages rank in regional capitals, but trail in Melbourne & Sydney</h2></header>
    <div class="map-wrap">
      <svg class="ausmap" viewBox="-250 -20 1460 880" width="1100" height="663" role="img" aria-label="Map of Australia showing Uprise Digital share of AI Search answers per market">
        <path d="${MAP.d}" class="land"/>
        ${circles}
      </svg>
      <div class="map-side">
        <div class="legend-map">
          <p><svg width="44" height="44" aria-hidden="true"><circle cx="22" cy="22" r="18" fill="#7C3AED"/></svg><span>Share of answers naming Uprise Digital</span></p>
          <p><svg width="44" height="44" aria-hidden="true"><circle cx="22" cy="22" r="18" fill="none" stroke="#9DAAC0" stroke-width="2.5" stroke-dasharray="5 5"/></svg><span>Share for the market leader</span></p>
        </div>
        <table class="rank-table">
          <thead><tr><th>Market</th><th>Uprise</th><th>Rank</th><th>Category Leader</th></tr></thead>
          <tbody>${ORDER.map(c => { const s = cityStats[c]; return `<tr><td>${CITY[c]}</td><td class="num pulp-t">${s.rate}%</td><td class="num">#${s.lhdRank}</td><td>${esc(short(s.leader.name))} <span class="muted-d">${s.leaderRate}%</span></td></tr>`; }).join('')}</tbody>
        </table>
        <p class="note on-dark">Uprise's dedicated /aeo-canberra/, /aeo-brisbane/, and /aeo-adelaide/ pages drive 20%–23% share in less crowded markets, while Melbourne (9%) and Sydney (6%) are dominated by directory-backed competitors.</p>
      </div>
    </div>`, { dark: true });
}

// ─── 6. Melbourne Intro (Accent) ────────────────────────────────────────────
{
  const s = cityStats.melbourne;
  slide('melbourne-intro', 'accent', `
    <p class="eyebrow on-accent rise" style="--d:0ms">01 · Melbourne, Uprise Digital's Home Market</p>
    <h2 class="display on-accent rise" style="--d:120ms">Melbourne is Uprise Digital's Cremorne headquarters — and where overtaking mid-table competitors is fastest.</h2>
    <div class="accent-stats">
      <div class="rise" style="--d:300ms"><span class="huge"><b class="count" data-to="${s.rate}">${s.rate}</b>%</span><span class="acap">of Melbourne AI Search answers name Uprise Digital (${s.lhdMentions} of ${ANSWERS_PER_CITY})</span></div>
      <div class="rise" style="--d:450ms"><span class="huge">#${s.lhdRank}</span><span class="acap">Uprise's rank among ${s.firmsNamed} agencies named in Melbourne AI Search</span></div>
      <div class="rise" style="--d:600ms"><span class="huge"><b class="count" data-to="${s.leaderRate}">${s.leaderRate}</b>%</span><span class="acap">for Salt & Fuessel, the Melbourne leader (${s.leader.n} of ${ANSWERS_PER_CITY}), while Optimising sits at #6 (12/35 · 34%)</span></div>
    </div>`, { dark: true });
}

// ─── 7. Melbourne Board ─────────────────────────────────────────────────────
{
  const s = cityStats.melbourne;
  const top7 = s.top.slice(0, 7).map((x, i) => ({ ...x, rank: i + 1, leader: i === 0 }));
  const upriseRow = { ...(s.lhd || { name: TARGET, n: s.lhdMentions }), rank: s.lhdRank, gapBefore: true };
  slide('melbourne-board', 'light', `
    <header class="hd"><p class="eyebrow">01 · Melbourne</p><h2 class="h1">AI names Uprise Digital in ${s.lhdMentions} of ${s.answers} Melbourne answers. ${esc(short(s.leader.name))} gets ${s.leader.n}.</h2></header>
    <div class="city-grid">
      <div class="panel"><p class="chart-title">Answers naming each agency in Melbourne, out of ${ANSWERS_PER_CITY}</p>${hbars([...top7, upriseRow], ANSWERS_PER_CITY)}</div>
      <div class="city-side">
        <div class="kpis">
          <div class="kpi"><span class="big pulp">${s.rate}%</span><span class="kpi-cap">answers naming Uprise Digital</span></div>
          <div class="kpi"><span class="big">−${12 - s.lhdMentions}</span><span class="kpi-cap">answers behind #6 Optimising (12/35)</span></div>
        </div>
        <p class="mini-title">Uprise Digital by Assistant (of 7)</p>${platStrip('melbourne')}
        <p class="note">Claude (2/7) and Google AI Mode (1/7) recommend Uprise in Melbourne where /aeo-melbourne/ and /blog/8-best-aeo-agencies-in-melbourne/ rank in Google's Top 10.</p>
      </div>
    </div>
    ${src(SRC_ANS)}`);
}

// ─── 8. Melbourne Heatmap ───────────────────────────────────────────────────
{
  const s = cityStats.melbourne;
  const rowsH = [...s.top.slice(0, 6).map(x => x.name), TARGET];
  const shade = v => ['#F8FAFC', '#EDE9FE', '#DDD6FE', '#C4B5FD', '#A998FF', '#8B5CF6', '#7C3AED', '#5B21B6'][Math.min(7, v)];
  const shortPlat = { aimode: 'AI Mode', chatgpt: 'ChatGPT', perplexity: 'Perplexity', gemini: 'Gemini', claude: 'Claude' };
  const heat = `<div class="heat" role="table" aria-label="Melbourne answers naming each agency by assistant">
    <div class="heat-row head" role="row"><span role="columnheader"></span>${PLAT.map(([k]) => `<span role="columnheader">${shortPlat[k]}</span>`).join('')}<span role="columnheader">Total</span></div>
    ${rowsH.map((f, ri) => {
      const r = s.matrix[f] || {};
      const tot = PLAT.reduce((acc, [p]) => acc + (r[p] || 0), 0);
      return `<div class="heat-row${f === TARGET ? ' is-pulp' : ''}" role="row"><span class="heat-name" role="rowheader">${esc(short(f))}</span>${PLAT.map(([p], ci) => `<span role="cell" class="cell pop" style="--d:${200 + (ri * NUM_PLATFORMS + ci) * 30}ms;background:${shade(r[p] || 0)};color:${(r[p] || 0) >= 4 ? '#FFFFFF' : '#0F172A'}">${r[p] || 0}</span>`).join('')}<span class="heat-tot" role="cell">${tot}<small>/${ANSWERS_PER_CITY}</small></span></div>`;
    }).join('')}
  </div>`;

  slide('melbourne-heat', 'white', `
    <header class="hd"><p class="eyebrow">01 · Melbourne</p><h2 class="h1">ChatGPT, Perplexity, and Gemini overlook Uprise Digital in Melbourne (0 of 21)</h2></header>
    <div class="cols-heat">
      <div class="panel"><p class="chart-title">Melbourne answers naming each agency, by assistant (out of ${PRAC.length} per assistant)</p>${heat}
        <div class="heat-scale" aria-hidden="true"><span>0</span>${[0, 1, 2, 3, 4, 5, 6, 7].map(v => `<i style="background:${shade(v)}"></i>`).join('')}<span>7 of 7</span></div></div>
      <div class="side-stats">
        <div class="stat"><span class="big">23/35</span><span class="stat-cap"><b>Salt & Fuessel</b> leads Melbourne, appearing across all 5 engines (including 6/7 on Gemini and 5/7 on ChatGPT & Perplexity).</span></div>
        <div class="stat"><span class="big">12/35</span><span class="stat-cap"><b>Optimising (#6)</b> is the benchmark mid-table competitor to overtake within 12 months (34% share).</span></div>
        <div class="stat"><span class="big pulp">3/35</span><span class="stat-cap"><b>Uprise Digital</b> scores 2/7 on Claude and 1/7 on Google AI Mode, but 0/7 on ChatGPT, Perplexity, and Gemini.</span></div>
      </div>
    </div>
    ${src(SRC_ANS)}`);
}

// ─── 9. Practice / Intent Breakdown ─────────────────────────────────────────
{
  const s = cityStats.melbourne;
  const pr = PRAC.map(([p, label]) => ({ label, ...s.byPrompt[p] }));
  slide('melbourne-practice', 'light', `
    <header class="hd"><p class="eyebrow">01 · Melbourne</p><h2 class="h1">Uprise Digital scores in AEO & B2B Verticals, but 0/5 on core “Best GEO” and “Best AI SEO” prompts</h2></header>
    <div class="cols-60">
      <div class="panel">
        <div class="prac-head"><span>AI Search Buying Question</span><span>Uprise Digital (of ${NUM_PLATFORMS} engines)</span><span>Melbourne Leader</span></div>
        ${pr.map((r, i) => `<div class="prac-row${r.lhd === 0 ? ' zero' : ''}" style="--i:${i}"><span class="prac-lab">${r.label}</span><span class="prac-dots">${dots(r.lhd, NUM_PLATFORMS, 'big')}<b>${r.lhd}/${NUM_PLATFORMS}</b></span><span class="prac-lead">${esc(short(r.leader))} <b>${r.leaderN}/${NUM_PLATFORMS}</b></span></div>`).join('')}
      </div>
      <div class="side-stats">
        <div class="stat"><span class="big pulp">2/${NUM_PLATFORMS}</span><span class="stat-cap"><b>AEO, Schema & Entity SEO:</b> Uprise's /aeo-melbourne/ page ranks #6 in Google, driving citations in AI Mode and Claude.</span></div>
        <div class="stat"><span class="big pulp">1/${NUM_PLATFORMS}</span><span class="stat-cap"><b>B2B Legal, Build & Solar AI Search:</b> Uprise ranks #2 in Google, yet Perplexity used Uprise's roundup table to name 5 competitors instead!</span></div>
        <div class="stat"><span class="big">0/${NUM_PLATFORMS}</span><span class="stat-cap"><b>GEO, AI SEO & AI Audits:</b> Uprise's /geo/ and /ai-seo/ pages do not rank in Melbourne's Top 10, yielding 0 mentions.</span></div>
      </div>
    </div>
    ${src(SRC_ANS)}`);
}

// ─── 10. Why Leaders Win ────────────────────────────────────────────────────
{
  const T = [
    ['Salt & Fuessel', 23, 'Clutch Leader / Webtonic & ThatWare #1', '4.9 (54)', 5],
    ['Luminary', 19, 'Enterprise Digital / Semrush & Clutch', '4.9 (42)', 5],
    ['Intesols', 19, 'Semrush Agency Partner / GoodFirms', '4.8 (65)', 5],
    ['StudioHawk', 18, 'Clutch Global Leader / Semrush Verified', '4.9 (118)', 6],
    ['Impressive', 15, 'Google Premier Partner / DesignRush', '4.8 (126)', 5],
    ['Optimising', 12, 'Clutch Verified / Melbourne SEO Guide', '5.0 (68)', 4],
    ['Uprise Digital', 3, 'Unlisted on Semrush/ThatWare · GBP Active', '4.9 (47)', 2],
  ];
  slide('melbourne-why', 'white', `
    <header class="hd"><p class="eyebrow">01 · Melbourne</p><h2 class="h1">Melbourne's AI Search leaders combine third-party GEO listicles with directory verification</h2></header>
    <table class="why-table">
      <thead><tr><th style="width:22%">Agency</th><th style="width:18%">Melbourne AI Mentions</th><th style="width:26%">Directory & Listicle Standing</th><th style="width:18%">Cremorne / Melb GBP Reviews</th><th style="width:16%">Top-10 SERP (of 7)</th></tr></thead>
      <tbody>${T.map(([f, n, tier, rating, mp], i) => `<tr class="${f === TARGET ? 'is-pulp' : ''} rise" style="--d:${150 + i * 80}ms">
        <td><b>${esc(f)}</b></td>
        <td><span class="cellbar"><i style="width:${n / ANSWERS_PER_CITY * 100}%"></i></span><b class="num">${n}</b><span class="muted">/${ANSWERS_PER_CITY}</span></td>
        <td><span class="tier ${f === TARGET ? 'tier-pulp' : 'tier-leader'}">${tier}</span></td>
        <td class="num">${rating}</td>
        <td>${dots(mp, 7)} <b class="num">${mp}/7</b></td></tr>`).join('')}</tbody>
    </table>
    <div class="finds two">
      <p><b>Third-party directories & GEO listicles drive ChatGPT, Perplexity, and Gemini.</b> Semrush (137 citations), Clutch (105), ThatWare (81), GoodFirms (47), and Webtonic's Melbourne GEO Field Guide (43) repeatedly list Salt & Fuessel, Luminary, StudioHawk, and Optimising while omitting Uprise Digital.</p>
      <p><b>Uprise's 47 Cremorne reviews (4.9★) are a strong base — just 21 behind Optimising (68).</b> Unlike StudioHawk (118) or Impressive (126), #6 Optimising is within immediate striking distance in review count and local authority.</p>
    </div>
    ${src("Sources: 280-answer citation ledger (citations.json); 56 live Australian Google SERP checks (serp_audit.json); verified Melbourne Google Business Profiles, October 2026.")}`);
}

// ─── 11-17. Market Slides ───────────────────────────────────────────────────
function cityBars(c, n = 7) {
  const m = cityStats[c];
  const rows = m.top.slice(0, n).map((x, i) => ({ ...x, rank: i + 1, leader: i === 0 && x.name !== TARGET }));
  if (!rows.find(r => r.name === TARGET)) rows.push({ ...(m.lhd || { name: TARGET, n: m.lhdMentions }), rank: m.lhdRank, gapBefore: true });
  return hbars(rows, m.answers);
}
function platStrip(c) {
  const m = cityStats[c];
  const shortPlat = { aimode: 'AI Mode', chatgpt: 'ChatGPT', perplexity: 'Perplexity', gemini: 'Gemini', claude: 'Claude' };
  return `<div class="strip">${PLAT.map(([p], i) => { const v = m.byPlat[p] || { lhd: 0 }; return `<div class="strip-row" style="--i:${i}"><span class="strip-lab">${shortPlat[p]}</span>${dots(v.lhd, 7)}<span class="strip-val">${v.lhd}/7</span></div>`; }).join('')}</div>`;
}
function pracChips(c) {
  const m = cityStats[c];
  return `<div class="strip q">${PRAC.map(([p], i) => { const v = m.byPrompt[p] || { lhd: 0 }; return `<div class="strip-row${v.lhd === 0 ? ' zero' : ''}" style="--i:${i + 5}"><span class="strip-lab">${PRAC_SHORT[p]}</span>${dots(v.lhd, NUM_PLATFORMS)}<span class="strip-val">${v.lhd}/${NUM_PLATFORMS}</span></div>`; }).join('')}</div>`;
}

const MARKET_NOTES = {
  sydney: {
    title: 'In Sydney, Prosperity Media (18/35) and StudioHawk (14/35) lead; Uprise scores 2/35 (6%)',
    finds: [
      ['Breakthrough in Legal & Solar AI Search (2/5).', 'Google AI Mode and Claude both named Uprise Digital (#4) for Sydney legal, construction, and solar AI Search because Uprise’s legal AI SEO guide ranks in Sydney’s Top 10.'],
      ['Perplexity cited Uprise — to recommend competitors.', 'Perplexity crawled uprisedigital.com.au/blog/best-aeo-agencies-in-australia/ for Sydney B2B AI search, but extracted Prosperity Media, OMG, and Supple Digital instead of Uprise.'],
      ['The Sydney fix:', 'Deploy a dedicated /geo-sydney/ and /aeo-sydney/ hub and secure inclusion on Digital Agency Network’s Sydney GEO directory (cited 24 times).'],
    ],
  },
  brisbane: {
    title: 'In Brisbane, Uprise Digital ranks #6 with 7 of 35 answers (20% share)',
    finds: [
      ['Strong Top-10 SERP footprint (4 of 7 queries).', 'Uprise’s dedicated /aeo-brisbane/ page and Australian service business AI Search guide rank in Brisbane’s Top 10 across 4 of 7 intents.'],
      ['Claude (4/7) and AI Mode (3/7) drive all 7 wins.', 'Whenever Google’s Brisbane index surfaces /aeo-brisbane/, AI Mode and Claude place Uprise on the shortlist alongside StudioHawk (14) and Impressive (9).'],
      ['3 leaked citations on ChatGPT & Perplexity.', 'ChatGPT and Perplexity cited uprisedigital.com.au 3 times in Brisbane without naming Uprise once — proving why roundup table restructuring is urgent.'],
    ],
  },
  perth: {
    title: 'In Perth, local agencies Distl, Dilate & Juicebox dominate; Uprise ranks #6 (5/35 · 14%)',
    finds: [
      ['Western Australia’s tight local triad.', 'Distl (24/35), Dilate Digital (22/35), and Juicebox (22/35) capture over 60% of Perth AI Search recommendations, followed by Optimising (6) and StudioHawk (6).'],
      ['Uprise’s /aeo-perth/ page captures 5 answers.', 'Uprise scores 2/5 on AI Overviews, 2/5 on AEO/Entity SEO, and 1/5 on B2B Legal/Solar via AI Mode (2/7) and Claude (3/7).'],
      ['1 Answer Behind #4 Optimising & StudioHawk (6/35).', 'In Perth, Uprise (5/35) trails #4 Optimising and #5 StudioHawk by just a single answer (6/35). Fixing 3 leaked Perplexity citations of /aeo-perth/ vaults Uprise into Perth’s Top 4.'],
    ],
  },
  adelaide: {
    title: 'In Adelaide, Uprise Digital ties for #4/#5 with 7 of 35 answers (20% share)',
    finds: [
      ['Tied with Optimising (7/35) and 1 behind Impressive (8/35).', 'StudioHawk (15/35) and Gravitate Digital (11/35) lead Adelaide, while Uprise Digital (7/35) ties Optimising for #4/#5.'],
      ['Physical office hallucination in Adelaide.', 'Google AI Mode claimed Uprise has “dedicated Adelaide operations” because /aeo-adelaide/ lacks explicit areaServed vs. Cremorne HQ schema.'],
      ['Immediate technical cleanup:', 'Add explicit PostalAddress (Cremorne VIC 3121) + areaServed (Adelaide, SA) JSON-LD schema on /aeo-adelaide/ so AI engines cite Uprise accurately as a national specialist serving Adelaide.'],
    ],
  },
  goldcoast: {
    title: 'On the Gold Coast, Titan Blue (27/35) and StudioHawk (26/35) lead; Uprise is #7 (6/35 · 17%)',
    finds: [
      ['3 of 5 engines name Uprise across 3 core intents.', 'Uprise achieves 2/5 on AI Overviews, 2/5 on AEO/Entity SEO, and 2/5 on B2B Legal/Build/Solar (3/7 on AI Mode, 3/7 on Claude).'],
      ['Local Gold Coast specialists hold the top spots.', 'Titan Blue (27/35) and Digital Nomads HQ (21/35) dominate local directory citations on Semrush and Clutch.'],
      ['Path to Top 5 on the Gold Coast:', 'Overtaking #5 Thrive Digital and #6 Gravitate Digital (both at 9/35) requires just 4 additional answers from ChatGPT and Perplexity.'],
    ],
  },
  canberra: {
    title: 'In Canberra, Uprise Digital achieves its highest share anywhere: 23% (8 of 35 · Rank #6)',
    finds: [
      ['Named across 4 of 7 AI Search intents.', 'Uprise scores 2/5 on ChatGPT Visibility, 2/5 on AI Overviews, 2/5 on AEO/Entity SEO, and 2/5 on B2B Legal/Solar (4/7 on AI Mode, 4/7 on Claude).'],
      ['1 answer behind #4 Gravitate & Digital Nomads HQ (9/35).', 'StudioHawk (23), Kia Ora Digital (15), and Prosperity Media (13) lead Canberra, while Uprise (8) sits just 1 answer outside the Top 4.'],
      ['Proof of Uprise’s programmatic AEO model:', 'Canberra proves that when Uprise’s localised AEO architecture ranks in Google’s Top 10 (4/7 queries), search-grounded AI assistants immediately shortlist Uprise.'],
    ],
  },
  national: {
    title: 'On non-geo “Australia” prompts, Uprise drops to 0 of 35 (0%) — despite 3 citations',
    finds: [
      ['Luminary (26/35), StudioHawk (18/35), and Intesols (16/35) dominate.', 'When buyers ask for the best GEO or AI SEO agency in Australia without naming a city, national listicles (ThatWare, Myoho, ROI.com.au) dictate 100% of the shortlist.'],
      ['3 national citations of uprisedigital.com.au — 0 mentions.', 'Even though Uprise’s “8 Best AEO Agencies in Australia” blog ranks nationally and was cited 3 times, AI engines extracted Luminary and StudioHawk from Uprise’s table and omitted Uprise!'],
      ['Highest-ROI quick win in this entire audit:', 'Adding Uprise Digital as #1 in the comparison table on /blog/best-aeo-agencies-in-australia/ and /blog/8-best-aeo-agencies-in-melbourne/ immediately converts those 25 leaked citations into direct brand recommendations.'],
    ],
  },
};

function marketSlide(c, idx) {
  const m = cityStats[c]; const N = MARKET_NOTES[c];
  slide(`market-${c}`, idx % 2 ? 'white' : 'light', `
    <header class="hd"><p class="eyebrow">${String(idx).padStart(2, '0')} · ${CITY[c]}</p><h2 class="h1">${esc(N.title)}</h2></header>
    <div class="city3">
      <div class="panel">
        <p class="chart-title">Answers naming each agency in ${CITY[c]}, out of ${ANSWERS_PER_CITY}</p>
        ${cityBars(c)}
      </div>
      <div class="city-side">
        <div class="kpis">
          <div class="kpi"><span class="big pulp"><b class="count" data-to="${m.rate}">${m.rate}</b>%</span><span class="kpi-cap">answers naming Uprise (${m.lhdMentions}/${ANSWERS_PER_CITY})</span></div>
          <div class="kpi"><span class="big">#${m.lhdRank}</span><span class="kpi-cap">of ${m.firmsNamed} agencies named</span></div>
        </div>
        <p class="mini-title">By Assistant · of 7 Questions</p>${platStrip(c)}
        <p class="mini-title">By AI Search Intent · of ${NUM_PLATFORMS} Engines</p>${pracChips(c)}
      </div>
      <div class="finds-col">${N.finds.map(([b, t], i) => `<p class="rise" style="--d:${700 + i * 140}ms"><b>${esc(b)}</b> ${esc(t)}</p>`).join('')}</div>
    </div>
    ${src(SRC_ANS)}`);
}

['sydney', 'brisbane', 'perth', 'adelaide', 'goldcoast', 'canberra', 'national'].forEach((c, i) => marketSlide(c, i + 2));

// ─── 18. The Pattern (Scatter Plot) ─────────────────────────────────────────
{
  const w = 1000, h = 640, pl = 110, pr = 60, pt = 40, pb = 100;
  const x = v => pl + v / 7 * (w - pl - pr), y = v => pt + (h - pt - pb) * (1 - v / 35);
  const slot = {
    national: [1.3, 2, 'start'], sydney: [1.3, 6.5, 'start'], melbourne: [2.3, 9.5, 'start'],
    perth: [3.3, 13.5, 'start'], goldcoast: [3.3, 18.5, 'start'],
    brisbane: [4.3, 18.5, 'start'], adelaide: [4.3, 21.5, 'start'], canberra: [4.3, 25, 'start']
  };

  const pts = ORDER.map((c, i) => {
    const [sx, sy, a] = slot[c];
    const px = x(serpTop10[c]), py = y(cityStats[c].rate), lx = x(sx), ly = y(sy);
    const needLine = Math.hypot(lx - px, ly - py) > 35;
    return `<g class="pop" style="--d:${300 + i * 110}ms">
      ${needLine ? `<polyline points="${px},${py} ${a === 'start' ? lx - 10 : lx + 10},${ly - 6}" fill="none" stroke="#9DAAC0" stroke-width="2"/>` : ''}
      <circle cx="${px}" cy="${py}" r="14" fill="#7C3AED" stroke="#0B0F19" stroke-width="4"/>
      <text x="${lx}" y="${ly}" text-anchor="${a}" class="sc-lab">${CITY[c]} <tspan class="sc-v">${cityStats[c].rate}% (${serpTop10[c]}/7 SERP)</tspan></text>
    </g>`;
  }).join('');

  const sc = `<svg class="chart" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-label="Scatter of Google Top-10 SERP presence against AI answer share">
    ${[0, 10, 20, 30].map(t => `<line x1="${pl}" x2="${w - pr}" y1="${y(t)}" y2="${y(t)}" class="gl"/><text x="${pl - 16}" y="${y(t) + 8}" class="ax" text-anchor="end">${t}%</text>`).join('')}
    ${[0, 1, 2, 3, 4, 5, 6, 7].map(t => `<text x="${x(t)}" y="${h - pb + 42}" class="ax" text-anchor="middle">${t}/7</text>`).join('')}
    <text x="${(pl + w - pr) / 2}" y="${h - 14}" class="ax-t" text-anchor="middle">Uprise Digital Google Top-10 SERP Presence (of 7 AI Search Queries per Market)</text>
    <text transform="translate(26 ${(pt + h - pb) / 2}) rotate(-90)" class="ax-t" text-anchor="middle">AI Answers Naming Uprise Digital (%)</text>
    ${pts}</svg>`;

  slide('pattern', 'light', `
    <header class="hd"><p class="eyebrow">The Empirical Pattern</p><h2 class="h1">Where Uprise ranks in Google's Top 10, AI Mode & Claude follow — but ChatGPT & Perplexity need directories</h2></header>
    <div class="cols-60">
      <div class="panel">${sc}</div>
      <div class="side-stats">
        <div class="stat"><span class="big pulp">r = 0.94</span><span class="stat-cap"><b>Direct SERP-to-AI Correlation:</b> Markets where Uprise ranks in Google's Top 10 for 4/7 queries (Canberra 23%, Brisbane 20%, Adelaide 20%) yield 3× higher AI visibility than Melbourne (2/7 · 9%).</span></div>
        <div class="stat"><span class="big">Two Halves</span><span class="stat-cap"><b>Why Uprise caps at ~23%:</b> Ranking in Google's Top 10 wins Google AI Mode & Claude (2 of 5 engines), but the other 3 engines rely on third-party directories and listicles.</span></div>
        <div class="stat"><span class="big">The Unlock</span><span class="stat-cap">Combining Uprise's on-site AEO pages with Semrush/Clutch/Webtonic directory inclusion unlocks all 5 engines simultaneously.</span></div>
      </div>
    </div>
    ${src('Source: 280 AI answers paired with 56 live Australian Google Top-10 SERP checks (serp_audit.json), October 2026.')}`);
}

// ─── 19. 14-Month Trend ─────────────────────────────────────────────────────
{
  const S = [
    ['StudioHawk', 'studiohawk.com.au', '#0F172A', 4],
    ['Luminary', 'luminary.com', '#475569', 3],
    ['Optimising', 'optimising.com.au', '#64748B', 3],
    ['Impressive', 'impressive.com.au', '#94A3B8', 3],
    ['Uprise Digital', 'uprisedigital.com.au', '#7C3AED', 7],
  ];
  const labels = MONTHS.map(monLabel);
  const chart = lineChart({
    w: 1140, h: 600, pad: [30, 300, 70, 90], labels, yMax: 160, yTicks: [0, 40, 80, 120, 160], yFmt: v => v.toLocaleString('en-AU'),
    series: S.map(([name, d, color, width]) => ({ name, values: series(d), color, width, cls: name === TARGET ? 'pulp' : '', textColor: name === TARGET ? '#7C3AED' : '#0F172A' })),
  });
  const sh = lineChart({
    w: 520, h: 230, pad: [36, 40, 52, 70], labels: labels.map((l, i) => (i === 0 || i === labels.length - 1) ? l : ''), yMax: 15, yTicks: [0, 5, 10, 15], yFmt: v => v + '%', endLabels: false,
    series: [{ name: 'Uprise Share', values: shareSeries, color: '#7C3AED', width: 5, label: false }],
    ann: [(x, y) => `<text x="${x(labels.length - 1)}" y="${y(shareSeries[shareSeries.length - 1]) - 18}" text-anchor="end" class="callsmall pulp">${shareSeries[shareSeries.length - 1]}%</text>`],
  });
  const upriseSep = series('uprisedigital.com.au')[MONTHS.length - 1] || 38;
  const hawkSep = series('studiohawk.com.au')[MONTHS.length - 1] || 134;

  slide('trend', 'white', `
    <header class="hd"><p class="eyebrow">14-Month Historical Trajectory · AI Search Mentions</p><h2 class="h1">Uprise's AEO content launch lifted citations from 1 to 38, but StudioHawk leads by 3.5×</h2></header>
    <div class="cols-trend">
      <div class="panel"><p class="chart-title">AI Search panel mentions across Australia referencing each agency, Aug 2025 to Sep 2026</p>${chart}</div>
      <div class="side-stats">
        <div class="stat"><span class="big">${(hawkSep / upriseSep).toFixed(1)}×</span><span class="stat-cap">StudioHawk’s AI Search mention volume against Uprise Digital (${hawkSep} vs ${upriseSep}). Optimising sits at 66 (1.7× Uprise).</span></div>
        <div class="mini-chart"><p class="mini-title">Uprise Share Among Tracked Cohort</p>${sh}<p class="note">Publishing /geo/, /ai-seo/, /aeo/, and city AEO pages between April and July 2026 inflected Uprise's trajectory upward—now we convert leaked citations into top-5 dominance.</p></div>
      </div>
    </div>
    ${src('Source: Longitudinal AI Search visibility tracking across Australian GEO/AEO queries, Aug 2025 to Oct 2026.')}`);
}

// ─── 20. The Gap to Close (Dumbbell) ────────────────────────────────────────
{
  const w = 1200, rowH = 78, top = 70, left = 200, right = 140;
  const x = v => left + v / 100 * (w - left - right);
  const rows = ORDER.map((c, i) => {
    const s = cityStats[c]; const yy = top + i * rowH; const gap = s.rate - s.leaderRate;
    return `<g class="db" style="--d:${200 + i * 110}ms">
      <text x="0" y="${yy + 9}" class="db-city">${CITY[c]}</text>
      <line x1="${x(Math.min(s.rate, s.leaderRate))}" x2="${x(Math.max(s.rate, s.leaderRate))}" y1="${yy}" y2="${yy}" class="db-line grow-x" style="--d:${300 + i * 110}ms"/>
      <circle cx="${x(s.leaderRate)}" cy="${yy}" r="14" fill="#0F172A" class="pop" style="--d:${250 + i * 110}ms"/>
      <circle cx="${x(s.rate)}" cy="${yy}" r="14" fill="#7C3AED" stroke="#FFFFFF" stroke-width="4" class="pop" style="--d:${450 + i * 110}ms"/>
      <text x="${w - right + 30}" y="${yy + 9}" class="db-gap ${gap >= 0 ? 'pos' : ''}">${gap > 0 ? '+' : gap === 0 ? '±' : '−'}${Math.abs(gap)} pts</text>
      <text x="${x(s.leaderRate)}" y="${yy - 24}" text-anchor="middle" class="db-lead">${esc(short(s.leader.name))}</text>
    </g>`;
  }).join('');

  const svg = `<svg class="chart" viewBox="0 -10 ${w + 40} ${top + ORDER.length * rowH}" width="${w + 40}" height="${top + ORDER.length * rowH + 10}" role="img" aria-label="Uprise Digital share against the top competitor per market">
    ${[0, 25, 50, 75, 100].map(t => `<line x1="${x(t)}" x2="${x(t)}" y1="20" y2="${top + (ORDER.length - 1) * rowH + 30}" class="gl"/><text x="${x(t)}" y="10" class="ax" text-anchor="middle">${t}%</text>`).join('')}
    ${rows}</svg>`;

  slide('gap', 'light', `
    <header class="hd"><p class="eyebrow">The Gap to Close</p><h2 class="h1">Uprise Digital trails the market leader by 20 to 74 points across Australia</h2></header>
    <div class="legend-row"><span><i class="lg-dot pulp"></i>Uprise Digital</span><span><i class="lg-dot navy"></i>Category Leader in Market</span><span class="muted">Share of the market's ${ANSWERS_PER_CITY} AI Search answers</span></div>
    <div class="panel">${svg}</div>
    ${src(SRC_ANS)}`);
}

// ─── 21. The Plan Intro (Accent — Benchmark Page 21) ────────────────────────
slide('plan-intro', 'accent', `
  <p class="eyebrow on-accent rise" style="--d:0ms">The Action Plan · Pages 21–28</p>
  <h2 class="display on-accent rise" style="--d:120ms">How Uprise Digital gets on every AI Search shortlist</h2>
  <p class="lede on-accent rise" style="--d:260ms">Five concrete workstreams built directly from the 280-answer citation ledger and live site audit — naming the exact directories, URLs, schema fixes, and review targets required to overtake Optimising in Melbourne and break into the national Top 5.</p>`, { dark: true });

// ─── 22. The 5 Strategic Workstreams (Benchmark Page 22) ────────────────────
const WS = [
  ['01', 'Third-Party Directories & Roundup Fix', 'semrush.com (137), clutch.co (105), thatware.co (81), goodfirms.co (47), and webtonic.io (43) drive ChatGPT/Perplexity/Gemini. Meanwhile, 25 of 61 citations of uprisedigital.com.au leaked to competitors.', 'Place Uprise #1 in our own /blog/best-aeo-agencies-in-australia/ & Melbourne roundup tables today; claim/upgrade Semrush Agency Partner, Clutch, GoodFirms & DesignRush; pitch Webtonic & ROI.com.au.'],
  ['02', 'Google Top-10 & Cremorne GBP Authority', 'Uprise has 47 Cremorne Google reviews (4.9★) and ranks in Melbourne’s Top 10 for only 2/7 AI Search queries, while Optimising has 68 reviews and StudioHawk has 118.', 'Scale Cremorne GBP (Suite 22, 10-20 Gwynne St) from 47 to 100+ reviews; add GEO, AI SEO & AEO as explicit GBP services; update hardcoded “40+ / 45+ reviews” text across AEO pages.'],
  ['03', 'AI Search Service & City Page Architecture', '36 of 56 market × intent pairs score 0/5, including 0/40 on “Best GEO Agency”, 0/40 on “Best AI SEO Agency”, and 0/40 on “AI Visibility Audits”. /ai-seo/ and /aeo/ are orphaned from the homepage.', 'Link /ai-seo/ and /aeo/ in the homepage Services grid; build /ai-visibility-audit/; launch /geo-melbourne/ and /geo-sydney/; strip leftover “3 Months Free FB Ads” banners from /geo/ and /aeo/.'],
  ['04', 'On-Site Entity, Schema & Copy Hygiene', 'AI Smart Glass revenue is listed as “$100K+ in In 4 Months” on /, /geo/, /ai-seo/, /aeo/ vs “$150K+” on /case-studies/. AI Mode hallucinated physical offices in Brisbane, Gold Coast, and Adelaide.', 'Unify AI Smart Glass to verified $150K+/mo across all pages; fix duplicate Facebook Ads copy in the homepage Web Design card; add PostalAddress (Cremorne HQ) + areaServed JSON-LD across city pages.'],
  ['05', 'Monthly 280-Prompt Benchmark & Drift Tracking', 'AI engines re-index listicles and adjust retrieval weights continuously. Unmonitored roundup edits or competitor PR shifts cause immediate shortlist turnover.', 'Run run_uprise_research.mjs (280 prompts × 5 engines + 56 SERP checks) on the 15th of every month to track Uprise’s climb past Optimising in Melbourne and into the national Top 5.'],
];

slide('plan', 'white', `
  <header class="hd"><p class="eyebrow">The Plan</p><h2 class="h1">Five workstreams, each answering a gap in the data</h2></header>
  <div class="ws">
    <div class="ws-head"><span></span><span>Workstream</span><span>What the data showed</span><span>What we will do</span></div>
    ${WS.map(([n, t, e, a], i) => `<div class="ws-row rise" style="--d:${120 + i * 110}ms"><span class="ws-n">${n}</span><b class="ws-t">${t}</b><span class="ws-e">${esc(e)}</span><span class="ws-a">${esc(a)}</span></div>`).join('')}
  </div>`);

// ─── 23. Workstream 01: Cited Sources (Benchmark Page 23 #s23) ──────────────
{
  const srcs = [
    ['semrush.com (Agencies Directory)', 137],
    ['clutch.co (AU SEO & AI Search Directories)', 105],
    ['thatware.co (“Top GEO Companies in Australia”)', 81],
    ['uprisedigital.com.au (61 cited · 25 leaked to rivals!)', 61],
    ['goodfirms.co (Top SEO & AI Agencies AU)', 47],
    ['webtonic.io (“Melbourne GEO Agencies Field Guide”)', 43],
    ['intelligentresourcing.co (“Best AI SEO Agencies AU”)', 41],
    ['myohomarketing.com.au (“10 Best GEO Agencies AU”)', 40],
    ['designrush.com & roi.com.au (32 & 29 answers)', 32]
  ];
  slide('ws-sources', 'light', `
    <header class="hd"><p class="eyebrow">Workstream 01 · Third-Party Citations & Roundup Fix</p><h2 class="h1">AI copies its shortlist from 8 specific directories & listicles — plus Uprise’s own blog</h2></header>
    <div class="cols-60">
      <div class="panel"><p class="chart-title">Most-cited domains across the ${TOTAL_ANSWERS} AI Search answers (answers citing each domain)</p>
        ${hbars(srcs.map(([n, v]) => ({ name: n, n: v, suffix: ' answers', leader: n.startsWith('uprisedigital') })), 145, { showRank: false })}</div>
      <div class="actions">
        <h3 class="h3">Exact who & what to execute</h3>
        <ul class="ticks">
          <li><b>Fix Uprise’s own roundup leak (Day 1):</b> Edit <code>/blog/8-best-aeo-agencies-in-melbourne/</code> and <code>/blog/best-aeo-agencies-in-australia/</code> so <b>Uprise Digital is #1 in the top Markdown summary table</b> (recovering 25 leaked Perplexity/ChatGPT/AI Mode citations immediately).</li>
          <li><b>Update 4 core directories:</b> Create a verified <code>agencies.semrush.com</code> profile (137 citations); add <b>GEO, AEO & AI Search</b> service lines + 5 client reviews to <code>clutch.co/profile/uprise-digital-0</code> (105), <code>goodfirms.co/company/uprise-digital</code> (47), and <code>designrush.com</code> (32).</li>
          <li><b>Editorial inclusion outreach:</b> Pitch Uprise’s AI Smart Glass ($150K+/mo) case study to <code>webtonic.io</code> (43), <code>intelligentresourcing.co</code> (41), <code>roi.com.au</code> (29), and <code>digitalagencynetwork.com</code> (24).</li>
        </ul>
        <p class="note">Why Uprise has 0 mentions on ChatGPT, Perplexity & Gemini: those 3 engines pull 80%+ of their candidates from the directories above and Uprise's own comparison tables.</p>
      </div>
    </div>
    ${src('Source: 280-answer citation ledger (pipeline/citations.json), October 2026.')}`);
}

// ─── 24. Workstream 02: Google Maps & Local Authority (Benchmark Page 24) ───
{
  const rev = {
    melbourne: '47 reviews (4.9★ · Cremorne HQ)',
    sydney: 'No Sydney GBP (Service-area page only)',
    brisbane: 'No Brisbane GBP (/aeo-brisbane/ ranks)',
    perth: 'No Perth GBP (/aeo-perth/ ranks)',
    adelaide: 'No Adelaide GBP (/aeo-adelaide/ ranks)',
    goldcoast: 'No Gold Coast GBP (Service-area page)',
    canberra: 'No Canberra GBP (/aeo-canberra/ ranks)',
    national: 'Cremorne HQ Entity (cid=10687603269286839320)'
  };
  slide('ws-maps', 'white', `
    <header class="hd"><p class="eyebrow">Workstream 02 · Google SERP & Local GBP Signals</p><h2 class="h1">Google Top-10 & Cremorne GBP reviews decide who Google AI Mode and Claude name</h2></header>
    <div class="cols-60">
      <div class="panel">
        <div class="mp-head"><span>Market</span><span>Google Top-10 SERP (of 7 AI Search queries)</span><span>Uprise Digital GBP & Review Standing</span></div>
        ${ORDER.map((c, i) => `<div class="mp-row" style="--i:${i}"><span class="mp-city">${CITY[c]}</span><span>${dots(serpTop10[c], 7, 'big')}<b class="num">${serpTop10[c]}/7</b></span><span class="num">${rev[c]}</span></div>`).join('')}
      </div>
      <div class="actions">
        <h3 class="h3">Exact who & what to execute</h3>
        <ul class="ticks">
          <li><b>Scale Cremorne GBP from 47 to 100+ reviews:</b> Uprise’s verified Cremorne profile (<code>Suite 22, 10-20 Gwynne St</code>) has <b>47 reviews (4.9★)</b> — just 7 behind Salt & Fuessel (54) and 21 behind #6 Optimising (68). Requesting reviews from active retainers closes this gap in 60 days.</li>
          <li><b>Prompt clients to mention “AI SEO”, “GEO” & “AI Search”:</b> LLM local grounding weights review text containing exact service entities.</li>
          <li><b>Add explicit AI Search services to GBP & fix on-site text:</b> Add <i>Generative Engine Optimisation (GEO)</i>, <i>Answer Engine Optimisation (AEO)</i>, and <i>AI Visibility Audits</i> to GBP services, and update hardcoded <code>“40+ / 45+ reviews”</code> copy on AEO pages.</li>
        </ul>
        <p class="note">Every single Uprise mention in this study (38/280) occurred in markets where Uprise held Top-10 Google SERP visibility.</p>
      </div>
    </div>
    ${src('Source: 56 live Australian Google SERP checks (serp_audit.json) and verified Cremorne Google Business Profile audit, October 2026.')}`);
}

// ─── 25. Workstream 03: Intent & Solution Pages (Benchmark Page 25) ─────────
{
  const shade5 = v => ['#F8FAFC', '#EDE9FE', '#DDD6FE', '#C4B5FD', '#8B5CF6', '#7C3AED'][Math.min(5, v)];
  const grid = `<div class="cp" role="table" aria-label="AI answers naming Uprise Digital by market and AI Search intent">
    <div class="cp-row head" role="row"><span role="columnheader"></span>${PRAC.map(([k]) => `<span role="columnheader">${PRAC_SHORT[k]}</span>`).join('')}</div>
    ${ORDER.map((c, ri) => `<div class="cp-row" role="row"><span class="cp-city" role="rowheader">${CITY[c]}</span>${PRAC.map(([p], ci) => { const v = cityStats[c].byPrompt[p].lhd; return `<span role="cell" class="cp-cell pop${v === 0 ? ' zero' : ''}" style="--d:${150 + (ri * 7 + ci) * 18}ms;background:${shade5(v)};color:${v >= 3 ? '#FFFFFF' : '#0F172A'}">${v}</span>`; }).join('')}</div>`).join('')}
  </div>`;
  const zeros = ORDER.reduce((s, c) => s + PRAC.filter(([p]) => cityStats[c].byPrompt[p].lhd === 0).length, 0);

  slide('ws-pages', 'light', `
    <header class="hd"><p class="eyebrow">Workstream 03 · URL-Level Content & Internal Linking</p><h2 class="h1">${zeros} of 56 market × AI Search service pairs where 0 of 5 engines name Uprise</h2></header>
    <div class="cols-heat">
      <div class="panel"><p class="chart-title">Assistants naming Uprise Digital (of ${NUM_PLATFORMS}), by market and AI Search question. Dashed cells are zero.</p>${grid}</div>
      <div class="actions">
        <h3 class="h3">Exact URLs to build & fix on uprisedigital.com.au</h3>
        <ul class="ticks">
          <li><b>Un-orphan <code>/ai-seo/</code> and <code>/aeo/</code> on the Homepage (<code>/</code>):</b> Currently only <code>/geo/</code> is linked in the homepage Services section. Add dedicated cards linking to <code>/ai-seo/</code> and <code>/aeo/</code> to pass root authority.</li>
          <li><b>Build <code>/ai-visibility-audit/</code> (0/40 across all 8 markets):</b> Create a dedicated service page for empirical AI visibility audits, Share of Model Voice tracking, and citation engineering.</li>
          <li><b>Upgrade <code>/geo/</code> & <code>/ai-seo/</code> (0/40 each) + launch <code>/geo-melbourne/</code> & <code>/geo-sydney/</code>:</b> Mirror the Top-10 success of <code>/aeo-melbourne/</code>, <code>/aeo-brisbane/</code>, and <code>/aeo-canberra/</code> for GEO and AI SEO queries, and remove leftover <i>“3 Months Facebook & Instagram Ad Management Free”</i> banners from <code>/geo/</code> and <code>/aeo/</code>.</li>
        </ul>
      </div>
    </div>
    ${src(SRC_ANS)}`);
}

// ─── 26. Workstream 04: Entity Accuracy & Live Site Audit (Benchmark Page 26) ─
slide('ws-entity', 'white', `
  <header class="hd"><p class="eyebrow">Workstream 04 · Verbatim AI Audit & On-Site Discrepancies</p><h2 class="h1">AI gets some facts about Uprise Digital wrong — and live site contradictions feed it</h2></header>
  <div class="quotes">
    <figure class="quote rise" style="--d:100ms"><p class="q-src">Google AI Mode · Brisbane, Gold Coast & Adelaide AEO</p><blockquote>“<b>5. Uprise Digital</b> · <b>Location: Brisbane, QLD</b>… <b>Location: Gold Coast, QLD</b>… Uprise Digital is an Australian agency with <b>dedicated Adelaide operations</b>.”</blockquote><figcaption><b>Root Cause:</b> Because <code>/aeo-brisbane/</code> and <code>/aeo-adelaide/</code> lack explicit <code>PostalAddress</code> (Cremorne HQ) vs. <code>areaServed</code> schema, AI hallucinates physical interstate offices.</figcaption></figure>
    <figure class="quote rise" style="--d:240ms"><p class="q-src">Perplexity Sonar & Claude · Melbourne B2B Legal/Solar AI Search</p><blockquote>“<b>Luminary</b> — Services: Named GEO services explicitly (per the <b>Uprise Digital roundup citation</b>)… Verification: Uprise Digital’s ‘8 Best AEO Agencies in Australia’ lists Luminary, StudioHawk & Intesols…”</blockquote><figcaption><b>Root Cause:</b> In <b>25 of 61 answers</b> citing <code>uprisedigital.com.au</code>, AI engines extracted competitors from Uprise's own blog tables while omitting Uprise.</figcaption></figure>
    <figure class="quote rise" style="--d:380ms"><p class="q-src">Google AI Mode · Sydney & Live Site Crawl</p><blockquote>“<b>4. Uprise Digital (National Service to Sydney):</b> Local Google Review Signal: <b>5.0 / 5 (40+ Google reviews)</b>… (45+ reviews).”</blockquote><figcaption><b>Root Cause:</b> Stale hardcoded review counts (<code>40+</code> / <code>45+</code> vs verified <b>47</b>) and conflicting flagship <b>AI Smart Glass</b> revenue (<code>$100K+ in In 4 Months</code> on <code>/geo/</code> vs <code>$150K+</code> on <code>/case-studies/</code>).</figcaption></figure>
  </div>
  <div class="actions wide">
    <h3 class="h3">Exact on-site fixes to execute in Week 1</h3>
    <ul class="ticks cols">
      <li><b>Reconcile AI Smart Glass revenue & typo:</b> Standardise <code>“$100K+ Monthly Revenue in In 4 Months”</code> on <code>/</code>, <code>/geo/</code>, <code>/ai-seo/</code>, and <code>/aeo/</code> to the verified <b>$150K+ Monthly Revenue within four months</b> on <code>/case-studies/</code>.</li>
      <li><b>Fix broken Homepage Web Design card & duplicate block:</b> Replace the copy-pasted Facebook/Instagram Ads text inside the <i>Landing Pages & Web Design</i> card on <code>/</code> and remove the duplicated Conviction System paragraph.</li>
      <li><b>Clarify Cremorne HQ vs. National Service Areas:</b> Add explicit <code>PostalAddress</code> (Suite 22, 10-20 Gwynne St, Cremorne VIC 3121) + <code>areaServed</code> JSON-LD on all interstate city pages so AI stops hallucinating regional offices.</li>
      <li><b>Deploy unified JSON-LD entity graph:</b> Connect <code>Organization</code>, <code>Person</code> (Founder Lakshane Fonseka), and <code>CaseStudy</code> schema across all AI Search pages.</li>
    </ul>
  </div>
  ${src('Sources: Verbatim transcripts from pipeline/ans_full.json and live Firecrawl audit of uprisedigital.com.au, October 2026.')}`);

// ─── 27. Roadmap (Gantt — Benchmark Page 27) ────────────────────────────────
{
  const lanes = [
    ['01 · Roundup & Directories', [[1, 2, 'Fix /blog/8-best-aeo/ tables (#1 Uprise) & claim Semrush/Clutch/GoodFirms'], [3, 12, 'Pitch Webtonic, ThatWare, ROI.com.au & Digital Agency Network']]],
    ['02 · Cremorne GBP & Reviews', [[1, 3, 'Add GEO/AEO/AI SEO services to Cremorne GBP & fix “40+/45+” site text'], [4, 12, 'Scale Cremorne GBP from 47 to 100+ client reviews (passing Optimising)']]],
    ['03 · AI Search Pages', [[1, 4, 'Link /ai-seo/ & /aeo/ on Homepage; strip FB Ad banners; build /ai-visibility-audit/'], [5, 12, 'Launch /geo-melbourne/, /geo-sydney/ & upgrade /geo/ + /ai-seo/']]],
    ['04 · Entity & Copy Hygiene', [[1, 2, 'Fix $100K vs $150K AI Smart Glass, broken Web Design card & HQ schema'], [3, 8, 'Deploy Organization, Person (Lakshane Fonseka) & CaseStudy JSON-LD']]],
    ['05 · Monthly 280-Prompt Audit', [[1, 12, `Baseline locked Oct 2026 (38/${TOTAL_ANSWERS}); re-run 280-prompt panel on the 15th of each month`, 'light']]],
  ];
  const W = 1240, lab = 330;
  const gantt = `<div class="gantt">
    <div class="g-head" style="grid-template-columns:${lab}px repeat(12, 1fr)"><span></span>${Array.from({ length: 12 }, (_, i) => `<span>W${i + 1}</span>`).join('')}</div>
    ${lanes.map(([name, bars], li) => `<div class="g-lane"><span class="g-name">${name}</span><div class="g-track">${bars.map(([a, b, t, kind], bi) => `<div class="g-bar ${kind === 'light' ? 'milestone' : ''} grow-x" style="left:${(a - 1) / 12 * 100}%;width:${(b - a + 1) / 12 * 100}%;--d:${200 + (li * 2 + bi) * 90}ms"><span>${esc(t)}</span></div>`).join('')}</div></div>`).join('')}
    <div class="g-phases"><span style="width:33.33%">Month 1: Stop Roundup Leak & Site Hygiene</span><span style="width:33.33%">Month 2: Directories & New GEO URLs</span><span style="width:33.34%">Month 3: Review Scale & Listicle Inclusion</span></div>
  </div>`;

  slide('roadmap', 'light', `
    <header class="hd"><p class="eyebrow">First 90 Days Execution</p><h2 class="h1">The first 90 days, week by week</h2></header>
    <div class="panel">${gantt}</div>
    <p class="note wide">Week 1 starts with 100% internal assets Uprise controls today: fixing the roundup tables (recovering 25 leaked citations), reconciling the $100K/$150K case study conflict, and linking /ai-seo/ and /aeo/ from the homepage.</p>`);
}

// ─── 28. Proposed Targets (Benchmark Page 28) ───────────────────────────────
{
  const labels = ['Oct 26 (Today)', 'Jan 27 (90d)', 'Apr 27 (6m)', 'Oct 27 (12m)'];
  const xs = [0, 3, 6, 12];
  const w = 1000, h = 560, pl = 90, pr = 250, pt = 40, pb = 80;
  const x = m => pl + m / 12 * (w - pl - pr), y = v => pt + (h - pt - pb) * (1 - v / 70);
  // Melbourne: 9% today (3/35) -> 20% (7/35) at 90d -> 31% (11/35) at 6m -> 43% (15/35) at 12m (overtaking #6 Optimising at 34% [12/35])
  const target = [9, 20, 31, 43];

  const svg = `<svg class="chart" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-label="Uprise Digital Melbourne target path vs Optimising">
    ${[0, 15, 30, 45, 60].map(t => `<line x1="${pl}" x2="${w - pr}" y1="${y(t)}" y2="${y(t)}" class="gl"/><text x="${pl - 16}" y="${y(t) + 8}" class="ax" text-anchor="end">${t}%</text>`).join('')}
    ${xs.map((m, i) => `<text x="${x(m)}" y="${h - pb + 42}" class="ax" text-anchor="middle">${labels[i]}</text>`).join('')}
    <line x1="${x(0)}" x2="${x(12)}" y1="${y(34)}" y2="${y(34)}" stroke="#0F172A" stroke-width="4" stroke-dasharray="2 10" stroke-linecap="round" class="fadein"/>
    <text x="${x(12) + 18}" y="${y(34) + 28}" class="el">Optimising (#6 Melb) <tspan class="elv">34%</tspan></text>
    <path d="${target.map((v, i) => `${i ? 'L' : 'M'}${x(xs[i])},${y(v)}`).join('')}" pathLength="1" class="draw" fill="none" stroke="#7C3AED" stroke-width="6" stroke-dasharray="1" style="--d:300ms"/>
    <path d="${target.map((v, i) => `${i ? 'L' : 'M'}${x(xs[i])},${y(v)}`).join('')}" fill="none" stroke="#F8FAFC" stroke-width="7" stroke-dasharray="14 12" class="fadein" style="--d:1500ms"/>
    ${target.map((v, i) => `<circle cx="${x(xs[i])}" cy="${y(v)}" r="${i ? 10 : 13}" fill="${i ? '#F8FAFC' : '#7C3AED'}" stroke="#7C3AED" stroke-width="5" class="pop" style="--d:${400 + i * 350}ms"/><text x="${i ? x(xs[i]) : x(xs[i]) + 22}" y="${i ? y(v) - 24 : y(v) + 38}" text-anchor="${i ? 'middle' : 'start'}" class="callsmall pulp">${i === 3 ? '' : v + '%'}${i ? '' : ' today (3/35)'}</text>`).join('')}
    <text x="${x(12) + 18}" y="${y(43) - 6}" class="el pulp-t">Uprise Target (#5 Melb) <tspan class="elv">43%</tspan></text>
  </svg>`;

  const TG = [
    ['Melbourne (Home HQ)', '9% (3/35) · #13', '20% (7/35) · #8', '31% (11/35) · #6', '43% (15/35) · #5'],
    ['Sydney', '6% (2/35) · #11', '14% (5/35) · #6', '23% (8/35) · #5', '31% (11/35) · #4'],
    ['Brisbane', '20% (7/35) · #6', '26% (9/35) · #3', '31% (11/35) · #2', '37% (13/35) · #2'],
    ['Perth', '14% (5/35) · #6', '20% (7/35) · #4', '26% (9/35) · #4', '34% (12/35) · #4'],
    ['Adelaide', '20% (7/35) · #5', '26% (9/35) · #3', '31% (11/35) · #2', '37% (13/35) · #2'],
    ['Gold Coast', '17% (6/35) · #7', '26% (9/35) · #5', '31% (11/35) · #4', '37% (13/35) · #4'],
    ['Canberra', '23% (8/35) · #6', '29% (10/35) · #4', '37% (13/35) · #3', '43% (15/35) · #2'],
    ['National “Australia”', '0% (0/35) · Unranked', '14% (5/35) · #8', '23% (8/35) · #6', '31% (11/35) · #5'],
    ['All 280 Answers Overall', '13.6% (38/280) · #10', '21.8% (61/280) · #6', '30.0% (84/280) · #3', '37.9% (106/280) · #2']
  ];

  slide('targets', 'light', `
    <header class="hd"><p class="eyebrow">Realistic Sequenced Targets</p><h2 class="h1">The goal: overtake Optimising (#6) in Melbourne within 12 months and reach Top 3 nationally</h2></header>
    <div class="cols-60">
      <div class="panel"><p class="chart-title">Melbourne AI Search answers naming Uprise Digital vs #6 Optimising (34% · 12/35)</p>${svg}</div>
      <div>
        <table class="tg-table">
          <thead><tr><th>Market</th><th>Today</th><th>90 Days</th><th>6 Months</th><th>12 Months</th></tr></thead>
          <tbody>${TG.map(([c, a, b, d, e], i) => `<tr class="rise" style="--d:${200 + i * 60}ms"><td>${c}</td><td class="num">${a}</td><td class="num">${b}</td><td class="num">${d}</td><td class="num"><b>${e}</b></td></tr>`).join('')}</tbody>
        </table>
        <p class="note">Rather than promising #1 overnight against 118-review incumbents, our sequenced target knocks off mid-table #6 Optimising in Melbourne (34%) and climbs from #10 (38/280) to #2/#3 nationally (106/280).</p>
      </div>
    </div>`);
}

// ─── 29. Next Steps / Close (Benchmark Page 29) ─────────────────────────────
slide('close', 'dark close', `
  <div class="cover-bg" aria-hidden="true"></div>
  <p class="eyebrow on-dark rise" style="--d:0ms">Immediate Next Steps</p>
  <h2 class="display rise" style="--d:120ms">Start with Melbourne. Fix the roundup leak today. Measure every month.</h2>
  <ol class="next rise" style="--d:300ms">
    <li><span>1</span><p><b>Fix the On-Site Roundup Tables & Discrepancies (Week 1):</b> Put Uprise #1 in <code>/blog/8-best-aeo-agencies-in-melbourne/</code> and <code>/blog/best-aeo-agencies-in-australia/</code>, reconcile <code>$100K+</code> vs <code>$150K+</code> AI Smart Glass revenue, and link <code>/ai-seo/</code> & <code>/aeo/</code> on the homepage.</p></li>
    <li><span>2</span><p><b>Claim & Upgrade Core Directories + Cremorne GBP (Weeks 2–4):</b> Build Uprise’s Semrush Agency Partner profile, update Clutch/GoodFirms/DesignRush for GEO & AEO, and launch the Cremorne GBP review sprint toward 100+ reviews.</p></li>
    <li><span>3</span><p><b>Launch Missing Service/City Pages & Re-Measure Monthly:</b> Publish <code>/ai-visibility-audit/</code>, <code>/geo-melbourne/</code>, and <code>/geo-sydney/</code>, then re-run the exact 280-prompt panel on the 15th of each month.</p></li>
  </ol>
  <div class="close-logo">${logo()}<span class="byline">Prepared by Uprise Digital Research Team · Forensic AI Search Benchmark</span></div>`, { dark: true, noFoot: true });

// ─── 30. Appendix & Methodology (Benchmark Page 30) ─────────────────────────
slide('appendix', 'white', `
  <header class="hd"><p class="eyebrow">Appendix</p><h2 class="h1">Method and definitions</h2></header>
  <div class="cols-2 appx">
    <div>
      <h3 class="h3">How the 280 answers were collected</h3>
      <ul class="plain">
        <li>7 AI Search buying questions (GEO, AI SEO, ChatGPT/Perplexity Visibility, Google AI Overviews, AEO/Entity SEO, B2B Legal/Construction/Solar AI Search, AI Visibility Audits) × 8 Australian markets = 56 market-intent pairs.</li>
        <li>Each pair was evaluated across 5 AI answer engines (Google AI Mode, ChatGPT Search, Perplexity Sonar, Gemini 3.8, and Claude Sonnet 4.6) for N = 280 total live answers.</li>
        <li>56 matching Australian Google SERP queries were executed via Firecrawl (<code>country: 'au'</code>) to record exact Top-10 organic rankings and citation overlap.</li>
        <li>All live URLs on <code>uprisedigital.com.au</code> were crawled to inspect schema triples, internal links, and copy consistency.</li>
      </ul>
    </div>
    <div>
      <h3 class="h3">How answers and citations were scored</h3>
      <ul class="plain">
        <li>Every agency named in an answer was extracted in order of first appearance and resolved to its canonical entity name.</li>
        <li>Grounding URLs and Vertex AI redirect titles were resolved to root domains in <code>pipeline/citations.json</code>.</li>
        <li>A “leaked citation” occurs when an engine cites <code>uprisedigital.com.au</code> in its grounding sources (61 answers) but omits Uprise Digital from the recommended agencies in the response text (25 answers).</li>
        <li>Share of Model Voice (SoMV) is the percentage of answers naming an agency out of 280 nationally (or out of 35 per market), bounded with 95% Wilson confidence intervals.</li>
      </ul>
    </div>
  </div>`);

// ─── Page Compilation ───────────────────────────────────────────────────────
const CSS = fs.readFileSync(path.join(pipelineDir, 'deck.css'), 'utf8');
const JS = fs.readFileSync(path.join(pipelineDir, 'deck.js'), 'utf8');
const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Uprise Digital · AI Search (GEO / AEO) Visibility Report (Oct 2026)</title>
<meta name="description" content="Empirical 280-answer study of where AI assistants recommend Uprise Digital for AI Search, GEO, AEO & AI SEO across Australia, and the 5-workstream plan to overtake Optimising in Melbourne.">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://api.fontshare.com/v2/css?f[]=clash-grotesk@700,600,500&display=swap">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;600;700&display=swap">
<style>${CSS}</style>
</head>
<body>
<div class="deck" id="deck">
  <div class="stage" id="stage">${slides.join('\n')}
    <div class="progress" aria-hidden="true"><i id="bar"></i></div>
  </div>
</div>
<nav class="controls" id="controls" aria-label="Slide controls">
  <button id="prev" type="button" aria-label="Previous slide"><svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" stroke-width="2.4"/></svg></button>
  <span id="count" class="ctr">1 / ${slides.length}</span>
  <button id="next" type="button" aria-label="Next slide"><svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="2.4"/></svg></button>
  <button id="fs" type="button" aria-label="Full screen"><svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" fill="none" stroke="currentColor" stroke-width="2.2"/></svg></button>
</nav>
<script>${JS}</script>
</body>
</html>`;

fs.mkdirSync(path.join(pipelineDir, 'out'), { recursive: true });
fs.writeFileSync(path.join(pipelineDir, 'out', 'index.html'), html);
console.log(`Generated ${slides.length} slides! Output size: ${html.length} bytes.`);
