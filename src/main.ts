import { extensions, ResizePlugin } from "pixi.js";
import { initApp } from "./App";
import { ResourcesController } from "./controllers/ResourcesController";
import { GameController } from "./controllers/GameController";
import { AudioController } from "./controllers/AudioController";
import { BalanceController } from "./controllers/BalanceController";
import { HTMLController } from "./controllers/HtmlController";
import { calcStats } from "./test/math-engine";

extensions.add(ResizePlugin);

(async () => {
  calcStats();
  const { app } = await initApp();
  const resCtrl = await ResourcesController.create(app);
  const audioCtrl = new AudioController();
  new HTMLController(audioCtrl);
  const balanceCtrl = new BalanceController(audioCtrl);
  const gameCtrl = new GameController(app, resCtrl, audioCtrl, balanceCtrl);
  await gameCtrl.createDefaulReelsAndMask();
  gameCtrl.loop();
})();
