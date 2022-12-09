import { useCallback, useRef, useState } from "react";
import Ship from "../Ship";

const hexPath = "M -1 0 L -0.5 -0.866 L 0.5 -0.866 L 1 0 L 0.5 0.866 L -0.5 0.866 z";

export const ShipFormPreview = ({
  rot,
  changeRotation,
  color,
}: {
  color: string;
  rot: number;
  changeRotation: (rot: number) => void;
}) => {
  const [lock, setLock] = useState(true);
  const [newRotation, setNewRotation] = useState(rot);
  const svgElement = useRef<SVGSVGElement>(null);
  const handleMouseMove = useCallback(
    (event: React.MouseEvent<SVGSVGElement>) => {
      if (!svgElement.current || lock) {
        return;
      }

      const { x, y, width, height } = svgElement.current.getBoundingClientRect();
      const diffX = x + width / 2 - event.clientX;
      const diffY = y + height / 2 - event.clientY;
      const newRot = Math.floor((Math.atan2(diffY, diffX) * 6) / Math.PI + 0.5);
      setNewRotation(newRot);
    },
    [lock]
  );

  return (
    <svg
      ref={svgElement}
      viewBox="-1 -1 2 2"
      onMouseMove={handleMouseMove}
      onClick={(_) => {
        setLock((prev) => !prev);
        if (!lock && rot !== newRotation) {
          changeRotation(newRotation);
        }
      }}
    >
      <g>
        <path d={hexPath} fill="#c0c0c0" />
        <g transform={lock ? "" : "scale(0.5 0.5)"}>
          <Ship x={0} y={0} rot={lock ? rot : newRotation} color={color} />
        </g>
      </g>
    </svg>
  );
};
