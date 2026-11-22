import { drawGlow } from "./draw";
import { effectStyle } from "./effectStyle";
import type { Point, RGB } from "./types";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  born: number;
  life: number;
  size: number;
  opacity: number;
}

export class ParticleSystem {
  readonly particles: Particle[] = [];
  constructor(
    private readonly random: () => number = Math.random,
    private readonly target?: Point,
    private readonly arrivalTime = Infinity
  ) {}

  private add(p: Point, vx: number, vy: number, time: number, impact: boolean): void {
    this.particles.push({
      ...p,
      vx,
      vy,
      born: time,
      life: Math.min(
        impact
          ? effectStyle.convergenceMs * (0.75 + this.random() * 0.5)
          : 400 + this.random() * 280,
        this.arrivalTime + effectStyle.convergenceMs * 1.25 - time
      ),
      size:
        effectStyle.particleRadiusMin +
        this.random() * (effectStyle.particleRadiusMax - effectStyle.particleRadiusMin),
      opacity: 0.5 + this.random() * 0.25,
    });
  }

  emit(p: Point, direction: Point, time: number): void {
    const back = 20 + this.random() * 25,
      scatter = (this.random() - 0.5) * 32;
    const offset = (this.random() - 0.5) * 5;
    this.add(
      { x: p.x - direction.y * offset, y: p.y + direction.x * offset },
      -direction.x * back - direction.y * scatter,
      -direction.y * back + direction.x * scatter,
      time,
      false
    );
  }

  burst(p: Point, direction: Point, time: number, count: number): void {
    const heading = Math.atan2(direction.y, direction.x);
    for (let i = 0; i < count; i++) {
      // Cover the full circle, with small variations to avoid a rigid ring.
      const angle = heading + ((i + (this.random() - 0.5) * 0.35) * Math.PI * 2) / count;
      const radius =
        effectStyle.arrivalRadiusMin +
        this.random() * (effectStyle.arrivalRadiusMax - effectStyle.arrivalRadiusMin);
      this.add(
        { x: p.x + Math.cos(angle) * radius, y: p.y + Math.sin(angle) * radius },
        0,
        0,
        time,
        true
      );
    }
  }

  update(time: number): void {
    let alive = 0;
    for (const p of this.particles) if (time - p.born < p.life) this.particles[alive++] = p;
    this.particles.length = alive;
  }

  positionAt(p: Particle, time: number): Point {
    const age = Math.max(0, time - p.born);
    const progress = Math.min(1, age / p.life);
    const drift = { x: p.x + (p.vx * age) / 1000, y: p.y + (p.vy * age) / 1000 };
    if (!this.target) return drift;
    // Smoothstep has zero terminal velocity: sparks settle, rather than snap in.
    const pull = progress * progress * (3 - 2 * progress);
    // Converge from the birth position without the initial backward drift.
    return { x: p.x + (this.target.x - p.x) * pull, y: p.y + (this.target.y - p.y) * pull };
  }

  draw(ctx: CanvasRenderingContext2D, color: RGB, time: number): void {
    for (const p of this.particles) {
      const age = Math.max(0, time - p.born);
      const progress = Math.min(1, age / p.life);
      const enter = Math.min(1, age / 65);
      const fadeIn = enter * enter * (3 - 2 * enter);
      const fadeOut = 1 - progress * progress * (3 - 2 * progress);
      const alpha = p.opacity * fadeIn * fadeOut;
      const point = this.positionAt(p, time);
      drawGlow(ctx, point, p.size, color, alpha * 0.18, 2.2);
      ctx.fillStyle = `rgba(${color.r},${color.g},${color.b},${alpha})`;
      ctx.beginPath();
      ctx.arc(point.x, point.y, p.size * (1 - (age / p.life) * 0.35), 0, Math.PI * 2);
      ctx.fill();
    }
  }
}
