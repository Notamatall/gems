import { CountUp } from "countup.js";
import { DEFAULT_BALANCE, DEFAULT_BET, MAX_BET, MIN_BET } from "../constants";
import { AudioController, AudioKey } from "./AudioController";
import { getElementByIdOrThrow } from "../utils/document";

export class BalanceController {
  constructor(audioCtrl: AudioController) {
    this._audioCtrl = audioCtrl;
    this._balaceElement.textContent = `€ ${this._balanceValue.toFixed(2)}`;
    this._betAmountElement.textContent = `€ ${this._betAmountValue.toFixed(2)}`;
    this.setProgress();

    this._betAmountIncElement.onclick = () => {
      this._audioCtrl.play(AudioKey.click, { volume: 0.7 });
      this.incBet();
    };

    this._betAmountDecElement.onclick = () => {
      this._audioCtrl.play(AudioKey.click, { volume: 0.7 });
      this.decBet();
    };
  }

  private lastWinAmount: number = 0;
  private totalWinAmount: number = 0;

  private _audioCtrl: AudioController;
  private _betAmountIncElement: HTMLButtonElement = getElementByIdOrThrow(
    "BetAmountChangersButton-Inc",
  );
  private _betAmountDecElement: HTMLButtonElement = getElementByIdOrThrow(
    "BetAmountChangersButton-Dec",
  );
  private _balaceElement: HTMLElement = getElementByIdOrThrow("BalanceValue");
  private _betAmountElement: HTMLElement =
    getElementByIdOrThrow("BetAmountValue");
  private _winAmountValueElement: HTMLElement =
    getElementByIdOrThrow("WinAmountValue");
  private _totalWinAmountValueElement: HTMLElement =
    getElementByIdOrThrow("TotalWinValue");
  private _betAmountProgressElement: HTMLElement = getElementByIdOrThrow(
    "BetAmountProgress_Value",
  );
  private _winAmountItem: HTMLElement = getElementByIdOrThrow("WinAmountItem");
  private _totalWinItem: HTMLElement = getElementByIdOrThrow("TotalWinItem");

  private _balanceValue: number = DEFAULT_BALANCE;
  private _betAmountValue: number = DEFAULT_BET;

  hideWinAmountItem() {
    this._winAmountItem.style.opacity = "0";
    this._winAmountValueElement.textContent = ``;
  }

  hideTotalWinItem() {
    this._totalWinItem.style.opacity = "0";
    this._totalWinAmountValueElement.textContent = ``;
  }

  showTotalWinItem() {
    this._totalWinItem.style.opacity = "1";
    this._totalWinAmountValueElement.textContent = `€ ${this.totalWinAmount.toFixed(2)}`;
  }

  showWinAmountItem() {
    this._winAmountItem.style.opacity = "1";
    this._winAmountValueElement.textContent = `€ ${this.lastWinAmount.toFixed(2)}`;
  }

  disCtrls() {
    this._betAmountIncElement.disabled = true;
    this._betAmountDecElement.disabled = true;
  }

  enCtrls() {
    this._betAmountIncElement.disabled = false;
    this._betAmountDecElement.disabled = false;
  }

  setProgress() {
    this._betAmountProgressElement.style.setProperty(
      "--progress",
      this._betAmountValue.toString(),
    );
  }

  decBal() {
    this.changeBal(-this._betAmountValue);
  }

  private changeBal(val: number) {
    const oldVal = this._balanceValue;
    const counter = new CountUp(this._balaceElement, oldVal + val, {
      startVal: oldVal,
      decimalPlaces: 2,
      prefix: "€ ",
      duration: 0.6,
    });
    if (!counter.error) {
      counter.start();
      this._balanceValue += val;
    } else {
      console.error(counter.error);
    }
  }

  incBet() {
    const val = this._betAmountValue;
    const incVal =
      val < 0.2 ? 0.1 : val < 2 ? 0.2 : val < 10 ? 1 : val < 50 ? 5 : 25;
    this.changeBet(incVal);
  }

  decBet() {
    const val = this._betAmountValue;
    const decVal =
      val < 0.2 ? 0.1 : val < 2 ? 0.2 : val < 10 ? 1 : val < 50 ? 5 : 25;
    this.changeBet(-decVal);
  }

  private changeBet(val: number) {
    const oldVal = this._betAmountValue;
    const teoreticalNewVal = oldVal + val;
    const newVal =
      teoreticalNewVal > MAX_BET
        ? MAX_BET
        : teoreticalNewVal < MIN_BET
          ? MIN_BET
          : teoreticalNewVal;

    this._betAmountValue = newVal;
    this._betAmountElement.textContent = `€ ${newVal.toFixed(2)}`;
    this.setProgress();
  }

  winBet(multiplier: number) {
    const wonSize = Math.round(multiplier * this._betAmountValue);
    this.changeBal(wonSize);
    this.lastWinAmount = wonSize;
    this.totalWinAmount += wonSize;
    this.showWinAmountItem();
    this.showTotalWinItem();
  }
}
