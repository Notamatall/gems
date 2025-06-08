import { GSEffect } from ".";
import { AudioKey } from "../controllers/AudioController";

export enum GSType {
  chestdoublegold = "ChestDoubleG",
  gemc = "GemC",
  gemg = "GemG",
  gemr = "GemR",
  gemw = "GemW",
  gemy = "GemY",
  gemv = "GemV",
  chests = "ChestS",
  chestg = "ChestG",
  fschest = "FSChest",
}

export const GSDestAudioKey: Record<GSType, AudioKey> = {
  GemC: AudioKey.gemdest,
  GemG: AudioKey.gemdest,
  GemR: AudioKey.gemdest,
  GemW: AudioKey.gemdest,
  GemY: AudioKey.gemdest,
  GemV: AudioKey.gemdest,
  ChestG: AudioKey.chestrew,
  ChestS: AudioKey.chestrew,
  ChestDoubleG: AudioKey.fshit,
  FSChest: AudioKey.fshit,
};

export const gs_des_anim: Record<GSType, string> = {
  GemV: "/assets/animations-json/gemv.json",
  GemC: "/assets/animations-json/gemc.json",
  GemG: "/assets/animations-json/gemg.json",
  GemW: "/assets/animations-json/gemw.json",
  GemY: "/assets/animations-json/gemy.json",
  GemR: "/assets/animations-json/gemr.json",
  ChestS: "/assets/animations-json/chestsilver.json",
  ChestG: "/assets/animations-json/chestgold.json",
  ChestDoubleG: "/assets/animations-json/chestdoublegold.json",
  FSChest: "/assets/animations-json/fs-chest-green.json",
};

export const gs_eff_anim: Record<GSEffect, string> = {
  BlueLight: "/assets/animations-json/bl-220.json",
  PurpleEffect: "/assets/animations-json/purple-anim.json",
};
