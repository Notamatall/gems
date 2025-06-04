import { AnimatedSprite, Container, Dict } from "pixi.js";
import { GameSymbol } from "./GameSymbol";

export enum TextureType {
  gemv = "GemV",
  gemc = "GemC",
  gemg = "GemG",
  gemw = "GemW",
  gemy = "GemY",
  gemr = "GemR",
}

export interface SlotTexture {
  type: TextureType;
  animations: Dict<string[]>;
}

export interface SlotSymbolInitializer {
  type: TextureType;
  animSprite: AnimatedSprite;
}

export class SlotSymbol {
  constructor({ type, animSprite }: SlotSymbolInitializer) {
    this._type = type;
    this._animSprite = animSprite;
    animSprite.animationSpeed = 1 / 3;
    animSprite.loop = false;
  }
  private _type: TextureType;
  private _animSprite: AnimatedSprite;

  get type() {
    return this._type;
  }
  get animSprite() {
    return this._animSprite;
  }
}
