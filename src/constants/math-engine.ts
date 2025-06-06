import { GSType } from "../types";
import { PayoutModel } from "../types/MathEngine";

export const gsWeights: Record<GSType, number> = {
  GemC: 100,
  GemG: 95,
  GemR: 90,
  GemW: 80,
  GemY: 78,
  GemV: 63,
  ChestS: 50,
  ChestG: 20,
  GemGold: 10,
};

export const cumWeight = Object.values(gsWeights).reduce(
  (cur, now) => cur + now,
  0,
);

export const paytables: Record<GSType, PayoutModel> = {
  GemC: {
    min: 8,
    ranges: [
      { payout: 0.5, range: "8-10" },
      { payout: 1.5, range: "11-12" },
      { payout: 4, range: "13-30" },
    ],
  },
  GemG: {
    min: 8,
    ranges: [
      { payout: 0.8, range: "8-10" },
      { payout: 1.8, range: "11-12" },
      { payout: 8, range: "13-30" },
    ],
  },
  GemR: {
    min: 8,
    ranges: [
      { payout: 1, range: "8-10" },
      { payout: 2, range: "11-12" },
      { payout: 10, range: "13-30" },
    ],
  },
  GemW: {
    min: 8,
    ranges: [
      { payout: 1.6, range: "8-10" },
      { payout: 2.4, range: "11-12" },
      { payout: 16, range: "13-30" },
    ],
  },
  GemY: {
    min: 8,
    ranges: [
      { payout: 2, range: "8-10" },
      { payout: 3, range: "11-12" },
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
  GemGold: {
    min: 8,
    ranges: [
      { payout: 20, range: "8-9" },
      { payout: 50, range: "10-11" },
      { payout: 100, range: "12-30" },
    ],
  },
  // FSChest: {
  //   min: 3,
  //   ranges: [],
  // },
};
