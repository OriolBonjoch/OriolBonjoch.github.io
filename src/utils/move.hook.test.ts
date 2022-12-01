import { calculateMoves } from "./move.hook";

describe("calculateMoves", () => {
  test.each`
    x    | y    | speed | rotation | expected
    ${6} | ${4} | ${1}  | ${2}     | ${[[-1, -1], [0, -1]]}
    ${6} | ${4} | ${2}  | ${2}     | ${[[-1, -2]]}
    ${6} | ${4} | ${3}  | ${2}     | ${[[-2, -2], [-1, -3]]}
    ${4} | ${4} | ${2}  | ${10}    | ${[[-1, 1]]}
  `("calculation works ($x, $y) with speed $speed vector $rotation", ({ x, y, speed, rotation, expected }) => {
    const moves = calculateMoves(x, y, speed, rotation);
    expect(moves).toStrictEqual(expected);
  });

  test.each`
    x    | y    | speed | rotation | expected
    ${4} | ${8} | ${2}  | ${4}     | ${[[5, 6]]}
    ${7} | ${4} | ${2}  | ${10}    | ${[[6, 6]]}
    ${7} | ${4} | ${3}  | ${10}    | ${[[6, 7], [5, 6]]}
    ${8} | ${5} | ${2}  | ${10}    | ${[[7, 6]]}
    ${8} | ${5} | ${3}  | ${10}    | ${[[7, 7], [6, 7]]}
  `("calculation movement works ($x, $y) with speed $speed vector $rotation", ({ x, y, speed, rotation, expected }) => {
    const moves = calculateMoves(x, y, speed, rotation);
    const result = moves.map(([vx, vy]) => [x + vx, y + vy]);
    expect(result).toStrictEqual(expected);
  });
});
