import { extensions, ResizePlugin } from "pixi.js";
import { initApp } from "./App";
import { ResourcesController } from "./ResourcesController";
import { AnimationContoller } from "./AnimationController";
import { GameController } from "./GameController";

extensions.add(ResizePlugin);

(async () => {
  const { app } = await initApp();
  await AnimationContoller.loadGemsAnimationsInCache();
  const resCtrl = new ResourcesController();
  await resCtrl.init(app);
  const gameCtrl = new GameController(app, resCtrl);
  await gameCtrl.createDefaulReelsAndMask();
  gameCtrl.runLoop2();
  // gameCtrl.populateReelsWithSymbols();
})();

// async function createGems(mainContainer: any, reelBg: Sprite) {
//   const animations = Assets.cache.get(AnimationsUrls.GemV).data.animations;
//   for (let i = 0; i < REEL_WIDTH; i++) {
//     const reelContainer = new Container();
//     reelContainer.x = reelBg.x + 188 * i;
//     reelContainer.y = reelBg.y + REEL_BORDER_SIZE_PX;
//     for (let j = 0; j < REEL_HEIGHT; j++) {
//       const animatedGemV = AnimatedSprite.fromFrames(
//         animations[AnimationsNames.GemV],
//       );
//       animatedGemV.animationSpeed = 1 / 3;
//       animatedGemV.loop = false;
//       animatedGemV.onComplete = () => {
//         reelContainer.removeChild(animatedGemV);
//         console.log(reelContainer);
//       };
//       animatedGemV.x = SMALL_SYMBOL_SIZE_PX / 2 - ANIMATION_DIFFERENCE;
//       animatedGemV.y = j * SMALL_SYMBOL_SIZE_PX - ANIMATION_DIFFERENCE;
//       reelContainer.addChild(animatedGemV);
//     }
//     mainContainer.addChild(reelContainer);
//   }
// }

// async function createBigGem(){
//const animations = await loadGemsAnimations();
//  const animatedGemV = AnimatedSprite.fromFrames(animations["Gem V"]);

//     animatedGemV.animationSpeed = 1 / 3; // 6 fps

//   animatedGemV.width = 376;
//   animatedGemV.height = 376;
//   animatedGemV.x = reelX + SMALL_SYMBOL_SIZE_PX / 2;
//   animatedGemV.y = REEL_BORDER_SIZE_PX;
//   animatedGemV.play();
//   mainContainer.addChild(animatedGemV);

// }

// const sprite = reelContainer.getChildAt<AnimatedSprite>(
//   Math.round(Math.random() * 4),
// );
// sprite.onComplete = () => {
//   console.log("completed");
// };
// sprite.onComplete = () => {
//   console.log("complete");
//   reelContainer.removeChild(sprite);
// };
// sprite.play();
