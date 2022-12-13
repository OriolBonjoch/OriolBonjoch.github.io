import { changeAccelerationShipReduce, moveShipReduce, prepareShipReduce } from "./ship.reducer";
import { StateType } from "./ship.types";

describe("moveShipReduce", () => {
  test("prepare move defaults correctly", () => {
    const initialState: StateType = {
      step: 0,
      ships: {
        "Nave #793": {
          x: 3,
          y: 2,
          color: "ship8",
          acceleration: 2,
          speed: 20,
          rotation: 6,
          nextMove: {
            acceleration: 0,
            moves: [
              {
                penalty: 0,
                distance: 20,
                rotation: 6,
                x: 23,
                y: 2,
              },
            ],
          },
          history: [],
        },
      },
    };

    const newState = prepareShipReduce(initialState, {
      type: "PREPARE_MOVE",
      payload: {
        name: "Nave #793",
        x: 13,
        y: 2,
        rotation: 6,
        isFirstMove: true,
      },
    });

    expect(newState).toStrictEqual({
      step: 0,
      ships: {
        "Nave #793": {
          x: 3,
          y: 2,
          color: "ship8",
          acceleration: 2,
          speed: 20,
          rotation: 6,
          nextMove: {
            acceleration: 0,
            moves: [
              {
                penalty: 0,
                distance: 10,
                rotation: 6,
                x: 13,
                y: 2,
              },
            ],
          },
          history: [],
        },
      },
    });
  });

  test("prepare two moves works correctly", () => {
    const state0: StateType = {
      step: 0,
      ships: {
        "Nave #194": {
          x: 6,
          y: 6,
          color: "ship4",
          acceleration: 2,
          speed: 21,
          rotation: -6,
          nextMove: {
            acceleration: 0,
            moves: [
              {
                penalty: 0,
                distance: 21,
                rotation: -6,
                x: 27,
                y: 5,
              },
            ],
          },
          history: [],
        },
      },
    };

    const state1 = prepareShipReduce(state0, {
      type: "PREPARE_MOVE",
      payload: { name: "Nave #194", x: 16, y: 6, rotation: -6, isFirstMove: true },
    });

    const finalState = prepareShipReduce(state1, {
      type: "PREPARE_MOVE",
      payload: { name: "Nave #194", x: 26, y: 11, rotation: 7, isFirstMove: false },
    });

    expect(finalState).toStrictEqual({
      step: 0,
      ships: {
        "Nave #194": {
          x: 6,
          y: 6,
          color: "ship4",
          acceleration: 2,
          speed: 21,
          rotation: -6,
          nextMove: {
            acceleration: 0,
            moves: [
              {
                penalty: 0,
                distance: 10,
                rotation: -6,
                x: 16,
                y: 6,
              },
              {
                penalty: 1,
                distance: 10,
                rotation: 7,
                x: 26,
                y: 11,
              },
            ],
          },
          history: [],
        },
      },
    });
  });

  test("acceleration change works correctly", () => {
    const state0 = {
      step: 0,
      ships: {
        Silex: {
          x: 3,
          y: 1,
          color: "ship7",
          acceleration: 2,
          speed: 9,
          rotation: 6,
          nextMove: {
            acceleration: 0,
            moves: [
              {
                distance: 6,
                penalty: 0,
                rotation: 6,
                x: 9,
                y: 1,
              },
              {
                distance: 2,
                penalty: 1,
                rotation: 4,
                x: 10,
                y: 0,
              },
            ],
          },
          history: [],
        },
      },
    };
    const state1 = changeAccelerationShipReduce(state0, {
      type: "PREPARE_ACCELERATION_MOVE",
      payload: { acceleration: 2, name: "Silex" },
    });

    expect(state1).toStrictEqual({
      step: 0,
      ships: {
        Silex: {
          x: 3,
          y: 1,
          color: "ship7",
          acceleration: 2,
          speed: 9,
          rotation: 6,
          nextMove: {
            acceleration: 2,
            moves: [
              {
                distance: 6,
                penalty: 0,
                rotation: 6,
                x: 9,
                y: 1,
              },
              {
                distance: 4,
                penalty: 1,
                rotation: 4,
                x: 11,
                y: -2,
              },
            ],
          },
          history: [],
        },
      },
    });

    const state2 = changeAccelerationShipReduce(state1, {
      type: "PREPARE_ACCELERATION_MOVE",
      payload: { acceleration: -2, name: "Silex" },
    });

    expect(state2).toStrictEqual({
      step: 0,
      ships: {
        Silex: {
          x: 3,
          y: 1,
          color: "ship7",
          acceleration: 2,
          speed: 9,
          rotation: 6,
          nextMove: {
            acceleration: -2,
            moves: [
              {
                distance: 7,
                penalty: 0,
                rotation: 6,
                x: 10,
                y: 1,
              },
            ],
          },
          history: [],
        },
      },
    });
  });

  test("default move is applied correctly", () => {
    const initialState: StateType = {
      step: 0,
      ships: {
        "Nave #280": {
          x: 1,
          y: 4,
          color: "#F44E3B",
          acceleration: 2,
          speed: 4,
          rotation: 6,
          nextMove: {
            acceleration: 0,
            moves: [
              {
                rotation: 6,
                distance: 4,
                penalty: 0,
                x: 5,
                y: 4,
              },
            ],
          },
          history: [],
        },
      },
    };

    const newState: StateType = moveShipReduce(initialState);
    expect(newState).toStrictEqual({
      step: 0,
      ships: {
        "Nave #280": {
          x: 5,
          y: 4,
          color: "#F44E3B",
          acceleration: 2,
          speed: 4,
          rotation: 6,
          nextMove: {
            acceleration: 0,
            moves: [
              {
                distance: 4,
                rotation: 6,
                penalty: 0,
                x: 9,
                y: 4,
              },
            ],
          },
          history: [{ x: 1, y: 4, rotation: 6 }],
        },
      },
    } as StateType);
  });

  test("turn move is applied correctly", () => {
    const initialState: StateType = {
      step: 0,
      ships: {
        "Nave #280": {
          x: 5,
          y: 4,
          color: "#F44E3B",
          acceleration: 2,
          speed: 4,
          rotation: 6,
          nextMove: {
            acceleration: 1,
            moves: [
              {
                distance: 5,
                rotation: 2,
                penalty: 2,
                x: 3,
                y: 2,
              },
            ],
          },
          history: [{ x: 1, y: 4, rotation: 6 }],
        },
      },
    };

    const newState: StateType = moveShipReduce(initialState);
    expect(newState).toStrictEqual({
      step: 0,
      ships: {
        "Nave #280": {
          x: 3,
          y: 2,
          color: "#F44E3B",
          acceleration: 2,
          speed: 3, // + 1 acc - 2 penalties
          rotation: 2,
          nextMove: {
            acceleration: 0,
            moves: [
              {
                rotation: 2,
                distance: 3,
                penalty: 0,
                x: 1,
                y: 0,
              },
            ],
          },
          history: [
            { x: 1, y: 4, rotation: 6 },
            { x: 5, y: 4, rotation: 6 },
          ],
        },
      },
    } as StateType);
  });
});

export {};
