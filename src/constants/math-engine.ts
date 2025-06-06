import { GSType } from "../types";
import { PayoutModel } from "../types/MathEngine";

export const gsProbabilities: Record<GSType, number> = {
  GemC: 0.2,
  GemG: 0.18,
  GemR: 0.15,
  GemW: 0.13,
  GemY: 0.11,
  GemV: 0.09,
  ChestS: 0.07,
  ChestG: 0.04,
  FSChest: 0.03,
};

export const paytables: Record<GSType, PayoutModel> = {
  GemC: {
    min: 8,
    ranges: [
      {
        payout: 0.5,
        range: "8-9",
      },
      {
        payout: 1.5,
        range: "10-11",
      },
      {
        payout: 4.0,
        range: "12-30",
      },
    ],
  },
  GemG: {
    min: 8,
    ranges: [
      {
        payout: 0.8,
        range: "8-9",
      },
      {
        payout: 1.8,
        range: "10-11",
      },
      {
        payout: 8,
        range: "12-30",
      },
    ],
  },
  GemR: {
    min: 8,
    ranges: [
      {
        payout: 1,
        range: "8-9",
      },
      {
        payout: 2,
        range: "10-11",
      },
      {
        payout: 10,
        range: "12-30",
      },
    ],
  },
  GemW: {
    min: 8,
    ranges: [
      {
        payout: 1.6,
        range: "8-9",
      },
      {
        payout: 2.4,
        range: "10-11",
      },
      {
        payout: 16,
        range: "12-30",
      },
    ],
  },
  GemY: {
    min: 8,
    ranges: [
      {
        payout: 2,
        range: "8-9",
      },
      {
        payout: 3,
        range: "10-11",
      },
      {
        payout: 20,
        range: "12-30",
      },
    ],
  },
  GemV: {
    min: 8,
    ranges: [
      {
        payout: 3,
        range: "8-9",
      },
      {
        payout: 4,
        range: "10-11",
      },
      {
        payout: 24,
        range: "12-30",
      },
    ],
  },
  ChestS: {
    min: 6,
    ranges: [
      {
        payout: 5,
        range: "6-7",
      },
      {
        payout: 20,
        range: "8-9",
      },
      {
        payout: 50,
        range: "12-30",
      },
    ],
  },
  ChestG: {
    min: 6,
    ranges: [
      {
        payout: 20,
        range: "6-7",
      },
      {
        payout: 50,
        range: "8-9",
      },
      {
        payout: 100,
        range: "10-30",
      },
    ],
  },
  FSChest: {
    min: 3,
    ranges: [],
  },
};
