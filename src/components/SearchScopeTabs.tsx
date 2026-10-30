import { Archive, Calendar, Sparkles } from 'lucide-react';
import { SearchScope } from '../types/trend';

interface SearchScopeTabsProps {
  searchScope: SearchScope;
  onScopeChange: (scope: SearchScope) => void;
  currentCount: number;
  globalCount: number;
  selectedDate?: string;
  searchQuery: string;
}

export function SearchScopeTabs({
  searchScope,
  onScopeChange,
  currentCount,
  globalCount,
  selectedDate,
  searchQuery,
}: SearchScopeTabsProps) {
  const dateLabel = selectedDate ? selectedDate : '실시간 최신';

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-2">
      {/* Scope Switcher Tabs */}
      <div className="inline-flex p-1 bg-slate-100 dark:bg-[#161b22] border border-slate-200 dark:border-[#30363d] rounded-xl self-start">
        <button
          type="button"
          onClick={() => onScopeChange('current')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            searchScope === 'current'
              ? 'bg-white dark:bg-[#21262d] text-sky-600 dark:text-sky-400 border border-slate-200/80 dark:border-[#30363d] shadow-sm'
              : 'text-slate-500 dark:text-[#8b949e] hover:text-slate-900 dark:hover:text-[#f0f6fc]'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>선택 일자 ({dateLabel})</span>
          <span
            className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] ${
              searchScope === 'current'
                ? 'bg-sky-100 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300'
                : 'bg-slate-200 dark:bg-[#30363d] text-slate-600 dark:text-[#8b949e]'
            }`}
          >
            {currentCount}
          </span>
        </button>

        <button
          type="button"
          onClick={() => onScopeChange('all')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            searchScope === 'all'
              ? 'bg-white dark:bg-[#21262d] text-sky-600 dark:text-sky-400 border border-slate-200/80 dark:border-[#30363d] shadow-sm'
              : 'text-slate-500 dark:text-[#8b949e] hover:text-slate-900 dark:hover:text-[#f0f6fc]'
          }`}
        >
          <Archive className="w-3.5 h-3.5" />
          <span>전체 아카이브</span>
          <span
            className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] ${
              searchScope === 'all'
                ? 'bg-sky-100 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300'
                : 'bg-slate-200 dark:bg-[#30363d] text-slate-600 dark:text-[#8b949e]'
            }`}
          >
            {globalCount}
          </span>
        </button>
      </div>

      {/* Helpful Hint if current has 0 results but archive has results */}
      {searchQuery.trim() && searchScope === 'current' && currentCount === 0 && globalCount > 0 && (
        <button
          type="button"
          onClick={() => onScopeChange('all')}
          className="inline-flex items-center gap-1.5 text-xs text-sky-600 dark:text-sky-400 hover:underline font-medium animate-pulse"
        >
          <Sparkles className="w-3.5 h-3.5 text-sky-500" />
          <span>이 날짜엔 없지만, 전체 아카이브에서 {globalCount}건 발견! (전체 보기)</span>
        </button>
      )}
    </div>
  );
}
