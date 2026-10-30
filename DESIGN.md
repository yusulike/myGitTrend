---
name: myGitTrend
description: AI가 한국어로 요약해주는 깃허브 트렌드 대시보드
colors:
  primary: "#0284c7"
  primary-hover: "#0369a1"
  neutral-bg: "#f8fafc"
  neutral-surface: "#ffffff"
  neutral-border: "#e2e8f0"
  neutral-text: "#0f172a"
  neutral-text-muted: "#64748b"
  dark-bg: "#0d1117"
  dark-surface: "#161b22"
  dark-surface-hover: "#1c2128"
  dark-border: "#30363d"
  dark-text: "#f0f6fc"
  dark-text-muted: "#8b949e"
  accent-sparkle: "#0ea5e9"
  accent-star: "#f59e0b"
  accent-trend: "#f97316"
typography:
  headline:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 700
    lineHeight: 1.3
  title:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: "1rem"
    fontWeight: 600
    lineHeight: 1.4
  body:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 600
    lineHeight: 1.3
rounded:
  sm: "6px"
  md: "8px"
  lg: "12px"
  xl: "16px"
  full: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.neutral-surface}"
    rounded: "{rounded.lg}"
    padding: "8px 14px"
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.neutral-text-muted}"
    rounded: "{rounded.lg}"
    padding: "8px 8px"
  card-repo:
    backgroundColor: "{colors.neutral-surface}"
    rounded: "{rounded.xl}"
    padding: "20px"
---

# Design System: myGitTrend

## Overview

**Creative North Star: "The Hacker's Radar"**

myGitTrend는 글로벌 오픈소스 생태계에서 급부상하는 프로젝트를 실시간으로 포착하고, 노이즈 없이 핵심 가치만을 정밀하게 전달하는 레이더이자 관측소입니다. GitHub 특유의 정교한 개발자 툴 감성(GitHub Dark `#0d1117` 및 정밀한 1px 보더)을 바탕으로, AI 요약 큐레이션이 선명하게 부각되는 스카이블루 액센트를 결합했습니다.

복잡한 시각적 장식이나 과도한 일러스트를 배제하고, 높은 정보 밀도(High Information Density) 속에서도 눈의 피로 없이 카드를 빠르게 스캐닝할 수 있는 위계 질서를 갖춥니다. 다크 모드와 라이트 모드 양쪽 모두에서 텍스트 대비와 뱃지 가독성이 엄격히 보장됩니다.

**Key Characteristics:**
- **정밀한 1px 구조 (Precision Borders):** 모호한 면 분할 대신 선명한 1px 경계선(`#e2e8f0` / `#30363d`)으로 명확한 정보 구획 정의.
- **초고속 스캐닝 위계 (Scanability Hierarchy):** 레포 이름(굵은 타이틀) → AI 요약 박스(은은한 틴트 배경) → 특징 뱃지 → 메타 정보 순서의 즉각적 시선 유도.
- **개발자 액션 즉시성 (Instant Utility):** `git clone` 원클릭 복사, 북마크 토글, GitHub 바로가기가 호버 시 명확한 피드백과 함께 즉시 노출.

## Colors

GitHub 생태계에 최적화된 다크 팔레트와 맑은 슬레이트 라이트 팔레트 위에 스카이블루 액센트를 얹은 고대비 듀얼 시스템입니다.

### Primary
- **Sky Signal** (`#0284c7`): AI 요약 아이콘, 활성 탭 텍스트, 카드 호버 보더 강조, 인터랙티브 링크에 사용하는 핵심 브랜드 컬러.
- **Sky Signal Deep** (`#0369a1`): Primary 버튼의 호버 및 액티브 상태 배경.

### Secondary
- **Amber Star** (`#f59e0b`): GitHub Star 개수 뱃지 및 북마크 활성 상태 전용 시맨틱 컬러.
- **Ember Flame** (`#f97316`): 트렌드 급상승 뱃지 및 오늘(Daily) 필터 아이콘 강조 컬러.

### Neutral
- **Light Slate Background** (`#f8fafc`): 라이트 모드 전체 기본 캔버스 배경.
- **Light Surface Card** (`#ffffff`): 라이트 모드 카드 및 모달 서랍 표면.
- **Light Border Muted** (`#e2e8f0`): 라이트 모드 카드 외곽선, 디바이더 및 인풋 스트로크.
- **Light Text Deep** (`#0f172a`): 라이트 모드 헤드라인 및 본문 텍스트 (최고 명도 대비).
- **Light Text Muted** (`#64748b`): 부가 메타 정보, 제작자 이름, 플레이스홀더.
- **GitHub Dark Canvas** (`#0d1117`): 다크 모드 바닥 배경 및 내부 인셋 영역.
- **GitHub Dark Surface** (`#161b22`): 다크 모드 카드 표면, 드롭다운 메뉴, 헤더 배경.
- **GitHub Dark Surface Hover** (`#1c2128`): 다크 모드 카드 및 리스트 아이템 호버 시의 미세 하이라이트.
- **GitHub Dark Border** (`#30363d`): 다크 모드 표준 보더 및 칩 경계선.
- **GitHub Dark Text Bright** (`#f0f6fc`): 다크 모드 제목 및 활성 텍스트.
- **GitHub Dark Text Muted** (`#8b949e`): 다크 모드 보조 설명 및 메타데이터.

### Named Rules
**The Native Contrast Rule.** 배경과 텍스트의 대비는 항상 WCAG AAA 기준(7:1 이상)을 준수하며, 다크 모드에서는 `#0d1117`과 `#f0f6fc`, 라이트 모드에서는 `#f8fafc`와 `#0f172a`의 순수 대비를 유지한다.
**The Accent Restraint Rule.** Primary 스카이블루는 화면 전체 면적의 10% 이하로 절제하여 사용하며, 오직 시선 집중(AI 요약, 인터랙티브 포커스)에만 부여한다.

## Typography

**Display/Headline Font:** `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`
**Body Font:** `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`
**Label/Mono Font:** `ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace`

**Character:** OS 네이티브 폰트 스택을 채택하여 별도 웹폰트 로딩 지연 없는 제로 레이턴시 렌더링을 제공하며, 코드 및 레포지토리 식별자는 모노스페이스로 단단하게 정렬됩니다.

### Hierarchy
- **Headline** (Bold 700, `1.25rem` / 20px, `line-height: 1.3`): 헤더 브랜드 타이틀 및 섹션 최상위 제목.
- **Title** (SemiBold 600, `1.0rem` / 16px ~ `1.125rem` / 18px, `line-height: 1.4`): RepoCard 제목 (`owner / repo`).
- **Body** (Regular 400, `0.875rem` / 14px, `line-height: 1.5`): AI 핵심 요약문, 원문 설명 텍스트.
- **Label** (SemiBold 600, `0.75rem` / 12px, `line-height: 1.3`, `letter-spacing: -0.01em`): 필터 탭, 뱃지, 카운터, 버튼 텍스트.
- **Mono Code** (Regular 400, `0.75rem` / 12px, `line-height: 1.4`): `git clone` 명령어 미리보기 및 기술 스택 태그.

### Named Rules
**The Truncation Guard Rule.** 긴 레포지토리 설명이나 작성자 이름이 레이아웃을 깨뜨리지 않도록, 한 줄 말줄임(`truncate`) 또는 최대 2줄 제한(`line-clamp-2`)을 명확히 명시한다.

## Layout

1280px(`max-w-7xl`) 중앙 컨테이너 모델을 기반으로 하며, 반응형 그리드 시스템을 적용합니다.

- **컨테이너 & 패딩:**
  - 모바일: 좌우 16px (`px-4`), 카드 간격 16px (`gap-4`)
  - 태블릿(sm/md): 좌우 24px (`px-6`), 1열 또는 2열 그리드
  - 데스크톱(lg/xl): 좌우 32px (`px-8`), 2열 또는 3열 반응형 그리드 (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5`)
- **헤더:** 스티키 탑 고정 (`sticky top-0 z-30`), 높이 64px (`h-16`), 블러 백드롭(`backdrop-blur-md`).
- **사이드 드로어:** 고정 오버레이(`fixed inset-0 z-50`), 우측 슬라이드 인 너비 모바일 100%, 데스크톱 420px.

## Elevation & Depth

이 시스템은 인위적인 거대 드롭 섀도우를 배제하고, **Tonal Layering(색조 계층화)과 섬세한 상태별 섀도우(Subtle State Lift)**를 원칙으로 합니다.

### Shadow Vocabulary
- **Base Rest** (`box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05)`): 평상시 카드 및 인풋 필드의 기본 깊이감.
- **Hover Lift** (`box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)`): RepoCard 마우스 호버 시 띄움 효과.
- **Dark Shadow Depth** (`box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3)`): 다크 모드 카드 호버 및 드로어 레이어의 깊이감.
- **Focus Glow** (`box-shadow: 0 0 0 3px rgba(2, 132, 199, 0.2)`): 인풋 필드 및 키보드 포커스 시의 스카이블루 링.

### Named Rules
**The Border-Before-Shadow Rule.** 깊이감의 1차 구분선은 항상 1px 테두리(`border`)이며, 그림자는 평면 위에 떠 있는 인터랙션 피드백(Hover/Focus/Modal)으로만 동작한다.

## Shapes

둥근 모서리 반지름(Radius)을 정보의 단위 크기에 비례하여 정밀하게 배분합니다.

- **Cards & Drawers:** 16px (`rounded-2xl`). 가장 큰 시각적 컨테이너로 부드럽고 완성도 높은 곡선 제공.
- **Inputs & Header Items:** 12px (`rounded-xl`). 터치/클릭 영역에 최적화된 둥글기.
- **Buttons & Filter Tabs:** 8px (`rounded-lg`). 컴팩트하면서도 도구적인 정돈감.
- **Badges & Chips:** 9999px (`rounded-full`) 또는 6px (`rounded-md`). 상태 표시 및 카테고리 태그.

## Components

### Buttons
- **Shape:** 8px (`rounded-lg`) 또는 12px (`rounded-xl`).
- **Primary:** 배경 Sky-600 (`#0284c7`), 텍스트 화이트 (`#ffffff`), 패딩 8px 14px, 폰트 12px SemiBold.
- **Ghost / Icon:** 배경 투명, 호버 시 `bg-slate-100` / 다크 `bg-[#21262d]`, 패딩 8px.
- **Hover / Focus:** 호버 시 미세한 배경색 변화 및 포커스 시 `ring-2 ring-sky-500/20`.

### Chips & Filter Tabs
- **Style:** 12px 라운드 컨테이너 내부의 8px 토글 버튼.
- **Selected State:** 라이트 `bg-white text-sky-600 shadow-sm border border-slate-200`, 다크 `bg-[#21262d] text-sky-400 border-[#30363d]`.
- **Unselected State:** 텍스트 `text-slate-500` / 다크 `text-[#8b949e]`, 호버 시 명도 증가.

### RepoCard
- **Corner Style:** 16px (`rounded-2xl`).
- **Background:** 라이트 `#ffffff`, 다크 `#161b22`.
- **Border:** 라이트 `#e2e8f0`, 다크 `#30363d`. 호버 시 `border-sky-500/60` / `border-[#58a6ff]/60`.
- **Internal Padding:** 20px (`p-5`).
- **AI Summary Callout Box:** 배경 라이트 `bg-sky-50/60`, 다크 `bg-sky-950/20`, 보더 `border-sky-100` / `border-sky-900/30`, 라운드 12px, 상단에 반짝이(`Sparkles`) 아이콘과 함께 한국어 1~2줄 요약 배치.

### SearchInput
- **Style:** 12px (`rounded-xl`), 좌측 루페(돋보기) 아이콘 고정, 우측 클리어(X) 버튼.
- **Stroke & Background:** 라이트 `bg-white border-slate-200`, 다크 `bg-[#161b22] border-[#30363d]`.
- **Focus:** `focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20`.

## Do's and Don'ts

### Do:
- **Do** 카드나 컴포넌트를 추가할 때 항상 다크 모드 클래스(`dark:bg-[#161b22]`, `dark:border-[#30363d]`)를 쌍으로 작성한다.
- **Do** AI 요약 텍스트 박스는 일반 영문 설명보다 시각적으로 우선순위가 높도록 상단에 배치하고 미세한 스카이 틴트를 적용한다.
- **Do** Star, Fork, 언어 메타데이터는 숫자를 K 단위(예: `1.2k`)로 축약 표기하여 가로 폭을 보존한다.
- **Do** 모든 인터랙티브 아이콘 버튼에는 직관적인 `title` 및 `aria-label`을 제공한다.

### Don't:
- **Don't** GitHub 고유의 다크 배경톤(`#0d1117`, `#161b22`)을 임의의 회색(`#222222`, `#333333`)이나 순수 블랙(`#000000`)으로 대체하지 않는다.
- **Don't** 카드 호버 시 레이아웃 흔들림(Layout Shift)을 유발하는 과도한 확대 스케일(`scale-105` 등)을 적용하지 않는다 (경계선 색상 및 그림자 강조만 허용).
- **Don't** 액센트 컬러를 요약/포커스 영역 외의 일반 텍스트나 넓은 배경에 남용하지 않는다.
