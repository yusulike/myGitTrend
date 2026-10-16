import { useEffect } from 'react';
import { TrendItem } from '../types/trend';
import { X, Bookmark, Trash2, ExternalLink, Star } from 'lucide-react';

interface BookmarkDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: TrendItem[];
  onToggleBookmark: (id: string) => void;
  onClearAll: () => void;
}

export function BookmarkDrawer({
  isOpen,
  onClose,
  items,
  onToggleBookmark,
  onClearAll,
}: BookmarkDrawerProps) {
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-[#161b22] shadow-2xl flex flex-col border-l border-slate-200 dark:border-[#30363d]">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-[#30363d] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/60 flex items-center justify-center text-amber-500 dark:text-amber-400">
                <Bookmark className="w-4 h-4 fill-amber-500 dark:fill-amber-400" />
              </div>
              <h2 className="text-base font-bold text-slate-900 dark:text-[#f0f6fc]">
                저장한 레포지토리 ({items.length})
              </h2>
            </div>
            <div className="flex items-center gap-1">
              {items.length > 0 && (
                <button
                  onClick={onClearAll}
                  className="p-1.5 text-slate-400 dark:text-[#8b949e] hover:text-rose-500 dark:hover:text-rose-400 rounded-lg hover:bg-slate-100 dark:hover:bg-[#21262d] transition-colors"
                  title="모두 삭제"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={onClose}
                className="p-1.5 text-slate-400 dark:text-[#8b949e] hover:text-slate-700 dark:hover:text-[#f0f6fc] rounded-lg hover:bg-slate-100 dark:hover:bg-[#21262d] transition-colors"
                title="닫기"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-16 text-slate-400 dark:text-[#8b949e]">
                <Bookmark className="w-10 h-10 mb-2 stroke-1 text-slate-300 dark:text-[#484f58]" />
                <p className="text-sm font-medium text-slate-700 dark:text-[#c9d1d9]">
                  아직 북마크한 레포지토리가 없습니다
                </p>
                <p className="text-xs text-slate-500 dark:text-[#8b949e] mt-1 max-w-xs">
                  마음에 드는 프로젝트의 북마크 아이콘을 눌러 저장해보세요.
                </p>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-xl border border-slate-200 dark:border-[#30363d] bg-slate-50 dark:bg-[#0d1117] hover:border-slate-300 dark:hover:border-[#8b949e] transition-all flex items-start justify-between gap-3 group"
                >
                  <div className="min-w-0 flex-1">
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-bold text-slate-900 dark:text-[#f0f6fc] hover:text-sky-600 dark:hover:text-[#58a6ff] flex items-center gap-1.5 break-all"
                    >
                      <span>{item.id}</span>
                      <ExternalLink className="w-3 h-3 text-slate-400 dark:text-[#8b949e] opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                    <p className="text-xs font-medium text-slate-600 dark:text-[#c9d1d9] mt-1 line-clamp-2">
                      {item.summaryKo}
                    </p>
                    <div className="flex items-center gap-2 mt-2 text-[11px] text-slate-500 dark:text-[#8b949e]">
                      <span className="font-semibold text-slate-700 dark:text-[#f0f6fc]">
                        {item.language}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-0.5 font-medium text-slate-600 dark:text-[#c9d1d9]">
                        <Star className="w-3 h-3 text-amber-500 dark:text-amber-400 fill-amber-500 dark:fill-amber-400" />
                        {item.stars.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => onToggleBookmark(item.id)}
                    className="p-1 text-slate-400 dark:text-[#8b949e] hover:text-rose-500 dark:hover:text-rose-400 transition-colors shrink-0"
                    title="북마크 해제"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
