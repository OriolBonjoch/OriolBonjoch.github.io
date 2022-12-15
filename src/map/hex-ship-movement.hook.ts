import { useCallback, useContext, useState } from "react";
import { ShipContext } from "../ships/ShipProvider";
import { ShipType } from "../ships/ship.types";
import { calculateAllMoves, calculatePenalty } from "../utils/move.hook";

type MoveType = {
  x: number;
  y: number;
  name: string;
  text: string;
  isValid: boolean;
  rotation: number;
  distance: number;
};

type ShipMovedType = {
  x: number;
  y: number;
  name: string;
};

export const useHexMap = function () {
  const [shipMoved, setShipMoved] = useState<ShipMovedType | null>(null);
  const [shipMoves, setShipMoves] = useState<MoveType[]>([]);
  const [isFirstMovement, setIsFirstMovement] = useState(false);
  const { ships, prepareShip } = useContext(ShipContext);

  const onHexMoveStart = useCallback((ship: ShipType) => {
    const acceleration = ship.nextMove.acceleration || 0;
    const moves: MoveType[] = calculateAllMoves(ship.x, ship.y, ship.speed + acceleration, ship.rotation).map(
      ({ x, y, rotation, isValid, acceleration, distance }) =>
        ({ name: ship.name, x, y, rotation, text: `${distance}`, isValid, distance } as MoveType)
    );

    setShipMoves(moves);
    setShipMoved(ship);
    setIsFirstMovement(true);
  }, []);

  const onHexMoveCancel = useCallback(() => {
    setShipMoves([]);
    setShipMoved(null);
  }, []);

  const onHexMoveSetPath = useCallback(
    (x: number, y: number, rotation: number, distance: number) => {
      const ship = ships.find((s) => s.name === shipMoved?.name);
      const lastMove = ship?.nextMove.moves.slice(-1)[0];
      if (!shipMoved || !ship || !lastMove) {
        console.error("something is missing", shipMoved, ship, lastMove);
        return;
      }

      const totalDistance = ship.speed + (ship.nextMove.acceleration || 0);
      const penalty = calculatePenalty(isFirstMovement ? ship.rotation : lastMove.rotation, rotation);
      const pendingDistance = isFirstMovement
        ? totalDistance
        : ship.nextMove.moves.reduce((acc, cur) => acc - cur.distance - cur.penalty, totalDistance);

      prepareShip(shipMoved.name, x, y, rotation, isFirstMovement);
      if (distance + penalty >= pendingDistance) {
        onHexMoveCancel();
        return;
      }

      const moves: MoveType[] = calculateAllMoves(x, y, pendingDistance - distance - penalty, rotation).map(
        ({ x, y, rotation, isValid, distance }) =>
          ({ name: shipMoved.name, x, y, rotation, text: `${distance}`, isValid, distance } as MoveType)
      );

      setShipMoves(moves);
      setShipMoved((prev) => (prev ? { ...prev, x, y } : null));
      if (isFirstMovement) setIsFirstMovement(false);
    },
    [isFirstMovement, onHexMoveCancel, prepareShip, shipMoved, ships]
  );

  return {
    shipMoved,
    shipMoves,
    onHexMoveStart,
    onHexMoveCancel,
    onHexMoveSetPath,
  };
};
