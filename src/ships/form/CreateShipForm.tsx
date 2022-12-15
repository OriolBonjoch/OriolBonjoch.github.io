import { useContext, useState } from "react";
import { Button, Box, TextField, SwipeableDrawer, Container } from "@mui/material";
import Stack from "@mui/material/Stack";
import Circle from "@uiw/react-color-circle";
import { ShipContext } from "../ShipProvider";
import { ShipFormPreview } from "./ShipFormPreview";
import { ShipSelector } from "./ShipSelector";

export default function CreateShipForm(props: { x: number; y: number; onClose: () => void }) {
  const { x, y, onClose } = props;
  const [rot, setRot] = useState(0);
  const [speed, setSpeed] = useState(0);
  const [selectedShip, setSelectedShip] = useState<string>();
  const [acceleration, setAcceleration] = useState(2);
  const [name, setName] = useState(`Nave #${Math.floor(Math.random() * 1000)}`);
  const [color, setColor] = useState("#F44E3B");
  const { createShip } = useContext(ShipContext);

  return (
    <SwipeableDrawer
      anchor="right"
      open
      onOpen={() => null}
      onClose={onClose}
      disableSwipeToOpen={false}
      ModalProps={{ keepMounted: true }}
    >
      <Container>
        <Stack component="form" noValidate autoComplete="off" spacing={2}>
          <ShipFormPreview rot={rot} color={color} texture={selectedShip} changeRotation={(r) => setRot(r)} />
          <TextField label="Alias de la nave" type="text" value={name} onChange={(ev) => setName(ev.target.value)} />
          <Circle
            colors={["#F44E3B", "#FE9200", "#FCDC00", "#B80000", "#5300EB"]}
            color={color}
            onChange={(color) => setColor(color.hex)}
          />
          <Box component="div">
            <ShipSelector
              selectShip={(key) => setSelectedShip((prev) => (prev === key ? undefined : key))}
              selectedShip={selectedShip}
            />
          </Box>
          <TextField
            label="Acceleración máxima"
            type="number"
            value={acceleration}
            InputProps={{ inputProps: { min: 0, step: 1 } }}
            onChange={(ev) => setAcceleration(parseInt(ev.target.value))}
          />
          <TextField
            label="Velocidad inicial"
            type="number"
            value={speed}
            InputProps={{ inputProps: { min: 0, step: 1 } }}
            onChange={(ev) => setSpeed(parseInt(ev.target.value))}
          />
          <Button
            variant="contained"
            onClick={() => {
              createShip(name, x, y, selectedShip ? selectedShip : color, speed, (acceleration + 12) % 12, rot);
              onClose();
            }}
          >
            Añadir nave
          </Button>
        </Stack>
      </Container>
    </SwipeableDrawer>
  );
}
