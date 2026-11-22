// Adapted from the personal Comet engine; portfolio adds a pauseable clock and bounded launches.
import { effectStyle } from "./effectStyle";
import { Comet } from "./Comet";
import { parseHex } from "./draw";
import { signedCurve } from "./math";
import type { CometLaunchOptions, CometOptions } from "./types";

const defaults: Omit<CometOptions, "from" | "to"> = {
  color: "#49ff78",
  headSize: 13,
  trailLength: effectStyle.trailLength,
  curve: 0.12,
  duration: effectStyle.duration,
  particleCount: 12,
};

interface Surface {
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
  comets: Comet[];
  time: number;
  lastFrame: number | null;
  onIdle: () => void;
}

class AnimationManager {
  private static readonly surfaces = new Set<Surface>();
  private static frame: number | null = null;
  static wake(surface: Surface): void {
    this.surfaces.add(surface);
    this.frame ??= requestAnimationFrame(this.tick);
  }
  static remove(surface: Surface): void {
    this.surfaces.delete(surface);
    surface.lastFrame = null;
    if (!this.surfaces.size && this.frame !== null) {
      cancelAnimationFrame(this.frame);
      this.frame = null;
    }
  }
  private static readonly tick = (time: number): void => {
    this.frame = null;
    this.surfaces.forEach((surface) => {
      const { ctx, comets } = surface;
      surface.time += surface.lastFrame === null ? 0 : Math.max(0, time - surface.lastFrame);
      surface.lastFrame = time;
      ctx.clearRect(0, 0, surface.width, surface.height);
      let alive = 0;
      for (const comet of comets) {
        comet.update(surface.time);
        if (comet.state !== "dead") {
          comet.draw(ctx);
          comets[alive++] = comet;
        }
      }
      comets.length = alive;
      if (!alive) {
        this.remove(surface);
        surface.onIdle();
      }
    });
    if (this.surfaces.size) this.frame = requestAnimationFrame(this.tick);
  };
}

export class CometEngine {
  readonly ctx: CanvasRenderingContext2D;
  readonly comets: Comet[] = [];
  time = 0;
  lastFrame: number | null = null;
  private paused = false;
  width = 0;
  height = 0;
  private destroyed = false;
  private readonly observer: ResizeObserver;
  private dprQuery: MediaQueryList | undefined;

  constructor(
    readonly canvas: HTMLCanvasElement,
    readonly onIdle: () => void = () => {}
  ) {
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas 2D is unavailable");
    this.ctx = ctx;
    this.resize();
    this.observer = new ResizeObserver(() => this.resize());
    this.observer.observe(canvas);
    this.watchDpr();
  }

  private readonly watchDpr = (): void => {
    this.dprQuery?.removeEventListener("change", this.watchDpr);
    this.resize();
    this.dprQuery = matchMedia(`(resolution: ${window.devicePixelRatio || 1}dppx)`);
    this.dprQuery.addEventListener("change", this.watchDpr);
  };

  // Size the canvas with CSS. All public positions are relative to its top-left in CSS pixels.
  resize(): void {
    if (this.destroyed) return;
    const rect = this.canvas.getBoundingClientRect(),
      dpr = window.devicePixelRatio || 1;
    if (this.width !== rect.width || this.height !== rect.height) this.clear();
    this.width = rect.width;
    this.height = rect.height;
    this.canvas.width = Math.round(rect.width * dpr);
    this.canvas.height = Math.round(rect.height * dpr);
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  launch(options: CometLaunchOptions): void {
    if (this.destroyed) {
      throw new Error("Cannot launch after destroy()");
    }
    if (this.comets.length >= 16)
      throw new RangeError("Clear or finish existing effects before launching more.");
    const o: CometOptions = {
      ...defaults,
      ...options,
      from: { ...options.from },
      to: { ...options.to },
    };
    o.curve = signedCurve(o.from, o.to, o.curve);
    for (const value of [
      o.from.x,
      o.from.y,
      o.to.x,
      o.to.y,
      o.headSize,
      o.trailLength,
      o.curve,
      o.duration,
      o.particleCount,
    ]) {
      if (!Number.isFinite(value)) {
        throw new TypeError("Comet numeric options must be finite");
      }
    }
    if (
      o.duration <= 0 ||
      o.headSize <= 0 ||
      o.trailLength < 0 ||
      o.particleCount < 0 ||
      o.particleCount > 1000
    ) {
      throw new RangeError(
        "Use positive duration/headSize, nonnegative trailLength and particleCount from 0 to 1000"
      );
    }
    parseHex(o.color);
    this.comets.push(new Comet(o, this.time));
    if (!this.paused) AnimationManager.wake(this);
  }

  pause(): void {
    this.paused = true;
    AnimationManager.remove(this);
  }

  resume(): void {
    if (this.destroyed) return;
    this.paused = false;
    if (this.comets.length) AnimationManager.wake(this);
  }

  clear(): void {
    AnimationManager.remove(this);
    this.comets.length = 0;
    this.paused = false;
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.onIdle();
  }

  destroy(): void {
    if (this.destroyed) return;
    this.destroyed = true;
    AnimationManager.remove(this);
    this.observer.disconnect();
    this.dprQuery?.removeEventListener("change", this.watchDpr);
    this.comets.length = 0;
    this.ctx.clearRect(0, 0, this.width, this.height);
  }
}
