export type FreeAction = {
  type: "FREE_MOVE";
  payload: { name: string; property: keyof Omit<ShipType, "name" | "nextMove">; value: unknown };
};

export type PrepareMoveAction = {
  type: "PREPARE_MOVE";
  payload: { name: string; acceleration: number; rotation: number; vx: number; vy: number };
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
  payload: { name: string; x: number; y: number; rotation: number; speed: number; acceleration: number; color: string };
};

export type ActionType = FreeAction | PrepareMoveAction | MoveAction | DeleteAction | CreateAction;

export type MoveType = {
  rotation: number;
  acceleration: number;
  pickedMove: number;
  moves: [number, number][];
};

export type StateType = {
  ships: Record<
    string,
    {
      x: number;
      y: number;
      rotation: number;
      speed: number;
      acceleration: number;
      color: string;
      nextMove: MoveType;
      history: MoveType[];
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
  nextMove: MoveType;
};
