export type FreeAction = {
  type: "FREE_MOVE";
  payload: { name: string; property: keyof Omit<ShipType, "name" | "nextMove">; value: unknown };
};

export type PrepareAccelerationMoveAction = {
  type: "PREPARE_ACCELERATION_MOVE";
  payload: { name: string; acceleration: number };
};

export type CancelMoveAction = {
  type: "CANCEL_MOVE";
  payload: { name: string };
};

export type PrepareMoveAction = {
  type: "PREPARE_MOVE";
  payload: {
    name: string;
    x: number;
    y: number;
    rotation: number;
    isFirstMove: boolean;
  };
};

export type StartMovementAction = {
  type: "START_MOVE";
};

export type MoveAction = {
  type: "MOVE";
};

export type DeleteAction = {
  type: "DELETE_SHIP";
  payload: { name: string };
};

export type CreateAction = {
  type: "CREATE_SHIP";
  payload: {
    name: string;
    x: number;
    y: number;
    rotation: number;
    speed: number;
    acceleration: number;
    color: string;
    texture: string;
  };
};

export type ActionType =
  | FreeAction
  | PrepareAccelerationMoveAction
  | CancelMoveAction
  | PrepareMoveAction
  | StartMovementAction
  | MoveAction
  | DeleteAction
  | CreateAction;

export type HistoryType = {
  x: number;
  y: number;
  rotation: number;
};

export type MoveType = {
  acceleration: number;
  moves: {
    rotation: number;
    penalty: number;
    x: number;
    y: number;
    distance: number;
  }[];
};

export type StateType = {
  step: number;
  ships: Record<
    string,
    Omit<ShipType, "name"> & {
      history: HistoryType[];
    }
  >;
};

export type ShipType = {
  name: string;
  x: number;
  y: number;
  rotation: number;
  speed: number;
  acceleration: number;
  color: string;
  texture: string;
  nextMove: MoveType;
};
