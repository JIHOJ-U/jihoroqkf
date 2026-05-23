import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'devvibe_achievements';

export const ACHIEVEMENTS = {
  CMDK_USED: { id: 'CMDK_USED', icon: '⌨️', title: 'Power User', desc: { ko: 'Cmd+K 커맨드 팔레트 첫 사용', en: 'First use of the Cmd+K command palette' } },
  KONAMI: { id: 'KONAMI', icon: '🎮', title: 'Cheat Code', desc: { ko: 'Konami code 발견!', en: 'Found the Konami code!' } },
  TERMINAL_5_CMDS: { id: 'TERMINAL_5_CMDS', icon: '📟', title: 'Terminal Master', desc: { ko: '터미널에서 명령어 5개 실행', en: 'Ran 5 commands in the terminal' } },
  THEME_TOGGLED: { id: 'THEME_TOGGLED', icon: '🌙', title: 'Night Owl', desc: { ko: '다크/라이트 모드 전환', en: 'Toggled dark / light mode' } },
  ALL_PAGES: { id: 'ALL_PAGES', icon: '🗺️', title: 'Explorer', desc: { ko: '모든 메인 페이지 방문', en: 'Visited every main page' } },
  CONSOLE_OPENED: { id: 'CONSOLE_OPENED', icon: '🖥️', title: 'Curious Mind', desc: { ko: '개발자 콘솔 열기', en: 'Opened the developer console' } },
  PORTFOLIO_VIEWED: { id: 'PORTFOLIO_VIEWED', icon: '👁️', title: 'Portfolio Stalker', desc: { ko: '포트폴리오 상세 페이지 열람', en: 'Viewed a portfolio detail page' } },
  QUOTE_USED: { id: 'QUOTE_USED', icon: '💰', title: 'Smart Buyer', desc: { ko: '견적 계산기 사용', en: 'Used the quote calculator' } },
  LANG_SWITCHED: { id: 'LANG_SWITCHED', icon: '🌐', title: 'Polyglot', desc: { ko: '언어 전환', en: 'Switched language' } },
  CODE_COPIED: { id: 'CODE_COPIED', icon: '📋', title: 'Code Collector', desc: { ko: '코드 스니펫 복사', en: 'Copied a code snippet' } },
};

const AchievementContext = createContext();

export function AchievementProvider({ children }) {
  const [unlocked, setUnlocked] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch (e) { return {}; }
  });
  const [recent, setRecent] = useState(null); // {id, ts}

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(unlocked));
  }, [unlocked]);

  const unlock = useCallback((id) => {
    if (!ACHIEVEMENTS[id]) return;
    setUnlocked(prev => {
      if (prev[id]) return prev;
      const ach = ACHIEVEMENTS[id];
      setRecent({ ...ach, ts: Date.now() });
      return { ...prev, [id]: { unlockedAt: new Date().toISOString() } };
    });
  }, []);

  const dismissRecent = useCallback(() => setRecent(null), []);

  const reset = useCallback(() => {
    setUnlocked({});
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const totalCount = Object.keys(ACHIEVEMENTS).length;
  const unlockedCount = Object.keys(unlocked).length;

  return (
    <AchievementContext.Provider value={{ unlocked, unlock, recent, dismissRecent, reset, totalCount, unlockedCount }}>
      {children}
    </AchievementContext.Provider>
  );
}

export function useAchievement() {
  const ctx = useContext(AchievementContext);
  if (!ctx) throw new Error('useAchievement must be used within AchievementProvider');
  return ctx;
}
