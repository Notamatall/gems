import {
  AnimatedSprite,
  Application,
  Assets,
  Renderer,
  Sprite,
  Spritesheet,
} from "pixi.js";
import { loadSprite } from "../utils";
import { SlotSymbol, SlotTexture, TextureType } from "../types";
import { AnimationsNames, AnimationsUrls } from "../constants";

export class ResourcesController {
  private _reelBg?: Sprite;
  private _bg?: Sprite;
  private _slotTextures: SlotTexture[] = [];
  async init(app: Application<Renderer>) {
    this._reelBg = await loadSprite("/assets/reel.png");
    this._slotTextures = Object.entries(AnimationsUrls).map(([name, url]) => {
      const ss = Assets.cache.get<Spritesheet>(url);
      return {
        animations: ss.data.animations!,
        spritesheet: ss,
        type: name as TextureType,
      };
    });
    const reelX = app.screen.width / 2 - this._reelBg.width / 2;
    this._reelBg.x = reelX;
    app.stage.addChild(this._reelBg);
  }

  private getRandomSlotTexture() {
    return this.slotTextures[
      Math.floor(Math.random() * this.slotTextures.length)
    ];
  }

  static async loadGemsAnimationsInCache() {
    await Assets.load(Object.values(AnimationsUrls));
  }
  getRandomSlotSymbol() {
    const slotTexture = this.getRandomSlotTexture();
    const animSprite = AnimatedSprite.fromFrames(
      slotTexture.animations[AnimationsNames.Gem],
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
