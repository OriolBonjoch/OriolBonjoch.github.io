const hexPath = "M -1 0 L -0.5 -0.866 L 0.5 -0.866 L 1 0 L 0.5 0.866 L -0.5 0.866 z";

const SvgHex = ({ letter, up, rotation }: { letter: string; up?: boolean; rotation?: number }) => {
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
  return <path d={hexPath} />;
};

export const MovementHelper = () => {
  return (
    <svg viewBox="-3 -3 6 6">
      <SvgHex letter="Q" up rotation={-60} />
      <SvgHex letter="W" up />
      <SvgHex letter="E" up rotation={60} />
      <SvgEmptyHex />
      <SvgHex letter="A" rotation={60} />
      <SvgHex letter="S" />
      <SvgHex letter="D" rotation={-60} />
    </svg>
  );
};
