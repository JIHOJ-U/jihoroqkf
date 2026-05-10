import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'devvibe_achievements';

export const ACHIEVEMENTS = {
  CMDK_USED: { id: 'CMDK_USED', icon: '⌨️', title: 'Power User', desc: 'Cmd+K 커맨드 팔레트 첫 사용' },
  KONAMI: { id: 'KONAMI', icon: '🎮', title: 'Cheat Code', desc: 'Konami code 발견!' },
  TERMINAL_5_CMDS: { id: 'TERMINAL_5_CMDS', icon: '📟', title: 'Terminal Master', desc: '터미널에서 명령어 5개 실행' },
  THEME_TOGGLED: { id: 'THEME_TOGGLED', icon: '🌙', title: 'Night Owl', desc: '다크/라이트 모드 전환' },
  ALL_PAGES: { id: 'ALL_PAGES', icon: '🗺️', title: 'Explorer', desc: '모든 메인 페이지 방문' },
  CONSOLE_OPENED: { id: 'CONSOLE_OPENED', icon: '🖥️', title: 'Curious Mind', desc: '개발자 콘솔 열기' },
  PORTFOLIO_VIEWED: { id: 'PORTFOLIO_VIEWED', icon: '👁️', title: 'Portfolio Stalker', desc: '포트폴리오 상세 페이지 열람' },
  QUOTE_USED: { id: 'QUOTE_USED', icon: '💰', title: 'Smart Buyer', desc: '견적 계산기 사용' },
  LANG_SWITCHED: { id: 'LANG_SWITCHED', icon: '🌐', title: 'Polyglot', desc: '언어 전환' },
  CODE_COPIED: { id: 'CODE_COPIED', icon: '📋', title: 'Code Collector', desc: '코드 스니펫 복사' },
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
