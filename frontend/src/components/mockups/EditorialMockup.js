import React from 'react';

/* Editorial mockup — dark magazine layout for wine bar, architecture studio, fashion select.
   Big serif typography, asymmetric grid, quote-driven sections. */

export default function EditorialMockup({ data: ref, lang }) {
  const m = ref.mockup;
  const e = ref.editorial || {};

  const tagline   = e.tagline   || ref.subKo;
  const heroLine  = e.heroLine  || (lang === 'ko' ? '취향이 모이는 자리' : 'Where taste gathers');
  const quote     = e.quote     || '"좋은 디자인은 설명이 필요 없다. 다만 한참을 머무르게 한다."';
  const quoteAttr = e.quoteAttr || '— Studio founder';
  const issue     = e.issue     || 'VOL.06 · 2026';
  const images    = e.images    || [ref.img, ref.img, ref.img];
  const works     = e.works     || (m.menu || []).slice(0, 4).map((mi, i) => ({
    no: String(i + 1).padStart(2, '0'),
    name: mi.name,
    year: (2026 - i),
    cat: i % 2 === 0 ? 'Identity' : 'Editorial',
  }));
  const events = e.events || (m.notices || []).slice(0, 3).map((n, i) => ({
    title: n.title,
    when:  ['2026.05.22 · 19:00', '2026.06.02 · 11:00', '2026.06.14 · 16:00'][i] || '',
    where: ['Studio Hall', 'Yongsan', 'Online'][i] || '',
  }));

  return (
    <article className="em">
      {/* Top utility bar */}
      <div className="em-utility">
        <span>{issue}</span>
        <span className="em-utility-spacer">— — —</span>
        <span>{m.brand} · ARCHIVE</span>
        <span className="em-utility-right">서울 · 22°C · MAY 18</span>
      </div>

      {/* Top nav */}
      <header className="em-nav">
        <div className="em-nav-brand">
          <span className="em-nav-mark" style={{ color: m.accent }}>{m.logoIcon}</span>
          <span>{m.brand}</span>
        </div>
        <nav className="em-nav-menu">
          {(m.menu || []).slice(0, 5).map((mi, i) => (
            <span key={i} className={i === 0 ? 'em-nav-link em-nav-link--active' : 'em-nav-link'}>
              {mi.name}
            </span>
          ))}
        </nav>
        <span className="em-nav-cta">Visit ↗</span>
      </header>

      {/* Hero — asymmetric serif */}
      <section className="em-hero">
        <div className="em-hero-text">
          <span className="em-hero-eyebrow">— {tagline}</span>
          <h1 className="em-hero-line">
            {heroLine}
          </h1>
          <div className="em-hero-meta">
            <span>EST. {2026 - 8}</span>
            <span>SEOUL · YONGSAN-GU</span>
          </div>
        </div>
        <figure className="em-hero-fig">
          <img src={images[0]} alt="" />
          <figcaption>
            <span>fig. 01</span> · {m.brand} flagship · 2026
          </figcaption>
        </figure>
      </section>

      {/* Quote / manifesto */}
      <section className="em-manifesto">
        <p className="em-quote">{quote}</p>
        <span className="em-quote-attr">{quoteAttr}</span>
      </section>

      {/* Selected works — numbered list */}
      <section className="em-works">
        <div className="em-works-head">
          <span className="em-section-tag">SELECTED WORKS / 2024 — 2026</span>
          <span className="em-section-meta">42 entries · view all ↗</span>
        </div>
        <ul className="em-works-list">
          {works.map((w, i) => (
            <li key={i} className="em-works-row">
              <span className="em-works-no">{w.no}</span>
              <div className="em-works-name">
                <strong>{w.name}</strong>
                <span>{w.cat}</span>
              </div>
              <span className="em-works-year">{w.year}</span>
              <span className="em-works-cta">read ↗</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Featured editorial — 2 col image + text */}
      <section className="em-feature">
        <figure className="em-feature-fig">
          <img src={images[1]} alt="" />
          <figcaption>fig. 02 · interior detail</figcaption>
        </figure>
        <div className="em-feature-text">
          <span className="em-section-tag">EDITORIAL · ESSAY</span>
          <h2 className="em-feature-title">잘 만든 공간은,<br /><em>오래 머무르게 한다.</em></h2>
          <p>
            우리가 디자인하는 것은 단순히 결과물이 아닙니다. 손님이 머무르는 시간,
            바라보는 각도, 손에 닿는 질감까지 — 사용하는 사람의 경험 전체를
            설계합니다.
          </p>
          <p className="em-feature-byline">
            <strong>Writer</strong> — Jihye Park<br />
            <strong>Photography</strong> — Studio Noir
          </p>
          <span className="em-section-meta">read full essay ↗</span>
        </div>
      </section>

      {/* Events / agenda */}
      <section className="em-agenda">
        <div className="em-agenda-head">
          <span className="em-section-tag">AGENDA · UPCOMING</span>
          <span className="em-section-meta">subscribe to newsletter ↗</span>
        </div>
        <div className="em-agenda-grid">
          {events.map((ev, i) => (
            <div key={i} className="em-agenda-card">
              <span className="em-agenda-when">{ev.when}</span>
              <h4 className="em-agenda-title">{ev.title}</h4>
              <span className="em-agenda-where">{ev.where}</span>
              <span className="em-agenda-rsvp">RSVP →</span>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="em-foot">
        <div className="em-foot-grid">
          <div>
            <div className="em-foot-brand">
              <span className="em-nav-mark" style={{ color: m.accent }}>{m.logoIcon}</span>
              {m.brand}
            </div>
            <p className="em-foot-tag">{tagline}</p>
          </div>
          <div className="em-foot-col">
            <span className="em-foot-col-head">visit</span>
            <span>서울 용산구 OO길 24</span>
            <span>tue — sun · 17:00 — 24:00</span>
          </div>
          <div className="em-foot-col">
            <span className="em-foot-col-head">contact</span>
            <span>02 — 000 — 0000</span>
            <span>hello@{m.domain.split('.').slice(-2).join('.')}</span>
          </div>
          <div className="em-foot-col">
            <span className="em-foot-col-head">follow</span>
            <span>instagram ↗</span>
            <span>journal ↗</span>
          </div>
        </div>
        <div className="em-foot-line">© 2026 {m.brand}. all rights reserved.</div>
      </footer>
    </article>
  );
}
