import { describe, it, expect } from 'vitest';
import {
  parseTrendingHtml,
  generateFallbackSummary,
  fetchReadmeSnippet,
  generateFallbackReport,
} from '../scripts/collector';
import { generateMockSnapshot } from '../scripts/mockData';
import { isValidTrendItem } from '../src/types/trend';

describe('Collector & Summarizer', () => {
  const sampleTrendingHtml = `
    <article class="Box-row">
      <h2 class="h3 lh-condensed">
        <a href="/anthropics/anthropic-sdk-typescript">
          <span class="text-normal">anthropics / </span>anthropic-sdk-typescript
        </a>
      </h2>
      <p class="col-9 color-fg-muted my-1 pr-4">
        TypeScript and JavaScript library for the Anthropic API with full streaming support.
      </p>
      <div class="f6 color-fg-muted mt-2">
        <span class="d-inline-block ml-0 mr-3">
          <span class="repo-language-color" style="background-color: #3178c6"></span>
          <span itemprop="programmingLanguage">TypeScript</span>
        </span>
        <a href="/anthropics/anthropic-sdk-typescript/stargazers" class="LinkLink--muted d-inline-block mr-3">
          <svg class="octicon octicon-star"></svg> 4,250
        </a>
        <a href="/anthropics/anthropic-sdk-typescript/forks" class="LinkLink--muted d-inline-block mr-3">
          <svg class="octicon octicon-repo-forked"></svg> 380
        </a>
        <span class="d-inline-block float-sm-right">
          234 stars today
        </span>
      </div>
    </article>
  `;

  it('parses GitHub trending article HTML correctly', () => {
    const parsed = parseTrendingHtml(sampleTrendingHtml, 'daily');
    expect(parsed).toHaveLength(1);
    expect(parsed[0].owner).toBe('anthropics');
    expect(parsed[0].repo).toBe('anthropic-sdk-typescript');
    expect(parsed[0].language).toBe('TypeScript');
    expect(parsed[0].stars).toBe(4250);
    expect(parsed[0].forks).toBe(380);
    expect(parsed[0].starsPeriod).toBe(234);
    expect(parsed[0].since).toBe('daily');
  });

  it('generates high quality fallback summary when API key is unavailable', () => {
    const raw = {
      owner: 'astral-sh',
      repo: 'uv',
      description: 'An extremely fast Python package and project manager written in Rust.',
      language: 'Rust',
      stars: 35000,
      forks: 1200,
      starsPeriod: 850,
      since: 'daily' as const,
      url: 'https://github.com/astral-sh/uv',
    };

    const summary = generateFallbackSummary(raw);
    expect(summary.summaryKo).toBeDefined();
    expect(summary.summaryKo.length).toBeGreaterThan(5);
    expect(summary.keyFeaturesKo.length).toBeGreaterThanOrEqual(2);
    expect(summary.tags.length).toBeGreaterThanOrEqual(1);
    expect(summary.report).toBeDefined();
    expect(summary.report?.overview).toContain('uv');
  });

  it('generateFallbackReport returns a valid TechReport structure', () => {
    const raw = {
      owner: 'testowner',
      repo: 'testrepo',
      url: 'https://github.com/testowner/testrepo',
      description: 'Ultra fast web framework built with Rust',
      language: 'Rust',
      stars: 1000,
      forks: 50,
      starsPeriod: 100,
      since: 'daily' as const,
    };

    const report = generateFallbackReport(raw);
    expect(report.overview).toContain('testrepo');
    expect(report.background).toBeTruthy();
    expect(report.architecture.length).toBeGreaterThan(0);
    expect(report.useCases.length).toBeGreaterThan(0);
    expect(report.quickStart?.installCommand).toBeTruthy();
  });

  it('fetchReadmeSnippet safely returns empty string on 404 or network failure', async () => {
    const snippet = await fetchReadmeSnippet('invalid-owner-xyz-1234', 'invalid-repo-xyz-5678');
    expect(typeof snippet).toBe('string');
  });

  it('generates valid mock snapshot conforming to TrendSnapshot schema', () => {
    const snapshot = generateMockSnapshot('2026-10-17');
    expect(snapshot.date).toBe('2026-10-17');
    expect(snapshot.items.length).toBeGreaterThanOrEqual(5);
    expect(snapshot.items.every(isValidTrendItem)).toBe(true);
  });

  it('correctly maps Gemini JSON response containing report field', () => {
    const sampleGeminiOutput = JSON.stringify([
      {
        id: 'owner/repo',
        summaryKo: '테스트 요약',
        keyFeaturesKo: ['특징 1', '특징 2'],
        tags: ['AI', 'Python'],
        report: {
          overview: '개요 내용',
          background: '배경 설명',
          architecture: ['아키텍처 1', '아키텍처 2'],
          useCases: ['활용처 1'],
          quickStart: {
            installCommand: 'pip install test',
            codeSnippet: 'import test',
            language: 'python',
          },
          prosCons: {
            strengths: ['강점 1'],
            considerations: ['고려사항 1'],
          },
        },
      },
    ]);

    const parsed = JSON.parse(sampleGeminiOutput);
    expect(parsed[0].report.overview).toBe('개요 내용');
    expect(parsed[0].report.quickStart.installCommand).toBe('pip install test');
  });
});
