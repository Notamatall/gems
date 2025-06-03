import { AnimatedSprite, Container, Dict } from "pixi.js";
export interface GameSymbolInitializer {
  type: TextureType;
  row: number;
  col: number;
  finalYPos: number;
  animSprite: AnimatedSprite;
}
let gameSymbolId = 1;
export class GameSymbol {
  constructor({
    type,
    animSprite,
    row,
    col,
    finalYPos,
  }: GameSymbolInitializer) {
    this._type = type;
    this._animSprite = animSprite;
    this._row = row;
    this._col = col;
    this._finalYPos = finalYPos;
    animSprite.animationSpeed = 1 / 3;
    animSprite.loop = false;
  }
  private id = gameSymbolId++;
  private _type: TextureType;
  private _animSprite: AnimatedSprite;
  private _row: number;
  private _col: number;

  private _finalYPos: number;
  private _velocity: number = 0;

  destroy() {
    this.animSprite.destroy();
  }
  // moveTo(row)
  // {
  //   this.
  // }
  set finalYPos(value: number) {
    this._finalYPos = value;
  }
  get finalYPos() {
    return this._finalYPos;
  }

  set velocity(value: number) {
    this._velocity = value;
  }

  get velocity() {
    return this._velocity;
  }

  get type() {
    return this._type;
  }

  get animSprite() {
    return this._animSprite;
  }

  set row(value: number) {
    this._row = value;
  }
  get row() {
    return this._row;
  }

  get col() {
    return this._col;
  }

  get isPositionReached() {
    return this._animSprite.y === this._finalYPos;
  }
}

export interface SlotReel {
  rc: Container;
  symLocated: boolean;
  symToRem: GameSymbol[];
  symToMov: GameSymbol[];
}

export type TextureType = "GemV" | "GemC" | "GemG" | "GemW" | "GemY" | "GemR";

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
