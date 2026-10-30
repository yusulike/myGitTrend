import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import { buildGlobalSearchIndex } from '../scripts/collector';
import { GlobalSearchIndexItem } from '../src/types/trend';

describe('Global Search Index Builder', () => {
  const testDataDir = path.resolve(__dirname, 'mock-data');
  const testArchivesDir = path.join(testDataDir, 'archives');

  beforeEach(() => {
    if (!fs.existsSync(testArchivesDir)) {
      fs.mkdirSync(testArchivesDir, { recursive: true });
    }

    const archive1 = {
      date: '2026-10-27',
      collectedAt: '2026-10-27T00:00:00.000Z',
      languages: ['TypeScript', 'Rust'],
      items: [
        {
          id: 'owner/repo-a',
          owner: 'owner',
          repo: 'repo-a',
          url: 'https://github.com/owner/repo-a',
          description: 'A TypeScript framework',
          language: 'TypeScript',
          stars: 1200,
          forks: 150,
          starsPeriod: 120,
          since: 'daily',
          summaryKo: '강력한 웹 프레임워크',
          keyFeaturesKo: ['고성능', '타입 안전성'],
          tags: ['Web', 'TypeScript'],
        },
      ],
    };

    const archive2 = {
      date: '2026-10-28',
      collectedAt: '2026-10-28T00:00:00.000Z',
      languages: ['TypeScript', 'Python'],
      items: [
        {
          id: 'owner/repo-a',
          owner: 'owner',
          repo: 'repo-a',
          url: 'https://github.com/owner/repo-a',
          description: 'A TypeScript framework updated',
          language: 'TypeScript',
          stars: 1500,
          forks: 180,
          starsPeriod: 300,
          since: 'daily',
          summaryKo: '강력한 웹 프레임워크 (업데이트됨)',
          keyFeaturesKo: ['고성능', '타입 안전성'],
          tags: ['Web', 'TypeScript'],
        },
        {
          id: 'owner/repo-b',
          owner: 'owner',
          repo: 'repo-b',
          url: 'https://github.com/owner/repo-b',
          description: 'A Python AI model',
          language: 'Python',
          stars: 5000,
          forks: 600,
          starsPeriod: 800,
          since: 'daily',
          summaryKo: '초경량 인공지능 모델',
          keyFeaturesKo: ['경량화', '온디바이스'],
          tags: ['AI', 'Python'],
        },
      ],
    };

    fs.writeFileSync(path.join(testArchivesDir, '2026-10-27.json'), JSON.stringify(archive1, null, 2));
    fs.writeFileSync(path.join(testArchivesDir, '2026-10-28.json'), JSON.stringify(archive2, null, 2));
    fs.writeFileSync(path.join(testDataDir, 'archive-index.json'), JSON.stringify(['2026-10-28', '2026-10-27'], null, 2));
  });

  afterEach(() => {
    if (fs.existsSync(testDataDir)) {
      fs.rmSync(testDataDir, { recursive: true, force: true });
    }
  });

  it('aggregates multiple archives into a unified search index', () => {
    buildGlobalSearchIndex(testDataDir, testArchivesDir, ['2026-10-27', '2026-10-28']);

    const searchIndexPath = path.join(testDataDir, 'search-index.json');
    expect(fs.existsSync(searchIndexPath)).toBe(true);

    const index: GlobalSearchIndexItem[] = JSON.parse(fs.readFileSync(searchIndexPath, 'utf-8'));
    expect(index.length).toBe(2);

    const repoA = index.find((item) => item.id === 'owner/repo-a');
    expect(repoA).toBeDefined();
    expect(repoA?.appearedDates).toEqual(['2026-10-27', '2026-10-28']);
    expect(repoA?.stars).toBe(1500);
    expect(repoA?.maxStarsPeriod).toBe(300);
    expect(repoA?.lastAppeared).toBe('2026-10-28');

    const repoB = index.find((item) => item.id === 'owner/repo-b');
    expect(repoB).toBeDefined();
    expect(repoB?.appearedDates).toEqual(['2026-10-28']);
    expect(repoB?.maxStarsPeriod).toBe(800);
  });
});
