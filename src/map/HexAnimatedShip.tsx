import { animated, useSpring } from "react-spring";
import { Ship } from "../ships/Ship";
import { ShipType } from "../ships/ship.types";
import { calcCoords } from "../utils/mapper.helper";

function getAnimatedPath(ship: ShipType) {
  const { x, y, nextMove } = ship;
  const [x0, y0] = calcCoords(x, y);
  const pathPoints = nextMove.moves.map((m) => calcCoords(m.x, m.y));

  return pathPoints.reduce((acc, [px, py]) => `${acc} L ${px} ${py}`, `M ${x0} ${y0}`);
}

export function HexAnimatedShip({ ship, onFinish }: { ship: ShipType; onFinish: () => void }) {
  const { color } = ship;
  const path = getAnimatedPath(ship);

  const { offsetDistance } = useSpring({
    from: { offsetDistance: "0%" },
    to: { offsetDistance: "100%" },
    loop: false,
    config: { duration: 3000 },
    onRest: () => onFinish(),
  });

  return (
    <>
      <animated.g style={{ offsetPath: `path("${path}")`, offsetDistance }}>
        <Ship x={0} y={0} rot={6} color={color} texture={color[0] === "#" ? undefined : color} />
      </animated.g>
    </>
  );
}
