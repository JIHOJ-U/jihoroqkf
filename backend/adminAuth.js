// Admin authentication for write/PII endpoints.
//
// The admin key lives ONLY in the server environment (ADMIN_KEY on Render).
// It is never shipped in the frontend bundle. The admin page sends whatever
// the operator typed in the `x-admin-key` header and the server compares it
// in constant time. If ADMIN_KEY is unset or too short, every admin endpoint
// fails closed with 503 instead of silently allowing access.
const crypto = require('crypto');

const MIN_KEY_LENGTH = 16;
const ADMIN_KEY = process.env.ADMIN_KEY || '';
const adminEnabled = ADMIN_KEY.length >= MIN_KEY_LENGTH;

if (!adminEnabled) {
  console.warn(`[admin] ADMIN_KEY missing or shorter than ${MIN_KEY_LENGTH} chars — admin endpoints are disabled`);
}

const digest = (s) => crypto.createHash('sha256').update(String(s)).digest();

function keyMatches(candidate) {
  if (!adminEnabled || typeof candidate !== 'string' || !candidate) return false;
  return crypto.timingSafeEqual(digest(candidate), digest(ADMIN_KEY));
}

// Brute-force guard: per-IP failed attempts in a sliding window.
const FAIL_WINDOW_MS = 15 * 60 * 1000;
const MAX_FAILS = 10;
const failures = new Map();

function recentFailures(ip) {
  const cutoff = Date.now() - FAIL_WINDOW_MS;
  const list = (failures.get(ip) || []).filter((t) => t > cutoff);
  if (list.length) failures.set(ip, list);
  else failures.delete(ip);
  return list;
}

function requireAdmin(req, res, next) {
  if (!adminEnabled) {
    return res.status(503).json({ error: '관리자 기능이 설정되지 않았습니다.' });
  }
  const ip = req.ip;
  if (recentFailures(ip).length >= MAX_FAILS) {
    return res.status(429).json({ error: '시도 횟수가 너무 많습니다. 잠시 후 다시 시도해주세요.' });
  }
  if (!keyMatches(req.get('x-admin-key'))) {
    failures.set(ip, [...recentFailures(ip), Date.now()]);
    return res.status(401).json({ error: '인증이 필요합니다.' });
  }
  return next();
}

module.exports = { requireAdmin };
