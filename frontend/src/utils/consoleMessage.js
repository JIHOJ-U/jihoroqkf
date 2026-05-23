// Print a fancy welcome message to F12 console for fellow developers
export function printConsoleWelcome() {
  if (typeof window === 'undefined') return;

  // Read the persisted language (this runs outside the React context tree)
  let en = false;
  try { en = localStorage.getItem('devibe_lang') === 'en'; } catch (e) {}

  const ascii = `
%c
██████╗ ███████╗██╗   ██╗   ██╗   ██╗██╗██████╗ ███████╗
██╔══██╗██╔════╝██║   ██║   ██║   ██║██║██╔══██╗██╔════╝
██║  ██║█████╗  ██║   ██║   ██║   ██║██║██████╔╝█████╗
██║  ██║██╔══╝  ╚██╗ ██╔╝   ╚██╗ ██╔╝██║██╔══██╗██╔══╝
██████╔╝███████╗ ╚████╔╝     ╚████╔╝ ██║██████╔╝███████╗
╚═════╝ ╚══════╝  ╚═══╝       ╚═══╝  ╚═╝╚═════╝ ╚══════╝
`;

  const styleAscii  = 'color:#6366f1; font-weight:700; font-family: monospace;';
  const styleTitle  = 'color:#8b5cf6; font-size:14px; font-weight:700;';
  const styleBody   = 'color:#999; font-size:12px;';
  const styleAccent = 'color:#10b981; font-weight:700;';
  const styleLink   = 'color:#6366f1; text-decoration:underline;';
  const styleItalic = 'color:#a78bfa; font-style:italic; font-family:monospace;';
  const styleBanner = 'color:#fff; background:linear-gradient(90deg,#6366f1,#8b5cf6,#ec4899); padding:6px 14px; border-radius:6px; font-weight:800; font-size:13px; letter-spacing:1px;';
  const styleHighlight = 'color:#fde047; font-weight:700;';

  console.log(ascii, styleAscii);
  console.log('%c👋 Hello, fellow developer!', styleTitle);
  console.log('%c' + (en
    ? 'Thanks for opening DevTools — enjoy poking around the code.\n'
    : '개발자 도구를 열어주셨네요. 코드 구경 감사합니다.\n'), styleBody);

  console.log('%c🔧 Built with', styleTitle);
  console.log('%cReact 19 · Framer Motion · Express · Node.js', styleAccent);

  console.log('\n%c⌨️  Try these:', styleTitle);
  console.log('%c• Press %cCtrl+K%c to open the command palette', styleBody, styleAccent, styleBody);
  console.log('%c• Try the %cKonami code%c (↑↑↓↓←→←→BA) for a surprise', styleBody, styleAccent, styleBody);
  console.log('%c• Visit %c/terminal%c to use the interactive shell', styleBody, styleAccent, styleBody);

  // ============ EASTER EGG: Free-to-use license ============
  console.log('\n%c🎉 YOU FOUND AN EASTER EGG! 🎉', styleBanner);
  console.log('%c' + (en
    ? "If you scrolled this far, you're a real developer."
    : '여기까지 스크롤한 당신은 진짜 개발자.'), styleTitle);
  console.log('');
  console.log('%c📜 The "Steal This Code" License v1.0', styleTitle);
  console.log(
    (en
      ? '%cAll the code / components / animations / ideas on this site\n' +
        '— %ctake them and use them freely. %cReally.\n' +
        '\n' +
        '✅ Copy-paste away\n' +
        '✅ Modify freely\n' +
        '✅ Use commercially\n' +
        "✅ No attribution required (though it's appreciated)\n" +
        '❌ Just don\'t copy verbatim and claim "I made this"'
      : '%c이 사이트의 코드 / 컴포넌트 / 애니메이션 / 아이디어\n' +
        '— %c전부 자유롭게 가져가서 쓰세요. %c정말로요.\n' +
        '\n' +
        '✅ 복붙해도 됨\n' +
        '✅ 수정해도 됨\n' +
        '✅ 상업적으로 써도 됨\n' +
        '✅ 출처 안 밝혀도 됨 (밝혀주면 고맙긴 함)\n' +
        '❌ 단, 똑같이 베껴서 "내가 만들었다" 거짓말은 NO'),
    styleBody, styleHighlight, styleBody
  );

  console.log('');
  console.log('%c💡 Repo: %chttps://github.com/JIHOJ-U/jihoroqkf', styleBody, styleLink);
  console.log('%c' + (en
    ? '   → Found a component you like? %cgit clone%c away.'
    : '   → 마음에 드는 컴포넌트 있으면 %cgit clone%c 하셔도 OK.'), styleBody, styleAccent, styleBody);
  console.log('%c' + (en
    ? '   → Questions / suggestions / collaboration always welcome.'
    : '   → 질문/제안/협업 문의는 언제든 환영합니다.'), styleBody);
  console.log('');
  console.log('%c   "Good artists copy, great artists steal." — Picasso 🎨', styleItalic);
  console.log('%c' + (en
    ? '   (dev version: %cnpm install copy-paste@latest%c)'
    : '   (개발자 버전: %cnpm install copy-paste@latest%c)'), styleItalic, styleAccent, styleItalic);

  // ============ Contact ============
  console.log('\n%c📬 Want to hire me?', styleTitle);
  console.log('%c   Email:  %croqkfwkwlgh@naver.com', styleBody, styleLink);
  console.log('%c   GitHub: %chttps://github.com/JIHOJ-U', styleBody, styleLink);
  console.log('%c   Blog:   %chttps://blog.naver.com/longnight0719', styleBody, styleLink);

  console.log(
    '\n%c⚡ const opportunity = new Project();\n' +
    '%c   await devvibe.deliver(opportunity);',
    styleItalic, styleItalic
  );

  console.log(
    (en
      ? '\n%c// PS. If you read this all the way down, we\'re already friends.\n' +
        '// Mention "saw it in the console" in your email and I\'ll reply faster 😉'
      : '\n%c// PS. 이 메시지를 끝까지 읽었다면 이미 우리는 친구.\n' +
        '// 메일 보내실 때 "콘솔에서 봤어요" 한 줄 적어주시면 답장 더 빠릅니다 😉'),
    'color:#6a7080; font-style:italic; font-family:monospace; font-size:11px;'
  );

  // Unlock CONSOLE_OPENED achievement
  try {
    const STORAGE_KEY = 'devvibe_achievements';
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    if (!saved.CONSOLE_OPENED) {
      saved.CONSOLE_OPENED = { unlockedAt: new Date().toISOString() };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    }
  } catch (e) {}
}
