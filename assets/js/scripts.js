(function () {
  'use strict';

  // 1. Theme Management (Dark Preferred)
  var themeToggle = document.querySelector('.theme-toggle');
  function getPreferredTheme() {
    try {
      var stored = localStorage.getItem('pf-theme');
      if (stored) return stored;
    } catch (e) {}
    // Default to dark
    return 'dark';
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem('pf-theme', theme);
    } catch (e) {}
  }

  // Apply immediately
  applyTheme(getPreferredTheme());

  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      var current = document.documentElement.getAttribute('data-theme') || 'dark';
      var next = current === 'dark' ? 'light' : 'dark';
      applyTheme(next);
    });
  }

  // 2. Mobile Navigation
  var mobileToggle = document.querySelector('.mobile-toggle');
  var navMenu = document.querySelector('.nav-menu');
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', function (e) {
      e.stopPropagation();
      var isOpen = navMenu.classList.toggle('is-open');
      mobileToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Close menu when a link is clicked
    navMenu.querySelectorAll('.nav-link').forEach(function (link) {
      link.addEventListener('click', function () {
        navMenu.classList.remove('is-open');
        mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Close menu on outside click
    document.addEventListener('click', function (e) {
      if (!navMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
        navMenu.classList.remove('is-open');
        mobileToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // 3. Project Category Filtering
  var filterBtns = document.querySelectorAll('.filter-btn');
  var projectCards = document.querySelectorAll('.project-card');

  if (filterBtns.length > 0 && projectCards.length > 0) {
    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var filter = this.getAttribute('data-filter');

        filterBtns.forEach(function (b) { b.classList.remove('active'); });
        this.classList.add('active');

        projectCards.forEach(function (card) {
          var category = card.getAttribute('data-category');
          if (filter === 'all' || category === filter) {
            card.style.display = '';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // 4. Robust Clipboard Copy with Fallback
  function copyTextToClipboard(text, onSuccess, onFail) {
    function fallback() {
      try {
        var textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-9999px';
        textArea.style.top = '-9999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        var success = document.execCommand('copy');
        document.body.removeChild(textArea);
        if (success) {
          onSuccess();
        } else if (onFail) {
          onFail();
        }
      } catch (err) {
        if (onFail) onFail();
      }
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(onSuccess).catch(fallback);
    } else {
      fallback();
    }
  }

  var copyBtn = document.querySelector('.copy-btn');
  if (copyBtn) {
    var checkSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:14px;height:14px;"><polyline points="20 6 9 17 4 12"></polyline></svg>';

    copyBtn.addEventListener('click', function () {
      var email = 'primaybr@gmail.com';
      var originalHTML = copyBtn.innerHTML;

      copyTextToClipboard(
        email,
        function () {
          copyBtn.innerHTML = checkSvg + ' Copied!';
          setTimeout(function () {
            copyBtn.innerHTML = originalHTML;
          }, 2200);
        },
        function () {
          window.location.href = 'mailto:' + email;
        }
      );
    });
  }

  // 5. Scroll Active Spy for Navigation
  var sections = document.querySelectorAll('section[id], header[id]');
  var navLinks = document.querySelectorAll('.nav-link');

  function updateActiveNav() {
    var scrollPos = window.scrollY + 120;
    sections.forEach(function (section) {
      var top = section.offsetTop;
      var height = section.offsetHeight;
      var id = section.getAttribute('id');
      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(function (link) {
          if (link.getAttribute('href') === '#' + id) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });
  updateActiveNav();

  // 6. Dynamic Year in Footer
  var yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
})();
