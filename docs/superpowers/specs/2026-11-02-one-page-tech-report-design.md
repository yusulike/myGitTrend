# 1-Page Tech Report (아이템 별 1p 기술 심층 분석 보고서) System Design Specification

- **Date**: 2026-11-02
- **Feature Name**: 1-Page Tech Report
- **Target Project**: myGitTrend (`mgt`)
- **Status**: Proposed / Awaiting Review

---

## 1. Overview & Objectives

### Background & Problem Statement
현재 `myGitTrend`는 GitHub Trending 페이지에서 스크래핑한 1줄짜리 영문 설명(`description`)만을 기반으로 Google Gemini API를 호출하여 `summaryKo`(1~2문장)와 `keyFeaturesKo`(3~4개 불릿)를 제공하고 있습니다.
빠르게 훑어보는 스캐닝(Scanning) 목적에는 적합하지만, 실제 프로젝트나 실무에 도입을 검토하는 개발자 및 테크 리드에게는 다음과 같은 정보가 부족하여 결국 GitHub 원문 README를 처음부터 다시 찾아 읽어야 하는 한계가 존재합니다:
1. **등장 배경 및 해결 과제**: 왜 이 프로젝트가 탄생했고 기존 기술의 어떤 한계를 극복했는가?
2. **핵심 아키텍처 및 기술 차별점**: 내부 구조, 런타임 성능 우위, 동시성/메모리 모델 등 기술적 핵심이 무엇인가?
3. **도입 추천 대상 및 활용처**: 우리 팀이나 실무 프로젝트에 적합한가? 어떤 조건에서 도입해야 하는가?
4. **Quick Start 및 대표 코드**: 어떻게 설치하고 가장 기본적인 사용 예제 코드는 무엇인가?

### Goals
- **1-Page 심층 테크 리포트 자동 생성**: GitHub 원문 `README.md`를 크롤링하여 Google Gemini Flash가 전문 아키텍트 수준의 구조화된 1p 기술 분석 보고서(`TechReport`)를 자동 생성하도록 파이프라인 확장.
- **노션/기술 백서 스타일의 고품질 뷰어 (Modal / Sheet)**: 카드에서 원클릭으로 열리는 읽기 쉬운 전용 보고서 UI 제공.
- **실무 개발자 편의 기능**:
  - 원클릭 **마크다운(Markdown) 복사** (사내 위키, 노션, 슬랙에 바로 공유 가능)
  - **인쇄 및 1페이지 PDF 저장 최적화** (`@media print` 적용)
  - 대표 코드 스니펫 원클릭 복사
- **서버리스 제로 유지비(0원) 유지**: GitHub Actions 수집 배치에서 정적 JSON에 포함시켜 사전 빌드하므로, 브라우저에서는 별도 API 호출이나 지연 없이 즉각 로딩(0초 응답). 기존 저장소 데이터와 완전 하위 호환.

---

## 2. Data Model Design

`src/types/trend.ts`에 `TechReport` 인터페이스를 추가하고 `TrendItem`에 선택적(`optional`) 필드로 연결합니다.

```typescript
export interface QuickStartInfo {
  installCommand?: string;       // e.g. "npm install @tanstack/react-query" or "cargo add tokio"
  codeSnippet?: string;          // 대표 실행 코드 또는 설정 스니펫
  language?: string;             // 스니펫 언어 (typescript, bash, python, rust 등)
}

export interface ProsConsInfo {
  strengths: string[];           // 핵심 강점 2~3가지
  considerations: string[];      // 도입 전 주의/고려사항 1~2가지
}

export interface TechReport {
  overview: string;              // 1. 핵심 한 줄 가치 제안 및 솔루션 개요
  background: string;            // 2. 등장 배경 및 기존 기술의 고질적 한계 (Pain Point)
  architecture: string[];        // 3. 핵심 아키텍처 및 기술적 차별점 (3~4개 항목)
  useCases: string[];            // 4. 추천 도입 대상 및 실무 활용 시나리오 (2~3개 항목)
  quickStart?: QuickStartInfo;   // 5. 퀵스타트 가이드 (설치 및 핵심 예제 코드)
  prosCons?: ProsConsInfo;       // 6. 핵심 강점 및 도입 시 고려사항
}

export interface TrendItem {
  id: string;                    // "owner/repo"
  owner: string;                 // "facebook"
  repo: string;                  // "react"
  url: string;                   // "https://github.com/facebook/react"
  description: string;           // Original English description
  language: string;              // Primary language
  stars: number;
  forks: number;
  starsPeriod: number;
  since: Period;

  // AI-generated summary (Compact Card View)
  summaryKo: string;
  keyFeaturesKo: string[];
  tags: string[];

  // Deep 1-Page Tech Report (Detailed View)
  report?: TechReport;
}
```

---

## 3. Data Collection & AI Pipeline (`scripts/collector.ts`)

```
   [GitHub Trending Scraper]
              │
              ├─ Repositories List
              ▼
   [README Scraper (raw.githubusercontent.com)]
              │  - Fetch HEAD/README.md (fallback main/master)
              │  - Truncate up to 5,000 chars (safe token window)
              ▼
   [Gemini Flash Batch Prompt]
              │  - Prompt includes Repo Metadata + README excerpt
              │  - Generates summaryKo, keyFeaturesKo, tags + TechReport JSON
              ▼
   [JSON Output File Generation]
              │  - Saved to public/data/latest.json & archives/
              ▼
   [Vite + React Static SPA Delivery]
```

### 1) README 추출 전략
- GitHub API Rate-limit(시간당 60회)을 피하기 위해 공식 원문 Raw CDN(`https://raw.githubusercontent.com/${owner}/${repo}/HEAD/README.md`)으로 직접 GET 요청.
- 토큰 절약 및 속도를 위해 README 상위 5,000자(목적, 아키텍처, 퀵스타트가 집중된 부분)만 추출.
- 네트워크 실패나 404 발생 시 기존 description 기반의 폴백 리포트 생성 로직으로 안전하게 대체.

### 2) Gemini 프롬프트 고도화
- 수석 소프트웨어 아키텍트 페르소나를 부여하여 단순 번역이 아닌 실무 기술 분석 관점에서 작성하도록 지시.
- 반환 JSON 스키마에 `report` 필드를 엄격하게 지정하고 `generationConfig.responseMimeType: 'application/json'` 적용.

### 3) 로컬 테스트 및 API 키 부재 시 폴백 지원
- `mockData.ts` 및 `generateFallbackSummary`에도 표준 `TechReport` 생성기를 탑재하여 API 키가 없는 환경이나 단위 테스트에서도 깨지지 않도록 보장.

---

## 4. UI / UX Design & Components

### 1) 신규 컴포넌트: `TechReportModal.tsx` (`src/components/TechReportModal.tsx`)
- **트리거**: `RepoCard` 내부의 **[📄 1p 심층 리포트]** 버튼 클릭 시 오픈.
- **모달 레이아웃 & 비주얼**:
  - 너비 `max-w-3xl`, 화면 높이에 맞춘 세로 스크롤 가능 레이아웃.
  - 다크/라이트 모드 테마 일관성 준수 (`#161b22`, slate/sky 포인트).
  - 헤더: 저장소 이름, 공식 링크, 스타/포크 뱃지, 기간 급상승 뱃지.
  - 액션 툴바:
    - **[📋 마크다운 복사]**: 보고서 전체를 깔끔한 Markdown 형식으로 클립보드에 복사.
    - **[🖨️ 인쇄 / 1p PDF 저장]**: 브라우저 인쇄 다이얼로그 호출.
    - **[✕ 닫기]**: 모달 닫기 (ESC 키 및 배경 클릭 지원).
- **보고서 섹션 구성**:
  1. **개요 (Executive Summary)**: 부드러운 스카이 컬러 하이라이트 박스.
  2. **등장 배경 & 해결 과제 (Problem Statement)**: 고질적 문제 vs 솔루션 대비.
  3. **핵심 아키텍처 & 기술적 특징 (Architecture)**: 번호가 매겨진 명확한 기술 블록.
  4. **도입 추천 대상 (Recommended Use Cases)**: 실무 적용 체크리스트 아이콘.
  5. **Quick Start & 코드 스니펫 (Code Box)**: 다크 테마 코드 블록 및 원클릭 복사.
  6. **핵심 강점 & 주의사항 (Pros & Considerations)**: 성공적인 도입을 위한 인사이트.

### 2) 인쇄 & 1-Page PDF 스타일 최적화 (`@media print`)
- 인쇄 시 상단 네비게이션, 모달 배경 딤(dim), 닫기/복사 버튼은 자동 숨김 처리.
- 폰트 크기 및 여백을 A4 1장에 최적화되도록 미디어 쿼리 적용 (`page-break-inside: avoid`).

### 3) `RepoCard.tsx` 수정
- 카드 하단 또는 AI 요약 박스 상단에 **[📄 1p 심층 리포트]** 액션 버튼 추가.
- 클릭 시 상위 `App.tsx`의 모달 상태(`activeReportItem: TrendItem | null`)를 활성화.

---

## 5. Implementation Roadmap (Phases)

- **Phase 1: 타입 및 데이터 구조 정의**
  - `src/types/trend.ts`에 `TechReport`, `QuickStartInfo`, `ProsConsInfo` 정의 및 `isValidTrendItem` 검증 함수 갱신.
- **Phase 2: UI 컴포넌트 개발 (`TechReportModal.tsx`)**
  - 모달 렌더러, 마크다운 복사기, 인쇄 스타일, 코드 복사 기능 구현.
  - `RepoCard.tsx` 및 `App.tsx` 연동.
- **Phase 3: 수집기 및 Gemini AI 프롬프트 확장 (`scripts/collector.ts`, `mockData.ts`)**
  - README 스크래퍼 함수 구현 (`fetchReadmeSnippet`).
  - Gemini 배치 프롬프트 확장 및 JSON 파싱 처리.
  - 오프라인/키 부재 시의 폴백 생성기 업데이트.
- **Phase 4: 검증 및 테스트**
  - 기존 테스트(`tests/collector.test.ts`) 업데이트 및 신규 UI 컴포넌트 검증.
  - 빌드(`npm run build`) 확인 및 모바일/인쇄 반응형 검증.

---

## 6. Spec Self-Review Checklist

1. **Placeholder Scan**: 미정(TBD), 할일(TODO) 등 모호한 항목 없음.
2. **Internal Consistency**: 인터페이스 정의와 UI 컴포넌트, 수집기 파이프라인의 입출력 구조가 일치함.
3. **Scope Check**: 1p 기술 보고서 데이터 확장 및 모달 UI 구현에 완벽히 집중됨.
4. **Ambiguity Check**: 데이터 소스(README.md Raw 요청), 생성 시점(Actions 배치), UI 형태(모달 + 인쇄 지원)가 모두 명시됨.
