import React, { useState } from 'react';
import { TrendItem } from '../types/trend';
import {
  Star,
  GitFork,
  Flame,
  Bookmark,
  Copy,
  Check,
  ExternalLink,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface RepoCardProps {
  item: TrendItem;
  isBookmarked: boolean;
  onToggleBookmark: (id: string) => void;
  onTagClick?: (tag: string) => void;
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

export function RepoCard({
  item,
  isBookmarked,
  onToggleBookmark,
  onTagClick,
}: RepoCardProps) {
  const [copied, setCopied] = useState(false);
  const [showOriginal, setShowOriginal] = useState(false);

  const handleCopyClone = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(`git clone ${item.url}.git`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const periodLabel =
    item.since === 'daily'
      ? 'stars today'
      : item.since === 'weekly'
      ? 'stars this week'
      : 'stars this month';

  const langColor = LANGUAGE_COLORS[item.language] || '#94a3b8';

  return (
    <article className="group bg-white dark:bg-[#161b22] border border-slate-200 dark:border-[#30363d] rounded-2xl p-5 hover:border-sky-500/60 dark:hover:border-[#58a6ff]/60 shadow-sm hover:shadow-md dark:shadow-lg dark:shadow-black/30 dark:hover:shadow-black/50 transition-all flex flex-col justify-between">
      <div>
        {/* Header row: Owner/Repo + Quick Actions */}
        <div className="flex items-start justify-between gap-3 mb-2.5">
          <div className="min-w-0 flex-1">
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group-hover:text-sky-600 dark:group-hover:text-[#58a6ff] font-bold text-base sm:text-lg text-slate-900 dark:text-[#f0f6fc] flex items-center gap-1.5 break-all transition-colors"
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

            {/* Bookmark Button */}
            <button
              onClick={() => onToggleBookmark(item.id)}
              className={`p-1.5 rounded-lg transition-colors ${
                isBookmarked
                  ? 'text-amber-500 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/60'
                  : 'text-slate-400 dark:text-[#8b949e] hover:text-amber-500 dark:hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-[#21262d] border border-transparent hover:border-slate-200 dark:hover:border-[#30363d]'
              }`}
              title={isBookmarked ? '북마크 제거' : '북마크 추가'}
            >
              <Bookmark
                className={`w-4 h-4 ${isBookmarked ? 'fill-amber-500 dark:fill-amber-400' : ''}`}
              />
            </button>
          </div>
        </div>

        {/* Stats & Language Row */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-[#8b949e] mb-4">
          {item.language && (
            <span className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-[#f0f6fc]">
              <span
                className="w-2.5 h-2.5 rounded-full inline-block ring-1 ring-slate-300 dark:ring-slate-700"
                style={{ backgroundColor: langColor }}
              />
              {item.language}
            </span>
          )}

          <span className="flex items-center gap-1 font-medium text-slate-700 dark:text-[#f0f6fc]">
            <Star className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400 fill-amber-500 dark:fill-amber-400" />
            {item.stars.toLocaleString()}
          </span>

          <span className="flex items-center gap-1 font-medium text-slate-500 dark:text-[#8b949e]">
            <GitFork className="w-3.5 h-3.5" />
            {item.forks.toLocaleString()}
          </span>

          {item.starsPeriod > 0 && (
            <span className="flex items-center gap-1 font-semibold text-rose-600 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/70 border border-rose-200 dark:border-rose-900/60 px-2 py-0.5 rounded-full">
              <Flame className="w-3 h-3 fill-rose-500 text-rose-500" />
              +{item.starsPeriod.toLocaleString()} {periodLabel}
            </span>
          )}
        </div>

        {/* AI Summary Highlight Box */}
        <div className="bg-slate-50 dark:bg-[#0d1117] border border-slate-200 dark:border-[#30363d] rounded-xl p-4 mb-3.5 shadow-sm dark:shadow-inner">
          <div className="flex items-center gap-1.5 text-sky-600 dark:text-sky-400 text-xs font-bold mb-2">
            <Sparkles className="w-4 h-4 text-sky-600 dark:text-sky-400" />
            <span>AI 핵심 요약</span>
          </div>
          <p className="text-sm font-semibold text-slate-800 dark:text-[#f0f6fc] leading-relaxed mb-3">
            {item.summaryKo}
          </p>

          {item.keyFeaturesKo && item.keyFeaturesKo.length > 0 && (
            <ul className="space-y-1.5 pt-2 border-t border-slate-200 dark:border-[#30363d]">
              {item.keyFeaturesKo.map((feat, idx) => (
                <li
                  key={idx}
                  className="text-xs text-slate-600 dark:text-[#c9d1d9] flex items-start gap-2 leading-snug"
                >
                  <span className="text-sky-600 dark:text-sky-400 font-bold mt-0.5">•</span>
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Tags */}
        {item.tags && item.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {item.tags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => onTagClick?.(tag)}
                className="text-[11px] font-medium px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-[#21262d] border border-slate-200 dark:border-[#30363d] text-slate-600 dark:text-[#c9d1d9] hover:bg-slate-200 dark:hover:bg-[#30363d] hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-[#8b949e] transition-all"
              >
                #{tag}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Footer / Original Description Collapse */}
      <div className="pt-2 border-t border-slate-200 dark:border-[#30363d]">
        <button
          onClick={() => setShowOriginal(!showOriginal)}
          className="text-[11px] text-slate-500 dark:text-[#8b949e] hover:text-slate-800 dark:hover:text-[#f0f6fc] flex items-center gap-1 transition-colors font-medium"
        >
          <span>원문 설명 {showOriginal ? '접기' : '보기'}</span>
          {showOriginal ? (
            <ChevronUp className="w-3 h-3" />
          ) : (
            <ChevronDown className="w-3 h-3" />
          )}
        </button>
        {showOriginal && (
          <p className="mt-1.5 text-xs text-slate-600 dark:text-[#8b949e] italic bg-slate-50 dark:bg-[#0d1117] border border-slate-200 dark:border-[#30363d] p-2.5 rounded-lg leading-relaxed">
            {item.description}
          </p>
        )}
      </div>
    </article>
  );
}
