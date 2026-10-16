import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const pipelineDir = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(pipelineDir, '..');

const M = JSON.parse(fs.readFileSync(path.join(pipelineDir, 'metrics.json'), 'utf8'));
const C = JSON.parse(fs.readFileSync(path.join(pipelineDir, 'citations.json'), 'utf8'));
const S = JSON.parse(fs.readFileSync(path.join(pipelineDir, 'serp_audit.json'), 'utf8'));
const H = JSON.parse(fs.readFileSync(path.join(pipelineDir, 'hist.json'), 'utf8'));
const ans = JSON.parse(fs.readFileSync(path.join(pipelineDir, 'ans_full.json'), 'utf8'));

const md = [];
md.push('# Uprise Digital — Complete Empirical GEO / AI Search Raw Evidence Ledger');
md.push('');
md.push('> **Target Entity:** Uprise Digital Pty Ltd (`https://uprisedigital.com.au`)  ');
md.push('> **Physical HQ:** Suite 22, 10-20 Gwynne Street, Cremorne VIC 3121 (`cid=10687603269286839320`)  ');
md.push('> **Audit Vertical:** AI Search (Generative Engine Optimisation [GEO], Answer Engine Optimisation [AEO], AI SEO, LLM Visibility)  ');
md.push('> **Sample Size:** $N = 280$ Live AI Evaluations (8 Markets × 7 AI Search Prompts × 5 Engines) + $56$ Live Australian Google SERP Checks + Live Website Crawl  ');
md.push('> **Compiled:** October 2026');
md.push('');
md.push('---');
md.push('');
md.push('## 1. Slide-by-Slide Deck Proof Map (Slides 1–30)');
md.push('');
md.push('| Slide | Deck Claim / Visual | Exact Raw Evidence Source in This Ledger |');
md.push('|---|---|---|');
md.push('| **Slide 1 (`#s1` Cover)** | 38 of 280 answers name Uprise Digital (13.6%, Rank #10 nationally) across 8 markets × 7 prompts × 5 engines | Section 5.1 (National Leaderboard) & Section 6 (All 280 Transcripts) |');
md.push('| **Slide 2 (`#s2` Why)** | +310% surge in Australian AI Search demand (390/mo Oct 25 to 1,600/mo Sep 26); 61 citations of `uprisedigital.com.au` with 25 leaked to rivals | Section 4.2 (61 Uprise Citations & 25 Leaked Citations Table) & Section 5.4 |');
md.push('| **Slide 3 (`#s3` Method)** | 8 markets × 7 AI Search questions × 5 engines = 280 answers + 56 Australian Google SERP checks | Section 3 (All 56 SERP Checks) & Section 6 (All 280 Transcripts) |');
md.push('| **Slide 4 (`#s4` National)** | StudioHawk (134/280), Luminary (76), Optimising (66), Prosperity Media (53), Gravitate (50), Digital Nomads HQ (49), Impressive (47), Titan Blue (39), Intesols (39), Uprise Digital (38); 0/168 on ChatGPT/Perplexity/Gemini | Section 5.1 & Section 5.2 (Engine & Prompt Breakdowns) |');
md.push('| **Slide 5 (`#s5` Map)** | Melbourne 9% (#13), Sydney 6% (#11), Brisbane 20% (#6), Perth 14% (#6), Adelaide 20% (#5), Gold Coast 17% (#7), Canberra 23% (#6), National 0% (#33) | Section 5.3 (City-by-City Standings) |');
md.push('| **Slides 6–10 (`#s6`–`#s10` Melbourne)** | Salt & Fuessel leads Melbourne (23/35, 66%), Luminary (19), Intesols (19), StudioHawk (18), Impressive (15), Optimising (#6 at 12/35, 34%), Uprise Digital (#13 at 3/35, 9%, 47 GBP reviews, 2/7 Top-10 SERP) | Section 2.5 (GBP Audit), Section 3 (Melbourne SERP), Section 6 (Transcripts #001–#035) |');
md.push('| **Slides 11–17 (`#s11`–`#s17` Markets)** | Sydney (2/35), Brisbane (7/35), Perth (5/35), Adelaide (7/35), Gold Coast (6/35), Canberra (8/35), National (0/35) | Section 5.3 & Section 6 (Transcripts #036–#280) |');
md.push('| **Slide 18 (`#s18` Pattern)** | $r = 0.94$ correlation between Google Top-10 SERP presence (of 7 queries) and AI answer share (%) | Section 3.1 (SERP Top-10 vs AI Share Table) |');
md.push('| **Slide 19 (`#s19` Trend)** | 14-month trajectory (Aug 2025 – Sep 2026) for StudioHawk (134), Luminary (76), Optimising (66), Impressive (47), Uprise Digital (38) | Section 5.4 (`hist.json` 14-Month Series) |');
md.push('| **Slide 20 (`#s20` Gap)** | Market-by-market gap between Uprise Digital and each city leader | Section 5.3 |');
md.push('| **Slides 21–22 (`#s21`–`#s22` Plan)** | 5 Strategic Workstreams addressing Directories/Roundup Leak, Cremorne GBP, Service/City URLs, Entity/Copy Hygiene, and Monthly 280-Prompt Tracking | Sections 2, 3, 4, 5 |');
md.push('| **Slide 23 (`#s23` WS 01 Sources)** | Top cited domains: `semrush.com` (137), `clutch.co` (105), `thatware.co` (81), `uprisedigital.com.au` (61 cited / 25 leaked), `goodfirms.co` (47), `webtonic.io` (43), `intelligentresourcing.co` (41), `myohomarketing.com.au` (40), `designrush.com` (32), `roi.com.au` (29) | Section 4.1 (Complete Domain Citation Ledger) & Section 4.2 (25 Leaked Citations) |');
md.push('| **Slide 24 (`#s24` WS 02 Maps/SERP)** | Verified 47 Cremorne Google reviews (4.9★) and Top-10 SERP counts per market (`2/7` Melb, `1/7` Syd, `4/7` Bris, `3/7` Perth, `4/7` Adel, `3/7` GC, `4/7` Canb, `1/7` Nat) | Section 2.5 & Section 3.1 |');
md.push('| **Slide 25 (`#s25` WS 03 Pages)** | 36 of 56 market × intent pairs with 0 mentions (`0/40` on `geo_agency`, `0/40` on `ai_seo`, `0/40` on `ai_audit`); orphaned `/ai-seo/` & `/aeo/` on homepage | Section 2.2, Section 2.3 & Section 5.3 |');
md.push('| **Slide 26 (`#s26` WS 04 Entity)** | Verbatim quotes of interstate office hallucinations (Brisbane, Gold Coast, Adelaide), roundup self-sabotage (25 leaked citations), stale review counts (`40+`/`45+` vs `47`), and `$100K+ in In 4 Months` vs `$150K+` AI Smart Glass conflict | Section 2.1, Section 2.4 & Section 6 (Transcripts #026, #047, #086, #161, #191) |');
md.push('| **Slides 27–28 (`#s27`–`#s28` Roadmap & Targets)** | 12-week Gantt rollout & realistic 12-month target overtaking #6 Optimising in Melbourne (`3/35 [9%] -> 7/35 [20%] -> 11/35 [31%] -> 15/35 [43%]` vs Optimising at `12/35 [34%]`) | Section 5.3 (Melbourne Leaderboard) |');
md.push('');
md.push('---');
md.push('');
md.push('## 2. Live Website Scraping & Forensic Audit Evidence (`uprisedigital.com.au`)');
md.push('');
md.push('All live pages on `https://uprisedigital.com.au` were scraped via Firecrawl and direct HTTP inspection on 16 October 2026.');
md.push('');
md.push('### 2.1 Flagship Case Study Revenue Contradiction (`\\$100K+` vs `\\$150K+` + Typo `"in In"`)');
md.push('- **On Homepage (`https://uprisedigital.com.au/`), `/geo/`, `/ai-seo/`, and `/aeo/`:**');
md.push('  > `### AI Smart Glass: $100K+ Monthly Revenue in In 4 Months`');
md.push('  > `We built their search and AI visibility from scratch, generating over $100K in monthly revenue within 4 months of launch.`');
md.push('- **On Case Studies Index (`https://uprisedigital.com.au/case-studies/`) and `/blog/8-best-aeo-agencies-in-melbourne/`:**');
md.push('  > `### AI Smart Glass: $150K+ Monthly Revenue in 4 Months`');
md.push('  > `A commercial smart glass supplier went from zero organic visibility to $150K+ in monthly revenue within four months through combined SEO and AEO implementation.`');
md.push('- **On Dedicated Case Study URL (`https://uprisedigital.com.au/case-studies/ai-smart-glass-ai-search/`):**');
md.push('  > Displays `100K+` counter in the hero, states *"generating over $100,000 in monthly revenue within four months"* in body copy, and lists `8+ AI Citations Across Major Platforms`, `86% Traffic Growth`, and `432% Increase in Organic Impressions`.');
md.push('');
md.push('### 2.2 Homepage (`https://uprisedigital.com.au/`) Broken Service Card & Orphaned AI Search Pages');
md.push('- **Orphaned Core Service Pages:** In the homepage `Services` grid, only **Generative Engine Optimisation** (`https://uprisedigital.com.au/geo/`) is linked. Both `https://uprisedigital.com.au/ai-seo/` and `https://uprisedigital.com.au/aeo/` are **completely unlinked** from the homepage body.');
md.push('- **Copy-Paste Error in Web Design Card:** On `/`, the card titled `### [Landing Pages & Web Design](https://uprisedigital.com.au/web-design/)` contains the exact duplicated description from the **Instagram & Facebook Ads** card above it:');
md.push('  > `We build strategic Facebook and Instagram campaigns that generate leads and sales, with creative and targeting that converts.`');
md.push('- **Duplicated Conviction System Block:** On `/`, the paragraph beginning *"Most agencies start with tactics. We start with buyer psychology. Our Conviction System maps what your ideal customer needs to believe..."* is rendered twice consecutively.');
md.push('');
md.push('### 2.3 Leftover Paid-Social Promo Banners on `/geo/` and `/aeo/`');
md.push('- Both `https://uprisedigital.com.au/geo/` and `https://uprisedigital.com.au/aeo/` display a leftover promo banner at the bottom of the page:');
md.push('  > `The next 8 Businesses that sign up will get 3 Months Facebook and Instagram Ad Management Free!`');
md.push('  > `[Get a free SEO audit of your website](https://uprisedigital.com.au/free-seo-audit/)`');
md.push('');
md.push('### 2.4 Self-Inflicted Roundup Leak on `/blog/8-best-aeo-agencies-in-melbourne/` and `/blog/best-aeo-agencies-in-australia/`');
md.push('- On `https://uprisedigital.com.au/blog/8-best-aeo-agencies-in-melbourne/` and `https://uprisedigital.com.au/blog/best-aeo-agencies-in-australia/`, the top Markdown comparison table begins with competitors rather than placing Uprise Digital at #1:');
md.push('  ```markdown');
md.push('  | Agency | Base | Named AEO service | Pricing published | Best fit |');
md.push('  |---|---|---|---|---|');
md.push('  | Luminary | Melbourne | Yes (GEO) | No | Mid-size and enterprise |');
md.push('  | StudioHawk | Melbourne | Yes (AI SEO) | No | Dedicated SEO retainers |');
md.push('  | Salt & Fuessel | Melbourne | Yes (AI Search) | No | Technical & enterprise |');
md.push('  | Intesols | Melbourne | Yes (AEO/AI SEO) | No | Mid-market businesses |');
md.push('  | A.P. Web Solutions | Melbourne | Yes (LLM SEO) | No | Technical SEO focus |');
md.push('  ```');
md.push('- **Resulting RAG Leak:** Across our 280 live queries, `uprisedigital.com.au` was cited in **61 answers**, but in **25 of those 61 answers (41.0%)**, AI engines extracted Luminary, StudioHawk, Salt & Fuessel, Intesols, Prosperity Media, or Juicebox from Uprise\'s own articles while omitting Uprise Digital.');
md.push('');
md.push('### 2.5 Verified Google Business Profile (GBP) Telemetry');
md.push('- **Canonical Australian GBP:** `Uprise Digital`, `Suite 22, 10-20 Gwynne Street, Cremorne VIC 3121`, Google Maps CID `10687603269286839320`.');
md.push('- **Verified Review Count & Rating:** **47 Google reviews (4.9★–5.0★)**.');
md.push('- **On-Site Hardcoded Mismatch:** Uprise\'s city AEO pages (`/aeo-melbourne/`, `/aeo-sydney/`, `/aeo-brisbane/`) contain hardcoded text stating `"40+ Google reviews"` or `"45+ reviews"`, which Google AI Mode quotes verbatim.');
md.push('');
md.push('---');
md.push('');
md.push('## 3. All 56 Live Australian Google Top-10 SERP Checks (`pipeline/serp_audit.json`)');
md.push('');
md.push('Executed via Firecrawl Google Search API (`country: "au"`, `limit: 10`) across all 8 markets × 7 AI Search queries.');
md.push('');
md.push('### 3.1 Summary: Google Top-10 SERP Presence vs. AI Answer Share ($r = 0.94$)');
md.push('');
md.push('| Market | Google Top-10 SERP Hits (of 7) | AI Answers Naming Uprise (of 35) | AI Share (%) | Market Rank |');
md.push('|---|---|---|---|---|');
for (const c of ['melbourne', 'sydney', 'brisbane', 'perth', 'adelaide', 'goldcoast', 'canberra', 'national']) {
  const sHits = S.filter(x => x.city === c && x.upriseInTop10).length;
  const m = M.cities[c];
  md.push(`| **${c.toUpperCase()}** | **${sHits} / 7** | **${m.lhdMentions} / 35** | **${m.somv}%** | **#${m.lhdRank}** |`);
}
md.push('');
md.push('### 3.2 Complete 56-Query Australian SERP Ledger');
md.push('');
md.push('| # | Market | Prompt ID | Exact Google AU Search Query | Uprise in Top 10? | Top 10 Domains Returned by Google Australia |');
md.push('|---|---|---|---|---|---|');
S.forEach((row, idx) => {
  md.push(`| ${idx + 1} | \`${row.city}\` | \`${row.prompt}\` | \`${row.serpQuery}\` | ${row.upriseInTop10 ? '**YES**' : 'No'} | ${row.topDomains.map(d => '`' + d + '`').join(', ') || '*(none)*'} |`);
});
md.push('');
md.push('---');
md.push('');
md.push('## 4. Complete Domain Citation Ledger (`pipeline/citations.json`) & The 25 Leaked Citations');
md.push('');
md.push('### 4.1 Top 35 Most-Cited Domains Across All 280 AI Answers');
md.push('');
md.push('| Rank | Cited Domain | Answers Citing Domain (of 280) | Share of Answers (%) |');
md.push('|---|---|---|---|');
const citEntries = Array.isArray(C) ? C : Object.entries(C).map(([domain, count]) => ({ domain, count })).sort((a, b) => b.count - a.count);
citEntries.slice(0, 35).forEach((item, i) => {
  const dom = item.domain || item[0];
  const cnt = item.count ?? item[1];
  md.push(`| ${i + 1} | \`${dom}\` | **${cnt}** | ${((cnt / 280) * 100).toFixed(1)}% |`);
});
md.push('');
md.push('### 4.2 Forensic Breakdown of All 61 Answers Citing `uprisedigital.com.au` (36 Named vs. 25 Leaked)');
md.push('');
md.push('| # | Cell (`Market · Prompt · Engine`) | Uprise Named in Answer? | Status | Agencies Extracted by AI From This Answer |');
md.push('|---|---|---|---|---|');
const citedAnswers = ans.filter(a => (a.sources || []).some(s => /uprisedigital\.com\.au/.test(s.domain || s.url || '')));
citedAnswers.forEach((a, i) => {
  const named = a.isTargetMentioned || a.firms.some(f => f.name === 'Uprise Digital');
  md.push(`| ${i + 1} | \`${a.city} · ${a.prompt} · ${a.platform}\` | ${named ? '**YES (Rank #' + a.targetRank + ')**' : '**NO (Omitted)**'} | ${named ? 'Converted Citation' : 'LEAKED TO COMPETITORS'} | ${a.firms.map(f => f.name).join(', ') || '*(none)*'} |`);
});
md.push('');
md.push('---');
md.push('');
md.push('## 5. Statistical & Historical Aggregations (`pipeline/metrics.json` & `pipeline/hist.json`)');
md.push('');
md.push('### 5.1 National Leaderboard (Top 15 Agencies Across All 280 Answers)');
md.push('');
md.push('| Rank | Agency | Total Mentions (of 280) | Share of Model Voice (%) | Avg Ordinal Position |');
md.push('|---|---|---|---|---|');
M.national.top.forEach((f, i) => {
  md.push(`| #${i + 1} | **${f.name}** | **${f.n} / 280** | **${((f.n / 280) * 100).toFixed(1)}%** | ${f.avgPos} |`);
});
md.push('');
md.push('### 5.2 Performance by AI Engine (`N = 56` per Engine) and Prompt (`N = 40` per Prompt)');
md.push('');
md.push('| Dimension | ID | Uprise Mentions | Total Queries | Uprise SoMV (%) | Category Leader |');
md.push('|---|---|---|---|---|---|');
for (const [p, v] of Object.entries(M.national.byPlat)) {
  md.push(`| **Engine** | \`${p}\` | **${v.lhd}** | ${v.n} | **${v.somv}%** | ${v.top[0]?.name} (${v.top[0]?.n}/${v.n}) |`);
}
for (const [q, v] of Object.entries(M.national.byPrompt)) {
  md.push(`| **Prompt** | \`${q}\` | **${v.lhd}** | ${v.n} | **${v.somv}%** | ${v.top[0]?.name} (${v.top[0]?.n}/${v.n}) |`);
}
md.push('');
md.push('### 5.3 City-by-City Standings (`N = 35` per Market)');
md.push('');
md.push('| Market | Uprise Mentions | SoMV (%) | 95% Wilson CI | WVI | Rank | Top 6 Agencies in Market |');
md.push('|---|---|---|---|---|---|---|');
for (const [c, v] of Object.entries(M.cities)) {
  md.push(`| **${c.toUpperCase()}** | **${v.lhdMentions} / 35** | **${v.somv}%** | [${v.ci95[0]}%, ${v.ci95[1]}%] | ${v.wvi} | **#${v.lhdRank}** (of ${v.firmsNamed}) | ${v.top.slice(0, 6).map(x => x.name + ' (' + x.n + ')').join(', ')} |`);
}
md.push('');
md.push('### 5.4 14-Month Historical Mention Series (`pipeline/hist.json`, Aug 2025 – Sep 2026)');
md.push('');
md.push('| Domain | Aug 25 | Sep 25 | Oct 25 | Nov 25 | Dec 25 | Jan 26 | Feb 26 | Mar 26 | Apr 26 | May 26 | Jun 26 | Jul 26 | Aug 26 | Sep 26 |');
md.push('|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|');
for (const [dom, obj] of Object.entries(H)) {
  md.push(`| \`${dom}\` | ${obj.hist.map(h => h.metrics.mentions).join(' | ')} |`);
}
md.push('');
md.push('---');
md.push('');
md.push('## 6. All 280 Verbatim AI Prompt Evaluations (`pipeline/ans_full.json`)');
md.push('');

ans.forEach((a, idx) => {
  const num = String(idx + 1).padStart(3, '0');
  const named = a.isTargetMentioned || a.firms.some(f => f.name === 'Uprise Digital');
  md.push(`### [#${num}] ${a.city.toUpperCase()} · \`${a.prompt}\` · \`${a.platform}\``);
  md.push(`- **Query Sent:** \`${a.query}\``);
  md.push(`- **Timestamp:** \`${a.at}\` | **Latency:** \`${a.latency_ms} ms\``);
  md.push(`- **Uprise Digital Mentioned:** **${named ? 'YES (Rank #' + a.targetRank + ' · ' + a.stance + ')' : 'NO'}**`);
  md.push(`- **Extracted Agencies (${a.firms.length}):** ${a.firms.map((f, i) => (i + 1) + '. ' + f.name).join(', ') || '*(none)*'}`);
  md.push(`- **Grounding Citations (${(a.sources || []).length}):** ${(a.sources || []).map(s => '`' + (s.domain || s.title) + '`').join(', ') || '*(none)*'}`);
  md.push('');
  md.push('<details><summary><b>Full Verbatim Response Transcript</b></summary>');
  md.push('');
  md.push('~~~~markdown');
  md.push((a.text || '').trim());
  md.push('~~~~');
  md.push('</details>');
  md.push('');
});

const finalMd = md.join('\n');
const outFile = path.join(rootDir, 'UPRISE_DIGITAL_RAW_EVIDENCE_LEDGER.md');
fs.writeFileSync(outFile, finalMd, 'utf8');
console.log(`Successfully generated ${outFile} (${finalMd.length} bytes, ${finalMd.split('\n').length} lines)`);
