import { extensions, ResizePlugin } from "pixi.js";
import { initApp } from "./App";
import { ResourcesController } from "./controllers/ResourcesController";
import { GameController } from "./controllers/GameController";
import { AudioController } from "./controllers/AudioController";
import { BalanceController } from "./controllers/BalanceController";

extensions.add(ResizePlugin);

(async () => {
  const { app } = await initApp();
  const resCtrl = await ResourcesController.create(app);
  const audioCtrl = new AudioController();
  const balanceCtrl = new BalanceController(audioCtrl);
  const gameCtrl = new GameController(app, resCtrl, audioCtrl, balanceCtrl);
  await gameCtrl.createDefaulReelsAndMask();
  gameCtrl.loop();
})();
