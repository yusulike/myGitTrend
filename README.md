# 🚀 mgt (myGitTrend)

> **GitHub 급상승 트렌드를 AI(Google Gemini)가 한국어로 핵심만 짚어 요약해주는 서버리스 대시보드**
> 
> 🌐 **배포 사이트 바로가기**: [https://yusulike.github.io/myGitTrend/](https://yusulike.github.io/myGitTrend/)

[![Daily Trend Collection & Deploy](https://github.com/yusulike/myGitTrend/actions/workflows/daily-trend.yml/badge.svg)](https://github.com/yusulike/myGitTrend/actions/workflows/daily-trend.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

---

## ✨ 핵심 기능

- ⚡ **AI 핵심 요약 (Korean Curations)**:
  - Google Gemini Flash Lite를 활용하여 각 오픈소스 프로젝트의 핵심 가치 1~2줄 요약, 주요 특징 3~4개, 카테고리 태그 자동 생성.
- 📅 **다양한 기간 및 언어 필터링**:
  - `오늘 (Daily)`, `이번 주 (Weekly)`, `이번 달 (Monthly)` 기간 전환.
  - TypeScript, Rust, Python, Go 등 주 프로그래밍 언어별 원클릭 필터 칩.
  - 급상승 Star 순, 누적 Star 순, 이름순 정렬.
- 🔍 **실시간 키워드 검색**:
  - 레포명, 제작자, 한국어 AI 요약 내용, 원문 영문 설명, 태그를 즉시 검색.
- 💾 **로컬 북마크 (LocalStorage)**:
  - 마음에 드는 프로젝트를 브라우저에 영구 저장하고 사이드 드로어에서 한눈에 관리.
- 📋 **원클릭 빠른 복사**:
  - 터미널에서 즉시 실행할 수 있는 `git clone ...` 명령어 원클릭 복사.
- 🌗 **다크 모드 & 라이트 모드**:
  - 시스템 테마 자동 감지 및 수동 토글 지원.
- 💰 **서버 유지비 0원**:
  - GitHub Actions(무료 크론 스케줄러) + Gemini Flash(무료 티어) + GitHub Pages(무료 정적 호스팅)로 완전 무료 운영.

---

## 🛠️ 기술 스택

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS, Lucide React
- **Pipeline & Scraping**: Node.js, Cheerio, `@google/generative-ai`
- **Testing**: Vitest, React Testing Library
- **CI/CD & Hosting**: GitHub Actions, GitHub Pages

---

## 📦 로컬 개발 가이드

### 1. 패키지 설치
```bash
npm install
```

### 2. 최신 트렌드 데이터 수집 & 요약 스크립트 실행
```bash
# GEMINI_API_KEY가 없을 경우 스마트 휴리스틱 요약기로 안전하게 동작합니다.
npm run collect

# Gemini API 키를 적용하여 실제 LLM 요약을 실행할 경우:
GEMINI_API_KEY="your-gemini-api-key" npm run collect
```

### 3. 로컬 개발 서버 실행
```bash
npm run dev
```
브라우저에서 `http://localhost:5173`으로 접속합니다.

### 4. 테스트 실행
```bash
npm test
```

### 5. 프로덕션 정적 빌드
```bash
npm run build
```

---

## 🚀 배포 및 자동화 설정 (GitHub Actions)

1. 본 레포지토리를 GitHub에 Push합니다.
2. 레포지토리 **Settings > Secrets and variables > Actions** 메뉴로 이동합니다.
3. **Repository secrets**에 `GEMINI_API_KEY`를 추가합니다. ([Google AI Studio](https://aistudio.google.com/)에서 무료 발급 가능)
4. 레포지토리 **Settings > Pages** 메뉴에서 Source를 **GitHub Actions**로 설정합니다.
5. 이제 매일 자정(UTC 00:00 / KST 오전 09:00)마다 GitHub Actions가 자동으로 실행되어 최신 트렌드를 수집하고 사이트를 갱신합니다.
   - 필요 시 Actions 탭에서 `Run workflow` 버튼을 눌러 언제든 즉시 수동 실행할 수 있습니다.

---

## 📄 라이선스

MIT License.
