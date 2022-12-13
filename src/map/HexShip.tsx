import { animated, useSpring } from "react-spring";
import Ship from "../ships/Ship";
import { ShipType } from "../ships/ship.types";
import { calcCoords } from "./map.helper";

export function HexShip({ ship }: { ship: ShipType }) {
  const { x, y, color, rotation } = ship;
  return <Ship x={x} y={y} color={color} texture={color[0] === "#" ? undefined : color} rot={rotation} />;
}

function getPath(ship: ShipType) {
  const { x, y, nextMove } = ship;
  const [x0, y0] = calcCoords(x, y);
  const pathPoints = nextMove.moves.map((m) => calcCoords(m.x, m.y));

  return pathPoints.reduce((acc, [px, py]) => `${acc} L ${px} ${py}`, `M ${x0} ${y0}`);
}

export function AnimatedHexShip({ ship }: { ship: ShipType }) {
  const { color } = ship;
  const path = getPath(ship);

  const { offsetDistance } = useSpring({
    from: { offsetDistance: "0%" },
    to: { offsetDistance: "100%" },
    loop: false,
    config: {
      duration: 1000,
    },
  });

  return (
    <>
      <animated.g style={{ offsetPath: `path("${path}")`, offsetDistance }}>
        <Ship x={0} y={0} rot={6} color={color} texture={color[0] === "#" ? undefined : color} />
      </animated.g>
    </>
  );
}
