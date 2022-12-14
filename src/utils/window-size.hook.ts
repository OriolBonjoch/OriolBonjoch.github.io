import { useEffect, useState } from "react";
import { useTheme } from "@mui/material";
import { useAppBarHeight } from "./app-bar-height.hook";

export function useWindowSize() {
  const theme = useTheme();
  const appBarHeight = useAppBarHeight(theme);
  const [windowSize, setWindowSize] = useState<{
    width: number;
    height: number;
  }>({ width: 1, height: 1 });

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight - appBarHeight, // TODO: Not really required to be this precise
      });
    }

    window.addEventListener("resize", handleResize);

    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, [appBarHeight]);

  return { ...windowSize, ratio: windowSize.height / windowSize.width };
}
