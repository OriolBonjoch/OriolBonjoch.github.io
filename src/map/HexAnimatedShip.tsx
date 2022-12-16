import { animated, useSpring } from "react-spring";
import { Ship } from "../ships/Ship";
import { ShipType } from "../ships/ship.types";
import { calcCoords } from "../utils/mapper.helper";
import { HexShipGhostMovement } from "./HexShipGhostMovement";

function getAnimatedPath(ship: ShipType) {
  const { x, y, nextMove } = ship;
  const [x0, y0] = calcCoords(x, y);
  const pathPoints = nextMove.moves.map((m) => calcCoords(m.x, m.y));

  return pathPoints.reduce((acc, [px, py]) => `${acc} L ${px} ${py}`, `M ${x0} ${y0}`);
}

export function HexAnimatedShip({ ship, onFinish }: { ship: ShipType; onFinish: () => void }) {
  const { color, texture } = ship;
  const path = getAnimatedPath(ship);

  const { offsetDistance } = useSpring({
    from: { scale: 1, offsetDistance: "0%" },
    to: { offsetDistance: "100%" },
    loop: false,
    config: { duration: 3000 },
    onRest: () => onFinish(),
  });

  return (
    <>
      <HexShipGhostMovement key={ship.name} ship={ship} />
      <animated.g style={{ offsetPath: `path("${path}")`, offsetDistance }}>
        <Ship x={0} y={0} rot={6} color={color} texture={texture} />
      </animated.g>
    </>
  );
}
