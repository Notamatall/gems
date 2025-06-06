import { isMusicEnabled, isSoundEnabled } from "../constants/lskey";
import { getElementByIdOrThrow } from "../utils/document";
import { AudioController } from "./AudioController";

export class HTMLController {
  constructor(ac: AudioController) {
    this._ac = ac;
    this.registerPanelClickHandler();
    this.initMusicToggle();
    this.initSoundToggle();
  }

  private _ac: AudioController;
  private _panelMenu: HTMLElement =
    getElementByIdOrThrow<HTMLElement>("DataPanel_Menu");
  private _mainMenu: HTMLElement = getElementByIdOrThrow("MainMenu");
  private _musicToggle: HTMLElement = getElementByIdOrThrow("MusicToggle");
  private _soundToggle: HTMLElement = getElementByIdOrThrow("SoundToggle");

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
}
