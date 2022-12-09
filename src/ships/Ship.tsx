import { calcCoords } from "../map/map.helper";
import { selectableShips } from "./ship-selection";

type Props = {
  rot: number;
  x: number;
  y: number;
  texture?: string;
  color: string;
};

export default function Ship({ texture, rot, x, y, color }: Props) {
  const [x0, y0] = calcCoords(x, y);
  return texture && selectableShips[texture] ? (
    <g transform={`translate(${x0} ${y0}) rotate(${30 * (rot % 12) - 90})`} style={{ stroke: "none", fill: color }}>
      <image href={selectableShips[texture]} width="1.5" height="1.5" x="-0.75" y="-0.75" />
    </g>
  ) : (
    <g transform={`translate(${x0} ${y0}) rotate(${30 * (rot % 12)})`} style={{ stroke: "none", fill: color }}>
      <path d={`M -0.7 0 L 0.5 -0.5 L 0.2 0 L 0.5 0.5 z`} />
    </g>
  );
}
