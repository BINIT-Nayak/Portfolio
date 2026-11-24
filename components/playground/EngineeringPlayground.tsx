"use client";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useId, useState } from "react";
import s from "./Playground.module.css";
const loading = () => <p role="status">Loading experiment…</p>;
const WorkerDemo = dynamic(() => import("./WorkerDemo"), { loading });
const EventDemo = dynamic(() => import("./EventDemo"), { loading });
const CacheDemo = dynamic(() => import("./CacheDemo"), { loading });
const SchedulerDemo = dynamic(() => import("./SchedulerDemo"), { loading });
const RecommendationDemo = dynamic(() => import("./RecommendationDemo"), { loading });
const experiments = [
  {
    name: "Web Worker",
    concept: "Keep input responsive",
    Component: WorkerDemo,
    href: "/case-studies/plinko-ui",
    related: "Real-time synchronization",
  },
  {
    name: "Event Driven UI",
    concept: "Publish once, react independently",
    Component: EventDemo,
    href: "/case-studies/toast-messages",
    related: "Shared toast architecture",
  },
  {
    name: "Redis Cache-Aside",
    concept: "Make the read path visible",
    Component: CacheDemo,
    href: "/case-studies/cache-first-recommendation-api",
    related: "Cache-first recommendation API",
  },
  {
    name: "Animation Scheduler",
    concept: "Coordinate a shared timeline",
    Component: SchedulerDemo,
    href: "/labs/comet",
    related: "Comet animation engineering",
  },
  {
    name: "Recommendation Pipeline",
    concept: "Explain how a feed is ordered",
    Component: RecommendationDemo,
    href: "/case-studies/sneaky-recommendation-system",
    related: "Sneaky recommendation architecture",
  },
];
export function EngineeringPlayground({ standalone = false }: { standalone?: boolean }) {
  const [selected, setSelected] = useState(0);
  const id = useId();
  const Heading = standalone ? "h1" : "h2";
  const experiment = experiments[selected];
  const Demo = experiment.Component;
  return (
    <section id="engineering-playground" className={s.section} aria-labelledby={`${id}-heading`}>
      <p className={s.eyebrow}>Observe · interact · understand</p>
      <Heading id={`${id}-heading`} className={s.heading}>
        Engineering Playground
      </Heading>
      <p className={s.intro}>
        Five small experiments in the systems behind an interface. Choose a concept, change an
        input, and inspect what happens. Each is designed to explain one idea in under 30 seconds.
      </p>
      {standalone && <h2>Choose an experiment</h2>}
      <div className={s.selector} role="group" aria-label="Engineering experiments">
        {experiments.map((item, i) => (
          <button
            className={s.action}
            key={item.name}
            aria-pressed={selected === i}
            aria-controls={`${id}-panel`}
            onClick={() => setSelected(i)}
          >
            <span className={s.eyebrow}>0{i + 1}</span>
            <strong>{item.name}</strong>
            <span>{item.concept}</span>
          </button>
        ))}
      </div>
      <div
        id={`${id}-panel`}
        className={s.panel}
        role="region"
        aria-label={`${experiment.name} experiment`}
      >
        <Demo key={selected} />
        <Link className={s.link} href={experiment.href}>
          In practice: {experiment.related} →
        </Link>
      </div>
      {!standalone && (
        <Link className={s.link} href="/playground">
          Open the dedicated playground →
        </Link>
      )}
    </section>
  );
}
