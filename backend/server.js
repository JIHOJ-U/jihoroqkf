const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

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

// Create portfolio
app.post('/api/portfolios', upload.single('thumbnail'), (req, res) => {
  const portfolios = readData('portfolios');
  const { title, description, techStack, projectUrl, githubUrl, category, duration, client } = req.body;

  const newPortfolio = {
    id: uuidv4(),
    title,
    description,
    techStack: techStack ? techStack.split(',').map(s => s.trim()) : [],
    projectUrl: projectUrl || '',
    githubUrl: githubUrl || '',
    category: category || '웹 개발',
    duration: duration || '',
    client: client || '',
    thumbnail: req.file ? `/uploads/${req.file.filename}` : '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  portfolios.unshift(newPortfolio);
  writeData('portfolios', portfolios);
  res.status(201).json(newPortfolio);
});

// Update portfolio
app.put('/api/portfolios/:id', upload.single('thumbnail'), (req, res) => {
  const portfolios = readData('portfolios');
  const index = portfolios.findIndex(p => p.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: '포트폴리오를 찾을 수 없습니다.' });

  const { title, description, techStack, projectUrl, githubUrl, category, duration, client } = req.body;

  portfolios[index] = {
    ...portfolios[index],
    title: title || portfolios[index].title,
    description: description || portfolios[index].description,
    techStack: techStack ? techStack.split(',').map(s => s.trim()) : portfolios[index].techStack,
    projectUrl: projectUrl !== undefined ? projectUrl : portfolios[index].projectUrl,
    githubUrl: githubUrl !== undefined ? githubUrl : portfolios[index].githubUrl,
    category: category || portfolios[index].category,
    duration: duration || portfolios[index].duration,
    client: client || portfolios[index].client,
    thumbnail: req.file ? `/uploads/${req.file.filename}` : portfolios[index].thumbnail,
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

  // Delete thumbnail file
  if (item.thumbnail) {
    const filePath = path.join(__dirname, item.thumbnail);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  }

  portfolios = portfolios.filter(p => p.id !== req.params.id);
  writeData('portfolios', portfolios);
  res.json({ message: '삭제되었습니다.' });
});

// ========== Contact / Inquiry API ==========

// Submit inquiry
app.post('/api/inquiries', (req, res) => {
  const inquiries = readData('inquiries');
  const { name, email, phone, company, projectType, budget, timeline, description } = req.body;

  if (!name || !email || !description) {
    return res.status(400).json({ error: '이름, 이메일, 프로젝트 설명은 필수입니다.' });
  }

  const newInquiry = {
    id: uuidv4(),
    name,
    email,
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
  res.status(201).json({ message: '문의가 접수되었습니다.', inquiry: newInquiry });
});

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
