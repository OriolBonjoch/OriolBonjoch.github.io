import { calcCoords } from "../map/map.helper";

const sqrt3 = Math.floor(1000 * Math.sqrt(3)) / 1000;

export function calcNextPoint(x: number, y: number, rotation: number): [number, number][] {
  const isXEven = x % 2 !== 0;
  const nextMove: (() => [number, number][])[] = [
    () => [
      [-1, isXEven ? 1 : 0],
      [-1, isXEven ? 0 : -1],
    ],
    () => [[-1, isXEven ? 0 : -1]],
    () => [
      [-1, isXEven ? 0 : -1],
      [0, -1],
    ],
    () => [[0, -1]],
    () => [
      [0, -1],
      [1, isXEven ? 0 : -1],
    ],
    () => [[1, isXEven ? 0 : -1]],
    () => [
      [1, isXEven ? 0 : -1],
      [1, isXEven ? 1 : 0],
    ],
    () => [[1, isXEven ? 1 : 0]],
    () => [
      [1, isXEven ? 1 : 0],
      [0, 1],
    ],
    () => [[0, 1]],
    () => [
      [0, 1],
      [-1, isXEven ? 1 : 0],
    ],
    () => [[-1, isXEven ? 1 : 0]],
  ];

  return nextMove[(12 + rotation) % 12]().map(([vx, vy]) => [x + vx, y + vy]);
}

export function calculateMoves(x: number, y: number, speed: number, rotation: number): [number, number][] {
  const ls = speed - (speed % 2);
  const hls = ls / 2;

  const movement: (() => [number, number])[] = [
    () => [-ls, 0],
    () => [-ls, -hls],
    () => [-hls, (-3 * hls) / 2 - (hls % 2 ? (x % 2 ? -0.5 : 0.5) : 0)],
    () => [0, -ls],
    () => [hls, (-3 * hls) / 2 - (hls % 2 ? (x % 2 ? -0.5 : 0.5) : 0)],
    () => [ls, -hls],
    () => [ls, 0],
    () => [ls, hls],
    () => [hls, (3 * hls) / 2 - (hls % 2 ? (x % 2 ? -0.5 : 0.5) : 0)],
    () => [0, ls],
    () => [-hls, (3 * hls) / 2 - (hls % 2 ? (x % 2 ? -0.5 : 0.5) : 0)],
    () => [-ls, hls],
  ];

  const [vx, vy] = movement[(12 + rotation) % 12]();
  const finalX = x + vx;
  const finalY = y + vy;
  return speed % 2 ? calcNextPoint(finalX, finalY, rotation) : [[finalX, finalY]];
}

export const calculatePenalty = (shipRot: number, newRot: number) => {
  return [0, 1, 1, 2, 2, 3, 4, 3, 2, 2, 1, 1, 0][Math.abs(shipRot - newRot) % 12];
};

export const calculateSpeed = (speed: number, shipRot: number, newRot: number): number => {
  const penalty = [0, 1, 1, 2, 2, 3, 4, 3, 2, 2, 1, 1, 0][Math.abs(shipRot - newRot) % 12];
  const newSpeed = speed - penalty;
  return newSpeed < 0 ? 0 : newSpeed;
};

export const calculateDistance = (
  from: { x: number; y: number; rotation: number },
  to: { x: number; y: number; rotation: number }
): number => {
  if (from.x === to.x && from.y === to.y) {
    return 0;
  }

  const [x1, y1] = calcCoords(from.x, from.y);
  const [x2, y2] = calcCoords(to.x, to.y);
  const distance = Math.round(Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)) / (to.rotation % 2 ? sqrt3 : 1.5));
  return distance;
};

type MoveType = {
  id: string;
  x: number;
  y: number;
  acceleration: number;
  rotation: number;
  isValid: boolean;
  distance: number;
};

export function calculateAllMoves(
  x: number,
  y: number,
  speed: number, // speed + acceleration - penalties - distance
  rotation: number
) {
  const allMoves = [...Array(12)].flatMap((_, newRotation) => {
    const moves: MoveType[] = [];
    const maxDistance = calculateSpeed(speed, rotation, newRotation);
    for (let dist = newRotation % 2 ? 1 : 2; dist <= maxDistance; dist++) {
      moves.push(
        ...calculateMoves(x, y, dist, newRotation).map(([x, y]) => ({
          id: `${x}-${y}`,
          x,
          y,
          rotation: newRotation,
          acceleration: 0, // to remove.
          isValid: dist === maxDistance, // to remove/rename to final.
          distance: dist,
        }))
      );
    }

    return moves;
  });

  return allMoves;
}
