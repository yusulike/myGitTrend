import { TrendItem, TrendSnapshot } from '../src/types/trend';

export const MOCK_TRENDING_ITEMS: TrendItem[] = [
  {
    id: 'shadcn-ui/ui',
    owner: 'shadcn-ui',
    repo: 'ui',
    url: 'https://github.com/shadcn-ui/ui',
    description: 'Beautifully designed components that you can copy and paste into your apps. Accessible. Customizable. Open Source.',
    language: 'TypeScript',
    stars: 78500,
    forks: 6900,
    starsPeriod: 1240,
    since: 'daily',
    summaryKo: '복사하여 내 프로젝트 코드에 직접 붙여넣어 사용하는 고품질 무지향성 컴포넌트 라이브러리',
    keyFeaturesKo: [
      'Radix UI와 Tailwind CSS 기반의 접근성(a11y) 완벽 보장',
      'npm 패키지 설치가 아닌 직접 코드를 소유하고 수정하는 유연성',
      'React, Next.js 및 다크 모드 기본 지원'
    ],
    tags: ['UI', 'TailwindCSS', 'React', 'TypeScript'],
    report: {
      overview: 'shadcn/ui는 전통적인 패키지 의존성 설치 방식을 탈피하여, 소스코드를 프로젝트에 직접 복사해 완전한 제어권을 갖는 혁신적인 헤드리스 UI 컴포넌트 라이브러리입니다.',
      background: '기존 UI 라이브러리(Material UI, Ant Design 등)가 가진 무거운 번들 크기, 커스텀 스타일링의 제약, 버전 업그레이드 시의 Breaking Change 문제를 해결하기 위해 등장했습니다.',
      architecture: [
        'Radix UI Primitives를 기반으로 하여 WAI-ARIA 접근성 가이드라인을 100% 준수',
        'Tailwind CSS와 class-variance-authority(CVA)를 통한 유연한 컴포넌트 변형(Variants) 제어',
        'CLI를 통해 필요한 컴포넌트의 순수 소스코드를 내 프로젝트의 components 폴더로 직접 다운로드',
      ],
      useCases: [
        '독자적인 디자인 시스템을 구축하려는 엔터프라이즈 프론트엔드 팀',
        'Next.js 14/15 App Router 환경에서 빠르고 미려한 대시보드를 구축하려는 프로젝트',
      ],
      quickStart: {
        installCommand: 'npx shadcn@latest init',
        codeSnippet: 'npx shadcn@latest add button card dialog',
        language: 'bash',
      },
      prosCons: {
        strengths: [
          '의존성 락인 없이 코드를 100% 자유롭게 수정 가능',
          'Tailwind CSS 생태계와의 완벽한 일체감 및 가벼운 런타임',
        ],
        considerations: [
          '업스트림 컴포넌트 버그 픽스를 자동으로 pull하기 어려우며 프로젝트 자체 유지보수 필요',
        ],
      },
    },
  },
  {
    id: 'astral-sh/uv',
    owner: 'astral-sh',
    repo: 'uv',
    url: 'https://github.com/astral-sh/uv',
    description: 'An extremely fast Python package and project manager, written in Rust.',
    language: 'Rust',
    stars: 39400,
    forks: 1450,
    starsPeriod: 980,
    since: 'daily',
    summaryKo: 'Rust로 작성되어 pip보다 최대 10~100배 빠른 초고속 차세대 Python 패키지 및 가상환경 관리 도구',
    keyFeaturesKo: [
      'pip, pip-tools, virtualenv의 모든 기능을 단일 실행 파일로 대체',
      '글로벌 모듈 캐싱을 통한 디스크 절약 및 즉각적인 패키지 설치',
      'pip 호환 CLI 인터페이스 제공으로 손쉬운 마이그레이션'
    ],
    tags: ['Python', 'Rust', 'DevOps', 'CLI'],
    report: {
      overview: 'uv는 기존 pip 및 virtualenv의 느린 설치 속도와 복잡한 환경 관리를 해결하는 Rust 기반의 올인원 초고속 Python 패키지 관리자입니다.',
      background: '대규모 모노레포와 CI/CD 환경에서 Python 패키지 의존성 해결 및 다운로드가 전체 파이프라인의 핵심 병목이었던 문제를 근본적으로 타개하기 위해 개발되었습니다.',
      architecture: [
        'Rust로 구현되어 CPython 런타임 없이 단일 정적 바이너리로 구동',
        '전역 하드링크 캐시 메커니즘을 통해 중복 패키지의 디스크 점유율을 0에 가깝게 유지',
        'PubGrub 의존성 해결 알고리즘을 Rust로 재구현하여 복잡한 패키지 그래프를 밀리초 단위로 해석',
      ],
      useCases: [
        'CI/CD 파이프라인 빌드 시간을 수 분에서 수 초로 단축하려는 개발 팀',
        '수십 개의 격리된 Python 가상환경을 디스크 낭비 없이 빠르게 전환해야 하는 AI/ML 연구원',
      ],
      quickStart: {
        installCommand: 'curl -LsSf https://astral.sh/uv/install.sh | sh',
        codeSnippet: 'uv venv && source .venv/bin/activate\nuv pip install fastapi uvicorn',
        language: 'bash',
      },
      prosCons: {
        strengths: [
          '기존 pip/poetry 대비 최대 10~100배 빠른 패키지 설치 속도',
          '단일 바이너리로 Python 없이도 독립 실행 가능',
        ],
        considerations: [
          '순수 C-확장 모듈 빌드가 필요한 특수 패키지는 시스템 C 컴파일러 환경 필요',
        ],
      },
    },
  },
  {
    id: 'anthropics/anthropic-sdk-typescript',
    owner: 'anthropics',
    repo: 'anthropic-sdk-typescript',
    url: 'https://github.com/anthropics/anthropic-sdk-typescript',
    description: 'TypeScript and JavaScript library for the Anthropic Claude API.',
    language: 'TypeScript',
    stars: 2800,
    forks: 350,
    starsPeriod: 410,
    since: 'daily',
    summaryKo: 'Claude 모델을 Node.js 및 브라우저 환경에서 손쉽게 연동할 수 있는 Anthropic 공식 TypeScript SDK',
    keyFeaturesKo: [
      '스트리밍 응답 및 도구 호출(Tool use / Function calling) 완벽 지원',
      '엄격한 TypeScript 타입 정의 및 자동 완성 제공',
      'Edge 런타임(Cloudflare Workers, Vercel Edge) 호환'
    ],
    tags: ['AI', 'LLM', 'Claude', 'TypeScript'],
    report: {
      overview: 'Anthropic Claude 모델 제품군(Opus, Sonnet, Haiku)을 Node.js, 브라우저, Edge 런타임에서 안정적으로 호출할 수 있는 공식 TypeScript SDK입니다.',
      background: '복잡한 Server-Sent Events(SSE) 스트리밍 제어와 엄격한 Function Calling 스키마 검증을 표준화하여 개발자들의 LLM 연동 시간을 단축하고자 제작되었습니다.',
      architecture: [
        '웹 표준 Fetch API 기반 설계로 Node.js뿐 아니라 Cloudflare Workers, Deno, Bun에서 무수정 동작',
        'Zod 스키마 연동을 통한 구조화된 출력(Structured Outputs) 자동 역직렬화',
        '자동 재시도 및 지수 백오프(Exponential Backoff)를 통한 네트워크 복원력 내장',
      ],
      useCases: [
        'AI 기반 챗봇, 자동화 코딩 에이전트, 대화형 백엔드 서비스를 구축하는 풀스택 엔지니어',
      ],
      quickStart: {
        installCommand: 'npm install @anthropic-ai/sdk',
        codeSnippet: 'import Anthropic from "@anthropic-ai/sdk";\nconst anthropic = new Anthropic();\nconst message = await anthropic.messages.create({\n  model: "claude-3-5-sonnet-20241022",\n  max_tokens: 1024,\n  messages: [{ role: "user", content: "Hello!" }],\n});',
        language: 'typescript',
      },
      prosCons: {
        strengths: ['공식 지원을 통한 Claude 최신 기능 즉각 반영', '완벽한 TypeScript 타입 힌트'],
        considerations: ['API 토큰 비용 및 Rate Limit 모니터링 필요'],
      },
    },
  },
  {
    id: 'ollama/ollama',
    owner: 'ollama',
    repo: 'ollama',
    url: 'https://github.com/ollama/ollama',
    description: 'Get up and running with Llama 3.3, Mistral, Gemma 2, and other large language models locally.',
    language: 'Go',
    stars: 112000,
    forks: 9800,
    starsPeriod: 1540,
    since: 'daily',
    summaryKo: '내 로컬 PC에서 Llama 3, Gemma 등 대형 오픈소스 LLM을 단 몇 초 만에 실행할 수 있는 오픈소스 도구',
    keyFeaturesKo: [
      'macOS, Linux, Windows 원클릭 설치 및 백그라운드 서비스 구동',
      'REST API 및 OpenAI 호환 엔드포인트 제공',
      'GPU(Metal, CUDA, ROCm) 가속 자동 감지'
    ],
    tags: ['AI', 'LLM', 'Go', 'LocalAI'],
    report: {
      overview: 'Ollama는 복잡한 가상환경이나 드라이버 설정 없이, Docker처럼 명령어 한 줄로 오픈소스 대형 언어 모델을 로컬 장비에서 구동하고 서빙하는 도구입니다.',
      background: 'GGUF 포맷 모델을 llama.cpp로 컴파일하고 GPU 가속을 매핑하는 기존 오픈소스 LLM 구동 과정의 높은 기술적 장벽을 해소하기 위해 만들어졌습니다.',
      architecture: [
        'Go 언어 기반의 경량 백엔드와 llama.cpp C++ 엔진의 유기적 결합',
        'Apple Silicon(Metal), NVIDIA(CUDA), AMD(ROCm) 가속기를 자동 탐지 및 메모리 레이어 오프로딩',
        'OpenAI API 규격(/v1/chat/completions) 호환 로컬 HTTP 서버 자동 구동',
      ],
      useCases: [
        '민감한 데이터 보안으로 인해 클라우드 LLM API를 사용할 수 없는 기업 내부 인프라',
        '로컬 개발 환경에서 무료로 무제한 프롬프트 테스트 및 에이전트 실험을 수행하려는 개발자',
      ],
      quickStart: {
        installCommand: 'curl -fsSL https://ollama.com/install.sh | sh',
        codeSnippet: 'ollama run llama3.2',
        language: 'bash',
      },
      prosCons: {
        strengths: ['압도적으로 쉬운 사용성', '풍부한 오픈소스 모델 라이브러리'],
        considerations: ['최신 GPU VRAM 용량에 따라 실행 가능한 모델 파라미터 크기 제한'],
      },
    },
  },
  {
    id: 'vllm-project/vllm',
    owner: 'vllm-project',
    repo: 'vllm',
    url: 'https://github.com/vllm-project/vllm',
    description: 'A high-throughput and memory-efficient LLM serving engine.',
    language: 'Python',
    stars: 36000,
    forks: 5800,
    starsPeriod: 620,
    since: 'daily',
    summaryKo: 'PagedAttention 알고리즘을 도입해 GPU 메모리 낭비를 줄이고 서빙 처리량을 극대화한 고성능 LLM 추론 엔진',
    keyFeaturesKo: [
      '기존 Hugging Face 대비 최대 24배 높은 서빙 처리량(Throughput)',
      'PagedAttention 메모리 관리 기법으로 KV 캐시 메모리 파편화 해결',
      'OpenAI 호환 API 서버 기본 내장'
    ],
    tags: ['AI', 'Python', 'Machine Learning', 'Server'],
    report: {
      overview: 'vLLM은 운영체제의 가상 메모리 페이징 기법에서 착안한 PagedAttention 알고리즘으로 LLM 추론 시 GPU KV 캐시 낭비를 제거하여 서빙 처리량을 극대화한 엔진입니다.',
      background: 'LLM 생성 과정에서 Attention KV 캐시가 고정 길이로 사전 할당되어 GPU VRAM의 60~80%가 파편화로 낭비되던 문제를 해결하고자 UC Berkeley 연구진이 개발했습니다.',
      architecture: [
        'PagedAttention: 불연속적인 물리 메모리 블록에 KV 캐시를 동적 할당하여 메모리 낭비율 4% 미만 달성',
        '연속 배치(Continuous Batching)를 통해 요청 도착 시간에 구애받지 않고 GPU 연산 효율 100% 활용',
        'Tensor Parallelism 및 분산 서빙 완벽 지원',
      ],
      useCases: [
        '초당 수백 건 이상의 동시 LLM 사용자 요청을 안정적으로 처리해야 하는 SaaS 프로덕션 서비스',
      ],
      quickStart: {
        installCommand: 'pip install vllm',
        codeSnippet: 'vllm serve meta-llama/Llama-3-8B-Instruct --port 8000',
        language: 'bash',
      },
      prosCons: {
        strengths: ['상용 배포 시 압도적인 GPU 인프라 비용 절감', '광범위한 오픈소스 모델 생태계 지원'],
        considerations: ['분산 환경 설정 시 네트워크 레이턴시 및 GPU 토폴로지 구성 지식 필요'],
      },
    },
  },
  {
    id: 'tldraw/tldraw',
    owner: 'tldraw',
    repo: 'tldraw',
    url: 'https://github.com/tldraw/tldraw',
    description: 'A collaborative digital canvas written in TypeScript.',
    language: 'TypeScript',
    stars: 38500,
    forks: 3200,
    starsPeriod: 890,
    since: 'weekly',
    summaryKo: '실시간 협업이 가능한 직관적이고 미려한 무한 캔버스 화이트보드 React 라이브러리',
    keyFeaturesKo: [
      '자유로운 핸드 드로잉, 다이어그램, 텍스트 및 스티커 메모 지원',
      '어떤 웹 애플리케이션에도 손쉽게 임베드할 수 있는 React 컴포넌트 제공',
      '멀티플레이어 실시간 동기화 엔진 내장'
    ],
    tags: ['Canvas', 'Whiteboard', 'React', 'TypeScript'],
    report: {
      overview: 'tldraw는 웹 애플리케이션 내에 피그마/미로 스타일의 무한 화이트보드 캔버스를 단 몇 줄의 React 컴포넌트로 임베딩할 수 있는 협업 캔버스 SDK입니다.',
      background: '웹 기반 드로잉 툴을 바닥부터 구현할 때 겪는 벡터 지오메트리 계산, 줌/팬 제어, 멀티플레이어 충돌 해결의 높은 복잡도를 해결하기 위해 탄생했습니다.',
      architecture: [
        '반응형 상태 저장소 TLShape 및 Store를 기반으로 한 선언적 컴포넌트 렌더링',
        'CRDT(Conflict-free Replicated Data Types) 개념을 접목한 실시간 피어 간 상태 동기화 구조',
        '완전한 커스텀 도형(Custom Shapes), 툴바, 컨텍스트 메뉴 오버라이드 지원',
      ],
      useCases: [
        '화이트보드 기능이나 다이어그램 그리기 기능이 필요한 에듀테크 및 협업 SaaS',
      ],
      quickStart: {
        installCommand: 'npm install tldraw',
        codeSnippet: 'import { Tldraw } from "tldraw";\nimport "tldraw/tldraw.css";\n\nexport default function App() {\n  return <div style={{ position: "fixed", inset: 0 }}><Tldraw /></div>;\n}',
        language: 'typescript',
      },
      prosCons: {
        strengths: ['미려한 인터랙션과 완성도 높은 기본 UI', '손쉬운 React 임베딩'],
        considerations: ['대규모 수만 개 도형 렌더링 시 최적화 튜닝 필요'],
      },
    },
  },
  {
    id: 'valkey-io/valkey',
    owner: 'valkey-io',
    repo: 'valkey',
    url: 'https://github.com/valkey-io/valkey',
    description: 'A flexible distributed key-value datastore that supports various data structures.',
    language: 'C',
    stars: 18900,
    forks: 1100,
    starsPeriod: 450,
    since: 'weekly',
    summaryKo: 'Linux Foundation 주도로 Redis 라이선스 변경 이후 탄생한 완전 오픈소스(BSD) 인메모리 NoSQL 키-값 저장소',
    keyFeaturesKo: [
      '기존 Redis 프로토콜 및 데이터 구조 100% 호환',
      '멀티 스레드 I/O 최적화를 통한 높은 처리 성능',
      '클러스터링, 복제, 지속성(RDB/AOF) 완벽 지원'
    ],
    tags: ['Database', 'NoSQL', 'In-Memory', 'C'],
    report: {
      overview: 'Valkey는 Redis의 라이선스 전환(RSALv2/SSPL)에 대응하여 Linux Foundation 하에 주요 테크 기업들이 결성한 100% 오픈소스(BSD-3) 인메모리 키-값 데이터베이스입니다.',
      background: '글로벌 엔터프라이즈 환경에서 Redis 생태계의 영구적인 자유 소프트웨어 보장과 벤더 락인 방지를 위해 시작되었습니다.',
      architecture: [
        'Redis 7.2.4 소스코드에서 포크되어 기존 프로토콜, 클라이언트 SDK, RDB/AOF 파일과 100% 드롭인 호환',
        '비동기 멀티스레드 네트워크 I/O 엔진 고도화로 높은 동시성 처리량 유지',
        'AWS, Google Cloud, Oracle, Ericsson 등 주요 클라우드 및 벤더의 공동 거버넌스 운영',
      ],
      useCases: [
        '기존 Redis 인스턴스를 무중단 및 코드 수정 없이 순수 오픈소스로 교체하려는 시스템 인프라',
      ],
      quickStart: {
        installCommand: 'docker run -d --name valkey -p 6379:6379 valkey/valkey:latest',
        codeSnippet: 'docker exec -it valkey valkey-cli ping\n# PONG',
        language: 'bash',
      },
      prosCons: {
        strengths: ['기존 Redis 생태계와의 완벽한 호환성', '대기업들의 탄탄한 장기 후원 및 중립적 거버넌스'],
        considerations: ['추후 독자적인 신규 기능 추가 시 Redis 최신 상용 버전과의 분기 가능성'],
      },
    },
  },
  {
    id: 'biomejs/biome',
    owner: 'biomejs',
    repo: 'biome',
    url: 'https://github.com/biomejs/biome',
    description: 'A toolchain for web development, offering formatter, linter, and more in a fraction of a second.',
    language: 'Rust',
    stars: 17500,
    forks: 650,
    starsPeriod: 720,
    since: 'monthly',
    summaryKo: 'Prettier와 ESLint를 대체하는 Rust 기반의 번개처럼 빠른 통합 포매터 및 린터',
    keyFeaturesKo: [
      'Prettier 대비 최대 25~30배 빠른 코드 포매팅 속도',
      '설정 파일 하나로 포매터와 린터를 동시에 제어',
      'VS Code 확장 프로그램 및 풍부한 진단 메시지'
    ],
    tags: ['Linter', 'Formatter', 'Rust', 'DevTools'],
    report: {
      overview: 'Biome은 JavaScript, TypeScript, JSX, JSON, CSS를 단 하나의 도구로 수십 배 빠르게 포매팅하고 린팅하는 Rust 기반 통합 툴체인입니다.',
      background: 'Node.js 기반의 Prettier와 ESLint가 대규모 코드베이스에서 수 분의 CI 시간을 소모하고 설정 충돌을 야기하던 문제를 해결하기 위해 개발되었습니다.',
      architecture: [
        '오류 복원력이 뛰어난 Rust 파서(Parser)를 내장하여 불완전한 문법 상태에서도 안전하게 동작',
        '단일 AST(Abstract Syntax Tree) 순회로 포매팅과 린트를 한 번에 수행하여 메모리/연산 비용 절감',
        'Prettier 문법과의 97% 이상 호환성 달성',
      ],
      useCases: [
        '수백만 줄의 JS/TS 모노레포에서 CI 정적 분석 시간을 단축하려는 프론트엔드 팀',
      ],
      quickStart: {
        installCommand: 'npm install --save-dev --save-exact @biomejs/biome',
        codeSnippet: 'npx @biomejs/biome init\nnpx @biomejs/biome check --write ./src',
        language: 'bash',
      },
      prosCons: {
        strengths: ['경이로운 속도(CI 시간 최대 90% 절약)', '간결한 설정 파일(biome.json) 하나로 통합'],
        considerations: ['일부 특수한 서드파티 ESLint 플러그인 생태계는 미지원'],
      },
    },
  }
];

export function generateMockSnapshot(date = '2026-10-17'): TrendSnapshot {
  const languages = Array.from(new Set(MOCK_TRENDING_ITEMS.map((item) => item.language))).sort();
  return {
    date,
    collectedAt: new Date().toISOString(),
    languages: ['All', ...languages],
    items: MOCK_TRENDING_ITEMS,
  };
}
