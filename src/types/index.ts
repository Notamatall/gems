import { AnimatedSprite, Dict } from "pixi.js";
import { GSType } from "./game-symbol";

export enum GSEffect {
  blight = "BlueLight",
  peffect = "PurpleEffect",
}

export type BonusGameType = "Multiplier" | "Remainer" | "Combo";
export const FreeSpinGameConfig: Record<number, BonusGameType> = {
  3: "Multiplier",
  4: "Remainer",
  5: "Combo",
};

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
