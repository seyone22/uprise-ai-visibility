# Master Operational SOP: Generative Engine Optimization (GEO) & AI Visibility Audit System
**Standard Operating Procedure, Mathematical Protocols, Presentation Standards & New Client Onboarding Runbook**  
*System Level: Agency Production Standard · Uprise Digital*  
*Version: 3.0 · Fully Grounded, Dynamically Scaled, Dual-PIN Protected*  
*Authoritative Scope: Universal (Applicable to Any Commercial Entity, Niche, or Geographic Market)*

---

## 1. System Overview & Executive Principles

This document serves as the **definitive operational guide and standard operating procedure** for conducting empirical Generative Engine Optimization (GEO) and Answer Engine Optimization (AEO) visibility audits for any corporate client or prospective agency account.

Every audit delivered by this platform must satisfy **four core non-negotiable invariants**:

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                          THE 4 PRODUCTION INVARIANTS                                           │
├────────────────────────────┬────────────────────────────┬──────────────────────────────┬───────────────────────┤
│ 1. ZERO SIMULATION         │ 2. STRATEGIC RESTRAINT     │ 3. DUAL-KEYED ACCESS         │ 4. REPO & DEPLOY ISOLATION
│ • No fake/mocked answers   │ • Mirror Ned's style       │ • Clean white gatekeeper     │ • NEW GitHub repo per client
│ • Dynamic sample size      │ • High-level authority     │ • Client PIN: Tier 1 only    │ • Never merge client code
│   N = M × Q × E            │ • Zero recipe giveaways    │ • Internal PIN: Tier 1 & 2   │ • Same Railway project OK
│ • Live authenticated APIs  │ • Deep math in Tier 2 only │ • Server-side HttpOnly token │ • Distinct service & domain
└────────────────────────────┴────────────────────────────┴──────────────────────────────┴───────────────────────┘
```

---

## 2. Scientific Rigor & Mathematical Foundations

### 2.1 Dynamic Sample Size Formulation ($N = M \times Q \times E$)
The audit universe must strictly reflect the verified, live-authenticated AI engines available:
$$N = M \times Q \times E$$
- **$M$ (Markets):** Number of target geographic regions or commercial segments (Standard: $M = 8$).
- **$Q$ (Queries):** Standardized commercial buying intent prompt battery (Standard: $Q = 7$ per market).
- **$E$ (Active Engines):** Count of active, authenticated AI answer engines with verified live API keys ($E \in \{2, 3, 5\}$).

| Engine Count ($E$) | Active Authenticated Services | Sample Size ($N$) | Market Denominator ($M_d$) | Production Behavior |
| :---: | :--- | :---: | :---: | :--- |
| **$E = 5$** | Gemini 3.8, Google AI Mode, Claude 4.6, ChatGPT Search, Perplexity | **$N = 280$** | **35 per market** | Full cross-engine consensus matrix |
| **$E = 3$** | Google AI Mode, Gemini 3.8, Claude 4.6 | **$N = 168$** | **21 per market** | Grounded local + general LLM evaluation |
| **$E = 2$** | Google AI Mode, Gemini 3.8 | **$N = 112$** | **14 per market** | Search indexation + SERP grounding audit |

> [!IMPORTANT]
> **The Zero-Simulation Mandate:** Under no circumstances are missing engines to be simulated, synthesized, or hallucinated. The platform dynamically scales its denominator $N$, adjusts all chart axes, and renders only columns corresponding to authenticated engines.

### 2.2 Unified Multi-Engine Ingestion Architecture (DataForSEO AI Suite)

To achieve the full $E = 5$ ($N = 280$) multi-engine consensus matrix without maintaining individual enterprise subscriptions across OpenAI, Perplexity, Anthropic, and Google Cloud, the pipeline utilizes **DataForSEO's AI Optimization API Suite** (`/v3/ai_optimization/`).

DataForSEO acts as a unified programmatic gateway that executes live prompts across commercial AI engines using a single API credential (`DATAFORSEO_AUTH`):

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        DATAFORSEO UNIFIED AI GATEWAY ARCHITECTURE                      │
├──────────────────────────┬────────────────────────────────────────┬────────────────────┤
│ Engine Target            │ DataForSEO API Endpoint                │ Authentication     │
├──────────────────────────┼────────────────────────────────────────┼────────────────────┤
│ 1. ChatGPT Search / 4o   │ /v3/ai_optimization/chat_gpt/llm_responses/live │ Basic DATAFORSEO   │
│ 2. Perplexity Sonar      │ /v3/ai_optimization/perplexity/llm_responses/live │ Basic DATAFORSEO   │
│ 3. Google AI Mode / AIO  │ /v3/serp/google/ai_mode/live/advanced  │ Basic DATAFORSEO   │
│ 4. Google Local 3-Pack   │ /v3/serp/google/organic/live/advanced  │ Basic DATAFORSEO   │
│ 5. Claude Sonnet         │ /v3/ai_optimization/claude/llm_responses/live   │ Basic DATAFORSEO   │
│ 6. Google Gemini Grounded│ Direct Google GenAI API or DataForSEO  │ GEMINI_API_KEY     │
└──────────────────────────┴────────────────────────────────────────┴────────────────────┘
```

#### Key Capabilities of the Unified Gateway:
1. **Zero Provider Account Sprawl:** Eliminates the operational requirement to manage individual OpenAI Plus/API, Perplexity Pro, or multi-vendor credit cards. All queries are metered pay-per-task against the agency DataForSEO balance.
2. **Deterministic Australian Geo-Targeting:** Passing `location_name: "Melbourne,Victoria,Australia"` forces DataForSEO to execute prompts through localized Australian residential proxies, guaranteeing that ChatGPT and Perplexity return authentic Australian agency recommendations rather than US-skewed results.
3. **Structured Citation Extraction:** Responses automatically include raw generative prose, web source URLs, domain citation metadata, and token execution latency.
4. **Token Compression (`.ai` Suffix):** Appending `.ai` to endpoints (e.g. `/v3/ai_optimization/chat_gpt/llm_responses/live.ai`) compresses payloads by stripping null/empty structures, dramatically reducing processing memory.

### 2.3 Core Metric Formulations

#### 1. Share of Model Voice ($\widehat{\text{SoMV}}$)
The unweighted probability that the target commercial entity $E$ is explicitly named in an unprompted natural language recommendation response:
$$\widehat{\text{SoMV}}(E) = \left( \frac{1}{N} \sum_{i=1}^{N} \mathbb{I}(E \in \text{Entities}(R_i)) \right) \times 100\%$$
*(Where $\mathbb{I}$ is the indicator function: $1$ if entity is present, $0$ otherwise).*

#### 2. Weighted Visibility Index ($\text{WVI}$)
Accounts for steep consumer attention drop-off by applying a logarithmic rank decay factor weighted by sentiment stance polarity $S_{ik} \in \{+1.0, +0.5, -0.5\}$:
$$\text{WVI}(E) = \frac{1}{N} \sum_{i=1}^{N} \left( \sum_{k=1}^{K_i} \frac{S_{ik}}{\log_2(r_{ik} + 1)} \cdot \mathbb{I}(E = \text{Entity}_{ik}) \right)$$

#### 3. Exact 95% Confidence Bounds (Wilson Score Interval)
Prevents sample-size distortion when proportions are close to $0\%$ or $100\%$:
$$w = \frac{\hat{p} + \frac{z^2}{2N} \pm z\sqrt{\frac{\hat{p}(1-\hat{p})}{N} + \frac{z^2}{4N^2}}}{1 + \frac{z^2}{N}} \quad (\text{where } z = 1.960)$$

#### 4. Logistic Odds Ratio & Upstream Attribution
Estimates the causal probability of generative recommendation based on directory presence, local map pack rankings, and review volume:
$$\text{logit}\left(P(E \in \text{Rec})\right) = \beta_0 + \beta_1 X_{\text{Directory}} + \beta_2 X_{\text{MapPack}} + \beta_3 \ln(X_{\text{Reviews}} + 1)$$

---

## 3. Dual-Deck Presentation Architecture

Every client engagement is compiled into a synchronized two-tiered architecture:

```
┌────────────────────────────────────────────────────────────────────────┐
│                      TWO-TIER DECK ARCHITECTURE                        │
├──────────────────────────────────┬─────────────────────────────────────┤
│ TIER 1: Executive Pitch Deck     │ TIER 2: Technical Dossier           │
│ Route: / or index.html           │ Route: /technical or technical.html │
│ Audience: C-Suite, Founder, CMO  │ Audience: Data Scientists, CTO, Eng │
│ Tone: Consultative, Commercial   │ Tone: Econometric, Mathematical     │
│ Style: Mirrors Ned's LHD Deck    │ Style: Full Academic Telemetry      │
│ Access: Client PIN (2026)        │ Access: Internal PIN (9418) only    │
│ Leaks: ZERO proprietary recipes  │ Content: Cosine thresholds, DDL     │
└──────────────────────────────────┴─────────────────────────────────────┘
```

### 3.1 The Ned Presentation Standard (Forensic Specificity vs. Prospect Redaction)
In Ned Mehic's benchmark deck (`lhd-ai-visibility`, Pages 21–28), authority comes from **hyper-specific empirical evidence**, not vague generalizations:
1. **Default Standard (Full Forensic Specificity — Internal & Standard Benchmarks):**
   - **Slide 23 (`ws-sources`):** Name the **exact third-party domains and citation counts** computed from the 280 answers (e.g., `doylesguide.com` [39], `lawconnect.com` [38], or for agencies: `clutch.co`, `goodfirms.co`, `semrush.com`, `designrush.com`, `mumbrella.com.au`), paired with exact submission actions and current tier standing.
   - **Slide 24 (`ws-maps`):** Show the exact map pack count (`X/7`) and exact verified Google review count per market, naming the specific competitor dominating the map pack (e.g., *"Google AI Mode named Garling & Co in 6 of 7 Sydney answers. Garling appears in 5 of 7 Sydney map packs"*).
   - **Slide 25 (`ws-pages`):** Show the exact $8 \times 7$ city-by-intent zero-cell matrix (`cp` grid), explicitly naming which existing URLs on the client's site score `0/5` vs. which city/intent pages do not exist yet.
   - **Slide 26 (`ws-entity`):** Show **3 real, verbatim quotes** from `answers.json` / `ans_full.json` paired with **actual verified discrepancies on the client's live website** (e.g., conflicting metrics between subpages and homepage, misnamed acronyms, or unlinked acquisitions/founders). Never hand-type synthetic quotes.
2. **Optional Prospect Redaction Mode (Pulp-Style Safeguard Only):**
   - *Only* when explicitly instructed by leadership to withhold the self-execution checklist from a prospect who might DIY it (as was done solely for Pulp Digital), group Slide 23 domains into high-level authority buckets (*Verified Agency Directories*, *Official Partner Ecosystems*, etc.). Never apply this redaction to internal Uprise blueprints or standard Ned-style forensic audits.
3. **Action Headers:** Standardize execution bullet points under clean consultative headers: `"What we will do"`.
4. **Link Isolation:** Never embed public buttons or hyperlinks to `technical.html` on the client deck.

### 3.2 The 1:1 Claim-to-Proof Law & Proof Verification Matrix

> [!IMPORTANT]
> **The 1:1 Claim-to-Proof Mandate:** Every single empirical claim, statistic, competitor benchmark, algorithmic diagnostic, or operational deliverable presented to prospective clients in the Tier 1 Presentation (`/`) **MUST have a direct, verifiable, attached empirical proof** in the Tier 2 Technical Dossier (`/technical`). Zero claims may exist without empirical grounding.

#### Master Claim-to-Proof Verification Matrix

Every audit deliverable must satisfy this cross-tier mapping before client delivery:

| # | Tier 1 Client Deck Claim Category | Client Slide Example (30-Slide / 24-Slide) | Tier 2 Empirical Proof & Attachment Standard | Required Technical Dossier Evidence |
| :---: | :--- | :--- | :--- | :--- |
| **01** | **Sample Size Cardinality ($N$)** | Cover / Slide 3: *"N = 8 × 7 × E answers"* | Matrix cardinality breakdown ($M \times Q \times E$), authenticated API list, and live query execution timestamps. | `2.0 Problem Formulation`: Formal parameter table with exact $M$, $Q$, $E$, and $N$. |
| **02** | **Share of Model Voice ($\widehat{\text{SoMV}}$)** | Slide 4 & 5: *"Client captured X% of answers"* | Exact mathematical derivation, mention indicator sum, and asymmetric Wilson Score 95% Confidence Interval bounds ($[w^-, w^+]$). | `3.0 / 5.0 Share of Model Voice`: Formula + derivation table with $p$-values and Wilson CIs. |
| **03** | **Rank Decay Prominence ($\text{WVI}$)** | Slide 4 & 7: *"Client visibility index is 0.013 vs 0.518"* | Discounted Cumulative Gain formulation, ordinal position decay weights ($1/\log_2(r+1)$), and stance polarity coefficients ($S \in \{+1.0, +0.5, -0.5\}$). | `4.0 / 6.0 Weighted Visibility Index`: DCG decay table + competitor score benchmark. |
| **04** | **Power-Law Leaderboard & Moats** | Slide 7: *"Top competitors capture 60%–70% of mentions"* | Empirical frequency counts across all $N$ cells, competitor rank distributions, and Pareto concentration curves. | `8.0 National Leaderboard`: Full cohort rank, mention count, SoMV, WVI, and moat analysis. |
| **05** | **Interstate Zero & Local Strongholds** | Slide 5 & 20: *"Client scores 0.0% in interstate capital cities"* | 8-Market Scorecard table showing $n/M_d$ counts, $p$-values, and non-overlapping regional confidence bounds. | `9.0 Geographic Scorecard`: Complete market-by-market scorecard table. |
| **06** | **Engine Retrieval Disconnect** | Slide 8: *"Google AI Mode cites client; Claude & ChatGPT omit"* | Platform retrieval bias matrix comparing grounded RAG engines vs directory-dependent parametric LLMs. | `11.0 Engine Retrieval Bias`: Architecture comparison + citation source decomposition. |
| **07** | **Workstream 01: Directory Citation Moat** | Slide 22 & 23 (or 16 & 17): *"Top directories cited in 26 to 39 answers each"* | Upstream Citation Topology table detailing exact domain citation counts across the $N$ answers. | `8.0 / 15.0 Upstream Citation Ledger`: Exact domain citation counts and percentage share. |
| **08** | **Workstream 02: Review Count & Map Pack Deficit** | Slide 10 & 24 (or 14 & 18): *"Client in X of 7 map packs; verified Google reviews"* | Google Places API / GBP CID-pinned review & rating audit table plus Multivariate Logit Regression Odds Ratios ($e^{\beta}$). | `13.0 Regression Results & Review Audit`: Review benchmark table (Client vs Leaders) + logit $\beta$ & $OR$. |
| **09** | **Workstream 03: Crawl Ingestion & Page Gaps** | Slide 22 & 25 (or 16 & 19): *"X market × intent pairs where 0 of 5 engines name Client"* | Live Search Grounding Telemetry Log + URL-level audit of existing vs missing service/location pages. | `6.0 Empirical Grounding & Web Crawl Log`: Table of exact crawl events, URLs, and missing page inventory. |
| **10** | **Workstream 04: Entity & Fact Discrepancies** | Slide 22 & 26 (or 16 & 20): *"AI gets some facts about [Client] wrong"* | Verbatim quotes from `ans_full.json` cross-referenced against live HTML/meta/JSON-LD extraction on the client domain. | `7.0 / 16.0 Knowledge Graph & Schema Audit`: Discovered schema code + live site discrepancy table. |
| **11** | **Workstream 05: Longitudinal Drift & Re-Audit** | Slide 22 & 27 (or 16 & 21): *"The first 90 days, week by week"* | PostgreSQL / DuckDB DDL schema, multi-epoch cron resampling protocol, and Wilcoxon Signed-Rank hypothesis test ($p < 0.05$). | `9.0 / 21.0 Longitudinal Telemetry & DDL`: DDL tables + Wilcoxon signed-rank formula & cron protocol. |
| **12** | **12-Month Commercial Projections** | Slide 28 (or 22): *"The goal: overtake [Mid-Table Competitor] in [Home Market] within 12 months"* | 12-month econometric transition model, sequenced milestone bounds, and required covariate deltas ($\Delta X$). | `20.0 Predictive Trajectory Modeling`: Milestone table with conservative SoMV targets and covariate transition roadmap. |

### 3.3 Target Setting & Strategic Restraint Law (Ned's Formula)

> [!IMPORTANT]
> **Ned Mehic's Law of Strategic Restraint:** AI visibility audits must read like forensic engineering diagnostics, NEVER agency sales hype. We do not promise blanket "#1 in the state/country" dominance from a low or zero baseline.

1. **Never Promise #1 Overall:**  
   Never frame client targets as *"Become the #1 Recommended Provider in Victoria / Australia"*. Blanket monopoly claims destroy executive credibility and invite skepticism from sophisticated buyers.
2. **Anchor to a Specific Named Mid-Table Rival:**  
   Always frame the 12-month milestone around knocking off a realistic, identifiable mid-table competitor in their primary home market:
   - *LHD Template:* `"The goal: overtake Law Partners in Sydney within 12 months"`
   - *Rayamp Solar:* `"The goal: overtake Green Line Solar in Melbourne East within 12 months"`
   - *Uprise Digital:* `"The goal: overtake Clearwater Agency in Melbourne within 12 months"`
3. **Sequenced, Realistic Milestones:**  
   Trajectory projections must be step-by-step and mathematically defendable based on baseline rank:
   - **Starting from 0%–5% / Low Baseline:**  
     - **90 Days (Month 3):** 15%–25% · Break into Top 5–10  
     - **6 Months (Month 6):** 30%–45% · Contend for Top 3–5  
     - **12 Months (Month 12):** 45%–60% · Overtake targeted mid-table rival  
   - **Starting from Established Baseline (20%–30%):**  
     - **90 Days:** 40%–45% · Solidify Top 5  
     - **6 Months:** 55%–65% · Contend for Top 3  
     - **12 Months:** 75%–80% · Overtake #2 / challenge category leader
4. **Geographic Sequencing:**  
   Always lead with the client's home market first (e.g., Sydney for LHD, Melbourne for Uprise Digital, Melbourne East for Rayamp Solar). Regional and interstate expansion follows in Months 2 and 3, using the home hub as the operating template.
5. **Entity Disambiguation & Review Audit Integrity (No Hardcoding):**  
   When auditing Google Business Profiles or third-party reviews, NEVER hardcode unverified review counts in `build.mjs` and NEVER rely on unpinned text queries (e.g. `"Brand Name reviews"`), which trigger homonymous brand collisions with international namesakes (such as Uprise Digital UK's 18 reviews vs. Uprise Digital Cremorne's 47 reviews). Always pin queries strictly to the unique Google Place ID, Google `CID`, and verified street address.

### 3.4 Forensic Copywriting & Canonical 30-Slide Deck Architecture (Ned's Benchmark)

> [!IMPORTANT]
> **The Forensic Authority Standard:** Clients hire us because the deck reads like an unassailable engineering audit, not an agency sales pitch. Every slide title must be active, understated, and factual.

#### 1. Banned Jargon vs. Ned's Forensic Phrasing (Mapped to Canonical 30-Slide Benchmark)
| Slide # (30-Slide / 24-Slide) | ❌ Banned Agency Jargon | ✅ Required Ned Forensic Phrasing |
| :--- | :--- | :--- |
| **Slide 2 (`shift`)** | *"Buyers no longer click 10 Google links..."* | *"More Australians are asking AI which [category provider] to choose"* |
| **Slide 4 (`national`)** | *"[Competitors] dominate AI recommendations across Australia"* | *"Across all 280 answers, [Client] is #[Rank] — behind [Competitor A] and [Competitor B]"* |
| **Slide 10 (`[home]-why`)** | *"Why Competitors Win: Multi-Channel Synergy"* | *"[Home City]'s AI favourites lead on rankings, reviews and Google Maps"* |
| **Slide 20 (`gap`)** | *"The Regional Blind Spot: Millions in revenue flowing..."* | *"[Client] trails the most-named firm in [X] of 8 markets"* |
| **Slide 21 / 15 (`plan-intro`)**| *"The 5-Pillar GEO Roadmap to Make [Client] #1"* | *"How [Client] gets on every shortlist"* |
| **Slide 22 / 16 (`plan`)** | *"Five synchronized workstreams addressing each empirical gap"* | *"Five workstreams, each answering a gap in the data"* |
| **Slide 23 / 17 (`ws-sources`)**| *"AI copies its shortlist from authoritative industry ecosystems"* | *"AI copies its shortlist from rankings guides and directories"* |
| **Slide 24 / 18 (`ws-maps`)** | *"Local Signals & Map Pack Optimization"* | *"Google Maps decides who Google's own AI names"* |
| **Slide 25 / 19 (`ws-pages`)** | *"Dedicated solution architecture for high-value intents"* | *"[X] market and question pairs where no assistant names [Client]"* |
| **Slide 26 / 20 (`ws-entity`)** | *"What AI gets right, what it misses, and how we fix it"* | *"AI gets some facts about [Client] wrong"* |
| **Slide 27 / 21 (`roadmap`)** | *"The 90-day Generative Engine Optimization (GEO) rollout plan"* | *"The first 90 days, week by week"* |
| **Slide 27 Phases** | *"Month 1: Foundation... Month 3: National Domination"* | *"Month 1: fix foundations · Month 2: build pages & profiles · Month 3: scale to every city"* |
| **Slide 28 / 22 (`targets`)** | *"The Goal: Become the #1 Recommended Provider in 12 Months"* | *"The goal: overtake [Mid-Table Competitor] in [Home Market] within 12 months"* |
| **Slide 29 / 23 (`close`)** | *"Start with [City]. Infiltrate the shortlists. Dominate recall."* | *"Start with [Home Market]. Measure every month."* |
| **Slide 30 / 24 (`appendix`)** | *(Omitted or placed before Close)* | *"Method and definitions"* (Always the final slide, after `close`) |

#### 2. The Verbatim AI Hallucination & Error Quoting Mandate (Slide 26 / `ws-entity`)
Slide 26 (`ws-entity`) must **never** feature polite, flattering, or hand-typed synthetic quotes. Every quote must be extracted verbatim from `ans_full.json` / `answers.json` and paired with a verified site/profile audit finding:
* **Invented / Conflated Entities:** Models inventing company names, confusing UK/US namesakes, or recommending directories/brokers as competitors.
* **Outdated or Contradictory Numbers:** Models quoting outdated figures or claims because legacy subpages or meta descriptions contradict the homepage (e.g., LHD's Sydney page saying `"Over $220M"` while the homepage says `"$260 million"`).
* **Uncorroborated Primary Claims / Omissions:** Models crediting competitors for the exact specialty the client claims to own (e.g., Uprise Digital specializing in GEO/AI Search while AI engines name Megaphone or First Page instead).

#### 3. Canonical 30-Slide Master Deck Anatomy (Ned's `lhd-template-repo` Benchmark)
Every full multi-market audit follows Ned Mehic's exact **30-slide sequence** (where **Pages 21–28** form the core operational plan benchmark, **Page 29** is `close`, and **Page 30** is `appendix`):
1. `cover`: Clean cover (`When Australians ask AI for [Service], who gets recommended?`)
2. `shift`: The market shift (`More Australians are asking AI which [provider] to choose`)
3. `method`: Cardinality equation ($8 \text{ markets} \times 7 \text{ questions} \times 5 \text{ assistants} = 280 \text{ answers}$)
4. `national`: Overall standings across all 280 answers + by-assistant strip
5. `map`: Geographic map of Australia with market bubbles (`rate% · #rank`)
6. `[home]-intro`: Accent divider slide for the primary home market (e.g., `01 · Sydney` or `01 · Melbourne`)
7. `[home]-board`: Home market top 10 horizontal bars + KPI callouts
8. `[home]-heat`: Home market agency $\times$ assistant heatmap (`out of 7 per assistant`)
9. `[home]-practice`: Home market commercial intent / practice breakdown (`dots out of 5 engines` + category leader)
10. `[home]-why`: Why leaders win table (`AI Mentions | Directory Tier | Google Rating (Reviews) | Map Packs`)
11–17. `city-2` through `city-8`: 7 individual market slides generated via `citySlide(c, i + 2)` (`3-column layout: Top 7 bars | KPI + By Assistant + By Intent strips | 3 forensic findings`)
18. `pattern`: Authority footprint vs. AI answer share scatter plot
19. `trend`: 14-month historical LLM citation trend + Share of Model Voice mini-chart
20. `gap`: Dumbbell chart (`Client vs. most-named competitor in each market`)
21. `plan-intro`: Accent divider (`The plan: How [Client] gets on every shortlist`)
22. `plan`: The 5 workstreams table (`Workstream | What the data shows | What we will do`)
23. `ws-sources`: Workstream 01 — Exact third-party domains cited in the 280 answers + submission plan
24. `ws-maps`: Workstream 02 — Google Maps pack presence (`X/7`) & verified review counts by market
25. `ws-pages`: Workstream 03 — $8 \times 7$ market-by-intent heatmap highlighting `0/5` zero cells + page build/rewrite list
26. `ws-entity`: Workstream 04 — `AI gets some facts about [Client] wrong` (3 verbatim quotes + live site discrepancies)
27. `roadmap`: 12-week Gantt chart (`The first 90 days, week by week`)
28. `targets`: 12-month trajectory chart + 8-market target table (`The goal: overtake [Mid-Table Competitor] in [Home Market] within 12 months`)
29. `close`: Dark action close (`Start with [Home Market]. Measure every month.` + 3 numbered steps)
30. `appendix`: 2-column methodology appendix (`Method and definitions: How answers were collected | How answers were scored`)

*(Note: For single-state/regional contractor audits like `rayamp-ai-visibility` where 5 regional corridors are consolidated into a single summary slide instead of 7 separate city slides, the deck compacts to a 24-slide variant where Slides 15–22 correspond to Slides 21–28 above, Slide 23 is `close`, and Slide 24 is `appendix`.)*

---

## 4. Keyed Access & Security Gateway

### 4.1 Minimalist White Gatekeeper Design
The entry barrier must match the clean, simple white aesthetic:
- **Title:** `Private page`
- **Subtitle:** `This page is shared privately by Uprise Digital. Enter the access code you were sent.`
- **Form:** Clean `Access code` input field + dark `Continue` button.
- **Footer:** `Uprise Digital · Confidential`.
- **Zero Role Disclosures:** Never mention "Client vs Internal PIN" on the public login UI.

### 4.2 Server-Side Access Control Logic
- **Client Code (`CLIENT_PIN`, default `2026`):**
  - Unlocks Tier 1 Executive Presentation (`/`).
  - Requesting `/technical` returns **403 Forbidden** with a clean message: *"This section is restricted to internal team members."*
- **Internal Code (`INTERNAL_PIN`, default `9418`):**
  - Unlocks both Tier 1 Presentation and Tier 2 Technical Dossier (`/technical`).
  - Injects a discrete floating `Technical Dossier →` switcher button when viewing the client deck.
- **Session Cookie:** Signed HMAC token (`pulp_auth`) with `HttpOnly; SameSite=Lax; Path=/; Max-Age=2592000` (30 days).

---

## 5. New Client Onboarding Runbook (New Chat Protocol)

When starting a fresh chat to audit a brand-new company, follow this sequential 7-step runbook:

### Step 1: Collect Client Profile Parameters
Gather the following inputs from the intake questionnaire:
```json
{
  "clientName": "Acme Digital",
  "clientDomain": "acmedigital.com.au",
  "homeCity": "sydney",
  "categoryName": "Performance Growth Marketing Agency",
  "primaryAccent": "#2563EB",
  "darkBg": "#0B0F17",
  "paperBg": "#F8FAFC",
  "competitors": [
    { "name": "Megaphone Marketing", "domain": "megaphonemarketing.com.au" },
    { "name": "Sparro", "domain": "sparro.com.au" },
    { "name": "Impressive", "domain": "impressive.com.au" }
  ]
}
```

### Step 2: Establish the 7 Commercial Buying Intent Prompts
Adapt the standardized prompt battery to the client's industry:
1. `general`: *"Best [service category] in [city] for high-growth brands"*
2. `meta`: *"Top Meta / Facebook Ads agency in [city] with proven case studies"*
3. `google`: *"Best Google Ads and Performance Max agency for [niche] in [city]"*
4. `scaling`: *"Which agencies specialize in scaling brands from $1M to $10M in [country]?"*
5. `creative`: *"Top performance creative and UGC advertising agency in [city]"*
6. `platform`: *"Leading [platform, e.g. Shopify / TikTok / B2B] performance agency in [city]"*
7. `retention`: *"Best paid media agency offering full-funnel CRO and retention strategy"*

### Step 3: Configure Environment Variables (Unified DataForSEO Pipeline)
A single DataForSEO API credential powers live querying across ChatGPT, Perplexity, Google AI Mode, and Google Local 3-Pack SERPs. Direct Gemini or Anthropic keys can be added for native SDK redundancy:

```bash
# Primary Unified AI Engine Gateway (Powers ChatGPT, Perplexity, AI Mode, SERPs)
DATAFORSEO_AUTH="your-login:your-password-base64"

# Optional Direct Native SDK Keys (for Vertex / Claude direct calls)
GEMINI_API_KEY="your-gemini-key"
ANTHROPIC_API_KEY="your-anthropic-key"

# Access Gateway & Session Security
CLIENT_PIN="2026"
INTERNAL_PIN="9418"
SESSION_SECRET="your-secure-salt"
```

### Step 4: Run Live Ingestion via DataForSEO AI Gateway
Execute data collection across all 5 engines using the unified DataForSEO AI Optimization pipeline:

```bash
node run_comprehensive_research.mjs
```

#### Production DataForSEO AI API Integration Logic:
```javascript
// Example: Live ChatGPT & Perplexity Ingestion via DataForSEO
async function queryAiModel(platform, prompt, location = 'Melbourne,Victoria,Australia') {
  const auth = 'Basic ' + process.env.DATAFORSEO_AUTH;
  const endpoint = platform === 'perplexity' 
    ? 'https://api.dataforseo.com/v3/ai_optimization/perplexity/llm_responses/live'
    : 'https://api.dataforseo.com/v3/ai_optimization/chat_gpt/llm_responses/live';

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Authorization': auth, 'Content-Type': 'application/json' },
    body: JSON.stringify([{
      prompt: prompt,
      location_name: location,
      language_name: 'English'
    }])
  });

  const json = await res.json();
  const task = json.tasks?.[0]?.result?.[0];
  return {
    raw_response: task?.items?.[0]?.description || task?.text || '',
    sources: task?.items?.[0]?.sources || [],
    latency_ms: task?.time_to_first_token_ms || 1200
  };
}
```

- Ingestion checks `.env` for `DATAFORSEO_AUTH`.
- Fires live search-grounded API calls across $M$ markets $\times$ $Q$ prompts $\times$ $E=5$ authenticated engines (ChatGPT, Perplexity, AI Mode, Gemini, Claude).
- Stores immutable JSON responses in `pipeline/raw/`.
- Resolves entity aliases via canonical mapping.

### Step 5: Calculate Dynamic Metrics
Compile normalized statistics:
```bash
node pipeline/metrics.mjs
```
- Automatically extracts `activePlatforms = [...new Set(ans.map(a => a.platform))]`.
- Calculates SoMV, WVI, rank distributions, and matrix heatmaps.
- Emits `metrics.json`.

### Step 6: Compile Dual-Deck HTML Deliverables
Compile Tier 1 and Tier 2 HTML presentations:
```bash
node pipeline/build.mjs
node pipeline/build_technical.mjs
cp pipeline/out/*.html site/
```
- Generates `site/index.html` (Tier 1 pitch deck with dynamic scaling and zero leaks).
- Generates `site/technical.html` (Tier 2 mathematical dossier).

### Step 7: Repository Isolation, Verification & Multi-Service Railway Deployment

1. **Dedicated GitHub Repository Creation (MANDATORY):**
   - Every client engagement MUST have its OWN isolated directory and dedicated GitHub repository:
   ```bash
   cd <client-slug>-ai-visibility
   git init
   git branch -M master
   git add .
   git commit -m "feat: initial commit for <Client Name> GEO audit"
   gh repo create seyone22/<client-slug>-ai-visibility --public --source=. --remote=origin --push
   ```
   - **CRITICAL:** NEVER merge client codebases or commit one client's audit into another client's repository!

2. **Automated QA, Leak & DOM Verification:**
   - Execute verification suite:
   ```bash
   node test_verification.js
   ```
   - Verify unauthenticated visitor receives only the clean white "Private page".
   - Verify Client PIN (`2026`) cannot access `/technical` (returns 403 Forbidden).
   - Verify Internal PIN (`9418`) accesses `/technical` (returns 200 OK).
   - Verify zero occurrences of proprietary directory checklists on `index.html`.
   - Verify `#stage`, `#bar`, `#count`, and `#controls` DOM elements are present in compiled HTML to prevent black-screen rendering bugs.

3. **Railway Multi-Service Deployment (Same Project, Dedicated Deploy):**
   - You can reuse the existing Railway organization/project (e.g. `pulp-ai-visibility` or agency project).
   - **MANDATORY:** Add a **new, dedicated service** for the client—NEVER overwrite an existing client service!
   ```bash
   # Link to project
   railway link -p <project-id> -e <environment-id>

   # Add dedicated service for this client linked to their own GitHub repo
   railway add --service <client-slug>-ai-visibility --repo seyone22/<client-slug>-ai-visibility --branch master

   # Generate dedicated service public domain
   railway domain --service <client-slug>-ai-visibility

   # Deploy code to dedicated service
   cd site && railway up -s <client-slug>-ai-visibility -d -y
   ```
   - Confirm via `railway service list` that both services remain online on separate URLs.

---

## 6. Pre-Flight Quality Assurance Checklist

Before sending any deliverable to an executive or client prospect, verify every item:

- [ ] **Isolated GitHub Repository:** Client audit has its own separate GitHub repo (`seyone22/<client-slug>-ai-visibility`); zero code merged into other client repos.
- [ ] **Dedicated Railway Service & Domain:** Deployed as a distinct service on Railway with its own URL (`<client-slug>-ai-visibility-production.up.railway.app`); never overwriting another client's service.
- [ ] **DOM Architecture Integrity:** `#stage`, `#bar`, `#count`, and `#controls` elements are present to ensure `deck.js` mounts without black screen regression.
- [ ] **Zero API Keys in Git:** All secrets stored in `.env`; `.gitignore` includes `.env`, `test_*.js`, and `*.log`.
- [ ] **Zero Hallucination:** Dataset contains only live authenticated queries; no fake/simulated proxy rows.
- [ ] **Dynamic Denominators:** Sample size formula $N = M \times Q \times E$ matches actual ingested records.
- [ ] **1:1 Claim-to-Proof Standard (MANDATORY):** Every factual claim in Tier 1 (reviews, citations %, crawl telemetry, schema deficits, logit odds, 12-month projections) has an attached empirical table, derivation, or extract in Tier 2 (`/technical`).
- [ ] **Pages 21–28 Forensic Specificity (Ned's Benchmark):** Exact citation counts by domain (`ws-sources`), CID-pinned review counts (`ws-maps`), $8 \times 7$ zero-cell matrix + URL-level gaps (`ws-pages`), and 100% real verbatim quotes + live site discrepancies (`ws-entity`) — unless Prospect Redaction Mode is explicitly requested.
- [ ] **Sequenced Mid-Table Target & Slide Order:** Targets slide anchors to overtaking a specific named mid-table rival in 12 months (never promising blanket #1), and `close` (Slide 29/23) precedes `appendix` (Slide 30/24).
- [ ] **No Public Dossier Link:** Client HTML has zero anchor tags linking to `technical.html`.
- [ ] **Clean White Gatekeeper:** Gatekeeper uses pure white minimalist UI matching agency confidential standard.
- [ ] **Separate PIN Verification:** Client PIN cannot access `/technical`; Internal PIN unlocks both views.
- [ ] **Cross-Device Fluidity:** 16:9 stage scaling (`--k`) operates smoothly across desktop, laptop, and mobile.
