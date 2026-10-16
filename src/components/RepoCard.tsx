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
    <article className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 hover:border-brand-500/50 dark:hover:border-brand-500/50 hover:shadow-xl hover:shadow-brand-500/5 transition-all flex flex-col justify-between">
      <div>
        {/* Header row: Owner/Repo + Quick Actions */}
        <div className="flex items-start justify-between gap-3 mb-2.5">
          <div className="min-w-0 flex-1">
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group-hover:text-brand-600 dark:group-hover:text-brand-400 font-bold text-base sm:text-lg text-slate-900 dark:text-slate-100 flex items-center gap-1.5 break-all transition-colors"
            >
              <span className="text-slate-400 dark:text-slate-500 font-normal">
                {item.owner} /
              </span>
              <span>{item.repo}</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
            </a>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {/* Clone URL Copy */}
            <button
              onClick={handleCopyClone}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="git clone 명령어 복사"
            >
              {copied ? (
                <Check className="w-4 h-4 text-emerald-500" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>

            {/* Bookmark Button */}
            <button
              onClick={() => onToggleBookmark(item.id)}
              className={`p-1.5 rounded-lg transition-colors ${
                isBookmarked
                  ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/40'
                  : 'text-slate-400 hover:text-amber-500 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
              title={isBookmarked ? '북마크 제거' : '북마크 추가'}
            >
              <Bookmark
                className={`w-4 h-4 ${isBookmarked ? 'fill-amber-500' : ''}`}
              />
            </button>
          </div>
        </div>

        {/* Stats & Language Row */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mb-4">
          {item.language && (
            <span className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300">
              <span
                className="w-2.5 h-2.5 rounded-full inline-block"
                style={{ backgroundColor: langColor }}
              />
              {item.language}
            </span>
          )}

          <span className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            {item.stars.toLocaleString()}
          </span>

          <span className="flex items-center gap-1">
            <GitFork className="w-3.5 h-3.5" />
            {item.forks.toLocaleString()}
          </span>

          {item.starsPeriod > 0 && (
            <span className="flex items-center gap-1 font-semibold text-rose-500 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50 px-2 py-0.5 rounded-full">
              <Flame className="w-3 h-3 fill-rose-500" />
              +{item.starsPeriod.toLocaleString()} {periodLabel}
            </span>
          )}
        </div>

        {/* AI Summary Highlight Box */}
        <div className="bg-gradient-to-br from-brand-50/60 to-sky-50/40 dark:from-brand-950/30 dark:to-slate-900/40 border border-brand-100 dark:border-brand-900/50 rounded-xl p-3.5 mb-3.5">
          <div className="flex items-center gap-1.5 text-brand-700 dark:text-brand-300 text-xs font-bold mb-1.5">
            <Sparkles className="w-3.5 h-3.5 text-brand-500" />
            <span>AI 핵심 요약</span>
          </div>
          <p className="text-sm font-medium text-slate-800 dark:text-slate-200 leading-relaxed mb-2.5">
            {item.summaryKo}
          </p>

          {item.keyFeaturesKo && item.keyFeaturesKo.length > 0 && (
            <ul className="space-y-1 pt-1 border-t border-brand-100/70 dark:border-brand-900/40">
              {item.keyFeaturesKo.map((feat, idx) => (
                <li
                  key={idx}
                  className="text-xs text-slate-600 dark:text-slate-300 flex items-start gap-1.5"
                >
                  <span className="text-brand-500 font-bold mt-0.5">•</span>
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
                className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-brand-50 dark:hover:bg-brand-950 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
              >
                #{tag}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Footer / Original Description Collapse */}
      <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80">
        <button
          onClick={() => setShowOriginal(!showOriginal)}
          className="text-[11px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 flex items-center gap-1 transition-colors"
        >
          <span>원문 설명 {showOriginal ? '접기' : '보기'}</span>
          {showOriginal ? (
            <ChevronUp className="w-3 h-3" />
          ) : (
            <ChevronDown className="w-3 h-3" />
          )}
        </button>
        {showOriginal && (
          <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 italic bg-slate-50 dark:bg-slate-800/50 p-2 rounded-lg">
            {item.description}
          </p>
        )}
      </div>
    </article>
  );
}
