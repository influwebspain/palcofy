/* =========================================================
   PALCOFY · Site behavior
   - Language switcher (ES / EN) with persistence
   - Mobile nav toggle
   - Scroll reveal
   - Active nav highlighting
   - FAQ accordion
   - Contact form validation
   - Smooth scroll for anchor links
   ========================================================= */

(function () {
  'use strict';

  const STORAGE_KEY = 'palcofy.lang';
  const DEFAULT_LANG = 'es';

  /* ----- Language switcher -------------------------------- */
  function getStoredLang() {
    try { return localStorage.getItem(STORAGE_KEY); } catch (e) { return null; }
  }

  function setStoredLang(lang) {
    try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) { /* ignore */ }
  }

  function applyLang(lang) {
    const safe = lang === 'en' ? 'en' : 'es';
    document.documentElement.setAttribute('lang', safe);
    document.documentElement.setAttribute('data-lang', safe);

    // Update meta description
    const meta = document.querySelector('meta[name="description"]');
    if (meta && meta.dataset['es'] && meta.dataset['en']) {
      meta.setAttribute('content', meta.dataset[safe] || meta.content);
    }

    // Update title
    const title = document.querySelector('title');
    if (title && title.dataset['es'] && title.dataset['en']) {
      title.textContent = title.dataset[safe] || title.textContent;
    }

    // Update lang switcher buttons
    document.querySelectorAll('[data-set-lang]').forEach(function (btn) {
      const isActive = btn.getAttribute('data-set-lang') === safe;
      btn.classList.toggle('is-active', isActive);
      btn.setAttribute('aria-pressed', String(isActive));
    });

    // Update select dropdowns with data-es/data-en
    document.querySelectorAll('select[data-es][data-en]').forEach(function (sel) {
      sel.querySelectorAll('option').forEach(function (opt) {
        if (opt.dataset[safe]) {
          opt.textContent = opt.dataset[safe];
        }
      });
    });
  }

  function initLangSwitcher() {
    const stored = getStoredLang();
    const initial = stored === 'en' ? 'en' : DEFAULT_LANG;
    applyLang(initial);

    document.querySelectorAll('[data-set-lang]').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        const lang = btn.getAttribute('data-set-lang');
        applyLang(lang);
        setStoredLang(lang);
      });
    });
  }

  /* ----- Mobile nav --------------------------------------- */
  function initNavToggle() {
    const toggle = document.querySelector('.nav-toggle');
    const nav = document.querySelector('.nav');
    if (!toggle || !nav) return;

    toggle.addEventListener('click', function () {
      const isOpen = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(isOpen));
    });

    // Close on link click (mobile UX)
    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        if (nav.classList.contains('is-open')) {
          nav.classList.remove('is-open');
          toggle.setAttribute('aria-expanded', 'false');
        }
      });
    });
  }

  /* ----- Active nav link ---------------------------------- */
  function initActiveNav() {
    const path = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav a').forEach(function (link) {
      const href = link.getAttribute('href');
      if (!href) return;
      if (href === path || (path === '' && href === 'index.html')) {
        link.classList.add('is-active');
      }
    });
  }

  /* ----- Scroll reveal ------------------------------------ */
  function initReveal() {
    const targets = document.querySelectorAll('[data-reveal], [data-reveal-stagger]');
    if (!targets.length || !('IntersectionObserver' in window)) {
      targets.forEach(function (el) { el.classList.add('is-in'); });
      return;
    }

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.06, rootMargin: '0px 0px -32px 0px' });

    targets.forEach(function (el) { observer.observe(el); });
  }

  /* ----- FAQ accordion ------------------------------------ */
  function initFaqAccordion() {
    document.querySelectorAll('.faq-item').forEach(function (item) {
      var question = item.querySelector('.faq-question');
      if (!question) return;

      question.addEventListener('click', function () {
        var isOpen = item.classList.contains('is-open');

        // Close all others
        document.querySelectorAll('.faq-item.is-open').forEach(function (openItem) {
          if (openItem !== item) {
            openItem.classList.remove('is-open');
            var otherQuestion = openItem.querySelector('.faq-question');
            if (otherQuestion) otherQuestion.setAttribute('aria-expanded', 'false');
          }
        });

        // Toggle current
        item.classList.toggle('is-open', !isOpen);
        question.setAttribute('aria-expanded', String(!isOpen));
      });
    });
  }

  /* ----- Contact form validation -------------------------- */
  function initContactForm() {
    var form = document.querySelector('.contact-form');
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var name = form.querySelector('input[name="name"], input[type="text"]');
      var email = form.querySelector('input[name="email"], input[type="email"]');
      var message = form.querySelector('textarea[name="message"]');

      var valid = true;

      // Reset previous errors
      form.querySelectorAll('.field').forEach(function (field) {
        field.classList.remove('field--error');
      });

      if (name && !name.value.trim()) {
        name.parentElement.classList.add('field--error');
        valid = false;
      }

      if (email && !email.value.trim()) {
        email.parentElement.classList.add('field--error');
        valid = false;
      }

      if (message && !message.value.trim()) {
        message.parentElement.classList.add('field--error');
        valid = false;
      }

      if (valid) {
        // Enviar correo de agradecimiento por formulario de contacto
        import('./app/email-service.js').then(function (emailModule) {
          emailModule.sendContactFormEmail({
            name: name ? name.value.trim() : '',
            email: email ? email.value.trim() : '',
            message: message ? message.value.trim() : ''
          });
        }).catch(function (err) {
          console.warn('PALCOFY Email Service import error:', err);
        });

        // Show success state
        var btn = form.querySelector('.btn[type="submit"], .btn--block');
        if (btn) {
          var originalText = btn.innerHTML;
          var lang = document.documentElement.getAttribute('data-lang') || 'es';
          btn.innerHTML = lang === 'es'
            ? '<span>Enviado ✓</span>'
            : '<span>Sent ✓</span>';
          btn.style.pointerEvents = 'none';
          btn.style.opacity = '0.7';

          setTimeout(function () {
            btn.innerHTML = originalText;
            btn.style.pointerEvents = '';
            btn.style.opacity = '';
            form.reset();
          }, 3000);
        }
      }
    });
  }

  /* ----- Smooth scroll for anchor links ------------------- */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener('click', function (e) {
        var target = document.querySelector(link.getAttribute('href'));
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  /* ----- Modal de Hojas Legales --------------------------- */
  window.openLegalModal = function (type) {
    var modal = document.getElementById('legal-modal-overlay');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'legal-modal-overlay';
      modal.style.cssText = 'position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,0.8);backdrop-filter:blur(6px);display:flex;align-items:center;justify-content:center;padding:20px;';
      modal.innerHTML = `
        <div style="background:#1A1230;border:1px solid rgba(255,255,255,0.12);border-radius:16px;max-width:680px;width:100%;max-height:85vh;overflow-y:auto;padding:32px;color:white;position:relative;box-shadow:0 20px 50px rgba(0,0,0,0.5);">
          <button id="legal-modal-close" style="position:absolute;top:20px;right:20px;background:rgba(255,255,255,0.08);border:none;color:white;width:32px;height:32px;border-radius:50%;cursor:pointer;font-size:16px;">✕</button>
          <div id="legal-modal-content"></div>
        </div>
      `;
      document.body.appendChild(modal);
      modal.querySelector('#legal-modal-close').addEventListener('click', function () {
        modal.style.display = 'none';
      });
      modal.addEventListener('click', function (e) {
        if (e.target === modal) modal.style.display = 'none';
      });
    }

    var contentEl = modal.querySelector('#legal-modal-content');
    var docs = {
      aviso: `
        <h2 style="font-size:22px;font-weight:800;margin-bottom:12px;">Aviso Legal</h2>
        <p style="font-size:13px;color:rgba(255,255,255,0.7);line-height:1.6;margin-bottom:16px;">
          En cumplimiento del artículo 10 de la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información y Comercio Electrónico (LSSI-CE), se informa que la plataforma PALCOFY opera como marketplace B2B de gestión musical para recintos de hostelería y eventos.
        </p>
        <p style="font-size:13px;color:rgba(255,255,255,0.7);line-height:1.6;">
          Para cualquier consulta legal o comercial, puede dirigirse a nuestro canal de soporte en contacto@palcofy.com. Desarrollado de forma profesional por <strong>influweb.es</strong>.
        </p>
      `,
      privacidad: `
        <h2 style="font-size:22px;font-weight:800;margin-bottom:12px;">Política de Privacidad</h2>
        <p style="font-size:13px;color:rgba(255,255,255,0.7);line-height:1.6;margin-bottom:16px;">
          De conformidad con el Reglamento General de Protección de Datos (RGPD UE 2016/679) y la LOPDGDD 3/2018, los datos recabados en PALCOFY se procesan con estricta confidencialidad para la gestión de contrataciones, reservas y facturación entre artistas y recintos.
        </p>
        <p style="font-size:13px;color:rgba(255,255,255,0.7);line-height:1.6;">
          Puede ejercitar sus derechos de acceso, rectificación, supresión y oposición escribiendo a datos@palcofy.com.
        </p>
      `,
      cookies: `
        <h2 style="font-size:22px;font-weight:800;margin-bottom:12px;">Política de Cookies</h2>
        <p style="font-size:13px;color:rgba(255,255,255,0.7);line-height:1.6;margin-bottom:16px;">
          Este sitio web utiliza cookies técnicas indispensables para el inicio de sesión, preferencia de idioma y almacenamiento de sesión segura en la plataforma.
        </p>
        <p style="font-size:13px;color:rgba(255,255,255,0.7);line-height:1.6;">
          No se emplean cookies de rastreo publicitario de terceros sin su consentimiento explícito.
        </p>
      `,
      terminos: `
        <h2 style="font-size:22px;font-weight:800;margin-bottom:12px;">Términos y Condiciones de Uso</h2>
        <p style="font-size:13px;color:rgba(255,255,255,0.7);line-height:1.6;margin-bottom:16px;">
          El uso de la plataforma PALCOFY está reservado a recintos de hostelería, empresas organizadoras de eventos y artistas registrados. Todas las contrataciones están sujetas a liquidación automatizada y sustitución garantizada.
        </p>
        <p style="font-size:13px;color:rgba(255,255,255,0.7);line-height:1.6;">
          Desarrollado de forma profesional por <strong>influweb.es</strong>.
        </p>
      `
    };

    contentEl.innerHTML = docs[type] || docs.aviso;
    modal.style.display = 'flex';
  };

  /* ----- Init --------------------------------------------- */
  function init() {
    initLangSwitcher();
    initNavToggle();
    initActiveNav();
    initReveal();
    initFaqAccordion();
    initContactForm();
    initSmoothScroll();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
