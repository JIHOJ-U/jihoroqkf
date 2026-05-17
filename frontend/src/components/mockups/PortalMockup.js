import React from 'react';
import {
  HiOutlineDocumentText, HiOutlineCalendar, HiOutlinePhone,
  HiOutlineSpeakerphone, HiArrowRight, HiOutlineHeart,
  HiOutlineCheckCircle, HiOutlineGlobe,
} from 'react-icons/hi';

/* Portal mockup — citizen-facing big-imagery layout
   for public services (fire, smart city, youth policy)
   and cause/NGO (env, social enterprise). */

export default function PortalMockup({ data: ref, lang }) {
  const m = ref.mockup;
  const p = ref.portal || {};

  const heroLine = p.heroLine || (lang === 'ko'
    ? '모두를 위한, 더 나은 일상.'
    : 'A better everyday, for everyone.');
  const tagline = p.tagline || ref.subKo || ref.titleEn;

  // Quick action grid — 6 prominent citizen actions
  const quickActions = p.quickActions || [
    { name: m.actions?.[0] || '신청하기',  icon: '📝', color: '#3b82f6', desc: '온라인 1분 신청' },
    { name: m.actions?.[1] || '예약하기',  icon: '📅', color: '#10b981', desc: '편한 시간 선택' },
    { name: m.actions?.[2] || '조회·문의', icon: '🔍', color: '#f59e0b', desc: '내 신청 상태' },
    { name: m.menu?.[2]?.name || '자료실', icon: '📚', color: '#8b5cf6', desc: '안내·정책 자료' },
    { name: m.menu?.[3]?.name || '소식·공지', icon: '📢', color: '#ec4899', desc: '실시간 알림' },
    { name: '챗봇 상담', icon: '💬', color: '#06b6d4', desc: '24시간 응답' },
  ];

  // Progress / campaign meter (for NGO / cause use)
  const showProgress = p.showProgress ?? (ref.cat === 'nonprofit');
  const progress = p.progress || {
    title: '바다 정화 캠페인 2026',
    raised: 28_400_000,
    goal:   35_000_000,
    donors: 482,
    days:   12,
  };
  const progressPct = Math.round((progress.raised / progress.goal) * 100);

  const news = p.news || (m.notices || []).slice(0, 4);
  const stats = p.stats || (m.stats || []).slice(0, 4);

  const isCause = ref.cat === 'nonprofit';

  return (
    <article className="pm">
      {/* Top bar — accessibility + lang + login */}
      <div className="pm-topbar">
        <span className="pm-topbar-link">
          <HiOutlineCheckCircle /> 인증 완료
        </span>
        <span className="pm-topbar-spacer">·</span>
        <span className="pm-topbar-link">자동로그인</span>
        <div className="pm-topbar-right">
          <span className="pm-topbar-link">고대비</span>
          <span className="pm-topbar-link">A+</span>
          <span className="pm-topbar-spacer">|</span>
          <span className="pm-topbar-link"><HiOutlineGlobe /> KO ▾</span>
          <span className="pm-topbar-spacer">|</span>
          <span className="pm-topbar-link pm-topbar-login">로그인</span>
        </div>
      </div>

      {/* Nav */}
      <header className="pm-nav">
        <div className="pm-nav-brand">
          <span className="pm-nav-mark" style={{ background: m.accent }}>{m.logoIcon}</span>
          <div>
            <strong>{m.brand}</strong>
            <span>{tagline}</span>
          </div>
        </div>
        <nav className="pm-nav-menu">
          {(m.menu || []).slice(0, 5).map((mi, i) => (
            <span key={i} className={i === 0 ? 'pm-nav-link pm-nav-link--active' : 'pm-nav-link'}>
              {mi.name}
            </span>
          ))}
        </nav>
        <button className="pm-nav-cta" style={{ background: m.accent }}>
          {isCause ? <><HiOutlineHeart /> 후원하기</> : <><HiOutlinePhone /> 1:1 문의</>}
        </button>
      </header>

      {/* Hero — full-bleed image + overlay */}
      <section className="pm-hero">
        <div className="pm-hero-img">
          <img src={ref.img} alt="" />
          <div className="pm-hero-tint" style={{ background: `linear-gradient(135deg, ${m.accent}cc 0%, rgba(15, 17, 23, 0.55) 100%)` }} />
        </div>
        <div className="pm-hero-inner">
          <span className="pm-hero-eyebrow">— {tagline}</span>
          <h1 className="pm-hero-headline">{heroLine}</h1>
          <p className="pm-hero-sub">
            {ref.descKo || ref.descEn}
          </p>

          {/* Quick stats — for NGO this is impact, for public it's service stats */}
          <div className="pm-hero-stats">
            {stats.map((s, i) => (
              <div key={i} className="pm-hero-stat">
                <strong>{s.value}<small>{s.unit}</small></strong>
                <span>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick actions grid — the heart of a portal */}
      <section className="pm-actions">
        <header className="pm-section-head">
          <span className="pm-section-tag" style={{ color: m.accent }}>
            {isCause ? '— 함께하기' : '— 자주 찾는 서비스'}
          </span>
          <h2 className="pm-section-title">
            {isCause ? '지금, 변화의 첫 걸음을 함께해주세요' : '한 번에 빠르게 찾는 서비스'}
          </h2>
        </header>
        <div className="pm-actions-grid">
          {quickActions.map((a, i) => (
            <button key={i} className="pm-action-card">
              <span className="pm-action-icon" style={{ background: `${a.color}18`, color: a.color }}>
                {a.icon}
              </span>
              <div className="pm-action-body">
                <strong>{a.name}</strong>
                <span>{a.desc}</span>
              </div>
              <HiArrowRight className="pm-action-arrow" />
            </button>
          ))}
        </div>
      </section>

      {/* Campaign progress (only for cause) */}
      {showProgress && (
        <section className="pm-campaign" style={{ background: `${m.accent}06` }}>
          <div className="pm-campaign-inner">
            <div className="pm-campaign-text">
              <span className="pm-section-tag" style={{ color: m.accent }}>— 진행중 캠페인</span>
              <h2 className="pm-campaign-title">{progress.title}</h2>
              <p className="pm-campaign-sub">
                바다에 흘러드는 폐기물을 줄이기 위한 시민 참여 프로젝트.
                여러분의 작은 후원이 큰 변화를 만듭니다.
              </p>
              <div className="pm-campaign-bar">
                <div className="pm-campaign-bar-fill" style={{ width: `${progressPct}%`, background: m.accent }} />
              </div>
              <div className="pm-campaign-meta">
                <div>
                  <strong style={{ color: m.accent }}>{progress.raised.toLocaleString()}원</strong>
                  <span>모금됨 ({progressPct}%)</span>
                </div>
                <div>
                  <strong>{progress.goal.toLocaleString()}원</strong>
                  <span>목표 금액</span>
                </div>
                <div>
                  <strong>{progress.donors}명</strong>
                  <span>후원자</span>
                </div>
                <div>
                  <strong>D-{progress.days}</strong>
                  <span>마감까지</span>
                </div>
              </div>
            </div>
            <div className="pm-campaign-amounts">
              <div className="pm-campaign-amounts-head">한 번에 후원하기</div>
              <div className="pm-campaign-amounts-grid">
                {[10000, 30000, 50000, 100000, 200000, 500000].map((amt) => (
                  <button key={amt}>{amt.toLocaleString()}원</button>
                ))}
              </div>
              <button className="pm-btn pm-btn--solid pm-btn--full" style={{ background: m.accent }}>
                <HiOutlineHeart /> 후원하기 <HiArrowRight />
              </button>
              <div className="pm-campaign-trust">
                <HiOutlineCheckCircle /> 기부금 영수증 발급 · 사용내역 투명 공개
              </div>
            </div>
          </div>
        </section>
      )}

      {/* News & notices */}
      <section className="pm-news">
        <header className="pm-section-head pm-section-head--row">
          <div>
            <span className="pm-section-tag" style={{ color: m.accent }}>
              <HiOutlineSpeakerphone style={{ verticalAlign: '-2px' }} /> — 소식·공지
            </span>
            <h2 className="pm-section-title">최근 업데이트</h2>
          </div>
          <span className="pm-news-link">전체 보기 →</span>
        </header>

        <div className="pm-news-grid">
          {news.map((n, i) => (
            <article key={i} className="pm-news-card">
              <div className="pm-news-img" style={{
                background: `linear-gradient(135deg, ${m.accent} 0%, ${m.accent}aa 100%)`,
              }}>
                <span className="pm-news-img-icon">
                  {['📰', '📊', '🎯', '✨'][i]}
                </span>
              </div>
              <div className="pm-news-body">
                <div className="pm-news-meta">
                  <span className="pm-news-tag" style={{ background: `${m.accent}18`, color: m.accent }}>
                    {n.type}
                  </span>
                  <span className="pm-news-date">2026.05.{17 - i}</span>
                </div>
                <h3 className="pm-news-title">{n.title}</h3>
                <span className="pm-news-cta" style={{ color: m.accent }}>자세히 →</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Help band */}
      <section className="pm-help">
        <div className="pm-help-inner">
          <div className="pm-help-icon" style={{ background: `${m.accent}18`, color: m.accent }}>
            <HiOutlineDocumentText />
          </div>
          <div className="pm-help-text">
            <h3>어떤 서비스를 찾으시나요?</h3>
            <p>운영지원팀이 평일 09~18시 사이 30분 안에 답변드립니다. 전화는 즉시 응답 가능합니다.</p>
          </div>
          <div className="pm-help-actions">
            <button className="pm-btn pm-btn--solid" style={{ background: m.accent }}>
              <HiOutlineCalendar /> 1:1 상담 예약
            </button>
            <button className="pm-btn pm-btn--ghost">
              <HiOutlinePhone /> 02-000-0000
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="pm-foot">
        <div className="pm-foot-cols">
          <div className="pm-foot-brand">
            <span className="pm-nav-mark" style={{ background: m.accent }}>{m.logoIcon}</span>
            <div>
              <strong>{m.brand}</strong>
              <span>{tagline}</span>
            </div>
          </div>
          <div className="pm-foot-col">
            <strong>기관 소개</strong>
            <span>인사말</span>
            <span>연혁</span>
            <span>조직도</span>
          </div>
          <div className="pm-foot-col">
            <strong>서비스</strong>
            <span>{m.menu?.[0]?.name || '대시보드'}</span>
            <span>{m.menu?.[1]?.name || '프로젝트'}</span>
            <span>{m.menu?.[2]?.name || '자료실'}</span>
          </div>
          <div className="pm-foot-col">
            <strong>고객 지원</strong>
            <span>02-000-0000</span>
            <span>support@{m.domain.split('.').slice(-2).join('.')}</span>
            <span>평일 09:00 — 18:00</span>
          </div>
        </div>
        <div className="pm-foot-line">
          © 2026 {m.brand}. 본 사이트의 콘텐츠는 정보 제공 목적입니다.
        </div>
      </footer>
    </article>
  );
}
