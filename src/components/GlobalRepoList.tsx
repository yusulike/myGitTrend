import { GlobalSearchIndexItem } from '../types/trend';
import { GlobalRepoCard } from './GlobalRepoCard';
import { SearchX, Loader2, Sparkles, Calendar } from 'lucide-react';

interface GlobalRepoListProps {
  items: GlobalSearchIndexItem[];
  isBookmarked: (id: string) => boolean;
  onToggleBookmark: (id: string) => void;
  onSelectDate?: (date: string) => void;
  onTagClick?: (tag: string) => void;
  isLoading?: boolean;
  onResetFilters?: () => void;
  archiveStartDate?: string;
}

export function GlobalRepoList({
  items,
  isBookmarked,
  onToggleBookmark,
  onSelectDate,
  onTagClick,
  isLoading = false,
  onResetFilters,
  archiveStartDate,
}: GlobalRepoListProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin text-sky-500 mb-3" />
        <p className="text-sm">전체 아카이브 인덱스를 불러오는 중입니다...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-white dark:bg-[#161b22] border border-slate-200 dark:border-[#30363d] rounded-2xl shadow-sm dark:shadow-lg dark:shadow-black/20">
        <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-[#21262d] flex items-center justify-center text-slate-400 dark:text-[#8b949e] mb-3">
          <SearchX className="w-6 h-6" />
        </div>
        <h3 className="text-base font-semibold text-slate-900 dark:text-[#f0f6fc] mb-1">
          전체 아카이브에서 일치하는 프로젝트가 없습니다
        </h3>
        <p className="text-xs text-slate-500 dark:text-[#8b949e] max-w-sm mb-4">
          검색어 철자를 확인하시거나 언어 필터를 전체(All)로 변경해 보세요.
        </p>
        {onResetFilters && (
          <button
            onClick={onResetFilters}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-sky-500 hover:bg-sky-600 text-white shadow-md shadow-sky-500/20 transition-colors"
          >
            필터 초기화
          </button>
        )}
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-sky-100 dark:bg-sky-950/50 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
            <Sparkles className="w-3.5 h-3.5" />
            전체 아카이브 통합 검색 결과: {items.length}개 프로젝트
          </span>
          {archiveStartDate && (
            <span className="inline-flex items-center gap-1 text-xs text-slate-500 dark:text-[#8b949e]">
              <Calendar className="w-3.5 h-3.5 text-slate-400 dark:text-[#8b949e]" />
              수집 시작일: <strong className="font-mono text-slate-800 dark:text-[#f0f6fc]">{archiveStartDate}</strong>
            </span>
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {items.map((item, idx) => (
          <GlobalRepoCard
            key={item.id}
            item={item}
            rank={idx + 1}
            isBookmarked={isBookmarked(item.id)}
            onToggleBookmark={onToggleBookmark}
            onSelectDate={onSelectDate}
            onTagClick={onTagClick}
          />
        ))}
      </div>
    </div>
  );
}
