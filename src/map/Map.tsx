import { useCallback, useContext, useRef, useState } from "react";
import ShipForm from "../ships/ShipForm";
import { MapContext } from "./map.context";
import Hex from "./Hex";
import { ShipContext } from "../ships/ship.context";
import { useWindowSize } from "../utils/window-size.hook";
import { ShipType } from "../ships/ship.types";
import "./Map.css";

const bound = (value: number, min: number, max: number) => value < min ? min : (value > max ? max : value);
const MAX_ACCELERATION = 9;
const rotTable = (shipRot: number, newRot: number) => {
  return [0, 1, 1, 2, 2, 3, 4, 3, 2, 2, 1, 1, 0][Math.abs(shipRot - newRot) % 12];
}

export type MoveType = {
  x: number;
  y: number;
  name: string;
  isBase: boolean;
  acc?: number;
  rot?: number;
}

export default function HexMap() {
  const { size, isCreated, viewport, dragBox, dragTo } = useContext(MapContext);
  const { ships, move } = useContext(ShipContext);
  const [shipMoves, setShipMoves] = useState<MoveType[]>([]);

  const [createShip, setCreateShip] = useState<{ x: number; y: number } | null>(
    null
  );

  const clickStart = useRef<null | {x: number, y: number}>(null);
  const [offset, setOffset] = useState<[number, number]>([0,0]);
  const { ratio, width } = useWindowSize();
  const svgSize = { width: "100vw", height: `calc(${Math.floor(100 * ratio)}vw - 64px)` };
  const [vp0, vp1, vp2, vp3] = viewport;
  const rate = vp2 / width;

  const onMoveStart = useCallback((ship: ShipType) => {
    const moves: MoveType[] = [
      { x: ship.x, y: ship.y, isBase: true, name: ship.name },
    ];
    const addMoves = (x: number, y: number, newRot: number, dist: number) => {
      const acc = dist - ship.speed + rotTable(newRot, ship.rotation);
      if (!ships.some(s => s.x === x && s.y === y) && Math.abs(acc) <= MAX_ACCELERATION) {
        moves.push({ x, y, acc, name: ship.name, rot: newRot, isBase: false });
      }
    };

    for (let y = ship.y + 1; y < size.y; y++) addMoves(ship.x, y, 9, y - ship.y);
    for (let y = ship.y - 1; y >= 0; y--) addMoves(ship.x, y, 3, ship.y - y);
    for (let x = ship.x - 1; x >= 0; x--) {
      const y = ship.y - (ship.x % 2 ? Math.floor : Math.ceil)((ship.x - x) / 2);
      if (y < 0) break;
      addMoves(x, y, 1, ship.x - x);
    }
    for (let x = ship.x - 1; x >= 0; x--) {
      const y = ship.y + (ship.x % 2 ? Math.ceil : Math.floor)((ship.x - x) / 2);
      if (y >= size.y) break;
      addMoves(x, y, 11, ship.x - x);
    }
    for (let x = ship.x + 1; x < size.x; x++) {
      const y = ship.y - (ship.x % 2 ? Math.floor : Math.ceil)((x - ship.x) / 2);
      if (y < 0) break;
      addMoves(x, y, 5, x - ship.x);
    }
    for (let x = ship.x + 1; x < size.x; x++) {
      const y = ship.y + (ship.x % 2 ? Math.ceil : Math.floor)((x - ship.x) / 2);
      if (y >= size.y) break;
      addMoves(x, y, 7, x - ship.x);
    }

    setShipMoves(moves);
  },[ships, size.x, size.y]);

  const onMoveEnd = useCallback(({ name, x, y, rot, acc }: MoveType) => {
    move(name, x, y, acc!, rot);
    setShipMoves([]);
  },[move]);

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
        onMouseMove={(ev) => {
          if (clickStart.current) {
            setOffset([
              bound(
                vp0 + (clickStart.current.x - ev.clientX) * rate,
                dragBox.minX,
                dragBox.maxX
              ) - vp0,
              bound(
                vp1 + (clickStart.current.y - ev.clientY) * rate,
                dragBox.minY,
                dragBox.maxY
              ) - vp1,
            ]);
          }
        }}
        onMouseDown={(ev) => {
          clickStart.current = { x: ev.clientX, y: ev.clientY };
        }}
        onMouseUp={(ev) => {
          dragTo(offset);
          setOffset([0, 0]);
          clickStart.current = null;
        }}
      >
        {points.map(({ i, j }) => {
          const ship = ships.find((s) => s.x === i && s.y === j);
          const pointMove = shipMoves.find(m => m.x === i && m.y === j);

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
                    ? () => setShipMoves([])
                    : undefined
                  : pointMove
                  ? () => onMoveEnd(pointMove)
                  : () => setCreateShip({ x: i, y: j })
              }
              onMoveStart={ship ? () => onMoveStart(ship) : undefined}
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
