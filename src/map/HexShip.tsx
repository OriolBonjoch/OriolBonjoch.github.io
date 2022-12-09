import Ship from "../ships/Ship";
import { ShipType } from "../ships/ship.types";

export function HexShip({ ship }: { ship: ShipType }) {
  const { x, y, color, rotation } = ship;
  console.log("hexship color", color);
  return <Ship x={x} y={y} color={color} texture={color[0] === "#" ? undefined : color} rot={rotation} />;
}
