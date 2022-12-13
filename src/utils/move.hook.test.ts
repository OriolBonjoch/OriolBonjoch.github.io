import { calcNextPoint, calculateDistance, calculateMoves } from "./move.hook";

describe("calculateMoves", () => {
  test.each`
    x     | y     | rotation | expected
    ${6}  | ${4}  | ${0}     | ${[[5, 4], [5, 3]]}
    ${6}  | ${4}  | ${1}     | ${[[5, 3]]}
    ${6}  | ${4}  | ${3}     | ${[[6, 3]]}
    ${-1} | ${-6} | ${5}     | ${[[0, -6]]}
    ${-1} | ${-6} | ${1}     | ${[[-2, -6]]}
    ${2}  | ${-1} | ${7}     | ${[[3, -1]]}
  `("calcNextPoint works ($x, $y) with vector $rotation", ({ x, y, rotation, expected }) => {
    const moves = calcNextPoint(x, y, rotation);
    expect(moves).toStrictEqual(expected);
  });

  test.each`
    x    | y     | speed | rotation | expected
    ${4} | ${8}  | ${2}  | ${4}     | ${[[5, 6]]}
    ${7} | ${4}  | ${2}  | ${10}    | ${[[6, 6]]}
    ${7} | ${4}  | ${3}  | ${10}    | ${[[6, 7], [5, 6]]}
    ${8} | ${5}  | ${2}  | ${10}    | ${[[7, 6]]}
    ${8} | ${5}  | ${3}  | ${10}    | ${[[7, 7], [6, 7]]}
    ${6} | ${4}  | ${1}  | ${2}     | ${[[5, 3], [6, 3]]}
    ${6} | ${4}  | ${2}  | ${2}     | ${[[5, 2]]}
    ${6} | ${4}  | ${3}  | ${2}     | ${[[4, 2], [5, 1]]}
    ${4} | ${4}  | ${2}  | ${10}    | ${[[3, 5]]}
    ${2} | ${-1} | ${7}  | ${2}     | ${[[-2, -6], [-1, -7]]}
  `("calculation movement works ($x, $y) with speed $speed vector $rotation", ({ x, y, speed, rotation, expected }) => {
    const moves = calculateMoves(x, y, speed, rotation);
    expect(moves).toStrictEqual(expected);
  });

  test.each`
    fromx | fromy | fromrot | tox   | toy  | torot | expected
    ${3}  | ${2}  | ${-6}   | ${3}  | ${2} | ${-6} | ${0}
    ${3}  | ${2}  | ${-6}   | ${3}  | ${2} | ${-2} | ${0}
    ${7}  | ${8}  | ${3}    | ${7}  | ${5} | ${3}  | ${3}
    ${6}  | ${8}  | ${3}    | ${17} | ${7} | ${6}  | ${11}
    ${6}  | ${8}  | ${3}    | ${18} | ${8} | ${6}  | ${12}
  `(
    "calculate distance works($fromx, $fromy, $fromrot) to ($tox, $toy, $torot)",
    ({ fromx, fromy, fromrot, tox, toy, torot, expected }) => {
      const distance = calculateDistance(
        { x: fromx, y: fromy, rotation: fromrot },
        { x: tox, y: toy, rotation: torot }
      );
      expect(distance).toBe(expected);
    }
  );
});
