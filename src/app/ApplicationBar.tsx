import { useCallback, useContext, useEffect, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import PlayArrow from "@mui/icons-material/PlayArrow";
import IconButton from "@mui/material/IconButton";
import CenterFocusStrongIcon from "@mui/icons-material/CenterFocusStrong";
import MenuIcon from "@mui/icons-material/Menu";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import Tooltip from "@mui/material/Tooltip";
import { useTheme } from "@mui/material/styles";

import { MapContext } from "../map/MapProvider";
import { ShipContext } from "../ships/ShipProvider";
import { Globals } from "react-spring";
import { usePersistence } from "../utils/persistence.hook";
import { useConfiguration } from "./ConfigProvider";
import { AddAsteroidIcon, AddShipIcon, AnimatedIcon, StaticIcon } from "./ApplicationBarIcons";

export default function ApplicationBar() {
  const { size, isCreated, createMap, changeZoom, dragToShip } = useContext(MapContext);
  const { ships, moveShip } = useContext(ShipContext);
  const config = useConfiguration();
  const theme = useTheme();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [anchorMenuFocus, setAnchorMenuFocus] = useState<HTMLElement>();
  const hideMenu = useCallback(() => setAnchorEl(null), []);
  const [animated, setAnimated] = useState(!Globals.skipAnimation);

  const startMovement = () => {
    // TODO: Center map before movement

    // const points: Point[] = ships.flatMap((ship) => {
    //   const [vx, vy] = ship.nextMove.moves[ship.nextMove.pickedMove];
    //   const [x2, y2] = [ship.x + vx, ship.y + vy];
    //   return [
    //     { x: ship.x, y: ship.y },
    //     { x: x2, y: y2 },
    //   ];
    // });

    // const ratio = size.x / size.y;
    // const [minX, minY] = [Math.min(...points.map((p) => p.x)) - 1, Math.min(...points.map((p) => p.y)) - 1];
    // const [maxX, maxY] = [Math.max(...points.map((p) => p.x)) + 1, Math.max(...points.map((p) => p.y)) + 1];
    // const [sizeX, sizeY] = [maxX - minX, maxY - minY];

    // const zoomX = sizeX / sizeY > ratio ? sizeX : Math.ceil((sizeY * size.x) / size.y);
    // const zoomY = Math.ceil((zoomX * sizeY) / sizeX);
    // changeZoom(zoomX);
    // centerTo(minX + zoomX / 2, minY + zoomY / 2);
    moveShip();
  };

  const { save, load } = usePersistence(hideMenu);

  const createMapClick = () => {
    hideMenu();
    createMap();
  };

  const onAnimatedSwitch = () => {
    Globals.assign({ skipAnimation: !animated });
    setAnimated(!animated);
  };

  const onChangeCreation = (_: unknown, value: "ships" | "asteroids" | null) => {
    config.changeCreationMode(value);
  };

  useEffect(() => {
    changeZoom(size.x);
  }, [changeZoom, size.x]);

  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="open drawer"
          aria-controls="menu-appbar"
          aria-haspopup="true"
          onClick={(ev) => setAnchorEl(ev.currentTarget)}
        >
          <MenuIcon />
        </IconButton>
        <Menu
          id="menu-appbar"
          anchorEl={anchorEl}
          anchorOrigin={{ vertical: "top", horizontal: "left" }}
          keepMounted
          transformOrigin={{ vertical: "top", horizontal: "right" }}
          open={!!anchorEl}
          onClose={() => hideMenu()}
        >
          <MenuItem onClick={createMapClick}>Nuevo mapa</MenuItem>
          {isCreated ? <MenuItem onClick={save}>Guardar</MenuItem> : null}
          <MenuItem onClick={load}>Cargar</MenuItem>
        </Menu>
        {isCreated && ships.length ? (
          <>
            <Button color="inherit" startIcon={<PlayArrow />} onClick={startMovement}>
              Mover Todo
            </Button>
            <Button
              color="inherit"
              startIcon={<CenterFocusStrongIcon />}
              onClick={(ev) => setAnchorMenuFocus(ev.currentTarget)}
            >
              Centrar
            </Button>
            <Menu
              id="menu-focus"
              anchorEl={anchorMenuFocus}
              anchorOrigin={{ vertical: "top", horizontal: "right" }}
              keepMounted
              transformOrigin={{ vertical: "top", horizontal: "right" }}
              open={!!anchorMenuFocus}
              onClose={() => setAnchorMenuFocus(undefined)}
            >
              {ships.map((s) => (
                <MenuItem key={s.name} onClick={() => dragToShip([s.x, s.y])}>
                  <Typography textAlign="center">{s.name}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </>
        ) : null}
        <Box flexGrow={1} />

        <ToggleButtonGroup value={config.creationMode} exclusive onChange={onChangeCreation}>
          <Tooltip disableFocusListener describeChild title="Añade los botones al mapa para crear naves">
            <ToggleButton value="ships" aria-label="left aligned" sx={{ p: 0.5 }} size="large">
              <AddShipIcon selected={config.creationMode === "ships"} />
            </ToggleButton>
          </Tooltip>
          <ToggleButton value="asteroids" aria-label="asteroids" sx={{ p: 0.5 }} size="large">
            <AddAsteroidIcon selected={config.creationMode === "asteroids"} />
          </ToggleButton>
        </ToggleButtonGroup>
        <Tooltip disableFocusListener describeChild title="Habilita / deshabilita todas las animaciones">
          <IconButton onClick={onAnimatedSwitch} color="inherit" sx={{ m: 1 }}>
            {animated ? <AnimatedIcon /> : <StaticIcon />}
          </IconButton>
        </Tooltip>
        <Tooltip disableFocusListener describeChild title="Alterna claros / oscuros">
          <IconButton onClick={config.toggleColorMode} color="inherit">
            {theme.palette.mode === "dark" ? <Brightness4Icon /> : <Brightness7Icon />}
          </IconButton>
        </Tooltip>
      </Toolbar>
    </AppBar>
  );
}
