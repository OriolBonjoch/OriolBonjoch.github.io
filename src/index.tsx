import React from "react";
import ReactDOM from "react-dom/client";
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import HexMap from "./map/HexMap";
import MapForm from "./map/MapForm";
import { MapContext, useMap } from "./map/map.context";
import { ShipContext } from "./ships/ship.context";
import { useShips } from "./ships/ship.hook";
import ApplicationBar from "./ApplicationBar";
import reportWebVitals from "./reportWebVitals";
import "./index.css";
import { ConfigurationProvider } from "./utils/config.context";

const theme = createTheme({
  palette: {
    mode: "dark",
  },
});

function App() {
  const map = useMap();
  const ships = useShips();
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ConfigurationProvider>
        <MapContext.Provider value={map}>
          <ShipContext.Provider value={ships}>
            <ApplicationBar />
            {map.isCreated ? <HexMap /> : <MapForm />}
          </ShipContext.Provider>
        </MapContext.Provider>
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
