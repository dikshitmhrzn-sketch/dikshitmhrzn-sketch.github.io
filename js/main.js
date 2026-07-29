(function () {
  'use strict';

  /* ---------- Mobile Nav Toggle ---------- */

  var navToggle = document.getElementById('navToggle');
  var navLinks = document.getElementById('navLinks');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      navLinks.classList.toggle('open');
      navToggle.classList.toggle('open');
    });

    document.querySelectorAll('.nav-link').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('open');
        navToggle.classList.remove('open');
      });
    });
  }

  /* ---------- Active Nav Link on Scroll ---------- */

  var sections = document.querySelectorAll('.section[id]');
  var navLinkEls = document.querySelectorAll('.nav-link');

  function updateActiveLink() {
    var current = '';
    sections.forEach(function (section) {
      var top = section.offsetTop - 120;
      var bottom = top + section.offsetHeight;
      if (window.scrollY >= top && window.scrollY < bottom) {
        current = section.getAttribute('id');
      }
    });

    navLinkEls.forEach(function (link) {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', updateActiveLink);
  updateActiveLink();

  /* ---------- Scroll Reveal (Intersection Observer) ---------- */

  var revealEls = document.querySelectorAll('[data-reveal]');

  if (revealEls.length && 'IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    revealEls.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add('visible');
    });
  }

  /* ---------- Typewriter Effect ---------- */

  var nameEl = document.querySelector('.typing-name');
  var subtitleEl = document.querySelector('.typing-subtitle');

  if (nameEl) {
    var nameText = 'Dikshit Maharjan';
    var subtitleText = 'Fullstack Developer & Frontend Developer';
    var idx = 0;
    var phase = 'name';

    function typeNext() {
      if (phase === 'name') {
        if (idx < nameText.length) {
          nameEl.textContent += nameText.charAt(idx);
          idx++;
          setTimeout(typeNext, 50 + Math.random() * 40);
        } else {
          phase = 'subtitle';
          idx = 0;
          setTimeout(typeNext, 400);
        }
      } else if (phase === 'subtitle' && subtitleEl) {
        if (idx < subtitleText.length) {
          subtitleEl.textContent += subtitleText.charAt(idx);
          idx++;
          setTimeout(typeNext, 35 + Math.random() * 25);
        } else {
          setTimeout(function () {
            var cursor = document.querySelector('.typing-cursor');
            if (cursor) cursor.style.display = 'none';
          }, 500);
        }
      }
    }

    setTimeout(typeNext, 500);
  }

  /* ---------- Contact Form ---------- */

  var contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var existing = contactForm.querySelector('.form-success');
      if (existing) existing.remove();

      var btn = contactForm.querySelector('.btn-submit');
      var originalText = btn.textContent;
      btn.textContent = 'Sending...';
      btn.disabled = true;

      var formData = new FormData(contactForm);

      fetch(contactForm.action, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      }).then(function (res) {
        if (res.ok) {
          var success = document.createElement('p');
          success.className = 'form-success';
          success.textContent = 'Thanks for reaching out! I\'ll get back to you soon.';
          contactForm.appendChild(success);
          contactForm.reset();
        } else {
          throw new Error('Form submission failed');
        }
      }).catch(function () {
        var error = document.createElement('p');
        error.className = 'form-success';
        error.textContent = 'Something went wrong. Please try again or email me directly.';
        contactForm.appendChild(error);
      }).then(function () {
        btn.textContent = originalText;
        btn.disabled = false;
      });
    });
  }
})();
