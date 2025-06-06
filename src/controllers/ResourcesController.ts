import {
  AnimatedSprite,
  Application,
  Assets,
  Renderer,
  Sprite,
  Spritesheet,
} from "pixi.js";
import { loadSprite } from "../utils";
import { SlotSymbol, TypedAnimation, GSType, GSEffect } from "../types";
import {
  gs_des_anim,
  gs_eff_anim,
  SLOT_SYM_ANIMATION_NAME,
  SLOT_WEIGHTS_LIMIT,
} from "../constants";
import { getSymbolByCumulativeValue } from "../constants/math-engine";

export class ResourcesController {
  private _reelBg?: Sprite;
  private _bg?: Sprite;
  private _slotTextures: TypedAnimation<GSType>[] = [];
  private _effectTextures: TypedAnimation<GSEffect>[] = [];
  private static _instance: ResourcesController;

  static async create(app: Application) {
    if (this._instance) return this._instance;
    const resCtrl = new ResourcesController();
    await this.loadGemsAnimationsInCache();
    this._instance = resCtrl;
    await resCtrl.init(app);
    return this._instance;
  }

  async init(app: Application<Renderer>) {
    this._reelBg = await loadSprite("/assets/reel.png");
    this._slotTextures = Object.entries(gs_des_anim).map(([name, url]) => {
      const ss = Assets.cache.get<Spritesheet>(url);
      return {
        animations: ss.data.animations!,
        spritesheet: ss,
        type: name as GSType,
      };
    });

    this._effectTextures = Object.entries(gs_eff_anim).map(([name, url]) => {
      const ss = Assets.cache.get<Spritesheet>(url);
      return {
        animations: ss.data.animations!,
        spritesheet: ss,
        type: name as GSEffect,
      };
    });

    const reelX = app.screen.width / 2 - this._reelBg.width / 2;
    this._reelBg.x = reelX;
    app.stage.addChild(this._reelBg);
  }

  private getRandomSlotTexture() {
    const randomValue = Math.floor(Math.random() * SLOT_WEIGHTS_LIMIT) + 1;
    console.log(randomValue);

    const type = getSymbolByCumulativeValue(randomValue);
    return this.slotTextures.find((tex) => tex.type === type)!;
  }

  static async loadGemsAnimationsInCache() {
    await Assets.load(Object.values(gs_des_anim));
    await Assets.load(Object.values(gs_eff_anim));
  }

  getEffectAnimSprite(effect: GSEffect) {
    const efTexture = this._effectTextures.find((ef) => ef.type === effect);
    if (!efTexture) throw new Error("Effect texture not found");
    const animSprite = AnimatedSprite.fromFrames(
      efTexture.animations[SLOT_SYM_ANIMATION_NAME],
    );
    return animSprite;
  }

  getRandomSlotSymbol() {
    const slotTexture = this.getRandomSlotTexture();
    const animSprite = AnimatedSprite.fromFrames(
      slotTexture.animations[SLOT_SYM_ANIMATION_NAME],
    );
    return new SlotSymbol({ animSprite, type: slotTexture.type });
  }

  get reelBg() {
    if (this._reelBg) return this._reelBg;
    else throw Error("not initialized");
  }

  get slotTextures() {
    if (this._slotTextures) return this._slotTextures;
    else throw Error("not initialized");
  }

  get bg() {
    if (this._bg) return this._bg;
    else throw Error("not initialized");
  }
}
