import { Bookmark, Moon, Sun } from 'lucide-react';

interface HeaderProps {
  bookmarkCount: number;
  onOpenBookmarks: () => void;
  isDark: boolean;
  onToggleDarkMode: () => void;
}

export function Header({
  bookmarkCount,
  onOpenBookmarks,
  isDark,
  onToggleDarkMode,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-[#161b22]/95 backdrop-blur-md border-b border-slate-200 dark:border-[#30363d] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          {/* Custom Git + Trend Engineering Logo */}
          <div className="w-9 h-9 rounded-xl bg-slate-900 dark:bg-[#21262d] border border-slate-700/60 dark:border-[#30363d] flex items-center justify-center text-sky-400 shadow-xs group cursor-default">
            <svg
              className="w-5 h-5 transition-transform duration-200 group-hover:scale-110"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="6" cy="18" r="3" />
              <circle cx="6" cy="6" r="3" />
              <path d="M6 9v9" />
              <path d="M9 15l9-9" />
              <path d="M13 6h5v5" />
            </svg>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-lg tracking-tight text-slate-900 dark:text-[#f0f6fc]">
                <span className="text-slate-400 dark:text-[#8b949e] font-normal">my</span>GitTrend
              </span>
              <span className="text-xs font-mono font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 border border-sky-200/60 dark:border-sky-800/60">
                Radar
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-[#8b949e] hidden sm:block font-medium">
              글로벌 오픈소스 급상승 트렌드 & 3초 핵심 인사이트
            </p>
          </div>
        </div>

        {/* Actions & Navigation */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Bookmarks Toggle Button */}
          <button
            onClick={onOpenBookmarks}
            className="relative flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-[#21262d] dark:hover:bg-[#30363d] border border-slate-200 dark:border-[#30363d] text-slate-700 dark:text-[#f0f6fc] transition-colors"
            title="북마크 모아보기"
          >
            <Bookmark className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400 fill-amber-500 dark:fill-amber-400" />
            <span className="hidden sm:inline">북마크</span>
            {bookmarkCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-xs font-bold bg-amber-500 text-white">
                {bookmarkCount}
              </span>
            )}
          </button>

          {/* Dark Mode Toggle */}
          <button
            onClick={onToggleDarkMode}
            className="p-2 rounded-xl text-slate-500 dark:text-[#8b949e] hover:text-slate-900 dark:hover:text-[#f0f6fc] hover:bg-slate-100 dark:hover:bg-[#21262d] border border-transparent hover:border-slate-200 dark:hover:border-[#30363d] transition-colors"
            title={isDark ? '라이트 모드로 전환' : '다크 모드로 전환'}
            aria-label="테마 전환"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>

          {/* GitHub Repo Link */}
          <a
            href="https://github.com/trending"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-xl text-slate-500 dark:text-[#8b949e] hover:text-slate-900 dark:hover:text-[#f0f6fc] hover:bg-slate-100 dark:hover:bg-[#21262d] border border-transparent hover:border-slate-200 dark:hover:border-[#30363d] transition-colors"
            title="GitHub Trending 바로가기"
            aria-label="GitHub Trending 바로가기"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
          </a>
        </div>
      </div>
    </header>
  );
}
