import React from 'react';
import {
  HiOutlineLocationMarker, HiOutlinePhone, HiOutlineClock,
  HiOutlineHeart, HiOutlineShoppingBag, HiStar, HiArrowRight,
} from 'react-icons/hi';

/* Hospitality mockup — warm cream, photo-driven layout
   for bakery, hair salon, real estate (local places). */

export default function HospitalityMockup({ data: ref, lang }) {
  const m = ref.mockup;
  const h = ref.hospitality || {};

  const heroLine = h.heroLine || (lang === 'ko' ? '오늘, 가까운 곳에서 발견하세요.' : 'Discover, nearby.');
  const tagline  = h.tagline  || ref.subKo;
  const features = h.features || (m.menu || []).slice(0, 4).map((mi, i) => ({
    name: mi.name,
    price: ['₩48,000부터', '₩128,000부터', '₩76,000부터', '₩32,000부터'][i],
    tag:   ['SIGNATURE', 'NEW', 'POPULAR', 'LIMITED'][i],
    img:   (h.images && h.images[i]) || ref.img,
  }));
  const story = h.story || (lang === 'ko'
    ? '동네에서 시작한 작은 가게입니다. 매일 새벽 4시, 가장 먼저 도착한 재료로 손으로 빚어내요. 빠른 것보다 정직한 것을 택합니다.'
    : 'A small neighborhood place. Every morning at 4am, we start by hand with the freshest ingredients. We pick honest over fast.');
  const hours = h.hours || [
    { day: '월-금', time: '08:00 — 21:00' },
    { day: '토요일',  time: '09:00 — 22:00' },
    { day: '일요일',  time: '10:00 — 20:00' },
    { day: '공휴일',  time: '휴무 (인스타그램 공지)' },
  ];

  return (
    <article className="hm">
      {/* Top utility */}
      <div className="hm-util">
        <span>📍 강남점 · 한남점 · 성수점</span>
        <span className="hm-util-spacer">|</span>
        <span>오늘 영업 중 · 21시 마감</span>
        <span className="hm-util-right">
          <HiOutlineHeart /> 위시리스트 <span className="hm-util-badge">3</span>
        </span>
      </div>

      {/* Nav — wordmark center */}
      <header className="hm-nav">
        <div className="hm-nav-left">
          <span className="hm-nav-link">메뉴</span>
          <span className="hm-nav-link">매장</span>
          <span className="hm-nav-link">이야기</span>
        </div>
        <div className="hm-nav-brand">{m.brand}</div>
        <div className="hm-nav-right">
          <span className="hm-nav-link">로그인</span>
          <button className="hm-nav-cta" style={{ background: m.accent }}>
            <HiOutlineShoppingBag /> 주문하기
          </button>
        </div>
      </header>

      {/* Hero — split with offset image */}
      <section className="hm-hero">
        <div className="hm-hero-text">
          <span className="hm-hero-eyebrow" style={{ color: m.accent }}>— {tagline}</span>
          <h1 className="hm-hero-line">
            {heroLine}
          </h1>
          <p className="hm-hero-sub">
            {ref.descKo || ref.descEn}
          </p>
          <div className="hm-hero-actions">
            <button className="hm-btn hm-btn--solid" style={{ background: m.accent }}>
              자세히 보기 <HiArrowRight />
            </button>
            <button className="hm-btn hm-btn--ghost">매장 찾기</button>
          </div>
          <div className="hm-hero-foot">
            <div>
              <strong style={{ color: m.accent }}>★ 4.9</strong>
              <span>네이버 리뷰 1,248건</span>
            </div>
            <div className="hm-hero-foot-sep" />
            <div>
              <strong style={{ color: m.accent }}>8년</strong>
              <span>꾸준히 사랑받은</span>
            </div>
          </div>
        </div>
        <div className="hm-hero-imgs">
          <div className="hm-hero-img hm-hero-img--main">
            <img src={ref.img} alt="" />
          </div>
          <div className="hm-hero-img hm-hero-img--sub">
            <img src={ref.img} alt="" />
          </div>
          <div className="hm-hero-stamp" style={{ color: m.accent }}>
            EST.<br />2018
          </div>
        </div>
      </section>

      {/* Featured items grid */}
      <section className="hm-featured">
        <div className="hm-section-head">
          <div>
            <span className="hm-section-tag" style={{ color: m.accent }}>— TODAY'S FEATURED</span>
            <h2 className="hm-section-title">오늘의 추천</h2>
          </div>
          <div className="hm-feat-tabs">
            <span className="hm-feat-tab hm-feat-tab--active">전체</span>
            {(m.menu || []).slice(0, 3).map((mi, i) => (
              <span key={i} className="hm-feat-tab">{mi.name}</span>
            ))}
          </div>
        </div>

        <div className="hm-feat-grid">
          {features.map((f, i) => (
            <div key={i} className="hm-feat-card">
              <div className="hm-feat-img">
                <img src={f.img} alt={f.name} />
                <span className="hm-feat-tag" style={{ background: m.accent }}>{f.tag}</span>
                <button className="hm-feat-fav">
                  <HiOutlineHeart />
                </button>
              </div>
              <div className="hm-feat-body">
                <h3 className="hm-feat-name">{f.name}</h3>
                <div className="hm-feat-meta">
                  <span className="hm-feat-price">{f.price}</span>
                  <span className="hm-feat-rate">
                    <HiStar style={{ color: '#fbbf24' }} /> 4.{8 + (i % 2)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Story band */}
      <section className="hm-story">
        <div className="hm-story-text">
          <span className="hm-section-tag" style={{ color: m.accent }}>— OUR STORY</span>
          <h2 className="hm-story-title">손으로 만드는<br />작은 정성.</h2>
          <p className="hm-story-body">{story}</p>
          <div className="hm-story-sig" style={{ color: m.accent }}>
            <em>{m.brand}</em>
            <span>founder & owner</span>
          </div>
        </div>
        <div className="hm-story-imgs">
          <div className="hm-story-img hm-story-img--1"><img src={ref.img} alt="" /></div>
          <div className="hm-story-img hm-story-img--2"><img src={ref.img} alt="" /></div>
          <div className="hm-story-img hm-story-img--3"><img src={ref.img} alt="" /></div>
        </div>
      </section>

      {/* Map + hours */}
      <section className="hm-visit">
        <div className="hm-visit-map">
          <div className="hm-visit-map-grid" />
          <div className="hm-visit-map-pin" style={{ background: m.accent }}>{m.logoIcon}</div>
          <div className="hm-visit-map-streets">
            <span className="hm-visit-street hm-visit-street--h" style={{ top: '34%' }} />
            <span className="hm-visit-street hm-visit-street--h" style={{ top: '68%' }} />
            <span className="hm-visit-street hm-visit-street--v" style={{ left: '28%' }} />
            <span className="hm-visit-street hm-visit-street--v" style={{ left: '72%' }} />
          </div>
        </div>

        <div className="hm-visit-info">
          <span className="hm-section-tag" style={{ color: m.accent }}>— VISIT US</span>
          <h2 className="hm-visit-title">강남 본점</h2>

          <div className="hm-visit-line">
            <HiOutlineLocationMarker style={{ color: m.accent }} />
            <span>서울 강남구 OO로 24, 1층 · 신논현역 5번 출구</span>
          </div>
          <div className="hm-visit-line">
            <HiOutlinePhone style={{ color: m.accent }} />
            <span>02-000-0000</span>
          </div>

          <div className="hm-visit-hours">
            <div className="hm-visit-hours-head"><HiOutlineClock /> 영업 시간</div>
            {hours.map((h, i) => (
              <div key={i} className="hm-visit-hours-row">
                <span>{h.day}</span>
                <span>{h.time}</span>
              </div>
            ))}
          </div>

          <button className="hm-btn hm-btn--solid" style={{ background: m.accent }}>
            카카오 지도에서 보기 <HiArrowRight />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="hm-foot">
        <div className="hm-foot-brand">
          <span>{m.brand}</span>
          <em>{tagline}</em>
        </div>
        <div className="hm-foot-links">
          <span>이용약관</span>
          <span>·</span>
          <span>개인정보처리방침</span>
          <span>·</span>
          <span>고객센터</span>
        </div>
        <div className="hm-foot-copy">© 2026 {m.brand}. All rights reserved.</div>
      </footer>
    </article>
  );
}
