import {
  SVG_NS, GOALS, GOAL_POSTS, GOAL_LINE_CENTERS, GOALIE_STAND_OFFSET,
  DEFAULT_TOKEN_SIZE, TOKEN_SIZE_MIN, TOKEN_SIZE_MAX,
  DEFAULT_PLAYERS, DEFAULT_OPPONENTS, ZONE_LABELS, ZONE_LABELS_LEFT, RINK_LABELS,
  PLAYER_PATH, GOALIE_PATH, GOALIE_CAGE,
} from './constants.js';
import { animateToken } from './animation.js';
import { SCENARIOS } from './scenarios.js';
import rinkSvgRaw   from '../assets/rink.svg?raw';
import zonesSvgRaw  from '../assets/zones.svg?raw';

let _instanceCount = 0;

function svgDataUri(raw) {
  return 'data:image/svg+xml,' + encodeURIComponent(raw);
}

function lerpWaypoints(waypoints, t) {
  if (waypoints.length < 2) return waypoints[0];
  const segs = [];
  let total = 0;
  for (let i = 1; i < waypoints.length; i++) {
    const dx = waypoints[i].x - waypoints[i-1].x;
    const dy = waypoints[i].y - waypoints[i-1].y;
    const len = Math.sqrt(dx*dx + dy*dy) || 0.001;
    total += len;
    segs.push({ len, a: waypoints[i-1], b: waypoints[i] });
  }
  let dist = t * total;
  for (const seg of segs) {
    if (dist <= seg.len) {
      const st = dist / seg.len;
      return { x: seg.a.x + st*(seg.b.x-seg.a.x), y: seg.a.y + st*(seg.b.y-seg.a.y) };
    }
    dist -= seg.len;
  }
  return waypoints[waypoints.length - 1];
}

export class FloorballBoard {
  // ── Construction ────────────────────────────────────────────────────────────

  constructor(mountEl, options = {}) {
    this._uid   = `fb${++_instanceCount}`;
    this._mount = mountEl;

    this._opts = {
      lang:      'en',
      tokenSize: DEFAULT_TOKEN_SIZE,
      layers:    { rink: true },
      home:      { color: '#003DA5', accent: '#FFCD00' },
      away:      { color: '#8b1a2a', accent: '#ffffff' },
      players:   DEFAULT_PLAYERS,
      opponents: DEFAULT_OPPONENTS,
      ...options,
      home: { color: '#003DA5', accent: '#FFCD00', ...options.home },
      away: { color: '#8b1a2a', accent: '#ffffff', ...options.away },
    };

    // Mutable state
    this._tokenSize      = this._opts.tokenSize;
    this._lang           = this._opts.lang;
    this._shootingActive = false;
    this._shootingTarget = 'right';
    this._dragging       = null;
    this._dragMoved      = false;
    this._dragOffset     = { x: 0, y: 0 };
    this._cancelGoalieAnim = null;
    this._animFrameId      = null;

    // Ball ownership
    this._ballOwner = null;

    // Zoom / pan state
    this._vb       = { x: 0, y: 0, w: 1200, h: 700 };
    this._pinch    = null;   // { dist } when two fingers are down
    this._panning  = false;
    this._panStart = null;   // { clientX, clientY, vbX, vbY }
    this._lastTap  = 0;

    // Event subscriptions
    this._handlers = {};

    this._buildSvg();
    this._renderAllTokens();
    this._renderZoneLabels();
    this._renderRinkLabels();
    if (!this._opts.layers.zones) this._q('zone-labels').setAttribute('display', 'none');
    if (!this._opts.layers.rink)  this._q('rink-labels').setAttribute('display', 'none');
    this._bindEvents();
  }

  // ── Private: SVG construction ────────────────────────────────────────────────

  _id(name) { return `${this._uid}-${name}`; }
  _q(id)    { return this._svg.querySelector(`#${this._id(id)}`); }

  _buildSvg() {
    const { home, away, layers } = this._opts;
    const u = this._uid;

    const cageSvg = (accent) =>
      `<g pointer-events="none" stroke="${accent}">${GOALIE_CAGE}</g>`;

    const markup = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 700"
     style="width:100%;height:auto;display:block;touch-action:none">
  <defs>
    <style>
      .${u}-token { cursor: grab; user-select: none; }
      .${u}-token:hover { filter: brightness(1.25); }
      .${u}-token.dragging { cursor: grabbing; }
    </style>
    <symbol id="${u}-sym-player" viewBox="0 0 100 100">
      <path d="${PLAYER_PATH}" fill="${home.color}" stroke="${home.accent}" stroke-width="2"/>
    </symbol>
    <symbol id="${u}-sym-opponent" viewBox="0 0 100 100">
      <path d="${PLAYER_PATH}" fill="${away.color}" stroke="${away.accent}" stroke-width="2"/>
    </symbol>
    <symbol id="${u}-sym-player-goalie" viewBox="0 0 100 100">
      <path d="${GOALIE_PATH}" fill="${home.color}" stroke="${home.accent}" stroke-width="2"/>
      ${cageSvg(home.accent)}
    </symbol>
    <symbol id="${u}-sym-opponent-goalie" viewBox="0 0 100 100">
      <path d="${GOALIE_PATH}" fill="${away.color}" stroke="${away.accent}" stroke-width="2"/>
      ${cageSvg(away.accent)}
    </symbol>
    <symbol id="${u}-sym-ball" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="11" fill="#39ff14" stroke="#1a7a00" stroke-width="1.5"/>
      <circle cx="8" cy="8" r="4" fill="rgba(255,255,255,0.35)"/>
    </symbol>
    <symbol id="${u}-sym-cone" viewBox="0 0 100 100">
      <polygon points="50,6 94,88 6,88" fill="rgba(255,140,0,0.88)" stroke="rgba(180,80,0,0.9)" stroke-width="4" stroke-linejoin="round"/>
      <rect x="6" y="88" width="88" height="8" rx="4" fill="rgba(180,80,0,0.7)"/>
    </symbol>
    <marker id="${u}-arrow-head" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto">
      <path d="M0,0 L0,6 L8,3 z" fill="rgba(255,255,255,0.85)"/>
    </marker>
  </defs>

  <image id="${u}-rink-image"  href="${svgDataUri(rinkSvgRaw)}"
         x="0" y="0" width="1200" height="700"
         style="transition:opacity 0.25s ease"
         opacity="${layers.rink  ? 1 : 0}"/>
  <image id="${u}-zones-image" href="${svgDataUri(zonesSvgRaw)}"
         x="0" y="0" width="1200" height="700"
         style="transition:opacity 0.25s ease"
         opacity="${layers.zones ? 1 : 0}"/>
  <image id="${u}-zones-left-image" href="${svgDataUri(zonesSvgRaw)}"
         x="0" y="0" width="1200" height="700"
         transform="translate(1200,0) scale(-1,1)"
         style="transition:opacity 0.25s ease"
         opacity="${layers.zonesLeft ? 1 : 0}"/>

  <g id="${u}-goalie-zones" pointer-events="none">
    <g id="${u}-zone-attention" display="none">
      <path id="${u}-zone-attention-fill"
            d="M 475,100 L 850,100 L 850,600 L 475,600 Z"
            fill="rgba(255,210,60,0.22)" stroke="rgba(255,210,60,0.65)" stroke-width="1.5"/>
      <text id="${u}-zone-attention-label" x="663" y="132" text-anchor="middle"
            font-family="system-ui, -apple-system, sans-serif"
            font-size="16" font-weight="600" letter-spacing="0.5"
            fill="rgba(255,210,60,0.9)">Attention Zone</text>
    </g>
    <g id="${u}-zone-awareness" display="none">
      <path id="${u}-zone-awareness-fill"
            d="M 767,100 L 1050,100 A 50,50 0 0,1 1100,150 L 1100,550 A 50,50 0 0,1 1050,600 L 767,600 Z"
            fill="rgba(80,240,80,0.26)" stroke="rgba(80,240,80,0.75)" stroke-width="1.5"/>
      <text id="${u}-zone-awareness-label" x="934" y="132" text-anchor="middle"
            font-family="system-ui, -apple-system, sans-serif"
            font-size="16" font-weight="600" letter-spacing="0.5"
            fill="rgba(120,200,100,0.9)">Awareness Zone</text>
    </g>
    <g id="${u}-zone-passing-first" display="none">
      <path id="${u}-zone-passing-first-fill"
            d="M 150,100 L 299,100 L 210,130 L 175,175 L 172,250 L 172,450 L 175,525 L 210,570 L 299,600 L 150,600 L 114,586 L 100,550 L 100,150 L 114,114 Z"
            fill="rgba(255,165,100,0.25)" stroke="rgba(255,165,100,0.65)" stroke-width="1.5"/>
      <text id="${u}-zone-passing-first-label" x="136" y="350" text-anchor="middle"
            dominant-baseline="central"
            transform="rotate(-90,136,350)"
            font-family="system-ui, -apple-system, sans-serif"
            font-size="16" font-weight="600" letter-spacing="0.5"
            fill="rgba(255,185,120,0.9)">Passing-First-Zone</text>
    </g>
    <g id="${u}-zone-danger" display="none">
      <rect id="${u}-zone-danger-fill"
            x="155" y="100" width="400" height="500" rx="50"
            fill="rgba(255,100,100,0.18)" stroke="rgba(255,100,100,0.6)" stroke-width="1.5"/>
      <text id="${u}-zone-danger-label" x="355" y="140" text-anchor="middle"
            font-family="system-ui, -apple-system, sans-serif"
            font-size="16" font-weight="600" letter-spacing="0.5"
            fill="rgba(255,130,130,0.9)">Danger Zone</text>
    </g>
    <g id="${u}-zone-slot" display="none">
      <path id="${u}-zone-slot-fill"
            d="M 171,288 L 421,250 L 421,450 L 171,412 Z"
            fill="rgba(255,80,80,0.28)" stroke="rgba(255,80,80,0.7)" stroke-width="1.5"/>
      <text id="${u}-zone-slot-label" x="350" y="350" text-anchor="middle"
            font-family="system-ui, -apple-system, sans-serif"
            font-size="16" font-weight="600" letter-spacing="0.5"
            dominant-baseline="central"
            fill="rgba(255,130,130,0.9)">Slot</text>
    </g>

    <!-- ── Mirrored zones for the right goal end (x' = 1200 − x) ── -->
    <g id="${u}-zone-attention-right" display="none">
      <path id="${u}-zone-attention-right-fill"
            d="M 725,100 L 350,100 L 350,600 L 725,600 Z"
            fill="rgba(255,210,60,0.22)" stroke="rgba(255,210,60,0.65)" stroke-width="1.5"/>
      <text id="${u}-zone-attention-right-label" x="537" y="132" text-anchor="middle"
            font-family="system-ui, -apple-system, sans-serif"
            font-size="16" font-weight="600" letter-spacing="0.5"
            fill="rgba(255,210,60,0.9)">Attention Zone</text>
    </g>
    <g id="${u}-zone-awareness-left" display="none">
      <path id="${u}-zone-awareness-left-fill"
            d="M 433,100 L 150,100 A 50,50 0 0,0 100,150 L 100,550 A 50,50 0 0,0 150,600 L 433,600 Z"
            fill="rgba(80,240,80,0.26)" stroke="rgba(80,240,80,0.75)" stroke-width="1.5"/>
      <text id="${u}-zone-awareness-left-label" x="266" y="132" text-anchor="middle"
            font-family="system-ui, -apple-system, sans-serif"
            font-size="16" font-weight="600" letter-spacing="0.5"
            fill="rgba(120,200,100,0.9)">Awareness Zone</text>
    </g>
    <g id="${u}-zone-passing-first-right" display="none">
      <path id="${u}-zone-passing-first-right-fill"
            d="M 1050,100 L 901,100 L 990,130 L 1025,175 L 1028,250 L 1028,450 L 1025,525 L 990,570 L 901,600 L 1050,600 L 1086,586 L 1100,550 L 1100,150 L 1086,114 Z"
            fill="rgba(255,165,100,0.25)" stroke="rgba(255,165,100,0.65)" stroke-width="1.5"/>
      <text id="${u}-zone-passing-first-right-label" x="1064" y="350" text-anchor="middle"
            dominant-baseline="central"
            transform="rotate(90,1064,350)"
            font-family="system-ui, -apple-system, sans-serif"
            font-size="16" font-weight="600" letter-spacing="0.5"
            fill="rgba(255,185,120,0.9)">Passing-First-Zone</text>
    </g>
    <g id="${u}-zone-danger-right" display="none">
      <rect id="${u}-zone-danger-right-fill"
            x="645" y="100" width="400" height="500" rx="50"
            fill="rgba(255,100,100,0.18)" stroke="rgba(255,100,100,0.6)" stroke-width="1.5"/>
      <text id="${u}-zone-danger-right-label" x="845" y="140" text-anchor="middle"
            font-family="system-ui, -apple-system, sans-serif"
            font-size="16" font-weight="600" letter-spacing="0.5"
            fill="rgba(255,130,130,0.9)">Danger Zone</text>
    </g>
    <g id="${u}-zone-slot-right" display="none">
      <path id="${u}-zone-slot-right-fill"
            d="M 1029,288 L 779,250 L 779,450 L 1029,412 Z"
            fill="rgba(255,80,80,0.28)" stroke="rgba(255,80,80,0.7)" stroke-width="1.5"/>
      <text id="${u}-zone-slot-right-label" x="850" y="350" text-anchor="middle"
            font-family="system-ui, -apple-system, sans-serif"
            font-size="16" font-weight="600" letter-spacing="0.5"
            dominant-baseline="central"
            fill="rgba(255,130,130,0.9)">Slot</text>
    </g>
    <g id="${u}-zone-queue-left" display="none">
      <rect id="${u}-zone-queue-left-fill"
            x="5" y="120" width="78" height="460" rx="8"
            fill="rgba(150,150,150,0.08)"
            stroke="rgba(150,150,150,0.35)" stroke-width="1.5" stroke-dasharray="5,4"/>
      <text id="${u}-zone-queue-left-label"
            x="44" y="350" text-anchor="middle" dominant-baseline="central"
            font-family="system-ui, -apple-system, sans-serif"
            font-size="13" font-weight="600" letter-spacing="1"
            fill="rgba(200,200,200,0.55)" pointer-events="none"
            transform="rotate(-90,44,350)">Queue</text>
    </g>
    <g id="${u}-zone-queue-right" display="none">
      <rect id="${u}-zone-queue-right-fill"
            x="1117" y="120" width="78" height="460" rx="8"
            fill="rgba(150,150,150,0.08)"
            stroke="rgba(150,150,150,0.35)" stroke-width="1.5" stroke-dasharray="5,4"/>
      <text id="${u}-zone-queue-right-label"
            x="1156" y="350" text-anchor="middle" dominant-baseline="central"
            font-family="system-ui, -apple-system, sans-serif"
            font-size="13" font-weight="600" letter-spacing="1"
            fill="rgba(200,200,200,0.55)" pointer-events="none"
            transform="rotate(90,1156,350)">Queue</text>
    </g>
  </g>

  <g id="${u}-rink-labels" pointer-events="none"></g>
  <g id="${u}-zone-labels"></g>
  <g id="${u}-zone-labels-left"></g>

  <polygon id="${u}-shooting-triangle"
           points="600,350 1028.75,330 1028.75,370"
           fill="rgba(232,200,64,0.22)" stroke="rgba(232,200,64,0.5)"
           stroke-width="1" display="none"/>
  <line id="${u}-shooting-line"
        x1="600" y1="350" x2="1036.25" y2="350"
        stroke="rgba(255,255,255,0.75)" stroke-width="2" stroke-dasharray="10,5"
        marker-end="url(#${u}-arrow-head)" display="none"/>

  <g id="${u}-tokens"></g>
</svg>`;

    const div = document.createElement('div');
    div.innerHTML = markup.trim();
    this._svg = div.firstElementChild;
    this._mount.appendChild(this._svg);
  }

  // ── Private: token rendering ─────────────────────────────────────────────────

  _updateTransform(token) {
    const x     = parseFloat(token.dataset.x);
    const y     = parseFloat(token.dataset.y);
    const angle = parseFloat(token.dataset.angle ?? '0');
    token.setAttribute('transform', `translate(${x},${y}) rotate(${angle})`);
    const text = token.querySelector('text');
    if (text) text.setAttribute('transform', `rotate(${-angle})`);
  }

  _renderToken(def, type) {
    const { home, away } = this._opts;
    const u     = this._uid;
    const half  = this._tokenSize / 2;
    const isHome = type === 'player';
    const accent = isHome ? home.accent : away.accent;

    const symSuffix = def.symbol ?? `sym-${type}`;
    const g = document.createElementNS(SVG_NS, 'g');
    g.setAttribute('id',    `${u}-${def.id}`);
    g.setAttribute('class', `${u}-token`);
    g.dataset.type   = type;
    g.dataset.tid    = def.id;
    g.dataset.label  = def.label  ?? '';
    g.dataset.symbol = def.symbol ?? `sym-${type}`;
    g.dataset.x      = def.x;
    g.dataset.y      = def.y;
    g.dataset.angle  = '0';
    g.dataset.initX  = def.x;
    g.dataset.initY  = def.y;
    this._updateTransform(g);

    const use = document.createElementNS(SVG_NS, 'use');
    use.setAttribute('href',   `#${u}-${symSuffix}`);
    use.setAttribute('x',      -half);
    use.setAttribute('y',      -half);
    use.setAttribute('width',  this._tokenSize);
    use.setAttribute('height', this._tokenSize);
    g.appendChild(use);

    if (def.label) {
      const text = document.createElementNS(SVG_NS, 'text');
      text.setAttribute('x', '0');
      text.setAttribute('y', '0');
      text.setAttribute('text-anchor',       'middle');
      text.setAttribute('dominant-baseline', 'central');
      text.setAttribute('font-family', 'system-ui, -apple-system, sans-serif');
      text.setAttribute('letter-spacing', '0.5');
      text.setAttribute('font-size',   Math.round(this._tokenSize * 0.28));
      text.setAttribute('font-weight', 'bold');
      text.setAttribute('fill', accent);
      text.setAttribute('pointer-events', 'none');
      text.textContent = def.label;
      g.appendChild(text);
    }

    return g;
  }

  _renderBall(parent) {
    const u  = this._uid;
    const g  = document.createElementNS(SVG_NS, 'g');
    g.setAttribute('id',    `${u}-ball`);
    g.setAttribute('class', `${u}-token`);
    g.dataset.x    = '600';
    g.dataset.y    = '350';
    g.dataset.type = 'ball';
    g.setAttribute('transform', 'translate(600,350)');

    const use = document.createElementNS(SVG_NS, 'use');
    use.setAttribute('href',   `#${u}-sym-ball`);
    use.setAttribute('x',      '-12');
    use.setAttribute('y',      '-12');
    use.setAttribute('width',  '24');
    use.setAttribute('height', '24');
    g.appendChild(use);
    parent.appendChild(g);
    return g;
  }

  _renderAllTokens() {
    const layer = this._q('tokens');
    const { players, opponents } = this._opts;
    players.forEach(p   => layer.appendChild(this._renderToken(p, 'player')));
    opponents.forEach(p => layer.appendChild(this._renderToken(p, 'opponent')));
    this._renderBall(layer);
  }

  _resetTokenGroup(type, defs) {
    const layer = this._q('tokens');
    const ball  = this._q('ball');
    const saved = {};
    layer.querySelectorAll(`[data-type="${type}"]`).forEach(t => {
      saved[t.id] = { x: t.dataset.x, y: t.dataset.y, angle: t.dataset.angle };
      t.remove();
    });
    defs.forEach(def => {
      const token = this._renderToken(def, type);
      layer.insertBefore(token, ball);
      const pos = saved[`${this._uid}-${def.id}`];
      if (pos) {
        token.dataset.x     = pos.x;
        token.dataset.y     = pos.y;
        token.dataset.angle = pos.angle;
        this._updateTransform(token);
      }
    });
  }

  // ── Private: zone labels ──────────────────────────────────────────────────────

  _renderZoneLabels() {
    this._fillZoneLabels(this._q('zone-labels'),      ZONE_LABELS);
    this._fillZoneLabels(this._q('zone-labels-left'), ZONE_LABELS_LEFT);
  }

  _renderRinkLabels() {
    const layer = this._q('rink-labels');
    layer.innerHTML = '';
    RINK_LABELS.forEach(z => {
      const text = document.createElementNS(SVG_NS, 'text');
      text.setAttribute('x', z.x);
      text.setAttribute('y', z.y);
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('font-family', 'Arial, sans-serif');
      text.setAttribute('font-size',   '14');
      text.setAttribute('fill',        '#a0a0a0');
      text.textContent = z.labels[this._lang] ?? z.labels.en;
      layer.appendChild(text);
    });
  }

  _fillZoneLabels(layer, labels) {
    layer.innerHTML = '';
    labels.forEach(z => {
      const text = document.createElementNS(SVG_NS, 'text');
      text.setAttribute('x', z.x);
      text.setAttribute('y', z.y);
      text.setAttribute('text-anchor',       'middle');
      text.setAttribute('dominant-baseline', 'central');
      text.setAttribute('font-family', 'system-ui, -apple-system, sans-serif');
      text.setAttribute('font-size',   '13');
      text.setAttribute('font-weight', '600');
      text.setAttribute('fill', 'rgba(255,255,255,0.75)');
      text.setAttribute('pointer-events', 'none');
      text.setAttribute('letter-spacing', '0.5');
      if (z.rotate) text.setAttribute('transform', `rotate(${z.rotate},${z.x},${z.y})`);
      text.textContent = z.labels[this._lang] ?? z.labels.en;
      layer.appendChild(text);
    });
  }

  // ── Private: shooting line ───────────────────────────────────────────────────

  _updateShootingLine() {
    const ball  = this._q('ball');
    const bx    = parseFloat(ball.dataset.x);
    const by    = parseFloat(ball.dataset.y);
    const goal  = GOALS[this._shootingTarget];
    const posts = GOAL_POSTS[this._shootingTarget];

    this._q('shooting-line').setAttribute('x1', bx);
    this._q('shooting-line').setAttribute('y1', by);
    this._q('shooting-line').setAttribute('x2', goal.x);
    this._q('shooting-line').setAttribute('y2', goal.y);
    this._q('shooting-triangle').setAttribute('points',
      `${bx},${by} ${posts[0].x},${posts[0].y} ${posts[1].x},${posts[1].y}`);

    const goalieId = this._shootingTarget === 'right' ? 'opponent-g' : 'player-g';
    const goalie   = this._q(goalieId);
    const angle    = Math.atan2(
      by - parseFloat(goalie.dataset.y),
      bx - parseFloat(goalie.dataset.x),
    ) * 180 / Math.PI;
    goalie.dataset.angle = angle;
    this._updateTransform(goalie);
  }

  _placeBallAtOwner() {
    if (!this._ballOwner) return;
    const owner = this._q(this._ballOwner);
    const ball  = this._q('ball');
    if (!owner || !ball) return;
    const px  = parseFloat(owner.dataset.x);
    const py  = parseFloat(owner.dataset.y);
    const ang = parseFloat(owner.dataset.angle ?? '0') * Math.PI / 180;
    const off = this._tokenSize / 2 + 12;
    ball.dataset.x = px + Math.cos(ang) * off;
    ball.dataset.y = py + Math.sin(ang) * off;
    this._updateTransform(ball);
    if (this._shootingActive) this._updateShootingLine();
  }

  _calcIdealGoaliePos(bx, by) {
    const origin = GOAL_LINE_CENTERS[this._shootingTarget];
    const dx = bx - origin.x;
    const dy = by - origin.y;
    const len = Math.sqrt(dx * dx + dy * dy) || 1;
    return {
      x:     origin.x + (dx / len) * GOALIE_STAND_OFFSET,
      y:     origin.y + (dy / len) * GOALIE_STAND_OFFSET,
      angle: Math.atan2(dy, dx) * 180 / Math.PI,
    };
  }

  // ── Private: coordinate conversion ──────────────────────────────────────────

  _toSvgPoint(clientX, clientY) {
    const pt = this._svg.createSVGPoint();
    pt.x = clientX;
    pt.y = clientY;
    const ctm = this._svg.getScreenCTM();
    if (!ctm) return pt;
    return pt.matrixTransform(ctm.inverse());
  }

  // ── Private: drag/click handling ─────────────────────────────────────────────

  _startDrag(token, clientX, clientY) {
    this._dragging  = token;
    this._dragMoved = false;
    token.classList.add('dragging');
    token.parentNode.appendChild(token);
    const fp = this._toSvgPoint(clientX, clientY);
    this._dragOffset.x = fp.x - parseFloat(token.dataset.x);
    this._dragOffset.y = fp.y - parseFloat(token.dataset.y);
    if (token.dataset.type === 'ball') this._ballOwner = null;
  }

  _handleMove(clientX, clientY) {
    if (!this._dragging) return;
    this._dragMoved = true;
    const fp = this._toSvgPoint(clientX, clientY);
    this._dragging.dataset.x = Math.min(1200, Math.max(0, fp.x - this._dragOffset.x));
    this._dragging.dataset.y = Math.min(700,  Math.max(0, fp.y - this._dragOffset.y));
    this._updateTransform(this._dragging);
    if (this._dragging.id === this._id('ball') && this._shootingActive) {
      this._updateShootingLine();
    }
    if (this._dragging.dataset.tid === this._ballOwner) {
      this._placeBallAtOwner();
    }
  }

  _handleUp() {
    if (!this._dragging) return;
    const token = this._dragging;
    if (!this._dragMoved) {
      if (token.dataset.type === 'player' || token.dataset.type === 'opponent') {
        const angle = (parseFloat(token.dataset.angle ?? '0') + 45) % 360;
        token.dataset.angle = angle;
        this._updateTransform(token);
        if (token.dataset.tid === this._ballOwner) this._placeBallAtOwner();
        this._emit('tokenRotated', { id: token.id, angle });
      } else if (this._shootingActive) {
        this._shootingTarget = this._shootingTarget === 'right' ? 'left' : 'right';
        this._updateShootingLine();
        this._emit('goalSwitched', { target: this._shootingTarget });
      }
    } else {
      if (token.dataset.type === 'ball') {
        // Snap ball to nearest player token if close enough
        const bx = parseFloat(token.dataset.x);
        const by = parseFloat(token.dataset.y);
        const snapDist = this._tokenSize / 2;
        let nearest = null, nearestDist = Infinity;
        this._svg.querySelectorAll(`.${this._uid}-token:not([data-type="ball"])`).forEach(t => {
          const dx = parseFloat(t.dataset.x) - bx;
          const dy = parseFloat(t.dataset.y) - by;
          const d  = Math.sqrt(dx * dx + dy * dy);
          if (d < snapDist && d < nearestDist) { nearestDist = d; nearest = t; }
        });
        if (nearest) {
          this._ballOwner = nearest.dataset.tid;
          this._placeBallAtOwner();
        }
      }
      this._emit('tokenMoved', {
        id:    token.id,
        x:     parseFloat(token.dataset.x),
        y:     parseFloat(token.dataset.y),
        angle: parseFloat(token.dataset.angle ?? '0'),
      });
    }
    token.classList.remove('dragging');
    this._dragging = null;
  }

  // ── Private: zoom / pan helpers ──────────────────────────────────────────────

  _pinchDist(touches) {
    const dx = touches[1].clientX - touches[0].clientX;
    const dy = touches[1].clientY - touches[0].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }

  _pinchCenter(touches) {
    return {
      x: (touches[0].clientX + touches[1].clientX) / 2,
      y: (touches[0].clientY + touches[1].clientY) / 2,
    };
  }

  _applyVb() {
    const { x, y, w, h } = this._vb;
    this._svg.setAttribute('viewBox', `${x} ${y} ${w} ${h}`);
  }

  _zoomVbToward(clientX, clientY, newScale) {
    const clamped = Math.max(1, Math.min(5, newScale));
    if (clamped <= 1) {
      this._vb = { x: 0, y: 0, w: 1200, h: 700 };
      this._applyVb();
      return;
    }
    const pt = this._svg.createSVGPoint();
    pt.x = clientX; pt.y = clientY;
    const sp = pt.matrixTransform(this._svg.getScreenCTM().inverse());
    const newW = 1200 / clamped;
    const newH = 700  / clamped;
    let newX = sp.x - (sp.x - this._vb.x) * (newW / this._vb.w);
    let newY = sp.y - (sp.y - this._vb.y) * (newH / this._vb.h);
    newX = Math.max(0, Math.min(1200 - newW, newX));
    newY = Math.max(0, Math.min(700  - newH, newY));
    this._vb = { x: newX, y: newY, w: newW, h: newH };
    this._applyVb();
  }

  // ── Private: event binding ───────────────────────────────────────────────────

  _bindEvents() {
    this._onMouseMove = (e) => this._handleMove(e.clientX, e.clientY);
    this._onMouseUp   = ()  => this._handleUp();

    this._onTouchMove = (e) => {
      e.preventDefault();
      if (this._pinch && e.touches.length >= 2) {
        const newDist   = this._pinchDist(e.touches);
        const newCenter = this._pinchCenter(e.touches);
        const curScale  = 1200 / this._vb.w;
        this._zoomVbToward(newCenter.x, newCenter.y, curScale * (newDist / this._pinch.dist));
        this._pinch.dist = newDist;
      } else if (this._panning && e.touches.length === 1) {
        const rect  = this._svg.getBoundingClientRect();
        const svgDx = (e.touches[0].clientX - this._panStart.clientX) / rect.width  * this._vb.w;
        const svgDy = (e.touches[0].clientY - this._panStart.clientY) / rect.height * this._vb.h;
        this._vb.x = Math.max(0, Math.min(1200 - this._vb.w, this._panStart.vbX - svgDx));
        this._vb.y = Math.max(0, Math.min(700  - this._vb.h, this._panStart.vbY - svgDy));
        this._applyVb();
      } else if (e.touches.length === 1) {
        this._handleMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    this._onTouchEnd = (e) => {
      if (this._pinch) {
        if (e.touches.length < 2) {
          this._pinch = null;
          // Transition remaining finger to pan (if still zoomed)
          if (e.touches.length === 1 && this._vb.w < 1200) {
            this._panning  = true;
            this._panStart = { clientX: e.touches[0].clientX, clientY: e.touches[0].clientY, vbX: this._vb.x, vbY: this._vb.y };
          }
        }
        return;
      }
      if (this._panning) {
        if (e.touches.length === 0) { this._panning = false; this._panStart = null; }
        return;
      }
      this._handleUp();
    };

    this._onWheel = (e) => {
      e.preventDefault();
      const factor    = e.deltaY > 0 ? 1 / 1.12 : 1.12;
      const curScale  = 1200 / this._vb.w;
      this._zoomVbToward(e.clientX, e.clientY, curScale * factor);
    };

    this._svg.addEventListener('mousemove', this._onMouseMove);
    window.addEventListener('mouseup',   this._onMouseUp);
    window.addEventListener('touchmove', this._onTouchMove, { passive: false });
    window.addEventListener('touchend',  this._onTouchEnd);
    this._svg.addEventListener('wheel',  this._onWheel, { passive: false });

    this._svg.addEventListener('mousedown', (e) => {
      const token = e.target.closest(`.${this._uid}-token`);
      if (token) { e.preventDefault(); this._startDrag(token, e.clientX, e.clientY); }
    });

    this._svg.addEventListener('touchstart', (e) => {
      if (e.touches.length >= 2) {
        e.preventDefault();
        this._handleUp();
        this._pinch   = { dist: this._pinchDist(e.touches) };
        this._panning = false;
        return;
      }
      // Double-tap: reset zoom
      const now = Date.now();
      if (now - this._lastTap < 280 && this._vb.w < 1200) {
        e.preventDefault();
        this._vb = { x: 0, y: 0, w: 1200, h: 700 };
        this._applyVb();
        this._lastTap = 0;
        return;
      }
      this._lastTap = now;

      const token = e.target.closest(`.${this._uid}-token`);
      if (token) {
        e.preventDefault();
        this._startDrag(token, e.touches[0].clientX, e.touches[0].clientY);
      } else if (this._vb.w < 1200) {
        e.preventDefault();
        this._panning  = true;
        this._panStart = { clientX: e.touches[0].clientX, clientY: e.touches[0].clientY, vbX: this._vb.x, vbY: this._vb.y };
      }
    }, { passive: false });
  }

  // ── Private: event emitter ───────────────────────────────────────────────────

  _emit(event, data) {
    const fns = this._handlers[event];
    if (fns) fns.forEach(fn => fn(data));
  }

  // ── Public API ───────────────────────────────────────────────────────────────

  on(event, handler) {
    (this._handlers[event] ??= []).push(handler);
    return this;
  }

  off(event, handler) {
    if (this._handlers[event]) {
      this._handlers[event] = this._handlers[event].filter(fn => fn !== handler);
    }
    return this;
  }

  setLayer(name, visible) {
    if (name === 'zone-awareness'       || name === 'zone-attention'       ||
        name === 'zone-danger'          || name === 'zone-slot'            || name === 'zone-passing-first' ||
        name === 'zone-awareness-left'  || name === 'zone-attention-right' ||
        name === 'zone-danger-right'    || name === 'zone-slot-right'      || name === 'zone-passing-first-right' ||
        name === 'zone-queue-left'      || name === 'zone-queue-right') {
      this._q(name).setAttribute('display', visible ? '' : 'none');
      return this;
    }
    const el = this._q(`${name}-image`);
    if (el) el.setAttribute('opacity', visible ? 1 : 0);
    if (name === 'rink') {
      this._q('rink-labels').setAttribute('display', visible ? '' : 'none');
    }
    if (name === 'zones') {
      this._q('zone-labels').setAttribute('display', visible ? '' : 'none');
    }
    if (name === 'zones-left') {
      this._q('zone-labels-left').setAttribute('display', visible ? '' : 'none');
    }
    return this;
  }

  setLang(lang) {
    this._lang = lang;
    this._renderZoneLabels();
    this._renderRinkLabels();
    return this;
  }

  setTokenSize(size) {
    this._tokenSize = Math.min(TOKEN_SIZE_MAX, Math.max(TOKEN_SIZE_MIN, size));
    const half      = this._tokenSize / 2;
    const fontSize  = Math.round(this._tokenSize * 0.28);
    this._svg.querySelectorAll(`.${this._uid}-token`).forEach(token => {
      if (token.dataset.type === 'ball') return;
      const use  = token.querySelector('use');
      use.setAttribute('x', -half); use.setAttribute('y', -half);
      use.setAttribute('width', this._tokenSize); use.setAttribute('height', this._tokenSize);
      const text = token.querySelector('text');
      if (text) text.setAttribute('font-size', fontSize);
    });
    return this;
  }

  setShootingLine(active) {
    this._shootingActive = active;
    const display = active ? '' : 'none';
    this._q('shooting-line').setAttribute('display', display);
    this._q('shooting-triangle').setAttribute('display', display);
    if (active) this._updateShootingLine();
    return this;
  }

  moveGoalieToIdealPosition(duration = 700) {
    if (!this._shootingActive) return this;
    const ball   = this._q('ball');
    const bx     = parseFloat(ball.dataset.x);
    const by     = parseFloat(ball.dataset.y);
    const id     = this._shootingTarget === 'right' ? 'opponent-g' : 'player-g';
    const goalie = this._q(id);
    const ideal  = this._calcIdealGoaliePos(bx, by);
    if (this._cancelGoalieAnim) this._cancelGoalieAnim();
    this._cancelGoalieAnim = animateToken(
      goalie, ideal.x, ideal.y, ideal.angle,
      (t) => this._updateTransform(t),
      duration,
    );
    return this;
  }

  getState() {
    const tokens = {};
    this._svg.querySelectorAll(`.${this._uid}-token`).forEach(t => {
      tokens[t.id] = {
        x:     parseFloat(t.dataset.x),
        y:     parseFloat(t.dataset.y),
        angle: parseFloat(t.dataset.angle ?? '0'),
      };
    });
    return {
      tokens,
      shooting: { active: this._shootingActive, target: this._shootingTarget },
      lang:      this._lang,
      tokenSize: this._tokenSize,
    };
  }

  setState(state) {
    if (state.tokens) {
      Object.entries(state.tokens).forEach(([id, pos]) => {
        const el = this._svg.querySelector(`#${id}`);
        if (!el) return;
        el.dataset.x     = pos.x;
        el.dataset.y     = pos.y;
        el.dataset.angle = pos.angle ?? 0;
        this._updateTransform(el);
      });
    }
    if (state.lang)      this.setLang(state.lang);
    if (state.tokenSize) this.setTokenSize(state.tokenSize);
    if (state.shooting)  this.setShootingLine(state.shooting.active);
    return this;
  }

  reset() {
    this._ballOwner = null;
    this._svg.querySelectorAll(`.${this._uid}-token`).forEach(token => {
      if (token.dataset.type === 'cone') return;
      if (token.dataset.type === 'ball') {
        token.dataset.x = '600'; token.dataset.y = '350';
      } else {
        token.dataset.x     = token.dataset.initX;
        token.dataset.y     = token.dataset.initY;
        token.dataset.angle = '0';
      }
      this._updateTransform(token);
    });
    this.setShootingLine(false);
    return this;
  }

  setPlayers(players) {
    this._opts.players = players;
    this._resetTokenGroup('player', players);
    return this;
  }

  setOpponents(opponents) {
    this._opts.opponents = opponents;
    this._resetTokenGroup('opponent', opponents);
    return this;
  }

  setTeams(home, away) {
    if (home) this._opts.home = { ...this._opts.home, ...home };
    if (away) this._opts.away = { ...this._opts.away, ...away };
    const { home: h, away: a } = this._opts;
    const updateSym = (symId, color, accent) => {
      const sym = this._svg.querySelector(`#${symId}`);
      if (!sym) return;
      sym.querySelector('path').setAttribute('fill', color);
      sym.querySelector('path').setAttribute('stroke', accent);
      const cage = sym.querySelector('g');
      if (cage) cage.setAttribute('stroke', accent);
    };
    updateSym(`${this._uid}-sym-player`,          h.color, h.accent);
    updateSym(`${this._uid}-sym-player-goalie`,   h.color, h.accent);
    updateSym(`${this._uid}-sym-opponent`,         a.color, a.accent);
    updateSym(`${this._uid}-sym-opponent-goalie`,  a.color, a.accent);
    this._svg.querySelectorAll('[data-type="player"] text').forEach(t => t.setAttribute('fill', h.accent));
    this._svg.querySelectorAll('[data-type="opponent"] text').forEach(t => t.setAttribute('fill', a.accent));
    return this;
  }

  setBallOwner(tokenId) {
    this._ballOwner = tokenId ?? null;
    if (this._ballOwner) this._placeBallAtOwner();
    return this;
  }

  addCone(x, y) {
    const u     = this._uid;
    const layer = this._q('tokens');
    const ball  = this._q('ball');
    const idx   = layer.querySelectorAll('[data-type="cone"]').length + 1;
    const id    = `cone-${idx}`;
    const g     = document.createElementNS(SVG_NS, 'g');
    g.setAttribute('id',    `${u}-${id}`);
    g.setAttribute('class', `${u}-token`);
    g.dataset.type  = 'cone';
    g.dataset.tid   = id;
    g.dataset.x     = x;
    g.dataset.y     = y;
    g.dataset.angle = '0';
    this._updateTransform(g);
    const use = document.createElementNS(SVG_NS, 'use');
    use.setAttribute('href',   `#${u}-sym-cone`);
    use.setAttribute('x',      '-14');
    use.setAttribute('y',      '-14');
    use.setAttribute('width',  '28');
    use.setAttribute('height', '28');
    g.appendChild(use);
    layer.insertBefore(g, ball);
    return this;
  }

  clearCones() {
    this._svg.querySelectorAll(`.${this._uid}-token[data-type="cone"]`).forEach(t => t.remove());
    return this;
  }

  static get _ALL_LAYER_NAMES() {
    return [
      'rink', 'zones', 'zones-left',
      'zone-attention', 'zone-awareness', 'zone-passing-first', 'zone-danger', 'zone-slot',
      'zone-attention-right', 'zone-awareness-left', 'zone-passing-first-right',
      'zone-danger-right', 'zone-slot-right',
      'zone-queue-left', 'zone-queue-right',
    ];
  }

  loadScenario(name) {
    const scenario = SCENARIOS[name];
    if (!scenario) return this;
    for (const n of FloorballBoard._ALL_LAYER_NAMES) this.setLayer(n, false);
    for (const [n, v] of Object.entries(scenario.layers)) this.setLayer(n, v);
    this.setPlayers(scenario.players);
    this.setOpponents(scenario.opponents);
    this.reset();
    return this;
  }

  getPositions() {
    const read = (type) =>
      [...this._q('tokens').querySelectorAll(`[data-type="${type}"]`)]
        .map(t => {
          const angle = Math.round(parseFloat(t.dataset.angle ?? '0'));
          const obj = {
            id:     t.dataset.tid,
            label:  t.dataset.label  || undefined,
            symbol: t.dataset.symbol || undefined,
            x: Math.round(parseFloat(t.dataset.x)),
            y: Math.round(parseFloat(t.dataset.y)),
          };
          if (angle !== 0) obj.angle = angle;
          return obj;
        });
    return { players: read('player'), opponents: read('opponent') };
  }

  lockTokens(locked) {
    this._q('tokens').querySelectorAll(`.${this._uid}-token`)
      .forEach(t => { t.style.pointerEvents = locked ? 'none' : ''; });
    return this;
  }

  animatePaths(paths, duration = 3000) {
    return new Promise(resolve => {
      const layer = this._q('tokens');
      const entries = paths
        .map(({ id, waypoints }) => {
          const token = [...layer.querySelectorAll('[data-tid]')]
            .find(t => t.dataset.tid === id);
          return token ? { token, waypoints } : null;
        })
        .filter(Boolean);
      const start = performance.now();
      const tick = (now) => {
        const t = Math.min((now - start) / duration, 1);
        entries.forEach(({ token, waypoints }) => {
          const pos = lerpWaypoints(waypoints, t);
          token.dataset.x = pos.x;
          token.dataset.y = pos.y;
          this._updateTransform(token);
        });
        if (t < 1) { this._animFrameId = requestAnimationFrame(tick); }
        else        { this._animFrameId = null; resolve(); }
      };
      if (this._animFrameId) cancelAnimationFrame(this._animFrameId);
      this._animFrameId = requestAnimationFrame(tick);
    });
  }

  stopAnimation() {
    if (this._animFrameId) { cancelAnimationFrame(this._animFrameId); this._animFrameId = null; }
    return this;
  }

  resetZoom() {
    this._vb = { x: 0, y: 0, w: 1200, h: 700 };
    this._applyVb();
    return this;
  }

  destroy() {
    this._svg.removeEventListener('mousemove', this._onMouseMove);
    this._svg.removeEventListener('wheel',     this._onWheel);
    window.removeEventListener('touchmove', this._onTouchMove);
    window.removeEventListener('mouseup',   this._onMouseUp);
    window.removeEventListener('touchend',  this._onTouchEnd);
    if (this._cancelGoalieAnim) this._cancelGoalieAnim();
    this._mount.removeChild(this._svg);
    this._handlers = {};
  }
}
