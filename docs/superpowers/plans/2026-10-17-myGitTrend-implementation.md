# mgt (myGitTrend) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and deploy `mgt (myGitTrend)`, a serverless web dashboard curating and summarizing GitHub Trending repositories in Korean using Gemini AI and GitHub Actions.

**Architecture:** Node.js scraping and AI summarization pipeline outputting static JSON files (`latest.json`, `archives/YYYY-MM-DD.json`), consumed by a responsive Vite + React + Tailwind CSS client-side SPA.

**Tech Stack:** React 19, TypeScript, Vite, Tailwind CSS, Lucide React, Cheerio, Vitest, Google Gen AI SDK.

**Spec:** `docs/superpowers/specs/2026-10-17-myGitTrend-design.md`

## Global Constraints
- Must run as a zero-cost serverless static site deployable to GitHub Pages.
- Collector script must work with or without a `GEMINI_API_KEY` (using heuristic fallback when key is absent).
- Fully responsive UI supporting both Dark Mode and Light Mode.
- All bookmarks persisted to browser `localStorage`.

## Review Focus
- Empty search/filter states: displays clean helper message with a reset button.
- Rate-limiting or network error during scraping: graceful degradation without crashing the build.
- LocalStorage errors: safe try/catch wrapping so private/incognito browsing works.
- Overflowing text in repository description or summary: proper truncation and responsive wrapping.
- Clipboard copy interaction: clear visual feedback (toast or copied icon checkmark).

---

### Task 1: Project Scaffolding & Dependencies

**Files:**
- Create: `package.json`, `tsconfig.json`, `tsconfig.node.json`, `vite.config.ts`, `index.html`, `tailwind.config.js`, `postcss.config.js`, `src/index.css`, `src/main.tsx`

- [ ] **Step 1: Initialize package.json with dependencies**
- [ ] **Step 2: Configure Vite, TypeScript, and Tailwind CSS**
- [ ] **Step 3: Setup index.html, main.tsx, and base styles**
- [ ] **Step 4: Verify build works (`npm run build`)**
- [ ] **Step 5: Commit scaffolding**

---

### Task 2: Data Models & Schema (`src/types/trend.ts`)

**Files:**
- Create: `src/types/trend.ts`
- Test: `tests/types.test.ts`

- [ ] **Step 1: Write type validation test**
- [ ] **Step 2: Define TrendItem, TrendSnapshot, FilterOptions interfaces**
- [ ] **Step 3: Run test and verify passes**
- [ ] **Step 4: Commit types**

---

### Task 3: Collector Script & AI Summarizer (`scripts/collector.ts`)

**Files:**
- Create: `scripts/collector.ts`
- Create: `scripts/mockData.ts` (sample data generator for local development/testing)
- Test: `tests/collector.test.ts`

- [ ] **Step 1: Write unit tests for scraping parser and fallback AI summarizer**
- [ ] **Step 2: Implement cheerio-based GitHub trending parser**
- [ ] **Step 3: Implement Gemini API summarizer with heuristic fallback**
- [ ] **Step 4: Generate sample mock data into `public/data/latest.json`**
- [ ] **Step 5: Verify collector runs and outputs valid JSON**
- [ ] **Step 6: Commit collector module**

---

### Task 4: Custom Hooks (`useTrendData`, `useBookmarks`, `useDarkMode`)

**Files:**
- Create: `src/hooks/useTrendData.ts`
- Create: `src/hooks/useBookmarks.ts`
- Create: `src/hooks/useDarkMode.ts`
- Test: `tests/hooks.test.ts`

- [ ] **Step 1: Write tests for bookmarks storage and dark mode toggle**
- [ ] **Step 2: Implement `useBookmarks` with localStorage sync**
- [ ] **Step 3: Implement `useDarkMode` with html class toggle**
- [ ] **Step 4: Implement `useTrendData` with JSON fetch & caching**
- [ ] **Step 5: Run tests and verify**
- [ ] **Step 6: Commit hooks**

---

### Task 5: Navigation, Header & Filter Components

**Files:**
- Create: `src/components/Header.tsx`
- Create: `src/components/FilterBar.tsx`
- Create: `src/components/SearchInput.tsx`
- Create: `src/components/DateSelector.tsx`
- Test: `tests/components.test.tsx`

- [ ] **Step 1: Implement Header with logo, theme toggle, bookmark counter**
- [ ] **Step 2: Implement FilterBar for period (Daily/Weekly/Monthly) and language chips**
- [ ] **Step 3: Implement SearchInput with debounced change and clear button**
- [ ] **Step 4: Implement DateSelector for archive switching**
- [ ] **Step 5: Commit navigation and filter components**

---

### Task 6: Repository Card & List (`RepoCard`, `RepoList`)

**Files:**
- Create: `src/components/RepoCard.tsx`
- Create: `src/components/RepoList.tsx`

- [ ] **Step 1: Implement RepoCard with stats, AI summary box, key bullets, tags**
- [ ] **Step 2: Add quick actions: Bookmark toggle, Git Clone copy with checkmark toast**
- [ ] **Step 3: Implement RepoList with responsive grid and empty state**
- [ ] **Step 4: Commit repo card and list components**

---

### Task 7: Bookmarks Drawer & App Assembly (`App.tsx`)

**Files:**
- Create: `src/components/BookmarkDrawer.tsx`
- Modify: `src/App.tsx`

- [ ] **Step 1: Implement BookmarkDrawer modal/sheet for saved repos**
- [ ] **Step 2: Connect state in `App.tsx`: search, filters, sorting, date selection**
- [ ] **Step 3: Test entire user flow in browser build**
- [ ] **Step 4: Commit App assembly**

---

### Task 8: GitHub Actions Automation & Deployment Config

**Files:**
- Create: `.github/workflows/daily-trend.yml`
- Create: `README.md`

- [ ] **Step 1: Create daily cron workflow with secrets and GitHub Pages deployment**
- [ ] **Step 2: Write documentation in README.md with setup and usage instructions**
- [ ] **Step 3: Run end-to-end build and test validation**
- [ ] **Step 4: Final commit**
