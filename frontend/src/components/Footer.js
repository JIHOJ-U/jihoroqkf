import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { HiMail, HiPhone, HiArrowSmRight } from 'react-icons/hi';
import { FaGithub, FaBlog } from 'react-icons/fa';
import { useLanguage } from '../contexts/LanguageContext';
import LighthouseBadge from './LighthouseBadge';
import './Footer.css';

// VS Code-style status bar lives at the very top of the footer. Mirrors the
// hero IDE editor card so the whole site reads as "wrapped in an IDE chrome."
function getKstClock() {
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  const kst = new Date(utc + 9 * 60 * 60000);
  return `${String(kst.getHours()).padStart(2, '0')}:${String(kst.getMinutes()).padStart(2, '0')}`;
}

function FooterStatusBar({ lang }) {
  const [time, setTime] = useState(getKstClock());
  useEffect(() => {
    const id = setInterval(() => setTime(getKstClock()), 30000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="footer-statusbar" aria-hidden="true">
      <div className="fsb-side">
        <span className="fsb-item">
          <span className="fsb-branch-dot" />
          main → origin/main
        </span>
        <span className="fsb-sep">·</span>
        <span className="fsb-item fsb-item--ok">synced</span>
        <span className="fsb-sep">·</span>
        <span className="fsb-item fsb-item--ok">
          <span className="fsb-tick">✓</span> build passing
        </span>
      </div>
      <div className="fsb-side fsb-side--right">
        <span className="fsb-item fsb-item--mono">KST {time}</span>
        <span className="fsb-sep">·</span>
        <span className="fsb-item">
          <kbd className="fsb-kbd">⌘</kbd>
          <kbd className="fsb-kbd">K</kbd>
          <span className="fsb-kbd-label">{lang === 'ko' ? '검색' : 'to search'}</span>
        </span>
      </div>
    </div>
  );
}

// Shields.io-style two-tone badges. Static values that match the rest of the
// site's claims (Lighthouse 96, etc.). Tones map to semantic color tokens.
const SHIELDS = [
  { label: 'build',       value: 'passing', tone: 'success' },
  { label: 'lighthouse',  value: '96/100',  tone: 'success' },
  { label: 'uptime',      value: '99.98%',  tone: 'success' },
  { label: 'bundle',      value: '142kb',   tone: 'info' },
  { label: 'last deploy', value: 'today',   tone: 'highlight' },
];

function FooterShields() {
  return (
    <div className="footer-shields" aria-hidden="true">
      {SHIELDS.map((b) => (
        <span key={b.label} className={`shield shield--${b.tone}`}>
          <span className="shield__label">{b.label}</span>
          <span className="shield__value">{b.value}</span>
        </span>
      ))}
    </div>
  );
}

function Footer() {
  const { t, lang } = useLanguage();
  const services = t.services.list;

  return (
    <footer className="footer">
      <FooterStatusBar lang={lang} />
      <div className="footer-inner">
        <FooterShields />
        <div className="footer-top">
          <div className="footer-brand">
            <Link to="/" className="footer-logo" translate="no">
              <img src="/devvibelogo.jpg" alt="" className="footer-logo__img" />
              Dev.Vibe
            </Link>
            <p className="footer-desc">
              {lang === 'ko'
                ? <>아이디어를 현실로 만드는 개발 파트너.<br />웹, 앱, 시스템 개발 외주 전문.</>
                : <>Your partner from idea to reality.<br />Freelance web, app & systems development.</>}
            </p>
            <div className="footer-socials">
              <a href="https://github.com/JIHOJ-U/JIHOJ-U" target="_blank" rel="noopener noreferrer" aria-label="GitHub"><FaGithub /></a>
              <a href="https://blog.naver.com/longnight0719" target="_blank" rel="noopener noreferrer" aria-label="Blog"><FaBlog /></a>
            </div>

            <LighthouseBadge />
          </div>

          <div className="footer-links">
            <div className="footer-col">
              <h4>MENU</h4>
              <Link to="/">Home</Link>
              <Link to="/about">About</Link>
              <Link to="/portfolio">Works</Link>
              <Link to="/blog">Notes</Link>
              <Link to="/contact">Contact</Link>
            </div>
            <div className="footer-col">
              <h4>SERVICES</h4>
              {services.map((s) => (
                <Link
                  key={s.key}
                  to={`/services#svc-${s.key}`}
                  className="footer-service-link"
                >
                  <span>{lang === 'ko' ? s.titleKo : s.title}</span>
                  <HiArrowSmRight className="footer-arrow" />
                </Link>
              ))}
            </div>
            <div className="footer-col">
              <h4>CONTACT</h4>
              <a href="mailto:roqkfwkwlgh@naver.com">
                <HiMail /> roqkfwkwlgh@naver.com
              </a>
              <a href="tel:010-8975-2847">
                <HiPhone /> 010-8975-2847
              </a>
            </div>
          </div>
        </div>

        <div className="footer-signature" aria-hidden="true">
          <span className="fsig-c">//</span>{' '}
          <span className="fsig-fn">crafted_with</span>
          <span className="fsig-paren">(</span>
          <span className="fsig-str">"React"</span>
          <span className="fsig-c">,</span>{' '}
          <span className="fsig-str">"Node"</span>
          <span className="fsig-c">,</span>{' '}
          <span className="fsig-str">"GSAP"</span>
          <span className="fsig-paren">)</span>
          <span className="fsig-c">;</span>{' '}
          <span className="fsig-kw">return</span>{' '}
          <span className="fsig-str">"💜"</span>
          <span className="fsig-c">;</span>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2026 <span translate="no">Dev.Vibe</span> All rights reserved.</p>
          <div className="footer-bottom-links">
            <Link to="/privacy">{lang === 'ko' ? '개인정보처리방침' : 'Privacy Policy'}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
