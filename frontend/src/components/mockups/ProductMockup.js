import React from 'react';
import { HiArrowRight, HiCheck, HiOutlineSparkles } from 'react-icons/hi';

/* Product mockup — Linear/Stripe-style SaaS landing
   for AI tools, SaaS apps, online education products. */

export default function ProductMockup({ data: ref, lang }) {
  const m = ref.mockup;
  const pr = ref.product || {};

  const heroLine  = pr.heroLine  || (lang === 'ko' ? '복잡한 일을 단순하게.' : 'Make complex work simple.');
  const heroSub   = pr.heroSub   || ref.descKo;
  const tagline   = pr.tagline   || (lang === 'ko' ? 'NEW · v2.0 출시' : 'NEW · v2.0 released');
  const features  = pr.features  || (m.menu || []).slice(0, 3).map((mi, i) => ({
    name: mi.name,
    desc: [
      '복잡한 설정 없이 바로 시작. 5분이면 첫 결과를 볼 수 있어요.',
      '팀 전체가 같은 데이터를 실시간으로 확인하고 협업합니다.',
      '엔터프라이즈급 보안 — SOC 2 Type II 인증, SSO 지원.',
    ][i],
    icon: ['⚡', '🤝', '🔒'][i],
  }));
  const logos = pr.logos || ['NORDIC', 'AURA', 'VERTEX', 'LUMEN', 'HELIX', 'OBSIDIAN'];
  const plans = pr.plans || [
    { name: 'Starter', price: '무료', tagline: '개인·소규모 팀',
      features: ['최대 5명', '5GB 저장', '기본 기능', '커뮤니티 지원'], highlight: false },
    { name: 'Pro', price: '₩9,900', period: '/seat/월', tagline: '성장하는 팀',
      features: ['무제한 인원', '100GB 저장', '모든 기능', '우선 지원', 'API 액세스'], highlight: true },
    { name: 'Enterprise', price: '문의', tagline: '엔터프라이즈',
      features: ['SSO·SAML', '전담 매니저', 'SLA 보장', 'On-premise 옵션', '맞춤 인증'], highlight: false },
  ];

  return (
    <article className="prm">
      {/* Top nav */}
      <header className="prm-nav">
        <div className="prm-nav-brand">
          <span className="prm-nav-mark" style={{ color: m.accent }}>{m.logoIcon}</span>
          <span>{m.brand}</span>
        </div>
        <nav className="prm-nav-menu">
          <span>제품 <span className="prm-nav-chev">▾</span></span>
          <span>활용 사례 <span className="prm-nav-chev">▾</span></span>
          <span>가격</span>
          <span>문서</span>
          <span>고객 사례</span>
        </nav>
        <div className="prm-nav-right">
          <span className="prm-nav-signin">로그인</span>
          <button className="prm-nav-cta">무료로 시작 <HiArrowRight /></button>
        </div>
      </header>

      {/* Hero */}
      <section className="prm-hero">
        <div className="prm-hero-bg">
          <span className="prm-hero-blob prm-hero-blob--1" style={{ background: `radial-gradient(circle, ${m.accent}aa, transparent 70%)` }} />
          <span className="prm-hero-blob prm-hero-blob--2" />
          <div className="prm-hero-grid" />
        </div>

        <div className="prm-hero-inner">
          <span className="prm-hero-eyebrow">
            <span className="prm-hero-dot" />
            {tagline}
            <span className="prm-hero-link" style={{ color: m.accent }}>· 자세히 보기 →</span>
          </span>
          <h1 className="prm-hero-headline">
            {heroLine.split('\n').map((l, i, a) => (
              <React.Fragment key={i}>
                {l}{i < a.length - 1 && <br />}
              </React.Fragment>
            ))}
          </h1>
          <p className="prm-hero-sub">{heroSub}</p>
          <div className="prm-hero-cta">
            <button className="prm-btn prm-btn--solid">
              무료로 시작하기
              <span className="prm-btn-arrow"><HiArrowRight /></span>
            </button>
            <button className="prm-btn prm-btn--ghost">
              <span className="prm-btn-play" style={{ background: m.accent }}>▶</span>
              90초 데모 보기
            </button>
          </div>
        </div>

        {/* Hero product screenshot — fake "in-app" preview */}
        <div className="prm-hero-screen">
          <div className="prm-screen">
            <div className="prm-screen-bar">
              <span className="prm-screen-dot prm-screen-dot--r" />
              <span className="prm-screen-dot prm-screen-dot--y" />
              <span className="prm-screen-dot prm-screen-dot--g" />
              <div className="prm-screen-url">{m.domain}/dashboard</div>
            </div>
            <div className="prm-screen-body">
              <div className="prm-screen-sidebar">
                <div className="prm-screen-logo">{m.logoIcon}</div>
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className={`prm-screen-side-item ${i === 2 ? 'active' : ''}`} style={i === 2 ? { background: `${m.accent}22` } : {}} />
                ))}
              </div>
              <div className="prm-screen-main">
                <div className="prm-screen-row prm-screen-row--head">
                  <div className="prm-screen-title-bar" />
                  <div className="prm-screen-pill" style={{ background: m.accent }} />
                </div>
                <div className="prm-screen-cards">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="prm-screen-card">
                      <div className="prm-screen-card-label" />
                      <div className="prm-screen-card-val" style={{ background: m.accent }} />
                      <div className="prm-screen-card-spark">
                        <svg viewBox="0 0 100 24" preserveAspectRatio="none">
                          <polyline points={`0,${20-i*2} 20,${16-i} 40,${18-i*2} 60,${10-i} 80,${14-i} 100,${6-i}`}
                            fill="none" stroke={m.accent} strokeWidth="2" />
                        </svg>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="prm-screen-chart">
                  <svg viewBox="0 0 320 100" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="prmCh" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0" stopColor={m.accent} stopOpacity="0.4" />
                        <stop offset="1" stopColor={m.accent} stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path d="M0,75 L40,60 L80,68 L120,40 L160,48 L200,30 L240,38 L280,18 L320,28 L320,100 L0,100 Z" fill="url(#prmCh)" />
                    <path d="M0,75 L40,60 L80,68 L120,40 L160,48 L200,30 L240,38 L280,18 L320,28" stroke={m.accent} strokeWidth="2" fill="none" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trusted by */}
        <div className="prm-hero-trust">
          <span>이미 1만+ 팀이 사용중</span>
          <div className="prm-logos">
            {logos.map((l, i) => <span key={i}>{l}</span>)}
          </div>
        </div>
      </section>

      {/* Feature blocks */}
      <section className="prm-features">
        <header className="prm-section-head">
          <span className="prm-section-tag" style={{ color: m.accent }}>— FEATURES</span>
          <h2 className="prm-section-title">왜 {m.brand}인가요?</h2>
        </header>
        <div className="prm-features-grid">
          {features.map((f, i) => (
            <div key={i} className="prm-feature">
              <div className="prm-feature-icon" style={{
                background: `linear-gradient(135deg, ${m.accent}, ${m.accent}aa)`,
              }}>
                {f.icon}
              </div>
              <h3>{f.name}</h3>
              <p>{f.desc}</p>
              <span className="prm-feature-link" style={{ color: m.accent }}>자세히 →</span>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="prm-pricing">
        <header className="prm-section-head">
          <span className="prm-section-tag" style={{ color: m.accent }}>— PRICING</span>
          <h2 className="prm-section-title">팀 규모에 맞는 플랜</h2>
          <p className="prm-section-sub">언제든 변경·취소 가능 · 카드 등록 없이 시작</p>
        </header>

        <div className="prm-plans">
          {plans.map((p, i) => (
            <div key={i} className={`prm-plan ${p.highlight ? 'prm-plan--highlight' : ''}`}
                 style={p.highlight ? { borderColor: m.accent } : {}}>
              {p.highlight && (
                <span className="prm-plan-badge" style={{ background: m.accent }}>가장 인기</span>
              )}
              <div className="prm-plan-head">
                <h4>{p.name}</h4>
                <span>{p.tagline}</span>
              </div>
              <div className="prm-plan-price">
                <strong>{p.price}</strong>
                {p.period && <span>{p.period}</span>}
              </div>
              <ul className="prm-plan-features">
                {p.features.map((feat, fi) => (
                  <li key={fi}>
                    <HiCheck style={{ color: m.accent }} /> {feat}
                  </li>
                ))}
              </ul>
              <button
                className={`prm-plan-btn ${p.highlight ? 'prm-plan-btn--solid' : 'prm-plan-btn--ghost'}`}
                style={p.highlight ? { background: m.accent } : {}}
              >
                {p.name === 'Enterprise' ? '문의하기' : '시작하기'} <HiArrowRight />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA band */}
      <section className="prm-cta" style={{
        background: `linear-gradient(135deg, ${m.accent} 0%, ${m.accent}cc 100%)`,
      }}>
        <div className="prm-cta-inner">
          <h2>
            <HiOutlineSparkles /> 오늘부터 시작해보세요
          </h2>
          <p>5분 안에 첫 결과 — 카드 등록 없이 무료로</p>
          <button className="prm-cta-btn">
            무료로 시작하기 <HiArrowRight />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="prm-foot">
        <div className="prm-foot-brand">
          <span className="prm-nav-mark" style={{ color: m.accent }}>{m.logoIcon}</span>
          <strong>{m.brand}</strong>
        </div>
        <div className="prm-foot-cols">
          <div>
            <strong>제품</strong>
            <span>기능</span><span>가격</span><span>업데이트</span>
          </div>
          <div>
            <strong>회사</strong>
            <span>소개</span><span>채용</span><span>블로그</span>
          </div>
          <div>
            <strong>지원</strong>
            <span>문서</span><span>API</span><span>상태</span>
          </div>
        </div>
      </footer>
    </article>
  );
}
