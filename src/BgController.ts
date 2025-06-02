import {
  Application,
  Container,
  ContainerChild,
  Renderer,
  Sprite,
} from "pixi.js";
import { loadSprite } from "./utils";

export class BackgroundController {
  private _reelBg?: Sprite;
  private _bg?: Sprite;
  async init(
    mainContainer: Container<ContainerChild>,
    app: Application<Renderer>,
  ) {
    this._bg = await loadSprite("/assets/background.png");
    this._reelBg = await loadSprite("/assets/reel.png");

    const reelX = app.screen.width / 2 - this._reelBg.width / 2;
    this._reelBg.x = reelX;
    mainContainer.addChild(this._bg, this._reelBg);
  }

  get reelBg() {
    if (this._reelBg) return this._reelBg;
    else throw Error("not initialized");
  }
  get bg() {
    if (this._bg) return this._bg;
    else throw Error("not initialized");
  }
}
