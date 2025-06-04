import { CountUp } from "countup.js";
import { DEFAULT_BALANCE, DEFAULT_BET, MAX_BET, MIN_BET } from "../constants";
import { AudioController, AudioKey } from "./AudioController";

export class BalanceController {
  constructor(audioCtrl: AudioController) {
    this._audioCtrl = audioCtrl;
    const balaceValueElement = document.getElementById("BalanceValue");
    if (!balaceValueElement) throw new Error("balaceValueElement not found");
    this._balaceElement = balaceValueElement;
    this._balaceElement.textContent = `€ ${this._balanceValue.toFixed(2)}`;

    const betAmountValue = document.getElementById("BetAmountValue");
    if (!betAmountValue) throw new Error("balaceValueElement not found");
    this._betAmountElement = betAmountValue;
    this._betAmountElement.textContent = `€ ${this._betAmountValue.toFixed(2)}`;

    const betAmountProgress = document.getElementById(
      "BetAmountProgress_Value",
    );
    if (!betAmountProgress) throw new Error("betAmountProgress not found");
    this._betAmountProgressElement = betAmountProgress;
    this.setProgress();

    const betAmountInc = document.getElementById("BetAmountChangersButton-Inc");
    if (!betAmountInc) throw new Error("betAmountInc not found");
    this._betAmountIncElement = betAmountInc as HTMLButtonElement;
    this._betAmountIncElement.onclick = () => {
      this._audioCtrl.play(AudioKey.click);
      this.incBet();
    };

    const betAmountDec = document.getElementById("BetAmountChangersButton-Dec");
    if (!betAmountDec) throw new Error("betAmountDec not found");
    this._betAmountDecElement = betAmountDec as HTMLButtonElement;
    this._betAmountDecElement.onclick = () => {
      this._audioCtrl.play(AudioKey.click);
      this.decBet();
    };
  }
  private _audioCtrl: AudioController;
  private _betAmountIncElement: HTMLButtonElement;
  private _betAmountDecElement: HTMLButtonElement;
  private _balaceElement: HTMLElement;
  private _betAmountElement: HTMLElement;
  private _betAmountProgressElement: HTMLElement;

  private _balanceValue: number = DEFAULT_BALANCE;
  private _betAmountValue: number = DEFAULT_BET;

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
}
