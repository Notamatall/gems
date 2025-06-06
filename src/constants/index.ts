import { GSEffect, GSType } from "../types";

export const gs_des_anim: Record<GSType, string> = {
  GemV: "/assets/animations-json/gemv.json",
  GemC: "/assets/animations-json/gemc.json",
  GemG: "/assets/animations-json/gemg.json",
  GemW: "/assets/animations-json/gemw.json",
  GemY: "/assets/animations-json/gemy.json",
  GemR: "/assets/animations-json/gemr.json",
  ChestS: "/assets/animations-json/chestsilver.json",
  ChestG: "/assets/animations-json/chestgold.json",
  GemGold: "/assets/animations-json/gemgold.json",
  // FSChest: "/assets/animations-json/fs-chest-green.json",
};

export const gs_eff_anim: Record<GSEffect, string> = {
  BlueLight: "/assets/animations-json/bl-220.json",
};

export const SLOT_SYM_ANIMATION_NAME = "anim";
export const SLOT_SYMBOLS_Y_POS = [-16, 172, 360, 548, 736];
export const BOARD_WIDTH = 6;
export const BOARD_HEIGHT = 5;
export const REEL_BORDER_SIZE_PX = 70;
export const SMALL_SYMBOL_SIZE_PX = 188;
export const ANIMATION_DIFFERENCE = 16;
export const FALL_SYMBOL_GAP = 80;
export const REEL_VIEWPORT_MAX_Y = 736 + 188;
export const MIN_MATCH_COUNT = 7;
export const DEFAULT_BALANCE = 10000;
export const DEFAULT_BET = 10;
export const MAX_BET = 100;
export const MIN_BET = 0.1;
export const SLOT_WEIGHTS_LIMIT = 99;
export const SLOT_WEIGHTS_LIMIT_PF = 101;
