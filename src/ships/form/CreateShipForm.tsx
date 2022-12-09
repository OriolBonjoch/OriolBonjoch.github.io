import { Button, Box, TextField, SwipeableDrawer } from "@mui/material";
import { useContext, useState } from "react";
import { ShipContext } from "../ship.context";
import Circle from "@uiw/react-color-circle";
import { ShipFormPreview } from "./ShipFormPreview";
import "./CreateShipForm.css";

export default function CreateShipForm(props: { x: number; y: number; onClose: () => void }) {
  const { x, y, onClose } = props;
  const [rot, setRot] = useState(0);
  const [speed, setSpeed] = useState(0);
  const [acceleration, setAcceleration] = useState(2);
  const [name, setName] = useState(`Nave #${Math.floor(Math.random() * 1000)}`);
  const [hex, setHex] = useState("#F44E3B");
  const { createShip } = useContext(ShipContext);

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
      <Box component="form" noValidate className="ship-form-container" autoComplete="off" sx={{ "&>*": { m: 1 } }}>
        <ShipFormPreview rot={rot} color={hex} changeRotation={(r) => setRot(r)} />
        <TextField label="Alias de la nave" type="text" value={name} onChange={(ev) => setName(ev.target.value)} />
        <Circle
          colors={["#F44E3B", "#FE9200", "#FCDC00", "#B80000", "#5300EB"]}
          color={hex}
          onChange={(color) => setHex(color.hex)}
        />
        <TextField
          label="Acceleración máxima"
          type="number"
          value={acceleration}
          onChange={(ev) => setAcceleration(parseInt(ev.target.value))}
        />
        <TextField
          label="Velocidad inicial"
          type="number"
          value={speed}
          onChange={(ev) => setSpeed(parseInt(ev.target.value))}
        />
        <Button
          variant="contained"
          onClick={() => {
            createShip(name, x, y, hex, speed, (acceleration + 12) % 12, rot);
            onClose();
          }}
        >
          Añadir nave
        </Button>
      </Box>
    </SwipeableDrawer>
  );
}
