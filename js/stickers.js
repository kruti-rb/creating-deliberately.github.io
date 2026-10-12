// The animated emblems: restrained silhouettes in cream, gold and mauve, with one warm accent.
// The movement lives in css/style.css (the a-… classes). app.js places them via stickers().
(function () {
  'use strict';

  const CREAM = '#f4ecdc';
  const GOLD = '#e3c78f';
  const BRASS = '#b8935a';
  const MAUVE = '#9d8cd6';
  const DUSK = '#5f4ca0';
    const ROSE = '#d9a3ad';
  const RUST = '#cf8468';
  const DARK = '#17103a';
  const SHADE = 'rgba(23,16,58,.2)';

  // Shading: every flat fill below is swapped for a gradient, so shapes read as lit, rounded objects.
  // (Strokes stay flat.) GRAD_ is replaced with a unique prefix for each copy placed on the page.
  const stops = (list) => list.map(([o, c]) => `<stop offset="${o}" stop-color="${c}"/>`).join('');
  const DEFS = '<defs>' +
    `<linearGradient id="GRAD_cream" x1="0" y1="0" x2="1" y2=".25">${stops([[0, '#fffbf2'], [0.45, CREAM], [1, '#b3a7c9']])}</linearGradient>` +
    `<linearGradient id="GRAD_gold" x1="0" y1="0" x2="1" y2="1">${stops([[0, '#f9e8bd'], [0.5, GOLD], [1, '#a47c43']])}</linearGradient>` +
    `<linearGradient id="GRAD_mauve" x1="0" y1="0" x2="1" y2="1">${stops([[0, '#c2b4f3'], [0.5, MAUVE], [1, '#5d4aa3']])}</linearGradient>` +
    `<linearGradient id="GRAD_rose" x1="0" y1="0" x2="1" y2="1">${stops([[0, '#f1cbd2'], [0.5, ROSE], [1, '#b47785']])}</linearGradient>` +
    `<linearGradient id="GRAD_rust" x1="0" y1="0" x2="1" y2="0">${stops([[0, '#e7a184'], [0.5, RUST], [1, '#9f553d']])}</linearGradient>` +
    `<radialGradient id="GRAD_globe" cx=".34" cy=".28" r=".85">${stops([[0, '#ffffff'], [0.5, '#ece3d3'], [1, '#9d91b8']])}</radialGradient>` +
    `<radialGradient id="GRAD_visor" cx=".3" cy=".22" r=".95">${stops([[0, '#fff3cf'], [0.4, '#e6bb69'], [1, '#6f4b1f']])}</radialGradient>` +
    `<radialGradient id="GRAD_ocean" cx=".34" cy=".3" r=".8">${stops([[0, '#a9d2f7'], [0.5, '#4f82d2'], [1, '#1d2f7c']])}</radialGradient>` +
    `<linearGradient id="GRAD_panel" x1="0" y1="0" x2="1" y2="1">${stops([[0, '#6f8fe0'], [1, '#2b3f93']])}</linearGradient>` +
    `<radialGradient id="GRAD_dusk" cx=".3" cy=".28" r=".85"><stop offset=".55" stop-color="${DARK}" stop-opacity="0"/><stop offset="1" stop-color="${DARK}" stop-opacity=".8"/></radialGradient>` +
    '<clipPath id="GRAD_clip"><circle cx="60" cy="60" r="36"/></clipPath>' +
    '</defs>';
  const SHADED = { [CREAM]: 'cream', [GOLD]: 'gold', [MAUVE]: 'mauve', [ROSE]: 'rose', [RUST]: 'rust' };

  const svg = (inner) =>
    '<svg viewBox="0 0 120 120" aria-hidden="true" focusable="false">' + DEFS +
      inner.replace(/fill="(#[0-9a-f]{6})"/g, (m, c) => (SHADED[c] ? 'fill="url(#GRAD_' + SHADED[c] + ')"' : m)) +
    '</svg>';

  // To use a real picture for any sticker instead of the drawing, save it in media/stickers/ and
  // name it here, e.g.  rocket: "media/stickers/rocket.png"  (a PNG with a transparent background works best).
  window.STICKER_IMAGES = {};

  const ORBIT = 'M104 60A44 15 0 1 1 16 60A44 15 0 1 1 104 60';
  const orbit = (angle, dur, begin) =>
    `<g transform="rotate(${angle} 60 60)">
      <ellipse class="l" stroke="${MAUVE}" style="stroke-width:1.6" cx="60" cy="60" rx="44" ry="15"/>
      <circle r="3.600" fill="${CREAM}"><animateMotion dur="${dur}s" begin="${begin}s" repeatCount="indefinite" path="${ORBIT}"/></circle>
    </g>`;

  const column = (x) =>
    `<rect fill="${CREAM}" x="${x}" y="55" width="8" height="36"/><rect fill="${SHADE}" x="${x + 5}" y="55" width="3" height="36"/>`;

  const spine = (x, y, w, h, fill) =>
    `<rect fill="${fill}" x="${x}" y="${y}" width="${w}" height="${h}" rx="1.500"/>` +
    `<rect fill="${SHADE}" x="${x}" y="${y + 7}" width="${w}" height="2.500"/>` +
    `<rect fill="${SHADE}" x="${x}" y="${y + h - 10}" width="${w}" height="2.500"/>`;

  // One ankle bell, hung at (x, y).
  const bell = (x, y, cls) =>
    `<g class="a-jingle ${cls}">
      <circle fill="${GOLD}" cx="${x}" cy="${y}" r="6.400"/>
      <path class="l" stroke="${DARK}" style="stroke-width:1.300" opacity=".7" d="M${x - 3.4} ${y + 1.6}H${x + 3.4}"/>
      <circle fill="${DARK}" opacity=".7" cx="${x}" cy="${y + 1.6}" r="1.200"/>
    </g>`;

  const LAND =
    `<path d="M30 38c6-6 17-6 21 0c4 6-2 10 2 16c4 6-4 15-10 13c-6-2-6-10-12-12c-6-2-7-11-1-17Z"/>
     <path d="M62 64c6-4 14-2 16 6c2 8-4 17-10 17c-6 0-10-9-8-15c.500-3 0-6 2-8Z"/>
     <path d="M70 32c5-3 12-1 12 5c0 5-7 7-11 5c-3-2-4-7-1-10Z"/>
     <path d="M40 80c4-2 9 0 9 4c0 4-5 6-9 4c-3-1-3-6 0-8Z"/>`;

  const panel = (x) =>
    `<rect fill="url(#GRAD_panel)" x="${x}" y="48" width="34" height="24" rx="1.500"/>
     <path class="l" stroke="${CREAM}" style="stroke-width:.8" opacity=".55" d="M${x + 8.5} 48V72M${x + 17} 48V72M${x + 25.5} 48V72M${x} 60H${x + 34}"/>`;

  window.STICKERS = {
    // A slim rocket on a long burn.
    rocket: svg(
      `<g class="a-fly"><g transform="rotate(40 60 60)">
        <path class="a-flame" fill="${GOLD}" opacity=".9" d="M55 88Q60 126 65 88Z"/>
        <path fill="${GOLD}" d="M50 58L35 90L50 81Z"/>
        <path fill="${GOLD}" d="M70 58L85 90L70 81Z"/>
        <path fill="${CREAM}" d="M60 6C70 22 72 48 70 83H50C48 48 50 22 60 6Z"/>
        <path fill="${SHADE}" d="M60 6C70 22 72 48 70 83H60Z"/>
        <path fill="${BRASS}" d="M53 83H67L65 89H55Z"/>
        <circle fill="${GOLD}" cx="60" cy="40" r="6.500"/>
        <circle fill="${DARK}" cx="60" cy="40" r="4"/>
        <rect fill="${MAUVE}" x="50.400" y="66" width="19.200" height="2.600"/>
      </g></g>`
    ),

    // A helmet with a gold visor.
    astronaut: svg(
      `<g class="a-float">
        <path fill="${DUSK}" d="M20 114Q22 96 40 92H80Q98 96 100 114Z"/>
        <path fill="${CREAM}" d="M38 96Q60 86 82 96L80 86H40Z"/>
        <rect fill="${MAUVE}" x="22" y="44" width="10" height="20" rx="4"/>
        <rect fill="${MAUVE}" x="88" y="44" width="10" height="20" rx="4"/>
        <circle fill="url(#GRAD_globe)" cx="60" cy="52" r="34"/>
        <ellipse fill="${DARK}" opacity=".55" cx="60" cy="53" rx="26.500" ry="22"/>
        <ellipse fill="url(#GRAD_visor)" cx="60" cy="52" rx="25" ry="20.500"/>
        <path class="a-twinkle" fill="${CREAM}" opacity=".7" d="M42 46C44 38 52 34 60 34C54 37 48 41 46 48Z"/>
        <circle fill="${CREAM}" opacity=".55" cx="72" cy="60" r="3"/>
      </g>`
    ),

    // A treble clef on its staff.
    music: svg(
      `<path class="l" stroke="${MAUVE}" style="stroke-width:1.300" opacity=".75" d="M12 44H108M12 56H108M12 68H108M12 80H108M12 92H108"/>
      <g class="a-float">
        <path class="l" stroke="${GOLD}" style="stroke-width:4.200" d="M44 99a7 7 0 0 0 12.500 3L60 26C59 11 73 8 73 24C73 41 40 48 40 69C40 85 54 92 64 89C77 86 81 71 72 66C64 61 52 66 54 78"/>
      </g>`
    ),

    // A short shelf, one volume leaning.
    books: svg(
      `${spine(24, 36, 14, 58, DUSK)}
      ${spine(40, 26, 17, 68, GOLD)}
      ${spine(59, 42, 12, 52, CREAM)}
      <g class="a-lean"><g transform="rotate(13 85 94)">${spine(76, 30, 14, 64, MAUVE)}</g></g>
      <rect fill="${BRASS}" x="14" y="94" width="92" height="4" rx="2"/>`
    ),

    // The Golden Gate over moving water.
    bridge: svg(
      `<circle fill="${CREAM}" opacity=".9" cx="94" cy="24" r="10"/>
      <path class="l" stroke="${RUST}" style="stroke-width:2" d="M0 76Q22 72 36 30Q60 78 84 30Q98 72 120 76"/>
      <path class="l" stroke="${RUST}" style="stroke-width:1" d="M44 45V76M52 52V76M60 55V76M68 52V76M76 45V76M24 64V76M96 64V76M12 73V76M108 73V76"/>
      <rect fill="${RUST}" x="0" y="75" width="120" height="5"/>
      <rect fill="${RUST}" x="30" y="22" width="12" height="76" rx="1.500"/>
      <rect fill="${RUST}" x="78" y="22" width="12" height="76" rx="1.500"/>
      <path fill="${DARK}" opacity=".55" d="M33.500 30h5v9h-5ZM33.500 45h5v9h-5ZM33.500 60h5v9h-5ZM81.500 30h5v9h-5ZM81.500 45h5v9h-5ZM81.500 60h5v9h-5Z"/>
      <path class="l a-tide" stroke="${MAUVE}" style="stroke-width:1.600" d="M-4 100q8-5 16 0t16 0t16 0t16 0t16 0t16 0t16 0t16 0"/>
      <path class="l a-tide d2" stroke="${MAUVE}" style="stroke-width:1.600" opacity=".6" d="M-4 108q8-5 16 0t16 0t16 0t16 0t16 0t16 0t16 0t16 0"/>`
    ),

    // An atom, electrons circling.
    nerdy: svg(
      orbit(0, 5, 0) + orbit(60, 6, -2) + orbit(120, 7, -4) +
      `<circle class="a-pulse" fill="${GOLD}" cx="60" cy="60" r="7"/>`
    ),

    // Ghungroo: the ankle bells of Indian classical dance.
    dance: svg(
      `<g transform="translate(0 4)">
        <path class="l" stroke="${RUST}" style="stroke-width:1.800" d="M18 50C9 45 12 34 5 29M102 50C111 45 108 34 115 29"/>
        <path class="l" stroke="#a24a44" style="stroke-width:15" d="M18 50Q60 78 102 50"/>
        <path class="l" stroke="${CREAM}" style="stroke-width:1" stroke-dasharray="2 4" opacity=".6" d="M18 50Q60 78 102 50"/>
        ${bell(30.6, 68.1, 'd2')}${bell(42.4, 72.5, 'd3')}${bell(54.1, 74.7, '')}${bell(65.9, 74.7, 'd2')}${bell(77.6, 72.5, 'd3')}${bell(89.4, 68.1, '')}
        ${bell(24.7, 54.1, '')}${bell(36.5, 59.6, 'd2')}${bell(48.2, 62.9, 'd3')}${bell(60, 64, '')}${bell(71.8, 62.9, 'd2')}${bell(83.5, 59.6, 'd3')}${bell(95.3, 54.1, '')}
      </g>`
    ),

    // A pillared hall with its pennant flying.
    ballot: svg(
      `<path class="l" stroke="${GOLD}" style="stroke-width:1.800" d="M60 22V4"/>
      <path class="a-flag" fill="${MAUVE}" d="M61 4L80 9L61 14Z"/>
      <path fill="${CREAM}" d="M16 46L60 20L104 46Z"/>
      <circle fill="${GOLD}" cx="60" cy="36.500" r="4"/>
      <rect fill="${GOLD}" x="16" y="46" width="88" height="7"/>
      ${column(24)}${column(40)}${column(56)}${column(72)}${column(88)}
      <rect fill="${GOLD}" x="16" y="91" width="88" height="6"/>
      <rect fill="${CREAM}" x="9" y="97" width="102" height="7" rx="1"/>`
    ),

    // A single bloom on its stem.
    flowers: svg(
      `<g class="a-sway">
        <path class="l" stroke="${BRASS}" style="stroke-width:2.400" d="M60 114C58 92 62 72 60 54"/>
        <path fill="${DUSK}" d="M60 98C44 94 36 80 34 66C48 70 58 82 60 98Z"/>
        <path fill="${MAUVE}" d="M60 88C74 84 84 72 86 58C72 62 62 74 60 88Z"/>
        <path fill="${CREAM}" d="M60 58C44 56 33 44 32 30C46 32 56 43 60 58Z"/>
        <path fill="${CREAM}" d="M60 58C76 56 87 44 88 30C74 32 64 43 60 58Z"/>
        <path fill="${BRASS}" d="M60 56C46 48 44 30 51 18C58 27 60 39 60 56Z"/>
        <path fill="${BRASS}" d="M60 56C74 48 76 30 69 18C62 27 60 39 60 56Z"/>
        <path fill="${GOLD}" d="M60 58C50 44 52 24 60 12C68 24 70 44 60 58Z"/>
      </g>`
    ),

    // A satellite, panels out, signalling home.
    spacecraft: svg(
      `<g class="a-float"><g transform="rotate(-18 60 60)">
        <path class="l a-twinkle" stroke="${MAUVE}" style="stroke-width:1.600" d="M50 24Q60 16 70 24M44 17Q60 4 76 17"/>
        <path class="l" stroke="${CREAM}" style="stroke-width:2" d="M42 60H78M60 46V34"/>
        ${panel(6)}${panel(80)}
        <circle fill="${CREAM}" cx="60" cy="32" r="2.600"/>
        <path fill="${CREAM}" d="M48 38Q60 52 72 38Z"/>
        <rect fill="${GOLD}" x="47" y="44" width="26" height="34" rx="3"/>
        <path fill="${SHADE}" d="M60 44h10a3 3 0 0 1 3 3v28a3 3 0 0 1-3 3H60Z"/>
        <rect fill="${DARK}" opacity=".55" x="52" y="52" width="16" height="7" rx="1.500"/>
        <circle fill="${RUST}" cx="60" cy="68" r="2.600"/>
        <path fill="${BRASS}" d="M54 78H66L69 86H51Z"/>
      </g></g>`
    ),

    // The Earth, turning.
    earth: svg(
      `<circle class="l a-pulse" stroke="#9cc6ff" style="stroke-width:1.400" opacity=".45" cx="60" cy="60" r="40"/>
      <circle fill="url(#GRAD_ocean)" cx="60" cy="60" r="36"/>
      <g clip-path="url(#GRAD_clip)">
        <g class="a-globe" fill="#86c5a0">
          <g>${LAND}</g><g transform="translate(72 0)">${LAND}</g><g transform="translate(144 0)">${LAND}</g>
        </g>
        <path class="l a-tide" stroke="${CREAM}" style="stroke-width:4" opacity=".7" d="M30 50H46M68 44H86M42 76H62M76 70H92"/>
        <circle fill="url(#GRAD_dusk)" cx="60" cy="60" r="36"/>
      </g>`
    ),

    // A fountain-pen nib, mid-flourish.
    pen: svg(
      `<path class="l a-write" pathLength="100" stroke="${CREAM}" style="stroke-width:2" d="M38 89C28 97 11 97 11 86C11 75 28 79 26 90C24 101 40 106 58 101C76 96 84 105 100 101C108 99 113 95 115 90"/>
      <g class="a-scribble"><g transform="rotate(38 60 60)">
        <path fill="${CREAM}" d="M51 38L53 2H67L69 38Z"/>
        <path fill="${SHADE}" d="M60 2H67L69 38H60Z"/>
        <rect fill="${MAUVE}" x="50" y="38" width="20" height="14" rx="1.500"/>
        <path fill="${GOLD}" d="M60 97C52 81 48 67 50 52H70C72 67 68 81 60 97Z"/>
        <path class="l" stroke="${DARK}" style="stroke-width:1.300" d="M60 94V68"/>
        <circle fill="${DARK}" cx="60" cy="65" r="2.800"/>
      </g></g>`
    ),
  };
})();
