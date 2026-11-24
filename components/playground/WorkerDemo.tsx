"use client";
import { useEffect, useRef, useState } from "react";
import { runPrimeJob, PRIME_PASSES } from "@/lib/playground.mjs";
import s from "./Playground.module.css";

export default function WorkerDemo() {
  const [limit, setLimit] = useState(1000000);
  const [running, setRunning] = useState<"main" | "worker" | null>(null);
  const [message, setMessage] = useState(
    "Choose where to count prime numbers. Both paths run the same code."
  );
  const worker = useRef<Worker | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>();
  const pulse = useRef<HTMLSpanElement>(null);
  const [taps, setTaps] = useState(0);
  useEffect(
    () => () => {
      worker.current?.terminate();
      clearTimeout(timer.current);
    },
    []
  );
  useEffect(() => {
    if (!running) return;
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    const start = performance.now();
    const width = Math.max(0, (pulse.current?.parentElement?.clientWidth ?? 12) - 12);
    const tick = (now: number) => {
      if (!preference.matches && pulse.current && !document.hidden)
        pulse.current.style.transform = `translateX(${(((now - start) % 1200) / 1200) * width}px)`;
      frame = requestAnimationFrame(tick);
    };
    if (!preference.matches) frame = requestAnimationFrame(tick);
    const stop = () => {
      if (preference.matches) cancelAnimationFrame(frame);
    };
    preference.addEventListener("change", stop);
    return () => {
      cancelAnimationFrame(frame);
      preference.removeEventListener("change", stop);
    };
  }, [running]);
  const run = (mode: "main" | "worker") => {
    setRunning(mode);
    setMessage(
      `${mode === "main" ? "Main thread" : "Worker"} running. Try the input or responsiveness button.`
    );
    const finish = (count: number, duration: number) => {
      setMessage(
        `${mode === "main" ? "Main thread" : "Worker"}: ${count.toLocaleString()} primes per pass · ${PRIME_PASSES} passes; ${Math.round(duration)} ms measured computation time on this device (excludes worker startup).`
      );
      worker.current?.terminate();
      worker.current = null;
      setRunning(null);
    };
    if (mode === "main") {
      // Give the pending state a paint before intentionally blocking the main thread.
      timer.current = setTimeout(() => {
        const start = performance.now();
        const count = runPrimeJob(limit);
        finish(count, performance.now() - start);
      }, 100);
    } else {
      try {
        const instance = new Worker(new URL("./compute.worker.ts", import.meta.url));
        worker.current = instance;
        instance.onmessage = ({ data }) => {
          if (data.error) {
            setMessage(data.error);
            setRunning(null);
            instance.terminate();
            worker.current = null;
          } else finish(data.count, data.duration);
        };
        instance.onerror = () => {
          instance.terminate();
          worker.current = null;
          setRunning(null);
          setMessage("Worker unavailable in this browser. You can still try the main-thread run.");
        };
        instance.postMessage(limit);
      } catch {
        setRunning(null);
        setMessage("This browser could not start a worker.");
      }
    }
  };
  return (
    <>
      <h3>Keep the interface available while work runs.</h3>
      <p className={s.note}>
        Count primes in eight repeated passes on either thread. The main-thread run deliberately
        blocks input until the batch finishes; the worker runs the same bounded workload off-thread.
        A worker improves responsiveness, not necessarily computation speed.
      </p>
      <div className={s.controls}>
        <label>
          Workload{" "}
          <select
            value={limit}
            disabled={!!running}
            onChange={(e) => setLimit(Number(e.target.value))}
          >
            <option value={500000}>500,000 integers × {PRIME_PASSES}</option>
            <option value={1000000}>1,000,000 integers × {PRIME_PASSES}</option>
            <option value={2000000}>2,000,000 integers × {PRIME_PASSES}</option>
          </select>
        </label>
        <button className={s.action} disabled={!!running} onClick={() => run("main")}>
          Run on main thread
        </button>
        <button className={s.primary} disabled={!!running} onClick={() => run("worker")}>
          Run in worker
        </button>
        <button
          className={s.action}
          disabled={running !== "worker"}
          onClick={() => {
            worker.current?.terminate();
            worker.current = null;
            setRunning(null);
            setMessage("Worker terminated. No background task remains.");
          }}
        >
          Cancel worker
        </button>
      </div>
      <div className={s.controls}>
        <label>
          Try typing <input type="text" placeholder="Is input still responsive?" />
        </label>
        <button className={s.action} onClick={() => setTaps((n) => n + 1)}>
          Responsiveness check · {taps}
        </button>
      </div>
      <div className={s.track} aria-hidden="true">
        <span className={s.pulse} ref={pulse} />
      </div>
      <p className={s.status} role="status">
        {message}
      </p>
      <p className={s.note}>
        The dot is driven by JavaScript animation frames, so it stalls when the main thread is
        blocked. It is disabled with reduced motion. Try the input instead. Results are local
        observations, not benchmark claims; workers communicate by messages and cannot update the
        DOM.
      </p>
    </>
  );
}
