import { gsWeights } from "../constants/math-engine";
import { GSType } from "../types";

/**
 * Selects the symbol by cumulative probability value (1–100)
 * @param value - A number from 1 to 100
 * @returns The selected symbol (key)
 */
export function getSymbolByCumulativeValue(value: number): GSType {
  let sum = 0;
  for (const [symbol, prob] of Object.entries(gsWeights)) {
    sum += prob;
    if (value <= sum) {
      return symbol as GSType;
    }
  }
  throw Error("Value out of the range");
}

export function round(value: number, to: number = 2) {
  const factor = Math.pow(10, to);
  return Math.round(value * factor) / factor;
}
