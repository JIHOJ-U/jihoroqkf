/**
 * Blog / case-study source of truth. Each post is plain markdown so it
 * renders through the same MarkdownContent component as portfolio detail.
 * Add a new entry to publish — they're sorted newest-first by date.
 */

export const POSTS = [
  {
    slug: 'why-semantic-color-system',
    date: '2026-06-05',
    title: { ko: '왜 시맨틱 컬러 시스템으로 갔나', en: 'Why I moved to a semantic color system' },
    summary: {
      ko: '단조로운 인디고 일변도에서 5가지 의미별 색으로 갈아탄 이유 — 그리고 그 색이 사이트의 신뢰감을 어떻게 바꿨는지.',
      en: 'Why I switched from a mono-indigo palette to five role-based colors — and how that change shifted the trust signal of the site.',
    },
    tags: ['design', 'tokens', 'ux'],
    cover: '',
    content: {
      ko: `## 인디고만 쓰는 게 안전했지만\n\n초기 Dev.Vibe는 보라/인디고 한 색으로만 모든 강조를 처리했어요. 깔끔해 보였지만 **섹션이 늘어날수록 단조로워졌고**, 사용자가 정보 위계를 가늠하기 어려워졌습니다.\n\n## 의미를 분리하니 깊이가 생겼다\n\n시안(데이터) · 에메랄드(신뢰) · 앰버(강조) · 핑크(인터랙티브)를 추가하니 같은 다크 베이스인데도 **섹션마다 분위기가 미묘하게 다르게** 흐르기 시작했어요. \"왜 다른 색인지\" 논리가 있어서 알록달록해 보이지 않습니다.\n\n## CSS 변수가 핵심\n\n\`--color-tech\` 같은 토큰을 정의해두면 카드별로 \`var(--cap-rgb)\` 한 줄만 바꿔 끼울 수 있어요. 색을 통일된 시스템 안에서 다루는 게 항상 답입니다.`,
      en: `## Mono-indigo felt safe\n\nEarly Dev.Vibe used only purple/indigo for every accent. It looked tidy but the more sections we added, **the flatter the page felt** — visitors couldn't read information hierarchy at a glance.\n\n## Splitting meaning created depth\n\nAdding cyan (data), emerald (trust), amber (highlight) and pink (interactive) gave each section a subtly different tone over the same slate base. Because each color *means* something, it doesn't feel rainbow.\n\n## CSS variables make it cheap\n\nDefine tokens like \`--color-tech\` and per-card overrides become one line. Always reach for a system, never a one-off hex value.`,
    },
  },
  {
    slug: 'multi-step-inquiry-form',
    date: '2026-06-04',
    title: { ko: '문의 폼을 3단계로 쪼갠 이유', en: 'Why I split the inquiry form into three steps' },
    summary: {
      ko: '한 화면 긴 폼은 이탈을 부른다 — 프로젝트 / 예산·일정 / 연락처 3단계로 나눈 뒤 가설과 결과.',
      en: 'A long single-page form bleeds completions. The hypothesis behind the project / budget / contact split.',
    },
    tags: ['ux', 'conversion', 'forms'],
    cover: '',
    content: {
      ko: `## 한 화면 폼의 함정\n\n8~9개 필드가 한 화면에 깔리면 처음 본 사람이 \"이거 다 적어야 해?\" 하고 멈춥니다. 평균 완료율은 25~35% 수준이라는 게 폼 분석 업계의 흔한 수치예요.\n\n## 인지적으로 자연스러운 순서\n\n1. **무엇을 만들고 싶은지** (제일 쉬움)\n2. **예산·일정** (조금 무거움)\n3. **연락처** (제일 신중함)\n\n이 순서로 가면 사용자는 \"가벼운 결정 → 무거운 결정\"으로 천천히 빨려들어옵니다.\n\n## 진행률 표시기의 효과\n\n도트+바로 만든 진행률 표시기는 \"앞으로 두 단계 남았다\"는 안내가 되는 동시에 **이미 해낸 단계가 시각적으로 누적**되어 포기 비용을 키웁니다. 완료 도트가 에메랄드로 바뀌면 작은 성취감도 같이 줘요.`,
      en: `## The single-page trap\n\nDrop 8–9 fields into one page and first-time visitors freeze. Industry data puts completion rates for long single-step forms at 25–35%.\n\n## Cognitively natural order\n\n1. **What do you want built?** (easiest)\n2. **Budget & timeline** (slightly heavier)\n3. **Contact** (most cautious)\n\nThis order pulls users in from light to heavy decisions.\n\n## Why the progress bar matters\n\nThe dot-and-bar progress indicator does two jobs: signals \"two steps left\" *and* visually piles up the work already done, raising the perceived cost of abandoning. Turning completed dots emerald adds a tiny dopamine hit.`,
    },
  },
  {
    slug: 'channel-talk-integration',
    date: '2026-06-02',
    title: { ko: '채널톡을 React 사이트에 깔끔하게 붙이기', en: 'Wiring Channel Talk into a React site cleanly' },
    summary: {
      ko: '플러그인 키 찾기, idle 시점 부팅으로 초기 로딩 보호, 도크 버튼에서 직접 메신저 열기까지.',
      en: 'Finding the plugin key, booting on idle to protect first paint, and opening the messenger from a custom dock button.',
    },
    tags: ['integrations', 'channel-talk', 'performance'],
    cover: '',
    content: {
      ko: `## 외부 SDK는 초기 페인트 적이다\n\n채널톡 SDK는 200KB 안팎 + iframe까지 만듭니다. 그대로 \`useEffect\` 안에서 \`boot\`하면 첫 페인트와 경합해요. \`requestIdleCallback\`으로 미루면 사용자가 첫 화면을 보고 난 뒤에 SDK가 조용히 올라옵니다.\n\n## 도크 버튼 → showMessenger\n\n기본 우하단 초록 버튼을 그대로 두지 않고, 사이트 디자인과 어울리는 도크 버튼에 \`ChannelService.showMessenger()\`를 붙였습니다. SDK가 아직 부팅 전이면 \`/contact\`로 폴백.`,
      en: `## External SDKs cost first paint\n\nThe Channel Talk SDK is ~200KB plus an iframe. Booting it inside a plain \`useEffect\` competes with your initial paint. Deferring with \`requestIdleCallback\` keeps the SDK out of the way until the user has the first screen.\n\n## Dock button → showMessenger\n\nInstead of leaning on the default bottom-right launcher, attach \`ChannelService.showMessenger()\` to a dock button that fits the site's design language. If the SDK isn't ready yet, fall back to \`/contact\`.`,
    },
  },
];

export function getPostBySlug(slug) {
  return POSTS.find((p) => p.slug === slug);
}

export function getAllTags() {
  const set = new Set();
  POSTS.forEach((p) => p.tags.forEach((t) => set.add(t)));
  return Array.from(set);
}
