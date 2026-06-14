import React, { createContext, useContext, useState, useEffect } from 'react';

const STORAGE_KEY = 'devibe_lang';
const LanguageContext = createContext();

export const translations = {
  ko: {
    nav: { services: 'SERVICES', references: 'DESIGNS', portfolio: 'PORTFOLIO', about: 'ABOUT', contact: 'CONTACT' },
    hero: {
      title: 'DEVIBE',
      tagline: '그냥 해봐!',
      rolling: [
        '홈페이지 제작·운영 파트너',
        '아이디어를 현실로',
        '비즈니스를 디지털로',
        '프리랜서 풀스택 개발자',
      ],
      scroll: 'SCROLL DOWN - SCROLL DOWN - SCROLL DOWN - ',
    },
    intro: {
      label: 'WHO WE ARE',
      title: '홈페이지 제작부터 운영까지\n아이디어를 현실로 만드는 풀스택 개발 파트너',
      desc: '홈페이지 제작 기획부터 디자인, 개발, 배포, 운영까지 — 프리랜서 풀스택 개발자가 비즈니스 성장을 위한 디지털 솔루션을 원스톱으로 제공합니다. 최신 기술 스택과 풍부한 경험을 바탕으로 높은 품질의 결과물을 합리적인 비용에 만나보세요.',
    },
    services: {
      label: 'SERVICES',
      title: '필요한 홈페이지,\n바로 제작해드립니다',
      list: [
        {
          key: 'landing', title: 'Landing Page', titleKo: '랜딩 페이지',
          desc: '제품·캠페인을 위한 단일 페이지. 전환율과 로딩 속도에 초점, 1~2주 안에 라이브.',
          tagline: '신규 제품·이벤트를 빠르게 알리고, 방문자가 바로 행동하게 만드는 한 페이지',
          features: ['반응형 디자인 (PC·모바일)', '문의·예약 폼 + 자동 이메일', '구글 애널리틱스/픽셀 연동', '기본 SEO 세팅', '도메인·HTTPS·CDN 배포', '간단 콘텐츠 수정 가이드'],
          tech: ['React', 'Next.js', 'Vercel', 'Tailwind'],
          timeline: '1~2주',
          starting: '50만원~',
          ideal: '신제품 출시, 이벤트 페이지, 예약 받기, 자료 다운로드',
        },
        {
          key: 'business', title: 'Business Website', titleKo: '기업 홈페이지',
          desc: '회사 소개·서비스·연락처까지 5~10페이지. 브랜드 톤에 맞춘 커스텀 디자인.',
          tagline: '회사의 첫인상을 책임지는 정식 홈페이지. 템플릿이 아닌 우리만의 디자인',
          features: ['브랜드 톤 커스텀 디자인', '5~10개 페이지 (회사 소개·서비스·연락처 등)', '관리자에서 콘텐츠 수정 가능', '문의·견적 폼 + 이메일/문자 알림', 'SEO 최적화 (검색 노출)', '다국어 지원 (선택)', '구글 지도 연동'],
          tech: ['React', 'Next.js', 'Headless CMS', 'PostgreSQL'],
          timeline: '3~6주',
          starting: '150만원~',
          ideal: '신생 기업, 리뉴얼, 글로벌 진출, B2B 영업 도구',
        },
        {
          key: 'webapp', title: 'Web Application', titleKo: '웹 애플리케이션',
          desc: '로그인·대시보드·실시간 기능이 핵심인 SaaS형 웹 서비스. 기획부터 같이.',
          tagline: '단순 정보 전달이 아닌, 사용자가 \'쓰는\' 서비스. 매칭·예약·구독 모델 등',
          features: ['회원가입·로그인 (소셜 포함)', '실시간 데이터 동기화', '사용자별 맞춤 화면', '결제·구독 모델 (선택)', '관리자 대시보드 포함', 'API 설계·문서화', '확장 가능한 아키텍처'],
          tech: ['React', 'Node.js', 'PostgreSQL', 'WebSocket', 'Redis'],
          timeline: '8~16주',
          starting: '500만원~',
          ideal: 'SaaS, 매칭 플랫폼, 커뮤니티, 협업 도구',
        },
        {
          key: 'mobile', title: 'Mobile App', titleKo: '모바일 앱',
          desc: '하나의 코드로 iOS·Android 동시 출시. React Native·Flutter 기반 하이브리드.',
          tagline: '한 번의 개발로 양쪽 스토어에 동시 출시. 네이티브 앱 못지않은 성능',
          features: ['iOS·Android 동시 출시', '푸시 알림 (FCM)', '카메라·갤러리·위치 등 기기 기능', '오프라인 모드 (선택)', '인앱 결제 (Apple/Google)', '앱스토어 등록 가이드', '업데이트 배포 시스템'],
          tech: ['React Native', 'Expo', 'Flutter', 'Firebase'],
          timeline: '8~16주',
          starting: '600만원~',
          ideal: '배달·예약·O2O, 커뮤니티, 콘텐츠 소비 앱',
        },
        {
          key: 'ecommerce', title: 'E-commerce', titleKo: '쇼핑몰',
          desc: '상품·장바구니·결제·주문 관리까지 풀스택 구축. 외부 PG·배송 API 연동 포함.',
          tagline: '단순 카페24/식스샵으로는 어려운 커스텀 쇼핑 경험. 정기구독·B2B 도매 등',
          features: ['상품·옵션·재고 관리', '장바구니 + 주문/결제', 'PG 연동 (토스·아임포트·KG이니시스)', '배송 추적 (CJ대한통운 등)', '쿠폰·할인·포인트', '리뷰·Q&A', '관리자 매출/주문 대시보드', '회원 등급제'],
          tech: ['Next.js', 'Node.js', 'PostgreSQL', 'Toss Payments'],
          timeline: '10~20주',
          starting: '800만원~',
          ideal: '브랜드 자사몰, 정기구독 박스, B2B 도매몰, 디지털 상품',
        },
        {
          key: 'admin', title: 'Admin Dashboard', titleKo: '관리자 시스템',
          desc: '데이터 시각화와 운영자용 관리 도구. 비개발 직원도 바로 쓸 수 있는 UI.',
          tagline: '운영팀이 매일 쓰는 도구. 엑셀로 관리하던 일을 화면 하나로',
          features: ['역할별 권한 관리 (관리자/직원)', '실시간 매출·방문자 차트', '엑셀 가져오기/내보내기', '검색·필터·정렬 (대량 데이터 OK)', '활동 로그 (누가 뭘 했나)', '알림 설정 (이메일/슬랙)', '다크모드'],
          tech: ['React', 'Recharts', 'Node.js', 'PostgreSQL'],
          timeline: '4~10주',
          starting: '300만원~',
          ideal: '기존 서비스에 운영 도구 필요, 데이터 시각화, ERP 보조',
        },
      ],
    },
    works: { label: 'WORKS', title: '최근 프로젝트', viewAll: '전체 보기' },
    why: {
      label: 'WHY FULL-STACK',
      title: '왜 풀스택 개발이어야 할까요?',
      desc1: '아임웹, Wix 같은 빌더는 간편하지만 한계가 명확합니다.',
      desc2: '비즈니스가 성장할수록 커스텀 개발의 가치가 빛납니다.',
      benefitsLabel: 'KEY BENEFITS',
      benefitsTitle: '풀스택 개발이 비즈니스에 주는 4가지 가치',
    },
    cta: {
      title: '프로젝트를 시작할 준비가 되셨나요?',
      desc1: '무료 상담',
      desc2: '을 통해 프로젝트 범위와 예산을 함께 논의해보세요.',
      btn: '무료 상담 신청',
    },
    banner: { tag: '// LIVE CODING', title: 'Code with Passion', desc: '최고의 기술로 최고의 결과물을 만듭니다' },
    capabilities: {
      label: 'WHAT I CAN BUILD',
      title: '이런 기능들,\n다 만들어드릴 수 있어요',
      desc: '복잡한 기술 용어 대신, 사용자가 실제로 쓰는 모습으로 설명드려요.\n어떤 게 필요한지 모르시겠으면 1:1 상담에서 같이 정해드립니다.',
      items: [
        {
          key: 'auth',
          title: '회원가입 · 로그인',
          desc: '카카오·구글·네이버로 한 번에 가입. 비밀번호 찾기, 자동 로그인, 본인 인증까지 안전하게.',
          tags: ['Kakao', 'Google', 'Naver', 'OAuth', 'JWT'],
        },
        {
          key: 'payment',
          title: '결제 시스템',
          desc: '신용카드·계좌이체·간편결제(카카오페이·토스)까지. 정기 결제, 환불 처리도 포함.',
          tags: ['Toss', 'PortOne', 'KakaoPay', 'Stripe'],
        },
        {
          key: 'realtime',
          title: '실시간 채팅 · 알림',
          desc: '메시지가 오자마자 바로 뜨고, 새 알림이 화면에 즉시 표시되는 실시간 기능.',
          tags: ['WebSocket', 'Socket.IO', 'SSE'],
        },
        {
          key: 'ai',
          title: 'AI 기능 연동',
          desc: 'ChatGPT·Claude 같은 AI를 우리 서비스 안에서 동작하게. 챗봇, 자동 요약, 번역 등.',
          tags: ['OpenAI', 'Claude', 'Gemini'],
        },
        {
          key: 'file',
          title: '사진 · 파일 업로드',
          desc: '큰 사진도 자동으로 줄여서 빠르게 보여주기. 동영상·문서까지 안전하게 보관.',
          tags: ['AWS S3', 'Cloudinary', 'Sharp', 'CDN'],
        },
        {
          key: 'chart',
          title: '관리자 대시보드',
          desc: '매출·방문자·주문 현황을 차트와 그래프로 한눈에. 엑셀로 내보내기까지.',
          tags: ['Recharts', 'Chart.js', 'Excel Export'],
        },
        {
          key: 'search',
          title: '검색 · 자동완성',
          desc: '타이핑하는 동안 추천어가 뜨고, 오타가 있어도 결과를 찾아주는 똑똑한 검색.',
          tags: ['Elasticsearch', 'Algolia', 'Fuse.js'],
        },
        {
          key: 'push',
          title: '푸시 알림',
          desc: '앱·웹에서 \"새 메시지 도착\" 같은 알림을 보내서, 사용자가 다시 들어오게.',
          tags: ['FCM', 'Web Push', 'OneSignal'],
        },
        {
          key: 'seo',
          title: '구글 검색 노출',
          desc: '구글에서 우리 사이트가 잘 보이도록 최적화. 로딩 속도, 메타 정보, 사이트맵까지.',
          tags: ['Next.js SSR', 'Sitemap', 'OG Image', 'Core Web Vitals'],
        },
      ],
    },
    process: {
      label: 'HOW WE WORK',
      headline: '아이디어부터\n런칭까지,\n네 단계로',
      desc: '체계적인 프로세스로 프로젝트의 시작과 끝을 함께합니다.',
      steps: [
        { num: '01', tag: 'DISCOVERY', title: '발견', desc: '비즈니스 목표와 사용자 니즈를 파악하고, 프로젝트 범위·일정·예산을 함께 설계합니다.' },
        { num: '02', tag: 'DESIGN', title: '설계', desc: '정보 구조와 와이어프레임을 거쳐, 브랜드 정체성에 맞는 UI/UX 디자인을 완성합니다.' },
        { num: '03', tag: 'DEVELOP', title: '개발', desc: '프론트엔드·백엔드·DB를 한 사람의 손에서 통합해, 빠르고 일관된 구현을 진행합니다.' },
        { num: '04', tag: 'LAUNCH', title: '런칭', desc: '실서버 배포부터 도메인·SSL·SEO 최적화, 운영 가이드까지 안정적으로 이양합니다.' },
      ],
    },
    quickDock: {
      quote: '견적 문의',
      chat: '1:1 상담',
      top: '맨 위로',
    },
    inquiryCTA: {
      prefix: '지금',
      suffix: '을 문의하세요',
      words: ['반응형 웹', '풀스택 개발', '하이브리드 앱', '쇼핑몰', '플랫폼', '랜딩 페이지', '관리자 대시보드'],
      primary: '1:1 문의하기',
      secondary: '견적 받기',
    },
    availability: {
      label: '이번 달 1건 신규 의뢰 접수 가능',
      hint: '평일 24시간 내 답변',
      cta: '의뢰하기',
    },
    faq: {
      label: 'FAQ',
      title: '자주 묻는 질문',
      desc: '계약 전에 가장 많이 받는 질문들을 모았습니다.\n더 궁금한 점은 1:1 문의로 편하게 물어봐주세요.',
      items: [
        { q: '제작 기간은 얼마나 걸리나요?', a: '랜딩 페이지는 1~2주, 일반 홈페이지(5~10페이지)는 3~6주, 풀스택 플랫폼은 8~16주 정도 소요됩니다.\n범위·디자인 복잡도에 따라 달라지며, 첫 상담 후 일정표를 함께 정리해드립니다.' },
        { q: '비용은 어떻게 책정되나요?', a: '무료 상담으로 범위를 확정한 뒤 고정가로 견적을 드립니다 (시간당이 아닌 결과물 기반).\n계약 후 추가 요청이 나오면, 별도 견적으로 사전 동의받고 진행합니다 — "공사 끝나고 청구서가 늘어나는" 일은 없습니다.' },
        { q: '소스코드는 누가 소유하나요?', a: '잔금 완납 시 소스코드와 디자인 원본을 모두 클라이언트가 소유합니다.\nGitHub 저장소·디자인 파일·운영 가이드를 함께 인계해, 추후 다른 개발자에게 맡기더라도 종속 없이 이어갈 수 있습니다.' },
        { q: '도메인·서버 비용은 별도인가요?', a: '네, 도메인(연 1.5~2만원)과 호스팅(월 2~5만원)은 클라이언트 명의로 직접 가입하시는 걸 권장드립니다.\n이렇게 하면 개발자가 바뀌어도 인프라 소유권이 안전합니다. 가입·세팅 가이드를 직접 도와드립니다.' },
        { q: '수정은 몇 번까지 가능한가요?', a: '디자인 시안 단계에서 2회, 개발 완료 후 마이너 수정 1회까지 포함됩니다.\n그 이후는 시간 단위 유지보수로 진행되며, 월 정기 유지보수 계약도 가능합니다.' },
        { q: '운영·유지보수도 가능한가요?', a: '런칭 후 1개월간은 무상 버그 대응을 보장합니다.\n그 이후 기능 추가·운영 대응이 필요한 경우, 월 정액 또는 시간당 단위로 유연하게 진행 가능합니다.' },
        { q: '계약 전에 포트폴리오를 더 볼 수 있나요?', a: '네, 1:1 상담 요청 시 진행 중인 작업·과거 사례·코드 샘플까지 자세히 공유드립니다.\n비공개 NDA 프로젝트도 별도 안내가 가능합니다.' },
      ],
    },
    testimonials: {
      label: 'CLIENT VOICES',
      title: '함께한 분들의 이야기',
      desc: '솔직한 피드백이 가장 큰 자산입니다.',
      items: [
        { client: '김OO님', initial: '김', tag: '반응형 웹', tagKey: 'web', body: '브랜드 톤을 잘 살린 웹사이트가 완성됐어요. 작업 과정도 투명하게 공유해주셔서 믿고 맡겼습니다.' },
        { client: '이OO님', initial: '이', tag: '풀스택 개발', tagKey: 'api', body: '복잡한 로직까지 한 사람이 깔끔하게 구현해주셔서, 커뮤니케이션 비용이 정말 적었습니다.' },
        { client: '박OO님', initial: '박', tag: 'UI/UX 디자인', tagKey: 'ux', body: '템플릿이 아닌 우리만의 디자인을 가지게 됐어요. 사용자 경험까지 신경 써주신 게 보입니다.' },
        { client: '최OO님', initial: '최', tag: '플랫폼 구축', tagKey: 'web', body: '기획부터 같이 정리해주신 덕분에 길을 잃지 않고 진행할 수 있었어요. 결과물도 만족스럽습니다.' },
        { client: '정OO님', initial: '정', tag: '하이브리드 앱', tagKey: 'app', body: '앱·웹·서버를 한 번에 맡길 수 있어서 일정 관리가 훨씬 수월했습니다. 강력 추천합니다.' },
        { client: '윤OO님', initial: '윤', tag: 'API 연동', tagKey: 'api', body: '결제·배송 외부 API 연동을 깔끔하게 처리해주셔서 운영 단계에서도 문제가 없었어요.' },
        { client: '송OO님', initial: '송', tag: '랜딩 페이지', tagKey: 'web', body: '예산 안에서 최대치의 결과물을 만들어주셨어요. 약속 일정도 정확하게 지켜주셨습니다.' },
        { client: '한OO님', initial: '한', tag: '관리자 대시보드', tagKey: 'ux', body: '운영 편의성을 정말 잘 고려해주셨어요. 비개발 직원도 바로 적응할 수 있는 화면이 나왔습니다.' },
      ],
    },
    pricing: {
      label: '요금제',
      title: '필요한 만큼, 정확하게',
      desc: '프로젝트 규모에 맞춘 3단계 — 견적은 상담 후 확정됩니다.',
      popular: '가장 인기',
      smallNote: '✱ 정확한 견적은 상담 후 확정. 견적 계산기로 1분 안에 확인 가능.',
      tiers: [
        {
          key: 'lite',
          name: 'Lite',
          tagline: '랜딩페이지 · 1~2주',
          price: '50만원~',
          popular: false,
          features: [
            '반응형 1~3페이지 디자인',
            '문의·예약 폼 연동',
            '기본 SEO·메타 세팅',
            '도메인·SSL 배포 대행',
            '1개월 무상 버그 대응',
          ],
          cta: '상담받기',
          prefill: {
            projectType: '웹 개발',
            budget: '100만원 이하',
            description: '[Lite] 랜딩페이지 1~2주 제작 문의드립니다.',
          },
        },
        {
          key: 'standard',
          name: 'Standard',
          tagline: '기업 홈페이지 · 3~6주',
          price: '150만원~',
          popular: true,
          features: [
            '반응형 5~10페이지 풀 디자인',
            '관리자 페이지(CMS) 포함',
            '블로그·게시판 시스템',
            '다국어(한/영) 옵션',
            'GA4·검색엔진 등록 대행',
            '3개월 무상 유지보수',
          ],
          cta: '상담받기',
          prefill: {
            projectType: '웹 개발',
            budget: '300~500만원',
            description: '[Standard] 기업 홈페이지 3~6주 제작 문의드립니다.',
          },
        },
        {
          key: 'premium',
          name: 'Premium',
          tagline: '웹앱·쇼핑몰 · 8~16주',
          price: '500만원~',
          popular: false,
          features: [
            '맞춤 웹앱·쇼핑몰 풀스택 개발',
            '회원·결제·주문 시스템',
            '백엔드 API·DB 설계',
            '성능 최적화·Lighthouse 95+',
            '관리자 대시보드·통계',
            '6개월 무상 유지보수',
          ],
          cta: '상담받기',
          prefill: {
            projectType: '백엔드/API',
            budget: '500~1000만원',
            description: '[Premium] 웹앱·쇼핑몰 풀스택 개발 문의드립니다.',
          },
        },
      ],
    },
    trustStrip: {
      metrics: [
        { end: 50, suffix: '+', label: '프로젝트 완수' },
        { end: 95, suffix: '+', label: 'Lighthouse 점수' },
        { end: 99, suffix: '%', label: '클라이언트 만족도' },
        { end: 24, suffix: 'h', label: '평균 응답 시간' },
      ],
    },
  },
  en: {
    nav: { services: 'SERVICES', references: 'DESIGNS', portfolio: 'PORTFOLIO', about: 'ABOUT', contact: 'CONTACT' },
    hero: {
      title: 'DEVIBE',
      tagline: 'Just Go For It',
      rolling: [
        'Turn Ideas Into Reality',
        'Bring Business Online',
        'Full-Stack Dev Partner',
        'Grow With You',
      ],
      scroll: 'SCROLL DOWN - SCROLL DOWN - SCROLL DOWN - ',
    },
    intro: {
      label: 'WHO WE ARE',
      title: 'Your Partner\nFrom Idea To Reality',
      desc: 'From planning, design, development to deployment — we deliver one-stop digital solutions for your business growth. Get high-quality results at a reasonable price with the latest tech stack and proven experience.',
    },
    services: {
      label: 'SERVICES',
      title: 'The deliverable\nyou need, built.',
      list: [
        {
          key: 'landing', title: 'Landing Page', titleKo: 'Landing',
          desc: 'Single-page sites for product launches and campaigns. Conversion-tuned, live in 1–2 weeks.',
          tagline: 'A single page that announces a new product fast and turns visitors into action',
          features: ['Responsive design (desktop & mobile)', 'Inquiry / booking form with email alerts', 'Google Analytics & Pixel integration', 'Basic SEO setup', 'Domain, HTTPS, CDN deployment', 'Content editing guide'],
          tech: ['React', 'Next.js', 'Vercel', 'Tailwind'],
          timeline: '1–2 weeks',
          starting: 'from $400',
          ideal: 'Product launches, event pages, lead magnets, downloads',
        },
        {
          key: 'business', title: 'Business Website', titleKo: 'Business',
          desc: '5–10 pages from company intro to services and contact. Custom design that fits your brand.',
          tagline: 'Your company\'s first impression — fully custom, not a template',
          features: ['Brand-tone custom design', '5–10 pages (company, services, contact, etc.)', 'CMS for content editing', 'Inquiry/quote forms with email/SMS alerts', 'SEO optimization', 'Multi-language support (optional)', 'Google Maps integration'],
          tech: ['React', 'Next.js', 'Headless CMS', 'PostgreSQL'],
          timeline: '3–6 weeks',
          starting: 'from $1,200',
          ideal: 'New companies, renewals, global expansion, B2B sales',
        },
        {
          key: 'webapp', title: 'Web Application', titleKo: 'Web App',
          desc: 'SaaS-style products built around login, dashboards and real-time features.',
          tagline: 'Not just information — a product users actually use. Matching, booking, subscription, etc.',
          features: ['Sign-up & login (social included)', 'Real-time data sync', 'Per-user personalized views', 'Payment / subscription (optional)', 'Built-in admin dashboard', 'API design & documentation', 'Scalable architecture'],
          tech: ['React', 'Node.js', 'PostgreSQL', 'WebSocket', 'Redis'],
          timeline: '8–16 weeks',
          starting: 'from $4,000',
          ideal: 'SaaS, matching platforms, communities, collaboration tools',
        },
        {
          key: 'mobile', title: 'Mobile App', titleKo: 'Mobile',
          desc: 'Ship iOS and Android from one codebase — React Native / Flutter hybrid.',
          tagline: 'Build once, ship to both stores. Near-native performance.',
          features: ['Simultaneous iOS & Android release', 'Push notifications (FCM)', 'Camera, gallery, location, etc.', 'Offline mode (optional)', 'In-app purchases (Apple/Google)', 'App store submission guide', 'OTA update system'],
          tech: ['React Native', 'Expo', 'Flutter', 'Firebase'],
          timeline: '8–16 weeks',
          starting: 'from $5,000',
          ideal: 'Delivery, booking, O2O, community, content apps',
        },
        {
          key: 'ecommerce', title: 'E-commerce', titleKo: 'Shop',
          desc: 'Full-stack store: products, cart, checkout, orders, plus PG and shipping APIs.',
          tagline: 'Custom shopping experiences beyond Shopify templates — subscriptions, B2B wholesale, etc.',
          features: ['Product, option, inventory management', 'Cart, orders, checkout', 'Payment gateways (Stripe / Toss / etc.)', 'Shipping tracking integration', 'Coupons, discounts, loyalty points', 'Reviews & Q&A', 'Sales / orders admin dashboard', 'Membership tiers'],
          tech: ['Next.js', 'Node.js', 'PostgreSQL', 'Stripe'],
          timeline: '10–20 weeks',
          starting: 'from $6,500',
          ideal: 'Brand DTC, subscription boxes, B2B wholesale, digital products',
        },
        {
          key: 'admin', title: 'Admin Dashboard', titleKo: 'Admin',
          desc: 'Data visualization and ops tools designed for non-technical staff to pick up instantly.',
          tagline: 'The tool your ops team uses every day. Replace spreadsheets with a single screen.',
          features: ['Role-based permissions (admin / staff)', 'Real-time sales & traffic charts', 'Excel import / export', 'Search, filter, sort (handles big data)', 'Activity logs (who did what)', 'Alert settings (email / Slack)', 'Dark mode'],
          tech: ['React', 'Recharts', 'Node.js', 'PostgreSQL'],
          timeline: '4–10 weeks',
          starting: 'from $2,500',
          ideal: 'Internal tools, data visualization, ERP supplements',
        },
      ],
    },
    works: { label: 'WORKS', title: 'Recent Projects', viewAll: 'View all' },
    why: {
      label: 'WHY FULL-STACK',
      title: 'Why choose Full-Stack development?',
      desc1: 'Builders like I\'mWeb and Wix are convenient but limited.',
      desc2: 'As your business grows, custom development truly shines.',
      benefitsLabel: 'KEY BENEFITS',
      benefitsTitle: '4 Values Full-Stack Development Brings to Your Business',
    },
    cta: {
      title: 'Ready to start your project?',
      desc1: 'Free consultation',
      desc2: ' — let\'s discuss your project scope and budget together.',
      btn: 'Request Free Consultation',
    },
    banner: { tag: '// LIVE CODING', title: 'Code with Passion', desc: 'Top results with top technology' },
    capabilities: {
      label: 'WHAT I CAN BUILD',
      title: 'All these features,\nbuilt for you.',
      desc: 'Plain-language descriptions, not technical jargon — so you can see exactly what you get.\nNot sure what you need? Let\'s figure it out together in a 1:1 chat.',
      items: [
        {
          key: 'auth',
          title: 'Sign-up & Login',
          desc: 'One-tap sign-up with Google, Apple or Kakao. Password reset, auto-login and ID verification — all secure.',
          tags: ['Google', 'Apple', 'OAuth', 'JWT'],
        },
        {
          key: 'payment',
          title: 'Payment System',
          desc: 'Credit cards, bank transfer, and modern wallets. Subscriptions and refunds handled cleanly.',
          tags: ['Stripe', 'Toss', 'PortOne'],
        },
        {
          key: 'realtime',
          title: 'Realtime Chat & Notifications',
          desc: 'Messages pop up instantly. New notifications appear on screen without a refresh.',
          tags: ['WebSocket', 'Socket.IO', 'SSE'],
        },
        {
          key: 'ai',
          title: 'AI Integration',
          desc: 'Put ChatGPT or Claude inside your product. Chatbots, auto-summary, translation, and more.',
          tags: ['OpenAI', 'Claude', 'Gemini'],
        },
        {
          key: 'file',
          title: 'Photo & File Upload',
          desc: 'Large photos auto-compressed for fast loading. Videos and documents stored safely.',
          tags: ['AWS S3', 'Cloudinary', 'Sharp', 'CDN'],
        },
        {
          key: 'chart',
          title: 'Admin Dashboard',
          desc: 'Sales, visitors, and orders shown as charts and graphs. Export to Excel included.',
          tags: ['Recharts', 'Chart.js', 'Excel Export'],
        },
        {
          key: 'search',
          title: 'Search & Autocomplete',
          desc: 'Suggestions appear as you type, and typos still find the right result.',
          tags: ['Elasticsearch', 'Algolia', 'Fuse.js'],
        },
        {
          key: 'push',
          title: 'Push Notifications',
          desc: 'Send "new message" style alerts to web and mobile so users come back.',
          tags: ['FCM', 'Web Push', 'OneSignal'],
        },
        {
          key: 'seo',
          title: 'Google Visibility',
          desc: 'Optimized so your site shows up well on Google — speed, metadata, and sitemap included.',
          tags: ['Next.js SSR', 'Sitemap', 'OG Image', 'Core Web Vitals'],
        },
      ],
    },
    process: {
      label: 'HOW WE WORK',
      headline: 'From Idea\nTo Launch,\nIn 4 Steps',
      desc: 'A structured process that carries your project from kickoff to delivery.',
      steps: [
        { num: '01', tag: 'DISCOVERY', title: 'Discover', desc: 'We dig into your business goals and user needs, then map out scope, timeline and budget together.' },
        { num: '02', tag: 'DESIGN', title: 'Design', desc: 'Information architecture, wireframes, and a UI/UX direction that fits your brand identity.' },
        { num: '03', tag: 'DEVELOP', title: 'Develop', desc: 'Frontend, backend and database — built end-to-end by one developer, fast and consistent.' },
        { num: '04', tag: 'LAUNCH', title: 'Launch', desc: 'Production deploy, domain · SSL · SEO setup, and an operations handoff you can rely on.' },
      ],
    },
    quickDock: {
      quote: 'Get a Quote',
      chat: '1:1 Chat',
      top: 'Back to top',
    },
    inquiryCTA: {
      prefix: 'Inquire about your',
      suffix: 'now',
      words: ['Responsive Web', 'Full-Stack Build', 'Hybrid App', 'E-commerce', 'Platform', 'Landing Page', 'Admin Dashboard'],
      primary: 'Start 1:1 Chat',
      secondary: 'Get a Quote',
    },
    availability: {
      label: 'Available — 1 new project this month',
      hint: 'Reply within 24h on weekdays',
      cta: 'Inquire',
    },
    faq: {
      label: 'FAQ',
      title: 'Frequently asked questions',
      desc: 'The most common questions before signing.\nNot covered here? Just send a 1:1 message.',
      items: [
        { q: 'How long does a project take?', a: 'Landing page: 1–2 weeks. Standard website (5–10 pages): 3–6 weeks. Full-stack platform: 8–16 weeks.\nFinal timeline depends on scope and design complexity — we draft a roadmap together at the first consultation.' },
        { q: 'How is pricing decided?', a: 'After a free consultation to lock scope, you get a fixed-price quote (deliverable-based, not hourly).\nAny scope change after contract is quoted separately with prior approval — no surprise invoices at the end.' },
        { q: 'Who owns the source code?', a: 'On final payment, you own all source code and design assets — full stop.\nWe hand over the GitHub repo, design files, and an operations guide, so any future developer can take over without lock-in.' },
        { q: 'Are domain & hosting fees separate?', a: 'Yes. We recommend you register the domain (~$15/year) and hosting (~$5–$10/month) directly under your name.\nThis keeps infrastructure ownership safe even if you switch developers. We guide you through the setup.' },
        { q: 'How many revisions are included?', a: '2 rounds of design revisions and 1 round of minor post-launch fixes are included.\nBeyond that, it moves to hourly maintenance — monthly retainers are also available.' },
        { q: 'Do you offer ongoing maintenance?', a: 'Yes — the first month after launch includes free bug-fix coverage.\nFor new features or ongoing ops after that, monthly retainer or hourly billing works fine.' },
        { q: 'Can I see more portfolio before signing?', a: 'Absolutely. On 1:1 request, we share active work, past cases, and even code samples.\nNDA-bound work can be discussed under a mutual NDA.' },
      ],
    },
    testimonials: {
      label: 'CLIENT VOICES',
      title: 'What our clients say',
      desc: 'Honest feedback is the greatest asset.',
      items: [
        { client: 'Mr. Kim',  initial: 'K', tag: 'Responsive Web',    tagKey: 'web', body: 'A site that truly captures our brand tone. The transparent process made trust easy from day one.' },
        { client: 'Mr. Lee',  initial: 'L', tag: 'Full-Stack',        tagKey: 'api', body: 'Complex logic handled cleanly by one developer — communication overhead was nearly zero.' },
        { client: 'Ms. Park', initial: 'P', tag: 'UI/UX Design',      tagKey: 'ux',  body: 'We now have a design that is ours — not a template. The thought put into UX clearly shows.' },
        { client: 'Mr. Choi', initial: 'C', tag: 'Platform',          tagKey: 'web', body: 'Strategic guidance from planning kept us on track. We are very happy with the final outcome.' },
        { client: 'Mr. Jung', initial: 'J', tag: 'Hybrid App',        tagKey: 'app', body: 'App, web and backend in one pair of hands made scheduling much easier. Strongly recommended.' },
        { client: 'Ms. Yoon', initial: 'Y', tag: 'API Integration',   tagKey: 'api', body: 'Payment and shipping API integrations were rock solid — no operational issues post-launch.' },
        { client: 'Mr. Song', initial: 'S', tag: 'Landing Page',      tagKey: 'web', body: 'Maximum output within budget, and every deadline was hit precisely. A pleasure to work with.' },
        { client: 'Ms. Han',  initial: 'H', tag: 'Admin Dashboard',   tagKey: 'ux',  body: 'Operations were clearly considered — non-technical staff onboarded to the UI in minutes.' },
      ],
    },
    pricing: {
      label: 'PRICING',
      title: 'Right-sized, priced right.',
      desc: 'Three tiers tuned to project scope — final quote confirmed after consultation.',
      popular: 'Most Popular',
      smallNote: '✱ Final quote confirmed after consultation. Try the 1-minute estimator.',
      tiers: [
        {
          key: 'lite',
          name: 'Lite',
          tagline: 'Landing page · 1~2 weeks',
          price: 'From $500',
          popular: false,
          features: [
            'Responsive 1~3 page design',
            'Inquiry / booking form',
            'Basic SEO & meta setup',
            'Domain & SSL deployment',
            '1-month free bug fixes',
          ],
          cta: 'Get a quote',
          prefill: {
            projectType: 'Web Development',
            budget: 'Under $1k',
            description: '[Lite] Inquiring about a 1~2 week landing page build.',
          },
        },
        {
          key: 'standard',
          name: 'Standard',
          tagline: 'Business site · 3~6 weeks',
          price: 'From $1.5k',
          popular: true,
          features: [
            'Responsive 5~10 page design',
            'Admin CMS included',
            'Blog & board system',
            'Bilingual (KR/EN) option',
            'GA4 & search console setup',
            '3-month free maintenance',
          ],
          cta: 'Get a quote',
          prefill: {
            projectType: 'Web Development',
            budget: '$3k–$5k',
            description: '[Standard] Inquiring about a 3~6 week business website build.',
          },
        },
        {
          key: 'premium',
          name: 'Premium',
          tagline: 'Web app · e-commerce · 8~16 weeks',
          price: 'From $5k',
          popular: false,
          features: [
            'Custom full-stack web app / shop',
            'Auth, payment & order system',
            'Backend API & DB design',
            'Performance · Lighthouse 95+',
            'Admin dashboard & analytics',
            '6-month free maintenance',
          ],
          cta: 'Get a quote',
          prefill: {
            projectType: 'Backend / API',
            budget: '$5k–$10k',
            description: '[Premium] Inquiring about a full-stack web app / e-commerce build.',
          },
        },
      ],
    },
    trustStrip: {
      metrics: [
        { end: 50, suffix: '+', label: 'Projects shipped' },
        { end: 95, suffix: '+', label: 'Lighthouse score' },
        { end: 99, suffix: '%', label: 'Client satisfaction' },
        { end: 24, suffix: 'h', label: 'Avg. response time' },
      ],
    },
  },
};

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem(STORAGE_KEY) || 'ko';
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, lang);
  }, [lang]);

  const toggle = () => setLang(prev => (prev === 'ko' ? 'en' : 'ko'));

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggle, t: translations[lang] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
