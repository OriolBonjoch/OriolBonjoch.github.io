import { createContext } from "react";
import { useShips } from "./ship.hook";
import { ShipType } from "./ship.types";

export const ShipContext = createContext<ReturnType<typeof useShips>>({
  step: 0,
  ships: [],
  createShip: () => null,
  deleteShip: (name: string) => null,
  prepareShip: (name: string, acceleration: number, rotation: number) => null,
  applyMovement: () => null,
  moveShip: () => null,
  updateShip: <T extends keyof ShipType>(name: string, property: T, value: ShipType[T]) => null,
});
