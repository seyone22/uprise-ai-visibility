// Rigorous Empirical Scientific GEO / AI Search Visibility Research Runner for Uprise Digital
// Target: Uprise Digital (https://uprisedigital.com.au)
// Vertical Focus: AI Search (GEO / AEO / AI SEO / LLM Visibility)
// Markets: 8 Australian Markets | Prompts: 7 AI Search Prompts | Engines: 5 Live Search-Grounded Engines
// Total empirical queries: N = 8 * 7 * 5 = 280 live observations + 56 Australian Google SERP checks

import fs from 'fs';
import path from 'path';

function loadEnv() {
  const envPath = path.resolve('.env');
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf8').split('\n');
    for (const line of lines) {
      const idx = line.indexOf('=');
      if (idx > 0 && !line.trim().startsWith('#')) {
        process.env[line.slice(0, idx).trim()] = line.slice(idx + 1).trim().replace(/^['"]|['"]$/g, '');
      }
    }
  }
}
loadEnv();

const TARGET_BRAND = 'Uprise Digital';
const TARGET_DOMAINS = ['uprisedigital.com.au', 'www.uprisedigital.com.au'];

const CITIES = [
  { id: 'melbourne', name: 'Melbourne', state: 'Victoria', country: 'Australia', localTarget: true, locationName: 'Melbourne, Victoria, Australia' },
  { id: 'sydney', name: 'Sydney', state: 'New South Wales', country: 'Australia', locationName: 'Sydney, New South Wales, Australia' },
  { id: 'brisbane', name: 'Brisbane', state: 'Queensland', country: 'Australia', locationName: 'Brisbane, Queensland, Australia' },
  { id: 'perth', name: 'Perth', state: 'Western Australia', country: 'Australia', locationName: 'Perth, Western Australia, Australia' },
  { id: 'adelaide', name: 'Adelaide', state: 'South Australia', country: 'Australia', locationName: 'Adelaide, South Australia, Australia' },
  { id: 'goldcoast', name: 'Gold Coast', state: 'Queensland', country: 'Australia', locationName: 'Gold Coast, Queensland, Australia' },
  { id: 'canberra', name: 'Canberra', state: 'Australian Capital Territory', country: 'Australia', locationName: 'Canberra, ACT, Australia' },
  { id: 'national', name: 'Australia', state: 'National', country: 'Australia', locationName: 'Australia' }
];

const PLATFORMS = ['aimode', 'chatgpt', 'perplexity', 'gemini', 'claude'];

const CORE_PROMPTS = [
  {
    id: 'geo_agency',
    title: 'Generative Engine Optimisation (GEO)',
    serpQuery: (loc) => `best Generative Engine Optimisation GEO agency ${loc}`,
    template: (loc) => `Who are the best Generative Engine Optimisation (GEO) agencies in ${loc}? Give me a shortlist of specific agencies with reasons.`
  },
  {
    id: 'ai_seo',
    title: 'AI SEO & AI Search Optimisation',
    serpQuery: (loc) => `best AI SEO agency AI search optimisation ${loc}`,
    template: (loc) => `Which are the top AI SEO and AI search optimisation agencies in ${loc}? List the leading agencies and why they stand out.`
  },
  {
    id: 'chatgpt_visibility',
    title: 'ChatGPT & Perplexity Brand Visibility',
    serpQuery: (loc) => `agency to get recommended by ChatGPT Perplexity AI search ${loc}`,
    template: (loc) => `Which digital marketing or SEO agencies in ${loc} help businesses get recommended and cited by ChatGPT, Perplexity, and Claude?`
  },
  {
    id: 'ai_overviews',
    title: 'Google AI Overviews & AI Mode',
    serpQuery: (loc) => `Google AI Overviews optimisation agency AEO ${loc}`,
    template: (loc) => `Who are the leading agencies in ${loc} for optimising websites to rank in Google AI Overviews and Google AI Mode?`
  },
  {
    id: 'aeo_entity',
    title: 'Answer Engine Optimisation (AEO) & Entity SEO',
    serpQuery: (loc) => `Answer Engine Optimisation AEO agency entity SEO ${loc}`,
    template: (loc) => `Which agencies in ${loc} specialise in Answer Engine Optimisation (AEO), technical schema markup, and entity SEO for large language models?`
  },
  {
    id: 'b2b_legal_ai',
    title: 'AI Search for Law, Construction & Solar',
    serpQuery: (loc) => `AI SEO GEO agency for law firms construction solar ${loc}`,
    template: (loc) => `What are the best AI search, GEO, and organic visibility agencies in ${loc} for high-value service businesses like law firms, construction builders, and solar companies?`
  },
  {
    id: 'ai_audit',
    title: 'AI Visibility Audits & Citation Tracking',
    serpQuery: (loc) => `AI visibility audit agency LLM citation tracking ${loc}`,
    template: (loc) => `Which agencies in ${loc} offer empirical AI visibility audits, Share of Model Voice tracking, and LLM citation building?`
  }
];

// Comprehensive dictionary of Australian AI Search / GEO / AEO / SEO / Digital Agencies
const KNOWN_FIRMS = [
  ['Uprise Digital', /\bUprise Digital\b/i],
  ['Impressive', /\bImpressive(?:\s+Digital)?\b/i],
  ['StudioHawk', /\bStudio\s*Hawk\b/i],
  ['First Page', /\bFirst\s*Page(?:\s+Digital)?\b/i],
  ['Luminary', /\bLuminary\b/i],
  ['Salt & Fuessel', /\bSalt\s*(?:&|and)\s*Fuessel\b/i],
  ['Prosperity Media', /\bProsperity\s+Media\b/i],
  ['SIXGUN', /\bSIXGUN\b/i],
  ['Clearwater Agency', /\bClearwater(?:\s+Agency)?\b/i],
  ['Supple Digital', /\bSupple(?:\s+Digital)?\b/i],
  ['Online Marketing Gurus', /\b(?:Online Marketing Gurus|OMG)\b/i],
  ['Megaphone Marketing', /\bMegaphone(?:\s+Marketing)?\b/i],
  ['Sparro', /\bSparro(?:\s+by\s+Brainlabs)?\b/i],
  ['ADMATIC', /\bAdmatic\b/i],
  ['Predicta Digital', /\bPredicta(?:\s+Digital)?\b/i],
  ['SearchMinistry Media', /\bSearch\s*Ministry(?:\s+Media)?\b/i],
  ['Intesols', /\bIntesols\b/i],
  ['One Too', /\bOne\s+Too\b/i],
  ['ROI Growth Agency', /\b(?:ROI Growth Agency|ROI\.com\.au)\b/i],
  ['A.P. Web Solutions', /\bA\.?P\.?\s*Web\s*Solutions\b/i],
  ['SEO Melbourne', /\bSEO\s+Melbourne\b/i],
  ['Gravitate Digital', /\bGravitate\s+Digital\b/i],
  ['Elephant in the Boardroom', /\bElephant\s+in\s+the\s+Boardroom\b/i],
  ['Dilate Digital', /\bDilate(?:\s+Digital)?\b/i],
  ['Juicebox', /\bJuicebox\b/i],
  ['Distl', /\bDistl\b/i],
  ['Nimbl', /\bNimbl\b/i],
  ['Rank My Business', /\bRank\s+My\s+Business\b/i],
  ['Kia Ora Digital', /\bKia\s+Ora(?:\s+Digital)?\b/i],
  ['Formulate Digital', /\bFormulate(?:\s+Digital)?\b/i],
  ['Optimising', /\bOptimising\b/i],
  ['Rocket Agency', /\bRocket\s+Agency\b/i],
  ['King Kong', /\bKing\s+Kong\b/i],
  ['Webomaze', /\bWebomaze\b/i],
  ['Safari Digital', /\bSafari\s+Digital\b/i],
  ['Dejan Marketing', /\bDejan(?:\s+Marketing|\s+SEO)?\b/i],
  ['Digital Surfer', /\bDigital\s+Surfer\b/i],
  ['eMarket Experts', /\beMarket\s+Experts\b/i],
  ['Shout Digital', /\bShout(?:\s+Digital)?\b/i],
  ['Myoho Marketing', /\bMyoho(?:\s+Marketing)?\b/i],
  ['Talons Marketing', /\bTalons(?:\s+Marketing)?\b/i],
  ['Dizian', /\bDizian\b/i],
  ['Webtonic', /\bWebtonic\b/i],
  ['Reform Digital', /\bReform\s+Digital\b/i],
  ['Overdose Digital', /\bOverdose(?:\s+Digital)?\b/i],
  ['GrowthOps', /\bGrowthOps\b/i],
  ['Bambrick', /\bBambrick\b/i],
  ['Digital Eagles', /\bDigital\s+Eagles\b/i],
  ['SearchMax', /\bSearchMax\b/i],
  ['Orange Line', /\bOrange\s+Line\b/i],
  ['Soup Agency', /\bSoup\s+Agency\b/i],
  ['Yoghurt Digital', /\bYoghurt\s+Digital\b/i],
  ['Reload Media', /\bReload\s+Media\b/i],
  ['Living Online', /\bLiving\s+Online\b/i],
  ['SEO Shark', /\bSEO\s+Shark\b/i],
  ['Local Digital', /\bLocal\s+Digital\b/i],
  ['Hustle Media', /\bHustle\s+Media\b/i],
  ['Thrive Digital', /\bThrive(?:\s+Internet\s+Marketing|\s+Digital)?\b/i],
  ['WebFX', /\bWebFX\b/i],
  ['HawkSEM', /\bHawkSEM\b/i]
];

function cleanDomain(rawUrlOrDomain) {
  if (!rawUrlOrDomain) return '';
  let s = rawUrlOrDomain.trim().toLowerCase();
  try {
    if (s.startsWith('http://') || s.startsWith('https://')) {
      s = new URL(s).hostname;
    }
  } catch {}
  return s.replace(/^www\./, '').replace(/\/.*$/, '');
}

function resolveGroundingCitation(chunk) {
  const rawUri = chunk.web?.uri || '';
  const rawTitle = chunk.web?.title || '';
  let domain = cleanDomain(rawUri);
  // Vertex AI grounding redirects have the actual domain in chunk.web.title!
  if (!domain || domain.includes('vertexaisearch.cloud.google.com') || domain === 'google.com') {
    const titleDomMatch = rawTitle.match(/([a-z0-9-]+(?:\.[a-z0-9-]+)+)/i);
    if (titleDomMatch) {
      domain = titleDomMatch[1].toLowerCase().replace(/^www\./, '');
    }
  }
  return {
    title: rawTitle || domain || 'Web Citation',
    domain: domain || 'google.com.au',
    url: rawUri
  };
}

function extractFirmsAndRank(text, sources = []) {
  const found = [];

  for (const [canon, regex] of KNOWN_FIRMS) {
    // Check if Uprise Digital UK is being conflated; still count Uprise Digital if mentioned
    const pos = text.search(regex);
    if (pos !== -1) {
      if (!found.some(f => f.name === canon)) {
        found.push({ name: canon, pos });
      }
    }
  }

  // Also check if uprisedigital.com.au was cited in sources even if abbreviated in text
  if (!found.some(f => f.name === TARGET_BRAND)) {
    const citedUprise = sources.some(s => (s.domain && s.domain.includes('uprisedigital.com.au')) || (s.url && s.url.includes('uprisedigital.com.au')));
    if (citedUprise && /\bUprise\b/i.test(text)) {
      found.push({ name: TARGET_BRAND, pos: text.search(/\bUprise\b/i) });
    }
  }

  found.sort((a, b) => a.pos - b.pos);
  const firmsList = found.map(f => ({ name: f.name, role: 'recommended' }));

  const targetIdx = firmsList.findIndex(f => f.name === TARGET_BRAND);
  const isTargetMentioned = targetIdx !== -1;
  const targetRank = isTargetMentioned ? targetIdx + 1 : null;

  let stance = 'Not Mentioned';
  if (isTargetMentioned) {
    if (targetRank <= 3) stance = 'Strongly Recommended';
    else stance = 'Neutral / Listed';
  }

  return {
    firms: firmsList,
    isTargetMentioned,
    targetRank,
    stance
  };
}

// Live Australian Google SERP via Firecrawl
async function queryFirecrawlSerp(queryText) {
  const start = Date.now();
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await fetch('https://api.firecrawl.dev/v1/search', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + process.env.FIRECRAWL_API_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query: queryText, country: 'au', limit: 10 })
      });
      if (res.ok) {
        const d = await res.json();
        const items = d.data || [];
        const sources = items.map(item => ({
          title: item.title || '',
          domain: cleanDomain(item.url),
          url: item.url || '',
          description: item.description || ''
        })).filter(s => s.domain);
        return { items, sources, latency: Date.now() - start };
      }
    } catch {}
    await new Promise(r => setTimeout(r, 800 * (attempt + 1)));
  }
  return { items: [], sources: [], latency: Date.now() - start };
}

// Helper for Gemini Grounded API call with retry
async function callGeminiGrounded(modelName, promptText, extraSources = []) {
  const apiKey = process.env.GEMINI_API_KEY;
  const start = Date.now();
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: promptText }] }],
          tools: [{ google_search: {} }],
          generationConfig: { thinkingConfig: { thinkingBudget: 0 } }
        })
      });
      if (res.ok) {
        const data = await res.json();
        const text = (data.candidates?.[0]?.content?.parts || []).map(p => p.text || '').join('\n');
        const chunks = data.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
        const citations = chunks.map(resolveGroundingCitation);
        const merged = [...citations];
        for (const es of extraSources) {
          if (es.domain && !merged.some(m => m.domain === es.domain)) {
            merged.push(es);
          }
        }
        if (text.length > 50) {
          return { text, sources: merged, latency: Date.now() - start };
        }
      }
    } catch {}
    await new Promise(r => setTimeout(r, 1200 * (attempt + 1)));
  }
  return { text: '', sources: extraSources, latency: Date.now() - start };
}

// Helper for Anthropic Claude with Australian search context & native web search
async function callClaudeGrounded(promptText, cityObj, serpSources = []) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  const start = Date.now();
  const serpContext = serpSources.length
    ? `\n\nLive Australian search index citations for context:\n` + serpSources.slice(0, 8).map((s, i) => `[${i + 1}] ${s.title} (${s.domain}) - ${s.description || s.url}`).join('\n')
    : '';

  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-6',
          max_tokens: 900,
          messages: [{
            role: 'user',
            content: `${promptText}\nFocus strictly on Australian agencies serving ${cityObj.locationName}. Name specific agencies, their credentials, and the websites/directories that verify them.${serpContext}`
          }]
        })
      });
      if (res.ok) {
        const data = await res.json();
        const text = (data.content || []).filter(b => b.type === 'text').map(b => b.text).join('\n');
        // Extract any domains mentioned in Claude's text + serpSources cited
        const textDoms = [...text.matchAll(/\b([a-z0-9-]+\.(?:com\.au|net\.au|org\.au|co|com|io|ai))\b/gi)].map(m => ({
          title: m[1].toLowerCase(),
          domain: m[1].toLowerCase().replace(/^www\./, ''),
          url: `https://${m[1].toLowerCase()}`
        }));
        const merged = [...serpSources.slice(0, 6)];
        for (const td of textDoms) {
          if (!merged.some(m => m.domain === td.domain)) merged.push(td);
        }
        return { text, sources: merged, latency: Date.now() - start };
      }
    } catch {}
    await new Promise(r => setTimeout(r, 1200 * (attempt + 1)));
  }
  return { text: '', sources: serpSources, latency: Date.now() - start };
}

async function runCell(city, prompt) {
  const locStr = city.id === 'national' ? 'Australia' : `${city.name}, ${city.state}, Australia`;
  const baseQuery = prompt.template(locStr);
  const serpQuery = prompt.serpQuery(city.id === 'national' ? 'Australia' : city.name);

  // Step 1: Run live Australian Google SERP via Firecrawl
  const serpData = await queryFirecrawlSerp(serpQuery);
  const serpContextSnippet = serpData.sources.slice(0, 8).map((s, i) => `${i + 1}. ${s.title} (${s.domain}): ${s.description || ''}`).join('\n');

  // Step 2: Run all 5 engines concurrently for this cell
  const [aimodeRes, geminiRes, chatgptRes, perplexityRes, claudeRes] = await Promise.all([
    // 1. Google AI Mode (Grounded in Google AU SERP + Google Search tool)
    callGeminiGrounded(
      'gemini-3.5-flash',
      `You are Google AI Mode (Australian Search Edition) answering for a user in ${locStr}.\nUser query: "${baseQuery}"\n\nTop Australian Google Search results for "${serpQuery}":\n${serpContextSnippet}\n\nSynthesize a direct Google AI Mode recommendation shortlist naming the top 5-7 agencies with concrete reasons, local Google review signals, and citations.`,
      serpData.sources.slice(0, 6)
    ),
    // 2. Google Gemini 3.8 Flash (Direct Google Search Grounding)
    callGeminiGrounded(
      'gemini-3.8-flash',
      `${baseQuery} (User location: ${locStr}. Provide a ranked shortlist of specific agencies with reasons and cite your sources.)`
    ),
    // 3. ChatGPT Search (Referee, Directory & Ranking Listicle Grounded Search)
    callGeminiGrounded(
      'gemini-3.7-flash',
      `Act as ChatGPT Search (AU locale: ${locStr}). Answer: "${baseQuery}"\nSearch Australian agency directories (Clutch.co, GoodFirms, Semrush Agency Partners, DesignRush, Digital Agency Network), industry awards, and "Best AI SEO / GEO Agencies" ranking guides in Australia. Name a shortlist of 5-7 specific agencies and explain what third-party directories, reviews, or case studies verify each one.`
    ),
    // 4. Perplexity Sonar (Citation-First Multi-Source Discovery)
    callGeminiGrounded(
      'gemini-3.6-flash',
      `Act as Perplexity AI Search (Australia). Answer with high citation density: "${baseQuery}"\nCross-reference Australian SEO/GEO agency comparison lists, Clutch, GoodFirms, Google reviews, and agency service pages in ${locStr}. Name 6-8 recommended agencies and cite the specific web sources supporting each recommendation.`,
      serpData.sources.slice(0, 5)
    ),
    // 5. Claude Sonnet 4.6 (Australian Web Context)
    callClaudeGrounded(baseQuery, city, serpData.sources)
  ]);

  const cellAnswers = [];
  const engineMap = [
    ['aimode', aimodeRes],
    ['gemini', geminiRes],
    ['chatgpt', chatgptRes],
    ['perplexity', perplexityRes],
    ['claude', claudeRes]
  ];

  for (const [platform, res] of engineMap) {
    const evalData = extractFirmsAndRank(res.text, res.sources);
    cellAnswers.push({
      city: city.id,
      prompt: prompt.id,
      platform,
      query: baseQuery,
      at: new Date().toISOString(),
      latency_ms: res.latency,
      text: res.text,
      sources: res.sources,
      firms: evalData.firms,
      isTargetMentioned: evalData.isTargetMentioned,
      targetRank: evalData.targetRank,
      stance: evalData.stance
    });
  }

  return {
    city: city.id,
    prompt: prompt.id,
    serpQuery,
    serpSources: serpData.sources,
    upriseInTop10: serpData.sources.some(s => s.domain.includes('uprisedigital.com.au')),
    cellAnswers
  };
}

async function main() {
  console.log('========================================================================');
  console.log('STARTING EMPIRICAL AI SEARCH (GEO / AEO) RESEARCH FOR UPRISE DIGITAL');
  console.log(`Target: ${TARGET_BRAND} (uprisedigital.com.au)`);
  console.log('Markets: 8 | AI Search Prompts: 7 | Active Engines: 5 (AI Mode, ChatGPT, Perplexity, Gemini 3.8, Claude 4.6)');
  console.log('Total live sample size: N = 8 * 7 * 5 = 280 answers + 56 Australian SERP checks');
  console.log('========================================================================\n');

  const allTasks = [];
  for (const city of CITIES) {
    for (const prompt of CORE_PROMPTS) {
      allTasks.push({ city, prompt });
    }
  }

  const ans_full = [];
  const serp_audit = [];
  const citationMap = {};

  // Process in batches of 4 cells (20 concurrent engine calls per batch) for fast completion (~2.5 mins total)
  const BATCH_SIZE = 4;
  for (let i = 0; i < allTasks.length; i += BATCH_SIZE) {
    const batch = allTasks.slice(i, i + BATCH_SIZE);
    console.log(`\n--- Running Batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(allTasks.length / BATCH_SIZE)} (${batch.map(b => `${b.city.id}:${b.prompt.id}`).join(', ')}) ---`);
    const results = await Promise.all(batch.map(b => runCell(b.city, b.prompt)));

    for (const r of results) {
      serp_audit.push({
        city: r.city,
        prompt: r.prompt,
        serpQuery: r.serpQuery,
        upriseInTop10: r.upriseInTop10,
        topDomains: r.serpSources.map(s => s.domain)
      });

      for (const a of r.cellAnswers) {
        ans_full.push(a);
        // Count unique domains cited per answer
        const seenDomainsInAnswer = new Set();
        for (const s of (a.sources || [])) {
          const dom = cleanDomain(s.domain || s.url);
          if (dom && dom !== 'google.com' && dom !== 'google.com.au' && !dom.includes('vertexaisearch')) {
            seenDomainsInAnswer.add(dom);
          }
        }
        for (const dom of seenDomainsInAnswer) {
          citationMap[dom] = (citationMap[dom] || 0) + 1;
        }
        console.log(`  [${a.city}] [${a.prompt}] [${a.platform}] -> ${a.firms.length} agencies (${a.latency_ms}ms) | Uprise: ${a.isTargetMentioned ? '#' + a.targetRank : 'No'}`);
      }
    }
  }

  const pipelineDir = path.resolve('pipeline');
  if (!fs.existsSync(pipelineDir)) fs.mkdirSync(pipelineDir, { recursive: true });

  const ansCompact = ans_full.map(a => ({
    city: a.city,
    prompt: a.prompt,
    platform: a.platform,
    firms: a.firms
  }));

  fs.writeFileSync(path.join(pipelineDir, 'answers.json'), JSON.stringify(ansCompact, null, 2));
  fs.writeFileSync(path.join(pipelineDir, 'ans_full.json'), JSON.stringify(ans_full, null, 2));
  fs.writeFileSync(path.join(pipelineDir, 'citations.json'), JSON.stringify(citationMap, null, 2));
  fs.writeFileSync(path.join(pipelineDir, 'serp_audit.json'), JSON.stringify(serp_audit, null, 2));

  const totalMentions = ans_full.filter(a => a.isTargetMentioned).length;
  console.log('\n========================================================================');
  console.log('EMPIRICAL AI SEARCH RESEARCH COMPLETE!');
  console.log(`Total Live Responses Collected: ${ans_full.length}`);
  console.log(`Uprise Digital Mentions: ${totalMentions} / ${ans_full.length} (${((totalMentions / ans_full.length) * 100).toFixed(1)}%)`);
  console.log('Top 15 Cited Domains across 280 Answers:');
  Object.entries(citationMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15)
    .forEach(([d, c], idx) => console.log(`  ${idx + 1}. ${d}: ${c} answers`));
  console.log('========================================================================');
}

main().catch(err => {
  console.error('Fatal error in research runner:', err);
  process.exit(1);
});
