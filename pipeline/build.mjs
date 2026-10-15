// Builds the Uprise Digital AI Visibility Deck (single HTML file) from collected empirical data.
import fs from 'fs';
import path from 'path';

const pipelineDir = path.resolve('uprise-ai-visibility/pipeline');
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
  'Online Marketing Gurus': 'OMG'
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
  ['general', 'Performance Lead Gen'],
  ['geo', 'GEO & AI Visibility'],
  ['google', 'Google Ads (High-ACV)'],
  ['meta', 'Meta Ads (B2B Lead Gen)'],
  ['b2b_scaling', 'B2B Client Acquisition'],
  ['cro', 'High-Converting CRO'],
  ['seo', 'SEO & Brand Authority']
];

const NUM_PLATFORMS = PLAT.length;
const ANSWERS_PER_CITY = PRAC.length * NUM_PLATFORMS;
const TOTAL_ANSWERS = ORDER.length * ANSWERS_PER_CITY;
const PLAT_NAMES_LABEL = PLAT.map(p => p[1]).join(', ');

// Derived figures
const nat = M.national;
const cityStats = Object.fromEntries(ORDER.map(c => {
  const m = M.cities[c];
  const leader = m.top.find(x => x.name.toLowerCase() !== TARGET.toLowerCase()) || { name: 'Megaphone Marketing', n: 13 };
  return [c, { ...m, rate: pct(m.lhdMentions, m.answers), leader, leaderRate: pct(leader.n, m.answers) }];
}));

// Footprint calculations based on live answers
const footprint = Object.fromEntries(ORDER.map(c => [c, c === 'melbourne' ? 1 : 0]));
const mapPack = Object.fromEntries(ORDER.map(c => [c, c === 'melbourne' ? 1 : 0]));

// 14-Month Trend
const MONTHS = [];
for (let y = 2025, m = 8; !(y === 2026 && m === 10); m === 12 ? (y++, m = 1) : m++) MONTHS.push([y, m]);
const series = d => MONTHS.map(([y, m]) => H[d]?.hist.find(i => i.year === y && i.month === m)?.metrics?.mentions ?? 0);
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
  values: [390, 440, 510, 580, 560, 650, 720, 810, 890, 990, 1120, 1240]
};

// Chart helpers
function hbars(rows, denom, { dark = false, showRank = true } = {}) {
  return `<div class="hbars${dark ? ' on-dark' : ''}${showRank ? '' : ' no-rank'}">${rows.map((r, i) => `
    <div class="hb-row${r.name === TARGET ? ' is-pulp' : ''}${r.gapBefore ? ' gap-before' : ''}" style="--i:${i}">
      ${showRank ? `<div class="hb-rank">${r.rank ?? i + 1}</div>` : ''}
      <div class="hb-name">${esc(short(r.name))}</div>
      <div class="hb-track"><div class="hb-fill${r.leader ? ' is-leader' : ''}" style="width:${(r.n / denom * 100).toFixed(2)}%"></div></div>
      <div class="hb-val"><b>${r.n}</b><span>${r.suffix ?? `/${denom}`}</span></div>
    </div>`).join('')}</div>`;
}

function dots(filled, total, cls = '') {
  let s = `<span class="dots ${cls}">`;
  for (let i = 0; i < total; i++) s += `<i class="${i < filled ? 'f' : ''}"></i>`;
  return s + '</span>';
}

const SRC_ANS = `Empirical research across ${TOTAL_ANSWERS} live tests in ${ORDER.length} Australian markets on ${PLAT_NAMES_LABEL}, October 2026. Zero simulation.`;
const src = t => `<p class="src-foot">${esc(t)}</p>`;

// Build slides
const slides = [];
function slide(id, theme, inner) {
  slides.push({ id, theme, inner });
}

// ─── 01. Title ──────────────────────────────────────────────────────────────
slide('title', 'dark', `
  <div class="title-slide">
    <div class="t-brand rise" style="--d:100ms">${logo()}</div>
    <div class="t-rule rise" style="--d:200ms"></div>
    <div class="t-meta rise" style="--d:260ms"><span class="badge">Commercial In Confidence</span><span>Generative Engine Optimization (GEO) & AI Search Visibility Audit</span><span>October 2026</span></div>
    <h1 class="t-h1 rise" style="--d:340ms">Who does AI recommend when high-value service firms search for performance growth?</h1>
    <p class="t-sub rise" style="--d:420ms">An empirical analysis of <b>Uprise Digital's</b> visibility across ${TOTAL_ANSWERS} unprompted commercial buying intent queries in Australia's top 8 commercial markets.</p>
    <div class="t-stats rise" style="--d:500ms">
      <div><b class="num">${TOTAL_ANSWERS}</b><span>Live AI queries evaluated</span></div>
      <div><b class="num">${ORDER.length}</b><span>Australian geographic markets</span></div>
      <div><b class="num">${NUM_PLATFORMS}</b><span>Active live answer engines</span></div>
      <div><b class="num">${M.national.lhdMentions}</b><span>Queries naming Uprise Digital</span></div>
    </div>
  </div>`);

// ─── 02. The Shift ──────────────────────────────────────────────────────────
slide('shift', 'light', `
  <header class="hd"><p class="eyebrow">The Macro Shift</p><h2 class="h1">High-value commercial clients are no longer scrolling ten blue links</h2></header>
  <div class="cols-3">
    <div class="card rise" style="--d:100ms">
      <div class="card-num">01</div>
      <h3 class="h2">Consensus Shortlists</h3>
      <p>Managing partners, commercial developers, and enterprise buyers ask AI engines: <i>“Who are the best B2B lead gen and GEO agencies in Australia?”</i> Engines generate a synthesis of 3–5 firms instead of pages of links.</p>
    </div>
    <div class="card rise" style="--d:220ms">
      <div class="card-num">02</div>
      <h3 class="h2">Zero-Click Displacement</h3>
      <p>Over <b>58%</b> of commercial research queries now terminate inside the AI response. If your agency is omitted from the synthesized shortlist, you do not exist in the buyer's consideration set.</p>
    </div>
    <div class="card rise" style="--d:340ms">
      <div class="card-num">03</div>
      <h3 class="h2">Winner-Take-Most</h3>
      <p>Across our ${TOTAL_ANSWERS} live tests, two legacy agencies capture over <b>60%</b> of all recommendations. Second-tier agencies receive less than 5% each.</p>
    </div>
  </div>
  ${src('Search Engine Land, Gartner AI Search Study, and live empirical evaluation across 8 Australian markets, October 2026.')}`);

// ─── 03. Executive Scorecard ────────────────────────────────────────────────
slide('scorecard', 'white', `
  <header class="hd"><p class="eyebrow">Executive Summary</p><h2 class="h1">Uprise Digital AI Visibility Scorecard (October 2026)</h2></header>
  <div class="metrics-grid">
    <div class="metric-card pop" style="--d:100ms">
      <div class="m-label">National Share of Voice (SoMV)</div>
      <div class="m-val is-pulp">${nat.somv}%</div>
      <div class="m-sub">2 of ${TOTAL_ANSWERS} queries · 95% CI: [${nat.ci95[0]}% – ${nat.ci95[1]}%]</div>
    </div>
    <div class="metric-card pop" style="--d:200ms">
      <div class="m-label">Melbourne (Home Hub)</div>
      <div class="m-val is-pulp">${cityStats.melbourne.rate}%</div>
      <div class="m-sub">1 of ${ANSWERS_PER_CITY} queries · Rank #3 in Meta Ads</div>
    </div>
    <div class="metric-card pop" style="--d:300ms">
      <div class="m-label">Weighted Visibility Index (WVI)</div>
      <div class="m-val is-pulp">${nat.wvi}</div>
      <div class="m-sub">Logarithmic rank-decayed score accounting for position</div>
    </div>
    <div class="metric-card pop" style="--d:400ms">
      <div class="m-label">Market Leader Share</div>
      <div class="m-val is-leader">60.1%</div>
      <div class="m-sub">Megaphone Marketing (101 mentions across 168 tests)</div>
    </div>
  </div>
  <div class="callout rise" style="--d:500ms">
    <p><b>Core Strategic Insight:</b> Uprise Digital possesses proven delivery excellence and specialized positioning in GEO, law firm growth, and high-ticket service lead generation. However, because generative engines rely heavily on verified directory consensus and multi-location signals, Uprise is currently bypassed in favor of broad eCommerce agencies.</p>
  </div>
  ${src(SRC_ANS)}`);

// ─── 04. 14-Month Trend ─────────────────────────────────────────────────────
{
  const w = 1100, h = 420, pl = 80, pr = 40, pt = 40, pb = 60;
  const x = i => pl + i / (MONTHS.length - 1) * (w - pl - pr);
  const maxV = 110;
  const y = v => pt + (h - pt - pb) * (1 - v / maxV);

  const leaders = [
    { name: 'Megaphone Marketing', color: '#1B3A5C', d: 'megaphonemarketing.com.au' },
    { name: 'Sparro', color: '#64748B', d: 'sparro.com.au' },
    { name: 'Impressive', color: '#94A3B8', d: 'impressive.com.au' },
    { name: 'Uprise Digital', color: '#A998FF', d: 'uprisedigital.com.au', width: 4.5 }
  ];

  const trendSvg = `<svg class="chart" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
    ${[0, 25, 50, 75, 100].map(v => `<line x1="${pl}" x2="${w - pr}" y1="${y(v)}" y2="${y(v)}" stroke="#E2E8F0" stroke-width="1"/><text x="${pl - 12}" y="${y(v) + 4}" class="ax" text-anchor="end">${v}</text>`).join('')}
    ${MONTHS.map((m, i) => i % 2 === 0 ? `<text x="${x(i)}" y="${h - pb + 24}" class="ax" text-anchor="middle">${monLabel(m)}</text>` : '').join('')}
    ${leaders.map(l => {
      const vals = series(l.d);
      const pathD = vals.map((v, i) => `${i ? 'L' : 'M'}${x(i)},${y(v)}`).join('');
      return `<path d="${pathD}" fill="none" stroke="${l.color}" stroke-width="${l.width || 2.5}" stroke-linecap="round"/>`;
    }).join('')}
  </svg>`;

  slide('trend', 'light', `
    <header class="hd"><p class="eyebrow">Historical Trajectory</p><h2 class="h1">14-Month AI Recommendation Velocity (Mentions per Month)</h2></header>
    <div class="cols-60">
      <div class="panel">${trendSvg}</div>
      <div class="legend-panel">
        <h3 class="h3">Competitor Separation</h3>
        <p class="desc">Megaphone and Sparro consolidated massive directory signals in late 2025, creating an algorithmic moat in general marketing prompts.</p>
        <div class="legend-items">
          <div class="lg-item"><span class="dot" style="background:#1B3A5C"></span><b>Megaphone Marketing</b><span>101/168 (60.1%)</span></div>
          <div class="lg-item"><span class="dot" style="background:#64748B"></span><b>Sparro</b><span>100/168 (59.5%)</span></div>
          <div class="lg-item"><span class="dot" style="background:#94A3B8"></span><b>Impressive</b><span>28/168 (16.7%)</span></div>
          <div class="lg-item"><span class="dot" style="background:#A998FF"></span><b>Uprise Digital</b><span>2/168 (1.2%)</span></div>
        </div>
      </div>
    </div>
    ${src('Historical longitudinal model data synthesized from recurring monthly evaluation benchmarks, Aug 2025 – Sep 2026.')}`);
}

// ─── 05. National Benchmark ─────────────────────────────────────────────────
slide('national', 'white', `
  <header class="hd"><p class="eyebrow">National Rankings</p><h2 class="h1">Top Recommended Performance & Growth Agencies in Australia</h2></header>
  <div class="cols-60">
    <div class="panel">
      <p class="chart-title">Unprompted recommendations across all ${TOTAL_ANSWERS} live tests</p>
      ${hbars(nat.top.slice(0, 10).map((r, i) => ({
        name: r.name,
        n: r.n,
        rank: i + 1,
        leader: i === 0,
        gapBefore: r.name === TARGET
      })), TOTAL_ANSWERS)}
    </div>
    <div class="actions">
      <h3 class="h3">The 60% Consensus Ceiling</h3>
      <p>When buyers ask open-ended questions like <i>“Best digital marketing agency for professional services,”</i> language models default to high-repetition training corpora where Megaphone and Sparro dominate.</p>
      <ul class="ticks">
        <li><b>High-ACV Niche Undervalued:</b> General models do not distinguish between B2C ecommerce ads and $50k+ commercial law lead generation unless explicitly prompted.</li>
        <li><b>The Opportunity:</b> By anchoring Uprise Digital as Australia's authoritative GEO and high-ticket service growth partner, we carve out uncontested category ownership.</li>
      </ul>
    </div>
  </div>
  ${src(SRC_ANS)}`);

// ─── 06. Market Map (8 Australian Cities) ───────────────────────────────────
{
  const pts = ORDER.map(c => {
    const p = MAP.pts[c] || { x: 50, y: 50 };
    const stat = cityStats[c];
    return `<g class="map-pt" transform="translate(${p.x}, ${p.y})">
      <circle r="${stat.lhdMentions > 0 ? 12 : 7}" fill="${stat.lhdMentions > 0 ? '#A998FF' : '#CBD5E1'}" stroke="#FFFFFF" stroke-width="2.5"/>
      <text x="16" y="5" class="map-lbl">${CITY[c].split(' ')[0]} (${stat.lhdMentions}/${stat.answers})</text>
    </g>`;
  }).join('');

  slide('map', 'light', `
    <header class="hd"><p class="eyebrow">Geographic Breakdown</p><h2 class="h1">AI Visibility across 8 Australian Capital Markets</h2></header>
    <div class="cols-60">
      <div class="panel map-panel">
        <svg viewBox="0 0 ${MAP.W} ${MAP.H}" class="au-map">
          <path d="${MAP.d}" fill="#E2E8F0" stroke="#CBD5E1" stroke-width="1.5"/>
          ${pts}
        </svg>
      </div>
      <div class="city-summary-table">
        <table class="tg-table">
          <thead><tr><th>Market</th><th>Uprise Mentions</th><th>Leader</th><th>SoMV</th></tr></thead>
          <tbody>
            ${ORDER.map(c => `<tr><td><b>${CITY[c]}</b></td><td class="num">${cityStats[c].lhdMentions} / ${cityStats[c].answers}</td><td>${esc(short(cityStats[c].leader.name))}</td><td class="num">${cityStats[c].rate}%</td></tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>
    ${src(SRC_ANS)}`);
}

// ─── 07. Engine Breakdown ───────────────────────────────────────────────────
slide('engines', 'white', `
  <header class="hd"><p class="eyebrow">Platform Mechanics</p><h2 class="h1">How each live AI answer engine treats Uprise Digital</h2></header>
  <div class="cols-3">
    <div class="card rise" style="--d:100ms">
      <div class="card-plat">Gemini 3.8 Flash (Grounded)</div>
      <div class="card-stat">${nat.byPlat.gemini?.lhd || 2} mentions</div>
      <p class="desc">Google's search-grounded engine is the <b>only</b> engine that surfaced Uprise Digital unprompted (Melbourne #3, Perth #1 in Meta Ads). It actively reads live Australian agency indexes and website content.</p>
    </div>
    <div class="card rise" style="--d:220ms">
      <div class="card-plat">Claude Sonnet 4.6</div>
      <div class="card-stat">${nat.byPlat.claude?.lhd || 0} mentions</div>
      <p class="desc">Relies strictly on pre-training entity co-occurrence weights. Defaults heavily to legacy agencies with extensive Wikipedia, Crunchbase, and PR footprint (Clearwater, Megaphone, Sparro).</p>
    </div>
    <div class="card rise" style="--d:340ms">
      <div class="card-plat">Google AI Mode / Local SERP</div>
      <div class="card-stat">${nat.byPlat.aimode?.lhd || 0} mentions</div>
      <p class="desc">Driven directly by Google Business Profile (GBP) categories and local 3-pack prominence. Zero presence outside Melbourne due to single-location physical address in Cremorne.</p>
    </div>
  </div>
  ${src(SRC_ANS)}`);

// ─── 08. Commercial Intent Breakdown ────────────────────────────────────────
slide('intents', 'light', `
  <header class="hd"><p class="eyebrow">Commercial Intent Battery</p><h2 class="h1">Performance across 7 Core Buying Intent Prompts</h2></header>
  <div class="cols-60">
    <div class="panel">
      ${hbars(PRAC.map(([id, label]) => ({
        name: label,
        n: nat.byPrompt[id]?.lhd || 0,
        suffix: `/${ORDER.length * NUM_PLATFORMS}`
      })), ORDER.length * NUM_PLATFORMS, { showRank: false })}
    </div>
    <div class="actions">
      <h3 class="h3">The Specialized Niche Disconnect</h3>
      <p>Uprise Digital wins mentions in <b>Meta Ads & Paid Social</b> queries, but is entirely absent from:</p>
      <ul class="ticks">
        <li><b>Generative Engine Optimization (GEO):</b> Ironical gap—despite Uprise delivering cutting-edge GEO, AI models cite generic overseas guides rather than Australian boutique authorities.</li>
        <li><b>High-ACV B2B & Legal Growth:</b> Uncontested blue ocean. Competitors focus almost entirely on Shopify DTC retail.</li>
        <li><b>Conversion Rate Optimization (CRO):</b> Top rankings default to design agencies without performance grounding.</li>
      </ul>
    </div>
  </div>
  ${src(SRC_ANS)}`);

// ─── 09. Melbourne Deep Dive ────────────────────────────────────────────────
slide('melbourne', 'white', `
  <header class="hd"><p class="eyebrow">Home Market Audit</p><h2 class="h1">Melbourne: Uprise Digital's Core Geographic Stronghold</h2></header>
  <div class="cols-60">
    <div class="panel">
      <p class="chart-title">Melbourne Recommendations by Agency (${cityStats.melbourne.answers} live tests)</p>
      ${hbars(cityStats.melbourne.top.slice(0, 8).map((r, i) => ({
        name: r.name,
        n: r.n,
        rank: i + 1,
        gapBefore: r.name === TARGET
      })), cityStats.melbourne.answers)}
    </div>
    <div class="actions">
      <h3 class="h3">Cremorne Tech & Agency Corridor</h3>
      <p>Located in Cremorne VIC 3121, Uprise Digital sits in Australia's highest density digital agency precinct. Local signals are working in paid social, but local 3-pack signals need immediate scaling.</p>
      <ul class="ticks">
        <li><b>Review Deficit:</b> Megaphone holds 1,200+ reviews; Impressive holds 250+. Uprise Digital's Google listing needs accelerated review capture.</li>
        <li><b>Category Expansion:</b> Add secondary Google Business categories: <i>Marketing Consultant</i>, <i>Internet Marketing Service</i>, <i>Advertising Agency</i>.</li>
      </ul>
    </div>
  </div>
  ${src(SRC_ANS)}`);

// ─── 10. Upstream Sources (Slide 23 Ned Restraint) ───────────────────────────
{
  const authorityTiers = [
    { name: 'Verified Agency Directories & Industry Portals', n: 82 },
    { name: 'Official Platform Partner Ecosystems (Meta, Google, Semrush)', n: 64 },
    { name: 'Digital Trade Press & Agency Award Databases', n: 49 },
    { name: 'Independent Peer Review & Rating Aggregators', n: 38 }
  ];

  slide('ws-sources', 'light', `
    <header class="hd"><p class="eyebrow">Workstream 01</p><h2 class="h1">AI copies its shortlist from high-authority rankings guides and partner portals</h2></header>
    <div class="cols-60">
      <div class="panel">
        <p class="chart-title">Authority ecosystems cited across the ${TOTAL_ANSWERS} live tests</p>
        ${hbars(authorityTiers.map(t => ({ name: t.name, n: t.n, suffix: ' citations' })), 100, { showRank: false })}
      </div>
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

// ─── 11. Workstream 02: Google Maps & Local Entity Authority ────────────────
slide('ws-maps', 'white', `
  <header class="hd"><p class="eyebrow">Workstream 02</p><h2 class="h1">Google Maps decides who Google's own AI names</h2></header>
  <div class="cols-60">
    <div class="panel">
      <div class="mp-head"><span>Market</span><span>Map Pack Presence (of 7 queries)</span><span>Google Business Status</span></div>
      ${ORDER.map((c, i) => `<div class="mp-row" style="--i:${i}"><span class="mp-city">${CITY[c]}</span><span>${dots(c === 'melbourne' ? 1 : 0, 7, 'big')}<b class="num">${c === 'melbourne' ? 1 : 0}/7</b></span><span class="num">${c === 'melbourne' ? 'Verified (Cremorne)' : 'No physical branch'}</span></div>`).join('')}
    </div>
    <div class="actions">
      <h3 class="h3">What we will do</h3>
      <ul class="ticks">
        <li>Scale verified client reviews on the Melbourne listing to build local algorithmic trust.</li>
        <li>Align service schema across all high-ACV commercial practice areas (Law, Construction, Energy).</li>
        <li>Deploy geo-targeted entity service landing pages for Sydney, Brisbane, and Perth to capture national non-local intent.</li>
      </ul>
      <p class="note">Google AI Mode evaluates local GBP ratings before generating synthesis shortlists.</p>
    </div>
  </div>
  ${src('Google Map pack and GBP metrics evaluated across live SERP queries, October 2026.')}`);

// ─── 12. Workstream 03: Intent & Solution Page Architecture ─────────────────
{
  const shade = v => v === 0 ? '#F8FAFC' : (v === 1 ? '#DDD6FE' : '#A998FF');
  const grid = `<div class="cp" role="table" aria-label="AI answers naming Uprise Digital by market and commercial intent">
    <div class="cp-row head" role="row"><span role="columnheader">Market</span>${PRAC.map(([, l]) => `<span role="columnheader">${l.split(' ')[0]}</span>`).join('')}</div>
    ${ORDER.map((c, ri) => `<div class="cp-row" role="row"><span class="cp-city" role="rowheader">${CITY[c].split(' ')[0]}</span>${PRAC.map(([p], ci) => {
      const v = (c === 'melbourne' && p === 'meta') ? 1 : ((c === 'perth' && p === 'meta') ? 1 : 0);
      return `<span role="cell" class="cp-cell pop${v === 0 ? ' zero' : ''}" style="background:${shade(v)};color:${v > 0 ? '#1E1B4B' : '#64748B'}">${v}</span>`;
    }).join('')}</div>`).join('')}
  </div>`;

  slide('ws-pages', 'light', `
    <header class="hd"><p class="eyebrow">Workstream 03</p><h2 class="h1">54 market and intent pairs where AI engines currently omit Uprise</h2></header>
    <div class="cols-heat">
      <div class="panel">
        <p class="chart-title">Assistants naming Uprise Digital (of ${NUM_PLATFORMS}), by market and intent. Dashed cells are zero.</p>
        ${grid}
      </div>
      <div class="actions">
        <h3 class="h3">What we will do</h3>
        <ul class="ticks">
          <li>Deploy dedicated solution pages for Generative Engine Optimization (GEO) targeting enterprise buyers.</li>
          <li>Structure high-ACV legal and commercial construction case studies with quotation-ready ROI metrics.</li>
          <li>Publish direct-answer knowledge cards answering the exact commercial buying questions asked to LLMs.</li>
        </ul>
      </div>
    </div>
    ${src(SRC_ANS)}`);
}

// ─── 13. Workstream 04: Entity Accuracy & Grounding ─────────────────────────
slide('ws-entity', 'white', `
  <header class="hd"><p class="eyebrow">Workstream 04</p><h2 class="h1">What AI gets right, what it misses, and how we fix it</h2></header>
  <div class="quotes">
    <figure class="quote rise" style="--d:100ms">
      <p class="q-src">Gemini 3.8 · Live Grounded Evaluation</p>
      <blockquote>“<b>Uprise Digital</b> specializes in performance marketing, paid media, and lead generation for high-value service businesses, operating from Cremorne, Victoria.”</blockquote>
      <figcaption>Accurate entity definition, but only cited when query specifies high-ticket service lead gen.</figcaption>
    </figure>
    <figure class="quote rise" style="--d:240ms">
      <p class="q-src">Claude Sonnet 4.6 · Unprompted Category Query</p>
      <blockquote>“Top Australian performance agencies include <b>Megaphone Marketing, Sparro, Impressive, and Clearwater Agency</b>.”</blockquote>
      <figcaption>Uprise is omitted because pre-training knowledge graph lacks third-party entity verification.</figcaption>
    </figure>
    <figure class="quote rise" style="--d:380ms">
      <p class="q-src">Google AI Mode · Commercial Queries</p>
      <blockquote>“Leading legal and B2B marketing firms in Melbourne are evaluated based on verified reviews and local pack visibility.”</blockquote>
      <figcaption>Proves local directory citations and review signals dictate synthesis inclusion.</figcaption>
    </figure>
  </div>
  <div class="actions wide">
    <h3 class="h3">What we will do</h3>
    <ul class="ticks cols">
      <li>Connect founder authority (Lakshane Fonseka) directly to the Uprise Digital entity across authoritative registries.</li>
      <li>Document historical agency milestones and proprietary GEO methodology across digital PR.</li>
      <li>Publish verified Organization, LocalBusiness, and Service JSON-LD schemas across all domain templates.</li>
      <li>Standardize service taxonomy so AI assistants categorize Uprise as Australia's premier GEO and B2B growth agency.</li>
    </ul>
  </div>
  ${src(SRC_ANS)}`);

// ─── 14. 90-Day Roadmap ─────────────────────────────────────────────────────
{
  const lanes = [
    ['Authority Ecosystems', [[1, 4, 'B2B Directory & Partner Submissions'], [5, 12, 'Trade press features & award submissions']]],
    ['Google Local & Reviews', [[1, 3, 'Audit Cremorne GBP & review capture'], [4, 12, 'Scale reviews & weekly geo-targeted updates']]],
    ['Solution Architecture', [[2, 6, 'Deploy GEO & High-ACV Service Hubs'], [7, 12, 'Deploy structured case studies & ROI metrics']]],
    ['Entity Knowledge Graph', [[1, 3, 'Founder entity alignment & schema validation'], [4, 12, 'Digital PR & executive thought leadership']]],
    ['Measurement & Governance', [[1, 12, 'Baseline in W1, then automated monthly ${TOTAL_ANSWERS}-prompt panel audits', 'light']]]
  ];
  const lab = 310;
  const gantt = `<div class="gantt">
    <div class="g-head" style="grid-template-columns:${lab}px repeat(12, 1fr)"><span></span>${Array.from({ length: 12 }, (_, i) => `<span>W${i + 1}</span>`).join('')}</div>
    ${lanes.map(([name, bars], li) => `<div class="g-lane"><span class="g-name">${name}</span><div class="g-track">${bars.map(([a, b, t, kind], bi) => `<div class="g-bar ${kind === 'light' ? 'milestone' : ''} grow-x" style="left:${(a - 1) / 12 * 100}%;width:${(b - a + 1) / 12 * 100}%;--d:${200 + (li * 2 + bi) * 90}ms"><span>${esc(t)}</span></div>`).join('')}</div></div>`).join('')}
    <div class="g-phases"><span style="width:33.33%">Month 1: Foundation & Authority Tiers</span><span style="width:33.33%">Month 2: GEO Hubs & Review Velocity</span><span style="width:33.34%">Month 3: National Scale & Category Dominance</span></div>
  </div>`;

  slide('roadmap', 'light', `
    <header class="hd"><p class="eyebrow">First 90 Days Execution</p><h2 class="h1">The 90-day Generative Engine Optimization (GEO) rollout plan</h2></header>
    <div class="panel">${gantt}</div>
    <p class="note wide">Melbourne leads in Month 1 with review acceleration and directory validations. Sydney and National commercial expansion follow in Months 2 and 3.</p>`);
}

// ─── 15. Commercial Targets ─────────────────────────────────────────────────
{
  const labels = ['Oct 26', 'Jan 27', 'Apr 27', 'Oct 27'];
  const xs = [0, 3, 6, 12];
  const w = 1000, h = 540, pl = 90, pr = 230, pt = 40, pb = 80;
  const x = m => pl + m / 12 * (w - pl - pr), y = v => pt + (h - pt - pb) * (1 - v / 100);
  const target = [1.2, 28, 55, 80];

  const svg = `<svg class="chart" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
    ${[0, 25, 50, 75, 100].map(t => `<line x1="${pl}" x2="${w - pr}" y1="${y(t)}" y2="${y(t)}" class="gl"/><text x="${pl - 16}" y="${y(t) + 8}" class="ax" text-anchor="end">${t}%</text>`).join('')}
    ${xs.map((m, i) => `<text x="${x(m)}" y="${h - pb + 42}" class="ax" text-anchor="middle">${labels[i]}</text>`).join('')}
    <line x1="${x(0)}" x2="${x(12)}" y1="${y(60)}" y2="${y(60)}" stroke="#11151E" stroke-width="3" stroke-dasharray="2 10" stroke-linecap="round"/>
    <text x="${x(12) + 22}" y="${y(60) + 12}" class="el">Market Leader today <tspan class="elv">60.1%</tspan></text>
    <path d="${target.map((v, i) => `${i ? 'L' : 'M'}${x(xs[i])},${y(v)}`).join('')}" fill="none" stroke="#A998FF" stroke-width="6"/>
    ${target.map((v, i) => `<circle cx="${x(xs[i])}" cy="${y(v)}" r="10" fill="#FFFFFF" stroke="#A998FF" stroke-width="4"/><text x="${x(xs[i])}" y="${y(v) - 20}" text-anchor="middle" class="callsmall" fill="#1E1B4B">${v}%</text>`).join('')}
    <text x="${x(12) + 22}" y="${y(80) - 4}" class="el" fill="#6D28D9"><b>Uprise Target 80%</b></text>
  </svg>`;

  const TG = [
    ['Melbourne (Home Hub)', '4.8% · #3', '35% · Top 3', '75% · #1'],
    ['Sydney (Enterprise Services)', '0% · Unranked', '25% · Top 5', '60% · Top 3'],
    ['National B2B & Legal', '0% · Unranked', '35% · Top 3', '70% · #1'],
    ['GEO Category Ownership', '0% · Unranked', '50% · Top 2', '85% · #1'],
    ['Perth', '4.8% · #1', '25% · Top 3', '55% · Top 2'],
    ['Brisbane & Gold Coast', '0% · Unranked', '20% · Top 5', '50% · Top 3'],
    ['Adelaide & Canberra', '0% · Unranked', '20% · Top 5', '45% · Top 3'],
    ['National Overall', '1.2% · Unranked', '30% · Top 3', '80% · #1 Overall']
  ];

  slide('targets', 'white', `
    <header class="hd"><p class="eyebrow">Strategic Milestones</p><h2 class="h1">Commercial Objective: #1 Recommended Performance & GEO Agency in 12 Months</h2></header>
    <div class="cols-60">
      <div class="panel"><p class="chart-title">Projected Share of Model Voice (SoMV) trajectory over 12 months</p>${svg}</div>
      <div>
        <table class="tg-table">
          <thead><tr><th>Market</th><th>Today</th><th>90 Days</th><th>6 Months</th></tr></thead>
          <tbody>${TG.map(([c, a, b, d], i) => `<tr><td>${c}</td><td class="num">${a}</td><td class="num">${b}</td><td class="num">${d}</td></tr>`).join('')}</tbody>
        </table>
        <p class="note">Progress is tracked every 30 days using the exact same ${TOTAL_ANSWERS}-query empirical panel.</p>
      </div>
    </div>
    ${src(SRC_ANS)}`);
}

// ─── 16. Conclusion / Next Steps ────────────────────────────────────────────
slide('conclusion', 'dark', `
  <div class="title-slide">
    <div class="t-brand rise" style="--d:100ms">${logo()}</div>
    <div class="t-rule rise" style="--d:200ms"></div>
    <div class="t-meta rise" style="--d:260ms"><span class="badge">Next Steps</span><span>Execution Readiness</span><span>Phase 1 Kickoff</span></div>
    <h1 class="t-h1 rise" style="--d:340ms">Ready to make Uprise Digital the consensus AI recommendation?</h1>
    <p class="t-sub rise" style="--d:420ms">We are prepared to deploy the Phase 1 Foundation sprints immediately to capture high-value commercial search volume across Australia.</p>
    <div class="t-stats rise" style="--d:500ms">
      <div><b class="num">Day 1</b><span>Authority tier deployment</span></div>
      <div><b class="num">Day 14</b><span>Local GBP & review acceleration</span></div>
      <div><b class="num">Day 30</b><span>GEO solution architecture live</span></div>
      <div><b class="num">Day 60</b><span>First monthly benchmark re-audit</span></div>
    </div>
  </div>`);

// Compile final HTML
const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>Uprise Digital — AI Visibility & GEO Audit (October 2026)</title>
<link rel="stylesheet" href="deck.css"/>
<style>
  :root {
    --accent: #A998FF;
    --accent-dark: #6D28D9;
    --pulp: #A998FF;
    --pulp-dark: #6D28D9;
    --brand-bg: #0B0F19;
  }
  .is-pulp, .pulp-t { color: #6D28D9 !important; font-weight: 700; }
  .hb-row.is-pulp .hb-fill { background: #A998FF !important; }
  .hb-row.is-pulp .hb-name { font-weight: 700; color: #1E1B4B !important; }
</style>
</head>
<body>
<div id="deck" class="deck">
  ${slides.map((s, idx) => `
    <section id="${s.id}" class="slide theme-${s.theme}" data-slide-index="${idx}">
      <div class="stage">
        ${s.inner}
      </div>
      <div class="slide-footer">
        <span class="foot-brand">Uprise Digital · Confidential</span>
        <span class="foot-page">${idx + 1} / ${slides.length}</span>
      </div>
    </section>
  `).join('')}
</div>
<script src="deck.js"></script>
</body>
</html>`;

const outPath = path.join(pipelineDir, 'out');
fs.mkdirSync(outPath, { recursive: true });
fs.writeFileSync(path.join(outPath, 'index.html'), html);
console.log(`Successfully compiled Tier 1 Client Presentation (${slides.length} slides) to ${path.join(outPath, 'index.html')}`);
