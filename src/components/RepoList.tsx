import { TrendItem } from '../types/trend';
import { RepoCard } from './RepoCard';
import { SearchX, Loader2 } from 'lucide-react';

interface RepoListProps {
  items: TrendItem[];
  isBookmarked: (id: string) => boolean;
  onToggleBookmark: (id: string) => void;
  onTagClick?: (tag: string) => void;
  isLoading?: boolean;
  onResetFilters?: () => void;
}

export function RepoList({
  items,
  isBookmarked,
  onToggleBookmark,
  onTagClick,
  isLoading = false,
  onResetFilters,
}: RepoListProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin text-brand-500 mb-3" />
        <p className="text-sm">트렌드 데이터를 불러오는 중입니다...</p>
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
          검색 및 필터 조건에 맞는 프로젝트가 없습니다
        </h3>
        <p className="text-xs text-slate-500 dark:text-[#8b949e] max-w-sm mb-4">
          다른 검색어를 입력하시거나 언어/기간 필터를 조정해 보세요.
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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {items.map((item) => (
        <RepoCard
          key={item.id}
          item={item}
          isBookmarked={isBookmarked(item.id)}
          onToggleBookmark={onToggleBookmark}
          onTagClick={onTagClick}
        />
      ))}
    </div>
  );
}
