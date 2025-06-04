import { Assets, Sprite } from "pixi.js";

export function waitAsync(ms: number) {
  return new Promise((res) => setTimeout(() => res(true), ms));
}

export async function loadSprite(url: string): Promise<Sprite> {
  const file = await Assets.load(url);
  return new Sprite(file);
}

export async function createAnimatedSprite(jsonUrl: string): Promise<Sprite> {
  const file = await Assets.load(jsonUrl);
  return new Sprite(file);
}
