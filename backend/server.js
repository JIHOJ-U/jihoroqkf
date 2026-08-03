require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');
const Parser = require('rss-parser');
const fetch = require('node-fetch');
const nodemailer = require('nodemailer');
const { Pool } = require('pg');
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

const app = express();
const PORT = process.env.PORT || 3001;

// Config
const GITHUB_USERNAME = process.env.GITHUB_USERNAME || 'JIHOJ-U';
const NAVER_BLOG_ID = process.env.NAVER_BLOG_ID || 'longnight0719';
const NOTIFY_WEBHOOK_URL = process.env.NOTIFY_WEBHOOK_URL || '';

// Email notification config (Naver SMTP / Gmail / etc.)
const EMAIL_HOST = process.env.EMAIL_HOST || '';
const EMAIL_PORT = parseInt(process.env.EMAIL_PORT || '587', 10);
const EMAIL_USER = process.env.EMAIL_USER || '';
const EMAIL_PASS = process.env.EMAIL_PASS || '';
const NOTIFY_EMAIL_TO = process.env.NOTIFY_EMAIL_TO || 'roqkfwkwlgh@naver.com';

let mailTransporter = null;
if (EMAIL_HOST && EMAIL_USER && EMAIL_PASS) {
  mailTransporter = nodemailer.createTransport({
    host: EMAIL_HOST,
    port: EMAIL_PORT,
    secure: EMAIL_PORT === 465,
    auth: { user: EMAIL_USER, pass: EMAIL_PASS },
  });
  mailTransporter.verify().then(
    () => console.log('✅ Email transporter ready'),
    err => console.warn('[email] verify failed:', err.message)
  );
}
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || '')
  .split(',').map(s => s.trim()).filter(Boolean);

const rssParser = new Parser();

// CORS
const corsOptions = ALLOWED_ORIGINS.length
  ? {
      origin: (origin, cb) => {
        if (!origin) return cb(null, true);
        if (ALLOWED_ORIGINS.some(a => origin === a || origin.endsWith(a.replace(/^https?:\/\//, '')))) {
          return cb(null, true);
        }
        cb(new Error(`Not allowed by CORS: ${origin}`));
      },
      credentials: true,
    }
  : { origin: true, credentials: true };

app.use(cors(corsOptions));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Ensure directories
['uploads', 'data'].forEach(d => {
  const p = path.join(__dirname, d);
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
});

// ========== Seed: ensure committed default portfolios always exist ==========
const SEED_PATH = path.join(__dirname, 'data', 'seed-portfolios.json');
const DATA_PATH = path.join(__dirname, 'data', 'portfolios.json');

function ensureSeed() {
  if (!fs.existsSync(SEED_PATH)) return;
  let current = [];
  if (fs.existsSync(DATA_PATH)) {
    try { current = JSON.parse(fs.readFileSync(DATA_PATH, 'utf-8')); } catch (e) { current = []; }
  }
  const seed = JSON.parse(fs.readFileSync(SEED_PATH, 'utf-8'));

  // Add any seed entries that don't exist in current (by title)
  let changed = false;
  seed.forEach(s => {
    if (!current.find(c => c.id === s.id || c.title === s.title)) {
      current.unshift(s);
      changed = true;
    }
  });

  if (changed || !fs.existsSync(DATA_PATH)) {
    fs.writeFileSync(DATA_PATH, JSON.stringify(current, null, 2), 'utf-8');
    console.log(`[seed] Loaded ${seed.length} portfolio(s) from seed file`);
  }
}
ensureSeed();

// File storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${uuidv4()}${ext}`);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime = allowed.test(file.mimetype);
    if (ext && mime) return cb(null, true);
    cb(new Error('이미지 파일만 업로드 가능합니다.'));
  },
});
const portfolioUpload = upload.fields([
  { name: 'thumbnail', maxCount: 1 },
  { name: 'images', maxCount: 20 },
]);

const DATA_DIR = path.join(__dirname, 'data');
const getFilePath = (name) => path.join(DATA_DIR, `${name}.json`);
function readData(name) {
  const fp = getFilePath(name);
  if (!fs.existsSync(fp)) return [];
  try { return JSON.parse(fs.readFileSync(fp, 'utf-8')); } catch (e) { return []; }
}
function writeData(name, data) {
  fs.writeFileSync(getFilePath(name), JSON.stringify(data, null, 2), 'utf-8');
}

// ========== PostgreSQL (inquiries — persistent across Render free-tier restarts) ==========
// If DATABASE_URL is set (Render Postgres), inquiries route through pg (persistent).
// Otherwise they fall back to file-based readData/writeData (local dev). Portfolios
// stay file-based since they're re-seeded from seed-portfolios.json on each deploy.

const DATABASE_URL = process.env.DATABASE_URL || '';
let pgPool = null;
let usePg = false;

if (DATABASE_URL) {
  pgPool = new Pool({
    connectionString: DATABASE_URL,
    // Render Postgres requires SSL; the internal URL uses a self-signed cert
    // so rejectUnauthorized:false is needed. Non-Render URLs may not need SSL.
    ssl: /render\.com|amazonaws|onrender/.test(DATABASE_URL) || process.env.NODE_ENV === 'production'
      ? { rejectUnauthorized: false }
      : false,
    max: 5,
    idleTimeoutMillis: 30000,
  });

  pgPool
    .query(`
      CREATE TABLE IF NOT EXISTS inquiries (
        id           UUID PRIMARY KEY,
        name         TEXT NOT NULL,
        email        TEXT NOT NULL,
        phone        TEXT DEFAULT '',
        company      TEXT DEFAULT '',
        project_type TEXT DEFAULT '웹 개발',
        budget       TEXT DEFAULT '',
        timeline     TEXT DEFAULT '',
        description  TEXT NOT NULL,
        status       TEXT DEFAULT '접수됨',
        created_at   TIMESTAMPTZ DEFAULT NOW(),
        updated_at   TIMESTAMPTZ
      );
    `)
    .then(() => {
      usePg = true;
      console.log('✅ PostgreSQL connected — inquiries are persistent');
    })
    .catch(err => {
      console.warn('[pg] init failed, falling back to file storage:', err.message);
    });
} else {
  console.log('[pg] DATABASE_URL not set — using file storage (data will not persist across restarts)');
}

// Convert Postgres row (snake_case) → API response shape (camelCase).
const rowToInquiry = (row) => ({
  id: row.id,
  name: row.name,
  email: row.email,
  phone: row.phone || '',
  company: row.company || '',
  projectType: row.project_type || '웹 개발',
  budget: row.budget || '',
  timeline: row.timeline || '',
  description: row.description,
  status: row.status || '접수됨',
  createdAt: row.created_at instanceof Date ? row.created_at.toISOString() : row.created_at,
  updatedAt: row.updated_at instanceof Date ? row.updated_at.toISOString() : (row.updated_at || undefined),
});

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

// ========== Health ==========
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime(), timestamp: new Date().toISOString() });
});

// ========== Portfolio API ==========

app.get('/api/portfolios', (req, res) => {
  res.json(readData('portfolios'));
});

app.get('/api/portfolios/:id', (req, res) => {
  const items = readData('portfolios');
  const item = items.find(p => p.id === req.params.id);
  if (!item) return res.status(404).json({ error: '포트폴리오를 찾을 수 없습니다.' });
  res.json(item);
});

app.post('/api/portfolios', portfolioUpload, (req, res) => {
  const items = readData('portfolios');
  const { title, description, techStack, projectUrl, githubUrl, demoUrl, category, duration, client } = req.body;
  const thumbnailFile = req.files?.thumbnail?.[0];
  const imageFiles = req.files?.images || [];

  const newItem = {
    id: uuidv4(),
    title,
    description,
    techStack: techStack ? techStack.split(',').map(s => s.trim()) : [],
    projectUrl: projectUrl || '',
    githubUrl: githubUrl || '',
    demoUrl: demoUrl || '',
    category: category || '웹 개발',
    duration: duration || '',
    client: client || '',
    thumbnail: thumbnailFile ? `/uploads/${thumbnailFile.filename}` : '',
    images: imageFiles.map(f => `/uploads/${f.filename}`),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  items.unshift(newItem);
  writeData('portfolios', items);
  res.status(201).json(newItem);
});

app.put('/api/portfolios/:id', portfolioUpload, (req, res) => {
  const items = readData('portfolios');
  const idx = items.findIndex(p => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: '포트폴리오를 찾을 수 없습니다.' });

  const { title, description, techStack, projectUrl, githubUrl, demoUrl, category, duration, client, existingImages } = req.body;
  const thumbnailFile = req.files?.thumbnail?.[0];
  const imageFiles = req.files?.images || [];

  let mergedImages = items[idx].images || [];
  if (existingImages !== undefined) {
    try { mergedImages = JSON.parse(existingImages); } catch (e) { mergedImages = []; }
  }
  mergedImages = [...mergedImages, ...imageFiles.map(f => `/uploads/${f.filename}`)];

  items[idx] = {
    ...items[idx],
    title: title || items[idx].title,
    description: description !== undefined ? description : items[idx].description,
    techStack: techStack ? techStack.split(',').map(s => s.trim()) : items[idx].techStack,
    projectUrl: projectUrl !== undefined ? projectUrl : items[idx].projectUrl,
    githubUrl: githubUrl !== undefined ? githubUrl : items[idx].githubUrl,
    demoUrl: demoUrl !== undefined ? demoUrl : (items[idx].demoUrl || ''),
    category: category || items[idx].category,
    duration: duration !== undefined ? duration : items[idx].duration,
    client: client !== undefined ? client : items[idx].client,
    thumbnail: thumbnailFile ? `/uploads/${thumbnailFile.filename}` : items[idx].thumbnail,
    images: mergedImages,
    updatedAt: new Date().toISOString(),
  };
  writeData('portfolios', items);
  res.json(items[idx]);
});

app.delete('/api/portfolios/:id', (req, res) => {
  let items = readData('portfolios');
  const item = items.find(p => p.id === req.params.id);
  if (!item) return res.status(404).json({ error: '포트폴리오를 찾을 수 없습니다.' });

  // Delete local files
  if (item.thumbnail && !item.thumbnail.startsWith('http')) {
    const fp = path.join(__dirname, item.thumbnail);
    if (fs.existsSync(fp)) fs.unlinkSync(fp);
  }
  if (Array.isArray(item.images)) {
    item.images.forEach(img => {
      if (img && !img.startsWith('http')) {
        const fp = path.join(__dirname, img);
        if (fs.existsSync(fp)) fs.unlinkSync(fp);
      }
    });
  }

  items = items.filter(p => p.id !== req.params.id);
  writeData('portfolios', items);
  res.json({ message: '삭제되었습니다.' });
});

// ========== Inquiry API ==========
app.post('/api/inquiries', async (req, res) => {
  const { name, email, phone, company, projectType, budget, timeline, description } = req.body;
  if (!name || !email || !description) {
    return res.status(400).json({ error: '이름, 이메일, 프로젝트 설명은 필수입니다.' });
  }
  const newInquiry = {
    id: uuidv4(),
    name, email,
    phone: phone || '', company: company || '',
    projectType: projectType || '웹 개발',
    budget: budget || '', timeline: timeline || '',
    description, status: '접수됨',
    createdAt: new Date().toISOString(),
  };
  try {
    if (usePg && pgPool) {
      await pgPool.query(
        `INSERT INTO inquiries
           (id, name, email, phone, company, project_type, budget, timeline, description, status, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
        [
          newInquiry.id, newInquiry.name, newInquiry.email, newInquiry.phone, newInquiry.company,
          newInquiry.projectType, newInquiry.budget, newInquiry.timeline, newInquiry.description,
          newInquiry.status, newInquiry.createdAt,
        ]
      );
    } else {
      const inquiries = readData('inquiries');
      inquiries.unshift(newInquiry);
      writeData('inquiries', inquiries);
    }
  } catch (e) {
    console.error('[inquiry.create] failed:', e.message);
    return res.status(500).json({ error: '문의 저장 중 오류가 발생했습니다.' });
  }
  notifyNewInquiry(newInquiry).catch(err => console.error('[notify] failed:', err.message));
  res.status(201).json({ message: '문의가 접수되었습니다.', inquiry: newInquiry });
});

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

app.get('/api/inquiries', async (req, res) => {
  try {
    if (usePg && pgPool) {
      const result = await pgPool.query('SELECT * FROM inquiries ORDER BY created_at DESC');
      return res.json(result.rows.map(rowToInquiry));
    }
    res.json(readData('inquiries'));
  } catch (e) {
    console.error('[inquiry.list] failed:', e.message);
    res.status(500).json({ error: '문의 조회 중 오류가 발생했습니다.' });
  }
});

app.patch('/api/inquiries/:id', async (req, res) => {
  try {
    if (usePg && pgPool) {
      // Map incoming (camelCase) → column names (snake_case) and only touch allowed columns.
      const colByField = {
        name: 'name', email: 'email', phone: 'phone', company: 'company',
        projectType: 'project_type', budget: 'budget', timeline: 'timeline',
        description: 'description', status: 'status',
      };
      const sets = [];
      const values = [];
      let idx = 1;
      for (const [field, column] of Object.entries(colByField)) {
        if (req.body[field] !== undefined) {
          sets.push(`${column} = $${idx++}`);
          values.push(req.body[field]);
        }
      }
      if (sets.length === 0) {
        return res.status(400).json({ error: '수정할 항목이 없습니다.' });
      }
      sets.push(`updated_at = $${idx++}`);
      values.push(new Date().toISOString());
      values.push(req.params.id);
      const q = `UPDATE inquiries SET ${sets.join(', ')} WHERE id = $${idx} RETURNING *`;
      const result = await pgPool.query(q, values);
      if (result.rows.length === 0) return res.status(404).json({ error: '문의를 찾을 수 없습니다.' });
      return res.json(rowToInquiry(result.rows[0]));
    }
    // File fallback
    const inquiries = readData('inquiries');
    const i = inquiries.findIndex(inq => inq.id === req.params.id);
    if (i === -1) return res.status(404).json({ error: '문의를 찾을 수 없습니다.' });
    inquiries[i] = { ...inquiries[i], ...req.body, updatedAt: new Date().toISOString() };
    writeData('inquiries', inquiries);
    res.json(inquiries[i]);
  } catch (e) {
    console.error('[inquiry.update] failed:', e.message);
    res.status(500).json({ error: '문의 수정 중 오류가 발생했습니다.' });
  }
});

// ========== GitHub Stats ==========
app.get('/api/github/stats', async (req, res) => {
  try {
    const headers = { 'User-Agent': 'devvibe', 'Accept': 'application/vnd.github+json' };
    const [userResp, reposResp] = await Promise.all([
      fetch(`https://api.github.com/users/${GITHUB_USERNAME}`, { headers }),
      fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated`, { headers }),
    ]);
    if (!userResp.ok) throw new Error(`GitHub ${userResp.status}`);
    const data = await userResp.json();
    const repos = reposResp.ok ? await reposResp.json() : [];
    const totalStars = repos.reduce((s, r) => s + (r.stargazers_count || 0), 0);
    const totalForks = repos.reduce((s, r) => s + (r.forks_count || 0), 0);
    const langCount = {};
    repos.forEach(r => { if (r.language) langCount[r.language] = (langCount[r.language] || 0) + 1; });
    const totalLangCount = Object.values(langCount).reduce((a, b) => a + b, 0) || 1;
    const topLanguages = Object.entries(langCount)
      .map(([name, count]) => ({ name, count, percent: Math.round(count / totalLangCount * 1000) / 10 }))
      .sort((a, b) => b.count - a.count).slice(0, 8);
    const topRepos = repos.filter(r => !r.fork)
      .sort((a, b) => (b.stargazers_count - a.stargazers_count) || (new Date(b.updated_at) - new Date(a.updated_at)))
      .slice(0, 4)
      .map(r => ({ name: r.name, description: r.description, url: r.html_url, stars: r.stargazers_count, forks: r.forks_count, language: r.language }));

    res.json({
      username: data.login, name: data.name, avatar: data.avatar_url, bio: data.bio,
      publicRepos: data.public_repos, followers: data.followers, following: data.following, url: data.html_url,
      totalStars, totalForks, topLanguages, topRepos,
      contributionGraph: `https://ghchart.rshah.org/6366f1/${GITHUB_USERNAME}`,
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ========== Blog RSS ==========
app.get('/api/blog/posts', async (req, res) => {
  try {
    const feed = await rssParser.parseURL(`https://rss.blog.naver.com/${NAVER_BLOG_ID}.xml`);
    const posts = (feed.items || []).slice(0, 6).map(item => ({
      title: item.title, link: item.link, pubDate: item.pubDate,
      contentSnippet: (item.contentSnippet || '').slice(0, 140),
      categories: item.categories || [],
    }));
    res.json({ blogTitle: feed.title || '', posts });
  } catch (e) {
    res.status(500).json({ error: e.message, posts: [] });
  }
});

// ========== Notifications (Email + Webhook) ==========
async function notifyNewInquiry(inq) {
  const summary = [
    `📩 새 프로젝트 문의가 접수되었습니다!`, ``,
    `이름:     ${inq.name}`,
    `이메일:   ${inq.email}`,
    inq.phone ? `연락처:   ${inq.phone}` : '',
    inq.company ? `회사:     ${inq.company}` : '',
    `프로젝트: ${inq.projectType}`,
    inq.budget ? `예산:     ${inq.budget}` : '',
    inq.timeline ? `일정:     ${inq.timeline}` : '',
    ``, `[프로젝트 설명]`,
    inq.description,
  ].filter(Boolean).join('\n');

  // 1) Webhook (Discord/Slack)
  if (NOTIFY_WEBHOOK_URL) {
    try {
      await fetch(NOTIFY_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: summary, text: summary }),
      });
    } catch (e) { console.error('[webhook]', e.message); }
  }

  // 2) Email
  if (mailTransporter) {
    try {
      await mailTransporter.sendMail({
        from: `"Dev.Vibe 문의 알림" <${EMAIL_USER}>`,
        to: NOTIFY_EMAIL_TO,
        replyTo: inq.email,
        subject: `📩 [Dev.Vibe] ${inq.name}님의 새 프로젝트 문의 — ${inq.projectType}`,
        text: summary,
        html: buildInquiryEmailHTML(inq),
      });
      console.log(`[email] sent → ${NOTIFY_EMAIL_TO}`);
    } catch (e) { console.error('[email]', e.message); }
  }
}

function buildInquiryEmailHTML(inq) {
  const esc = (s) => String(s || '').replace(/[&<>"']/g, c =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const row = (label, value) => value
    ? `<tr><td style="padding:8px 14px;color:#6a7080;font-size:12px;font-weight:600;background:#fafbff;border-bottom:1px solid #f0f0f5;width:110px;letter-spacing:0.5px;">${label}</td>
       <td style="padding:8px 14px;color:#1a1a1a;font-size:14px;border-bottom:1px solid #f0f0f5;">${esc(value)}</td></tr>`
    : '';
  return `<!DOCTYPE html>
<html><body style="margin:0;padding:24px;background:#f0f2f8;font-family:'Apple SD Gothic Neo',sans-serif;">
  <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 8px 24px rgba(0,0,0,0.06);">
    <div style="background:linear-gradient(135deg,#6366f1,#8b5cf6);padding:24px 28px;color:white;">
      <div style="font-size:12px;letter-spacing:2px;opacity:0.85;font-weight:700;">DEV.VIBE NOTIFICATION</div>
      <div style="font-size:22px;font-weight:800;margin-top:4px;">📩 새 프로젝트 문의 접수</div>
    </div>
    <table style="width:100%;border-collapse:collapse;">
      ${row('이름', inq.name)}
      ${row('이메일', inq.email)}
      ${row('연락처', inq.phone)}
      ${row('회사', inq.company)}
      ${row('프로젝트 유형', inq.projectType)}
      ${row('예산', inq.budget)}
      ${row('일정', inq.timeline)}
    </table>
    <div style="padding:18px 28px;">
      <div style="font-size:12px;letter-spacing:1.5px;color:#6a7080;font-weight:700;margin-bottom:10px;">PROJECT DESCRIPTION</div>
      <div style="background:#fafbff;border:1px solid #f0f0f5;border-radius:8px;padding:14px 16px;font-size:14px;line-height:1.7;color:#333;white-space:pre-wrap;">${esc(inq.description)}</div>
    </div>
    <div style="padding:16px 28px 28px;border-top:1px solid #f0f0f5;">
      <a href="mailto:${esc(inq.email)}?subject=Re: ${encodeURIComponent('프로젝트 문의 회신')}"
         style="display:inline-block;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:white;
                padding:11px 22px;border-radius:8px;text-decoration:none;font-weight:700;font-size:13px;">
        💬 답장 보내기
      </a>
      <div style="margin-top:14px;font-size:11px;color:#999;">
        접수 시간: ${new Date(inq.createdAt || Date.now()).toLocaleString('ko-KR')}
      </div>
    </div>
  </div>
</body></html>`;
}

app.listen(PORT, () => {
  console.log(`🚀 Backend server running on port ${PORT}`);
});
