import { useCallback, useContext, useEffect, useMemo } from "react";
import { useSpring } from "react-spring";

import { MapContext, MoveKind } from "./MapContext";

export const useMapMovement = function () {
  const { dragTo, viewport, size, center } = useContext(MapContext);
  const [vp0, vp1, vp2, vp3] = viewport;
  const stringViewport = `${vp0} ${vp1} ${vp2} ${vp3}`;
  const { viewBox: animatedViewBox } = useSpring({ to: { viewBox: stringViewport }, loop: false });

  const keyPressed = useCallback(
    ({ key }: KeyboardEvent) => {
      const movement = {
        ArrowLeft: "Left",
        ArrowRight: "Right",
        ArrowUp: "Up",
        ArrowDown: "Down",
        "-": "ZoomOut",
        "+": "ZoomIn",
      }[key];

      dragTo((movement as MoveKind) ?? undefined);
    },
    [dragTo]
  );

  const buttonPoints = useMemo(() => {
    const minX = Math.floor(center.x - size.x / 2);
    const minY = Math.floor(center.y - size.y / 2);
    return [...Array(size.x + 1)].flatMap((_, i) => [...Array(size.y)].map((_, j) => ({ i: i + minX, j: j + minY })));
  }, [size, center]);

  useEffect(() => {
    window.addEventListener("keydown", keyPressed);

    return () => {
      window.removeEventListener("keydown", keyPressed);
    };
  }, [keyPressed]);

  return {
    buttonPoints,
    animatedViewBox,
    viewport,
  } as const;
};
