import { useContext, useEffect, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Slider from "@mui/material/Slider";
import IconButton from "@mui/material/IconButton";
import ZoomOutMap from "@mui/icons-material/ZoomOutMap";
import CenterFocusStrongIcon from "@mui/icons-material/CenterFocusStrong";
import MenuIcon from "@mui/icons-material/Menu";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import { MapContext } from "./map/map.context";
import { ShipContext } from "./ships/ship.context";

export function HexMapBar() {
  const { zoomX, size, isCreated, createMap, changeView } = useContext(MapContext);
  const { ships } = useContext(ShipContext);
  const [anchorMenuFocus, setAnchorMenuFocus] = useState<HTMLElement>();

  useEffect(() => {
    changeView(null, size.x);
  },[changeView, size.x]);

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
          onClick={() => createMap()}
        >
          <MenuIcon />
        </IconButton>
        {isCreated ? (
          <>
            {size.x > 5 ? (
              <Slider
                aria-label="Volume"
                value={zoomX}
                min={3}
                max={size.x}
                marks={undefined}
                step={0.1}
                onChange={(_ev, v) => {
                  if (typeof v === "number") {
                    changeView(null, v);
                  }
                }}
                sx={{ mx: 2 }}
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
                    <MenuItem>
                      <Typography key={s.name} textAlign="center">
                        {s.name}
                      </Typography>
                    </MenuItem>
                  ))}
                </Menu>
              </>
            ) : null}
            <IconButton
              size="large"
              aria-label="zoom all"
              onClick={() => changeView(null, size.x)}
            >
              <ZoomOutMap />
            </IconButton>
          </>
        ) : null}
      </Toolbar>
    </AppBar>
  );
}
