type FreeAction = {
  type: "FREE_MOVE";
  payload: {
    name: string;
    x?: number;
    y?: number;
    rotation?: number;
  };
};

type SpeedAction = {
  type: "CHANGE_SPEED";
  payload: {
    name: string;
    speed: number;
  };
};

type AccelerationAction = {
  type: "CHANGE_ACCELERATION";
  payload: {
    name: string;
    acceleration: number;
  };
};

type RotateAction = {
  type: "CHANGE_ROTATION";
  payload: {
    name: string;
    rotation: number;
  };
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
  | SpeedAction
  | AccelerationAction
  | RotateAction
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
}
