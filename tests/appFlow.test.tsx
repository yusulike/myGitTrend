import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BookmarkDrawer } from '../src/components/BookmarkDrawer';
import { TrendItem } from '../src/types/trend';

const mockBookmarkedItems: TrendItem[] = [
  {
    id: 'shadcn-ui/ui',
    owner: 'shadcn-ui',
    repo: 'ui',
    url: 'https://github.com/shadcn-ui/ui',
    description: 'Beautifully designed components.',
    language: 'TypeScript',
    stars: 78500,
    forks: 6900,
    starsPeriod: 1240,
    since: 'daily',
    summaryKo: '복사하여 붙여넣는 고품질 컴포넌트 라이브러리',
    keyFeaturesKo: ['Tailwind CSS 완벽 호환'],
    tags: ['UI', 'React']
  }
];

describe('BookmarkDrawer', () => {
  it('renders open drawer with bookmarked items and handles close', () => {
    const handleClose = vi.fn();
    const handleToggle = vi.fn();
    const handleClear = vi.fn();

    render(
      <BookmarkDrawer
        isOpen={true}
        onClose={handleClose}
        items={mockBookmarkedItems}
        onToggleBookmark={handleToggle}
        onClearAll={handleClear}
      />
    );

    expect(screen.getByText('저장한 레포지토리 (1)')).toBeDefined();
    expect(screen.getByText('shadcn-ui/ui')).toBeDefined();

    // Close button
    const closeBtn = screen.getByTitle('닫기');
    fireEvent.click(closeBtn);
    expect(handleClose).toHaveBeenCalled();
  });

  it('renders empty message when no items in bookmark drawer', () => {
    render(
      <BookmarkDrawer
        isOpen={true}
        onClose={() => {}}
        items={[]}
        onToggleBookmark={() => {}}
        onClearAll={() => {}}
      />
    );

    expect(screen.getByText(/아직 북마크한 레포지토리가 없습니다/i)).toBeDefined();
  });
});
