import { Sparkles, Bookmark, Moon, Sun } from 'lucide-react';
import { DateSelector } from './DateSelector';

interface HeaderProps {
  bookmarkCount: number;
  onOpenBookmarks: () => void;
  isDark: boolean;
  onToggleDarkMode: () => void;
  availableDates: string[];
  selectedDate: string;
  onSelectDate: (date: string) => void;
}

export function Header({
  bookmarkCount,
  onOpenBookmarks,
  isDark,
  onToggleDarkMode,
  availableDates,
  selectedDate,
  onSelectDate,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 bg-[#161b22]/95 backdrop-blur-md border-b border-[#30363d] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-brand-500 flex items-center justify-center text-white shadow-md shadow-sky-500/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-sky-200 to-sky-400 bg-clip-text text-transparent">
                mgt
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#21262d] text-sky-400 border border-[#30363d]">
                myGitTrend
              </span>
            </div>
            <p className="text-[11px] text-[#8b949e] hidden sm:block">
              AI가 한국어로 요약해주는 깃허브 트렌드 큐레이션
            </p>
          </div>
        </div>

        {/* Actions & Navigation */}
        <div className="flex items-center gap-2 sm:gap-3">
          <DateSelector
            availableDates={availableDates}
            selectedDate={selectedDate}
            onSelectDate={onSelectDate}
          />

          {/* Bookmarks Toggle Button */}
          <button
            onClick={onOpenBookmarks}
            className="relative flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] text-[#f0f6fc] transition-colors"
            title="북마크 모아보기"
          >
            <Bookmark className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span className="hidden sm:inline">북마크</span>
            {bookmarkCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-500 text-white">
                {bookmarkCount}
              </span>
            )}
          </button>

          {/* Dark Mode Toggle */}
          <button
            onClick={onToggleDarkMode}
            className="p-2 rounded-xl text-[#8b949e] hover:text-[#f0f6fc] hover:bg-[#21262d] border border-transparent hover:border-[#30363d] transition-colors"
            title={isDark ? '라이트 모드로 전환' : '다크 모드로 전환'}
            aria-label="테마 전환"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* GitHub Repo Link */}
          <a
            href="https://github.com/trending"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-xl text-[#8b949e] hover:text-[#f0f6fc] hover:bg-[#21262d] border border-transparent hover:border-[#30363d] transition-colors"
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
