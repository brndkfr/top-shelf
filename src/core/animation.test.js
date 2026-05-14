import { describe, it, expect, vi, afterEach } from 'vitest';
import { gsap } from 'gsap';
import { animateToken } from './animation.js';

const makeToken = (x, y, angle = 0) => ({
  dataset: { x: String(x), y: String(y), angle: String(angle) },
});

// Advance gsap's globalTimeline far beyond any active tween's duration.
const fastForward = () =>
  gsap.globalTimeline.totalTime(gsap.globalTimeline.totalTime() + 100);

describe('animateToken', () => {
  afterEach(() => { gsap.killTweensOf('*'); });

  it('moves token to target position at end of animation', () => {
    const token = makeToken(0, 0);
    animateToken(token, 100, 200, 0, vi.fn());
    fastForward();
    expect(parseFloat(token.dataset.x)).toBeCloseTo(100);
    expect(parseFloat(token.dataset.y)).toBeCloseTo(200);
  });

  it('rotates via the shortest angular path', () => {
    // 350° → 10°: shortest path is +20°, not −340°; stored value is 370
    const token = makeToken(0, 0, 350);
    animateToken(token, 0, 0, 10, vi.fn());
    fastForward();
    expect(parseFloat(token.dataset.angle)).toBeCloseTo(370);
  });

  it('cancel function stops the animation', () => {
    const token = makeToken(0, 0);
    const cancel = animateToken(token, 100, 100, 0, vi.fn());
    cancel();
    fastForward();
    // After cancel, no further onUpdate runs — token stays near 0,0
    expect(parseFloat(token.dataset.x)).toBeCloseTo(0);
    expect(parseFloat(token.dataset.y)).toBeCloseTo(0);
  });
});
