"use client";

import { useEffect, useId, useReducer, useRef, useState, type CSSProperties } from "react";
import { FiPause, FiPlay, FiRotateCcw } from "react-icons/fi";
import { architectureEdges, architectureNodes, requestSteps } from "@/data/sneaky-architecture";
import { initialRequestFlow, requestFlowReducer } from "@/lib/request-flow.mjs";
import styles from "./SneakyArchitecture.module.css";

export function SneakyArchitecture() {
  const [selected, setSelected] = useState<(typeof architectureNodes)[number]["id"]>("client");
  const [reduced, setReduced] = useState(true);
  const [flow, dispatch] = useReducer(requestFlowReducer, initialRequestFlow);
  const rootRef = useRef<HTMLElement>(null);
  const id = useId().replace(/:/g, "");
  const step = requestSteps[flow.step];
  const inspected = architectureNodes.find((node) => node.id === selected)!;
  const path = step.edge ? architectureEdges[step.edge] : null;
  const count = requestSteps.length;
  const active = flow.phase !== "idle";

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(preference.matches);
    update();
    preference.addEventListener("change", update);
    return () => preference.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (flow.phase !== "playing") return;
    const timer = window.setTimeout(() => dispatch({ type: "tick", count }), 1800);
    return () => window.clearTimeout(timer);
  }, [flow.phase, flow.step, count]);

  useEffect(() => {
    const pause = () => dispatch({ type: "pause", count });
    const visibility = () => {
      if (document.hidden) pause();
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) pause();
      },
      { threshold: 0 }
    );
    if (rootRef.current) observer.observe(rootRef.current);
    document.addEventListener("visibilitychange", visibility);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", visibility);
    };
  }, [count]);

  return (
    <section ref={rootRef} className={styles.architecture} aria-labelledby={`${id}-title`}>
      <div className={styles.header}>
        <div>
          <p className={styles.eyebrow}>System walkthrough</p>
          <h4 id={`${id}-title`} className={styles.title}>
            Inside Sneaky’s recommendation feed
          </h4>
        </div>
        <span className={styles.badge}>Cache-hit example</span>
      </div>
      <p className={styles.intro}>
        Core path: React Client → Spring Boot API → PostgreSQL. Inspect a component, then follow one
        feed request. Solid connections show the read path; dashed connections show supporting or
        optional work.
      </p>
      <div className={styles.diagram}>
        <svg
          className={styles.connections}
          viewBox="0 0 900 400"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs>
            <marker
              id={`${id}-arrow`}
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="5"
              markerHeight="5"
              orient="auto-start-reverse"
            >
              <path d="M0 0L10 5L0 10z" fill="currentColor" />
            </marker>
          </defs>
          {Object.entries(architectureEdges).map(([key, d]) => (
            <path
              key={key}
              d={d}
              className={styles.edge}
              data-support={["scoring", "events", "refresh", "rerank"].includes(key)}
              markerEnd={`url(#${id}-arrow)`}
            />
          ))}
          {active && path && (
            <path d={path} className={styles.activeEdge} markerEnd={`url(#${id}-arrow)`} />
          )}
          {flow.phase === "playing" && !reduced && path && (
            <circle key={flow.step} r="4" className={styles.packet}>
              <animateMotion dur="1.2s" path={path} fill="freeze" />
            </circle>
          )}
        </svg>
        <ul className={styles.nodes} aria-label="Sneaky architecture components">
          {architectureNodes.map((node) => (
            <li
              key={node.id}
              className={styles.nodePosition}
              style={{ "--node-x": `${node.x}%`, "--node-y": `${node.y}%` } as CSSProperties}
            >
              <button
                className={styles.node}
                type="button"
                aria-pressed={selected === node.id}
                aria-describedby={`${id}-description-${node.id}`}
                data-flow={active && step.node === node.id}
                data-optional={node.id === "ml"}
                onPointerEnter={(event) => {
                  if (event.pointerType === "mouse") setSelected(node.id);
                }}
                onFocus={() => setSelected(node.id)}
                onClick={() => setSelected(node.id)}
              >
                <span>{node.name}</span>
                <small>{node.category}</small>
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className={styles.inspector}>
        <p className={styles.inspectorLabel}>Inspect / {inspected.name}</p>
        {architectureNodes.map((node) => (
          <p key={node.id} id={`${id}-description-${node.id}`} hidden={node.id !== selected}>
            {node.description}
          </p>
        ))}
      </div>
      <div className={styles.controls}>
        <button
          className={styles.play}
          type="button"
          disabled={flow.phase === "playing"}
          onClick={() => dispatch({ type: "play", count })}
        >
          <FiPlay aria-hidden="true" />
          Play Request Flow
        </button>
        {(flow.phase === "playing" || flow.phase === "paused") && (
          <button
            className={styles.action}
            type="button"
            onClick={() => dispatch({ type: flow.phase === "playing" ? "pause" : "resume", count })}
          >
            {flow.phase === "playing" ? (
              <FiPause aria-hidden="true" />
            ) : (
              <FiPlay aria-hidden="true" />
            )}
            {flow.phase === "playing" ? "Pause" : "Resume"}
          </button>
        )}
        <button
          className={styles.action}
          type="button"
          disabled={!active}
          onClick={() => dispatch({ type: "reset", count })}
        >
          <FiRotateCcw aria-hidden="true" />
          Reset
        </button>
        <span className={styles.motionNote}>
          {reduced
            ? "Reduced motion: static step highlights"
            : "Illustrative pacing · no network requests"}
        </span>
      </div>
      <ol className={styles.steps} aria-label="Request sequence; select any step to inspect it">
        {requestSteps.map((item, index) => (
          <li key={item.title}>
            <button
              type="button"
              aria-current={active && flow.step === index ? "step" : undefined}
              onClick={() => dispatch({ type: "select", step: index, count })}
            >
              <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
              {item.title}
            </button>
          </li>
        ))}
      </ol>
      <div className={styles.readout}>
        <p className={styles.inspectorLabel} role="status" aria-live="polite" aria-atomic="true">
          {flow.phase === "idle"
            ? "Ready to trace a request"
            : `${flow.phase === "complete" ? "Complete" : flow.phase === "paused" ? "Paused" : "Tracing"} · ${flow.step + 1}/${count} · ${step.title}`}
        </p>
        <p>{step.detail}</p>
      </div>
      <p className={styles.note}>
        On a cache hit, candidate scoring and optional ML reranking are skipped. On a miss, the API
        falls back to ranking and refreshes Redis. Kafka processes activity asynchronously; it is
        not a required hop in this read request.
      </p>
    </section>
  );
}
