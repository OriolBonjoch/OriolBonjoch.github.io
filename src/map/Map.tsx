import { useContext, useState } from "react";
import ShipForm from "../ships/ShipForm";
import { MapContext } from "./map.context";
import Hex, { calcCoords } from "./Hex";
import { ShipContext } from "../ships/ship.context";
import { ShipType } from "../ships/ship.types";
import "./Map.css";
import { useWindowSize } from "../utils/window-size.hook";

export type ShipActionKind = "rotate" | "move" | "calc";
export type ShipAction = {
  kind: ShipActionKind;
  ship: ShipType;
  tox: number;
  toy: number;
};

export default function HexMap() {
  const [action, setAction] = useState<ShipAction>();
  const { size, isCreated, viewport } = useContext(MapContext);
  const { ships, move, rotate } = useContext(ShipContext);

  const [createShip, setCreateShip] = useState<{ x: number; y: number } | null>(
    null
  );

  const { ratio } = useWindowSize();
  const svgSize = { width: "100vw", height: `calc(${Math.floor(100 * ratio)}vw - 64px)` };
  const [vp0, vp1, vp2, vp3] = viewport;

  if (!isCreated) {
    return null;
  }

  const { x, y } = size;
  const points = [...Array(x)].flatMap((_, i) =>
    [...Array(y)].map((_, j) => ({ i, j }))
  );

  return (
    <>
      <svg viewBox={`${vp0} ${vp1} ${vp2} ${vp3}`} className="hex-map" style={svgSize}>
        {points.map(({ i, j }) => {
          const ship = ships.find((s) => s.x === i && s.y === j);
          const onClick = () => {
            if (action) {
              if (action.kind === "move" && !ship) {
                move(action.ship.name, action.tox, action.toy);
              } else if (action.kind === "rotate") {
                const [ax, ay] = calcCoords(action.ship.x, action.ship.y);
                const [tx, ty] = calcCoords(action.tox, action.toy);
                const newRotation = Math.floor(
                  (Math.atan2(ay - ty, ax - tx) * 6) / Math.PI + 0.5
                );
                rotate(action.ship.name, newRotation);
              }

              setAction(undefined);
              return;
            }

            if (!ship) {
              setCreateShip({ x: i, y: j });
            }
          };

          const shipMoved = ship ? { ...ship } : undefined;
          if (
            action?.kind === "rotate" &&
            action.ship.name === shipMoved?.name
          ) {
            const [ax, ay] = calcCoords(action.ship.x, action.ship.y);
            const [tx, ty] = calcCoords(action.tox, action.toy);
            shipMoved.rotation = Math.floor(
              (Math.atan2(ay - ty, ax - tx) * 6) / Math.PI + 0.5
            );
          }

          return (
            <Hex
              ship={shipMoved}
              key={`${i}_${j}`}
              x={i}
              y={j}
              hasHover
              action={action}
              startAction={(kind: ShipActionKind) =>
                ship && setAction({ kind, tox: i, toy: j, ship })
              }
              onClick={onClick}
              onMouseEnter={() =>
                setAction((prev) => (prev ? { ...prev, tox: i, toy: j } : prev))
              }
            />
          );
        })}
      </svg>
      {createShip ? (
        <ShipForm {...createShip} onClose={() => setCreateShip(null)} />
      ) : null}
    </>
  );
}
