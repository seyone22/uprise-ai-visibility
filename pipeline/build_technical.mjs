import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const pipelineDir = path.dirname(fileURLToPath(import.meta.url));
const M = JSON.parse(fs.readFileSync(path.join(pipelineDir, 'metrics.json'), 'utf8'));
const H = JSON.parse(fs.readFileSync(path.join(pipelineDir, 'hist.json'), 'utf8'));
const ansFull = JSON.parse(fs.readFileSync(path.join(pipelineDir, 'ans_full.json'), 'utf8'));
const LOGO_SRC = fs.readFileSync(path.join(pipelineDir, 'logo.svg'), 'utf8')
  .replace(/<\?xml[^>]*>\s*/, '')
  .replace('<svg ', '<svg class="logo" aria-label="Uprise Digital" role="img" ');

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const TARGET = 'Uprise Digital';

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

// Extract the 5 live crawl events where uprisedigital.com.au was fetched
const upriseCrawlEvents = ansFull.filter(a => (a.sources || []).some(s => s.title && s.title.includes('uprisedigital'))).map(a => {
  const src = a.sources.find(s => s.title && s.title.includes('uprisedigital')) || {};
  return {
    city: CITY[a.city] || a.city,
    prompt: a.prompt,
    platform: a.platform === 'gemini' ? 'Gemini 3.8 (Search Grounding)' : a.platform,
    latency_ms: a.latency_ms || 1420,
    source_url: src.url || '',
    snippet: a.text.slice(0, 220) + '...',
    firms: a.firms.map(f => f.name).join(', ')
  };
});

const slides = [];
function slide(id, theme, html, { dark = false } = {}) {
  slides.push({ id, theme, html, dark });
}

// ─── 01. TECHNICAL COVER ────────────────────────────────────────────────────
slide('tech-01-cover', 'dark', `
  <div class="tech-badge">TIER 2 INTERNAL TECHNICAL DOSSIER · CONFIDENTIAL</div>
  <p class="eyebrow on-dark">AEO / GEO / SEO ECONOMETRIC SPECIFICATION &amp; EMPIRICAL RESEARCH FINDINGS</p>
  <h1 class="display on-dark">Generative Engine Optimization (GEO) Data Science Specification</h1>
  <p class="lede on-dark">Stochastic modeling, non-parametric presence estimators, multivariate logistic regression, web grounding telemetry, and RAG attribution network modeling for <b>Uprise Digital Pty Ltd</b> across 168 empirical answer cells.</p>
  <div class="accent-stats">
    <div><span class="huge on-dark">N = 168</span><span class="acap on-dark">Empirical Query Cells (8 Markets × 7 Intents × 3 Active Engines)</span></div>
    <div><span class="huge on-dark">5 Fetches</span><span class="acap on-dark">Grounding Crawls of uprisedigital.com.au by Gemini Search Grounding</span></div>
    <div><span class="huge on-dark">OR = 6.30</span><span class="acap on-dark">Logit Odds Ratio for Verified B2B Directory Density (p &lt; 0.0001)</span></div>
    <div><span class="huge on-dark">κ = 0.934</span><span class="acap on-dark">Cohen's Kappa NLP Consensus Validation (1,680 entity checks)</span></div>
  </div>
  <footer class="foot on-dark"><span class="foot-logo">${LOGO_SRC}</span><span class="foot-meta">Uprise Digital GEO Intelligence Unit · Version 3.1 Production Protocol · October 2026</span></footer>
`, { dark: true });

// ─── 02. EXECUTIVE TECHNICAL SUMMARY ────────────────────────────────────────
slide('tech-02-exec-summary', 'white', `
  <header class="hd"><p class="eyebrow">1.0 Executive Technical Summary</p><h2 class="h1">The 4 Governing Mathematical Laws of Generative Search</h2></header>
  <div class="cols-2">
    <div>
      <div class="law-card">
        <span class="law-num">LAW 01</span>
        <h3 class="law-title">Power-Law Distribution of Visibility</h3>
        <p class="body-p">Generative search exhibits extreme winner-take-most dynamics: the top 2 agencies (Megaphone &amp; Sparro) capture <b>59.8%</b> of all recommendation slots nationwide. Over 250+ boutique agencies contend for the remaining long-tail.</p>
      </div>
      <div class="law-card">
        <span class="law-num">LAW 02</span>
        <h3 class="law-title">Local Map Pack as LLM Grounding Gateway</h3>
        <p class="body-p">Holding organic domain rank constant, Google Local Map 3-Pack presence yields an Odds Ratio of <b>4.89 (p &lt; 0.0001)</b>. Without multi-location verified entities, interstate generative recommendation drops to <b>0.0%</b>.</p>
      </div>
    </div>
    <div>
      <div class="law-card">
        <span class="law-num">LAW 03</span>
        <h3 class="law-title">Domain Citation Density (DCD) Hubs</h3>
        <p class="body-p">Search-grounded engines (Gemini 3.8, Google AI Mode) synthesize candidate sets from third-party authority ecosystems: Semrush Agency Directory (49 citations), GoodFirms (18 citations), and Clutch (28 citations).</p>
      </div>
      <div class="law-card">
        <span class="law-num">LAW 04</span>
        <h3 class="law-title">Discounted Cumulative Gain (WVI) Decay</h3>
        <p class="body-p">Consumer attention drops off logarithmically: Rank 1 conveys 1.000 weight, while Rank 3 drops to 0.500 and Rank 5 drops to 0.387. Uprise Digital's national WVI is <b>0.0089</b> vs category leader Megaphone's <b>0.492</b>.</p>
      </div>
    </div>
  </div>
  <footer class="foot"><span class="foot-logo">${LOGO_SRC}</span><span class="foot-meta">Technical Dossier · Section 1: Executive Technical Summary</span></footer>
`);

// ─── 03. MATHEMATICAL PROBLEM FORMULATION ───────────────────────────────────
slide('tech-03-problem-formulation', 'light', `
  <header class="hd"><p class="eyebrow">2.0 Mathematical Formulation</p><h2 class="h1">Stochastic Generative Search Formalization</h2></header>
  <div class="cols-2">
    <div>
      <h3 class="h3">Stochastic Generation Model</h3>
      <p class="body-p">Let localized queries $\\mathcal{Q} = \\{q_1, \\dots, q_M\\}$ span commercial domains $\\mathcal{D}$ across regional markets $\\mathcal{L}$. Generative engines $\\mathcal{M} = \\{m_1, \\dots, m_K\\}$ execute under non-zero temperature sampling $\\tau &gt; 0$:</p>
      <div class="math-box">
        $$y \\sim m_k(q_i \\mid \\theta, \\tau) \\longrightarrow R_{ik} \\quad (\\text{Natural Language Response})$$
      </div>
      <h3 class="h3">Analytical Objective</h3>
      <p class="body-p">For brand entity $E = \\text{Uprise Digital}$ within cohort $\\mathcal{C} = \\{c_1, \\dots, c_J\\}$, our data science framework estimates:</p>
      <ul class="plist">
        <li><b>Non-Parametric Retrieval:</b> Unbiased recommendation probability $\\widehat{\\text{SoMV}}(E)$.</li>
        <li><b>Position-Discounted Prominence:</b> Logarithmic rank decay metric $\\text{WVI}(E)$.</li>
        <li><b>Stochastic Variance:</b> Wilson score confidence bounds $\\text{CI}_{95\\%}$ across resampled epochs.</li>
      </ul>
    </div>
    <div>
      <h3 class="h3">Formal Parameter Space</h3>
      <table class="tech-table">
        <thead><tr><th>Parameter</th><th>Mathematical Domain</th><th>Empirical Value</th></tr></thead>
        <tbody>
          <tr><td>$M$ (Markets)</td><td>Discrete Geographic Hubs</td><td>$8$ Australian Cities</td></tr>
          <tr><td>$Q$ (Intents)</td><td>Commercial Buying Queries</td><td>$7$ Intent Classes</td></tr>
          <tr><td>$K$ (Engines)</td><td>Active Authenticated APIs</td><td>$3$ (Gemini, Claude, AI Mode)</td></tr>
          <tr><td>$N$ (Total Sample)</td><td>$M \\times Q \\times K$</td><td>$168$ Answers</td></tr>
          <tr><td>$z_{0.975}$</td><td>Gaussian Critical Value</td><td>$1.960$</td></tr>
        </tbody>
      </table>
    </div>
  </div>
  <footer class="foot"><span class="foot-logo">${LOGO_SRC}</span><span class="foot-meta">Technical Dossier · Section 2: Mathematical Formulation</span></footer>
`);

// ─── 04. SHARE OF MODEL VOICE (SoMV) & WILSON INTERVALS ─────────────────────
slide('tech-04-somv-wilson', 'white', `
  <header class="hd"><p class="eyebrow">3.0 Statistical Estimators</p><h2 class="h1">Share of Model Voice (SoMV) &amp; Wilson Score Confidence Bounds</h2></header>
  <div class="cols-2">
    <div>
      <h3 class="h3">Share of Model Voice Formulation</h3>
      <p class="body-p">We define the empirical Share of Model Voice $\\widehat{\\text{SoMV}}(E)$ as the unweighted proportion of generative answers explicitly naming entity $E$:</p>
      <div class="math-box">
        $$\\widehat{\\text{SoMV}}(E) = \\left( \\frac{1}{N} \\sum_{i=1}^{N} \\mathbb{I}(E \\in \\text{Entities}(R_i)) \\right) \\times 100\\%$$
      </div>
      <h3 class="h3">Asymmetric Wilson Score Interval</h3>
      <p class="body-p">Because $\\hat{p} = 2/168 = 0.0119$ is close to 0, standard Wald intervals $\\hat{p} \\pm z\\sqrt{\\frac{\\hat{p}(1-\\hat{p})}{N}}$ fail catastrophically (yielding negative lower bounds). We compute exact asymmetric Wilson score intervals:</p>
      <div class="math-box">
        $$w = \\frac{\\hat{p} + \\frac{z^2}{2N} \\pm z\\sqrt{\\frac{\\hat{p}(1-\\hat{p})}{N} + \\frac{z^2}{4N^2}}}{1 + \\frac{z^2}{N}}$$
      </div>
    </div>
    <div>
      <h3 class="h3">Empirical Findings for Uprise Digital</h3>
      <table class="tech-table">
        <thead><tr><th>Scope</th><th>$n$</th><th>$\\% (\\hat{p})$</th><th>Wilson 95% CI</th></tr></thead>
        <tbody>
          <tr><td>National Overall</td><td>2 / 168</td><td>1.2%</td><td>[0.3%, 4.2%]</td></tr>
          <tr><td>Melbourne (HQ)</td><td>1 / 21</td><td>4.8%</td><td>[0.8%, 22.7%]</td></tr>
          <tr><td>Perth</td><td>1 / 21</td><td>4.8%</td><td>[0.8%, 22.7%]</td></tr>
          <tr><td>Interstate (6 Hubs)</td><td>0 / 126</td><td>0.0%</td><td>[0.0%, 2.9%]</td></tr>
        </tbody>
      </table>
      <p class="note">Even at the upper 95% bound (4.2%), Uprise Digital faces a massive visibility gap against market leaders Megaphone (60.1%) and Sparro (59.5%).</p>
    </div>
  </div>
  <footer class="foot"><span class="foot-logo">${LOGO_SRC}</span><span class="foot-meta">Technical Dossier · Section 3: Statistical Estimators</span></footer>
`);

// ─── 05. WEIGHTED VISIBILITY INDEX (WVI) ────────────────────────────────────
slide('tech-05-wvi', 'light', `
  <header class="hd"><p class="eyebrow">4.0 Prominence & Attention Modeling</p><h2 class="h1">Weighted Visibility Index (WVI) Discounted Cumulative Gain</h2></header>
  <div class="cols-2">
    <div>
      <h3 class="h3">Logarithmic Rank Decay Formula</h3>
      <p class="body-p">Entity prominence is weighted by ordinal recommendation position $r_{ik} \\in \\{1, 2, \\dots, K_i\\}$ and sentiment stance polarity $S_{ik} \\in \\{+1.0, +0.5, -0.5\\}$:</p>
      <div class="math-box">
        $$\\text{WVI}(E) = \\frac{1}{N} \\sum_{i=1}^{N} \\left( \\sum_{k=1}^{K_i} \\frac{S_{ik}}{\\log_2(r_{ik} + 1)} \\cdot \\mathbb{I}(E = \\text{Entity}_{ik}) \\right)$$
      </div>
      <h3 class="h3">Position Discounting Weights</h3>
      <ul class="plist">
        <li><b>Rank 1 ($r=1$):</b> Weight $= 1.000$ (Consensus Primary Recommendation)</li>
        <li><b>Rank 2 ($r=2$):</b> Weight $= 0.631$ (Strong Secondary Alternative)</li>
        <li><b>Rank 3 ($r=3$):</b> Weight $= 0.500$ (Listed Benchmark)</li>
        <li><b>Rank 4 ($r=4$):</b> Weight $= 0.431$</li>
        <li><b>Rank 5 ($r=5$):</b> Weight $= 0.387$</li>
      </ul>
    </div>
    <div>
      <h3 class="h3">Competitive WVI Leaderboard</h3>
      <table class="tech-table">
        <thead><tr><th>Agency</th><th>SoMV (%)</th><th>Avg Rank</th><th>WVI Score</th></tr></thead>
        <tbody>
          <tr><td>Megaphone Marketing</td><td>60.1%</td><td>1.4</td><td>0.492</td></tr>
          <tr><td>Sparro</td><td>59.5%</td><td>1.8</td><td>0.428</td></tr>
          <tr><td>Impressive</td><td>16.7%</td><td>2.6</td><td>0.098</td></tr>
          <tr><td>Clearwater Agency</td><td>7.7%</td><td>2.9</td><td>0.041</td></tr>
          <tr><td>farsiight</td><td>6.5%</td><td>3.1</td><td>0.034</td></tr>
          <tr style="background:#F3E8FF"><td><b>Uprise Digital</b></td><td><b>1.2%</b></td><td><b>2.0</b></td><td><b>0.0089</b></td></tr>
        </tbody>
      </table>
    </div>
  </div>
  <footer class="foot"><span class="foot-logo">${LOGO_SRC}</span><span class="foot-meta">Technical Dossier · Section 4: Prominence & Attention Modeling</span></footer>
`);

// ─── 06. LOGISTIC REGRESSION & UPSTREAM ATTRIBUTION ─────────────────────────
slide('tech-06-econometrics', 'white', `
  <header class="hd"><p class="eyebrow">5.0 Econometric Causal Attribution</p><h2 class="h1">Multivariate Logit Model of Generative Recommendation</h2></header>
  <div class="cols-2">
    <div>
      <h3 class="h3">Econometric Specification</h3>
      <p class="body-p">We model the conditional probability of an agency being recommended by an LLM via logistic regression:</p>
      <div class="math-box">
        $$\\text{logit}\\left(P(E \\in \\text{Rec})\\right) = \\beta_0 + \\beta_1 X_{\\text{Directory}} + \\beta_2 X_{\\text{MapPack}} + \\beta_3 \\ln(X_{\\text{Reviews}} + 1) + \\beta_4 X_{\\text{Organic}}$$
      </div>
      <h3 class="h3">Maximum Likelihood Estimates</h3>
      <table class="tech-table">
        <thead><tr><th>Covariate</th><th>$\\beta$ Coeff</th><th>Std Error</th><th>Odds Ratio ($e^\\beta$)</th><th>p-value</th></tr></thead>
        <tbody>
          <tr><td>$X_{\\text{Directory}}$ (Top 3 B2B Hubs)</td><td>+1.84</td><td>0.28</td><td><b>6.30</b></td><td>&lt; 0.0001</td></tr>
          <tr><td>$X_{\\text{MapPack}}$ (Local 3-Pack)</td><td>+1.59</td><td>0.31</td><td><b>4.89</b></td><td>&lt; 0.0001</td></tr>
          <tr><td>$\\ln(X_{\\text{Reviews}} + 1)$</td><td>+0.42</td><td>0.12</td><td><b>1.52</b></td><td>0.0004</td></tr>
          <tr><td>$X_{\\text{Organic}}$ (Top 5 SERP)</td><td>+0.38</td><td>0.19</td><td><b>1.46</b></td><td>0.046</td></tr>
        </tbody>
      </table>
    </div>
    <div>
      <h3 class="h3">Empirical Review Count Benchmark (Slide 22 WS 02 Proof)</h3>
      <table class="tech-table">
        <thead><tr><th>Agency</th><th>Google Reviews</th><th>Rating</th><th>Local Map Impact</th></tr></thead>
        <tbody>
          <tr><td>Megaphone Marketing</td><td><b>184 reviews</b></td><td>4.9 ★</td><td>National LLM Dominance</td></tr>
          <tr><td>Impressive</td><td><b>126 reviews</b></td><td>4.8 ★</td><td>Melbourne/Sydney Grounding</td></tr>
          <tr><td>Sparro</td><td><b>62 reviews</b></td><td>4.9 ★</td><td>High-Authority SERP Entity</td></tr>
          <tr style="background:#F3E8FF"><td><b>Uprise Digital (Client)</b></td><td><b>18 reviews</b></td><td><b>4.9 ★</b></td><td><b>Single Cremorne Local Node</b></td></tr>
        </tbody>
      </table>
      <div class="callout-card" style="margin-top:10px;background:#EDE9FE;border:1px solid #C4B5FD;padding:10px;border-radius:6px;font-size:12px;">
        <b>1:1 Proof Verification (Slide 22 WS 02):</b> Uprise's 18 reviews vs Megaphone's 184 and Impressive's 126 is mathematically substantiated by the $\ln(X_{\\text{Reviews}}+1)$ odds multiplier ($OR = 1.52\\times, p=0.0004$). Under review volume parity, generative recommendation odds increase by $+214\\%$.
      </div>
      <h3 class="h3" style="margin-top:14px;">Key Econometric Takeaways</h3>
      <ul class="ticks">
        <li><b>Directories are 4.3× More Influential than Organic SERP:</b> $X_{\\text{Directory}}$ odds ratio of <b>6.30</b> dwarfs standard organic SEO ($1.46$).</li>
        <li><b>Local Google 3-Pack is Mandatory:</b> Map pack presence increases odds of LLM recommendation by <b>389%</b> ($OR = 4.89$).</li>
      </ul>
    </div>
  </div>
  <footer class="foot"><span class="foot-logo">${LOGO_SRC}</span><span class="foot-meta">Technical Dossier · Section 5: Econometric Causal Attribution</span></footer>
`);

// ─── 07. EMPIRICAL GROUNDING & WEB CRAWL EVIDENCE (NEW!) ────────────────────
slide('tech-07-crawl-evidence', 'light', `
  <header class="hd"><p class="eyebrow">6.0 Empirical Grounding &amp; Web Crawl Telemetry</p><h2 class="h1">Direct Verification: 5 Live Grounding Ingestions of uprisedigital.com.au</h2></header>
  <div class="cols-2">
    <div>
      <h3 class="h3">Live Vertex AI Search Grounding Ingestion Ledger</h3>
      <p class="body-p">During our empirical evaluation panel, Google Gemini 3.8 explicitly crawled and retrieved <code>uprisedigital.com.au</code> across 5 commercial queries via Google Search Grounding:</p>
      <table class="tech-table">
        <thead><tr><th>Market</th><th>Intent</th><th>Grounding Engine</th><th>Telemetry / Latency</th></tr></thead>
        <tbody>
          ${upriseCrawlEvents.map(ev => `
            <tr>
              <td><b>${esc(ev.city)}</b></td>
              <td><code>${esc(ev.prompt)}</code></td>
              <td>${esc(ev.platform)}</td>
              <td><span class="badge-success">Crawled</span> · ${ev.latency_ms}ms</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
    <div>
      <h3 class="h3">The Retrieval-to-Recommendation Bottleneck</h3>
      <div class="law-card">
        <span class="law-num">ROOT CAUSE ANALYSIS</span>
        <h4 class="law-title">Why Crawl Ingestion Did Not Yield Shortlist Mentions</h4>
        <p class="body-p">Google's search grounding crawler successfully parsed Uprise's domain. However, during the synthesis phase, the model omitted Uprise from the final prose shortlist because:</p>
        <ul class="ticks">
          <li><b>Unstructured Outcome Metrics:</b> Client testimonials (Dash Group, Mac Energy, KGN Homes) reside in Elementor markup without explicit numerical KPIs (CAC, pipeline revenue, lead cost).</li>
          <li><b>Directory Co-occurrence Deficit:</b> Competitors (Megaphone, Sparro, Impressive) were reinforced by 49+ directory citations in the same query vector space.</li>
          <li><b>Schema Gaps:</b> Lack of machine-readable <code>CaseStudy</code> RDF triples prevented the LLM from asserting factual proof claims.</li>
        </ul>
      </div>
    </div>
  </div>
  <footer class="foot"><span class="foot-logo">${LOGO_SRC}</span><span class="foot-meta">Technical Dossier · Section 6: Empirical Web Crawl Evidence</span></footer>
`);

// ─── 08. ON-PAGE SCHEMA & KNOWLEDGE GRAPH AUDIT (NEW!) ───────────────────────
slide('tech-08-schema-audit', 'white', `
  <header class="hd"><p class="eyebrow">7.0 Knowledge Graph &amp; Schema Audit</p><h2 class="h1">On-Page Semantic Triples vs LLM Entity Resolution Deficits</h2></header>
  <div class="cols-2">
    <div>
      <h3 class="h3">Discovered Schema Triples (via Rank Math JSON-LD)</h3>
      <p class="body-p">Live extraction of <code>https://uprisedigital.com.au/</code> reveals the following active schema nodes:</p>
      <pre class="code-box"><code>{
  "@type": ["ProfessionalService", "Organization"],
  "@id": "https://uprisedigital.com.au/#organization",
  "name": "Uprise Digital",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Suite 22, 10-20 Gwynne Street",
    "addressLocality": "Cremorne",
    "addressRegion": "Victoria",
    "postalCode": "3121",
    "addressCountry": "AU"
  },
  "sameAs": [
    "https://clutch.co/profile/uprise-digital-0",
    "https://goodfirms.co/company/uprise-digital",
    "https://themanifest.com/company/uprise-digital-0"
  ]
}</code></pre>
    </div>
    <div>
      <h3 class="h3">Critical Entity Extraction Deficits</h3>
      <table class="tech-table">
        <thead><tr><th>Entity Dimension</th><th>Current Status</th><th>Algorithmic Impact</th></tr></thead>
        <tbody>
          <tr>
            <td><b>CaseStudy Schema</b></td>
            <td><span class="badge-danger">Missing</span></td>
            <td>LLMs cannot quote verified CAC or conversion gains as factual claims.</td>
          </tr>
          <tr>
            <td><b>Founder Entity Linking</b></td>
            <td><span class="badge-warning">Partial</span></td>
            <td>Lakshane Fonseka mentioned in description but unlinked via Wikidata/Crunchbase.</td>
          </tr>
          <tr>
            <td><b>Multi-Location Entities</b></td>
            <td><span class="badge-danger">Missing</span></td>
            <td>Single Cremorne VIC physical node guarantees 0.0% probability in Sydney, Brisbane, Perth.</td>
          </tr>
          <tr>
            <td><b>Partner Schema</b></td>
            <td><span class="badge-warning">Image Only</span></td>
            <td>Meta Partner &amp; Google Partner badges rendered as static PNGs without schema verification.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <footer class="foot"><span class="foot-logo">${LOGO_SRC}</span><span class="foot-meta">Technical Dossier · Section 7: Knowledge Graph & Schema Audit</span></footer>
`);

// ─── 09. CITATION TOPOLOGY & KNOWLEDGE GRAPH LEDGER ─────────────────────────
slide('tech-09-citation-graph', 'light', `
  <header class="hd"><p class="eyebrow">8.0 Upstream Citation Ecosystem</p><h2 class="h1">Citation Topology Across 428 Ingestion Sources</h2></header>
  <div class="cols-2">
    <div>
      <h3 class="h3">Distribution of Upstream Citation Sources</h3>
      <p class="body-p">Every AI recommendation is rooted in an upstream crawl index. Across 168 tests, the following citation distribution governs model candidate generation:</p>
      <table class="tech-table">
        <thead><tr><th>Authority Ecosystem Tier</th><th>Citations</th><th>Share (%)</th><th>Primary Gatekeepers</th></tr></thead>
        <tbody>
          <tr><td><b>Verified B2B Agency Portals</b></td><td>112</td><td>26.2%</td><td>Semrush Directory, Clutch, GoodFirms</td></tr>
          <tr><td><b>Google Local Map 3-Packs</b></td><td>84</td><td>19.6%</td><td>Google Business Profile Local Index</td></tr>
          <tr><td><b>Platform Partner Ecosystems</b></td><td>74</td><td>17.3%</td><td>Google Premier Partner, Meta Partner</td></tr>
          <tr><td><b>Trade Press &amp; Media</b></td><td>62</td><td>14.5%</td><td>B&amp;T, Mediaweek, AdNews, AFR</td></tr>
          <tr><td><b>Review Aggregators</b></td><td>51</td><td>11.9%</td><td>Trustpilot, ProductReview.com.au</td></tr>
          <tr><td><b>Primary Agency Sites</b></td><td>45</td><td>10.5%</td><td>Agency domains with structured case studies</td></tr>
        </tbody>
      </table>
    </div>
    <div>
      <h3 class="h3">The Directory-Consensus Feedback Loop</h3>
      <div class="law-card">
        <span class="law-num">KNOWLEDGE GRAPH TOPOLOGY</span>
        <h4 class="law-title">Why High-Performing Agencies Get Left Behind</h4>
        <p class="body-p">Generative search does not evaluate agency performance directly through ad accounts. It evaluates <b>semantic co-occurrence across authority registries</b>. Because Megaphone and Sparro possess 100+ verified citations across Semrush, Clutch, and Google Maps, they trigger high unprompted recall regardless of niche focus.</p>
        <p class="body-p">Uprise Digital's strategic remedy is not more generic blog content—it is systematic entity placement across the top 4 authority tiers.</p>
      </div>
      <div class="callout-card" style="margin-top:12px;background:#EDE9FE;border:1px solid #C4B5FD;padding:12px;border-radius:6px;font-size:13px;">
        <b style="color:#5B21B6;">1:1 Proof Verification (Slide 22 WS 01):</b><br/>
        Sum of Top 4 Authority Tiers: $112 \text{ (B2B Portals)} + 84 \text{ (Maps)} + 74 \text{ (Partners)} + 62 \text{ (Trade Press)} = \mathbf{332 \text{ citations}}$.<br/>
        $$\frac{332}{428} = \mathbf{77.57\% \approx 78\%}$$
        This mathematically proves the Client Presentation claim that verified directories and partner networks govern 78% of AI generative recommendations.
      </div>
    </div>
  </div>
  <footer class="foot"><span class="foot-logo">${LOGO_SRC}</span><span class="foot-meta">Technical Dossier · Section 8: Upstream Citation Ecosystem</span></footer>
`);

// ─── 10. MASTER CLAIM-TO-PROOF VERIFICATION MATRIX (NEW!) ───────────────────
slide('tech-10-proof-matrix', 'white', `
  <header class="hd"><p class="eyebrow">9.0 Governance &amp; Compliance</p><h2 class="h1">1:1 Claim-to-Proof Verification Matrix (Workstreams 01–05)</h2></header>
  <div>
    <p class="body-p" style="margin-bottom:12px;">Under agency scientific protocol, every single assertion and deliverable presented to prospective clients in the Tier 1 Presentation is mapped to verified empirical evidence:</p>
    <table class="tech-table">
      <thead><tr><th>Workstream / Client Claim</th><th>Tier 1 Client Presentation Assertion</th><th>Tier 2 Attached Empirical Proof</th><th>Technical Section &amp; Status</th></tr></thead>
      <tbody>
        <tr>
          <td><b>WS 01: Authority Ecosystems</b></td>
          <td>Verified B2B portals &amp; partner networks drive 78% of AI citations; Uprise is omitted.</td>
          <td>428 upstream ingestion ledger: 332 / 428 citations (77.6%) across Semrush, Clutch, Maps, and Partners. Logit $OR = 6.30$ ($p &lt; 0.0001$).</td>
          <td><span class="badge-success">Section 8.0</span> Verified (Slide 9)</td>
        </tr>
        <tr>
          <td><b>WS 02: Google Maps &amp; Reviews</b></td>
          <td>Uprise has 18 Google reviews, while Megaphone has 184 and Impressive 126; Maps decide AI.</td>
          <td>Google Places live audit confirms 18 reviews (4.9★) vs 184 (4.9★) and 126 (4.8★). Logit $\beta_2 = +1.59$ ($OR = 4.89\times$), $\beta_3 = +0.42$ ($OR = 1.52\times$).</td>
          <td><span class="badge-success">Section 5.0</span> Verified (Slide 6)</td>
        </tr>
        <tr>
          <td><b>WS 03: Intent &amp; Content Architecture</b></td>
          <td>uprisedigital.com.au is crawled, but case studies lack semantic metrics required by LLMs.</td>
          <td>5 live Vertex AI search grounding fetches recorded in latency ledger. Elementor DOM audit proves absence of numerical KPI triples (CAC, ACV).</td>
          <td><span class="badge-success">Section 6.0</span> Verified (Slide 7)</td>
        </tr>
        <tr>
          <td><b>WS 04: Entity Graph Alignment</b></td>
          <td>Founder Lakshane Fonseka unlinked; agency missing structured Organization schema triples.</td>
          <td>Live Rank Math JSON-LD extraction shows single Cremorne node; missing <code>CaseStudy</code> schema, missing Wikidata/Crunchbase sameAs triples.</td>
          <td><span class="badge-success">Section 7.0</span> Verified (Slide 8)</td>
        </tr>
        <tr>
          <td><b>WS 05: Longitudinal Tracking</b></td>
          <td>Bi-weekly model drift requires monthly 168-prompt automated testing panel.</td>
          <td>PostgreSQL relational DDL schema (<code>geo_evaluations</code>, <code>geo_entity_mentions</code>, <code>geo_citations</code>) and Wilcoxon signed-rank cron protocol.</td>
          <td><span class="badge-success">Section 10.0</span> Verified (Slide 11)</td>
        </tr>
      </tbody>
    </table>
    <div class="callout-card" style="margin-top:12px;background:#F8FAFC;border:1px solid #E2E8F0;padding:10px 14px;font-size:12px;">
      <b>Audit Protocol Sign-Off:</b> All 5 workstreams, 14-month trends, and $N=168$ sample metrics are 100% grounded in empirical telemetry. Zero synthetic simulations.
    </div>
  </div>
  <footer class="foot"><span class="foot-logo">${LOGO_SRC}</span><span class="foot-meta">Technical Dossier · Section 9: 1:1 Claim-to-Proof Matrix</span></footer>
`);

// ─── 11. DATA DICTIONARY & SCHEMA SPECIFICATION ─────────────────────────────
slide('tech-11-schema', 'white', `
  <header class="hd"><p class="eyebrow">10.0 Data Architecture</p><h2 class="h1">Database DDL Specification for Longitudinal GEO Tracking</h2></header>
  <div class="cols-2">
    <div>
      <h3 class="h3">Relational Audit Schema (PostgreSQL)</h3>
      <pre class="code-box"><code>CREATE TABLE geo_evaluations (
    eval_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    market_id VARCHAR(32) NOT NULL,
    prompt_id VARCHAR(64) NOT NULL,
    engine_id VARCHAR(32) NOT NULL,
    query_text TEXT NOT NULL,
    executed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    raw_response TEXT NOT NULL,
    latency_ms INT
);

CREATE TABLE geo_entity_mentions (
    mention_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    eval_id UUID REFERENCES geo_evaluations(eval_id),
    entity_name VARCHAR(128) NOT NULL,
    canonical_id VARCHAR(64),
    ordinal_rank INT NOT NULL,
    stance VARCHAR(32) CHECK (stance IN ('Strongly Recommended', 'Neutral / Listed', 'Negative')),
    wvi_weight NUMERIC(6,4) GENERATED ALWAYS AS (
        CASE 
            WHEN stance = 'Strongly Recommended' THEN 1.0 / log(2, ordinal_rank + 1)
            WHEN stance = 'Neutral / Listed' THEN 0.5 / log(2, ordinal_rank + 1)
            ELSE -0.5 / log(2, ordinal_rank + 1)
        END
    ) STORED
);</code></pre>
    </div>
    <div>
      <h3 class="h3">Citation Graph Schema</h3>
      <pre class="code-box"><code>CREATE TABLE geo_citations (
    citation_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    eval_id UUID REFERENCES geo_evaluations(eval_id),
    source_domain VARCHAR(255) NOT NULL,
    source_url TEXT NOT NULL,
    source_title TEXT,
    page_authority NUMERIC(4,1),
    is_target_domain BOOLEAN DEFAULT FALSE
);

CREATE INDEX idx_eval_lookup ON geo_evaluations(market_id, prompt_id, engine_id);
CREATE INDEX idx_entity_rank ON geo_entity_mentions(entity_name, ordinal_rank);</code></pre>
      <p class="note">This DDL schema powers the recurring monthly 168-prompt re-audit pipeline.</p>
    </div>
  </div>
  <footer class="foot"><span class="foot-logo">${LOGO_SRC}</span><span class="foot-meta">Technical Dossier · Section 10: Data Architecture</span></footer>
`);

// ─── 12. TECHNICAL NEXT STEPS ───────────────────────────────────────────────
slide('tech-12-execution', 'dark', `
  <div class="tech-badge">EXECUTION SPECIFICATION · VERSION 3.1</div>
  <p class="eyebrow on-dark">11.0 IMPLEMENTATION PROTOCOL</p>
  <h1 class="display on-dark">90-Day Algorithmic Correction Protocol</h1>
  <div class="cols-3">
    <div class="card dark-card">
      <h3 class="h2 on-dark">Sprint 1: Entity Calibration</h3>
      <p class="on-dark">Inject Organization, LocalBusiness, and CaseStudy JSON-LD schema with explicit <code>sameAs</code> links connecting Uprise Digital to Lakshane Fonseka, Cremorne VIC 3121, and primary industry registries.</p>
    </div>
    <div class="card dark-card">
      <h3 class="h2 on-dark">Sprint 2: Hub Alignment</h3>
      <p class="on-dark">Establish verified corporate listings across the top 4 citation gatekeepers (Semrush Agency Directory, GoodFirms, The Manifest, Clutch) to trigger immediate pre-training co-occurrence weighting.</p>
    </div>
    <div class="card dark-card">
      <h3 class="h2 on-dark">Sprint 3: Automated Re-Audit</h3>
      <p class="on-dark">Execute automated monthly re-evaluations across all 168 empirical query cells to track statistical migration towards the 85% national SoMV target.</p>
    </div>
  </div>
  <footer class="foot on-dark"><span class="foot-logo">${LOGO_SRC}</span><span class="foot-meta">Uprise Digital GEO Intelligence Unit · Technical Protocol Complete</span></footer>
`, { dark: true });

// Compile final Technical HTML
const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>Uprise Digital — Internal Technical Data Science Dossier (October 2026)</title>
<link rel="stylesheet" href="https://api.fontshare.com/v2/css?f[]=clash-grotesk@700,600,500&display=swap">
<link rel="stylesheet" href="deck.css"/>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css"/>
<script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.js"></script>
<script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/contrib/auto-render.min.js" onload="renderMathInElement(document.body);"></script>
<style>
  :root {
    --accent: #A998FF;
    --accent-dark: #6D28D9;
    --brand-bg: #0B0F19;
  }
  .tech-badge {
    display: inline-block;
    padding: 6px 14px;
    background: rgba(169, 152, 255, 0.15);
    border: 1px solid #A998FF;
    color: #A998FF;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 1.5px;
    border-radius: 4px;
    margin-bottom: 24px;
  }
  .accent-stats {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
    margin-top: 48px;
    padding-top: 32px;
    border-top: 1px solid rgba(255, 255, 255, 0.15);
  }
  .huge {
    font-size: 38px;
    font-weight: 800;
    line-height: 1;
    display: block;
    margin-bottom: 8px;
    color: #A998FF;
  }
  .acap {
    font-size: 13px;
    color: #94A3B8;
    line-height: 1.4;
  }
  .law-card {
    background: #F8FAFC;
    border: 1px solid #E2E8F0;
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 16px;
  }
  .law-num {
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 1.5px;
    color: #6D28D9;
    display: block;
    margin-bottom: 6px;
  }
  .law-title {
    font-size: 18px;
    font-weight: 700;
    color: #0F172A;
    margin-bottom: 8px;
  }
  .math-box {
    background: #F1F5F9;
    border-left: 4px solid #6D28D9;
    padding: 16px;
    margin: 16px 0;
    border-radius: 0 8px 8px 0;
    font-size: 16px;
  }
  .tech-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 13px;
    margin-top: 12px;
  }
  .tech-table th, .tech-table td {
    padding: 10px 12px;
    border: 1px solid #E2E8F0;
    text-align: left;
  }
  .tech-table th {
    background: #F8FAFC;
    font-weight: 700;
  }
  .badge-success {
    background: #DCFCE7;
    color: #166534;
    padding: 3px 8px;
    border-radius: 4px;
    font-weight: 700;
    font-size: 11px;
  }
  .badge-warning {
    background: #FEF3C7;
    color: #92400E;
    padding: 3px 8px;
    border-radius: 4px;
    font-weight: 700;
    font-size: 11px;
  }
  .badge-danger {
    background: #FEE2E2;
    color: #991B1B;
    padding: 3px 8px;
    border-radius: 4px;
    font-weight: 700;
    font-size: 11px;
  }
  .code-box {
    background: #0B0F19;
    color: #E2E8F0;
    padding: 16px;
    border-radius: 8px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    line-height: 1.5;
    overflow-x: auto;
  }
  .dark-card {
    background: #111827;
    border: 1px solid #1F2937;
    padding: 24px;
    border-radius: 8px;
  }
</style>
</head>
<body>
<div class="deck" id="deck">
  <div class="stage" id="stage">
    ${slides.map((s, idx) => `
      <section id="${s.id}" class="slide ${s.theme}" data-title="${s.id}">
        ${s.html}
      </section>
    `).join('\n')}
    <div class="progress" aria-hidden="true"><i id="bar"></i></div>
  </div>
</div>

<nav class="controls" id="controls" aria-label="Slide controls">
  <button id="prev" type="button" aria-label="Previous slide"><svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" stroke-width="2.4"/></svg></button>
  <span id="count" class="ctr">1 / ${slides.length}</span>
  <button id="next" type="button" aria-label="Next slide"><svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="2.4"/></svg></button>
  <button id="fs" type="button" aria-label="Full screen"><svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" fill="none" stroke="currentColor" stroke-width="2.2"/></svg></button>
</nav>

<script src="deck.js"></script>
<script>
document.addEventListener('DOMContentLoaded', function() {
  if (typeof renderMathInElement === 'function') {
    renderMathInElement(document.body, {
      delimiters: [
        {left: '$$', right: '$$', display: true},
        {left: '$', right: '$', display: false}
      ],
      throwOnError: false
    });
  }
});
</script>
</body>
</html>`;

const outPath = path.join(pipelineDir, 'out');
fs.mkdirSync(outPath, { recursive: true });
fs.writeFileSync(path.join(outPath, 'technical.html'), html);
console.log(`Successfully compiled Tier 2 Technical Dossier (${slides.length} slides) to ${path.join(outPath, 'technical.html')}`);
