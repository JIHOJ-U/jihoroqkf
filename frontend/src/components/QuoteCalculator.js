import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { HiCalculator, HiCheck, HiArrowRight, HiInformationCircle } from 'react-icons/hi';
import { useAchievement } from '../contexts/AchievementContext';
import { useLanguage } from '../contexts/LanguageContext';
import './QuoteCalculator.css';

const USD_RATE = 1300; // KRW per USD, used only for English-mode display

const PROJECT_TYPES = [
  { id: 'web',   base: 500000,  label: { ko: '웹사이트', en: 'Website' } },
  { id: 'app',   base: 1500000, label: { ko: '모바일 앱', en: 'Mobile App' } },
  { id: 'admin', base: 700000,  label: { ko: '관리자/백오피스', en: 'Admin / Back-office' } },
  { id: 'api',   base: 500000,  label: { ko: 'API / 서버', en: 'API / Server' } },
];

const DESIGN_LEVEL = [
  { id: 'template', mult: 1.0, label: { ko: '템플릿 기반', en: 'Template-based' }, desc: { ko: '기존 디자인 활용', en: 'Use an existing design' } },
  { id: 'custom',   mult: 1.3, label: { ko: '맞춤 디자인', en: 'Custom design' }, desc: { ko: '시안 받아서 구현', en: 'Build from your mockups' } },
  { id: 'premium',  mult: 1.7, label: { ko: '프리미엄 (디자인 포함)', en: 'Premium (design included)' }, desc: { ko: 'UI/UX 기획부터', en: 'From UI/UX planning' } },
];

const FEATURES = [
  { id: 'auth',       cost: 200000, label: { ko: '회원가입 / 로그인', en: 'Sign-up / Login' } },
  { id: 'payment',    cost: 350000, label: { ko: '결제 연동 (PG)', en: 'Payment integration' } },
  { id: 'cms',        cost: 200000, label: { ko: 'CMS / 게시판', en: 'CMS / Board' } },
  { id: 'sms',        cost: 150000, label: { ko: 'SMS / 알림톡 연동', en: 'SMS / push integration' } },
  { id: 'email',      cost: 100000, label: { ko: '이메일 발송', en: 'Email sending' } },
  { id: 'pdf',        cost: 200000, label: { ko: 'PDF 자동 생성', en: 'Auto PDF generation' } },
  { id: 'realtime',   cost: 300000, label: { ko: '실시간 채팅 / 알림', en: 'Realtime chat / alerts' } },
  { id: 'multi-lang', cost: 200000, label: { ko: '다국어 지원', en: 'Multi-language' } },
  { id: 'analytics',  cost: 250000, label: { ko: '대시보드 / 통계', en: 'Dashboard / analytics' } },
  { id: 'api-3rd',    cost: 200000, label: { ko: '외부 API 연동', en: 'Third-party API' } },
  { id: 'seo',        cost: 150000, label: { ko: 'SEO 최적화', en: 'SEO optimization' } },
  { id: 'mobile',     cost: 100000, label: { ko: '모바일 반응형', en: 'Mobile responsive' } },
];

const TIMELINE_MULT = {
  normal: { mult: 1.0, label: { ko: '일반 (8주~)', en: 'Standard (8w+)' } },
  fast:   { mult: 1.2, label: { ko: '빠름 (4~6주)', en: 'Fast (4–6w)' } },
  rush:   { mult: 1.4, label: { ko: '긴급 (4주 이내)', en: 'Rush (<4w)' } },
};

const COPY = {
  ko: {
    title: '견적 계산기',
    sub: '옵션을 선택하면 예상 견적이 즉시 계산됩니다.',
    step1: '1. 프로젝트 유형',
    step2: '2. 페이지/화면 수',
    pages: '페이지',
    pageHint: (p) => `5페이지 초과분은 페이지당 +${p} 추가`,
    step3: '3. 디자인 수준',
    step4: '4. 필요한 기능 (복수 선택)',
    step5: '5. 희망 일정',
    estTitle: '예상 견적',
    priceNote: 'VAT 별도 · 실제 견적은 상담 후 확정',
    rowBase: '기본 견적',
    rowPages: '페이지 추가',
    rowFeatures: (n) => `기능 추가 (${n}개)`,
    rowDesign: '디자인 가중치',
    rowTiming: '일정 가중치',
    cta: '이 견적으로 정식 문의',
    disclaimer: '본 계산은 참고용이며, 실제 견적은 요구사항 분석 후 협의됩니다.',
    budgets: ['100만원 이하', '100~300만원', '300~500만원', '500~1000만원', '1000만원 이상'],
    types: { web: '웹 개발', app: '앱 개발', admin: '백엔드/API', api: '백엔드/API' },
    none: '없음',
    descTemplate: ({ project, pages, design, featureLabels, timeline, min, max, none }) => `[견적 계산기로 작성됨]
프로젝트 유형: ${project}
페이지 수: ${pages}페이지
디자인: ${design}
필요 기능: ${featureLabels.length > 0 ? featureLabels.join(', ') : none}
일정: ${timeline}

예상 견적: ${min} ~ ${max}

추가 요구사항:
`,
  },
  en: {
    title: 'Quote Calculator',
    sub: 'Pick your options and the estimate updates instantly.',
    step1: '1. Project type',
    step2: '2. Pages / screens',
    pages: 'pages',
    pageHint: (p) => `Pages beyond 5 add +${p} each`,
    step3: '3. Design level',
    step4: '4. Features needed (multi-select)',
    step5: '5. Timeline',
    estTitle: 'Estimated quote',
    priceNote: 'VAT excl. · final quote confirmed after consultation',
    rowBase: 'Base quote',
    rowPages: 'Extra pages',
    rowFeatures: (n) => `Features added (${n})`,
    rowDesign: 'Design multiplier',
    rowTiming: 'Timeline multiplier',
    cta: 'Send this quote as an inquiry',
    disclaimer: 'This estimate is for reference; the final quote is agreed after requirement analysis.',
    budgets: ['Under $1k', '$1k–$3k', '$3k–$5k', '$5k–$10k', 'Over $10k'],
    types: { web: 'Web Development', app: 'App Development', admin: 'Backend / API', api: 'Backend / API' },
    none: 'None',
    descTemplate: ({ project, pages, design, featureLabels, timeline, min, max, none }) => `[Created with the quote calculator]
Project type: ${project}
Pages: ${pages}
Design: ${design}
Features: ${featureLabels.length > 0 ? featureLabels.join(', ') : none}
Timeline: ${timeline}

Estimated quote: ${min} ~ ${max}

Additional requirements:
`,
  },
};

const formatPrice = (n, lang) =>
  lang === 'en'
    ? `$${Math.round(n / USD_RATE).toLocaleString()}`
    : `₩${Math.round(n).toLocaleString()}`;

function QuoteCalculator() {
  const navigate = useNavigate();
  const { unlock } = useAchievement();
  const { lang } = useLanguage();
  const c = COPY[lang] || COPY.ko;
  const fmt = (n) => formatPrice(n, lang);
  const [projectType, setProjectType] = useState('web');
  const [pages, setPages] = useState(5);
  const [designLevel, setDesignLevel] = useState('custom');
  const [features, setFeatures] = useState([]);
  const [timeline, setTimeline] = useState('normal');

  const toggleFeature = (id) => {
    setFeatures(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
  };

  const calc = useMemo(() => {
    const project = PROJECT_TYPES.find(p => p.id === projectType);
    const design = DESIGN_LEVEL.find(d => d.id === designLevel);
    const timing = TIMELINE_MULT[timeline];

    const basePrice = project.base;
    const pageBonus = Math.max(0, pages - 5) * 50000;
    const featuresPrice = features.reduce((sum, fid) => {
      const f = FEATURES.find(x => x.id === fid);
      return sum + (f?.cost || 0);
    }, 0);

    const subtotal = (basePrice + pageBonus + featuresPrice) * design.mult * timing.mult;
    const min = subtotal * 0.85;
    const max = subtotal * 1.15;

    return {
      basePrice,
      pageBonus,
      featuresPrice,
      designMult: design.mult,
      timingMult: timing.mult,
      subtotal,
      min,
      max,
    };
  }, [projectType, pages, designLevel, features, timeline]);

  const handleApply = () => {
    unlock('QUOTE_USED');
    const project = PROJECT_TYPES.find(p => p.id === projectType);
    const design = DESIGN_LEVEL.find(d => d.id === designLevel);
    const featureLabels = features.map(fid => FEATURES.find(f => f.id === fid)?.label[lang]).filter(Boolean);

    const description = c.descTemplate({
      project: project.label[lang],
      pages,
      design: design.label[lang],
      featureLabels,
      timeline: TIMELINE_MULT[timeline].label[lang],
      min: fmt(calc.min),
      max: fmt(calc.max),
      none: c.none,
    });

    // Map to the contact form's projectType / budget options (language-aware)
    const budgetIndex =
      calc.max <= 1000000 ? 0 :
      calc.max <= 3000000 ? 1 :
      calc.max <= 5000000 ? 2 :
      calc.max <= 10000000 ? 3 : 4;

    navigate('/contact', {
      state: {
        prefill: {
          projectType: c.types[projectType] || c.types.web,
          budget: c.budgets[budgetIndex],
          description,
        }
      }
    });
  };

  return (
    <div className="quote-calc">
      <div className="quote-calc__header">
        <div className="quote-calc__icon"><HiCalculator /></div>
        <div>
          <span className="section-label">QUOTE CALCULATOR</span>
          <h2 className="quote-calc__title">{c.title}</h2>
          <p className="quote-calc__sub">{c.sub}</p>
        </div>
      </div>

      <div className="quote-calc__body">
        <div className="quote-calc__form">
          {/* Project Type */}
          <div className="qc-group">
            <label className="qc-label">{c.step1}</label>
            <div className="qc-options qc-options--grid">
              {PROJECT_TYPES.map(p => (
                <button
                  key={p.id}
                  type="button"
                  className={`qc-option ${projectType === p.id ? 'active' : ''}`}
                  onClick={() => setProjectType(p.id)}
                >
                  {projectType === p.id && <HiCheck className="qc-check" />}
                  <strong>{p.label[lang]}</strong>
                  <span>{fmt(p.base)}~</span>
                </button>
              ))}
            </div>
          </div>

          {/* Pages */}
          <div className="qc-group">
            <label className="qc-label">{c.step2}</label>
            <div className="qc-pages">
              <input
                type="range"
                min="1"
                max="30"
                value={pages}
                onChange={e => setPages(Number(e.target.value))}
                className="qc-slider"
              />
              <div className="qc-pages-display">
                <strong>{pages}</strong>
                <span>{c.pages}</span>
              </div>
            </div>
            <p className="qc-hint">{c.pageHint(fmt(50000))}</p>
          </div>

          {/* Design Level */}
          <div className="qc-group">
            <label className="qc-label">{c.step3}</label>
            <div className="qc-options">
              {DESIGN_LEVEL.map(d => (
                <button
                  key={d.id}
                  type="button"
                  className={`qc-option qc-option--row ${designLevel === d.id ? 'active' : ''}`}
                  onClick={() => setDesignLevel(d.id)}
                >
                  {designLevel === d.id && <HiCheck className="qc-check" />}
                  <div>
                    <strong>{d.label[lang]}</strong>
                    <span>{d.desc[lang]}</span>
                  </div>
                  <span className="qc-mult">×{d.mult}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Features */}
          <div className="qc-group">
            <label className="qc-label">{c.step4}</label>
            <div className="qc-features">
              {FEATURES.map(f => (
                <button
                  key={f.id}
                  type="button"
                  className={`qc-feature ${features.includes(f.id) ? 'active' : ''}`}
                  onClick={() => toggleFeature(f.id)}
                >
                  <span className="qc-feature-check">
                    {features.includes(f.id) ? <HiCheck /> : '+'}
                  </span>
                  <span className="qc-feature-label">{f.label[lang]}</span>
                  <span className="qc-feature-cost">+{fmt(f.cost)}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Timeline */}
          <div className="qc-group">
            <label className="qc-label">{c.step5}</label>
            <div className="qc-options qc-options--grid qc-options--3">
              {Object.entries(TIMELINE_MULT).map(([id, t]) => (
                <button
                  key={id}
                  type="button"
                  className={`qc-option ${timeline === id ? 'active' : ''}`}
                  onClick={() => setTimeline(id)}
                >
                  {timeline === id && <HiCheck className="qc-check" />}
                  <strong>{t.label[lang]}</strong>
                  <span>×{t.mult}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Summary */}
        <motion.div className="quote-calc__summary" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
          <div className="qc-summary-sticky">
            <span className="section-label">ESTIMATED QUOTE</span>
            <h3 className="qc-summary-title">{c.estTitle}</h3>

            <div className="qc-price">
              <span className="qc-price-from">{fmt(calc.min)}</span>
              <span className="qc-price-tilde">~</span>
              <span className="qc-price-to">{fmt(calc.max)}</span>
            </div>
            <p className="qc-price-note">{c.priceNote}</p>

            <div className="qc-breakdown">
              <div className="qc-row">
                <span>{c.rowBase}</span>
                <strong>{fmt(calc.basePrice)}</strong>
              </div>
              {calc.pageBonus > 0 && (
                <div className="qc-row">
                  <span>{c.rowPages}</span>
                  <strong>+{fmt(calc.pageBonus)}</strong>
                </div>
              )}
              {calc.featuresPrice > 0 && (
                <div className="qc-row">
                  <span>{c.rowFeatures(features.length)}</span>
                  <strong>+{fmt(calc.featuresPrice)}</strong>
                </div>
              )}
              <div className="qc-row qc-row--mult">
                <span>{c.rowDesign}</span>
                <strong>×{calc.designMult}</strong>
              </div>
              <div className="qc-row qc-row--mult">
                <span>{c.rowTiming}</span>
                <strong>×{calc.timingMult}</strong>
              </div>
            </div>

            <button className="qc-cta" onClick={handleApply}>
              {c.cta} <HiArrowRight />
            </button>

            <p className="qc-disclaimer">
              <HiInformationCircle /> {c.disclaimer}
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default QuoteCalculator;
