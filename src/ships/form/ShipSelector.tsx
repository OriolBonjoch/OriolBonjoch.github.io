import Masonry from "@mui/lab/Masonry";
import { styled } from "@mui/material/styles";
import { selectableShips } from "../ship-selection";

type ShipSelectorImageProps = {
  selected: boolean | null;
};

const ShipSelectorImage = styled("img")<ShipSelectorImageProps>(({ selected }) => ({
  "&": selected ? { backgroundColor: "#fff3" } : { opacity: 0.4 },
}));

export const ShipSelector = ({
  selectedShip,
  selectShip,
}: {
  selectedShip?: string;
  selectShip: (ship: string) => void;
}) => {
  return (
    <Masonry columns={3}>
      {Object.entries(selectableShips).map(([key, value]) => {
        return (
          <ShipSelectorImage
            key={key}
            src={value}
            selected={selectedShip ? key === selectedShip : null}
            onClick={() => selectShip(key)}
          />
        );
      })}
    </Masonry>
  );
};
