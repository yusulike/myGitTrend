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

let activeWorkingModel = process.env.GEMINI_MODEL || 'gemini-flash-lite-latest';

export async function summarizeBatchWithGemini(
  items: RawRepoItem[],
  apiKey: string,
): Promise<Map<string, { summaryKo: string; keyFeaturesKo: string[]; tags: string[] }>> {
  const results = new Map<string, { summaryKo: string; keyFeaturesKo: string[]; tags: string[] }>();
  if (items.length === 0) return results;

  const genAI = new GoogleGenerativeAI(apiKey);
  const candidateModels = Array.from(new Set([
    activeWorkingModel,
    'gemini-flash-lite-latest',
    'gemini-3.1-flash-lite',
    'gemini-2.5-flash-lite',
    'gemini-1.5-flash',
  ]));

  const prompt = `
당신은 전 세계 오픈소스 트렌드를 분석하고 실무 개발자들에게 핵심 기술 가치를 전달하는 수석 소프트웨어 아키텍트이자 테크 큐레이터입니다.
아래 제공된 ${items.length}개의 프로젝트를 깊이 있게 분석하여, 한국 개발자가 직관적으로 가치를 체감할 수 있는 최고 품질의 큐레이션 요약을 작성해주세요.

[품질 작성 지침]
1. 원문 직역 금지: 단순 영문 번역투("~을 위한 도구입니다")를 지양하고, 전문적이고 명쾌한 개발자 언어로 서술하세요.
2. 핵심 요약 (summaryKo):
   - "기존의 어떤 고질적인 문제/한계를 해결하는지", "기존 대안 대비 핵심 차별점/혁신 요소가 무엇인지"를 1~2문장으로 임팩트 있게 작성하세요.
   - 예시: "기존 Docker 빌드 및 캐싱 병목을 해결하기 위해 Rust로 재작성된 초고속 컨테이너 빌더로, CI/CD 배포 파이프라인 시간을 최대 80% 단축해줍니다."
3. 주요 특징 (keyFeaturesKo):
   - 기술적 아키텍처/성능 차별점, 지원 생태계, 실무 추천 대상을 중심으로 3~4개의 명확한 불릿 포인트를 작성하세요.
4. 기술 태그 (tags):
   - 언어명 외에 "LLM-Agent", "CI-CD", "Zero-Dependency", "In-Memory-DB", "High-Performance" 등 실무 기술 키워드 3~4개를 정확하게 추출하세요.

[프로젝트 목록]
${items.map((item, idx) => `
${idx + 1}. [${item.owner}/${item.repo}]
- 주 언어: ${item.language}
- 원문 설명: ${item.description}
- 전체 Star: ${item.stars.toLocaleString()}개 / 최근 급상승: +${item.starsPeriod.toLocaleString()} stars (${item.since})
`).join('')}

반드시 아래 JSON 배열 형식으로만 응답해주세요 (마크다운 백틱 없이 순수 JSON만 출력):
[
  {
    "id": "owner/repo",
    "summaryKo": "구체적 문제 해결과 차별점이 드러난 명쾌한 한국어 1~2문장 요약",
    "keyFeaturesKo": ["아키텍처 및 성능 특징", "생태계 및 연동 지원", "실무 적용 이점"],
    "tags": ["태그1", "태그2", "태그3"]
  }
]
`;

  let success = false;
  for (const modelName of candidateModels) {
    if (success) break;
    try {
      console.log(`[mgt Collector] Calling Gemini API (${modelName}) with batch of ${items.length} repos (1 API request)...`);
      const model = genAI.getGenerativeModel({
        model: modelName,
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.2,
        },
      });
      const result = await model.generateContent(prompt);
      const text = result.response.text().trim();
      const cleanJson = text.replace(/^```json/, '').replace(/^```/, '').replace(/```$/, '').trim();
      const parsedArray = JSON.parse(cleanJson);

      if (Array.isArray(parsedArray)) {
        for (const entry of parsedArray) {
          if (entry.id && entry.summaryKo) {
            results.set(entry.id, {
              summaryKo: entry.summaryKo,
              keyFeaturesKo: Array.isArray(entry.keyFeaturesKo) ? entry.keyFeaturesKo : [],
              tags: Array.isArray(entry.tags) ? entry.tags : [],
            });
          }
        }
        success = true;
        activeWorkingModel = modelName;
        console.log(`[mgt Collector] Successfully summarized with model: ${modelName}`);
      }
    } catch (error: any) {
      console.warn(`[Gemini API] Error with ${modelName} (${error?.status || error?.message}): trying fallback model...`);
      // Brief pause before trying next candidate model
      await new Promise((r) => setTimeout(r, 1000));
    }
  }

  // Fill in any missing items in batch with fallback
  for (const item of items) {
    const id = `${item.owner}/${item.repo}`;
    if (!results.has(id)) {
      results.set(id, generateFallbackSummary(item));
    }
  }

  return results;
}

export async function summarizeWithGemini(
  raw: RawRepoItem,
  apiKey: string,
): Promise<{ summaryKo: string; keyFeaturesKo: string[]; tags: string[] }> {
  const map = await summarizeBatchWithGemini([raw], apiKey);
  return map.get(`${raw.owner}/${raw.repo}`) || generateFallbackSummary(raw);
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

  // 1. Deduplicate unique repositories so we don't summarize the same repo twice
  const uniqueRepoMap = new Map<string, RawRepoItem>();
  for (const raw of allRaw) {
    const id = `${raw.owner}/${raw.repo}`;
    if (!uniqueRepoMap.has(id)) {
      uniqueRepoMap.set(id, raw);
    }
  }

  const uniqueRepos = Array.from(uniqueRepoMap.values());
  console.log(`[mgt Collector] Found ${allRaw.length} total trending items (${uniqueRepos.length} unique repos).`);

  // 2. Batch summarize with Gemini (chunks of 6 repos per request for deep, high-quality analysis)
  // 38 unique repos / 6 = ~6-7 requests total, well within the 500 RPD free tier limit!
  const BATCH_SIZE = 6;
  const aiSummaries = new Map<string, { summaryKo: string; keyFeaturesKo: string[]; tags: string[] }>();

  if (apiKey) {
    for (let i = 0; i < uniqueRepos.length; i += BATCH_SIZE) {
      const chunk = uniqueRepos.slice(i, i + BATCH_SIZE);
      const batchResult = await summarizeBatchWithGemini(chunk, apiKey);
      for (const [id, summary] of batchResult.entries()) {
        aiSummaries.set(id, summary);
      }
      // Small pause between batches if multiple chunks exist
      if (i + BATCH_SIZE < uniqueRepos.length) {
        await new Promise((r) => setTimeout(r, 1500));
      }
    }
  } else {
    for (const repo of uniqueRepos) {
      aiSummaries.set(`${repo.owner}/${repo.repo}`, generateFallbackSummary(repo));
    }
  }

  // 3. Attach AI summaries to all items
  const processedItems: TrendItem[] = allRaw.map((raw) => {
    const id = `${raw.owner}/${raw.repo}`;
    const aiData = aiSummaries.get(id) || generateFallbackSummary(raw);
    return {
      id,
      ...raw,
      ...aiData,
    };
  });

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
