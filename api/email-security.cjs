const crypto = require('crypto');

const MAX_BODY_BYTES = 64 * 1024;
const MAX_FIELD_LENGTH = 20_000;
const ALLOWED_TEMPLATES = new Set([
  'welcome', 'account_approved', 'booking_requested', 'booking_confirmed',
  'booking_cancelled', 'event_created', 'contact_thanks', 'booking_accepted'
]);
const EMAIL_RE = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/;
const origins = (process.env.ALLOWED_ORIGINS || 'http://localhost:8080,http://localhost:3000,https://palcofy.com,https://www.palcofy.com')
  .split(',').map(value => value.trim()).filter(Boolean);
const attempts = new Map();

function applySecurityHeaders(res, origin) {
  if (origin && origins.includes(origin)) res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'no-referrer');
  res.setHeader('Content-Security-Policy', "default-src 'none'; frame-ancestors 'none'; form-action 'none'");
}

function isAllowedOrigin(origin) { return !origin || origins.includes(origin); }

function clientKey(req) {
  return req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket?.remoteAddress || 'unknown';
}

function checkRateLimit(req) {
  const now = Date.now();
  const key = clientKey(req);
  const recent = (attempts.get(key) || []).filter(timestamp => now - timestamp < 60_000);
  recent.push(now);
  attempts.set(key, recent);
  return recent.length <= 10;
}

function validateEmailRequest(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) return 'Solicitud no válida.';
  const { to, template, subject, data } = body;
  if (typeof to !== 'string' || !EMAIL_RE.test(to) || to.length > 254) return 'Destinatario no válido.';
  if (typeof template !== 'string' || !ALLOWED_TEMPLATES.has(template)) return 'Plantilla no válida.';
  if (subject !== undefined && (typeof subject !== 'string' || subject.length > 180 || /[\r\n]/.test(subject))) return 'Asunto no válido.';
  if (data !== undefined && (typeof data !== 'object' || data === null || Array.isArray(data))) return 'Datos no válidos.';
  if (data && JSON.stringify(data).length > MAX_FIELD_LENGTH) return 'Datos demasiado extensos.';
  return null;
}

function safeError(res, status = 500) {
  const payload = { success: false, error: status >= 500 ? 'No se pudo procesar el correo.' : 'Solicitud no válida.' };
  if (typeof res.status === 'function') return res.status(status).json(payload);
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(payload));
}

function safeJson(res, status, payload) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(payload));
}

module.exports = {
  MAX_BODY_BYTES,
  applySecurityHeaders,
  isAllowedOrigin,
  checkRateLimit,
  validateEmailRequest,
  safeError,
  safeJson
};
