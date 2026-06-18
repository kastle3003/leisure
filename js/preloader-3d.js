/**
 * LEISURE — Speaker Opening Preloader
 */
(function () {
  'use strict';

  var canvas = document.getElementById('plCanvas');
  if (!canvas) return;

  var SIZE = 280;
  canvas.width  = SIZE;
  canvas.height = SIZE;
  canvas.style.width  = SIZE + 'px';
  canvas.style.height = SIZE + 'px';
  var ctx = canvas.getContext('2d');
  var cx = SIZE / 2, cy = SIZE / 2;
  var R = 118;

  /* ── easing ─────────────────────────────────────────── */
  function easeOutCubic(t)  { return 1 - Math.pow(1 - t, 3); }
  function easeOutBack(t)   { var c = 1.70158; return 1 + (c+1)*Math.pow(t-1,3) + c*Math.pow(t-1,2); }
  function clamp(v,a,b)     { return Math.max(a, Math.min(b, v)); }
  function norm(t,a,b)      { return clamp((t-a)/(b-a), 0, 1); }

  /* ── sound wave rings ───────────────────────────────── */
  var waves = [];
  function spawnWave() { waves.push({ born: performance.now() }); }

  function drawWaves(now) {
    waves = waves.filter(function (w) {
      var age = (now - w.born) / 1000;
      if (age > 1.5) return false;
      var t   = age / 1.5;
      var r   = R * (1.05 + t * 2.0);
      var a   = 0.65 * (1 - t) * (1 - t);
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(196,149,106,' + a + ')';
      ctx.lineWidth   = 1.8 * (1 - t * 0.7);
      ctx.stroke();
      return true;
    });
  }

  /* ── speaker drawing ────────────────────────────────── */
  function drawSpeaker(open, excursion) {
    var p = open;

    /* ambient glow */
    var ag = ctx.createRadialGradient(cx, cy, 0, cx, cy, R * 1.6);
    ag.addColorStop(0,   'rgba(196,149,106,' + (p * 0.10) + ')');
    ag.addColorStop(0.5, 'rgba(196,149,106,' + (p * 0.03) + ')');
    ag.addColorStop(1,   'rgba(0,0,0,0)');
    ctx.fillStyle = ag;
    ctx.fillRect(0, 0, SIZE, SIZE);

    /* outer rim */
    var rimP = clamp(p * 1.6, 0, 1);
    ctx.beginPath();
    ctx.arc(cx, cy, R * rimP, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(196,149,106,' + rimP + ')';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    /* mounting gasket */
    if (p > 0.08) {
      var gp = easeOutCubic(norm(p, 0.08, 0.38));
      ctx.beginPath();
      ctx.arc(cx, cy, R * 0.92 * gp, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(40,30,20,' + (gp * 0.9) + ')';
      ctx.lineWidth = 10;
      ctx.stroke();
    }

    /* surround (rubber roll) */
    if (p > 0.14) {
      var sp = easeOutCubic(norm(p, 0.14, 0.48));
      var sR = R * 0.84 * sp;
      var sg = ctx.createRadialGradient(cx, cy, sR * 0.80, cx, cy, sR);
      sg.addColorStop(0,   'rgba(22,17,12,' + sp + ')');
      sg.addColorStop(0.6, 'rgba(38,28,18,' + sp + ')');
      sg.addColorStop(1,   'rgba(14,10,7,'  + sp + ')');
      ctx.beginPath();
      ctx.arc(cx, cy, sR, 0, Math.PI * 2);
      ctx.fillStyle = sg;
      ctx.fill();
      /* highlight arc */
      ctx.beginPath();
      ctx.arc(cx, cy, sR * 0.95, -Math.PI * 0.75, -Math.PI * 0.25);
      ctx.strokeStyle = 'rgba(196,149,106,' + (sp * 0.28) + ')';
      ctx.lineWidth = 3.5;
      ctx.stroke();
    }

    /* cone body */
    if (p > 0.26) {
      var cp = easeOutCubic(norm(p, 0.26, 0.60));
      var cR = R * 0.70 * cp;
      var ofY = -excursion * 0.25;
      var cg = ctx.createRadialGradient(cx, cy + ofY, 0, cx, cy, cR);
      cg.addColorStop(0,    'rgba(65,50,35,'  + cp + ')');
      cg.addColorStop(0.30, 'rgba(35,26,18,'  + cp + ')');
      cg.addColorStop(0.65, 'rgba(20,15,10,'  + cp + ')');
      cg.addColorStop(1,    'rgba(8, 6, 4,'   + cp + ')');
      ctx.beginPath();
      ctx.arc(cx, cy, cR, 0, Math.PI * 2);
      ctx.fillStyle = cg;
      ctx.fill();
      /* concentric cone rings */
      for (var i = 1; i <= 5; i++) {
        ctx.beginPath();
        ctx.arc(cx, cy, cR * (0.18 + i * 0.145), 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(196,149,106,' + (cp * 0.09) + ')';
        ctx.lineWidth = 0.7;
        ctx.stroke();
      }
    }

    /* voice-coil ring */
    if (p > 0.46) {
      var vp = easeOutCubic(norm(p, 0.46, 0.70));
      ctx.beginPath();
      ctx.arc(cx, cy, R * 0.26 * vp, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(196,149,106,' + (vp * 0.55) + ')';
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    /* dust cap — gold dome, easeOutBack bounce */
    if (p > 0.52) {
      var dp  = easeOutBack(clamp(norm(p, 0.52, 0.85), 0, 1));
      var dR  = R * 0.19 * dp;
      var dg  = ctx.createRadialGradient(cx - dR*0.26, cy - dR*0.26, 0, cx, cy, dR);
      dg.addColorStop(0,    'rgba(248,210,155,' + dp + ')');
      dg.addColorStop(0.40, 'rgba(196,149,106,' + dp + ')');
      dg.addColorStop(0.78, 'rgba(155,108,65,'  + dp + ')');
      dg.addColorStop(1,    'rgba(110, 75,40,'  + dp + ')');
      ctx.beginPath();
      ctx.arc(cx, cy, dR, 0, Math.PI * 2);
      ctx.fillStyle = dg;
      ctx.fill();
      /* broad specular */
      ctx.beginPath();
      ctx.arc(cx - dR*0.28, cy - dR*0.28, dR * 0.35, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,245,210,' + (dp * 0.42) + ')';
      ctx.fill();
      /* sharp hot-spot */
      ctx.beginPath();
      ctx.arc(cx - dR*0.18, cy - dR*0.22, dR * 0.1, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,255,245,' + (dp * 0.72) + ')';
      ctx.fill();
    }
  }

  /* ── main loop ──────────────────────────────────────── */
  var t0       = performance.now();
  var lastWave = 0;
  var OPEN_DUR  = 1600; // ms to fully open
  var PULSE_AT  = 1450; // ms when cone starts pulsing
  var WAVE_INT  = 440;  // ms between waves
  var raf;

  function loop(now) {
    var elapsed = now - t0;
    ctx.clearRect(0, 0, SIZE, SIZE);

    var openT = easeOutCubic(clamp(elapsed / OPEN_DUR, 0, 1));

    /* excursion */
    var excursion = 0;
    if (elapsed > PULSE_AT) {
      var pa = (elapsed - PULSE_AT) / 1000;
      excursion = Math.max(0, Math.sin(pa * Math.PI * 2 * 1.05)) * 9 * Math.min(pa * 2, 1);
    }

    /* spawn waves at peak positive excursion */
    if (elapsed > PULSE_AT && elapsed - lastWave > WAVE_INT) {
      spawnWave();
      lastWave = elapsed;
    }

    drawWaves(now);
    drawSpeaker(openT, excursion);

    raf = requestAnimationFrame(loop);
  }

  raf = requestAnimationFrame(loop);

  var pl = document.getElementById('preloader');
  if (pl) {
    new MutationObserver(function (ms) {
      ms.forEach(function (m) {
        if (m.attributeName === 'class' && pl.classList.contains('preloader-hidden'))
          cancelAnimationFrame(raf);
      });
    }).observe(pl, { attributes: true });
  }
})();
