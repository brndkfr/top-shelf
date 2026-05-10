import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { FloorballBoard } from './FloorballBoard.js';
import { TOKEN_SIZE_MIN, TOKEN_SIZE_MAX, DEFAULT_PLAYERS } from './constants.js';

let mount, board;

beforeEach(() => {
  mount = document.createElement('div');
  document.body.appendChild(mount);
  board = new FloorballBoard(mount);
});

afterEach(() => {
  try { board.destroy(); } catch {}
  if (document.body.contains(mount)) document.body.removeChild(mount);
});

// ── Construction ─────────────────────────────────────────────────────────────

describe('constructor', () => {
  it('appends an SVG to the mount element', () => {
    expect(mount.querySelector('svg')).not.toBeNull();
  });

  it('renders all player and opponent tokens', () => {
    expect(mount.querySelectorAll('[data-type="player"]').length).toBe(DEFAULT_PLAYERS.length);
    expect(mount.querySelectorAll('[data-type="opponent"]').length).toBe(DEFAULT_PLAYERS.length);
  });

  it('renders the ball', () => {
    expect(mount.querySelector('[data-type="ball"]')).not.toBeNull();
  });
});

// ── setLang ───────────────────────────────────────────────────────────────────

describe('setLang', () => {
  it('updates the language returned by getState', () => {
    board.setLang('de');
    expect(board.getState().lang).toBe('de');
  });

  it('re-renders zone labels in the new language', () => {
    const textEn = Array.from(board._q('zone-labels').querySelectorAll('text')).map(t => t.textContent).join('|');
    board.setLang('de');
    const textDe = Array.from(board._q('zone-labels').querySelectorAll('text')).map(t => t.textContent).join('|');
    expect(textDe).not.toBe(textEn);
  });
});

// ── setTokenSize ──────────────────────────────────────────────────────────────

describe('setTokenSize', () => {
  it('clamps size to TOKEN_SIZE_MAX', () => {
    board.setTokenSize(9999);
    expect(board.getState().tokenSize).toBe(TOKEN_SIZE_MAX);
  });

  it('clamps size to TOKEN_SIZE_MIN', () => {
    board.setTokenSize(0);
    expect(board.getState().tokenSize).toBe(TOKEN_SIZE_MIN);
  });

  it('updates the use element dimensions', () => {
    board.setTokenSize(80);
    const use = mount.querySelector('[data-type="player"] use');
    expect(Number(use.getAttribute('width'))).toBe(80);
    expect(Number(use.getAttribute('height'))).toBe(80);
  });
});

// ── setTeams ──────────────────────────────────────────────────────────────────

describe('setTeams', () => {
  it('updates player symbol fill color', () => {
    board.setTeams({ color: '#ff0000', accent: '#ffffff' }, undefined);
    const path = board._q('sym-player').querySelector('path');
    expect(path.getAttribute('fill')).toBe('#ff0000');
  });

  it('updates opponent symbol fill color', () => {
    board.setTeams(undefined, { color: '#00ff00', accent: '#000000' });
    const path = board._q('sym-opponent').querySelector('path');
    expect(path.getAttribute('fill')).toBe('#00ff00');
  });

  it('updates player token label text color', () => {
    board.setTeams({ color: '#003871', accent: '#ff0000' }, undefined);
    const text = mount.querySelector('[data-type="player"] text');
    if (text) expect(text.getAttribute('fill')).toBe('#ff0000');
  });

  it('updates goalie cage stroke color', () => {
    board.setTeams({ color: '#003871', accent: '#aabbcc' }, undefined);
    const cage = board._q('sym-player-goalie').querySelector('g');
    expect(cage.getAttribute('stroke')).toBe('#aabbcc');
  });
});

// ── setPlayers / setOpponents ─────────────────────────────────────────────────

describe('setPlayers', () => {
  it('replaces player tokens with new definitions', () => {
    board.setPlayers([{ id: 'p1', x: 300, y: 300 }]);
    expect(mount.querySelectorAll('[data-type="player"]').length).toBe(1);
  });

  it('preserves position of tokens with matching IDs', () => {
    const def = DEFAULT_PLAYERS[1];
    board._q(def.id).dataset.x = '999';
    board._q(def.id).dataset.y = '888';
    board.setPlayers(DEFAULT_PLAYERS);
    expect(parseFloat(board._q(def.id).dataset.x)).toBeCloseTo(999);
    expect(parseFloat(board._q(def.id).dataset.y)).toBeCloseTo(888);
  });

  it('resets position for new IDs not present before', () => {
    board.setPlayers([{ id: 'brand-new', x: 123, y: 456 }]);
    const token = mount.querySelector('[data-type="player"]');
    expect(parseFloat(token.dataset.x)).toBeCloseTo(123);
    expect(parseFloat(token.dataset.y)).toBeCloseTo(456);
  });
});

describe('setOpponents', () => {
  it('replaces opponent tokens with new definitions', () => {
    board.setOpponents([{ id: 'o1', x: 800, y: 300 }]);
    expect(mount.querySelectorAll('[data-type="opponent"]').length).toBe(1);
  });
});

// ── setShootingLine ───────────────────────────────────────────────────────────

describe('setShootingLine', () => {
  it('shows shooting elements when activated', () => {
    board.setShootingLine(true);
    expect(board._q('shooting-line').getAttribute('display')).not.toBe('none');
    expect(board._q('shooting-triangle').getAttribute('display')).not.toBe('none');
  });

  it('hides shooting elements when deactivated', () => {
    board.setShootingLine(true);
    board.setShootingLine(false);
    expect(board._q('shooting-line').getAttribute('display')).toBe('none');
  });
});

// ── reset ─────────────────────────────────────────────────────────────────────

describe('reset', () => {
  it('returns the ball to center', () => {
    const ball = mount.querySelector('[data-type="ball"]');
    ball.dataset.x = '100';
    ball.dataset.y = '100';
    board.reset();
    expect(parseFloat(ball.dataset.x)).toBe(600);
    expect(parseFloat(ball.dataset.y)).toBe(350);
  });

  it('returns player tokens to their initial positions', () => {
    const def = DEFAULT_PLAYERS[2];
    board._q(def.id).dataset.x = '999';
    board.reset();
    expect(parseFloat(board._q(def.id).dataset.x)).toBeCloseTo(def.x);
  });

  it('hides the shooting line', () => {
    board.setShootingLine(true);
    board.reset();
    expect(board._q('shooting-line').getAttribute('display')).toBe('none');
  });
});

// ── getState / setState ───────────────────────────────────────────────────────

describe('getState / setState', () => {
  it('round-trips token positions', () => {
    const ball = mount.querySelector('[data-type="ball"]');
    ball.dataset.x = '700';
    ball.dataset.y = '400';
    const state = board.getState();
    board.reset();
    board.setState(state);
    expect(parseFloat(ball.dataset.x)).toBeCloseTo(700);
    expect(parseFloat(ball.dataset.y)).toBeCloseTo(400);
  });
});

// ── drag behavior ─────────────────────────────────────────────────────────────

describe('drag behavior', () => {
  const svg = () => mount.querySelector('svg');

  function drag(token, fromX, fromY, toX, toY) {
    token.dispatchEvent(new MouseEvent('mousedown', { clientX: fromX, clientY: fromY, bubbles: true }));
    svg().dispatchEvent(new MouseEvent('mousemove', { clientX: toX, clientY: toY }));
    window.dispatchEvent(new MouseEvent('mouseup'));
  }

  it('moves a token to the dragged position', () => {
    const ball = mount.querySelector('[data-type="ball"]');
    drag(ball, 600, 350, 700, 400);
    expect(parseFloat(ball.dataset.x)).toBeCloseTo(700);
    expect(parseFloat(ball.dataset.y)).toBeCloseTo(400);
  });

  it('clamps x to the viewBox right edge', () => {
    const ball = mount.querySelector('[data-type="ball"]');
    drag(ball, 600, 350, 9999, 350);
    expect(parseFloat(ball.dataset.x)).toBe(1200);
  });

  it('clamps x to the viewBox left edge', () => {
    const ball = mount.querySelector('[data-type="ball"]');
    drag(ball, 600, 350, -9999, 350);
    expect(parseFloat(ball.dataset.x)).toBe(0);
  });

  it('clamps y to the viewBox bottom edge', () => {
    const ball = mount.querySelector('[data-type="ball"]');
    drag(ball, 600, 350, 600, 9999);
    expect(parseFloat(ball.dataset.y)).toBe(700);
  });

  it('clamps y to the viewBox top edge', () => {
    const ball = mount.querySelector('[data-type="ball"]');
    drag(ball, 600, 350, 600, -9999);
    expect(parseFloat(ball.dataset.y)).toBe(0);
  });

  it('emits tokenMoved after a drag', () => {
    const handler = vi.fn();
    board.on('tokenMoved', handler);
    const ball = mount.querySelector('[data-type="ball"]');
    drag(ball, 600, 350, 700, 350);
    expect(handler).toHaveBeenCalledWith(expect.objectContaining({ x: 700, y: 350 }));
  });

  it('emits tokenRotated on click without movement', () => {
    const handler = vi.fn();
    board.on('tokenRotated', handler);
    const player = mount.querySelector('[data-type="player"]');
    player.dispatchEvent(new MouseEvent('mousedown', { clientX: 0, clientY: 0, bubbles: true }));
    window.dispatchEvent(new MouseEvent('mouseup'));
    expect(handler).toHaveBeenCalled();
  });
});

// ── event emitter ─────────────────────────────────────────────────────────────

describe('event emitter', () => {
  it('removes a handler with off', () => {
    const handler = vi.fn();
    board.on('tokenMoved', handler);
    board.off('tokenMoved', handler);
    board._emit('tokenMoved', { id: 'test', x: 0, y: 0, angle: 0 });
    expect(handler).not.toHaveBeenCalled();
  });
});

// ── destroy ───────────────────────────────────────────────────────────────────

describe('destroy', () => {
  it('removes the SVG from the mount element', () => {
    board.destroy();
    expect(mount.querySelector('svg')).toBeNull();
    board = { destroy: () => {} }; // prevent double-destroy in afterEach
  });
});
