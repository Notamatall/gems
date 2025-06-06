import { AnimatedSprite, Dict } from "pixi.js";

export enum GSType {
  gemgold = "GemGold",
  gemc = "GemC",
  gemg = "GemG",
  gemr = "GemR",
  gemw = "GemW",
  gemy = "GemY",
  gemv = "GemV",
  chests = "ChestS",
  chestg = "ChestG",
  // fschest = "FSChest",
}

export enum GSEffect {
  blight = "BlueLight",
}

export interface TypedAnimation<T> {
  type: T;
  animations: Dict<string[]>;
}

export interface SlotSymbolInitializer {
  type: GSType;
  animSprite: AnimatedSprite;
}

export class SlotSymbol {
  constructor({ type, animSprite }: SlotSymbolInitializer) {
    this._type = type;
    this._animSprite = animSprite;
    animSprite.animationSpeed = 1 / 3;
    animSprite.loop = false;
  }
  private _type: GSType;
  private _animSprite: AnimatedSprite;

  get type() {
    return this._type;
  }
  get animSprite() {
    return this._animSprite;
  }
}
