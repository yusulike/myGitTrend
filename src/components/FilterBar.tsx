import { FilterState, Period, SortOption } from '../types/trend';
import { Flame, Calendar, Sparkles, ArrowUpDown, RotateCcw } from 'lucide-react';

interface FilterBarProps {
  filter: FilterState;
  languages: string[];
  onFilterChange: (newFilter: FilterState) => void;
  totalCount: number;
  filteredCount: number;
  hidePeriod?: boolean;
  archiveStartDate?: string;
}

const PERIOD_OPTIONS: { label: string; value: Period; icon: any }[] = [
  { label: '오늘', value: 'daily', icon: Flame },
  { label: '이번 주', value: 'weekly', icon: Calendar },
  { label: '이번 달', value: 'monthly', icon: Sparkles },
];

const SORT_OPTIONS: { label: string; value: SortOption }[] = [
  { label: '🔥 트렌드 급상승순', value: 'starsPeriod' },
  { label: '⭐ 누적 스타 많은순', value: 'starsTotal' },
  { label: '🔤 레포 이름순', value: 'name' },
];

export function FilterBar({
  filter,
  languages,
  onFilterChange,
  totalCount,
  filteredCount,
  hidePeriod = false,
  archiveStartDate,
}: FilterBarProps) {
  const isFiltered =
    filter.search !== '' ||
    filter.selectedLanguage !== 'All' ||
    filter.sortBy !== 'starsPeriod';

  const resetFilters = () => {
    onFilterChange({
      ...filter,
      search: '',
      selectedLanguage: 'All',
      sortBy: 'starsPeriod',
    });
  };

  return (
    <div className="space-y-4">
      {/* Top row: Period tabs & Sort dropdown */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Period Tabs (or Global View Note) */}
        {!hidePeriod ? (
          <div className="inline-flex p-1 bg-slate-100 dark:bg-[#161b22] border border-slate-200 dark:border-[#30363d] rounded-xl">
            {PERIOD_OPTIONS.map(({ label, value, icon: Icon }) => {
              const isActive = filter.selectedPeriod === value;
              return (
                <button
                  key={value}
                  onClick={() => onFilterChange({ ...filter, selectedPeriod: value })}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-white dark:bg-[#21262d] text-sky-600 dark:text-sky-400 border border-slate-200/80 dark:border-[#30363d] shadow-sm'
                      : 'text-slate-500 dark:text-[#8b949e] hover:text-slate-900 dark:hover:text-[#f0f6fc]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {label}
                </button>
              );
            })}
          </div>
        ) : (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-sky-50 dark:bg-[#161b22] border border-sky-100 dark:border-[#30363d] rounded-xl text-xs text-sky-800 dark:text-sky-300 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-sky-500" />
            <span>
              전체 아카이브 누적 뷰 {archiveStartDate ? `(${archiveStartDate} 수집 시작 ~ 현재)` : ''}
            </span>
          </div>
        )}

        {/* Sort & Count */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <div className="text-xs text-slate-500 dark:text-[#8b949e] mr-1">
            {filteredCount === totalCount ? (
              <span>총 <strong className="text-slate-900 dark:text-[#f0f6fc]">{totalCount}</strong>개</span>
            ) : (
              <span>
                <strong className="text-slate-900 dark:text-[#f0f6fc]">{filteredCount}</strong> / {totalCount}개
              </span>
            )}
          </div>

          <div className="relative">
            <select
              value={filter.sortBy}
              onChange={(e) =>
                onFilterChange({ ...filter, sortBy: e.target.value as SortOption })
              }
              aria-label="정렬 기준"
              className="appearance-none bg-white dark:bg-[#161b22] border border-slate-200 dark:border-[#30363d] text-xs text-slate-700 dark:text-[#c9d1d9] rounded-lg pl-3 pr-8 py-1.5 focus:outline-none focus:ring-2 focus:ring-sky-500/20 shadow-sm cursor-pointer"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-white dark:bg-[#161b22] text-slate-800 dark:text-[#f0f6fc]">
                  {opt.label}
                </option>
              ))}
            </select>
            <ArrowUpDown className="w-3 h-3 text-slate-400 dark:text-[#8b949e] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {isFiltered && (
            <button
              onClick={resetFilters}
              title="필터 초기화"
              className="p-1.5 text-xs text-slate-500 dark:text-[#8b949e] hover:text-slate-900 dark:hover:text-[#f0f6fc] bg-slate-100 dark:bg-[#161b22] hover:bg-slate-200 dark:hover:bg-[#21262d] border border-slate-200 dark:border-[#30363d] rounded-lg shadow-sm transition-colors flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Language Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
        {languages.map((lang) => {
          const isActive = filter.selectedLanguage === lang;
          return (
            <button
              key={lang}
              onClick={() => onFilterChange({ ...filter, selectedLanguage: lang })}
              className={`shrink-0 px-3 py-1 rounded-full text-xs font-medium transition-all ${
                isActive
                  ? 'bg-sky-500 text-white font-semibold shadow-sm shadow-sky-500/30'
                  : 'bg-slate-100 dark:bg-[#21262d] text-slate-600 dark:text-[#c9d1d9] border border-slate-200 dark:border-[#30363d] hover:bg-slate-200 dark:hover:border-[#8b949e] hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {lang}
            </button>
          );
        })}
      </div>
    </div>
  );
}
