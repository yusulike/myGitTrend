import * as cheerio from 'cheerio';
import * as fs from 'fs';
import * as path from 'path';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { TrendItem, TrendSnapshot, Period } from '../src/types/trend';
import { generateMockSnapshot } from './mockData';

// Auto-load .env if present in root
const envPath = path.resolve(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach((line) => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      const key = match[1];
      let value = (match[2] || '').trim().replace(/^['"](.*)['"]$/, '$1');
      if (!process.env[key]) {
        process.env[key] = value;
      }
    }
  });
}

export interface RawRepoItem {
  owner: string;
  repo: string;
  url: string;
  description: string;
  language: string;
  stars: number;
  forks: number;
  starsPeriod: number;
  since: Period;
}

export function parseTrendingHtml(html: string, since: Period): RawRepoItem[] {
  const $ = cheerio.load(html);
  const items: RawRepoItem[] = [];

  $('article.Box-row').each((_, element) => {
    const $el = $(element);
    const titleLink = $el.find('h2 a');
    const href = titleLink.attr('href') || '';
    const cleanPath = href.replace(/^\//, '').trim();
    const parts = cleanPath.split('/');
    if (parts.length < 2) return;

    const owner = parts[0];
    const repo = parts[1];
    const url = `https://github.com/${owner}/${repo}`;
    const description = $el.find('p').text().trim() || 'No description provided.';
    const language = $el.find('[itemprop="programmingLanguage"]').text().trim() || 'Markdown / Other';

    // Parse stars and forks
    const links = $el.find('div.f6 a');
    let stars = 0;
    let forks = 0;

    links.each((_, link) => {
      const $link = $(link);
      const text = $link.text().replace(/,/g, '').trim();
      const num = parseInt(text, 10);
      if (!isNaN(num)) {
        if ($link.attr('href')?.includes('/stargazers')) {
          stars = num;
        } else if ($link.attr('href')?.includes('/forks')) {
          forks = num;
        }
      }
    });

    // Parse stars in period (e.g. "234 stars today" or "1,200 stars this week")
    const periodText = $el.find('span.float-sm-right, span.d-inline-block.float-sm-right').text().trim();
    const match = periodText.replace(/,/g, '').match(/(\d+)\s+stars/);
    const starsPeriod = match ? parseInt(match[1], 10) : 0;

    items.push({
      owner,
      repo,
      url,
      description,
      language,
      stars,
      forks,
      starsPeriod,
      since,
    });
  });

  return items;
}

export function generateFallbackSummary(raw: RawRepoItem): {
  summaryKo: string;
  keyFeaturesKo: string[];
  tags: string[];
} {
  const desc = raw.description;
  const lang = raw.language;

  // Heuristic tag generation
  const tags: string[] = [lang];
  if (/ai|llm|gpt|claude|model|agent/i.test(desc) || /ai|llm/i.test(raw.repo)) tags.push('AI');
  if (/web|react|vue|frontend|css|ui|component/i.test(desc)) tags.push('Frontend');
  if (/backend|server|api|database|sql/i.test(desc)) tags.push('Backend');
  if (/tool|cli|devops|build|package|compiler/i.test(desc)) tags.push('DevTools');

  // Intelligent Korean summary fallback
  let summaryKo = `${raw.repo}는 ${lang} 기반의 오픈소스 프로젝트입니다.`;
  if (desc && desc !== 'No description provided.') {
    summaryKo = `${raw.owner}/${raw.repo} - ${desc}`;
  }

  const keyFeaturesKo = [
    `주 프로그래밍 언어: ${lang}`,
    `깃허브 스타: ${raw.stars.toLocaleString()}개 획득`,
    `최근 증가 추이: +${raw.starsPeriod.toLocaleString()} stars (${raw.since})`,
  ];

  return {
    summaryKo,
    keyFeaturesKo,
    tags: Array.from(new Set(tags)),
  };
}

export async function summarizeWithGemini(
  raw: RawRepoItem,
  apiKey: string,
): Promise<{ summaryKo: string; keyFeaturesKo: string[]; tags: string[] }> {
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const modelName = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
    const model = genAI.getGenerativeModel({ model: modelName });

    const prompt = `
당신은 깃허브 인기 오픈소스 프로젝트를 개발자에게 소개하는 기술 큐레이터입니다.
다음 프로젝트 정보를 바탕으로 한국어 요약을 작성해주세요.

- 프로젝트명: ${raw.owner}/${raw.repo}
- 주 언어: ${raw.language}
- 원문 설명: ${raw.description}

반드시 아래 JSON 형식으로만 응답해주세요 (마크다운 백틱 없이 순수 JSON만 출력):
{
  "summaryKo": "개발자가 핵심 가치를 바로 이해할 수 있는 명확한 한국어 1~2문장 요약",
  "keyFeaturesKo": ["핵심 특징 1", "핵심 특징 2", "핵심 특징 3"],
  "tags": ["태그1", "태그2", "태그3"]
}
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();
    const cleanJson = text.replace(/^```json/, '').replace(/^```/, '').replace(/```$/, '').trim();
    const parsed = JSON.parse(cleanJson);

    return {
      summaryKo: parsed.summaryKo || generateFallbackSummary(raw).summaryKo,
      keyFeaturesKo: Array.isArray(parsed.keyFeaturesKo) ? parsed.keyFeaturesKo : generateFallbackSummary(raw).keyFeaturesKo,
      tags: Array.isArray(parsed.tags) ? parsed.tags : generateFallbackSummary(raw).tags,
    };
  } catch (error) {
    console.warn(`[Gemini API] Failed to summarize ${raw.owner}/${raw.repo}, using fallback:`, error);
    return generateFallbackSummary(raw);
  }
}

export async function fetchTrendingForPeriod(since: Period): Promise<RawRepoItem[]> {
  const url = since === 'daily'
    ? 'https://github.com/trending'
    : `https://github.com/trending?since=${since}`;

  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    });
    if (!res.ok) {
      console.warn(`Failed to fetch ${url}: HTTP ${res.status}`);
      return [];
    }
    const html = await res.text();
    return parseTrendingHtml(html, since);
  } catch (err) {
    console.warn(`Error fetching ${url}:`, err);
    return [];
  }
}

export async function runCollection(): Promise<TrendSnapshot> {
  const dateStr = new Date().toISOString().split('T')[0];
  const apiKey = process.env.GEMINI_API_KEY;

  console.log(`[mgt Collector] Starting trend collection for ${dateStr}...`);
  if (!apiKey) {
    console.log('[mgt Collector] No GEMINI_API_KEY provided; will use heuristic summarizer.');
  }

  let rawDaily = await fetchTrendingForPeriod('daily');
  let rawWeekly = await fetchTrendingForPeriod('weekly');
  let rawMonthly = await fetchTrendingForPeriod('monthly');

  // Fallback to rich mock data if network or scraping yielded nothing
  if (rawDaily.length === 0 && rawWeekly.length === 0 && rawMonthly.length === 0) {
    console.log('[mgt Collector] No items retrieved from GitHub (offline/blocked), using fallback mock snapshot.');
    const mock = generateMockSnapshot(dateStr);
    saveDataFiles(mock);
    return mock;
  }

  const allRaw = [...rawDaily, ...rawWeekly, ...rawMonthly];
  const processedItems: TrendItem[] = [];

  for (const raw of allRaw) {
    const aiData = apiKey
      ? await summarizeWithGemini(raw, apiKey)
      : generateFallbackSummary(raw);

    processedItems.push({
      id: `${raw.owner}/${raw.repo}`,
      ...raw,
      ...aiData,
    });
  }

  const languages = Array.from(new Set(processedItems.map((item) => item.language).filter(Boolean))).sort();
  const snapshot: TrendSnapshot = {
    date: dateStr,
    collectedAt: new Date().toISOString(),
    languages: ['All', ...languages],
    items: processedItems,
  };

  saveDataFiles(snapshot);
  return snapshot;
}

function saveDataFiles(snapshot: TrendSnapshot) {
  const dataDir = path.resolve(process.cwd(), 'public/data');
  const archivesDir = path.join(dataDir, 'archives');

  fs.mkdirSync(archivesDir, { recursive: true });

  // 1. Write archive for today
  const archivePath = path.join(archivesDir, `${snapshot.date}.json`);
  fs.writeFileSync(archivePath, JSON.stringify(snapshot, null, 2), 'utf-8');

  // 2. Write latest.json
  const latestPath = path.join(dataDir, 'latest.json');
  fs.writeFileSync(latestPath, JSON.stringify(snapshot, null, 2), 'utf-8');

  // 3. Update archive-index.json
  const indexPath = path.join(dataDir, 'archive-index.json');
  let dateList: string[] = [];
  if (fs.existsSync(indexPath)) {
    try {
      dateList = JSON.parse(fs.readFileSync(indexPath, 'utf-8'));
    } catch {
      dateList = [];
    }
  }
  if (!dateList.includes(snapshot.date)) {
    dateList.unshift(snapshot.date);
  }
  fs.writeFileSync(indexPath, JSON.stringify(dateList, null, 2), 'utf-8');

  console.log(`[mgt Collector] Saved data to ${latestPath} and ${archivePath}`);
}

// Self-executing if run directly via CLI (tsx scripts/collector.ts)
if (process.argv[1]?.endsWith('collector.ts')) {
  runCollection()
    .then(() => {
      console.log('[mgt Collector] Successfully completed.');
      process.exit(0);
    })
    .catch((err) => {
      console.error('[mgt Collector] Unhandled error:', err);
      process.exit(1);
    });
}
