import { gsProbabilities } from "../constants/math-engine";
import Rng from "../engine/rng";
import { GSType, SlotSymbol } from "../types";
import { ResourcesController } from "./ResourcesController";

export class ProvablyFairController {
  constructor(resCtrl: ResourcesController) {
    this._resCtrl = resCtrl;
    this._cs = this.getSeed(6);
    this._ss = this.getSeed(6);
  }

  private _cs: string;
  private _ss: string;
  private nonce: number = 0;
  private _resCtrl: ResourcesController;
  private getSeed(length: number = 16) {
    const arr = new Uint8Array(length);
    crypto.getRandomValues(arr);
    // Convert to base64
    return btoa(String.fromCharCode(...arr)).slice(0, length);
  }

  /**
   * Selects the symbol by cumulative probability value (1–100)
   * @param value - A number from 1 to 100
   * @returns The selected symbol (key)
   */
  private getSymbolByCumulativeValue(value: number): GSType {
    let sum = 0;
    for (const [symbol, prob] of Object.entries(gsProbabilities)) {
      sum += prob;
      if (value <= sum) {
        return symbol as GSType;
      }
    }
    throw Error("value is out of the range");
  }

  // async getRandomSymbol(
  //   cursor: number,
  // ): Promise<{ symbol: SlotSymbol; cursor: number }> {
  //   const { getRandom, getCursor } = await Rng.createRandomGenerator({
  //     serverSeed: this._ss,
  //     clientSeed: this._cs,
  //     nonce: this.nonce,
  //     cursor,
  //   });

  //   const randomValue = await getRandom(SLOT_WEIGHTS_LIMIT);
  //   const type = this.getSymbolByCumulativeValue(randomValue);
  //   return {
  //     symbol: this._resCtrl.getSlotSymbolByType(type),
  //     cursor: getCursor(),
  //   };
  // }
}
