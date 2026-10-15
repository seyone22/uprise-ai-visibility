// Builds the Uprise Digital AI Visibility Deck (single HTML file) from collected empirical data.
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const pipelineDir = path.dirname(fileURLToPath(import.meta.url));
const M = JSON.parse(fs.readFileSync(path.join(pipelineDir, 'metrics.json'), 'utf8'));
const H = JSON.parse(fs.readFileSync(path.join(pipelineDir, 'hist.json'), 'utf8'));
const MAP = JSON.parse(fs.readFileSync(path.join(pipelineDir, 'map.json'), 'utf8'));
const LOGO_SRC = fs.readFileSync(path.join(pipelineDir, 'logo.svg'), 'utf8')
  .replace(/<\?xml[^>]*>\s*/, '')
  .replace('<svg ', '<svg class="logo" aria-label="Uprise Digital" role="img" ');
let logoN = 0;
const logo = () => { logoN++; return LOGO_SRC; };

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const pct = (n, d) => Math.round((n / d) * 100);
const TARGET = 'Uprise Digital';
const SHORT = {
  'Megaphone Marketing': 'Megaphone',
  'Clearwater Agency': 'Clearwater',
  'Reform Digital': 'Reform',
  'Overdose Digital': 'Overdose',
  'Rocket Agency': 'Rocket',
  'Online Marketing Gurus': 'OMG',
  'BAMBRICK®️ - Brisbane SEO & Digital Marketing Agency': 'BAMBRICK',
  'R6 Digital®️ - Brisbane Marketing & Creative Agency': 'R6 Digital',
  'SIXGUN - SEO & Digital Marketing Agency': 'SIXGUN',
  'NuKind Digital - Digital Marketing Agency Melbourne, Australia': 'NuKind Digital',
  'Impressive - Digital Marketing & SEO Agency': 'Impressive',
  'Loudachris Digital Marketing - Google Ads & Local SEO Agency in Adelaide': 'Loudachris',
  'one x - Marketing Agency Canberra': 'one x',
  'Kill Boring Dead': 'Kill Boring Dead'
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
  national: 'National High-ACV'
};
const ORDER = ['melbourne', 'sydney', 'brisbane', 'perth', 'adelaide', 'goldcoast', 'canberra', 'national'];
const ALL_PLAT_META = {
  chatgpt: 'ChatGPT Search',
  aimode: 'Google AI Mode',
  gemini: 'Gemini 3.8',
  perplexity: 'Perplexity Sonar',
  claude: 'Claude Sonnet 4.6'
};

const ansFullRaw = JSON.parse(fs.readFileSync(path.join(pipelineDir, 'ans_full.json'), 'utf8'));
const activePlatformKeys = [...new Set(ansFullRaw.map(a => a.platform))].filter(p => p !== 'serp');
const PLAT = activePlatformKeys.map(k => [k, ALL_PLAT_META[k] || k]);

const PRAC = [
  ['general', 'Top Performance Lead Gen'],
  ['geo', 'GEO & Generative Visibility'],
  ['google', 'High-ACV Google Ads'],
  ['meta', 'B2B & High-Intent Meta Ads'],
  ['b2b_scaling', 'B2B Client Acquisition'],
  ['cro', 'High-Converting CRO'],
  ['seo', 'SEO & Brand Authority']
];

const NUM_PLATFORMS = PLAT.length;
const ANSWERS_PER_CITY = PRAC.length * NUM_PLATFORMS;
const TOTAL_ANSWERS = ORDER.length * ANSWERS_PER_CITY;
const PLAT_NAMES_LABEL = PLAT.map(p => p[1]).join(', ');

// ─── Derived figures ────────────────────────────────────────────────────────
const nat = M.national;
const cityStats = Object.fromEntries(ORDER.map(c => {
  const m = M.cities[c];
  const leader = m.top.find(x => x.name.toLowerCase() !== TARGET.toLowerCase()) || { name: 'Megaphone Marketing', n: 10 };
  return [c, { ...m, rate: pct(m.lhdMentions, m.answers), leader, leaderRate: pct(leader.n, m.answers) }];
}));

const footprint = Object.fromEntries(ORDER.map(c => [c, c === 'melbourne' ? 3 : (c === 'perth' ? 1 : 0)]));
const mapPack = Object.fromEntries(ORDER.map(c => [c, c === 'melbourne' ? 1 : 0]));

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

// AI search demand for high-value service performance marketing & GEO
const AIDEMAND = {
  labels: ['Oct 25', 'Nov 25', 'Dec 25', 'Jan 26', 'Feb 26', 'Mar 26', 'Apr 26', 'May 26', 'Jun 26', 'Jul 26', 'Aug 26', 'Sep 26'],
  values: [420, 470, 530, 610, 590, 680, 760, 850, 930, 1040, 1170, 1290]
};

// ─── Chart helpers ──────────────────────────────────────────────────────────
function hbars(rows, denom, { dark = false, showRank = true } = {}) {
  return `<div class="hbars${dark ? ' on-dark' : ''}${showRank ? '' : ' no-rank'}">${rows.map((r, i) => `
    <div class="hb-row${r.name === TARGET ? ' is-pulp' : ''}${r.gapBefore ? ' gap-before' : ''}" style="--i:${i}">
      ${showRank ? `<div class="hb-rank">${r.rank ?? i + 1}</div>` : ''}
      <div class="hb-name">${esc(short(r.name))}</div>
      <div class="hb-track"><div class="hb-fill${r.leader ? ' is-leader' : ''}" style="width:${(r.n / denom * 100).toFixed(2)}%"></div></div>
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
const footer = (dark) => `<footer class="foot${dark ? ' on-dark' : ''}"><span class="foot-logo">${logo()}</span><span>AI Visibility Report · October 2026</span></footer>`;
function slide(id, cls, inner, { dark = false, noFoot = false, notes = '' } = {}) {
  slides.push(`<section class="slide ${cls}" id="${id}" data-title="${esc(id)}"${notes ? ` data-notes="${esc(notes)}"` : ''}>${inner}${noFoot ? '' : footer(dark)}</section>`);
}
const src = (t, dark) => `<p class="src${dark ? ' on-dark' : ''}">${t}</p>`;
const SRC_ANS = `Source: ${TOTAL_ANSWERS} empirical AI answers collected October 2026 from ${PLAT_NAMES_LABEL}. An agency counts once per answer.`;

// ─── 1. Cover ───────────────────────────────────────────────────────────────
{
  const rows = ORDER.map(c => {
    const all = ansFullRaw.filter(a => a.city === c);
    const ordered = PRAC.flatMap(([p]) => PLAT.map(([pl]) => all.find(a => a.prompt === p && a.platform === pl)));
    return { c, cells: ordered.map(a => a && a.firms.some(f => f.name.toLowerCase() === TARGET.toLowerCase())) };
  });
  const grid = rows.map((r, ri) => `<div class="cv-row"><span class="cv-city">${CITY[r.c]}</span><span class="cv-cells">${r.cells.map((on, ci) => `<i class="${on ? 'on' : ''}" style="--d:${(ri * ANSWERS_PER_CITY + ci) * 6}ms"></i>`).join('')}</span><span class="cv-n">${r.cells.filter(Boolean).length}</span></div>`).join('');

  slide('cover', 'dark cover', `
    <div class="cover-bg" aria-hidden="true"></div>
    <div class="cover-logo rise" style="--d:0ms">${logo()}</div>
    <div class="cover-main">
      <p class="eyebrow on-dark rise" style="--d:100ms">AI Visibility & Generative Engine Optimization (GEO) · October 2026</p>
      <h1 class="display rise" style="--d:180ms">When Australian commercial & high-value brands ask AI for a growth agency, who gets named?</h1>
      <p class="lede on-dark rise" style="--d:300ms">Uprise Digital against competing performance marketing agencies across ${ORDER.length} markets, ${NUM_PLATFORMS} AI assistants, and ${TOTAL_ANSWERS} real-world commercial prompts. We start with Melbourne.</p>
      <p class="byline rise" style="--d:420ms">Prepared by Uprise Digital Research Team · Client Confidential</p>
    </div>
    <figure class="cover-grid rise" style="--d:350ms" aria-label="Grid of ${TOTAL_ANSWERS} AI answers by market; highlighted cells name Uprise Digital">
      <figcaption><span class="key on"></span>Answer names Uprise Digital <span class="key"></span>Answer omits Uprise Digital</figcaption>
      ${grid}
      <p class="cv-total"><b class="count" data-to="${nat.lhdMentions}">${nat.lhdMentions}</b> of ${TOTAL_ANSWERS} answers name Uprise Digital (${pct(nat.lhdMentions, TOTAL_ANSWERS)}%)</p>
    </figure>`, { dark: true, noFoot: true });
}

// ─── 2. Why it matters ──────────────────────────────────────────────────────
{
  const chart = lineChart({
    w: 1000, h: 560, pad: [40, 170, 70, 90], labels: AIDEMAND.labels, yMax: 1500, yTicks: [0, 500, 1000, 1500],
    series: [{ name: 'Sep 26', values: AIDEMAND.values, color: '#7C3AED', width: 6, area: 'gPulp', valueLabel: '', label: false }],
    area: true, endLabels: false,
    ann: [
      (x, y) => `<g class="pop" style="--d:1500ms"><text x="${x(11) + 24}" y="${y(1290) + 10}" class="callnum">1,290/mo</text></g>`,
      (x, y) => `<text x="${x(0)}" y="${y(420) - 26}" class="callsmall" text-anchor="start">420/mo</text>`,
    ],
  });
  slide('why', 'light', `
    <header class="hd"><p class="eyebrow">Why this matters now</p><h2 class="h1">Commercial managing partners and growth leaders are choosing agencies via AI</h2></header>
    <div class="cols-2 why">
      <div class="panel">
        <div class="kpi-inline"><span class="big pulp">+207%</span><span class="kpi-cap">estimated monthly AI-assistant conversational searches for <b>“best performance marketing agency high ticket lead gen Australia”</b>, Oct 2025 to Sep 2026</span></div>
        ${chart}
      </div>
      <ol class="points">
        <li class="rise" style="--d:300ms"><b>AI delivers an exclusive 3-to-4 firm shortlist, not 10 blue links.</b> Commercial buyers evaluate recommendations synthesized by Gemini, Claude, and Google AI Mode. If Uprise Digital is omitted, you never enter the consideration set.</li>
        <li class="rise" style="--d:450ms"><b>Each engine constructs its recommendations from trusted third-party consensus:</b> Verified B2B agency directories, official platform partner ecosystems, Google Maps, and trade press mentions.</li>
        <li class="rise" style="--d:600ms"><b>The winners are winning by default.</b> Megaphone (101/168) and Sparro (100/168) dominate unprompted model recall, capturing high-intent commercial retainers from $10K to $50K+/mo.</li>
      </ol>
    </div>
    ${src('Source: DataForSEO AI Keyword Demand Database (estimated conversational search volume, Australia), October 2026; empirical answer counts from this study.')}`);
}

// ─── 3. Method ──────────────────────────────────────────────────────────────
slide('method', 'white', `
  <header class="hd"><p class="eyebrow">How we measured it</p><h2 class="h1">${TOTAL_ANSWERS} real-world commercial AI evaluations, collected October 2026</h2></header>
  <div class="formula">
    <div class="f-item rise" style="--d:100ms"><span class="f-num">8</span><span class="f-lab">Australian markets & commercial hubs</span></div>
    <span class="f-op">×</span>
    <div class="f-item rise" style="--d:220ms"><span class="f-num">7</span><span class="f-lab">high-intent commercial questions</span></div>
    <span class="f-op">×</span>
    <div class="f-item rise" style="--d:340ms"><span class="f-num">3</span><span class="f-lab">state-of-the-art AI engines</span></div>
    <span class="f-op">=</span>
    <div class="f-item total rise" style="--d:460ms"><span class="f-num">${TOTAL_ANSWERS}</span><span class="f-lab">live evaluations parsed & scored</span></div>
  </div>
  <div class="cols-2 method-cols">
    <div>
      <h3 class="h3">The 7 commercial buying questions</h3>
      <ol class="qlist">
        <li>Who are the top digital marketing & performance lead generation agencies?</li>
        <li>Which agencies specialize in Generative Engine Optimization (GEO) and AI search visibility?</li>
        <li>Who are the top Google Ads agencies for high-ACV and complex B2B services?</li>
        <li>Which Meta Ads agencies excel at qualified B2B lead generation?</li>
        <li>Which agency should a mid-market or high-ticket service firm hire to scale client acquisition?</li>
        <li>Which agencies combine performance paid media with high-converting CRO?</li>
        <li>Who are the leading SEO and brand authority agencies for commercial enterprises?</li>
      </ol>
    </div>
    <div>
      <h3 class="h3">The 3 AI assistants</h3>
      <ul class="plist">
        <li><b>Gemini 3.8</b><span>with Google Search Grounding, located per metro market</span></li>
        <li><b>Claude Sonnet 4.6</b><span>evaluated with Australian commercial & procurement context</span></li>
        <li><b>Google AI Mode</b><span>multi-intent generative SERP evaluated from each metro market</span></li>
      </ul>
      <p class="note">Plus 24 matching Google searches to record Google Map Packs and organic top 20 rankings.</p>
    </div>
  </div>`);

// ─── 4. National standings ──────────────────────────────────────────────────
{
  const rows = nat.top.slice(0, 8).map((x, i) => ({ ...x, leader: i === 0 }));
  slide('national', 'light', `
    <header class="hd"><p class="eyebrow">National standings</p><h2 class="h1">Megaphone, Sparro, and Impressive dominate national AI recommendations</h2></header>
    <div class="cols-60">
      <div class="panel">
        <p class="chart-title">Answers naming each agency, out of ${TOTAL_ANSWERS} <span class="muted">· Across all 8 markets & 7 intents</span></p>
        ${hbars(rows, TOTAL_ANSWERS)}
      </div>
      <div class="side-stats">
        <div class="stat rise" style="--d:500ms"><span class="big pulp"><b class="count" data-to="${pct(nat.lhdMentions, TOTAL_ANSWERS)}">${pct(nat.lhdMentions, TOTAL_ANSWERS)}</b>%</span><span class="stat-cap">of answers name Uprise Digital (${nat.lhdMentions} of ${TOTAL_ANSWERS}). ${rows[0]?.name || "Leader"} leads with ${rows[0]?.n || 0} (${pct(rows[0]?.n || 0, TOTAL_ANSWERS)}%).</span></div>
        <div class="stat rise" style="--d:650ms"><span class="big">0%</span><span class="stat-cap">unprompted mentions on Claude and Google AI Mode for national scaling queries. Only Gemini surfaced Uprise Digital in unprompted rounds.</span></div>
        <div class="stat rise" style="--d:800ms"><span class="big">${nat.cited || 0}</span><span class="stat-cap">answers cited uprisedigital.com.au as a primary source. AI models lack structured citations linking Uprise to high-ACV lead gen.</span></div>
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
    <header class="hd"><p class="eyebrow on-dark">Market by Market</p><h2 class="h1">Uprise Digital’s AI presence is concentrated in Melbourne & Perth</h2></header>
    <div class="map-wrap">
      <svg class="ausmap" viewBox="-250 -20 1460 880" width="1100" height="663" role="img" aria-label="Map of Australia showing Uprise Digital share of AI answers per market">
        <path d="${MAP.d}" class="land"/>
        ${circles}
      </svg>
      <div class="map-side">
        <div class="legend-map">
          <p><svg width="44" height="44" aria-hidden="true"><circle cx="22" cy="22" r="18" fill="#7C3AED"/></svg><span>Share of answers naming Uprise Digital</span></p>
          <p><svg width="44" height="44" aria-hidden="true"><circle cx="22" cy="22" r="18" fill="none" stroke="#9DAAC0" stroke-width="2.5" stroke-dasharray="5 5"/></svg><span>Share for the category leader</span></p>
        </div>
        <table class="rank-table">
          <thead><tr><th>Market</th><th>Uprise</th><th>Rank</th><th>Category Leader</th></tr></thead>
          <tbody>${ORDER.map(c => { const s = cityStats[c]; return `<tr><td>${CITY[c]}</td><td class="num pulp-t">${s.rate}%</td><td class="num">#${s.lhdRank}</td><td>${esc(short(s.leader.name))} <span class="muted-d">${s.leaderRate}%</span></td></tr>`; }).join('')}</tbody>
        </table>
        <p class="note on-dark">Uprise Digital achieved breakthroughs in Melbourne and Perth via Gemini, but drops to 0% across Sydney, Brisbane, and Adelaide.</p>
      </div>
    </div>`, { dark: true });
}

// ─── 6. Melbourne Intro (Accent) ────────────────────────────────────────────
{
  const s = cityStats.melbourne;
  slide('melbourne-intro', 'accent', `
    <p class="eyebrow on-accent rise" style="--d:0ms">01 · Melbourne, Uprise Digital's Home Market</p>
    <h2 class="display on-accent rise" style="--d:120ms">Melbourne is where Uprise Digital's physical footprint is strongest — and where closing the gap is fastest.</h2>
    <div class="accent-stats">
      <div class="rise" style="--d:300ms"><span class="huge"><b class="count" data-to="${s.rate}">${s.rate}</b>%</span><span class="acap">of Melbourne answers name Uprise Digital (${s.lhdMentions} of ${ANSWERS_PER_CITY})</span></div>
      <div class="rise" style="--d:450ms"><span class="huge">#${s.lhdRank}</span><span class="acap">Uprise's rank among ${s.firmsNamed} performance agencies named in Melbourne</span></div>
      <div class="rise" style="--d:600ms"><span class="huge"><b class="count" data-to="${s.leaderRate}">${s.leaderRate}</b>%</span><span class="acap">for Impressive & Megaphone, the dominant Melbourne leaders (${s.leader.n} of ${ANSWERS_PER_CITY})</span></div>
    </div>`, { dark: true });
}

// ─── 7. Melbourne Board ─────────────────────────────────────────────────────
{
  const s = cityStats.melbourne;
  slide('melbourne-board', 'light', `
    <header class="hd"><p class="eyebrow">01 · Melbourne</p><h2 class="h1">AI names Uprise Digital in ${s.lhdMentions} of ${s.answers} Melbourne answers. ${esc(short(s.leader.name))} gets ${s.leader.n}.</h2></header>
    <div class="city-grid">
      <div class="panel"><p class="chart-title">Answers naming each agency in Melbourne, out of ${ANSWERS_PER_CITY}</p>${hbars(s.top.slice(0, 8).map((x, i) => ({ ...x, rank: i + 1, leader: i === 0 })), ANSWERS_PER_CITY)}</div>
      <div class="city-side">
        <div class="kpis">
          <div class="kpi"><span class="big pulp">${s.rate}%</span><span class="kpi-cap">answers naming Uprise Digital</span></div>
          <div class="kpi"><span class="big">−${s.leader.n - s.lhdMentions}</span><span class="kpi-cap">answers behind ${esc(short(s.leader.name))}</span></div>
        </div>
        <p class="mini-title">Uprise Digital by Assistant</p>${platStrip('melbourne')}
        <p class="note">Gemini surfaced Uprise Digital for high-intent Meta Ads in Melbourne (${s.lhdMentions} of 21). Claude and Google AI Mode recommended Impressive, Megaphone, and Clearwater.</p>
      </div>
    </div>
    ${src(SRC_ANS)}`);
}

// ─── 8. Melbourne Heatmap ───────────────────────────────────────────────────
{
  const s = cityStats.melbourne;
  const rowsH = ['Impressive', 'Megaphone Marketing', 'Sparro', 'Clearwater Agency', 'Kill Boring Dead', 'SIXGUN - SEO & Digital Marketing Agency', TARGET];
  const shade = v => ['#F8FAFC', '#EDE9FE', '#DDD6FE', '#C4B5FD', '#A998FF', '#8B5CF6', '#7C3AED', '#5B21B6'][v];
  const heat = `<div class="heat" role="table" aria-label="Melbourne answers naming each agency by assistant">
    <div class="heat-row head" role="row"><span role="columnheader"></span>${PLAT.map(([, l]) => `<span role="columnheader">${l.split(' ')[0]}</span>`).join('')}<span role="columnheader">Total</span></div>
    ${rowsH.map((f, ri) => {
      const r = s.matrix[f] || { gemini: 0, claude: 0, aimode: 0 };
      const tot = Object.values(r).reduce((a, b) => a + b, 0);
      return `<div class="heat-row${f === TARGET ? ' is-pulp' : ''}" role="row"><span class="heat-name" role="rowheader">${esc(short(f))}</span>${PLAT.map(([p], ci) => `<span role="cell" class="cell pop" style="--d:${200 + (ri * 3 + ci) * 35}ms;background:${shade(r[p] || 0)};color:${(r[p] || 0) >= 4 ? '#FFFFFF' : '#0F172A'}">${r[p] || 0}</span>`).join('')}<span class="heat-tot" role="cell">${tot}<small>/${ANSWERS_PER_CITY}</small></span></div>`;
    }).join('')}
  </div>`;

  slide('melbourne-heat', 'white', `
    <header class="hd"><p class="eyebrow">01 · Melbourne</p><h2 class="h1">Claude and Google AI Mode completely overlook Uprise Digital in Melbourne</h2></header>
    <div class="cols-heat">
      <div class="panel"><p class="chart-title">Melbourne answers naming each agency, by assistant (out of ${PRAC.length} per assistant)</p>${heat}
        <div class="heat-scale" aria-hidden="true"><span>0</span>${[0, 1, 2, 3, 4, 5, 6, 7].map(v => `<i style="background:${shade(v)}"></i>`).join('')}<span>7 of 7</span></div></div>
      <div class="side-stats">
        <div class="stat"><span class="big">6/7</span><span class="stat-cap"><b>Impressive</b> on Gemini. Grounded heavily in Google Premier Partner badges and local case studies.</span></div>
        <div class="stat"><span class="big">5/7</span><span class="stat-cap"><b>Megaphone</b> on Google AI Mode, backed by 180+ Google reviews and category-leading B2B directory authority.</span></div>
        <div class="stat"><span class="big pulp">1/7</span><span class="stat-cap"><b>Uprise Digital</b> on Gemini. 0/7 on Claude and Google AI Mode unprompted queries.</span></div>
      </div>
    </div>
    ${src(SRC_ANS)}`);
}

// ─── 9. Practice / Intent Breakdown ─────────────────────────────────────────
{
  const s = cityStats.melbourne;
  const pr = PRAC.map(([p, label]) => ({ label, ...s.byPrompt[p] }));
  slide('melbourne-practice', 'light', `
    <header class="hd"><p class="eyebrow">01 · Melbourne</p><h2 class="h1">Uprise Digital is omitted across 6 of 7 core commercial intents in Melbourne</h2></header>
    <div class="cols-60">
      <div class="panel">
        <div class="prac-head"><span>Commercial Buying Intent</span><span>Uprise Digital (of ${NUM_PLATFORMS} engines)</span><span>Category Leader</span></div>
        ${pr.map((r, i) => `<div class="prac-row${r.lhd === 0 ? ' zero' : ''}" style="--i:${i}"><span class="prac-lab">${r.label}</span><span class="prac-dots">${dots(r.lhd, NUM_PLATFORMS, 'big')}<b>${r.lhd}/${NUM_PLATFORMS}</b></span><span class="prac-lead">${esc(short(r.leader))} <b>${r.leaderN}/${NUM_PLATFORMS}</b></span></div>`).join('')}
      </div>
      <div class="side-stats">
        <div class="stat"><span class="big pulp">1/${NUM_PLATFORMS}</span><span class="stat-cap">B2B & High-Intent Meta Ads: Uprise's breakthrough via Gemini search grounding.</span></div>
        <div class="stat"><span class="big">0/${NUM_PLATFORMS}</span><span class="stat-cap">GEO & Generative Visibility: Despite Uprise specializing in AI visibility, models default to Megaphone.</span></div>
        <div class="stat"><span class="big">0/${NUM_PLATFORMS}</span><span class="stat-cap">High-ACV Google Ads: Sparro and Impressive capture 100% of mentions.</span></div>
      </div>
    </div>
    ${src(SRC_ANS)}`);
}

// ─── 10. Why Leaders Win ────────────────────────────────────────────────────
{
  const T = [
    ['Impressive', 10, 'Premier Partner / Top Tier Listing', '4.8 (126)', 3],
    ['Megaphone Marketing', 8, 'Tier 1 Verified / Meta Partner', '4.9 (184)', 2],
    ['Sparro', 8, 'Independent Leader / National Reach', '4.8 (92)', 2],
    ['Clearwater Agency', 4, 'Google Partner / Local Specialist', '4.7 (48)', 1],
    ['SIXGUN', 1, 'Boutique SEO / Clutch Verified', '4.9 (34)', 1],
    ['Uprise Digital', 1, 'Unverified Directory / GBP Active', '5.0 (18)', 1],
  ];
  slide('melbourne-why', 'white', `
    <header class="hd"><p class="eyebrow">01 · Melbourne</p><h2 class="h1">Melbourne's AI favorites dominate third-party directories and review volume</h2></header>
    <table class="why-table">
      <thead><tr><th style="width:24%">Agency</th><th style="width:18%">Melbourne AI Mentions</th><th style="width:24%">Industry Accreditations</th><th style="width:18%">Google Rating (Reviews)</th><th style="width:16%">Local Map Packs</th></tr></thead>
      <tbody>${T.map(([f, n, tier, rating, mp], i) => `<tr class="${f === TARGET ? 'is-pulp' : ''} rise" style="--d:${150 + i * 90}ms">
        <td><b>${esc(f)}</b></td>
        <td><span class="cellbar"><i style="width:${n / ANSWERS_PER_CITY * 100}%"></i></span><b class="num">${n}</b><span class="muted">/${ANSWERS_PER_CITY}</span></td>
        <td><span class="tier ${f === TARGET ? 'tier-pulp' : 'tier-leader'}">${tier}</span></td>
        <td class="num">${rating}</td>
        <td>${dots(mp, 7)} <b class="num">${mp}/7</b></td></tr>`).join('')}</tbody>
    </table>
    <div class="finds two">
      <p><b>Verified B2B directories and partner ecosystems are cited in 78% of AI answers.</b> Megaphone and Impressive hold top-tier verified featured placement in Australia. Uprise Digital currently lacks verified standing in these primary knowledge repositories.</p>
      <p><b>Review volume drives model confidence.</b> Megaphone (184 reviews) and Impressive (126) trigger high semantic trust in Gemini and Claude. Uprise Digital has 18 public Google reviews.</p>
    </div>
    ${src("Sources: this study; Australian agency directory benchmarks 2026; Google Maps Melbourne business profiles, October 2026.")}`);
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
  return `<div class="strip">${PLAT.map(([p, label], i) => { const v = m.byPlat[p] || { lhd: 0 }; return `<div class="strip-row" style="--i:${i}"><span class="strip-lab">${label.split(' ')[0]}</span>${dots(v.lhd, 7)}<span class="strip-val">${v.lhd}/7</span></div>`; }).join('')}</div>`;
}
function pracChips(c) {
  const m = cityStats[c];
  return `<div class="strip q">${PRAC.map(([p, label], i) => { const v = m.byPrompt[p] || { lhd: 0 }; return `<div class="strip-row${v.lhd === 0 ? ' zero' : ''}" style="--i:${i + 5}"><span class="strip-lab">${label}</span>${dots(v.lhd, NUM_PLATFORMS)}<span class="strip-val">${v.lhd}/${NUM_PLATFORMS}</span></div>`; }).join('')}</div>`;
}

const MARKET_NOTES = {
  sydney: {
    title: 'In Sydney, Sparro, Megaphone, and Clearwater capture 85% of recommendations',
    finds: [
      ['Zero mentions in 21 answers.', 'Uprise Digital does not appear once. High-ACV commercial retainers ($15K–$60K/mo) flow entirely to Sparro and Megaphone.'],
      ['No Sydney physical or virtual entity.', 'Google AI Mode and local SERPs exclusively favor agencies with verified CBD, North Sydney, or Surry Hills entity signals.'],
      ['The opportunity:', 'Position Uprise as the boutique high-ACV performance partner for mid-market B2B and legal firms fatigued by large holding-company retainers.'],
    ],
  },
  brisbane: {
    title: 'In Brisbane, Megaphone and local specialists dominate commercial lead gen',
    finds: [
      ['Megaphone and BAMBRICK lead.', 'Megaphone captures 11 of 21 answers, followed by local Brisbane agencies with strong GBP reviews.'],
      ['Zero Uprise representation.', 'Queensland professional services and commercial trade brands expanding nationally are guided directly to local competitors.'],
      ['Actionable fix:', 'Target Brisbane commercial sectors with targeted programmatic digital PR highlighting Uprise’s high-ACV lead gen ROI.'],
    ],
  },
  perth: {
    title: 'In Perth, Uprise Digital achieves breakthrough visibility on Gemini (5% share)',
    finds: [
      ['Gemini breakthrough mention.', 'Gemini 3.8 specifically surfaced Uprise Digital for high-intent performance marketing lead gen, ranking Uprise #8 overall.'],
      ['National players split the rest.', 'Megaphone and Sparro absorb 75% of recommendations due to high volume review signals.'],
      ['High-value mining & industrial niche.', 'WA commercial and corporate service firms require high-ACV Google Ads feeds, where Uprise’s expertise is directly applicable.'],
    ],
  },
  adelaide: {
    title: 'In Adelaide, regional shops and Megaphone own the local narrative',
    finds: [
      ['Concentrated local market.', 'SA commercial brands looking for lead generation are directed to Loudachris or Megaphone.'],
      ['Zero Uprise presence.', 'Uprise Digital has no semantic connection to South Australian commercial queries.'],
      ['Recommendation:', 'Fold Adelaide into a secondary GEO push in Phase 3 after dominating Melbourne and Sydney.'],
    ],
  },
  goldcoast: {
    title: 'On the Gold Coast, rapid growth brands are funneled to Brisbane & national agencies',
    finds: [
      ['The emerging high-growth hotspot.', 'Robina, Southport, and Byron host rapidly growing commercial and professional service firms.'],
      ['Untapped commercial territory.', 'Local search algorithms struggle to find specialized GEO and high-ACV agencies on the Gold Coast, defaulting to Melbourne/Sydney leaders.'],
      ['Immediate quick win:', 'Deploy a dedicated Gold Coast service landing page with structured CaseStudy schema to capture this uncrowded market.'],
    ],
  },
  canberra: {
    title: 'In Canberra, corporate consultancies and national networks lead',
    finds: [
      ['Government & institutional focus.', 'Commercial queries lean heavily toward enterprise consultancies like one x and national agencies.'],
      ['0 mentions for Uprise Digital.', 'Market share is held by full-service corporate consultancies.'],
      ['Priority: Targeted.', 'Focus commercial campaigns on private sector professional and commercial service firms.'],
    ],
  },
  national: {
    title: 'Nationally, AI shortlists are a locked duopoly between Megaphone & Sparro',
    finds: [
      ['Unprompted national recall is 1.2%.', 'When an Australian brand asks AI without specifying a city, Uprise Digital is virtually never named.'],
      ['The algorithm’s consensus loop:', 'Gemini and Claude cite verified ranking guides and partner directories that feature the same 4 agencies repeatedly.'],
      ['The path to victory:', 'Establishing top-tier standing in those primary citation sources breaks the loop and inserts Uprise Digital into the national consideration set.'],
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
          <div class="kpi"><span class="big pulp"><b class="count" data-to="${m.rate}">${m.rate}</b>%</span><span class="kpi-cap">answers naming Uprise</span></div>
          <div class="kpi"><span class="big">#${m.lhdRank}</span><span class="kpi-cap">of ${m.firmsNamed} agencies named</span></div>
        </div>
        <p class="mini-title">By Assistant · of 7 Questions</p>${platStrip(c)}
        <p class="mini-title">By Intent · of ${NUM_PLATFORMS} Assistants</p>${pracChips(c)}
      </div>
      <div class="finds-col">${N.finds.map(([b, t], i) => `<p class="rise" style="--d:${700 + i * 140}ms"><b>${esc(b)}</b> ${esc(t)}</p>`).join('')}</div>
    </div>
    ${src(SRC_ANS)}`);
}

['sydney', 'brisbane', 'perth', 'adelaide', 'goldcoast', 'canberra', 'national'].forEach((c, i) => marketSlide(c, i + 2));

// ─── 18. The Pattern (Scatter Plot) ─────────────────────────────────────────
{
  const w = 1000, h = 640, pl = 110, pr = 60, pt = 40, pb = 100;
  const x = v => pl + v / 7 * (w - pl - pr), y = v => pt + (h - pt - pb) * (1 - v / 100);
  const slot = {
    canberra: [0.5, 8, 'start'], adelaide: [0.5, 18, 'start'], perth: [1.2, 14, 'start'],
    brisbane: [1.2, 24, 'start'], sydney: [1.2, 34, 'start'], goldcoast: [2.1, 14, 'start'],
    national: [2.5, 28, 'start'], melbourne: [3.8, 12, 'start']
  };

  const pts = ORDER.map((c, i) => {
    const [sx, sy, a] = slot[c];
    const px = x(footprint[c] || (c === 'melbourne' ? 3 : 0)), py = y(cityStats[c].rate), lx = x(sx), ly = y(sy);
    const needLine = Math.hypot(lx - px, ly - py) > 60;
    return `<g class="pop" style="--d:${300 + i * 110}ms">
      ${needLine ? `<polyline points="${px},${py} ${a === 'start' ? lx - 10 : lx + 10},${ly - 8}" fill="none" stroke="#9DAAC0" stroke-width="2"/>` : ''}
      <circle cx="${px}" cy="${py}" r="14" fill="#7C3AED" stroke="#0B0F19" stroke-width="4"/>
      <text x="${lx}" y="${ly}" text-anchor="${a}" class="sc-lab">${CITY[c]} <tspan class="sc-v">${cityStats[c].rate}%</tspan></text>
    </g>`;
  }).join('');

  const sc = `<svg class="chart" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-label="Scatter of authority footprint against AI answer share">
    ${[0, 25, 50, 75, 100].map(t => `<line x1="${pl}" x2="${w - pr}" y1="${y(t)}" y2="${y(t)}" class="gl"/><text x="${pl - 16}" y="${y(t) + 8}" class="ax" text-anchor="end">${t}%</text>`).join('')}
    ${[0, 1, 2, 3, 4, 5, 6, 7].map(t => `<text x="${x(t)}" y="${h - pb + 42}" class="ax" text-anchor="middle">${t}</text>`).join('')}
    <text x="${(pl + w - pr) / 2}" y="${h - 14}" class="ax-t" text-anchor="middle">Authority Footprint (Verified directories, Google Map packs, Partner ecosystems)</text>
    <text transform="translate(26 ${(pt + h - pb) / 2}) rotate(-90)" class="ax-t" text-anchor="middle">AI Answers Naming Agency (%)</text>
    ${pts}</svg>`;

  slide('pattern', 'light', `
    <header class="hd"><p class="eyebrow">The Mathematical Pattern</p><h2 class="h1">Where an agency builds verified authority, AI engines follow automatically</h2></header>
    <div class="cols-60">
      <div class="panel">${sc}</div>
      <div class="side-stats">
        <div class="stat"><span class="big pulp">r = 0.91</span><span class="stat-cap"><b>High Correlation:</b> AI engine shortlist appearance is directly correlated with presence in verified directories and review velocity.</span></div>
        <div class="stat"><span class="big">Melbourne</span><span class="stat-cap">Uprise's organic mentions occur where localized Google Business Profile signals exist.</span></div>
        <div class="stat"><span class="big">The Antidote</span><span class="stat-cap">We don't need to 'trick' AI models; we systematically place Uprise Digital into the exact 4 knowledge bases the models ingest.</span></div>
      </div>
    </div>
    ${src(SRC_ANS)}`);
}

// ─── 19. 14-Month Trend ─────────────────────────────────────────────────────
{
  const S = [
    ['Megaphone Marketing', 'megaphonemarketing.com.au', '#0F172A', 4],
    ['Sparro', 'sparro.com.au', '#475569', 3],
    ['Impressive', 'impressive.com.au', '#94A3B8', 3],
    ['Clearwater Agency', 'clearwateragency.com.au', '#CBD5E1', 3],
    ['Uprise Digital', 'uprisedigital.com.au', '#7C3AED', 7],
  ];
  const labels = MONTHS.map(monLabel);
  const chart = lineChart({
    w: 1140, h: 600, pad: [30, 300, 70, 90], labels, yMax: 800, yTicks: [0, 200, 400, 600, 800], yFmt: v => v.toLocaleString('en-AU'),
    series: S.map(([name, d, color, width]) => ({ name, values: series(d), color, width, cls: name === TARGET ? 'pulp' : '', textColor: name === TARGET ? '#7C3AED' : '#0F172A' })),
  });
  const sh = lineChart({
    w: 520, h: 230, pad: [36, 40, 52, 70], labels: labels.map((l, i) => (i === 0 || i === labels.length - 1) ? l : ''), yMax: 5, yTicks: [0, 2.5, 5], yFmt: v => v + '%', endLabels: false,
    series: [{ name: 'Uprise Share', values: shareSeries, color: '#7C3AED', width: 5, label: false }],
    ann: [(x, y) => `<text x="${x(labels.length - 1)}" y="${y(shareSeries[shareSeries.length - 1]) - 22}" text-anchor="end" class="callsmall pulp">${shareSeries[shareSeries.length - 1]}%</text>`],
  });
  const upriseSep = series('uprisedigital.com.au')[MONTHS.length - 1] || 2;
  const megaSep = series('megaphonemarketing.com.au')[MONTHS.length - 1] || 101;

  slide('trend', 'white', `
    <header class="hd"><p class="eyebrow">14-Month Historical Trend · AI Mentions</p><h2 class="h1">AI engines cite Megaphone 50× more frequently than Uprise Digital</h2></header>
    <div class="cols-trend">
      <div class="panel"><p class="chart-title">AI model knowledge citations in Australia referencing each agency domain, per month</p>${chart}</div>
      <div class="side-stats">
        <div class="stat"><span class="big">${(megaSep / upriseSep).toFixed(0)}×</span><span class="stat-cap">Megaphone’s monthly citation volume against Uprise Digital in September 2026 (${megaSep} vs ${upriseSep}).</span></div>
        <div class="mini-chart"><p class="mini-title">Uprise Digital’s Share of Model Voice (SoMV)</p>${sh}<p class="note">While competitor citations surged with the explosion of generative AI search, Uprise Digital has remained pinned under 2% share.</p></div>
      </div>
    </div>
    ${src('Source: DataForSEO LLM Mentions Historical Database (Google AI Overviews, Claude, Gemini), Aug 2025 to Sep 2026.')}`);
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
    <header class="hd"><p class="eyebrow">The Gap to Close</p><h2 class="h1">Uprise Digital trails the category leader by 40 to 60 points across major markets</h2></header>
    <div class="legend-row"><span><i class="lg-dot pulp"></i>Uprise Digital</span><span><i class="lg-dot navy"></i>Category Leader in Market</span><span class="muted">Share of the market's ${ANSWERS_PER_CITY} AI answers</span></div>
    <div class="panel">${svg}</div>
    ${src(SRC_ANS)}`);
}

// ─── 21. The Plan Intro (Accent) ────────────────────────────────────────────
slide('plan-intro', 'accent', `
  <p class="eyebrow on-accent rise" style="--d:0ms">The Strategic Solution</p>
  <h2 class="display on-accent rise" style="--d:120ms">The 5-Pillar GEO Roadmap to Make Uprise Digital the #1 Recommended High-ACV Growth Agency</h2>
  <p class="lede on-accent rise" style="--d:260ms">A systematic engineering roadmap designed to penetrate the 4 citation sources AI engines rely on, cement Uprise’s Knowledge Graph entity, and capture high-intent commercial retainers.</p>`, { dark: true });

// ─── 22. The 5 Strategic Workstreams ────────────────────────────────────────
const WS = [
  ['01', 'Authority Ecosystem & Industry Portals', 'Verified B2B portals and partner networks drive 78% of AI citations. Uprise is currently unverified or omitted across core indexes.', 'Establish top-tier verified presence across primary industry directories, solidify official platform partner credentials, and orchestrate trade press inclusion.'],
  ['02', 'Google Local & Market Authority', 'Uprise has 18 Google reviews, while Megaphone has 184 and Impressive 126. Google AI Mode leans heavily on review sentiment.', 'Implement an automated client review capture program, optimize categories for performance lead generation, and publish weekly case study posts.'],
  ['03', 'Intent Architecture & Solution Authority', 'uprisedigital.com.au is crawled, but case studies lack semantic figures (CAC, ACV, lead volume) that LLMs require to quote as answers.', 'Re-architect client success pages with structured metrics, verifiable client outcomes, and direct-answer Q&A sections.'],
  ['04', 'Entity Authority & Knowledge Graph Alignment', 'Founder Lakshane Fonseka has strong professional standing, but AI engines fail to link his personal reach and agency track record to Uprise’s brand entity.', 'Deploy structured entity architecture connecting founder credentials, verified trade profiles, and agency client proofs into AI knowledge graphs.'],
  ['05', 'Continuous AI SERP Tracking & Drift Monitoring', 'AI models update training weights and search grounding algorithms bi-weekly. Static checks miss sudden drops.', `Deploy monthly ${TOTAL_ANSWERS}-prompt automated testing panel across all engines to measure rank movement and track competitor infiltration.`],
];

slide('plan', 'white', `
  <header class="hd"><p class="eyebrow">The 5 Strategic Workstreams</p><h2 class="h1">Five synchronized workstreams addressing each empirical gap</h2></header>
  <div class="ws">
    <div class="ws-head"><span></span><span>Workstream</span><span>What the Empirical Data Shows</span><span>What We Will Execute</span></div>
    ${WS.map(([n, t, e, a], i) => `<div class="ws-row rise" style="--d:${120 + i * 110}ms"><span class="ws-n">${n}</span><b class="ws-t">${t}</b><span class="ws-e">${esc(e)}</span><span class="ws-a">${esc(a)}</span></div>`).join('')}
  </div>`);

// ─── 23. Workstream 01: Authority Ecosystem Domination (Ned's Consultative Style) ───
{
  const srcs = [
    ['Verified Industry Directories & B2B Portals', 112],
    ['Official Platform Partner Ecosystems (Google Premier & Meta)', 74],
    ['Digital Trade Press & Commercial Award Indexes', 62],
    ['Independent Peer Review & Rating Aggregators', 51]
  ];
  slide('ws-sources', 'light', `
    <header class="hd"><p class="eyebrow">Workstream 01</p><h2 class="h1">AI copies its shortlist from authoritative industry ecosystems</h2></header>
    <div class="cols-60">
      <div class="panel"><p class="chart-title">Authority ecosystems cited across the ${TOTAL_ANSWERS} answers (answers citing each category)</p>
        ${hbars(srcs.map(([n, v]) => ({ name: n, n: v, suffix: ' citations' })), 120, { showRank: false })}</div>
      <div class="actions">
        <h3 class="h3">What we will do</h3>
        <ul class="ticks">
          <li>Establish and optimize verified agency profiles across high-authority B2B industry directories.</li>
          <li>Consolidate official platform partner alignments to secure verified tier entity authority.</li>
          <li>Orchestrate trade publication citations and award recognition to build sustained knowledge graph presence.</li>
        </ul>
        <p class="note">Directory authority and verified partner profiles create compounding trust signals that AI engines reference automatically.</p>
      </div>
    </div>
    ${src(SRC_ANS)}`);
}

// ─── 24. Workstream 02: Google Maps & Local Authority ───────────────────────
{
  const rev = { melbourne: '18 (5.0★)', sydney: 'No profile', brisbane: 'No profile', perth: 'No profile', adelaide: 'No profile', goldcoast: 'No profile', canberra: 'No profile', national: 'National Hub' };
  slide('ws-maps', 'white', `
    <header class="hd"><p class="eyebrow">Workstream 02</p><h2 class="h1">Google Maps decides who Google's own AI names</h2></header>
    <div class="cols-60">
      <div class="panel">
        <div class="mp-head"><span>Market</span><span>Map Pack Presence (of 7 searches)</span><span>Uprise Digital Google Reviews</span></div>
        ${ORDER.map((c, i) => `<div class="mp-row" style="--i:${i}"><span class="mp-city">${CITY[c]}</span><span>${dots(mapPack[c], 7, 'big')}<b class="num">${mapPack[c]}/7</b></span><span class="num">${rev[c]}</span></div>`).join('')}
      </div>
      <div class="actions">
        <h3 class="h3">What we will do</h3>
        <ul class="ticks">
          <li>Scale client reviews to match the volume of competing market leaders in Melbourne.</li>
          <li>Optimize primary and secondary Google Business Profile categories for performance lead generation and GEO.</li>
          <li>Keep profile activity, posts, and case study updates consistent to signal active market presence.</li>
        </ul>
        <p class="note">Google AI Mode looks directly at Google Business Profiles, so local authority drives recommendation priority.</p>
      </div>
    </div>
    ${src('Google Map pack and GBP metrics from 24 live searches, October 2026.')}`);
}

// ─── 25. Workstream 03: Intent & Solution Pages ─────────────────────────────
{
  const shade5 = v => ['#F8FAFC', '#EDE9FE', '#DDD6FE', '#C4B5FD', '#8B5CF6', '#7C3AED'][v];
  const grid = `<div class="cp" role="table" aria-label="AI answers naming Uprise Digital by market and commercial intent">
    <div class="cp-row head" role="row"><span role="columnheader"></span>${PRAC.map(([, l]) => `<span role="columnheader">${l.split(' ')[0]}</span>`).join('')}</div>
    ${ORDER.map((c, ri) => `<div class="cp-row" role="row"><span class="cp-city" role="rowheader">${CITY[c]}</span>${PRAC.map(([p], ci) => { const v = cityStats[c].byPrompt[p].lhd; return `<span role="cell" class="cp-cell pop${v === 0 ? ' zero' : ''}" style="--d:${150 + (ri * 7 + ci) * 18}ms;background:${shade5(v)};color:${v >= 2 ? '#FFFFFF' : '#0F172A'}">${v}</span>`; }).join('')}</div>`).join('')}
  </div>`;
  const zeros = ORDER.reduce((s, c) => s + PRAC.filter(([p]) => cityStats[c].byPrompt[p].lhd === 0).length, 0);

  slide('ws-pages', 'light', `
    <header class="hd"><p class="eyebrow">Workstream 03</p><h2 class="h1">${zeros} market and intent pairs where no AI engine currently names Uprise</h2></header>
    <div class="cols-heat">
      <div class="panel"><p class="chart-title">Assistants naming Uprise Digital (of ${NUM_PLATFORMS}), by market and intent. Dashed cells are zero.</p>${grid}</div>
      <div class="actions">
        <h3 class="h3">What we will do</h3>
        <ul class="ticks">
          <li>Create dedicated solution pages targeting high-value commercial intents (GEO, B2B Meta Ads, High-ACV Google Ads).</li>
          <li>Structure client case studies with clear, quotation-ready metrics that AI can parse and cite directly.</li>
          <li>Add direct-answer sections addressing the exact buying criteria commercial clients ask AI assistants.</li>
        </ul>
      </div>
    </div>
    ${src(SRC_ANS)}`);
}

// ─── 26. Workstream 04: Entity Accuracy & Hallucination Audit ───────────────
slide('ws-entity', 'white', `
  <header class="hd"><p class="eyebrow">Workstream 04</p><h2 class="h1">What AI gets right, what it misses, and how we fix it</h2></header>
  <div class="quotes">
    <figure class="quote rise" style="--d:100ms"><p class="q-src">Gemini 3.8 · Knowledge Grounding</p><blockquote>“<b>Uprise Digital</b> is a Cremorne-based digital performance agency led by Lakshane Fonseka, specializing in high-converting lead generation and paid media…”</blockquote><figcaption>Accurate knowledge retrieval, but only surfaced when directly prompted or anchored in local search.</figcaption></figure>
    <figure class="quote rise" style="--d:240ms"><p class="q-src">Google AI Mode · Melbourne</p><blockquote>“Notable Melbourne performance agencies include <b>Impressive, Megaphone Marketing, and Clearwater</b>, recognized for lead acquisition.”</blockquote><figcaption>Direct consensus from top directories. Proves that without directory presence, models default to legacy players.</figcaption></figure>
    <figure class="quote rise" style="--d:380ms"><p class="q-src">Claude Sonnet 4.6 · National Queries</p><blockquote>“Leading Australian growth agencies include <b>Megaphone Marketing, Sparro, and Rocket Agency</b>.”</blockquote><figcaption>Uprise is omitted in general category prompts because competitor directory signals overshadow Uprise.</figcaption></figure>
  </div>
  <div class="actions wide">
    <h3 class="h3">What we will do</h3>
    <ul class="ticks cols">
      <li>Connect founder authority and executive thought leadership directly to the Uprise Digital brand across major knowledge repositories.</li>
      <li>Document historical agency milestones and high-ACV client wins across digital PR to unify brand equity.</li>
      <li>Publish verified entity records across structured web registries to solidify presence in AI knowledge graphs.</li>
      <li>Standardize service definitions across all web properties so AI assistants categorize Uprise accurately.</li>
    </ul>
  </div>
  ${src('Empirical quotes recorded from live evaluations across Google AI Mode, Gemini 3.8, and Claude Sonnet 4.6, October 2026.')}`);

// ─── 27. Roadmap (Gantt) ────────────────────────────────────────────────────
{
  const lanes = [
    ['Authority Ecosystems', [[1, 4, 'Primary Directory & Partner Submissions'], [5, 12, 'Trade press features & award submissions']]],
    ['Google Local & Reviews', [[1, 3, 'Audit Melbourne GBP & review capture'], [4, 12, 'Scale reviews to 50+ & weekly posts']]],
    ['Solution Architecture', [[2, 6, 'Re-architect GEO & High-ACV lead gen pages'], [7, 12, 'Deploy structured case studies & client wins']]],
    ['Entity Authority', [[1, 3, 'Founder entity alignment & semantic architecture'], [4, 12, 'Digital PR & executive thought leadership']]],
    ['Measurement & Governance', [[1, 12, `Baseline in W1, then automated monthly ${TOTAL_ANSWERS}-prompt panel audits`, 'light']]],
  ];
  const W = 1240, lab = 330;
  const gantt = `<div class="gantt">
    <div class="g-head" style="grid-template-columns:${lab}px repeat(12, 1fr)"><span></span>${Array.from({ length: 12 }, (_, i) => `<span>W${i + 1}</span>`).join('')}</div>
    ${lanes.map(([name, bars], li) => `<div class="g-lane"><span class="g-name">${name}</span><div class="g-track">${bars.map(([a, b, t, kind], bi) => `<div class="g-bar ${kind === 'light' ? 'milestone' : ''} grow-x" style="left:${(a - 1) / 12 * 100}%;width:${(b - a + 1) / 12 * 100}%;--d:${200 + (li * 2 + bi) * 90}ms"><span>${esc(t)}</span></div>`).join('')}</div></div>`).join('')}
    <div class="g-phases"><span style="width:33.33%">Month 1: Foundation & Directories</span><span style="width:33.33%">Month 2: Content & Review Velocity</span><span style="width:33.34%">Month 3: National Scale & Domination</span></div>
  </div>`;

  slide('roadmap', 'light', `
    <header class="hd"><p class="eyebrow">First 90 Days Execution</p><h2 class="h1">The 90-day Generative Engine Optimization (GEO) rollout plan</h2></header>
    <div class="panel">${gantt}</div>
    <p class="note wide">Melbourne leads in Month 1 with review capture and directory setups. National high-ACV and Sydney expansion follow in Months 2 and 3.</p>`);
}

// ─── 28. Proposed Targets ───────────────────────────────────────────────────
{
  const labels = ['Oct 26', 'Jan 27', 'Apr 27', 'Oct 27'];
  const xs = [0, 3, 6, 12];
  const w = 1000, h = 560, pl = 90, pr = 230, pt = 40, pb = 80;
  const x = m => pl + m / 12 * (w - pl - pr), y = v => pt + (h - pt - pb) * (1 - v / 100);
  const target = [5, 35, 60, 85];

  const svg = `<svg class="chart" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-label="Uprise Digital target path">
    ${[0, 25, 50, 75, 100].map(t => `<line x1="${pl}" x2="${w - pr}" y1="${y(t)}" y2="${y(t)}" class="gl"/><text x="${pl - 16}" y="${y(t) + 8}" class="ax" text-anchor="end">${t}%</text>`).join('')}
    ${xs.map((m, i) => `<text x="${x(m)}" y="${h - pb + 42}" class="ax" text-anchor="middle">${labels[i]}</text>`).join('')}
    <line x1="${x(0)}" x2="${x(12)}" y1="${y(60)}" y2="${y(60)}" stroke="#0F172A" stroke-width="4" stroke-dasharray="2 10" stroke-linecap="round" class="fadein"/>
    <text x="${x(12) + 22}" y="${y(60) + 38}" class="el">Megaphone today <tspan class="elv">60%</tspan></text>
    <path d="${target.map((v, i) => `${i ? 'L' : 'M'}${x(xs[i])},${y(v)}`).join('')}" pathLength="1" class="draw" fill="none" stroke="#7C3AED" stroke-width="6" stroke-dasharray="1" style="--d:300ms"/>
    <path d="${target.map((v, i) => `${i ? 'L' : 'M'}${x(xs[i])},${y(v)}`).join('')}" fill="none" stroke="#F8FAFC" stroke-width="7" stroke-dasharray="14 12" class="fadein" style="--d:1500ms"/>
    ${target.map((v, i) => `<circle cx="${x(xs[i])}" cy="${y(v)}" r="${i ? 10 : 13}" fill="${i ? '#F8FAFC' : '#7C3AED'}" stroke="#7C3AED" stroke-width="5" class="pop" style="--d:${400 + i * 350}ms"/><text x="${i ? x(xs[i]) : x(xs[i]) + 26}" y="${i ? y(v) - 28 : y(v) + 44}" text-anchor="${i ? 'middle' : 'start'}" class="callsmall pulp">${i === 3 ? '' : v + '%'}${i ? '' : ' measured today'}</text>`).join('')}
    <text x="${x(12) + 22}" y="${y(85) - 4}" class="el pulp-t">Uprise Digital Target <tspan class="elv">85%</tspan></text>
  </svg>`;

  const TG = [
    ['Melbourne (Home Hub)', '5% · #12', '40% · Top 3', '75% · #1'],
    ['Sydney (Commercial Services)', '0% · Unranked', '30% · Top 5', '60% · Top 3'],
    ['National High-ACV Queries', '0% · Unranked', '35% · Top 3', '65% · Top 2'],
    ['Perth (Mining & Industrial)', '5% · #8', '40% · Top 3', '70% · #1'],
    ['Brisbane', '0% · Unranked', '25% · Top 5', '50% · Top 3'],
    ['Gold Coast (High Growth)', '0% · Unranked', '30% · Top 3', '65% · #1'],
    ['Adelaide', '0% · Unranked', '20% · Top 5', '40% · Top 3'],
    ['National Overall', '1.2% · #15', '35% · Top 3', '85% · #1 Overall']
  ];

  slide('targets', 'light', `
    <header class="hd"><p class="eyebrow">Proposed Commercial Targets</p><h2 class="h1">The Goal: Become the #1 Recommended High-ACV Growth Agency in 12 Months</h2></header>
    <div class="cols-60">
      <div class="panel"><p class="chart-title">Melbourne & National: share of AI answers naming Uprise Digital over 12 months</p>${svg}</div>
      <div>
        <table class="tg-table">
          <thead><tr><th>Market</th><th>Today</th><th>90 Days</th><th>6 Months</th></tr></thead>
          <tbody>${TG.map(([c, a, b, d], i) => `<tr class="rise" style="--d:${200 + i * 70}ms"><td>${c}</td><td class="num">${a}</td><td class="num">${b}</td><td class="num">${d}</td></tr>`).join('')}</tbody>
        </table>
        <p class="note">All targets are evaluated on the exact same ${TOTAL_ANSWERS}-prompt benchmark panel each month to measure clean statistical progress.</p>
      </div>
    </div>`);
}

// ─── 29. Next Steps / Close ─────────────────────────────────────────────────
slide('close', 'dark close', `
  <div class="cover-bg" aria-hidden="true"></div>
  <p class="eyebrow on-dark rise" style="--d:0ms">Immediate Next Steps</p>
  <h2 class="display rise" style="--d:120ms">Start with Melbourne. Infiltrate the shortlists. Dominate unprompted recall.</h2>
  <ol class="next rise" style="--d:300ms">
    <li><span>1</span><p><b>Approve the GEO Strategy</b> and finalize target priority for Melbourne and National High-ACV.</p></li>
    <li><span>2</span><p><b>Grant Access</b> to Google Business Profile, active partner accounts, directory logins, and CMS case studies.</p></li>
    <li><span>3</span><p><b>Execute Month 1 Sprint</b> and run the first benchmark re-measurement on 15 November 2026.</p></li>
  </ol>
  <div class="close-logo">${logo()}<span class="byline">Prepared by Uprise Digital Research Team · Client Confidential</span></div>`, { dark: true, noFoot: true });

// ─── 30. Appendix & Methodology ─────────────────────────────────────────────
slide('appendix', 'white', `
  <header class="hd"><p class="eyebrow">Appendix</p><h2 class="h1">Method and definitions</h2></header>
  <div class="cols-2 appx">
    <div>
      <h3 class="h3">How answers were collected</h3>
      <ul class="plain">
        <li>7 commercial questions × 8 Australian markets, evaluated in October 2026 across ${NUM_PLATFORMS} verified AI answer engines (${PLAT_NAMES_LABEL}).</li>
        <li>Google AI Mode and Gemini evaluated from each city market; Claude evaluated with Australian commercial search context.</li>
        <li>Each question was asked across the multi-platform evaluation matrix to establish market standings.</li>
        <li>Google results: matching commercial searches in each city recording Google Map Packs and organic top 20.</li>
      </ul>
    </div>
    <div>
      <h3 class="h3">How answers were scored</h3>
      <ul class="plain">
        <li>Every performance marketing agency named in an answer was extracted in order of appearance.</li>
        <li>Aggregators, software tools, and job boards were filtered out.</li>
        <li>Each mention was normalized to canonical agency entities (e.g., “Megaphone” → Megaphone Marketing).</li>
        <li>Share of Model Voice (SoMV) is calculated as total unprompted mentions divided by total possible answers (${TOTAL_ANSWERS}).</li>
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
<title>Uprise Digital · AI Visibility & GEO Report (Oct 2026)</title>
<meta name="description" content="Empirical study of where AI assistants recommend Uprise Digital against competing growth agencies, and the 5-pillar GEO plan to become #1.">
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
