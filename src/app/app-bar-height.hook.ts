import { Theme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

export const useAppBarHeight = (theme: Theme): number => {
  const { breakpoints, mixins } = theme;
  const toolbarDesktopQuery = breakpoints.up("sm");
  const toolbarLandscapeQuery = `${breakpoints.up("xs")} and (orientation: landscape)`;
  const isDesktop = useMediaQuery(toolbarDesktopQuery);
  const isLandscape = useMediaQuery(toolbarLandscapeQuery);
  if (isDesktop) {
    const prop = mixins.toolbar[toolbarDesktopQuery] as { minHeight: number };
    if (prop) return prop.minHeight;
  }

  if (isLandscape) {
    const prop = mixins.toolbar[toolbarLandscapeQuery] as { minHeight: number };
    if (prop) return prop.minHeight;
  }

  if (!theme.mixins.toolbar.minHeight) {
    return 0;
  }

  if (typeof theme.mixins.toolbar.minHeight === "string") {
    return parseInt(theme.mixins.toolbar.minHeight);
  }

  return theme.mixins.toolbar.minHeight;
};
