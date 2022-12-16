import { Ship } from "../ships/Ship";
import { ShipType } from "../ships/ship.types";
import { HexShipGhostMovement } from "./HexShipGhostMovement";

export function HexStaticShip({ ship }: { ship: ShipType }) {
  const { x, y, color, texture, rotation } = ship;
  return (
    <>
      <HexShipGhostMovement key={ship.name} ship={ship} />
      <Ship x={x} y={y} color={color} texture={texture} rot={rotation} />
    </>
  );
}
