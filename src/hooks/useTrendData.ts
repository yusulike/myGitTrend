import { useState, useEffect, useCallback } from 'react';
import { TrendSnapshot } from '../types/trend';

export function useTrendData(selectedDate?: string) {
  const [data, setData] = useState<TrendSnapshot | null>(null);
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Load available archive dates
  useEffect(() => {
    let isMounted = true;
    const fetchDates = async () => {
      try {
        const basePath = import.meta.env.BASE_URL.replace(/\/$/, '');
        const res = await fetch(`${basePath}/data/archive-index.json`);
        if (res.ok) {
          const dates: string[] = await res.json();
          if (isMounted) setAvailableDates(dates);
        }
      } catch (e) {
        console.warn('Failed to load archive-index.json:', e);
      }
    };
    fetchDates();
    return () => {
      isMounted = false;
    };
  }, []);

  const loadData = useCallback(async (date?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const basePath = import.meta.env.BASE_URL.replace(/\/$/, '');
      const url = date
        ? `${basePath}/data/archives/${date}.json`
        : `${basePath}/data/latest.json`;

      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`데이터를 불러오지 못했습니다. (HTTP ${res.status})`);
      }
      const json: TrendSnapshot = await res.json();
      setData(json);
    } catch (err: any) {
      console.error('Error fetching trend data:', err);
      setError(err?.message || '트렌드 데이터를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData(selectedDate);
  }, [selectedDate, loadData]);

  return {
    data,
    availableDates,
    isLoading,
    error,
    reload: () => loadData(selectedDate),
  };
}
