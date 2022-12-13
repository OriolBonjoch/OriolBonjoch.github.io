import { Fragment, useContext, useEffect, useState } from "react";
import { animated, Globals } from "react-spring";
import { AnimatedHexShip, HexShip } from "./HexShip";
import { HexCell } from "./HexCell";
import { HexButton, HexMoveButton } from "./HexButton";
import { ShipContext } from "../ships/ShipContext";
import { useHexMap } from "./hex-map.hook";
import { useMapMovement } from "./hex-move.hook";
import { ShipType } from "../ships/ship.types";
import { calcCoords } from "./map.helper";
import UpdateShipForm from "../ships/form/UpdateShipForm";
import CreateShipForm from "../ships/form/CreateShipForm";
import "./HexMap.css";

type SizeType = { x: number; y: number };

export default function HexMap() {
  const { ships } = useContext(ShipContext);
  const [currentStep, setCurrentStep] = useState(0);
  const [createShip, setCreateShip] = useState<SizeType | null>(null);
  const [updateShip, setUpdateShip] = useState<ShipType | null>(null);

  const { step, applyMovement } = useContext(ShipContext);
  const { shipMoves, onHexMoveStart, onHexMoveSetPath, onHexMoveCancel } = useHexMap();
  const { buttonPoints, viewport, animatedViewBox } = useMapMovement();

  const onCellClicked = (x: number, y: number) => {
    const ship = ships.find((s) => s.x === x && s.y === y);
    if (ship) {
      setUpdateShip(ship);
    } else {
      setCreateShip({ x, y });
    }
  };

  useEffect(() => {
    if (step === currentStep) return;
    if (Globals.skipAnimation) {
      setCurrentStep(step);
      applyMovement();
      return;
    }

    const timer = setTimeout(() => {
      setCurrentStep(step);
      applyMovement();
    }, 1300);

    return () => {
      clearTimeout(timer);
    };
  }, [applyMovement, currentStep, step]);

  const baseMovement = shipMoves.find((m) => m.isBase);
  const drawableShips = !baseMovement ? ships : ships.filter((s) => baseMovement.x !== s.x && baseMovement.y !== s.y);

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
          return (
            <HexCell
              key={`cell_${i}_${j}`}
              x={i}
              y={j}
              movement={{
                isBase: pointMove.isBase,
                isValid: pointMove.isBase ? false : pointMove.isValid,
                text: pointMove.isBase ? "" : pointMove.text,
              }}
            />
          );
        })}
        {step !== currentStep
          ? null
          : drawableShips.map((ship) => {
              const lastMove = ship?.nextMove.moves.slice(-1)[0];
              const moveToDegrees = ship ? 30 * (lastMove.rotation % 12) : 0;
              const [x0, y0] = calcCoords(ship.x, ship.y);
              const [xf, yf] = calcCoords(lastMove.x, lastMove.y);
              const pathPoints = ship.nextMove.moves.map((m) => calcCoords(m.x, m.y));
              return (
                <Fragment key={ship.name}>
                  <g transform={`translate(${xf} ${yf}) rotate(${moveToDegrees})`}>
                    <path fill="#999999" stroke="none" d={`M -0.7 0 L 0.5 -0.5 L 0.2 0 L 0.5 0.5 z`} />
                  </g>
                  <path
                    key={`line_${ship.name}`}
                    d={pathPoints.reduce((acc, [px, py]) => `${acc} L ${px} ${py}`, `M ${x0} ${y0}`)}
                    fill="none"
                    stroke="#999999"
                    strokeWidth={0.2}
                  />
                </Fragment>
              );
            })}
        {drawableShips.map((ship) => {
          if (step !== currentStep) {
            return <AnimatedHexShip key={ship.name} ship={ship} />;
          }

          return <HexShip key={ship.name} ship={ship} />;
        })}
        {shipMoves.length
          ? shipMoves.map((move) => {
              const { x, y, isBase } = move;
              return (
                <HexMoveButton
                  key={`${x}_${y}`}
                  x={x}
                  y={y}
                  onClick={
                    isBase ? () => onHexMoveCancel() : () => onHexMoveSetPath(x, y, move.rotation, move.distance)
                  }
                />
              );
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
