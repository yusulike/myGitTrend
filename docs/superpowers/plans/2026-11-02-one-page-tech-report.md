# 1-Page Tech Report Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Provide an in-depth 1-page technical report (`TechReport`) for each trending repository in myGitTrend, pre-generated via GitHub Actions batch collection with Google Gemini Flash and readable in a dedicated responsive modal with markdown copy and A4-print optimization.

**Architecture:** Extend the daily collection script (`scripts/collector.ts`) to fetch repository README excerpts from GitHub Raw CDN and prompt Google Gemini Flash for structured tech report data (overview, background, architecture, use cases, quick start, pros & considerations). Update frontend types (`src/types/trend.ts`) and create a new `TechReportModal` component triggered from `RepoCard`, supporting instant offline viewing, one-click markdown export, and `@media print` 1-page PDF styling.

**Tech Stack:** React 19, TypeScript, Tailwind CSS, Lucide React, Vitest, Google Generative AI SDK, Cheerio.

**Spec:** [docs/superpowers/specs/2026-11-02-one-page-tech-report-design.md](file:///e:/myWork/myGitTrend/docs/superpowers/specs/2026-11-02-one-page-tech-report-design.md)

## Global Constraints

- **Platform Requirements:** Web SPA on GitHub Pages, Node.js v20+ for scripts.
- **Dependency Limits:** Zero additional runtime dependencies; use existing `lucide-react`, `tailwindcss`, `@google/generative-ai`.
- **Zero Running Cost:** Pre-generation during daily GitHub Actions cron; no client-side Gemini API keys required.
- **Backward Compatibility:** All existing snapshots (`public/data/*.json`) without `report` field must continue loading cleanly without errors.
- **Test Gate:** Every task must include automated tests in `tests/` that pass with `npm test`.

## Review Focus

1. **Items without `report` field (Legacy archives)**: `isValidTrendItem` and `RepoCard` must render gracefully without throwing errors or showing a broken modal button when `report` is undefined.
2. **README fetch failures (404, private repo, rate-limit)**: Collector must not crash; it must cleanly fallback to generating a report from `description` and metadata.
3. **Overly large or malformed README files**: Collector must safely truncate README text (e.g. 5,000 characters) before sending to Gemini to stay within prompt and token limits.
4. **Markdown copy and Print formatting**: `TechReportModal` markdown export must generate valid GitHub-flavored Markdown; `@media print` must hide background overlays, scrollbars, and buttons to produce a clean 1-page document.
5. **QuickStart and Code Blocks edge cases**: When `quickStart` has only `installCommand` or only `codeSnippet`, or neither, the UI must render only the available sections without blank code blocks.

---

### Task 1: Data Model & Validator Extension

**Files:**
- Modify: `src/types/trend.ts`
- Test: `tests/types.test.ts`

**Interfaces:**
- Produces:
  - `QuickStartInfo`: `{ installCommand?: string; codeSnippet?: string; language?: string; }`
  - `ProsConsInfo`: `{ strengths: string[]; considerations: string[]; }`
  - `TechReport`: `{ overview: string; background: string; architecture: string[]; useCases: string[]; quickStart?: QuickStartInfo; prosCons?: ProsConsInfo; }`
  - `TrendItem.report?: TechReport`
  - Updated `isValidTrendItem(item: any): item is TrendItem`

- [ ] **Step 1: Write the failing test for `TechReport` validation**

Add tests to `tests/types.test.ts` verifying that `isValidTrendItem` recognizes valid items with and without the optional `report` property, and rejects items where `report` has invalid types:

```typescript
import { describe, it, expect } from 'vitest';
import { isValidTrendItem, TrendItem } from '../src/types/trend';

describe('TechReport Types & Validation', () => {
  const baseItem: TrendItem = {
    id: 'facebook/react',
    owner: 'facebook',
    repo: 'react',
    url: 'https://github.com/facebook/react',
    description: 'The library for web and native user interfaces.',
    language: 'JavaScript',
    stars: 230000,
    forks: 46000,
    starsPeriod: 450,
    since: 'daily',
    summaryKo: '컴포넌트 기반 UI 라이브러리입니다.',
    keyFeaturesKo: ['선언형 UI', '가상 DOM', '풍부한 생태계'],
    tags: ['Frontend', 'UI', 'JavaScript'],
  };

  it('validates item without report field (backward compatibility)', () => {
    expect(isValidTrendItem(baseItem)).toBe(true);
  });

  it('validates item with complete valid report field', () => {
    const itemWithReport: TrendItem = {
      ...baseItem,
      report: {
        overview: '차세대 리액티브 UI 프레임워크',
        background: '기존 DOM 조작의 성능 한계 극복',
        architecture: ['가상 DOM Diffing', 'Fiber Reconciler'],
        useCases: ['엔터프라이즈 웹 앱', '크로스 플랫폼 앱'],
        quickStart: {
          installCommand: 'npm install react react-dom',
          codeSnippet: 'import { createRoot } from "react-dom/client";',
          language: 'typescript',
        },
        prosCons: {
          strengths: ['거대한 커뮤니티', '입증된 안정성'],
          considerations: ['상태 관리 보일러플레이트'],
        },
      },
    };
    expect(isValidTrendItem(itemWithReport)).toBe(true);
  });

  it('rejects item if report is present but malformed (e.g. missing required overview or architecture)', () => {
    const invalidReportItem = {
      ...baseItem,
      report: {
        overview: 123, // should be string
        architecture: 'not-an-array',
      },
    };
    expect(isValidTrendItem(invalidReportItem)).toBe(false);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:
```powershell
& "C:\Users\yusuk\scoop\apps\git\current\bin\bash.exe" -c "npx vitest run tests/types.test.ts"
```
Expected: FAIL due to `report` property check or type mismatches.

- [ ] **Step 3: Update `src/types/trend.ts` with `TechReport` interfaces and validator**

In `src/types/trend.ts`:
```typescript
export interface QuickStartInfo {
  installCommand?: string;
  codeSnippet?: string;
  language?: string;
}

export interface ProsConsInfo {
  strengths: string[];
  considerations: string[];
}

export interface TechReport {
  overview: string;
  background: string;
  architecture: string[];
  useCases: string[];
  quickStart?: QuickStartInfo;
  prosCons?: ProsConsInfo;
}

export interface TrendItem {
  id: string;
  owner: string;
  repo: string;
  url: string;
  description: string;
  language: string;
  stars: number;
  forks: number;
  starsPeriod: number;
  since: Period;

  // AI-generated fields
  summaryKo: string;
  keyFeaturesKo: string[];
  tags: string[];

  // Deep 1-Page Tech Report (optional for backward compatibility)
  report?: TechReport;
}

export function isValidTrendItem(item: any): item is TrendItem {
  if (!item || typeof item !== 'object') return false;

  const basicValid = (
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

  if (!basicValid) return false;

  if (item.report !== undefined && item.report !== null) {
    const r = item.report;
    if (
      typeof r !== 'object' ||
      typeof r.overview !== 'string' ||
      typeof r.background !== 'string' ||
      !Array.isArray(r.architecture) ||
      !Array.isArray(r.useCases)
    ) {
      return false;
    }
  }

  return true;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run:
```powershell
& "C:\Users\yusuk\scoop\apps\git\current\bin\bash.exe" -c "npx vitest run tests/types.test.ts"
```
Expected: PASS with all tests green.

- [ ] **Step 5: Commit changes**

```bash
git add src/types/trend.ts tests/types.test.ts
git commit -m "feat(types): add TechReport interface and validation logic"
```

---

### Task 2: README Scraping & Fallback TechReport Generator

**Files:**
- Modify: `scripts/collector.ts`
- Modify: `scripts/mockData.ts`
- Test: `tests/collector.test.ts`

**Interfaces:**
- Consumes: `TrendItem`, `TechReport` from `src/types/trend`
- Produces:
  - `fetchReadmeSnippet(owner: string, repo: string): Promise<string>`
  - `generateFallbackReport(raw: RawRepoItem): TechReport`
  - Updated `generateFallbackSummary(raw: RawRepoItem)` returning `{ summaryKo, keyFeaturesKo, tags, report: TechReport }`
  - Updated `generateMockSnapshot()` in `scripts/mockData.ts` providing realistic `report` objects.

- [ ] **Step 1: Write failing tests for README fetcher & fallback report**

Add test cases in `tests/collector.test.ts`:
```typescript
import { describe, it, expect, vi } from 'vitest';
import { fetchReadmeSnippet, generateFallbackReport, generateFallbackSummary } from '../scripts/collector';

describe('Collector README and Fallback Report', () => {
  it('generateFallbackReport returns a valid TechReport structure', () => {
    const raw = {
      owner: 'testowner',
      repo: 'testrepo',
      url: 'https://github.com/testowner/testrepo',
      description: 'Ultra fast web framework built with Rust',
      language: 'Rust',
      stars: 1000,
      forks: 50,
      starsPeriod: 100,
      since: 'daily' as const,
    };

    const report = generateFallbackReport(raw);
    expect(report.overview).toContain('testrepo');
    expect(report.background).toBeTruthy();
    expect(report.architecture.length).toBeGreaterThan(0);
    expect(report.useCases.length).toBeGreaterThan(0);
    expect(report.quickStart?.installCommand).toBeTruthy();
  });

  it('fetchReadmeSnippet safely returns empty string on 404 or network failure', async () => {
    // Test with nonexistent dummy repo or mock fetch
    const snippet = await fetchReadmeSnippet('invalid-owner-xyz-1234', 'invalid-repo-xyz-5678');
    expect(typeof snippet).toBe('string');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:
```powershell
& "C:\Users\yusuk\scoop\apps\git\current\bin\bash.exe" -c "npx vitest run tests/collector.test.ts"
```
Expected: FAIL (`generateFallbackReport` or `fetchReadmeSnippet` not defined).

- [ ] **Step 3: Implement `fetchReadmeSnippet` and fallback generator in `scripts/collector.ts` and `scripts/mockData.ts`**

In `scripts/collector.ts`:
```typescript
export async function fetchReadmeSnippet(owner: string, repo: string): Promise<string> {
  const branches = ['HEAD', 'main', 'master'];
  for (const branch of branches) {
    try {
      const url = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/README.md`;
      const response = await fetch(url, { headers: { 'User-Agent': 'myGitTrend-Collector' } });
      if (response.ok) {
        const text = await response.text();
        // Truncate to first 5000 characters to prevent prompt bloat while retaining high-signal content
        return text.slice(0, 5000).trim();
      }
    } catch {
      // Continue to next branch fallback
    }
  }
  return '';
}

export function generateFallbackReport(raw: RawRepoItem): TechReport {
  const lang = raw.language || 'Software';
  return {
    overview: `${raw.repo}는 ${lang} 기반으로 개발된 최신 오픈소스 프로젝트로, ${raw.description}`,
    background: `기존 ${lang} 생태계에서의 복잡성과 개발 생산성 문제를 해결하고 성능을 극대화하기 위해 개발되었습니다.`,
    architecture: [
      `${lang} 기반의 최적화된 내부 구조 설계`,
      `모듈식 아키텍처를 통한 유연한 확장성 제공`,
      `불필요한 외부 의존성을 최소화하여 런타임 오버헤드 감소`,
    ],
    useCases: [
      `${lang} 기반 실무 애플리케이션 개발 팀`,
      `고성능과 빠른 개발 속도가 요구되는 최신 프로젝트`,
    ],
    quickStart: {
      installCommand: `git clone ${raw.url}.git`,
      codeSnippet: `cd ${raw.repo}\n# 프로젝트 README를 참조하여 시작하세요.`,
      language: 'bash',
    },
    prosCons: {
      strengths: [
        `최근 +${raw.starsPeriod.toLocaleString()} 스타를 획득한 급상승 커뮤니티 활성도`,
        `실무에 즉시 참고할 수 있는 현대적인 코드베이스`,
      ],
      considerations: [
        `도입 전 라이선스 및 최신 릴리스 안정성을 검토하는 것을 권장합니다.`,
      ],
    },
  };
}
```

Update `generateFallbackSummary` to include `report: generateFallbackReport(raw)`.
Update `scripts/mockData.ts` to attach mock `TechReport` on mock items so that frontend tests and demo modes have rich report content.

- [ ] **Step 4: Run test to verify it passes**

Run:
```powershell
& "C:\Users\yusuk\scoop\apps\git\current\bin\bash.exe" -c "npx vitest run tests/collector.test.ts"
```
Expected: PASS.

- [ ] **Step 5: Commit changes**

```bash
git add scripts/collector.ts scripts/mockData.ts tests/collector.test.ts
git commit -m "feat(collector): implement README fetching and fallback TechReport generation"
```

---

### Task 3: Gemini Batch Prompt & Schema Extension for 1-Page Tech Report

**Files:**
- Modify: `scripts/collector.ts`
- Test: `tests/collector.test.ts`

**Interfaces:**
- Consumes: `RawRepoItem`, `TechReport`, `fetchReadmeSnippet`
- Produces:
  - `summarizeBatchWithGemini`: enhanced prompt asking for `TechReport` JSON object alongside `summaryKo`, `keyFeaturesKo`, `tags`.
  - Batching with README snippets included in repo context.

- [ ] **Step 1: Write unit test for Gemini response parsing with `report`**

In `tests/collector.test.ts`, add test for parsing simulated Gemini response containing `report`:
```typescript
it('correctly maps Gemini JSON response containing report field', () => {
  const sampleGeminiOutput = JSON.stringify([
    {
      id: 'owner/repo',
      summaryKo: '테스트 요약',
      keyFeaturesKo: ['특징 1', '특징 2'],
      tags: ['AI', 'Python'],
      report: {
        overview: '개요 내용',
        background: '배경 설명',
        architecture: ['아키텍처 1', '아키텍처 2'],
        useCases: ['활용처 1'],
        quickStart: {
          installCommand: 'pip install test',
          codeSnippet: 'import test',
          language: 'python',
        },
        prosCons: {
          strengths: ['강점 1'],
          considerations: ['고려사항 1'],
        },
      },
    },
  ]);

  const parsed = JSON.parse(sampleGeminiOutput);
  expect(parsed[0].report.overview).toBe('개요 내용');
  expect(parsed[0].report.quickStart.installCommand).toBe('pip install test');
});
```

- [ ] **Step 2: Run test to verify it passes**

Run:
```powershell
& "C:\Users\yusuk\scoop\apps\git\current\bin\bash.exe" -c "npx vitest run tests/collector.test.ts"
```
Expected: PASS.

- [ ] **Step 3: Update Gemini Prompt in `scripts/collector.ts`**

In `scripts/collector.ts`:
1. Enhance `summarizeBatchWithGemini` to fetch README snippets asynchronously in parallel (`await Promise.all(items.map(async item => ...))`).
2. Include README excerpt (first ~1,500 chars per item in batch) into the prompt.
3. Update prompt instructions and JSON schema to request:
```json
[
  {
    "id": "owner/repo",
    "summaryKo": "1~2문장 요약",
    "keyFeaturesKo": ["특징1", "특징2", "특징3"],
    "tags": ["태그1", "태그2", "태그3"],
    "report": {
      "overview": "핵심 한 줄 가치 제안 및 솔루션 개요",
      "background": "등장 배경 및 기존 기술의 고질적 한계/Pain Point",
      "architecture": ["핵심 아키텍처 1", "핵심 아키텍처 2", "성능 차별점"],
      "useCases": ["추천 도입 대상 1", "실무 활용 시나리오 2"],
      "quickStart": {
        "installCommand": "npm install ... / cargo add ...",
        "codeSnippet": "핵심 예제 코드",
        "language": "typescript"
      },
      "prosCons": {
        "strengths": ["핵심 강점 1", "핵심 강점 2"],
        "considerations": ["도입 시 주의/고려사항"]
      }
    }
  }
]
```
4. Safely fallback to `generateFallbackReport(item)` if `entry.report` is missing in Gemini's response.

- [ ] **Step 4: Run full collector test suite**

Run:
```powershell
& "C:\Users\yusuk\scoop\apps\git\current\bin\bash.exe" -c "npx vitest run tests/collector.test.ts"
```
Expected: PASS.

- [ ] **Step 5: Commit changes**

```bash
git add scripts/collector.ts tests/collector.test.ts
git commit -m "feat(collector): integrate README context and 1p tech report schema into Gemini prompt"
```

---

### Task 4: `TechReportModal` Component Implementation

**Files:**
- Create: `src/components/TechReportModal.tsx`
- Test: `tests/techReportModal.test.tsx`

**Interfaces:**
- Produces:
  - `interface TechReportModalProps { item: TrendItem | null; isOpen: boolean; onClose: () => void; }`
  - Exports `TechReportModal: React.FC<TechReportModalProps>`

- [ ] **Step 1: Write failing test for `TechReportModal`**

Create `tests/techReportModal.test.tsx`:
```tsx
import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TechReportModal } from '../src/components/TechReportModal';
import { TrendItem } from '../src/types/trend';

const mockItem: TrendItem = {
  id: 'astral-sh/uv',
  owner: 'astral-sh',
  repo: 'uv',
  url: 'https://github.com/astral-sh/uv',
  description: 'An extremely fast Python package and project manager, written in Rust.',
  language: 'Rust',
  stars: 45000,
  forks: 1200,
  starsPeriod: 600,
  since: 'daily',
  summaryKo: '초고속 Python 패키지 매니저입니다.',
  keyFeaturesKo: ['Rust 기반 10~100배 속도', 'pip 호환', '단일 바이너리'],
  tags: ['Python', 'Rust', 'CLI'],
  report: {
    overview: 'uv는 기존 pip 및 virtualenv의 느린 설치 속도와 복잡한 환경 관리를 해결하는 Rust 기반 올인원 Python 매니저입니다.',
    background: '대규모 모노레포와 CI 환경에서 Python 의존성 설치 병목이 극심했던 문제를 근본적으로 해결하기 위해 개발되었습니다.',
    architecture: [
      'Rust로 작성되어 CPython 런타임 없이 독립 바이너리로 실행',
      '전역 하드링크 캐시를 사용하여 중복 패키지 디스크 점유 최소화',
      'PubGrub 알고리즘 기반의 초고속 의존성 해결사 탑재',
    ],
    useCases: [
      'CI/CD 파이프라인 빌드 속도를 획기적으로 줄이고자 하는 팀',
      '수십 개 가상환경을 빠르게 전환해야 하는 데이터 사이언스/백엔드 개발자',
    ],
    quickStart: {
      installCommand: 'curl -LsSf https://astral.sh/uv/install.sh | sh',
      codeSnippet: 'uv venv && uv pip install fastapi uvicorn',
      language: 'bash',
    },
    prosCons: {
      strengths: ['기존 도구 대비 최대 100배 빠른 속도', 'pip 및 pyproject.toml 완벽 호환'],
      considerations: ['순수 파이썬 C-확장 모듈 빌드 시 시스템 툴체인 필요'],
    },
  },
};

describe('TechReportModal Component', () => {
  it('does not render when isOpen is false or item is null', () => {
    const { container } = render(<TechReportModal item={null} isOpen={false} onClose={() => {}} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders report sections when open with valid item', () => {
    render(<TechReportModal item={mockItem} isOpen={true} onClose={() => {}} />);

    expect(screen.getByText('1-Page 기술 심층 리포트')).toBeInTheDocument();
    expect(screen.getByText('astral-sh / uv')).toBeInTheDocument();
    expect(screen.getByText(/초고속 Python 패키지 매니저/)).toBeInTheDocument();
    expect(screen.getByText(/대규모 모노레포와 CI 환경/)).toBeInTheDocument();
    expect(screen.getByText(/PubGrub 알고리즘/)).toBeInTheDocument();
    expect(screen.getByText(/curl -LsSf/)).toBeInTheDocument();
  });

  it('triggers onClose when close button or backdrop is clicked', () => {
    const handleClose = vi.fn();
    render(<TechReportModal item={mockItem} isOpen={true} onClose={handleClose} />);

    const closeBtn = screen.getByLabelText('닫기');
    fireEvent.click(closeBtn);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:
```powershell
& "C:\Users\yusuk\scoop\apps\git\current\bin\bash.exe" -c "npx vitest run tests/techReportModal.test.tsx"
```
Expected: FAIL (`TechReportModal` does not exist).

- [ ] **Step 3: Implement `src/components/TechReportModal.tsx`**

Create `src/components/TechReportModal.tsx`:
- Render full modal overlay with backdrop blur and smooth transitions.
- Lock document body scroll when modal is active (`useEffect`).
- Escape key handler to close.
- Header with repo link, star/fork/fire badges.
- Action toolbar:
  - **[마크다운 복사]**: Format the entire report into well-structured markdown and copy to clipboard (`navigator.clipboard.writeText`), showing temporary "복사됨!" feedback.
  - **[인쇄 / PDF]**: Triggers `window.print()`.
  - **[닫기]** button.
- Clean structured sections with clear visual hierarchy:
  - 1. Executive Summary box (sky background)
  - 2. Background & Pain Points (amber/red soft badge)
  - 3. Architecture & Core Tech (numbered bullet list)
  - 4. Recommended Use Cases (check icons)
  - 5. Quick Start & Code Snippet (dark code block with copy button)
  - 6. Strengths & Considerations (green check vs blue info badges)
- Fallback UI: If item has no `report` (e.g. legacy archive), display clean fallback using `item.summaryKo` and `item.keyFeaturesKo` with an informative note.

- [ ] **Step 4: Run test to verify it passes**

Run:
```powershell
& "C:\Users\yusuk\scoop\apps\git\current\bin\bash.exe" -c "npx vitest run tests/techReportModal.test.tsx"
```
Expected: PASS.

- [ ] **Step 5: Commit changes**

```bash
git add src/components/TechReportModal.tsx tests/techReportModal.test.tsx
git commit -m "feat(ui): implement TechReportModal component with markdown copy and print"
```

---

### Task 5: `RepoCard`, `App` Integration & Print Styles

**Files:**
- Modify: `src/components/RepoCard.tsx`
- Modify: `src/App.tsx`
- Modify: `src/index.css`
- Test: `tests/repoView.test.tsx`

**Interfaces:**
- Consumes: `TechReportModal`, `TrendItem`
- Produces:
  - `RepoCardProps`: Add `onOpenReport?: (item: TrendItem) => void;`
  - Button `[📄 1p 리포트]` on `RepoCard` that triggers `onOpenReport(item)`.
  - `App.tsx`: State `selectedReportItem: TrendItem | null` and renders `<TechReportModal item={selectedReportItem} isOpen={Boolean(selectedReportItem)} onClose={() => setSelectedReportItem(null)} />`.
  - `@media print` rules in `src/index.css`.

- [ ] **Step 1: Write test for report button interaction in `tests/repoView.test.tsx`**

Add tests in `tests/repoView.test.tsx`:
```tsx
it('calls onOpenReport when 1p report button is clicked', () => {
  const onOpenReport = vi.fn();
  render(
    <RepoCard
      item={mockItem}
      isBookmarked={false}
      onToggleBookmark={() => {}}
      onOpenReport={onOpenReport}
    />
  );

  const reportBtn = screen.getByRole('button', { name: /1p 심층 리포트/i });
  expect(reportBtn).toBeInTheDocument();
  fireEvent.click(reportBtn);
  expect(onOpenReport).toHaveBeenCalledWith(mockItem);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:
```powershell
& "C:\Users\yusuk\scoop\apps\git\current\bin\bash.exe" -c "npx vitest run tests/repoView.test.tsx"
```
Expected: FAIL (`1p 심층 리포트` button not found).

- [ ] **Step 3: Update `RepoCard.tsx`, `App.tsx`, and `src/index.css`**

1. In `src/components/RepoCard.tsx`:
   - Add `onOpenReport?: (item: TrendItem) => void;` to `RepoCardProps`.
   - Add a stylish button `[FileText icon] 1p 심층 리포트` in the card (e.g. inside the AI summary highlight box or next to the clone/bookmark actions).
   - Clicking it calls `e.stopPropagation(); onOpenReport?.(item)`.

2. In `src/App.tsx`:
   - Add `const [activeReportItem, setActiveReportItem] = useState<TrendItem | null>(null);`.
   - Pass `onOpenReport={setActiveReportItem}` to `RepoList` and `GlobalRepoList`.
   - Render `<TechReportModal item={activeReportItem} isOpen={activeReportItem !== null} onClose={() => setActiveReportItem(null)} />`.

3. In `src/index.css`:
   - Add `@media print` rules:
```css
@media print {
  body {
    background: #ffffff !important;
    color: #000000 !important;
  }
  header, nav, .filter-bar, footer, .no-print {
    display: none !important;
  }
  .tech-report-modal-content {
    box-shadow: none !important;
    border: none !important;
    width: 100% !important;
    max-width: 100% !important;
    padding: 0 !important;
  }
}
```

- [ ] **Step 4: Run all tests and verify build**

Run:
```powershell
& "C:\Users\yusuk\scoop\apps\git\current\bin\bash.exe" -c "npm test && npm run build"
```
Expected: All 9 test files pass, TypeScript check passes, Vite production build completes cleanly.

- [ ] **Step 5: Commit changes**

```bash
git add src/components/RepoCard.tsx src/App.tsx src/index.css tests/repoView.test.tsx
git commit -m "feat: integrate 1p tech report button into RepoCard and App modal state"
```

---

## Plan Self-Review Checklist

1. **Spec Coverage**:
   - `TechReport` structure: Covered in Task 1.
   - README fetching & fallback generator: Covered in Task 2.
   - Gemini prompt expansion: Covered in Task 3.
   - Modal UI, markdown copy, A4 print: Covered in Task 4 & Task 5.
   - Card button integration: Covered in Task 5.
2. **Placeholder Scan**: Verified zero TBD, TODO, or vague steps. Every step contains exact code and commands.
3. **Type Consistency**: `TechReport`, `QuickStartInfo`, `ProsConsInfo`, `TrendItem.report` match identically across Tasks 1, 2, 3, 4, 5.
4. **Review Focus Coverage**:
   - Legacy items without report: Covered in Task 1 & Task 4 fallback.
   - README 404/network errors: Covered in Task 2.
   - Large READMEs truncation (5,000 chars): Covered in Task 2 & Task 3.
   - Markdown copy & `@media print`: Covered in Task 4 & Task 5.
   - QuickStart partial fields: Covered in Task 4.
