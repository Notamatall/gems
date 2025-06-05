import { isSoundEnabled } from "../constants/local-storage-keys";
import { getElementByIdOrThrow } from "../utils/document";
import { AudioController, AudioKey } from "./AudioController";

export class HTMLController {
  constructor(ac: AudioController) {
    this._ac = ac;
    this.registerPanelClickHandler();
    this.registerMusicClickHandler();
    this.registerSoundClickHandler();
    const isse = localStorage.getItem(isSoundEnabled);
    if (!isse) {
      this._soundToggle.setAttribute("data-active", "false");
    }
  }

  private _ac: AudioController;
  private _panelMenu: HTMLElement =
    getElementByIdOrThrow<HTMLElement>("DataPanel_Menu");
  private _mainMenu: HTMLElement = getElementByIdOrThrow("MainMenu");
  private _musicToggle: HTMLElement = getElementByIdOrThrow("MusicToggle");
  private _soundToggle: HTMLElement = getElementByIdOrThrow("SoundToggle");

  private registerMusicClickHandler() {
    this._musicToggle.addEventListener("click", () => {
      const isActive = this._musicToggle.getAttribute("data-active") === "true";
      this._musicToggle.setAttribute("data-active", `${!isActive}`);

      if (isActive) {
        this._ac.pauseSound(AudioKey.music);
      } else {
        this._ac.play(AudioKey.music, { loop: true, volume: 0.1 });
      }
    });
  }

  private registerSoundClickHandler() {
    this._soundToggle.addEventListener("click", () => {
      this._ac.disable();
      const isActive = this._soundToggle.getAttribute("data-active") === "true";
      this._soundToggle.setAttribute("data-active", `${!isActive}`);
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
