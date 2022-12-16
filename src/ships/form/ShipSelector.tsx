import Masonry from "@mui/lab/Masonry";
import ShipTemplate from "../assets/FarTrader";
import { selectableShips } from "../ship-selection";

export const ShipSelector = ({
  selectedShip,
  color,
  selectShip,
}: {
  color: string;
  selectedShip: string;
  selectShip: (ship: string) => void;
}) => {
  return (
    <Masonry columns={3}>
      {Object.entries(selectableShips).map(([key, ShipImage]) => {
        const isSelected = selectedShip && key === selectedShip;
        return (
          <svg key={key} onClick={() => selectShip(key)} viewBox="-0.8 -0.8 1.6 1.6" opacity={isSelected ? 1 : 0.4}>
            <defs>
              <radialGradient id="myGradient">
                <stop offset="0%" stopColor="#fff6" />
                <stop offset="100%" stopColor="#fff0" />
              </radialGradient>
            </defs>
            {isSelected ? <circle cx={0} cy={0} r={0.8} fill="url(#myGradient)" /> : null}
            <g transform="rotate(90)">
              <ShipImage color={color} />
            </g>
          </svg>
        );
      })}
      <ShipTemplate color={color} />
    </Masonry>
  );
};
