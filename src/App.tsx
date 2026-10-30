import { useState, useMemo } from 'react';
import { useTrendData } from './hooks/useTrendData';
import { useGlobalSearch } from './hooks/useGlobalSearch';
import { useBookmarks } from './hooks/useBookmarks';
import { useDarkMode } from './hooks/useDarkMode';
import { Header } from './components/Header';
import { SearchInput } from './components/SearchInput';
import { SearchScopeTabs } from './components/SearchScopeTabs';
import { FilterBar } from './components/FilterBar';
import { RepoList } from './components/RepoList';
import { GlobalRepoList } from './components/GlobalRepoList';
import { BookmarkDrawer } from './components/BookmarkDrawer';
import { FilterState, createDefaultFilterState } from './types/trend';
import { AlertCircle, RefreshCw, Sparkles, Flame, Zap, Sun, Trophy, ExternalLink } from 'lucide-react';
import { DateSelector } from './components/DateSelector';

export default function App() {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [filter, setFilter] = useState<FilterState>(createDefaultFilterState());
  const [isBookmarkDrawerOpen, setIsBookmarkDrawerOpen] = useState(false);

  const { data, availableDates, isLoading, error, reload } = useTrendData(selectedDate);
  const { indexData: globalIndex, isLoading: isGlobalLoading } = useGlobalSearch();
  const { bookmarks, isBookmarked, toggleBookmark, clearBookmarks } = useBookmarks();
  const { isDark, toggleDarkMode } = useDarkMode();

  // Earliest date recorded in archives (Start Date)
  const archiveStartDate = useMemo(() => {
    if (!availableDates || availableDates.length === 0) return '';
    return availableDates[availableDates.length - 1];
  }, [availableDates]);

  // All ranked trending items for the Leaderboard
  const rankedItems = useMemo(() => {
    if (!data?.items || data.items.length === 0) return [];
    return [...data.items]
      .filter((it) => it.since === filter.selectedPeriod)
      .sort((a, b) => (b.starsPeriod || 0) - (a.starsPeriod || 0));
  }, [data, filter.selectedPeriod]);
  const availableLanguages = useMemo(() => {
    if (!data?.items) return ['All'];
    const langs = new Set<string>();
    data.items.forEach((item) => {
      if (item.language && item.language !== 'Markdown / Other') {
        langs.add(item.language);
      }
    });
    return ['All', ...Array.from(langs).sort()];
  }, [data]);

  // Filtered and sorted items
  const filteredItems = useMemo(() => {
    if (!data?.items) return [];

    let result = data.items.filter((item) => {
      // 1. Period filter
      if (item.since !== filter.selectedPeriod) return false;

      // 2. Language filter
      if (
        filter.selectedLanguage !== 'All' &&
        item.language !== filter.selectedLanguage
      ) {
        return false;
      }

      // 3. Search query
      if (filter.search.trim()) {
        const query = filter.search.toLowerCase().trim();
        const matchName = item.repo.toLowerCase().includes(query);
        const matchOwner = item.owner.toLowerCase().includes(query);
        const matchSummary = item.summaryKo.toLowerCase().includes(query);
        const matchDesc = item.description.toLowerCase().includes(query);
        const matchTag = item.tags.some((t) => t.toLowerCase().includes(query));

        if (!matchName && !matchOwner && !matchSummary && !matchDesc && !matchTag) {
          return false;
        }
      }

      return true;
    });

    // Sort items
    result.sort((a, b) => {
      if (filter.sortBy === 'starsPeriod') {
        return b.starsPeriod - a.starsPeriod;
      }
      if (filter.sortBy === 'starsTotal') {
        return b.stars - a.stars;
      }
      if (filter.sortBy === 'name') {
        return a.repo.localeCompare(b.repo);
      }
      return 0;
    });

    return result;
  }, [data, filter]);

  // Global search languages
  const globalLanguages = useMemo(() => {
    if (!globalIndex || globalIndex.length === 0) return ['All'];
    const langs = new Set<string>();
    globalIndex.forEach((item) => {
      if (item.language && item.language !== 'Markdown / Other') {
        langs.add(item.language);
      }
    });
    return ['All', ...Array.from(langs).sort()];
  }, [globalIndex]);

  // Filtered items from Global Search Index
  const filteredGlobalItems = useMemo(() => {
    if (!globalIndex || globalIndex.length === 0) return [];

    let result = globalIndex.filter((item) => {
      // 1. Language filter
      if (
        filter.selectedLanguage !== 'All' &&
        item.language !== filter.selectedLanguage
      ) {
        return false;
      }

      // 2. Search query
      if (filter.search.trim()) {
        const query = filter.search.toLowerCase().trim();
        const matchName = item.repo.toLowerCase().includes(query);
        const matchOwner = item.owner.toLowerCase().includes(query);
        const matchSummary = item.summaryKo?.toLowerCase().includes(query);
        const matchDesc = item.description?.toLowerCase().includes(query);
        const matchTag = item.tags?.some((t) => t.toLowerCase().includes(query));

        if (!matchName && !matchOwner && !matchSummary && !matchDesc && !matchTag) {
          return false;
        }
      }

      return true;
    });

    // Sort items
    result.sort((a, b) => {
      if (filter.sortBy === 'starsPeriod') {
        return (b.maxStarsPeriod || 0) - (a.maxStarsPeriod || 0) || b.appearedDates.length - a.appearedDates.length;
      }
      if (filter.sortBy === 'starsTotal') {
        return b.stars - a.stars;
      }
      if (filter.sortBy === 'name') {
        return a.repo.localeCompare(b.repo);
      }
      return 0;
    });

    return result;
  }, [globalIndex, filter]);

  // Bookmarked items list
  const bookmarkedItems = useMemo(() => {
    if (!data?.items) return [];
    return data.items.filter((item) => bookmarks.includes(item.id));
  }, [data, bookmarks]);

  // Handle clicking on a tag from any repo card
  const handleTagClick = (tag: string) => {
    setFilter((prev) => ({
      ...prev,
      search: tag,
    }));
  };

  const handleResetFilters = () => {
    setFilter(createDefaultFilterState());
  };

  // Trend Weather condition calculation based on period stars and item count
  const weatherStatus = useMemo(() => {
    if (!data?.items || data.items.length === 0) {
      return {
        label: '데이터 준비 중',
        description: '트렌드 수집 대기 중',
        topRepo: null,
        topStars: 0,
        icon: Sun,
        colorClass: 'text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700',
        badgeClass: 'text-slate-600 dark:text-slate-300',
      };
    }

    const totalPeriodStars = data.items.reduce((sum, item) => sum + (item.starsPeriod || 0), 0);
    const avgPeriodStars = Math.round(totalPeriodStars / data.items.length);

    // Find top trending item
    let topItem = data.items[0];
    for (const it of data.items) {
      if ((it.starsPeriod || 0) > (topItem.starsPeriod || 0)) {
        topItem = it;
      }
    }

    const topInfo = {
      name: `${topItem.owner}/${topItem.repo}`,
      stars: topItem.starsPeriod || 0,
    };

    if (avgPeriodStars >= 400) {
      return {
        label: '초열풍 트렌드',
        description: `평균 +${avgPeriodStars.toLocaleString()} Star`,
        topRepo: topInfo,
        icon: Flame,
        colorClass: 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900/60',
        badgeClass: 'text-rose-600 dark:text-rose-400',
      };
    } else if (avgPeriodStars >= 200) {
      return {
        label: '활발한 오픈소스',
        description: `평균 +${avgPeriodStars.toLocaleString()} Star`,
        topRepo: topInfo,
        icon: Zap,
        colorClass: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900/60',
        badgeClass: 'text-amber-600 dark:text-amber-400',
      };
    }

    return {
      label: '안정적인 성장세',
      description: '균형 잡힌 트렌드',
      topRepo: topInfo,
      icon: Sun,
      colorClass: 'text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/40 border-sky-200 dark:border-sky-900/60',
      badgeClass: 'text-sky-600 dark:text-sky-400',
    };
  }, [data]);

  const handleScrollToCard = (id: string) => {
    const cardId = `repo-card-${id.replace(/[/.]/g, '-')}`;
    const el = document.getElementById(cardId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el.classList.add('ring-2', 'ring-sky-500', 'transition-all');
      setTimeout(() => {
        el.classList.remove('ring-2', 'ring-sky-500');
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0d1117] text-slate-900 dark:text-[#f0f6fc] transition-colors">
      <Header
        bookmarkCount={bookmarks.length}
        onOpenBookmarks={() => setIsBookmarkDrawerOpen(true)}
        isDark={isDark}
        onToggleDarkMode={toggleDarkMode}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Hero Banner / Summary info */}
        <section className="relative overflow-hidden bg-white dark:bg-[#161b22] border border-slate-200 dark:border-[#30363d] rounded-2xl p-3.5 sm:p-4 shadow-sm dark:shadow-lg dark:shadow-black/30 flex flex-col lg:flex-row items-stretch justify-between gap-5">
          <div className="absolute -top-24 -left-24 w-72 h-72 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Left Hero Area: Trend Leaderboard Panel */}
          <div className="relative z-10 flex-1 min-w-0 flex flex-col">
            {/* Header: Compact single row */}
            <div className="flex items-center justify-between gap-3 mb-1.5 px-1 shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-md bg-amber-500/10 dark:bg-amber-400/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                  <Trophy className="w-3 h-3" />
                </div>
                <div className="flex items-baseline gap-2">
                  <h1 className="text-sm sm:text-base font-extrabold tracking-tight text-slate-900 dark:text-[#f0f6fc]">
                    급상승 리더보드
                  </h1>
                  <span className="text-xs text-slate-500 dark:text-[#8b949e]">
                    {filter.selectedPeriod === 'daily'
                      ? '오늘'
                      : filter.selectedPeriod === 'weekly'
                      ? '이번 주'
                      : '이번 달'}{' '}
                    인기 순위
                  </span>
                </div>
              </div>

              <div className="text-xs text-slate-500 dark:text-[#8b949e] tabular-nums font-medium">
                총 <strong className="text-slate-900 dark:text-[#f0f6fc]">{rankedItems.length}</strong>개
              </div>
            </div>

            {/* Scrollable Leaderboard List - Compact 6 items visible without cutoff */}
            <div className="space-y-1 h-[200px] overflow-y-auto pr-1">
              {rankedItems.map((item, idx) => {
                const rankBadgeClass =
                  idx === 0
                    ? 'text-amber-600 dark:text-amber-400 bg-amber-500/15 border-amber-500/30'
                    : idx === 1
                    ? 'text-slate-600 dark:text-slate-300 bg-slate-200/60 dark:bg-slate-700/40 border-slate-300 dark:border-slate-600'
                    : idx === 2
                    ? 'text-orange-700 dark:text-orange-400 bg-orange-600/15 border-orange-600/30'
                    : 'text-slate-400 dark:text-[#8b949e] border-transparent';

                return (
                  <div
                    key={item.id}
                    className="h-[30px] shrink-0 group hover:bg-slate-50 dark:hover:bg-[#21262d] rounded-lg px-2 flex items-center justify-between gap-2.5 transition-colors"
                  >
                    {/* Left: Rank & Clickable Project Name (Scrolls to card) */}
                    <button
                      type="button"
                      onClick={() => handleScrollToCard(item.id)}
                      className="flex items-center gap-2 min-w-0 flex-1 text-left focus:outline-none"
                      title={`${item.repo} 카드로 스크롤`}
                    >
                      <span className={`w-4.5 h-4.5 rounded flex items-center justify-center text-[10px] font-bold border shrink-0 tabular-nums ${rankBadgeClass}`}>
                        {idx + 1}
                      </span>
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <span className="text-xs font-bold text-slate-900 dark:text-[#f0f6fc] group-hover:text-sky-600 dark:group-hover:text-sky-400 truncate transition-colors shrink-0">
                          {item.repo}
                        </span>
                        <span className="text-xs text-slate-500 dark:text-[#8b949e] truncate hidden md:inline">
                          {item.summaryKo || item.description}
                        </span>
                      </div>
                    </button>

                    {/* Right: Stars earned & External Link Button (Opens GitHub) */}
                    <div className="flex items-center gap-1 shrink-0">
                      <span className="text-xs font-semibold text-rose-500 dark:text-rose-400 flex items-center gap-0.5 tabular-nums">
                        <Flame className="w-3 h-3 fill-rose-500 text-rose-500 shrink-0" />
                        +{item.starsPeriod.toLocaleString()}
                      </span>
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-0.5 rounded text-slate-400 hover:text-slate-900 dark:text-[#8b949e] dark:hover:text-[#f0f6fc] hover:bg-slate-200/50 dark:hover:bg-[#30363d] transition-colors"
                        title="GitHub 레포지토리 바로가기"
                        aria-label={`${item.repo} GitHub 페이지 열기`}
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Vertical divider between leaderboard and metrics */}
          <div className="hidden lg:block w-px self-stretch bg-slate-200/80 dark:bg-[#30363d]" />

          {/* Right Hero Area: Metrics & Calendar (Integrated, borderless) */}
          {data && (
            <div className="relative z-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-5 shrink-0">
              {/* Left Column: Flat Structured Metrics */}
              <div className="sm:w-56 shrink-0 flex flex-col justify-between self-stretch py-0.5 space-y-2">
                {/* Status Bar */}
                <div className="flex items-center justify-between text-xs">
                  <div className="text-slate-500 dark:text-[#8b949e] font-medium flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-sky-500" />
                    <span>데이터 기준일</span>
                  </div>
                  {selectedDate ? (
                    <span className="px-1.5 py-0.2 rounded text-[10px] font-semibold bg-amber-100 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800/60">
                      아카이브
                    </span>
                  ) : (
                    <span className="px-1.5 py-0.2 rounded text-[10px] font-medium bg-slate-100 dark:bg-[#21262d] text-slate-600 dark:text-[#8b949e]">
                      실시간 최신
                    </span>
                  )}
                </div>

                {/* Date Display */}
                <div>
                  <span className="text-[11px] font-medium text-slate-400 dark:text-[#8b949e] block">
                    수집 일자
                  </span>
                  <div className="text-2xl font-black text-slate-900 dark:text-[#f0f6fc] tracking-tight tabular-nums">
                    {data.date}
                  </div>
                </div>

                {/* Summary Stat Row */}
                <div className="grid grid-cols-2 gap-2 py-1.5 border-y border-slate-100 dark:border-[#21262d]">
                  <div>
                    <span className="text-[10px] font-medium text-slate-400 dark:text-[#8b949e] block">
                      트렌드 레포
                    </span>
                    <div className="flex items-baseline gap-0.5 mt-0.5">
                      <span className="text-base font-bold text-slate-900 dark:text-[#f0f6fc] tabular-nums">
                        {data.items.length}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-[#8b949e]">개</span>
                    </div>
                  </div>
                  {weatherStatus.topRepo && (
                    <div>
                      <span className="text-[10px] font-medium text-slate-400 dark:text-[#8b949e] block">
                        최고 급상승
                      </span>
                      <div className="text-base font-bold text-rose-500 dark:text-rose-400 tabular-nums mt-0.5 truncate">
                        +{weatherStatus.topRepo.stars >= 1000 ? `${(weatherStatus.topRepo.stars / 1000).toFixed(1)}k` : weatherStatus.topRepo.stars}
                        <span className="text-[11px] font-normal text-rose-500/80 ml-0.5">Star</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Weather Indicator Banner */}
                <div className={`flex items-center justify-between gap-1.5 px-2 py-1 rounded-lg border text-xs font-semibold ${weatherStatus.colorClass}`}>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <weatherStatus.icon className="w-3.5 h-3.5 shrink-0" />
                    <span className="font-bold whitespace-nowrap">{weatherStatus.label}</span>
                  </div>
                  <span className="text-[11px] font-medium opacity-90 whitespace-nowrap tabular-nums">
                    {weatherStatus.description}
                  </span>
                </div>
              </div>

              {/* Divider between info & mini calendar */}
              <div className="hidden sm:block w-px self-stretch bg-slate-200/80 dark:bg-[#30363d]" />

              {/* Right Column: Inline mini-calendar */}
              <div className="w-full sm:w-56 shrink-0">
                <DateSelector
                  availableDates={availableDates}
                  selectedDate={selectedDate}
                  onSelectDate={setSelectedDate}
                  variant="inline"
                />
              </div>
            </div>
          )}
        </section>

        {/* Error State */}
        {error && (
          <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-2xl flex items-center justify-between gap-3 text-rose-700 dark:text-rose-300">
            <div className="flex items-center gap-2 text-sm font-medium">
              <AlertCircle className="w-5 h-5 shrink-0 text-rose-500" />
              <span>{error}</span>
            </div>
            <button
              onClick={reload}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 text-xs font-semibold shadow-sm hover:bg-slate-50 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              다시 시도
            </button>
          </div>
        )}

        {/* Search & Filter Controls */}
        <section className="space-y-4">
          <SearchInput
            value={filter.search}
            onChange={(val) => setFilter((prev) => ({ ...prev, search: val }))}
          />

          <SearchScopeTabs
            searchScope={filter.searchScope}
            onScopeChange={(scope) => setFilter((prev) => ({ ...prev, searchScope: scope }))}
            currentCount={filteredItems.length}
            globalCount={filteredGlobalItems.length}
            selectedDate={selectedDate}
            searchQuery={filter.search}
            archiveStartDate={archiveStartDate}
          />

          <FilterBar
            filter={filter}
            languages={filter.searchScope === 'all' ? globalLanguages : availableLanguages}
            onFilterChange={setFilter}
            totalCount={
              filter.searchScope === 'all'
                ? globalIndex.length
                : data?.items.filter((i) => i.since === filter.selectedPeriod).length || 0
            }
            filteredCount={
              filter.searchScope === 'all' ? filteredGlobalItems.length : filteredItems.length
            }
            hidePeriod={filter.searchScope === 'all'}
            archiveStartDate={archiveStartDate}
          />
        </section>

        {/* Repository Cards List */}
        <section>
          {filter.searchScope === 'all' ? (
            <GlobalRepoList
              items={filteredGlobalItems}
              isBookmarked={isBookmarked}
              onToggleBookmark={toggleBookmark}
              onSelectDate={(date) => {
                setSelectedDate(date);
                setFilter((prev) => ({ ...prev, searchScope: 'current' }));
              }}
              onTagClick={handleTagClick}
              isLoading={isGlobalLoading}
              onResetFilters={handleResetFilters}
              archiveStartDate={archiveStartDate}
            />
          ) : (
            <RepoList
              items={filteredItems}
              isBookmarked={isBookmarked}
              onToggleBookmark={toggleBookmark}
              onTagClick={handleTagClick}
              isLoading={isLoading}
              onResetFilters={handleResetFilters}
            />
          )}
        </section>
      </main>

      {/* Bookmarks Drawer */}
      <BookmarkDrawer
        isOpen={isBookmarkDrawerOpen}
        onClose={() => setIsBookmarkDrawerOpen(false)}
        items={bookmarkedItems}
        onToggleBookmark={toggleBookmark}
        onClearAll={clearBookmarks}
      />

      {/* Footer */}
      <footer className="mt-12 border-t border-slate-200 dark:border-[#30363d] bg-white dark:bg-[#0d1117] py-6 text-center text-xs text-slate-500 dark:text-[#8b949e]">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900 dark:text-[#f0f6fc]">mgt</span>
            <span>•</span>
            <span>myGitTrend © {new Date().getFullYear()}</span>
          </div>
          <div className="flex items-center gap-4 text-slate-500 dark:text-[#8b949e]">
            <span>Powered by GitHub Actions & Gemini AI</span>
            <span>•</span>
            <a
              href="https://github.com/trending"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-900 dark:hover:text-[#f0f6fc] underline transition-colors"
            >
              GitHub Trending
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
