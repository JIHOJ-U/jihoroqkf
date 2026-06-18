import React, { useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiArrowLeft, HiArrowRight, HiInformationCircle } from 'react-icons/hi';
import { useLanguage } from '../contexts/LanguageContext';
import { findReference, CATEGORIES } from '../data/references';
import EditorialMockup   from '../components/mockups/EditorialMockup';
import ClinicMockup      from '../components/mockups/ClinicMockup';
import HospitalityMockup from '../components/mockups/HospitalityMockup';
import PortalMockup      from '../components/mockups/PortalMockup';
import ProductMockup     from '../components/mockups/ProductMockup';
import CorporateMockup   from '../components/mockups/CorporateMockup';
import ProjectMockup     from '../components/mockups/ProjectMockup';
import '../components/mockups/EditorialMockup.css';
import '../components/mockups/ClinicMockup.css';
import '../components/mockups/HospitalityMockup.css';
import '../components/mockups/PortalMockup.css';
import '../components/mockups/ProductMockup.css';
import '../components/mockups/CorporateMockup.css';
import './ReferenceDetail.css';

/* Each reference is mapped to one of 6 distinct visual personalities.
   No admin-dashboard look — every detail page reads as a real designed website. */
const TEMPLATE_BY_SLUG = {
  // Editorial — dark serif magazine
  'wine-bar-membership':       'editorial',
  'architecture-studio':       'editorial',
  'fashion-select':            'editorial',

  // Clinic — clean white pastel medical
  'aesthetic-clinic-portal':   'clinic',
  'leanview-dental':           'clinic',
  'oriental-medicine':         'clinic',

  // Hospitality — warm cream local-place
  'bakery-chain':              'hospitality',
  'hair-salon-booking':        'hospitality',
  'signature-realty':          'hospitality',
  'english-academy':           'hospitality',  // local academy feel

  // Portal — citizen / cause big-imagery
  'fire-station-portal':       'portal',
  'smart-city':                'portal',
  'youth-policy':              'portal',
  'env-ngo-platform':          'portal',
  'social-enterprise-impact':  'portal',

  // Product — SaaS landing
  'ai-meeting-notes':          'product',
  'project-collab-tool':       'product',
  'coding-school':             'product',

  // Corporate — industrial B2B
  'motor-core-factory':        'corporate',
  'precision-chem-lab':        'corporate',
  'smart-factory-iot':         'corporate',
};

function pickTemplate(ref) {
  if (ref.template) return ref.template;
  return TEMPLATE_BY_SLUG[ref.slug] || 'editorial';
}

const TEMPLATE_COMPONENTS = {
  editorial:   EditorialMockup,
  clinic:      ClinicMockup,
  hospitality: HospitalityMockup,
  portal:      PortalMockup,
  product:     ProductMockup,
  corporate:   CorporateMockup,
  /* 'project' is the custom-demo path: each entry's data.demoKey picks
     which interactive ProjectMockup demo to render (Cafe24 / AI Flow /
     Integrations / Multi-channel / Booking). It bypasses the standard
     mockup-data schema and renders its own BrowserFrame-wrapped UI. */
  project:     ProjectMockup,
};

function ReferenceDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const ref = findReference(slug);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    if (!ref) navigate('/references', { replace: true });
  }, [slug, ref, navigate]);

  if (!ref) return null;
  const m = ref.mockup;
  const catLabel = CATEGORIES.find(c => c.key === ref.cat);
  const template = pickTemplate(ref);

  const T = {
    back:    lang === 'ko' ? '디자인 목록으로' : 'Back to designs',
    notice:  lang === 'ko'
      ? '실제 시스템 연동 시 개인/사건 정보는 비공개 처리됩니다. 화면은 디자인·UX 참고용 데모입니다.'
      : 'Personal data is private in production. This is a design/UX reference demo.',
    cta:     lang === 'ko' ? '비슷한 거 만들고 싶어요' : 'I want something like this',
    samples: lang === 'ko' ? '다른 예시 보기' : 'See other examples',
  };

  return (
    <div className="rd-page" style={{ '--rd-accent': m.accent }}>
      <div className="rd-container">
        <Link to="/references" className="rd-back">
          <HiArrowLeft /> {T.back}
        </Link>

        <motion.header
          className="rd-hero"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="rd-hero-meta">
            <span className={`rd-cat-tag rd-cat-tag--${ref.cat}`}>
              {lang === 'ko' ? catLabel?.ko : catLabel?.en}
            </span>
            <span className="rd-hero-slug">/{ref.slug}</span>
            <span className="rd-hero-template">{template} template</span>
          </div>
          <h1 className="rd-hero-title">{lang === 'ko' ? ref.titleKo : ref.titleEn}</h1>
          {ref.subKo && lang === 'ko' && <p className="rd-hero-sub">{ref.subKo}</p>}
          <p className="rd-hero-desc">{lang === 'ko' ? ref.descKo : ref.descEn}</p>
        </motion.header>

        <div className="rd-disclaimer">
          <HiInformationCircle />
          <span>{T.notice}</span>
        </div>

        <motion.div
          className="rd-mockup-wrap"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          <div className="rd-frame">
            {(() => {
              const Mockup = TEMPLATE_COMPONENTS[template] || EditorialMockup;
              return <Mockup data={ref} lang={lang} />;
            })()}
          </div>
        </motion.div>

        <div className="rd-cta-row">
          <Link to="/contact" className="rd-cta rd-cta--primary">
            {T.cta} <HiArrowRight />
          </Link>
          <Link to="/references" className="rd-cta rd-cta--ghost">
            {T.samples}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ReferenceDetail;
