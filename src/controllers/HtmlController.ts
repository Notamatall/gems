import { BonusText } from "../constants/bonuses";
import { isMusicEnabled, isSoundEnabled } from "../constants/lskey";
import { BonusGameType } from "../types";
import { getElementByIdOrThrow } from "../utils/document";
import { AudioController } from "./AudioController";
import { BalanceController } from "./BalanceController";

export class HTMLController {
  constructor(ac: AudioController, bc: BalanceController) {
    this._ac = ac;
    this._bc = bc;
    this.registerPanelClickHandler();
  }

  private _ac: AudioController;
  private _bc: BalanceController;
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
  private _bonusBuyButton: HTMLButtonElement =
    getElementByIdOrThrow("BonusBuyButton");
  private _featureBuyCardButton: HTMLButtonElement = getElementByIdOrThrow(
    "FeatureBuyCardButton",
  );

  private _freeSpinsContainer: HTMLElement = getElementByIdOrThrow(
    "FeatureCounterValue",
  );
  private _bonusPopup: HTMLElement = getElementByIdOrThrow("BonusPopup");
  private _gameInfoBtn: HTMLElement = getElementByIdOrThrow("GameInfoBtn");
  private _gameInfoCloseButton: HTMLElement =
    getElementByIdOrThrow("GameInfoClose");
  private _gameInfoWindow: HTMLElement =
    getElementByIdOrThrow("GameInfoWindowId");
  private _featureBuyWindow: HTMLElement =
    getElementByIdOrThrow("FeatureBuyWindow");
  private _featureBuyClose: HTMLElement =
    getElementByIdOrThrow("FeatureBuyClose");
  initSoundToggles() {
    this.initMusicToggle();
    this.initSoundToggle();
    this.initMenuToggleBtn();
    this.initFeatureBuyClose();
  }

  disControlls() {
    this._bonusBuyButton.disabled = true;
  }

  enControlls() {
    this._bonusBuyButton.disabled = false;
  }

  hideMenu() {
    this._mainMenu.classList.remove("is-visible");
    this._panelMenu.setAttribute("data-active", `false`);
  }
  triggerBonusPopup(value = 2, type: "FS" | "X" = "FS") {
    const el = this._bonusPopup;
    el.textContent = `+${value} ${type}`;

    const animation = el.animate(
      [
        { opacity: 0, transform: "translate(-50%, 20%) scale(0.9)" }, // below center
        { opacity: 1, transform: "translate(-50%, 0%) scale(1.1)" }, // center-ish
        { opacity: 0, transform: "translate(-50%, -40%) scale(1)" }, // above center
      ],
      {
        duration: 1300,
        easing: "ease-out",
        fill: "forwards",
      },
    );
    return new Promise<void>((res) => {
      animation.onfinish = () => {
        res();
      };
    });
  }
  private initFeatureBuyClose() {
    this._featureBuyClose.addEventListener("click", () => {
      this._featureBuyWindow.style.display = "none";
    });
  }

  private initMenuToggleBtn() {
    this._gameInfoBtn.addEventListener("click", () => {
      this.hideMenu();
      const isMenuVisible = this._gameInfoWindow.style.display === "flex";
      if (isMenuVisible) {
        this._gameInfoWindow.style.display = "none";
      } else {
        this._gameInfoWindow.style.display = "flex";
      }
    });
    this._gameInfoCloseButton.addEventListener("click", () => {
      this._gameInfoWindow.style.display = "none";
    });
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
    this._bonusBuyButton.addEventListener("click", () => {
      this._featureBuyWindow.style.display = "flex";
    });

    this._featureBuyCardButton.addEventListener("click", () => {
      onClick();
      this._bc.buyBonus();
      this._featureBuyWindow.style.display = "none";
    });
  }
}
