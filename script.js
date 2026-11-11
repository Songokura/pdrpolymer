/* Pdr Polymer center */
(function () {
  'use strict';
  var VER = (function () { var s = document.currentScript && document.currentScript.src || ''; var m = s.match(/[?&]v=([^&]+)/); return m ? m[1] : '1'; })();
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };
  var RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var gsap = window.gsap, ST = window.ScrollTrigger, SplitText = window.SplitText;
  var EASE = 'power3.out', D1 = 0.2, D2 = 0.4, D3 = 1, STG = 0.08;
  if (gsap && ST) gsap.registerPlugin(ST);
  if (gsap && SplitText) gsap.registerPlugin(SplitText);

  /* ---------- Язык ---------- */
  var WA_NUM = '77789450969';
  var RU = {
    'wa.hero': 'Здравствуйте! Пишу с сайта Pdr Polymer center. Хочу записаться на осмотр автомобиля.',
    'wa.svc': 'Здравствуйте! Пишу с сайта Pdr Polymer center по ремонту автомобиля.\nУслуга: {name}\nХочу записаться на осмотр и узнать стоимость.',
    'wa.svcAll': 'Здравствуйте! Пишу с сайта Pdr Polymer center по ремонту автомобиля. Хочу записаться на осмотр.',
    'wa.poly': 'Здравствуйте! Пишу с сайта Pdr Polymer center по покупке полимера.\nТовар: {name}\nПодскажите цену и наличие.',
    'wa.polyAll': 'Здравствуйте! Пишу с сайта Pdr Polymer center по покупке полимера и расходных материалов. Подскажите цены и наличие.',
    'wa.edu': 'Здравствуйте! Пишу с сайта Pdr Polymer center по обучению.\nНаправление: {name}\nПодскажите программу, сроки и стоимость.',
    'wa.eduAll': 'Здравствуйте! Пишу с сайта Pdr Polymer center по обучению. Подскажите программу, сроки и стоимость.',
    'wa.form': 'Здравствуйте! Заявка с сайта Pdr Polymer center.\nТема: {topic}\nИмя: {name}\nТелефон: {phone}\nСообщение: {msg}'
  };
  var lang = 'ru';
  $$('[data-i18n]').forEach(function (el) { var k = el.getAttribute('data-i18n'); if (!(k in RU)) RU[k] = el.innerHTML; });
  $$('[data-i18n-aria]').forEach(function (el) { var k = el.getAttribute('data-i18n-aria'); if (!(k in RU)) RU[k] = el.getAttribute('aria-label'); });
  function dict() { return lang === 'kk' ? window.SITE_KK : lang === 'en' ? window.SITE_EN : null; }
  function t(k) { var d = dict(); return (d && d[k]) || RU[k] || ''; }
  function plain(s) { var d = document.createElement('div'); d.innerHTML = s; return (d.textContent || '').replace(/ /g, ' ').trim(); }
  function waUrl(text) { return 'https://wa.me/' + WA_NUM + '?text=' + encodeURIComponent(text); }
  function updateWa() {
    $$('a[data-wa]').forEach(function (a) {
      var txt = t('wa.' + a.getAttribute('data-wa'));
      var n = a.getAttribute('data-wa-name');
      if (n) txt = txt.replace('{name}', plain(t(n)));
      a.href = waUrl(txt);
    });
  }
  function relang(el) { var k = el.getAttribute('data-i18n'); if (k) { var v = t(k); if (v) el.innerHTML = v; } }
  function applyLang() {
    document.documentElement.lang = lang;
    $$('[data-i18n]').forEach(function (el) { var v = t(el.getAttribute('data-i18n')); if (v) el.innerHTML = v; });
    $$('[data-i18n-aria]').forEach(function (el) { var v = t(el.getAttribute('data-i18n-aria')); if (v) el.setAttribute('aria-label', v); });
    $$('[data-i18n-alt]').forEach(function (el) { var v = t(el.getAttribute('data-i18n-alt')); if (v) el.setAttribute('alt', plain(v)); });
    $$('.lang button').forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-lang') === lang ? 'true' : 'false'); });
    updateWa();
    document.dispatchEvent(new CustomEvent('langchange'));
  }
  function setLang(l, save) {
    if (['ru', 'kk', 'en'].indexOf(l) < 0) l = 'ru';
    if (save) { try { localStorage.setItem('lang', l); } catch (e) {} }
    var glob = l === 'kk' ? 'SITE_KK' : 'SITE_EN';
    if (l === 'ru' || window[glob]) { lang = l; applyLang(); return; }
    var s = document.createElement('script');
    s.src = 'assets/lang/' + l + '.js?v=' + VER;
    s.onload = function () { lang = l; applyLang(); };
    document.head.appendChild(s);
  }
  $$('.lang button').forEach(function (b) { b.addEventListener('click', function () { setLang(b.getAttribute('data-lang'), true); }); });
  (function () {
    var q = new URLSearchParams(location.search).get('lang'), saved = null;
    try { saved = localStorage.getItem('lang'); } catch (e) {}
    var ok = { ru: 1, kk: 1, en: 1 };
    var l = ok[q] ? q : ok[saved] ? saved : 'ru';
    if (l !== 'ru') setLang(l, false); else updateWa();
  })();

  /* ---------- Шапка, меню ---------- */
  var hdr = $('#hdr'), stageWrap = $('.stage-wrap'), burger = $('.burger'), mnav = $('#mnav');
  function onScroll() {
    hdr.classList.toggle('is-solid', window.scrollY > 24);
  }
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
  function menu(open) {
    document.body.classList.toggle('menu-open', open);
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    mnav.setAttribute('aria-hidden', open ? 'false' : 'true');
    if (lenis) { open ? lenis.stop() : lenis.start(); }
  }
  burger.addEventListener('click', function () { menu(!document.body.classList.contains('menu-open')); });
  $$('a', mnav).forEach(function (a) { a.addEventListener('click', function () { menu(false); }); });

  /* ---------- Плавная прокрутка ---------- */
  var lenis = null;
  if (window.Lenis && !RM) {
    lenis = new window.Lenis({ lerp: 0.1, smoothWheel: true });
    if (gsap && ST) {
      lenis.on('scroll', ST.update);
      gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
      gsap.ticker.lagSmoothing(0);
    } else {
      (function raf(tm) { lenis.raf(tm); requestAnimationFrame(raf); })(0);
    }
  }
  window.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href^="#"]');
    if (!a) return;
    var id = a.getAttribute('href');
    var target = id === '#top' ? null : $(id);
    if (id !== '#top' && !target) return;
    e.preventDefault();
    var y = target ? target.getBoundingClientRect().top + window.scrollY - (id === '#metody' ? 0 : 70) : 0;
    if (lenis) lenis.scrollTo(y, { duration: 1.2 }); else window.scrollTo({ top: y, behavior: RM ? 'auto' : 'smooth' });
    history.replaceState(null, '', id);
  }, true);

  /* ---------- Сцена: разрез панели ---------- */
  var stage = $('#stage'), far = $('#scFar'), main = $('#scMain'), cam = $('#scCam'), dust = $('#scDust');
  var G = null, E = {}, lastK = -1, tl = null, introDone = false;
  var st = { k: 1, tap: 0, fill: 0, cure: 0, lamp: 0, cone: 0.32, rod: 1, app: 0, ref: 0.5, cs: 1, fx: 0, fy: 0, tx: 0, ty: 0, lampA: 1 };
  var P = function (n) { return n.toFixed(1); };

  function bump(u) {
    var a = Math.exp(-u * u * 2.4), l = Math.exp(-Math.pow(Math.abs(u) - 1.45, 2) * 7);
    return a - 0.09 * l;
  }

  function buildScene() {
    var W = stage.clientWidth, H = stage.clientHeight, mob = W < 760;
    var sc = mob ? 0.8 : clamp(H / 900, 0.78, 1.3);
    var y0 = Math.round(H * (mob ? (H < 720 ? 0.74 : 0.705) : (H < 860 ? 0.72 : 0.70))), band = H * (mob ? 0.10 : 0.15), yb = y0 - band;
    var tk = [30, 24, 20, 28].map(function (v) { return v * sc; }), off = [0];
    tk.forEach(function (v, i) { off.push(off[i] + v); });
    var tot = off[4];
    var xc = W * (mob ? 0.37 : 0.62), dw = mob ? W * 0.2 : Math.min(W * 0.105, 200), dd = (mob ? 58 : 84) * sc;
    var xs = W * (mob ? 0.8 : 0.86), cw = (mob ? 22 : 34) * sc;
    var X0 = -W * 0.7, X1 = W * 1.7;
    var skinY = Math.max(y0 + tot + dd + 30 * sc, H - 62 * sc);
    var lampPark = mob ? 112 * sc : H * 0.25, lampDown = (mob ? 72 : 92) * sc;
    var chipD = tk[0] + tk[1] * 1.05 + 1;
    G = { W: W, H: H, mob: mob, sc: sc, y0: y0, band: band, yb: yb, tk: tk, off: off, tot: tot, xc: xc, dw: dw, dd: dd, xs: xs, cw: cw, X0: X0, X1: X1, lampPark: lampPark, lampDown: lampDown, chipD: chipD };

    /* дальний план: свет цеха, лампы-панели, линии кузова */
    var boxes = mob ? [[0.2, 0.13, 0.15], [0.63, 0.2, 0.22], [0.93, 0.1, 0.13]] : [[0.565, 0.042, 0.27], [0.745, 0.066, 0.33], [0.945, 0.04, 0.23]];
    var fb = '';
    boxes.forEach(function (b, i) {
      var x = W * b[0], w = W * b[1], h = H * b[2], top = yb - h - H * 0.035;
      fb += '<g opacity="' + (mob ? 0.5 : 1) + '"><path d="M' + P(x) + ' ' + P(top + h) + 'V' + P(yb) + 'M' + P(x - w * 0.3) + ' ' + P(yb) + 'H' + P(x + w * 0.3) + '" stroke="#C5CED8" stroke-width="2" fill="none"/>' +
        '<rect x="' + P(x - w / 2) + '" y="' + P(top) + '" width="' + P(w) + '" height="' + P(h) + '" rx="' + P(w * 0.26) + '" fill="url(#sfBox)" stroke="#C2CCD7" stroke-width="1.5" filter="url(#sfGlow)"/>' +
        '<rect x="' + P(x - w * 0.24) + '" y="' + P(top + h * 0.06) + '" width="' + P(w * 0.16) + '" height="' + P(h * 0.88) + '" rx="' + P(w * 0.08) + '" fill="#fff" opacity=".9"/>' +
        '<rect x="' + P(x + w * 0.08) + '" y="' + P(top + h * 0.06) + '" width="' + P(w * 0.16) + '" height="' + P(h * 0.88) + '" rx="' + P(w * 0.08) + '" fill="#fff" opacity=".9"/></g>';
    });
    far.innerHTML = '<svg viewBox="0 0 ' + W + ' ' + H + '" preserveAspectRatio="none"><defs>' +
      '<linearGradient id="sfBg" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="' + H + '"><stop offset="0" stop-color="#fff"/><stop offset="' + (yb / H).toFixed(3) + '" stop-color="#EEF2F6"/><stop offset="1" stop-color="#E4E9EF"/></linearGradient>' +
      '<linearGradient id="sfBox" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#EDF2F7"/></linearGradient>' +
      '<linearGradient id="sfHaze" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F1F4F8" stop-opacity="0"/><stop offset=".62" stop-color="#F1F4F8" stop-opacity=".95"/><stop offset="1" stop-color="#F1F4F8" stop-opacity="0"/></linearGradient>' +
      '<radialGradient id="sfSun" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>' +
      '<filter id="sfGlow" x="-80%" y="-30%" width="260%" height="160%"><feDropShadow dx="0" dy="0" stdDeviation="' + P(22 * sc) + '" flood-color="#B9CBE0" flood-opacity=".9"/></filter></defs>' +
      '<rect x="' + (-W) + '" y="' + (-H) + '" width="' + (3 * W) + '" height="' + (3 * H) + '" fill="url(#sfBg)"/>' +
      '<ellipse cx="' + P(W * 0.72) + '" cy="' + P(yb - H * 0.2) + '" rx="' + P(W * 0.42) + '" ry="' + P(H * 0.42) + '" fill="url(#sfSun)"/>' +
      '<g fill="none" stroke="#D9E0E8" stroke-width="1.4">' +
      '<path d="M' + P(-W * 0.2) + ' ' + P(yb - H * 0.05) + 'C' + P(W * 0.2) + ' ' + P(yb - H * 0.5) + ' ' + P(W * 0.62) + ' ' + P(yb - H * 0.6) + ' ' + P(W * 1.25) + ' ' + P(yb - H * 0.16) + '"/>' +
      '<path d="M' + P(-W * 0.2) + ' ' + P(yb - H * 0.01) + 'C' + P(W * 0.24) + ' ' + P(yb - H * 0.4) + ' ' + P(W * 0.66) + ' ' + P(yb - H * 0.5) + ' ' + P(W * 1.25) + ' ' + P(yb - H * 0.1) + '" opacity=".6"/>' +
      '<path d="M' + P(W * 0.3) + ' ' + P(yb) + 'C' + P(W * 0.34) + ' ' + P(yb - H * 0.2) + ' ' + P(W * 0.5) + ' ' + P(yb - H * 0.2) + ' ' + P(W * 0.54) + ' ' + P(yb) + '" opacity=".7"/></g>' +
      fb +
      '<rect x="' + (-W) + '" y="' + P(yb - H * 0.16) + '" width="' + (3 * W) + '" height="' + P(H * 0.26) + '" fill="url(#sfHaze)"/>' +
      '</svg>';

    /* основной план */
    var chip = [[-cw, 0], [-cw * 0.62, tk[0] * 0.55], [-cw * 0.5, tk[0] * 1.02], [-cw * 0.2, tk[0] + tk[1] * 0.75], [cw * 0.05, tk[0] + tk[1] * 1.05], [cw * 0.3, tk[0] + tk[1] * 0.6], [cw * 0.42, tk[0] * 0.95], [cw * 0.7, tk[0] * 0.5], [cw, 0]]
      .map(function (p) { return P(xs + p[0]) + ',' + P(y0 + p[1]); }).join(' ');
    var refl = '';
    boxes.forEach(function (b) {
      var x = W * b[0], w = W * b[1] * 0.9, sk = band * 0.55;
      refl += '<polygon points="' + P(x - w / 2) + ',' + P(yb) + ' ' + P(x + w / 2) + ',' + P(yb) + ' ' + P(x + w / 2 - sk) + ',' + P(y0) + ' ' + P(x - w / 2 - sk) + ',' + P(y0) + '" fill="url(#sgRefl)"/>';
    });
    var slots = '';
    for (var sx = X0; sx < X1; sx += 230 * sc) slots += '<rect x="' + P(sx) + '" y="' + P(skinY + 20 * sc) + '" width="' + P(96 * sc) + '" height="' + P(16 * sc) + '" rx="' + P(8 * sc) + '" fill="#AAB5C2"/>';
    var yM = y0 + tot, yR = yM + dd;
    var leds = '';
    for (var li = 0; li < 6; li++) leds += '<circle cx="' + (-40 + li * 16) + '" cy="15" r="2.700" fill="#A79EFF"/>';
    main.innerHTML = '<svg viewBox="0 0 ' + W + ' ' + H + '"><defs>' +
      '<linearGradient id="sgSurf" gradientUnits="userSpaceOnUse" x1="0" y1="' + P(yb) + '" x2="0" y2="' + P(y0 + dd) + '"><stop offset="0" stop-color="#E8EEF5" stop-opacity="0"/><stop offset=".5" stop-color="#E2EAF2" stop-opacity=".95"/><stop offset="1" stop-color="#C3D2E2"/></linearGradient>' +
      '<linearGradient id="sgRefl" gradientUnits="userSpaceOnUse" x1="0" y1="' + P(yb) + '" x2="0" y2="' + P(y0) + '"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".3" stop-color="#fff" stop-opacity=".95"/><stop offset=".86" stop-color="#fff" stop-opacity="0"/></linearGradient>' +
      '<linearGradient id="sgCav" gradientUnits="userSpaceOnUse" x1="0" y1="' + P(yM) + '" x2="0" y2="' + H + '"><stop offset="0" stop-color="#D3DAE3"/><stop offset=".5" stop-color="#E6EAF0"/><stop offset="1" stop-color="#EEF1F5"/></linearGradient>' +
      '<linearGradient id="sgConeG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6A5BFF" stop-opacity=".6"/><stop offset="1" stop-color="#6A5BFF" stop-opacity=".06"/></linearGradient>' +
      '<linearGradient id="sgSkin" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#C4CCD6"/><stop offset="1" stop-color="#B3BDC9"/></linearGradient>' +
      '<radialGradient id="sgDimG"><stop offset="0" stop-color="#0F1B2D" stop-opacity=".2"/><stop offset=".6" stop-color="#0F1B2D" stop-opacity=".06"/><stop offset="1" stop-color="#0F1B2D" stop-opacity="0"/></radialGradient>' +
      '<radialGradient id="sgUvG"><stop offset="0" stop-color="#6A5BFF" stop-opacity=".75"/><stop offset="1" stop-color="#6A5BFF" stop-opacity="0"/></radialGradient>' +
      '<pattern id="sgFlake" width="17" height="11" patternUnits="userSpaceOnUse"><circle cx="3" cy="3" r=".9" fill="#fff" opacity=".5"/><circle cx="11" cy="7" r=".7" fill="#fff" opacity=".35"/><circle cx="14" cy="2" r=".5" fill="#fff" opacity=".4"/></pattern>' +
      '<pattern id="sgHatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(38)"><rect width="1.200" height="7" fill="#fff" opacity=".16"/></pattern>' +
      '<pattern id="sgGrid" width="26" height="26" patternUnits="userSpaceOnUse"><path d="M26 0H0V26" fill="none" stroke="#0F1B2D" stroke-opacity=".05"/></pattern>' +
      '<clipPath id="sgChipClip"><polygon points="' + chip + '"/></clipPath>' +
      '</defs>' +
      '<path id="sgSurfP" fill="url(#sgSurf)"/>' +
      '<g id="sgReflG">' + refl + '<polygon class="sg-sweep sc-anim" points="0,' + P(yb) + ' ' + P(W * 0.08) + ',' + P(yb) + ' ' + P(W * 0.08 - band * 0.55) + ',' + P(y0) + ' ' + P(-band * 0.55) + ',' + P(y0) + '" fill="url(#sgRefl)"/></g>' +
      '<ellipse id="sgDim" cx="' + P(xc) + '" cy="' + P(y0 + dd * 0.1) + '" rx="' + P(dw * 1.3) + '" ry="' + P(band * 0.46) + '" fill="url(#sgDimG)"/>' +
      '<ellipse id="sgSpot" cx="' + P(xs - cw * 0.5) + '" cy="' + P(y0 - 4 * sc) + '" rx="' + P(cw * 0.95) + '" ry="' + P(4.5 * sc) + '" fill="#0F1B2D" opacity=".28"/>' +
      '<path id="sgCavP" fill="url(#sgCav)"/><path id="sgCavG" fill="url(#sgGrid)"/>' +
      '<rect x="' + P(X0) + '" y="' + P(skinY) + '" width="' + P(X1 - X0) + '" height="' + P(H) + '" fill="url(#sgSkin)"/><rect x="' + P(X0) + '" y="' + P(skinY) + '" width="' + P(X1 - X0) + '" height="2" fill="#fff" opacity=".8"/>' + slots +
      '<g id="sgRod"><g id="sgRodIn"><path d="M' + P(xc - W * 0.8) + ' ' + P(H + 40 * sc) + 'L' + P(xc - 96 * sc) + ' ' + P(yR + 50 * sc) + 'Q' + P(xc - 30 * sc) + ' ' + P(yR + 46 * sc) + ' ' + P(xc - 6 * sc) + ' ' + P(yR + 14 * sc) + '" fill="none" stroke="#17243A" stroke-width="' + P(9 * sc) + '" stroke-linecap="round" stroke-linejoin="round"/>' +
      '<path d="M' + P(xc - W * 0.8) + ' ' + P(H + 37 * sc) + 'L' + P(xc - 96 * sc) + ' ' + P(yR + 47 * sc) + '" fill="none" stroke="#fff" stroke-opacity=".32" stroke-width="' + P(2 * sc) + '" stroke-linecap="round"/>' +
      '<circle cx="' + P(xc - 2 * sc) + '" cy="' + P(yR + 8 * sc) + '" r="' + P(7.5 * sc) + '" fill="#17243A"/><circle cx="' + P(xc - 4 * sc) + '" cy="' + P(yR + 5.5 * sc) + '" r="' + P(2.2 * sc) + '" fill="#fff" opacity=".55"/></g></g>' +
      '<g id="sgLayers"><path id="sgL3" fill="#7B8795"/><path id="sgL3h" fill="url(#sgHatch)"/><path id="sgL2" fill="#C5CBD3"/><path id="sgL1" fill="#2F5F8A"/><path id="sgL1f" fill="url(#sgFlake)"/><path id="sgL0" fill="#D5E3F0" fill-opacity=".94"/>' +
      '<path id="sgSep" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="1"/>' +
      '<path id="sgBot" fill="none" stroke="#4E5967" stroke-width="1.600"/>' +
      '<path id="sgEdge" fill="none" stroke="#0F1B2D" stroke-opacity=".22" stroke-width="1"/><path id="sgHi" fill="none" stroke="#fff" stroke-width="' + P(2.4 * sc) + '" stroke-linecap="round"/></g>' +
      '<g id="sgRip" fill="none" stroke="#fff" stroke-linecap="round" stroke-width="1.600">' + [9, 16, 23].map(function (r, i) { r *= sc; return '<path class="rp rp' + i + '" d="M' + P(xc - r) + ' ' + P(yM - 3 * sc) + 'A' + P(r) + ' ' + P(r) + ' 0 0 1 ' + P(xc + r) + ' ' + P(yM - 3 * sc) + '"/>'; }).join('') + '</g>' +
      '<g id="sgChip"><polygon points="' + chip + '" fill="#E7EDF4" stroke="#0F1B2D" stroke-opacity=".28" stroke-width="1"/>' +
      '<path d="M' + P(xs - cw * 0.62) + ' ' + P(y0 + tk[0] * 0.55) + 'l' + P(-cw * 0.5) + ' ' + P(tk[0] * 0.2) + 'M' + P(xs + cw * 0.7) + ' ' + P(y0 + tk[0] * 0.5) + 'l' + P(cw * 0.45) + ' ' + P(tk[0] * 0.26) + '" stroke="#0F1B2D" stroke-opacity=".3" stroke-width="1" fill="none"/>' +
      '<g clip-path="url(#sgChipClip)"><rect id="sgPoly" x="' + P(xs - cw - 2) + '" width="' + P(cw * 2 + 4) + '" y="' + P(y0 + chipD) + '" height="0" fill="#6A5BFF"/><rect id="sgPolyGl" x="' + P(xs - cw - 2) + '" width="' + P(cw * 2 + 4) + '" y="' + P(y0 + chipD) + '" height="' + P(3 * sc) + '" fill="#fff" opacity=".55"/></g>' +
      '<path id="sgChipHi" d="M' + P(xs - cw - 1) + ' ' + P(y0) + 'H' + P(xs + cw + 1) + '" stroke="#fff" stroke-width="' + P(2.4 * sc) + '" opacity="0"/></g>' +
      '<g id="sgRef"><path d="M' + P(xc - dw * 1.75) + ' ' + P(y0) + 'H' + P(xc + dw * 1.75) + '" stroke="#2F5F8A" stroke-width="1.500" stroke-dasharray="7 6" fill="none"/><path d="M' + P(xc - dw * 1.75) + ' ' + P(y0 - 7) + 'v14M' + P(xc + dw * 1.75) + ' ' + P(y0 - 7) + 'v14" stroke="#2F5F8A" stroke-width="1.500"/></g>' +
      '<ellipse id="sgUvSpot" cx="' + P(xs) + '" cy="' + P(y0) + '" rx="' + P(cw * 3.4) + '" ry="' + P(11 * sc) + '" fill="url(#sgUvG)"/>' +
      '<polygon id="sgCone" fill="url(#sgConeG)"/>' +
      '<g id="sgLamp"><g id="sgLampIn"><g transform="scale(' + sc.toFixed(3) + ')"><path d="M0 -15C6 -130 150 -210 520 -470" fill="none" stroke="#17243A" stroke-width="3"/><rect x="-64" y="-17" width="128" height="34" rx="11" fill="#17243A"/><rect x="-58" y="-13" width="116" height="9" rx="4.500" fill="#fff" opacity=".13"/><rect x="-52" y="11" width="104" height="8" rx="4" fill="#0A111E"/>' + leds + '</g></g></g>' +
      '<g id="sgApp"><g transform="scale(' + (sc * 0.78).toFixed(3) + ')"><path d="M-74 0H-3" stroke="#7F8C9B" stroke-width="1.800" stroke-linecap="round"/><rect x="-86" y="-5" width="14" height="10" rx="2" fill="#B7EA7A"/><rect x="-206" y="-11" width="122" height="22" rx="5" fill="#fff" fill-opacity=".9" stroke="#9AA7B6" stroke-width="1.500"/><rect x="-150" y="-8" width="62" height="16" rx="3" fill="#6A5BFF" opacity=".75"/><path d="M-206 0H-250M-250 -13v26M-212 -17v34" stroke="#9AA7B6" stroke-width="3" stroke-linecap="round"/><circle id="sgDrop" cx="1" cy="0" r="3.600" fill="#6A5BFF"/></g></g>' +
      '</svg>';
    ['SurfP', 'Dim', 'Spot', 'CavP', 'CavG', 'Rod', 'L0', 'L1', 'L1f', 'L2', 'L3', 'L3h', 'Sep', 'Bot', 'Edge', 'Hi', 'Rip', 'Poly', 'PolyGl', 'ChipHi', 'Ref', 'UvSpot', 'Cone', 'Lamp', 'App'].forEach(function (n) { E[n] = document.getElementById('sg' + n); });

    /* подписи слоёв */
    $$('.lb', cam).forEach(function (lb, i) {
      lb.style.left = P(W * (0.235 + 0.047 * i)) + 'px';
      lb.style.top = P(y0 + off[i] + tk[i] / 2) + 'px';
    });

    /* пыль в воздухе */
    if (!dust.firstChild) {
      var dh = '';
      for (var d = 0; d < 3; d++) {
        var dots = '', tw = 480 + d * 140, th = Math.round(tw * 0.75);
        for (var n = 0; n < 16; n++) dots += '<circle cx="' + Math.round(Math.random() * tw) + '" cy="' + Math.round(Math.random() * th) + '" r="' + (0.6 + Math.random() * 1.5).toFixed(1) + '" fill="#8FA6BF" fill-opacity="' + (0.3 + Math.random() * 0.5).toFixed(2) + '"/>';
        dh += '<svg aria-hidden="true"><defs><pattern id="sdP' + d + '" width="' + tw + '" height="' + th + '" patternUnits="userSpaceOnUse">' + dots + '</pattern></defs><rect width="100%" height="100%" fill="url(#sdP' + d + ')"/></svg>';
      }
      dust.innerHTML = dh;
    }
    st.fx = st.tx = W / 2; st.fy = st.ty = H / 2; st.cs = 1;
    st.lampA = mob ? 0 : 1;
    lastK = -1;
  }

  function paths(k) {
    var g = G, n = 56, xa = g.xc - g.dw * 2.6, xb = g.xc + g.dw * 2.6, xsArr = [], ys = [], i;
    for (i = 0; i <= n; i++) { var x = xa + (xb - xa) * i / n; xsArr.push(x); ys.push(g.y0 + k * g.dd * bump((x - g.xc) / g.dw)); }
    function line(o) { var s = ''; for (var j = 0; j <= n; j++) s += 'L' + P(xsArr[j]) + ' ' + P(ys[j] + o); return s; }
    function lineR(o) { var s = ''; for (var j = n; j >= 0; j--) s += 'L' + P(xsArr[j]) + ' ' + P(ys[j] + o); return s; }
    function layer(o1, o2) { return 'M' + P(g.X0) + ' ' + P(g.y0 + o1) + line(o1) + 'L' + P(g.X1) + ' ' + P(g.y0 + o1) + 'L' + P(g.X1) + ' ' + P(g.y0 + o2) + lineR(o2) + 'L' + P(g.X0) + ' ' + P(g.y0 + o2) + 'Z'; }
    function open(o) { return 'M' + P(g.X0) + ' ' + P(g.y0 + o) + line(o) + 'L' + P(g.X1) + ' ' + P(g.y0 + o); }
    var o = g.off, d;
    E.L0.setAttribute('d', layer(o[0], o[1]));
    d = layer(o[1], o[2]); E.L1.setAttribute('d', d); E.L1f.setAttribute('d', d);
    E.L2.setAttribute('d', layer(o[2], o[3]));
    d = layer(o[3], o[4]); E.L3.setAttribute('d', d); E.L3h.setAttribute('d', d);
    E.Sep.setAttribute('d', open(o[1]) + open(o[2]) + open(o[3]));
    E.Bot.setAttribute('d', open(o[4]));
    d = open(0); E.Edge.setAttribute('d', d); E.Hi.setAttribute('d', d);
    E.SurfP.setAttribute('d', 'M' + P(g.X0) + ' ' + P(g.yb) + 'L' + P(g.X1) + ' ' + P(g.yb) + 'L' + P(g.X1) + ' ' + P(g.y0) + lineR(0) + 'L' + P(g.X0) + ' ' + P(g.y0) + 'Z');
    d = 'M' + P(g.X0) + ' ' + P(g.y0 + o[4]) + line(o[4]) + 'L' + P(g.X1) + ' ' + P(g.y0 + o[4]) + 'V' + (g.H + 400) + 'H' + P(g.X0) + 'Z';
    E.CavP.setAttribute('d', d); E.CavG.setAttribute('d', d);
  }

  function draw(force) {
    if (!G) return;
    var g = G, k = st.k * (1 - st.tap);
    if (force || Math.abs(k - lastK) > 0.0004) { lastK = k; paths(k); }
    var ty = 'translate(0 ' + P(k * g.dd) + ')';
    E.Rod.setAttribute('transform', 'translate(0 ' + P((k - 1) * g.dd) + ')'); E.Rod.style.opacity = st.rod;
    E.Rip.setAttribute('transform', ty); E.Rip.style.opacity = st.rod * (0.25 + st.tap * 9) * Math.min(1, st.k * 4);
    E.Dim.style.opacity = k;
    E.Ref.style.opacity = st.ref;
    var fh = g.chipD * st.fill, c = st.cure;
    E.Poly.setAttribute('y', P(g.y0 + g.chipD - fh)); E.Poly.setAttribute('height', P(fh + 2));
    E.Poly.setAttribute('fill', 'rgb(' + Math.round(106 + (203 - 106) * c) + ',' + Math.round(91 + (212 - 91) * c) + ',' + Math.round(255 + (246 - 255) * c) + ')');
    E.PolyGl.setAttribute('y', P(g.y0 + g.chipD - fh)); E.PolyGl.style.opacity = st.fill > 0.02 ? 0.55 * (1 - c) : 0;
    E.ChipHi.style.opacity = c; E.Spot.style.opacity = 0.28 * (1 - st.fill);
    var gap = g.lampPark + (g.lampDown - g.lampPark) * st.lamp, ly = g.y0 - gap;
    E.Lamp.setAttribute('transform', 'translate(' + P(g.xs) + ' ' + P(ly) + ')'); E.Lamp.style.opacity = st.lampA;
    var bw = 50 * g.sc, sp = g.cw * 1.6 + gap * 0.16;
    E.Cone.setAttribute('points', P(g.xs - bw) + ',' + P(ly + 18 * g.sc) + ' ' + P(g.xs + bw) + ',' + P(ly + 18 * g.sc) + ' ' + P(g.xs + bw + sp) + ',' + P(g.y0 + 2) + ' ' + P(g.xs - bw - sp) + ',' + P(g.y0 + 2));
    E.Cone.style.opacity = st.cone * st.lampA; E.UvSpot.style.opacity = st.cone * st.lampA;
    var sl = (1 - st.app) * 130;
    E.App.setAttribute('transform', 'translate(' + P(g.xs - 3) + ' ' + P(g.y0 + g.chipD * 0.3 * (1 - st.fill) - 2) + ') rotate(52) translate(' + P(-sl) + ' 0)'); E.App.style.opacity = st.app;
    cam.style.transform = 'translate(' + P(st.tx - st.fx * st.cs) + 'px,' + P(st.ty - st.fy * st.cs) + 'px) scale(' + st.cs.toFixed(4) + ')';
    far.style.transformOrigin = P(st.tx) + 'px ' + P(st.ty) + 'px';
    far.style.transform = 'scale(' + (1 + (st.cs - 1) * 0.26).toFixed(4) + ')';
  }

  /* Сцена играет сама, по времени: PDR выправляет вмятину, полимер заполняет скол, лампа сушит.
     Прокрутка на неё не влияет. Пауза вне экрана и при reduced-motion. */
  var tapOn = true;
  function buildTimeline() {
    if (!gsap) return;
    var g = G, set = function (v) { return function () { tapOn = v; }; };
    var lampOff = g.mob ? 0 : 1;
    tl = gsap.timeline({ repeat: -1, delay: 2.4, defaults: { ease: 'sine.inOut' }, onUpdate: function () { draw(); } });
    tl.call(set(true))
      .to({}, { duration: 2.2 })
      .call(set(false))
      .to(st, { ref: 1, duration: 0.9 })
      .to(st, { k: 0, duration: 3.6, ease: 'power2.inOut' }, '<0.3')
      .to(st, { ref: 0.5, duration: 1.2 }, '>0.4')
      .to(st, { rod: 0, duration: 1 }, '<')
      .to(st, { lampA: 1, duration: 0.8 }, '<')
      .to(st, { app: 1, duration: 1, ease: 'power2.out' }, '>0.2')
      .to(st, { fill: 1, duration: 2.2 }, '>0.1')
      .to(st, { app: 0, duration: 0.8, ease: 'power2.in' }, '>0.1')
      .to(st, { lamp: 1, cone: 1, duration: 1.2 }, '<0.2')
      .to(st, { cure: 1, duration: 1.4 }, '>0.1')
      .to(st, { cone: 0.32, lamp: 0, duration: 1.4 }, '>0.3')
      .to({}, { duration: 2.6 })
      .to('#scMain', { opacity: 0, duration: 0.9, ease: 'power1.in' })
      .call(function () { st.k = 1; st.fill = 0; st.cure = 0; st.rod = 1; st.lampA = lampOff; draw(true); })
      .to('#scMain', { opacity: 1, duration: 1.1, ease: 'power1.out' });
    if (RM) { tl.progress(0.62).pause(); draw(true); }
  }

  var mVid = $('#mVid');
  if (mVid && !RM && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (en) {
      if (en[0].isIntersecting) { if (!mVid.src) mVid.src = mVid.getAttribute('data-src'); var pr = mVid.play(); if (pr && pr.catch) pr.catch(function () {}); }
      else if (!mVid.paused) mVid.pause();
    }, { threshold: 0.25 }).observe(mVid);
  }

  function intro() {
    if (!gsap || RM || introDone) { introDone = true; return; }
    introDone = true;
    var g = G;
    gsap.from(['#sgL3', '#sgL3h', '#sgL2', '#sgL1', '#sgL1f', '#sgL0'], { y: 46 * g.sc, opacity: 0, duration: D3, stagger: { each: 0.09 }, ease: EASE, delay: 0.15 });
    gsap.from(['#sgHi', '#sgEdge', '#sgSep', '#sgBot', '#sgChip'], { opacity: 0, duration: 0.6, delay: 0.95 });
    gsap.from(['#sgSurfP', '#sgReflG', '#sgDim'], { opacity: 0, duration: 1.4, delay: 0.5, ease: 'power1.out' });
    gsap.from(st, { rod: 0, duration: 0.8, delay: 1.0, onUpdate: function () { draw(); } });
    gsap.from('#sgRodIn', { x: -90 * g.sc, y: 60 * g.sc, duration: 1.1, delay: 0.9, ease: EASE });
    gsap.from('#sgLampIn', { y: -g.H * 0.4, duration: 1.2, delay: 0.7, ease: EASE });
    gsap.from(['#sgCone', '#sgUvSpot', '#sgRef'], { opacity: 0, duration: 0.8, delay: 1.5 });
    gsap.from('.lb', { opacity: 0, x: -14, duration: D2 + 0.2, stagger: STG, delay: 1.3, ease: EASE });
    gsap.from('#scFar', { opacity: 0, duration: 1.2, ease: 'power1.out' });
  }

  function setupScene() {
    if (tl) { tl.kill(); tl = null; }
    if (gsap) gsap.set('#scMain', { opacity: 1 });
    st.k = 1; st.tap = 0; st.fill = 0; st.cure = 0; st.lamp = 0; st.cone = 0.32; st.rod = 1; st.app = 0; st.ref = 0.5;
    buildScene(); draw(true); buildTimeline();
    if (ST) ST.refresh();
  }
  setupScene();
  intro();
  var lastW = window.innerWidth, lastH = window.innerHeight, rsT;
  window.addEventListener('resize', function () {
    clearTimeout(rsT);
    rsT = setTimeout(function () {
      var w = window.innerWidth, h = window.innerHeight;
      if (w === lastW && Math.abs(h - lastH) < 130) return;
      lastW = w; lastH = h; setupScene();
    }, 180);
  });

  /* фоновая жизнь сцены: лёгкие нажимы инструмента, пауза вне экрана */
  var stageOn = true;
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (en) { stageOn = en[0].isIntersecting; stage.classList.toggle('is-off', !stageOn); if (tl && !RM) { stageOn ? tl.resume() : tl.pause(); } }).observe(stage);
  }
  if (gsap && !RM) {
    gsap.ticker.add(function (time) {
      if (!stageOn || !G || document.hidden) return;
      var tap = 0;
      if (tapOn && st.k > 0.98) { var s = Math.sin(time * Math.PI * 2 / 2.8); tap = s > 0 ? Math.pow(s, 8) * 0.07 : 0; }
      if (tap !== st.tap) { st.tap = tap; draw(); }
      var leds = 0.55 + 0.45 * Math.sin(time * 3.1);
      if (E.Lamp) E.Lamp.style.setProperty('--led', leds.toFixed(2));
    });
  }

  /* ---------- Проявления ---------- */
  if (gsap && ST && !RM) {
    $$('.split').forEach(function (el) {
      ST.create({
        trigger: el, start: 'top 88%', once: true, onEnter: function () {
          if (!SplitText) return;
          try {
            var sp = SplitText.create(el, { type: 'lines', mask: 'lines' });
            gsap.from(sp.lines, { yPercent: 110, duration: D3, stagger: STG, ease: EASE, onComplete: function () { sp.revert(); relang(el); } });
          } catch (e) {}
        }
      });
    });
    gsap.set('.rv, .svc', { autoAlpha: 0, y: 28 });
    ST.batch('.rv, .svc', { start: 'top 92%', once: true, onEnter: function (b) { gsap.to(b, { autoAlpha: 1, y: 0, duration: 0.8, stagger: STG, ease: EASE, overwrite: true }); } });
    $$('.rise').forEach(function (el) {
      el.style.setProperty('--r', 1);
      gsap.to(el, { '--r': 0, duration: 1.3, ease: EASE, scrollTrigger: { trigger: el, start: 'top 84%', once: true } });
    });
    $$('.kick .ly').forEach(function (el) { gsap.from(el, { scaleX: 0, transformOrigin: 'left center', duration: 0.8, ease: EASE, scrollTrigger: { trigger: el, start: 'top 92%', once: true } }); });
    var track = $('#track');
    if (track) gsap.fromTo($('.track-svg'), { '--d': 0 }, { '--d': 1, ease: 'none', scrollTrigger: { trigger: track, start: 'top 82%', end: 'top 28%', scrub: 0.6 } });
    var cl = $('.c-lines');
    if (cl) gsap.fromTo(cl, { '--d': 0 }, { '--d': 1, ease: 'none', scrollTrigger: { trigger: cl, start: 'top 95%', end: 'top 40%', scrub: 0.6 } });
    $$('.edu-art').forEach(function (svg) {
      var ps = $$('.e-ln, .e-ref', svg);
      ps.forEach(function (p) { var L = p.getTotalLength(); if (!p.classList.contains('e-ref')) { p.style.strokeDasharray = L; p.style.strokeDashoffset = L; } });
      gsap.to($$('.e-ln', svg), { strokeDashoffset: 0, duration: 1.6, stagger: 0.12, ease: 'power2.inOut', scrollTrigger: { trigger: svg, start: 'top 80%', once: true } });
    });
    $$('[data-par]').forEach(function (el) {
      var v = parseFloat(el.getAttribute('data-par'));
      gsap.fromTo(el, { y: -v }, { y: v, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } });
    });
    $$('.about-shop img, .grp-ph > img').forEach(function (im) {
      gsap.fromTo(im, { scale: 1.12 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: im, start: 'top bottom', end: 'bottom top', scrub: true } });
    });
    gsap.from('.ftr-word', { yPercent: 70, ease: 'none', scrollTrigger: { trigger: '.ftr', start: 'top bottom', end: 'bottom bottom', scrub: 0.5 } });
    window.addEventListener('load', function () { ST.refresh(); });
  }

  /* ---------- Бегущая строка ---------- */
  (function () {
    var tr = $('#marq'); if (!tr) return;
    var set = $('.marq-set', tr), tw = null;
    for (var i = 0; i < 3; i++) tr.appendChild(set.cloneNode(true));
    function run() {
      if (!gsap || RM) return;
      if (tw) tw.kill();
      gsap.set(tr, { x: 0 });
      var w = set.getBoundingClientRect().width;
      tw = gsap.to(tr, { x: -w, duration: w / 70, ease: 'none', repeat: -1 });
    }
    run();
    document.addEventListener('langchange', function () {
      var sets = $$('.marq-set', tr);
      sets.slice(1).forEach(function (s) { s.innerHTML = sets[0].innerHTML; });
      run();
    });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(run);
    if ('IntersectionObserver' in window) new IntersectionObserver(function (en) { if (tw) en[0].isIntersecting ? tw.play() : tw.pause(); }).observe(tr.parentNode);
  })();

  /* ---------- Ленты работ ---------- */
  $$('[data-tape]').forEach(function (tp) {
    var strip = $('.tape-strip', tp), frs = $$('.fr', tp), prev = $('.prev', tp), next = $('.next', tp), nav = $('.tape-nav', tp), scale = $('.scale', tp), lbs = $$('.scale-lb span', tp);
    function step() { return frs.length > 1 ? frs[1].offsetLeft - frs[0].offsetLeft : strip.clientWidth; }
    function upd() {
      var max = strip.scrollWidth - strip.clientWidth, x = strip.scrollLeft;
      nav.hidden = max < 6;
      prev.disabled = x < 4; next.disabled = x > max - 4;
      var f = max > 0 ? clamp(x / max, 0, 1) * (frs.length - 1) : 0;
      var a = Math.floor(f), b = Math.min(frs.length - 1, a + 1), m = f - a;
      var sa = +frs[a].getAttribute('data-st'), sb = +frs[b].getAttribute('data-st');
      var p = (sa + (sb - sa) * m) / 2;
      scale.style.setProperty('--p', p.toFixed(3));
      var on = Math.round(p * 2);
      lbs.forEach(function (l) { l.classList.toggle('on', +l.getAttribute('data-st') === on); });
    }
    prev.addEventListener('click', function () { strip.scrollBy({ left: -step(), behavior: RM ? 'auto' : 'smooth' }); });
    next.addEventListener('click', function () { strip.scrollBy({ left: step(), behavior: RM ? 'auto' : 'smooth' }); });
    strip.addEventListener('scroll', upd, { passive: true });
    window.addEventListener('resize', upd);
    upd();
  });

  /* ---------- Видео-петли ---------- */
  if ('IntersectionObserver' in window) {
    var vio = new IntersectionObserver(function (en) {
      en.forEach(function (e) {
        var v = e.target;
        if (e.isIntersecting && !RM) {
          if (!v.src) v.src = v.getAttribute('data-src');
          var pr = v.play(); if (pr && pr.catch) pr.catch(function () {});
        } else if (!v.paused) v.pause();
      });
    }, { threshold: 0.5 });
    $$('video.loop').forEach(function (v) { vio.observe(v); });
  }

  /* ---------- Вопросы ---------- */
  $$('.q button').forEach(function (b) {
    b.addEventListener('click', function () {
      var q = b.parentNode, open = !q.classList.contains('open');
      q.classList.toggle('open', open); b.setAttribute('aria-expanded', open ? 'true' : 'false');
      if (ST) setTimeout(function () { ST.refresh(); }, 520);
    });
  });

  /* ---------- Форма ---------- */
  var form = $('#zayavka');
  if (form) form.addEventListener('submit', function (e) {
    e.preventDefault();
    var name = form.elements.name, phone = form.elements.phone, ok = true;
    [name, phone].forEach(function (f) {
      var bad = f === phone ? f.value.replace(/\D/g, '').length < 10 : !f.value.trim();
      f.parentNode.classList.toggle('err', bad); f.setAttribute('aria-invalid', bad ? 'true' : 'false');
      if (bad && ok) { f.focus(); ok = false; }
    });
    if (!ok) return;
    var topic = plain(t(form.elements.topic.value));
    var txt = t('wa.form').replace('{topic}', topic).replace('{name}', name.value.trim()).replace('{phone}', phone.value.trim()).replace('{msg}', form.elements.msg.value.trim() || '-');
    window.open(waUrl(txt), '_blank', 'noopener');
  });

  document.addEventListener('langchange', function () { if (ST) ST.refresh(); });
})();
