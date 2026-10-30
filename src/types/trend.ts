export type Period = 'daily' | 'weekly' | 'monthly';

export interface TrendItem {
  id: string;                      // "owner/repo"
  owner: string;                   // "facebook"
  repo: string;                    // "react"
  url: string;                     // "https://github.com/facebook/react"
  description: string;             // Original English description
  language: string;                // Primary language, e.g. "TypeScript"
  stars: number;                   // Total stars count
  forks: number;                   // Total forks count
  starsPeriod: number;             // Stars earned during selected period
  since: Period;

  // AI-generated fields
  summaryKo: string;               // Concise Korean 1~2 sentence summary
  keyFeaturesKo: string[];         // 3~4 key bullet points in Korean
  tags: string[];                  // Category tags (e.g. ["Frontend", "UI", "React"])
}

export interface TrendSnapshot {
  date: string;                    // "YYYY-MM-DD"
  collectedAt: string;             // ISO timestamp
  languages: string[];             // List of languages present in this snapshot
  items: TrendItem[];
}

export type SortOption = 'starsPeriod' | 'starsTotal' | 'name';
export type SearchScope = 'current' | 'all';

export interface FilterState {
  search: string;
  selectedPeriod: Period;
  selectedLanguage: string;
  sortBy: SortOption;
  onlyBookmarks: boolean;
  searchScope: SearchScope;
}

export function isValidTrendItem(item: any): item is TrendItem {
  if (!item || typeof item !== 'object') return false;
  return (
    typeof item.id === 'string' &&
    typeof item.owner === 'string' &&
    typeof item.repo === 'string' &&
    typeof item.url === 'string' &&
    typeof item.description === 'string' &&
    typeof item.language === 'string' &&
    typeof item.stars === 'number' &&
    typeof item.forks === 'number' &&
    typeof item.starsPeriod === 'number' &&
    (item.since === 'daily' || item.since === 'weekly' || item.since === 'monthly') &&
    typeof item.summaryKo === 'string' &&
    Array.isArray(item.keyFeaturesKo) &&
    Array.isArray(item.tags)
  );
}

export interface GlobalSearchIndexItem {
  id: string;                      // "owner/repo"
  owner: string;
  repo: string;
  url: string;
  description: string;
  language: string;
  stars: number;
  forks: number;
  summaryKo: string;
  tags: string[];
  appearedDates: string[];         // ["2026-10-28", "2026-10-20"]
  lastAppeared: string;            // "2026-10-28"
  maxStarsPeriod: number;          // 최고 급상승 폭
}

export function createDefaultFilterState(): FilterState {
  return {
    search: '',
    selectedPeriod: 'daily',
    selectedLanguage: 'All',
    sortBy: 'starsPeriod',
    onlyBookmarks: false,
    searchScope: 'current',
  };
}
