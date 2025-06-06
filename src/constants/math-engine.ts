import { GSType } from "../types";
import { PayoutModel } from "../types/MathEngine";

export const gsProbabilities: Record<GSType, number> = {
  GemC: 20,
  GemG: 18,
  GemR: 15,
  GemW: 13,
  GemY: 11,
  GemV: 9,
  ChestS: 7,
  ChestG: 5,
  FSChest: 2,
};

/**
 * Selects the symbol by cumulative probability value (1–100)
 * @param value - A number from 1 to 100
 * @returns The selected symbol (key)
 */
export function getSymbolByCumulativeValue(value: number): GSType {
  let sum = 0;
  for (const [symbol, prob] of Object.entries(gsProbabilities)) {
    sum += prob;
    if (value <= sum) {
      return symbol as GSType;
    }
  }
  throw Error("Value out of the range");
}

export const paytables: Record<GSType, PayoutModel> = {
  GemC: {
    min: 9,
    ranges: [
      { payout: 0.5, range: "9-10" },
      { payout: 1.5, range: "11-12" },
      { payout: 4.0, range: "13-30" },
    ],
  },
  GemG: {
    min: 9,
    ranges: [
      { payout: 0.8, range: "9-10" },
      { payout: 1.8, range: "11-12" },
      { payout: 8, range: "13-30" },
    ],
  },
  GemR: {
    min: 9,
    ranges: [
      { payout: 1, range: "9-10" },
      { payout: 2, range: "11-12" },
      { payout: 10, range: "13-30" },
    ],
  },
  GemW: {
    min: 9,
    ranges: [
      { payout: 1.6, range: "9-10" },
      { payout: 2.4, range: "11-12" },
      { payout: 16, range: "13-30" },
    ],
  },
  GemY: {
    min: 9,
    ranges: [
      { payout: 2, range: "9-10" },
      { payout: 3, range: "11-12" },
      { payout: 20, range: "13-30" },
    ],
  },
  GemV: {
    min: 9,
    ranges: [
      { payout: 3, range: "9-10" },
      { payout: 4, range: "11-12" },
      { payout: 24, range: "13-30" },
    ],
  },
  ChestS: {
    min: 8,
    ranges: [
      { payout: 5, range: "8-9" },
      { payout: 20, range: "10-11" },
      { payout: 50, range: "12-30" },
    ],
  },
  ChestG: {
    min: 8,
    ranges: [
      { payout: 20, range: "8-9" },
      { payout: 50, range: "10-11" },
      { payout: 100, range: "12-30" },
    ],
  },
  FSChest: {
    min: 3,
    ranges: [],
  },
};
