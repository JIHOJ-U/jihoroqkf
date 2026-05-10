import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAchievement } from '../contexts/AchievementContext';
import './Terminal.css';

const PROMPT = 'visitor@devvibe:~$';

const FILES = {
  'about.txt': `안녕하세요, 풀스택 개발자입니다.
사용자 경험을 최우선으로 생각하며,
비즈니스 가치를 극대화하는 개발을 추구합니다.
기획부터 배포까지, 프로젝트의 모든 단계를 함께합니다.`,
  'skills.json': JSON.stringify({
    frontend: ['React', 'Next.js', 'Vue.js', 'TypeScript', 'Tailwind'],
    backend: ['Node.js', 'Express', 'Python', 'GraphQL'],
    database: ['MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'Firebase'],
    mobile: ['React Native', 'Flutter'],
    devops: ['Docker', 'AWS', 'Vercel', 'Git']
  }, null, 2),
  'contact.txt': `📧 Email   : roqkfwkwlgh@naver.com
☎  Phone   : 010-8975-2847
💬 GitHub  : https://github.com/JIHOJ-U
📝 Blog    : https://blog.naver.com/longnight0719
📍 Location: 경기도 안양시 (원격 작업 가능)`,
  'experience.md': `# Experience
- 50+ 프로젝트 완수
- 3+ 년 풀스택 개발 경력
- 99% 클라이언트 만족도

## Recent
- 렌트/리스 플랫폼 웹 개발 (Vue.js / Node.js / MySQL)
- ...더 보려면 'cat portfolio.txt'`,
  'portfolio.txt': `포트폴리오는 /portfolio 페이지에서 확인하세요.
명령어: open portfolio`,
};

const COMMANDS = {
  help: () => [
    { type: 'output', text: '사용 가능한 명령어:' },
    { type: 'output', text: '  help          - 이 도움말 표시' },
    { type: 'output', text: '  whoami        - 운영자 정보' },
    { type: 'output', text: '  ls            - 파일 목록' },
    { type: 'output', text: '  cat <file>    - 파일 내용 보기' },
    { type: 'output', text: '  pwd           - 현재 위치' },
    { type: 'output', text: '  date          - 현재 시간' },
    { type: 'output', text: '  echo <text>   - 텍스트 출력' },
    { type: 'output', text: '  open <page>   - 페이지 이동 (home/about/portfolio/contact)' },
    { type: 'output', text: '  theme         - 다크/라이트 모드 전환' },
    { type: 'output', text: '  history       - 명령 기록' },
    { type: 'output', text: '  clear         - 화면 지우기' },
    { type: 'output', text: '  matrix        - 매트릭스 모드 (← → 종료)' },
    { type: 'output', text: '  sudo          - 슈퍼유저 권한 시도 😏' },
    { type: 'output', text: '  exit          - 홈으로' },
  ],
  whoami: () => [
    { type: 'output', text: '┌──────────────────────────────────────┐' },
    { type: 'output', text: '│  DeVibe — Freelance Full-Stack Dev   │' },
    { type: 'output', text: '│  React · Node · Vue · Flutter · AWS  │' },
    { type: 'output', text: '└──────────────────────────────────────┘' },
  ],
  ls: () => [
    { type: 'output', text: 'about.txt  skills.json  contact.txt  experience.md  portfolio.txt' },
  ],
  pwd: () => [{ type: 'output', text: '/home/visitor' }],
  date: () => [{ type: 'output', text: new Date().toString() }],
  history: (history) => history.length === 0
    ? [{ type: 'output', text: '(empty)' }]
    : history.map((h, i) => ({ type: 'output', text: `${i + 1}  ${h}` })),
  sudo: () => [
    { type: 'error', text: 'visitor is not in the sudoers file. This incident will be reported.' },
    { type: 'output', text: '...just kidding 😄' },
  ],
};

function Terminal() {
  const navigate = useNavigate();
  const { unlock } = useAchievement();
  const [lines, setLines] = useState([
    { type: 'system', text: '┌─────────────────────────────────────────────────┐' },
    { type: 'system', text: '│  Welcome to Dev.Vibe Terminal v1.0.0            │' },
    { type: 'system', text: "│  Type 'help' to see available commands.         │" },
    { type: 'system', text: '└─────────────────────────────────────────────────┘' },
    { type: 'output', text: '' },
  ]);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const [matrix, setMatrix] = useState(false);
  const inputRef = useRef(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [lines]);

  // Matrix rain
  const canvasRef = useRef(null);
  useEffect(() => {
    if (!matrix) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const chars = '01ABCDEF{}[]<>/=$#'.split('');
    const cols = Math.floor(canvas.width / 14);
    const drops = Array(cols).fill(0).map(() => Math.random() * -100);
    let raf;
    const animate = () => {
      ctx.fillStyle = 'rgba(0,0,0,0.08)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = '14px Courier New';
      ctx.fillStyle = '#10b981';
      drops.forEach((y, i) => {
        const ch = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(ch, i * 14, y * 14);
        if (y * 14 > canvas.height && Math.random() > 0.975) drops[i] = 0;
        else drops[i] = y + 1;
      });
      raf = requestAnimationFrame(animate);
    };
    animate();
    const stop = (e) => {
      if (e.key === 'Escape' || e.key === 'ArrowLeft' || e.key === 'ArrowRight') setMatrix(false);
    };
    window.addEventListener('keydown', stop);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('keydown', stop);
    };
  }, [matrix]);

  const print = (newLines) => {
    setLines(prev => [...prev, ...newLines]);
  };

  const execute = (raw) => {
    const cmd = raw.trim();
    print([{ type: 'cmd', text: `${PROMPT} ${cmd}` }]);
    if (!cmd) return;

    setHistory(prev => {
      const next = [...prev, cmd];
      if (next.length >= 5) unlock('TERMINAL_5_CMDS');
      return next;
    });

    const [name, ...args] = cmd.split(/\s+/);

    if (name === 'clear') {
      setLines([]);
      return;
    }
    if (name === 'exit') {
      navigate('/');
      return;
    }
    if (name === 'echo') {
      print([{ type: 'output', text: args.join(' ') }]);
      return;
    }
    if (name === 'cat') {
      const file = args[0];
      if (!file) {
        print([{ type: 'error', text: 'cat: missing file operand' }]);
        return;
      }
      if (FILES[file]) {
        print(FILES[file].split('\n').map(t => ({ type: 'output', text: t })));
      } else {
        print([{ type: 'error', text: `cat: ${file}: No such file or directory` }]);
      }
      return;
    }
    if (name === 'open') {
      const map = { home: '/', about: '/about', portfolio: '/portfolio', contact: '/contact', admin: '/admin' };
      const page = args[0];
      if (map[page]) {
        print([{ type: 'output', text: `→ navigating to ${map[page]}...` }]);
        setTimeout(() => navigate(map[page]), 400);
      } else {
        print([{ type: 'error', text: `open: unknown page '${page}'. Try: home, about, portfolio, contact` }]);
      }
      return;
    }
    if (name === 'theme') {
      const root = document.documentElement;
      const cur = root.getAttribute('data-theme') || 'light';
      const next = cur === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      localStorage.setItem('devibe_theme', next);
      print([{ type: 'output', text: `theme: ${next} 🎨` }]);
      return;
    }
    if (name === 'matrix') {
      setMatrix(true);
      print([{ type: 'output', text: 'Entering the matrix... press ESC, ←, or → to exit' }]);
      return;
    }
    if (name === 'history') {
      print(COMMANDS.history(history));
      return;
    }

    if (COMMANDS[name]) {
      print(COMMANDS[name]());
      return;
    }

    print([{ type: 'error', text: `command not found: ${name}. Type 'help' for available commands.` }]);
  };

  const handleKey = (e) => {
    if (e.key === 'Enter') {
      execute(input);
      setInput('');
      setHistoryIdx(-1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length === 0) return;
      const next = historyIdx === -1 ? history.length - 1 : Math.max(0, historyIdx - 1);
      setHistoryIdx(next);
      setInput(history[next] || '');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIdx === -1) return;
      const next = historyIdx + 1;
      if (next >= history.length) {
        setHistoryIdx(-1);
        setInput('');
      } else {
        setHistoryIdx(next);
        setInput(history[next]);
      }
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault();
      setLines([]);
    }
  };

  return (
    <div className="terminal-page" onClick={() => inputRef.current?.focus()}>
      {matrix && <canvas ref={canvasRef} className="terminal-matrix" />}

      <div className="terminal-window">
        <div className="terminal-header">
          <span className="t-dot t-dot--red" />
          <span className="t-dot t-dot--yellow" />
          <span className="t-dot t-dot--green" />
          <span className="terminal-title">visitor@devvibe — bash — 80×24</span>
        </div>
        <div className="terminal-body">
          {lines.map((l, i) => (
            <div key={i} className={`t-line t-line--${l.type}`}>{l.text || ' '}</div>
          ))}
          <div className="t-input-line">
            <span className="t-prompt">{PROMPT}</span>
            <input
              ref={inputRef}
              type="text"
              className="t-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              autoFocus
              autoComplete="off"
              spellCheck="false"
            />
            <span className="t-cursor">▋</span>
          </div>
          <div ref={bottomRef} />
        </div>
      </div>
    </div>
  );
}

export default Terminal;
