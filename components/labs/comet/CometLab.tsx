"use client";

import { useEffect, useId, useRef, useState } from "react";
import { CometEngine } from "./engine/CometEngine";
import styles from "./CometLab.module.css";

const destinations = ["Interface", "State", "Worker", "Renderer"];
type Status = "idle" | "running" | "paused" | "static" | "unavailable";

export function CometLab() {
  const id = useId();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const surfaceRef = useRef<HTMLDivElement>(null);
  const originRef = useRef<HTMLSpanElement>(null);
  const targetRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const engineRef = useRef<CometEngine | null>(null);
  const reducedRef = useRef(true);
  const [status, setStatus] = useState<Status>("idle");
  const [selected, setSelected] = useState(3);
  const [duration, setDuration] = useState(900);
  const [particles, setParticles] = useState(true);
  const [message, setMessage] = useState(
    "Choose a destination, then launch. Nothing runs automatically."
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let engine: CometEngine;
    try {
      engine = new CometEngine(canvas, () => setStatus("idle"));
      engineRef.current = engine;
    } catch {
      setStatus("unavailable");
      setMessage(
        "Canvas 2D is unavailable. The architecture explanation below describes the same system."
      );
      return;
    }
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => {
      reducedRef.current = preference.matches;
      engine.clear();
      if (preference.matches)
        setMessage("Reduced motion: launches draw a static route instead of moving effects.");
    };
    updatePreference();
    preference.addEventListener("change", updatePreference);
    const pause = () => {
      if (!engine.comets.length) return;
      engine.pause();
      setStatus("paused");
    };
    const visibility = () => {
      if (document.hidden) pause();
    };
    document.addEventListener("visibilitychange", visibility);
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) pause();
    });
    if (surfaceRef.current) observer.observe(surfaceRef.current);
    return () => {
      observer.disconnect();
      preference.removeEventListener("change", updatePreference);
      document.removeEventListener("visibilitychange", visibility);
      engine.destroy();
      engineRef.current = null;
    };
  }, []);

  const launch = (all = false) => {
    const engine = engineRef.current;
    const canvas = canvasRef.current;
    const origin = originRef.current;
    if (!engine || !canvas || !origin) return;
    const indices = all ? [0, 1, 2, 3] : [selected];
    if (engine.comets.length + indices.length > 16) {
      setMessage(
        "The lab allows up to 16 concurrent effects. Clear the surface or let the current effects finish."
      );
      return;
    }
    // Batch viewport measurements before drawing; the engine receives CSS-pixel coordinates.
    const bounds = canvas.getBoundingClientRect();
    const start = origin.getBoundingClientRect();
    const from = {
      x: start.left + start.width / 2 - bounds.left,
      y: start.top + start.height / 2 - bounds.top,
    };
    const targets = indices
      .map((index) => targetRefs.current[index]!.getBoundingClientRect())
      .map((rect) => ({
        x: rect.left + rect.width / 2 - bounds.left,
        y: rect.top + rect.height / 2 - bounds.top,
      }));
    const color = getComputedStyle(canvas).getPropertyValue("--color-accent").trim();
    const compact = window.matchMedia("(max-width: 767px)").matches;
    try {
      if (reducedRef.current) {
        engine.clear();
        const ctx = engine.ctx;
        ctx.save();
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 6]);
        for (const to of targets) {
          ctx.beginPath();
          ctx.moveTo(from.x, from.y);
          ctx.quadraticCurveTo(from.x, to.y, to.x, to.y);
          ctx.stroke();
        }
        ctx.restore();
        setStatus("static");
      } else {
        engine.resume();
        for (const to of targets)
          engine.launch({
            from,
            to,
            color,
            duration,
            headSize: 9,
            trailLength: compact ? 70 : 130,
            particleCount: particles ? (compact ? 3 : 8) : 0,
          });
        setStatus("running");
      }
      setMessage(
        `${reducedRef.current ? "Static route" : "Launched"}: ${all ? "all four destinations" : destinations[selected]}.`
      );
    } catch {
      engine.clear();
      setMessage("The effect could not be started. Clear the surface and try again.");
    }
  };
  return (
    <section className={styles.lab} aria-labelledby={`${id}-title`}>
      <h2 id={`${id}-title`}>Launch, interrupt, inspect.</h2>
      <p className={styles.intro}>
        One renderer. Several effects. No React updates on every frame. The flight timing is a demo
        setting, not a performance measurement.
      </p>
      <div className={styles.controls}>
        <button
          className={styles.primary}
          type="button"
          disabled={status === "unavailable"}
          onClick={() => launch()}
        >
          Launch comet
        </button>
        <button
          className={styles.action}
          type="button"
          disabled={status === "unavailable"}
          onClick={() => launch(true)}
        >
          Launch four
        </button>
        <button
          className={styles.action}
          type="button"
          disabled={status !== "running" && status !== "paused"}
          onClick={() => {
            if (status === "running") {
              engineRef.current?.pause();
              setStatus("paused");
            } else {
              engineRef.current?.resume();
              setStatus("running");
            }
          }}
        >
          {status === "paused" ? "Resume" : "Pause"}
        </button>
        <button
          className={styles.action}
          type="button"
          disabled={status === "unavailable"}
          onClick={() => {
            engineRef.current?.clear();
            setMessage("Surface cleared; the scheduler has no work.");
          }}
        >
          Clear
        </button>
      </div>
      <div className={styles.settings}>
        <label htmlFor={`${id}-duration`}>
          Flight duration <output>{duration} ms</output>
          <input
            id={`${id}-duration`}
            type="range"
            aria-valuetext={`${duration} milliseconds`}
            min="500"
            max="1800"
            step="100"
            value={duration}
            onChange={(event) => setDuration(Number(event.target.value))}
          />
        </label>
        <label className={styles.check}>
          <input
            type="checkbox"
            checked={particles}
            onChange={(event) => setParticles(event.target.checked)}
          />{" "}
          Particle trail
        </label>
        <p className={styles.scheduler}>
          Scheduler{" "}
          <strong>
            {status === "running"
              ? "Active"
              : status === "paused"
                ? "Paused"
                : status === "unavailable"
                  ? "Unavailable"
                  : "Idle"}
          </strong>
        </p>
      </div>
      <div className={styles.surface} ref={surfaceRef}>
        <canvas
          ref={canvasRef}
          className={styles.canvas}
          role="img"
          aria-label="Comets travel from the launch origin toward the selected destination; equivalent controls and status are provided outside the canvas."
        />
        <span className={styles.origin} ref={originRef}>
          Launch origin
        </span>
        <div className={styles.targets} role="group" aria-label="Destination">
          {destinations.map((name, index) => (
            <button
              key={name}
              ref={(node) => {
                targetRefs.current[index] = node;
              }}
              className={styles.target}
              type="button"
              aria-pressed={selected === index}
              onClick={() => setSelected(index)}
            >
              {name}
            </button>
          ))}
        </div>
      </div>
      <p role="status" aria-live="polite" className={styles.status}>
        {message}
      </p>
      <p className={styles.note}>
        Settings apply to new launches. Resizing clears active paths so effects do not land at stale
        coordinates. Leaving the viewport or switching tabs pauses playback; Resume continues it.
        Reduced motion draws static routes.
      </p>
      <ol className={styles.pipeline}>
        <li>
          <strong>Measure once</strong>
          <span>Read origin, target, and canvas bounds in one batch.</span>
        </li>
        <li>
          <strong>Schedule shared work</strong>
          <span>One frame callback advances the active surfaces and their effects.</span>
        </li>
        <li>
          <strong>Render outside React</strong>
          <span>Draw trajectories and particles directly into Canvas 2D.</span>
        </li>
        <li>
          <strong>Release resources</strong>
          <span>Idle, pause, clear, and unmount stop unnecessary work.</span>
        </li>
      </ol>
    </section>
  );
}
