import { Container, Text } from "pixi.js";

export function createText(
  text: string,
  fontSize: number,
  color: number,
  x: number,
  y: number,
) {
  let textObject = null;
  const container = new Container();

  if (textObject) {
    container.removeChild(textObject);
  }

  textObject = new Text({
    text,
    style: {
      fontFamily: "Exo",
      fontSize: fontSize,
      fill: color,
      align: "center",
      stroke: "#000000",
      dropShadow: {
        distance: 2,
        angle: Math.PI / 4,
        blur: 2,
        color: "#000000",
        alpha: 1,
      },
    },
  });

  textObject.anchor.set(0.5);
  textObject.x = x;
  textObject.y = y;

  container.addChild(textObject);
}
createText("Hello World!", 24, 0xffffff, 110, 110);
