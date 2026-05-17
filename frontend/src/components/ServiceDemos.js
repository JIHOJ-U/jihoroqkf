import React from 'react';
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
   Dispatcher
   ========================================================= */

export default function ServiceDemo({ serviceKey }) {
  switch (serviceKey) {
    case 'landing':   return <LandingDemo />;
    case 'business':  return <BusinessDemo />;
    case 'webapp':    return <WebAppDemo />;
    case 'mobile':    return <MobileDemo />;
    case 'ecommerce': return <EcommerceDemo />;
    case 'admin':     return <AdminDemo />;
    default:          return null;
  }
}
