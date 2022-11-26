import { createContext } from "react";
import { useShips } from "./ship.hook";

export const ShipContext = createContext<ReturnType<typeof useShips>>({
  ships: [],
  createShip: () => null,
  move: (name: string, x: number, y: number) => null,
  rotate: (name: string, direction: number) => null,
  deleteShip: (name: string) => null,
});
