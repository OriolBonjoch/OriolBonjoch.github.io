import { createTheme, ThemeOptions } from "@mui/material";

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

export const theme = createTheme({
  palette: {
    hex: {
      main: "#c0c0c0",
      dark: "#c0c0c0",
    },
    hexStroke: {
      main: "#202020",
      dark: "#000000ee",
    },
    ghost: {
      main: "#333333",
      dark: "#999999",
    },
    mode: "dark",
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
} as ThemeOptions);
