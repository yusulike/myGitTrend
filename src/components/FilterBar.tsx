import { FilterState, Period, SortOption } from '../types/trend';
import { Flame, Calendar, Sparkles, ArrowUpDown, RotateCcw } from 'lucide-react';

interface FilterBarProps {
  filter: FilterState;
  languages: string[];
  onFilterChange: (newFilter: FilterState) => void;
  totalCount: number;
  filteredCount: number;
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
        {/* Period Tabs */}
        <div className="inline-flex p-1 bg-slate-200/70 dark:bg-slate-800/80 rounded-xl">
          {PERIOD_OPTIONS.map(({ label, value, icon: Icon }) => {
            const isActive = filter.selectedPeriod === value;
            return (
              <button
                key={value}
                onClick={() => onFilterChange({ ...filter, selectedPeriod: value })}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
              </button>
            );
          })}
        </div>

        {/* Sort & Count */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <div className="text-xs text-slate-500 dark:text-slate-400 mr-1">
            {filteredCount === totalCount ? (
              <span>총 <strong>{totalCount}</strong>개</span>
            ) : (
              <span>
                <strong>{filteredCount}</strong> / {totalCount}개
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
              className="appearance-none bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 rounded-lg pl-3 pr-8 py-1.5 focus:outline-none focus:ring-2 focus:ring-brand-500/20 shadow-sm cursor-pointer"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <ArrowUpDown className="w-3 h-3 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {isFiltered && (
            <button
              onClick={resetFilters}
              title="필터 초기화"
              className="p-1.5 text-xs text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-sm transition-colors flex items-center gap-1"
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
                  ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-sm'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:text-slate-900 dark:hover:text-slate-100'
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
