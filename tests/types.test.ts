import { describe, it, expect } from 'vitest';
import { TrendItem, TrendSnapshot, isValidTrendItem, createDefaultFilterState } from '../src/types/trend';

describe('Data Models & Types', () => {
  it('validates a complete TrendItem structure', () => {
    const sampleItem: TrendItem = {
      id: 'facebook/react',
      owner: 'facebook',
      repo: 'react',
      url: 'https://github.com/facebook/react',
      description: 'The library for web and native user interfaces.',
      language: 'JavaScript',
      stars: 230000,
      forks: 46000,
      starsPeriod: 350,
      since: 'daily',
      summaryKo: '웹 및 모바일 네이티브 UI를 선언적으로 구축할 수 있게 해주는 핵심 프론트엔드 라이브러리',
      keyFeaturesKo: [
        '컴포넌트 기반 아키텍처',
        '가상 DOM을 통한 최적화된 렌더링',
        '풍부한 생태계와 광범위한 커뮤니티 지원'
      ],
      tags: ['Frontend', 'JavaScript', 'UI']
    };

    expect(isValidTrendItem(sampleItem)).toBe(true);
    expect(isValidTrendItem({ id: 'incomplete' })).toBe(false);
  });

  it('validates TrendSnapshot structure', () => {
    const sampleSnapshot: TrendSnapshot = {
      date: '2026-10-17',
      collectedAt: new Date().toISOString(),
      languages: ['JavaScript', 'TypeScript', 'Python'],
      items: []
    };

    expect(sampleSnapshot.date).toBe('2026-10-17');
    expect(sampleSnapshot.languages).toContain('Python');
  });

  it('validates FilterState defaults using factory', () => {
    const defaultFilter = createDefaultFilterState();

    expect(defaultFilter.selectedPeriod).toBe('daily');
    expect(defaultFilter.selectedLanguage).toBe('All');
    expect(defaultFilter.sortBy).toBe('starsPeriod');
    expect(defaultFilter.onlyBookmarks).toBe(false);
  });
});
