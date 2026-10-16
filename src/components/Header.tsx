import React from 'react';
import { Sparkles, Bookmark, Moon, Sun, Github } from 'lucide-react';
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
    <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-sky-400 flex items-center justify-center text-white shadow-md shadow-brand-500/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-slate-900 via-brand-700 to-sky-600 dark:from-white dark:via-sky-300 dark:to-brand-400 bg-clip-text text-transparent">
                mgt
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 border border-brand-200 dark:border-brand-800/60">
                myGitTrend
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
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
            className="relative flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
            title="북마크 모아보기"
          >
            <Bookmark className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
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
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
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
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="GitHub Trending 바로가기"
            aria-label="GitHub Trending 바로가기"
          >
            <Github className="w-4 h-4" />
          </a>
        </div>
      </div>
    </header>
  );
}
