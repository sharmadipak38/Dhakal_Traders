(function () {
  'use strict';
  const $ = (s) => document.querySelector(s),
    $$ = (s) => document.querySelectorAll(s);
  const loader = $('#loader'),
    navbar = $('#navbar'),
    hamburger = $('#hamburger'),
    navLinks = $('#navLinks'),
    backTop = $('#backTop');
  let currentLang = 'ne',
    ticking = false;

  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('hidden');
      setTimeout(() => (loader.style.display = 'none'), 600);
    }, 1800);
  });
  setTimeout(() => {
    if (loader && !loader.classList.contains('hidden')) {
      loader.classList.add('hidden');
      setTimeout(() => (loader.style.display = 'none'), 600);
    }
  }, 4000);

  window.switchLang = function (lang) {
    currentLang = lang;
    $('#btnNe').classList.toggle('active', lang === 'ne');
    $('#btnEn').classList.toggle('active', lang === 'en');
    $$('[data-ne][data-en]').forEach((el) => {
      const t = el.getAttribute('data-' + lang);
      if (t) el.innerHTML = t;
    });
    $$('[data-ph-ne][data-ph-en]').forEach((el) => {
      el.placeholder = el.getAttribute('data-ph-' + lang);
    });
    try {
      localStorage.setItem('dhakal-lang', lang);
    } catch (e) {}
  };
  try {
    const s = localStorage.getItem('dhakal-lang');
    if (s === 'en' || s === 'ne') switchLang(s);
  } catch (e) {}

  hamburger.addEventListener('click', () => {
    const o = navLinks.classList.toggle('open');
    hamburger.classList.toggle('active');
    document.body.style.overflow = o ? 'hidden' : '';
  });
  window.closeMenu = function () {
    navLinks.classList.remove('open');
    hamburger.classList.remove('active');
    document.body.style.overflow = '';
  };
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });
  window.addEventListener('resize', () => {
    if (window.innerWidth > 720) closeMenu();
  });

  const sections = $$('section[id]'),
    navAnchors = $$('.nav-center a');
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const y = window.scrollY;
        navbar.classList.toggle('scrolled', y > 80);
        backTop.classList.toggle('show', y > 500);
        let cur = '';
        sections.forEach((s) => {
          if (y >= s.offsetTop - 130 && y < s.offsetTop + s.offsetHeight) cur = s.id;
        });
        navAnchors.forEach((a) => a.classList.toggle('active', a.getAttribute('href') === '#' + cur));
        ticking = false;
      });
      ticking = true;
    }
  });

  const rObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          const p = e.target.parentElement;
          const sibs = p
            ? [...p.children].filter(
                (c) =>
                  c.classList.contains('reveal') ||
                  c.classList.contains('reveal-left') ||
                  c.classList.contains('reveal-right') ||
                  c.classList.contains('reveal-scale')
              )
            : [];
          const idx = sibs.indexOf(e.target);
          setTimeout(() => e.target.classList.add('visible'), (idx >= 0 ? idx : 0) * 120);
          rObs.unobserve(e.target);
        }
      });
    },
    { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
  );
  $$('.reveal,.reveal-left,.reveal-right,.reveal-scale').forEach((el) => rObs.observe(el));

  function animateCounters() {
    $$('.stat-num').forEach((c) => {
      if (c.dataset.animated) return;
      const t = c.getAttribute('data-' + currentLang) || c.textContent;
      const m = t.match(/[\d०-९]+/);
      if (!m) return;
      const isDev = /[०-९]/.test(m[0]);
      let target = isDev
        ? parseInt(m[0].replace(/[०-९]/g, (d) => '०१२३४५६७८९'.indexOf(d)))
        : parseInt(m[0]);
      if (isNaN(target) || target === 0) return;
      const suf = t.replace(m[0], '');
      let count = 0;
      const step = Math.max(1, Math.floor(target / 45));
      const iv = setInterval(() => {
        count += step;
        if (count >= target) {
          count = target;
          clearInterval(iv);
          c.dataset.animated = 'true';
        }
        c.textContent =
          (isDev ? count.toString().replace(/[0-9]/g, (d) => '०१२३४५६७८९'[d]) : count) + suf;
      }, 35);
    });
  }
  const sBar = $('.stats-bar');
  if (sBar) {
    const sObs = new IntersectionObserver(
      (e) => {
        e.forEach((en) => {
          if (en.isIntersecting) {
            setTimeout(animateCounters, 400);
            sObs.unobserve(en.target);
          }
        });
      },
      { threshold: 0.3 }
    );
    sObs.observe(sBar);
  }

  window.submitForm = function () {
    const n = $('#fname'),
      m = $('#fmsg'),
      ne = $('#nameErr'),
      me = $('#msgErr'),
      btn = $('#submitBtn'),
      suc = $('#formSuccess');
    let v = true;
    [n, m].forEach((i) => i.classList.remove('error'));
    [ne, me].forEach((e) => e.classList.remove('show'));
    if (!n.value.trim()) {
      n.classList.add('error');
      ne.classList.add('show');
      n.focus();
      v = false;
    }
    if (!m.value.trim()) {
      m.classList.add('error');
      me.classList.add('show');
      if (v) m.focus();
      v = false;
    }
    if (!v) return;
    btn.disabled = true;
    btn.textContent = 'पठाउँदैछ...';
    setTimeout(() => {
      suc.classList.add('show');
      n.value = '';
      $('#fphone').value = '';
      $('#fsubject').selectedIndex = 0;
      m.value = '';
      btn.disabled = false;
      btn.textContent = 'सन्देश पठाउनुहोस् →';
      setTimeout(() => suc.classList.remove('show'), 6000);
    }, 1500);
  };
  $('#fname').addEventListener('input', function () {
    this.classList.remove('error');
    $('#nameErr').classList.remove('show');
  });
  $('#fmsg').addEventListener('input', function () {
    this.classList.remove('error');
    $('#msgErr').classList.remove('show');
  });

  $$('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', function (e) {
      const t = $(this.getAttribute('href'));
      if (t) {
        e.preventDefault();
        window.scrollTo({ top: t.offsetTop - navbar.offsetHeight - 15, behavior: 'smooth' });
        closeMenu();
      }
    });
  });

  $$('.prod').forEach((p) => {
    const em = p.querySelector('.prod-emoji');
    if (!em) return;
    p.addEventListener('mouseenter', () => {
      em.style.transform = 'scale(1.35) rotate(12deg)';
      em.style.transition = 'transform .35s cubic-bezier(.4,0,.2,1)';
    });
    p.addEventListener('mouseleave', () => {
      em.style.transform = 'scale(1) rotate(0)';
    });
  });

  const mc = $('.map-container');
  if (mc) {
    const mi = mc.querySelector('iframe');
    if (mi) {
      const s = mi.src;
      mi.removeAttribute('src');
      mi.dataset.src = s;
      const mObs = new IntersectionObserver(
        (e) => {
          e.forEach((en) => {
            if (en.isIntersecting) {
              const i = en.target.querySelector('iframe');
              if (i && i.dataset.src) {
                i.src = i.dataset.src;
                delete i.dataset.src;
              }
              mObs.unobserve(en.target);
            }
          });
        },
        { threshold: 0.1, rootMargin: '200px' }
      );
      mObs.observe(mc);
    }
  }

  document.addEventListener('visibilitychange', () => {
    document.title = document.hidden
      ? 'ढकाल ट्रेडर्स — फर्कनुहोस्! 👋'
      : 'ढकाल ट्रेडर्स एण्ड सप्लायर्स | Dhakal Traders & Suppliers';
  });
  window.addEventListener('beforeprint', () => {
    $$('.reveal,.reveal-left,.reveal-right,.reveal-scale').forEach((el) => el.classList.add('visible'));
  });
})();
