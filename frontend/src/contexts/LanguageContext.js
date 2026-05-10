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
