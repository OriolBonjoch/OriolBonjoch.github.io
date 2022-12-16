import { PropsWithChildren, useMemo } from "react";
import { createTheme, ThemeProvider as MaterialThemeProvider } from "@mui/material";
import { CssBaseline } from "@mui/material";
import { useConfiguration } from "./ConfigProvider";

declare module "@mui/material/styles" {
  interface Palette {
    hex: Palette["primary"];
    hexStroke: Palette["primary"];
    ghost: Palette["primary"];
  }
  interface PaletteOptions {
    hex: PaletteOptions["primary"];
    hexStroke: PaletteOptions["primary"];
    ghost: PaletteOptions["primary"];
  }
}

export const ThemeProvider = ({ children }: PropsWithChildren) => {
  const config = useConfiguration();
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          hex: {
            main: "#c0c0c0",
            dark: "#c0c0c0",
            // dark: "#121212",
            light: "#fff",
          },
          hexStroke: {
            main: "#202020",
            dark: "#202020",
            // dark: "#363636",
            light: "#ccc",
          },
          ghost: {
            main: "#999999",
            dark: "#999999",
            // dark: "#333333",
            light: "#fade91",
          },
          mode: config.mode,
        },
        components: {
          MuiCssBaseline: {
            styleOverrides: {
              body: {
                margin: 0,
                overflow: "hidden",
              },
            },
          },
        },
      }),
    [config.mode]
  );

  return (
    <MaterialThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MaterialThemeProvider>
  );
};
