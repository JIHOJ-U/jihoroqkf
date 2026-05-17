import React from 'react';
import { HiSearch } from 'react-icons/hi';

/* Dashboard mockup — for operations / public portal / SaaS refs.
   Data-dense layout (sidebar + main + right panel). */

export default function DashboardMockup({ data: ref }) {
  const m = ref.mockup;
  return (
    <div className="rd-mockup">
      {/* Browser frame */}
      <div className="rd-mockup-bar">
        <span className="rd-dot rd-dot--red" />
        <span className="rd-dot rd-dot--yellow" />
        <span className="rd-dot rd-dot--green" />
        <div className="rd-mockup-url">🔒 {m.domain}</div>
        <div className="rd-mockup-bar-actions" />
      </div>

      {/* Header */}
      <div className="rd-mockup-header">
        <div className="rd-mockup-brand">
          <span className="rd-mockup-brand-icon">{m.logoIcon}</span>
          <div>
            <div className="rd-mockup-brand-name">{m.brand}</div>
            <div className="rd-mockup-brand-sub">{ref.subKo || ref.titleEn}</div>
          </div>
        </div>
        <div className="rd-mockup-search">
          <HiSearch />
          <span>검색: 예) {m.menu[1]?.name}, {m.actions[0]}</span>
          <button className="rd-mockup-search-btn">적용</button>
        </div>
        <div className="rd-mockup-header-actions">
          <button className="rd-mockup-iconbtn">A+</button>
          <button className="rd-mockup-iconbtn">고대비</button>
          {m.actions.slice(0, 2).map((a, i) => (
            <button key={i} className="rd-mockup-action-btn">{a}</button>
          ))}
        </div>
      </div>

      {/* Ticker */}
      <div className="rd-mockup-ticker">
        <span className="rd-ticker-label">● 실시간 알림</span>
        {m.ticker.map((t, i) => (
          <span key={i} className="rd-ticker-item">
            <span className={`rd-ticker-tag rd-ticker-tag--${t.tone}`}>{t.label}</span>
            {t.text}
          </span>
        ))}
      </div>

      {/* 3-column body */}
      <div className="rd-mockup-body">
        {/* Left: sidebar */}
        <aside className="rd-mockup-sidebar">
          <div className="rd-mockup-panel">
            <div className="rd-mockup-panel-head">
              메뉴
              <span className="rd-mockup-tiny-tag">theme-{m.menu.length}</span>
            </div>
            <div className="rd-mockup-panel-sub">
              {ref.subKo || ref.titleEn} 통합 화면
            </div>
            <ul className="rd-mockup-menu">
              {m.menu.map((mi, i) => (
                <li key={i} className={mi.active ? 'rd-mockup-menu-active' : ''}>
                  <span>{mi.name}</span>
                  {mi.tag && <span className="rd-mockup-menu-tag">{mi.tag}</span>}
                </li>
              ))}
            </ul>
          </div>

          <div className="rd-mockup-panel rd-mockup-panel--soft">
            <div className="rd-mockup-panel-head">담당자 안내</div>
            <div className="rd-mockup-panel-text">
              문의·운영: 운영지원팀 (평일 09~18시)<br />
              전화: 000-0000-0000<br />
              이메일: support@{m.domain.split('.').slice(-2).join('.')}
            </div>
            <div className="rd-mockup-mini-actions">
              <button>전화</button>
              <button>오시는 길</button>
            </div>
            <button className="rd-mockup-action-btn rd-mockup-action-btn--ghost">안내 자료</button>
          </div>

          <div className="rd-mockup-illust" aria-hidden="true">
            <div className="rd-mockup-illust-shape" />
          </div>
        </aside>

        {/* Middle: main panel */}
        <main className="rd-mockup-main">
          <div className="rd-mockup-panel">
            <div className="rd-mockup-panel-head">
              상황판
              <span className="rd-mockup-tiny-tag rd-mockup-tiny-tag--ghost">개인정보</span>
              <span className="rd-mockup-tiny-tag rd-mockup-tiny-tag--ghost">이용약관</span>
              <span className="rd-mockup-tiny-tag rd-mockup-tiny-tag--ghost">접근성</span>
            </div>
            <div className="rd-mockup-panel-sub">
              {m.stats[0]?.label}/{m.stats[1]?.label} + 관할 지도(모사) + 공지/보도 모듈
            </div>

            <div className="rd-mockup-dashboard">
              <div className="rd-mockup-dash-info">
                <h3 className="rd-mockup-dash-title">시민 안전을 위한 {m.brand} 통합 서비스</h3>
                <p className="rd-mockup-dash-text">
                  {m.menu.slice(0, 4).map(x => x.name).join(', ')}까지
                  한 화면에서 제공합니다. (데모)
                </p>

                <div className="rd-mockup-stats">
                  {m.stats.map((s, i) => (
                    <div key={i} className="rd-mockup-stat">
                      <span className="rd-mockup-stat-label">{s.label}</span>
                      <span className="rd-mockup-stat-value">{s.value}<small>{s.unit}</small></span>
                    </div>
                  ))}
                </div>

                <div className="rd-mockup-cta-stack">
                  {m.actions.map((a, i) => (
                    <button
                      key={i}
                      className={`rd-mockup-action-btn ${i === 0 ? '' : 'rd-mockup-action-btn--ghost'}`}
                    >
                      {a}
                    </button>
                  ))}
                </div>
                <div className="rd-mockup-foot-note">{m.hint}</div>
              </div>

              <div className="rd-mockup-dash-img" aria-hidden="true">
                <img src={ref.img} alt="" loading="lazy" />
              </div>
            </div>
          </div>

          {/* Filter + notice row */}
          <div className="rd-mockup-row">
            <div className="rd-mockup-panel">
              <div className="rd-mockup-panel-head">필터 / 정렬</div>
              <div className="rd-mockup-panel-sub">유형/상태/정렬 + 검색어가 목록에 반영됩니다.</div>
              <div className="rd-mockup-filters">
                <div className="rd-mockup-select">유형 전체 ▾</div>
                <div className="rd-mockup-select">상태 전체 ▾</div>
                <div className="rd-mockup-select">우선순위 ▾</div>
                <button className="rd-mockup-action-btn rd-mockup-action-btn--ghost">적용</button>
              </div>
              <div className="rd-mockup-callout">
                <strong>안내</strong> 실제 시스템 연동 시 개인/민감 정보는 비공개 처리됩니다.
              </div>
            </div>

            <div className="rd-mockup-panel">
              <div className="rd-mockup-panel-head">공지 · 알림 · 활동</div>
              <div className="rd-mockup-panel-sub">기관 기본 모듈 (클릭 시 데모 안내)</div>
              <ul className="rd-mockup-notices">
                {m.notices.map((n, i) => (
                  <li key={i} className="rd-mockup-notice">
                    <span className={`rd-mockup-notice-tag rd-mockup-notice-tag--${i}`}>{n.type}</span>
                    <div className="rd-mockup-notice-body">
                      <div className="rd-mockup-notice-title">{n.title}</div>
                      <div className="rd-mockup-notice-date">2026-05-{(17 - i).toString().padStart(2, '0')}</div>
                    </div>
                    <button className="rd-mockup-mini-link">보기</button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </main>

        {/* Right: side panel */}
        <aside className="rd-mockup-side">
          <div className="rd-mockup-panel">
            <div className="rd-mockup-panel-head">
              우측 패널
              <span className="rd-mockup-tiny-tag">새로고침</span>
            </div>
            <div className="rd-mockup-panel-sub">선택 항목 상세 / 빠른 작업</div>

            <div className="rd-mockup-side-item">
              <div className="rd-mockup-side-item-title">선택된 항목</div>
              <div className="rd-mockup-side-item-text">{m.menu[0]?.name}을(를) 선택하세요.</div>
            </div>

            <div className="rd-mockup-side-item">
              <div className="rd-mockup-side-item-title">최근 활동</div>
              <div className="rd-mockup-side-item-text">활동을 선택하세요.</div>
            </div>

            <div className="rd-mockup-side-callout">
              <strong>빠른 안내</strong>
              <p>{m.hint}</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
