import { PropsWithChildren, createContext, useCallback, useMemo, useState } from "react";
import { useWindowSize } from "../utils/window-size.hook";

export type MoveKind = "Left" | "Right" | "Up" | "Down" | "ZoomIn" | "ZoomOut";
type SizeType = {
  x: number;
  y: number;
};

const sqrt3 = Math.floor(1000 * Math.sqrt(3)) / 1000;

function useMap() {
  const [size, setSize] = useState<SizeType>({ x: 20, y: 10 });
  const [center, setCenter] = useState<SizeType>({ x: 10, y: 5 });
  const [isCreated, setIsCreated] = useState(true);

  const { ratio } = useWindowSize();

  const viewportSize = useMemo(() => {
    const width = 1.5 * size.x + 0.5;
    const height = sqrt3 * (size.y + 0.5);
    return [width, height];
  }, [size.x, size.y]);

  const minCoords = useMemo(() => {
    const coordX = 1.5 * (center.x - size.x / 2);
    const coordY = sqrt3 * (center.y - size.y / 2);
    return [coordX, coordY];
  }, [center.x, center.y, size.x, size.y]);

  const createMap = useCallback(
    (width?: string) => {
      const x = width && /^\d+$/.test(width) ? parseInt(width) : 20;
      setIsCreated(!!width);
      if (!!width) {
        const y = Math.ceil(x * ratio);
        setSize({ x, y });
        setCenter({ x: x / 2, y: y / 2 });
      }
    },
    [ratio]
  );

  const dragToShip = useCallback(([centerX, centerY]: [number, number]) => {
    setCenter({ x: centerX, y: centerY });
  }, []);

  const centerTo = useCallback((x: number, y: number) => setCenter({ x, y }), []);

  const dragTo = useCallback(
    (movement?: MoveKind) => {
      if (!movement) return;

      const action: Record<MoveKind, () => void> = {
        Down: () => setCenter((prev) => ({ x: prev.x, y: prev.y + 1 })),
        Up: () => setCenter((prev) => ({ x: prev.x, y: prev.y - 1 })),
        Left: () => setCenter((prev) => ({ x: prev.x - 1, y: prev.y })),
        Right: () => setCenter((prev) => ({ x: prev.x + 1, y: prev.y })),
        ZoomIn: () => setSize((prev) => (prev.x > 5 ? { x: prev.x - 2, y: Math.ceil((prev.x - 2) * ratio) } : prev)),
        ZoomOut: () => setSize((prev) => ({ x: prev.x + 2, y: Math.ceil((prev.x + 2) * ratio) })),
      };
      action[movement]();
    },
    [ratio]
  );

  const changeZoom = useCallback(
    (x: number) => {
      const y = Math.ceil(x * ratio);
      setSize({ x, y });
    },
    [ratio]
  );

  return {
    size,
    isCreated,
    center,
    viewport: [...minCoords, ...viewportSize],
    createMap,
    changeZoom,
    dragToShip,
    dragTo,
    centerTo,
  } as const;
}

export const MapContext = createContext<ReturnType<typeof useMap>>({
  isCreated: true,
  viewport: [0, 0, 1, 1],
  center: { x: 10, y: 5 },
  size: { x: 20, y: 10 },
  createMap: () => null,
  changeZoom: () => null,
  dragToShip: () => null,
  dragTo: () => null,
  centerTo: () => null,
});

export const MapProvider = ({ children }: PropsWithChildren) => {
  const map = useMap();
  return <MapContext.Provider value={map}>{children}</MapContext.Provider>;
};
