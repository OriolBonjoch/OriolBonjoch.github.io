type FreeAction = {
  type: "FREE_MOVE";
  payload: {
    name: string;
    property: keyof Omit<ShipType, "name">;
    value: unknown;
  };
};

type PrepareMoveAction = {
  type: "PREPARE_MOVE";
  payload: {
    name: string;
  } & {
    acceleration: number;
    rotation: number;
    x: number;
    y: number;
  };
};

type MoveAction = {
  type: "MOVE";
};

type DeleteAction = {
  type: "DELETE_SHIP";
  payload: { name: string };
};

type CreateAction = {
  type: "CREATE_SHIP";
  payload: {
    name: string;
    x: number;
    y: number;
    rotation: number;
    speed: number;
    acceleration: number;
    color: string;
  };
};

export type ActionType =
  | FreeAction
  | PrepareMoveAction
  | MoveAction
  | DeleteAction
  | CreateAction;

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
};
