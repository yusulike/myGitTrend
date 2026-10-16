# mgt (myGitTrend) System Design Specification

- **Date**: 2026-10-17
- **Project Name**: mgt (myGitTrend)
- **Status**: Approved

## 1. Overview & Objective
`mgt (myGitTrend)` is a serverless web dashboard that curates and summarizes GitHub Trending repositories. It runs an automated daily collection and AI summarization pipeline (via Google Gemini API), outputting static JSON files that are consumed by a lightning-fast, zero-maintenance Vite + React frontend hosted on GitHub Pages / Vercel.

### Key Goals
- **Zero Running Cost**: Complete serverless architecture utilizing GitHub Actions (free tier cron), Gemini Flash API (generous free tier), and GitHub Pages / static hosting.
- **AI-Powered Insights**: Repositories are summarized in concise Korean (one-line summary, 3~4 key feature bullet points, category tags) to allow instant skimming.
- **Rich User Experience**:
  - Filtering by period (Daily, Weekly, Monthly) and programming languages.
  - Interactive keyword search across repository names, owners, descriptions, and AI tags.
  - Browser local bookmarking (saved to LocalStorage).
  - Quick action buttons (copy `git clone` command, open repo).
  - Date archive explorer to browse past trends.
  - Dark mode and light mode support with system preference sync.

---

## 2. System Architecture

```
                  ┌───────────────────────────────┐
                  │    GitHub Trending Web Page   │
                  └──────────────┬────────────────┘
                                 │ Scrapes HTML via Cheerio
                                 ▼
                  ┌───────────────────────────────┐
                  │    Node.js Collector Script   │
                  │     (scripts/collector.ts)    │
                  └──────────────┬────────────────┘
                                 │
           ┌─────────────────────┴─────────────────────┐
           │ Calls Gemini 2.5 Flash API                │
           ▼                                           │
  ┌─────────────────┐                                  │
  │ Google Gemini   │ (Korean summary, bullets, tags)  │
  └────────┬────────┘                                  │
           │                                           │
           └─────────────────────┬─────────────────────┘
                                 ▼
                  ┌───────────────────────────────┐
                  │   Static JSON Data Storage    │
                  │   - public/data/latest.json   │
                  │   - public/data/archives/...  │
                  │   - public/data/index.json    │
                  └──────────────┬────────────────┘
                                 │ Fetched by browser
                                 ▼
                  ┌───────────────────────────────┐
                  │   Vite + React SPA Frontend   │
                  │   (Tailwind CSS + Lucide)     │
                  └───────────────────────────────┘
```

---

## 3. Data Specification & Storage Layout

### 3.1 Directory Layout
```
public/
└── data/
    ├── latest.json              # Latest daily, weekly, monthly trends snapshot
    ├── archive-index.json       # Array of available dates: ["2026-10-17", ...]
    └── archives/
        └── 2026-10-17.json      # Snapshot for specific date
```

### 3.2 Data Models (`src/types/trend.ts`)
```typescript
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
  since: 'daily' | 'weekly' | 'monthly';

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
```

---

## 4. Collector Pipeline (`scripts/collector.ts`)

1. **HTML Scraping**:
   - Fetches `https://github.com/trending`, `https://github.com/trending?since=weekly`, `https://github.com/trending?since=monthly`.
   - Parses repository items using `cheerio`: extracts owner, repo, description, language, total stars, forks, and stars earned in period.
2. **AI Summarization (Gemini API)**:
   - Uses `@google/genai` or `@google/generative-ai` with model `gemini-2.5-flash` (or `gemini-1.5-flash`).
   - Batches requests (or parallel with concurrency limiter e.g. `p-limit`) to respect API rate limits.
   - Prompt instructions: Given repo name and description, output valid JSON containing `summaryKo`, `keyFeaturesKo`, and `tags`.
   - **Graceful Fallback**: If `GEMINI_API_KEY` is absent or quota is exceeded, gracefully fall back to translated/heuristic summaries or original descriptions, ensuring the build never fails.
3. **Data File Persistence**:
   - Writes `public/data/archives/YYYY-MM-DD.json`.
   - Copies/writes `public/data/latest.json`.
   - Updates `public/data/archive-index.json`.

---

## 5. Frontend Architecture (`src/`)

### 5.1 Tech Stack
- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **State Management**: React Hooks + LocalStorage (`useBookmarks`, `useDarkMode`, `useTrendData`)

### 5.2 Component Hierarchy
- `App.tsx`: Main layout, state coordination.
- `components/Header.tsx`: Brand logo, archive date picker, bookmark drawer trigger with badge, dark mode toggle.
- `components/FilterBar.tsx`:
  - Period tabs: Daily, Weekly, Monthly.
  - Language pills: Dynamic list derived from active data + common languages.
  - Sort dropdown: Stars Today (default), Total Stars, Name.
- `components/SearchInput.tsx`: Debounced keyword search input with clear button.
- `components/RepoCard.tsx`:
  - Repository header with owner/repo links and stats.
  - Highlighted AI Korean summary badge and box.
  - Expandable / formatted key feature points.
  - Interactive tags that filter on click.
  - Action buttons: Bookmark toggle, `git clone` command clipboard copy, external GitHub link.
- `components/RepoList.tsx`: Grid layout of repo cards with empty/loading states.
- `components/BookmarkDrawer.tsx`: Off-canvas / modal sheet listing all bookmarked repositories with quick access.
- `components/DateSelector.tsx`: Dropdown/modal to switch between available dates from `archive-index.json`.

---

## 6. GitHub Actions Automation (`.github/workflows/daily-trend.yml`)

- **Schedule**: Runs every day at 00:00 UTC (09:00 KST) via `cron: '0 0 * * *'`.
- **Manual Trigger**: `workflow_dispatch` enabled for on-demand collection.
- **Workflow Steps**:
  1. Checkout repository with full history.
  2. Setup Node.js.
  3. Install dependencies (`npm ci`).
  4. Run collector script (`npm run collect`) with `GEMINI_API_KEY: ${{ secrets.GEMINI_API_KEY }}`.
  5. Commit updated JSON files back to repository.
  6. Build static web application (`npm run build`).
  7. Deploy to GitHub Pages (`actions/deploy-pages`).

---

## 7. Error Handling & Edge Cases
- **No Internet / Scrape Failure**: Collector script retries with exponential backoff; if scraping fails completely, retains existing `latest.json`.
- **No Gemini API Key during local dev**: Collector generates smart heuristic summaries from descriptions so local development works without requiring a paid/personal key.
- **Empty Search / Filter Result**: Friendly UI state with a "Reset Filters" action.
- **LocalStorage Quota / Disabled**: Bookmarks hook wraps Storage API calls with try/catch and falls back to in-memory state.

---

## 8. Verification Plan
1. **Unit / Script Test**: Run collector script locally, inspect generated JSON files in `public/data/` for schema validity.
2. **Build Test**: Run `npm run build` to verify clean TypeScript compilation and Vite static asset generation.
3. **UI & Feature Tests**:
   - Verify Period filtering (daily, weekly, monthly).
   - Verify Language chip filtering.
   - Verify Search filtering (matches repo name, description, tags, summary).
   - Verify Bookmark toggling, persistence across reloads, and Bookmark drawer.
   - Verify Git clone copy to clipboard toast/feedback.
   - Verify Dark / Light mode toggle.
