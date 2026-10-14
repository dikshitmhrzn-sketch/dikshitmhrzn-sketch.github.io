(function () {
  'use strict';

  /* Marks the document as JS-enabled so reveal styles only hide content then. */
  document.documentElement.classList.add('js');

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Hero typing (name, then subtitle) ---------- */

  var nameTarget = document.querySelector('.hero-name .type-target');
  var nameCursor = document.querySelector('.hero-name .type-cursor');
  var titleTarget = document.querySelector('.hero-title .type-target');
  var titleCursor = document.querySelector('.hero-title .type-cursor');

  function hideCursor(el, instant) {
    if (!el) return;
    if (instant) {
      el.classList.remove('is-fading');
      el.classList.add('is-hidden');
      return;
    }
    el.classList.add('is-fading');
    setTimeout(function () {
      el.classList.add('is-hidden');
    }, 360);
  }

  if (reduceMotion || !nameTarget) {
    hideCursor(nameCursor);
    hideCursor(titleCursor);
  } else {
    var nameText = nameTarget.textContent;
    var titleText = titleTarget ? titleTarget.textContent : '';
    nameTarget.textContent = '';
    if (titleTarget) titleTarget.textContent = '';
    /* Keep both cursors out of sight until their line starts typing. */
    if (nameCursor) nameCursor.classList.add('is-hidden');
    if (titleCursor) titleCursor.classList.add('is-hidden');

    var typeInto = function (el, text, cursor, min, max, onDone) {
      var i = 0;
      var step = function () {
        i += 1;
        el.textContent = text.slice(0, i);
        /* Cursor appears only once its first character exists. */
        if (i === 1 && cursor) cursor.classList.remove('is-hidden', 'is-fading');
        if (i < text.length) {
          /* Slight ease-out: the last two characters land slower. */
          var remaining = text.length - i;
          var extra = remaining <= 2 ? 60 : 0;
          setTimeout(step, min + Math.random() * (max - min) + extra);
        } else if (onDone) {
          setTimeout(onDone, 550);
        }
      };
      step();
    };

    /* Wait for the hero fade-in before typing starts. */
    setTimeout(function () {
      typeInto(nameTarget, nameText, nameCursor, 85, 140, function () {
        /* Instant hide: no line lingers above the subtitle as it starts. */
        hideCursor(nameCursor, true);
        if (titleTarget && titleText) {
          typeInto(titleTarget, titleText, titleCursor, 70, 105, function () {
            hideCursor(titleCursor, false);
          });
        } else {
          hideCursor(titleCursor, true);
        }
      });
    }, 750);
  }

  /* ---------- Navbar: solid background on scroll ---------- */

  var navbar = document.querySelector('.navbar');

  function updateNavbar() {
    if (!navbar) return;
    navbar.classList.toggle('scrolled', window.scrollY > 12);
  }

  window.addEventListener('scroll', updateNavbar, { passive: true });
  updateNavbar();

  /* ---------- Mobile navigation ---------- */

  var navToggle = document.getElementById('navToggle');
  var navLinks = document.getElementById('navLinks');

  function setMenu(open) {
    if (!navToggle || !navLinks) return;
    navLinks.classList.toggle('open', open);
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }

  function menuOpen() {
    return navLinks && navLinks.classList.contains('open');
  }

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      setMenu(!menuOpen());
    });

    navLinks.addEventListener('click', function (e) {
      if (e.target.closest('.nav-link')) setMenu(false);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menuOpen()) {
        setMenu(false);
        navToggle.focus();
      }
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 768 && menuOpen()) setMenu(false);
    });
  }

  /* ---------- Active nav link on scroll ---------- */

  var sections = Array.prototype.slice.call(document.querySelectorAll('section[id]'));
  var navLinkEls = Array.prototype.slice.call(document.querySelectorAll('.nav-link'));

  function updateActiveLink() {
    var current = '';
    var offset = (navbar ? navbar.offsetHeight : 66) + 80;

    sections.forEach(function (section) {
      var top = section.offsetTop - offset;
      var bottom = top + section.offsetHeight;
      if (window.scrollY >= top && window.scrollY < bottom) {
        current = section.getAttribute('id');
      }
    });

    navLinkEls.forEach(function (link) {
      var match = link.getAttribute('href') === '#' + current;
      link.classList.toggle('active', match);
      if (match) {
        link.setAttribute('aria-current', 'true');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  }

  window.addEventListener('scroll', updateActiveLink, { passive: true });
  updateActiveLink();

  /* ---------- Scroll reveal ---------- */

  var revealEls = document.querySelectorAll('[data-reveal]');

  if (revealEls.length) {
    if (reduceMotion || !('IntersectionObserver' in window)) {
      revealEls.forEach(function (el) {
        el.classList.add('visible');
      });
    } else {
      var revealObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible');
              revealObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
      );

      revealEls.forEach(function (el) {
        revealObserver.observe(el);
      });
    }
  }

  /* ---------- Contact form (Formspree) ---------- */

  var contactForm = document.getElementById('contactForm');
  var formStatus = document.getElementById('formStatus');

  function setStatus(message, type) {
    if (!formStatus) return;
    formStatus.textContent = message;
    formStatus.classList.remove('is-success', 'is-error');
    if (type) formStatus.classList.add(type);
  }

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      if (!contactForm.checkValidity()) {
        contactForm.reportValidity();
        setStatus('Please fill in all fields before sending.', 'is-error');
        return;
      }

      var btn = contactForm.querySelector('.btn-submit');
      var originalText = btn.textContent;
      btn.textContent = 'Sending…';
      btn.disabled = true;
      setStatus('', null);

      var formData = new FormData(contactForm);

      fetch(contactForm.action, {
        method: 'POST',
        body: formData,
        headers: { Accept: 'application/json' }
      })
        .then(function (res) {
          if (!res.ok) throw new Error('Form submission failed');
          setStatus("Thanks for reaching out! I'll get back to you soon.", 'is-success');
          contactForm.reset();
        })
        .catch(function () {
          setStatus(
            'Something went wrong. Please try again or email me directly.',
            'is-error'
          );
        })
        .then(function () {
          btn.textContent = originalText;
          btn.disabled = false;
        });
    });
  }
})();
