import { useState, useContext } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Badge from "@mui/material/Badge";
import Typography from "@mui/material/Typography";
import { ShipType } from "../ship.types";
import { ShipFormPreview } from "./ShipFormPreview";
import { ShipContext } from "../ShipProvider";
import { Ship } from "../Ship";
import { Hex } from "../../map/Hex";

export const UserForm = ({ ship, onMoveStart }: { ship: ShipType; onMoveStart: () => void }) => {
  const [acceleration, setAcceleration] = useState(ship.nextMove.acceleration || 0);
  const { updateAcceleration } = useContext(ShipContext);
  const finalSpeed = ship.nextMove.moves.reduce((acc, cur) => acc - cur.penalty, ship.speed + acceleration);

  return (
    <>
      <ShipFormPreview rot={ship.rotation} color={ship.color} texture={ship.texture} />
      <TextField
        label="Acceleración"
        type="number"
        InputProps={{
          inputProps: {
            min: Math.max(-ship.speed, -ship.acceleration),
            max: ship.acceleration,
            step: 1,
          },
        }}
        value={acceleration}
        onChange={(ev) => {
          const acc = parseInt(ev.target.value);
          setAcceleration(acc);
          updateAcceleration(ship.name, acc);
        }}
      />
      <TextField
        label="Velocidad"
        value={finalSpeed === ship.speed ? ship.speed : `${ship.speed} => ${finalSpeed}`}
        disabled
      />
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Rotación</TableCell>
            <TableCell>Distancia</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {ship.nextMove.moves.map((move, i) => (
            <TableRow key={i}>
              <TableCell>
                <svg viewBox="-1 -1 2 2">
                  <Hex />
                  <Ship x={0} y={0} rot={move.rotation} />
                </svg>
              </TableCell>
              <TableCell align="center">
                <Badge badgeContent={move.penalty} color="error">
                  <Typography variant="h4">{move.distance}</Typography>
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Button variant="contained" onClick={onMoveStart} disabled={finalSpeed <= 0}>
        Mover en mapa
      </Button>
    </>
  );
};
