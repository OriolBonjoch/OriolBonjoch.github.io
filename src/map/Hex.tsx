import { ShipType } from "../ships/ship.types";
import { ShipAction, ShipActionKind } from "./Map";
import "./Hex.css";

const sqrt3 = Math.floor(1000 * Math.sqrt(3)) / 1000;
const halfsqrt3 = sqrt3 / 2;
export function calcCoords(x: number, y :number) {
  const x0 = 1.5 * x;
  const y0 = sqrt3 * y + (x % 2 ? halfsqrt3 : 0);
  return [x0, y0];
}

export default function Hex({
  x,
  y,
  onClick,
  onMouseEnter,
  hasHover,
  ship,
  action,
  startAction
}: {
  x: number;
  y: number;
  ship?: ShipType;
  onClick?: () => void;
  onMouseEnter?: () => void;
  hasHover?: boolean;
  action?: ShipAction;
  startAction: (action: ShipActionKind) => void;
}) {
  const [x0, y0] = calcCoords(x, y);
  const hexId = `hex_${x}_${y}`;
  const isAShipMoving =
    action &&
    action.kind === "move" &&
    action.tox === x &&
    action.toy === y &&
    (!ship || ship.name === action.ship.name);
  const isThisShipMoving = action && action.kind === "move" && action.ship.x === x && action.ship.y === y;
  
  return (
    <>
      <g
        id={hexId}
        transform={`translate(${x0} ${y0})`}
        className={hasHover ? `hex-cell${ship ? "-ship" : ""}` : undefined}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
      >
        <path
          d={`M -1 0 L -0.5 ${-halfsqrt3} L 0.5 ${-halfsqrt3} L 1 0 L 0.5 ${halfsqrt3} L -0.5 ${halfsqrt3} z`}
        />
        {isAShipMoving ? (
          <g
            transform={`rotate(${30 * (action!.ship.rotation % 12)})`}
            style={{ stroke: "none", fill: action!.ship.color }}
          >
            <path d={`M -0.7 0 L 0.5 -0.5 L 0.2 0 L 0.5 0.5 z`} />
          </g>
        ) : ship && !isThisShipMoving ? (
          <g
            transform={`rotate(${30 * (ship.rotation % 12)})`}
            style={{ stroke: "none", fill: ship.color }}
          >
            <path d={`M -0.7 0 L 0.5 -0.5 L 0.2 0 L 0.5 0.5 z`} />
          </g>
        ) : null}
        {ship && !action ? (
          <g className="ship-menu">
            <circle
              cx="0"
              cy="-0.8"
              r="0.3"
              onClick={() => startAction!("move")}
            />
            <circle
              cx="0"
              cy="-0.8"
              r="0.3"
              onClick={() => startAction!("rotate")}
              transform="rotate(-60 0 0)"
            >
              <animateTransform
                attributeName="transform"
                attributeType="XML"
                type="rotate"
                from="0 0 0"
                to="-60 0 0"
                dur="200ms"
                begin={`${hexId}.mouseenter`}
                repeatCount="1"
              />
            </circle>
            <circle cx="0" cy="-0.8" r="0.3" transform="rotate(-120 0 0)">
              <animateTransform
                attributeName="transform"
                attributeType="XML"
                type="rotate"
                from="0 0 0"
                to="-120 0 0"
                dur="200ms"
                begin={`${hexId}.mouseenter`}
                repeatCount="1"
              />
            </circle>
          </g>
        ) : null}
      </g>
    </>
  );
}
