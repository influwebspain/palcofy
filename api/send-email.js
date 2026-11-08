require('dotenv').config();
const tls = require('tls');
const { getTemplateHtml } = require('../app/email-templates.js');
const {
  applySecurityHeaders, isAllowedOrigin, checkRateLimit,
  validateEmailRequest, safeError
} = require('./email-security.cjs');

const SMTP_HOST = process.env.SMTP_HOST || 'authsmtp.securemail.pro';
const SMTP_PORT = Number(process.env.SMTP_PORT) || 465;
const SMTP_USER = process.env.SMTP_USER || '';
const SMTP_PASS = process.env.SMTP_PASS || '';

function sendSmtpEmail({ to, subject, html, text }) {
  return new Promise((resolve, reject) => {
    const socket = tls.connect(SMTP_PORT, SMTP_HOST, { rejectUnauthorized: true, servername: SMTP_HOST, timeout: 10_000 }, () => {
      // Socket conectado por SSL/TLS
    });

    let step = 0;
    let responseBuffer = '';

    const userB64 = Buffer.from(SMTP_USER).toString('base64');
    const passB64 = Buffer.from(SMTP_PASS).toString('base64');

    socket.on('data', (data) => {
      responseBuffer += data.toString();
      const lines = responseBuffer.split('\r\n');
      const lastLine = lines[lines.length - 2] || lines[lines.length - 1];

      // Esperar códigos de estado SMTP
      if (/^\d{3}[ -]/.test(lastLine)) {
        const code = parseInt(lastLine.slice(0, 3), 10);

        if (step === 0 && code === 220) {
          step = 1;
          socket.write('EHLO palcofy.com\r\n');
        } else if (step === 1 && code === 250) {
          step = 2;
          socket.write('AUTH LOGIN\r\n');
        } else if (step === 2 && code === 334) {
          step = 3;
          socket.write(userB64 + '\r\n');
        } else if (step === 3 && code === 334) {
          step = 4;
          socket.write(passB64 + '\r\n');
        } else if (step === 4 && code === 235) {
          step = 5;
          socket.write(`MAIL FROM:<${SMTP_USER}>\r\n`);
        } else if (step === 5 && code === 250) {
          step = 6;
          socket.write(`RCPT TO:<${to}>\r\n`);
        } else if (step === 6 && code === 250) {
          step = 7;
          socket.write('DATA\r\n');
        } else if (step === 7 && code === 354) {
          step = 8;
          const mimeMessage = [
            `From: "PALCOFY" <${SMTP_USER}>`,
            `To: <${to}>`,
            `Subject: =?UTF-8?B?${Buffer.from(subject).toString('base64')}?=`,
            'MIME-Version: 1.0',
            'Content-Type: text/html; charset=UTF-8',
            'Content-Transfer-Encoding: 8bit',
            '',
            html || text || '',
            '\r\n.'
          ].join('\r\n');
          socket.write(mimeMessage + '\r\n');
        } else if (step === 8 && code === 250) {
          step = 9;
          socket.write('QUIT\r\n');
          socket.end();
          resolve({ success: true, message: 'Correo enviado correctamente por SMTP' });
        } else if (code >= 400) {
          socket.end();
          reject(new Error(`SMTP Error ${code}: ${lastLine}`));
        }
      }
    });

    socket.on('error', (err) => {
      reject(err);
    });
  });
}

module.exports = async (req, res) => {
  const origin = req.headers.origin;
  applySecurityHeaders(res, origin);
  if (!isAllowedOrigin(origin)) return safeError(res, 403);
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return safeError(res, 405);
  if (!checkRateLimit(req)) return safeError(res, 429);

  try {
    const body = req.body || {};
    if (JSON.stringify(body).length > 64 * 1024) return safeError(res, 413);
    const validationError = validateEmailRequest(body);
    if (validationError) return safeError(res, 422);
    const { to, subject, template, data } = body;
    const compiled = getTemplateHtml(template, data || {});
    const result = await sendSmtpEmail({ to, subject: subject || compiled.subject, html: compiled.html });
    return res.status(200).json({ success: true, result: { success: result.success } });
  } catch (err) {
    console.error('SMTP delivery failed:', err.message);
    return safeError(res, 500);
  }
};
