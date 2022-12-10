import Ship from "../Ship";

const hexPath = "M -1 0 L -0.5 -0.866 L 0.5 -0.866 L 1 0 L 0.5 0.866 L -0.5 0.866 z";

const SvgHexLetter = ({ letter, up, rotation }: { letter: string; up?: boolean; rotation?: number }) => {
  const trans = `translate(0 ${up ? -1.732 : 1.732})`;
  const rot = rotation ? `rotate(${rotation}) ` : "";
  const tor = rotation ? ` rotate(${-rotation})` : "";
  return (
    <g>
      <path d={hexPath} transform={rot + trans} stroke="#000000" strokeWidth={0.05} fill="#c0c0c0"></path>
      <text
        x={0}
        transform={rot + trans + tor}
        dominantBaseline="middle"
        textAnchor="middle"
        stroke="none"
        fontSize="0.8"
      >
        {letter}
      </text>
    </g>
  );
};

const SvgEmptyHex = () => {
  return <path d={hexPath} stroke="#000000" strokeWidth={0.05} fill="#c0c0c0" />;
};

export const MovementHelper = ({ color, rotation }: { color?: string; rotation?: number }) => {
  return (
    <svg viewBox="-3 -3 6 6">
      <SvgHexLetter letter="Q" up rotation={-60} />
      <SvgHexLetter letter="W" up />
      <SvgHexLetter letter="E" up rotation={60} />
      <SvgEmptyHex />
      <Ship
        x={0}
        y={0}
        color={color || "#fff"}
        texture={color && color[0] === "#" ? undefined : color}
        rot={rotation ?? 6}
      />
      <SvgHexLetter letter="A" rotation={60} />
      <SvgHexLetter letter="S" />
      <SvgHexLetter letter="D" rotation={-60} />
    </svg>
  );
};
