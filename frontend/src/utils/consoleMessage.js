// Print a fancy welcome message to F12 console for fellow developers
export function printConsoleWelcome() {
  if (typeof window === 'undefined') return;

  const ascii = `
%c
██████╗ ███████╗██╗   ██╗   ██╗   ██╗██╗██████╗ ███████╗
██╔══██╗██╔════╝██║   ██║   ██║   ██║██║██╔══██╗██╔════╝
██║  ██║█████╗  ██║   ██║   ██║   ██║██║██████╔╝█████╗
██║  ██║██╔══╝  ╚██╗ ██╔╝   ╚██╗ ██╔╝██║██╔══██╗██╔══╝
██████╔╝███████╗ ╚████╔╝     ╚████╔╝ ██║██████╔╝███████╗
╚═════╝ ╚══════╝  ╚═══╝       ╚═══╝  ╚═╝╚═════╝ ╚══════╝
`;

  const styleAscii = 'color:#6366f1; font-weight:700; font-family: monospace;';
  const styleTitle = 'color:#8b5cf6; font-size:14px; font-weight:700;';
  const styleBody = 'color:#999; font-size:12px;';
  const styleAccent = 'color:#10b981; font-weight:700;';
  const styleLink = 'color:#6366f1; text-decoration:underline;';

  console.log(ascii, styleAscii);
  console.log('%c👋 Hello, fellow developer!', styleTitle);
  console.log('%c개발자 도구를 열어주셨네요. 코드 구경 감사합니다.\n', styleBody);

  console.log('%c🔧 Built with', styleTitle);
  console.log(
    '%cReact 19 · Framer Motion · Express · Node.js',
    styleAccent
  );

  console.log('\n%c⌨️  Try these:', styleTitle);
  console.log('%c• Press %cCtrl+K%c to open the command palette', styleBody, styleAccent, styleBody);
  console.log('%c• Try the %cKonami code%c (↑↑↓↓←→←→BA) for a surprise', styleBody, styleAccent, styleBody);
  console.log('%c• Visit %c/terminal%c to use the interactive shell', styleBody, styleAccent, styleBody);

  console.log('\n%c📬 Looking for a developer?', styleTitle);
  console.log('%cContact: %croqkfwkwlgh@naver.com', styleBody, styleLink);
  console.log('%cGitHub:  %chttps://github.com/JIHOJ-U', styleBody, styleLink);
  console.log('%cBlog:    %chttps://blog.naver.com/longnight0719', styleBody, styleLink);

  console.log('\n%c⚡ const opportunity = new Project();\n%c   await devvibe.deliver(opportunity);', 'color:#a78bfa; font-style:italic; font-family:monospace;', 'color:#a78bfa; font-style:italic; font-family:monospace;');

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
