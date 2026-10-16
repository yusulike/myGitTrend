import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useBookmarks } from '../src/hooks/useBookmarks';
import { useDarkMode } from '../src/hooks/useDarkMode';

describe('Custom Hooks', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark');
  });

  describe('useBookmarks', () => {
    it('initializes with empty bookmarks or loads from localStorage', () => {
      localStorage.setItem('mgt_bookmarks', JSON.stringify(['facebook/react']));
      const { result } = renderHook(() => useBookmarks());

      expect(result.current.bookmarks).toEqual(['facebook/react']);
      expect(result.current.isBookmarked('facebook/react')).toBe(true);
      expect(result.current.isBookmarked('vuejs/core')).toBe(false);
    });

    it('toggles bookmarks and persists to localStorage', () => {
      const { result } = renderHook(() => useBookmarks());

      act(() => {
        result.current.toggleBookmark('vercel/next.js');
      });

      expect(result.current.isBookmarked('vercel/next.js')).toBe(true);
      expect(JSON.parse(localStorage.getItem('mgt_bookmarks') || '[]')).toEqual(['vercel/next.js']);

      act(() => {
        result.current.toggleBookmark('vercel/next.js');
      });

      expect(result.current.isBookmarked('vercel/next.js')).toBe(false);
      expect(JSON.parse(localStorage.getItem('mgt_bookmarks') || '[]')).toEqual([]);
    });
  });

  describe('useDarkMode', () => {
    it('toggles dark mode class on document element and stores in localStorage', () => {
      const { result } = renderHook(() => useDarkMode());
      const initial = result.current.isDark;

      act(() => {
        result.current.toggleDarkMode();
      });

      expect(result.current.isDark).toBe(!initial);
      if (!initial) {
        expect(document.documentElement.classList.contains('dark')).toBe(true);
        expect(localStorage.getItem('mgt_theme')).toBe('dark');
      } else {
        expect(document.documentElement.classList.contains('dark')).toBe(false);
        expect(localStorage.getItem('mgt_theme')).toBe('light');
      }
    });
  });
});
