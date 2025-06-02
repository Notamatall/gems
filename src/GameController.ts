import {
  AnimatedSprite,
  Application,
  Assets,
  BlurFilter,
  Container,
  Sprite,
} from "pixi.js";
import {
  AnimationsUrls,
  REEL_WIDTH,
  REEL_BORDER_SIZE_PX,
  REEL_HEIGHT,
  SMALL_SYMBOL_SIZE_PX,
  ANIMATION_DIFFERENCE,
  AnimationsNames,
} from "./constants";
import { Reel, Tween } from "./types";

export class GameController {
  constructor() {
    const spinButton = document.getElementById("spin-button");
    if (!spinButton) throw new Error("Spin button not found");
    spinButton.onclick = () => {
      this.startPlay();
    };
    const gemV = Assets.cache.get(AnimationsUrls.GemV).data.animations;
    const gemC = Assets.cache.get(AnimationsUrls.GemC).data.animations;
    const gemG = Assets.cache.get(AnimationsUrls.GemG).data.animations;
    const animations: any[] = [gemV, gemC, gemG];
    this.slotTextures = animations;
  }
  slotTextures: any[] = [];
  reelContainer: Container = new Container<Container>();
  reelContainers: Reel[] = [];
  isSpinning: boolean = false;
  tweening: Tween[] = [];

  async createDefaulReels(mainContainer: any, reelBg: Sprite) {
    for (let i = 0; i < REEL_WIDTH; i++) {
      const reelContainer = new Container();
      reelContainer.x = reelBg.x + 188 * i;
      reelContainer.y = reelBg.y + REEL_BORDER_SIZE_PX;
      const reel: Reel = {
        container: reelContainer,
        symbols: [],
        position: 0,
        previousPosition: 0,
        blur: new BlurFilter(),
      };

      for (let j = 0; j < REEL_HEIGHT; j++) {
        const symbol = this.getRandomSymbol();
        symbol.animationSpeed = 1 / 3;
        symbol.loop = false;
        symbol.x = SMALL_SYMBOL_SIZE_PX / 2 - ANIMATION_DIFFERENCE;
        symbol.y = j * SMALL_SYMBOL_SIZE_PX - ANIMATION_DIFFERENCE;
        symbol.onComplete = () => {
          reelContainer.removeChild(symbol);
        };

        reel.symbols.push(symbol);
        this.reelContainers.push(reel);
        reelContainer.addChild(symbol);
        mainContainer.addChild(reelContainer);
      }
    }
  }

  private getRandomSymbol() {
    const gemV = Assets.cache.get(AnimationsUrls.GemV).data.animations;
    const gemC = Assets.cache.get(AnimationsUrls.GemC).data.animations;
    const gemG = Assets.cache.get(AnimationsUrls.GemG).data.animations;
    const animations: any[] = [gemV, gemC, gemG];

    const animation = animations[Math.floor(Math.random() * animations.length)];

    return AnimatedSprite.fromFrames(animation[AnimationsNames.Gem]);
  }

  startPlay() {
    console.log("here");
    if (this.isSpinning) return;
    this.isSpinning = true;

    for (let i = 0; i < this.reelContainers.length; i++) {
      const r = this.reelContainers[i];
      const extra = Math.floor(Math.random() * 3);
      const target = r.position + 10 + i * 5 + extra;
      const time = 500 + i * 100 + extra * 600;

      this.tweenTo(
        r,
        "position",
        target,
        time,
        this.backout(0.5),
        null,
        i === this.reelContainers.length - 1 ? this.reelsComplete : null,
      );
    }
  }

  tweenTo(object, property, target, time, easing, onchange, oncomplete) {
    const tween = {
      object,
      property,
      propertyBeginValue: object[property],
      target,
      easing,
      time,
      change: onchange,
      complete: oncomplete,
      start: Date.now(),
    };

    this.tweening.push(tween);
    return tween;
  }

  // Reels done handler.
  reelsComplete() {
    this.isSpinning = false;
  }
  // Basic lerp function.
  lerp(a1, a2, t) {
    return a1 * (1 - t) + a2 * t;
  }

  // Backout function from tweenjs.
  backout(amount) {
    return (t) => --t * t * ((amount + 1) * t + amount) + 1;
  }

  runLoop(app: Application) {
    // Animation loops
    app.ticker.add(() => {
      // Update the slots.
      for (let i = 0; i < this.reelContainers.length; i++) {
        const r = this.reelContainers[i];
        r.previousPosition = r.position;

        // Update symbol positions on reel.
        for (let j = 0; j < r.symbols.length; j++) {
          const s = r.symbols[j];

          // s.y =
          //   ((r.position + j) % r.symbols.length) * SMALL_SYMBOL_SIZE_PX -
          //   SMALL_SYMBOL_SIZE_PX;
        }
      }

      // Handle tweening
      const now = Date.now();
      const remove = [];

      for (let i = 0; i < this.tweening.length; i++) {
        const t = this.tweening[i];
        const phase = Math.min(1, (now - t.start) / t.time);

        t.object[t.property] = this.lerp(
          t.propertyBeginValue,
          t.target,
          t.easing(phase),
        );
        if (t.change) t.change(t);
        if (phase === 1) {
          t.object[t.property] = t.target;
          if (t.complete) t.complete(t);
          remove.push(t);
        }
      }
      for (let i = 0; i < remove.length; i++) {
        this.tweening.splice(this.tweening.indexOf(remove[i]), 1);
      }
    });
  }
}
