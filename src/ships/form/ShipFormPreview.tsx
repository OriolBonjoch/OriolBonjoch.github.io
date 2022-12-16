import { styled } from "@mui/material/styles";
import { useCallback, useRef, useState } from "react";
import { Ship } from "../Ship";
import { Hex } from "../../map/Hex";

type Props = {
  color: string;
  texture: string;
  rot: number;
  changeRotation?: (rot: number) => void;
};

const PreviewSvg = styled("svg")({
  width: "200px",
  height: "auto",
  margin: "20px",
});

export const ShipFormPreview = ({ rot, changeRotation, color, texture }: Props) => {
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
    <PreviewSvg
      ref={svgElement}
      viewBox="-1 -1 2 2"
      onMouseMove={handleMouseMove}
      onClick={(_) => {
        if (!changeRotation) return;
        setLock((prev) => !prev);
        if (!lock && rot !== newRotation) {
          changeRotation(newRotation);
        }
      }}
    >
      <g>
        <Hex />
        <g transform={lock ? "" : "scale(0.5 0.5)"}>
          <Ship x={0} y={0} rot={lock ? rot : newRotation} color={color} texture={texture} />
        </g>
      </g>
    </PreviewSvg>
  );
};
