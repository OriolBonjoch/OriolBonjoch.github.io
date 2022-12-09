import {
  Button,
  Box,
  TextField,
  SwipeableDrawer,
  FormControl,
  Typography,
  Switch,
  FormControlLabel,
} from "@mui/material";
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { ShipContext } from "./ship.context";
import Ship from "./Ship";
import "./CreateShipForm.css";
import { ShipType } from "./ship.types";
import { calculateMoves, calculateRotationPenalty } from "../utils/move.hook";

const hexPath = "M -1 0 L -0.5 -0.866 L 0.5 -0.866 L 1 0 L 0.5 0.866 L -0.5 0.866 z";
const SvgHex = ({ letter, up, rotation }: { letter: string; up?: boolean; rotation?: number }) => {
  const trans = `translate(0 ${up ? -1.732 : 1.732})`;
  const rot = rotation ? `rotate(${rotation}) ` : "";
  const tor = rotation ? ` rotate(${-rotation})` : "";
  return (
    <g>
      <path d={hexPath} transform={rot + trans} stroke="black" strokeWidth={0.05} fill="none"></path>
      <text
        x={0}
        transform={rot + trans + tor}
        dominantBaseline="middle"
        textAnchor="middle"
        stroke="none"
        fontSize="0.8"
      >
        {letter}
      </text>
    </g>
  );
};

const ShipFormPreview = ({
  rot,
  changeRotation,
  color,
}: {
  color: string;
  rot: number;
  changeRotation: (rot: number) => void;
}) => {
  const [lock, setLock] = useState(true);
  const [newRotation, setNewRotation] = useState(rot);
  const svgElement = useRef<SVGSVGElement>(null);
  const handleMouseMove = useCallback(
    (event: React.MouseEvent<SVGSVGElement>) => {
      if (!svgElement.current || lock) {
        return;
      }

      const { x, y, width, height } = svgElement.current.getBoundingClientRect();
      const diffX = x + width / 2 - event.clientX;
      const diffY = y + height / 2 - event.clientY;
      const newRot = Math.floor((Math.atan2(diffY, diffX) * 6) / Math.PI + 0.5);
      setNewRotation(newRot);
    },
    [lock]
  );

  return (
    <svg
      ref={svgElement}
      viewBox="-1 -1 2 2"
      onMouseMove={handleMouseMove}
      onClick={(_) => {
        setLock((prev) => !prev);
        if (!lock && rot !== newRotation) {
          changeRotation(newRotation);
        }
      }}
    >
      <g>
        <path d={hexPath} />
        <g transform={lock ? "" : "scale(0.5 0.5)"}>
          <Ship x={0} y={0} rot={lock ? rot : newRotation} color={color} />
        </g>
      </g>
    </svg>
  );
};

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
      <Box component="form" noValidate className="ship-form-container" autoComplete="off" sx={{ "&>*": { m: 1 } }}>
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
              onChange={(ev) => updateShip(shipname, "speed", parseInt(ev.target.value))}
            />
            <svg viewBox="-3 -3 6 6">
              <SvgHex letter="Q" up rotation={-60} />
              <SvgHex letter="W" up />
              <SvgHex letter="E" up rotation={60} />
              <path d={hexPath} />
              <SvgHex letter="A" rotation={60} />
              <SvgHex letter="S" />
              <SvgHex letter="D" rotation={-60} />
            </svg>
            <Button
              color="error"
              variant="outlined"
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
      </Box>
    </SwipeableDrawer>
  );
}

const UserForm = ({ ship, onMoveStart }: { ship: ShipType; onMoveStart: () => void }) => {
  const [acceleration, setAcceleration] = useState(ship.nextMove.acceleration || 0);
  const [pickedMove, setPickedMove] = useState(ship.nextMove.pickedMove);
  const [rotation, setRotation] = useState(ship.nextMove.rotation);
  const { prepareShip } = useContext(ShipContext);

  const penalty = calculateRotationPenalty(ship.rotation, rotation);
  const speed = ship.speed + acceleration - penalty;
  const moves = calculateMoves(ship.x, ship.y, speed, rotation);

  function updateNextMove(acc: number, rot: number, p: number = 0) {
    const penalty = calculateRotationPenalty(ship.rotation, rot);
    const speed = ship.speed + acc - penalty;
    if (!moves.length && speed <= 0) return;
    const [vx, vy] = moves[p];
    prepareShip(ship.name, acc, rot, vx, vy);
  }

  return (
    <>
      <ShipFormPreview
        rot={rotation}
        color={ship.color}
        changeRotation={(r) => {
          setRotation(r);
          updateNextMove(acceleration, r);
        }}
      />
      <TextField
        label="Acceleración"
        type="number"
        InputProps={{
          inputProps: {
            min: -ship.acceleration,
            max: ship.acceleration,
            step: 1,
          },
        }}
        value={acceleration}
        onChange={(ev) => {
          const acc = parseInt(ev.target.value);
          setAcceleration(acc);
          updateNextMove(acc, rotation);
        }}
      />
      <TextField label="Velocidad" value={speed === ship.speed ? speed : `${ship.speed} => ${speed}`} disabled />
      {moves.length > 1 ? (
        <Button
          variant="outlined"
          onClick={() => {
            setPickedMove((prev) => ++prev % moves.length);
            updateNextMove(acceleration, rotation, pickedMove);
          }}
        >
          Cambiar Movimiento
        </Button>
      ) : null}
      <Button variant="outlined" onClick={onMoveStart}>
        Mover en mapa
      </Button>
    </>
  );
};
