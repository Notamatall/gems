import { Application, Container, Graphics } from "pixi.js";
import {
  REEL_WIDTH,
  REEL_BORDER_SIZE_PX,
  REEL_HEIGHT,
  SMALL_SYMBOL_SIZE_PX,
  ANIMATION_DIFFERENCE,
  FALL_SYMBOL_GAP,
  SLOT_SYMBOLS_Y_POS,
  GAME_SYMBOL_LEAST_MATCHES,
} from "../constants";
import { SlotSymbol, TextureType } from "../types";
import { ResourcesController } from "./ResourcesController";
import { SlotReel } from "../types/SlotReel";
import { GameSymbol } from "../types/GameSymbol";
import { waitAsync } from "../utils";

type SlotState =
  | "idle"
  | "start_move"
  | "finish_move"
  | "start_destroy"
  | "finish_destroy"
  | "start_define_empty"
  | "finish_define_empty"
  | "start_move_empty"
  | "waiting";

export class GameController {
  constructor(app: Application, resCtrl: ResourcesController) {
    this._app = app;
    this._resCtrl = resCtrl;

    const exploadButton = document.getElementById("expload-button");
    if (!exploadButton) throw new Error("Expload button not found");
    exploadButton.onclick = () => {
      this.expload();
    };
    const playButton = document.getElementById("play-button");
    if (!playButton) throw new Error("Play button not found");
    this._playButton = playButton as HTMLButtonElement;
    this._playButton.onclick = () => {
      this.play();
    };
  }
  private _playButton: HTMLButtonElement;
  private _app: Application;
  private _resCtrl: ResourcesController;
  private state: SlotState = "idle";
  private _reels: SlotReel[] = [];
  private _isInitial = true;

  private _reelContainer: Container = new Container<Container>();

  // Generation actions
  async createDefaulReelsAndMask() {
    const reelBg = this._resCtrl.reelBg;
    for (let i = 0; i < REEL_WIDTH; i++) {
      const rc = new Container();
      rc.x = reelBg.x + 188 * i;
      rc.y = reelBg.y + REEL_BORDER_SIZE_PX;
      this._reelContainer.addChild(rc);
      const reel = new SlotReel({ rc });
      this._reels.push(reel);
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
    this._reelContainer.mask = mask;
    this._app.stage.addChild(this._reelContainer);
    this.genAllReelSym();
  }

  private genSignleReelSym(reelIndex: number): SlotSymbol[] {
    const reel = this._reels[reelIndex];
    const gameSymbols: SlotSymbol[] = [];
    for (let index = REEL_HEIGHT; index > 0; index--) {
      const gameSymbol = this._resCtrl.getRandomSlotSymbol();
      const sprite = gameSymbol.animSprite;
      sprite.x = SMALL_SYMBOL_SIZE_PX / 2 - ANIMATION_DIFFERENCE;
      sprite.y =
        (index + 1) * -SMALL_SYMBOL_SIZE_PX -
        ANIMATION_DIFFERENCE +
        index * -FALL_SYMBOL_GAP -
        reelIndex * FALL_SYMBOL_GAP;

      reel.rc.addChild(sprite);
      gameSymbols.push(gameSymbol);
    }
    return gameSymbols;
  }

  private genAllReelSym() {
    const reelLength = this._reels.length;

    for (let index = 0; index < this._reels.length; index++) {
      const reel = this._reels[index];
      const slotSymbols = this.genSignleReelSym(index);

      const activeSymbols = reel.symbols.filter(
        (symbol) => symbol.state === "Active",
      );
      activeSymbols.forEach((sym) => {
        sym.velocity = 0;
        sym.state = "Inactive";
      });

      const newSymbols = slotSymbols.map(
        (symbol, ind: number) =>
          new GameSymbol({
            type: symbol.type,
            animSprite: symbol.animSprite,
            row: reelLength - index,
            col: index,
            finalYPos: SLOT_SYMBOLS_Y_POS[ind],
            reel,
          }),
      );
      reel.addSymbols(newSymbols);
    }
  }

  // Click actions
  private async expload() {
    this.state = "start_destroy";
    console.log("start_destory");
    await waitAsync(200);
    const symbols = this._reels.map((reel) => reel.symbols).flat(1);

    const matches: Record<TextureType, GameSymbol[]> = {
      GemC: [],
      GemG: [],
      GemR: [],
      GemW: [],
      GemY: [],
      GemV: [],
    };

    for (const type of Object.values(TextureType)) {
      for (const symbol of symbols) {
        if (symbol.type === type) matches[type].push(symbol);
      }
    }
    let isAnyMatch = false;
    for (const listOfMatches of Object.values(matches)) {
      if (listOfMatches.length >= GAME_SYMBOL_LEAST_MATCHES) {
        isAnyMatch = true;
        listOfMatches.forEach((sym) => sym.play());
        await waitAsync(550);
      }
    }

    if (isAnyMatch) {
      await waitAsync(550);

      this.state = "finish_destroy";
    } else {
      this.state = "waiting";
    }
  }

  private play() {
    this.state = "start_move";
    this._isInitial = false;
    this._playButton.disabled = true;
    this.genAllReelSym();
  }

  //Loop actions
  private animateSlotSymbolsMovement() {
    for (let reelsI = 0; reelsI < this._reels.length; reelsI++) {
      const reel = this._reels[reelsI];
      const { actSym, inaSym } = reel;

      for (let isInd = 0; isInd < inaSym.length; isInd++) {
        const sym = inaSym[isInd];
        sym.removeWithPhysics();
      }

      for (let asInd = 0; asInd < actSym.length; asInd++) {
        const sym = actSym[asInd];
        sym.moveWithPhysics();
      }
    }

    const isOldRemoved = this._reels.every((reel) => reel.inaSym.length === 0);
    const isNewMoved = this._reels.every((reel) => reel.isAllPlaced);
    if (isOldRemoved && isNewMoved && this._isInitial === false) {
      this.state = "finish_move";
    }
  }

  private moveToEmptyPlaces() {
    // debugger;
    this.state = "start_define_empty";
    for (let reelIndex = 0; reelIndex < this._reels.length; reelIndex++) {
      const reel = this._reels[reelIndex];

      // Get all active symbols in this reel
      const activeSymbols = reel.actSym;

      if (activeSymbols.length === REEL_HEIGHT) continue;

      // Sort symbols by their current Y position (bottom to top)
      activeSymbols.sort((a, b) => b.animSprite.y - a.animSprite.y);

      // Create array to track which positions are filled
      const filledPositions = new Array(REEL_HEIGHT).fill(false);

      // Mark positions that already have symbols
      activeSymbols.forEach((symbol) => {
        // Find which slot position this symbol is closest to
        const closestSlot = SLOT_SYMBOLS_Y_POS.findIndex(
          (pos) =>
            Math.abs(symbol.animSprite.y - pos) < SMALL_SYMBOL_SIZE_PX / 2,
        );
        if (closestSlot !== -1) {
          filledPositions[closestSlot] = true;
        }
      });

      // Move existing symbols down to fill gaps
      let writeIndex = REEL_HEIGHT - 1; // Start from bottom

      for (let i = REEL_HEIGHT - 1; i >= 0; i--) {
        if (filledPositions[i]) {
          // Find the symbol at this position
          const symbol = activeSymbols.find(
            (sym) =>
              Math.abs(sym.animSprite.y - SLOT_SYMBOLS_Y_POS[i]) <
              SMALL_SYMBOL_SIZE_PX / 2,
          );

          if (symbol && writeIndex !== i) {
            // Update symbol's target position
            symbol.finalYPos = SLOT_SYMBOLS_Y_POS[writeIndex];
            symbol.row = REEL_HEIGHT - writeIndex;

            // Reset velocity to make it fall
            symbol.velocity = 0;
          }

          writeIndex--;
        }
      }

      // // Generate new symbols to fill remaining empty slots
      // const emptySlots = REEL_HEIGHT - activeSymbols.length;

      // if (emptySlots > 0) {
      //   const newSymbols: GameSymbol[] = [];

      //   for (let i = 0; i < emptySlots; i++) {
      //     const gameSymbol = this._resCtrl.getRandomSlotSymbol();
      //     const sprite = gameSymbol.animSprite;

      //     // Position new symbols above the visible area
      //     sprite.x = SMALL_SYMBOL_SIZE_PX / 2 - ANIMATION_DIFFERENCE;
      //     sprite.y =
      //       -SMALL_SYMBOL_SIZE_PX * (i + 1) -
      //       ANIMATION_DIFFERENCE -
      //       i * FALL_SYMBOL_GAP;

      //     reel.rc.addChild(sprite);

      //     // Create new GameSymbol with target position
      //     const targetSlot = i; // Fill from top
      //     const newGameSymbol = new GameSymbol({
      //       type: gameSymbol.type,
      //       animSprite: sprite,
      //       row: REEL_HEIGHT - targetSlot,
      //       col: reelIndex,
      //       finalYPos: SLOT_SYMBOLS_Y_POS[targetSlot],
      //       reel,
      //     });

      //     newSymbols.push(newGameSymbol);
      //   }

      //   // Add new symbols to reel
      //   reel.addSymbols(newSymbols);
      // }
    }
    this.state = "finish_define_empty";
  }

  loop() {
    this._app.ticker.add(async () => {
      if (this.state === "start_move" || this.state === "idle") {
        this.animateSlotSymbolsMovement();
      }
      if (this.state === "finish_move") {
        await this.expload();
      }
      if (this.state === "finish_destroy") {
        this.moveToEmptyPlaces();
      }
      if (this.state === "finish_define_empty") {
        this.animateSlotSymbolsMovement();
      }
      if (this.state === "waiting") {
        this._playButton.disabled = false;
      }
    });
  }
}
