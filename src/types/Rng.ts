export interface BufferGeneratorArgs {
  serverSeed: string;
  clientSeed: string;
  nonce: number;
  currentRound: number;
}

export interface RandomGeneratorArgs {
  serverSeed: string;
  clientSeed: string;
  nonce: number;
  cursor?: number;
}

export interface ByteGeneratorResult {
  generateNextByte: () => Promise<number>;
  getCursor: () => number;
}

export interface RandomGeneratorResult {
  getRandom: (limit?: number) => Promise<number>;
  getCursor: () => number;
}
export class RngError extends Error {}
