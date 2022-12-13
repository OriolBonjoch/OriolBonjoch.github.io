import { useCallback, useContext, useState } from "react";
import { ShipContext } from "../ships/ShipContext";
import { ShipType } from "../ships/ship.types";
import { calculateAllMoves, calculatePenalty } from "../utils/move.hook";

// TODO: MoveType hack, don't join base with rest
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
      text: string;
      isValid: boolean;
      rotation: number;
      distance: number;
    }
);

export const useHexMap = function () {
  const [shipName, setShipName] = useState<string>();
  const [shipMoves, setShipMoves] = useState<MoveType[]>([]);
  const { ships, prepareShip } = useContext(ShipContext);
  const [isFirstMovement, setIsFirstMovement] = useState(false);

  const onHexMoveStart = useCallback((ship: ShipType) => {
    const acceleration = ship.nextMove.acceleration || 0;
    const moves: MoveType[] = [
      { x: ship.x, y: ship.y, isBase: true, name: ship.name },
      ...calculateAllMoves(ship.x, ship.y, ship.speed + acceleration, ship.rotation).map(
        ({ x, y, rotation, isValid, acceleration, distance }) =>
          ({ isBase: false, name: ship.name, x, y, rotation, text: `${distance}`, isValid, distance } as MoveType)
      ),
    ];
    setShipMoves(moves);
    setShipName(ship.name);
    setIsFirstMovement(true);
  }, []);

  const onHexMoveSetPath = useCallback(
    (x: number, y: number, rotation: number, distance: number) => {
      const ship = ships.find((s) => s.name === shipName);
      const lastMove = ship?.nextMove.moves.slice(-1)[0]; // previous move
      if (!shipName || !ship || !lastMove) {
        console.error("something is missing", shipName, ship, lastMove);
        return;
      }

      const totalDistance = ship.speed + (ship.nextMove.acceleration || 0);
      const penalty = calculatePenalty(lastMove.rotation, rotation);
      const pendingDistance = isFirstMovement
        ? totalDistance
        : ship.nextMove.moves.reduce((acc, cur) => acc - cur.distance - cur.penalty, totalDistance);

      prepareShip(shipName, x, y, rotation, isFirstMovement);
      if (distance + penalty >= pendingDistance) {
        setShipMoves([]);
        return;
      }

      const moves: MoveType[] = [
        { x, y, isBase: true, name: shipName },
        ...calculateAllMoves(x, y, pendingDistance - distance - penalty, rotation).map(
          ({ x, y, rotation, isValid, distance }) =>
            ({ isBase: false, name: shipName, x, y, rotation, text: `${distance}`, isValid, distance } as MoveType)
        ),
      ];

      setShipMoves(moves);
      if (isFirstMovement) setIsFirstMovement(false);
    },
    [isFirstMovement, prepareShip, shipName, ships]
  );

  return {
    shipMoves,
    onHexMoveStart,
    onHexMoveCancel: () => setShipMoves([]),
    onHexMoveSetPath,
  };
};
