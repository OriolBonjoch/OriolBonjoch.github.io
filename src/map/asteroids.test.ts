import seedrandom from "seedrandom";

function generateRandom(min: number, max: number, amount: number, hash: string) {
  const rnd = seedrandom(hash);
  const numbers = [...Array(amount)].map((_) => Math.round(1000 * (rnd() * (max - min) + min)) / 1000);
  // const sum = numbers.reduce((acc,cur) => acc + cur, 0);
  return numbers;
}
function generateDegrees(min: number, total: number, amount: number, hash: string) {
  const rnd = seedrandom(hash);
  const numbers = [...Array(amount)].map((_) => rnd());
  const sum = numbers.reduce((acc, cur) => acc + cur, 0);
  const result = numbers
    .map((n) => min + (n * (total - min * amount)) / sum)
    .reduce((acc, cur) => [...acc, (acc.length ? acc[acc.length - 1] : 0) + cur], [] as number[]);
  return result.slice(0, -1);
}

describe("generate asteroids", () => {
  test.only("generate asteroids points", () => {
    const distances = generateRandom(0.2, 0.4, 6, "1/-1");
    const distances2 = generateRandom(0.2, 0.4, 6, "1/-1");
    expect(distances2).toStrictEqual(distances);

    const degrees = generateDegrees(30, 360, 6, "1/-1");
    console.log(degrees);
  });
});

export {};
