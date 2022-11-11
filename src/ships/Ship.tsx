const sqrt3 = Math.floor(1000 * Math.sqrt(3)) / 1000;
const halfsqrt3 = sqrt3 / 2;

export default function Ship({
  rot,
  x,
  y,
  color,
}: {
  rot: number;
  x: number;
  y: number;
  color: string;
}) {
  const x0 = 1.5 * x;
  const y0 = sqrt3 * y + (x % 2 ? halfsqrt3 : 0);

  return (
    <g
      transform={`translate(${x0} ${y0}) rotate(${30 * (rot % 12)})`}
      style={{ stroke: "none", fill: color }}
    >
      <path d={`M -0.7 0 L 0.5 -0.5 L 0.2 0 L 0.5 0.5 z`} />
    </g>
  );
}
