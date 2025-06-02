import { AnimatedSprite, BlurFilter, Container } from "pixi.js";

export type Reel = {
  container: Container<Container>;
  symbols: AnimatedSprite[];
  position: number;
  previousPosition: number;
  blur: BlurFilter;
};
export type Tween = {
  object: any;
  property: any;
  propertyBeginValue: any;
  target: any;
  easing: any;
  time: any;
  change: any;
  complete: any;
  start: number;
};
