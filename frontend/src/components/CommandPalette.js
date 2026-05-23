import React, { useEffect, useState, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiSearch, HiHome, HiCode, HiUser, HiMail, HiTerminal, HiSun, HiMoon, HiGlobe, HiDocumentText, HiLockClosed } from 'react-icons/hi';
import { FaGithub, FaBlog } from 'react-icons/fa';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useAchievement } from '../contexts/AchievementContext';
import './CommandPalette.css';

const ADMIN_KEY = 'wnwlgh0719';
const STORAGE_KEY = 'joe_dev_admin_auth';

const COPY = {
  ko: {
    placeholder: '명령어 또는 페이지 검색...',
    noResultPre: '"', noResultPost: '"에 대한 결과가 없습니다.',
    fNav: '탐색', fRun: '실행', fClose: '닫기', fToggle: '토글',
    cmd: {
      home: { label: '홈으로 이동', hint: 'Home' },
      about: { label: 'About 페이지', hint: '소개' },
      portfolio: { label: 'Portfolio 페이지', hint: '포트폴리오 목록' },
      contact: { label: 'Contact 페이지', hint: '프로젝트 문의' },
      terminal: '터미널 열기',
      privacy: '개인정보처리방침',
      admin: '관리자 (문의 관리)',
      portfolioNew: '포트폴리오 등록',
      adminLogout: '관리자 로그아웃',
      themeLight: '라이트 모드로 전환', themeDark: '다크 모드로 전환',
      langKo: '한국어로 전환', langEn: 'Switch to English',
      github: 'GitHub 프로필', blog: '네이버 블로그', email: '이메일 보내기',
    },
  },
  en: {
    placeholder: 'Search commands or pages...',
    noResultPre: 'No results for "', noResultPost: '"',
    fNav: 'Navigate', fRun: 'Run', fClose: 'Close', fToggle: 'Toggle',
    cmd: {
      home: { label: 'Go to Home', hint: 'Home' },
      about: { label: 'About page', hint: 'About' },
      portfolio: { label: 'Portfolio page', hint: 'Project list' },
      contact: { label: 'Contact page', hint: 'Project inquiry' },
      terminal: 'Open terminal',
      privacy: 'Privacy Policy',
      admin: 'Admin (manage inquiries)',
      portfolioNew: 'Add portfolio',
      adminLogout: 'Admin logout',
      themeLight: 'Switch to light mode', themeDark: 'Switch to dark mode',
      langKo: '한국어로 전환', langEn: 'Switch to English',
      github: 'GitHub profile', blog: 'Naver blog', email: 'Send email',
    },
  },
};

function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAdminAuth, setIsAdminAuth] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const { theme, toggle: toggleTheme } = useTheme();
  const { lang, setLang } = useLanguage();
  const c = COPY[lang] || COPY.ko;
  const L = c.cmd;
  const { unlock } = useAchievement();

  // Check admin auth state when palette opens
  useEffect(() => {
    if (open) {
      setIsAdminAuth(localStorage.getItem(STORAGE_KEY) === ADMIN_KEY);
    }
  }, [open]);

  const commands = useMemo(() => {
    const base = [
      { id: 'home', label: L.home.label, hint: L.home.hint, icon: <HiHome />, action: () => navigate('/'), category: 'NAV' },
      { id: 'about', label: L.about.label, hint: L.about.hint, icon: <HiUser />, action: () => navigate('/about'), category: 'NAV' },
      { id: 'portfolio', label: L.portfolio.label, hint: L.portfolio.hint, icon: <HiCode />, action: () => navigate('/portfolio'), category: 'NAV' },
      { id: 'contact', label: L.contact.label, hint: L.contact.hint, icon: <HiMail />, action: () => navigate('/contact'), category: 'NAV' },
      { id: 'terminal', label: L.terminal, hint: '/terminal', icon: <HiTerminal />, action: () => navigate('/terminal'), category: 'NAV' },
      { id: 'privacy', label: L.privacy, hint: '/privacy', icon: <HiDocumentText />, action: () => navigate('/privacy'), category: 'NAV' },
    ];

    // Admin entries only shown when already authenticated
    if (isAdminAuth) {
      base.push(
        { id: 'admin', label: L.admin, hint: '/admin', icon: <HiLockClosed />, action: () => navigate('/admin'), category: 'NAV' },
        { id: 'portfolio-new', label: L.portfolioNew, hint: '/portfolio/new', icon: <HiCode />, action: () => navigate('/portfolio/new'), category: 'NAV' },
        { id: 'admin-logout', label: L.adminLogout, hint: 'logout', icon: <HiLockClosed />, action: () => {
          localStorage.removeItem(STORAGE_KEY);
          setIsAdminAuth(false);
        }, category: 'ACTION' }
      );
    }

    return base.concat(commonExtras());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate, theme, toggleTheme, setLang, isAdminAuth, lang]);

  function commonExtras() {
    return [
      { id: 'theme', label: theme === 'dark' ? L.themeLight : L.themeDark, hint: 'Theme', icon: theme === 'dark' ? <HiSun /> : <HiMoon />, action: toggleTheme, category: 'ACTION' },
      { id: 'lang-ko', label: L.langKo, hint: 'KR', icon: <HiGlobe />, action: () => setLang('ko'), category: 'ACTION' },
      { id: 'lang-en', label: L.langEn, hint: 'EN', icon: <HiGlobe />, action: () => setLang('en'), category: 'ACTION' },

      { id: 'github', label: L.github, hint: 'github.com/JIHOJ-U', icon: <FaGithub />, action: () => window.open('https://github.com/JIHOJ-U/JIHOJ-U', '_blank'), category: 'EXTERNAL' },
      { id: 'blog', label: L.blog, hint: 'blog.naver.com/longnight0719', icon: <FaBlog />, action: () => window.open('https://blog.naver.com/longnight0719', '_blank'), category: 'EXTERNAL' },
      { id: 'email', label: L.email, hint: 'roqkfwkwlgh@naver.com', icon: <HiMail />, action: () => window.location.href = 'mailto:roqkfwkwlgh@naver.com', category: 'EXTERNAL' },
    ];
  }

  const filtered = useMemo(() => {
    if (!query) return commands;
    const q = query.toLowerCase();
    return commands.filter(c =>
      c.label.toLowerCase().includes(q) ||
      c.hint.toLowerCase().includes(q) ||
      c.id.toLowerCase().includes(q)
    );
  }, [query, commands]);

  // Keyboard shortcut to open
  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(prev => !prev);
        setQuery('');
        setActiveIndex(0);
        unlock('CMDK_USED');
      }
      if (e.key === 'Escape' && open) {
        setOpen(false);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open]);

  // Focus input when open
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  // Reset active index when filter changes
  useEffect(() => { setActiveIndex(0); }, [query]);

  const runCommand = (cmd) => {
    cmd.action();
    setOpen(false);
    setQuery('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(i => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(i => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const cmd = filtered[activeIndex];
      if (cmd) runCommand(cmd);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="cmdk-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setOpen(false)}
        >
          <motion.div
            className="cmdk-modal"
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.15 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="cmdk-input-wrap">
              <HiSearch className="cmdk-search-icon" />
              <input
                ref={inputRef}
                type="text"
                placeholder={c.placeholder}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                className="cmdk-input"
              />
              <kbd className="cmdk-esc">ESC</kbd>
            </div>

            <div className="cmdk-list">
              {filtered.length === 0 ? (
                <div className="cmdk-empty">
                  <span>{c.noResultPre}<strong>{query}</strong>{c.noResultPost}</span>
                </div>
              ) : (
                ['NAV', 'ACTION', 'EXTERNAL'].map(cat => {
                  const items = filtered.filter(c => c.category === cat);
                  if (items.length === 0) return null;
                  const labels = { NAV: 'Navigation', ACTION: 'Actions', EXTERNAL: 'External' };
                  return (
                    <div key={cat} className="cmdk-group">
                      <div className="cmdk-group-label">{labels[cat]}</div>
                      {items.map((cmd) => {
                        const idx = filtered.indexOf(cmd);
                        return (
                          <button
                            key={cmd.id}
                            className={`cmdk-item ${idx === activeIndex ? 'active' : ''}`}
                            onMouseEnter={() => setActiveIndex(idx)}
                            onClick={() => runCommand(cmd)}
                          >
                            <span className="cmdk-icon">{cmd.icon}</span>
                            <span className="cmdk-label">{cmd.label}</span>
                            <span className="cmdk-hint">{cmd.hint}</span>
                          </button>
                        );
                      })}
                    </div>
                  );
                })
              )}
            </div>

            <div className="cmdk-footer">
              <span><kbd>↑↓</kbd> {c.fNav}</span>
              <span><kbd>↵</kbd> {c.fRun}</span>
              <span><kbd>ESC</kbd> {c.fClose}</span>
              <span className="cmdk-footer-right">
                <kbd>Ctrl</kbd> + <kbd>K</kbd> {c.fToggle}
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default CommandPalette;
