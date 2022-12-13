import { useContext, useState } from "react";
import { animated } from "react-spring";
import { HexShips } from "./HexShips";
import { MovementHexCell, CancelMovementHexCell } from "./HexCell";
import { HexButton, HexMoveButton } from "./HexButton";
import { ShipContext } from "../ships/ShipContext";
import { useHexMap } from "./hex-map.hook";
import { useMapMovement } from "./hex-move.hook";
import { ShipType } from "../ships/ship.types";
import UpdateShipForm from "../ships/form/UpdateShipForm";
import CreateShipForm from "../ships/form/CreateShipForm";
import "./HexMap.css";

type SizeType = { x: number; y: number };

export default function HexMap() {
  const { ships } = useContext(ShipContext);
  const [createShip, setCreateShip] = useState<SizeType | null>(null);
  const [updateShip, setUpdateShip] = useState<ShipType | null>(null);

  const { shipMoves, shipMoved, onHexMoveStart, onHexMoveSetPath, onHexMoveCancel } = useHexMap();
  const { buttonPoints, viewport, animatedViewBox } = useMapMovement();

  const onCellClicked = (x: number, y: number) => {
    const ship = ships.find((s) => s.x === x && s.y === y);
    if (ship) {
      setUpdateShip(ship);
    } else {
      setCreateShip({ x, y });
    }
  };

  return (
    <>
      <animated.svg viewBox={animatedViewBox} className="hexmap">
        <defs>
          <pattern id="hexpattern" y="-0.866" width="3" height="1.732" patternUnits="userSpaceOnUse">
            <path d="M -1 0.866 L -0.5 0 L 0.5 0 L 1 0.866 L 0.5 1.732 L -0.5 1.732 z M 0.5 1.732 L 1 0.866 L 2 0.866 L 2.5 1.732 L 2 2.598 L 1 2.598 z M 0.5 0 L 1 -0.866 L 2 -0.866 L 2.5 0 L 2 0.866 L 1 0.866 z M 2 0.866 L 2.5 0 L 3.5 0 L 4 0.866 L 3.5 1.732 L 2.5 1.732 z" />
          </pattern>
        </defs>
        {/* BACKGROUND CELLS */}
        <rect
          x={viewport[0] - 3}
          y={viewport[1] - 1.732}
          width={viewport[2] + 6}
          height={viewport[3] + 3.464}
          fill="url(#hexpattern)"
          stroke="none"
        />
        {/* SHIP MOVEMENT CELLS */}
        {shipMoved ? <CancelMovementHexCell x={shipMoved.x} y={shipMoved.y} /> : null}
        {shipMoves.map((pointMove) => {
          const i = pointMove.x;
          const j = pointMove.y;
          return <MovementHexCell key={`cell_${i}_${j}`} x={i} y={j} movement={pointMove} />;
        })}
        {/* SHIPS */}
        <HexShips ships={ships.filter((s) => s.name !== shipMoved?.name)} />
        {/* SHIP CANCEL BUTTON ON MOVEMENT */}
        {shipMoved ? <HexMoveButton x={shipMoved.x} y={shipMoved.y} onClick={onHexMoveCancel} /> : null}
        {/* SHIP MOVEMENT BUTTON & SHIP CREATE */}
        {shipMoves.length
          ? shipMoves.map((move) => {
              const { x, y } = move;
              const onClick = () => onHexMoveSetPath(x, y, move.rotation, move.distance);
              return <HexMoveButton key={`${x}_${y}`} x={x} y={y} onClick={onClick} />;
            })
          : buttonPoints.map(({ i, j }) => (
              <HexButton key={`${i}_${j}`} x={i} y={j} onClick={() => onCellClicked(i, j)} />
            ))}
      </animated.svg>
      {createShip ? <CreateShipForm {...createShip} onClose={() => setCreateShip(null)} /> : null}
      {updateShip ? (
        <UpdateShipForm shipname={updateShip.name} onClose={() => setUpdateShip(null)} onMoveStart={onHexMoveStart} />
      ) : null}
    </>
  );
}
