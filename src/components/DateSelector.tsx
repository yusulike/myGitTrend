import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Sparkles,
  Check,
} from 'lucide-react';

export interface DateSelectorProps {
  availableDates: string[];
  selectedDate: string;
  onSelectDate: (date: string) => void;
}

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

const pad2 = (n: number) => String(n).padStart(2, '0');

function parseDateStr(str: string): { year: number; month: number; day: number } | null {
  if (!str) return null;
  const parts = str.split('-').map(Number);
  if (parts.length === 3 && !isNaN(parts[0]) && !isNaN(parts[1]) && !isNaN(parts[2])) {
    return { year: parts[0], month: parts[1] - 1, day: parts[2] };
  }
  return null;
}

function formatDateStr(year: number, month: number, day: number): string {
  return `${year}-${pad2(month + 1)}-${pad2(day)}`;
}

export function DateSelector({
  availableDates,
  selectedDate,
  onSelectDate,
}: DateSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Available dates set for O(1) lookup
  const availableSet = useMemo(() => new Set(availableDates), [availableDates]);

  // Determine initial calendar month view
  const initialView = useMemo(() => {
    if (selectedDate) {
      const parsed = parseDateStr(selectedDate);
      if (parsed) return { year: parsed.year, month: parsed.month };
    }
    if (availableDates.length > 0) {
      // Use the latest available date
      const latest = availableDates[availableDates.length - 1];
      const parsed = parseDateStr(latest);
      if (parsed) return { year: parsed.year, month: parsed.month };
    }
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() };
  }, [selectedDate, availableDates]);

  const [viewYear, setViewYear] = useState(initialView.year);
  const [viewMonth, setViewMonth] = useState(initialView.month);

  // Sync view when selectedDate changes from outside
  useEffect(() => {
    if (selectedDate) {
      const parsed = parseDateStr(selectedDate);
      if (parsed) {
        setViewYear(parsed.year);
        setViewMonth(parsed.month);
      }
    }
  }, [selectedDate]);

  // Close popover when clicking outside or pressing Escape
  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  if (availableDates.length === 0 && !selectedDate) {
    return null;
  }

  // Month navigation handlers
  const handlePrevMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (viewMonth === 0) {
      setViewYear((y) => y - 1);
      setViewMonth(11);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const handleNextMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (viewMonth === 11) {
      setViewYear((y) => y + 1);
      setViewMonth(0);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  const handleSelectDate = (dateStr: string) => {
    onSelectDate(dateStr);
    setIsOpen(false);
  };

  const handleSelectLatest = () => {
    onSelectDate('');
    setIsOpen(false);
  };

  // Generate calendar days grid
  const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay();
  const totalDaysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const totalDaysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate();

  // Selected date formatted for trigger button display
  const triggerLabel = useMemo(() => {
    if (!selectedDate) {
      return '최신 트렌드';
    }
    const parsed = parseDateStr(selectedDate);
    if (!parsed) return selectedDate;
    return `${parsed.year}.${pad2(parsed.month + 1)}.${pad2(parsed.day)}`;
  }, [selectedDate]);

  const todayStr = useMemo(() => {
    const d = new Date();
    return formatDateStr(d.getFullYear(), d.getMonth(), d.getDate());
  }, []);

  return (
    <div className="relative inline-flex items-center" ref={containerRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-label="아카이브 날짜 선택 달력 열기"
        className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 active:scale-[0.98] ${
          isOpen
            ? 'bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 border-sky-300 dark:border-sky-800 shadow-sm'
            : selectedDate
            ? 'bg-sky-50 dark:bg-[#161b22] text-sky-600 dark:text-sky-400 border-sky-200 dark:border-[#30363d]'
            : 'bg-slate-100 hover:bg-slate-200 dark:bg-[#21262d] dark:hover:bg-[#30363d] border-slate-200 dark:border-[#30363d] text-slate-700 dark:text-[#f0f6fc]'
        }`}
      >
        <CalendarIcon className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400 shrink-0" />
        <span className="tabular-nums tracking-tight">{triggerLabel}</span>
        {selectedDate && (
          <span className="w-1.5 h-1.5 rounded-full bg-sky-500 shrink-0" title="과거 특정 일자 조회 중" />
        )}
        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-400 dark:text-[#8b949e] transition-transform duration-150 shrink-0 ${
            isOpen ? 'rotate-180' : 'rotate-0'
          }`}
        />
      </button>

      {/* Calendar Popover */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="날짜 선택 달력"
          className="absolute right-0 top-full mt-2 w-72 sm:w-80 p-4 rounded-2xl bg-white dark:bg-[#161b22] border border-slate-200 dark:border-[#30363d] shadow-xl dark:shadow-2xl dark:shadow-black/70 z-50 animate-in fade-in zoom-in-95 duration-100"
        >
          {/* Quick Select: Latest Trend */}
          <div className="mb-3 pb-3 border-b border-slate-200 dark:border-[#30363d] flex items-center justify-between gap-2">
            <span className="text-xs font-semibold text-slate-700 dark:text-[#f0f6fc]">
              아카이브 날짜
            </span>
            <button
              type="button"
              onClick={handleSelectLatest}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 ${
                !selectedDate
                  ? 'bg-sky-500 text-white shadow-sm shadow-sky-500/20'
                  : 'bg-slate-100 dark:bg-[#21262d] text-slate-700 dark:text-[#c9d1d9] hover:bg-slate-200 dark:hover:bg-[#30363d]'
              }`}
            >
              <Sparkles className="w-3 h-3 text-current" />
              <span>실시간 최신</span>
              {!selectedDate && <Check className="w-3 h-3 text-white ml-0.5" />}
            </button>
          </div>

          {/* Month Header & Controls */}
          <div className="flex items-center justify-between mb-3 px-1">
            <h3 className="text-sm font-bold text-slate-900 dark:text-[#f0f6fc] tracking-tight">
              {viewYear}년 {viewMonth + 1}월
            </h3>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handlePrevMonth}
                aria-label="이전 달"
                className="p-1 rounded-lg text-slate-500 dark:text-[#8b949e] hover:text-slate-900 dark:hover:text-[#f0f6fc] hover:bg-slate-100 dark:hover:bg-[#21262d] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleNextMonth}
                aria-label="다음 달"
                className="p-1 rounded-lg text-slate-500 dark:text-[#8b949e] hover:text-slate-900 dark:hover:text-[#f0f6fc] hover:bg-slate-100 dark:hover:bg-[#21262d] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Weekdays Row */}
          <div className="grid grid-cols-7 gap-1 text-center mb-1.5">
            {WEEKDAYS.map((day, idx) => (
              <span
                key={day}
                className={`text-[11px] font-semibold ${
                  idx === 0
                    ? 'text-rose-500/80 dark:text-rose-400/80'
                    : idx === 6
                    ? 'text-sky-600/80 dark:text-sky-400/80'
                    : 'text-slate-400 dark:text-[#8b949e]'
                }`}
              >
                {day}
              </span>
            ))}
          </div>

          {/* Calendar Days Grid */}
          <div className="grid grid-cols-7 gap-1 text-center">
            {/* Days from previous month */}
            {Array.from({ length: firstDayOfWeek }).map((_, idx) => {
              const dayNum = totalDaysInPrevMonth - firstDayOfWeek + idx + 1;
              return (
                <div
                  key={`prev-${idx}`}
                  className="h-8 flex items-center justify-center text-xs text-slate-300 dark:text-[#484f58] select-none"
                >
                  {dayNum}
                </div>
              );
            })}

            {/* Days in current month */}
            {Array.from({ length: totalDaysInMonth }).map((_, idx) => {
              const day = idx + 1;
              const dateStr = formatDateStr(viewYear, viewMonth, day);
              const isAvailable = availableSet.has(dateStr);
              const isSelected = selectedDate === dateStr;
              const isToday = todayStr === dateStr;

              if (!isAvailable) {
                return (
                  <div
                    key={dateStr}
                    aria-disabled="true"
                    title="수집된 트렌드 데이터가 없는 날짜입니다"
                    className="h-8 flex flex-col items-center justify-center text-xs text-slate-300 dark:text-[#484f58] rounded-lg select-none cursor-not-allowed"
                  >
                    <span>{day}</span>
                  </div>
                );
              }

              return (
                <button
                  key={dateStr}
                  type="button"
                  onClick={() => handleSelectDate(dateStr)}
                  title={`${dateStr} 트렌드 보기`}
                  className={`relative h-8 flex flex-col items-center justify-center rounded-lg text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 active:scale-95 ${
                    isSelected
                      ? 'bg-sky-500 text-white font-bold shadow-sm shadow-sky-500/30'
                      : 'text-slate-800 dark:text-[#f0f6fc] hover:bg-sky-50 dark:hover:bg-sky-950/50 hover:text-sky-600 dark:hover:text-sky-400'
                  } ${isToday && !isSelected ? 'ring-1 ring-sky-500/50' : ''}`}
                >
                  <span>{day}</span>
                  {/* Indicator dot showing recorded archive data */}
                  <span
                    className={`absolute bottom-1 w-1 h-1 rounded-full ${
                      isSelected
                        ? 'bg-white'
                        : 'bg-sky-500 dark:bg-sky-400'
                    }`}
                  />
                </button>
              );
            })}
          </div>

          {/* Footer note */}
          <div className="mt-3 pt-2.5 border-t border-slate-200 dark:border-[#30363d] flex items-center justify-between text-[11px] text-slate-500 dark:text-[#8b949e]">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-500 shrink-0" />
              <span>수집 데이터 보유일</span>
            </span>
            <span className="tabular-nums font-semibold text-slate-700 dark:text-[#c9d1d9]">
              총 {availableDates.length}개 보관 중
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
