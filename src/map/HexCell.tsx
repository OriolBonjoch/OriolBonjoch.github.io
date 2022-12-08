import { calcCoords } from "./map.helper";

export function HexCell({
  x,
  y,
  movement,
}: {
  x: number;
  y: number;
  movement: {
    isBase: boolean;
    acc?: number;
  };
}) {
  const [x0, y0] = calcCoords(x, y);
  const hexId = `hexcell_${x}_${y}`;
  return (
    <g id={hexId} className="hexcell" transform={`translate(${x0} ${y0})`}>
      {movement.isBase ? (
        <path
          className="cross"
          d="M 0 -0.5 C -0.2766 -0.5 -0.5 -0.2766 -0.5 0 s 0.2236 0.5 0.5 0.5 s 0.5 -0.2236 0.5 -0.5 S 0.2766 -0.5 0 -0.5 z m 0.25 0.6794 L 0.1794 0.25 L 0 0.0706 L -0.1794 0.25 L -0.25 0.1794 L -0.0706 0 L -0.25 -0.1794 L -0.1794 -0.25 L 0 -0.0706 L 0.1794 -0.25 L 0.25 -0.1794 L 0.0706 0 L 0.25 0.1794 z"
        />
      ) : (
        <text x={0.07} dominantBaseline="middle">
          {movement?.acc}
        </text>
      )}
    </g>
  );
}
