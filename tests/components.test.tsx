import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { SearchInput } from '../src/components/SearchInput';
import { FilterBar } from '../src/components/FilterBar';
import { createDefaultFilterState } from '../src/types/trend';

describe('Filter & Search Components', () => {
  it('renders SearchInput and calls onChange when typing', () => {
    const handleChange = vi.fn();
    render(<SearchInput value="react" onChange={handleChange} />);

    const input = screen.getByPlaceholderText(/검색/i) as HTMLInputElement;
    expect(input.value).toBe('react');

    fireEvent.change(input, { target: { value: 'vue' } });
    expect(handleChange).toHaveBeenCalledWith('vue');
  });

  it('renders FilterBar with period tabs and triggers period change', () => {
    const handleFilterChange = vi.fn();
    const filter = createDefaultFilterState();
    const languages = ['All', 'TypeScript', 'Rust', 'Python'];

    render(
      <FilterBar
        filter={filter}
        languages={languages}
        onFilterChange={handleFilterChange}
        totalCount={20}
        filteredCount={15}
      />
    );

    // Click Weekly tab
    const weeklyTab = screen.getByText('이번 주');
    fireEvent.click(weeklyTab);

    expect(handleFilterChange).toHaveBeenCalledWith(
      expect.objectContaining({ selectedPeriod: 'weekly' })
    );

    // Click Rust language chip
    const rustChip = screen.getByText('Rust');
    fireEvent.click(rustChip);

    expect(handleFilterChange).toHaveBeenCalledWith(
      expect.objectContaining({ selectedLanguage: 'Rust' })
    );
  });
});
