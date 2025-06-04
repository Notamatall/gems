import { extensions, ResizePlugin } from "pixi.js";
import { initApp } from "./App";
import { ResourcesController } from "./controllers/ResourcesController";
import { GameController } from "./controllers/GameController";

extensions.add(ResizePlugin);

(async () => {
  const { app } = await initApp();
  await ResourcesController.loadGemsAnimationsInCache();
  const resCtrl = new ResourcesController();
  await resCtrl.init(app);
  const gameCtrl = new GameController(app, resCtrl);
  await gameCtrl.createDefaulReelsAndMask();
  gameCtrl.loop();
})();
