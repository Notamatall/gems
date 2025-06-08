import { Application, Container, Graphics, Sprite } from "pixi.js";
import {
  BOARD_WIDTH,
  REEL_BORDER_SIZE_PX,
  BOARD_HEIGHT,
  SMALL_SYMBOL_SIZE_PX,
  ANIMATION_DIFFERENCE,
  FALL_SYMBOL_GAP,
  SLOT_SYMBOLS_Y_POS,
} from "../constants";
import { FreeSpinGameConfig, BonusGameType, SlotSymbol } from "../types";
import { ResourcesController } from "./ResourcesController";
import { SlotReel } from "../types/SlotReel";
import { GameSymbol } from "../types/GameSymbol";
import { AudioController, AudioKey } from "./AudioController";
import { BalanceController } from "./BalanceController";
import { waitAsync } from "../utils";
import MathEngine from "../engine/math-engine";
import { GSDestAudioKey, GSType } from "../types/game-symbol";
import { HTMLController } from "./HtmlController";
import BonusEngine from "../engine/BonusEngine";
import { getElementByIdOrThrow } from "../utils/document";

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
  constructor(
    app: Application,
    resCtrl: ResourcesController,
    audioCtrl: AudioController,
    balController: BalanceController,
    htmlController: HTMLController,
  ) {
    this._app = app;
    this._resCtrl = resCtrl;
    this._ac = audioCtrl;
    this._balCtrl = balController;
    this._htmlCtrl = htmlController;

    const playButton = getElementByIdOrThrow("PlayButton");
    this._playButton = playButton as HTMLButtonElement;
    this._playButton.onclick = () => {
      this.play();
      this._balCtrl.decBal();
      this._balCtrl.hideWinAmountItem();
      this._balCtrl.hideTotalWinItem();
      this._ac.play(AudioKey.bet, { volume: 0.2 });
    };
    this._htmlCtrl.initBonusBuyButton(async () => {
      this.freeSpinGameState = {
        matchesCount: 3,
        type: "Multiplier",
        symbols: [],
        spinnedCount: BonusEngine.getFreeSpinsCountByType("Multiplier"),
        currentMultiplier: 0,
        currentSpin: 0,
        started: false,
      };
      await this.playFreeSpin();
    });
  }

  private freeSpinGameState?: {
    type: BonusGameType;
    matchesCount: number;
    symbols: GameSymbol[];
    spinnedCount: number;
    currentMultiplier: number;
    currentSpin: number;
    started: boolean;
  } = undefined;

  private _playButton: HTMLButtonElement;
  private _app: Application;
  private _resCtrl: ResourcesController;
  private _balCtrl: BalanceController;
  private _ac: AudioController;
  private _htmlCtrl: HTMLController;
  private state: SlotState = "idle";
  private _reels: SlotReel[] = [];
  private _isInitial = true;

  private _reelContainer: Container = new Container<Container>();

  // Generation actions
  async createDefaulReelsAndMask() {
    const reelBg = this._resCtrl.reelBg;
    for (let i = 0; i < BOARD_WIDTH; i++) {
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

  private genSingleReelSym(reelIndex: number): SlotSymbol[] {
    const reel = this._reels[reelIndex];
    const gameSymbols: SlotSymbol[] = [];
    for (let index = BOARD_HEIGHT; index > 0; index--) {
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

    for (let index = 0; index < reelLength; index++) {
      const reel = this._reels[index];
      const slotSymbols = this.genSingleReelSym(index);

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
            row: BOARD_HEIGHT - index,
            col: index,
            finalYPos: SLOT_SYMBOLS_Y_POS[ind],
            reel,
            animationSpeed: 1,

            onPlay: () =>
              this._ac.play(GSDestAudioKey[symbol.type], {
                volume: 0.2,
              }),
          }),
      );
      reel.addSymbols(newSymbols);
    }
  }

  // Click actions
  private async expload() {
    this.state = "start_destroy";

    await waitAsync(400);
    const symbols = this._reels.map((reel) => reel.symbols).flat(1);

    const matches = Object.fromEntries<GameSymbol[]>(
      Object.values(GSType).map((symbol) => [symbol, []]),
    );

    for (const type of Object.values(GSType)) {
      for (const symbol of symbols) {
        if (symbol.type === type) matches[type].push(symbol);
      }
    }
    let isAnyMatch = false;
    for (const [type, matchedSymbols] of Object.entries(matches)) {
      const gsType = type as GSType;
      const matchesCount = matchedSymbols.length;
      const isFreeSpinGame = BonusEngine.isFreeSpinGame(gsType, matchesCount);

      if (isFreeSpinGame && !this.freeSpinGameState?.started) {
        const fsType = BonusEngine.getFreeSpinTypeByMatches(matchesCount);
        this.freeSpinGameState = {
          matchesCount: matchesCount,
          type: fsType,
          symbols: matchedSymbols,
          spinnedCount: BonusEngine.getFreeSpinsCountByType(fsType),
          currentMultiplier: 0,
          currentSpin: 0,
          started: false,
        };
        continue;
      }

      const multiplier = MathEngine.getMultiplier(gsType, matchesCount);

      if (multiplier > 0) {
        isAnyMatch = true;
        await Promise.all(matchedSymbols.map((val) => val.play()));
        this._balCtrl.winBet(multiplier);
      }
    }

    if (isAnyMatch) {
      this.state = "finish_destroy";
    } else {
      if (this.freeSpinGameState) {
        if (!this.freeSpinGameState.started) {
          await this.playFreeSpin();
          return;
        } else {
          const { currentSpin } = this.freeSpinGameState;
          if (this.freeSpinGameState.spinnedCount > 0) {
            this.freeSpinGameState.spinnedCount -= 1;
            this.freeSpinGameState.currentSpin += 1;
            this._htmlCtrl.updateSpinsCount(
              this.freeSpinGameState.spinnedCount,
            );
            this._htmlCtrl.updateMultiplierValue(
              BonusEngine.getMultiplierBySpinIndex(currentSpin),
            );
            await waitAsync(500);

            this.play();
          } else {
            this._htmlCtrl.showWonModal();
            this.freeSpinGameState = undefined;
            this.state = "waiting";
          }
        }
      } else {
        this.state = "waiting";
      }
    }
  }

  async playFreeSpin() {
    if (!this.freeSpinGameState) throw Error("Free spin config is empty ");
    const { symbols, type } = this.freeSpinGameState;
    await Promise.all(symbols.map((val) => val.play()));
    this._reels.forEach((r) => r.clear());
    this.freeSpinGameState.symbols = [];
    this._ac.play(AudioKey.bgame);
    await this._htmlCtrl.showFreeSpinWindow(type);
    this._htmlCtrl.updateMultiplierValue(
      BonusEngine.getMultiplierBySpinIndex(this.freeSpinGameState.currentSpin),
    );
    this._htmlCtrl.updateSpinsCount(this.freeSpinGameState.spinnedCount);
    this.freeSpinGameState.started = true;
    this.play();
  }

  disCtrlsGlobal() {
    this._balCtrl.disCtrls();
    this._playButton.disabled = true;
  }

  enCtrlsGlobal() {
    this._balCtrl.enCtrls();
    this._playButton.disabled = false;
  }

  private play() {
    this.state = "start_move";
    this._isInitial = false;
    this.disCtrlsGlobal();
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

      if (!reel.isAllPlaced) {
        for (let asInd = 0; asInd < actSym.length; asInd++) {
          const sym = actSym[asInd];
          sym.moveWithPhysics();
        }
        if (reel.isAllPlaced && this._isInitial === false)
          this._ac.play(AudioKey.drop, { speed: 1, volume: 0.3 });
      }
    }

    const isOldRemoved = this._reels.every((reel) => reel.inaSym.length === 0);
    const isNewMoved = this._reels.every((reel) => reel.isAllPlaced);
    if (isOldRemoved && isNewMoved && this._isInitial === false) {
      this.state = "finish_move";
    }
  }

  private moveSymbolsToNewPositions(reel: SlotReel) {
    const activeSymbols = reel.actSym;
    if (activeSymbols.length === BOARD_HEIGHT) return;

    const filledPositions = new Array(BOARD_HEIGHT).fill(false);

    activeSymbols.forEach((symbol) => {
      //TODO

      const closestSlot = SLOT_SYMBOLS_Y_POS.findIndex(
        (pos) => Math.abs(symbol.animSprite.y - pos) < SMALL_SYMBOL_SIZE_PX / 2,
      );
      if (closestSlot !== -1) {
        filledPositions[closestSlot] = true;
      }
    });

    let writeIndex = BOARD_HEIGHT - 1;

    for (let i = BOARD_HEIGHT - 1; i >= 0; i--) {
      if (filledPositions[i]) {
        //TODO
        const symbol = activeSymbols.find(
          (sym) =>
            Math.abs(sym.animSprite.y - SLOT_SYMBOLS_Y_POS[i]) <
            SMALL_SYMBOL_SIZE_PX / 2,
        );

        if (symbol && writeIndex !== i) {
          symbol.finalYPos = SLOT_SYMBOLS_Y_POS[writeIndex];
          symbol.row = writeIndex;

          symbol.velocity = 0;
        }

        writeIndex--;
      }
    }
  }

  private dropNewSymbols(reel: SlotReel, reelIndex: number) {
    const activeSymbols = reel.actSym;
    const emptySlots = BOARD_HEIGHT - activeSymbols.length;
    const writeIndex = emptySlots - 1;

    if (emptySlots > 0) {
      const newSymbols: GameSymbol[] = [];

      for (let row = 0; row < emptySlots; row++) {
        const gameSymbol = this._resCtrl.getRandomSlotSymbol();
        const sprite = gameSymbol.animSprite;

        sprite.x = SMALL_SYMBOL_SIZE_PX / 2 - ANIMATION_DIFFERENCE;
        sprite.y =
          -SMALL_SYMBOL_SIZE_PX * (row + 1) -
          ANIMATION_DIFFERENCE -
          row * FALL_SYMBOL_GAP;

        reel.rc.addChild(sprite);

        const newGameSymbol = new GameSymbol({
          type: gameSymbol.type,
          animSprite: sprite,
          row,
          col: reelIndex,
          finalYPos: SLOT_SYMBOLS_Y_POS[writeIndex - row],
          reel,
          animationSpeed: 1,
          onPlay: () => this._ac.play(GSDestAudioKey[gameSymbol.type], {}),
        });

        newSymbols.push(newGameSymbol);
      }

      reel.addSymbols(newSymbols);
    }
  }

  private moveToEmptyPlaces() {
    this.state = "start_define_empty";
    for (let reelIndex = 0; reelIndex < this._reels.length; reelIndex++) {
      const reel = this._reels[reelIndex];
      this.moveSymbolsToNewPositions(reel);
      this.dropNewSymbols(reel, reelIndex);
    }

    this.state = "start_move";
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

      if (this.state === "waiting") {
        this.enCtrlsGlobal();
      }
    });
  }
}
