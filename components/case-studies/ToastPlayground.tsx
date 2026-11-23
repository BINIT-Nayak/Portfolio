"use client";

import { useEffect, useId, useMemo, useReducer, useRef, useState } from "react";
import { createToastBus, emptyToasts, toastReducer } from "@/lib/toast-playground.mjs";
import styles from "./ToastPlayground.module.css";

type ToastType = "success" | "info" | "warning" | "critical";
const examples: { type: ToastType; label: string; message: string }[] = [
  { type: "success", label: "Success Toast", message: "Bet placed" },
  { type: "info", label: "Info Toast", message: "A new round is starting" },
  { type: "warning", label: "Warning Toast", message: "Betting closes soon" },
  {
    type: "critical",
    label: "Critical Message",
    message: "Connection lost. Waiting to reconnect.",
  },
];

export function ToastPlayground() {
  const id = useId();
  const bus = useMemo(createToastBus, []);
  const sequence = useRef(0);
  const controls = useRef<HTMLDivElement>(null);
  const [state, dispatch] = useReducer(toastReducer, undefined, emptyToasts);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [paused, setPaused] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [example, setExample] = useState(examples[0]);
  const suspended = hovered || focused || paused || hidden || state.critical.length > 0;

  useEffect(() => bus.subscribe((toast) => dispatch({ type: "publish", toast })), [bus]);
  useEffect(() => {
    const update = () => setHidden(document.hidden);
    update();
    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, []);
  useEffect(() => {
    if (suspended || !state.visible.length) return;
    let previous = performance.now();
    const timer = window.setInterval(() => {
      const now = performance.now();
      dispatch({ type: "tick", elapsed: now - previous });
      previous = now;
    }, 250);
    return () => window.clearInterval(timer);
  }, [suspended, state.visible.length]);

  const publish = (item: (typeof examples)[number]) => {
    setExample(item);
    bus.publish("toast", {
      id: ++sequence.current,
      type: item.type,
      message: item.message,
      remaining: 6000,
    });
  };
  const dismiss = (toastId: number) => {
    // Move focus before removing a focused dismiss button.
    controls.current?.querySelector<HTMLButtonElement>("button")?.focus();
    dispatch({ type: "dismiss", id: toastId });
  };

  return (
    <section className={styles.root} aria-labelledby={`${id}-title`}>
      <p className={styles.eyebrow}>Isolated notification playground</p>
      <h3 id={`${id}-title`}>Publish once. Coordinate feedback centrally.</h3>
      <p className={styles.intro}>
        Features publish intent; one subscriber owns presentation, priority, queueing, and cleanup.
        Unlike disconnected popups, every producer follows the same lifecycle rules.
      </p>
      <div className={styles.controls} ref={controls}>
        {examples.map((item) => (
          <button
            type="button"
            className={styles.action}
            key={item.type}
            onClick={() => publish(item)}
          >
            {item.label}
          </button>
        ))}
        <button
          type="button"
          className={styles.primary}
          onClick={() => {
            [examples[0], examples[1], examples[2], examples[0], examples[1]].forEach(publish);
          }}
        >
          Stack Multiple
        </button>
      </div>
      <div className={styles.controls}>
        <button
          type="button"
          className={styles.action}
          onClick={() => setPaused((value) => !value)}
        >
          {paused ? "Resume timers" : "Pause timers"}
        </button>
        <button
          type="button"
          className={styles.action}
          onClick={() => {
            dispatch({ type: "reset" });
            setPaused(false);
          }}
        >
          Clear playground
        </button>
      </div>
      <div className={styles.layout}>
        <div>
          <p className={styles.route}>Producer → local Pub/Sub → queue → toast stack</p>
          <pre className={styles.code} role="group" aria-label="Conceptual publish API">
            <code>{`publish("toast", {\n  type: "${example.type}",\n  message: "${example.message}"\n})`}</code>
          </pre>
          <p className={styles.caption}>
            Conceptual example only. This demo uses its own in-memory event bus; it does not connect
            to production services or portfolio notifications.
          </p>
          <h4>Demo lifecycle rules</h4>
          <ul className={styles.rules}>
            <li>Three visible standard messages. Overflow waits in arrival order.</li>
            <li>Standard messages expire after six active seconds; queued time does not count.</li>
            <li>
              Critical messages interrupt timers without deleting the stack. Dismiss all critical
              messages to resume.
            </li>
            <li>Hover, keyboard focus, a hidden tab, or Pause timers suspends expiry.</li>
          </ul>
        </div>
        <div
          className={styles.preview}
          onPointerEnter={(e) => {
            if (e.pointerType === "mouse") setHovered(true);
          }}
          onPointerLeave={() => setHovered(false)}
          onFocusCapture={() => setFocused(true)}
          onBlurCapture={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setFocused(false);
          }}
        >
          <div className={styles.previewHeader}>
            <h4>Notification surface</h4>
            <span>
              {state.visible.length}/3 visible · {state.queue.length} queued
            </span>
          </div>
          <p className={styles.caption}>
            {suspended ? "Timers paused" : "Timers running when messages are visible"}
          </p>
          <ul className={styles.stack} aria-label="Visible demo notifications">
            {[...state.critical, ...state.visible].map((toast) => (
              <li
                className={styles.toast}
                data-motion-enter="fade-up"
                data-type={toast.type}
                key={toast.id}
              >
                <div>
                  <span className={styles.kind}>{toast.type}</span>
                  <p>{toast.message}</p>
                  <small>
                    {toast.type === "critical"
                      ? "Persistent · dismiss to continue"
                      : `${Math.ceil(toast.remaining / 1000)}s active time remaining`}
                  </small>
                </div>
                <button
                  type="button"
                  className={styles.dismiss}
                  aria-label={`Dismiss ${toast.type}: ${toast.message}`}
                  onClick={() => dismiss(toast.id)}
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
          {!state.visible.length && !state.critical.length && (
            <p className={styles.empty}>
              Publish an event to see the shared notification lifecycle.
            </p>
          )}
          {state.queue.length > 0 && (
            <details className={styles.queue}>
              <summary>Waiting queue ({state.queue.length})</summary>
              <ol>
                {state.queue.map((toast) => (
                  <li key={toast.id}>{toast.message}</li>
                ))}
              </ol>
            </details>
          )}
        </div>
      </div>
      <p className={styles.status} role="status" aria-live="polite" aria-atomic="true">
        {state.notice}
      </p>
    </section>
  );
}
