import { ShipType } from "../ships/ship.types";
import { calcCoords } from "./map.helper";

export function HexShip({ ship }: { ship: ShipType }) {
  const shipId = `hexship_${ship.name}`;
  const [x0, y0] = calcCoords(ship.x, ship.y);
  const degrees = ship ? 30 * (ship.rotation % 12) : 0;
  return (
    <g id={shipId} transform={`translate(${x0} ${y0}) rotate(${degrees})`}>
      <path fill={ship.color} stroke="none" d={`M -0.7 0 L 0.5 -0.5 L 0.2 0 L 0.5 0.5 z`} />
    </g>
  );
}
