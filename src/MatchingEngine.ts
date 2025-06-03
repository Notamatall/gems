import { GameSymbol } from "./types";

const REELS = 6;
const ROWS = 5;
const MIN_MATCH = 3;
export class MatchingEngine {
  static getVerticalWins(
    grid: GameSymbol[][],
  ): { reel: number; symbol: GameSymbol; rowStart: number; count: number }[] {
    const wins = [];
    debugger;
    for (let row = 0; row < ROWS; row++) {
      const reel = grid[row];
      let firstSymbol = reel[0];
      let matchCount = 1;
      for (let column = 1; column < REELS; column++) {
        const nextReel = grid[column];
        let matchSymbol = nextReel[0];

        if (column[row].type === matchSymbol.type) {
          matchCount++;
        } else {
          if (matchCount >= 2) {
            matchSymbol.animSprite.play();
            // wins.push({
            //   reel,
            //   symbol: matchSymbol,
            //   rowStart: row - matchCount,
            //   count: matchCount,
            // });
          }
          matchSymbol = column[row];
          matchCount = 1;
        }
      }

      // Check end of column
      if (matchCount >= MIN_MATCH) {
        wins.push({
          reel,
          symbol: matchSymbol,
          rowStart: ROWS - matchCount,
          count: matchCount,
        });
      }

      // ❌ Stop scanning if this reel has no vertical match
      if (!wins.some((w) => w.reel === reel)) break;
    }

    return wins;
  }

  static checkHorizontal(grid: GameSymbol[][], row: number): any | null {
    const startSymbol = grid[0][row];
    if (!startSymbol) return null;

    const matchSymbols: Array<GameSymbol> = [startSymbol];

    // Check consecutive matches from left to right
    for (let col = 1; col < 6; col++) {
      const compareSymbol = grid[col][row];
      if (compareSymbol.type === startSymbol.type) {
        matchSymbols.push(compareSymbol);
      } else {
        break; // Stop at first non-match
      }
    }

    if (matchSymbols.length >= 2) {
      return matchSymbols;
    }

    return [];
  }
}
