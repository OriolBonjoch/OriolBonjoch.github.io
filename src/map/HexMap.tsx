import { Fragment, useContext, useState } from "react";
import CreateShipForm from "../ships/CreateShipForm";
import { HexShip } from "./HexShip";
import { calcCoords } from "./map.helper";
import { HexCell } from "./HexCell";
import { HexButton } from "./HexButton";
import { ShipContext } from "../ships/ship.context";
import { useHexMap } from "./hex-map.hook";
import { useMapMovement } from "./hex-move.hook";
import { ShipType } from "../ships/ship.types";
import UpdateShipForm from "../ships/update-form/UpdateShipForm";
import { animated } from "react-spring";
import "./HexMap.css";

type SizeType = { x: number; y: number };

export default function HexMap() {
  const { ships, prepareShip } = useContext(ShipContext);
  const [createShip, setCreateShip] = useState<SizeType | null>(null);
  const [updateShip, setUpdateShip] = useState<ShipType | null>(null);

  const { shipMoves, onHexMoveCancel, onHexMoveStart } = useHexMap();
  const { buttonPoints, viewport, animatedViewBox } = useMapMovement();

  const onCellClicked = (x: number, y: number) => {
    const ship = ships.find((s) => s.x === x && s.y === y);
    const pointMove = shipMoves.find((m) => m.x === x && m.y === y);
    if (ship) {
      if (pointMove?.isBase) onHexMoveCancel();
      else setUpdateShip(ship);
      return;
    }

    if (pointMove && !pointMove.isBase) {
      const movedShip = ships.find((s) => s.name === pointMove.name);
      if (!movedShip) return;
      prepareShip(pointMove.name, pointMove.acc, pointMove.rot, x - movedShip.x, y - movedShip.y);
      onHexMoveCancel();
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
        <rect
          x={viewport[0] - 3}
          y={viewport[1] - 1.732}
          width={viewport[2] + 6}
          height={viewport[3] + 3.464}
          fill="url(#hexpattern)"
          stroke="none"
        />
        {shipMoves.map((pointMove) => {
          const i = pointMove.x;
          const j = pointMove.y;
          return <HexCell key={`${i}_${j}`} x={i} y={j} movement={pointMove} />;
        })}
        {ships.map((ship) => {
          const [x1, y1] = calcCoords(ship.x, ship.y);
          const [vx, vy] = ship.nextMove.moves[ship.nextMove.pickedMove];
          const [x2, y2] = calcCoords(ship.x + vx, ship.y + vy);
          const pointMove = shipMoves.find((m) => m.x === ship.x && m.y === ship.y);
          const moveToDegrees = ship ? 30 * (ship.nextMove.rotation % 12) : 0;
          return pointMove?.isBase ? null : (
            <Fragment key={ship.name}>
              <g transform={`translate(${x2} ${y2}) rotate(${moveToDegrees})`}>
                <path fill="#999999" stroke="none" d={`M -0.7 0 L 0.5 -0.5 L 0.2 0 L 0.5 0.5 z`} />
              </g>
              <line key={`line_${ship.name}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#999999" strokeWidth={0.2} />
              <HexShip ship={ship} />
            </Fragment>
          );
        })}
        {buttonPoints.map(({ i, j }) => (
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
