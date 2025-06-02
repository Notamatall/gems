import { Assets } from "pixi.js";
import { AnimationsUrls } from "./constants";

export class AnimationContoller {
  static async loadGemsAnimationsInCache() {
    await Assets.load(Object.values(AnimationsUrls));
  }
}
