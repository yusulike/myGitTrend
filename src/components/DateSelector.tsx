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
      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#21262d] border border-[#30363d] rounded-xl text-xs text-[#f0f6fc]">
        <History className="w-3.5 h-3.5 text-sky-400" />
        <select
          value={selectedDate}
          onChange={(e) => onSelectDate(e.target.value)}
          aria-label="아카이브 날짜 선택"
          className="bg-transparent font-medium focus:outline-none cursor-pointer pr-1 text-[#f0f6fc]"
        >
          <option value="" className="bg-[#161b22] text-[#f0f6fc]">
            ⚡ 최신 트렌드
          </option>
          {availableDates.map((d) => (
            <option key={d} value={d} className="bg-[#161b22] text-[#f0f6fc]">
              📅 {d}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
