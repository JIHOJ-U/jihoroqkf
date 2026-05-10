import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { HiCalculator, HiCheck, HiArrowRight, HiInformationCircle } from 'react-icons/hi';
import { useAchievement } from '../contexts/AchievementContext';
import './QuoteCalculator.css';

const PROJECT_TYPES = [
  { id: 'web', label: '웹사이트', base: 500000 },
  { id: 'app', label: '모바일 앱', base: 1500000 },
  { id: 'admin', label: '관리자/백오피스', base: 700000 },
  { id: 'api', label: 'API / 서버', base: 500000 },
];

const DESIGN_LEVEL = [
  { id: 'template', label: '템플릿 기반', mult: 1.0, desc: '기존 디자인 활용' },
  { id: 'custom', label: '맞춤 디자인', mult: 1.3, desc: '시안 받아서 구현' },
  { id: 'premium', label: '프리미엄 (디자인 포함)', mult: 1.7, desc: 'UI/UX 기획부터' },
];

const FEATURES = [
  { id: 'auth', label: '회원가입 / 로그인', cost: 200000 },
  { id: 'payment', label: '결제 연동 (PG)', cost: 350000 },
  { id: 'cms', label: 'CMS / 게시판', cost: 200000 },
  { id: 'sms', label: 'SMS / 알림톡 연동', cost: 150000 },
  { id: 'email', label: '이메일 발송', cost: 100000 },
  { id: 'pdf', label: 'PDF 자동 생성', cost: 200000 },
  { id: 'realtime', label: '실시간 채팅 / 알림', cost: 300000 },
  { id: 'multi-lang', label: '다국어 지원', cost: 200000 },
  { id: 'analytics', label: '대시보드 / 통계', cost: 250000 },
  { id: 'api-3rd', label: '외부 API 연동', cost: 200000 },
  { id: 'seo', label: 'SEO 최적화', cost: 150000 },
  { id: 'mobile', label: '모바일 반응형', cost: 100000 },
];

const TIMELINE_MULT = {
  normal: { mult: 1.0, label: '일반 (8주~)' },
  fast: { mult: 1.2, label: '빠름 (4~6주)' },
  rush: { mult: 1.4, label: '긴급 (4주 이내)' },
};

const formatPrice = (n) => `₩${Math.round(n).toLocaleString()}`;

function QuoteCalculator() {
  const navigate = useNavigate();
  const { unlock } = useAchievement();
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
    const featureLabels = features.map(fid => FEATURES.find(f => f.id === fid)?.label).filter(Boolean);

    const description = `[견적 계산기로 작성됨]
프로젝트 유형: ${project.label}
페이지 수: ${pages}페이지
디자인: ${design.label}
필요 기능: ${featureLabels.length > 0 ? featureLabels.join(', ') : '없음'}
일정: ${TIMELINE_MULT[timeline].label}

예상 견적: ${formatPrice(calc.min)} ~ ${formatPrice(calc.max)}

추가 요구사항:
`;

    // Map to projectType code
    const typeMap = { web: '웹 개발', app: '앱 개발', admin: '백엔드/API', api: '백엔드/API' };
    const budgetRange =
      calc.max <= 1000000 ? '100만원 이하' :
      calc.max <= 3000000 ? '100~300만원' :
      calc.max <= 5000000 ? '300~500만원' :
      calc.max <= 10000000 ? '500~1000만원' : '1000만원 이상';

    navigate('/contact', {
      state: {
        prefill: {
          projectType: typeMap[projectType] || '웹 개발',
          budget: budgetRange,
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
          <h2 className="quote-calc__title">견적 계산기</h2>
          <p className="quote-calc__sub">옵션을 선택하면 예상 견적이 즉시 계산됩니다.</p>
        </div>
      </div>

      <div className="quote-calc__body">
        <div className="quote-calc__form">
          {/* Project Type */}
          <div className="qc-group">
            <label className="qc-label">1. 프로젝트 유형</label>
            <div className="qc-options qc-options--grid">
              {PROJECT_TYPES.map(p => (
                <button
                  key={p.id}
                  type="button"
                  className={`qc-option ${projectType === p.id ? 'active' : ''}`}
                  onClick={() => setProjectType(p.id)}
                >
                  {projectType === p.id && <HiCheck className="qc-check" />}
                  <strong>{p.label}</strong>
                  <span>{formatPrice(p.base)}~</span>
                </button>
              ))}
            </div>
          </div>

          {/* Pages */}
          <div className="qc-group">
            <label className="qc-label">2. 페이지/화면 수</label>
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
                <span>페이지</span>
              </div>
            </div>
            <p className="qc-hint">5페이지 초과분은 페이지당 +{formatPrice(50000)} 추가</p>
          </div>

          {/* Design Level */}
          <div className="qc-group">
            <label className="qc-label">3. 디자인 수준</label>
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
                    <strong>{d.label}</strong>
                    <span>{d.desc}</span>
                  </div>
                  <span className="qc-mult">×{d.mult}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Features */}
          <div className="qc-group">
            <label className="qc-label">4. 필요한 기능 (복수 선택)</label>
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
                  <span className="qc-feature-label">{f.label}</span>
                  <span className="qc-feature-cost">+{formatPrice(f.cost)}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Timeline */}
          <div className="qc-group">
            <label className="qc-label">5. 희망 일정</label>
            <div className="qc-options qc-options--grid qc-options--3">
              {Object.entries(TIMELINE_MULT).map(([id, t]) => (
                <button
                  key={id}
                  type="button"
                  className={`qc-option ${timeline === id ? 'active' : ''}`}
                  onClick={() => setTimeline(id)}
                >
                  {timeline === id && <HiCheck className="qc-check" />}
                  <strong>{t.label}</strong>
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
            <h3 className="qc-summary-title">예상 견적</h3>

            <div className="qc-price">
              <span className="qc-price-from">{formatPrice(calc.min)}</span>
              <span className="qc-price-tilde">~</span>
              <span className="qc-price-to">{formatPrice(calc.max)}</span>
            </div>
            <p className="qc-price-note">VAT 별도 · 실제 견적은 상담 후 확정</p>

            <div className="qc-breakdown">
              <div className="qc-row">
                <span>기본 견적</span>
                <strong>{formatPrice(calc.basePrice)}</strong>
              </div>
              {calc.pageBonus > 0 && (
                <div className="qc-row">
                  <span>페이지 추가</span>
                  <strong>+{formatPrice(calc.pageBonus)}</strong>
                </div>
              )}
              {calc.featuresPrice > 0 && (
                <div className="qc-row">
                  <span>기능 추가 ({features.length}개)</span>
                  <strong>+{formatPrice(calc.featuresPrice)}</strong>
                </div>
              )}
              <div className="qc-row qc-row--mult">
                <span>디자인 가중치</span>
                <strong>×{calc.designMult}</strong>
              </div>
              <div className="qc-row qc-row--mult">
                <span>일정 가중치</span>
                <strong>×{calc.timingMult}</strong>
              </div>
            </div>

            <button className="qc-cta" onClick={handleApply}>
              이 견적으로 정식 문의 <HiArrowRight />
            </button>

            <p className="qc-disclaimer">
              <HiInformationCircle /> 본 계산은 참고용이며, 실제 견적은 요구사항 분석 후 협의됩니다.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default QuoteCalculator;
