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
    expect(screen.getByText(/uv는 기존 pip 및 virtualenv의 느린 설치 속도/)).toBeInTheDocument();
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

  it('supports copying markdown report to clipboard', () => {
    const writeTextMock = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, {
      clipboard: {
        writeText: writeTextMock,
      },
    });

    render(<TechReportModal item={mockItem} isOpen={true} onClose={() => {}} />);

    const copyBtn = screen.getByRole('button', { name: /마크다운 복사/i });
    fireEvent.click(copyBtn);

    expect(writeTextMock).toHaveBeenCalled();
    const calledText = writeTextMock.mock.calls[0][0];
    expect(calledText).toContain('# 1-Page Tech Report: astral-sh/uv');
    expect(calledText).toContain('## 1. Executive Summary');
  });
});
