import {
  AnimatedSprite,
  Application,
  Assets,
  BlurFilter,
  Container,
  ContainerChild,
  Graphics,
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
  FALL_SYMBOL_GAP,
  REEL_VIEWPORT_MAX_Y,
} from "./constants";
interface SlotSymbol {
  symbol: AnimatedSprite;
  finalYPos: number;
  velocity: number;
  isAnimated: boolean;
}

export class GameController {
  constructor(app: Application, reelBg: Sprite) {
    this._app = app;
    this._reelBg = reelBg;
    const spinButton = document.getElementById("spin-button");
    if (!spinButton) throw new Error("Spin button not found");
    spinButton.onclick = () => {
      this.spin();
    };
    const exploadButton = document.getElementById("expload-button");
    if (!exploadButton) throw new Error("Expload button not found");
    exploadButton.onclick = () => {
      this.expload();
    };
    const playButton = document.getElementById("play-button");
    if (!playButton) throw new Error("Play button not found");
    playButton.onclick = () => {
      this.play();
    };
    const gemV = Assets.cache.get(AnimationsUrls.GemV).data.animations;
    const gemC = Assets.cache.get(AnimationsUrls.GemC).data.animations;
    const gemG = Assets.cache.get(AnimationsUrls.GemG).data.animations;
    const animations: any[] = [gemV, gemC, gemG];
    this.slotTextures = animations;
  }
  private _app: Application;
  private _reelBg: Sprite;
  slotTextures: any[] = [];
  slotSymbols: SlotSymbol[] = [];
  reelContainer: Container = new Container<Container>();
  isSpinning: boolean = false;

  private slotSymbolsRemove: SlotSymbol[] = [];
  private slotSymbolsToAnimate: SlotSymbol[] = [];
  async createDefaulReels() {
    for (let i = 0; i < REEL_WIDTH; i++) {
      const reelContainer = new Container();
      reelContainer.x = this._reelBg.x + 188 * i;
      reelContainer.y = this._reelBg.y + REEL_BORDER_SIZE_PX;
      this.reelContainer.addChild(reelContainer);
    }

    // Create mask with correct positioning
    const mask = new Graphics()
      .rect(
        this._reelBg.x, // Start from reel background position
        this._reelBg.y + REEL_BORDER_SIZE_PX, // Account for border
        this._reelBg.width, // Use actual reel background width
        this._reelBg.height - REEL_BORDER_SIZE_PX * 2, // Subtract top and bottom borders
      )
      .fill(0xffffff); // Color doesn't matter for masks

    // Add mask to stage (important!)
    this._app.stage.addChild(mask);

    // Apply mask to reel container
    this.reelContainer.mask = mask;

    // Add the masked container to stage
    this._app.stage.addChild(this.reelContainer);
  }

  populateReelsWithSymbols() {
    for (let index = 0; index < this.reelContainer.children.length; index++) {
      const reelContainer = this.reelContainer.children[index];
      for (let j = 0; j < REEL_HEIGHT; j++) {
        const symbol = this.getRandomSymbol();
        symbol.animationSpeed = 1 / 3;
        symbol.loop = false;
        symbol.x = SMALL_SYMBOL_SIZE_PX / 2 - ANIMATION_DIFFERENCE;
        symbol.y = j * SMALL_SYMBOL_SIZE_PX - ANIMATION_DIFFERENCE;
        symbol.onComplete = () => {
          reelContainer.removeChild(symbol);
          console.log(reelContainer.children.length);
        };
        reelContainer.addChild(symbol);
      }
    }
  }

  private expload() {
    const symbols = this.reelContainer.children[0].children;
    for (let index = 0; index < 5; index++) {
      const symbol = symbols[index];
      (symbol as AnimatedSprite).play();
    }
    console.log(symbols);
  }

  private spin() {
    this.isSpinning = true;
    // this.slotSymbols.push();
    const reelContainer = this.reelContainer.children[0];
    for (let index = 0; index < 5; index++) {
      const symbol = this.getRandomSymbol();
      symbol.animationSpeed = 1 / 3;
      symbol.loop = false;
      symbol.x = SMALL_SYMBOL_SIZE_PX / 2 - ANIMATION_DIFFERENCE;
      symbol.y =
        (index + 1) * -SMALL_SYMBOL_SIZE_PX -
        ANIMATION_DIFFERENCE +
        index * -FALL_SYMBOL_GAP;
      console.log((index + 1) * -SMALL_SYMBOL_SIZE_PX - ANIMATION_DIFFERENCE);
      symbol.onComplete = () => {
        reelContainer.removeChild(symbol);
      };
      reelContainer.addChild(symbol);
    }
  }

  private generateNewSymbolsForReel(reelIndex: number) {
    const reelContainer = this.reelContainer.children[reelIndex];
    const symbols = [];
    for (let index = 0; index < 5; index++) {
      const symbol = this.getRandomSymbol();
      symbol.animationSpeed = 1 / 3;
      symbol.loop = false;
      symbol.x = SMALL_SYMBOL_SIZE_PX / 2 - ANIMATION_DIFFERENCE;
      symbol.y =
        (index + 1) * -SMALL_SYMBOL_SIZE_PX -
        ANIMATION_DIFFERENCE +
        index * -FALL_SYMBOL_GAP;
      symbol.onComplete = () => {
        reelContainer.removeChild(symbol);
      };
      symbols.push(symbol);
      reelContainer.addChild(symbol);
    }
    return symbols;
  }

  private play() {
    const symbols = this.generateNewSymbolsForReel(0);

    if (this.slotSymbolsToAnimate.length) {
      const symbolsToRemove = this.slotSymbolsToAnimate.filter(
        (symbol) => symbol.isAnimated,
      );
      this.slotSymbolsRemove = symbolsToRemove;
      this.slotSymbolsToAnimate = [];
    }

    const final_positions = [736, 548, 360, 172, -16];
    this.slotSymbolsToAnimate.push(
      ...symbols.map((symbol: any, index: number) => ({
        symbol,
        finalYPos: final_positions[index],
        velocity: 0,
        isAnimated: false,
      })),
    );
  }

  private getRandomSymbol() {
    const animation =
      this.slotTextures[Math.floor(Math.random() * this.slotTextures.length)];

    return AnimatedSprite.fromFrames(animation[AnimationsNames.Gem]);
  }

  runLoop2() {
    this._app.ticker.add(() => {
      for (let i = 0; i < this.slotSymbolsRemove.length; i++) {
        const elem = this.slotSymbolsRemove[i];
        this.removeWithPhysics(elem, () => {
          this.slotSymbolsRemove.splice(i, 1);
          i--;
          elem.symbol.destroy();
        });
      }

      if (this.slotSymbolsRemove.length === 0) {
        for (let i = 0; i < this.slotSymbolsToAnimate.length; i++) {
          const elem = this.slotSymbolsToAnimate[i];
          this.moveWithPhysics(elem);
        }
      }
    });
  }

  private moveWithPhysics(elem: SlotSymbol) {
    const gravity = 1.9;
    const damping = 1;
    // Init velocity
    if (elem.velocity === undefined) elem.velocity = 0;

    const { symbol, finalYPos } = elem;

    // Apply physics
    const distance = finalYPos - symbol.y;

    if (Math.abs(distance) < 1 && Math.abs(elem.velocity) < 1) {
      // Snap to position
      symbol.y = finalYPos;
      elem.isAnimated = true;
      return;
    }

    elem.velocity += gravity;
    elem.velocity *= damping;
    symbol.y += elem.velocity;

    // Clamp if we overshoot
    if (symbol.y > finalYPos && elem.velocity > 0) {
      symbol.y = finalYPos;
      elem.isAnimated = true;
    }
  }

  private removeWithPhysics(elem: SlotSymbol, onRemoveAction: () => void) {
    const gravity = 2.3;
    const damping = 0.9;
    // Init velocity
    if (elem.velocity === undefined) elem.velocity = 0;

    const { symbol } = elem;

    elem.velocity += gravity;
    elem.velocity *= damping;
    symbol.y += elem.velocity;

    // Clamp if we overshoot
    if (symbol.y >= REEL_VIEWPORT_MAX_Y) {
      onRemoveAction();
    }
  }
}
