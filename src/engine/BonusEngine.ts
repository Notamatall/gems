import { paytables } from "../constants/math-engine";
import { BonusGameType } from "../types";
import { GSType } from "../types/game-symbol";

export default class BonusEngine {
  constructor() {}
  static isFreeSpinGame(type: GSType, matchesCount: number): boolean {
    const paytable = paytables[type];
    return paytable.special && matchesCount >= paytable.min;
  }

  static getFreeSpinTypeByMatches(matchesCount: number): BonusGameType {
    for (const { type, range } of paytables.FSChest.ranges) {
      const [min, max] = range.split("-").map(Number);
      if (matchesCount >= min && matchesCount <= max) {
        return type!;
      }
    }

    throw new Error("Range is empty");
  }

  static getFreeSpinsType(matchesCount: number): BonusGameType {
    for (const { type, range } of paytables.FSChest.ranges) {
      const [min, max] = range.split("-").map(Number);
      if (matchesCount >= min && matchesCount <= max) {
        return type!;
      }
    }

    throw new Error("Range is empty");
  }

  static getFreeSpinsCountByType(type: BonusGameType) {
    return 10;
  }

  static getMultiplierBySpinIndex(spinIndex: number) {
    switch (spinIndex) {
      case 0: {
        return 0.1;
      }
      case 1: {
        return 0.2;
      }
      case 2: {
        return 0.4;
      }
      case 3: {
        return 0.8;
      }
      case 4: {
        return 1.6;
      }
      default:
        return 3.2;
    }
  }
}
