import { calculateMoves, calculateRotationPenalty } from "../utils/move.hook";
import {
  ActionType,
  CreateAction,
  DeleteAction,
  FreeAction,
  MoveType,
  PrepareMoveAction,
  StateType,
} from "./ship.types";

function createShipReducer(state: StateType, action: CreateAction): StateType {
  const { name, ...ship } = action.payload;
  const moves = calculateMoves(ship.x, ship.y, ship.speed, ship.rotation);
  return {
    ships: {
      ...state.ships,
      [name]: {
        ...ship,
        nextMove: {
          acceleration: 0,
          rotation: ship.rotation,
          pickedMove: 0,
          moves,
        },
        history: [],
      },
    },
  };
}

function deleteShipReducer(state: StateType, action: DeleteAction) {
  const { [action.payload.name]: _, ...rest } = state.ships;
  return { ships: rest };
}

function updateShipReduce(state: StateType, action: FreeAction) {
  const ship = state.ships[action.payload.name];
  return {
    ships: {
      ...state.ships,
      [action.payload.name]: {
        ...ship,
        [action.payload.property]: action.payload.value,
      },
    },
  };
}

function prepareShipReduce(state: StateType, action: PrepareMoveAction) {
  const ship = state.ships[action.payload.name];
  const { acceleration, rotation, vx, vy } = action.payload;
  const penalty = calculateRotationPenalty(ship.rotation, rotation);
  const moves = calculateMoves(ship.x, ship.y, ship.speed + acceleration - penalty, rotation);
  const pickedMove = moves.findIndex(([x, y]) => x === vx && y === vy);
  return {
    ships: {
      ...state.ships,
      [action.payload.name]: {
        ...ship,
        nextMove: {
          acceleration,
          rotation,
          pickedMove: pickedMove === -1 ? 0 : pickedMove,
          moves,
        } as MoveType,
      },
    },
  };
}

export function shipReducer(state: StateType, action: ActionType): StateType {
  switch (action.type) {
    case "CREATE_SHIP":
      return createShipReducer(state, action);
    case "DELETE_SHIP":
      return deleteShipReducer(state, action);
    case "FREE_MOVE":
      return updateShipReduce(state, action);
    case "PREPARE_MOVE":
      return prepareShipReduce(state, action);
    case "MOVE":
    default:
      return state;
  }
}
