import React from 'react';
import { Link } from 'react-router-dom';
import { HiMail, HiPhone, HiArrowSmRight } from 'react-icons/hi';
import { FaGithub, FaBlog } from 'react-icons/fa';
import { useLanguage } from '../contexts/LanguageContext';
import './Footer.css';

function Footer() {
  const { t, lang } = useLanguage();
  const services = t.services.list;

  return (
    <footer className="footer">
      <div className="footer-inner">
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
          </div>

          <div className="footer-links">
            <div className="footer-col">
              <h4>MENU</h4>
              <Link to="/">Home</Link>
              <Link to="/about">About</Link>
              <Link to="/portfolio">Works</Link>
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
