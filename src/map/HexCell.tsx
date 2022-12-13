import { calcCoords } from "./map.helper";

type Props = {
  x: number;
  y: number;
  movement: {
    text: string;
    isValid: boolean;
    rotation: number;
  };
};

export function MovementHexCell({ x, y, movement }: Props) {
  const [x0, y0] = calcCoords(x, y);
  const hexId = `hexcell_${x}_${y}`;
  const fillColor = movement.isValid ? "#817f0e" : "#fff";
  const dpath = movement.isValid
    ? "M -0.55 0 L -0.05 -0.35 A 0.4 0.4 0 0 1 0.55 0 A 0.4 0.4 0 0 1 -0.05 0.35 z"
    : "M -0.5 0 L 0.4 -0.3 L 0.2 0 L 0.4 0.3 z";
  return (
    <g id={hexId} className="hexcell" transform={`translate(${x0} ${y0})`}>
      <path
        transform={movement.rotation ? `rotate(${30 * (movement.rotation % 12)})` : undefined}
        d={dpath}
        fill={fillColor}
        stroke="none"
      />
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
