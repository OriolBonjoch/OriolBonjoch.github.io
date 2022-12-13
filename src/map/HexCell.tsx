import { calcCoords } from "./map.helper";

export function MovementHexCell({
  x,
  y,
  movement,
}: {
  x: number;
  y: number;
  movement: {
    text: string;
    isValid: boolean;
  };
}) {
  const [x0, y0] = calcCoords(x, y);
  const hexId = `hexcell_${x}_${y}`;
  const fillColor = movement.isValid ? "#817f0e" : "#fff";
  return (
    <g id={hexId} className="hexcell" transform={`translate(${x0} ${y0})`}>
      <circle cx="0" cy="0" r=".8" fill={fillColor} stroke="none" />
    </g>
  );
}

export function CancelMovementHexCell({ x, y }: { x: number; y: number }) {
  const [x0, y0] = calcCoords(x, y);
  const hexId = `hexcell_${x}_${y}`;
  return (
    <g id={hexId} className="hexcell" transform={`translate(${x0} ${y0})`}>
      <path
        className="cross"
        d="M 0 -0.5 C -0.2766 -0.5 -0.5 -0.2766 -0.5 0 s 0.2236 0.5 0.5 0.5 s 0.5 -0.2236 0.5 -0.5 S 0.2766 -0.5 0 -0.5 z m 0.25 0.6794 L 0.1794 0.25 L 0 0.0706 L -0.1794 0.25 L -0.25 0.1794 L -0.0706 0 L -0.25 -0.1794 L -0.1794 -0.25 L 0 -0.0706 L 0.1794 -0.25 L 0.25 -0.1794 L 0.0706 0 L 0.25 0.1794 z"
      />
    </g>
  );
}
