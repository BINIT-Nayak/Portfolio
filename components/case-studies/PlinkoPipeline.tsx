"use client";

import { useEffect, useId, useReducer } from "react";
import { initialRequestFlow, requestFlowReducer } from "@/lib/request-flow.mjs";
import styles from "./PlinkoPipeline.module.css";

const stages = [
  { name: "WebSocket Event", detail: "Receive the server’s authoritative round event and timing." },
  {
    name: "Game State",
    detail:
      "Translate the event into the current gameplay phase; state remains the source of truth.",
  },
  {
    name: "Web Worker Synchronization",
    detail:
      "Coordinate event ordering and timing away from the main UI thread. Workers do not update the DOM.",
  },
  {
    name: "Animation Scheduler",
    detail: "Use synchronized timing to sequence presentation work and interrupt stale animations.",
  },
  {
    name: "UI Animation",
    detail: "Render the scheduled transition while keeping presentation separate from game state.",
  },
];
const events = [
  { name: "BETS_OPEN", result: "Betting controls become available." },
  { name: "BETS_CLOSED", result: "Betting controls close for the round." },
  { name: "BALL_DROP", result: "The ball-drop sequence begins at its scheduled point." },
  { name: "RESULT", result: "The authoritative result is presented." },
  { name: "WIN_ANIMATION", result: "A win presentation follows the resolved result." },
];
const count = stages.length * events.length;

export function PlinkoPipeline({ headingLevel = 3 }: { headingLevel?: 2 | 3 }) {
  const Heading = headingLevel === 2 ? "h2" : "h3";
  const Subheading = headingLevel === 2 ? "h3" : "h4";
  const id = useId();
  const [flow, dispatch] = useReducer(requestFlowReducer, initialRequestFlow);
  const stageIndex = flow.step % stages.length;
  const eventIndex = Math.floor(flow.step / stages.length);
  const event = events[eventIndex];
  const active = flow.phase !== "idle";

  useEffect(() => {
    if (flow.phase !== "playing") return;
    const timer = window.setTimeout(() => dispatch({ type: "tick", count }), 500);
    return () => window.clearTimeout(timer);
  }, [flow.phase, flow.step]);

  useEffect(() => {
    const pause = () => {
      if (document.hidden) dispatch({ type: "pause", count });
    };
    document.addEventListener("visibilitychange", pause);
    return () => document.removeEventListener("visibilitychange", pause);
  }, []);

  return (
    <section data-tour-target="plinko" className={styles.root} aria-labelledby={`${id}-title`}>
      <p className={styles.eyebrow}>Interactive architecture · one round</p>
      <Heading id={`${id}-title`}>From server event to coordinated animation</Heading>
      <p className={styles.intro}>
        Server events drive game state. A worker synchronizes timing; the scheduler turns that
        timing into ordered UI transitions, leaving the main thread available between updates.
      </p>
      <div className={styles.controls}>
        <button
          className={styles.primary}
          type="button"
          disabled={flow.phase === "playing"}
          onClick={() => dispatch({ type: flow.phase === "paused" ? "resume" : "play", count })}
        >
          Play
        </button>
        <button
          className={styles.action}
          type="button"
          disabled={flow.phase !== "playing"}
          onClick={() => dispatch({ type: "pause", count })}
        >
          Pause
        </button>
        <button
          className={styles.action}
          type="button"
          onClick={() => dispatch({ type: "play", count })}
        >
          Restart
        </button>
      </div>
      <ol className={styles.events} aria-label="Illustrative round events">
        {events.map((item, index) => (
          <li key={item.name} aria-current={active && eventIndex === index ? "step" : undefined}>
            <code>{item.name}</code>
          </li>
        ))}
      </ol>
      <div className={styles.layout}>
        <ol className={styles.pipeline} aria-label="Frontend event pipeline in processing order">
          {stages.map((stage, index) => (
            <li
              key={stage.name}
              className={styles.stage}
              data-active={active && stageIndex === index}
            >
              <span className={styles.number} aria-hidden="true">
                0{index + 1}
              </span>
              <div>
                <Subheading>{stage.name}</Subheading>
                <p>{stage.detail}</p>
              </div>
              {index < stages.length - 1 && (
                <span className={styles.connector} aria-hidden="true">
                  {active && stageIndex === index && (
                    <span
                      key={flow.step}
                      className={styles.packet}
                      style={{
                        animationPlayState: flow.phase === "playing" ? "running" : "paused",
                      }}
                    />
                  )}
                </span>
              )}
            </li>
          ))}
        </ol>
        <div className={styles.thread} role="group" aria-labelledby={`${id}-thread`}>
          <Subheading id={`${id}-thread`}>Main thread / work scheduling</Subheading>
          <p className={styles.caption}>Conceptual activity, not a performance measurement.</p>
          <div className={styles.lane}>
            <span>Main thread</span>
            <strong>
              {!active
                ? "Ready"
                : stageIndex === 2
                  ? "Available for input & rendering"
                  : stageIndex === 4
                    ? "Present UI transition"
                    : stageIndex === 3
                      ? "Schedule next transition"
                      : "Process event / update state"}
            </strong>
          </div>
          <div className={styles.lane} data-worker={active && stageIndex === 2}>
            <span>Worker</span>
            <strong>
              {active && stageIndex === 2
                ? "Synchronize timing & ordering"
                : "Waiting for synchronization work"}
            </strong>
          </div>
          <p>
            Without this separation, timing work competes with input and rendering on the main
            thread. The worker handles synchronization; DOM updates still belong to the main thread.
          </p>
          <div className={styles.result}>
            <span className={styles.eyebrow}>Presentation outcome</span>
            <p>{active ? event.result : "Play to trace a round through all five stages."}</p>
          </div>
        </div>
      </div>
      <details className={styles.textAlternative}>
        <summary>Read all example event outcomes</summary>
        <ol>
          {events.map((item) => (
            <li key={item.name}>
              <strong>{item.name}.</strong> {item.result}
            </li>
          ))}
        </ol>
      </details>
      <p className={styles.status} role="status" aria-live="polite" aria-atomic="true">
        {flow.phase === "idle"
          ? "Ready to play."
          : flow.phase === "complete"
            ? "Round complete. All five example events have reached the UI."
            : `${flow.phase === "paused" ? "Paused" : "Playing"}: ${event.name}. ${event.result}`}
      </p>
      <p className={styles.caption}>
        Illustrative event names and pacing, not a live server trace. WIN_ANIMATION represents
        presentation intent rather than an additional authoritative result. Reduced motion uses
        static stage highlights. The steps above remain readable without playback.
      </p>
    </section>
  );
}
