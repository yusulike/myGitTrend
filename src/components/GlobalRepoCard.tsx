import React, { useState } from 'react';
import { GlobalSearchIndexItem } from '../types/trend';
import {
  Star,
  GitFork,
  Flame,
  Bookmark,
  Copy,
  Check,
  ExternalLink,
  Calendar,
  History,
  Sparkles,
  Crown,
} from 'lucide-react';

interface GlobalRepoCardProps {
  item: GlobalSearchIndexItem;
  isBookmarked: boolean;
  onToggleBookmark: (id: string) => void;
  onSelectDate?: (date: string) => void;
  onTagClick?: (tag: string) => void;
  rank?: number;
}

const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  Python: '#3572A5',
  Rust: '#dea584',
  Go: '#00ADD8',
  'C++': '#f34b7d',
  C: '#555555',
  Java: '#b07219',
  Kotlin: '#A97BFF',
  Swift: '#F05138',
  PHP: '#4F5D95',
  Ruby: '#701516',
};

export function GlobalRepoCard({
  item,
  isBookmarked,
  onToggleBookmark,
  onSelectDate,
  onTagClick,
  rank,
}: GlobalRepoCardProps) {
  const [copied, setCopied] = useState(false);
  const [showAllDates, setShowAllDates] = useState(false);

  const handleCopyClone = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(`git clone ${item.url}.git`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const langColor = LANGUAGE_COLORS[item.language] || '#94a3b8';
  const cardId = `global-repo-card-${item.id.replace(/[/.]/g, '-')}`;

  const displayedDates = showAllDates
    ? item.appearedDates
    : item.appearedDates.slice(0, 4);

  const firstAppeared =
    item.appearedDates.length > 0
      ? [...item.appearedDates].sort()[0]
      : item.lastAppeared;

  return (
    <article
      id={cardId}
      className="group bg-white dark:bg-[#161b22] border border-slate-200 dark:border-[#30363d] rounded-2xl p-5 hover:border-sky-500/60 dark:hover:border-[#58a6ff]/60 shadow-sm hover:shadow-md dark:shadow-lg dark:shadow-black/30 dark:hover:shadow-black/50 transition-all flex flex-col justify-between"
    >
      <div>
        {/* Header row: Owner/Repo + Quick Actions */}
        <div className="flex items-start justify-between gap-3 mb-2.5">
          <div className="min-w-0 flex-1 flex items-center gap-2 flex-wrap">
            {/* Crown Badge for Top 1, 2, 3 located to the left of the title */}
            {rank === 1 && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-black bg-amber-100/90 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-700/80 shrink-0 shadow-xs">
                <Crown className="w-3.5 h-3.5 text-amber-500 fill-amber-400 shrink-0" />
                <span>1위</span>
              </span>
            )}
            {rank === 2 && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-black bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-600 shrink-0 shadow-xs">
                <Crown className="w-3.5 h-3.5 text-slate-400 dark:text-slate-300 fill-slate-300 dark:fill-slate-500 shrink-0" />
                <span>2위</span>
              </span>
            )}
            {rank === 3 && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-black bg-orange-100/90 dark:bg-orange-950/60 text-orange-800 dark:text-orange-300 border border-orange-300/80 dark:border-orange-700/60 shrink-0 shadow-xs">
                <Crown className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400 fill-orange-500/80 shrink-0" />
                <span>3위</span>
              </span>
            )}

            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group-hover:text-sky-600 dark:group-hover:text-[#58a6ff] font-bold text-base sm:text-lg text-slate-900 dark:text-[#f0f6fc] inline-flex items-center gap-1.5 break-all transition-colors"
            >
              <span className="text-slate-500 dark:text-[#8b949e] font-normal">
                {item.owner} /
              </span>
              <span>{item.repo}</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400 dark:text-[#8b949e] opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
            </a>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {/* Clone URL Copy */}
            <button
              onClick={handleCopyClone}
              className="p-1.5 rounded-lg text-slate-500 dark:text-[#8b949e] hover:text-slate-900 dark:hover:text-[#f0f6fc] hover:bg-slate-100 dark:hover:bg-[#21262d] border border-transparent hover:border-slate-200 dark:hover:border-[#30363d] transition-colors"
              title="git clone 명령어 복사"
            >
              {copied ? (
                <Check className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>

            {/* Bookmark button */}
            <button
              onClick={() => onToggleBookmark(item.id)}
              className={`p-1.5 rounded-lg border transition-colors ${
                isBookmarked
                  ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800'
                  : 'text-slate-500 dark:text-[#8b949e] hover:text-amber-500 hover:bg-slate-100 dark:hover:bg-[#21262d] border-transparent hover:border-slate-200 dark:hover:border-[#30363d]'
              }`}
              title={isBookmarked ? '북마크 해제' : '북마크 추가'}
            >
              <Bookmark
                className={`w-4 h-4 ${isBookmarked ? 'fill-amber-500' : ''}`}
              />
            </button>
          </div>
        </div>

        {/* Global Archive Appearance Badge */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
            <History className="w-3.5 h-3.5 text-sky-500" />
            총 {item.appearedDates.length}일간 트렌드 진입
          </span>
          <span className="text-xs text-slate-500 dark:text-[#8b949e]">
            최초: <span className="font-mono text-slate-700 dark:text-[#c9d1d9]">{firstAppeared}</span> · 최근: <span className="font-mono text-slate-700 dark:text-[#c9d1d9]">{item.lastAppeared}</span>
          </span>
        </div>

        {/* Korean AI Summary */}
        <div className="mb-3.5 p-3 rounded-xl bg-slate-50 dark:bg-[#0d1117] border border-slate-100 dark:border-[#21262d]">
          <div className="flex items-center gap-1.5 mb-1.5 text-xs font-semibold text-sky-700 dark:text-[#58a6ff]">
            <Sparkles className="w-3.5 h-3.5 text-sky-500" />
            <span>AI 핵심 분석</span>
          </div>
          <p className="text-sm text-slate-700 dark:text-[#c9d1d9] leading-relaxed">
            {item.summaryKo || item.description}
          </p>
        </div>

        {/* Appearance History Dates */}
        {item.appearedDates.length > 0 && (
          <div className="mb-4">
            <div className="text-[11px] font-medium text-slate-500 dark:text-[#8b949e] mb-1.5 flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>등장 일자 (클릭하여 해당 날짜 트렌드로 이동):</span>
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              {displayedDates.map((date) => (
                <button
                  key={date}
                  onClick={() => onSelectDate?.(date)}
                  className="px-2 py-0.5 rounded text-xs font-mono bg-slate-100 dark:bg-[#21262d] text-slate-700 dark:text-[#c9d1d9] hover:bg-sky-100 hover:text-sky-700 dark:hover:bg-sky-950/50 dark:hover:text-sky-300 border border-slate-200 dark:border-[#30363d] transition-colors"
                  title={`${date} 트렌드 보기`}
                >
                  {date}
                </button>
              ))}
              {item.appearedDates.length > 4 && (
                <button
                  onClick={() => setShowAllDates(!showAllDates)}
                  className="text-xs text-sky-600 dark:text-sky-400 hover:underline px-1 py-0.5 font-medium"
                >
                  {showAllDates ? '접기' : `+${item.appearedDates.length - 4}개 더보기`}
                </button>
              )}
            </div>
          </div>
        )}

        {/* Category Tags */}
        {item.tags && item.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {item.tags.map((tag) => (
              <button
                key={tag}
                onClick={() => onTagClick?.(tag)}
                className="px-2 py-0.5 rounded-md text-xs font-medium bg-slate-100 dark:bg-[#21262d] text-slate-600 dark:text-[#8b949e] hover:bg-sky-100 hover:text-sky-700 dark:hover:bg-sky-950/50 dark:hover:text-[#58a6ff] transition-colors"
              >
                #{tag}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Footer Metrics */}
      <div className="pt-3 border-t border-slate-100 dark:border-[#21262d] flex items-center justify-between text-xs text-slate-500 dark:text-[#8b949e]">
        <div className="flex items-center gap-3">
          {item.language && (
            <div className="flex items-center gap-1.5 font-medium">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: langColor }}
              />
              <span className="text-slate-700 dark:text-[#c9d1d9]">
                {item.language}
              </span>
            </div>
          )}

          <div className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 text-amber-500" />
            <span className="font-semibold text-slate-700 dark:text-[#c9d1d9]">
              {item.stars.toLocaleString()}
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-1">
            <GitFork className="w-3.5 h-3.5" />
            <span>{item.forks.toLocaleString()}</span>
          </div>
        </div>

        {item.maxStarsPeriod > 0 && (
          <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/30 px-2 py-0.5 rounded-full border border-emerald-100 dark:border-emerald-800">
            <Flame className="w-3.5 h-3.5 text-emerald-500 fill-emerald-500" />
            <span>최고 +{item.maxStarsPeriod.toLocaleString()}</span>
          </div>
        )}
      </div>
    </article>
  );
}
