import React, { createContext, useContext, useState, useEffect } from 'react';

const STORAGE_KEY = 'devibe_lang';
const LanguageContext = createContext();

export const translations = {
  ko: {
    nav: { portfolio: 'PORTFOLIO', about: 'ABOUT', contact: 'CONTACT' },
    hero: {
      title: 'DEVIBE',
      tagline: '그냥 해봐!',
      rolling: [
        '아이디어를 현실로',
        '비즈니스를 디지털로',
        '풀스택 개발 파트너',
        '함께 성장하는 개발',
      ],
      scroll: 'SCROLL DOWN - SCROLL DOWN - SCROLL DOWN - ',
    },
    intro: {
      label: 'WHO WE ARE',
      title: '아이디어를 현실로\n만드는 개발 파트너',
      desc: '기획부터 디자인, 개발, 배포까지 비즈니스 성장을 위한 디지털 솔루션을 원스톱으로 제공합니다. 최신 기술 스택과 풍부한 경험을 바탕으로 높은 품질의 결과물을 합리적인 비용에 만나보세요.',
    },
    services: {
      label: 'SERVICES',
      title: '제공 서비스',
      list: [
        { title: 'Web Development', titleKo: '웹 개발', desc: 'React, Next.js 등 최신 프레임워크를 활용해 반응형·고성능 웹사이트를 제작합니다.' },
        { title: 'App Development', titleKo: '앱 개발', desc: 'React Native·Flutter 기반의 iOS/Android 크로스 플랫폼 앱을 구축합니다.' },
        { title: 'Backend / API', titleKo: '서버 / API 구축', desc: 'Node.js·Python으로 안정적인 서버, RESTful·GraphQL API를 설계·구현합니다.' },
        { title: 'UI/UX Design', titleKo: 'UI/UX 디자인', desc: '사용자 중심의 직관적이고 세련된 인터페이스를 기획부터 디자인까지 진행합니다.' },
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
  },
  en: {
    nav: { portfolio: 'PORTFOLIO', about: 'ABOUT', contact: 'CONTACT' },
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
      title: 'What We Offer',
      list: [
        { title: 'Web Development', titleKo: 'Modern Web', desc: 'Build responsive, high-performance websites with React, Next.js and the latest frameworks.' },
        { title: 'App Development', titleKo: 'Mobile App', desc: 'Cross-platform iOS / Android apps built with React Native and Flutter.' },
        { title: 'Backend / API', titleKo: 'Server / API', desc: 'Stable backend servers and RESTful / GraphQL APIs in Node.js and Python.' },
        { title: 'UI/UX Design', titleKo: 'Design', desc: 'User-centric, intuitive and refined interfaces from wireframe to final design.' },
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
