export type PayoutRange = {
  range: string;
  payout: number;
};

export type PayoutModel = {
  ranges: PayoutRange[];
  min: number;
};
