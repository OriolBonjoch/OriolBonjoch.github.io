import { animated, useSpring } from "react-spring";
import Ship from "../ships/Ship";
import { ShipType } from "../ships/ship.types";
import { calcCoords } from "./map.helper";

export function HexShip({ ship }: { ship: ShipType }) {
  const { x, y, color, rotation } = ship;
  return <Ship x={x} y={y} color={color} texture={color[0] === "#" ? undefined : color} rot={rotation} />;
}

function getPath(ship: ShipType) {
  const { x, y, speed, rotation, nextMove } = ship;
  const [x0, y0] = calcCoords(x, y);
  const [vx, vy] = nextMove.moves[nextMove.pickedMove];
  const [x3, y3] = calcCoords(x + vx, y + vy);

  if (nextMove.rotation === rotation) {
    return `M ${x0} ${y0} L ${x3} ${y3}`;
  }

  const moveFromRadians = (Math.PI / 6) * (rotation % 12);
  const x1 = x0 - Math.cos(moveFromRadians) * speed;
  const y1 = y0 - Math.sin(moveFromRadians) * speed;
  const moveToRadians = (Math.PI / 6) * (nextMove.rotation % 12);
  const x2 = x3 + Math.cos(moveToRadians) * speed;
  const y2 = y3 + Math.sin(moveToRadians) * speed;
  return `M ${x0} ${y0} C ${x1} ${y1} ${x2} ${y2} ${x3} ${y3}`;
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
      {/* <path d={path} fill="none" /> */}
      <animated.g style={{ offsetPath: `path("${path}")`, offsetDistance }}>
        <Ship x={0} y={0} rot={6} color={color} texture={color[0] === "#" ? undefined : color} />
      </animated.g>
    </>
  );
}
