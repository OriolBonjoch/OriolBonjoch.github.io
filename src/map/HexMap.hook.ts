import React, {
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import { MapContext } from "./map.context";
import { ShipContext } from "../ships/ship.context";
import { useWindowSize } from "../utils/window-size.hook";
import { ShipType } from "../ships/ship.types";
import { calcCoords } from "./Hex";

type SizeType = { x: number; y: number };

const bound = (value: number, min: number, max: number) =>
  value < min ? min : value > max ? max : value;

const rotTable = (shipRot: number, newRot: number) => {
  return [0, 1, 1, 2, 2, 3, 4, 3, 2, 2, 1, 1, 0][
    Math.abs(shipRot - newRot) % 12
  ];
};

const getVector = (i: number, j: number): number[] => {
  if (j === 0) return i > 0 ? [6] : [0];
  if (i === 0) return j > 0 ? [9] : [3];

  const degrees = Math.round((Math.atan(j / i) * 180) / Math.PI);
  if (degrees === -60) return j > 0 ? [10] : [4];
  if (degrees === -30) return j > 0 ? [11] : [5];
  if (degrees === 30) return j > 0 ? [7] : [1];
  if (degrees === 60) return j > 0 ? [8] : [2];

  // Mid points
  if (degrees < -60) return j > 0 ? [9, 10] : [3, 4];
  if (degrees < -30) return j > 0 ? [10, 11] : [4, 5];
  if (degrees < 0) return j > 0 ? [0, 11] : [5, 6];
  if (degrees < 30) return j > 0 ? [6, 7] : [0, 1];
  if (degrees < 60) return j > 0 ? [7, 8] : [1, 2];
  return j > 0 ? [8, 9] : [2, 3];
};

function getPenalty(rotation: number, i: number, j: number) {
  const newVectors = getVector(i, j);
  const penalties = newVectors.map((r) => rotTable(rotation, r));
  const penalty = Math.min(...penalties);
  const degrees = Math.round((Math.atan(j / i) * 180) / Math.PI);

  return {
    newRotation: newVectors[penalties.indexOf(penalty)],
    penalty,
    degrees,
  };
}

export type MoveType = {
  x: number;
  y: number;
  name: string;
  step: number;
} & (
  | {
      isBase: true;
    }
  | {
      isBase: false;
      acc: number;
      rot: number;
    }
);

function getMoves(
  ship: ShipType,
  size: SizeType,
  visited: MoveType[],
  step: number
): MoveType[] {
  const todo =
    visited.length === 1
      ? visited
      : visited.filter((m) => !m.isBase && m.step === step - 1);

  if (step > ship.speed + ship.acceleration) return visited;
  const addTo = (newMoves: MoveType[], x: number, y: number) => {
    if (x < 0 || x >= size.x || y < 0 || y >= size.y) return;
    if (newMoves.some((m) => m.x === x && m.y === y)) return;
    if (visited.some((m) => m.x === x && m.y === y)) return;

    const shipCoords = calcCoords(ship.x, ship.y);
    const coords = calcCoords(x, y);
    const { penalty, newRotation } = getPenalty(
      ship.rotation,
      coords[0] - shipCoords[0],
      coords[1] - shipCoords[1]
    );
    newMoves.push({
      x,
      y,
      name: ship.name,
      isBase: false,
      acc: step - ship.speed + penalty,
      rot: newRotation,
      step,
    });
  };

  todo.forEach((current) => {
    const newMoves: MoveType[] = [];
    addTo(newMoves, current.x, current.y - 1);
    addTo(newMoves, current.x - 1, current.y + (current.x % 2 ? 0 : -1));
    addTo(newMoves, current.x + 1, current.y + (current.x % 2 ? 0 : -1));
    addTo(newMoves, current.x - 1, current.y + (current.x % 2 ? 1 : 0));
    addTo(newMoves, current.x + 1, current.y + (current.x % 2 ? 1 : 0));
    addTo(newMoves, current.x, current.y + 1);

    visited.push(...newMoves);
  });

  return getMoves(ship, size, visited, step + 1);
}

// function getVectors(ship: ShipType, size: SizeType) {
//   const moves: MoveType[] = [];
//   // console.log("ship coords", ship.x, ship.y);
//   for (let x = 0; x < size.x; x++) {
//     for (let y = 0; y < size.y; y++) {
//       if (ship.x === x && ship.y === y) {
//         moves.push({
//           x: ship.x,
//           y: ship.y,
//           isBase: true,
//           name: ship.name,
//         });
//       } else {
//         const [i, j] = calcCoords(x - ship.x, y - ship.y);
//         moves.push({
//           x,
//           y,
//           isBase: false,
//           name: ship.name,
//           rot: ship.rotation,
//           acc: getPenalty(ship.rotation, i, j)?.penalty,
//         });
//       }
//     }
//   }

//   return moves;
// }

export const useHexMap = function () {
  const { size, viewport, dragBox, dragTo } = useContext(MapContext);
  const { move } = useContext(ShipContext);
  const [shipMoves, setShipMoves] = useState<MoveType[]>([]);

  const clickStart = useRef<SizeType | null>(null);
  const [offset, setOffset] = useState<[number, number]>([0, 0]);
  const { ratio, width } = useWindowSize();
  const [vp0, vp1, vp2] = viewport;

  const rate = vp2 / width;
  const svgSize = useMemo(
    () => ({
      width: "100vw",
      height: `calc(${Math.floor(100 * ratio)}vw - 64px)`,
    }),
    [ratio]
  );

  const onHexMoveStart = useCallback(
    (ship: ShipType) => {
      const moves = getMoves(
        ship,
        size,
        [{ x: ship.x, y: ship.y, isBase: true, name: ship.name, step: 0 }],
        1
      ).filter((m) => m.isBase || Math.abs(m.acc) <= ship.acceleration);
      // const moves = getVectors(ship, size);
      setShipMoves(moves);
    },
    [size]
  );

  const onHexMoveEnd = useCallback(
    ({
      name,
      x,
      y,
      rot,
      acc,
    }: {
      x: number;
      y: number;
      name: string;
      acc: number;
      rot: number;
    }) => {
      move(name, x, y, acc, rot);
      setShipMoves([]);
    },
    [move]
  );

  const onMouseMove = useCallback(
    (ev: React.MouseEvent<SVGElement>) => {
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
    },
    [dragBox.maxX, dragBox.maxY, dragBox.minX, dragBox.minY, rate, vp0, vp1]
  );

  const onMouseUp = useCallback(
    (ev: React.MouseEvent<SVGElement>) => {
      dragTo(offset);
      setOffset([0, 0]);
      clickStart.current = null;
    },
    [dragTo, offset]
  );

  return {
    shipMoves,
    svgSize,
    offset,
    onHexMoveStart,
    onHexMoveEnd,
    onHexMoveCancel: () => setShipMoves([]),
    onMouseMove,
    onMouseUp,
  };
};
