import { useCallback, useContext } from "react";
import { MapContext } from "../map/MapProvider";
import { ShipContext } from "../ships/ShipProvider";

type SavedPlay = {
  ships: {
    name: string;
    x: number;
    y: number;
    rotation: number;
    speed: number;
    color: string;
    texture: string;
  }[];
  map: { x: number; y: number };
};

export const usePersistence = (hideMenu: () => void) => {
  const { size, createMap } = useContext(MapContext);
  const { ships, createShip } = useContext(ShipContext);

  const load = useCallback(() => {
    hideMenu();
    const jsonData = window.localStorage.getItem("guardado");
    if (!jsonData) return;
    const data = JSON.parse(jsonData) as SavedPlay;

    createMap(`${data.map.x}`);
    data.ships.forEach((s) => {
      createShip(s.name, s.x, s.y, s.color, s.texture, s.speed, 0, s.rotation);
    });
  }, [createMap, createShip, hideMenu]);

  const save = useCallback(() => {
    hideMenu();
    const data = {
      ships: ships.map(({ acceleration, ...s }) => s),
      map: size,
    };
    const jsonData = JSON.stringify(data);
    window.localStorage.setItem("guardado", jsonData);
  }, [hideMenu, ships, size]);

  return {
    load,
    save,
  };
};
