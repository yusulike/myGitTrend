import { describe, it, expect } from 'vitest';
import { parseTrendingHtml, generateFallbackSummary } from '../scripts/collector';
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
  });

  it('generates valid mock snapshot conforming to TrendSnapshot schema', () => {
    const snapshot = generateMockSnapshot('2026-10-17');
    expect(snapshot.date).toBe('2026-10-17');
    expect(snapshot.items.length).toBeGreaterThanOrEqual(5);
    expect(snapshot.items.every(isValidTrendItem)).toBe(true);
  });
});
