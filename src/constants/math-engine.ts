import { GSType } from "../types";
import { PayoutModel } from "../types/MathEngine";

export const gsWeights: Record<GSType, number> = {
  GemC: 100,
  GemG: 62,
  GemR: 50,
  GemW: 31,
  GemY: 25,
  GemV: 16,
  ChestS: 12,
  ChestG: 10,
  // FSChest: 2,
};

export const cumWeight = Object.values(gsWeights).reduce(
  (cur, now) => cur + now,
  0,
);

export const paytables: Record<GSType, PayoutModel> = {
  GemC: {
    min: 8,
    ranges: [
      { payout: 0.1, range: "8-10" },
      { payout: 0.2, range: "11-12" },
      { payout: 0.7, range: "13-30" },
    ],
  },
  GemG: {
    min: 8,
    ranges: [
      { payout: 0.2, range: "8-10" },
      { payout: 0.4, range: "11-12" },
      { payout: 0.9, range: "13-30" },
    ],
  },
  GemR: {
    min: 8,
    ranges: [
      { payout: 0.4, range: "8-10" },
      { payout: 0.7, range: "11-12" },
      { payout: 5, range: "13-30" },
    ],
  },
  GemW: {
    min: 8,
    ranges: [
      { payout: 0.5, range: "8-10" },
      { payout: 1.2, range: "11-12" },
      { payout: 10, range: "13-30" },
    ],
  },
  GemY: {
    min: 8,
    ranges: [
      { payout: 0.9, range: "8-10" },
      { payout: 1.8, range: "11-12" },
      { payout: 20, range: "13-30" },
    ],
  },
  GemV: {
    min: 8,
    ranges: [
      { payout: 3, range: "8-10" },
      { payout: 4, range: "11-12" },
      { payout: 24, range: "13-30" },
    ],
  },
  ChestS: {
    min: 8,
    ranges: [
      { payout: 4, range: "8-9" },
      { payout: 10, range: "10-11" },
      { payout: 30, range: "12-30" },
    ],
  },
  ChestG: {
    min: 8,
    ranges: [
      { payout: 5, range: "8-9" },
      { payout: 20, range: "10-11" },
      { payout: 50, range: "12-30" },
    ],
  },
  // FSChest: {
  //   min: 3,
  //   ranges: [],
  // },
};
