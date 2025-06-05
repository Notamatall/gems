import { PlayOptions, sound } from "@pixi/sound";

export enum AudioKey {
  bg = "bg",
  drop = "drop",
  bet = "bet",
  win = "win",
  click = "click",
  gemdest = "gemdest",
  chestop = "chestop",
  coins = "coins",
}
export class AudioController {
  constructor() {
    sound.add(AudioKey.bet, "/assets/sounds/bet.webm");
    sound.add(AudioKey.win, "/assets/sounds/win.webm");
    sound.add(AudioKey.drop, "/assets/sounds/reeldrop.webm");
    sound.add(AudioKey.bg, "/assets/sounds/game-music.webm");
    sound.add(AudioKey.click, "/assets/sounds/click.wav");
    sound.add(AudioKey.gemdest, "/assets/sounds/gem-destroy.webm");
    sound.add(AudioKey.chestop, "/assets/sounds/chest-open.webm");
    sound.add(AudioKey.coins, "/assets/sounds/coins-sound.webm");
  }

  play(key: AudioKey, opt?: PlayOptions) {
    sound.play(key, { volume: 0.4, ...opt });
  }
}
