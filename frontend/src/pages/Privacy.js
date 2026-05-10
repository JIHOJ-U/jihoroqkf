import React from 'react';
import { motion } from 'framer-motion';
import './Privacy.css';

function Privacy() {
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
          <h1 className="privacy-title">개인정보처리방침</h1>
          <p className="privacy-meta">최종 개정일: {lastUpdated}</p>

          <section className="privacy-section">
            <h2>1. 개인정보 수집 및 이용 목적</h2>
            <p>
              Dev.Vibe(이하 "본 사이트")는 프로젝트 문의 접수 및 회신을 위해 최소한의 개인정보를 수집합니다.
              수집된 정보는 아래 목적 외에 사용되지 않습니다.
            </p>
            <ul>
              <li>프로젝트 상담 및 견적 안내</li>
              <li>견적서·계약서 등 서류 발송</li>
              <li>프로젝트 진행 관련 커뮤니케이션</li>
            </ul>
          </section>

          <section className="privacy-section">
            <h2>2. 수집하는 개인정보 항목</h2>
            <div className="privacy-table">
              <div className="privacy-row privacy-row--head">
                <div>구분</div>
                <div>항목</div>
              </div>
              <div className="privacy-row">
                <div>필수</div>
                <div>이름, 이메일, 프로젝트 설명</div>
              </div>
              <div className="privacy-row">
                <div>선택</div>
                <div>연락처(전화번호), 회사/단체명, 예산, 일정</div>
              </div>
            </div>
          </section>

          <section className="privacy-section">
            <h2>3. 개인정보 보유 및 이용 기간</h2>
            <p>
              수집된 개인정보는 <strong>프로젝트 종료 후 1년</strong>까지 보관되며,
              그 후에는 지체 없이 파기합니다. 단, 다음의 경우 관련 법령에 따라 보존됩니다.
            </p>
            <ul>
              <li>전자상거래 등에서의 소비자 보호에 관한 법률에 따른 거래 기록: <strong>5년</strong></li>
              <li>국세기본법에 따른 세금계산서 관련 자료: <strong>5년</strong></li>
            </ul>
          </section>

          <section className="privacy-section">
            <h2>4. 개인정보의 제3자 제공</h2>
            <p>
              본 사이트는 이용자의 동의 없이 개인정보를 외부에 제공하지 않습니다.
              단, 법령에 의거하거나 수사기관의 요청이 있는 경우에는 예외로 합니다.
            </p>
          </section>

          <section className="privacy-section">
            <h2>5. 개인정보 처리 위탁</h2>
            <p>
              현재 본 사이트는 개인정보 처리를 외부에 위탁하고 있지 않습니다.
              향후 위탁이 발생할 경우 사전에 본 처리방침을 통해 공지합니다.
            </p>
          </section>

          <section className="privacy-section">
            <h2>6. 이용자의 권리</h2>
            <p>이용자는 언제든지 다음 권리를 행사할 수 있습니다.</p>
            <ul>
              <li>개인정보 열람 요청</li>
              <li>오류 정정 요청</li>
              <li>삭제 요청 (관계 법령에 의해 보존이 필요한 경우 제외)</li>
              <li>처리 정지 요청</li>
            </ul>
            <p>요청은 아래 연락처로 해주시면 지체 없이 처리합니다.</p>
          </section>

          <section className="privacy-section">
            <h2>7. 개인정보 안전성 확보 조치</h2>
            <ul>
              <li>전송 구간 HTTPS 암호화 적용</li>
              <li>접근 권한 관리 (관리자 인증 키 기반)</li>
              <li>최소한의 인력만 개인정보에 접근</li>
              <li>정기적인 보안 점검</li>
            </ul>
          </section>

          <section className="privacy-section">
            <h2>8. 개인정보 처리방침 변경</h2>
            <p>
              본 처리방침은 법령, 정책 또는 보안 기술의 변경에 따라 내용 추가/삭제 및 수정이 있을 수 있으며,
              변경 시 본 페이지를 통해 사전 공지합니다.
            </p>
          </section>

          <section className="privacy-section privacy-section--contact">
            <h2>9. 개인정보 보호 책임자</h2>
            <div className="privacy-contact">
              <p><strong>운영자:</strong> Dev.Vibe (프리랜서)</p>
              <p><strong>이메일:</strong> <a href="mailto:roqkfwkwlgh@naver.com">roqkfwkwlgh@naver.com</a></p>
              <p><strong>전화:</strong> <a href="tel:010-8975-2847">010-8975-2847</a></p>
            </div>
          </section>
        </motion.div>
      </div>
    </div>
  );
}

export default Privacy;
