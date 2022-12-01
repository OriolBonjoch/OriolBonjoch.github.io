import React, { useCallback, useContext, useMemo, useRef, useState } from "react";
import { MapContext } from "./map.context";
import { useWindowSize } from "../utils/window-size.hook";
import { ShipType } from "../ships/ship.types";
import { calculateAllMoves } from "../utils/move.hook";

type SizeType = { x: number; y: number };
type MoveType = {
  x: number;
  y: number;
  name: string;
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

const bound = (value: number, min: number, max: number) => (value < min ? min : value > max ? max : value);

export const useHexMap = function () {
  const { viewport, dragBox, dragTo } = useContext(MapContext);
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

  const onHexMoveStart = useCallback((ship: ShipType) => {
    const moves: MoveType[] = [
      { x: ship.x, y: ship.y, isBase: true, name: ship.name },
      ...calculateAllMoves(ship.x, ship.y, ship.speed, ship.acceleration, ship.rotation).map(
        (m) =>
          ({
            name: ship.name,
            x: m.x,
            y: m.y,
            isBase: false,
            acc: m.acceleration,
            rot: m.rotation,
          } as MoveType)
      ),
    ];
    setShipMoves(moves);
  }, []);

  const onMouseMove = useCallback(
    (ev: React.MouseEvent<SVGElement>) => {
      if (clickStart.current) {
        setOffset([
          bound(vp0 + (clickStart.current.x - ev.clientX) * rate, dragBox.minX, dragBox.maxX) - vp0,
          bound(vp1 + (clickStart.current.y - ev.clientY) * rate, dragBox.minY, dragBox.maxY) - vp1,
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
    onHexMoveCancel: () => setShipMoves([]),
    onMouseMove,
    onMouseUp,
  };
};
