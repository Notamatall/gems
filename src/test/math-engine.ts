import { gsWeights, paytables } from "../constants/math-engine";
import MathEngine from "../engine/math-engine";
import { GSType } from "../types/game-symbol";

const n = 30;
const symbols = Object.values(GSType);

const resultsMap = new Map<GSType, number>();

for (const symbol of symbols) {
  const probability = gsWeights[symbol] / 100;
  const ranges = paytables[symbol].ranges;
  const rtpForRange = MathEngine.rtpForRanges(n, probability, ranges);
  resultsMap.set(symbol, rtpForRange * 100);
}

export function calcStats() {
  console.table(Array.from(resultsMap));
  console.log(
    Array.from(resultsMap.values()).reduce((curr, now) => curr + now),
  );
  console.log(
    "stats",
    Object.values(gsWeights).reduce((curr, now) => curr + now, 0),
  );
}
