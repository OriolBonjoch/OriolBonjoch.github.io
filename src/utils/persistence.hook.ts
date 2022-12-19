import { useCallback, useContext } from "react";
import { useAsteroids } from "../map/AsteroidProvider";
import { MapContext } from "../map/MapProvider";
import { ShipContext } from "../ships/ShipProvider";

type SavedPlay = {
  ships: {
    name: string;
    x: number;
    y: number;
    acceleration: number;
    rotation: number;
    speed: number;
    color: string;
    texture: string;
  }[];
  asteroids: { x: number; y: number }[];
  map: { x: number; y: number };
};

export const usePersistence = (hideMenu: () => void) => {
  const { size, createMap } = useContext(MapContext);
  const { ships, createShip } = useContext(ShipContext);
  const { asteroids, toggleAsteroid } = useAsteroids();

  const load = useCallback(() => {
    hideMenu();
    const jsonData = window.localStorage.getItem("guardado");
    if (!jsonData) return;
    const data = JSON.parse(jsonData) as SavedPlay;

    createMap(`${data.map.x}`);
    data.ships.forEach((s) => {
      createShip(s.name, s.x, s.y, s.color, s.texture, s.speed, s.acceleration, s.rotation);
    });
    data.asteroids.forEach((a) => {
      toggleAsteroid(a.x, a.y);
    });
  }, [createMap, createShip, hideMenu, toggleAsteroid]);

  const save = useCallback(() => {
    hideMenu();
    const data = {
      ships: ships.map(({ nextMove, history, ...s }) => s),
      map: size,
      asteroids,
    };
    const jsonData = JSON.stringify(data);
    window.localStorage.setItem("guardado", jsonData);
  }, [asteroids, hideMenu, ships, size]);

  return {
    load,
    save,
  };
};
