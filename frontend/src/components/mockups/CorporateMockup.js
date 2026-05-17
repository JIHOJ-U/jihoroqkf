import React from 'react';
import {
  HiArrowRight, HiOutlineGlobe, HiOutlineDocumentDownload,
  HiOutlinePhone, HiOutlineMail, HiOutlineLocationMarker,
  HiOutlineShieldCheck,
} from 'react-icons/hi';

/* Corporate mockup — refined industrial B2B layout
   for manufacturing, smart factory, precision chemistry. */

export default function CorporateMockup({ data: ref, lang }) {
  const m = ref.mockup;
  const c = ref.corporate || {};

  const heroLine    = c.heroLine    || (lang === 'ko' ? '정확함이 만드는\n신뢰의 차이.' : 'Precision builds\ntrust.');
  const heroSub     = c.heroSub     || ref.descKo;
  const capabilities = c.capabilities || (m.menu || []).slice(0, 4).map((mi, i) => ({
    name: mi.name,
    desc: [
      'ISO 9001 인증 공정 — 모든 단계가 추적 가능합니다.',
      '실시간 IoT 모니터링으로 가동률 94% 이상 유지.',
      '24시간 R&D 백업 — 시제품부터 양산까지.',
      '글로벌 표준 인증 + 정기 외부 감사.',
    ][i] || '핵심 역량 설명',
    icon: ['◆', '⚡', '◇', '✚'][i],
  }));
  const stats = c.stats || (m.stats || []).slice(0, 4);
  const caseStudies = c.caseStudies || [
    { client: '글로벌 자동차 OEM', tag: '완성차 부품', result: '납품 정확도 99.8%' },
    { client: 'EV 배터리 제조사',  tag: '정밀 부품',  result: '리드타임 -32%' },
    { client: 'Tier-1 공급사',     tag: '대량 양산',  result: '불량률 0.04%' },
  ];

  return (
    <article className="cpm">
      {/* Utility bar */}
      <div className="cpm-util">
        <div className="cpm-util-left">
          <span><HiOutlineGlobe /> KO ▾</span>
          <span className="cpm-util-spacer">|</span>
          <span>📍 본사 · 안양 R&D센터 · 평택 양산공장</span>
        </div>
        <div className="cpm-util-right">
          <span>채용</span>
          <span className="cpm-util-spacer">|</span>
          <span>투자정보</span>
          <span className="cpm-util-spacer">|</span>
          <span>고객센터</span>
          <span className="cpm-util-cta">파트너 로그인 →</span>
        </div>
      </div>

      {/* Nav */}
      <header className="cpm-nav">
        <div className="cpm-nav-brand">
          <span className="cpm-nav-mark" style={{ color: m.accent }}>{m.logoIcon}</span>
          <span>{m.brand}</span>
        </div>
        <nav className="cpm-nav-menu">
          <span>회사 소개 <span className="cpm-chev">▾</span></span>
          <span>제품·기술 <span className="cpm-chev">▾</span></span>
          <span>고객 사례</span>
          <span>지속가능성</span>
          <span>뉴스룸</span>
        </nav>
        <div className="cpm-nav-right">
          <button className="cpm-btn-ghost">자료 요청</button>
          <button className="cpm-btn-solid" style={{ background: m.accent }}>
            견적·문의 <HiArrowRight />
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="cpm-hero">
        <div className="cpm-hero-text">
          <span className="cpm-hero-eyebrow">— Trusted by 240+ partners worldwide</span>
          <h1 className="cpm-hero-line">
            {heroLine.split('\n').map((l, i, a) => (
              <React.Fragment key={i}>
                <span style={i === 1 ? { color: m.accent } : {}}>{l}</span>
                {i < a.length - 1 && <br />}
              </React.Fragment>
            ))}
          </h1>
          <p className="cpm-hero-sub">{heroSub}</p>

          <div className="cpm-hero-cta">
            <button className="cpm-btn-solid cpm-btn-lg" style={{ background: m.accent }}>
              파트너 문의하기
              <span className="cpm-btn-arrow"><HiArrowRight /></span>
            </button>
            <button className="cpm-btn-link">
              <HiOutlineDocumentDownload /> 회사 소개서 PDF
            </button>
          </div>

          {/* Trust badges */}
          <div className="cpm-hero-badges">
            <div className="cpm-badge">
              <strong style={{ color: m.accent }}>ISO 9001</strong>
              <span>품질경영</span>
            </div>
            <div className="cpm-badge">
              <strong style={{ color: m.accent }}>ISO 14001</strong>
              <span>환경경영</span>
            </div>
            <div className="cpm-badge">
              <strong style={{ color: m.accent }}>IATF 16949</strong>
              <span>자동차 산업</span>
            </div>
          </div>
        </div>

        <div className="cpm-hero-visual">
          <div className="cpm-hero-img">
            <img src={ref.img} alt="" />
          </div>
          <div className="cpm-hero-stat">
            <div className="cpm-hero-stat-dot" style={{ background: '#10b981' }} />
            <div>
              <strong>현재 가동중</strong>
              <span>8개 라인 · 142 센서 정상</span>
            </div>
          </div>
        </div>
      </section>

      {/* Marquee — partner / certifications */}
      <section className="cpm-marquee">
        <span className="cpm-marquee-label">파트너사 ·</span>
        <div className="cpm-marquee-track">
          {['HYUNDAI MOBIS', 'LG ENERGY', 'SAMSUNG SDI', 'POSCO', 'BOSCH', 'DENSO', 'CONTINENTAL'].map((n, i) => (
            <span key={i}>{n}</span>
          ))}
        </div>
      </section>

      {/* Capabilities */}
      <section className="cpm-capabilities">
        <header className="cpm-section-head">
          <span className="cpm-section-tag">— OUR CAPABILITIES</span>
          <h2 className="cpm-section-title">14년의 정밀 제조,<br />하나의 약속.</h2>
          <p className="cpm-section-sub">
            우리는 가장 작은 불량률, 가장 빠른 납기, 가장 정확한 추적성을 목표로 합니다.
          </p>
        </header>
        <div className="cpm-cap-grid">
          {capabilities.map((cap, i) => (
            <div key={i} className="cpm-cap-card">
              <div className="cpm-cap-num">0{i + 1}</div>
              <div className="cpm-cap-icon" style={{ background: `${m.accent}18`, color: m.accent }}>
                {cap.icon}
              </div>
              <h3 className="cpm-cap-name">{cap.name}</h3>
              <p className="cpm-cap-desc">{cap.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Big stats band */}
      <section className="cpm-stats" style={{ background: `linear-gradient(135deg, ${m.accent} 0%, ${m.accent}dd 100%)` }}>
        <div className="cpm-stats-inner">
          {stats.map((s, i) => (
            <div key={i} className="cpm-stat">
              <strong>{s.value}<small>{s.unit}</small></strong>
              <span>{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Case studies */}
      <section className="cpm-cases">
        <header className="cpm-section-head">
          <span className="cpm-section-tag">— SELECTED CLIENTS</span>
          <h2 className="cpm-section-title">고객사 케이스</h2>
        </header>
        <div className="cpm-cases-grid">
          {caseStudies.map((cs, i) => (
            <div key={i} className="cpm-case">
              <span className="cpm-case-tag" style={{ background: `${m.accent}18`, color: m.accent }}>
                {cs.tag}
              </span>
              <h3 className="cpm-case-client">{cs.client}</h3>
              <div className="cpm-case-result">
                <span>도입 효과</span>
                <strong style={{ color: m.accent }}>{cs.result}</strong>
              </div>
              <span className="cpm-case-link">전체 케이스 →</span>
            </div>
          ))}
        </div>
      </section>

      {/* Contact band */}
      <section className="cpm-contact">
        <div className="cpm-contact-inner">
          <div className="cpm-contact-left">
            <span className="cpm-section-tag">— GET IN TOUCH</span>
            <h2 className="cpm-section-title">파트너십을 시작해보세요</h2>
            <p>
              영업·기술 담당이 영업일 24시간 이내에 답변드립니다.<br />
              RFQ·견적·샘플 요청 모두 환영합니다.
            </p>

            <div className="cpm-contact-lines">
              <div className="cpm-contact-line">
                <HiOutlinePhone style={{ color: m.accent }} />
                <span>02-000-0000</span>
                <small>평일 09-18시</small>
              </div>
              <div className="cpm-contact-line">
                <HiOutlineMail style={{ color: m.accent }} />
                <span>partner@{m.domain.split('.').slice(-2).join('.')}</span>
                <small>24시간 내 답변</small>
              </div>
              <div className="cpm-contact-line">
                <HiOutlineLocationMarker style={{ color: m.accent }} />
                <span>경기도 안양시 OO로 24</span>
                <small>본사·R&D센터</small>
              </div>
            </div>
          </div>
          <div className="cpm-contact-form">
            <h4>RFQ · 견적 문의</h4>
            <div className="cpm-form-row">
              <input placeholder="회사명" />
              <input placeholder="담당자명" />
            </div>
            <input placeholder="이메일" />
            <input placeholder="전화 번호 (선택)" />
            <textarea placeholder="필요한 제품·수량·납기를 알려주세요." />
            <button className="cpm-btn-solid cpm-btn-full" style={{ background: m.accent }}>
              문의 보내기 <HiArrowRight />
            </button>
            <span className="cpm-form-foot">
              <HiOutlineShieldCheck /> 입력하신 정보는 견적 응대 외 목적으로 사용되지 않습니다.
            </span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="cpm-foot">
        <div className="cpm-foot-cols">
          <div className="cpm-foot-brand">
            <span className="cpm-nav-mark" style={{ color: m.accent }}>{m.logoIcon}</span>
            <strong>{m.brand}</strong>
            <p>since 2012 · 글로벌 정밀 제조 파트너</p>
          </div>
          <div className="cpm-foot-col">
            <strong>제품·기술</strong>
            <span>{m.menu?.[0]?.name || '제품군'}</span>
            <span>{m.menu?.[1]?.name || '기술 소개'}</span>
            <span>R&D 로드맵</span>
          </div>
          <div className="cpm-foot-col">
            <strong>회사</strong>
            <span>오시는 길</span>
            <span>채용 정보</span>
            <span>뉴스룸</span>
          </div>
          <div className="cpm-foot-col">
            <strong>고객 지원</strong>
            <span>견적 문의</span>
            <span>기술 자료</span>
            <span>FAQ</span>
          </div>
        </div>
        <div className="cpm-foot-line">
          <span>© 2026 {m.brand} Co., Ltd. All rights reserved.</span>
          <span>사업자 등록번호 000-00-00000 · 대표 OOO</span>
        </div>
      </footer>
    </article>
  );
}
