/**
 * LEISURE — Luxury Speaker Brand
 * main.js — Vanilla JS, no dependencies
 */

(function () {
  'use strict';

  /* ============================================================
     1. PRELOADER
     ============================================================ */

  const preloader = document.getElementById('preloader');

  if (preloader) {
    const brandText = preloader.querySelector('.preloader-brand');
    const line = preloader.querySelector('.preloader-line');

    if (sessionStorage.getItem('leisureVisited')) {
      // Skip preloader on repeat visits
      preloader.classList.add('preloader-hidden');
    } else {
      // Step 1: fade in brand name at 0.8s
      setTimeout(function () {
        if (brandText) brandText.classList.add('visible');
      }, 800);

      // Step 2: expand gold line (CSS handles 0.4s delay after class add)
      setTimeout(function () {
        if (line) line.classList.add('expanded');
      }, 800);

      // Step 3: begin exit slide at 2.2s total
      setTimeout(function () {
        preloader.classList.add('preloader-exit');

        // Step 4: hide completely after slide animation (0.8s)
        setTimeout(function () {
          preloader.classList.add('preloader-hidden');
          sessionStorage.setItem('leisureVisited', '1');
        }, 800);
      }, 2200);
    }
  }

  /* ============================================================
     2. NAV SCROLL BEHAVIOUR
     ============================================================ */

  var nav = document.querySelector('.nav');

  function handleNavScroll() {
    if (!nav) return;
    if (window.scrollY > 80) {
      nav.classList.add('nav-scrolled');
    } else {
      nav.classList.remove('nav-scrolled');
    }
  }

  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll(); // run once on load

  /* ============================================================
     3. MOBILE MENU
     ============================================================ */

  var hamburger = document.querySelector('.nav-hamburger');
  var overlay = document.querySelector('.nav-overlay');

  function openMenu() {
    document.body.classList.add('menu-open');
    if (overlay) {
      overlay.style.display = 'flex';
      // Force reflow so transition plays
      overlay.getBoundingClientRect();
      overlay.classList.add('is-open');
    }
  }

  function closeMenu() {
    document.body.classList.remove('menu-open');
    if (overlay) {
      overlay.classList.remove('is-open');
      // Hide after transition
      setTimeout(function () {
        if (!overlay.classList.contains('is-open')) {
          overlay.style.display = 'none';
        }
      }, 400);
    }
  }

  if (hamburger) {
    hamburger.addEventListener('click', function () {
      if (document.body.classList.contains('menu-open')) {
        closeMenu();
      } else {
        openMenu();
      }
    });
  }

  if (overlay) {
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) closeMenu();
    });
  }

  // Close menu when overlay links are clicked
  if (overlay) {
    var overlayLinks = overlay.querySelectorAll('a');
    overlayLinks.forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });
  }

  /* ============================================================
     4. SCROLL REVEAL — INTERSECTION OBSERVER
     ============================================================ */

  var revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window && revealElements.length > 0) {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    revealElements.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    // Fallback: show all
    revealElements.forEach(function (el) {
      el.classList.add('visible');
    });
  }

  /* ============================================================
     5. SMOOTH SCROLL
     ============================================================ */

  var anchorLinks = document.querySelectorAll('a[href^="#"]');

  anchorLinks.forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var href = anchor.getAttribute('href');
      if (href === '#') return;

      var target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        var navHeight = nav ? nav.offsetHeight : 0;
        var targetTop = target.getBoundingClientRect().top + window.scrollY - navHeight - 24;

        window.scrollTo({ top: targetTop, behavior: 'smooth' });
        closeMenu();
      }
    });
  });

  /* ============================================================
     6. PRODUCT FILTER TABS
     ============================================================ */

  var filterTabs = document.querySelectorAll('.filter-tab');
  var productCards = document.querySelectorAll('.product-card[data-category]');

  if (filterTabs.length > 0) {
    filterTabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        // Toggle active class
        filterTabs.forEach(function (t) { t.classList.remove('active'); });
        tab.classList.add('active');

        var filter = tab.getAttribute('data-filter');

        productCards.forEach(function (card) {
          if (filter === 'all' || card.getAttribute('data-category') === filter) {
            card.removeAttribute('data-hidden');
            card.style.display = '';
          } else {
            card.setAttribute('data-hidden', '');
            card.style.display = 'none';
          }
        });
      });
    });
  }

  /* ============================================================
     7. CONTACT FORM VALIDATION
     ============================================================ */

  var contactForm = document.querySelector('.contact-form');

  if (contactForm) {
    var formSuccess = document.querySelector('.form-success');

    function validateEmail(email) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function setError(fieldId, message) {
      var group = contactForm.querySelector('[data-field="' + fieldId + '"]');
      if (!group) return;
      group.classList.add('has-error');
      var errorEl = group.querySelector('.field-error');
      if (errorEl) errorEl.textContent = message;
    }

    function clearError(fieldId) {
      var group = contactForm.querySelector('[data-field="' + fieldId + '"]');
      if (!group) return;
      group.classList.remove('has-error');
    }

    function clearAllErrors() {
      contactForm.querySelectorAll('.form-group').forEach(function (g) {
        g.classList.remove('has-error');
      });
    }

    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      clearAllErrors();

      var nameInput = contactForm.querySelector('#contact-name');
      var emailInput = contactForm.querySelector('#contact-email');
      var messageInput = contactForm.querySelector('#contact-message');

      var valid = true;

      if (!nameInput || nameInput.value.trim().length < 2) {
        setError('name', 'Please enter your full name.');
        valid = false;
      }

      if (!emailInput || !validateEmail(emailInput.value.trim())) {
        setError('email', 'Please enter a valid email address.');
        valid = false;
      }

      if (!messageInput || messageInput.value.trim().length < 10) {
        setError('message', 'Your message must be at least 10 characters.');
        valid = false;
      }

      if (valid) {
        contactForm.style.display = 'none';
        if (formSuccess) {
          formSuccess.classList.add('visible');
          formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    });

    // Live clear errors on input
    ['contact-name', 'contact-email', 'contact-message'].forEach(function (id) {
      var el = contactForm.querySelector('#' + id);
      if (el) {
        el.addEventListener('input', function () {
          clearError(id.replace('contact-', ''));
        });
      }
    });
  }

  /* ============================================================
     8. MAGNETIC 3D CARD TILT
     ============================================================ */

  var tiltCards = document.querySelectorAll('.product-card');

  tiltCards.forEach(function (card) {
    card.addEventListener('mousemove', function (e) {
      var rect = card.getBoundingClientRect();
      var x = (e.clientX - rect.left) / rect.width  - 0.5;
      var y = (e.clientY - rect.top)  / rect.height - 0.5;
      card.style.transition = 'transform 0.07s linear, background 0.35s ease, border-color 0.35s ease';
      card.style.transform  = 'translateY(-6px) perspective(700px) rotateY(' + (x * 14) + 'deg) rotateX(' + (-y * 10) + 'deg)';
    });

    card.addEventListener('mouseleave', function () {
      card.style.transition = 'transform 0.55s cubic-bezier(0.25, 0.46, 0.45, 0.94), background 0.35s ease, border-color 0.35s ease';
      card.style.transform  = '';
    });
  });

  /* ============================================================
     9. HERO MOUSE PARALLAX (text layer only — canvas handles its own)
     ============================================================ */

  var heroSection = document.getElementById('hero');
  var heroTextInner = document.querySelector('.hero-text-inner');

  if (heroSection && heroTextInner) {
    heroSection.addEventListener('mousemove', function (e) {
      var rx = (e.clientX / window.innerWidth  - 0.5) * 12; // px shift
      var ry = (e.clientY / window.innerHeight - 0.5) *  8;
      heroTextInner.style.transform = 'translate(' + rx + 'px, ' + ry + 'px)';
    });

    heroSection.addEventListener('mouseleave', function () {
      heroTextInner.style.transform = 'translate(0,0)';
    });
  }

})();
