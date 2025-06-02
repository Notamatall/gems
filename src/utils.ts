import { Assets, Sprite } from "pixi.js";

export async function loadSprite(url: string): Promise<Sprite> {
  const file = await Assets.load(url);
  return new Sprite(file);
}

export async function createAnimatedSprite(jsonUrl: string): Promise<Sprite> {
  const file = await Assets.load(jsonUrl);
  return new Sprite(file);
}
