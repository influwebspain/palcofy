/* =========================================================
   PALCOFY · Plantillas de Correo Electrónico HTML
   ========================================================= */

const BRAND_COLOR_PRIMARY = '#7c3aed';
const BRAND_COLOR_GOLD    = '#f59e0b';
const BRAND_BG_DARK       = '#0f172a';

function baseLayout(title, contentHtml) {
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #090d16;
      font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #e2e8f0;
      -webkit-font-smoothing: antialiased;
    }
    .wrapper {
      width: 100%;
      background-color: #090d16;
      padding: 40px 10px;
    }
    .main-card {
      max-width: 600px;
      margin: 0 auto;
      background: #1e293b;
      border-radius: 16px;
      overflow: hidden;
      border: 1px solid rgba(255, 255, 255, 0.1);
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.5);
    }
    .header {
      background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #311042 100%);
      padding: 36px 32px;
      text-align: center;
      border-bottom: 2px solid ${BRAND_COLOR_GOLD};
    }
    .logo-badge {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 12px;
    }
    .logo-icon {
      width: 38px;
      height: 38px;
      background: linear-gradient(135deg, ${BRAND_COLOR_PRIMARY}, ${BRAND_COLOR_GOLD});
      border-radius: 10px;
      display: inline-block;
      line-height: 38px;
      color: white;
      font-weight: 900;
      font-size: 20px;
      text-align: center;
    }
    .brand-title {
      font-size: 26px;
      font-weight: 900;
      letter-spacing: 2px;
      color: #ffffff;
      margin: 0;
    }
    .header-sub {
      color: #94a3b8;
      font-size: 13px;
      margin-top: 6px;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .body-content {
      padding: 36px 32px;
      font-size: 15px;
      line-height: 1.6;
      color: #cbd5e1;
    }
    h2 {
      color: #ffffff;
      font-size: 22px;
      margin-top: 0;
      margin-bottom: 16px;
      font-weight: 700;
    }
    p {
      margin-top: 0;
      margin-bottom: 16px;
    }
    .highlight-box {
      background: rgba(124, 58, 237, 0.1);
      border-left: 4px solid ${BRAND_COLOR_PRIMARY};
      padding: 16px 20px;
      border-radius: 0 8px 8px 0;
      margin: 24px 0;
    }
    .info-table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
      background: rgba(15, 23, 42, 0.6);
      border-radius: 8px;
      overflow: hidden;
    }
    .info-table td {
      padding: 12px 16px;
      border-bottom: 1px solid rgba(255,255,255,0.05);
      font-size: 14px;
    }
    .info-table td.label {
      color: #94a3b8;
      width: 40%;
      font-weight: 600;
    }
    .info-table td.value {
      color: #ffffff;
      font-weight: 700;
    }
    .btn-container {
      text-align: center;
      margin: 32px 0 16px 0;
    }
    .btn {
      display: inline-block;
      padding: 14px 32px;
      background: linear-gradient(135deg, ${BRAND_COLOR_PRIMARY}, #9333ea);
      color: #ffffff !important;
      text-decoration: none;
      font-weight: 700;
      font-size: 15px;
      border-radius: 8px;
      box-shadow: 0 4px 14px rgba(124, 58, 237, 0.4);
    }
    .footer {
      background: #0f172a;
      padding: 24px 32px;
      text-align: center;
      font-size: 13px;
      color: #64748b;
      border-top: 1px solid rgba(255,255,255,0.05);
    }
    .footer a {
      color: ${BRAND_COLOR_GOLD};
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="main-card">
      <div class="header">
        <div class="logo-badge">
          <div class="logo-icon">P</div>
          <span class="brand-title">PALCOFY</span>
        </div>
        <div class="header-sub">Música en vivo B2B para Hoteles & Recintos</div>
      </div>

      <div class="body-content">
        ${contentHtml}
      </div>

      <div class="footer">
        <p>© ${new Date().getFullYear()} PALCOFY. Todos los derechos reservados.</p>
        <p>¿Tienes alguna duda? Escríbenos a <a href="mailto:hola@palcofy.com">hola@palcofy.com</a></p>
      </div>
    </div>
  </div>
</body>
</html>`;
}

export function getTemplateHtml(templateName, data = {}) {
  const userName = data.name || data.venueName || data.email ? (data.name || data.venueName || data.email.split('@')[0]) : 'Usuario';
  const roleName = data.role === 'artist' ? 'Cantante / Artista' : 'Hotel / Recinto';

  switch (templateName) {
    case 'welcome':
      return {
        subject: '¡Bienvenido a PALCOFY! Hemos recibido tu solicitud de registro',
        html: baseLayout('Bienvenido a PALCOFY', `
          <h2>¡Hola, ${userName}! 👋</h2>
          <p>Muchas gracias por registrarte en <strong>PALCOFY</strong> como <strong>${roleName}</strong>.</p>
          <div class="highlight-box">
            <strong style="color: ${BRAND_COLOR_GOLD}; font-size:16px;">⏳ Tu solicitud está en proceso de revisión</strong><br>
            <span style="font-size:14px; color:#cbd5e1;">Para garantizar la máxima calidad en la red B2B, nuestro equipo revisará tus datos. Te enviaremos un correo tan pronto como tu cuenta esté activada.</span>
          </div>
          <p>En PALCOFY podrás gestionar contrataciones de música en vivo, convocatorias, facturación unificada y pagos garantizados.</p>
          <table class="info-table">
            <tr>
              <td class="label">Nombre de usuario</td>
              <td class="value">${userName}</td>
            </tr>
            <tr>
              <td class="label">Email de contacto</td>
              <td class="value">${data.email || '—'}</td>
            </tr>
            <tr>
              <td class="label">Perfil registrado</td>
              <td class="value">${roleName}</td>
            </tr>
          </table>
          <p>Si necesitas añadir información adicional a tu expediente, no dudes en responder a este correo.</p>
          <div class="btn-container">
            <a href="https://palcofy.com" class="btn">Visitar PALCOFY</a>
          </div>
        `)
      };

    case 'account_approved':
      return {
        subject: '🎉 ¡Tu cuenta en PALCOFY ha sido aprobada con éxito!',
        html: baseLayout('Cuenta Aprobada', `
          <h2>¡Buenas noticias, ${userName}! 🚀</h2>
          <p>Nos alegra informarte de que tu cuenta de <strong>${roleName}</strong> ha sido verificada y <strong>aprobada oficialmente</strong> por el equipo de administración de PALCOFY.</p>
          <div class="highlight-box" style="border-left-color: #10b981; background: rgba(16, 185, 129, 0.1);">
            <strong style="color: #34d399; font-size:16px;">✅ Cuenta totalmente activa y verificada</strong><br>
            <span style="font-size:14px;">Ya tienes acceso completo a todas las herramientas de la plataforma.</span>
          </div>
          <p>A partir de este momento puedes acceder a tu panel de control, publicar convocatorias, gestionar reservas y conectar con los mejores profesionales del sector.</p>
          <div class="btn-container">
            <a href="https://palcofy.com/app/login.html" class="btn" style="background: linear-gradient(135deg, #10b981, #059669); box-shadow: 0 4px 14px rgba(16, 185, 129, 0.4);">Acceder a Mi Cuenta</a>
          </div>
        `)
      };

    case 'event_created':
      return {
        subject: `📅 Nuevo Evento Programado: ${data.eventTitle || 'Actuación Musical PALCOFY'}`,
        html: baseLayout('Evento Creado', `
          <h2>¡Nuevo Evento Registrado! 🎶</h2>
          <p>Hola <strong>${userName}</strong>, se ha creado o actualizado un evento en la plataforma PALCOFY.</p>
          <table class="info-table">
            <tr>
              <td class="label">Evento / Convocatoria</td>
              <td class="value">${data.eventTitle || 'Actuación en vivo'}</td>
            </tr>
            <tr>
              <td class="label">Fecha y Hora</td>
              <td class="value">${data.date || 'Por determinar'} ${data.time ? '· ' + data.time : ''}</td>
            </tr>
            <tr>
              <td class="label">Lugar / Recinto</td>
              <td class="value">${data.venueName || 'Recinto verificado'}</td>
            </tr>
            <tr>
              <td class="label">Caché / Presupuesto</td>
              <td class="value" style="color:${BRAND_COLOR_GOLD}">${data.cache ? data.cache + ' €' : 'Según tarifa acordada'}</td>
            </tr>
          </table>
          <p>Puedes consultar la ficha completa del evento y su estado de confirmación desde tu calendario interactivo.</p>
          <div class="btn-container">
            <a href="https://palcofy.com/app/calendar.html" class="btn">Ver en Mi Calendario</a>
          </div>
        `)
      };

    case 'contact_thanks':
      return {
        subject: '✉️ Hemos recibido tu mensaje en PALCOFY',
        html: baseLayout('Acuse de Recibo', `
          <h2>¡Gracias por contactar con nosotros, ${userName}!</h2>
          <p>Hemos recibido tu consulta a través de nuestro formulario de contacto en PALCOFY. Un asesor de nuestro equipo la revisará y te responderá a la brevedad posible.</p>
          <div class="highlight-box">
            <strong>Resumen de tu mensaje:</strong><br>
            <em style="color:#e2e8f0; display:block; margin-top:8px;">"${data.message || 'Sin mensaje de texto'}"</em>
          </div>
          <p>Si la consulta requiere atención urgente, puedes responder directamente a este correo (<strong>hola@palcofy.com</strong>).</p>
        `)
      };

    case 'booking_accepted':
      return {
        subject: '🤝 ¡Propuesta Aceptada! Confirmación de Actuación Musical',
        html: baseLayout('Propuesta Aceptada', `
          <h2>¡Enhorabuena, ${userName}! 🎉</h2>
          <p>Tu postulación/propuesta para la actuación musical ha sido <strong>aceptada con éxito</strong>.</p>
          <table class="info-table">
            <tr>
              <td class="label">Artista / Grupo</td>
              <td class="value">${data.artistName || userName}</td>
            </tr>
            <tr>
              <td class="label">Hotel / Recinto</td>
              <td class="value">${data.venueName || 'Hotel asociado'}</td>
            </tr>
            <tr>
              <td class="label">Fecha</td>
              <td class="value">${data.date || 'Fecha programada'}</td>
            </tr>
          </table>
          <p>El contrato y el depósito escrow se han generado automáticamente para tu seguridad de cobro.</p>
          <div class="btn-container">
            <a href="https://palcofy.com/app/performances.html" class="btn">Ver Detalles del Show</a>
          </div>
        `)
      };

    default:
      return {
        subject: 'Notificación de PALCOFY',
        html: baseLayout('Notificación', `
          <h2>Hola, ${userName}</h2>
          <p>${data.message || 'Tienes una nueva notificación en PALCOFY.'}</p>
        `)
      };
  }
}
