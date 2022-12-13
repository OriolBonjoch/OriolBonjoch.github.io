import React, { useContext } from "react";
import ReactDOM from "react-dom/client";
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import HexMap from "./map/HexMap";
import MapForm from "./map/MapForm";
import { MapContext, MapProvider } from "./map/MapContext";
import { ShipProvider } from "./ships/ShipContext";
import ApplicationBar from "./ApplicationBar";
import reportWebVitals from "./reportWebVitals";
import { ConfigurationProvider } from "./utils/config.context";
import "./index.css";

declare module "@mui/material/styles" {
  interface Palette {
    hexColor: Palette["primary"];
    hexStroke: Palette["primary"];
  }
  interface PaletteOptions {
    hexColor: PaletteOptions["primary"];
    hexStroke: PaletteOptions["primary"];
  }
}

const theme = createTheme({
  palette: {
    hexColor: {
      main: "#ffffff",
    },
    hexStroke: {
      main: "#ffffff",
    },
    mode: "dark",
  },
});

function AppBody() {
  const map = useContext(MapContext);
  return map.isCreated ? <HexMap /> : <MapForm />;
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ConfigurationProvider>
        <MapProvider>
          <ShipProvider>
            <ApplicationBar />
            <AppBody />
          </ShipProvider>
        </MapProvider>
      </ConfigurationProvider>
    </ThemeProvider>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();
