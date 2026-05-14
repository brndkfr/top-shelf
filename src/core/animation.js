import { gsap } from 'gsap';

export function animateToken(token, targetX, targetY, targetAngle, updateTransform, duration = 700) {
  const startAngle = parseFloat(token.dataset.angle ?? '0');
  // shortest-path delta on the angle circle
  const delta = ((targetAngle - startAngle) % 360 + 540) % 360 - 180;

  const proxy = {
    x:     parseFloat(token.dataset.x),
    y:     parseFloat(token.dataset.y),
    angle: startAngle,
  };

  const tween = gsap.to(proxy, {
    x:     targetX,
    y:     targetY,
    angle: startAngle + delta,
    duration: duration / 1000,
    ease: 'power2.out',
    onUpdate() {
      token.dataset.x     = proxy.x;
      token.dataset.y     = proxy.y;
      token.dataset.angle = proxy.angle;
      updateTransform(token);
    },
  });

  return () => tween.kill();
}
