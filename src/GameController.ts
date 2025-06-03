import {
  AnimatedSprite,
  Application,
  Assets,
  Container,
  Graphics,
  Sprite,
  Spritesheet,
} from "pixi.js";
import {
  REEL_WIDTH,
  REEL_BORDER_SIZE_PX,
  REEL_HEIGHT,
  SMALL_SYMBOL_SIZE_PX,
  ANIMATION_DIFFERENCE,
  AnimationsNames,
  FALL_SYMBOL_GAP,
  REEL_VIEWPORT_MAX_Y,
  SLOT_SYMBOLS_Y_POS,
} from "./constants";
import { SlotSymbol, SlotReel, GameSymbol } from "./types";
import { MatchingEngine } from "./MatchingEngine";
import { ResourcesController } from "./ResourcesController";

type SlotState = "Idle" | "Spinning" | "Animating" | "Handling";
export class GameController {
  constructor(app: Application, resCtrl: ResourcesController) {
    this._app = app;
    this._resCtrl = resCtrl;
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
  }
  private _app: Application;
  private _resCtrl: ResourcesController;
  private slotState: SlotState = "Idle";

  reelContainer: Container = new Container<Container>();
  isSpinning: boolean = false;
  private reels: SlotReel[] = [];
  private isInitial = true;

  async createDefaulReelsAndMask() {
    const reelBg = this._resCtrl.reelBg;
    for (let i = 0; i < REEL_WIDTH; i++) {
      const reelContainer = new Container();
      reelContainer.x = reelBg.x + 188 * i;
      reelContainer.y = reelBg.y + REEL_BORDER_SIZE_PX;
      this.reelContainer.addChild(reelContainer);
      this.reels.push({
        rc: reelContainer,
        symToMov: [],
        symToRem: [],
        symLocated: false,
      });
    }

    const mask = new Graphics()
      .rect(
        reelBg.x,
        reelBg.y + REEL_BORDER_SIZE_PX,
        reelBg.width,
        reelBg.height - REEL_BORDER_SIZE_PX * 2,
      )
      .fill(0xffffff);

    this._app.stage.addChild(mask);
    this.reelContainer.mask = mask;
    this._app.stage.addChild(this.reelContainer);
    this.generateGameSymbols();
  }

  private expload() {
    const symbols = this.reelContainer.children[0].children;
    for (let index = 0; index < 5; index++) {
      const symbol = symbols[index];
      (symbol as AnimatedSprite).play();
    }
    console.log(symbols);
  }

  private spin() {}

  private generateNewSymbolsForReel(reelIndex: number): SlotSymbol[] {
    const reel = this.reels[reelIndex];
    const gameSymbols: SlotSymbol[] = [];
    for (let index = REEL_HEIGHT; index >= 0; index--) {
      const gameSymbol = this._resCtrl.getRandomSlotSymbol();
      const sprite = gameSymbol.animSprite;
      sprite.x = SMALL_SYMBOL_SIZE_PX / 2 - ANIMATION_DIFFERENCE;
      sprite.y =
        (index + 1) * -SMALL_SYMBOL_SIZE_PX -
        ANIMATION_DIFFERENCE +
        index * -FALL_SYMBOL_GAP -
        reelIndex * FALL_SYMBOL_GAP;
      sprite.onComplete = () => {
        reel.rc.removeChild(sprite);
      };
      reel.rc.addChild(sprite);
      gameSymbols.push(gameSymbol);
    }
    return gameSymbols;
  }
  private generateGameSymbols() {
    const reelLength = this.reels.length;

    for (let index = 0; index < reelLength; index++) {
      const reel = this.reels[index];
      reel.symLocated = false;
      const slotSymbols = this.generateNewSymbolsForReel(index);

      if (reel.symToMov.length) {
        reel.symToRem = reel.symToMov;
        reel.symToRem.forEach((sym) => (sym.velocity = 0));
        reel.symToMov = [];
      }

      reel.symToMov = slotSymbols.map(
        (symbol, ind: number) =>
          new GameSymbol({
            type: symbol.type,
            animSprite: symbol.animSprite,
            row: reelLength - index,
            col: index,
            finalYPos: SLOT_SYMBOLS_Y_POS[ind],
          }),
      );
    }
  }

  private play() {
    this.slotState = "Spinning";
    this.isInitial = false;
    this.generateGameSymbols();
  }

  private animateSlotSymbolsMovement() {
    for (let reelsI = 0; reelsI < this.reels.length; reelsI++) {
      const reel = this.reels[reelsI];
      const { symToRem, symToMov } = reel;
      for (let symToRemI = 0; symToRemI < symToRem.length; symToRemI++) {
        const gameSym = symToRem[symToRemI];
        this.removeWithPhysics(gameSym, () => {
          symToRem.splice(symToRemI, 1);
          gameSym.destroy();
          --symToRemI;
        });
      }

      if (symToRem.length === 0) {
        const locatedInfo: boolean[] = [];
        symToMov.forEach((sym) => {
          const isLocated = this.moveWithPhysics(sym);
          locatedInfo.push(isLocated);
        });
        reel.symLocated = !locatedInfo.some((loc) => loc === false);
      }
    }
  }

  private calculateMultiplier() {}
  private checkAllSymbolsLocated() {
    const isAllLocated = !this.reels.some((reel) => reel.symLocated === false);

    if (
      isAllLocated &&
      this.slotState != "Handling" &&
      this.isInitial === false
    ) {
      this.slotState = "Handling";
      const val = this.reels.map((r) => r.symToMov);
      //MatchingEngine.getVerticalWins(val);
      let matchSymbols: GameSymbol[] = [];
      for (let index = 0; index < 5; index++) {
        matchSymbols = MatchingEngine.checkHorizontal(val, index);
      }
      for (let index = 0; index < matchSymbols.length; index++) {
        const matchSymbol = matchSymbols[index];

        // if (matchSymbol.row > 0) {
        //   for (let index = 0; index < matchSymbol.row; index++) {
        //     const symToMove = this.reels[matchSymbol.col].symToMov[index];
        //     symToMove.row = matchSymbol.row;
        //     symToMove.finalYPos=matchSymbol.finalYPos;
        //   }
        // }
      }
    }
  }

  runLoop2() {
    this._app.ticker.add(() => {
      this.animateSlotSymbolsMovement();
      this.checkAllSymbolsLocated();
    });
  }

  private moveWithPhysics(elem: GameSymbol) {
    const gravity = 5;
    const damping = 1;
    const { animSprite, finalYPos } = elem;
    const distance = finalYPos - animSprite.y;

    if (Math.abs(distance) < 1 && Math.abs(elem.velocity) < 1) {
      animSprite.y = finalYPos;
      return true;
    }

    elem.velocity += gravity;
    elem.velocity *= damping;
    animSprite.y += elem.velocity;

    if (animSprite.y > finalYPos && elem.velocity > 0) {
      animSprite.y = finalYPos;
      return true;
    }
    return false;
  }

  private removeWithPhysics(gameSym: GameSymbol, onRemoveAction: () => void) {
    const baseGravity = 30;
    const damping = 1.2 + gameSym.row * 0.2;

    const gravity = baseGravity;

    gameSym.velocity = 0;

    const { animSprite } = gameSym;

    gameSym.velocity += gravity;
    gameSym.velocity *= damping;
    animSprite.y += gameSym.velocity;

    if (animSprite.y >= REEL_VIEWPORT_MAX_Y) {
      onRemoveAction();
    }
  }
}
