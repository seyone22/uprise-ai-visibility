import fs from 'fs';
import path from 'path';

const pipelineDir = path.resolve('uprise-ai-visibility/pipeline');
const ans = JSON.parse(fs.readFileSync(path.join(pipelineDir, 'ans_full.json'), 'utf8'));
const A = JSON.parse(fs.readFileSync(path.join(pipelineDir, 'answers.json'), 'utf8'));

const CITIES = ['melbourne', 'sydney', 'brisbane', 'perth', 'adelaide', 'goldcoast', 'canberra', 'national'];
const PLAT = [...new Set(ans.map(a => a.platform))];
const PROMPTS = [...new Set(ans.map(a => a.prompt))];
const TARGET = 'Uprise Digital';

const out = {
  cities: {},
  national: {},
  platforms: PLAT,
  prompts: PROMPTS,
  totalSample: ans.length
};

const tally = list => {
  const t = {};
  for (const a of list) {
    a.firms.forEach((f, i) => {
      t[f.name] ??= { n: 0, pos: [], rec: 0 };
      t[f.name].n++;
      t[f.name].pos.push(i + 1);
      if (f.role === 'recommended') t[f.name].rec++;
    });
  }
  return t;
};

const rank = t => Object.entries(t).map(([name, v]) => ({
  name,
  n: v.n,
  rec: v.rec,
  avgPos: +(v.pos.reduce((a, b) => a + b, 0) / v.pos.length).toFixed(1)
})).sort((a, b) => b.n - a.n || a.avgPos - b.avgPos);

// Calculate Wilson confidence interval
function wilsonInterval(p, n, z = 1.96) {
  if (n === 0) return { lower: 0, upper: 0 };
  const denom = 1 + (z * z) / n;
  const center = (p + (z * z) / (2 * n)) / denom;
  const se = Math.sqrt((p * (1 - p) + (z * z) / (4 * n)) / n) / denom;
  return {
    lower: Math.max(0, +(center - z * se).toFixed(4)),
    upper: Math.min(1, +(center + z * se).toFixed(4))
  };
}

// Calculate WVI
function computeWVI(targetRank, stance) {
  if (!targetRank || stance === 'Not Mentioned') return 0;
  const stanceFactor = stance === 'Strongly Recommended' ? 1.0 : (stance === 'Neutral / Listed' ? 0.5 : -0.5);
  return +(stanceFactor / Math.log2(targetRank + 1)).toFixed(3);
}

for (const c of CITIES) {
  const cs = ans.filter(a => a.city === c);
  const r = rank(tally(cs));
  const totalMentions = r.reduce((s, x) => s + x.n, 0);
  const targetIdx = r.findIndex(x => x.name.toLowerCase() === TARGET.toLowerCase());
  
  const byPlat = Object.fromEntries(PLAT.map(p => {
    const ps = cs.filter(a => a.platform === p);
    const rr = rank(tally(ps));
    return [p, {
      lhd: ps.filter(a => a.firms.some(f => f.name.toLowerCase() === TARGET.toLowerCase())).length,
      n: ps.length,
      leader: rr[0]?.name || 'Megaphone Marketing',
      leaderN: rr[0]?.n || 0
    }];
  }));

  const byPrompt = Object.fromEntries(PROMPTS.map(p => {
    const ps = cs.filter(a => a.prompt === p);
    const rr = rank(tally(ps));
    return [p, {
      lhd: ps.filter(a => a.firms.some(f => f.name.toLowerCase() === TARGET.toLowerCase())).length,
      n: ps.length,
      leader: rr[0]?.name || 'Megaphone Marketing',
      leaderN: rr[0]?.n || 0
    }];
  }));

  const top = r.slice(0, 6).map(x => x.name);
  if (!top.some(t => t.toLowerCase() === TARGET.toLowerCase())) top.push(TARGET);

  const matrix = Object.fromEntries(top.map(f => [
    f,
    Object.fromEntries(PLAT.map(p => [p, cs.filter(a => a.platform === p && a.firms.some(x => x.name.toLowerCase() === f.toLowerCase())).length]))
  ]));

  const cited = cs.filter(a => a.sources.some(s => /uprisedigital\.com\.au/.test(s.domain || s.url || ''))).length;
  const srcCount = {};
  for (const a of cs) {
    for (const d of new Set(a.sources.map(s => s.domain).filter(Boolean))) {
      srcCount[d] = (srcCount[d] || 0) + 1;
    }
  }

  const targetObservations = cs.filter(a => a.targetMentioned);
  const avgWVI = targetObservations.length > 0 
    ? +(targetObservations.reduce((acc, o) => acc + computeWVI(o.targetRank, o.stance), 0) / cs.length).toFixed(4)
    : 0;

  const pVal = cs.length > 0 ? targetObservations.length / cs.length : 0;
  const ci = wilsonInterval(pVal, cs.length);

  out.cities[c] = {
    answers: cs.length,
    lhdMentions: targetObservations.length,
    somv: +(pVal * 100).toFixed(1),
    ci95: [+(ci.lower * 100).toFixed(1), +(ci.upper * 100).toFixed(1)],
    wvi: avgWVI,
    lhdRank: targetIdx >= 0 ? targetIdx + 1 : r.length + 1,
    firmsNamed: r.length,
    totalMentions,
    top: r.slice(0, 12),
    lhd: targetIdx >= 0 ? r[targetIdx] : { name: TARGET, n: 0, rec: 0, avgPos: 0 },
    byPlat,
    byPrompt,
    matrix,
    cited,
    topSources: Object.entries(srcCount).sort((a, b) => b[1] - a[1]).slice(0, 12)
  };
}

const rn = rank(tally(ans));
const totalTargetMentions = ans.filter(a => a.targetMentioned).length;
const nationalP = ans.length > 0 ? totalTargetMentions / ans.length : 0;
const nationalCI = wilsonInterval(nationalP, ans.length);
const nationalWVI = +(ans.reduce((acc, a) => acc + (a.targetMentioned ? computeWVI(a.targetRank, a.stance) : 0), 0) / ans.length).toFixed(4);

out.national = {
  answers: ans.length,
  top: rn.slice(0, 15),
  lhdMentions: totalTargetMentions,
  somv: +(nationalP * 100).toFixed(1),
  ci95: [+(nationalCI.lower * 100).toFixed(1), +(nationalCI.upper * 100).toFixed(1)],
  wvi: nationalWVI,
  cited: ans.filter(a => a.sources.some(s => /uprisedigital\.com\.au/.test(s.domain || s.url || ''))).length,
  byPlat: Object.fromEntries(PLAT.map(p => {
    const ps = ans.filter(a => a.platform === p);
    const rr = rank(tally(ps));
    const targetInPlat = ps.filter(a => a.firms.some(f => f.name.toLowerCase() === TARGET.toLowerCase())).length;
    return [p, {
      lhd: targetInPlat,
      n: ps.length,
      somv: +((targetInPlat / ps.length) * 100).toFixed(1),
      top: rr.slice(0, 5)
    }];
  })),
  byPrompt: Object.fromEntries(PROMPTS.map(p => {
    const ps = ans.filter(a => a.prompt === p);
    const rr = rank(tally(ps));
    const targetInPrompt = ps.filter(a => a.firms.some(f => f.name.toLowerCase() === TARGET.toLowerCase())).length;
    return [p, {
      lhd: targetInPrompt,
      n: ps.length,
      somv: +((targetInPrompt / ps.length) * 100).toFixed(1),
      top: rr.slice(0, 5)
    }];
  }))
};

fs.writeFileSync(path.join(pipelineDir, 'metrics.json'), JSON.stringify(out, null, 2));
console.log('Successfully written metrics.json for Uprise Digital');
console.log(`Active Platforms (${PLAT.length}):`, PLAT.join(', '));
console.log(`Total live answers: ${out.national.answers}`);
console.log(`National SoMV: ${out.national.somv}% [95% CI: ${out.national.ci95[0]}% - ${out.national.ci95[1]}%]`);
console.log(`National WVI: ${out.national.wvi}`);
console.log('Top national firms:', out.national.top.slice(0, 6).map(x => `${x.name}: ${x.n}`).join(', '));
