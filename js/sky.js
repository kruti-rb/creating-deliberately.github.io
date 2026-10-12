// The night sky behind everything: twinkling stars with a little depth, and the occasional meteor.
(function () {
  'use strict';

  const canvas = document.getElementById('sky');
  const ctx = canvas.getContext('2d');

  const TAU = Math.PI * 2;
  const TINTS = ['255,250,240', '255,250,240', '255,250,240', '205,215,255', '225,205,255', '236,201,138'];

  let w = 0, h = 0;
  let stars = [];
  let meteor = null;
  let nextMeteor = 5000;
  let scrollY = 0;

  function build() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const count = Math.min(900, Math.round((w * h) / 2300));
    stars = Array.from({ length: count }, () => {
      const depth = Math.pow(Math.random(), 2.2); // most stars are far away
      return {
        x: Math.random() * w,
        y: Math.random() * h,
        r: 0.35 + depth * 1.4,
        alpha: 0.25 + depth * 0.7,
        speed: 0.4 + Math.random() * 1.6,
        phase: Math.random() * TAU,
        depth,
        tint: TINTS[(Math.random() * TINTS.length) | 0],
      };
    });
  }

  function drawStars(t) {
    for (const s of stars) {
      let y = (s.y - scrollY * (0.03 + s.depth * 0.12)) % h;
      if (y < 0) y += h;
      const twinkle = 0.6 + 0.4 * Math.sin(t * 0.001 * s.speed + s.phase);
      const a = s.alpha * twinkle;

      ctx.fillStyle = 'rgba(' + s.tint + ',' + a + ')';
      ctx.beginPath();
      ctx.arc(s.x, y, s.r, 0, TAU);
      ctx.fill();

      // The brightest few get a four-point glint.
      if (s.depth > 0.9) {
        const len = s.r * 4.5 * twinkle;
        ctx.strokeStyle = 'rgba(' + s.tint + ',' + a * 0.45 + ')';
        ctx.lineWidth = 0.6;
        ctx.beginPath();
        ctx.moveTo(s.x - len, y);
        ctx.lineTo(s.x + len, y);
        ctx.moveTo(s.x, y - len);
        ctx.lineTo(s.x, y + len);
        ctx.stroke();
      }
    }
  }

  function drawMeteor(t) {
    if (!meteor) {
      if (t < nextMeteor) return;
      const angle = Math.PI * (0.14 + Math.random() * 0.1);
      meteor = {
        x: w * (0.1 + Math.random() * 0.7),
        y: h * Math.random() * 0.35,
        dx: Math.cos(angle),
        dy: Math.sin(angle),
        born: t,
        life: 700 + Math.random() * 500,
        reach: 260 + Math.random() * 260,
      };
    }

    const p = (t - meteor.born) / meteor.life;
    if (p >= 1) {
      meteor = null;
      nextMeteor = t + 8000 + Math.random() * 12000;
      return;
    }

    const headX = meteor.x + meteor.dx * meteor.reach * p;
    const headY = meteor.y + meteor.dy * meteor.reach * p;
    const tail = 110 * Math.sin(p * Math.PI);
    const g = ctx.createLinearGradient(headX - meteor.dx * tail, headY - meteor.dy * tail, headX, headY);
    g.addColorStop(0, 'rgba(255,250,240,0)');
    g.addColorStop(1, 'rgba(255,250,240,' + 0.85 * Math.sin(p * Math.PI) + ')');
    ctx.strokeStyle = g;
    ctx.lineWidth = 1.2;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(headX - meteor.dx * tail, headY - meteor.dy * tail);
    ctx.lineTo(headX, headY);
    ctx.stroke();
  }

  function frame(t) {
    ctx.clearRect(0, 0, w, h);
    drawStars(t);
    drawMeteor(t);
    requestAnimationFrame(frame);
  }

  window.addEventListener('scroll', function () { scrollY = window.scrollY; }, { passive: true });

  // Mobile browsers fire resize as the address bar slides away; ignore those small changes.
  window.addEventListener('resize', function () {
    if (window.innerWidth === w && Math.abs(window.innerHeight - h) < 140) return;
    build();
  });

  build();
  requestAnimationFrame(frame);
})();
