import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import './DevTerminal.css';

const ASCII_LOGO = [
  '  ____              __     ___ _',
  ' |  _ \\  _____   __\\ \\   / (_) |__   ___',
  ' | | | |/ _ \\ \\ / / \\ \\ / /| | \'_ \\ / _ \\',
  ' | |_| |  __/\\ V /   \\ V / | | |_) |  __/',
  ' |____/ \\___| \\_/     \\_/  |_|_.__/ \\___|',
];

const buildCommands = (lang) => ({
  help: () => (lang === 'en' ? [
    'Available commands:',
    '',
    '  about       — About Dev.Vibe',
    '  services    — Services offered',
    '  skills      — Tech stack',
    '  stack       — System architecture',
    '  contact     — Contact info',
    '  whoami      — Visitor info',
    '  joke        — Developer joke',
    '  clear       — Clear the screen',
    '',
    'Press Tab or click a chip above to enter a command.',
  ] : [
    'Available commands:',
    '',
    '  about       — Dev.Vibe 소개',
    '  services    — 제공 서비스',
    '  skills      — 기술 스택',
    '  stack       — 시스템 구성',
    '  contact     — 연락처',
    '  whoami      — 방문자 정보',
    '  joke        — 개발자 농담',
    '  clear       — 화면 지우기',
    '',
    'Tab 또는 위 칩을 클릭해서도 입력할 수 있습니다.',
  ]),
  about: () => [
    ...ASCII_LOGO,
    '',
    lang === 'en' ? '> Freelance dev collective' : '> 프리랜서 개발 콜렉티브',
    lang === 'en' ? '> From planning to deployment — built full-stack.' : '> 기획부터 배포까지, 풀스택으로 만듭니다.',
    '> Stack: React · Node · Python · Flutter · AWS',
  ],
  services: () => [
    '+------------------+-----------------------+',
    '| Service          | Description           |',
    '+------------------+-----------------------+',
    '| Web Development  | React, Next.js        |',
    '| App Development  | React Native, Flutter |',
    '| Backend / API    | Node.js, Python       |',
    '| UI/UX Design     | Figma, Prototyping    |',
    '+------------------+-----------------------+',
  ],
  skills: () => [
    'frontend  : React · Next.js · TypeScript · Tailwind',
    'backend   : Node.js · Python · Go · PostgreSQL',
    'mobile    : React Native · Flutter · Swift',
    'devops    : AWS · Docker · GitHub Actions · Vercel',
    '',
    'cal: 96% — calibrated this quarter',
  ],
  stack: () => [
    '┌─ client ──────────┐    ┌─ edge ────────┐',
    '│ React 18 / Next   │ -> │ Vercel / CF    │',
    '└───────────────────┘    └────────┬───────┘',
    '                                  │',
    '┌─ services ────────┐    ┌────────┴───────┐',
    '│ Node 20 · Python  │ <- │ API Gateway    │',
    '└─────────┬─────────┘    └────────────────┘',
    '          │',
    '┌─────────┴─────────┐',
    '│ Postgres · Redis  │',
    '└───────────────────┘',
  ],
  contact: () => [
    '✉  email   : roqkfwkwlgh@naver.com',
    '☎  phone   : 010-8975-2847',
    '⌨  github  : github.com/JIHOJ-U/JIHOJ-U',
    '',
    lang === 'en' ? '→ or submit the form on the /contact page' : '→ 또는 /contact 페이지에서 폼 제출',
  ],
  whoami: () => {
    const now = new Date();
    return [
      'visitor@devvibe',
      `session   : ${now.toISOString().slice(0, 19).replace('T', ' ')}`,
      `viewport  : ${typeof window !== 'undefined' ? `${window.innerWidth} x ${window.innerHeight}` : 'unknown'}`,
      `referrer  : ${typeof document !== 'undefined' && document.referrer ? document.referrer : 'direct'}`,
      'status    : curious 👀',
    ];
  },
  joke: () => {
    const jokes = lang === 'en' ? [
      ['Q: Why do programmers prefer dark mode?', 'A: Because light attracts bugs.'],
      ["Q: What's a programmer's hardest task?", 'A: Naming variables.'],
      ['Q: Why was the function feeling down?', "A: It never got called."],
      ['Q: Why do programmers lose sleep?', 'A: They got stuck in an infinite loop.'],
    ] : [
      ['Q: 개발자가 어두운 모드를 좋아하는 이유?', 'A: 빛에 버그가 꼬이니까.'],
      ['Q: 개발자에게 가장 어려운 것은?', 'A: 변수 이름 짓기.'],
      ['Q: 함수가 두 개인 친구는?', 'A: 양함수 친구.'],
      ['Q: 개발자가 잠을 못 자는 이유는?', 'A: 무한 루프에 빠져서.'],
    ];
    return jokes[Math.floor(Math.random() * jokes.length)];
  },
  ls: () => ['about  services  skills  stack  contact  joke'],
  pwd: () => ['/home/visitor/devvibe'],
  date: () => [new Date().toString()],
  clear: () => 'CLEAR',
  exit: () => ['nice try. you cannot leave the vibe.'],
});

const SUGGESTIONS = ['help', 'about', 'services', 'skills', 'stack', 'contact', 'joke'];

function DevTerminal() {
  const { lang } = useLanguage();
  const COMMANDS = useMemo(() => buildCommands(lang), [lang]);
  const [history, setHistory] = useState([]);
  const [input, setInput] = useState('');
  const [booted, setBooted] = useState(false);
  const [cmdHistory, setCmdHistory] = useState([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const bodyRef = useRef(null);
  const inputRef = useRef(null);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !booted) {
          runBoot();
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [booted]);

  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [history, booted]);

  const runBoot = () => {
    const lines = [
      { text: '[  OK  ] initializing dev.vibe shell...', d: 250 },
      { text: '[  OK  ] loading capability modules', d: 200 },
      { text: '[  OK  ] secure handshake established', d: 250 },
      { text: '', d: 80 },
      { text: 'welcome — type "help" or click a chip below.', d: 100 },
      { text: '', d: 50 },
    ];
    let acc = 0;
    lines.forEach((line, i) => {
      acc += line.d;
      setTimeout(() => {
        setHistory((h) => [...h, { type: 'boot', text: line.text }]);
        if (i === lines.length - 1) {
          setTimeout(() => setBooted(true), 200);
        }
      }, acc);
    });
  };

  const runCommand = (raw) => {
    const cmd = raw.trim();
    if (!cmd) return;

    setCmdHistory((h) => [cmd, ...h].slice(0, 30));
    setHistoryIdx(-1);

    const lower = cmd.toLowerCase();
    setHistory((h) => [...h, { type: 'input', text: cmd }]);

    if (lower === 'clear') {
      setTimeout(() => setHistory([]), 80);
      return;
    }

    const handler = COMMANDS[lower];
    if (handler) {
      const out = handler();
      out.forEach((line, i) => {
        setTimeout(() => {
          setHistory((h) => [...h, { type: 'output', text: line }]);
        }, 70 + i * 50);
      });
    } else {
      setTimeout(() => {
        setHistory((h) => [
          ...h,
          { type: 'error', text: `command not found: ${cmd}` },
          { type: 'output', text: '> try "help" for available commands.' },
        ]);
      }, 80);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    runCommand(input);
    setInput('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      const next = Math.min(historyIdx + 1, cmdHistory.length - 1);
      if (cmdHistory[next] !== undefined) {
        setInput(cmdHistory[next]);
        setHistoryIdx(next);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const next = Math.max(historyIdx - 1, -1);
      setHistoryIdx(next);
      setInput(next === -1 ? '' : cmdHistory[next] || '');
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const matches = Object.keys(COMMANDS).filter((c) => c.startsWith(input.toLowerCase()));
      if (matches.length === 1) setInput(matches[0]);
    }
  };

  return (
    <div className="dev-terminal" ref={wrapperRef}>
      <div className="dev-terminal__header">
        <div className="dev-terminal__lights">
          <span /><span /><span />
        </div>
        <span className="dev-terminal__title">visitor@devvibe — zsh — 80×24</span>
        <span className="dev-terminal__status">
          <i /> connected
        </span>
      </div>

      <div
        className="dev-terminal__body"
        ref={bodyRef}
        onClick={() => inputRef.current?.focus()}
      >
        {history.map((line, i) => (
          <div key={i} className={`dt-line dt-line--${line.type}`}>
            {line.type === 'input' && (
              <span className="dt-prompt">visitor@devvibe <span className="dt-prompt__sep">~</span> $</span>
            )}
            <pre className="dt-text">{line.text || ' '}</pre>
          </div>
        ))}

        {booted && (
          <form className="dt-form" onSubmit={handleSubmit}>
            <span className="dt-prompt">visitor@devvibe <span className="dt-prompt__sep">~</span> $</span>
            <input
              ref={inputRef}
              type="text"
              className="dt-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
              spellCheck={false}
              autoComplete="off"
              autoCapitalize="off"
            />
            <span className="dt-cursor" />
          </form>
        )}
      </div>

      <div className="dev-terminal__chips">
        <span className="dev-terminal__chip-label">$ try:</span>
        {SUGGESTIONS.map((cmd) => (
          <button
            key={cmd}
            className="dev-terminal__chip"
            onClick={() => {
              runCommand(cmd);
              inputRef.current?.focus();
            }}
          >
            {cmd}
          </button>
        ))}
      </div>
    </div>
  );
}

export default DevTerminal;
