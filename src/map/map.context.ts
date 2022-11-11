import {
  createContext,
  useCallback,
  useState,
  useMemo,
} from "react";
import { useWindowSize } from "../utils/window-size.hook";

const sqrt3 = Math.floor(1000 * Math.sqrt(3)) / 1000;
const halfsqrt3 = sqrt3 / 2;
const margin = 0.2;

export function useMap() {
  const [size, setSize] = useState({ x: 10, y: 5 });
  const [isCreated, setIsCreated] = useState(true);
  const [center, setCenter] = useState({ cx: 4.5, cy: 2 });
  const [zoomX, setZoomX] = useState(10);
  const { ratio } = useWindowSize();

  const viewport = useMemo(() => {
    const zoomY = (size.y * zoomX) / size.x;
    const minX = -1 - margin + (size.x - zoomX) * 0.75;
    const minY = -halfsqrt3 - margin + (size.y - zoomY + 0.5) * halfsqrt3;

    const width = 1.5 * zoomX + 0.5 + 2 * margin;
    const tempHeight = sqrt3 * (zoomY + 0.5) + 2 * margin;
    const isOverflowed = tempHeight > width * ratio;
    const height = isOverflowed ? width * ratio : tempHeight;
    
    return [minX, minY, width, height];
  }, [ratio, size.x, size.y, zoomX]);

  const createMap = useCallback((width?: string, height?: string) => {
    const x = width && /^\d+$/.test(width) ? parseInt(width) : 10;
    const y = height && /^\d+$/.test(height) ? parseInt(height) : 5;
    const isValid = !!width && !!height;
    setIsCreated(isValid);
    if (isValid) {
      setSize({ x, y });
      setCenter({ cx: (x - 1) / 2, cy: (y - 1) / 2 });
      setZoomX(x);
    }
  }, []);

  const changeView = useCallback(
    (
      center: { cx: number; cy: number } | null = null,
      zoom: number | null = null
    ) => {
      if (center) setCenter(center);
      if (zoom) setZoomX(zoom);
    },
    []
  );

  return {
    size,
    zoomX,
    center,
    isCreated,
    viewport,
    createMap,
    changeView,
  } as const;
}

export const MapContext = createContext<ReturnType<typeof useMap>>({
  isCreated: true,
  viewport: [0, 0, 1, 1],
  center: { cx: 4.5, cy: 2 },
  zoomX: 10,
  size: { x: 10, y: 5 },
  createMap: () => null,
  changeView: () => null,
});
