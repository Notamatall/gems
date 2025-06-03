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
} from "./constants";
interface SlotSymbol {
  finalPosition: { x: number; y: number };
  startPosition: { x: number; y: number };
  symbol: AnimatedSprite;
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
  symbols: AnimatedSprite[] = [];
  slotSymbols: SlotSymbol[] = [];
  reelContainer: Container = new Container<Container>();
  isSpinning: boolean = false;

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
        };
        this.symbols.push(symbol);
        reelContainer.addChild(symbol);
      }
    }
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
      symbol.y = (index + 1) * -SMALL_SYMBOL_SIZE_PX - ANIMATION_DIFFERENCE;
      console.log((index + 1) * -SMALL_SYMBOL_SIZE_PX - ANIMATION_DIFFERENCE);
      symbol.onComplete = () => {
        reelContainer.removeChild(symbol);
      };
      this.symbols.push(symbol);
      reelContainer.addChild(symbol);
    }
  }

  private slotSymbolsToAnimate: {
    symbol: AnimatedSprite;
    isFinished: boolean;
    order: number;
  }[] = [];
  private play() {
    const symbols = this.reelContainer.children[0].children;

    console.log(symbols);

    this.slotSymbolsToAnimate.push(
      ...symbols.map((symbol: any, order: number) => ({
        symbol,
        isFinished: false,
        order,
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
      if (this.slotSymbolsToAnimate.length > 0) {
        for (let index = 0; index < this.slotSymbolsToAnimate.length; index++) {
          const elem = this.slotSymbolsToAnimate[index];
          console.log(elem.symbol.y);
          if (elem.symbol.y >= 188 * 4 - (index * 188 + 16)) {
            continue;
            this.slotSymbolsToAnimate.splice(index, 1);
          } else {
            elem.symbol.y += 1;
          }
        }
      }
      // const element = this.reelContainer.children[0];
      // const y = this.reelContainer.children[0].height;
      // element.children.forEach((symbol) => {
      //   symbol.y += 1;
      //   if (symbol.y >= 220 * 5) symbol.y = -220;
      // });
    });
  }
}
