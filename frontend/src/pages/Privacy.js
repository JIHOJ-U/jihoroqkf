import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import './Privacy.css';

const COPY = {
  ko: {
    title: '개인정보처리방침',
    meta: '최종 개정일:',
    s1h: '1. 개인정보 수집 및 이용 목적',
    s1p: 'Dev.Vibe(이하 "본 사이트")는 프로젝트 문의 접수 및 회신을 위해 최소한의 개인정보를 수집합니다. 수집된 정보는 아래 목적 외에 사용되지 않습니다.',
    s1li: ['프로젝트 상담 및 견적 안내', '견적서·계약서 등 서류 발송', '프로젝트 진행 관련 커뮤니케이션'],
    s2h: '2. 수집하는 개인정보 항목',
    s2head: ['구분', '항목'],
    s2req: ['필수', '이름, 이메일, 프로젝트 설명'],
    s2opt: ['선택', '연락처(전화번호), 회사/단체명, 예산, 일정'],
    s3h: '3. 개인정보 보유 및 이용 기간',
    s3pPre: '수집된 개인정보는 ', s3pStrong: '프로젝트 종료 후 1년', s3pPost: '까지 보관되며, 그 후에는 지체 없이 파기합니다. 단, 다음의 경우 관련 법령에 따라 보존됩니다.',
    s3li: [
      { label: '전자상거래 등에서의 소비자 보호에 관한 법률에 따른 거래 기록: ', strong: '5년' },
      { label: '국세기본법에 따른 세금계산서 관련 자료: ', strong: '5년' },
    ],
    s4h: '4. 개인정보의 제3자 제공',
    s4p: '본 사이트는 이용자의 동의 없이 개인정보를 외부에 제공하지 않습니다. 단, 법령에 의거하거나 수사기관의 요청이 있는 경우에는 예외로 합니다.',
    s5h: '5. 개인정보 처리 위탁',
    s5p: '현재 본 사이트는 개인정보 처리를 외부에 위탁하고 있지 않습니다. 향후 위탁이 발생할 경우 사전에 본 처리방침을 통해 공지합니다.',
    s6h: '6. 이용자의 권리',
    s6p1: '이용자는 언제든지 다음 권리를 행사할 수 있습니다.',
    s6li: ['개인정보 열람 요청', '오류 정정 요청', '삭제 요청 (관계 법령에 의해 보존이 필요한 경우 제외)', '처리 정지 요청'],
    s6p2: '요청은 아래 연락처로 해주시면 지체 없이 처리합니다.',
    s7h: '7. 개인정보 안전성 확보 조치',
    s7li: ['전송 구간 HTTPS 암호화 적용', '접근 권한 관리 (관리자 인증 키 기반)', '최소한의 인력만 개인정보에 접근', '정기적인 보안 점검'],
    s8h: '8. 개인정보 처리방침 변경',
    s8p: '본 처리방침은 법령, 정책 또는 보안 기술의 변경에 따라 내용 추가/삭제 및 수정이 있을 수 있으며, 변경 시 본 페이지를 통해 사전 공지합니다.',
    s9h: '9. 개인정보 보호 책임자',
    s9operator: '운영자:', s9operatorVal: 'Dev.Vibe (프리랜서)',
    s9email: '이메일:', s9phone: '전화:',
  },
  en: {
    title: 'Privacy Policy',
    meta: 'Last updated:',
    s1h: '1. Purpose of collecting and using personal information',
    s1p: 'Dev.Vibe (the "Site") collects the minimum personal information necessary to receive and respond to project inquiries. Collected information is not used for any purpose other than those listed below.',
    s1li: ['Project consultation and quoting', 'Sending documents such as quotes and contracts', 'Communication related to project progress'],
    s2h: '2. Personal information collected',
    s2head: ['Type', 'Items'],
    s2req: ['Required', 'Name, email, project description'],
    s2opt: ['Optional', 'Phone number, company/organization, budget, timeline'],
    s3h: '3. Retention and use period',
    s3pPre: 'Collected personal information is retained for ', s3pStrong: 'up to 1 year after the project ends', s3pPost: ', after which it is destroyed without delay. However, it is retained under relevant laws in the following cases.',
    s3li: [
      { label: 'Transaction records under the Act on Consumer Protection in Electronic Commerce: ', strong: '5 years' },
      { label: 'Tax invoice records under the Framework Act on National Taxes: ', strong: '5 years' },
    ],
    s4h: '4. Provision to third parties',
    s4p: 'The Site does not provide personal information to outside parties without the user\'s consent, except where required by law or requested by investigative agencies.',
    s5h: '5. Outsourcing of personal information processing',
    s5p: 'The Site currently does not outsource the processing of personal information. If outsourcing occurs in the future, it will be announced in advance through this policy.',
    s6h: '6. Rights of users',
    s6p1: 'Users may exercise the following rights at any time.',
    s6li: ['Request access to personal information', 'Request correction of errors', 'Request deletion (except where retention is required by law)', 'Request suspension of processing'],
    s6p2: 'Please send requests to the contact below and we will handle them without delay.',
    s7h: '7. Measures to secure personal information',
    s7li: ['HTTPS encryption applied in transit', 'Access control (admin authentication key based)', 'Only minimal personnel can access personal information', 'Regular security checks'],
    s8h: '8. Changes to this privacy policy',
    s8p: 'This policy may be supplemented, deleted, or revised in line with changes in laws, policies, or security technology, and any change will be announced in advance through this page.',
    s9h: '9. Personal information protection officer',
    s9operator: 'Operator:', s9operatorVal: 'Dev.Vibe (Freelancer)',
    s9email: 'Email:', s9phone: 'Phone:',
  },
};

function Privacy() {
  const { lang } = useLanguage();
  const c = COPY[lang] || COPY.ko;
  const lastUpdated = '2026-05-10';

  return (
    <div className="privacy-page">
      <div className="container">
        <motion.div
          className="privacy-content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="section-label">PRIVACY POLICY</span>
          <h1 className="privacy-title">{c.title}</h1>
          <p className="privacy-meta">{c.meta} {lastUpdated}</p>

          <section className="privacy-section">
            <h2>{c.s1h}</h2>
            <p>{c.s1p}</p>
            <ul>
              {c.s1li.map((li, i) => <li key={i}>{li}</li>)}
            </ul>
          </section>

          <section className="privacy-section">
            <h2>{c.s2h}</h2>
            <div className="privacy-table">
              <div className="privacy-row privacy-row--head">
                <div>{c.s2head[0]}</div>
                <div>{c.s2head[1]}</div>
              </div>
              <div className="privacy-row">
                <div>{c.s2req[0]}</div>
                <div>{c.s2req[1]}</div>
              </div>
              <div className="privacy-row">
                <div>{c.s2opt[0]}</div>
                <div>{c.s2opt[1]}</div>
              </div>
            </div>
          </section>

          <section className="privacy-section">
            <h2>{c.s3h}</h2>
            <p>
              {c.s3pPre}<strong>{c.s3pStrong}</strong>{c.s3pPost}
            </p>
            <ul>
              {c.s3li.map((li, i) => (
                <li key={i}>{li.label}<strong>{li.strong}</strong></li>
              ))}
            </ul>
          </section>

          <section className="privacy-section">
            <h2>{c.s4h}</h2>
            <p>{c.s4p}</p>
          </section>

          <section className="privacy-section">
            <h2>{c.s5h}</h2>
            <p>{c.s5p}</p>
          </section>

          <section className="privacy-section">
            <h2>{c.s6h}</h2>
            <p>{c.s6p1}</p>
            <ul>
              {c.s6li.map((li, i) => <li key={i}>{li}</li>)}
            </ul>
            <p>{c.s6p2}</p>
          </section>

          <section className="privacy-section">
            <h2>{c.s7h}</h2>
            <ul>
              {c.s7li.map((li, i) => <li key={i}>{li}</li>)}
            </ul>
          </section>

          <section className="privacy-section">
            <h2>{c.s8h}</h2>
            <p>{c.s8p}</p>
          </section>

          <section className="privacy-section privacy-section--contact">
            <h2>{c.s9h}</h2>
            <div className="privacy-contact">
              <p><strong>{c.s9operator}</strong> {c.s9operatorVal}</p>
              <p><strong>{c.s9email}</strong> <a href="mailto:roqkfwkwlgh@naver.com">roqkfwkwlgh@naver.com</a></p>
              <p><strong>{c.s9phone}</strong> <a href="tel:010-8975-2847">010-8975-2847</a></p>
            </div>
          </section>
        </motion.div>
      </div>
    </div>
  );
}

export default Privacy;
