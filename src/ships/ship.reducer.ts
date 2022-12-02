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

function defaultMovement(ship: { x: number; y: number; speed: number; rotation: number }) {
  const moves = calculateMoves(ship.x, ship.y, ship.speed, ship.rotation);
  return {
    acceleration: 0,
    rotation: ship.rotation,
    pickedMove: 0,
    moves,
  };
}

function createShipReducer(state: StateType, action: CreateAction): StateType {
  const { name, ...ship } = action.payload;
  return {
    ships: {
      ...state.ships,
      [name]: {
        ...ship,
        nextMove: defaultMovement(ship),
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
  const newShip = {
    ...ship,
    [action.payload.property]: action.payload.value,
  };

  return {
    ships: {
      ...state.ships,
      [action.payload.name]: {
        ...newShip,
        nextMove: defaultMovement(newShip),
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

export function moveShipReduce(state: StateType) {
  const ships = Object.entries(state.ships).reduce((acc, [name, ship]) => {
    const [vx, vy] = ship.nextMove.moves[ship.nextMove.pickedMove];
    const x = ship.x + vx;
    const y = ship.y + vy;
    const penalty = calculateRotationPenalty(ship.rotation, ship.nextMove.rotation);
    const speed = ship.speed + ship.nextMove.acceleration - penalty;
    const rotation = ship.nextMove.rotation;
    const newShip = {
      ...ship,
      x,
      y,
      rotation,
      speed,
      nextMove: defaultMovement({ x, y, rotation, speed }),
      history: [...ship.history, { x: ship.x, y: ship.y, rotation: ship.rotation }],
    };
    return {
      ...acc,
      [name]: newShip,
    };
  }, {});
  return { ships };
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
      return moveShipReduce(state);
    default:
      return state;
  }
}
