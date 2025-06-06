import {
  BOARD_HEIGHT,
  BOARD_WIDTH,
  SLOT_WEIGHTS_LIMIT,
  SLOT_WEIGHTS_LIMIT_PF,
} from "../constants";
import { GSType } from "../types";
import { SimBoard, SimReel, SimSymbol } from "../types/Simulation";
import { getSymbolByCumulativeValue, round } from "../utils/symbol";
import MathEngine from "./math-engine";
import Rng from "./rng";

let IDCounter = 0;
export class SimulationEngine {
  private bet: number = 1;
  private wonTotal = 0;
  private betTotal = 0;
  private serverSeed: string = Rng.generateRandomSeed();
  private clientSeed: string = Rng.generateRandomSeed();
  private nonce = 1;
  private cursor = 0;

  startSimulation(iterationsCount: number) {
    this.resetSimulation();
    console.log("Starting simulation with configuration.", {
      bet: this.bet,
      wonTotal: this.wonTotal,
      betTotal: this.betTotal,
    });

    for (let index = 0; index < iterationsCount; index++) {
      this.spin();
    }

    console.log("rtp:", this.wonTotal / this.betTotal);
  }

  spin() {
    this.resetSpin();
    this.deductMoney();
    const board = this.generateNewBoard();
    let isSomeMatch = false;
    do {
      this.tryRefillReels(board);
      isSomeMatch = this.searchMatches(board);
    } while (isSomeMatch);
  }

  private deductMoney() {
    this.betTotal += this.bet;
  }

  private addMoney(value: number) {
    const newValue = round(this.wonTotal + value);
    this.wonTotal = newValue;
  }

  private resetSimulation() {
    this.betTotal = 0;
    this.wonTotal = 0;
    this.serverSeed = Rng.generateRandomSeed();
    this.clientSeed = Rng.generateRandomSeed();
    this.nonce = 1;
    this.cursor = 0;
  }

  private resetSpin() {
    this.nonce++;
    this.cursor = 0;
  }

  setBet(value: number) {
    this.bet = value;
  }

  private async generateRandomSymbol(): Promise<GSType> {
    // const { getRandom } = await Rng.createRandomGenerator({
    //   serverSeed: this.serverSeed,
    //   clientSeed: this.clientSeed,
    //   nonce: this.nonce,
    // });
    // const randomValue = await getRandom(SLOT_WEIGHTS_LIMIT_PF);

    return getSymbolByCumulativeValue(randomValue);
  }

  private createSymbol(reel: SimReel) {
    const id = IDCounter++;

    const symbol: SimSymbol = {
      id,
      type: this.generateRandomSymbol(),
      destroy: () =>
        (reel.symbols = reel.symbols.filter((sym) => sym.id !== id)),
    };
    return symbol;
  }

  private generateNewBoard(): SimBoard {
    const board: SimBoard = {
      reels: [],
    };
    for (let index = 0; index < BOARD_WIDTH; index++) {
      const reel: SimReel = {
        col: index,
        symbols: [],
      };
      for (let index = 0; index < BOARD_HEIGHT; index++) {
        const symbol = this.createSymbol(reel);
        reel.symbols.push(symbol);
      }
      board.reels.push(reel);
    }
    return board;
  }

  private populateReel(reel: SimReel) {
    const emptyCount = BOARD_HEIGHT - reel.symbols.length;
    for (let index = 0; index < emptyCount; index++) {
      const symbol = this.createSymbol(reel);
      reel.symbols.push(symbol);
    }
  }

  private tryRefillReels(board: SimBoard) {
    for (let index = 0; index < board.reels.length; index++) {
      const reel = board.reels[index];
      this.populateReel(reel);
    }
  }

  private searchMatches(board: SimBoard) {
    const symbols = board.reels.map((x) => x.symbols).flat(1);
    const matches: Record<GSType, SimSymbol[]> = {
      GemC: [],
      GemG: [],
      GemR: [],
      GemW: [],
      GemY: [],
      GemV: [],
      ChestG: [],
      ChestS: [],
    };

    for (const type of Object.values(GSType)) {
      for (const symbol of symbols) {
        if (symbol.type === type) matches[type].push(symbol);
      }
    }

    let isSomeMatch = false;
    for (const [type, matchedSymbols] of Object.entries(matches)) {
      const matchesCount = matchedSymbols.length;
      const multiplier = MathEngine.getMultiplier(type as GSType, matchesCount);
      const payout = round(multiplier * this.bet);
      this.addMoney(payout);

      const isMatch = MathEngine.isMatch(type as GSType, matchesCount);
      if (isMatch) {
        matchedSymbols.forEach((s) => s.destroy());
        isSomeMatch = true;
      }
    }

    return isSomeMatch;
  }
}
