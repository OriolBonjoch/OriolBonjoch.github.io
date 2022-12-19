import { useContext, useState } from "react";
import { animated } from "react-spring";
import { styled } from "@mui/material/styles";
import { HexShips } from "./HexShips";
import { MovementHexCell } from "./MovementHexCell";
import { CancelMovementHexCell } from "./CancelMovementHexCell";
import { HexButton } from "./HexButton";
import { ShipContext } from "../ships/ShipProvider";
import { useHexMap } from "./hex-ship-movement.hook";
import { useMapMovement } from "./hex-map-movevement.hook";
import { ShipType } from "../ships/ship.types";
import UpdateShipForm from "../ships/form/UpdateShipForm";
import CreateShipForm from "../ships/form/CreateShipForm";
import { useConfiguration } from "../app/ConfigProvider";
import { useAsteroids } from "./AsteroidProvider";
import { HexAsteroidField } from "./HexAsteroidField";

type CoordType = { x: number; y: number };

const HexMapSvg = styled(animated.svg)(({ theme }) => {
  const fill = theme.palette.hex[theme.palette.mode];
  const stroke = theme.palette.hexStroke[theme.palette.mode];
  return {
    fill,
    stroke,
    strokeWidth: theme.spacing(0.008),
  };
});

const HexBackground = styled("rect")({
  fill: "url(#hexpattern)",
  stroke: "none",
});

export const HexMap = () => {
  const { ships } = useContext(ShipContext);
  const [createShip, setCreateShip] = useState<CoordType | null>(null);
  const [updateShip, setUpdateShip] = useState<ShipType | null>(null);
  const config = useConfiguration();
  const { asteroids, toggleAsteroid } = useAsteroids();

  const { shipMoves, shipMoved, onHexMoveStart, onHexMoveSetPath, onHexMoveCancel } = useHexMap();
  const { buttonPoints, backgroundBox, animatedViewBox } = useMapMovement();

  const onCellClicked = (x: number, y: number) => {
    const ship = ships.find((s) => s.x === x && s.y === y);
    if (ship) {
      setUpdateShip(ship);
    } else if (config.creationMode === "ships") {
      setCreateShip({ x, y });
    } else if (config.creationMode === "asteroids") {
      toggleAsteroid(x, y);
    }
  };

  return (
    <>
      <HexMapSvg viewBox={animatedViewBox}>
        <defs>
          <pattern id="hexpattern" y="-0.866" width="3" height="1.732" patternUnits="userSpaceOnUse">
            <path d="M -1 0.866 L -0.5 0 L 0.5 0 L 1 0.866 L 0.5 1.732 L -0.5 1.732 z M 0.5 1.732 L 1 0.866 L 2 0.866 L 2.5 1.732 L 2 2.598 L 1 2.598 z M 0.5 0 L 1 -0.866 L 2 -0.866 L 2.5 0 L 2 0.866 L 1 0.866 z M 2 0.866 L 2.5 0 L 3.5 0 L 4 0.866 L 3.5 1.732 L 2.5 1.732 z" />
          </pattern>
        </defs>
        {/* BACKGROUND CELLS */}
        <HexBackground {...backgroundBox} />
        {asteroids.map((asteroid) => (
          <HexAsteroidField key={`${asteroid.x}_${asteroid.y}`} {...asteroid} />
        ))}
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
        {shipMoved ? <HexButton x={shipMoved.x} y={shipMoved.y} onClick={onHexMoveCancel} /> : null}
        {/* SHIP MOVEMENT BUTTON && SHIP CREATE/UPDATE BUTTONS*/}
        {shipMoves.length
          ? shipMoves.map(({ x, y, rotation, distance }) => (
              <HexButton key={`${x}_${y}`} x={x} y={y} onClick={() => onHexMoveSetPath(x, y, rotation, distance)} />
            ))
          : config.creationMode !== null
          ? buttonPoints.map(({ i, j }) => (
              <HexButton key={`${i}_${j}`} x={i} y={j} onClick={() => onCellClicked(i, j)} />
            ))
          : ships.map((ship) => (
              <HexButton key={`${ship.x}_${ship.y}`} x={ship.x} y={ship.y} onClick={() => setUpdateShip(ship)} />
            ))}
      </HexMapSvg>
      {createShip ? <CreateShipForm {...createShip} onClose={() => setCreateShip(null)} /> : null}
      {updateShip ? (
        <UpdateShipForm shipname={updateShip.name} onClose={() => setUpdateShip(null)} onMoveStart={onHexMoveStart} />
      ) : null}
    </>
  );
};
