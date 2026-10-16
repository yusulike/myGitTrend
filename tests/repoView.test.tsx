import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { RepoCard } from '../src/components/RepoCard';
import { RepoList } from '../src/components/RepoList';
import { TrendItem } from '../src/types/trend';

const mockItem: TrendItem = {
  id: 'astral-sh/uv',
  owner: 'astral-sh',
  repo: 'uv',
  url: 'https://github.com/astral-sh/uv',
  description: 'An extremely fast Python package manager in Rust.',
  language: 'Rust',
  stars: 39400,
  forks: 1450,
  starsPeriod: 980,
  since: 'daily',
  summaryKo: 'Rust로 작성된 초고속 차세대 Python 패키지 관리 도구',
  keyFeaturesKo: ['pip 대비 10~100배 속도 향상', '단일 바이너리로 구동'],
  tags: ['Python', 'Rust', 'DevTools']
};

describe('RepoCard & RepoList', () => {
  it('renders RepoCard with AI summary, stats, and tags', () => {
    const handleBookmark = vi.fn();
    const handleTagClick = vi.fn();

    render(
      <RepoCard
        item={mockItem}
        isBookmarked={false}
        onToggleBookmark={handleBookmark}
        onTagClick={handleTagClick}
      />
    );

    expect(screen.getByText('uv')).toBeDefined();
    expect(screen.getByText(/astral-sh/)).toBeDefined();
    expect(screen.getByText(/Rust로 작성된 초고속/)).toBeDefined();
    expect(screen.getByText('+980 stars today')).toBeDefined();
    expect(screen.getByText('pip 대비 10~100배 속도 향상')).toBeDefined();

    // Click bookmark button
    const bookmarkBtn = screen.getByTitle('북마크 추가');
    fireEvent.click(bookmarkBtn);
    expect(handleBookmark).toHaveBeenCalledWith('astral-sh/uv');

    // Click tag
    const devToolsTag = screen.getByText('#DevTools');
    fireEvent.click(devToolsTag);
    expect(handleTagClick).toHaveBeenCalledWith('DevTools');
  });

  it('renders RepoList with items and empty state', () => {
    const handleReset = vi.fn();

    const { rerender } = render(
      <RepoList
        items={[mockItem]}
        isBookmarked={() => true}
        onToggleBookmark={() => {}}
        onTagClick={() => {}}
        isLoading={false}
        onResetFilters={handleReset}
      />
    );

    expect(screen.getByText('uv')).toBeDefined();

    // Rerender empty list
    rerender(
      <RepoList
        items={[]}
        isBookmarked={() => false}
        onToggleBookmark={() => {}}
        onTagClick={() => {}}
        isLoading={false}
        onResetFilters={handleReset}
      />
    );

    expect(screen.getByText(/검색 및 필터 조건에 맞는 프로젝트가 없습니다/i)).toBeDefined();
    const resetBtn = screen.getByText('필터 초기화');
    fireEvent.click(resetBtn);
    expect(handleReset).toHaveBeenCalled();
  });
});
