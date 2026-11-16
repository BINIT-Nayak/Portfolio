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
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const animations = new Set<Animation>();
    const tokens = getComputedStyle(document.documentElement);
    const duration = Number.parseFloat(tokens.getPropertyValue("--duration-slow")) || 260;
    const easing = tokens.getPropertyValue("--ease-standard").trim() || "ease-out";
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          observer.unobserve(entry.target);
          if (preference.matches) continue;
          // Final numbers are always rendered. Only their containing card enters once.
          const animation = entry.target.animate(
            [
              { opacity: 0.6, transform: "translateY(6px)" },
              { opacity: 1, transform: "translateY(0)" },
            ],
            { duration, easing }
          );
          animations.add(animation);
          animation.onfinish = () => animations.delete(animation);
        }
      },
      { threshold: 0.2 }
    );
    rootRef.current
      ?.querySelectorAll("[data-snapshot-metric]")
      .forEach((card) => observer.observe(card));
    const stopMotion = () => {
      if (preference.matches) {
        animations.forEach((animation) => animation.cancel());
        animations.clear();
      }
    };
    preference.addEventListener("change", stopMotion);
    return () => {
      observer.disconnect();
      preference.removeEventListener("change", stopMotion);
      animations.forEach((animation) => animation.cancel());
    };
  }, []);

  return (
    <section
      ref={rootRef}
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
      <ul className={style.grid}>
        {engineeringSnapshot.map((metric) => (
          <li key={metric.id} className={style.item} data-snapshot-metric>
            <MetricCard metric={metric} />
          </li>
        ))}
      </ul>
    </section>
  );
}
