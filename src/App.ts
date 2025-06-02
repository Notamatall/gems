import { initDevtools } from "@pixi/devtools";
import { Application, Container } from "pixi.js";

const app = new Application();
const initApp = async () => {
  await app.init({
    width: 1920,
    height: 1080,
  });
  initDevtools({ app });
  const container = document.getElementById("pixi-container")!;

  container.appendChild(app.canvas);
  const mainContainer = new Container();
  app.stage.addChild(mainContainer);
  return { mainContainer, app };
};
export { initApp, app };
