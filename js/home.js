/**
 * LEISURE — Homepage Scroll Interactions
 * Product intro sequence + Colour selector
 */
(function () {
  'use strict';

  /* ── Colour data ─────────────────────────────────────── */
  var COLOURS = [
    { num:'01', name:'Midnight\nBlack.',  desc:'Jet-black full-grain leather with aged brass hardware. The Dominator\'s most iconic colourway — bold, refined, unmistakable.' },
    { num:'02', name:'Light\nGrey.',      desc:'Brushed light grey leather with polished chrome hardware. Clean, minimal, commanding. The Dominator in its purest form.' },
  ];

  /* ── Hero video fade on scroll ───────────────────────── */
  var heroVideo = document.getElementById('heroVideo');
  window.addEventListener('scroll', function () {
    var hero = document.getElementById('hero');
    if (!hero || !heroVideo) return;
    var scrolled = window.pageYOffset;
    var heroH    = hero.offsetHeight;
    var fade     = Math.max(0, 1 - scrolled / (heroH * 0.6));
    heroVideo.style.opacity = 0.4 + fade * 0.6;
  }, { passive: true });

  /* hero content reveal after preloader */
  setTimeout(function () {
    var vhContent = document.querySelector('.vh-content');
    if (vhContent) vhContent.classList.add('revealed');
  }, 3200);

  /* ── Product sequence ────────────────────────────────── */
  var ticking1 = false;

  function updateProdSeq() {
    var sec = document.getElementById('dominator');
    if (!sec) { ticking1 = false; return; }
    var rect      = sec.getBoundingClientRect();
    var scrollable = sec.offsetHeight - window.innerHeight;
    var prog      = Math.max(0, Math.min(1, -rect.top / Math.max(scrollable, 1)));

    /* progress bar */
    var fill = document.getElementById('psProgressFill');
    if (fill) fill.style.height = (prog * 100) + '%';

    /* 3 panels: 0-33%, 33-66%, 66-100% */
    var pi = Math.min(Math.floor(prog * 3), 2) + 1;
    for (var i = 1; i <= 3; i++) {
      var p = document.getElementById('psp' + i);
      if (p) p.classList.toggle('active', i === pi);
    }

    /* scroll cue fades out */
    var cue = document.getElementById('psCue');
    if (cue) cue.style.opacity = prog < 0.05 ? '1' : '0';

    /* speaker image gentle parallax + scale */
    var img = document.getElementById('psImg');
    if (img) {
      var sc = 1 + prog * 0.06;
      img.style.transform = 'scale(' + sc + ') translateY(' + (prog * -20) + 'px)';
    }

    ticking1 = false;
  }

  /* ── Colour sequence ─────────────────────────────────── */
  var ticking2 = false;
  var currentColour = -1;

  function setColour(idx, smooth) {
    if (idx === currentColour) return;
    currentColour = idx;
    var d = COLOURS[idx];

    /* images */
    for (var i = 0; i < 2; i++) {
      var img = document.getElementById('ci' + i);
      if (img) img.classList.toggle('active', i === idx);
    }

    /* swatches */
    document.querySelectorAll('.csw').forEach(function (sw) {
      sw.classList.toggle('active', parseInt(sw.dataset.c) === idx);
    });

    /* info text — crossfade */
    var num  = document.getElementById('colourNum');
    var name = document.getElementById('colourName');
    var desc = document.getElementById('colourDesc');
    if (!num || !name || !desc) return;

    if (smooth) {
      [num, name, desc].forEach(function (el) { el.style.opacity = '0'; el.style.transform = 'translateY(12px)'; });
      setTimeout(function () {
        num.textContent  = d.num + ' / Five Colourways';
        name.innerHTML   = d.name.replace('\n', '<br>');
        desc.textContent = d.desc;
        [num, name, desc].forEach(function (el) { el.style.opacity = ''; el.style.transform = ''; });
      }, 260);
    } else {
      num.textContent  = d.num + ' / Five Colourways';
      name.innerHTML   = d.name.replace('\n', '<br>');
      desc.textContent = d.desc;
    }
  }

  function updateColourSeq() {
    var sec = document.getElementById('colours');
    if (!sec) { ticking2 = false; return; }
    var rect      = sec.getBoundingClientRect();
    var scrollable = sec.offsetHeight - window.innerHeight;
    var prog      = Math.max(0, Math.min(1, -rect.top / Math.max(scrollable, 1)));

    /* progress bar */
    var fill = document.getElementById('colourProgressFill');
    if (fill) fill.style.height = (prog * 100) + '%';

    /* 5 colours evenly across scroll */
    var ci = Math.min(Math.floor(prog * 2), 1);
    setColour(ci, true);

    ticking2 = false;
  }

  /* ── Scroll listener ─────────────────────────────────── */
  window.addEventListener('scroll', function () {
    if (!ticking1) { requestAnimationFrame(updateProdSeq);    ticking1 = true; }
    if (!ticking2) { requestAnimationFrame(updateColourSeq);  ticking2 = true; }
  }, { passive: true });

  /* ── Manual swatch click ─────────────────────────────── */
  document.querySelectorAll('.csw').forEach(function (sw) {
    sw.addEventListener('click', function () {
      setColour(parseInt(sw.dataset.c), true);
    });
  });

  /* ── EQ bars ─────────────────────────────────────────── */
  var eqEl = document.getElementById('eqBars');
  if (eqEl) {
    var heights = [18,32,48,38,56,42,60,52,44,36,54,46,58,50,40,62,48,36,54,42,60,38,52,44,58,46,50,40,62,36,48,54];
    for (var j = 0; j < 32; j++) {
      var b = document.createElement('div');
      b.className = 'eq-bar';
      b.style.height = heights[j] + 'px';
      b.style.animationDelay = (j * 0.038) + 's';
      b.style.animationDuration = (0.85 + (j % 5) * 0.18) + 's';
      eqEl.appendChild(b);
    }
  }

  /* init */
  setColour(0, false);
  updateProdSeq();
})();
