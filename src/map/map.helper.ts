const sqrt3 = Math.floor(1000 * Math.sqrt(3)) / 1000;
export const halfsqrt3 = sqrt3 / 2;
export function calcCoords(x: number, y: number) {
  const x0 = 1.5 * x;
  const y0 = sqrt3 * y + (x % 2 ? halfsqrt3 : 0);
  return [x0, y0];
}
