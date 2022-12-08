import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useSpring } from "react-spring";

import { ShipType } from "../ships/ship.types";
import { calculateAllMoves } from "../utils/move.hook";
import { MapContext, MoveKind } from "./map.context";

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

export const useMapMovement = function () {
  const { dragTo, viewport, size, center } = useContext(MapContext);
  const [vp0, vp1, vp2, vp3] = viewport;
  const stringViewport = `${vp0} ${vp1} ${vp2} ${vp3}`;
  const { viewBox } = useSpring({ to: { viewBox: stringViewport }, loop: false });

  const keyPressed = useCallback(
    ({ key }: KeyboardEvent) => {
      const movement = {
        ArrowLeft: "Left",
        ArrowRight: "Right",
        ArrowUp: "Up",
        ArrowDown: "Down",
        "-": "ZoomOut",
        "+": "ZoomIn",
      }[key];

      dragTo((movement as MoveKind) ?? undefined);
    },
    [dragTo]
  );

  const buttonPoints = useMemo(() => {
    const minX = Math.floor(center.x - size.x / 2);
    const minY = Math.floor(center.y - size.y / 2);
    return [...Array(size.x + 1)].flatMap((_, i) => [...Array(size.y)].map((_, j) => ({ i: i + minX, j: j + minY })));
  }, [size, center]);

  useEffect(() => {
    window.addEventListener("keydown", keyPressed);

    return () => {
      window.removeEventListener("keydown", keyPressed);
    };
  }, [keyPressed]);

  return {
    buttonPoints,
    viewBox,
  } as const;
};

export const useHexMap = function () {
  const [shipMoves, setShipMoves] = useState<MoveType[]>([]);

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

  return {
    shipMoves,
    onHexMoveStart,
    onHexMoveCancel: () => setShipMoves([]),
  };
};
