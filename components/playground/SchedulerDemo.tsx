"use client";
import { useEffect, useRef, useState } from "react";
import s from "./Playground.module.css";
const phases = ["Receive", "Resolve", "Present"];
const duration = 2400;
export default function SchedulerDemo() {
  const scene = useRef<HTMLDivElement>(null);
  const rail = useRef<HTMLDivElement>(null);
  const animations = useRef<Animation[]>([]);
  const generation = useRef(0);
  const [state, setState] = useState("idle");
  const [reduced, setReduced] = useState(false);
  const [step, setStep] = useState(0);
  useEffect(() => {
    const runGeneration = generation;
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      setReduced(preference.matches);
      generation.current++;
      animations.current.forEach((a) => a.cancel());
      animations.current = [];
      setState("idle");
    };
    update();
    preference.addEventListener("change", update);
    const hidden = () => {
      if (document.hidden) {
        animations.current.forEach((a) => a.pause());
        setState((value) => (value === "playing" ? "paused" : value));
      }
    };
    document.addEventListener("visibilitychange", hidden);
    return () => {
      runGeneration.current++;
      animations.current.forEach((a) => a.cancel());
      preference.removeEventListener("change", update);
      document.removeEventListener("visibilitychange", hidden);
    };
  }, []);
  const play = () => {
    if (reduced) {
      setStep(2);
      setState("complete");
      return;
    }
    if (state !== "paused") {
      animations.current.forEach((a) => a.cancel());
      const nodes = Array.from(scene.current?.children ?? []) as HTMLElement[];
      animations.current = nodes.map((node, i) =>
        node.animate(
          [
            { opacity: 0.25, transform: "translateY(8px)", offset: 0 },
            { opacity: 0.25, transform: "translateY(8px)", offset: i / 3 },
            { opacity: 1, transform: "translateY(0)", offset: (i + 1) / 3 },
            { opacity: 1, transform: "translateY(0)", offset: 1 },
          ],
          { duration, fill: "both", easing: "linear" }
        )
      );
      if (rail.current)
        animations.current.push(
          rail.current.animate([{ transform: "scaleX(0)" }, { transform: "scaleX(1)" }], {
            duration,
            fill: "both",
          })
        );
      const sharedStart = document.timeline.currentTime;
      animations.current.forEach((a) => {
        a.startTime = sharedStart;
      });
    } else animations.current.forEach((a) => a.play());
    setState("playing");
    const run = ++generation.current;
    Promise.all(animations.current.map((a) => a.finished))
      .then(() => {
        if (generation.current === run) setState("complete");
      })
      .catch(() => {});
  };
  return (
    <>
      <h3>Three transitions. One shared clock.</h3>
      <p className={s.note}>
        Receive, resolve and present occupy consecutive windows on a 2.4-second timeline. A shared
        Web Animations clock coordinates every element; pause freezes the whole sequence.
      </p>
      <div className={s.controls}>
        <button className={s.primary} disabled={state === "playing"} onClick={play}>
          {reduced
            ? "Show completed sequence"
            : state === "paused"
              ? "Resume sequence"
              : "Play sequence"}
        </button>
        <button
          className={s.action}
          disabled={state !== "playing"}
          onClick={() => {
            animations.current.forEach((a) => a.pause());
            setState("paused");
          }}
        >
          Pause sequence
        </button>
        <button
          className={s.action}
          onClick={() => {
            generation.current++;
            animations.current.forEach((a) => a.cancel());
            animations.current = [];
            setStep(0);
            setState("idle");
          }}
        >
          Reset sequence
        </button>
      </div>
      <ol className={s.flow}>
        {phases.map((phase, i) => (
          <li key={phase}>
            {phase} · {i * 800}–{(i + 1) * 800} ms
          </li>
        ))}
      </ol>
      <div className={s.scene} ref={scene} aria-hidden="true">
        {phases.map((phase, i) => (
          <div
            key={phase}
            className={s.actor}
            style={{ opacity: state === "inspecting" && i > step ? 0.25 : 1 }}
          >
            {phase}
          </div>
        ))}
      </div>
      <div className={s.rail} ref={rail} aria-hidden="true" />
      <div className={s.controls} aria-label="Inspect timeline">
        {phases.map((phase, i) => (
          <button
            key={phase}
            className={s.action}
            onClick={() => {
              generation.current++;
              animations.current.forEach((a) => {
                a.pause();
                a.currentTime = (i + 1) * 800;
              });
              setStep(i);
              setState("inspecting");
            }}
          >
            Inspect {phase.toLowerCase()}
          </button>
        ))}
      </div>
      <p className={s.status} role="status">
        {state === "inspecting"
          ? `${phases[step]}: ${["Accept the event and prepare presentation state.", "Resolve the coordinated transition before showing its result.", "Reveal the result after the earlier work completes."][step]}`
          : `Sequence ${state}.${reduced ? " Reduced motion: static steps replace animated transitions." : ""}`}
      </p>
      <p className={s.note}>
        These are chosen presentation timings, not measured system latency. A real scheduler also
        cancels stale work. Reset cancels every animation here, and leaving this experiment releases
        them.
      </p>
    </>
  );
}
