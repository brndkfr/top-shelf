import { describe, it, expect, vi, afterEach } from 'vitest';
import { animateToken } from './animation.js';

const makeToken = (x, y, angle = 0) => ({
  dataset: { x: String(x), y: String(y), angle: String(angle) },
});

describe('animateToken', () => {
  afterEach(() => vi.restoreAllMocks());

  it('moves token to target position at end of animation', () => {
    vi.spyOn(global, 'requestAnimationFrame').mockImplementation(cb => {
      cb(performance.now() + 10_000);
      return 0;
    });
    const token = makeToken(0, 0);
    animateToken(token, 100, 200, 0, vi.fn());
    expect(parseFloat(token.dataset.x)).toBeCloseTo(100);
    expect(parseFloat(token.dataset.y)).toBeCloseTo(200);
  });

  it('rotates via the shortest angular path', () => {
    vi.spyOn(global, 'requestAnimationFrame').mockImplementation(cb => {
      cb(performance.now() + 10_000);
      return 0;
    });
    // 350° → 10°: shortest path is +20°, not −340°; stored value is 370
    const token = makeToken(0, 0, 350);
    animateToken(token, 0, 0, 10, vi.fn());
    expect(parseFloat(token.dataset.angle)).toBeCloseTo(370);
  });

  it('cancel function stops the animation', () => {
    vi.spyOn(global, 'requestAnimationFrame').mockReturnValue(42);
    vi.spyOn(global, 'cancelAnimationFrame').mockImplementation(() => {});
    const token = makeToken(0, 0);
    const cancel = animateToken(token, 100, 100, 0, vi.fn());
    cancel();
    expect(cancelAnimationFrame).toHaveBeenCalledWith(42);
  });
});
