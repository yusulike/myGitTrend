# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

국내외 최신 오픈소스 트렌드를 빠르게 파악하고 실무/토이프로젝트에 도입하려는 한국어권 소프트웨어 개발자.
영어 원문 설명과 긴 README를 일일이 읽지 않고도 가치 있는 라이브러리와 툴을 즉시 훑어보고(스캐닝) 클론 또는 북마크하여 활용하고자 함.

## Product Purpose

GitHub의 급상승 트렌드를 AI(Google Gemini)가 한국어로 핵심만 짚어 요약해주는 서버리스 대시보드.
개발자가 트렌드 탐색에 들이는 시간과 언어 장벽 비용을 극소화하여 유용한 최신 기술을 빠르게 발굴하고 적용하도록 돕는다.

## Positioning

단순 영문 GitHub Trending 스크래핑을 넘어, Google Gemini Flash를 기반으로 각 프로젝트의 핵심 가치 1~2줄 요약, 주요 특징 3~4개, 카테고리 태그를 완전 자동 생성하여 한국어권 개발자에게 즉각적인 인사이트를 제공함.
서버 유지비 0원(GitHub Actions 크론 + Gemini Flash 무료 티어 + GitHub Pages 정적 호스팅)으로 영구 운영 가능.

## Operating Context

- 주로 데스크톱 및 모바일 브라우저 환경에서 매일 아침 또는 업무 시작 전 최신 오픈소스 탐색을 위해 방문.
- 일간(Daily), 주간(Weekly), 월간(Monthly) 기간 필터링 및 언어별(TypeScript, Python, Rust, Go 등) 빠른 필터 전환.
- 실시간 키워드 검색, Star/이름순 정렬, LocalStorage 기반 북마크 서랍(Drawer), 원클릭 `git clone` 복사 기능 등을 작업 플로우에 맞게 사용.
- 다크/라이트 모드 지원.

## Capabilities and Constraints

- **데이터 수집 및 요약**:
  - `npm run collect`: GitHub Trending 크롤링(Cheerio) 후 `@google/generative-ai`로 한국어 요약 생성, `public/data/`에 JSON 저장.
  - `GEMINI_API_KEY` 부재 시 스마트 휴리스틱 요약기로 폴백 동작.
- **프론트엔드 환경**:
  - React 19, TypeScript, Vite, Tailwind CSS, Lucide React.
  - 완전 정적 단일 페이지 애플리케이션(SPA)으로 백엔드 서버 없이 브라우저 단에서 상태 관리 및 로컬스토리지 활용.
- **제약사항**:
  - 별도 유저 계정 DB 없이 로컬 브라우저(LocalStorage)를 통해 북마크 보존.
  - 일 1회 GitHub Actions 크론 스케줄링으로 정적 데이터 갱신.

## Brand Commitments

- **이름**: `myGitTrend` (약칭 `mgt`)
- **톤앤매너**: 빠르고 실용적이며 군더더기 없는 개발자 중심의 모던 대시보드.
- **라이선스**: MIT License.

## Evidence on Hand

- 라이브 배포 사이트: `https://yusulike.github.io/myGitTrend/`
- 일일 자동화 워크플로우: `.github/workflows/daily-trend.yml`
- 실제 수집 및 큐레이션 데이터 구조: `public/data/` 내 일간/주간/월간 JSON 파일
- 소스 코드 및 컴포넌트: `src/App.tsx`, `src/components/`, `src/hooks/`

## Product Principles

1. **초고속 스캐닝 (Scanability First)**: 카드 하나당 3초 안에 어떤 프로젝트인지 파악할 수 있도록 핵심 요약과 특징 뱃지를 시각적으로 우선 배치한다.
2. **개발자 워크플로우 직결 (Developer Utility)**: 원클릭 clone 복사, GitHub 원문 링크, 로컬 북마크 등 실제 개발 환경과 매끄럽게 연결되는 도구성을 유지한다.
3. **가볍고 무결한 서버리스 (Zero-Overhead Reliability)**: 정적 호스팅 환경에서 매끄럽게 동작하며 불필요한 번들/복잡성을 배제한다.
4. **다크/라이트 일관성 (System-First Theme)**: 장시간 모니터를 주시하는 개발자를 위해 대비와 가독성이 최적화된 다크/라이트 테마를 일관되게 제공한다.
