import { useContext, useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { ShipContext } from "../ship.context";
import { ShipType } from "../ship.types";
import { calculateMoves, calculateRotationPenalty } from "../../utils/move.hook";
import { ShipFormPreview } from "./ShipFormPreview";

export const UserForm = ({ ship, onMoveStart }: { ship: ShipType; onMoveStart: () => void }) => {
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
