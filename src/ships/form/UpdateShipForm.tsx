import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import FormControl from "@mui/material/FormControl";
import Typography from "@mui/material/Typography";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import { ShipContext } from "../ShipProvider";
import { ShipType } from "../ship.types";
import { MovementHelper } from "./MovementHelper";
import { ShipFormPreview } from "./ShipFormPreview";
import { UserForm } from "./UserForm";

export default function UpdateShipForm(props: {
  shipname: string;
  onClose: () => void;
  onMoveStart: (ship: ShipType) => void;
}) {
  const { shipname, onClose, onMoveStart } = props;
  const { ships, updateShip, deleteShip } = useContext(ShipContext);
  const [isAdmin, setIsAdmin] = useState(false);
  const ship = ships.find((s) => s.name === shipname);

  const keyMapper = useMemo(
    () =>
      ship
        ? ({
            w: () => updateShip(shipname, "y", ship!.y - 1),
            s: () => updateShip(shipname, "y", ship!.y + 1),
            q: () => {
              updateShip(shipname, "x", ship!.x - 1);
              updateShip(shipname, "y", ship!.y - (ship!.x % 2 ? 0 : 1));
            },
            a: () => {
              updateShip(shipname, "x", ship!.x - 1);
              updateShip(shipname, "y", ship!.y + (ship!.x % 2 ? 1 : 0));
            },
            e: () => {
              updateShip(shipname, "x", ship!.x + 1);
              updateShip(shipname, "y", ship!.y - (ship!.x % 2 ? 0 : 1));
            },
            d: () => {
              updateShip(shipname, "x", ship!.x + 1);
              updateShip(shipname, "y", ship!.y + (ship!.x % 2 ? 1 : 0));
            },
          } as Record<string, () => void>)
        : {},
    [ship, shipname, updateShip]
  );

  const keyPressed = useCallback(
    ({ key }: KeyboardEvent) => {
      if (!isAdmin) return;

      if (keyMapper[key.toLowerCase()]) {
        keyMapper[key.toLowerCase()]();
      }
    },
    [isAdmin, keyMapper]
  );

  useEffect(() => {
    window.addEventListener("keydown", keyPressed);

    return () => {
      window.removeEventListener("keydown", keyPressed);
    };
  }, [keyPressed]);

  if (!ship) {
    return null;
  }

  return (
    <SwipeableDrawer
      anchor="right"
      open
      onOpen={() => null}
      onClose={onClose}
      disableSwipeToOpen={false}
      ModalProps={{
        keepMounted: true,
      }}
    >
      <Container>
        <Stack component="form" noValidate autoComplete="off" spacing={2}>
          <FormControl>
            <FormControlLabel
              control={<Switch checked={isAdmin} onChange={(ev) => setIsAdmin(ev.target.checked)} />}
              label="Master"
              labelPlacement="end"
            />
          </FormControl>
          <Typography variant="h5" align="center" gutterBottom>
            {ship.name}
          </Typography>
          {isAdmin ? (
            <>
              <ShipFormPreview
                rot={ship.rotation}
                color={ship.color}
                texture={ship.texture}
                changeRotation={(r) => updateShip(shipname, "rotation", r)}
              />
              <TextField
                label="Acceleración máxima"
                type="number"
                value={ship.acceleration}
                onChange={(ev) => updateShip(shipname, "acceleration", parseInt(ev.target.value))}
              />
              <TextField
                label="Velocidad"
                type="number"
                value={ship.speed}
                InputProps={{ inputProps: { min: 0, step: 1 } }}
                onChange={(ev) => updateShip(shipname, "speed", parseInt(ev.target.value))}
              />
              <MovementHelper color={ship.color} rotation={ship.rotation} texture={ship.texture} />
              <Button
                color="error"
                variant="contained"
                onClick={() => {
                  deleteShip(shipname);
                  onClose();
                }}
              >
                Eliminar
              </Button>
            </>
          ) : (
            <UserForm
              ship={ship}
              onMoveStart={() => {
                onMoveStart(ship);
                onClose();
              }}
            />
          )}
        </Stack>
      </Container>
    </SwipeableDrawer>
  );
}
