import { useReducer } from "react";
import { ActionType, StateType } from "./ship.types";

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
            x: action.payload.x || oldShip.x,
            y: action.payload.y || oldShip.y,
            rotation: action.payload.direction || oldShip.rotation,
            speed: oldShip.speed + (action.payload.acc ?? 0),
          },
        },
      };
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
    move: (
      name: string,
      x: number,
      y: number,
      acc: number,
      direction?: number
    ) => {
      dispatch({
        type: "FREE_MOVE",
        payload: { name, x, y, acc, direction },
      });
    },
    rotate: (name: string, direction: number) => {
      dispatch({
        type: "FREE_MOVE",
        payload: { name, direction },
      });
    },
    deleteShip: (name: string) => {
      dispatch({
        type: "DELETE_SHIP",
        payload: { name },
      });
    },
  };
}
