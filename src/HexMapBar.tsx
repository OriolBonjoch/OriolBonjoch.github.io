import { useCallback, useContext, useEffect, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Slider from "@mui/material/Slider";
import PlayArrow from "@mui/icons-material/PlayArrow";
import IconButton from "@mui/material/IconButton";
import ZoomOutMap from "@mui/icons-material/ZoomOutMap";
import CenterFocusStrongIcon from "@mui/icons-material/CenterFocusStrong";
import MenuIcon from "@mui/icons-material/Menu";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import { MapContext } from "./map/map.context";
import { ShipContext } from "./ships/ship.context";

type SavedPlay = {
  ships: {
    name: string;
    x: number;
    y: number;
    rotation: number;
    speed: number;
    color: string;
  }[];
  map: { x: number; y: number };
};

const usePersistence = (hideMenu: () => void) => {
  const { size, createMap } = useContext(MapContext);
  const { ships, createShip } = useContext(ShipContext);

  const load = useCallback(() => {
    hideMenu();
    const jsonData = window.localStorage.getItem("guardado");
    if (!jsonData) return;
    const data = JSON.parse(jsonData) as SavedPlay;

    createMap(`${data.map.x}`, `${data.map.y}`);
    data.ships.forEach((s) => {
      createShip(s.name, s.x, s.y, s.color, s.speed, 0, s.rotation);
    });
  }, [createMap, createShip, hideMenu]);

  const save = useCallback(() => {
    hideMenu();
    const data = {
      ships: ships.map(({ acceleration, ...s }) => s),
      map: size,
    };
    const jsonData = JSON.stringify(data);
    window.localStorage.setItem("guardado", jsonData);
  }, [hideMenu, ships, size]);

  return {
    load,
    save,
  };
};

export function HexMapBar() {
  const { zoomX, size, isCreated, createMap, changeZoom, dragToShip } = useContext(MapContext);
  const { ships, moveShip } = useContext(ShipContext);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [anchorMenuFocus, setAnchorMenuFocus] = useState<HTMLElement>();
  const hideMenu = useCallback(() => setAnchorEl(null), []);

  const { save, load } = usePersistence(hideMenu);

  useEffect(() => {
    changeZoom(size.x);
  }, [changeZoom, size.x]);

  return (
    <AppBar position="sticky">
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
        <IconButton
          size="large"
          aria-label="focus"
          aria-controls="menu-play"
          aria-haspopup="true"
          onClick={() => moveShip()}
        >
          <PlayArrow />
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
        {isCreated ? (
          <>
            {size.x > 5 ? (
              <Slider
                aria-label="Size"
                sx={{ mx: 2 }}
                value={zoomX}
                min={3}
                max={size.x}
                step={1}
                onChange={(_ev, v) => {
                  if (typeof v === "number") {
                    changeZoom(v);
                  }
                }}
              />
            ) : null}
            {ships.length ? (
              <>
                <IconButton
                  size="large"
                  aria-label="focus"
                  aria-controls="menu-focus"
                  aria-haspopup="true"
                  onClick={(ev) => setAnchorMenuFocus(ev.currentTarget)}
                >
                  <CenterFocusStrongIcon />
                </IconButton>
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
            <IconButton size="large" aria-label="zoom all" onClick={() => changeZoom(size.x)}>
              <ZoomOutMap />
            </IconButton>
          </>
        ) : null}
      </Toolbar>
    </AppBar>
  );
}
