import { effectStyle } from "./effectStyle";
import { drawNose, drawTrail, parseHex } from "./draw";
import { bezier, clamp, offsetTrail, Trajectory } from "./math";
import { ParticleSystem } from "./ParticleSystem";
import type { CometOptions, Point, RGB, TrailPoint } from "./types";

const TAIL_FADE_MS = effectStyle.tailFadeMs;
const HEAD_FADE_MS = effectStyle.headFadeMs;
const TAIL_PHASES = [0, Math.PI];
const TAIL_AMPLITUDES = [3.8, 2.2];
const easeFlight = (t: number): number => 1 - (1 - t) ** 3;

export class Comet {
  readonly trajectory: Trajectory;
  readonly particles: ParticleSystem;
  readonly color: RGB;
  readonly trail: TrailPoint[] = [];
  readonly trails: TrailPoint[][] = [[], []];
  position: Point;
  progress = 0;
  state: "travelling" | "fading" | "dead" = "travelling";
  private time: number;
  private nextEmission: number;
  private emissionBudget = 0;
  private trailFade = 1;
  private headFade = 1;
  private arrivalEmitted = false;
  constructor(
    readonly options: CometOptions,
    readonly startTime: number,
    random: () => number = Math.random
  ) {
    this.particles = new ParticleSystem(random, { ...options.to }, startTime + options.duration);
    this.trajectory = new Trajectory(options.from, options.to, options.curve);
    this.position = { ...options.from };
    this.color = parseHex(options.color);
    this.time = startTime;
    this.nextEmission = startTime + 25;
  }
  private positionAt(time: number): Point {
    const t = easeFlight(clamp((time - this.startTime) / this.options.duration));
    return bezier(this.options.from, this.trajectory.control, this.options.to, t);
  }
  update(time: number): void {
    this.time = time;
    const o = this.options;
    this.progress = clamp((time - this.startTime) / o.duration);
    const arrived = this.startTime + o.duration;
    this.trailFade = 1 - clamp((time - arrived) / TAIL_FADE_MS);
    this.headFade = 1 - clamp((time - arrived) / HEAD_FADE_MS);
    this.state = this.progress < 1 ? "travelling" : "fading";
    this.position = this.positionAt(time);
    const distance = this.trajectory.distanceAt(easeFlight(this.progress));
    // A short time-history makes the tail catch the slowing head, as in the reference.
    const previousProgress = clamp(
      (Math.min(time, arrived) - this.startTime - effectStyle.trailHistoryMs) / o.duration
    );
    const previousDistance = this.trajectory.distanceAt(easeFlight(previousProgress));
    const length =
      Math.min(distance - previousDistance, o.trailLength, this.trajectory.length * 0.8) *
      this.trailFade;
    // Recover the exact traversed history even when a frame is skipped; never bridge a curve with a chord.
    const samples = length > 0 ? Math.max(1, Math.min(2048, Math.ceil(length / 2))) : 0;
    for (let i = 0; i <= samples; i++) {
      const d = distance - length + (samples ? (length * i) / samples : 0);
      const p = this.trajectory.atDistance(d);
      if (this.trail[i]) Object.assign(this.trail[i], p, { distance: d });
      else this.trail[i] = { ...p, distance: d };
    }
    this.trail.length = samples + 1;
    for (let i = 0; i < this.trails.length; i++) {
      offsetTrail(this.trail, time, TAIL_PHASES[i], TAIL_AMPLITUDES[i], this.trails[i]);
    }
    if (o.particleCount > 0) {
      // Emission times, rather than frame counts, govern density.
      const particleHorizon = Math.max(
        effectStyle.particleLifeMax,
        effectStyle.convergenceMs * 1.25
      );
      this.nextEmission = Math.max(this.nextEmission, time - particleHorizon);
      while (this.nextEmission < Math.min(time, arrived)) {
        const progress = clamp((this.nextEmission - this.startTime) / o.duration);
        const travelled =
          this.trajectory.length > 0
            ? this.trajectory.distanceAt(easeFlight(progress)) / this.trajectory.length
            : 0;
        const approach = clamp((travelled - 0.75) / 0.25);
        const rate =
          travelled < effectStyle.emissionStart
            ? 0
            : ((effectStyle.midPathRate +
                (effectStyle.approachRate - effectStyle.midPathRate) * approach ** 2) *
                o.particleCount) /
              12;
        // Fixed simulation steps keep density consistent even when display frames are skipped.
        const step = 1000 / 120;
        this.emissionBudget += (rate * step) / 1000;
        const p = this.positionAt(this.nextEmission);
        const before = this.positionAt(this.nextEmission - 2);
        const dx = p.x - before.x,
          dy = p.y - before.y;
        const norm = Math.hypot(dx, dy);
        while (this.emissionBudget >= 1) {
          if (norm > 0.0001)
            this.particles.emit(p, { x: dx / norm, y: dy / norm }, this.nextEmission);
          this.emissionBudget -= 1;
        }
        this.nextEmission += step;
      }
      if (time >= arrived && !this.arrivalEmitted) {
        this.arrivalEmitted = true;
        if (time - arrived < particleHorizon && this.trajectory.length > 0) {
          const before = this.positionAt(arrived - 2);
          const dx = o.to.x - before.x,
            dy = o.to.y - before.y;
          const norm = Math.hypot(dx, dy) || 1;
          this.particles.burst(
            o.to,
            { x: dx / norm, y: dy / norm },
            arrived,
            Math.min(64, Math.round((effectStyle.arrivalCount * o.particleCount) / 12))
          );
        }
      }
    }
    this.particles.update(time);
    if (
      this.progress === 1 &&
      this.trailFade === 0 &&
      this.headFade === 0 &&
      this.particles.particles.length === 0
    ) {
      this.state = "dead";
    }
  }
  draw(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    const alpha = this.trailFade ** 1.5;
    drawTrail(
      ctx,
      this.trails[0],
      this.options.headSize * effectStyle.trailWidthPrimary,
      this.color,
      alpha
    );
    drawTrail(
      ctx,
      this.trails[1],
      this.options.headSize * effectStyle.trailWidthSecondary,
      this.color,
      alpha * 0.6
    );
    this.particles.draw(ctx, this.color, this.time);
    if (this.headFade > 0) {
      const appear = clamp((this.time - this.startTime) / 70);
      const before = this.positionAt(
        Math.min(this.time, this.startTime + this.options.duration) - 2
      );
      const angle = Math.atan2(this.position.y - before.y, this.position.x - before.x);
      drawNose(
        ctx,
        this.position,
        angle,
        this.options.headSize,
        this.color,
        appear * this.headFade
      );
    }
    ctx.restore();
  }
}
