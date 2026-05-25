import React from 'react';
import { motion } from 'framer-motion';
import { HiShieldCheck, HiDocumentText, HiSupport, HiRefresh, HiClock } from 'react-icons/hi';
import { useLanguage } from '../contexts/LanguageContext';
import './TrustSection.css';

const COPY = {
  ko: {
    label: '// OUR PROMISE',
    title: '안심하고 맡기세요',
    desc: '계약부터 사후 관리까지, 외주에서 불안할 수 있는 부분을 먼저 약속으로 정리했습니다.',
    items: [
      { icon: 'shield', title: 'NDA · 비밀유지', desc: '요청 시 비밀유지계약(NDA)을 체결하고 자료를 안전하게 다룹니다.' },
      { icon: 'doc', title: '정식 계약서', desc: '작업 범위 · 일정 · 비용을 문서로 명확히 합의한 뒤 시작합니다.' },
      { icon: 'support', title: '배포 후 유지보수', desc: '오픈 후 일정 기간 무상 안정화로 초기 버그를 책임집니다.' },
      { icon: 'refund', title: '단계별 환불 기준', desc: '착수 전·진행 단계별 환불 기준을 계약서에 미리 명시합니다.' },
      { icon: 'clock', title: '평일 24시간 내 응답', desc: '문의·수정 요청에 평일 기준 24시간 안에 회신드립니다.' },
    ],
  },
  en: {
    label: '// OUR PROMISE',
    title: 'Work with confidence',
    desc: 'From contract to aftercare, we turn the parts that usually feel risky into clear commitments.',
    items: [
      { icon: 'shield', title: 'NDA · Confidentiality', desc: 'We sign an NDA on request and handle your materials securely.' },
      { icon: 'doc', title: 'Formal Contract', desc: 'Scope, timeline and cost are agreed in writing before we start.' },
      { icon: 'support', title: 'Post-launch Support', desc: 'A free stabilization window after launch covers early bugs.' },
      { icon: 'refund', title: 'Clear Refund Terms', desc: 'Stage-by-stage refund terms are written into the contract upfront.' },
      { icon: 'clock', title: 'Reply within 24h', desc: 'We reply to inquiries and change requests within 24h on weekdays.' },
    ],
  },
};

const ICONS = {
  shield: <HiShieldCheck />,
  doc: <HiDocumentText />,
  support: <HiSupport />,
  refund: <HiRefresh />,
  clock: <HiClock />,
};

function TrustSection() {
  const { lang } = useLanguage();
  const c = COPY[lang] || COPY.ko;

  return (
    <section className="trust-section">
      <div className="trust-grid-bg" aria-hidden="true" />
      <div className="container-wide trust-inner">
        <motion.div
          className="trust-header"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="trust-label" translate="no">{c.label}</span>
          <h2 className="trust-title">{c.title}</h2>
          <p className="trust-desc">{c.desc}</p>
        </motion.div>

        <div className="trust-items">
          {c.items.map((it, i) => (
            <motion.div
              key={i}
              className="trust-item"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <div className="trust-item__icon">{ICONS[it.icon]}</div>
              <h3 className="trust-item__title">{it.title}</h3>
              <p className="trust-item__desc">{it.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default TrustSection;
