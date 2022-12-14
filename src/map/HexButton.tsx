import { calcCoords, halfsqrt3 } from "./map.helper";
import { styled } from "@mui/material/styles";

const StyledG = styled("g")(({ theme }) => {
  const fill = theme.palette.primary[theme.palette.mode];
  return {
    fill,
    fillOpacity: 0,
    stroke: "none",
    "&:hover": {
      fillOpacity: 0.6,
    },
  };
});

export function HexButton({ x, y, onClick }: { x: number; y: number; onClick: () => void }) {
  const hexId = `hexbutton_${x}_${y}`;
  const [x0, y0] = calcCoords(x, y);
  return (
    <StyledG id={hexId} transform={`translate(${x0} ${y0})`} onClick={onClick}>
      <path d={`M -1 0 L -0.5 ${-halfsqrt3} L 0.5 ${-halfsqrt3} L 1 0 L 0.5 ${halfsqrt3} L -0.5 ${halfsqrt3} z`} />
    </StyledG>
  );
}
