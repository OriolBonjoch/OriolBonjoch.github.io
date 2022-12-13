import { ShipType } from "../ships/ship.types";
import { calcCoords } from "./map.helper";
import "./HexMap.css";

export function HexShipGhostMovement({ ship }: { ship: ShipType }) {
  const lastMove = ship?.nextMove.moves.slice(-1)[0];
  const moveToDegrees = ship ? 30 * (lastMove.rotation % 12) : 0;
  const [x0, y0] = calcCoords(ship.x, ship.y);
  const [xf, yf] = calcCoords(lastMove.x, lastMove.y);
  const pathPoints = ship.nextMove.moves.map((m) => calcCoords(m.x, m.y));
  return (
    <>
      <g transform={`translate(${xf} ${yf}) rotate(${moveToDegrees})`}>
        <path fill="#999999" stroke="none" d={`M -0.7 0 L 0.5 -0.5 L 0.2 0 L 0.5 0.5 z`} />
      </g>
      <path
        key={`line_${ship.name}`}
        d={pathPoints.reduce((acc, [px, py]) => `${acc} L ${px} ${py}`, `M ${x0} ${y0}`)}
        fill="none"
        stroke="#999999"
        strokeWidth={0.2}
      />
    </>
  );
}
