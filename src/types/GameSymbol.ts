import { AnimatedSprite } from "pixi.js";
import { TextureType } from ".";
import { SlotReel } from "./SlotReel";
import { REEL_VIEWPORT_MAX_Y } from "../constants";
export type GameSymbolState = "Active" | "Inactive";
export interface GameSymbolInitializer {
  type: TextureType;
  row: number;
  col: number;
  finalYPos: number;
  animSprite: AnimatedSprite;
  reel: SlotReel;
  onPlay: () => void;
  animationSpeed?: number;
}

let gameSymbolId = 1;
export class GameSymbol {
  constructor({
    type,
    animSprite,
    row,
    col,
    finalYPos,
    reel,
    onPlay,
    animationSpeed,
  }: GameSymbolInitializer) {
    this._type = type;
    this._row = row;
    this._col = col;
    this._finalYPos = finalYPos;
    this._onPlay = onPlay;
    this._animSprite = animSprite;
    animSprite.animationSpeed = animationSpeed ?? 1 / 1.5;
    animSprite.loop = false;

    animSprite.onComplete = () => {
      reel.rc.removeChild(animSprite);
      this._reel.symbols = this._reel.symbols.filter(
        (sym) => sym.ID !== this._id,
      );
    };

    this._reel = reel;

    this.destroy = () => {
      reel.rc.removeChild(animSprite);
      this._reel.symbols = this._reel.symbols.filter(
        (sym) => sym.ID !== this._id,
      );
    };
  }

  private _id = gameSymbolId++;
  private _state: GameSymbolState = "Active";
  private _type: TextureType;
  private _animSprite: AnimatedSprite;
  private _row: number;
  private _col: number;
  private _reel: SlotReel;

  private _finalYPos: number;
  private _velocity: number = 0;
  private _onPlay: () => void;
  destroy: () => void;
  play() {
    this._onPlay();
    this.animSprite.play();
  }

  removeWithPhysics() {
    const baseGravity = 45;
    const damping = 1.2 + this.row * 0.2;

    const gravity = baseGravity;

    this.velocity = 0;

    const { animSprite } = this;

    this.velocity += gravity;
    this.velocity *= damping;
    animSprite.y += this.velocity;

    if (animSprite.y >= REEL_VIEWPORT_MAX_Y) {
      this.destroy();
    }
  }

  moveWithPhysics() {
    const gravity = 2;
    const damping = 1;
    const { animSprite, finalYPos } = this;
    const distance = finalYPos - animSprite.y;

    if (Math.abs(distance) < 1 && Math.abs(this.velocity) < 1) {
      animSprite.y = finalYPos;
      return;
    }

    this.velocity += gravity;
    this.velocity *= damping;
    animSprite.y += this.velocity;

    if (animSprite.y > finalYPos && this.velocity > 0) {
      animSprite.y = finalYPos;
      return;
    }
  }

  get placed() {
    return this._animSprite.y === this.finalYPos;
  }

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

  get ID() {
    return this._id;
  }

  set state(value: GameSymbolState) {
    this._state = value;
  }

  get state() {
    return this._state;
  }
}
