"use client";

import { useEffect, useId, useRef, useState } from "react";
import { FiInfo } from "react-icons/fi";
import { engineeringSnapshot } from "@/data/engineering-snapshot";
import style from "./Stats.module.css";

type Metric = (typeof engineeringSnapshot)[number];

function MetricCard({ metric }: { metric: Metric }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const id = useId();

  useEffect(() => {
    if (!open) return;
    const dismiss = (event: PointerEvent) => {
      if (event.target instanceof Node && !ref.current?.contains(event.target)) setOpen(false);
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", dismiss, { passive: true });
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", dismiss);
      document.removeEventListener("keydown", escape);
    };
  }, [open]);

  return (
    <div
      ref={ref}
      className={style.metric}
      data-open={open}
      onPointerEnter={(event) => {
        if (event.pointerType === "mouse") setOpen(true);
      }}
      onPointerLeave={() => {
        if (!ref.current?.contains(document.activeElement)) setOpen(false);
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          setOpen(false);
          event.stopPropagation();
        }
      }}
    >
      <button
        type="button"
        className={style.card}
        data-interactive-surface="lift"
        aria-expanded={open}
        aria-controls={id}
        aria-describedby={id}
        onFocus={() => setOpen(true)}
        onClick={() => setOpen(true)}
      >
        <span className={style.project}>
          {metric.project}
          <FiInfo aria-hidden="true" />
        </span>
        <span className={style.value}>{metric.value}</span>
        <span className={style.label}>{metric.label}</span>
      </button>
      <p id={id} className={style.context} hidden={!open}>
        {metric.context}
      </p>
    </div>
  );
}

export function Stats() {
  return (
    <section
      id="engineering-snapshot"
      className={style.snapshot}
      aria-labelledby="snapshot-heading"
    >
      <div className={style.header}>
        <h2 id="snapshot-heading" className={style.heading}>
          Engineering Snapshot
        </h2>
        <p className={style.hint}>
          Production scope <span aria-hidden="true">/</span> Inspect for context
        </p>
      </div>
      <ul
        className={style.grid}
        data-motion="stagger-list"
        data-motion-child-pattern="number-reveal"
      >
        {engineeringSnapshot.map((metric) => (
          <li key={metric.id} className={style.item}>
            <MetricCard metric={metric} />
          </li>
        ))}
      </ul>
    </section>
  );
}
