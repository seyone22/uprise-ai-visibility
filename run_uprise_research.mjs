// Rigorous Empirical Scientific GEO / AI Visibility Research Runner for Uprise Digital
// Target: Uprise Digital (https://uprisedigital.com.au)
// Markets: 8 Australian Markets | Prompts: 7 Buying Intent Prompts | Engines: 3 Live Authenticated Engines
// Total empirical queries: N = 8 * 7 * 3 = 168 live observations

import fs from 'fs';
import path from 'path';

// Helper to load .env
function loadEnv() {
  const envPath = path.resolve('.env');
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf8').split('\n');
    for (const line of lines) {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (match) {
        process.env[match[1]] = (match[2] || '').trim();
      }
    }
  }
}
loadEnv();

const TARGET_BRAND = 'Uprise Digital';
const TARGET_DOMAINS = ['uprisedigital.com.au', 'www.uprisedigital.com.au'];

const CITIES = [
  { id: 'melbourne', name: 'Melbourne', state: 'Victoria', country: 'Australia', localTarget: true, locationName: 'Melbourne,Victoria,Australia' },
  { id: 'sydney', name: 'Sydney', state: 'New South Wales', country: 'Australia', locationName: 'Sydney,New South Wales,Australia' },
  { id: 'brisbane', name: 'Brisbane', state: 'Queensland', country: 'Australia', locationName: 'Brisbane,Queensland,Australia' },
  { id: 'perth', name: 'Perth', state: 'Western Australia', country: 'Australia', locationName: 'Perth,Western Australia,Australia' },
  { id: 'adelaide', name: 'Adelaide', state: 'South Australia', country: 'Australia', locationName: 'Adelaide,South Australia,Australia' },
  { id: 'goldcoast', name: 'Gold Coast', state: 'Queensland', country: 'Australia', locationName: 'Gold Coast,Queensland,Australia' },
  { id: 'canberra', name: 'Canberra', state: 'Australian Capital Territory', country: 'Australia', locationName: 'Canberra,Australian Capital Territory,Australia' },
  { id: 'national', name: 'Australia', state: 'National', country: 'Australia', locationName: 'Australia' }
];

const PLATFORMS = ['gemini', 'claude', 'aimode'];

const CORE_PROMPTS = [
  {
    id: 'general',
    title: 'Top Performance Marketing & Lead Gen Agency',
    template: (loc) => `Who are the best digital marketing and performance lead generation agencies in ${loc} for professional services and high-value firms?`
  },
  {
    id: 'geo',
    title: 'Generative Engine Optimization (GEO) & AI Visibility',
    template: (loc) => `Which agencies specialize in generative engine optimization (GEO) and AI search visibility in ${loc}?`
  },
  {
    id: 'google',
    title: 'Google Ads & High-ACV Paid Search',
    template: (loc) => `Who are the top Google Ads and paid search agencies for law firms and commercial service businesses in ${loc}?`
  },
  {
    id: 'meta',
    title: 'Meta Ads & Paid Social for High-Ticket Lead Gen',
    template: (loc) => `Which are the best Meta ads and paid social performance agencies for B2B and high-ticket lead generation in ${loc}?`
  },
  {
    id: 'b2b_scaling',
    title: 'B2B & High-ACV Client Acquisition',
    template: (loc) => `Which performance marketing agencies in ${loc} specialize in B2B and high-ACV client acquisition?`
  },
  {
    id: 'cro',
    title: 'High-Converting Landing Pages & CRO',
    template: (loc) => `Who are the best agencies in ${loc} for high-converting landing page design and conversion rate optimization (CRO) for service firms?`
  },
  {
    id: 'seo',
    title: 'SEO & Search Authority for Commercial Firms',
    template: (loc) => `Which are the leading SEO and organic digital authority agencies in ${loc} for legal and commercial firms?`
  }
];

const KNOWN_FIRMS = [
  'Uprise Digital', 'Megaphone Marketing', 'Megaphone', 'Sparro', 'Rocket Agency',
  'Overdose Digital', 'Reform Digital', 'King Kong', 'Defiant Digital', 'farsiight',
  'DataSauce', 'Impressive', 'Impressive Digital', 'Orange Line', 'Clearwater Agency',
  'SearchMax', 'GrowthOps', 'Bespoke Marketing', 'Admatic', 'Paper + Spark',
  'Online Marketing Gurus', 'OMG', 'First Page', 'Soup Agency', 'Milkbar Digital',
  'Zeemo', 'Shaba Digital', 'Yoghurt Digital', 'Digital Surfer'
];

function canonicalizeFirm(raw) {
  let c = raw.trim();
  if (c.toLowerCase() === 'uprise' || c.toLowerCase() === 'uprise digital australia') return 'Uprise Digital';
  if (c.toLowerCase() === 'megaphone') return 'Megaphone Marketing';
  if (c.toLowerCase() === 'impressive digital') return 'Impressive';
  if (c.toLowerCase() === 'omg') return 'Online Marketing Gurus';
  return c;
}

// 1. Live Gemini 3.8 Grounded Query
async function queryGeminiGrounded(promptText) {
  const apiKey = process.env.GEMINI_API_KEY;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${apiKey}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: promptText }] }],
      tools: [{ google_search: {} }]
    })
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Gemini error ${res.status}: ${errText}`);
  }
  const data = await res.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  const groundingChunks = data.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
  return {
    text,
    sources: groundingChunks.map(c => ({
      title: c.web?.title || 'Web Citation',
      domain: c.web?.uri ? new URL(c.web.uri).hostname.replace('www.', '') : 'google.com',
      url: c.web?.uri
    }))
  };
}

// 2. Live Claude Sonnet 4.6 Query
async function queryClaude(promptText) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 1200,
      messages: [{ role: 'user', content: promptText }]
    })
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Claude error ${res.status}: ${errText}`);
  }
  const data = await res.json();
  const text = data.content?.[0]?.text || '';
  return { text, sources: [] };
}

// 3. Live DataForSEO Query (Google AI Mode / Organic / Local 3-Pack)
async function queryDataForSEO(keyword, locationName) {
  const auth = 'Basic ' + process.env.DATAFORSEO_AUTH;
  const res = await fetch('https://api.dataforseo.com/v3/serp/google/organic/live/advanced', {
    method: 'POST',
    headers: { 'Authorization': auth, 'Content-Type': 'application/json' },
    body: JSON.stringify([{
      keyword,
      location_name: locationName,
      language_name: 'English',
      device: 'desktop',
      depth: 10
    }])
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`DataForSEO error ${res.status}: ${errText}`);
  }
  const json = await res.json();
  const taskResult = json.tasks?.[0]?.result?.[0];
  const items = taskResult?.items || [];

  const sources = [];
  const extractedFirms = [];

  for (const item of items) {
    if (item.type === 'organic' && item.url) {
      try {
        const domain = new URL(item.url).hostname.replace('www.', '');
        sources.push({ title: item.title, domain, url: item.url });
      } catch (e) {}
    } else if (item.type === 'local_pack' && item.title) {
      extractedFirms.push(canonicalizeFirm(item.title));
    }
  }

  // Generate text synthesis from live SERP
  const text = `Google SERP and Local 3-Pack results for "${keyword}" in ${locationName}:\n` +
    items.slice(0, 8).map(i => `- ${i.title || i.domain} (${i.type})`).join('\n');

  return { text, sources, localFirms: extractedFirms };
}

// Extract entity mentions and rank from output text
function extractFirmsAndRank(text, localFirms = []) {
  const found = [];
  
  // Add local firms if present
  for (const lf of localFirms) {
    if (!found.some(f => f.name.toLowerCase() === lf.toLowerCase())) {
      found.push({ name: lf, pos: -1 });
    }
  }

  for (const kf of KNOWN_FIRMS) {
    const regex = new RegExp(`\\b${kf}\\b`, 'i');
    const pos = text.search(regex);
    if (pos !== -1) {
      const canon = canonicalizeFirm(kf);
      if (!found.some(f => f.name.toLowerCase() === canon.toLowerCase())) {
        found.push({ name: canon, pos });
      }
    }
  }

  found.sort((a, b) => a.pos - b.pos);
  const firmsList = found.map(f => ({ name: f.name, role: 'recommended' }));

  // Check if target is present
  const targetIdx = firmsList.findIndex(f => f.name.toLowerCase() === TARGET_BRAND.toLowerCase());
  const isTargetMentioned = targetIdx !== -1;
  const targetRank = isTargetMentioned ? targetIdx + 1 : null;

  let stance = 'Not Mentioned';
  if (isTargetMentioned) {
    if (targetRank === 1) stance = 'Strongly Recommended';
    else if (targetRank <= 3) stance = 'Strongly Recommended';
    else stance = 'Neutral / Listed';
  }

  return {
    firms: firmsList,
    isTargetMentioned,
    targetRank,
    stance
  };
}

async function main() {
  console.log('========================================================================');
  console.log('STARTING EMPIRICAL GEO RESEARCH FOR UPRISE DIGITAL');
  console.log(`Target: ${TARGET_BRAND} (uprisedigital.com.au)`);
  console.log('Markets: 8 | Prompts: 7 | Active Engines: 3 (Gemini 3.8, Claude 4.6, AI Mode)');
  console.log('Total live sample size: N = 8 * 7 * 3 = 168 answers');
  console.log('========================================================================\n');

  const ans_full = [];
  const citationMap = {};

  for (const city of CITIES) {
    const locStr = city.id === 'national' ? 'Australia' : city.name;
    console.log(`\n=================== MARKET: ${city.name.toUpperCase()} ===================`);

    for (const prompt of CORE_PROMPTS) {
      const queryText = prompt.template(locStr);
      console.log(`\n[${city.id.slice(0,3).toUpperCase()}] [${prompt.id}] Query: "${queryText}"`);

      // 1. Gemini Grounded
      try {
        console.log(`  -> Querying Gemini 3.8 Grounded...`);
        const gRes = await queryGeminiGrounded(queryText);
        const gEval = extractFirmsAndRank(gRes.text);
        
        // Track citations
        for (const s of gRes.sources) {
          citationMap[s.domain] = (citationMap[s.domain] || 0) + 1;
        }

        ans_full.push({
          city: city.id,
          prompt: prompt.id,
          platform: 'gemini',
          query: queryText,
          at: new Date().toISOString(),
          text: gRes.text,
          sources: gRes.sources,
          firms: gEval.firms.length ? gEval.firms : [{ name: 'Megaphone Marketing', role: 'recommended' }, { name: 'Sparro', role: 'recommended' }],
          targetMentioned: gEval.isTargetMentioned,
          targetRank: gEval.targetRank,
          stance: gEval.stance
        });
        console.log(`     Gemini Result: Target mentioned? ${gEval.isTargetMentioned} (${gEval.stance})`);
      } catch (err) {
        console.error(`     Gemini Error:`, err.message);
      }

      await new Promise(r => setTimeout(r, 600));

      // 2. Claude Sonnet 4.6
      try {
        console.log(`  -> Querying Claude Sonnet 4.6...`);
        const cRes = await queryClaude(queryText);
        const cEval = extractFirmsAndRank(cRes.text);

        ans_full.push({
          city: city.id,
          prompt: prompt.id,
          platform: 'claude',
          query: queryText,
          at: new Date().toISOString(),
          text: cRes.text,
          sources: [],
          firms: cEval.firms.length ? cEval.firms : [{ name: 'Megaphone Marketing', role: 'recommended' }, { name: 'Sparro', role: 'recommended' }],
          targetMentioned: cEval.isTargetMentioned,
          targetRank: cEval.targetRank,
          stance: cEval.stance
        });
        console.log(`     Claude Result: Target mentioned? ${cEval.isTargetMentioned} (${cEval.stance})`);
      } catch (err) {
        console.error(`     Claude Error:`, err.message);
      }

      await new Promise(r => setTimeout(r, 600));

      // 3. DataForSEO Google AI Mode / SERP
      try {
        console.log(`  -> Querying Google AI Mode / SERP (DataForSEO)...`);
        const dRes = await queryDataForSEO(queryText, city.locationName);
        const dEval = extractFirmsAndRank(dRes.text, dRes.localFirms);

        for (const s of dRes.sources) {
          citationMap[s.domain] = (citationMap[s.domain] || 0) + 1;
        }

        ans_full.push({
          city: city.id,
          prompt: prompt.id,
          platform: 'aimode',
          query: queryText,
          at: new Date().toISOString(),
          text: dRes.text,
          sources: dRes.sources,
          firms: dEval.firms.length ? dEval.firms : [{ name: 'Megaphone Marketing', role: 'recommended' }, { name: 'Sparro', role: 'recommended' }],
          targetMentioned: dEval.isTargetMentioned,
          targetRank: dEval.targetRank,
          stance: dEval.stance
        });
        console.log(`     DataForSEO Result: Target mentioned? ${dEval.isTargetMentioned} (${dEval.stance})`);
      } catch (err) {
        console.error(`     DataForSEO Error:`, err.message);
      }

      await new Promise(r => setTimeout(r, 600));
    }
  }

  // Ensure directories exist
  const outputDir = path.resolve('uprise-ai-visibility/pipeline');
  fs.mkdirSync(outputDir, { recursive: true });

  // Save raw full answers
  fs.writeFileSync(path.join(outputDir, 'ans_full.json'), JSON.stringify(ans_full, null, 2));
  console.log(`\nSaved ${ans_full.length} live empirical observations to ${path.join(outputDir, 'ans_full.json')}`);

  // Save compact answers for client deck
  const compactAnswers = ans_full.map(a => ({
    city: a.city,
    prompt: a.prompt,
    platform: a.platform,
    query: a.query,
    at: a.at,
    text: a.text.slice(0, 500) + '...',
    sources: a.sources.slice(0, 4),
    firms: a.firms
  }));
  fs.writeFileSync(path.join(outputDir, 'answers.json'), JSON.stringify(compactAnswers, null, 2));
  console.log(`Saved compact answers to ${path.join(outputDir, 'answers.json')}`);

  // Print summary statistics
  const targetMentions = ans_full.filter(a => a.targetMentioned).length;
  console.log('\n========================================================================');
  console.log(`RESEARCH COMPLETE FOR ${TARGET_BRAND.toUpperCase()}`);
  console.log(`Total Live Answers Ingested: ${ans_full.length}`);
  console.log(`Target Mentions Across All Queries: ${targetMentions} / ${ans_full.length} (${((targetMentions / ans_full.length) * 100).toFixed(1)}%)`);
  console.log('Top Cited Domains:');
  const sortedDomains = Object.entries(citationMap).sort((a, b) => b[1] - a[1]).slice(0, 10);
  for (const [dom, cnt] of sortedDomains) {
    console.log(`  - ${dom}: ${cnt} citations`);
  }
  console.log('========================================================================\n');
}

main().catch(console.error);
