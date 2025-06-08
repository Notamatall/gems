import { BonusGameType } from ".";

export type PayoutRange = {
  range: string;
  payout: number;
  type?: BonusGameType;
};

export type PayoutModel = {
  ranges: PayoutRange[];
  min: number;
  special: boolean;
};
