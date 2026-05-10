require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');
const Parser = require('rss-parser');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3001;

// Config (env override possible)
const GITHUB_USERNAME = process.env.GITHUB_USERNAME || 'JIHOJ-U';
const NAVER_BLOG_ID = process.env.NAVER_BLOG_ID || 'longnight0719';
const NOTIFY_WEBHOOK_URL = process.env.NOTIFY_WEBHOOK_URL || '';
// Comma-separated list of allowed origins; empty = allow all (dev)
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean);

const rssParser = new Parser();

// CORS — production: restrict to ALLOWED_ORIGINS; dev: allow all
const corsOptions = ALLOWED_ORIGINS.length
  ? {
      origin: (origin, cb) => {
        if (!origin) return cb(null, true); // server-to-server, mobile etc.
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

// Health check (Render uses this)
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime(), timestamp: new Date().toISOString() });
});

// Ensure directories exist
const dirs = ['uploads', 'data'];
dirs.forEach(dir => {
  const dirPath = path.join(__dirname, dir);
  if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
});

// File storage for portfolio images
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${uuidv4()}${ext}`);
  }
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
  }
});

// JSON file helpers
const DATA_DIR = path.join(__dirname, 'data');
const getFilePath = (name) => path.join(DATA_DIR, `${name}.json`);

function readData(name) {
  const filePath = getFilePath(name);
  if (!fs.existsSync(filePath)) return [];
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

function writeData(name, data) {
  fs.writeFileSync(getFilePath(name), JSON.stringify(data, null, 2), 'utf-8');
}

// ========== Portfolio API ==========

// Get all portfolios
app.get('/api/portfolios', (req, res) => {
  const portfolios = readData('portfolios');
  res.json(portfolios);
});

// Get single portfolio
app.get('/api/portfolios/:id', (req, res) => {
  const portfolios = readData('portfolios');
  const item = portfolios.find(p => p.id === req.params.id);
  if (!item) return res.status(404).json({ error: '포트폴리오를 찾을 수 없습니다.' });
  res.json(item);
});

const portfolioUpload = upload.fields([
  { name: 'thumbnail', maxCount: 1 },
  { name: 'images', maxCount: 20 }
]);

// Create portfolio
app.post('/api/portfolios', portfolioUpload, (req, res) => {
  const portfolios = readData('portfolios');
  const { title, description, techStack, projectUrl, githubUrl, demoUrl, category, duration, client } = req.body;
  const thumbnailFile = req.files?.thumbnail?.[0];
  const imageFiles = req.files?.images || [];

  const newPortfolio = {
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
    updatedAt: new Date().toISOString()
  };

  portfolios.unshift(newPortfolio);
  writeData('portfolios', portfolios);
  res.status(201).json(newPortfolio);
});

// Update portfolio
app.put('/api/portfolios/:id', portfolioUpload, (req, res) => {
  const portfolios = readData('portfolios');
  const index = portfolios.findIndex(p => p.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: '포트폴리오를 찾을 수 없습니다.' });

  const { title, description, techStack, projectUrl, githubUrl, demoUrl, category, duration, client, existingImages } = req.body;
  const thumbnailFile = req.files?.thumbnail?.[0];
  const imageFiles = req.files?.images || [];

  let mergedImages = portfolios[index].images || [];
  if (existingImages !== undefined) {
    try { mergedImages = JSON.parse(existingImages); } catch (e) { mergedImages = []; }
  }
  mergedImages = [...mergedImages, ...imageFiles.map(f => `/uploads/${f.filename}`)];

  portfolios[index] = {
    ...portfolios[index],
    title: title || portfolios[index].title,
    description: description || portfolios[index].description,
    techStack: techStack ? techStack.split(',').map(s => s.trim()) : portfolios[index].techStack,
    projectUrl: projectUrl !== undefined ? projectUrl : portfolios[index].projectUrl,
    githubUrl: githubUrl !== undefined ? githubUrl : portfolios[index].githubUrl,
    demoUrl: demoUrl !== undefined ? demoUrl : (portfolios[index].demoUrl || ''),
    category: category || portfolios[index].category,
    duration: duration || portfolios[index].duration,
    client: client || portfolios[index].client,
    thumbnail: thumbnailFile ? `/uploads/${thumbnailFile.filename}` : portfolios[index].thumbnail,
    images: mergedImages,
    updatedAt: new Date().toISOString()
  };

  writeData('portfolios', portfolios);
  res.json(portfolios[index]);
});

// Delete portfolio
app.delete('/api/portfolios/:id', (req, res) => {
  let portfolios = readData('portfolios');
  const item = portfolios.find(p => p.id === req.params.id);
  if (!item) return res.status(404).json({ error: '포트폴리오를 찾을 수 없습니다.' });

  if (item.thumbnail && !item.thumbnail.startsWith('http')) {
    const filePath = path.join(__dirname, item.thumbnail);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  }
  if (Array.isArray(item.images)) {
    item.images.forEach(img => {
      if (img && !img.startsWith('http')) {
        const filePath = path.join(__dirname, img);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      }
    });
  }

  portfolios = portfolios.filter(p => p.id !== req.params.id);
  writeData('portfolios', portfolios);
  res.json({ message: '삭제되었습니다.' });
});

// ========== Contact / Inquiry API ==========

// Submit inquiry
app.post('/api/inquiries', async (req, res) => {
  const inquiries = readData('inquiries');
  const { name, email, phone, company, projectType, budget, timeline, description } = req.body;

  if (!name || !email || !description) {
    return res.status(400).json({ error: '이름, 이메일, 프로젝트 설명은 필수입니다.' });
  }

  const newInquiry = {
    id: uuidv4(),
    name, email,
    phone: phone || '',
    company: company || '',
    projectType: projectType || '웹 개발',
    budget: budget || '',
    timeline: timeline || '',
    description,
    status: '접수됨',
    createdAt: new Date().toISOString()
  };

  inquiries.unshift(newInquiry);
  writeData('inquiries', inquiries);

  // Notify via webhook (Discord/Slack/custom)
  notifyNewInquiry(newInquiry).catch(err => console.error('[notify] failed:', err.message));

  res.status(201).json({ message: '문의가 접수되었습니다.', inquiry: newInquiry });
});

// ========== GitHub Stats Proxy ==========
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

    // Compute stars + language stats from repos
    const totalStars = repos.reduce((sum, r) => sum + (r.stargazers_count || 0), 0);
    const totalForks = repos.reduce((sum, r) => sum + (r.forks_count || 0), 0);
    const langCount = {};
    repos.forEach(r => {
      if (r.language) langCount[r.language] = (langCount[r.language] || 0) + 1;
    });
    const totalLangCount = Object.values(langCount).reduce((a, b) => a + b, 0) || 1;
    const topLanguages = Object.entries(langCount)
      .map(([name, count]) => ({ name, count, percent: Math.round(count / totalLangCount * 1000) / 10 }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);

    const topRepos = repos
      .filter(r => !r.fork)
      .sort((a, b) => (b.stargazers_count - a.stargazers_count) || (new Date(b.updated_at) - new Date(a.updated_at)))
      .slice(0, 4)
      .map(r => ({
        name: r.name,
        description: r.description,
        url: r.html_url,
        stars: r.stargazers_count,
        forks: r.forks_count,
        language: r.language,
      }));

    res.json({
      username: data.login,
      name: data.name,
      avatar: data.avatar_url,
      bio: data.bio,
      publicRepos: data.public_repos,
      followers: data.followers,
      following: data.following,
      url: data.html_url,
      totalStars,
      totalForks,
      topLanguages,
      topRepos,
      contributionGraph: `https://ghchart.rshah.org/6366f1/${GITHUB_USERNAME}`,
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ========== Naver Blog RSS Proxy ==========
app.get('/api/blog/posts', async (req, res) => {
  try {
    const feed = await rssParser.parseURL(`https://rss.blog.naver.com/${NAVER_BLOG_ID}.xml`);
    const posts = (feed.items || []).slice(0, 6).map(item => ({
      title: item.title,
      link: item.link,
      pubDate: item.pubDate,
      contentSnippet: (item.contentSnippet || '').slice(0, 140),
      categories: item.categories || [],
    }));
    res.json({ blogTitle: feed.title || '', posts });
  } catch (e) {
    res.status(500).json({ error: e.message, posts: [] });
  }
});

// ========== Notification helper ==========
async function notifyNewInquiry(inq) {
  if (!NOTIFY_WEBHOOK_URL) return;
  const lines = [
    `📩 **새 프로젝트 문의가 접수되었습니다!**`,
    ``,
    `**이름:** ${inq.name}`,
    `**이메일:** ${inq.email}`,
    inq.phone ? `**연락처:** ${inq.phone}` : '',
    inq.company ? `**회사:** ${inq.company}` : '',
    `**프로젝트 유형:** ${inq.projectType}`,
    inq.budget ? `**예산:** ${inq.budget}` : '',
    inq.timeline ? `**일정:** ${inq.timeline}` : '',
    ``,
    `**설명:**`,
    inq.description.slice(0, 400) + (inq.description.length > 400 ? '...' : ''),
  ].filter(Boolean).join('\n');

  // Discord-style payload (also works for many webhooks)
  const payload = {
    content: lines,
    text: lines, // Slack-style fallback
  };

  await fetch(NOTIFY_WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

// Get all inquiries (admin)
app.get('/api/inquiries', (req, res) => {
  const inquiries = readData('inquiries');
  res.json(inquiries);
});

// Update inquiry status
app.patch('/api/inquiries/:id', (req, res) => {
  const inquiries = readData('inquiries');
  const index = inquiries.findIndex(i => i.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: '문의를 찾을 수 없습니다.' });

  inquiries[index] = { ...inquiries[index], ...req.body, updatedAt: new Date().toISOString() };
  writeData('inquiries', inquiries);
  res.json(inquiries[index]);
});

app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
});
