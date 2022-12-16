import { styled } from "@mui/material/styles";
import { Ship } from "../Ship";
import { Hex } from "../../map/Hex";

type Props = { letter: string; up?: boolean; rotation?: number };

const StyledText = styled("text")(({ theme }) => {
  const foreground = theme.palette.hex[theme.palette.mode];
  const fill = theme.palette.getContrastText(foreground);
  return {
    fill,
    userSelect: "none",
    pointerEvents: "none",
    textAnchor: "middle",
    stroke: "none",
    fontSize: "0.6pt",
  };
});

const SvgHexLetter = ({ letter, up, rotation }: Props) => {
  const trans = `translate(0 ${up ? -1.732 : 1.732})`;
  const rot = rotation ? `rotate(${rotation}) ` : "";
  const tor = rotation ? ` rotate(${-rotation})` : "";
  return (
    <g>
      <Hex transform={rot + trans} withStroke />
      <StyledText transform={rot + trans + tor} dominantBaseline="middle">
        {letter}
      </StyledText>
    </g>
  );
};

export const MovementHelper = ({
  color,
  rotation,
  texture,
}: {
  color?: string;
  rotation?: number;
  texture?: string;
}) => {
  return (
    <svg viewBox="-3 -3 6 6">
      <SvgHexLetter letter="Q" up rotation={-60} />
      <SvgHexLetter letter="W" up />
      <SvgHexLetter letter="E" up rotation={60} />
      <Hex withStroke />
      <Ship x={0} y={0} color={color || "#fff"} texture={texture || "Corsair"} rot={rotation ?? 6} />
      <SvgHexLetter letter="A" rotation={60} />
      <SvgHexLetter letter="S" />
      <SvgHexLetter letter="D" rotation={-60} />
    </svg>
  );
};
