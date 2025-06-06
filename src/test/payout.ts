import { Application, Assets, BitmapText, Text, TextStyle } from "pixi.js";

(async () => {
  // Create a new application
  const app = new Application();

  // Initialize the application
  await app.init({ background: "#1099bb", resizeTo: window });

  // Append the application canvas to the document body
  document.body.appendChild(app.canvas);

  // Load bitmap font
  await Assets.load("https://pixijs.com/assets/bitmap-font/desyrel.xml");

  const bitmapFontText = new BitmapText({
    text: "bitmap fonts are supported!\nWoo yay!",
    style: {
      fontFamily: "Desyrel",
      fontSize: 55,
      align: "left",
    },
  });

  bitmapFontText.x = 50;
  bitmapFontText.y = 200;

  app.stage.addChild(bitmapFontText);

  const style = new TextStyle({
    fontFamily: "Exo", // Or 'Anton', 'Orbitron', etc.
    fontSize: 64,
    fill: "#ffff00", // solid yellow fill
    stroke: "#000000", // black border
    dropShadow: {
      color: "#000000",
      blur: 4,
      distance: 3,
    },
    fontWeight: "bold",
    align: "center",
  });

  const text = new Text({
    text: "dasdsa",
    ...style,
  });
  text.anchor.set(0.5); // center it
  text.position.set(app.screen.width / 2, app.screen.height / 2);

  app.stage.addChild(text);
})();
