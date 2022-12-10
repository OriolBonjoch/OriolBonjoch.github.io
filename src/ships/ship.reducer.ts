import { calculateMoves, calculateSpeed } from "../utils/move.hook";
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
    step: state.step,
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
  return { step: state.step, ships: rest };
}

function updateShipReduce(state: StateType, action: FreeAction) {
  const ship = state.ships[action.payload.name];
  const newShip = {
    ...ship,
    [action.payload.property]: action.payload.value,
  };

  return {
    step: state.step,
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
  const moves = calculateMoves(
    ship.x,
    ship.y,
    calculateSpeed(ship.speed, acceleration, ship.rotation, rotation),
    rotation
  );
  const pickedMove = moves.findIndex(([x, y]) => x === vx && y === vy);
  return {
    step: state.step,
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
    const speed = calculateSpeed(ship.speed, ship.nextMove.acceleration, ship.rotation, ship.nextMove.rotation);
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
  return { step: state.step, ships };
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
    case "START_MOVE":
      return { ...state, step: state.step + 1 };
    default:
      return state;
  }
}
