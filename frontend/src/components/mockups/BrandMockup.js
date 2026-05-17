import React from 'react';
import {
  HiStar, HiOutlineLocationMarker, HiOutlinePhone,
  HiOutlineCalendar, HiArrowRight, HiOutlineSparkles,
} from 'react-icons/hi';

/* Brand-style mockup — for lifestyle / service / hospitality refs.
   Emphasizes: hero photo, generous whitespace, editorial typography,
   service cards, lookbook gallery, review excerpts. */

export default function BrandMockup({ data: ref, lang }) {
  const m = ref.mockup;
  const b = ref.brand || {};

  // Defaults derived from existing mockup data
  const tagline    = b.tagline    || (lang === 'ko' ? '고요한 럭셔리, 매일의 일상에' : 'Quiet luxury, everyday');
  const heroLine   = b.heroLine   || ref.subKo || ref.titleEn;
  const heroSub    = b.heroSub    || ref.descKo;
  const heroCta    = b.heroCta    || (lang === 'ko' ? '예약하기' : 'Book now');
  const heroCta2   = b.heroCta2   || (lang === 'ko' ? '메뉴 보기' : 'See menu');
  const galleryImgs = b.gallery   || [ref.img, ref.img, ref.img, ref.img];
  const services   = b.services   || m.menu.slice(0, 3).map((mm, i) => ({
    name: mm.name,
    desc: i === 0 ? '핵심 서비스에 대한 짧고 우아한 설명입니다.'
          : i === 1 ? '두번째 서비스 — 고객의 기대를 넘어서는 디테일.'
                    : '세번째 서비스 — 마무리까지 완성도를 책임집니다.',
  }));
  const reviews = b.reviews || [
    { name: '김지유', rating: 5, text: '디자인부터 마무리까지 모든 게 정성스러웠어요. 다른 곳과 정말 달라요.' },
    { name: '이서윤', rating: 5, text: '결과물이 사진보다 더 좋았습니다. 친구들한테도 자신있게 소개해요.' },
  ];
  const stats = b.stats || [
    { label: '운영 연수', value: '7', suffix: 'YEARS' },
    { label: '서비스 회원', value: '4.8k', suffix: 'MEMBERS' },
    { label: '평균 평점', value: '4.9', suffix: '/ 5.0' },
  ];

  return (
    <article className="bm">
      {/* Top nav — minimal */}
      <header className="bm-nav">
        <div className="bm-nav-logo">
          <span className="bm-nav-mark" style={{ color: m.accent }}>{m.logoIcon}</span>
          <span>{m.brand}</span>
        </div>
        <nav className="bm-nav-menu">
          {m.menu.slice(0, 4).map((mi, i) => (
            <span key={i} className={i === 0 ? 'bm-nav-link bm-nav-link--active' : 'bm-nav-link'}>
              {mi.name}
            </span>
          ))}
        </nav>
        <button className="bm-nav-cta" style={{ background: m.accent }}>
          {heroCta} <HiArrowRight />
        </button>
      </header>

      {/* Hero */}
      <section className="bm-hero">
        <div className="bm-hero-img">
          <img src={ref.img} alt="" />
          <div className="bm-hero-overlay" />
        </div>
        <div className="bm-hero-content">
          <span className="bm-hero-eyebrow">— {tagline}</span>
          <h1 className="bm-hero-headline">
            {heroLine}
          </h1>
          <p className="bm-hero-sub">{heroSub}</p>
          <div className="bm-hero-actions">
            <button className="bm-btn bm-btn--solid" style={{ background: m.accent }}>
              {heroCta}
              <span className="bm-btn-arrow"><HiArrowRight /></span>
            </button>
            <button className="bm-btn bm-btn--ghost">
              {heroCta2}
            </button>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="bm-stats">
        {stats.map((s, i) => (
          <div key={i} className="bm-stat">
            <div className="bm-stat-value" style={{ color: m.accent }}>{s.value}</div>
            <div className="bm-stat-label">
              <span>{s.label}</span>
              <span className="bm-stat-suffix">{s.suffix}</span>
            </div>
          </div>
        ))}
      </section>

      {/* Services */}
      <section className="bm-services">
        <div className="bm-section-head">
          <span className="bm-section-tag">— OUR SERVICES</span>
          <h2 className="bm-section-title">정성스럽게,<br />하나하나.</h2>
        </div>
        <div className="bm-services-grid">
          {services.map((s, i) => (
            <div key={i} className="bm-service-card">
              <span className="bm-service-num">0{i + 1}</span>
              <h3 className="bm-service-name">{s.name}</h3>
              <p className="bm-service-desc">{s.desc}</p>
              <span className="bm-service-link" style={{ color: m.accent }}>
                자세히 <HiArrowRight />
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Lookbook / Gallery */}
      <section className="bm-gallery">
        <div className="bm-section-head bm-section-head--center">
          <span className="bm-section-tag">— LOOKBOOK</span>
          <h2 className="bm-section-title">최근 작업</h2>
        </div>
        <div className="bm-gallery-grid">
          <div className="bm-gallery-tile bm-gallery-tile--lg">
            <img src={galleryImgs[0]} alt="" />
            <div className="bm-gallery-caption">
              <span>2026.05</span>
              <strong>{m.brand} · 시그니처 시리즈</strong>
            </div>
          </div>
          <div className="bm-gallery-tile">
            <img src={galleryImgs[1]} alt="" />
            <div className="bm-gallery-caption"><strong>봄 컬렉션</strong></div>
          </div>
          <div className="bm-gallery-tile">
            <img src={galleryImgs[2]} alt="" />
            <div className="bm-gallery-caption"><strong>스튜디오</strong></div>
          </div>
          <div className="bm-gallery-tile">
            <img src={galleryImgs[3]} alt="" />
            <div className="bm-gallery-caption"><strong>비하인드</strong></div>
          </div>
        </div>
      </section>

      {/* Booking / Action band */}
      <section className="bm-booking">
        <div className="bm-booking-left">
          <span className="bm-section-tag">— BOOKING</span>
          <h2 className="bm-section-title">언제 방문하시겠어요?</h2>
          <p className="bm-booking-text">
            온라인으로 빠르게 예약하세요. 1분 안에 끝나고,
            카카오톡으로 안내드립니다. 변경·취소도 한 번에.
          </p>
          <button className="bm-btn bm-btn--solid bm-btn--lg" style={{ background: m.accent }}>
            <HiOutlineCalendar />
            예약 캘린더 열기
            <span className="bm-btn-arrow"><HiArrowRight /></span>
          </button>
        </div>
        <div className="bm-booking-right">
          <div className="bm-cal">
            <div className="bm-cal-head">
              <span>2026 · 5월</span>
              <div className="bm-cal-nav">
                <span>‹</span><span>›</span>
              </div>
            </div>
            <div className="bm-cal-dow">
              {['일','월','화','수','목','금','토'].map((d, i) => <span key={i}>{d}</span>)}
            </div>
            <div className="bm-cal-grid">
              {Array.from({ length: 35 }, (_, i) => {
                const day = i - 3;
                if (day < 1 || day > 31) return <span key={i} className="bm-cal-day bm-cal-day--off" />;
                const isToday = day === 18;
                const isAvail = [3, 5, 8, 12, 15, 18, 22, 25, 27].includes(day);
                return (
                  <span
                    key={i}
                    className={`bm-cal-day ${isToday ? 'bm-cal-day--today' : ''} ${isAvail ? 'bm-cal-day--avail' : ''}`}
                    style={isToday ? { background: m.accent, color: 'white' } : {}}
                  >
                    {day}
                    {isAvail && !isToday && <span className="bm-cal-dot" style={{ background: m.accent }} />}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="bm-reviews">
        <div className="bm-section-head">
          <span className="bm-section-tag">— REVIEWS</span>
          <h2 className="bm-section-title">고객의 이야기</h2>
          <div className="bm-rating-pill">
            <HiStar /> <strong>4.9</strong> <span>· 248 reviews</span>
          </div>
        </div>
        <div className="bm-reviews-grid">
          {reviews.map((r, i) => (
            <figure key={i} className="bm-review">
              <div className="bm-review-stars">
                {Array.from({ length: r.rating }).map((_, si) => <HiStar key={si} />)}
              </div>
              <blockquote>"{r.text}"</blockquote>
              <figcaption>
                <span className="bm-review-ava" style={{
                  background: `linear-gradient(135deg, ${m.accent}, ${m.accent}aa)`,
                }}>{r.name[0]}</span>
                <span>{r.name} <small>· 방문 회원</small></span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bm-foot">
        <div className="bm-foot-brand">
          <span className="bm-nav-mark" style={{ color: m.accent }}>{m.logoIcon}</span>
          <strong>{m.brand}</strong>
        </div>
        <div className="bm-foot-info">
          <span><HiOutlineLocationMarker /> 서울특별시 강남구 OO로 24</span>
          <span><HiOutlinePhone /> 02-000-0000</span>
          <span><HiOutlineSparkles /> 평일 10:00 – 21:00 · 일요일 휴무</span>
        </div>
      </footer>
    </article>
  );
}
