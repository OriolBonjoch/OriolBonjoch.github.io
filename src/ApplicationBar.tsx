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
import { MapContext } from "./map/map.context";
import { ShipContext } from "./ships/ship.context";
import { Globals } from "react-spring";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import Box from "@mui/material/Box";

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

    createMap(`${data.map.x}`);
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

export default function ApplicationBar() {
  const { size, isCreated, createMap, changeZoom, dragToShip } = useContext(MapContext);
  const { ships, moveShip } = useContext(ShipContext);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [anchorMenuFocus, setAnchorMenuFocus] = useState<HTMLElement>();
  const hideMenu = useCallback(() => setAnchorEl(null), []);
  const [animated, setAnimated] = useState(!Globals.skipAnimation);

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
            <Button startIcon={<PlayArrow />} onClick={() => moveShip()}>
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
