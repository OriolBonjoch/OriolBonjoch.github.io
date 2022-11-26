import { Button, Box, TextField, SwipeableDrawer } from "@mui/material";
import { useCallback, useContext, useRef, useState } from "react";
import { ShipContext } from "./ship.context";
import Circle from "@uiw/react-color-circle";
import Ship from "./Ship";
import "./ShipForm.css";

const hexPath =
  "M -1 0 L -0.5 -0.866 L 0.5 -0.866 L 1 0 L 0.5 0.866 L -0.5 0.866 z";
const ShipFormPreview = (props: {
  color: string;
  rot: number;
  changeRotation: (rot: number) => void;
}) => {
  const { rot, changeRotation, color } = props;
  const [lock, setLock] = useState(false);
  const svgElement = useRef<SVGSVGElement>(null);
  const handleMouseMove = useCallback(
    (event: React.MouseEvent<SVGSVGElement>) => {
      if (!svgElement.current || lock) {
        return;
      }

      const { x, y, width, height } =
        svgElement.current.getBoundingClientRect();
      const diffX = x + width / 2 - event.clientX;
      const diffY = y + height / 2 - event.clientY;
      const newRot = Math.floor((Math.atan2(diffY, diffX) * 6) / Math.PI + 0.5);
      changeRotation(newRot);
    },
    [changeRotation, lock]
  );

  return (
    <svg
      ref={svgElement}
      viewBox="-1 -1 2 2"
      onMouseMove={handleMouseMove}
      onClick={(_) => setLock((prev) => !prev)}
    >
      <g>
        <path d={hexPath} />
        <g transform={lock ? "" : "scale(0.5 0.5)"}>
          <Ship x={0} y={0} rot={rot} color={color} />
        </g>
      </g>
    </svg>
  );
};

export default function ShipForm(props: {
  x: number;
  y: number;
  onClose: () => void;
}) {
  const { x, y, onClose } = props;
  const [rot, setRot] = useState(0);
  const [speed, setSpeed] = useState(0);
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
      <Box
        component="form"
        noValidate
        className="ship-form-container"
        autoComplete="off"
        sx={{ "&>*": { m: 1 } }}
      >
        <ShipFormPreview
          rot={rot}
          color={hex}
          changeRotation={(r) => setRot(r)}
        />
        <TextField
          label="Alias de la nave"
          type="text"
          value={name}
          onChange={(ev) => setName(ev.target.value)}
        />
        <Circle
          colors={["#F44E3B", "#FE9200", "#FCDC00", "#B80000", "#5300EB"]}
          color={hex}
          onChange={(color) => setHex(color.hex)}
        />
        {/* <TextField
          label="Rotación"
          type="number"
          value={(rot < 0 ? rot + 12 : rot) + 1}
          onChange={(ev) => setRot(parseInt(ev.target.value) % 12)}
        /> */}
        <TextField
          label="Velocidad inicial"
          type="number"
          value={speed}
          onChange={(ev) => setSpeed(parseInt(ev.target.value))}
        />
        <Button
          variant="contained"
          onClick={() => {
            createShip(name, x, y, hex, speed, 0, rot);
            onClose();
          }}
        >
          Añadir nave
        </Button>
      </Box>
    </SwipeableDrawer>
  );
}
