import { createContext, PropsWithChildren } from "react";
import { useCallback, useReducer } from "react";
import { shipReducer } from "./ship.reducer";
import { ActionType, ShipType } from "./ship.types";

function useShips() {
  const [state, dispatch] = useReducer(shipReducer, { step: 0, ships: {} });

  const createShip = useCallback(
    (
      name: string,
      x: number,
      y: number,
      color: string,
      texture: string,
      speed: number,
      acceleration: number,
      rotation: number
    ) => {
      dispatch({
        type: "CREATE_SHIP",
        payload: { name, x, y, color, texture, acceleration, speed, rotation },
      } as ActionType);
    },
    []
  );

  const deleteShip = useCallback((name: string) => {
    dispatch({
      type: "DELETE_SHIP",
      payload: { name },
    });
  }, []);

  const updateShip = useCallback(
    <T extends keyof Omit<ShipType, "name" | "nextMove">>(name: string, property: T, value: ShipType[T]) => {
      dispatch({
        type: "FREE_MOVE",
        payload: { name, property, value },
      });
    },
    []
  );

  const prepareShip = useCallback((name: string, x: number, y: number, rotation: number, isFirstMove: boolean) => {
    dispatch({
      type: "PREPARE_MOVE",
      payload: { name, x, y, rotation, isFirstMove },
    });
  }, []);

  const updateAcceleration = useCallback((name: string, acceleration: number) => {
    dispatch({
      type: "PREPARE_ACCELERATION_MOVE",
      payload: { name, acceleration },
    });
  }, []);

  const moveShip = useCallback(() => {
    dispatch({ type: "START_MOVE" });
  }, []);

  const applyMovement = useCallback(() => {
    dispatch({ type: "MOVE" });
  }, []);

  return {
    step: state.step,
    ships: Object.entries(state.ships).map(([name, ship]) => ({ name, ...ship })),
    createShip,
    deleteShip,
    updateShip,
    prepareShip,
    updateAcceleration,
    moveShip,
    applyMovement,
  };
}

export const ShipContext = createContext<ReturnType<typeof useShips>>({
  step: 0,
  ships: [],
  createShip: () => null,
  deleteShip: () => null,
  prepareShip: () => null,
  updateAcceleration: () => null,
  applyMovement: () => null,
  moveShip: () => null,
  updateShip: <T extends keyof ShipType>(name: string, property: T, value: ShipType[T]) => null,
});

export const ShipProvider = ({ children }: PropsWithChildren) => {
  const ships = useShips();
  return <ShipContext.Provider value={ships}>{children}</ShipContext.Provider>;
};
