import { Corsair, FarTrader, FarTraderJayhawk, FatTrader, MercenaryCruiser, SeekerMining, ZunderX } from "./assets";

export const selectableShips: Record<string, React.FC<{ color: string }>> = {
  FarTraderJayhawk: FarTraderJayhawk,
  Corsair: Corsair,
  FarTrader: FarTrader,
  FatTrader: FatTrader,
  MercenaryCruiser: MercenaryCruiser,
  SeekerMining: SeekerMining,
  ZunderX: ZunderX,
};
