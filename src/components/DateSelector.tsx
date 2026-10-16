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
  if (availableDates.length === 0 && !selectedDate) {
    return null;
  }

  return (
    <div className="relative inline-flex items-center">
      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-[#21262d] border border-slate-200 dark:border-[#30363d] rounded-xl text-xs text-slate-700 dark:text-[#f0f6fc]">
        <History className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
        <select
          value={selectedDate}
          onChange={(e) => onSelectDate(e.target.value)}
          aria-label="아카이브 날짜 선택"
          className="bg-transparent font-medium focus:outline-none cursor-pointer pr-1 text-slate-700 dark:text-[#f0f6fc]"
        >
          <option value="" className="bg-white dark:bg-[#161b22] text-slate-800 dark:text-[#f0f6fc]">
            ⚡ 최신 트렌드
          </option>
          {availableDates.map((d) => (
            <option key={d} value={d} className="bg-white dark:bg-[#161b22] text-slate-800 dark:text-[#f0f6fc]">
              📅 {d}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
