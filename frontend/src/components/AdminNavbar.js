import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  HiOutlineViewGrid, HiOutlineCollection, HiOutlineMail,
  HiOutlineDocumentText, HiOutlineExternalLink, HiOutlineLogout,
} from 'react-icons/hi';
import './AdminNavbar.css';

const STORAGE_KEY = 'joe_dev_admin_auth';

const NAV = [
  { to: '/admin',           label: 'Dashboard',  icon: <HiOutlineViewGrid />,    end: true },
  { to: '/portfolio',       label: 'Portfolios', icon: <HiOutlineCollection /> },
  { to: '/portfolio/new',   label: 'New post',   icon: <HiOutlineDocumentText /> },
  { to: '/blog',            label: 'Notes',      icon: <HiOutlineDocumentText /> },
];

function AdminNavbar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    navigate('/');
    // hard reload so any client state tied to admin is cleared
    setTimeout(() => window.location.reload(), 0);
  };

  return (
    <nav className="adm-nav" aria-label="Admin navigation">
      <div className="adm-nav__brand">
        <span className="adm-nav__brand-dot" />
        <span className="adm-nav__brand-text" translate="no">
          Dev.Vibe <span className="adm-nav__brand-tag">ADMIN</span>
        </span>
      </div>

      <ul className="adm-nav__links">
        {NAV.map((item) => (
          <li key={item.to}>
            <NavLink
              to={item.to}
              end={item.end}
              className={({ isActive }) => `adm-nav__link ${isActive ? 'is-active' : ''}`}
            >
              <span className="adm-nav__icon">{item.icon}</span>
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>

      <div className="adm-nav__actions">
        <a href="/" className="adm-nav__link adm-nav__link--ghost">
          <span className="adm-nav__icon"><HiOutlineExternalLink /></span>
          View site
        </a>
        <button type="button" onClick={logout} className="adm-nav__link adm-nav__link--ghost">
          <span className="adm-nav__icon"><HiOutlineLogout /></span>
          Logout
        </button>
      </div>
    </nav>
  );
}

export default AdminNavbar;
