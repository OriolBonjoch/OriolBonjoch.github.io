import { styled } from "@mui/material/styles";
import { calcCoords } from "./map.helper";

type Props = {
  x: number;
  y: number;
  movement: {
    text: string;
    isValid: boolean;
    rotation: number;
  };
};

const StyledPath = styled("path")<{ isValid: boolean }>(({ isValid, theme }) => ({
  fill: isValid ? theme.palette.success[theme.palette.mode] : theme.palette.ghost[theme.palette.mode],
  stroke: "none",
}));

export function MovementHexCell({ x, y, movement }: Props) {
  const [x0, y0] = calcCoords(x, y);
  const hexId = `hexcell_${x}_${y}`;
  const { isValid, rotation } = movement;
  const dpath = isValid
    ? "M -0.55 0 L -0.05 -0.35 A 0.4 0.4 0 0 1 0.55 0 A 0.4 0.4 0 0 1 -0.05 0.35 z"
    : "M -0.5 0 L 0.4 -0.3 L 0.2 0 L 0.4 0.3 z";
  return (
    <g id={hexId} transform={`translate(${x0} ${y0})`}>
      <StyledPath transform={rotation ? `rotate(${30 * (rotation % 12)})` : undefined} d={dpath} isValid={isValid} />
    </g>
  );
}
