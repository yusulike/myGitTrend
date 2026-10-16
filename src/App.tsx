import { useState, useMemo } from 'react';
import { useTrendData } from './hooks/useTrendData';
import { useBookmarks } from './hooks/useBookmarks';
import { useDarkMode } from './hooks/useDarkMode';
import { Header } from './components/Header';
import { SearchInput } from './components/SearchInput';
import { FilterBar } from './components/FilterBar';
import { RepoList } from './components/RepoList';
import { BookmarkDrawer } from './components/BookmarkDrawer';
import { FilterState, createDefaultFilterState } from './types/trend';
import { AlertCircle, RefreshCw, Sparkles } from 'lucide-react';

export default function App() {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [filter, setFilter] = useState<FilterState>(createDefaultFilterState());
  const [isBookmarkDrawerOpen, setIsBookmarkDrawerOpen] = useState(false);

  const { data, availableDates, isLoading, error, reload } = useTrendData(selectedDate);
  const { bookmarks, isBookmarked, toggleBookmark, clearBookmarks } = useBookmarks();
  const { isDark, toggleDarkMode } = useDarkMode();

  // All available languages for filter pills
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

  return (
    <div className="min-h-screen flex flex-col bg-[#0d1117] text-[#f0f6fc] transition-colors">
      <Header
        bookmarkCount={bookmarks.length}
        onOpenBookmarks={() => setIsBookmarkDrawerOpen(true)}
        isDark={isDark}
        onToggleDarkMode={toggleDarkMode}
        availableDates={availableDates}
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Hero Banner / Summary info */}
        <section className="relative overflow-hidden bg-[#161b22] border border-[#30363d] rounded-2xl p-6 sm:p-8 shadow-lg shadow-black/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="absolute -top-24 -left-24 w-72 h-72 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative space-y-2 z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#21262d] border border-[#30363d] text-xs font-semibold text-sky-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI 기반 일일 큐레이션</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#f0f6fc]">
              오늘의 GitHub 급상승 프로젝트
            </h1>
            <p className="text-sm text-[#8b949e] max-w-xl">
              GitHub에서 주목받고 있는 전 세계 오픈소스 트렌드를 AI가 한국어로 핵심만 짚어 요약해드립니다.
            </p>
          </div>

          {data && (
            <div className="relative z-10 bg-[#0d1117] border border-[#30363d] rounded-xl p-4 text-xs shrink-0 space-y-1">
              <div className="text-sky-400 font-semibold">데이터 기준일</div>
              <div className="text-lg font-bold text-[#f0f6fc]">{data.date}</div>
              <div className="text-[11px] text-[#8b949e]">
                수집된 프로젝트: 총 {data.items.length}개
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

          <FilterBar
            filter={filter}
            languages={availableLanguages}
            onFilterChange={setFilter}
            totalCount={
              data?.items.filter((i) => i.since === filter.selectedPeriod).length || 0
            }
            filteredCount={filteredItems.length}
          />
        </section>

        {/* Repository Cards List */}
        <section>
          <RepoList
            items={filteredItems}
            isBookmarked={isBookmarked}
            onToggleBookmark={toggleBookmark}
            onTagClick={handleTagClick}
            isLoading={isLoading}
            onResetFilters={handleResetFilters}
          />
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
      <footer className="mt-12 border-t border-[#30363d] bg-[#0d1117] py-6 text-center text-xs text-[#8b949e]">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#f0f6fc]">mgt</span>
            <span>•</span>
            <span>myGitTrend © {new Date().getFullYear()}</span>
          </div>
          <div className="flex items-center gap-4 text-[#8b949e]">
            <span>Powered by GitHub Actions & Gemini AI</span>
            <span>•</span>
            <a
              href="https://github.com/trending"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#f0f6fc] underline transition-colors"
            >
              GitHub Trending
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
