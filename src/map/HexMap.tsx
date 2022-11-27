import React, { useContext, useRef, useState } from "react";
import ShipForm from "../ships/ShipForm";
import { MapContext } from "./map.context";
import Hex from "./Hex";
import { ShipContext } from "../ships/ship.context";
import { useHexMap } from "./HexMap.hook";
import "./HexMap.css";

type SizeType = { x: number; y: number };

export default function HexMap() {
  const { size, isCreated, viewport } = useContext(MapContext);
  const { ships } = useContext(ShipContext);
  const [createShip, setCreateShip] = useState<SizeType | null>(null);

  const clickStart = useRef<SizeType | null>(null);
  const [vp0, vp1, vp2, vp3] = viewport;
  const {
    shipMoves,
    svgSize,
    offset,
    onMouseMove,
    onMouseUp,
    onHexMoveStart,
    onHexMoveCancel,
    onHexMoveEnd,
  } = useHexMap();

  if (!isCreated) {
    return null;
  }

  const { x, y } = size;
  const points = [...Array(x)].flatMap((_, i) =>
    [...Array(y)].map((_, j) => ({ i, j }))
  );

  return (
    <>
      <svg
        viewBox={`${vp0 + offset[0]} ${vp1 + offset[1]} ${vp2} ${vp3}`}
        className="hex-map"
        style={svgSize}
        onMouseMove={onMouseMove}
        onMouseDown={(ev) => {
          clickStart.current = { x: ev.clientX, y: ev.clientY };
        }}
        onMouseUp={onMouseUp}
      >
        {points.map(({ i, j }) => {
          const ship = ships.find((s) => s.x === i && s.y === j);
          const pointMove = shipMoves.find((m) => m.x === i && m.y === j);

          return (
            <Hex
              ship={ship}
              key={`${i}_${j}`}
              x={i}
              y={j}
              hasHover
              movement={pointMove}
              onClick={
                ship
                  ? pointMove?.isBase
                    ? () => onHexMoveCancel()
                    : undefined
                  : pointMove && !pointMove.isBase
                  ? () => onHexMoveEnd(pointMove)
                  : () => setCreateShip({ x: i, y: j })
              }
              onMoveStart={ship ? () => onHexMoveStart(ship) : undefined}
            />
          );
        })}
      </svg>
      {createShip ? (
        <ShipForm {...createShip} onClose={() => setCreateShip(null)} />
      ) : null}
    </>
  );
}
