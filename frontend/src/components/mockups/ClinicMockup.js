import React from 'react';
import {
  HiOutlinePhone, HiOutlineCalendar, HiOutlineLocationMarker,
  HiOutlineShieldCheck, HiOutlineStar, HiOutlineUserCircle,
  HiCheck, HiArrowRight,
} from 'react-icons/hi';

/* Clinic mockup — soft pastel white-space medical/wellness layout
   for aesthetic clinic, dental, oriental medicine. */

export default function ClinicMockup({ data: ref, lang }) {
  const m = ref.mockup;
  const c = ref.clinic || {};

  const headline    = c.headline    || (lang === 'ko' ? '오늘보다 조금 더\n나은 나를 위해.' : 'A better you, today.');
  const tagline     = c.tagline     || ref.subKo;
  const trustBadges = c.trustBadges || ['보건복지부 인증', 'JCI 국제 인증', '15년 운영'];
  const treatments  = c.treatments  || (m.menu || []).slice(0, 4).map((mi, i) => ({
    name: mi.name,
    desc: ['10년 이상의 임상 경험으로 안전하게', '환자별 맞춤 상담 + 사전 시뮬레이션', '회복 기간 단축을 위한 사후 케어', '비대면 상담도 가능 — 부담 없이 문의'][i],
    duration: ['30~60분', '20~40분', '60~90분', '15~30분'][i],
    badge:    [null, 'Most popular', null, 'Free consult'][i],
  }));
  const doctors = c.doctors || [
    { name: '김OO 원장', title: '대표 원장 · 14년 경력', tags: ['주력 분야 1', '주력 분야 2'] },
    { name: '이OO 부원장', title: '부원장 · 9년 경력',    tags: ['세부 시술'] },
    { name: '박OO 실장', title: '상담실장 · 8년 경력',   tags: ['상담 전문'] },
  ];
  const reviews = c.reviews || [
    { name: '김지유', verified: true, text: '상담 때부터 진솔하게 설명해주셔서 안심이 됐어요. 결과도 자연스럽고 만족합니다.' },
    { name: '이서윤', verified: true, text: '회복 기간 동안 매일 문자로 케어 안내가 와서 든든했어요.' },
    { name: '박하늘', verified: true, text: '비교 견적 받아봤는데 가장 친절하고 깔끔했습니다.' },
  ];

  return (
    <article className="cm">
      {/* Top trust strip */}
      <div className="cm-trust">
        <span><HiOutlineShieldCheck /> 보건복지부 의료기관 인증</span>
        <span className="cm-trust-sep">·</span>
        <span>비대면 상담 가능</span>
        <span className="cm-trust-sep">·</span>
        <span>주차 무료</span>
        <span className="cm-trust-right"><HiOutlinePhone /> 02-000-0000</span>
      </div>

      {/* Nav */}
      <header className="cm-nav">
        <div className="cm-nav-brand">
          <span className="cm-nav-mark" style={{ background: m.accent }}>{m.logoIcon}</span>
          <div>
            <strong>{m.brand}</strong>
            <span>{tagline}</span>
          </div>
        </div>
        <nav className="cm-nav-menu">
          {(m.menu || []).slice(0, 5).map((mi, i) => (
            <span key={i} className={i === 0 ? 'cm-nav-link cm-nav-link--active' : 'cm-nav-link'}>
              {mi.name}
            </span>
          ))}
        </nav>
        <button className="cm-nav-cta" style={{ background: m.accent }}>
          <HiOutlineCalendar /> 상담 예약
        </button>
      </header>

      {/* Hero */}
      <section className="cm-hero" style={{ background: `linear-gradient(135deg, ${m.accent}12 0%, transparent 60%)` }}>
        <div className="cm-hero-text">
          <span className="cm-hero-eyebrow" style={{ color: m.accent }}>
            ● {tagline}
          </span>
          <h1 className="cm-hero-line">
            {headline.split('\n').map((l, i, a) => (
              <React.Fragment key={i}>{l}{i < a.length - 1 && <br />}</React.Fragment>
            ))}
          </h1>
          <p className="cm-hero-sub">
            {ref.descKo || ref.descEn}<br />
            첫 상담은 무료입니다. 부담 없이 문의해주세요.
          </p>
          <div className="cm-hero-actions">
            <button className="cm-btn cm-btn--solid" style={{ background: m.accent }}>
              온라인 상담 예약 <HiArrowRight />
            </button>
            <button className="cm-btn cm-btn--ghost">
              <HiOutlinePhone /> 전화 상담
            </button>
          </div>
          <div className="cm-hero-badges">
            {trustBadges.map((b, i) => (
              <span key={i} className="cm-hero-badge">
                <HiCheck style={{ color: m.accent }} /> {b}
              </span>
            ))}
          </div>
        </div>
        <div className="cm-hero-img">
          <img src={ref.img} alt="" />
          <div className="cm-hero-card">
            <div className="cm-hero-card-row">
              <HiOutlineStar style={{ color: '#f59e0b' }} />
              <strong>4.9</strong>
              <span>· 1,248 reviews</span>
            </div>
            <div className="cm-hero-card-sub">"상담부터 사후 관리까지 정말 친절해요"</div>
          </div>
        </div>
      </section>

      {/* Stats / KPIs */}
      <section className="cm-stats">
        {(m.stats || []).slice(0, 4).map((s, i) => (
          <div key={i} className="cm-stat">
            <div className="cm-stat-value" style={{ color: m.accent }}>{s.value}<small>{s.unit}</small></div>
            <div className="cm-stat-label">{s.label}</div>
          </div>
        ))}
      </section>

      {/* Treatments */}
      <section className="cm-treatments">
        <header className="cm-section-head">
          <span className="cm-section-tag" style={{ color: m.accent }}>TREATMENTS</span>
          <h2 className="cm-section-title">시술 메뉴</h2>
          <p className="cm-section-sub">환자 한 분 한 분의 상태에 맞춰 안전하게 진행합니다.</p>
        </header>
        <div className="cm-treat-grid">
          {treatments.map((t, i) => (
            <div key={i} className="cm-treat-card">
              {t.badge && (
                <span className="cm-treat-badge" style={{ background: m.accent }}>{t.badge}</span>
              )}
              <div className="cm-treat-icon" style={{ background: `${m.accent}18`, color: m.accent }}>
                {['✚', '◇', '◎', '✦'][i]}
              </div>
              <h3 className="cm-treat-name">{t.name}</h3>
              <p className="cm-treat-desc">{t.desc}</p>
              <div className="cm-treat-meta">
                <span><HiOutlineCalendar /> 시술 {t.duration}</span>
                <span className="cm-treat-arrow" style={{ color: m.accent }}>자세히 →</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Doctors */}
      <section className="cm-doctors">
        <header className="cm-section-head cm-section-head--center">
          <span className="cm-section-tag" style={{ color: m.accent }}>OUR TEAM</span>
          <h2 className="cm-section-title">의료진</h2>
        </header>
        <div className="cm-doc-grid">
          {doctors.map((d, i) => (
            <div key={i} className="cm-doc-card">
              <div className="cm-doc-photo" style={{ background: `linear-gradient(135deg, ${m.accent}30, ${m.accent}10)` }}>
                <HiOutlineUserCircle />
              </div>
              <h4 className="cm-doc-name">{d.name}</h4>
              <p className="cm-doc-title">{d.title}</p>
              <ul className="cm-doc-tags">
                {d.tags.map((tg, ti) => (
                  <li key={ti} style={{ borderColor: `${m.accent}40`, color: m.accent }}>{tg}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Reviews */}
      <section className="cm-reviews">
        <header className="cm-section-head">
          <span className="cm-section-tag" style={{ color: m.accent }}>REVIEWS</span>
          <h2 className="cm-section-title">실제 후기</h2>
          <p className="cm-section-sub">
            의료법상 시술 효과는 개인차가 있을 수 있어요. 검증된 회원 후기만 노출합니다.
          </p>
        </header>
        <div className="cm-rev-grid">
          {reviews.map((r, i) => (
            <figure key={i} className="cm-rev">
              <div className="cm-rev-stars">
                {Array.from({ length: 5 }).map((_, si) => <HiOutlineStar key={si} style={{ color: '#f59e0b' }} />)}
              </div>
              <blockquote>{r.text}</blockquote>
              <figcaption>
                <span className="cm-rev-ava" style={{ background: `${m.accent}25`, color: m.accent }}>{r.name[0]}</span>
                <div>
                  <strong>{r.name}</strong>
                  {r.verified && (
                    <span className="cm-rev-verified" style={{ color: m.accent }}>
                      <HiCheck /> 인증된 방문 회원
                    </span>
                  )}
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* Location / hours */}
      <section className="cm-location" style={{ background: `${m.accent}08` }}>
        <div className="cm-loc-info">
          <span className="cm-section-tag" style={{ color: m.accent }}>VISIT</span>
          <h2 className="cm-section-title">오시는 길</h2>
          <p className="cm-loc-addr"><HiOutlineLocationMarker /> 서울특별시 강남구 OO로 24, 5층</p>
          <div className="cm-loc-hours">
            <div><strong>평일</strong> 10:00 – 19:00</div>
            <div><strong>토요일</strong> 10:00 – 16:00</div>
            <div><strong>일요일/공휴일</strong> 휴진</div>
          </div>
          <button className="cm-btn cm-btn--solid" style={{ background: m.accent }}>
            지도에서 보기 <HiArrowRight />
          </button>
        </div>
        <div className="cm-loc-map">
          <div className="cm-loc-map-pin" style={{ background: m.accent }}>
            <span>{m.logoIcon}</span>
          </div>
          <div className="cm-loc-map-grid" />
        </div>
      </section>

      {/* Footer */}
      <footer className="cm-foot">
        <span>{m.brand} · 의료법 제27조에 따라 본 정보는 일반 안내용입니다.</span>
        <span>© 2026 All rights reserved.</span>
      </footer>
    </article>
  );
}
