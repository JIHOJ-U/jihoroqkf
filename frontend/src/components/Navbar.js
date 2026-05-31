import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HiMenuAlt3, HiX, HiSun, HiMoon } from 'react-icons/hi';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { useAchievement } from '../contexts/AchievementContext';
import './Navbar.css';

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';
  const { lang, setLang, t } = useLanguage();
  const { theme, toggle: toggleTheme } = useTheme();
  const { unlock } = useAchievement();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  const navLinks = [
    { path: '/services', label: t.nav.services },
    { path: '/references', label: t.nav.references },
    { path: '/portfolio', label: t.nav.portfolio },
    { path: '/about', label: t.nav.about },
    { path: '/contact', label: t.nav.contact },
  ];

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''} ${isHome && !scrolled ? 'navbar--overlay' : ''}`}>
      <div className="navbar-inner">
        <Link to="/" className="navbar-logo" translate="no">
          <img src="/devvibelogo.jpg" alt="" className="navbar-logo__img" />
          Dev.Vibe
        </Link>

        <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
          {navLinks.map(link => (
            <Link
              key={link.path}
              to={link.path}
              className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
            >
              {link.label}
            </Link>
          ))}

          <div className="lang-toggle">
            <button
              className={`lang-btn ${lang === 'ko' ? 'active' : ''}`}
              onClick={() => { setLang('ko'); unlock('LANG_SWITCHED'); }}
              aria-label="한국어"
            >
              KR
            </button>
            <span className="lang-divider">|</span>
            <button
              className={`lang-btn ${lang === 'en' ? 'active' : ''}`}
              onClick={() => { setLang('en'); unlock('LANG_SWITCHED'); }}
              aria-label="English"
            >
              EN
            </button>
          </div>

          <button
            className="theme-toggle"
            onClick={(e) => { toggleTheme(e); unlock('THEME_TOGGLED'); }}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
          >
            {theme === 'dark' ? <HiSun /> : <HiMoon />}
          </button>
        </div>

        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <HiX /> : <HiMenuAlt3 />}
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
