export function animateToken(token, targetX, targetY, targetAngle, updateTransform, duration = 700) {
  const startX     = parseFloat(token.dataset.x);
  const startY     = parseFloat(token.dataset.y);
  const startAngle = parseFloat(token.dataset.angle ?? '0');
  // shortest-path delta on the angle circle
  const delta = ((targetAngle - startAngle) % 360 + 540) % 360 - 180;
  const start = performance.now();
  let rafId = null;

  function step(now) {
    const t    = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - t, 3); // ease-out cubic
    token.dataset.x     = startX     + (targetX - startX) * ease;
    token.dataset.y     = startY     + (targetY - startY) * ease;
    token.dataset.angle = startAngle + delta * ease;
    updateTransform(token);
    if (t < 1) rafId = requestAnimationFrame(step);
  }

  rafId = requestAnimationFrame(step);
  return () => { if (rafId !== null) cancelAnimationFrame(rafId); };
}
