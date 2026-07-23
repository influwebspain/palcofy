const http = require('http');
const tls = require('tls');
const { getTemplateHtml } = require('./app/email-templates.js');

const PORT = 3000;
const SMTP_HOST = 'authsmtp.securemail.pro';
const SMTP_PORT = 465;
const SMTP_USER = 'hola@palcofy.com';
const SMTP_PASS = '@Exito.2027';

function sendSmtpEmail({ to, subject, html, text }) {
  return new Promise((resolve, reject) => {
    const socket = tls.connect(SMTP_PORT, SMTP_HOST, { rejectUnauthorized: false }, () => {
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

const server = http.createServer(async (req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.url === '/api/health' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'ok',
      service: 'PALCOFY Email Service (Native Node TLS/SMTP)',
      smtpHost: SMTP_HOST,
      smtpUser: SMTP_USER,
      timestamp: new Date().toISOString()
    }));
    return;
  }

  if (req.url === '/api/send-email' && req.method === 'POST') {
    let bodyStr = '';
    req.on('data', chunk => { bodyStr += chunk; });
    req.on('end', async () => {
      try {
        const body = JSON.parse(bodyStr || '{}');
        const { to, subject, template, data, html: customHtml, text } = body;

        if (!to) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, error: 'Se requiere destinatario (to).' }));
          return;
        }

        let finalHtml = customHtml;
        let finalSubject = subject;

        if (template) {
          const compiled = getTemplateHtml(template, data || {});
          finalHtml = compiled.html;
          if (!finalSubject) finalSubject = compiled.subject;
        }

        console.log(`📧 Enviando correo por SMTP SSL (authsmtp.securemail.pro:465) a: ${to}...`);
        const result = await sendSmtpEmail({
          to,
          subject: finalSubject || 'Notificación de PALCOFY',
          html: finalHtml,
          text
        });

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, result }));
      } catch (err) {
        console.error('❌ Error en envío SMTP:', err.message);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: err.message }));
      }
    });
    return;
  }

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Endpoint no encontrado' }));
});

server.listen(PORT, () => {
  console.log(`🚀 Servidor de Correos Nativo PALCOFY activo en http://localhost:${PORT}`);
  console.log(`📡 SMTP configurado en authsmtp.securemail.pro:465 SSL para hola@palcofy.com`);
});
