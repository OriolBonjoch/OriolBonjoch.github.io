import { ShipType } from "../ships/ship.types";
import "./Hex.css";
import { useContext, useState } from "react";
import { ShipContext } from "../ships/ship.context";
import { MoveType } from "./HexMap.hook";

const sqrt3 = Math.floor(1000 * Math.sqrt(3)) / 1000;
const halfsqrt3 = sqrt3 / 2;
export function calcCoords(x: number, y: number) {
  const x0 = 1.5 * x;
  const y0 = sqrt3 * y + (x % 2 ? halfsqrt3 : 0);
  return [x0, y0];
}

export default function Hex({
  x,
  y,
  ship,
  hasHover,
  movement,
  onClick,
  onMoveStart,
}: {
  x: number;
  y: number;
  ship?: ShipType;
  hasHover?: boolean;
  movement?: MoveType;
  onClick?: () => void;
  onMoveStart?: () => void;
}) {
  const [x0, y0] = calcCoords(x, y);
  const hexId = `hex_${x}_${y}`;
  const [rotation, setRotation] = useState<number | null>(null);
  const { rotate, deleteShip } = useContext(ShipContext);

  const rotateMouse = (ev: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    const hex = document.querySelector("#" + hexId);
    const rec = hex?.getBoundingClientRect();
    if (!rec) return;

    const [ax, ay] = [rec.x + rec.width / 2, rec.y + rec.height / 2];
    const [tx, ty] = [ev.clientX, ev.clientY];

    setRotation(Math.floor((Math.atan2(ay - ty, ax - tx) * 6) / Math.PI + 0.5));
  };

  const onRotateEnd = () => {
    if (ship && rotation !== null) {
      rotate(ship.name, rotation);
      setRotation(null);
    }
  };

  const degrees = ship
    ? 30 * ((rotation === null ? ship.rotation : rotation) % 12)
    : 0;

  return (
    <>
      <g
        id={hexId}
        transform={`translate(${x0} ${y0})`}
        className={hasHover ? `hex-cell${ship ? "-ship" : ""}` : undefined}
        onClick={() => {
          if (onClick && (!ship || movement?.isBase)) onClick();
          onRotateEnd();
        }}
        onMouseMove={rotation === null ? undefined : rotateMouse}
      >
        <path
          d={`M -1 0 L -0.5 ${-halfsqrt3} L 0.5 ${-halfsqrt3} L 1 0 L 0.5 ${halfsqrt3} L -0.5 ${halfsqrt3} z`}
        />
        {movement?.isBase ? (
          <path
            fill="#F44E3B"
            stroke="none"
            d="M 0 -0.5 C -0.2766 -0.5 -0.5 -0.2766 -0.5 0 s 0.2236 0.5 0.5 0.5 s 0.5 -0.2236 0.5 -0.5 S 0.2766 -0.5 0 -0.5 z m 0.25 0.6794 L 0.1794 0.25 L 0 0.0706 L -0.1794 0.25 L -0.25 0.1794 L -0.0706 0 L -0.25 -0.1794 L -0.1794 -0.25 L 0 -0.0706 L 0.1794 -0.25 L 0.25 -0.1794 L 0.0706 0 L 0.25 0.1794 z"
          />
        ) : ship ? (
          <g transform={`rotate(${degrees})`}>
            <path
              fill={ship.color}
              stroke="none"
              d={`M -0.7 0 L 0.5 -0.5 L 0.2 0 L 0.5 0.5 z`}
            />
          </g>
        ) : movement ? (
          <text
            x={0.07}
            dominantBaseline="middle"
            textAnchor="middle"
            stroke="none"
            fill={movement ? "orange" : undefined}
            fontSize="0.5"
          >
            {movement.acc}
          </text>
        ) : undefined}
        {/* ) : (
          <text
            x={0.07}
            dominantBaseline="middle"
            textAnchor="middle"
            stroke="none"
            fill={movement ? "orange" : undefined}
            fontSize="0.5"
          >
            {x}-{y}
          </text>
        )} */}
        {ship && rotation === null && !movement?.isBase ? (
          <g className="ship-menu">
            <g
              transform="translate(0 -0.8)"
              onClick={() => setRotation(ship.rotation)}
            >
              <circle r="0.3" />
              <path d="M 0.1412 -0.1413 C 0.105 -0.1775 0.0553 -0.2 0 -0.2 c -0.1105 0 -0.1998 0.0895 -0.1998 0.2 s 0.0892 0.2 0.1998 0.2 c 0.0932 0 0.171 -0.0638 0.1933 -0.15 h -0.052 c -0.0205 0.0583 -0.076 0.1 -0.1413 0.1 c -0.0828 0 -0.15 -0.0673 -0.15 -0.15 s 0.0673 -0.15 0.15 -0.15 c 0.0415 0 0.0785 0.0172 0.1055 0.0445 L 0.025 -0.025 h 0.175 V -0.2 l -0.0588 0.0588 z" />
            </g>
            <g
              transform="rotate(-60 0 0) translate(0 -0.8)"
              onClick={onMoveStart}
            >
              <circle r="0.3" />
              <path
                transform="rotate(60 0 0)"
                d="M 0 -0.1 V -0.2 l 0.2 0.2 l -0.2 0.2 v -0.1 H -0.2 V -0.1 z"
              />
            </g>
            <g
              transform="rotate(-120 0 0) translate(0 -0.8)"
              onClick={() => deleteShip(ship.name)}
            >
              <circle r="0.3" />
              <path
                transform="rotate(120 0 0)"
                d="M -0.15 0.175 c 0 0.0275 0.0225 0.05 0.05 0.05 h 0.2 c 0.0275 0 0.05 -0.0225 0.05 -0.05 V -0.125 H -0.15 v 0.3 z M 0.175 -0.2 h -0.0875 l -0.025 -0.025 h -0.125 l -0.025 0.025 H -0.175 v 0.05 h 0.35 V -0.2 z"
              />
            </g>
          </g>
        ) : null}
      </g>
    </>
  );
}
