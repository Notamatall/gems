import { GSType } from "./game-symbol";

export interface SimBoard {
  reels: SimReel[];
}

export interface SimReel {
  col: number;
  symbols: SimSymbol[];
}

export interface SimSymbol {
  id: number;
  type: GSType;
  destroy: () => void;
}
