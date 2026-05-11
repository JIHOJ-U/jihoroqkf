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
  const inquiries = readData('inquiries');
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
  inquiries.unshift(newInquiry);
  writeData('inquiries', inquiries);
  notifyNewInquiry(newInquiry).catch(err => console.error('[notify] failed:', err.message));
  res.status(201).json({ message: '문의가 접수되었습니다.', inquiry: newInquiry });
});

app.get('/api/inquiries', (req, res) => {
  res.json(readData('inquiries'));
});

app.patch('/api/inquiries/:id', (req, res) => {
  const inquiries = readData('inquiries');
  const idx = inquiries.findIndex(i => i.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: '문의를 찾을 수 없습니다.' });
  inquiries[idx] = { ...inquiries[idx], ...req.body, updatedAt: new Date().toISOString() };
  writeData('inquiries', inquiries);
  res.json(inquiries[idx]);
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
