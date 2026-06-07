/**
 * Blog / case-study source of truth. Each post is plain markdown so it
 * renders through the same MarkdownContent component as portfolio detail.
 * Add a new entry to publish — they're sorted newest-first by date.
 */

export const POSTS = [
  {
    slug: 'why-semantic-color-system',
    date: '2026-06-05',
    title: {
      ko: '왜 시맨틱 컬러 시스템으로 갔나',
      en: 'Why I moved to a semantic color system',
    },
    summary: {
      ko: '단조로운 인디고 일변도에서 5가지 의미별 색으로 갈아탄 이유 — 그리고 그 색이 사이트의 신뢰감을 어떻게 바꿨는지.',
      en: 'Why I switched from a mono-indigo palette to five role-based colors — and how that change shifted the trust signal of the site.',
    },
    tags: ['design', 'tokens', 'ux'],
    cover: '',
    content: {
      ko: `## 인디고만 쓰는 게 안전했지만

초기 Dev.Vibe는 보라/인디고 한 색으로만 모든 강조를 처리했어요. 깔끔해 보였지만 **섹션이 늘어날수록 단조로워졌고**, 사용자가 정보 위계를 가늠하기 어려워졌습니다.

## 의미를 5가지 역할로 쪼갰다

각 색에 \"무엇을 의미하는지\"를 정해두니 디자인 결정이 빨라졌어요. 토큰을 미리 선언하고:

\`\`\`css
:root {
  --color-primary:     #6366f1;  /* 브랜드, CTA */
  --color-tech:        #06b6d4;  /* 데이터, 메트릭 */
  --color-trust:       #10b981;  /* 보안, 라이브, 성공 */
  --color-highlight:   #f59e0b;  /* 진행, 강조 */
  --color-interactive: #ec4899;  /* 호버, 놀이 */
}
\`\`\`

이후 컴포넌트에서는 의미만 떠올리면 됩니다:

\`\`\`css
.dial-fill        { stroke: var(--color-tech); }
.trust-label      { color:  var(--color-trust); }
.pipeline-active  { stroke: var(--color-highlight); }
\`\`\`

## 카드별로 다른 색을 자동화

Capabilities 카드는 9개라 색을 일일이 손으로 매기면 미친 짓이에요. \`data-cap\` 속성으로 의미를 박아두고 CSS 변수로 분기시킵니다:

\`\`\`jsx
<li className="caps-card" data-cap={item.key}>
  {/* ... */}
</li>
\`\`\`

\`\`\`css
.caps-card                      { --cap-rgb: 99, 102, 241; }
.caps-card[data-cap="auth"]     { --cap-rgb: 16, 185, 129; }
.caps-card[data-cap="payment"]  { --cap-rgb: 245, 158, 11; }
.caps-card[data-cap="realtime"] { --cap-rgb: 6, 182, 212; }
.caps-card[data-cap="ai"]       { --cap-rgb: 236, 72, 153; }

.caps-card:hover {
  border-color: rgba(var(--cap-rgb), 0.45);
  box-shadow: 0 16px 38px rgba(var(--cap-rgb), 0.12);
}
\`\`\`

## 결과

- "왜 다른 색인지" 논리가 있어서 알록달록해 보이지 않음
- 새 섹션 만들 때 \"이건 데이터인가, 신뢰인가?\" 한 번만 묻고 끝
- 본문은 슬레이트 중립 톤으로 깔끔하게, 액센트만 시맨틱하게 흐름

색은 **시스템**으로 다뤄야 디자인이 늙지 않습니다.`,

      en: `## Mono-indigo felt safe

Early Dev.Vibe used only purple/indigo for every accent. It looked tidy but the more sections we added, **the flatter the page felt** — visitors couldn't read information hierarchy at a glance.

## Splitting meaning into five roles

Defining what each color *means* speeds up every design decision. Declare the tokens once:

\`\`\`css
:root {
  --color-primary:     #6366f1;  /* brand, CTA */
  --color-tech:        #06b6d4;  /* data, metrics */
  --color-trust:       #10b981;  /* security, live, success */
  --color-highlight:   #f59e0b;  /* progress, featured */
  --color-interactive: #ec4899;  /* hover emphasis */
}
\`\`\`

Then components only think in roles:

\`\`\`css
.dial-fill        { stroke: var(--color-tech); }
.trust-label      { color:  var(--color-trust); }
.pipeline-active  { stroke: var(--color-highlight); }
\`\`\`

## Per-card color, automated

Manually mapping nine Capabilities cards by hand is insane. Use \`data-cap\` and branch with CSS vars:

\`\`\`jsx
<li className="caps-card" data-cap={item.key}>
  {/* ... */}
</li>
\`\`\`

\`\`\`css
.caps-card                      { --cap-rgb: 99, 102, 241; }
.caps-card[data-cap="auth"]     { --cap-rgb: 16, 185, 129; }
.caps-card[data-cap="payment"]  { --cap-rgb: 245, 158, 11; }
.caps-card[data-cap="realtime"] { --cap-rgb: 6, 182, 212; }
.caps-card[data-cap="ai"]       { --cap-rgb: 236, 72, 153; }

.caps-card:hover {
  border-color: rgba(var(--cap-rgb), 0.45);
  box-shadow: 0 16px 38px rgba(var(--cap-rgb), 0.12);
}
\`\`\`

## Outcome

- Each color carries logic, so it never reads as rainbow
- New sections only ask "is this data, or trust?" — one question, done
- Body stays slate-neutral, only accents are semantic

Color systems age better than one-off hex values.`,
    },
  },

  {
    slug: 'multi-step-inquiry-form',
    date: '2026-06-04',
    title: {
      ko: '문의 폼을 3단계로 쪼갠 이유',
      en: 'Why I split the inquiry form into three steps',
    },
    summary: {
      ko: '한 화면 긴 폼은 이탈을 부른다 — 프로젝트 / 예산·일정 / 연락처 3단계로 나눈 뒤 가설과 결과.',
      en: 'A long single-page form bleeds completions. The hypothesis behind the project / budget / contact split.',
    },
    tags: ['ux', 'conversion', 'forms'],
    cover: '',
    content: {
      ko: `## 한 화면 폼의 함정

8~9개 필드가 한 화면에 깔리면 처음 본 사람이 \"이거 다 적어야 해?\" 하고 멈춥니다. 평균 완료율은 25~35% 수준이라는 게 폼 분석 업계의 흔한 수치예요.

## 인지적으로 자연스러운 순서

1. **무엇을 만들고 싶은지** (제일 쉬움)
2. **예산·일정** (조금 무거움)
3. **연락처** (제일 신중함)

이 순서로 가면 사용자는 \"가벼운 결정 → 무거운 결정\"으로 천천히 빨려들어옵니다.

## 단계별 검증으로 \"다음\" 버튼만 막기

전체 검증은 마지막에만 돌리고, \`다음\` 버튼에서는 현재 단계의 필수 필드만 검사합니다:

\`\`\`js
const validateStep = (s) => {
  const newErrors = {};
  if (s === 1) {
    if (!form.description.trim()) newErrors.description = c.err.desc;
  } else if (s === 3) {
    if (!form.name.trim()) newErrors.name = c.err.nameReq;
    if (!form.email.trim()) newErrors.email = c.err.emailReq;
    else if (!EMAIL_REGEX.test(form.email)) newErrors.email = c.err.email;
  }
  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

const goNext = () => {
  if (!validateStep(step)) return;
  setStep((s) => Math.min(s + 1, TOTAL_STEPS));
};
\`\`\`

## 진행률 표시기의 효과

도트+바 진행률 표시기는 두 가지 일을 합니다:

- "앞으로 두 단계 남았다"는 안내
- **이미 해낸 단계가 시각적으로 누적**되어 포기 비용이 커짐

\`\`\`css
.cf-step.is-active .cf-step__dot {
  background: var(--color-primary);
  color: #fff;
}

.cf-step.is-done .cf-step__dot {
  background: var(--color-trust);
  color: #fff;
}
\`\`\`

완료 도트가 에메랄드로 바뀌는 그 순간이 작은 성취감을 줍니다.

## API 안전장치도 같이

폼은 좋아져도 백엔드가 멈추면 \"접수 중...\"에서 영원히 멈춥니다. axios에 타임아웃 한 줄:

\`\`\`js
const api = axios.create({
  baseURL: \`\${API_URL}/api\`,
  timeout: 20000,
});
\`\`\`

20초면 정상 요청은 통과하고 비정상은 명확한 에러로 끝납니다.`,

      en: `## The single-page trap

Drop 8–9 fields into one page and first-time visitors freeze. Industry data puts completion rates for long single-step forms at 25–35%.

## Cognitively natural order

1. **What do you want built?** (easiest)
2. **Budget & timeline** (slightly heavier)
3. **Contact** (most cautious)

This order pulls users in from light to heavy decisions.

## Per-step validation gates only the Next button

The full validator still runs on submit. Per-step validation only checks fields visible right now:

\`\`\`js
const validateStep = (s) => {
  const newErrors = {};
  if (s === 1) {
    if (!form.description.trim()) newErrors.description = c.err.desc;
  } else if (s === 3) {
    if (!form.name.trim()) newErrors.name = c.err.nameReq;
    if (!form.email.trim()) newErrors.email = c.err.emailReq;
    else if (!EMAIL_REGEX.test(form.email)) newErrors.email = c.err.email;
  }
  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

const goNext = () => {
  if (!validateStep(step)) return;
  setStep((s) => Math.min(s + 1, TOTAL_STEPS));
};
\`\`\`

## Why the progress bar matters

The dot-and-bar indicator does two jobs at once:

- signals "two steps left"
- **visually piles up completed work**, raising perceived abandonment cost

\`\`\`css
.cf-step.is-active .cf-step__dot {
  background: var(--color-primary);
  color: #fff;
}

.cf-step.is-done .cf-step__dot {
  background: var(--color-trust);
  color: #fff;
}
\`\`\`

Turning completed dots emerald adds a tiny dopamine hit.

## Don't forget the API safety net

A polished form is useless if the backend wedges. One-line timeout on axios:

\`\`\`js
const api = axios.create({
  baseURL: \`\${API_URL}/api\`,
  timeout: 20000,
});
\`\`\`

20s lets healthy requests through and turns hung ones into a clear failure.`,
    },
  },

  {
    slug: 'channel-talk-integration',
    date: '2026-06-02',
    title: {
      ko: '채널톡을 React 사이트에 깔끔하게 붙이기',
      en: 'Wiring Channel Talk into a React site cleanly',
    },
    summary: {
      ko: '플러그인 키 찾기, idle 시점 부팅으로 초기 로딩 보호, 도크 버튼에서 직접 메신저 열기까지.',
      en: 'Finding the plugin key, booting on idle to protect first paint, and opening the messenger from a custom dock button.',
    },
    tags: ['integrations', 'channel-talk', 'performance'],
    cover: '',
    content: {
      ko: `## 외부 SDK는 초기 페인트의 적이다

채널톡 SDK는 200KB 안팎 + iframe까지 만듭니다. 그대로 \`useEffect\` 안에서 \`boot\`하면 첫 페인트와 경합해요. \`requestIdleCallback\`으로 미루면 사용자가 첫 화면을 보고 난 뒤에 SDK가 조용히 올라옵니다.

\`\`\`jsx
import * as ChannelService from '@channel.io/channel-web-sdk-loader';

function ChannelTalk() {
  const { lang } = useLanguage();

  useEffect(() => {
    let booted = false;

    const start = () => {
      ChannelService.loadScript();
      ChannelService.boot({
        pluginKey: PLUGIN_KEY,
        language: lang === 'en' ? 'en' : 'ko',
      });
      booted = true;
    };

    const ric = window.requestIdleCallback || ((cb) => setTimeout(cb, 2000));
    const cic = window.cancelIdleCallback || clearTimeout;
    const handle = ric(start);

    return () => {
      cic(handle);
      if (booted) {
        try { ChannelService.shutdown(); } catch (e) {}
      }
    };
  }, [lang]);

  return null;
}
\`\`\`

## 도크 버튼에서 직접 메신저 열기

기본 우하단 초록 버튼을 그대로 두지 않고, 사이트 디자인과 어울리는 도크 버튼에 \`showMessenger\`를 붙였습니다. SDK가 아직 부팅 전이면 \`/contact\`로 폴백:

\`\`\`jsx
const openChat = () => {
  trackChatOpen('quick_dock');
  try {
    ChannelService.showMessenger();
  } catch (e) {
    window.location.assign('/contact');
  }
};

<button type="button" onClick={openChat} className="qdock-btn">
  <HiOutlineChatAlt2 /> 1:1 상담
</button>
\`\`\`

## 라우트 로더가 위젯을 덮도록 z-index 정리

라우트 전환 중 로딩 화면이 떴는데도 채팅 위젯이 위로 비집고 나오는 일이 있었어요. 한 줄로 정리:

\`\`\`css
.route-loader {
  position: fixed;
  inset: 0;
  z-index: 99990; /* avb-bar / dock / channel-talk 다 덮음, 커서만 그 위 */
}
\`\`\`

## 마무리: 트래킹까지 한 번에

채팅 오픈은 의뢰 직전의 강한 신호라서 GA4 이벤트로 따로 잡아둡니다:

\`\`\`js
export function trackChatOpen(source) {
  trackEvent('chat_open', { source });
}
\`\`\`

어떤 진입점에서 가장 많이 열리는지 데이터로 보고, 거기를 더 키우면 됩니다.`,

      en: `## External SDKs cost first paint

The Channel Talk SDK is ~200KB plus an iframe. Booting it inside a plain \`useEffect\` competes with your initial paint. Deferring with \`requestIdleCallback\` keeps the SDK out of the way until the user has the first screen.

\`\`\`jsx
import * as ChannelService from '@channel.io/channel-web-sdk-loader';

function ChannelTalk() {
  const { lang } = useLanguage();

  useEffect(() => {
    let booted = false;

    const start = () => {
      ChannelService.loadScript();
      ChannelService.boot({
        pluginKey: PLUGIN_KEY,
        language: lang === 'en' ? 'en' : 'ko',
      });
      booted = true;
    };

    const ric = window.requestIdleCallback || ((cb) => setTimeout(cb, 2000));
    const cic = window.cancelIdleCallback || clearTimeout;
    const handle = ric(start);

    return () => {
      cic(handle);
      if (booted) {
        try { ChannelService.shutdown(); } catch (e) {}
      }
    };
  }, [lang]);

  return null;
}
\`\`\`

## Open the messenger from a custom dock button

Instead of leaning on the default bottom-right launcher, attach \`showMessenger\` to a dock button that fits the site's design language. If the SDK isn't ready yet, fall back to \`/contact\`:

\`\`\`jsx
const openChat = () => {
  trackChatOpen('quick_dock');
  try {
    ChannelService.showMessenger();
  } catch (e) {
    window.location.assign('/contact');
  }
};

<button type="button" onClick={openChat} className="qdock-btn">
  <HiOutlineChatAlt2 /> 1:1 chat
</button>
\`\`\`

## Z-index housekeeping for the route loader

During navigation the chat widget was poking through the loading screen. Fix in one line:

\`\`\`css
.route-loader {
  position: fixed;
  inset: 0;
  z-index: 99990; /* above avb-bar / dock / Channel Talk, cursor still wins */
}
\`\`\`

## Bonus: track every open

Opening chat is a strong intent signal right before inquiry. Track it:

\`\`\`js
export function trackChatOpen(source) {
  trackEvent('chat_open', { source });
}
\`\`\`

Then look at which surface drives the most opens — and double down on it.`,
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
