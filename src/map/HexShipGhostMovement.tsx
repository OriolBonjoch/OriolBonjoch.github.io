import { styled } from "@mui/material/styles";
import { ShipType } from "../ships/ship.types";
import { calcCoords } from "./map.helper";

const ShipGhostStyle = styled("path")(({ theme }) => {
  return {
    stroke: "none",
    fill: theme.palette.ghost[theme.palette.mode],
  };
});

const GhostPathStyle = styled("path")(({ theme }) => {
  return {
    fill: "none",
    stroke: theme.palette.ghost[theme.palette.mode],
    strokeWidth: theme.spacing(0.03),
  };
});

export function HexShipGhostMovement({ ship }: { ship: ShipType }) {
  const lastMove = ship?.nextMove.moves.slice(-1)[0];
  const moveToDegrees = ship ? 30 * (lastMove.rotation % 12) : 0;
  const [x0, y0] = calcCoords(ship.x, ship.y);
  const [xf, yf] = calcCoords(lastMove.x, lastMove.y);
  const pathPoints = ship.nextMove.moves.map((m) => calcCoords(m.x, m.y));
  return (
    <>
      <g transform={`translate(${xf} ${yf}) rotate(${moveToDegrees})`}>
        <ShipGhostStyle d={`M -0.7 0 L 0.5 -0.5 L 0.2 0 L 0.5 0.5 z`} />
      </g>
      <GhostPathStyle d={pathPoints.reduce((acc, [px, py]) => `${acc} L ${px} ${py}`, `M ${x0} ${y0}`)} />
    </>
  );
}
