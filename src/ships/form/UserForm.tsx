import { useState, useContext } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { ShipType } from "../ship.types";
import { ShipFormPreview } from "./ShipFormPreview";
import { ShipContext } from "../ShipContext";
import Ship from "../Ship";

export const UserForm = ({ ship, onMoveStart }: { ship: ShipType; onMoveStart: () => void }) => {
  const [acceleration, setAcceleration] = useState(ship.nextMove.acceleration || 0);
  const { updateAcceleration } = useContext(ShipContext);
  const finalSpeed = ship.nextMove.moves.reduce((acc, cur) => acc - cur.penalty, ship.speed + acceleration);

  return (
    <>
      <ShipFormPreview rot={ship.rotation} color={ship.color} texture={ship.color === "#" ? undefined : ship.color} />
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
          updateAcceleration(ship.name, acc);
        }}
      />
      <TextField
        label="Velocidad"
        value={finalSpeed === ship.speed ? ship.speed : `${ship.speed} => ${finalSpeed}`}
        disabled
      />
      <Table aria-label="simple table" sx={{ m: 0 }}>
        <TableHead>
          <TableRow>
            <TableCell>Rotación</TableCell>
            <TableCell>Distancia</TableCell>
            <TableCell>Penalización</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {ship.nextMove.moves.map((row, i) => (
            <TableRow key={i}>
              <TableCell>
                <svg viewBox="-1 -1 2 2">
                  <g>
                    <path d="M -1 0 L -0.5 -0.866 L 0.5 -0.866 L 1 0 L 0.5 0.866 L -0.5 0.866 z" fill="#c0c0c0" />
                    <Ship x={0} y={0} rot={row.rotation} color="#F44E3B" />
                  </g>
                </svg>
              </TableCell>
              <TableCell align="center">{row.distance}</TableCell>
              <TableCell align="center">{row.penalty}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Button variant="contained" onClick={onMoveStart}>
        Mover en mapa
      </Button>
    </>
  );
};
