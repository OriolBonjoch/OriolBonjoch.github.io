import { calcCoords, halfsqrt3 } from "./map.helper";

export function HexButton({ x, y, onClick }: { x: number; y: number; onClick: () => void }) {
  const hexId = `hexbutton_${x}_${y}`;
  const [x0, y0] = calcCoords(x, y);
  return (
    <g id={hexId} className="hexbutton" transform={`translate(${x0} ${y0})`} onClick={onClick}>
      <path d={`M -1 0 L -0.5 ${-halfsqrt3} L 0.5 ${-halfsqrt3} L 1 0 L 0.5 ${halfsqrt3} L -0.5 ${halfsqrt3} z`} />
    </g>
  );
}

export function HexMoveButton({ x, y, onClick }: { x: number; y: number; onClick: () => void }) {
  const hexId = `hexbutton_${x}_${y}`;
  const [x0, y0] = calcCoords(x, y);
  return (
    <g id={hexId} className="hexbuttonmove" transform={`translate(${x0} ${y0})`} onClick={onClick}>
      <path d={`M -1 0 L -0.5 ${-halfsqrt3} L 0.5 ${-halfsqrt3} L 1 0 L 0.5 ${halfsqrt3} L -0.5 ${halfsqrt3} z`} />
    </g>
  );
}
