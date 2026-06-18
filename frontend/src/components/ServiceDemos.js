import React, { useState } from 'react';
import {
  HiSearch, HiHeart, HiShoppingCart, HiUserCircle,
  HiTrendingUp, HiTrendingDown, HiHome, HiChartBar, HiUsers, HiCog,
  HiInbox, HiBell, HiPlus, HiArrowRight, HiArrowUp, HiArrowDown,
  HiSparkles, HiCommandLine, HiFolder, HiStar, HiDotsHorizontal,
  HiCheck, HiClock, HiViewBoards, HiSwitchHorizontal,
} from 'react-icons/hi';
import { HiOutlineSparkles, HiOutlineGlobeAlt } from 'react-icons/hi2';
import './ServiceDemos.css';

/* =========================================================
   Shared frames
   ========================================================= */

export function BrowserFrame({ url = 'preview.dev', children, theme = 'light' }) {
  return (
    <div className={`demo-browser demo-browser--${theme}`}>
      <div className="demo-browser-bar">
        <div className="demo-browser-dots">
          <span className="dot dot--red" />
          <span className="dot dot--yellow" />
          <span className="dot dot--green" />
        </div>
        <div className="demo-browser-url">
          <span className="demo-browser-padlock">🔒</span>
          <span>{url}</span>
        </div>
        <div className="demo-browser-tabs">
          <span className="demo-browser-tabicon" />
          <span className="demo-browser-tabicon" />
          <span className="demo-browser-tabicon" />
        </div>
      </div>
      <div className="demo-browser-body">{children}</div>
    </div>
  );
}

export function PhoneFrame({ children }) {
  return (
    <div className="demo-phone-wrap">
      <div className="demo-phone">
        <div className="demo-phone-notch" />
        <div className="demo-phone-statusbar">
          <span>9:41</span>
          <span className="demo-phone-status-right">
            <span className="signal-bars">●●●●</span>
            <span>5G</span>
            <span className="battery">▮▮▮</span>
          </span>
        </div>
        <div className="demo-phone-screen">{children}</div>
      </div>
    </div>
  );
}

/* tiny sparkline svg */
function Sparkline({ data, color = '#6366f1', height = 28 }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = height - ((v - min) / range) * height;
    return `${x},${y}`;
  }).join(' ');
  return (
    <svg viewBox={`0 0 100 ${height}`} preserveAspectRatio="none" style={{ width: '100%', height }}>
      <polyline points={points} fill="none" stroke={color} strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

/* =========================================================
   1. Landing Page Demo — Linear-grade SaaS
   ========================================================= */

export function LandingDemo() {
  return (
    <BrowserFrame url="techflow.io">
      <div className="d-landing">
        <div className="d-landing-bg" aria-hidden="true">
          <span className="d-landing-blob d-landing-blob--1" />
          <span className="d-landing-blob d-landing-blob--2" />
          <span className="d-landing-grid" />
        </div>

        <nav className="d-landing-nav">
          <div className="d-landing-logo">
            <span className="d-landing-logo-mark">◆</span> TechFlow
          </div>
          <ul className="d-landing-menu">
            <li>Product <span className="d-landing-menu-chev">▾</span></li>
            <li>Solutions <span className="d-landing-menu-chev">▾</span></li>
            <li>Pricing</li>
            <li>Customers</li>
            <li>Docs</li>
          </ul>
          <div className="d-landing-nav-right">
            <span className="d-landing-signin">Sign in</span>
            <button className="d-landing-cta-sm">Start free <HiArrowRight /></button>
          </div>
        </nav>

        <header className="d-landing-hero">
          <span className="d-landing-eyebrow">
            <span className="d-landing-eyebrow-dot" />
            New · Visual workflow editor — <span className="d-landing-eyebrow-link">Read announcement →</span>
          </span>
          <h1>
            Ship faster.<br />
            <span className="d-landing-hero-gradient">Less effort, more impact.</span>
          </h1>
          <p>The end-to-end platform for teams that build software.<br />Plan, ship, and measure — in one place.</p>
          <div className="d-landing-cta-row">
            <button className="d-landing-cta-primary">
              Start for free
              <span className="d-landing-cta-arrow"><HiArrowRight /></span>
            </button>
            <button className="d-landing-cta-ghost">
              <span className="d-landing-play">▶</span> Watch 90s demo
            </button>
          </div>
          <div className="d-landing-trust">
            <span>Trusted by 12,000+ teams</span>
            <div className="d-landing-logos">
              <span>NORDIC</span><span>AURA</span><span>VERTEX</span><span>LUMEN</span><span>HELIX</span>
            </div>
          </div>
        </header>

        <section className="d-landing-features">
          <div className="d-landing-feat">
            <div className="d-landing-feat-icon" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>⚡</div>
            <h3>Built for speed</h3>
            <p>Edge runtime in 30+ regions. Sub-50ms response, anywhere on earth.</p>
            <span className="d-landing-feat-link">Performance benchmarks →</span>
          </div>
          <div className="d-landing-feat">
            <div className="d-landing-feat-icon" style={{ background: 'linear-gradient(135deg, #10b981, #06b6d4)' }}>🔒</div>
            <h3>Enterprise security</h3>
            <p>SOC 2 Type II. SSO, audit logs, role-based access out of the box.</p>
            <span className="d-landing-feat-link">Trust center →</span>
          </div>
          <div className="d-landing-feat">
            <div className="d-landing-feat-icon" style={{ background: 'linear-gradient(135deg, #f59e0b, #ef4444)' }}>🧩</div>
            <h3>Integrates anywhere</h3>
            <p>120+ apps. REST, GraphQL, webhooks, Zapier. Build your own in minutes.</p>
            <span className="d-landing-feat-link">Browse integrations →</span>
          </div>
        </section>
      </div>
    </BrowserFrame>
  );
}

/* =========================================================
   2. Business Website Demo — Editorial agency
   ========================================================= */

export function BusinessDemo() {
  return (
    <BrowserFrame url="northbound-studio.com">
      <div className="d-biz">
        <nav className="d-biz-nav">
          <div className="d-biz-logo">NORTHBOUND<span className="d-biz-logo-mark">.</span></div>
          <ul className="d-biz-menu">
            <li>Studio</li>
            <li>Work</li>
            <li>Services</li>
            <li>Journal</li>
          </ul>
          <button className="d-biz-cta">Get in touch →</button>
        </nav>

        <section className="d-biz-hero">
          <div className="d-biz-hero-left">
            <span className="d-biz-eyebrow">— Independent design studio · est. 2018</span>
            <h1>
              We craft<br />
              <em>quietly powerful</em><br />
              digital identities.
            </h1>
            <p className="d-biz-hero-sub">
              For brands that don't need to shout — strategy, identity, and digital products,
              built with deliberate attention to craft.
            </p>
          </div>
          <div className="d-biz-hero-stats">
            <div className="d-biz-stat">
              <span className="d-biz-stat-num">06</span>
              <span className="d-biz-stat-label">Years<br />in practice</span>
            </div>
            <div className="d-biz-stat">
              <span className="d-biz-stat-num">42</span>
              <span className="d-biz-stat-label">Brands<br />shipped</span>
            </div>
            <div className="d-biz-stat">
              <span className="d-biz-stat-num">11</span>
              <span className="d-biz-stat-label">Awards<br />received</span>
            </div>
          </div>
        </section>

        <section className="d-biz-feature">
          <span className="d-biz-section-tag">FEATURED PROJECT — 2025</span>
          <div className="d-biz-feature-row">
            <div className="d-biz-feature-img" aria-hidden="true">
              <div className="d-biz-feature-img-inner">
                <div className="d-biz-feature-img-shape" />
                <span className="d-biz-feature-img-text">Luda.</span>
              </div>
            </div>
            <div className="d-biz-feature-text">
              <h3>Luda — A home for shared living</h3>
              <p>Brand identity & digital flagship for a new co-living concept across Seoul.</p>
              <ul className="d-biz-feature-tags">
                <li>Identity</li><li>Web</li><li>Editorial</li>
              </ul>
              <span className="d-biz-feature-link">View case study →</span>
            </div>
          </div>
        </section>

        <section className="d-biz-clients">
          <span className="d-biz-section-tag">SELECTED CLIENTS</span>
          <div className="d-biz-clients-row">
            <span>ATELIER</span>
            <span>HANOK&amp;CO</span>
            <span>MUUM</span>
            <span>SIOL</span>
            <span>VESTRA</span>
            <span>OKTOBER</span>
          </div>
        </section>
      </div>
    </BrowserFrame>
  );
}

/* =========================================================
   3. Web App Demo — Linear-grade dark dashboard
   ========================================================= */

export function WebAppDemo() {
  return (
    <BrowserFrame url="app.lumen.ai" theme="dark">
      <div className="d-webapp">
        <aside className="d-webapp-sidebar">
          <div className="d-webapp-workspace">
            <div className="d-webapp-ws-icon">◆</div>
            <div>
              <div className="d-webapp-ws-name">Lumen Studio</div>
              <div className="d-webapp-ws-plan">Pro · 8 seats</div>
            </div>
            <HiSwitchHorizontal className="d-webapp-ws-switch" />
          </div>

          <div className="d-webapp-section">
            <div className="d-webapp-section-title">Workspace</div>
            <ul className="d-webapp-menu">
              <li className="active"><HiHome /> Dashboard</li>
              <li><HiViewBoards /> Projects <span className="badge badge--gray">12</span></li>
              <li><HiInbox /> Inbox <span className="badge">3</span></li>
              <li><HiChartBar /> Analytics</li>
            </ul>
          </div>

          <div className="d-webapp-section">
            <div className="d-webapp-section-title">Favorites</div>
            <ul className="d-webapp-menu">
              <li><HiFolder /> Q2 Roadmap</li>
              <li><HiFolder /> Design System</li>
              <li><HiStar /> Sprint #24</li>
            </ul>
          </div>

          <div className="d-webapp-userbox">
            <div className="d-webapp-avatar">JK</div>
            <div className="d-webapp-userinfo">
              <div className="d-webapp-username">Jiho Kim</div>
              <div className="d-webapp-userstatus"><span className="d-webapp-status-dot" /> Online</div>
            </div>
            <HiCog className="d-webapp-cog" />
          </div>
        </aside>

        <main className="d-webapp-main">
          <div className="d-webapp-top">
            <div className="d-webapp-crumbs">
              Workspace <span className="d-webapp-crumb-sep">/</span> <strong>Dashboard</strong>
            </div>
            <div className="d-webapp-search">
              <HiSearch /> Search projects, issues, docs...
              <span className="d-webapp-kbd">⌘K</span>
            </div>
            <button className="d-webapp-bell"><HiBell /><span className="d-webapp-bell-dot" /></button>
            <button className="d-webapp-newbtn"><HiPlus /> New</button>
          </div>

          <div className="d-webapp-greet">
            <div>
              <h2 className="d-webapp-title">Good morning, Jiho ✦</h2>
              <p className="d-webapp-sub">You have 3 issues due today and 1 PR awaiting review.</p>
            </div>
            <div className="d-webapp-filters">
              <span className="d-webapp-filter d-webapp-filter--active">Today</span>
              <span className="d-webapp-filter">Week</span>
              <span className="d-webapp-filter">Month</span>
            </div>
          </div>

          <div className="d-webapp-stats">
            <div className="d-webapp-stat">
              <div className="d-webapp-stat-head">
                <span className="label">Active users</span>
                <span className="trend up">↗ 12.3%</span>
              </div>
              <span className="value">2,847</span>
              <div className="d-webapp-spark">
                <Sparkline data={[12, 18, 14, 22, 19, 28, 26, 34]} color="#6366f1" />
              </div>
            </div>
            <div className="d-webapp-stat">
              <div className="d-webapp-stat-head">
                <span className="label">Revenue (MTD)</span>
                <span className="trend up">↗ 8.1%</span>
              </div>
              <span className="value">$48.2k</span>
              <div className="d-webapp-spark">
                <Sparkline data={[14, 16, 19, 17, 22, 25, 28, 31]} color="#10b981" />
              </div>
            </div>
            <div className="d-webapp-stat">
              <div className="d-webapp-stat-head">
                <span className="label">Conversion</span>
                <span className="trend down">↘ 0.4%</span>
              </div>
              <span className="value">3.24%</span>
              <div className="d-webapp-spark">
                <Sparkline data={[24, 26, 28, 27, 25, 22, 20, 19]} color="#ef4444" />
              </div>
            </div>
          </div>

          <div className="d-webapp-grid">
            <div className="d-webapp-chart">
              <div className="d-webapp-chart-head">
                <div>
                  <span className="d-webapp-chart-title">Activity</span>
                  <span className="d-webapp-chart-sub">Last 14 days · all projects</span>
                </div>
                <div className="d-webapp-legend">
                  <span><span className="lg-dot" style={{ background: '#6366f1' }} /> Sessions</span>
                  <span><span className="lg-dot" style={{ background: '#10b981' }} /> Conversions</span>
                </div>
              </div>
              <svg className="d-webapp-chart-svg" viewBox="0 0 320 110" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="cg1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#6366f1" stopOpacity="0.35" />
                    <stop offset="1" stopColor="#6366f1" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <g stroke="rgba(255,255,255,0.06)" strokeDasharray="2 4">
                  <line x1="0" y1="30" x2="320" y2="30" /><line x1="0" y1="60" x2="320" y2="60" /><line x1="0" y1="90" x2="320" y2="90" />
                </g>
                <path d="M0,82 L24,72 L48,78 L72,58 L96,64 L120,42 L144,52 L168,32 L192,40 L216,22 L240,30 L264,18 L288,26 L320,14 L320,110 L0,110 Z" fill="url(#cg1)" />
                <path d="M0,82 L24,72 L48,78 L72,58 L96,64 L120,42 L144,52 L168,32 L192,40 L216,22 L240,30 L264,18 L288,26 L320,14" stroke="#6366f1" strokeWidth="1.8" fill="none" />
                <path d="M0,95 L24,90 L48,92 L72,80 L96,85 L120,70 L144,78 L168,62 L192,68 L216,55 L240,60 L264,50 L288,56 L320,46" stroke="#10b981" strokeWidth="1.6" fill="none" strokeDasharray="3 3" />
              </svg>
            </div>

            <div className="d-webapp-side">
              <div className="d-webapp-side-head">
                <span>Active projects</span>
                <HiDotsHorizontal />
              </div>
              <div className="d-webapp-proj">
                <div className="d-webapp-proj-row">
                  <span className="d-webapp-proj-icon" style={{ background: '#6366f1' }}>L</span>
                  <div>
                    <div className="d-webapp-proj-name">Lumen Mobile</div>
                    <div className="d-webapp-proj-meta">12 of 18 issues</div>
                  </div>
                  <div className="d-webapp-proj-bar"><span style={{ width: '67%' }} /></div>
                </div>
                <div className="d-webapp-proj-row">
                  <span className="d-webapp-proj-icon" style={{ background: '#ec4899' }}>D</span>
                  <div>
                    <div className="d-webapp-proj-name">Design System v2</div>
                    <div className="d-webapp-proj-meta">8 of 22 issues</div>
                  </div>
                  <div className="d-webapp-proj-bar"><span style={{ width: '36%' }} /></div>
                </div>
                <div className="d-webapp-proj-row">
                  <span className="d-webapp-proj-icon" style={{ background: '#10b981' }}>A</span>
                  <div>
                    <div className="d-webapp-proj-name">API v3</div>
                    <div className="d-webapp-proj-meta">22 of 24 issues</div>
                  </div>
                  <div className="d-webapp-proj-bar"><span style={{ width: '92%' }} /></div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </BrowserFrame>
  );
}

/* =========================================================
   4. Mobile App Demo — Toss/finance quality
   ========================================================= */

export function MobileDemo() {
  return (
    <PhoneFrame>
      <div className="d-mobile">
        <header className="d-mobile-header">
          <div className="d-mobile-avatar">J</div>
          <div className="d-mobile-greet">
            <div className="d-mobile-hello">안녕하세요</div>
            <div className="d-mobile-name">Jiho ✦</div>
          </div>
          <div className="d-mobile-header-icons">
            <HiSearch />
            <span className="d-mobile-bell-wrap">
              <HiBell />
              <span className="d-mobile-bell-dot" />
            </span>
          </div>
        </header>

        <div className="d-mobile-balance">
          <div className="d-mobile-balance-label">Total balance</div>
          <div className="d-mobile-balance-amount">₩ 2,847,200</div>
          <div className="d-mobile-balance-trend">
            <HiTrendingUp /> +₩ 124,500 this month
          </div>
        </div>

        <div className="d-mobile-actions">
          <div className="d-mobile-action">
            <div className="d-mobile-action-icon" style={{ background: 'rgba(99,102,241,0.12)', color: '#6366f1' }}>↑</div>
            <span>Send</span>
          </div>
          <div className="d-mobile-action">
            <div className="d-mobile-action-icon" style={{ background: 'rgba(16,185,129,0.12)', color: '#10b981' }}>↓</div>
            <span>Receive</span>
          </div>
          <div className="d-mobile-action">
            <div className="d-mobile-action-icon" style={{ background: 'rgba(245,158,11,0.12)', color: '#f59e0b' }}>★</div>
            <span>Invest</span>
          </div>
          <div className="d-mobile-action">
            <div className="d-mobile-action-icon" style={{ background: 'rgba(236,72,153,0.12)', color: '#ec4899' }}>⋯</div>
            <span>More</span>
          </div>
        </div>

        <div className="d-mobile-section-head">
          <span className="d-mobile-section-title">Recent</span>
          <span className="d-mobile-section-link">See all</span>
        </div>

        <div className="d-mobile-tx">
          <div className="d-mobile-tx-icon" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>☕</div>
          <div className="d-mobile-tx-body">
            <div className="d-mobile-tx-name">Atelier Coffee</div>
            <div className="d-mobile-tx-meta">Today · 2:14 PM</div>
          </div>
          <div className="d-mobile-tx-amt d-mobile-tx-amt--out">−₩ 4,800</div>
        </div>

        <div className="d-mobile-tx">
          <div className="d-mobile-tx-icon" style={{ background: 'linear-gradient(135deg, #10b981, #06b6d4)' }}>💼</div>
          <div className="d-mobile-tx-body">
            <div className="d-mobile-tx-name">Salary · Acme Co.</div>
            <div className="d-mobile-tx-meta">Yesterday</div>
          </div>
          <div className="d-mobile-tx-amt d-mobile-tx-amt--in">+₩ 3,200,000</div>
        </div>

        <nav className="d-mobile-tabs">
          <div className="d-mobile-tab d-mobile-tab--active">
            <HiHome />
            <span>Home</span>
          </div>
          <div className="d-mobile-tab">
            <HiChartBar />
            <span>Insights</span>
          </div>
          <div className="d-mobile-tab d-mobile-tab--fab">
            <span className="d-mobile-fab">+</span>
          </div>
          <div className="d-mobile-tab">
            <HiHeart />
            <span>Saved</span>
          </div>
          <div className="d-mobile-tab">
            <HiUserCircle />
            <span>Me</span>
          </div>
        </nav>
      </div>
    </PhoneFrame>
  );
}

/* =========================================================
   5. Ecommerce Demo — Aesop/Apple quality
   ========================================================= */

export function EcommerceDemo() {
  const products = [
    { name: 'Linen Tee · Stone',     price: 48000, was: null,    tag: 'NEW',  bg: 'linear-gradient(135deg, #fef3c7, #fde68a)', icon: '👕' },
    { name: 'Heavy Wool Cardigan',   price: 128000, was: null,   tag: '',     bg: 'linear-gradient(135deg, #e0e7ff, #c7d2fe)', icon: '🧶' },
    { name: 'Selvedge Denim — Raw',  price: 168000, was: 198000, tag: 'SALE', bg: 'linear-gradient(135deg, #dbeafe, #bfdbfe)', icon: '👖' },
    { name: 'Vegetable Tan Belt',    price: 72000,  was: null,   tag: 'BEST', bg: 'linear-gradient(135deg, #fee2e2, #fecaca)', icon: '🪢' },
  ];
  const fmt = n => `₩${n.toLocaleString()}`;
  return (
    <BrowserFrame url="atelier-clothing.com">
      <div className="d-shop">
        <div className="d-shop-announce">
          ✦ Complimentary shipping on orders over ₩100,000
        </div>

        <nav className="d-shop-nav">
          <div className="d-shop-logo">ATELIER<span className="d-shop-logo-mark">.</span></div>
          <ul className="d-shop-menu">
            <li>New</li>
            <li>Women</li>
            <li>Men</li>
            <li>Objects</li>
            <li className="d-shop-menu-sale">Sale</li>
          </ul>
          <div className="d-shop-actions">
            <HiSearch />
            <HiHeart />
            <HiUserCircle />
            <button className="d-shop-cart">
              <HiShoppingCart />
              <span className="d-shop-cart-badge">2</span>
            </button>
          </div>
        </nav>

        <header className="d-shop-banner">
          <div className="d-shop-banner-left">
            <span className="d-shop-banner-eyebrow">— Spring / Summer · 26</span>
            <h1>
              Quiet luxury,<br />
              <em>everyday</em>.
            </h1>
            <p>Pieces designed to be worn, not photographed. Made from natural fibers in small batches.</p>
            <button className="d-shop-banner-cta">Shop the collection →</button>
          </div>
          <div className="d-shop-banner-img" aria-hidden="true">
            <div className="d-shop-banner-img-inner">
              <span>SS26</span>
            </div>
          </div>
        </header>

        <div className="d-shop-filter">
          <span className="d-shop-filter-label">Featured</span>
          <div className="d-shop-filter-tabs">
            <span className="active">All (124)</span>
            <span>Tops</span>
            <span>Knitwear</span>
            <span>Denim</span>
            <span>Accessories</span>
          </div>
          <span className="d-shop-sort">Sort: Newest ▾</span>
        </div>

        <div className="d-shop-grid">
          {products.map((p, i) => (
            <div key={i} className="d-shop-product">
              <div className="d-shop-product-img" style={{ background: p.bg }}>
                <span className="d-shop-product-emoji">{p.icon}</span>
                {p.tag && <span className={`d-shop-product-tag d-shop-product-tag--${p.tag.toLowerCase()}`}>{p.tag}</span>}
                <button className="d-shop-product-fav"><HiHeart /></button>
                <button className="d-shop-product-quick">Quick add</button>
              </div>
              <div className="d-shop-product-name">{p.name}</div>
              <div className="d-shop-product-price-row">
                <span className="d-shop-product-price">{fmt(p.price)}</span>
                {p.was && <span className="d-shop-product-was">{fmt(p.was)}</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </BrowserFrame>
  );
}

/* =========================================================
   6. Admin Dashboard Demo — Stripe quality
   ========================================================= */

export function AdminDemo() {
  const orders = [
    { id: '#ORD-1024', name: '김지호', avatar: 'K', items: 3, total: '₩128,000', status: 'paid',    date: '2분 전' },
    { id: '#ORD-1023', name: '이수민', avatar: 'L', items: 1, total: '₩48,000',  status: 'shipped', date: '12분 전' },
    { id: '#ORD-1022', name: '박서연', avatar: 'P', items: 2, total: '₩96,000',  status: 'pending', date: '38분 전' },
    { id: '#ORD-1021', name: '최도윤', avatar: 'C', items: 5, total: '₩240,000', status: 'paid',    date: '1시간 전' },
  ];
  return (
    <BrowserFrame url="dashboard.atelier.com">
      <div className="d-admin">
        <div className="d-admin-topbar">
          <div className="d-admin-workspace">
            <span className="d-admin-ws-icon">A</span>
            <div>
              <div className="d-admin-ws-name">Atelier</div>
              <div className="d-admin-ws-env">Production</div>
            </div>
            <span className="d-admin-ws-chev">▾</span>
          </div>
          <div className="d-admin-search">
            <HiSearch />
            <span>Search anything...</span>
            <span className="d-admin-kbd">⌘K</span>
          </div>
          <div className="d-admin-topright">
            <button className="d-admin-icon-btn"><HiBell /><span className="d-admin-icon-dot" /></button>
            <div className="d-admin-userpic">J</div>
          </div>
        </div>

        <div className="d-admin-subnav">
          <div className="d-admin-tabs">
            <span className="d-admin-tab d-admin-tab--active">Overview</span>
            <span className="d-admin-tab">Orders <span className="d-admin-tab-badge">12</span></span>
            <span className="d-admin-tab">Products</span>
            <span className="d-admin-tab">Customers</span>
            <span className="d-admin-tab">Analytics</span>
          </div>
          <span className="d-admin-daterange">Last 7 days · May 11 — 17 ▾</span>
        </div>

        <div className="d-admin-stats">
          <div className="d-admin-stat">
            <span className="label">Today's revenue</span>
            <span className="value">₩2,847,200</span>
            <span className="trend up"><HiTrendingUp /> +18.4%</span>
            <div className="d-admin-spark"><Sparkline data={[14, 18, 16, 22, 24, 28, 30]} color="#10b981" /></div>
          </div>
          <div className="d-admin-stat">
            <span className="label">Orders</span>
            <span className="value">142</span>
            <span className="trend up"><HiTrendingUp /> +12 today</span>
            <div className="d-admin-spark"><Sparkline data={[10, 12, 11, 15, 14, 17, 18]} color="#6366f1" /></div>
          </div>
          <div className="d-admin-stat">
            <span className="label">Conv. rate</span>
            <span className="value">4.2%</span>
            <span className="trend down"><HiTrendingDown /> −0.3%</span>
            <div className="d-admin-spark"><Sparkline data={[5, 5.2, 4.8, 4.6, 4.5, 4.3, 4.2]} color="#ef4444" /></div>
          </div>
          <div className="d-admin-stat">
            <span className="label">Avg. order</span>
            <span className="value">₩68,400</span>
            <span className="trend up"><HiTrendingUp /> +₩4.2k</span>
            <div className="d-admin-spark"><Sparkline data={[60, 62, 61, 64, 65, 67, 68]} color="#8b5cf6" /></div>
          </div>
        </div>

        <div className="d-admin-row">
          <div className="d-admin-chart">
            <div className="d-admin-card-head">
              <div>
                <div className="d-admin-card-title">Sales overview</div>
                <div className="d-admin-card-sub">This week vs last week</div>
              </div>
              <div className="d-admin-legend">
                <span><span className="lg-dot" style={{ background: '#6366f1' }} /> This week</span>
                <span><span className="lg-dot" style={{ background: '#d4d6dc' }} /> Last week</span>
              </div>
            </div>
            <div className="d-admin-bars">
              {[40, 65, 50, 80, 55, 90, 75].map((h, i) => (
                <div key={i} className="d-admin-bar-col">
                  <div className="d-admin-bar-stack">
                    <div className="d-admin-bar d-admin-bar--prev" style={{ height: `${h - 12}%` }} />
                    <div className="d-admin-bar d-admin-bar--curr" style={{ height: `${h}%` }} />
                  </div>
                  <span className="d-admin-bar-label">{['MON','TUE','WED','THU','FRI','SAT','SUN'][i]}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="d-admin-orders">
            <div className="d-admin-card-head">
              <div>
                <div className="d-admin-card-title">Recent orders</div>
                <div className="d-admin-card-sub">{orders.length} pending action</div>
              </div>
              <span className="d-admin-link">View all →</span>
            </div>
            <ul className="d-admin-order-list">
              {orders.map((o, i) => (
                <li key={i} className="d-admin-order">
                  <div className="d-admin-order-ava" style={{ background: ['#6366f1','#ec4899','#10b981','#f59e0b'][i % 4] }}>{o.avatar}</div>
                  <div className="d-admin-order-body">
                    <div className="d-admin-order-top">
                      <span className="d-admin-order-name">{o.name}</span>
                      <span className="d-admin-order-total">{o.total}</span>
                    </div>
                    <div className="d-admin-order-bottom">
                      <span className="d-admin-order-id">{o.id}</span>
                      <span className={`d-admin-status d-admin-status--${o.status}`}>{o.status}</span>
                      <span className="d-admin-order-date">{o.date}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </BrowserFrame>
  );
}

/* =========================================================
   7. Ops Console Demo — Dev.Vibe's own inbound-pipeline review tool
   ========================================================= */

/* Real freelance review pipeline content, presented as Dev.Vibe's own
   internal ops console. Each row carries a fit score, amount, and the
   exact rule that drove the verdict — so a visitor clicking ✗ sees not
   just "we filtered them" but WHY. */
const OPS_PIPELINE = [
  { fit: '◎', score: 3, title: '카페24 알림톡 + 광고추적',  amt: '150 · 10일',     status: '지원서 ✓',  reason: '재택 · 즉시 시작' },
  { fit: '◎', score: 3, title: 'React/Next 프론트 6개월',  amt: '협의 · 180일',   status: '검토 중',   reason: '스택 100% 일치' },
  { fit: '○', score: 2, title: 'Claude 쇼츠 자동화',        amt: '500 · 30일',     status: '지원서 ✓',  reason: 'AI 활용 강점' },
  { fit: '○', score: 2, title: '예비창업 AI 챗봇',          amt: '300~400 · 3mo',  status: '이력카드',  reason: '사업자 등록 후' },
  { fit: '○', score: 2, title: '한·중 커머스 (재택 3h)',     amt: '월 250',         status: '검토 중',   reason: '병행 가능' },
  { fit: '△', score: 1, title: '분양 데이터 크롤링 + CRM',  amt: '500 · 30일',     status: '보류',     reason: '네이버 차단 변수' },
  { fit: '△', score: 1, title: '특허 SaaS 고도화',           amt: '월 500',         status: '보류',     reason: 'FastAPI 어긋남' },
  { fit: '△', score: 1, title: 'AI 에이전트 수행사',         amt: '건별',           status: '보류',     reason: '팀 우대' },
  { fit: '✗', score: 0, title: 'RAG 심리분석 AI',            amt: '—',             status: '거름',     reason: 'LLM 직접 개발' },
  { fit: '✗', score: 0, title: '화상영어 플랫폼 (Zoom+PG)',  amt: '—',             status: '거름',     reason: '결제 3종 + DST' },
  { fit: '✗', score: 0, title: 'Shopify 헤더 개편',          amt: '—',             status: '거름',     reason: 'Liquid 특수' },
  { fit: '✗', score: 0, title: 'Vue 복지 플랫폼 (상주)',    amt: '—',             status: '거름',     reason: '마포 출근' },
  { fit: '✗', score: 0, title: 'Spring 1년 상주',            amt: '—',             status: '거름',     reason: '스택 다름' },
  { fit: '✗', score: 0, title: '뽑기/복권 PG 심사',          amt: '—',             status: '거름',     reason: '동시성 · 심사' },
];

const opsCount = (fit) => OPS_PIPELINE.filter(p => p.fit === fit).length;
const OPS_COUNTS = {
  all: OPS_PIPELINE.length,
  top:  opsCount('◎'),
  good: opsCount('○'),
  mix:  opsCount('△'),
  skip: opsCount('✗'),
};

const opsCls = (fit) =>
  fit === '◎' ? 'top'  :
  fit === '○' ? 'good' :
  fit === '△' ? 'mix'  : 'skip';

export function OpsConsoleDemo() {
  const [filter, setFilter] = useState('all');
  const shown = filter === 'all' ? OPS_PIPELINE : OPS_PIPELINE.filter(p => p.fit === filter);

  const chips = [
    { key: 'all', label: 'All',  count: OPS_COUNTS.all,  cls: 'all'  },
    { key: '◎',   label: '◎',    count: OPS_COUNTS.top,  cls: 'top'  },
    { key: '○',   label: '○',    count: OPS_COUNTS.good, cls: 'good' },
    { key: '△',   label: '△',    count: OPS_COUNTS.mix,  cls: 'mix'  },
    { key: '✗',   label: '✗',    count: OPS_COUNTS.skip, cls: 'skip' },
  ];

  return (
    <BrowserFrame url="ops.devvibe.work" theme="dark">
      <div className="d-ops">
        {/* PCB-trace decoration — subtle callback to PCBScene3D on home */}
        <svg className="d-ops-pcb" viewBox="0 0 320 110" preserveAspectRatio="none" aria-hidden="true">
          <g stroke="rgba(99, 102, 241, 0.18)" strokeWidth="1" fill="none">
            <path d="M0,55 H56 L70,38 H148 L162,55 H230" />
            <path d="M56,55 V92 H240" />
            <path d="M148,38 V12 H300" />
            <path d="M230,55 L246,38 H300" />
          </g>
          <g fill="none" strokeWidth="1.4">
            <circle cx="56"  cy="55" r="2.6" stroke="rgba(99, 102, 241, 0.55)" />
            <circle cx="148" cy="38" r="2.6" stroke="rgba(6, 182, 212, 0.65)"  />
            <circle cx="230" cy="55" r="2.6" stroke="rgba(99, 102, 241, 0.55)" />
            <circle cx="240" cy="92" r="2.6" stroke="rgba(16, 185, 129, 0.7)"  />
            <circle cx="300" cy="12" r="2.6" stroke="rgba(245, 158, 11, 0.7)"  />
          </g>
        </svg>

        <div className="d-ops-topbar">
          <div className="d-ops-brand">
            <span className="d-ops-brand-mark">◆</span>
            <div className="d-ops-brand-text">
              <div className="d-ops-brand-name">Dev.Vibe</div>
              <div className="d-ops-brand-sub">Inbound Pipeline</div>
            </div>
            <span className="d-ops-brand-chev">▾</span>
          </div>
          <div className="d-ops-search">
            <HiSearch />
            <span>공고·룰·태그 검색…</span>
            <span className="d-ops-kbd">⌘K</span>
          </div>
          <div className="d-ops-date">
            <span className="d-ops-date-dot" />
            <span className="d-ops-date-text">06-18 FRI</span>
          </div>
        </div>

        <div className="d-ops-chiprow">
          <div className="d-ops-chips">
            {chips.map(c => (
              <button
                key={c.key}
                type="button"
                onClick={() => setFilter(c.key)}
                className={`d-ops-chip d-ops-chip--${c.cls} ${filter === c.key ? 'is-active' : ''}`}
              >
                <span className="d-ops-chip-label">{c.label}</span>
                <span className="d-ops-chip-count">{c.count}</span>
              </button>
            ))}
          </div>
          <div className="d-ops-chip-meta">
            <span className="d-ops-chip-meta-pulse" />
            reviewed this week · auto-scored
          </div>
        </div>

        <div className="d-ops-grid">
          <aside className="d-ops-rail">
            <section className="d-ops-card">
              <header className="d-ops-card-head">
                <span className="d-ops-card-tag">STACK ID</span>
                <span className="d-ops-card-id">#01</span>
              </header>
              <div className="d-ops-stack">
                <div className="d-ops-stack-row">
                  <span className="d-ops-stack-mark">◆</span>
                  <div>
                    <div className="d-ops-stack-name">Dev.Vibe / 김지호</div>
                    <div className="d-ops-stack-role">Full-stack · solo</div>
                  </div>
                </div>
                <div className="d-ops-stack-tags">
                  <span>Vue3</span><span>Node</span><span>React</span><span>MySQL</span><span>Vercel</span>
                </div>
                <ul className="d-ops-stack-meta">
                  <li><span>모드</span><strong>재택 풀타임</strong></li>
                  <li><span>형태</span><strong>1인 프리랜서</strong></li>
                  <li><span>AI</span><strong>활용형 (직접 개발 ✕)</strong></li>
                </ul>
              </div>
            </section>

            <section className="d-ops-card">
              <header className="d-ops-card-head">
                <span className="d-ops-card-tag">RULES</span>
                <span className="d-ops-card-live"><span className="d-ops-live-dot" /> live</span>
              </header>
              <ul className="d-ops-rules">
                <li className="d-ops-rule d-ops-rule--ok"><HiCheck /> Remote-OK</li>
                <li className="d-ops-rule d-ops-rule--ok"><HiCheck /> JS-stack main</li>
                <li className="d-ops-rule d-ops-rule--ok"><HiCheck /> Solo OK</li>
                <li className="d-ops-rule d-ops-rule--ok"><HiCheck /> Experience open</li>
                <li className="d-ops-rule-sep" />
                <li className="d-ops-rule d-ops-rule--bad"><span className="d-ops-rule-x">✕</span> Python/Spring main</li>
                <li className="d-ops-rule d-ops-rule--bad"><span className="d-ops-rule-x">✕</span> LLM direct dev</li>
                <li className="d-ops-rule d-ops-rule--bad"><span className="d-ops-rule-x">✕</span> Billing PG core</li>
                <li className="d-ops-rule d-ops-rule--bad"><span className="d-ops-rule-x">✕</span> Special platform</li>
                <li className="d-ops-rule d-ops-rule--bad"><span className="d-ops-rule-x">✕</span> Senior-only / N-yr req</li>
              </ul>
            </section>
          </aside>

          <main className="d-ops-main">
            <section className="d-ops-card d-ops-pipe-card">
              <header className="d-ops-card-head">
                <span className="d-ops-card-tag">INBOUND PIPELINE</span>
                <span className="d-ops-card-meta">
                  {shown.length} of {OPS_PIPELINE.length} · {filter === 'all' ? 'all fits' : `fit ${filter}`}
                </span>
              </header>
              <div className="d-ops-pipe">
                <div className="d-ops-pipe-head">
                  <span>SCORE</span>
                  <span>FIT</span>
                  <span>TITLE</span>
                  <span>AMT · TERM</span>
                  <span>REASON</span>
                </div>
                {shown.length === 0 ? (
                  <div className="d-ops-empty">No items match this filter.</div>
                ) : shown.map((p, i) => (
                  <div key={`${filter}-${i}`} className={`d-ops-row d-ops-row--${opsCls(p.fit)}`}>
                    <span className="d-ops-row-score" aria-label={`score ${p.score} of 3`}>
                      {'●'.repeat(p.score)}<span className="d-ops-row-score-dim">{'○'.repeat(3 - p.score)}</span>
                    </span>
                    <span className={`d-ops-row-fit d-ops-row-fit--${opsCls(p.fit)}`}>{p.fit}</span>
                    <span className="d-ops-row-title">{p.title}</span>
                    <span className="d-ops-row-amt">{p.amt}</span>
                    <span className="d-ops-row-reason">{p.reason}</span>
                  </div>
                ))}
              </div>
            </section>

            <div className="d-ops-bottom">
              <section className="d-ops-card d-ops-week-card">
                <header className="d-ops-card-head">
                  <span className="d-ops-card-tag">THIS WEEK</span>
                  <span className="d-ops-card-meta">priority queue</span>
                </header>
                <ul className="d-ops-week">
                  <li><span className="d-ops-week-rank">#1</span><span className="d-ops-week-title">카페24 알림톡</span><span className="d-ops-week-stage">지원서 ✓</span><span className="d-ops-week-action d-ops-week-action--go">제출 대기</span></li>
                  <li><span className="d-ops-week-rank">#2</span><span className="d-ops-week-title">쇼츠 자동화</span><span className="d-ops-week-stage">지원서 ✓</span><span className="d-ops-week-action d-ops-week-action--go">제출 대기</span></li>
                  <li><span className="d-ops-week-rank">#3</span><span className="d-ops-week-title">예비창업 AI</span><span className="d-ops-week-stage">이력카드</span><span className="d-ops-week-action d-ops-week-action--wait">사업자 후</span></li>
                </ul>
              </section>

              <section className="d-ops-card d-ops-kpi-card">
                <header className="d-ops-card-head">
                  <span className="d-ops-card-tag">WEEK SUMMARY</span>
                </header>
                <div className="d-ops-kpi-grid">
                  <div className="d-ops-kpi d-ops-kpi--top"><span>◎</span><strong>{OPS_COUNTS.top}</strong></div>
                  <div className="d-ops-kpi d-ops-kpi--good"><span>○</span><strong>{OPS_COUNTS.good}</strong></div>
                  <div className="d-ops-kpi d-ops-kpi--mix"><span>△</span><strong>{OPS_COUNTS.mix}</strong></div>
                  <div className="d-ops-kpi d-ops-kpi--skip"><span>✗</span><strong>{OPS_COUNTS.skip}</strong></div>
                </div>
                <div className="d-ops-kpi-foot">
                  <span>APPLIED</span><strong>2</strong>
                  <span className="d-ops-kpi-sep">·</span>
                  <span>DRAFT</span><strong>1</strong>
                  <span className="d-ops-kpi-sep">·</span>
                  <span>REVIEWED</span><strong>{OPS_PIPELINE.length}</strong>
                </div>
              </section>
            </div>
          </main>
        </div>
      </div>
    </BrowserFrame>
  );
}

/* =========================================================
   8. Cafe24 KakaoTalk integration
   ========================================================= */

const CAFE24_TEMPLATES = [
  { key: 'order',   tag: '주문완료',  send: 1248, ctr: 32.4, conv: 287,
    title: '[#1024] 결제가 확인됐어요',
    msg: '안녕하세요 {{고객명}}님, 주문하신 [세라믹 머그·스톤] 결제가 확인되었어요. 평일 14시 이전 결제건은 당일 발송됩니다.',
    pixel: 'fbq("track","Purchase",{value:48000})' },
  { key: 'ship',    tag: '배송시작',  send: 982,  ctr: 41.8, conv: 156,
    title: '[CJ대한통운] 배송이 시작됐어요',
    msg: '주문번호 #20240618-1024 · 운송장 6182-3450-8829 · 평균 1–2일 소요됩니다. [배송조회]',
    pixel: 'gtag("event","shipment_start")' },
  { key: 'cart',    tag: '장바구니 회수', send: 2417, ctr: 18.6, conv: 124,
    title: '아직 담아두신 상품이 있어요',
    msg: '{{고객명}}님, [헤비울 카디건]이 장바구니에서 기다리고 있어요. 오늘만 추가 5% 할인 코드 → CARTBACK5',
    pixel: 'fbq("track","AddToCart")' },
  { key: 'restock', tag: '재입고 알림', send: 538,  ctr: 56.2, conv: 198,
    title: '관심 상품이 다시 입고됐어요',
    msg: '[셀비지 데님 — 32인치 RAW]가 재입고 되었어요. 수량이 적어요 — 빠른 결제를 추천해요.',
    pixel: 'gtag("event","restock_notify")' },
];

export function Cafe24Demo() {
  const [tplKey, setTplKey] = useState('order');
  const tpl = CAFE24_TEMPLATES.find(t => t.key === tplKey) || CAFE24_TEMPLATES[0];

  return (
    <BrowserFrame url="my-cafe24-shop.com/admin/messages">
      <div className="d-cafe24">
        <aside className="d-cafe24-side">
          <div className="d-cafe24-side-brand">Cafe24<span>.</span></div>
          <ul className="d-cafe24-side-menu">
            <li>주문관리</li>
            <li>상품관리</li>
            <li>회원관리</li>
            <li className="is-active">알림톡 발송 설정 <span className="d-cafe24-side-pill">NEW</span></li>
            <li>광고 추적</li>
            <li>매출 분석</li>
          </ul>
          <div className="d-cafe24-side-foot">
            <span className="d-cafe24-side-foot-mark" /> 카페24 API · OK
          </div>
        </aside>

        <main className="d-cafe24-main">
          <div className="d-cafe24-head">
            <div>
              <h3 className="d-cafe24-title">알림톡 자동 발송</h3>
              <p className="d-cafe24-sub">주문 · 배송 · 장바구니 이벤트가 발생하면 자동으로 카카오톡 비즈메시지를 보냅니다.</p>
            </div>
            <button type="button" className="d-cafe24-newbtn"><HiPlus /> 새 템플릿</button>
          </div>

          <div className="d-cafe24-tpl-grid">
            {CAFE24_TEMPLATES.map(t => (
              <button
                key={t.key}
                type="button"
                className={`d-cafe24-tpl ${tplKey === t.key ? 'is-active' : ''}`}
                onClick={() => setTplKey(t.key)}
              >
                <div className="d-cafe24-tpl-head">
                  <span className="d-cafe24-tpl-tag">{t.tag}</span>
                  <span className="d-cafe24-tpl-on">ON</span>
                </div>
                <div className="d-cafe24-tpl-stats">
                  <div><span>발송</span><strong>{t.send.toLocaleString()}</strong></div>
                  <div><span>CTR</span><strong>{t.ctr}%</strong></div>
                  <div><span>전환</span><strong>{t.conv}</strong></div>
                </div>
              </button>
            ))}
          </div>

          <div className="d-cafe24-preview">
            <div className="d-cafe24-preview-head">
              <span className="d-cafe24-preview-tag">미리보기 · {tpl.tag}</span>
              <span className="d-cafe24-preview-edit">템플릿 편집 →</span>
            </div>
            <div className="d-cafe24-preview-row">
              <div className="d-cafe24-phone">
                <div className="d-cafe24-phone-bar">
                  <span className="d-cafe24-phone-back">‹</span>
                  <span className="d-cafe24-phone-shop">우리쇼핑몰</span>
                </div>
                <div className="d-cafe24-phone-msg">
                  <div className="d-cafe24-phone-bubble">
                    <div className="d-cafe24-phone-bubble-head">
                      <span className="d-cafe24-phone-biz">BIZ</span>
                      <span className="d-cafe24-phone-title">{tpl.title}</span>
                    </div>
                    <div className="d-cafe24-phone-bubble-body">{tpl.msg}</div>
                    <div className="d-cafe24-phone-bubble-cta">자세히 보기 →</div>
                  </div>
                </div>
              </div>

              <div className="d-cafe24-pixel">
                <div className="d-cafe24-pixel-head">
                  <span className="d-cafe24-pixel-tag">광고 추적</span>
                  <span className="d-cafe24-pixel-meta">동시 발송</span>
                </div>
                <ul className="d-cafe24-pixel-list">
                  <li><span className="d-cafe24-pixel-dot d-cafe24-pixel-dot--fb" />Meta Pixel<code>{tpl.pixel}</code></li>
                  <li><span className="d-cafe24-pixel-dot d-cafe24-pixel-dot--ga" />GA4 conversion<code>tpl_{tpl.key}_v3</code></li>
                  <li><span className="d-cafe24-pixel-dot d-cafe24-pixel-dot--ka" />KakaoTalk Biz<code>tpl/{tpl.key}_kr</code></li>
                </ul>
                <div className="d-cafe24-pixel-foot">
                  <HiCheck /> 발송 + 이벤트 발사가 한 트랜잭션으로 묶입니다
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </BrowserFrame>
  );
}

/* =========================================================
   9. AI Content Automation — Source → Engine → Output
   ========================================================= */

const AIFLOW_SOURCES = [
  { id: 'rss-01', kind: 'RSS',    label: 'AI Daily Brief',  status: 'new',    count: 3, link: 'aidaily.kr/feed' },
  { id: 'ntn-02', kind: 'Notion', label: '아이디어 큐',     status: 'queued', count: 5, link: 'notion.so/…c93' },
  { id: 'url-03', kind: 'URL',    label: 'TechCrunch AI',   status: 'pulled', count: 2, link: 'techcrunch.com/ai' },
  { id: 'rss-04', kind: 'RSS',    label: 'Anthropic Blog',  status: 'queued', count: 1, link: 'anthropic.com/news' },
  { id: 'mnl-05', kind: 'Manual', label: '직접 입력',       status: 'idle',   count: 0, link: '— 사용자 추가 대기' },
];

const AIFLOW_OUTPUTS = [
  { id: 'shorts-1024', title: 'Claude 4의 컨텍스트 확장이 바꾸는 것 5가지', dur: '0:48', ts: '오늘 18:00', tag: '#shorts #ai',  src: 'rss-01', engine: 'q-1024' },
  { id: 'shorts-1025', title: '엔지니어가 코딩 시간을 줄이는 진짜 방법',    dur: '0:52', ts: '오늘 20:30', tag: '#shorts #dev', src: 'ntn-02', engine: 'q-1025' },
  { id: 'shorts-1026', title: 'AI 스타트업 투자 트렌드 2026 Q2',             dur: '0:44', ts: '내일 08:00', tag: '#reels #vc',   src: 'url-03', engine: 'q-1026' },
  { id: 'shorts-1027', title: 'Anthropic vs OpenAI — 안전성 접근 차이',    dur: '0:56', ts: '내일 12:00', tag: '#shorts #ai',  src: 'rss-04', engine: 'q-1027' },
];

export function AiFlowDemo() {
  const [picked, setPicked] = useState('shorts-1024');
  const out = AIFLOW_OUTPUTS.find(o => o.id === picked) || AIFLOW_OUTPUTS[0];

  return (
    <BrowserFrame url="aiflow.devvibe.work" theme="dark">
      <div className="d-aiflow">
        <div className="d-aiflow-bar">
          <div className="d-aiflow-bar-brand">
            <span className="d-aiflow-bar-mark"><HiSparkles /></span>
            <span>AI Flow</span>
            <span className="d-aiflow-bar-env">prod</span>
          </div>
          <div className="d-aiflow-bar-meta">
            <span className="d-aiflow-bar-stat"><strong>큐</strong> 4</span>
            <span className="d-aiflow-bar-stat"><strong>발행</strong> 12</span>
            <span className="d-aiflow-bar-stat"><strong>토큰</strong> 142k / day</span>
          </div>
        </div>

        <div className="d-aiflow-pipe">
          <div className="d-aiflow-col">
            <div className="d-aiflow-col-head">
              <span className="d-aiflow-col-tag">SOURCE</span>
              <span className="d-aiflow-col-meta">{AIFLOW_SOURCES.length} 채널</span>
            </div>
            <ul className="d-aiflow-src">
              {AIFLOW_SOURCES.map(s => (
                <li key={s.id} className={`d-aiflow-src-row ${out.src === s.id ? 'is-trace' : ''}`}>
                  <span className={`d-aiflow-src-kind d-aiflow-src-kind--${s.kind.toLowerCase()}`}>{s.kind}</span>
                  <div className="d-aiflow-src-body">
                    <div className="d-aiflow-src-label">{s.label}</div>
                    <div className="d-aiflow-src-link">{s.link}</div>
                  </div>
                  <div className="d-aiflow-src-side">
                    <div className="d-aiflow-src-count">{s.count}</div>
                    <div className={`d-aiflow-src-status d-aiflow-src-status--${s.status}`}>{s.status}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="d-aiflow-col d-aiflow-col--engine">
            <div className="d-aiflow-col-head">
              <span className="d-aiflow-col-tag">ENGINE · Claude 4.7</span>
              <span className="d-aiflow-col-meta">running</span>
            </div>
            <div className="d-aiflow-prompt">
              <div className="d-aiflow-prompt-head">
                <HiSparkles /> system prompt
              </div>
              <pre className="d-aiflow-prompt-code">{`You are a Korean YouTube
Shorts script writer. Given a
tech article, produce:
  hook (≤ 8 words),
  3 beats, CTA.
Tone: punchy, factual,
no hype. Length: 48–58s.`}</pre>
            </div>
            <div className="d-aiflow-queue">
              {AIFLOW_OUTPUTS.map(o => (
                <div key={o.id} className={`d-aiflow-q-row ${out.engine === o.engine ? 'is-trace' : ''}`}>
                  <span className="d-aiflow-q-id">{o.engine}</span>
                  <span className="d-aiflow-q-bar">
                    <span className="d-aiflow-q-fill" style={{ width: out.engine === o.engine ? '78%' : '100%' }} />
                  </span>
                  <span className="d-aiflow-q-state">{out.engine === o.engine ? '78%' : 'done'}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="d-aiflow-col">
            <div className="d-aiflow-col-head">
              <span className="d-aiflow-col-tag">OUTPUT</span>
              <span className="d-aiflow-col-meta">scheduled</span>
            </div>
            <ul className="d-aiflow-out">
              {AIFLOW_OUTPUTS.map(o => (
                <li
                  key={o.id}
                  className={`d-aiflow-out-row ${picked === o.id ? 'is-active' : ''}`}
                  onClick={() => setPicked(o.id)}
                >
                  <div className="d-aiflow-out-thumb">
                    <span className="d-aiflow-out-play">▶</span>
                    <span className="d-aiflow-out-dur">{o.dur}</span>
                  </div>
                  <div className="d-aiflow-out-body">
                    <div className="d-aiflow-out-title">{o.title}</div>
                    <div className="d-aiflow-out-meta">
                      <span className="d-aiflow-out-ts">{o.ts}</span>
                      <span className="d-aiflow-out-tag">{o.tag}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </BrowserFrame>
  );
}

/* =========================================================
   10. API Integrations Hub
   ========================================================= */

const INTEG_CATS = [
  { key: 'pay', label: 'Payments',  count: 2 },
  { key: 'msg', label: 'Messaging', count: 3 },
  { key: 'an',  label: 'Analytics', count: 2 },
  { key: 'crm', label: 'CRM',       count: 2 },
  { key: 'st',  label: 'Storage',   count: 1 },
];

const INTEG_CARDS = [
  { key: 'toss',    cat: 'pay', name: '토스페이먼츠',    sub: 'Payment Gateway',     status: 'connected', sync: '2분 전',   scope: ['결제', 'PG'],   hook: 'api.tosspayments.com/v1/payments' },
  { key: 'iamport', cat: 'pay', name: '아임포트',         sub: 'Multi-PG',            status: 'connected', sync: '8분 전',   scope: ['결제'],         hook: 'api.iamport.kr/payments' },
  { key: 'kakao',   cat: 'msg', name: '카카오 비즈메시지', sub: 'KakaoTalk Biz',      status: 'connected', sync: '1분 전',   scope: ['알림톡'],       hook: 'kakaowork.com/v1/bizmessage' },
  { key: 'sms',     cat: 'msg', name: 'NCloud SMS',        sub: 'SMS · LMS · MMS',     status: 'connected', sync: '4분 전',   scope: ['SMS', 'LMS'],    hook: 'sens.apigw.ntruss.com/sms/v2' },
  { key: 'slack',   cat: 'msg', name: 'Slack',             sub: 'Internal alerts',     status: 'pending',   sync: '인증 대기', scope: ['웹훅'],         hook: 'hooks.slack.com/services/T0G…' },
  { key: 'ga4',     cat: 'an',  name: 'GA4',               sub: 'Google Analytics',    status: 'connected', sync: '실시간',    scope: ['analytics'],    hook: 'analytics.google.com/g/data' },
  { key: 'meta',    cat: 'an',  name: 'Meta Pixel',        sub: 'Conversion tracking', status: 'error',     sync: '12분 전 ✕', scope: ['전환추적'],     hook: 'graph.facebook.com/v18.0/events' },
  { key: 'notion',  cat: 'crm', name: 'Notion',            sub: 'Customer DB',         status: 'connected', sync: '6분 전',   scope: ['DB sync'],      hook: 'api.notion.com/v1/databases' },
  { key: 'mc',      cat: 'crm', name: 'Mailchimp',         sub: 'Newsletter',          status: 'pending',   sync: '인증 대기', scope: ['newsletter'],   hook: 'us19.api.mailchimp.com/3.0' },
  { key: 's3',      cat: 'st',  name: 'AWS S3',            sub: 'Asset storage',       status: 'connected', sync: '실시간',    scope: ['file upload'],  hook: 'devvibe-assets.s3.amazonaws.com' },
];

const INTEG_PILL_LABEL = { connected: '연결됨', pending: '대기', error: '오류' };

export function IntegrationsDemo() {
  const [picked, setPicked] = useState('toss');
  const card = INTEG_CARDS.find(c => c.key === picked) || INTEG_CARDS[0];

  return (
    <BrowserFrame url="hub.example-saas.com/integrations">
      <div className="d-integ">
        <header className="d-integ-head">
          <div>
            <h3 className="d-integ-title">연동 허브 <span className="d-integ-title-meta">{INTEG_CARDS.length}개 연결</span></h3>
            <p className="d-integ-sub">외부 서비스를 한 화면에서 연결 · 모니터링. webhook 로그와 재시도까지.</p>
          </div>
          <div className="d-integ-head-meta">
            <span><span className="d-integ-dot d-integ-dot--ok" /> 7 connected</span>
            <span><span className="d-integ-dot d-integ-dot--wait" /> 2 pending</span>
            <span><span className="d-integ-dot d-integ-dot--err" /> 1 error</span>
          </div>
        </header>

        <div className="d-integ-grid">
          <aside className="d-integ-cats">
            <ul>
              <li className="is-all">All<span>{INTEG_CARDS.length}</span></li>
              {INTEG_CATS.map(c => (
                <li key={c.key}>{c.label}<span>{c.count}</span></li>
              ))}
            </ul>
          </aside>
          <div className="d-integ-cards">
            {INTEG_CARDS.map(c => (
              <button
                key={c.key}
                type="button"
                onClick={() => setPicked(c.key)}
                className={`d-integ-card d-integ-card--${c.status} ${picked === c.key ? 'is-active' : ''}`}
              >
                <div className="d-integ-card-row">
                  <div className={`d-integ-logo d-integ-logo--${c.cat}`}>{c.name.charAt(0)}</div>
                  <div className="d-integ-card-body">
                    <div className="d-integ-card-name">{c.name}</div>
                    <div className="d-integ-card-sub">{c.sub}</div>
                  </div>
                  <span className={`d-integ-pill d-integ-pill--${c.status}`}>{INTEG_PILL_LABEL[c.status]}</span>
                </div>
                <div className="d-integ-card-foot">
                  <span className="d-integ-card-sync">동기화 · {c.sync}</span>
                  <div className="d-integ-card-tags">{c.scope.map(s => <span key={s}>{s}</span>)}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className={`d-integ-panel d-integ-panel--${card.status}`}>
          <div className="d-integ-panel-row">
            <div className="d-integ-panel-left">
              <div className="d-integ-panel-name">{card.name} <span className={`d-integ-pill d-integ-pill--${card.status}`}>{INTEG_PILL_LABEL[card.status]}</span></div>
              <div className="d-integ-panel-hook">
                <span>POST</span>
                <code>{`https://${card.hook}`}</code>
              </div>
            </div>
            <div className="d-integ-panel-right">
              <div className="d-integ-panel-token">
                <span>Bearer</span>
                <code>sk_live_••••••••••••9c0</code>
              </div>
              <button type="button" className="d-integ-panel-test">웹훅 테스트 →</button>
            </div>
          </div>
          <ul className="d-integ-events">
            <li><span className="d-integ-ev-dot d-integ-ev-dot--ok" /><span className="d-integ-ev-ts">2분 전</span><span className="d-integ-ev-name">payment.confirmed</span><span className="d-integ-ev-id">evt_4F9aK2</span><span className="d-integ-ev-state">200 OK</span></li>
            <li><span className="d-integ-ev-dot d-integ-ev-dot--ok" /><span className="d-integ-ev-ts">9분 전</span><span className="d-integ-ev-name">payment.confirmed</span><span className="d-integ-ev-id">evt_3sB17q</span><span className="d-integ-ev-state">200 OK</span></li>
            <li><span className="d-integ-ev-dot d-integ-ev-dot--retry" /><span className="d-integ-ev-ts">14분 전</span><span className="d-integ-ev-name">refund.requested</span><span className="d-integ-ev-id">evt_2u9JZk</span><span className="d-integ-ev-state">retry · 2/3</span></li>
          </ul>
        </div>
      </div>
    </BrowserFrame>
  );
}

/* =========================================================
   11. Multi-channel Commerce — KR · CN · JP · US
   ========================================================= */

const MC_CHANNELS = [
  { key: 'kr', flag: '🇰🇷', name: '한국 자사몰',    sales: '₩28,470,000', stock: 142, status: 'sync', delta: '+12.3%' },
  { key: 'cn', flag: '🇨🇳', name: 'Tmall Global',    sales: '¥184,200',     stock: 98,  status: 'sync', delta: '+8.1%'  },
  { key: 'jp', flag: '🇯🇵', name: 'Rakuten',         sales: '¥2,108,400',   stock: 56,  status: 'sync', delta: '+4.6%'  },
  { key: 'us', flag: '🇺🇸', name: 'Shopify Plus',    sales: '$8,420',       stock: 71,  status: 'lag',  delta: '−1.2%'  },
];

const MC_PRODUCT = {
  sku: 'DV-CRD-128',
  name: 'Heavy Wool Cardigan — Stone',
  master: 128000,
  rows: [
    { ch: 'kr', price: '₩128,000', stock: 42, listed: true,  trans: '헤비울 카디건 — 스톤' },
    { ch: 'cn', price: '¥682',     stock: 18, listed: true,  trans: '羊毛厚重开衫 — 石色' },
    { ch: 'jp', price: '¥13,200',  stock: 12, listed: true,  trans: 'ヘビーウールカーディガン — ストーン' },
    { ch: 'us', price: '$98',      stock: 21, listed: false, trans: 'Heavy Wool Cardigan — Stone' },
  ],
};

const MC_ORDERS = [
  { ch: 'kr', id: '#KR-20240618-1023', loc: '서울 · 강남구',   val: '₩68,000', status: '결제완료'   },
  { ch: 'cn', id: '#CN-882',           loc: '上海 · 静安区',    val: '¥328',    status: '已发货'     },
  { ch: 'jp', id: '#JP-4521',          loc: '東京 · 渋谷',      val: '¥9,800',  status: '出荷準備'   },
  { ch: 'kr', id: '#KR-20240618-1022', loc: '부산 · 해운대구', val: '₩42,000', status: '결제완료'   },
  { ch: 'us', id: '#US-2018',          loc: 'NY · Brooklyn',     val: '$48',     status: 'Fulfilled'  },
  { ch: 'cn', id: '#CN-881',           loc: '北京 · 朝阳区',    val: '¥548',    status: '已发货'     },
];

export function MultiChannelDemo() {
  const [picked, setPicked] = useState(new Set(['kr', 'cn', 'jp', 'us']));
  const toggle = (k) => {
    const next = new Set(picked);
    if (next.has(k)) { if (next.size > 1) next.delete(k); }
    else next.add(k);
    setPicked(next);
  };
  const shownOrders = MC_ORDERS.filter(o => picked.has(o.ch));

  return (
    <BrowserFrame url="commerce.devvibe.work/4ch">
      <div className="d-multi">
        <header className="d-multi-head">
          <div>
            <h3 className="d-multi-title">4-Channel Sync <span className="d-multi-title-meta">한 · 중 · 일 · 미</span></h3>
            <p className="d-multi-sub">한 상품 마스터 · 4개 채널 · 가격 / 재고 / 번역 동시 운영</p>
          </div>
          <div className="d-multi-head-meta">
            <span><span className="d-multi-dot d-multi-dot--ok" /> 3 sync</span>
            <span><span className="d-multi-dot d-multi-dot--lag" /> 1 lagging</span>
            <span className="d-multi-head-time">last sync · 11s ago</span>
          </div>
        </header>

        <div className="d-multi-chstrip">
          {MC_CHANNELS.map(c => (
            <button
              key={c.key}
              type="button"
              onClick={() => toggle(c.key)}
              className={`d-multi-ch ${picked.has(c.key) ? 'is-on' : ''} d-multi-ch--${c.status}`}
            >
              <span className="d-multi-ch-flag">{c.flag}</span>
              <div className="d-multi-ch-body">
                <div className="d-multi-ch-name">{c.name}</div>
                <div className="d-multi-ch-sales">
                  <strong>{c.sales}</strong>
                  <span className={`d-multi-ch-delta ${c.delta.startsWith('−') ? 'down' : 'up'}`}>{c.delta}</span>
                </div>
              </div>
              <div className="d-multi-ch-stock">재고 {c.stock}</div>
            </button>
          ))}
        </div>

        <section className="d-multi-prod">
          <div className="d-multi-prod-head">
            <div>
              <span className="d-multi-prod-sku">{MC_PRODUCT.sku}</span>
              <h4 className="d-multi-prod-name">{MC_PRODUCT.name}</h4>
            </div>
            <div className="d-multi-prod-master">
              <span>마스터</span><strong>₩{MC_PRODUCT.master.toLocaleString()}</strong>
            </div>
          </div>
          <div className="d-multi-prod-grid">
            <div className="d-multi-prod-row d-multi-prod-row--head">
              <span>채널</span><span>가격</span><span>재고</span><span>노출</span><span>로컬 카피</span>
            </div>
            {MC_PRODUCT.rows.map(r => {
              const ch = MC_CHANNELS.find(c => c.key === r.ch);
              return (
                <div key={r.ch} className="d-multi-prod-row">
                  <span className="d-multi-prod-ch"><span className="d-multi-prod-flag">{ch.flag}</span>{ch.name}</span>
                  <span className="d-multi-prod-price">{r.price}</span>
                  <span className={`d-multi-prod-stock ${r.stock < 15 ? 'is-low' : ''}`}>{r.stock}</span>
                  <span className={`d-multi-prod-listed ${r.listed ? 'is-on' : 'is-off'}`}>{r.listed ? '노출' : '비공개'}</span>
                  <span className="d-multi-prod-trans">{r.trans}</span>
                </div>
              );
            })}
          </div>
        </section>

        <section className="d-multi-orders">
          <div className="d-multi-orders-head">
            <span className="d-multi-orders-tag">RECENT ORDERS · {shownOrders.length}</span>
            <span className="d-multi-orders-meta">채널 칩 토글로 필터</span>
          </div>
          <ul className="d-multi-orders-list">
            {shownOrders.length === 0 ? (
              <li className="d-multi-orders-empty">선택된 채널이 없어요.</li>
            ) : shownOrders.map((o, i) => {
              const ch = MC_CHANNELS.find(c => c.key === o.ch);
              return (
                <li key={i} className="d-multi-orders-row">
                  <span className="d-multi-orders-flag">{ch.flag}</span>
                  <span className="d-multi-orders-id">{o.id}</span>
                  <span className="d-multi-orders-loc">{o.loc}</span>
                  <span className="d-multi-orders-val">{o.val}</span>
                  <span className={`d-multi-orders-status d-multi-orders-status--${o.ch}`}>{o.status}</span>
                </li>
              );
            })}
          </ul>
        </section>
      </div>
    </BrowserFrame>
  );
}

/* =========================================================
   12. Booking & Reminders
   ========================================================= */

const BOOKING_SLOTS = [
  { time: '09:00', dur: 60, name: '김지호', svc: '두피 클리닉',          staff: 'A', contact: '010-•••-2847', memo: '재방문 · 클리닉 + 트리트먼트' },
  { time: '10:30', dur: 90, name: '이수민', svc: '커트 + 디지털 펌',     staff: 'B', contact: '010-•••-1124', memo: '첫 방문 · 어깨 라인 무게감 줄이기' },
  { time: '12:00', dur: 30, name: null,     svc: null,                   staff: null, contact: null,            memo: '점심' },
  { time: '13:00', dur: 60, name: '박서연', svc: '베이비솜 헤어 케어',  staff: 'A', contact: '010-•••-7012', memo: '재방문 · 두피 자극 적은 제품' },
  { time: '14:30', dur: 60, name: null,     svc: null,                   staff: null, contact: null,            memo: '대기' },
  { time: '15:30', dur: 90, name: '정수민', svc: '컷 + 클리닉',          staff: 'B', contact: '010-•••-4421', memo: '5분 전 알림 발송 완료' },
  { time: '17:00', dur: 60, name: '최도윤', svc: '컷',                  staff: 'A', contact: '010-•••-8810', memo: '첫 방문 · 단정한 사이드 정리' },
  { time: '18:30', dur: 30, name: null,     svc: null,                   staff: null, contact: null,            memo: '대기' },
];

const BOOKING_REMINDERS = [
  { when: '오늘 14:25', target: '정수민', via: '카톡', label: '5분 전 알림',  state: 'queued'    },
  { when: '오늘 17:30', target: '최도윤', via: '카톡', label: '30분 전 알림', state: 'queued'    },
  { when: '내일 09:00', target: '한지유', via: 'SMS',  label: '1시간 전 알림', state: 'scheduled' },
  { when: '내일 10:30', target: '서다현', via: '카톡', label: '1시간 전 알림', state: 'scheduled' },
  { when: '내일 13:00', target: '이수민', via: '카톡', label: '재방문 안내',   state: 'scheduled' },
];

export function BookingDemo() {
  const [pickedTime, setPickedTime] = useState('15:30');
  const slot = BOOKING_SLOTS.find(s => s.time === pickedTime) || BOOKING_SLOTS[0];

  return (
    <BrowserFrame url="salon-ops.example.com/today">
      <div className="d-book">
        <header className="d-book-head">
          <div>
            <span className="d-book-eyebrow">오늘 · 06/18 · 금</span>
            <h3 className="d-book-title">예약 7건 · 노쇼 알림 5건 발송 예정</h3>
          </div>
          <div className="d-book-head-stats">
            <div><span>완료</span><strong>3</strong></div>
            <div><span>진행</span><strong>1</strong></div>
            <div><span>대기</span><strong>3</strong></div>
            <div><span>노쇼율</span><strong>2.4%</strong></div>
          </div>
        </header>

        <div className="d-book-grid">
          <aside className="d-book-cal">
            <div className="d-book-cal-head">
              <span>오늘의 캘린더</span>
              <span className="d-book-cal-staff">스태프 A · B</span>
            </div>
            <ul className="d-book-cal-list">
              {BOOKING_SLOTS.map(s => {
                const isBooked = !!s.name;
                const isLunch = !isBooked && s.memo === '점심';
                return (
                  <li
                    key={s.time}
                    onClick={() => isBooked && setPickedTime(s.time)}
                    className={`d-book-slot ${isBooked ? 'is-booked' : ''} ${isLunch ? 'is-lunch' : ''} ${pickedTime === s.time ? 'is-active' : ''}`}
                  >
                    <span className="d-book-slot-time">{s.time}</span>
                    <span className="d-book-slot-bar" />
                    {isBooked ? (
                      <div className="d-book-slot-body">
                        <span className="d-book-slot-name">{s.name}</span>
                        <span className="d-book-slot-svc">{s.svc} · {s.dur}분</span>
                      </div>
                    ) : (
                      <div className="d-book-slot-empty">{isLunch ? '점심' : '— 대기'}</div>
                    )}
                  </li>
                );
              })}
            </ul>
          </aside>

          <main className="d-book-detail">
            {slot.name ? (
              <>
                <div className="d-book-detail-head">
                  <div className="d-book-detail-ava">{slot.name.charAt(0)}</div>
                  <div>
                    <div className="d-book-detail-name">{slot.name} <span className="d-book-detail-staff">· 스태프 {slot.staff}</span></div>
                    <div className="d-book-detail-time"><HiClock /> {slot.time} · {slot.dur}분</div>
                  </div>
                  <div className="d-book-detail-tags">
                    <span className="d-book-tag d-book-tag--svc">{slot.svc}</span>
                  </div>
                </div>
                <div className="d-book-detail-rows">
                  <div className="d-book-detail-row">
                    <span className="d-book-detail-row-key">연락처</span>
                    <span className="d-book-detail-row-val">{slot.contact}</span>
                  </div>
                  <div className="d-book-detail-row">
                    <span className="d-book-detail-row-key">메모</span>
                    <span className="d-book-detail-row-val d-book-detail-row-memo">{slot.memo}</span>
                  </div>
                  <div className="d-book-detail-actions">
                    <button type="button" className="d-book-btn d-book-btn--primary">예약 확정</button>
                    <button type="button" className="d-book-btn">메모 추가</button>
                    <button type="button" className="d-book-btn">재예약 링크</button>
                  </div>
                </div>
              </>
            ) : (
              <div className="d-book-detail-empty">예약된 시간이 없어요 — 좌측에서 슬롯을 선택해 주세요.</div>
            )}
          </main>

          <aside className="d-book-reminders">
            <div className="d-book-rem-head">
              <span className="d-book-rem-tag">알리미 큐</span>
              <span className="d-book-rem-meta">{BOOKING_REMINDERS.length}건 예정</span>
            </div>
            <ul className="d-book-rem-list">
              {BOOKING_REMINDERS.map((r, i) => (
                <li key={i} className={`d-book-rem-row d-book-rem-row--${r.state}`}>
                  <span className="d-book-rem-when">{r.when}</span>
                  <div className="d-book-rem-body">
                    <span className="d-book-rem-target">{r.target}</span>
                    <span className="d-book-rem-label">{r.label}</span>
                  </div>
                  <span className={`d-book-rem-via d-book-rem-via--${r.via === '카톡' ? 'kk' : 'sms'}`}>{r.via}</span>
                </li>
              ))}
            </ul>
            <div className="d-book-rem-foot">
              <HiCheck /> 알리미 발송 후 노쇼율 14% → 2.4%
            </div>
          </aside>
        </div>
      </div>
    </BrowserFrame>
  );
}

/* =========================================================
   Dispatcher
   ========================================================= */

export default function ServiceDemo({ serviceKey }) {
  switch (serviceKey) {
    case 'landing':      return <LandingDemo />;
    case 'business':     return <BusinessDemo />;
    case 'webapp':       return <WebAppDemo />;
    case 'mobile':       return <MobileDemo />;
    case 'ecommerce':    return <EcommerceDemo />;
    case 'admin':        return <AdminDemo />;
    case 'ops':          return <OpsConsoleDemo />;
    case 'cafe24':       return <Cafe24Demo />;
    case 'aiflow':       return <AiFlowDemo />;
    case 'integrations': return <IntegrationsDemo />;
    case 'multichannel': return <MultiChannelDemo />;
    case 'booking':      return <BookingDemo />;
    default:             return null;
  }
}
