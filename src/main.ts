import { extensions, ResizePlugin } from "pixi.js";
import { initApp } from "./App";
import { ResourcesController } from "./controllers/ResourcesController";
import { GameController } from "./controllers/GameController";
import { AudioController } from "./controllers/AudioController";
import { BalanceController } from "./controllers/BalanceController";
import { HTMLController } from "./controllers/HtmlController";

extensions.add(ResizePlugin);

(async () => {
  const loaderContainer = document.getElementById("loaderContainer")!;
  const progressBarIndicatorValue = document.getElementById(
    "progressBarIndicatorValue",
  )!;

  const { app } = await initApp();

  const resCtrl = await ResourcesController.create(app);
  const audioCtrl = new AudioController();
  const balanceCtrl = new BalanceController(audioCtrl);

  const htmlCtrl = new HTMLController(audioCtrl, balanceCtrl);
  progressBarIndicatorValue.style.width = "66%";
  const gameCtrl = new GameController(
    app,
    resCtrl,
    audioCtrl,
    balanceCtrl,
    htmlCtrl,
  );

  await gameCtrl.createDefaulReelsAndMask();
  progressBarIndicatorValue.style.width = "100%";

  gameCtrl.loop();
  setTimeout(() => {
    htmlCtrl.initSoundToggles();
    setTimeout(() => {
      loaderContainer.remove();
    }, 500);
  }, 1500);
})();
