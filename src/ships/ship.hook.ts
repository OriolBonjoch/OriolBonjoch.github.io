import { useReducer } from "react";
import { shipReducer } from "./ship.reducer";
import { ActionType, ShipType } from "./ship.types";

export function useShips() {
  const [state, dispatch] = useReducer(shipReducer, { ships: {} });

  return {
    ships: Object.entries(state.ships).map(([name, ship]) => ({ name, ...ship })),
    createShip: (
      name: string,
      x: number,
      y: number,
      color: string,
      speed: number,
      acceleration: number,
      rotation: number
    ) => {
      dispatch({
        type: "CREATE_SHIP",
        payload: { name, x, y, color, acceleration, speed, rotation },
      } as ActionType);
    },
    deleteShip: (name: string) => {
      dispatch({
        type: "DELETE_SHIP",
        payload: { name },
      });
    },
    updateShip: <T extends keyof Omit<ShipType, "name" | "nextMove">>(
      name: string,
      property: T,
      value: ShipType[T]
    ) => {
      dispatch({
        type: "FREE_MOVE",
        payload: { name, property, value },
      });
    },
    prepareShip: (name: string, acceleration: number, rotation: number, vx: number, vy: number) =>
      dispatch({
        type: "PREPARE_MOVE",
        payload: { name, acceleration, rotation, vx, vy },
      }),
    moveShip: () => {
      dispatch({ type: "MOVE" });
    },
  };
}
