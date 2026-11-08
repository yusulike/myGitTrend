# 🚀 mgt (myGitTrend)

<div align="center">

> **GitHub 급상승 트렌드를 AI(Google Gemini)가 한국어로 핵심만 짚어 요약해주는 서버리스 대시보드**  
> 영어 원문 설명과 긴 README를 일일이 읽지 않아도, 3초 만에 오픈소스의 핵심 가치와 기술 스택을 파악할 수 있습니다.

[![Daily Trend Collection & Deploy](https://github.com/yusulike/myGitTrend/actions/workflows/daily-trend.yml/badge.svg)](https://github.com/yusulike/myGitTrend/actions/workflows/daily-trend.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![React 19](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.1-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Gemini AI](https://img.shields.io/badge/Google_Gemini-Flash-8E75B2?logo=google-gemini&logoColor=white)](https://aistudio.google.com/)

[**🌐 라이브 서비스 바로가기**](https://yusulike.github.io/myGitTrend/) · [**보고서 기능 보기**](#-ai-심층-기술-리포트-tech-report) · [**로컬 시작하기**](#-로컬-개발-가이드)

</div>

---

## 💡 기획 의도 및 특징

GitHub Trending은 세계적인 개발 트렌드를 발견하는 가장 훌륭한 장소이지만, 다음과 같은 불편함이 있었습니다:
- **언어 장벽과 긴 텍스트**: 영어로 작성된 긴 설명과 README를 읽는 데 적지 않은 시간이 소요됩니다.
- **아카이브 부재**: 지난 날짜의 트렌드가 무엇이었는지 되돌아보기 어렵습니다.
- **운영 비용 부담**: 별도 백엔드 서버나 DB를 두면 지속적인 유지비와 관리 비용이 발생합니다.

**`myGitTrend`는 이 문제들을 완전한 서버리스 아키텍처와 Gemini AI로 해결합니다:**
- ⚡ **3초 스캐닝**: 한국어 한 줄 핵심 요약과 특징 태그를 제공하여 카드 하나당 3초 안에 가치를 파악합니다.
- 📑 **심층 분석**: 필요 시 상세 아키텍처, 추천 사용 사례, 빠른 시작 코드가 담긴 **기술 분석 리포트**를 열람할 수 있습니다.
- 📅 **과거 트렌드 아카이브 & 검색**: 캘린더로 지난 일자의 트렌드를 조회하고 전체 아카이브를 통합 검색합니다.
- 💰 **서버 유지비 0원**: GitHub Actions 크론 스케줄링 + Gemini 무료 티어 + GitHub Pages 정적 호스팅으로 영구 무료 운영됩니다.

---

## ✨ 핵심 기능

### 1. ⚡ AI 한국어 핵심 요약 (Korean Curation)
- **Google Gemini Flash** 기반 자동 분석
- 프로젝트당 **핵심 가치 1~2줄 요약**과 **핵심 특징 3~4가지 뱃지** 자동 생성
- 도메인별(AI/ML, Web, DevOps, Tooling 등) 자동 카테고리 태깅

### 2. 📑 AI 심층 기술 리포트 (Tech Report)
- 카드 내 **"심층 분석"** 클릭 시 모달 형태로 상세 기술 분석 보고서 제공:
  - 🏛️ **기술 아키텍처 및 핵심 스택** 분석
  - 💡 **추천 사용 사례 (Use Cases)**
  - ⚖️ **장단점 비교 (Pros & Cons)**
  - 💻 **빠른 시작 코드 스니펫 (Quick Start)**
- **공유 유틸리티**:
  - Notion, Jira, Wiki, Slack 등에 바로 공유할 수 있는 **Markdown 원클릭 복사**
  - **인쇄 및 PDF 저장** 최적화 레이아웃 지원

### 3. 📅 캘린더 기반 트렌드 아카이브 (Historical Calendar)
- 상단 캘린더 피커를 통해 수집된 과거 날짜의 트렌드 목록을 손쉽게 탐색
- 날짜별 데이터 영구 보존 (`public/data/archives/`)

### 4. 🔍 듀얼 스코프 통합 검색 (Dual-Scope Search)
- **선택 일자 검색**: 현재 화면에 표시된 날짜 트렌드 내 실시간 필터링
- **전체 아카이브 통합 검색**: 과거 수집된 수백 개의 모든 레포지토리를 대상으로 즉시 검색
- 레포지토리명, 제작자, 한국어 AI 요약 내용, 영문 원문, 태그 전체 반영

### 5. 🎛️ 유연한 필터링 & 정렬
- **기간 전환**: `오늘 (Daily)`, `이번 주 (Weekly)`, `이번 달 (Monthly)`
- **언어별 필터 칩**: TypeScript, Python, Rust, Go, C++, Java 등 주요 언어 원클릭 필터링
- **정렬 옵션**: 오늘 급상승 Star 순, 전체 누적 Star 순, 이름순 정렬

### 6. 🛠️ 개발자 중심 편의 기능
- 💾 **로컬 북마크**: 관심 있는 프로젝트를 브라우저(LocalStorage)에 영구 보관하고 우측 사이드 드로어에서 한눈에 관리
- 📋 **원클릭 빠른 복사**: 터미널에 바로 붙여넣을 수 있는 `git clone ...` 명령어 복사 버튼
- 🔗 **GitHub 직행 링크**: 해당 레포지토리 및 릴리스 페이지로 원클릭 이동
- 🌗 **다크 / 라이트 모드**: 시스템 테마 자동 감지 및 커스텀 토글 지원

---

## 🏗️ 시스템 아키텍처

```mermaid
flowchart LR
    subgraph Automation [GitHub Actions (매일 2회: KST 09:00 / 21:00)]
        A[GitHub Trending 크롤러<br/>Cheerio] --> B[Gemini Flash AI<br/>한국어 요약 및 심층 리포트 생성]
        B --> C[JSON 데이터 저장 & 색인<br/>latest / archives / search-index]
        C --> D[Vite 정적 빌드]
    end

    subgraph Hosting [GitHub Pages]
        D --> E[정적 웹 애플리케이션<br/>SPA React 19]
    end

    subgraph Client [사용자 브라우저]
        E --> F[빠른 스캐닝 & 필터링]
        E --> G[심층 기술 리포트 / MD 복사]
        E --> H[캘린더 아카이브 & 전역 검색]
        E --> I[LocalStorage 북마크]
    end
```

---

## 🛠️ 기술 스택

| 영역 | 기술 및 도구 | 설명 |
| :--- | :--- | :--- |
| **Frontend** | React 19, TypeScript, Vite, Tailwind CSS | 초고속 빌드 및 모던 컴포넌트 SPA |
| **Icons & UI** | Lucide React, clsx, tailwind-merge | 가볍고 일관된 아이콘과 유틸리티 클래스 |
| **Pipeline** | Node.js, tsx, Cheerio | GitHub Trending 스크래핑 및 데이터 가공 |
| **AI / LLM** | `@google/generative-ai` (Gemini Flash) | 한국어 요약, 키워드 추출, 심층 기술 리포트 생성 |
| **Automation** | GitHub Actions | 일 2회 크론 스케줄링(매일 오전/오후 9시) 및 데이터 갱신 |
| **Hosting** | GitHub Pages | 서버 유지비 0원의 정적 사이트 배포 |

---

## 📦 로컬 개발 가이드

### 1. 사전 요구사항
- Node.js 20.x 이상
- npm 10.x 이상

### 2. 저장소 클론 및 패키지 설치
```bash
git clone https://github.com/yusulike/myGitTrend.git
cd myGitTrend
npm install
```

### 3. 환경 변수 설정 (선택 사항)
실제 Google Gemini API를 사용하여 요약 데이터를 직접 수집하려면 `.env` 파일을 생성합니다:
```bash
cp .env.example .env
```
`.env` 파일에 API 키를 입력합니다 ([Google AI Studio](https://aistudio.google.com/)에서 무료 발급):
```env
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-1.5-flash
```
> 💡 `GEMINI_API_KEY`가 없더라도 내장된 **스마트 휴리스틱 폴백 요약기**가 작동하므로 에러 없이 안전하게 실행할 수 있습니다.

### 4. 주요 실행 명령어

| 명령어 | 설명 |
| :--- | :--- |
| `npm run dev` | 로컬 개발 서버 실행 (`http://localhost:5173`) |
| `npm run collect` | 최신 GitHub Trending 수집 및 AI 요약 스크립트 실행 |
| `npm run build:index` | 아카이브 파일들을 바탕으로 전체 검색 색인(`search-index.json`) 재구성 |
| `npm run build` | TypeScript 검사 및 프로덕션 정적 파일 빌드 (`dist/`) |
| `npm run preview` | 프로덕션 빌드 결과물 로컬 미리보기 |
| `npm test` | Vitest 단위 및 통합 테스트 실행 |

---

## 🚀 GitHub Actions 배포 설정 (자체 Fork 시)

자신의 GitHub 저장소로 Fork하여 동일하게 자동 수집 및 배포를 운영하려면 다음 단계를 진행합니다:

1. **저장소 Secrets 설정**:
   - 저장소 **Settings > Secrets and variables > Actions** 메뉴로 이동합니다.
   - **New repository secret**을 클릭하여 Name에 `GEMINI_API_KEY`, Value에 발급받은 Gemini API 키를 등록합니다.
2. **GitHub Pages 활성화**:
   - 저장소 **Settings > Pages** 메뉴로 이동합니다.
   - **Build and deployment > Source**를 **GitHub Actions**로 변경합니다.
3. **워크플로우 권한 설정**:
   - 저장소 **Settings > Actions > General > Workflow permissions**에서 **Read and write permissions**를 선택하고 저장합니다 (수집된 JSON 데이터를 저장소에 커밋하기 위함).
4. **자동 실행**:
   - 매일 2회(UTC 00:00, 12:00 / KST 오전 09:00, 오후 09:00)마다 `.github/workflows/daily-trend.yml`이 자동으로 실행되어 최신 데이터를 수집하고 배포합니다.
   - 언제든지 **Actions** 탭에서 `Daily Trend Collection & Deploy` 워크플로우의 **Run workflow** 버튼을 눌러 수동 실행할 수 있습니다.

---

## 📁 디렉토리 구조

```plaintext
myGitTrend/
├── .github/workflows/         # 일일 트렌드 수집 및 배포 GitHub Actions 워크플로우
│   └── daily-trend.yml
├── public/
│   └── data/                  # 수집된 정적 데이터 및 아카이브
│       ├── latest.json        # 최신 일간/주간/월간 트렌드 데이터
│       ├── archive-index.json # 수집 일자 인덱스
│       ├── search-index.json  # 전역 통합 검색 색인
│       └── archives/          # 과거 날짜별 트렌드 스냅샷 (YYYY-MM-DD.json)
├── scripts/
│   ├── collector.ts           # GitHub Trending 스크래퍼 및 Gemini AI 요약 파이프라인
│   ├── build-search-index.ts  # 아카이브 기반 전역 검색 색인 빌더
│   └── mockData.ts            # API 키 부재 시 폴백용 스마트 휴리스틱 데이터
├── src/
│   ├── components/            # UI 컴포넌트
│   │   ├── Header.tsx         # 상단 헤더, 로고, 테마 토글, 북마크 버튼
│   │   ├── DateSelector.tsx   # 과거 날짜 선택 캘린더 팝오버
│   │   ├── SearchInput.tsx    # 실시간 검색창
│   │   ├── SearchScopeTabs.tsx# 선택 일자 vs 전체 아카이브 검색 탭
│   │   ├── FilterBar.tsx      # 기간(일/주/월), 정렬, 언어 필터 칩
│   │   ├── RepoList.tsx       # 트렌드 레포지토리 카드 그리드
│   │   ├── RepoCard.tsx       # 개별 프로젝트 카드 (요약, 뱃지, clone 복사)
│   │   ├── TechReportModal.tsx# AI 심층 기술 분석 보고서 모달 (MD 복사/인쇄)
│   │   ├── GlobalRepoList.tsx # 전역 아카이브 검색 결과 뷰
│   │   └── BookmarkDrawer.tsx # 저장된 북마크 관리 사이드 서랍
│   ├── hooks/                 # 커스텀 훅 (LocalStorage 북마크 등)
│   ├── types/                 # 트렌드 및 리포트 TypeScript 타입 정의
│   ├── App.tsx                # 메인 페이지 및 상태 관리
│   └── index.css              # Tailwind CSS 스타일시트
├── index.html
├── package.json
├── tailwind.config.js
└── vite.config.ts
```

---

## 📄 라이선스

이 프로젝트는 [MIT License](https://opensource.org/licenses/MIT)를 따릅니다.
누구나 자유롭게 수정, 배포 및 상업적/비상업적 용도로 활용할 수 있습니다.
