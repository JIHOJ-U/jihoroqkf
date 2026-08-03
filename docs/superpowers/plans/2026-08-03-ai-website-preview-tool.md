# AI 홈페이지 시안 생성기 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** `/ai-preview` 페이지에서 방문자가 업종·목표·분위기를 입력하면 Claude API가 홈페이지 시안(헤드라인/섹션/톤/컬러)을 생성해 보여주고, "실제 제작 상담" CTA로 `/contact` 문의 폼(내용 자동 채움)까지 이어지는 리드 유입 도구를 만든다.

**Architecture:** 기존 Express 단일 파일(`backend/server.js`)에 `POST /api/ai-preview`, `GET /api/ai-previews` 라우트를 추가하고 `ai_previews` 테이블(pg 우선, 파일 폴백은 이 스펙에서는 생략 — 아래 Global Constraints 참고)에 저장한다. Claude Haiku 4.5를 tool-use로 호출해 고정 스키마 JSON을 받는다. 프론트엔드는 새 페이지 `AiPreview.js` + `AiPreview.css`를 추가하고, 기존 `location.state.prefill` 패턴으로 Contact 폼과 연결한다.

**Tech Stack:** Express + `pg` (기존), `@anthropic-ai/sdk` (신규), React + react-router-dom + framer-motion (기존 패턴 재사용), `LanguageContext` 기반 ko/en.

## Global Constraints

- 스펙 문서: `docs/superpowers/specs/2026-08-03-ai-website-preview-tool-design.md` — 모든 작업은 이 문서의 결정사항을 따른다.
- 모델은 정확히 `claude-haiku-4-5-20251001` 문자열을 사용한다.
- 이 리포는 백엔드에 테스트 러너가 없고(`backend/package.json`의 `test` 스크립트가 no-op) 프론트엔드도 CRA 기본 스모크 테스트 외엔 테스트 문화가 없다. 새 테스트 프레임워크를 이번 기능 때문에 도입하지 않는다 — 각 태스크의 검증은 `curl`/브라우저 수동 확인으로 한다.
- **DB는 pg 전용으로 구현한다.** 기존 `inquiries`는 pg-or-file 폴백이 있지만, `ai_previews`는 신규 기능이라 폴백 없이 pg만 지원해도 충분하다 (로컬 개발 시 `DATABASE_URL` 없으면 503 반환 — 아래 Task 2에 명시). 이렇게 범위를 줄여 파일 스토리지 분기 코드를 만들지 않는다.
- 기존 라우트 패턴(`app.get`/`app.post` 직접 정의, `pgPool`, `usePg` 전역 변수, `rowToXxx` camelCase 변환 헬퍼)을 그대로 따른다. 새 미들웨어 프레임워크를 추가하지 않는다.
- 새 CSS 클래스는 `ai-prev-` 접두사로 이 페이지 전용 파일(`AiPreview.css`)에만 정의한다. 다른 페이지의 전역 누수 클래스(`.section-label` 등)에 의존하지 않는다 — `.container`만 예외로 재사용한다 (`index.css`에 정의된 진짜 전역 클래스).

---

### Task 1: 백엔드 — Anthropic SDK 의존성 + 환경변수 스캐폴딩

**Files:**
- Modify: `backend/package.json`
- Modify: `backend/.env.example`

**Interfaces:**
- Produces: `ANTHROPIC_API_KEY` 환경변수 (Task 2에서 사용)

- [ ] **Step 1: 의존성 추가**

```bash
cd backend
npm install @anthropic-ai/sdk
```

- [ ] **Step 2: `.env.example`에 새 항목 추가**

`backend/.env.example` 맨 위(GITHUB_USERNAME 앞)에 추가:

```
# Claude API 키 (AI 홈페이지 시안 생성기, /api/ai-preview)
# https://console.anthropic.com/ 에서 발급
ANTHROPIC_API_KEY=

```

- [ ] **Step 3: 설치 확인**

Run: `cd backend && npm ls @anthropic-ai/sdk`
Expected: 버전 번호가 출력됨 (에러 없이)

- [ ] **Step 4: Commit**

```bash
git add backend/package.json backend/package-lock.json backend/.env.example
git commit -m "chore(backend): add Anthropic SDK dependency for AI preview tool"
```

---

### Task 2: 백엔드 — `ai_previews` 테이블 + `POST /api/ai-preview`

**Files:**
- Modify: `backend/server.js`

**Interfaces:**
- Consumes: `ANTHROPIC_API_KEY` (env, Task 1), 기존 `pgPool`/`usePg`/`readData`/`writeData` 헬퍼, `uuidv4`
- Produces:
  - `POST /api/ai-preview` — request body `{ email, businessType, siteGoal, mood, mustHave?, referenceSite?, lang }`, success response `{ id, headline, tagline, sections: [{title, description}], toneSuggestion, suggestedColors: [string] }`, 실패 시 `{ error: string, id? }`
  - `GET /api/ai-previews` — `rowToAiPreview(row)` 배열 (Task 3에서 정의)

- [ ] **Step 1: 테이블 초기화 코드 추가**

`backend/server.js`에서 기존 `inquiries` 테이블 생성 쿼리 바로 다음(그 `.then(...).catch(...)` 블록이 끝나는 지점, `app.get('/api/health'...)` 라인 전)에 추가:

```js
if (DATABASE_URL) {
  pgPool
    .query(`
      CREATE TABLE IF NOT EXISTS ai_previews (
        id             UUID PRIMARY KEY,
        email          TEXT NOT NULL,
        business_type  TEXT DEFAULT '',
        site_goal      TEXT DEFAULT '',
        mood           TEXT DEFAULT '',
        must_have      TEXT DEFAULT '',
        reference_site TEXT DEFAULT '',
        lang           TEXT DEFAULT 'ko',
        result         JSONB,
        status         TEXT DEFAULT '생성중',
        created_at     TIMESTAMPTZ DEFAULT NOW()
      );
    `)
    .catch(err => {
      console.warn('[pg] ai_previews table init failed:', err.message);
    });
}

const rowToAiPreview = (row) => ({
  id: row.id,
  email: row.email,
  businessType: row.business_type || '',
  siteGoal: row.site_goal || '',
  mood: row.mood || '',
  mustHave: row.must_have || '',
  referenceSite: row.reference_site || '',
  lang: row.lang || 'ko',
  result: row.result || null,
  status: row.status || '생성중',
  createdAt: row.created_at instanceof Date ? row.created_at.toISOString() : row.created_at,
});
```

- [ ] **Step 2: Anthropic 클라이언트 초기화 + 프롬프트/툴 스키마 상수 추가**

같은 파일, `require`문들 근처(파일 상단)에 추가:

```js
const Anthropic = require('@anthropic-ai/sdk');

const anthropic = process.env.ANTHROPIC_API_KEY
  ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  : null;

const AI_PREVIEW_MODEL = 'claude-haiku-4-5-20251001';

const AI_PREVIEW_SYSTEM_PROMPT = `You are a website copywriter and information architect for Dev.Vibe, a freelance full-stack developer studio in South Korea. Given a visitor's business description, propose a homepage structure.

Rules:
- Respond ONLY by calling the generate_site_proposal tool — never write prose outside the tool call.
- Write every text field in the language given by the "lang" field (ko or en).
- headline: under 20 words, concrete and specific to the described business — never generic filler like "Welcome to our website" or "Unlock your business potential".
- sections: 3 to 6 items, ordered top to bottom as they would appear on the page. Each title is short (2-4 words); each description is one plain sentence explaining what that section shows.
- toneSuggestion: a short phrase (not a paragraph) naming a visual direction, e.g. "Minimal with warm accents".
- suggestedColors: 2 to 3 hex color codes that fit the requested mood.
- Never invent specific prices, statistics, or claims about the business beyond what you were given.`;

const AI_PREVIEW_TOOL = {
  name: 'generate_site_proposal',
  description: 'Generate a website homepage proposal based on the business description.',
  input_schema: {
    type: 'object',
    properties: {
      headline: { type: 'string' },
      tagline: { type: 'string' },
      sections: {
        type: 'array',
        minItems: 3,
        maxItems: 6,
        items: {
          type: 'object',
          properties: {
            title: { type: 'string' },
            description: { type: 'string' },
          },
          required: ['title', 'description'],
        },
      },
      toneSuggestion: { type: 'string' },
      suggestedColors: {
        type: 'array',
        minItems: 2,
        maxItems: 3,
        items: { type: 'string' },
      },
    },
    required: ['headline', 'tagline', 'sections', 'toneSuggestion', 'suggestedColors'],
  },
};

// In-memory per-IP daily limit — single Render instance, no external store needed.
const aiPreviewHits = new Map();
const AI_PREVIEW_DAILY_LIMIT = 3;

function aiPreviewRateLimitOk(ip) {
  const now = Date.now();
  const oneDayAgo = now - 24 * 60 * 60 * 1000;
  const hits = (aiPreviewHits.get(ip) || []).filter((t) => t > oneDayAgo);
  if (hits.length >= AI_PREVIEW_DAILY_LIMIT) return false;
  hits.push(now);
  aiPreviewHits.set(ip, hits);
  return true;
}
```

- [ ] **Step 3: 라우트 추가**

기존 `app.post('/api/inquiries', ...)` 라우트 블록 뒤에 추가:

```js
app.post('/api/ai-preview', async (req, res) => {
  const { email, businessType, siteGoal, mood, mustHave, referenceSite, lang } = req.body || {};

  if (!email || !businessType || !siteGoal || !mood) {
    return res.status(400).json({ error: 'missing_fields' });
  }
  const MAX_LEN = 500;
  const fields = [email, businessType, siteGoal, mood, mustHave, referenceSite];
  if (fields.some((v) => typeof v === 'string' && v.length > MAX_LEN)) {
    return res.status(400).json({ error: 'input_too_long' });
  }
  if (!usePg || !pgPool) {
    return res.status(503).json({ error: 'db_unavailable' });
  }

  const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || req.socket.remoteAddress;
  if (!aiPreviewRateLimitOk(ip)) {
    return res.status(429).json({ error: 'rate_limited' });
  }

  const id = uuidv4();
  const record = {
    businessType,
    siteGoal,
    mood,
    mustHave: mustHave || '',
    referenceSite: referenceSite || '',
    lang: lang === 'en' ? 'en' : 'ko',
  };

  try {
    await pgPool.query(
      `INSERT INTO ai_previews (id, email, business_type, site_goal, mood, must_have, reference_site, lang, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, '생성중')`,
      [id, email, record.businessType, record.siteGoal, record.mood, record.mustHave, record.referenceSite, record.lang]
    );
  } catch (err) {
    console.error('[ai-preview] failed to save input:', err.message);
    return res.status(500).json({ error: 'save_failed' });
  }

  if (!anthropic) {
    return res.status(503).json({ error: 'ai_unavailable', id });
  }

  try {
    const message = await anthropic.messages.create({
      model: AI_PREVIEW_MODEL,
      max_tokens: 600,
      system: [{ type: 'text', text: AI_PREVIEW_SYSTEM_PROMPT, cache_control: { type: 'ephemeral' } }],
      tools: [AI_PREVIEW_TOOL],
      tool_choice: { type: 'tool', name: 'generate_site_proposal' },
      messages: [{
        role: 'user',
        content: `lang: ${record.lang}\nbusinessType: ${record.businessType}\nsiteGoal: ${record.siteGoal}\nmood: ${record.mood}\nmustHave: ${record.mustHave}\nreferenceSite: ${record.referenceSite}`,
      }],
    });

    const toolUse = message.content.find((c) => c.type === 'tool_use');
    if (!toolUse) throw new Error('no tool_use block in response');
    const result = toolUse.input;

    await pgPool.query(`UPDATE ai_previews SET result = $1, status = '완료' WHERE id = $2`, [JSON.stringify(result), id]);

    res.json({ id, ...result });
  } catch (err) {
    console.error('[ai-preview] generation failed:', err.message);
    await pgPool.query(`UPDATE ai_previews SET status = '실패' WHERE id = $1`, [id]).catch(() => {});
    res.status(502).json({ error: 'generation_failed', id });
  }
});
```

- [ ] **Step 4: 로컬에서 수동 검증 (DB 없이 — 필드 검증 경로)**

Run:
```bash
cd backend
node server.js &
sleep 1
curl -s -X POST http://localhost:3001/api/ai-preview -H "Content-Type: application/json" -d '{}'
```
Expected: `{"error":"missing_fields"}` (HTTP 400)

- [ ] **Step 5: `DATABASE_URL`이 설정된 환경(또는 로컬 Postgres)에서 전체 플로우 검증**

`ANTHROPIC_API_KEY`와 `DATABASE_URL`을 `.env`에 넣은 뒤:

```bash
curl -s -X POST http://localhost:3001/api/ai-preview -H "Content-Type: application/json" -d '{
  "email": "test@example.com",
  "businessType": "카페/음식점",
  "siteGoal": "예약 늘리기",
  "mood": "따뜻한",
  "mustHave": "온라인 예약, 메뉴판",
  "referenceSite": "",
  "lang": "ko"
}'
```
Expected: `headline`, `tagline`, `sections`(3~6개 배열), `toneSuggestion`, `suggestedColors`가 담긴 JSON 응답. 서버 종료: `kill %1`

- [ ] **Step 6: Commit**

```bash
git add backend/server.js
git commit -m "feat(backend): POST /api/ai-preview — Claude-generated site proposal"
```

---

### Task 3: 백엔드 — `GET /api/ai-previews` (관리자용 리드 목록)

**Files:**
- Modify: `backend/server.js`

**Interfaces:**
- Consumes: `rowToAiPreview` (Task 2)
- Produces: `GET /api/ai-previews` → `AiPreview[]` (JSON 배열, 최신순)

- [ ] **Step 1: 라우트 추가**

Task 2에서 추가한 `POST /api/ai-preview` 블록 바로 뒤에 추가:

```js
app.get('/api/ai-previews', async (req, res) => {
  if (!usePg || !pgPool) {
    return res.json([]);
  }
  try {
    const result = await pgPool.query('SELECT * FROM ai_previews ORDER BY created_at DESC');
    res.json(result.rows.map(rowToAiPreview));
  } catch (err) {
    console.error('[ai-previews] fetch failed:', err.message);
    res.status(500).json({ error: 'fetch_failed' });
  }
});
```

- [ ] **Step 2: 수동 검증**

Run: `curl -s http://localhost:3001/api/ai-previews`
Expected: Task 2 Step 5에서 생성한 레코드가 배열에 포함되어 반환됨 (`result` 필드가 채워진 상태)

- [ ] **Step 3: Commit**

```bash
git add backend/server.js
git commit -m "feat(backend): GET /api/ai-previews — list AI preview leads"
```

---

### Task 4: 프론트엔드 — API 클라이언트 함수

**Files:**
- Modify: `frontend/src/api/index.js`

**Interfaces:**
- Produces: `submitAiPreview(data) => Promise<AxiosResponse>` — `data: { businessType, siteGoal, mood, mustHave, referenceSite, email, lang }`

- [ ] **Step 1: 함수 추가**

`frontend/src/api/index.js`의 `// Inquiry API` 블록 뒤에 추가:

```js
// AI Preview API
export const submitAiPreview = (data) => api.post('/ai-preview', data);
```

- [ ] **Step 2: 검증**

`node -e "require('./src/api/index.js')"`는 ES module이라 직접 실행은 안 됨 — 대신 Task 6에서 프론트엔드 페이지와 함께 통합 검증한다. 여기서는 문법 확인만:

Run: `cd frontend && NODE_ENV=production node -e "const babel=require('./node_modules/@babel/core'); babel.transformFileSync('src/api/index.js', {presets:['react-app']}); console.log('OK')"`
Expected: `OK`

- [ ] **Step 3: Commit**

```bash
git add frontend/src/api/index.js
git commit -m "feat(frontend): add submitAiPreview API client function"
```

---

### Task 5: 프론트엔드 — `LanguageContext`에 ko/en 카피 추가

**Files:**
- Modify: `frontend/src/contexts/LanguageContext.js`

**Interfaces:**
- Produces: `t.aiPreview` (ko/en 각각) — Task 6에서 사용하는 정확한 키 목록:
  `label, title, desc, businessTypes: string[], siteGoals: string[], moods: string[], form: {businessType, siteGoal, mood, mustHave, mustHavePh, referenceSite, referenceSitePh, email, emailPh}, submit, submitting, errors: {missing_fields, input_too_long, rate_limited, db_unavailable, ai_unavailable, save_failed, generation_failed, unknown, fallbackCta}, result: {toneLabel}, cta, prefillPrefix`

- [ ] **Step 1: 한국어 블록 추가**

`frontend/src/contexts/LanguageContext.js`의 `ko: { ... }` 블록 안, `pricing: { ... }` 항목 뒤(콤마 다음)에 추가:

```js
    aiPreview: {
      label: '// AI_PREVIEW',
      title: 'AI로 홈페이지 시안 먼저 받아보기',
      desc: '업종과 원하는 분위기를 알려주시면 AI가 헤드라인·구성안을 만들어드려요. 실제 제작은 언제나 사람이 직접 코드로 완성합니다.',
      businessTypes: ['카페/음식점', '병원/의원', '학원/교육', '쇼핑몰/커머스', '뷰티/살롱', 'IT/스타트업', '기타'],
      siteGoals: ['예약 늘리기', '판매 늘리기', '문의 늘리기', '브랜드 소개', '채용'],
      moods: ['미니멀', '따뜻한', '고급스러운', '발랄한', '신뢰감 있는'],
      form: {
        businessType: '업종',
        siteGoal: '사이트 목표',
        mood: '원하는 분위기',
        mustHave: '꼭 필요한 기능',
        mustHavePh: '예: 온라인 예약, 실시간 채팅, 다국어 지원',
        referenceSite: '참고 사이트 (선택)',
        referenceSitePh: '마음에 드는 사이트 URL',
        email: '이메일',
        emailPh: 'name@email.com',
      },
      submit: 'AI 시안 받기',
      submitting: 'AI가 시안을 만들고 있어요...',
      errors: {
        missing_fields: '필수 항목을 모두 입력해주세요.',
        input_too_long: '입력 내용이 너무 길어요. 조금 줄여주세요.',
        rate_limited: '오늘 생성 가능 횟수를 모두 사용했어요. 내일 다시 시도해주세요.',
        db_unavailable: '지금 서비스 점검 중이에요. 잠시 후 다시 시도해주세요.',
        ai_unavailable: 'AI 시안 생성이 잠시 꺼져 있어요.',
        save_failed: '저장에 실패했어요. 다시 시도해주세요.',
        generation_failed: 'AI 시안 생성에 실패했어요.',
        unknown: '알 수 없는 오류가 발생했어요.',
        fallbackCta: 'AI 없이 바로 상담 신청하기',
      },
      result: {
        toneLabel: '추천 톤:',
      },
      cta: '이 방향으로 실제 제작 상담받기',
      prefillPrefix: 'AI 시안을 참고해서 프로젝트를 문의드려요.',
    },
```

- [ ] **Step 2: 영어 블록 추가**

같은 파일 `en: { ... }` 블록 안, `pricing: { ... }` 항목 뒤에 추가:

```js
    aiPreview: {
      label: '// AI_PREVIEW',
      title: 'Get an AI draft of your homepage first',
      desc: "Tell us your business and the mood you want — AI drafts a headline and page structure. The real build is always finished by hand, in code, by a person.",
      businessTypes: ['Cafe/Restaurant', 'Clinic/Hospital', 'Academy/Education', 'E-commerce', 'Beauty/Salon', 'IT/Startup', 'Other'],
      siteGoals: ['More bookings', 'More sales', 'More inquiries', 'Brand introduction', 'Hiring'],
      moods: ['Minimal', 'Warm', 'Premium', 'Playful', 'Trustworthy'],
      form: {
        businessType: 'Business type',
        siteGoal: 'Site goal',
        mood: 'Preferred mood',
        mustHave: 'Must-have features',
        mustHavePh: 'e.g. online booking, live chat, multi-language',
        referenceSite: 'Reference site (optional)',
        referenceSitePh: 'URL of a site you like',
        email: 'Email',
        emailPh: 'name@email.com',
      },
      submit: 'Get AI draft',
      submitting: 'AI is drafting your proposal...',
      errors: {
        missing_fields: 'Please fill in all required fields.',
        input_too_long: 'That input is a bit long — please shorten it.',
        rate_limited: "You've used today's generation limit. Please try again tomorrow.",
        db_unavailable: 'The service is under maintenance right now. Please try again soon.',
        ai_unavailable: 'AI drafting is temporarily disabled.',
        save_failed: 'Failed to save. Please try again.',
        generation_failed: 'AI draft generation failed.',
        unknown: 'An unknown error occurred.',
        fallbackCta: 'Skip AI, start a consultation',
      },
      result: {
        toneLabel: 'Suggested tone:',
      },
      cta: 'Start a real project with this direction',
      prefillPrefix: "I'd like to discuss a project based on this AI draft.",
    },
```

- [ ] **Step 3: 검증**

Run: `cd frontend && NODE_ENV=production node -e "const babel=require('./node_modules/@babel/core'); babel.transformFileSync('src/contexts/LanguageContext.js', {presets:['react-app']}); console.log('OK')"`
Expected: `OK` (문법 오류 없음 — 특히 콤마 누락 확인)

- [ ] **Step 4: Commit**

```bash
git add frontend/src/contexts/LanguageContext.js
git commit -m "feat(frontend): add ko/en copy for AI preview tool"
```

---

### Task 6: 프론트엔드 — `AiPreview` 페이지 (폼 + 상태 관리)

**Files:**
- Create: `frontend/src/pages/AiPreview.js`
- Create: `frontend/src/pages/AiPreview.css`

**Interfaces:**
- Consumes: `submitAiPreview` (Task 4), `t.aiPreview` (Task 5), `useLanguage()` (기존 `LanguageContext`)
- Produces: `AiPreview` 컴포넌트 (default export) — Task 8에서 라우트에 연결

- [ ] **Step 1: `AiPreview.js` 작성**

```jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiArrowRight, HiSparkles, HiExclamationCircle } from 'react-icons/hi';
import { submitAiPreview } from '../api';
import { useLanguage } from '../contexts/LanguageContext';
import './AiPreview.css';

function AiPreview() {
  const { t, lang } = useLanguage();
  const c = t.aiPreview;
  const navigate = useNavigate();

  const [form, setForm] = useState({
    businessType: c.businessTypes[0],
    siteGoal: c.siteGoals[0],
    mood: c.moods[0],
    mustHave: '',
    referenceSite: '',
    email: '',
  });
  const [status, setStatus] = useState('idle'); // idle | loading | result | error
  const [result, setResult] = useState(null);
  const [errorType, setErrorType] = useState('unknown');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email.trim()) return;
    setStatus('loading');
    try {
      const res = await submitAiPreview({ ...form, lang });
      setResult(res.data);
      setStatus('result');
    } catch (err) {
      setErrorType(err.response?.data?.error || 'unknown');
      setStatus('error');
    }
  };

  const goToContact = () => {
    const summary = result
      ? `"${result.headline}"\n\n${result.sections.map((s) => `- ${s.title}: ${s.description}`).join('\n')}`
      : `${form.businessType} / ${form.siteGoal}`;
    navigate('/contact', {
      state: {
        prefill: {
          projectType: form.businessType,
          description: `${c.prefillPrefix}\n\n${summary}`,
        },
      },
    });
  };

  return (
    <div className="ai-prev-page">
      <div className="container">
        <header className="ai-prev-header">
          <span className="ai-prev-label" translate="no">{c.label}</span>
          <h1 className="ai-prev-title">{c.title}</h1>
          <p className="ai-prev-desc">{c.desc}</p>
        </header>

        {status !== 'result' && (
          <form className="ai-prev-form" onSubmit={handleSubmit}>
            <div className="ai-prev-field">
              <label>{c.form.businessType}</label>
              <select name="businessType" value={form.businessType} onChange={handleChange}>
                {c.businessTypes.map((v) => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>

            <div className="ai-prev-field">
              <label>{c.form.siteGoal}</label>
              <select name="siteGoal" value={form.siteGoal} onChange={handleChange}>
                {c.siteGoals.map((v) => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>

            <div className="ai-prev-field">
              <label>{c.form.mood}</label>
              <div className="ai-prev-chips">
                {c.moods.map((m) => (
                  <label key={m} className={`ai-prev-chip ${form.mood === m ? 'active' : ''}`}>
                    <input type="radio" name="mood" value={m} checked={form.mood === m} onChange={handleChange} />
                    {m}
                  </label>
                ))}
              </div>
            </div>

            <div className="ai-prev-field">
              <label>{c.form.mustHave}</label>
              <textarea name="mustHave" value={form.mustHave} onChange={handleChange} rows={3} placeholder={c.form.mustHavePh} />
            </div>

            <div className="ai-prev-field">
              <label>{c.form.referenceSite}</label>
              <input type="text" name="referenceSite" value={form.referenceSite} onChange={handleChange} placeholder={c.form.referenceSitePh} />
            </div>

            <div className="ai-prev-field">
              <label>{c.form.email}</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} placeholder={c.form.emailPh} required />
            </div>

            <button type="submit" className="ai-prev-submit" disabled={status === 'loading'}>
              <HiSparkles /> {status === 'loading' ? c.submitting : c.submit}
            </button>
          </form>
        )}

        {status === 'error' && (
          <div className="ai-prev-error">
            <p><HiExclamationCircle /> {c.errors[errorType] || c.errors.unknown}</p>
            <button type="button" className="ai-prev-fallback-btn" onClick={goToContact}>
              {c.errors.fallbackCta} <HiArrowRight />
            </button>
          </div>
        )}

        {status === 'result' && result && (
          <motion.div
            className="ai-prev-result"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="ai-prev-result-headline">{result.headline}</h2>
            <p className="ai-prev-result-tagline">{result.tagline}</p>

            <div className="ai-prev-result-sections">
              {result.sections.map((s, i) => (
                <div key={i} className="ai-prev-result-section">
                  <span className="ai-prev-result-section-num">{String(i + 1).padStart(2, '0')}</span>
                  <div>
                    <h3>{s.title}</h3>
                    <p>{s.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="ai-prev-result-tone">
              <span>{c.result.toneLabel}</span> {result.toneSuggestion}
              <div className="ai-prev-result-colors">
                {result.suggestedColors.map((hex, i) => (
                  <span key={i} className="ai-prev-result-swatch" style={{ background: hex }} title={hex} />
                ))}
              </div>
            </div>

            <div className="ai-prev-result-cta">
              <Link
                to="/contact"
                onClick={(e) => { e.preventDefault(); goToContact(); }}
                className="ai-prev-result-cta-btn"
              >
                {c.cta} <HiArrowRight />
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default AiPreview;
```

- [ ] **Step 2: `AiPreview.css` 작성**

```css
.ai-prev-page {
  padding: 140px 0 100px;
  min-height: 60vh;
}

.ai-prev-header {
  max-width: 640px;
  margin: 0 auto 48px;
  text-align: center;
}

.ai-prev-label {
  display: inline-block;
  font-family: 'Courier New', monospace;
  font-size: 0.78rem;
  font-weight: 700;
  color: #6366f1;
  letter-spacing: 0.5px;
  margin-bottom: 12px;
}

.ai-prev-title {
  font-size: clamp(1.6rem, 4vw, 2.4rem);
  font-weight: 800;
  letter-spacing: -1px;
  margin-bottom: 16px;
}

.ai-prev-desc {
  font-size: 1rem;
  line-height: 1.7;
  color: var(--text-muted);
}

.ai-prev-form {
  max-width: 560px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 22px;
}

.ai-prev-field label {
  display: block;
  font-size: 0.85rem;
  font-weight: 600;
  margin-bottom: 8px;
}

.ai-prev-field select,
.ai-prev-field input,
.ai-prev-field textarea {
  width: 100%;
  padding: 12px 14px;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  background: var(--bg-primary);
  color: var(--text-primary);
  font-size: 0.95rem;
  font-family: inherit;
}

.ai-prev-field textarea {
  resize: vertical;
}

.ai-prev-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.ai-prev-chip {
  padding: 8px 16px;
  border: 1px solid var(--border);
  border-radius: 999px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: var(--transition);
}

.ai-prev-chip input {
  display: none;
}

.ai-prev-chip.active {
  background: #6366f1;
  border-color: #6366f1;
  color: #fff;
}

.ai-prev-submit {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 16px;
  border: none;
  border-radius: var(--radius-md);
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: #fff;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: var(--transition);
}

.ai-prev-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.ai-prev-error {
  max-width: 560px;
  margin: 0 auto;
  text-align: center;
  padding: 32px 24px;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
}

.ai-prev-error p {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: var(--text-muted);
  margin-bottom: 16px;
}

.ai-prev-fallback-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 10px 20px;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  background: transparent;
  color: var(--text-primary);
  font-weight: 600;
  cursor: pointer;
}

.ai-prev-result {
  max-width: 640px;
  margin: 0 auto;
  padding: 40px;
  border: 1px solid var(--border);
  border-radius: 16px;
  box-shadow: var(--shadow-lg);
}

.ai-prev-result-headline {
  font-size: 1.6rem;
  font-weight: 800;
  letter-spacing: -0.5px;
  margin-bottom: 8px;
}

.ai-prev-result-tagline {
  color: var(--text-muted);
  margin-bottom: 28px;
}

.ai-prev-result-sections {
  display: flex;
  flex-direction: column;
  gap: 18px;
  margin-bottom: 28px;
}

.ai-prev-result-section {
  display: flex;
  gap: 14px;
}

.ai-prev-result-section-num {
  font-family: 'Courier New', monospace;
  font-weight: 700;
  color: #6366f1;
  flex-shrink: 0;
}

.ai-prev-result-section h3 {
  font-size: 1rem;
  margin-bottom: 4px;
}

.ai-prev-result-section p {
  font-size: 0.9rem;
  color: var(--text-muted);
}

.ai-prev-result-tone {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.9rem;
  margin-bottom: 28px;
}

.ai-prev-result-tone span:first-child {
  font-weight: 600;
}

.ai-prev-result-colors {
  display: flex;
  gap: 6px;
}

.ai-prev-result-swatch {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 1px solid var(--border);
}

.ai-prev-result-cta-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 16px;
  border-radius: var(--radius-md);
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: #fff;
  font-weight: 700;
  text-decoration: none;
}

@media (max-width: 640px) {
  .ai-prev-result {
    padding: 28px 20px;
  }
}
```

- [ ] **Step 3: 문법 검증**

Run: `cd frontend && NODE_ENV=production node -e "const babel=require('./node_modules/@babel/core'); babel.transformFileSync('src/pages/AiPreview.js', {presets:['react-app']}); console.log('OK')"`
Expected: `OK`

- [ ] **Step 4: Commit**

```bash
git add frontend/src/pages/AiPreview.js frontend/src/pages/AiPreview.css
git commit -m "feat(frontend): add AiPreview page — form, loading, result, error states"
```

---

### Task 7: 프론트엔드 — 라우트 등록

**Files:**
- Modify: `frontend/src/App.js`

**Interfaces:**
- Consumes: `AiPreview` (Task 6, default export from `./pages/AiPreview`)

- [ ] **Step 1: lazy import 추가**

`frontend/src/App.js`에서 기존 lazy route 선언들 사이(`const Contact = withMinDelay(...)` 다음 줄)에 추가:

```js
const AiPreview = withMinDelay(() => import('./pages/AiPreview'));
```

- [ ] **Step 2: `<Route>` 추가**

`<Route path="/contact" ... />` 바로 뒤에 추가:

```jsx
<Route path="/ai-preview" element={<PageTransition><AiPreview /></PageTransition>} />
```

- [ ] **Step 3: 빌드 검증**

Run: `cd frontend && GENERATE_SOURCEMAP=false npm run build`
Expected: `The build folder is ready to be deployed.` (로컬 메모리 부족으로 빌드가 죽으면, Task 4/5/6에서 이미 각 파일 babel 검증을 통과했으므로 배포 파이프라인에서 재확인)

- [ ] **Step 4: 브라우저 수동 확인**

Run: `cd frontend && npm start` (백엔드도 별도로 `cd backend && node server.js`로 실행 중이어야 함)
브라우저에서 `http://localhost:3000/ai-preview` 접속 → 폼 작성 → "AI 시안 받기" 클릭 → 결과 카드 표시 확인 → "이 방향으로 실제 제작 상담받기" 클릭 → `/contact`로 이동하며 설명란에 AI 시안 요약이 채워져 있는지 확인

- [ ] **Step 5: Commit**

```bash
git add frontend/src/App.js
git commit -m "feat(frontend): register /ai-preview route"
```

---

### Task 8: 홈페이지에 진입 CTA 추가

**Files:**
- Modify: `frontend/src/pages/Home.js`

**Interfaces:**
- Consumes: 없음 (기존 `react-router-dom` `Link`, 기존 `.hero-cta--secondary` CSS 클래스)

- [ ] **Step 1: Hero 섹션 CTA 옆에 링크 추가**

`frontend/src/pages/Home.js`의 `hero-card__cta hero-ctas` 블록(`hero-cta--primary`, `hero-cta--secondary` 두 개 링크가 있는 곳) 안, 두 번째 링크(`hero-cta--secondary`, `/portfolio`) 뒤에 추가. 기존 `.hero-cta--secondary` 스타일(투명 배경 + 흰 테두리)을 그대로 재사용하므로 CSS 추가는 필요 없다:

```jsx
<Link to="/ai-preview" className="hero-cta hero-cta--secondary">
  {lang === 'ko' ? 'AI로 먼저 시안 받아보기' : 'Try the AI draft'}
</Link>
```

- [ ] **Step 2: 브라우저 확인**

`http://localhost:3000/` 접속 → 히어로 카드 아래 CTA 3개(문의하기, 포트폴리오, AI 시안) 모두 표시되고 클릭 시 정상 이동하는지 확인. 모바일 폭(375px)에서 줄바꿈이 깨지지 않는지도 확인.

- [ ] **Step 3: Commit**

```bash
git add frontend/src/pages/Home.js
git commit -m "feat(home): add entry CTA to AI preview tool"
```

---

## 실행 후 남는 것 (스펙 문서의 "범위 밖" 참고)

- Admin 화면에서 `GET /api/ai-previews` 데이터를 보여주는 UI (백엔드 API는 이 플랜에 포함되어 있음)
- 실제 프로덕션 배포 시 Render 환경변수에 `ANTHROPIC_API_KEY` 추가 필요 (Render 대시보드에서 수동 설정 — 이 플랜의 범위 밖)
