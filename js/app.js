// Turns js/entries.js and js/sections.js into the cover, the tabs and the reading pages.
(function () {
  'use strict';

  const book = window.BOOK || {};
  const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  // Oldest first, so an item's number never changes as newer ones are added.
  function ordered(list) {
    return (list || [])
      .slice()
      .reverse()
      .sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0))
      .map((p, i) => Object.assign({}, p, { id: p.id || slug(p.title), number: i + 1 }));
  }

  const pages = ordered(window.ENTRIES);
  const reviews = ordered(window.REVIEWS);
  const flows = ordered(window.FLOWS);
  // Pursuits keep the order they are written in.
  const pursuits = (window.PURSUITS || []).map((p, i) => Object.assign({}, p, { id: p.id || slug(p.title), number: i + 1 }));

  const views = {
    home: document.getElementById('home'),
    section: document.getElementById('section'),
    reader: document.getElementById('reader'),
  };
  const pageEl = document.getElementById('page');

  let currentTab = null;
  let listScroll = { tab: null, y: 0 };
  let around = {};

  // ── helpers ──────────────────────────────────────────────────
  function slug(s) {
    return String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  function roman(n) {
    const map = [[1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'], [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'], [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']];
    let out = '';
    for (const [v, r] of map) while (n >= v) { out += r; n -= v; }
    return out;
  }

  function formatDate(iso, short) {
    const [y, m, d] = String(iso).split('-').map(Number);
    if (!MONTHS[m - 1]) return String(iso);
    return short ? d + ' ' + MONTHS[m - 1].slice(0, 3) : d + ' ' + MONTHS[m - 1] + ' ' + y;
  }

  function inline(text) {
    return esc(text)
      .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/\*([^*]+)\*/g, '<em>$1</em>');
  }

  // A line like ![caption](media/photo.jpg) — a picture, a video file, or a YouTube/Vimeo link.
  const MEDIA_LINE = /^!\[([^\]]*)\]\(([^)]+)\)$/;
  const isMedia = (block) => block.split('\n').every((l) => MEDIA_LINE.test(l));

  function media(src, caption, cls) {
    src = String(src || '').trim();
    if (!/^https?:\/\//.test(src) && src.includes(':')) return '';
    const yt = src.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([\w-]{11})/);
    const vimeo = src.match(/vimeo\.com\/(\d+)/);
    let inner;
    if (yt || vimeo) {
      const url = yt ? 'https://www.youtube-nocookie.com/embed/' + yt[1] : 'https://player.vimeo.com/video/' + vimeo[1];
      inner = '<div class="frame"><iframe src="' + url + '" title="' + esc(caption || 'Video') + '" loading="lazy" ' +
        'allow="encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe></div>';
    } else if (/\.(mp4|webm|mov|m4v|ogv)([?#]|$)/i.test(src)) {
      inner = '<video src="' + esc(src) + '" controls playsinline preload="metadata"></video>';
    } else {
      inner = '<img src="' + esc(src) + '" alt="' + esc(caption) + '" loading="lazy">';
    }
    return '<figure class="media' + (cls ? ' ' + cls : '') + '">' + inner +
      (caption ? '<figcaption>' + inline(caption) + '</figcaption>' : '') + '</figure>';
  }

  function mediaGroup(items) {
    const html = items.map((m) => media(m.src, m.caption)).join('');
    return items.length > 1 ? '<div class="gallery">' + html + '</div>' : html;
  }

  function blocks(body) {
    return String(body || '')
      .split('\n')
      .map((line) => line.trim())
      .join('\n')
      .trim()
      .split(/\n{2,}/)
      .filter(Boolean);
  }

  function render(body) {
    return blocks(body).map((block) => {
      const lines = block.split('\n');
      if (/^(-{3,}|\*{3,})$/.test(block)) return '<div class="break" aria-hidden="true">✦✦✦</div>';
      if (isMedia(block)) {
        return mediaGroup(lines.map((l) => { const m = l.match(MEDIA_LINE); return { caption: m[1], src: m[2] }; }));
      }
      if (block.startsWith('## ')) return '<h3>' + inline(block.slice(3)) + '</h3>';
      if (lines.every((l) => l.startsWith('>'))) {
        return '<blockquote>' + lines.map((l) => inline(l.replace(/^>\s?/, ''))).join('<br>') + '</blockquote>';
      }
      return '<p>' + lines.map(inline).join('<br>') + '</p>';
    }).join('\n');
  }

  function excerpt(body, max) {
    const first = blocks(body).find((b) => !/^(-{3,}|\*{3,})$/.test(b) && !isMedia(b)) || '';
    const text = first
      .replace(/^(##|>)\s?/gm, '')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/\*/g, '')
      .replace(/\n/g, ' / ');
    if (text.length <= max) return text;
    return text.slice(0, text.lastIndexOf(' ', max)).replace(/[\s,;:/.]+$/, '') + '…';
  }

  function rating(n) {
    const r = Math.max(0, Math.min(5, Math.round(Number(n) || 0)));
    return '<span class="rating" role="img" aria-label="' + r + ' out of 5">' +
      '★'.repeat(r) + '<span class="rating-off">' + '★'.repeat(5 - r) + '</span></span>';
  }

  // Names from js/stickers.js → sticker markup.
  let stickerCount = 0;
  function stickers(names) {
    const drawn = window.STICKERS || {};
    const pictures = window.STICKER_IMAGES || {};
    return names.filter((n) => drawn[n] || pictures[n]).map((n, i) =>
      '<span class="sticker s-' + n + '" style="--i:' + i + '">' +
        (pictures[n]
          ? '<img src="' + esc(pictures[n]) + '" alt="">'
          // each copy needs its own gradient ids, or copies on a hidden tab break the visible ones
          : drawn[n].replace(/GRAD_/g, 'g' + (stickerCount++) + '-')) +
      '</span>'
    ).join('');
  }

  function sectionHead(eyebrow, title, lead, names) {
    return '<header class="sec-head">' +
      '<div>' +
        '<p class="eyebrow">' + esc(eyebrow) + '</p>' +
        '<h1 class="sec-title">' + esc(title) + '</h1>' +
        (lead ? '<p class="sec-lead">' + inline(lead) + '</p>' : '') +
      '</div>' +
      '<div class="sec-stickers" aria-hidden="true">' + stickers(names || []) + '</div>' +
    '</header>';
  }

  function empty(text) {
    return '<p class="toc-empty">' + text + '</p>';
  }

  // ── home ─────────────────────────────────────────────────────
  function buildHome() {
    document.querySelectorAll('[data-book]').forEach((el) => {
      el.textContent = book[el.dataset.book] || '';
    });
    document.querySelectorAll('[data-stickers]').forEach((el) => {
      el.innerHTML = stickers(el.dataset.stickers.split(/\s+/));
    });

    const toc = document.getElementById('toc');
    const meta = document.getElementById('contents-meta');
    const latest = pages[pages.length - 1];

    if (!latest) {
      document.getElementById('read-latest').hidden = true;
      toc.innerHTML = '<li class="toc-empty">The first page has not been written yet.</li>';
      return;
    }

    document.getElementById('read-latest').href = '#/p/' + encodeURIComponent(latest.id);
    meta.textContent = pages.length + (pages.length === 1 ? ' page' : ' pages') + ' · Last written ' + formatDate(latest.date);

    toc.innerHTML = pages.slice().reverse().map((p) =>
      '<li><a class="toc-item" href="#/p/' + encodeURIComponent(p.id) + '">' +
        '<span class="toc-num">' + roman(p.number) + '</span>' +
        '<span class="toc-main">' +
          '<span class="toc-title">' + esc(p.title) + '</span>' +
          '<span class="toc-excerpt">' + esc(excerpt(p.body, 150)) + '</span>' +
        '</span>' +
        '<span class="toc-date">' + formatDate(p.date) + '</span>' +
      '</a></li>'
    ).join('');

    document.getElementById('to-contents').addEventListener('click', () => {
      const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      document.getElementById('contents').scrollIntoView({ behavior: calm ? 'auto' : 'smooth' });
    });
  }

  // ── tabs ─────────────────────────────────────────────────────
  const TABS = {
    career: {
      title: 'Career Trails',
      html() {
        const me = window.PROFILE || {};
        const groups = (me.sections || []).map((g) =>
          '<section class="block">' +
            '<h2 class="block-title">' + esc(g.heading) + '</h2>' +
            '<ul class="rows">' + (g.items || []).map((it) =>
              '<li>' +
                '<span class="row-when">' + esc(it.when) + '</span>' +
                '<div>' +
                  '<h3 class="row-title">' + esc(it.title) + '</h3>' +
                  (it.place ? '<p class="row-place">' + esc(it.place) + '</p>' : '') +
                  (it.note ? '<p class="row-note">' + inline(it.note) + '</p>' : '') +
                '</div>' +
              '</li>'
            ).join('') + '</ul>' +
          '</section>'
        ).join('');

        const skills = (me.skills || []).length
          ? '<section class="block"><h2 class="block-title">Skills</h2><ul class="chips">' +
              me.skills.map((s) => '<li>' + esc(s) + '</li>').join('') + '</ul></section>'
          : '';

        const links = (me.links || []).filter((l) => /^(https?:|mailto:)/.test(l.url));
        const elsewhere = links.length
          ? '<section class="block"><h2 class="block-title">Elsewhere</h2><ul class="links">' +
              links.map((l) => '<li><a href="' + esc(l.url) + '"' + (l.url.startsWith('http') ? ' target="_blank" rel="noopener"' : '') + '>' +
                esc(l.label) + ' <span aria-hidden="true">↗</span></a></li>').join('') + '</ul></section>'
          : '';

        return sectionHead('Career Trails', me.name || '', me.role, ['nerdy', 'ballot']) +
          '<div class="prose profile-intro">' + render(me.intro) + '</div>' +
          groups + skills + elsewhere;
      },
    },

    pursuits: {
      title: 'Pursuits',
      html() {
        return sectionHead('Pursuits', 'What I chase', window.PURSUITS_INTRO, ['dance', 'books', 'spacecraft']) +
          (pursuits.length
            ? '<ul class="cards">' + pursuits.map((p) =>
                '<li><a class="card" href="#/pursuits/' + encodeURIComponent(p.id) + '">' +
                  (p.image ? '<img class="card-image" src="' + esc(p.image) + '" alt="" loading="lazy">' : '') +
                  '<span class="card-top"><span>' + String(p.number).padStart(2, '0') + '</span>' +
                    (p.status ? '<span class="card-status">' + esc(p.status) + '</span>' : '') + '</span>' +
                  '<span class="card-title">' + esc(p.title) + '</span>' +
                  (p.summary ? '<span class="card-body">' + inline(p.summary) + '</span>' : '') +
                  '<span class="card-open">Open <span aria-hidden="true">→</span></span>' +
                '</a></li>'
              ).join('') + '</ul>'
            : empty('Nothing here yet.'));
      },
    },

    musings: {
      title: 'Bookish Musings',
      html() {
        return sectionHead('Bookish Musings', 'From the shelf', window.REVIEWS_INTRO, ['books', 'pen']) +
          (reviews.length
            ? '<ol class="toc" reversed>' + reviews.slice().reverse().map((r) =>
                '<li><a class="toc-item" href="#/musings/' + encodeURIComponent(r.id) + '">' +
                  '<span class="toc-num">' + roman(r.number) + '</span>' +
                  '<span class="toc-main">' +
                    '<span class="toc-title">' + esc(r.title) + '</span>' +
                    '<span class="toc-by">' + esc(r.author) + '</span>' +
                    '<span class="toc-excerpt">' + esc(r.verdict || excerpt(r.body, 150)) + '</span>' +
                  '</span>' +
                  '<span class="toc-date">' + rating(r.rating) + '</span>' +
                '</a></li>'
              ).join('') + '</ol>'
            : empty('No musings yet.'));
      },
    },

    flows: {
      title: 'Rhythmic Flows',
      html() {
        return sectionHead('Rhythmic Flows', 'In rhythm', window.FLOWS_INTRO, ['music', 'dance']) +
          (flows.length
            ? '<ul class="tiles">' + flows.slice().reverse().map((f) =>
                '<li><a class="tile" href="#/flows/' + encodeURIComponent(f.id) + '">' +
                  (f.cover
                    ? '<img class="tile-thumb" src="' + esc(f.cover) + '" alt="" loading="lazy">'
                    : '<span class="tile-lines">' + esc(excerpt(f.body, 220)).replace(/ \/ /g, '<br>') + '</span>') +
                  '<span class="tile-meta">' +
                    '<span class="tile-kind"><span>' + esc(f.kind) + '</span><span>' + formatDate(f.date, true) + '</span></span>' +
                    '<span class="tile-title">' + esc(f.title) + '</span>' +
                  '</span>' +
                '</a></li>'
              ).join('') + '</ul>'
            : empty('Nothing here yet.'));
      },
    },

    happenings: {
      title: 'Happenings',
      html() {
        const list = (window.HAPPENINGS || []).slice().sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
        let year = '';
        const items = list.map((h) => {
          const y = String(h.date).slice(0, 4);
          const heading = y !== year ? '<li class="timeline-year">' + esc(y) + '</li>' : '';
          year = y;
          return heading +
            '<li class="timeline-item">' +
              '<span class="timeline-date">' + formatDate(h.date, true) + '</span>' +
              '<div>' +
                '<h2 class="timeline-title">' + esc(h.title) + '</h2>' +
                (h.note ? '<p class="timeline-note">' + inline(h.note) + '</p>' : '') +
                mediaGroup([].concat(h.media || []).map((src) => ({ src }))) +
              '</div>' +
            '</li>';
        }).join('');
        return sectionHead('Happenings', 'Lately', window.HAPPENINGS_INTRO, ['rocket', 'astronaut', 'spacecraft']) +
          (list.length ? '<ol class="timeline">' + items + '</ol>' : empty('Nothing to report yet.'));
      },
    },
  };

  function showTab(name) {
    views.section.innerHTML = '<div class="section-wrap section--' + name + '">' + TABS[name].html() + '</div>';
    show('section');
    document.title = TABS[name].title + ' · ' + (book.title || '');
  }

  // ── reader ───────────────────────────────────────────────────
  function pagerLink(item, base, label) {
    if (!item) return '';
    return '<a href="' + base + encodeURIComponent(item.id) + '">' +
      '<span class="pager-label">' + label + '</span>' +
      '<span class="pager-title">' + esc(item.title) + '</span></a>';
  }

  function showReading(list, i, o) {
    const item = list[i];
    around = {
      prev: list[i - 1] && o.base + encodeURIComponent(list[i - 1].id),
      next: list[i + 1] && o.base + encodeURIComponent(list[i + 1].id),
      back: o.back,
    };

    pageEl.innerHTML =
      '<a class="back" href="' + o.back + '"><span aria-hidden="true">←</span> ' + o.backLabel + '</a>' +
      '<header class="page-head">' +
        '<p class="page-num">' + o.kicker + '</p>' +
        '<h1 class="page-title">' + esc(item.title) + '</h1>' +
        '<p class="page-date">' + o.meta + '</p>' +
      '</header>' +
      (item.cover || o.cover ? media(item.cover || o.cover, '', 'page-cover') : '') +
      '<div class="prose">' + render(item.body) + '</div>' +
      '<div class="endmark" aria-hidden="true">✦</div>' +
      '<nav class="pager" aria-label="Earlier and later">' +
        pagerLink(list[i - 1], o.base, '<span aria-hidden="true">←</span> ' + (o.prev || 'Earlier')) +
        pagerLink(list[i + 1], o.base, (o.next || 'Later') + ' <span aria-hidden="true">→</span>') +
      '</nav>';

    show('reader');
    document.title = item.title + ' · ' + (book.title || '');
  }

  function showPage(i) {
    showReading(pages, i, {
      base: '#/p/', back: '#/', backLabel: 'Contents',
      kicker: 'Page ' + roman(pages[i].number),
      meta: formatDate(pages[i].date),
    });
  }

  function showReview(i) {
    const r = reviews[i];
    showReading(reviews, i, {
      base: '#/musings/', back: '#/musings', backLabel: 'Bookish Musings',
      kicker: 'Bookish musing',
      meta: (r.author ? esc(r.author) + ' · ' : '') + rating(r.rating) + ' · ' + formatDate(r.date),
    });
  }

  function showFlow(i) {
    const f = flows[i];
    showReading(flows, i, {
      base: '#/flows/', back: '#/flows', backLabel: 'Rhythmic Flows',
      kicker: esc(f.kind || 'Rhythmic flow'),
      meta: formatDate(f.date),
    });
  }

  function showPursuit(i) {
    const p = pursuits[i];
    showReading(pursuits, i, {
      base: '#/pursuits/', back: '#/pursuits', backLabel: 'Pursuits',
      kicker: 'Pursuit ' + String(p.number).padStart(2, '0'),
      meta: [p.status, p.summary].filter(Boolean).map(esc).join(' · '),
      prev: 'Previous', next: 'Next',
      cover: p.image,
    });
  }

  // Things that open in the reader: the first part of the address → where they live.
  const SHELVES = {
    p: { list: pages, tab: 'home', show: showPage },
    musings: { list: reviews, tab: 'musings', show: showReview },
    flows: { list: flows, tab: 'flows', show: showFlow },
    pursuits: { list: pursuits, tab: 'pursuits', show: showPursuit },
  };

  function showHome() {
    show('home');
    document.title = book.title || '';
    if (layoutStickers) layoutStickers();
  }

  // ── orbiting stickers ────────────────────────────────────────
  // The stickers travel round the title on a single wide ellipse, evenly spaced, all the same way.
  // The ellipse is always large enough to pass clear of the words; on a narrow screen that means
  // its sides run off the edges, and the stickers cross above and below the title.
  let layoutStickers = null;

  function startFloating() {
    const field = document.querySelector('.stickers');
    const cover = field && field.parentElement;
    if (!cover || !field.children.length) return;

    const LAP = 150; // seconds for one full orbit
    const floaters = Array.from(field.children)
      .map((el) => ({ el, order: Math.random() }))
      .sort((a, b) => a.order - b.order);
    floaters.forEach((f, i) => {
      f.angle = (i / floaters.length) * Math.PI * 2;
      f.phase = Math.random() * Math.PI * 2;
    });

    const line = document.createElement('div');
    line.className = 'orbit-line';
    field.insertBefore(line, field.firstChild);

    let orbit = null;
    let size = 0;

    layoutStickers = function () {
      if (!cover.clientWidth) return; // the cover is on a hidden tab
      const W = cover.clientWidth;
      const H = cover.clientHeight;
      size = floaters[0].el.offsetWidth || 80;

      const box = cover.getBoundingClientRect();
      const words = cover.querySelector('.cover-inner').getBoundingClientRect();
      const cx = (words.left + words.right) / 2 - box.left;
      const cy = (words.top + words.bottom) / 2 - box.top;

      // the block the orbit has to stay outside of: the words plus room for a sticker
      const halfW = words.width / 2 + size * 0.75;
      const halfH = words.height / 2 + size * 0.75;

      const ry = Math.min(cy, H - cy) - size * 0.7;
      orbit = null;
      if (ry > halfH * 1.04) {
        const clear = (halfW / Math.sqrt(1 - (halfH / ry) * (halfH / ry))) * 1.04;
        orbit = { cx, cy, ry, rx: Math.max(W / 2 - size * 0.8, clear) };
      }

      field.hidden = !orbit;
      if (!orbit) return;
      line.style.left = (orbit.cx - orbit.rx) + 'px';
      line.style.top = (orbit.cy - orbit.ry) + 'px';
      line.style.width = orbit.rx * 2 + 'px';
      line.style.height = orbit.ry * 2 + 'px';
    };

    let last = performance.now();
    function frame(now) {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (orbit && cover.clientWidth) {
        const t = now / 1000;
        const step = (dt / LAP) * Math.PI * 2;
        for (const f of floaters) {
          f.angle += step;
          const x = orbit.cx + Math.cos(f.angle) * orbit.rx - size / 2;
          const y = orbit.cy + Math.sin(f.angle) * orbit.ry - size / 2;
          // a little larger along the near (lower) side of the orbit, smaller along the far side
          const scale = 0.95 + 0.15 * Math.sin(f.angle);
          const turn = Math.sin(t * 0.35 + f.phase) * 6;
          f.el.style.transform = 'translate3d(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px,0) rotate(' + turn.toFixed(2) + 'deg) scale(' + scale.toFixed(3) + ')';
        }
      }
      requestAnimationFrame(frame);
    }

    let lastWidth = window.innerWidth;
    window.addEventListener('resize', () => {
      if (window.innerWidth === lastWidth) return;
      lastWidth = window.innerWidth;
      layoutStickers();
    });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(layoutStickers);

    layoutStickers();
    requestAnimationFrame(frame);
  }

  function show(view) {
    Object.keys(views).forEach((k) => { views[k].hidden = k !== view; });
    // restart the entrance animation
    views[view].style.animation = 'none';
    void views[view].offsetWidth;
    views[view].style.animation = '';
    document.body.dataset.view = view;
  }

  // ── routing ──────────────────────────────────────────────────
  function route() {
    let parts;
    try {
      parts = location.hash.replace(/^#\/?/, '').split('/').filter(Boolean).map(decodeURIComponent);
    } catch (e) {
      parts = [];
    }

    // Remember where the reader was in a list, so "back" returns them there.
    const wasReading = document.body.dataset.view === 'reader';
    if (currentTab && !wasReading) listScroll = { tab: currentTab, y: window.scrollY };

    let tab = 'home';
    let reading = false;
    const shelf = SHELVES[parts[0]];
    const found = shelf && parts[1] ? shelf.list.findIndex((p) => p.id === parts[1]) : -1;

    if (found >= 0) {
      tab = shelf.tab;
      shelf.show(found);
      reading = true;
    } else if (TABS[parts[0]]) {
      tab = parts[0];
      showTab(tab);
    } else {
      showHome();
    }

    document.querySelectorAll('.nav-tabs a').forEach((a) => {
      if (a.dataset.tab === tab) a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current');
    });

    window.scrollTo(0, !reading && wasReading && listScroll.tab === tab ? listScroll.y : 0);
    currentTab = tab;
  }

  // ── picture zoom ─────────────────────────────────────────────
  function closeLightbox() {
    const box = document.querySelector('.lightbox');
    if (box) box.remove();
    return !!box;
  }

  document.addEventListener('click', (e) => {
    if (closeLightbox()) return;
    const img = e.target.closest && e.target.closest('.media img');
    if (!img) return;
    const box = document.createElement('div');
    box.className = 'lightbox';
    const big = document.createElement('img');
    big.src = img.currentSrc || img.src;
    big.alt = img.alt;
    box.appendChild(big);
    document.body.appendChild(box);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && closeLightbox()) return;
    if (document.body.dataset.view !== 'reader' || e.metaKey || e.ctrlKey || e.altKey) return;
    if (e.key === 'ArrowLeft' && around.prev) location.hash = around.prev;
    else if (e.key === 'ArrowRight' && around.next) location.hash = around.next;
    else if (e.key === 'Escape') location.hash = around.back;
  });

  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  window.addEventListener('hashchange', route);
  buildHome();
  startFloating();
  route();
})();
