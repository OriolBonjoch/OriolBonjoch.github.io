import SvgIcon from "@mui/material/SvgIcon";

export const AnimatedIcon = () => (
  <SvgIcon viewBox="-1 -1 2 2">
    <path d="M 0.2 0 L -1 -0.5 L -0.7 0 L -1 0.5 z" fillOpacity={0.2} />
    <path d="M 0.6 0 L -0.6 -0.5 L -0.3 0 L -0.6 0.5 z" fillOpacity={0.5} />
    <path d="M 1 0 L -0.2 -0.5 L 0.1 0 L -0.2 0.5 z" />
  </SvgIcon>
);

export const StaticIcon = () => (
  <SvgIcon viewBox="-1 -1 2 2">
    <path d="M 0.6 0 L -0.6 -0.5 L -0.3 0 L -0.6 0.5 z" />
  </SvgIcon>
);

export const AddShipIcon = ({ selected }: { selected: boolean }) => (
  <SvgIcon viewBox="-1 -1 2 2" fontSize="large" opacity={selected ? 1 : 0.3}>
    <path d="M 0.9 0 L -0.9 -0.75 L -0.45 0 L -0.9 0.75 z" fill="#c0c0c0" />
    <path d="M 0.9 0.4 L -0.1 0.4 M 0.4 0.9 L 0.4 -0.1" strokeWidth={0.3} stroke="#fff" />
  </SvgIcon>
);

export const AddAsteroidIcon = ({ selected }: { selected: boolean }) => (
  <SvgIcon viewBox="-1 -1 2 2" fontSize="large" opacity={selected ? 1 : 0.3}>
    <path d="M 0.72 -0.04 L 0.3 -0.64 L -0.48 -0.64 L -0.84 0.08 L -0.48 0.8 L 0.6 0.74 z" fill="#999" />
    <path d="M 0.72 -0.04 L 0.3 -0.64 Q -1 0.136 0.6 0.74 z" fill="#c0c0c0" />
    <path d="M 0.9 0.4 L -0.1 0.4 M 0.4 0.9 L 0.4 -0.1" strokeWidth={0.3} stroke="#fff" />
  </SvgIcon>
);
