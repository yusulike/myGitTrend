import { History } from 'lucide-react';

interface DateSelectorProps {
  availableDates: string[];
  selectedDate: string;
  onSelectDate: (date: string) => void;
}

export function DateSelector({
  availableDates,
  selectedDate,
  onSelectDate,
}: DateSelectorProps) {
  if (availableDates.length <= 1 && !selectedDate) {
    return null;
  }

  return (
    <div className="relative inline-flex items-center">
      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-700 dark:text-slate-300">
        <History className="w-3.5 h-3.5 text-brand-500" />
        <select
          value={selectedDate}
          onChange={(e) => onSelectDate(e.target.value)}
          aria-label="아카이브 날짜 선택"
          className="bg-transparent font-medium focus:outline-none cursor-pointer pr-1"
        >
          <option value="" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
            ⚡ 최신 트렌드
          </option>
          {availableDates.map((d) => (
            <option key={d} value={d} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
              📅 {d}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
