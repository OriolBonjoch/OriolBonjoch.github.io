import { styled } from "@mui/material/styles";
import { calcCoords } from "../utils/mapper.helper";
import { selectableShips } from "./ship-selection";

const defaultColor = "#F44E3B";

type Props = {
  rot: number;
  x: number;
  y: number;
  texture?: string;
  color?: string;
};

const GroupStyled = styled("g")<{ color?: string }>(({ color }) => ({
  stroke: "none",
  fill: color ?? defaultColor,
}));

export const Ship = ({ texture, rot, x, y, color }: Props) => {
  const [x0, y0] = calcCoords(x, y);
  return texture && selectableShips[texture] ? (
    <GroupStyled transform={`translate(${x0} ${y0}) rotate(${30 * (rot % 12) - 90})`} color={color}>
      <image href={selectableShips[texture]} width="1.5" height="1.5" x="-0.75" y="-0.75" />
    </GroupStyled>
  ) : (
    <GroupStyled transform={`translate(${x0} ${y0}) rotate(${30 * (rot % 12)})`} color={color}>
      <path d="M -0.7 0 L 0.5 -0.5 L 0.2 0 L 0.5 0.5 z" />
    </GroupStyled>
  );
};
