import {
  SVG_NS, GOALS, GOAL_POSTS, GOAL_LINE_CENTERS, GOALIE_STAND_OFFSET,
  DEFAULT_TOKEN_SIZE, TOKEN_SIZE_MIN, TOKEN_SIZE_MAX,
  DEFAULT_PLAYERS, DEFAULT_OPPONENTS, ZONE_LABELS, ZONE_LABELS_LEFT,
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

export class FloorballBoard {
  // ── Construction ────────────────────────────────────────────────────────────

  constructor(mountEl, options = {}) {
    this._uid   = `fb${++_instanceCount}`;
    this._mount = mountEl;

    this._opts = {
      lang:      'en',
      tokenSize: DEFAULT_TOKEN_SIZE,
      layers:    { rink: true, zones: true },
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

    // Event subscriptions
    this._handlers = {};

    this._buildSvg();
    this._renderAllTokens();
    this._renderZoneLabels();
    if (!this._opts.layers.zones) this._q('zone-labels').setAttribute('display', 'none');
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
  </g>

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
  }

  _handleUp() {
    if (!this._dragging) return;
    const token = this._dragging;
    if (!this._dragMoved) {
      if (token.dataset.type !== 'ball') {
        const angle = (parseFloat(token.dataset.angle ?? '0') + 45) % 360;
        token.dataset.angle = angle;
        this._updateTransform(token);
        this._emit('tokenRotated', { id: token.id, angle });
      } else if (this._shootingActive) {
        this._shootingTarget = this._shootingTarget === 'right' ? 'left' : 'right';
        this._updateShootingLine();
        this._emit('goalSwitched', { target: this._shootingTarget });
      }
    } else {
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

  // ── Private: event binding ───────────────────────────────────────────────────

  _bindEvents() {
    // Store bound handlers for cleanup
    this._onMouseMove  = (e) => this._handleMove(e.clientX, e.clientY);
    this._onMouseUp    = ()  => this._handleUp();
    this._onTouchMove  = (e) => { e.preventDefault(); this._handleMove(e.touches[0].clientX, e.touches[0].clientY); };
    this._onTouchEnd   = ()  => this._handleUp();

    this._svg.addEventListener('mousemove', this._onMouseMove);
    window.addEventListener('mouseup',      this._onMouseUp);
    window.addEventListener('touchmove', this._onTouchMove, { passive: false });
    window.addEventListener('touchend',     this._onTouchEnd);

    // Attach per-token mousedown/touchstart after tokens are rendered
    this._svg.addEventListener('mousedown', (e) => {
      const token = e.target.closest(`.${this._uid}-token`);
      if (token) { e.preventDefault(); this._startDrag(token, e.clientX, e.clientY); }
    });
    this._svg.addEventListener('touchstart', (e) => {
      const token = e.target.closest(`.${this._uid}-token`);
      if (token) { e.preventDefault(); this._startDrag(token, e.touches[0].clientX, e.touches[0].clientY); }
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
        name === 'zone-danger-right'    || name === 'zone-slot-right'      || name === 'zone-passing-first-right') {
      this._q(name).setAttribute('display', visible ? '' : 'none');
      return this;
    }
    const el = this._q(`${name}-image`);
    if (el) el.setAttribute('opacity', visible ? 1 : 0);
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
    this._svg.querySelectorAll(`.${this._uid}-token`).forEach(token => {
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

  static get _ALL_LAYER_NAMES() {
    return [
      'rink', 'zones', 'zones-left',
      'zone-attention', 'zone-awareness', 'zone-passing-first', 'zone-danger', 'zone-slot',
      'zone-attention-right', 'zone-awareness-left', 'zone-passing-first-right',
      'zone-danger-right', 'zone-slot-right',
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

  destroy() {
    this._svg.removeEventListener('mousemove',  this._onMouseMove);
    window.removeEventListener('touchmove',  this._onTouchMove);
    window.removeEventListener('mouseup',  this._onMouseUp);
    window.removeEventListener('touchend', this._onTouchEnd);
    if (this._cancelGoalieAnim) this._cancelGoalieAnim();
    this._mount.removeChild(this._svg);
    this._handlers = {};
  }
}
