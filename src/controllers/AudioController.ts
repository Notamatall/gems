import { PlayOptions, sound } from "@pixi/sound";
import { isMusicEnabled, isSoundEnabled } from "../constants/lskey";

export enum AudioKey {
  music = "music",
  drop = "drop",
  bet = "bet",
  win = "win",
  click = "click",
  gemdest = "gemdest",
  chestop = "chestop",
  coins = "coins",
  chestrew = "chestrew",
  fshit = "fshit",
  bgame = "bgame",
}
export class AudioController {
  constructor() {
    sound.add(AudioKey.bet, "/assets/sounds/bet.webm");
    sound.add(AudioKey.win, "/assets/sounds/win.webm");
    sound.add(AudioKey.drop, "/assets/sounds/reeldrop.webm");
    sound.add(AudioKey.music, "/assets/sounds/game-music.webm");
    sound.add(AudioKey.click, "/assets/sounds/click.wav");
    sound.add(AudioKey.gemdest, "/assets/sounds/gem-destroy.webm");
    sound.add(AudioKey.chestop, "/assets/sounds/chest-open.webm");
    sound.add(AudioKey.coins, "/assets/sounds/coins-sound.webm");
    sound.add(AudioKey.chestrew, "/assets/sounds/chest-reward.mp3");
    sound.add(AudioKey.fshit, "/assets/sounds/fs-hit.mp3");
    sound.add(AudioKey.bgame, "/assets/sounds/bonus-game.mp3");

    const isse = localStorage.getItem(isSoundEnabled);
    if (isse && isse === "false") {
      sound.muteAll();
    } else {
      const isme = localStorage.getItem(isMusicEnabled);

      if (!isme || (isme && isme === "true")) {
        this.play(AudioKey.music, { loop: true, volume: 0.1, speed: 1 });
      }
    }
  }

  disableSound() {
    sound.muteAll();
    localStorage.setItem(isSoundEnabled, "false");
  }

  enableSound() {
    sound.unmuteAll();
    localStorage.setItem(isSoundEnabled, "true");
  }

  disableMusic() {
    sound.pause(AudioKey.music);
    localStorage.setItem(isMusicEnabled, "false");
  }

  enableMusic() {
    this.play(AudioKey.music, { loop: true, volume: 0.1, speed: 1 });
    localStorage.setItem(isMusicEnabled, "true");
  }

  pauseSound(key: AudioKey) {
    sound.pause(key);
  }

  play(key: AudioKey, opt?: PlayOptions) {
    sound.play(key, { volume: 0.4, speed: 1, ...opt });
  }
}
