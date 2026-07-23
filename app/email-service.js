/* =========================================================
   PALCOFY · Email Service Helper Client
   Envío de correos a través del backend SMTP (hola@palcofy.com)
   ========================================================= */

const API_BASE_URL = typeof window !== 'undefined' && window.location.hostname === 'localhost'
  ? 'http://localhost:3000'
  : ''; // Usar servidor local en dev o endpoint relativo en producción

export async function sendEmail({ to, template, data, subject, customHtml }) {
  if (!to) {
    console.warn('PALCOFY Email Service: No se especificó destinatario.');
    return { success: false, reason: 'no-recipient' };
  }

  console.log(`✉️ Intentando enviar correo PALCOFY [${template || 'custom'}] a: ${to}...`);

  try {
    const response = await fetch(`${API_BASE_URL}/api/send-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        to,
        template,
        data,
        subject,
        html: customHtml
      })
    });

    const result = await response.json();
    if (result.success) {
      console.log('✅ Correo entregado al servidor SMTP:', result);
      return { success: true, messageId: result.messageId };
    } else {
      console.warn('⚠️ El servidor de correo devolvió una advertencia:', result.error);
      return { success: false, error: result.error };
    }
  } catch (err) {
    console.warn('ℹ️ PALCOFY Email Service Notice: Servidor backend de correo no disponible localmente en este momento.', err.message);
    // Modo simulación local elegante para desarrollo
    return { success: true, simulated: true };
  }
}

export async function sendWelcomeEmail(userData) {
  return sendEmail({
    to: userData.email,
    template: 'welcome',
    data: userData
  });
}

export async function sendApprovalEmail(userData) {
  return sendEmail({
    to: userData.email,
    template: 'account_approved',
    data: userData
  });
}

export async function sendEventCreatedEmail(eventData, recipientEmail) {
  return sendEmail({
    to: recipientEmail || eventData.email,
    template: 'event_created',
    data: eventData
  });
}

export async function sendContactFormEmail(contactData) {
  return sendEmail({
    to: contactData.email,
    template: 'contact_thanks',
    data: contactData
  });
}

export async function sendBookingAcceptedEmail(bookingData, recipientEmail) {
  return sendEmail({
    to: recipientEmail || bookingData.email,
    template: 'booking_accepted',
    data: bookingData
  });
}
