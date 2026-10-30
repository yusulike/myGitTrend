import { useState, useEffect } from 'react';
import { GlobalSearchIndexItem } from '../types/trend';

export function useGlobalSearch() {
  const [indexData, setIndexData] = useState<GlobalSearchIndexItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchSearchIndex = async () => {
      setIsLoading(true);
      try {
        const basePath = import.meta.env.BASE_URL.replace(/\/$/, '');
        const res = await fetch(`${basePath}/data/search-index.json`);
        if (!res.ok) {
          throw new Error(`Failed to load search index: HTTP ${res.status}`);
        }
        const data: GlobalSearchIndexItem[] = await res.json();
        if (isMounted) {
          setIndexData(data);
        }
      } catch (err: any) {
        console.warn('Failed to fetch search-index.json:', err);
        if (isMounted) {
          setError(err?.message || '검색 인덱스를 불러올 수 없습니다.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchSearchIndex();

    return () => {
      isMounted = false;
    };
  }, []);

  return {
    indexData,
    isLoading,
    error,
    totalIndexedCount: indexData.length,
  };
}
