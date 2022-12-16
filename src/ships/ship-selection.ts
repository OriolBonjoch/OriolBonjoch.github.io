import { Corsair, FarTrader, FatTrader, MercenaryCruiser, SeekerMining } from "./assets";

export const selectableShips: Record<string, React.FC<{ color: string }>> = {
  Corsair: Corsair,
  FarTrader: FarTrader,
  FatTrader: FatTrader,
  MercenaryCruiser: MercenaryCruiser,
  SeekerMining: SeekerMining,
};
