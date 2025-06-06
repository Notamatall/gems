import { gsProbabilities, paytables } from "../constants/math-engine";
import MathEngine from "../engine/math-engine";
import { GSType } from "../types";

const n = 30;
const symbols = Object.values(GSType);

const resultsMap = new Map<GSType, number>();

for (const symbol of symbols) {
  const probability = gsProbabilities[symbol];
  const ranges = paytables[symbol].ranges;
  const rtpForRange = MathEngine.rtpForRanges(n, probability, ranges);
  resultsMap.set(symbol, rtpForRange * 100);
}

console.table(Array.from(resultsMap));
console.log(Array.from(resultsMap.values()).reduce((curr, now) => curr + now));
