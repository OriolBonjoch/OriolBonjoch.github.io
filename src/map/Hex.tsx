import { styled } from "@mui/material/styles";

const hexPath = "M -1 0 L -0.5 -0.866 L 0.5 -0.866 L 1 0 L 0.5 0.866 L -0.5 0.866 z";

type Props = { withStroke?: boolean };

export const Hex = styled((props: React.SVGProps<SVGPathElement>) => <path {...props} d={hexPath} />, {
  shouldForwardProp: (prop: string) => prop !== "withStroke",
})<Props>(({ withStroke, theme }) => {
  const fill = theme.palette.hex[theme.palette.mode];
  const foreground = theme.palette.hexStroke[theme.palette.mode];
  return {
    stroke: withStroke ? foreground : "none",
    strokeWidth: theme.spacing(0.01),
    fill,
  };
});
