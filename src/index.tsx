import React, { useContext } from "react";
import ReactDOM from "react-dom/client";
import { HexMap } from "./map/HexMap";
import { MapForm } from "./map/MapForm";
import { MapContext, MapProvider } from "./map/MapProvider";
import { ShipProvider } from "./ships/ShipProvider";
import ApplicationBar from "./app/ApplicationBar";
import reportWebVitals from "./reportWebVitals";
import { ConfigurationProvider } from "./app/ConfigProvider";
import { ThemeProvider } from "./app/ThemeProvider";
import { AsteroidProvider } from "./map/AsteroidProvider";

function AppBody() {
  const map = useContext(MapContext);
  return map.isCreated ? <HexMap /> : <MapForm />;
}

function App() {
  return (
    <ConfigurationProvider>
      <ThemeProvider>
        <MapProvider>
          <AsteroidProvider>
            <ShipProvider>
              <ApplicationBar />
              <AppBody />
            </ShipProvider>
          </AsteroidProvider>
        </MapProvider>
      </ThemeProvider>
    </ConfigurationProvider>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();
