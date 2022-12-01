import React, { useContext, useRef, useState } from "react";
import CreateShipForm from "../ships/CreateShipForm";
import { MapContext } from "./map.context";
import Hex, { calcCoords } from "./Hex";
import { ShipContext } from "../ships/ship.context";
import { useHexMap } from "./HexMap.hook";
import { ShipType } from "../ships/ship.types";
import UpdateShipForm from "../ships/UpdateShipForm";
import "./HexMap.css";

type SizeType = { x: number; y: number };

export default function HexMap() {
  const { size, isCreated, viewport } = useContext(MapContext);
  const { ships, prepareShip } = useContext(ShipContext);
  const [createShip, setCreateShip] = useState<SizeType | null>(null);
  const [updateShip, setUpdateShip] = useState<ShipType | null>(null);

  const clickStart = useRef<SizeType | null>(null);
  const [vp0, vp1, vp2, vp3] = viewport;
  const { shipMoves, svgSize, offset, onMouseMove, onMouseUp, onHexMoveCancel, onHexMoveStart } = useHexMap();

  if (!isCreated) {
    return null;
  }

  const { x, y } = size;
  const points = [...Array(x)].flatMap((_, i) => [...Array(y)].map((_, j) => ({ i, j })));

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
                    : () => setUpdateShip(ship)
                  : pointMove && !pointMove.isBase
                  ? () => {
                      const movedShip = ships.find((s) => s.name === pointMove.name);
                      if (!movedShip) return;
                      prepareShip(pointMove.name, pointMove.acc, pointMove.rot, i - movedShip.x, j - movedShip.y);
                      onHexMoveCancel();
                    }
                  : () => setCreateShip({ x: i, y: j })
              }
            />
          );
        })}
        {ships.map((ship) => {
          const [x1, y1] = calcCoords(ship.x, ship.y);
          const [vx, vy] = ship.nextMove.moves[ship.nextMove.pickedMove];
          const [x2, y2] = calcCoords(ship.x + vx, ship.y + vy);
          return <line key={`line_${ship.name}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#000" strokeWidth={0.3} />;
        })}
      </svg>
      {createShip ? <CreateShipForm {...createShip} onClose={() => setCreateShip(null)} /> : null}
      {updateShip ? (
        <UpdateShipForm shipname={updateShip.name} onClose={() => setUpdateShip(null)} onMoveStart={onHexMoveStart} />
      ) : null}
    </>
  );
}
