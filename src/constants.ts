import { TextureType } from "./types";

export const AnimationsUrls: Record<TextureType, string> = {
  GemV: "/assets/animations-json/gemv.json",
  GemC: "/assets/animations-json/gemc.json",
  GemG: "/assets/animations-json/gemg.json",
  GemW: "/assets/animations-json/gemw.json",
  GemY: "/assets/animations-json/gemy.json",
  GemR: "/assets/animations-json/gemr.json",
  ChestS: "/assets/animations-json/chestsilver.json",
  ChestG: "/assets/animations-json/chestgold.json",
};

export const SLOT_SYM_ANIMATION_NAME = "anim";
export const SLOT_SYMBOLS_Y_POS = [-16, 172, 360, 548, 736];
export const REEL_WIDTH = 6;
export const REEL_HEIGHT = 5;
export const REEL_BORDER_SIZE_PX = 70;
export const SMALL_SYMBOL_SIZE_PX = 188;
export const ANIMATION_DIFFERENCE = 16;
export const FALL_SYMBOL_GAP = 80;
export const REEL_VIEWPORT_MAX_Y = 736 + 188;
export const MIN_MATCH_COUNT = 8;
