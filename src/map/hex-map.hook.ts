import { useCallback, useState } from "react";
import { ShipType } from "../ships/ship.types";
import { calculateAllMoves } from "../utils/move.hook";

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