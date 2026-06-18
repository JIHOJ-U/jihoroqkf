import React, { useState } from 'react';
import { HiPlus, HiSparkles, HiCheck, HiClock } from 'react-icons/hi';
import { BrowserFrame } from '../ServiceDemos';
import './ProjectMockup.css';

/* =========================================================
   Project-specific design references — each entry is a fully
   custom interactive UI inside a BrowserFrame. Used by the
   'project' ReferenceDetail template; each reference data
   row in references.js carries `demoKey` to pick which one.
   ========================================================= */

/* === 1. Cafe24 + KakaoTalk === */

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

/* === 2. AI Content Automation === */

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

/* === 3. API Integrations Hub === */

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

/* === 4. Multi-channel Commerce === */

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

/* === 5. Booking & Reminders === */

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

/* === Dispatcher === */

const DEMOS = {
  cafe24: Cafe24Demo,
  aiflow: AiFlowDemo,
  integrations: IntegrationsDemo,
  multichannel: MultiChannelDemo,
  booking: BookingDemo,
};

export default function ProjectMockup({ data }) {
  const Demo = data?.demoKey ? DEMOS[data.demoKey] : null;
  return Demo ? <Demo /> : null;
}
