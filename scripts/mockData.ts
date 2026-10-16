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
    tags: ['UI', 'TailwindCSS', 'React', 'TypeScript']
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
    tags: ['Python', 'Rust', 'DevOps', 'CLI']
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
    tags: ['AI', 'LLM', 'Claude', 'TypeScript']
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
    tags: ['AI', 'LLM', 'Go', 'LocalAI']
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
    tags: ['AI', 'Python', 'Machine Learning', 'Server']
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
    tags: ['Canvas', 'Whiteboard', 'React', 'TypeScript']
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
    tags: ['Database', 'NoSQL', 'In-Memory', 'C']
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
    tags: ['Linter', 'Formatter', 'Rust', 'DevTools']
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
