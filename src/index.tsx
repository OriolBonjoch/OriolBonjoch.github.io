import React, { useContext } from "react";
import ReactDOM from "react-dom/client";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { HexMap } from "./map/HexMap";
import { MapForm } from "./map/MapForm";
import { MapContext, MapProvider } from "./map/MapContext";
import { ShipProvider } from "./ships/ShipContext";
import ApplicationBar from "./utils/ApplicationBar";
import reportWebVitals from "./reportWebVitals";
import { ConfigurationProvider } from "./utils/config.context";
import { theme } from "./utils/theme";

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
