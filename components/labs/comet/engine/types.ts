export interface Point {
  x: number;
  y: number;
}
export interface CometLaunchOptions {
  from: Point;
  to: Point;
  color?: string;
  headSize?: number;
  trailLength?: number;
  curve?: number;
  duration?: number;
  particleCount?: number;
}
export type CometOptions = Required<CometLaunchOptions>;
export interface TrailPoint extends Point {
  distance: number;
}
export interface RGB {
  r: number;
  g: number;
  b: number;
}
