import Masonry from "@mui/lab/Masonry";
import { selectableShips } from "../ship-selection";

const ShipSelectorImage = ({
  source,
  selected,
  onSelect,
}: {
  source?: string;
  selected: boolean | null;
  onSelect: () => void;
}) => {
  if (!source) return null;
  const className = selected === null ? "" : selected ? "ship-selected" : "ship-unselected";
  return <img src={source} className={className} alt="ship_image" onClick={() => onSelect()} />;
};

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
            source={value}
            selected={selectedShip ? key === selectedShip : null}
            onSelect={() => selectShip(key)}
          />
        );
      })}
    </Masonry>
  );
};
