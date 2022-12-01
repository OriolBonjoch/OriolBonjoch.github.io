import { ShipType } from "../ships/ship.types";
import { useState } from "react";
import "./Hex.css";

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
}: {
  x: number;
  y: number;
  ship?: ShipType;
  hasHover?: boolean;
  movement?: {
    isBase: boolean;
    acc?: number;
  };
  onClick?: () => void;
}) {
  const [x0, y0] = calcCoords(x, y);
  const hexId = `hex_${x}_${y}`;
  const [rotation, setRotation] = useState<number | null>(null);

  const rotateMouse = (ev: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    const hex = document.querySelector("#" + hexId);
    const rec = hex?.getBoundingClientRect();
    if (!rec) return;

    const [ax, ay] = [rec.x + rec.width / 2, rec.y + rec.height / 2];
    const [tx, ty] = [ev.clientX, ev.clientY];

    setRotation(Math.floor((Math.atan2(ay - ty, ax - tx) * 6) / Math.PI + 0.5));
  };

  const degrees = ship ? 30 * ((rotation === null ? ship.rotation : rotation) % 12) : 0;

  return (
    <>
      <g
        id={hexId}
        transform={`translate(${x0} ${y0})`}
        className={hasHover ? `hex-cell${ship ? "-ship" : ""}` : undefined}
        onClick={onClick}
        onMouseMove={rotation === null ? undefined : rotateMouse}
      >
        <path d={`M -1 0 L -0.5 ${-halfsqrt3} L 0.5 ${-halfsqrt3} L 1 0 L 0.5 ${halfsqrt3} L -0.5 ${halfsqrt3} z`} />
        {movement?.isBase ? (
          <path
            fill="#F44E3B"
            stroke="none"
            d="M 0 -0.5 C -0.2766 -0.5 -0.5 -0.2766 -0.5 0 s 0.2236 0.5 0.5 0.5 s 0.5 -0.2236 0.5 -0.5 S 0.2766 -0.5 0 -0.5 z m 0.25 0.6794 L 0.1794 0.25 L 0 0.0706 L -0.1794 0.25 L -0.25 0.1794 L -0.0706 0 L -0.25 -0.1794 L -0.1794 -0.25 L 0 -0.0706 L 0.1794 -0.25 L 0.25 -0.1794 L 0.0706 0 L 0.25 0.1794 z"
          />
        ) : ship ? (
          <g transform={`rotate(${degrees})`}>
            <path fill={ship.color} stroke="none" d={`M -0.7 0 L 0.5 -0.5 L 0.2 0 L 0.5 0.5 z`} />
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
        ) : (
          // ) : undefined}
          <text
            x={0.07}
            dominantBaseline="middle"
            textAnchor="middle"
            stroke="none"
            color="#61dafb99"
            fill={movement ? "orange" : undefined}
            fontSize="0.5"
          >
            {x}-{y}
          </text>
        )}
      </g>
    </>
  );
}
