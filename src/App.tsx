import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import HexMap from "./map/HexMap";
import MapForm from "./map/MapForm";
import { MapContext, useMap } from "./map/map.context";
import { ShipContext } from "./ships/ship.context";
import { useShips } from "./ships/ship.hook";
import { HexMapBar } from "./HexMapBar";
import "./App.css";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

function App() {
  const map = useMap();
  const ships = useShips();
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <MapContext.Provider value={map}>
        <ShipContext.Provider value={ships}>
          <HexMapBar />
          <div className="App">{map.isCreated ? <HexMap /> : <MapForm />}</div>
        </ShipContext.Provider>
      </MapContext.Provider>
    </ThemeProvider>
  );
}

export default App;
