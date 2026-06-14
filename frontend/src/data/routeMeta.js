/**
 * Per-route SEO metadata for the SPA.
 *
 * Keys are React Router path patterns:
 *   - Static paths (e.g. "/", "/services") match `location.pathname` exactly.
 *   - Dynamic patterns (e.g. "/portfolio/:id", "/blog/:slug", "/references/:slug")
 *     are resolved by the Analytics component via regex when no exact key hits.
 *   - "*" is reserved for 404 / not-found handling.
 *   - "default" is the final fallback when nothing else matches.
 *
 * Each entry shape:
 *   {
 *     title:           // <title> + GA4 page_title
 *     description:     // <meta name="description">
 *     ogTitle:         // <meta property="og:title"> + <meta name="twitter:title">
 *     ogDescription:   // <meta property="og:description"> + <meta name="twitter:description">
 *   }
 *
 * og:url is derived at runtime from window.location.origin + pathname
 * so it always stays aligned with the per-route canonical link.
 */
export const routeMeta = {
  '/': {
    title: '홈페이지 제작 · 운영 · 풀스택 개발 외주 | 홈페이지공방',
    description:
      '프리랜서 풀스택 개발자가 직접 만드는 홈페이지 제작·운영 서비스. 랜딩페이지부터 기업 홈페이지·쇼핑몰·웹앱까지 합리적인 단가로. 무료 견적 상담 신청하세요.',
    ogTitle: '아이디어를 현실로 — 홈페이지 제작·운영 파트너 | 홈페이지공방',
    ogDescription:
      '프리랜서 풀스택 개발자가 기획부터 디자인·개발·배포·운영까지 원스톱으로. 견적 계산기로 1분 안에 가격 확인하세요.',
  },
  '/services': {
    title: '홈페이지 제작 서비스 · 견적 안내 | 홈페이지공방',
    description:
      '랜딩페이지부터 기업홈페이지·쇼핑몰·관리자 시스템까지 — 프리랜서 풀스택 개발자가 직접 제작합니다. 견적 계산기로 즉시 확인하고 무료 상담 받아보세요.',
    ogTitle: '홈페이지 제작 서비스 6종 · 단가 공개 | 홈페이지공방',
    ogDescription:
      '랜딩·기업·웹앱·모바일앱·쇼핑몰·관리자 시스템. 시작 단가와 기간을 투명하게 공개합니다.',
  },
  '/references': {
    title: '산업별 홈페이지 디자인 레퍼런스 갤러리 | 홈페이지공방',
    description:
      '병원·카페·스타트업 등 산업별 홈페이지 제작 레퍼런스와 UX 참고 자료를 모았습니다. 우리 업종에 맞는 디자인 방향을 미리 확인해보세요.',
    ogTitle: '홈페이지 제작 디자인 레퍼런스 모음 | 홈페이지공방',
    ogDescription:
      '업종별 목업과 UX 참고 자료. 제작 의뢰 전 디자인 방향 잡기에 활용하세요.',
  },
  '/references/:slug': {
    title: '홈페이지 디자인 레퍼런스 상세 | 홈페이지공방',
    description:
      '프리랜서 풀스택 개발자가 큐레이션한 홈페이지 제작 목업 템플릿. 구성·UX 포인트·기술 스택까지 한눈에 보고 우리 프로젝트에 맞춰 의뢰하세요.',
    ogTitle: '홈페이지 디자인 레퍼런스 상세 | 홈페이지공방',
    ogDescription:
      '목업 템플릿과 UX 포인트, 그대로 우리 홈페이지 제작에 적용 가능합니다.',
  },
  '/portfolio': {
    title: '프리랜서 풀스택 개발자 포트폴리오 | 홈페이지공방',
    description:
      '프리랜서 풀스택 개발자가 직접 진행한 홈페이지 제작·웹앱·쇼핑몰 프로젝트 목록. 기술 스택과 결과물을 확인하고 비슷한 프로젝트를 의뢰해보세요.',
    ogTitle: '포트폴리오 — 홈페이지 제작 실적 모음 | 홈페이지공방',
    ogDescription:
      '랜딩·기업 홈페이지·웹앱·쇼핑몰 실제 제작 사례. 결과물과 사용 기술을 공개합니다.',
  },
  '/portfolio/:id': {
    title: '포트폴리오 프로젝트 상세 · 홈페이지 제작 사례 | 홈페이지공방',
    description:
      '프리랜서 풀스택 개발자가 진행한 홈페이지 제작·웹앱 프로젝트 상세. 요구사항·기술 스택·작업 과정과 결과를 공개합니다. 비슷한 프로젝트 견적 받아보세요.',
    ogTitle: '프로젝트 상세 — 홈페이지 제작 케이스 스터디 | 홈페이지공방',
    ogDescription:
      '요구사항부터 결과까지. 우리 프로젝트에 적용 가능한 작업 흐름과 기술 스택을 공개합니다.',
  },
  '/about': {
    title: '긴밤 소개 · 프리랜서 풀스택 개발자 | 홈페이지공방',
    description:
      '프리랜서 풀스택 개발자 긴밤의 기술 스택과 핵심 가치, 작업 방식을 소개합니다. 홈페이지 제작부터 운영까지 직접 책임지는 1인 개발 파트너입니다.',
    ogTitle: 'About — 프리랜서 풀스택 개발자 긴밤 | 홈페이지공방',
    ogDescription:
      'React·Next.js·Node.js 기반 풀스택 개발자. 홈페이지 제작·운영을 직접 책임집니다.',
  },
  '/contact': {
    title: '홈페이지 제작 견적 문의 · 무료 상담 | 홈페이지공방',
    description:
      '홈페이지 제작 외주 견적이 궁금하다면 다단계 폼으로 1분 만에 문의 가능합니다. 견적 계산기로 예상 비용을 미리 확인하고 무료 상담 받아보세요.',
    ogTitle: '무료 상담 신청 · 홈페이지 제작 견적 | 홈페이지공방',
    ogDescription:
      '다단계 폼과 견적 계산기로 1분이면 예상 비용 확인. 풀스택 개발자가 직접 답변합니다.',
  },
  '/blog': {
    title: '홈페이지 제작 노트 · 케이스 스터디 | 홈페이지공방',
    description:
      '프리랜서 풀스택 개발자의 홈페이지 제작 노트와 케이스 스터디. 기술 선택·UX 결정·운영 팁을 풀어 씁니다. 외주 의뢰 전 꼭 읽어보세요.',
    ogTitle: 'Blog — 홈페이지 제작 노트와 케이스 스터디 | 홈페이지공방',
    ogDescription:
      '기술 선택, UX 결정, 운영 팁을 직접 정리한 글 모음. 외주 의뢰 전 참고 자료로.',
  },
  '/blog/:slug': {
    title: '홈페이지 제작 노트 상세 | 홈페이지공방',
    description:
      '프리랜서 풀스택 개발자의 홈페이지 제작 케이스 스터디. 실제 프로젝트의 기술 결정, 문제 해결, 운영 노하우를 자세히 풀어 씁니다.',
    ogTitle: '노트 상세 — 홈페이지 제작 케이스 스터디 | 홈페이지공방',
    ogDescription:
      '실제 프로젝트의 기술 결정·UX 고민·운영 노하우를 풀어 씁니다.',
  },
  '/privacy': {
    title: '개인정보처리방침 | 홈페이지공방',
    description:
      '홈페이지공방은 홈페이지 제작 문의 시 수집되는 개인정보를 안전하게 관리합니다. 수집 항목·보관 기간·이용 목적과 이용자의 권리를 안내드립니다.',
    ogTitle: '개인정보처리방침 | 홈페이지공방',
    ogDescription: '수집 항목·보관 기간·이용 목적과 이용자의 권리를 안내합니다.',
  },
  '/terminal': {
    title: '인터랙티브 터미널 · 사이트 탐색 | 홈페이지공방',
    description:
      '홈페이지공방을 명령어로 탐색하는 인터랙티브 터미널. 풀스택 개발자다운 방식으로 포트폴리오와 서비스를 둘러보세요. 재미와 실용을 동시에.',
    ogTitle: 'Terminal — 명령어로 탐험하는 홈페이지공방',
    ogDescription: 'ls, cd, cat. 풀스택 개발자다운 방식으로 사이트를 탐색하세요.',
  },
  '*': {
    title: '페이지를 찾을 수 없습니다 (404) | 홈페이지공방',
    description:
      '요청하신 페이지를 찾을 수 없습니다. 홈페이지 제작 서비스와 포트폴리오, 노트는 메인 페이지에서 이어서 확인하실 수 있습니다.',
    ogTitle: '404 — 페이지를 찾을 수 없습니다 | 홈페이지공방',
    ogDescription:
      '주소를 다시 확인하시거나 홈으로 돌아가 홈페이지 제작 서비스를 둘러보세요.',
  },
  // ─── Admin/authoring routes ───────────────────────────
  // These pages are owner-only (auth-gated) and not in sitemap. The meta
  // here is just so they don't inherit the wrong public title when the
  // owner has them open in a tab.
  '/admin': {
    title: '관리자 — 문의 관리 | 홈페이지공방',
    description: '문의 내역 관리 (관리자 전용).',
    ogTitle: '관리자 | 홈페이지공방',
    ogDescription: '관리자 전용 페이지.',
  },
  '/portfolio/new': {
    title: '관리자 — 포트폴리오 등록 | 홈페이지공방',
    description: '새 포트폴리오 항목 등록 (관리자 전용).',
    ogTitle: '포트폴리오 등록 | 홈페이지공방',
    ogDescription: '관리자 전용 페이지.',
  },
  '/portfolio/edit/:id': {
    title: '관리자 — 포트폴리오 수정 | 홈페이지공방',
    description: '포트폴리오 항목 수정 (관리자 전용).',
    ogTitle: '포트폴리오 수정 | 홈페이지공방',
    ogDescription: '관리자 전용 페이지.',
  },
  default: {
    title: '홈페이지 제작 · 운영 · 풀스택 개발 외주 | 홈페이지공방',
    description:
      '프리랜서 풀스택 개발자가 직접 만드는 홈페이지 제작·운영 서비스. 랜딩페이지부터 기업 홈페이지·쇼핑몰·웹앱까지 합리적인 단가로. 무료 견적 상담 신청하세요.',
    ogTitle: '홈페이지 제작·운영 파트너 | 홈페이지공방',
    ogDescription:
      '프리랜서 풀스택 개발자가 기획·디자인·개발·배포·운영을 원스톱으로.',
  },
};

export default routeMeta;
