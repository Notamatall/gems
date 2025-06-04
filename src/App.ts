import { initDevtools } from "@pixi/devtools";
import { Application } from "pixi.js";

const app = new Application();
const initApp = async () => {
  await app.init({
    width: 1318,
    height: 1080,
    backgroundAlpha: 0, // ensures canvas background is transparent
  });
  initDevtools({ app });
  const container = document.getElementById("pixi-container")!;

  container.appendChild(app.canvas);
  return { app };
};
export { initApp, app };
