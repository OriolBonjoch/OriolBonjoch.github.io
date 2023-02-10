import { calculateDistance, calculateMoves, calculatePenalty } from "../utils/move.hook";
import {
  ActionType,
  CreateAction,
  DeleteAction,
  FreeAction,
  MoveType,
  PrepareMoveAction,
  PrepareAccelerationMoveAction,
  StateType,
  CancelMoveAction,
} from "./ship.types";

function defaultMovement(ship: { x: number; y: number; speed: number; rotation: number }) {
  const [x, y] = calculateMoves(ship.x, ship.y, ship.speed, ship.rotation)[0];
  return {
    acceleration: 0,
    moves: [
      {
        penalty: 0,
        distance: ship.speed,
        rotation: ship.rotation,
        x,
        y,
      },
    ],
  } as MoveType;
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

type ReducerMoveType = {
  rotation: number;
  penalty: number;
  x: number;
  y: number;
  distance: number;
};

function decelerate(moves: ReducerMoveType[], diff: number): [ReducerMoveType[], number] {
  const lastMove = moves.slice(-1)[0];
  if (lastMove && lastMove.distance + diff <= 0) {
    return decelerate(moves.slice(0, -1), diff + lastMove.distance + lastMove.penalty);
  }

  return [moves, diff];
}

function calculateLastMove(
  ship: StateType["ships"][0],
  moves: ReducerMoveType[],
  diff: number
): ReducerMoveType | null {
  const lastMove = moves.length > 0 ? moves.slice(-1)[0] : null;
  if (lastMove && lastMove.distance + diff === 0) return null;

  const shipMove = { x: ship.x, y: ship.y, penalty: 0, rotation: ship.rotation } as ReducerMoveType;
  const lastButOneMove = moves.length > 1 ? moves.slice(-2)[0] : shipMove;
  const distance = lastMove ? lastMove.distance + diff : ship.speed;
  const rotation = lastMove ? lastMove.rotation : shipMove.rotation;
  const penalty = lastMove?.penalty || 0;
  const [x, y] = calculateMoves(lastButOneMove.x, lastButOneMove.y, distance, rotation)[0];
  return { x, y, penalty, rotation, distance };
}

export function changeAccelerationShipReduce(state: StateType, action: PrepareAccelerationMoveAction) {
  const { name, acceleration } = action.payload;
  const ship = state.ships[name];
  if (!ship || ship.nextMove.moves.length === 0) return state;
  const diff = acceleration - ship.nextMove.acceleration;
  const [moves, finalDiff] = decelerate([...ship.nextMove.moves], diff);
  const updatedLastMove = calculateLastMove(ship, moves, finalDiff);
  if (updatedLastMove) {
    moves.pop();
    moves.push(updatedLastMove);
  }

  return {
    step: state.step,
    ships: {
      ...state.ships,
      [name]: {
        ...ship,
        nextMove: {
          acceleration,
          moves,
        } as MoveType,
      },
    },
  };
}

function cancelShipMoveReduce(state: StateType, action: CancelMoveAction) {
  const { name } = action.payload;
  const ship = state.ships[name];
  return {
    ...state,
    ships: {
      ...state.ships,
      [name]: {
        ...ship,
        nextMove: defaultMovement(ship),
      },
    },
  };
}

export function prepareShipReduce(state: StateType, action: PrepareMoveAction) {
  const ship = state.ships[action.payload.name];
  if (!ship) return state;

  const { name, x, y, rotation, isFirstMove } = action.payload;
  const prevMove = isFirstMove ? null : ship.nextMove.moves.slice(-1)[0];

  const previousMoves = isFirstMove ? [] : [...ship.nextMove.moves];
  const destination = { x, y, rotation };
  const newMove = {
    distance: calculateDistance(!prevMove ? { x: ship.x, y: ship.y, rotation: ship.rotation } : prevMove, destination),
    penalty: calculatePenalty(!prevMove ? ship.rotation : prevMove.rotation, rotation),
    rotation,
    x,
    y,
  };

  const moves = [...previousMoves, newMove];
  return {
    step: state.step,
    ships: {
      ...state.ships,
      [name]: {
        ...ship,
        nextMove: {
          acceleration: ship.nextMove.acceleration,
          moves,
        } as MoveType,
      },
    },
  };
}

export function moveShipReduce(state: StateType) {
  const ships = Object.entries(state.ships).reduce((acc, [name, ship]) => {
    const lastMove = ship.nextMove.moves[ship.nextMove.moves.length - 1];
    const { x, y, rotation } = lastMove;
    const penalties = ship.nextMove.moves.reduce((acc, cur) => acc + cur.penalty, 0);
    const speed = ship.speed + ship.nextMove.acceleration - penalties;
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
    case "PREPARE_ACCELERATION_MOVE":
      return changeAccelerationShipReduce(state, action);
    case "CANCEL_MOVE":
      return cancelShipMoveReduce(state, action);
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
