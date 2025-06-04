import { Container } from "pixi.js";
import { GameSymbol } from "./GameSymbol";

export interface SlotReelInitializer {
  rc: Container;
}

export class SlotReel {
  constructor({ rc }: SlotReelInitializer) {
    this.rc = rc;
  }

  rc: Container;
  symbols: GameSymbol[] = [];

  addSymbols(newSymbols: GameSymbol[]) {
    for (let index = 0; index < newSymbols.length; index++) {
      const newSymbol = newSymbols[index];
      this.symbols.push(newSymbol);
    }
  }

  get actSym() {
    return this.symbols.filter((sym) => sym.state === "Active");
  }

  get inaSym() {
    return this.symbols.filter((sym) => sym.state === "Inactive");
  }

  get isAllPlaced() {
    return this.symbols.every((sym) => sym.placed);
  }
}
