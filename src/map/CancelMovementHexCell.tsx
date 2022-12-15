import { styled } from "@mui/material/styles";
import { calcCoords } from "../utils/mapper.helper";

const Cross = styled("path")(({ theme }) => ({
  fill: theme.palette.error.main,
  stroke: "none",
}));

export function CancelMovementHexCell({ x, y }: { x: number; y: number }) {
  const [x0, y0] = calcCoords(x, y);
  const hexId = `hexcell_${x}_${y}`;
  return (
    <g id={hexId} transform={`translate(${x0} ${y0})`}>
      <Cross d="M 0 -0.5 C -0.2766 -0.5 -0.5 -0.2766 -0.5 0 s 0.2236 0.5 0.5 0.5 s 0.5 -0.2236 0.5 -0.5 S 0.2766 -0.5 0 -0.5 z m 0.25 0.6794 L 0.1794 0.25 L 0 0.0706 L -0.1794 0.25 L -0.25 0.1794 L -0.0706 0 L -0.25 -0.1794 L -0.1794 -0.25 L 0 -0.0706 L 0.1794 -0.25 L 0.25 -0.1794 L 0.0706 0 L 0.25 0.1794 z" />
    </g>
  );
}
