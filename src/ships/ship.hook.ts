import { useReducer } from "react";
import { ActionType, ShipType, StateType } from "./ship.types";

function reducer(state: StateType, action: ActionType): StateType {
  switch (action.type) {
    case "CREATE_SHIP":
      const { name, ...ship } = action.payload;
      return {
        ships: { ...state.ships, [name]: ship },
      };
    case "DELETE_SHIP":
      const { [action.payload.name]: _, ...rest } = state.ships;
      return { ships: rest };
    case "FREE_MOVE":
      const oldShip = state.ships[action.payload.name];
      return {
        ships: {
          ...state.ships,
          [action.payload.name]: {
            ...oldShip,
            [action.payload.property]: action.payload.value,
          },
        },
      };
    case "PREPARE_MOVE": // TODO
    case "MOVE":
    default:
      return state;
  }
}

export function useShips() {
  const [state, dispatch] = useReducer(reducer, { ships: {} });

  return {
    ships: Object.keys(state.ships).map((name) => ({
      name,
      ...state.ships[name],
    })),
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
        payload: {
          name,
          x,
          y,
          color,
          acceleration,
          speed,
          rotation,
        },
      } as ActionType);
    },
    deleteShip: (name: string) => {
      dispatch({
        type: "DELETE_SHIP",
        payload: { name },
      });
    },
    updateShip: <T extends keyof Omit<ShipType, "name">>(
      name: string,
      property: T,
      value: ShipType[T]
    ) => {
      dispatch({
        type: "FREE_MOVE",
        payload: { name, property, value },
      });
    },
    prepareShip: (
      name: string,
      acceleration: number,
      rotation: number,
      x: number,
      y: number
    ) =>
      dispatch({
        type: "PREPARE_MOVE",
        payload: {
          name,
          acceleration,
          rotation,
          x,
          y,
        },
      }),
    moveShip: () => null,
  };
}
