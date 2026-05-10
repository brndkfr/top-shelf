import '@testing-library/jest-dom';

// SVG APIs not implemented in jsdom
SVGElement.prototype.createSVGPoint = function () {
  const pt = { x: 0, y: 0 };
  pt.matrixTransform = (m) => ({
    x: pt.x * m.a + pt.y * m.c + m.e,
    y: pt.x * m.b + pt.y * m.d + m.f,
  });
  return pt;
};

SVGElement.prototype.getScreenCTM = () => ({
  a: 1, b: 0, c: 0, d: 1, e: 0, f: 0,
  inverse() { return this; },
});
