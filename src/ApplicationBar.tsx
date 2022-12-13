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
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import Box from "@mui/material/Box";

import { MapContext } from "./map/MapContext";
import { ShipContext } from "./ships/ShipContext";
import { Globals } from "react-spring";
import { usePersistence } from "./utils/persistence.hook";

export default function ApplicationBar() {
  const { size, isCreated, createMap, changeZoom, dragToShip } = useContext(MapContext);
  const { ships, moveShip } = useContext(ShipContext);
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

  useEffect(() => {
    changeZoom(size.x);
  }, [changeZoom, size.x]);

  return (
    <AppBar position="fixed">
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
          anchorOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
          keepMounted
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          open={!!anchorEl}
          onClose={() => hideMenu()}
        >
          <MenuItem
            onClick={() => {
              hideMenu();
              createMap();
            }}
          >
            Nuevo mapa
          </MenuItem>
          {isCreated ? <MenuItem onClick={save}>Guardar</MenuItem> : null}
          <MenuItem onClick={load}>Cargar</MenuItem>
        </Menu>
        {isCreated && ships.length ? (
          <>
            <Button startIcon={<PlayArrow />} onClick={startMovement}>
              Mover Todo
            </Button>
            <Button startIcon={<CenterFocusStrongIcon />} onClick={(ev) => setAnchorMenuFocus(ev.currentTarget)}>
              Centrar
            </Button>
            <Menu
              sx={{ mt: "45px" }}
              id="menu-focus"
              anchorEl={anchorMenuFocus}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
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
        <Box sx={{ flexGrow: 1 }} />
        <FormControlLabel
          control={
            <Switch
              checked={animated}
              onChange={(ev) => {
                setAnimated(ev.target.checked);
                Globals.assign({ skipAnimation: !ev.target.checked });
              }}
            />
          }
          labelPlacement="start"
          label="Animar"
        />
      </Toolbar>
    </AppBar>
  );
}
