import { moveShipReduce } from "./ship.reducer";
import { StateType } from "./ship.types";

describe("moveShipReduce", () => {
  test("default move is applied correctly", () => {
    const initialState: StateType = {
      ships: {
        "Nave #280": {
          x: 1,
          y: 4,
          color: "#F44E3B",
          acceleration: 2,
          speed: 4,
          rotation: -6,
          nextMove: { acceleration: 0, rotation: -6, pickedMove: 0, moves: [[4, 0]] },
          history: [],
        },
      },
    };

    const newState: StateType = moveShipReduce(initialState);
    expect(newState).toStrictEqual({
      ships: {
        "Nave #280": {
          x: 5,
          y: 4,
          color: "#F44E3B",
          acceleration: 2,
          speed: 4,
          rotation: -6,
          nextMove: { acceleration: 0, rotation: -6, pickedMove: 0, moves: [[4, 0]] },
          history: [{ x: 1, y: 4, rotation: -6 }],
        },
      },
    } as StateType);
  });

  test("turn move is applied correctly", () => {
    const initialState: StateType = {
      ships: {
        "Nave #280": {
          x: 5,
          y: 4,
          color: "#F44E3B",
          acceleration: 2,
          speed: 4,
          rotation: -6,
          nextMove: {
            acceleration: 1,
            rotation: 2,
            pickedMove: 0,
            moves: [
              [-2, -2],
              [-1, -3],
            ],
          },
          history: [{ x: 1, y: 4, rotation: -6 }],
        },
      },
    };

    const newState: StateType = moveShipReduce(initialState);
    expect(newState).toStrictEqual({
      ships: {
        "Nave #280": {
          x: 3,
          y: 2,
          color: "#F44E3B",
          acceleration: 2,
          speed: 3,
          rotation: 2,
          nextMove: {
            acceleration: 0,
            rotation: 2,
            pickedMove: 0,
            moves: [
              [-2, -2],
              [-1, -2],
            ],
          },
          history: [
            { x: 1, y: 4, rotation: -6 },
            { x: 5, y: 4, rotation: -6 },
          ],
        },
      },
    } as StateType);
  });
});

export {};
