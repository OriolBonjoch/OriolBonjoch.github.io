import { useTheme } from "@mui/material";
import { useMemo } from "react";
import seedrandom from "seedrandom";
import { calcCoords } from "../utils/mapper.helper";

class AsteroidGenerator {
  private rnd: seedrandom.PRNG;
  private constructor(hash: string) {
    this.rnd = seedrandom(hash);
  }

  private generateDistances(min: number, max: number, amount: number) {
    return [...Array(amount)].map((_) => Math.round(1000 * (this.rnd() * (max - min) + min)) / 1000);
  }

  private generateDegrees(min: number, total: number, amount: number) {
    const numbers = [...Array(amount)].map((_) => this.rnd());
    const sum = numbers.reduce((acc, cur) => acc + cur, 0);
    const result = numbers
      .map((n) => min + (n * (total - min * amount)) / sum)
      .reduce((acc, cur) => [...acc, (acc.length ? acc[acc.length - 1] : 0) + cur], [] as number[]);
    return result.slice(0, -1);
  }

  public static create(hash: string): AsteroidGenerator {
    return new AsteroidGenerator(hash);
  }

  public generateAsteroids(): { x: number; y: number; degree: number; points: { x: number; y: number }[] }[] {
    const n = 3 + Math.floor(this.rnd() * 3);
    const degrees = [...Array(n)].map((_, i) => (2 * Math.PI * i) / n + this.rnd() * ((2 * Math.PI) / n));
    const distances = [...Array(n)].map(() => Math.round(30 + this.rnd() * 30) / 100);
    const edges = [...Array(n)].map(() => 4 + Math.floor(this.rnd() * 3));
    return [
      ...[...Array(6 - n)].map((_) => ({
        x: this.rnd() * 1.2 - 0.6,
        y: this.rnd() * 1.2 - 0.6,
        degree: 0,
        points: [{ x: 0, y: 0 }],
      })),
      ...degrees.map((degree, i) => {
        const size = 0.2;
        const astDistances = this.generateDistances(size - 0.1, size + 0.1, edges[i]);
        const astDegrees = this.generateDegrees(Math.PI / 6, Math.PI * 2, edges[i]);
        const points = [
          { x: 0, y: astDistances[0] },
          ...[...Array(edges[i] - 1)].map((_, i) => ({
            x: astDistances[i + 1] * Math.sin(astDegrees[i]),
            y: astDistances[i + 1] * Math.cos(astDegrees[i]),
          })),
        ];

        return {
          x: distances[i] * Math.sin(degree),
          y: distances[i] * Math.cos(degree),
          degree,
          points,
        };
      }),
    ];
  }
}

function HexAsteroid({ points }: { points: { x: number; y: number }[] }) {
  const theme = useTheme();
  const stroke = theme.palette.hexStroke[theme.palette.mode];
  return points.length === 1 ? (
    <circle r="0.1" stroke="none" fill={stroke} />
  ) : (
    <path
      d={points.slice(1).reduce((acc, { x, y }) => acc + ` L ${x} ${y}`, `M ${points[0].x} ${points[0].y}`) + " z"}
      fill={stroke}
      stroke={stroke}
      strokeLinejoin="round"
      strokeWidth={0.1}
    />
  );
}

export function HexAsteroidField({ x, y }: { x: number; y: number }) {
  const hash = useMemo(() => `${x}/${y}`, [x, y]);
  const asteroids = useMemo(() => AsteroidGenerator.create(hash).generateAsteroids(), [hash]);
  const [x0, y0] = calcCoords(x, y);
  return (
    <g transform={`translate(${x0} ${y0})`}>
      {asteroids.map(({ x, y, points, degree }, i) => (
        <g key={i} transform={`translate(${x} ${y}) rotate(${degree})`}>
          <HexAsteroid points={points} />
        </g>
      ))}
    </g>
  );
}
