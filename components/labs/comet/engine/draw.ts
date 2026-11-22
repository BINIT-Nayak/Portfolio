import { effectStyle } from "./effectStyle";
import type { Point, RGB, TrailPoint } from "./types";

export function parseHex(hex: string): RGB {
  if (!/^#(?:[\da-f]{3}|[\da-f]{6})$/i.test(hex))
    throw new TypeError("color must be #RGB or #RRGGBB");
  let value = hex.slice(1);
  if (hex.length === 4) {
    const chars = value.split("");
    value = chars.map((c) => c + c).join("");
  }
  const n = Number.parseInt(value, 16);
  return { r: n >> 16, g: (n >> 8) & 255, b: n & 255 };
}

const rgba = (c: RGB, a: number): string => `rgba(${c.r},${c.g},${c.b},${a})`;

const whiten = (c: RGB, mix = 0.85): RGB => ({
  r: Math.round(c.r + (255 - c.r) * mix),
  g: Math.round(c.g + (255 - c.g) * mix),
  b: Math.round(c.b + (255 - c.b) * mix),
});

export function drawGlow(
  ctx: CanvasRenderingContext2D,
  p: Point,
  size: number,
  color: RGB,
  alpha = 1,
  radiusScale = 3
): void {
  const radius = Math.max(0.01, size * radiusScale);
  const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, radius);

  gradient.addColorStop(0, rgba(color, alpha));
  gradient.addColorStop(0.2, rgba(color, alpha * 0.85));
  gradient.addColorStop(0.4, rgba(color, alpha * 0.2));
  gradient.addColorStop(0.65, rgba(color, alpha * 0.04));
  gradient.addColorStop(1, rgba(color, 0));

  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
  ctx.fill();
}

export function drawTrail(
  ctx: CanvasRenderingContext2D,
  points: TrailPoint[],
  size: number,
  color: RGB,
  alpha: number
): void {
  if (points.length < 2) return;
  const last = points.length - 1,
    start = points[0],
    end = points[last];
  const span = end.distance - start.distance || 1;
  const layers = [
    { width: 2.0, opacity: 0.12, blur: size * 2, color },
    { width: 0.65, opacity: 0.5, blur: 0, color },
    { width: 0.24, opacity: 0.6, blur: 0, color: whiten(color, 0.3) },
  ];
  for (const layer of layers) {
    const gradient = ctx.createLinearGradient(start.x, start.y, end.x + 0.001, end.y);
    gradient.addColorStop(0, rgba(layer.color, 0));
    gradient.addColorStop(0.3, rgba(layer.color, 0.12 * alpha * layer.opacity));
    gradient.addColorStop(0.7, rgba(layer.color, 0.6 * alpha * layer.opacity));
    gradient.addColorStop(1, rgba(layer.color, alpha * layer.opacity));
    ctx.fillStyle = gradient;
    ctx.shadowColor = rgba(color, alpha * 0.2);
    ctx.shadowBlur = layer.blur;
    fillRibbon(ctx, points, last, start, span, size * layer.width);
  }
  ctx.shadowBlur = 0;
}

function trailTaper(t: number): number {
  return 0.2 + 0.55 * t;
}

function fillRibbon(
  ctx: CanvasRenderingContext2D,
  points: TrailPoint[],
  last: number,
  start: TrailPoint,
  span: number,
  maxWidth: number
): void {
  ctx.beginPath();
  for (let i = 0; i <= last; i++) {
    const { x, y } = ribbonVertex(points, i, last, start, span, maxWidth, 1);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  for (let i = last - 1; i >= 0; i--) {
    const { x, y } = ribbonVertex(points, i, last, start, span, maxWidth, -1);
    ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fill();
}

function ribbonVertex(
  points: TrailPoint[],
  i: number,
  last: number,
  start: TrailPoint,
  span: number,
  maxWidth: number,
  side: number
): Point {
  const p = points[i],
    before = points[Math.max(0, i - 1)],
    after = points[Math.min(last, i + 1)];
  const dx = after.x - before.x,
    dy = after.y - before.y;
  const length = Math.hypot(dx, dy) || 1;
  const width = maxWidth * trailTaper((p.distance - start.distance) / span);
  return { x: p.x - (dy / length) * width * side, y: p.y + (dx / length) * width * side };
}

/** Compact luminous head with a subtle forward point, rather than a spear-shaped body. */
export function drawNose(
  ctx: CanvasRenderingContext2D,
  p: Point,
  angle: number,
  size: number,
  color: RGB,
  alpha: number
): void {
  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.rotate(angle);
  const length = size * 0.5,
    width = size * 0.14;
  drawGlow(ctx, { x: -length * 0.4, y: 0 }, size * 0.34, color, alpha * effectStyle.noseGlow, 2);
  drawGlow(ctx, { x: -length * 0.28, y: 0 }, size * 0.15, whiten(color, 0.3), alpha * 0.8, 1.5);
  const gradient = ctx.createLinearGradient(-length, 0, 0, 0);
  gradient.addColorStop(0, rgba(color, 0));
  gradient.addColorStop(0.6, rgba(color, alpha * 0.7));
  gradient.addColorStop(1, rgba(whiten(color, 0.45), alpha * 0.95));
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.quadraticCurveTo(-length * 0.55, -width, -length, 0);
  ctx.quadraticCurveTo(-length * 0.55, width, 0, 0);
  ctx.fill();
  ctx.restore();
}
