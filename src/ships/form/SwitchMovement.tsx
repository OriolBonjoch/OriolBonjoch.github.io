const hexPath = "M -1 0 L -0.5 -0.866 L 0.5 -0.866 L 1 0 L 0.5 0.866 L -0.5 0.866 z";

const SvgHex = ({ x, y }: { x?: number; y?: number }) => {
  const trans = `translate(${x || 0} ${y || 0})`;
  return <path d={hexPath} transform={trans} stroke="#000000" strokeWidth={0.05} fill="#c0c0c0" />;
};

export const SwitchMovement = ({ flipped, onClick }: { flipped?: boolean; onClick: () => void }) => {
  const line = `M -4.5 0 L -3 ${flipped ? "0.866" : "-0.866"} L -1.5 0 L 0 ${
    flipped ? "0.866" : "-0.866"
  } L 1.5 0 L 3 ${flipped ? "0.866" : "-0.866"} L 4.5 0`;
  return (
    <svg viewBox="-3 -2 6 4" onClick={onClick}>
      <SvgHex x={-3} y={-0.866} />
      <SvgHex x={-3} y={0.866} />
      <SvgHex x={-1.5} />
      <SvgHex y={-0.866} />
      <SvgHex y={0.866} />
      <SvgHex x={1.5} />
      <SvgHex x={3} y={-0.866} />
      <SvgHex x={3} y={0.866} />
      <path d={line} stroke="black" strokeWidth={0.3} fill="none" />
    </svg>
  );
};
