/* Interactions : Lenis + GSAP reveals + compteurs + marquee + curseur + menu + lightbox. */
(function () {
  'use strict';
  var html = document.documentElement;
  html.classList.add('js');
  var REDUCE = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var gsap = window.gsap, ScrollTrigger = window.ScrollTrigger;

  /* ---------- Année ---------- */
  var y = document.getElementById('year'); if (y) y.textContent = new Date().getFullYear();

  /* ---------- Ticker (hero) ---------- */
  var tickerData = ['ROAS x5', 'CPA −84%', 'CPI 2€ → 0,48€', '30K€/mois gérés', '+40% d’inscriptions', '4 ans d’acquisition'];
  var ticker = document.getElementById('ticker');
  if (ticker) {
    var html2 = '';
    var twice = tickerData.concat(tickerData);
    twice.forEach(function (t) { html2 += '<span><span class="d">◆</span>' + t + '</span>'; });
    ticker.innerHTML = html2;
  }

  /* ---------- Marquee marques ---------- */
  var marques = ['Yper', 'Leica Camera', 'Divinbydivin', 'Davrilsupply', 'Ford', 'Opel', 'Aston Martin', 'Domino’s Pizza', 'McDonald’s', 'Porsche'];
  var marquee = document.getElementById('marquee');
  if (marquee) {
    var m = '';
    marques.concat(marques).forEach(function (n) { m += '<span>' + n + '<span class="d">◆</span></span>'; });
    marquee.innerHTML = m;
  }

  /* ---------- Lenis smooth scroll ---------- */
  var lenis = null;
  if (!REDUCE && window.Lenis) {
    lenis = new Lenis({ duration: 1.1, easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); }, smoothWheel: true });
    if (gsap && ScrollTrigger) {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
      gsap.ticker.lagSmoothing(0);
    } else {
      var raf = function (time) { lenis.raf(time); requestAnimationFrame(raf); };
      requestAnimationFrame(raf);
    }
  }

  /* ---------- Smooth anchor links ---------- */
  function scrollTo(target) {
    var el = document.querySelector(target);
    if (!el) return;
    if (lenis) lenis.scrollTo(el, { offset: -10 });
    else el.scrollIntoView({ behavior: REDUCE ? 'auto' : 'smooth' });
  }
  document.querySelectorAll('[data-scroll]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var href = a.getAttribute('href');
      if (href && href.charAt(0) === '#') { e.preventDefault(); closeMenu(); scrollTo(href); }
    });
  });

  /* ---------- Header (scroll state + progress) ---------- */
  var header = document.getElementById('header');
  var progress = document.getElementById('progress');
  function onScroll() {
    var sc = window.scrollY || window.pageYOffset;
    if (header) header.classList.toggle('scrolled', sc > 24);
    if (progress) {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.transform = 'scaleX(' + (h > 0 ? sc / h : 0) + ')';
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Menu mobile ---------- */
  var burger = document.getElementById('burger');
  function setMenu(open) {
    if (header) header.classList.toggle('menu-open', open);
    if (burger) burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    document.body.classList.toggle('no-scroll', open);          // verrou de scroll
    if (lenis) { open ? lenis.stop() : lenis.start(); }          // gèle Lenis derrière le menu
  }
  function closeMenu() { setMenu(false); }
  if (burger) {
    burger.addEventListener('click', function () {
      setMenu(!header.classList.contains('menu-open'));
    });
  }

  /* ---------- Curseur custom (desktop) ---------- */
  var fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (fine && !REDUCE) {
    var dot = document.querySelector('.cursor-dot'), ring = document.querySelector('.cursor-ring');
    if (dot && ring) {
      html.classList.add('has-custom-cursor');
      var mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my;
      window.addEventListener('mousemove', function (e) {
        mx = e.clientX; my = e.clientY;
        dot.style.transform = 'translate(' + mx + 'px,' + my + 'px) translate(-50%,-50%)';
      });
      (function loop() {
        rx += (mx - rx) * 0.18; ry += (my - ry) * 0.18;
        ring.style.transform = 'translate(' + rx + 'px,' + ry + 'px) translate(-50%,-50%)';
        requestAnimationFrame(loop);
      })();
      var sel = 'a,button,input,textarea,.magnetic,[data-zoom]';
      document.addEventListener('mouseover', function (e) { if (e.target.closest(sel)) ring.classList.add('is-hover'); });
      document.addEventListener('mouseout', function (e) { if (e.target.closest(sel)) ring.classList.remove('is-hover'); });
    }
  }

  /* ---------- Reveal ---------- */
  var reveals = document.querySelectorAll('.reveal');
  if (REDUCE || !gsap || !ScrollTrigger) {
    reveals.forEach(function (el) { el.style.opacity = 1; el.style.transform = 'none'; });
  } else {
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.batch('.reveal', {
      start: 'top 88%',
      onEnter: function (b) { gsap.to(b, { opacity: 1, y: 0, duration: 0.7, stagger: 0.08, ease: 'power3.out', overwrite: true }); }
    });
    // éléments déjà visibles au chargement
    ScrollTrigger.refresh();
  }

  /* ---------- Hero : reveal des lignes de titre ---------- */
  var lines = document.querySelectorAll('.hero__title .line > span');
  if (REDUCE || !gsap) {
    lines.forEach(function (s) { s.style.transform = 'none'; });
  } else {
    gsap.to(lines, { y: '0%', duration: 0.9, stagger: 0.12, ease: 'power3.out', delay: 0.15 });
  }

  /* ---------- Compteurs ---------- */
  function fmt(v, dec, grp) {
    return v.toLocaleString('fr-FR', { minimumFractionDigits: dec, maximumFractionDigits: dec, useGrouping: !!grp });
  }
  function runCounter(el) {
    var to = parseFloat(el.getAttribute('data-count-to')) || 0;
    var dec = parseInt(el.getAttribute('data-decimals') || '0', 10);
    var grp = el.getAttribute('data-grouping') === '1';
    var pre = el.getAttribute('data-prefix') || '';
    var suf = el.getAttribute('data-suffix') || '';
    if (REDUCE) { el.textContent = pre + fmt(to, dec, grp) + suf; return; }
    var start = performance.now(), dur = 1600;
    (function step(now) {
      var p = Math.min(1, (now - start) / dur);
      var e = 1 - Math.pow(1 - p, 3);
      el.textContent = pre + fmt(to * e, dec, grp) + suf;
      if (p < 1) requestAnimationFrame(step);
    })(start);
  }
  var counters = document.querySelectorAll('[data-count-to]');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { runCounter(en.target); io.unobserve(en.target); }
      });
    }, { threshold: 0.4 });
    counters.forEach(function (el) { io.observe(el); });
  } else {
    counters.forEach(runCounter);
  }

  /* ---------- Lightbox ---------- */
  var lb = document.getElementById('lightbox'), lbImg = document.getElementById('lightboxImg'), lbClose = document.getElementById('lightboxClose');
  function openLb(src, alt) { if (!lb) return; lbImg.src = src; lbImg.alt = alt || ''; lb.classList.add('open'); lb.setAttribute('aria-hidden', 'false'); }
  function closeLb() { if (!lb) return; lb.classList.remove('open'); lb.setAttribute('aria-hidden', 'true'); lbImg.src = ''; }
  document.querySelectorAll('[data-zoom]').forEach(function (btn) {
    btn.addEventListener('click', function () { var img = btn.querySelector('img'); if (img) openLb(img.src, img.alt); });
  });
  if (lb) lb.addEventListener('click', function (e) { if (e.target === lb || e.target === lbClose) closeLb(); });
  if (lbClose) lbClose.addEventListener('click', closeLb);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeLb(); });

  /* ---------- Formulaire contact (mailto, sans backend) ---------- */
  var form = document.getElementById('contactForm'), btn = document.getElementById('submitBtn');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var f = new FormData(form);
      var body = 'Nom: ' + (f.get('nom') || '') + '\nEntreprise: ' + (f.get('entreprise') || '') + '\nEmail: ' + (f.get('email') || '') + '\n\n' + (f.get('message') || '');
      window.location.href = 'mailto:khanfara364@gmail.com?subject=' + encodeURIComponent('Contact portfolio — ' + (f.get('nom') || '')) + '&body=' + encodeURIComponent(body);
      if (btn) btn.textContent = 'Merci, message prêt ✓';
    });
  }

  /* ---------- Boutons magnétiques (desktop) ---------- */
  if (fine && !REDUCE) {
    document.querySelectorAll('.magnetic').forEach(function (el) {
      el.addEventListener('mousemove', function (e) {
        var r = el.getBoundingClientRect();
        var x = e.clientX - r.left - r.width / 2, y = e.clientY - r.top - r.height / 2;
        el.style.transform = 'translate(' + x * 0.25 + 'px,' + y * 0.25 + 'px)';
      });
      el.addEventListener('mouseleave', function () { el.style.transform = 'translate(0,0)'; });
    });
  }
})();
