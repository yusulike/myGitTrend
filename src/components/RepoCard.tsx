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
  Crown,
  FileText,
} from 'lucide-react';

interface RepoCardProps {
  item: TrendItem;
  isBookmarked: boolean;
  onToggleBookmark: (id: string) => void;
  onTagClick?: (tag: string) => void;
  onOpenReport?: (item: TrendItem) => void;
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

export function RepoCard({
  item,
  isBookmarked,
  onToggleBookmark,
  onTagClick,
  onOpenReport,
  rank,
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

  const cardId = `repo-card-${item.id.replace(/[/.]/g, '-')}`;

  return (
    <article
      id={cardId}
      className="group bg-white dark:bg-[#161b22] border-2 border-slate-300 dark:border-slate-700 hover:border-sky-500 dark:hover:border-sky-400 rounded-2xl p-5 shadow-md hover:shadow-xl dark:shadow-black/50 transition-all flex flex-col justify-between scroll-mt-24"
    >
      <div>
        <div className="flex items-start justify-between gap-3 mb-2.5">
          <div className="min-w-0 flex-1 flex items-center gap-2 flex-wrap">
            {rank === 1 && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-black bg-amber-400/20 text-amber-600 dark:text-amber-300 border-2 border-amber-400/60 shrink-0 shadow-sm">
                <Crown className="w-3.5 h-3.5 text-amber-500 fill-amber-400 shrink-0" />
                <span>1위</span>
              </span>
            )}
            {rank === 2 && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-black bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-100 border-2 border-slate-400 dark:border-slate-500 shrink-0 shadow-sm">
                <Crown className="w-3.5 h-3.5 text-slate-400 dark:text-slate-300 fill-slate-300 dark:fill-slate-500 shrink-0" />
                <span>2위</span>
              </span>
            )}
            {rank === 3 && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-black bg-orange-400/20 text-orange-700 dark:text-orange-300 border-2 border-orange-400/60 shrink-0 shadow-sm">
                <Crown className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400 fill-orange-500/80 shrink-0" />
                <span>3위</span>
              </span>
            )}

            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 inline-flex items-center gap-1.5 break-all transition-colors"
            >
              <span className="text-slate-400 dark:text-slate-500 font-medium">{item.owner} /</span>
              <span>{item.repo}</span>
              <ExternalLink className="w-3.5 h-3.5 text-sky-500 shrink-0" />
            </a>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={handleCopyClone}
              className="p-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors"
              title="git clone 명령어 복사"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            </button>
            <button
              onClick={() => onToggleBookmark(item.id)}
              className={`p-1.5 rounded-lg transition-colors border ${
                isBookmarked
                  ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/60 border-amber-300 dark:border-amber-700'
                  : 'text-slate-400 hover:text-amber-500 hover:bg-slate-100 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-700'
              }`}
              title={isBookmarked ? '북마크 제거' : '북마크 추가'}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-500' : ''}`} />
            </button>
          </div>
        </div>

        {/* Stats Row with bold badges */}
        <div className="flex flex-wrap items-center gap-2.5 text-xs mb-4">
          {item.language && (
            <span className="flex items-center gap-1.5 font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100">
              <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: langColor }} />
              {item.language}
            </span>
          )}
          <span className="flex items-center gap-1 font-bold px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-amber-700 dark:text-amber-300">
            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            {item.stars.toLocaleString()}
          </span>
          <span className="flex items-center gap-1 font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
            <GitFork className="w-3.5 h-3.5" />
            {item.forks.toLocaleString()}
          </span>
          {item.starsPeriod > 0 && (
            <span className="flex items-center gap-1 font-bold text-rose-700 dark:text-rose-200 bg-rose-100 dark:bg-rose-950/80 border border-rose-300 dark:border-rose-800 px-2.5 py-0.5 rounded-full shadow-xs">
              <Flame className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
              +{item.starsPeriod.toLocaleString()} {periodLabel}
            </span>
          )}
        </div>

        {/* AI Summary Box with Left Accent Strip */}
        <div className="border-l-4 border-l-sky-500 bg-sky-50/80 dark:bg-sky-950/30 border-y border-r border-slate-200 dark:border-slate-800 rounded-r-xl rounded-l-none p-4 mb-3.5 shadow-sm">
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-1.5 text-sky-700 dark:text-sky-300 text-xs font-black tracking-wide uppercase">
              <Sparkles className="w-4 h-4 text-sky-600 dark:text-sky-400" />
              <span>핵심 요약</span>
            </div>
            {onOpenReport && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenReport(item);
                }}
                className="inline-flex items-center gap-1 px-3 py-1 text-xs font-bold rounded-lg bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white shadow hover:shadow-md transition-all"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>한페이지 정리</span>
              </button>
            )}
          </div>
          <p className="text-sm font-bold text-slate-900 dark:text-white leading-relaxed mb-3">
            {item.summaryKo}
          </p>
          {item.keyFeaturesKo && item.keyFeaturesKo.length > 0 && (
            <ul className="space-y-1.5 pt-2.5 border-t border-sky-200/60 dark:border-sky-800/50">
              {item.keyFeaturesKo.map((feat, idx) => (
                <li key={idx} className="text-xs text-slate-700 dark:text-slate-200 flex items-start gap-2 font-medium">
                  <span className="text-sky-600 dark:text-sky-400 font-black mt-0.5">▶</span>
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
                className="text-[11px] font-semibold px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-sky-50 dark:hover:bg-sky-950/50 hover:border-sky-400 transition-all"
              >
                #{tag}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setShowOriginal(!showOriginal)}
          className="text-[11px] text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-1 font-semibold"
        >
          <span>원문 설명 {showOriginal ? '접기' : '보기'}</span>
          {showOriginal ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>
        {showOriginal && (
          <p className="mt-1.5 text-xs text-slate-700 dark:text-slate-300 italic bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-2.5 rounded-lg leading-relaxed">
            {item.description}
          </p>
        )}
      </div>
    </article>
  );
}
