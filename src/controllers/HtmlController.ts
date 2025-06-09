import { BonusText } from "../constants/bonuses";
import { isMusicEnabled, isSoundEnabled } from "../constants/lskey";
import { BonusGameType } from "../types";
import { getElementByIdOrThrow } from "../utils/document";
import { AudioController } from "./AudioController";

export class HTMLController {
  constructor(ac: AudioController) {
    this._ac = ac;
    this.registerPanelClickHandler();
  }

  private _ac: AudioController;
  private _panelMenu: HTMLElement =
    getElementByIdOrThrow<HTMLElement>("DataPanel_Menu");
  private _mainMenu: HTMLElement = getElementByIdOrThrow("MainMenu");
  private _musicToggle: HTMLElement = getElementByIdOrThrow("MusicToggle");
  private _soundToggle: HTMLElement = getElementByIdOrThrow("SoundToggle");
  private _bonusBoard: HTMLElement = getElementByIdOrThrow("BonusBoard");
  private _bonusBoardDescription: HTMLElement = getElementByIdOrThrow(
    "BonusBoardDescription",
  );
  private _multiplierContainer: HTMLElement = getElementByIdOrThrow(
    "FeatureTotalWinValue",
  );
  private _featurePanel: HTMLElement = getElementByIdOrThrow("FeaturePanel");
  private _actionPanel: HTMLElement = getElementByIdOrThrow("ActionPanel");
  private _bonusBuyButton: HTMLElement =
    getElementByIdOrThrow("BonusBuyButton");

  private _freeSpinsContainer: HTMLElement = getElementByIdOrThrow(
    "FeatureCounterValue",
  );

  initSoundToggles() {
    this.initMusicToggle();
    this.initSoundToggle();
  }

  private initMusicToggle() {
    const isme = localStorage.getItem(isMusicEnabled);
    if (isme && isme === "false") {
      this._musicToggle.setAttribute("data-active", "false");
    }
    this._musicToggle.addEventListener("click", () => {
      const isActive = this._musicToggle.getAttribute("data-active") === "true";
      this._musicToggle.setAttribute("data-active", `${!isActive}`);

      if (isActive) {
        this._ac.disableMusic();
      } else {
        this._ac.enableMusic();
      }
    });
  }

  private initSoundToggle() {
    const isse = localStorage.getItem(isSoundEnabled);
    if (isse && isse === "false") {
      this._soundToggle.setAttribute("data-active", "false");
    }
    this._soundToggle.addEventListener("click", () => {
      const isActive = this._soundToggle.getAttribute("data-active") === "true";
      this._soundToggle.setAttribute("data-active", `${!isActive}`);

      if (isActive) {
        this._ac.disableSound();
      } else {
        this._ac.enableSound();
      }
    });
  }

  private registerPanelClickHandler() {
    this._panelMenu.addEventListener("click", () => {
      const isActive = this._panelMenu.getAttribute("data-active") === "true";

      if (isActive) {
        this._mainMenu.classList.remove("is-visible");
      } else {
        this._mainMenu.classList.add("is-visible");
      }
      this._panelMenu.setAttribute("data-active", `${!isActive}`);
    });
  }

  showFreeSpinWindow(_bonusType: BonusGameType): Promise<void> {
    this._bonusBoardDescription.textContent = BonusText["Multiplier"];
    this._bonusBoard.style.display = "flex";

    return new Promise<void>((res) => {
      const enterAnimation = this._bonusBoard.animate(
        [
          { transform: "translateY(-100%)", opacity: 0 },
          { transform: "translateY(0)", opacity: 1 },
        ],
        {
          duration: 1000,
          easing: "cubic-bezier(0.25, 1, 0.5, 1)",
          fill: "forwards",
        },
      );

      enterAnimation.onfinish = () => {
        console.log("register click");

        const handleClick = () => {
          const exitAnimation = this._bonusBoard.animate(
            [
              { transform: "translateY(0%)", opacity: 1 },
              { transform: "translateY(-100%)", opacity: 0 },
            ],
            {
              duration: 300,
              easing: "cubic-bezier(0.25, 1, 0.5, 1)",
              fill: "forwards",
            },
          );

          exitAnimation.onfinish = () => {
            console.log("removing event lister");
            this._bonusBoard.removeEventListener("click", handleClick);
            this._featurePanel.style.display = "flex";
            this._actionPanel.style.display = "none";
            res();
          };
        };

        this._bonusBoard.removeEventListener("click", handleClick);
        this._bonusBoard.addEventListener("click", handleClick, { once: true });
      };
    });
  }

  updateSpinsCount(count: number) {
    this._freeSpinsContainer.textContent = count.toString();
  }
  updateMultiplierValue(multiplier: number) {
    this._multiplierContainer.textContent = multiplier.toString();
  }

  showWonModal() {
    this._actionPanel.style.display = "flex";
    this._featurePanel.style.display = "none";
    console.log("won modal");
  }

  initBonusBuyButton(onClick: () => void) {
    this._bonusBuyButton.addEventListener("click", onClick);
  }
}
