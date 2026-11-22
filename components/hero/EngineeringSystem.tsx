"use client";

import { useEffect, useId, useRef, useState, type CSSProperties } from "react";
import { FiActivity, FiBox, FiCpu, FiDatabase, FiLayers, FiPause, FiPlay } from "react-icons/fi";
import styles from "./EngineeringSystem.module.css";

const nodes = [
  {
    name: "UI",
    label: "Interaction",
    icon: FiLayers,
    explanation: "React turns user intent into responsive, accessible interactions.",
  },
  {
    name: "State",
    label: "Coordination",
    icon: FiBox,
    explanation: "Explicit state transitions keep events, data, and visual feedback in sync.",
  },
  {
    name: "Web Worker",
    label: "Off-thread work",
    icon: FiCpu,
    explanation: "Move expensive processing off the main thread so the interface stays responsive.",
  },
  {
    name: "WebSocket",
    label: "Event transport",
    icon: FiActivity,
    explanation: "Exchange live events with the server, with reconnect and recovery paths.",
  },
  {
    name: "Backend",
    label: "Source of truth",
    icon: FiDatabase,
    explanation:
      "Spring Boot services coordinate durable data, caching, and event-driven workflows.",
  },
];

/** CSS owns the animation clock; React updates only on explicit node/control interaction. */
export function EngineeringSystem() {
  const [selected, setSelected] = useState(0);
  const [paused, setPaused] = useState(true);
  const rootRef = useRef<HTMLElement>(null);
  const id = useId();

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    let visible = false;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      root.dataset.running = String(visible && !document.hidden && !preference.matches && !paused);
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        update();
      },
      { threshold: 0.15 }
    );
    observer.observe(root);
    document.addEventListener("visibilitychange", update);
    preference.addEventListener("change", update);
    update();
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", update);
      preference.removeEventListener("change", update);
      root.dataset.running = "false";
    };
  }, [paused]);

  return (
    <figure
      ref={rootRef}
      className={styles.system}
      data-running="false"
      aria-labelledby={`${id}-title`}
    >
      <figcaption className={styles.header}>
        <span className={styles.title} id={`${id}-title`}>
          <span aria-hidden="true">01 / </span>Inside the interface
        </span>
        <button
          type="button"
          className={styles.pause}
          aria-label={paused ? "Play event animation" : "Pause event animation"}
          aria-pressed={paused}
          onClick={() => setPaused((value) => !value)}
        >
          {paused ? <FiPlay aria-hidden="true" /> : <FiPause aria-hidden="true" />}
        </button>
        <span className={styles.reducedLabel}>Motion reduced</span>
      </figcaption>
      <p className={styles.hint}>Five layers. One connected experience.</p>
      <ol
        className={styles.nodes}
        aria-label="Illustrative system layers, from interface to backend"
      >
        {nodes.map((node, index) => {
          const Icon = node.icon;
          return (
            <li className={styles.step} key={node.name}>
              <button
                type="button"
                className={styles.node}
                aria-pressed={selected === index}
                aria-describedby={`${id}-detail-${index}`}
                onPointerEnter={(event) => {
                  if (event.pointerType === "mouse") setSelected(index);
                }}
                onFocus={() => setSelected(index)}
                onClick={() => setSelected(index)}
              >
                <span className={styles.nodeIcon}>
                  <Icon aria-hidden="true" />
                </span>
                <span className={styles.nodeName}>{node.name}</span>
                <span className={styles.nodeLabel}>{node.label}</span>
                <span className={styles.nodeIndex} aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </button>
              {index < nodes.length - 1 && (
                <svg
                  className={styles.connector}
                  viewBox="0 0 24 28"
                  width="24"
                  height="28"
                  aria-hidden="true"
                  style={{ "--packet-delay": `${index * 700}ms` } as CSSProperties}
                >
                  <path className={styles.track} d="M12 0V27M9 24l3 3 3-3" />
                  <circle className={styles.packet} cx="12" cy="3" r="2.5" />
                </svg>
              )}
            </li>
          );
        })}
      </ol>
      <div className={styles.inspector}>
        <p className={styles.inspectorLabel}>
          Inspect a layer <span>Hover · focus · tap</span>
        </p>
        {nodes.map((node, index) => (
          <p
            key={node.name}
            id={`${id}-detail-${index}`}
            className={styles.explanation}
            hidden={selected !== index}
          >
            <strong>{node.name}.</strong> {node.explanation}
          </p>
        ))}
      </div>
      <p className={styles.caption}>Illustrative event flow · not a live connection</p>
    </figure>
  );
}
