import { PropsWithChildren, createContext, useCallback, useState, useContext } from "react";

type SizeType = {
  x: number;
  y: number;
};

function useAsteroidsContext() {
  const [asteroids, setAsteroids] = useState<SizeType[]>([]);

  const toggleAsteroid = useCallback((x: number, y: number) => {
    const newAsteroid = { x, y };
    setAsteroids((prev) => {
      const withoutNew = prev.filter((asteroid) => !(asteroid.x === x && asteroid.y === y));
      return withoutNew.length === prev.length ? [...withoutNew, newAsteroid] : [...withoutNew];
    });
  }, []);

  return {
    asteroids,
    toggleAsteroid,
  } as const;
}

const AsteroidContext = createContext<ReturnType<typeof useAsteroidsContext>>({
  asteroids: [],
  toggleAsteroid: () => null,
});

export const AsteroidProvider = ({ children }: PropsWithChildren) => {
  const asteroids = useAsteroidsContext();
  return <AsteroidContext.Provider value={asteroids}>{children}</AsteroidContext.Provider>;
};

export const useAsteroids = () => {
  const asteroids = useContext(AsteroidContext);
  return asteroids;
};
