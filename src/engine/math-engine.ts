import { paytables } from "../constants/math-engine";
import { GSType } from "../types/game-symbol";
import { PayoutRange } from "../types/MathEngine";

export default class MathEngine {
  /**
   * Returns the number of ways to choose k items out of n possibilities, regardless of order.
   * Also known as "n choose k" or the binomial coefficient.
   * Example: combinations(4, 2) === 6
   */
  static combinations(n: number, k: number) {
    if (k > n) return 0;
    let res = 1;
    for (let i = 1; i <= k; i++) {
      res *= (n - i + 1) / i;
    }
    return res;
  }

  /**
   * Returns the probability of getting exactly k successes in n independent trials, each with probability p.
   * In slots: The chance of getting exactly k matches of a symbol on a board of n positions.
   * Example: binomialProbability(9, 5, 0.4) // Probability of exactly 5 matches out of 9, with 40% chance per position.
   */
  static binomialProbability(n: number, k: number, p: number) {
    const comb = this.combinations(n, k);
    return comb * Math.pow(p, k) * Math.pow(1 - p, n - k);
  }

  /**
   * Returns the probability of getting k or more successes in n independent trials, each with probability p.
   * In slots: The chance of getting at least k matches of a symbol on a board of n positions.
   * Example: probabilityAtLeastK(9, 5, 0.4) // Probability of 5 or more matches out of 9.
   */
  static probabilityAtLeastK(n: number, k: number, p: number) {
    let sum = 0;
    for (let i = k; i <= n; i++) {
      sum += this.binomialProbability(n, i, p);
    }
    return sum;
  }

  /**
   * Calculates the RTP contribution for a symbol with binomial probabilities and range-based payouts.
   * @param {number} n - Number of board positions
   * @param {number} p - Probability of the symbol per position (0..1)
   * @param {Array} ranges - Array of {payout: Number, range: String (e.g. "8-9")}
   * @returns {number} - RTP contribution for this symbol
   */
  static rtpForRanges(n: number, p: number, ranges: PayoutRange[]) {
    function parseRange(str: string) {
      const [from, to] = str.split("-").map(Number);
      return { from, to };
    }

    let rtp = 0;

    for (const { payout, range } of ranges) {
      const { from, to } = parseRange(range);
      for (let k = from; k <= to && k <= n; k++) {
        const prob = this.binomialProbability(n, k, p);
        rtp += prob * payout;
      }
    }

    return rtp;
  }

  /**
   * Returns the payout multiplier for a given symbol type and matches count.
   * @param {GSType} type - Symbol type (e.g., 'GemC')
   * @param {number} matches - Number of matches on the board
   * @returns {number} - Multiplier, or 0 if not found
   */
  static getMultiplier(type: GSType, matches: number): number {
    const paytable = paytables[type];
    if (paytable.min > matches) return 0;

    for (const { payout, range } of paytable.ranges) {
      const [min, max] = range.split("-").map(Number);
      if (matches >= min && matches <= max) {
        return payout;
      }
    }
    return 0;
  }

  static isMatch(type: keyof typeof paytables, matches: number): boolean {
    const paytable = paytables[type];
    return paytable.min <= matches;
  }
}
