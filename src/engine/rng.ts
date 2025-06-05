import { MAXIMAL_RANDOM_LIMIT, SHA256_BUFFER_SIZE } from "../constants/rng";
import {
  BufferGeneratorArgs,
  ByteGeneratorResult,
  RandomGeneratorArgs,
  RandomGeneratorResult,
  RngError,
} from "../types/Rng";

abstract class Rng {
  private static validateRandomLimit(limit: number) {
    if (!Number.isInteger(limit)) {
      throw new RngError("Random function limit must be an integer");
    }
    if (limit <= 0) {
      throw new RngError("Random function limit must be positive");
    }
    if (limit > MAXIMAL_RANDOM_LIMIT) {
      throw new RngError(
        `Random function limit cannot exceed 32-bit range (not greater than 2**32 = ${MAXIMAL_RANDOM_LIMIT})`,
      );
    }
  }
  private static async generateHMAC(
    key: string,
    message: string,
  ): Promise<Uint8Array<ArrayBuffer>> {
    const enc = new TextEncoder();
    const keyData = enc.encode(key);
    const msgData = enc.encode(message);

    // Import key
    const cryptoKey = await crypto.subtle.importKey(
      "raw",
      keyData,
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"],
    );

    // Sign the message
    const signature = await crypto.subtle.sign("HMAC", cryptoKey, msgData);

    // Convert to hex
    return new Uint8Array(signature);
  }
  private static async getBuffer({
    serverSeed,
    clientSeed,
    nonce,
    currentRound,
  }: BufferGeneratorArgs): Promise<Uint8Array<ArrayBuffer>> {
    const buffer = await this.generateHMAC(
      serverSeed,
      `${clientSeed}:${nonce}:${currentRound}`,
    );
    return buffer;
  }

  private static async createByteGenerator({
    serverSeed,
    clientSeed,
    nonce,
    cursor = 0,
  }: RandomGeneratorArgs): Promise<ByteGeneratorResult> {
    let currentRound: number = Math.floor(cursor / SHA256_BUFFER_SIZE);
    let currentRoundCursor: number = cursor % SHA256_BUFFER_SIZE;
    let buffer: Uint8Array<ArrayBuffer> = await this.getBuffer({
      serverSeed,
      clientSeed,
      nonce,
      currentRound,
    });

    const generateNextByte = async () => {
      if (currentRoundCursor >= SHA256_BUFFER_SIZE) {
        currentRoundCursor = 0;
        currentRound++;
        buffer = await this.getBuffer({
          serverSeed,
          clientSeed,
          nonce,
          currentRound,
        });
      }

      const byte = Number(buffer[currentRoundCursor]);
      currentRoundCursor++;
      return byte;
    };

    function getCursor(): number {
      return currentRound * SHA256_BUFFER_SIZE + currentRoundCursor;
    }

    return { generateNextByte, getCursor };
  }

  /**
   * @param {number} cursor - Value which is used to start iteration at particular byte. Used for multistage games
   * when you need to reuse same serverSeed, clientSeed, nonce combination to get next random number.
   */
  public static async createRandomGenerator({
    serverSeed,
    clientSeed,
    nonce,
    cursor = 0,
  }: RandomGeneratorArgs): Promise<RandomGeneratorResult> {
    const { generateNextByte, getCursor } = await this.createByteGenerator({
      serverSeed,
      clientSeed,
      nonce,
      cursor,
    });

    /**
     ** If you expect to get 10000 at max you have to pass 10001 as limit value.
     * @param limit Border you expect to reach at max during generation.
     * @returns randon value in range 0 - (limit - 1)
     */
    const getRandom = async (limit: number = 2 ** 32) => {
      this.validateRandomLimit(limit);
      let randomSum = 0;

      for (let i = 0; i < 4; i++) {
        const byte = await generateNextByte();
        const divider = 256 ** (i + 1);
        randomSum += byte / divider;
      }

      return Math.floor(randomSum * limit);
    };

    return { getRandom, getCursor };
  }
}

export default Rng;
