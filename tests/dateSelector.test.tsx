import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DateSelector } from '../src/components/DateSelector';

describe('DateSelector Calendar Component', () => {
  const mockDates = ['2026-10-15', '2026-10-16', '2026-10-28'];

  it('renders trigger button with latest trend status when selectedDate is empty', () => {
    const handleSelect = vi.fn();
    render(
      <DateSelector
        availableDates={mockDates}
        selectedDate=""
        onSelectDate={handleSelect}
      />
    );

    expect(screen.getByText('최신 트렌드')).toBeDefined();
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('renders trigger button with formatted date when selectedDate is set', () => {
    render(
      <DateSelector
        availableDates={mockDates}
        selectedDate="2026-10-16"
        onSelectDate={() => {}}
      />
    );

    expect(screen.getByText('2026.10.16')).toBeDefined();
  });

  it('opens calendar popover when trigger button is clicked', () => {
    render(
      <DateSelector
        availableDates={mockDates}
        selectedDate=""
        onSelectDate={() => {}}
      />
    );

    const trigger = screen.getByRole('button', { name: /아카이브 날짜 선택 달력 열기/i });
    fireEvent.click(trigger);

    expect(screen.getByRole('dialog', { name: /날짜 선택 달력/i })).toBeDefined();
    expect(screen.getByText(/2026년 10월/i)).toBeDefined();
    expect(screen.getByText('수집 데이터 보유일')).toBeDefined();
    expect(screen.getByText(/총 3개 보관 중/i)).toBeDefined();
  });

  it('selects an available date when clicked and triggers onSelectDate', () => {
    const handleSelect = vi.fn();
    render(
      <DateSelector
        availableDates={mockDates}
        selectedDate=""
        onSelectDate={handleSelect}
      />
    );

    // Open popover
    fireEvent.click(screen.getByRole('button', { name: /아카이브 날짜 선택 달력 열기/i }));

    // Click available date button (e.g. 2026-10-16)
    const dayBtn = screen.getByTitle('2026-10-16 트렌드 보기');
    fireEvent.click(dayBtn);

    expect(handleSelect).toHaveBeenCalledWith('2026-10-16');
    // Popover should close
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('allows clicking "실시간 최신" to reset to latest trend', () => {
    const handleSelect = vi.fn();
    render(
      <DateSelector
        availableDates={mockDates}
        selectedDate="2026-10-16"
        onSelectDate={handleSelect}
      />
    );

    // Open popover
    fireEvent.click(screen.getByRole('button', { name: /아카이브 날짜 선택 달력 열기/i }));

    // Click "실시간 최신" button
    const latestBtn = screen.getByText('실시간 최신');
    fireEvent.click(latestBtn);

    expect(handleSelect).toHaveBeenCalledWith('');
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('closes on Escape key press', () => {
    render(
      <DateSelector
        availableDates={mockDates}
        selectedDate=""
        onSelectDate={() => {}}
      />
    );

    // Open popover
    fireEvent.click(screen.getByRole('button', { name: /아카이브 날짜 선택 달력 열기/i }));
    expect(screen.getByRole('dialog')).toBeDefined();

    // Press Escape
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('navigates previous and next months', () => {
    render(
      <DateSelector
        availableDates={['2026-10-16']}
        selectedDate="2026-10-16"
        onSelectDate={() => {}}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /아카이브 날짜 선택 달력 열기/i }));
    expect(screen.getByText(/2026년 10월/i)).toBeDefined();

    // Next month
    fireEvent.click(screen.getByLabelText('다음 달'));
    expect(screen.getByText(/2026년 11월/i)).toBeDefined();

    // Previous month (back to Oct)
    fireEvent.click(screen.getByLabelText('이전 달'));
    expect(screen.getByText(/2026년 10월/i)).toBeDefined();

    // Previous month (to Sep)
    fireEvent.click(screen.getByLabelText('이전 달'));
    expect(screen.getByText(/2026년 9월/i)).toBeDefined();
  });

  it('safely handles transition from empty availableDates to populated dates without hook errors', () => {
    const { rerender } = render(
      <DateSelector
        availableDates={[]}
        selectedDate=""
        onSelectDate={() => {}}
      />
    );

    // Initial render with empty dates should return null
    expect(screen.queryByRole('button')).toBeNull();

    // Rerender when data arrives (previously threw React Error #310)
    rerender(
      <DateSelector
        availableDates={['2026-10-16']}
        selectedDate=""
        onSelectDate={() => {}}
      />
    );

    // Trigger button should now render cleanly without React hook order error
    expect(screen.getByText('최신 트렌드')).toBeDefined();
  });
});
