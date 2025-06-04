import { PlayOptions, sound } from "@pixi/sound";

export enum AudioKey {
  bg = "bg",
  drop = "drop",
  bet = "bet",
  win = "win",
}
export class AudioController {
  constructor() {
    sound.add(AudioKey.bet, "/assets/sounds/bet.webm");
    sound.add(AudioKey.win, "/assets/sounds/win.webm");
    sound.add(AudioKey.drop, "/assets/sounds/drop.webm");
    sound.add(AudioKey.bg, "/assets/sounds/game-music.webm");
  }

  play(key: AudioKey, opt?: PlayOptions) {
    sound.play(key, { volume: 0.4, ...opt });
  }
}
