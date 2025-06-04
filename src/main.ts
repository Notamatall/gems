import { extensions, ResizePlugin } from "pixi.js";
import { initApp } from "./App";
import { ResourcesController } from "./controllers/ResourcesController";
import { GameController } from "./controllers/GameController";
import { AudioController } from "./controllers/AudioController";

extensions.add(ResizePlugin);

(async () => {
  const { app } = await initApp();
  await ResourcesController.loadGemsAnimationsInCache();
  const resCtrl = new ResourcesController();
  const audioCtrl = new AudioController();
  await resCtrl.init(app);
  const gameCtrl = new GameController(app, resCtrl, audioCtrl);
  await gameCtrl.createDefaulReelsAndMask();
  gameCtrl.loop();
})();
