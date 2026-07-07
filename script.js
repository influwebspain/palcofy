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
