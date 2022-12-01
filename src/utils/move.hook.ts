function calcNextPoint(isEven: boolean, x: number, y: number, rotation: number): [number, number][] {
  const nextMove: (() => [number, number][])[] = [
    () => [
      [-1, isEven ? 0 : -1],
      [-1, isEven ? 1 : 0],
    ],
    () => [[-1, isEven ? 0 : -1]],
    () => [
      [-1, isEven ? 0 : -1],
      [0, -1],
    ],
    () => [[0, -1]],
    () => [
      [0, -1],
      [1, isEven ? 0 : -1],
    ],
    () => [[1, isEven ? 0 : -1]],
    () => [
      [1, isEven ? 0 : -1],
      [1, isEven ? 1 : 0],
    ],
    () => [[1, isEven ? 1 : 0]],
    () => [
      [1, isEven ? 1 : 0],
      [0, 1],
    ],
    () => [[0, 1]],
    () => [
      [0, 1],
      [-1, isEven ? 1 : 0],
    ],
    () => [[-1, isEven ? 1 : 0]],
  ];

  return nextMove[(12 + rotation) % 12]().map(([vx, vy]) => [x + vx, y + vy]);
}

function pickBest(moves: MoveType[]): MoveType {
  if (moves.some((m) => m.rotation % 2)) {
    return moves.find((m) => m.rotation % 2) ?? moves[0];
  }

  return moves.sort((a, b) => a.acceleration - b.acceleration)[0];
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
  return speed % 2 ? calcNextPoint((x + vx) % 2 === 1, vx, vy, rotation) : [[vx, vy]];
}

export const calculateRotationPenalty = (shipRot: number, newRot: number) => {
  return [0, 1, 1, 2, 2, 3, 4, 3, 2, 2, 1, 1, 0][Math.abs(shipRot - newRot) % 12];
};

type MoveType = {
  id: string;
  x: number;
  y: number;
  acceleration: number;
  rotation: number;
};

export function calculateAllMoves(x: number, y: number, speed: number, acceleration: number, rotation: number) {
  const allMoves = [...Array(12)].flatMap((_, newRotation) => {
    const moves: MoveType[] = [];
    for (let acc = -acceleration; acc <= acceleration; acc++) {
      const penalty = calculateRotationPenalty(rotation, newRotation);
      const v = speed + acc - penalty;
      if (v <= 0) continue;
      moves.push(
        ...calculateMoves(x, y, v, newRotation).map(([vx, vy]) => ({
          id: `${x + vx}-${y + vy}`,
          x: x + vx,
          y: y + vy,
          rotation: newRotation,
          acceleration: acc,
        }))
      );
    }

    return moves;
  });

  return Object.values(
    allMoves.reduce(
      (acc, cur: MoveType) => ({ ...acc, [cur.id]: acc[cur.id] ? [...acc[cur.id], cur] : [cur] }),
      {} as Record<string, MoveType[]>
    )
  ).map(pickBest);
}
