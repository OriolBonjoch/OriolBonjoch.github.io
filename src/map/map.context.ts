import { createContext, useCallback, useMemo, useState } from "react";
import { useWindowSize } from "../utils/window-size.hook";

type SizeType = {
  x: number;
  y: number;
};

const sqrt3 = Math.floor(1000 * Math.sqrt(3)) / 1000;
const halfsqrt3 = sqrt3 / 2;
const margin = 0.2;
const bound = (value: number, min: number, max: number) =>
  value < min ? min : value > max ? max : value;

export function useMap() {
  const [size, setSize] = useState<SizeType>({ x: 10, y: 5 });
  const [isCreated, setIsCreated] = useState(true);
  const [zoomX, setZoomX] = useState(10);
  const { ratio } = useWindowSize();

  const [center, setCenter] = useState<SizeType>({ x: 5, y: 2.5 });
  const [viewportSize, setViewportSize] = useState([1, 1]);
  const zoomY = useMemo(
    () => (viewportSize[1] - halfsqrt3 - 2 * margin) / sqrt3,
    [viewportSize]
  );

  const applyZoom = useCallback(
    (zoom: number, { y }: SizeType) => {
      const width = 1.5 * zoom + 0.5 + 2 * margin;
      const fullHeight = sqrt3 * (y + 0.5) + 2 * margin;
      const height = Math.min(fullHeight, width * ratio);
      setViewportSize([width, height]);
    },
    [ratio]
  );

  const dragBox = useMemo(() => {
    const minX = -1 - margin;
    const minY = -halfsqrt3 - margin;
    const maxX = 1.5 * size.x + 0.5 + 2 * margin + minX - viewportSize[0];
    const maxY = sqrt3 * (size.y + 0.5) + 2 * margin + minY - viewportSize[1];
    return { minX, minY, maxX, maxY };
  }, [size.x, size.y, viewportSize]);

  const minCoords = useMemo(() => {
    const coordX = -margin - 1 + 1.5 * (center.x - zoomX / 2);
    const coordY = -margin - halfsqrt3 + sqrt3 * (center.y - zoomY / 2);
    return [
      bound(coordX, dragBox.minX, dragBox.maxX),
      bound(coordY, dragBox.minY, dragBox.maxY),
    ];
  }, [
    center.x,
    center.y,
    dragBox.maxX,
    dragBox.maxY,
    dragBox.minX,
    dragBox.minY,
    zoomX,
    zoomY,
  ]);

  const createMap = useCallback(
    (width?: string, height?: string) => {
      const x = width && /^\d+$/.test(width) ? parseInt(width) : 10;
      const y = height && /^\d+$/.test(height) ? parseInt(height) : 5;
      const isValid = !!width && !!height;
      setIsCreated(isValid);
      if (isValid) {
        setSize({ x, y });
        setZoomX(x);

        applyZoom(x, { x, y });
        setCenter({ x: x / 2, y: y / 2 });
      }
    },
    [applyZoom]
  );

  const dragTo = useCallback(
    ([offsetX, offsetY]: [number, number]) => {
      const coordX = minCoords[0] + offsetX;
      const coordY = minCoords[1] + offsetY;

      setCenter({
        x: (coordX + margin + 1) / 1.5 + zoomX / 2,
        y: (coordY + margin + halfsqrt3) / sqrt3 + zoomY / 2,
      });
    },
    [minCoords, zoomX, zoomY]
  );

  const dragToShip = useCallback(([centerX, centerY]: [number, number]) => {
    setCenter({ x: centerX, y: centerY });
  }, []);

  const changeZoom = useCallback(
    (zoom: number) => {
      applyZoom(zoom, size);
      setZoomX(zoom);
    },
    [applyZoom, size]
  );

  return {
    size,
    zoomX,
    isCreated,
    viewport: [...minCoords, ...viewportSize],
    dragBox,
    createMap,
    changeZoom,
    dragTo,
    dragToShip,
  } as const;
}

export const MapContext = createContext<ReturnType<typeof useMap>>({
  isCreated: true,
  viewport: [0, 0, 1, 1],
  dragBox: { minX: 0, minY: 0, maxX: 0, maxY: 0 },
  zoomX: 10,
  size: { x: 10, y: 5 },
  createMap: () => null,
  changeZoom: () => null,
  dragTo: () => null,
  dragToShip: () => null,
});
