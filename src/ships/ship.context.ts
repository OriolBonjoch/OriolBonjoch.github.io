import { createContext } from "react";
import { useShips } from "./ship.hook";
import { ShipType } from "./ship.types";

export const ShipContext = createContext<ReturnType<typeof useShips>>({
  ships: [],
  createShip: () => null,
  deleteShip: (name: string) => null,
  prepareShip: (
    name: string,
    acceleration: number,
    rotation: number,
    x: number,
    y: number
  ) => null,
  moveShip: () => null,
  updateShip: <T extends keyof ShipType>(
    name: string,
    property: T,
    value: ShipType[T]
  ) => null,
});
