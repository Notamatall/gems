import { initDevtools } from "@pixi/devtools";
import { Application, Container } from "pixi.js";

const app = new Application();
const initApp = async () => {
  await app.init({
    width: 1920,
    height: 1080,
    backgroundAlpha: 0, // ensures canvas background is transparent
  });
  initDevtools({ app });
  const container = document.getElementById("pixi-container")!;

  container.appendChild(app.canvas);
  return { app };
};
export { initApp, app };
