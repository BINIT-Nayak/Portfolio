"use client";

import { useEffect, useRef, useState } from "react";
import { FiArrowDownRight, FiChevronDown } from "react-icons/fi";
import { workExperience } from "@/data";
import { getCareerPosition } from "@/lib/career-timeline.mjs";
import style from "./Experience.module.css";

export function Experience() {
  const [active, setActive] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const railRef = useRef<HTMLElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = sectionRef.current;
    const rail = railRef.current;
    if (!root || !rail) return;
    const panels = Array.from(root.querySelectorAll<HTMLElement>("[data-career-panel]"));
    const dots = Array.from(rail.querySelectorAll<HTMLElement>("[data-career-dot]"));
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let railDirty = true;
    const update = () => {
      frame = 0;
      if (document.body.style.position === "fixed") return;
      const activationLine = Math.max(112, Math.min(window.innerHeight * 0.3, 240));
      const position = getCareerPosition(
        panels.map((panel) => panel.getBoundingClientRect().top),
        activationLine
      );
      // Read all geometry before writing transforms or CSS properties.
      const bounds = railDirty ? rail.getBoundingClientRect() : null;
      const first = railDirty ? dots[0]?.getBoundingClientRect() : null;
      const last = railDirty ? dots.at(-1)?.getBoundingClientRect() : null;
      setActive(position.active);
      if (bounds && first && last) {
        rail.style.setProperty("--rail-top", `${first.top + first.height / 2 - bounds.top}px`);
        rail.style.setProperty(
          "--rail-length",
          `${last.top + last.height / 2 - first.top - first.height / 2}px`
        );
        railDirty = false;
      }
      if (progressRef.current) {
        const progress = motion.matches
          ? position.active / Math.max(1, panels.length - 1)
          : position.progress;
        progressRef.current.style.transform = `scaleY(${progress})`;
      }
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const resize = () => {
      railDirty = true;
      schedule();
    };
    const observer = new ResizeObserver(resize);
    observer.observe(root);
    observer.observe(rail);
    panels.forEach((panel) => observer.observe(panel));
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", resize);
    motion.addEventListener("change", schedule);
    update();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", resize);
      motion.removeEventListener("change", schedule);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="experience"
      data-tour-target="experience"
      className={style.experience}
      aria-labelledby="experience-heading"
    >
      <div className={style.header}>
        <h2 id="experience-heading" className={style.heading}>
          Career, in systems.
        </h2>
        <p className={style.intro}>
          From shared components to production ownership at Arrise Solutions.
        </p>
      </div>
      <div className={style.layout}>
        <nav ref={railRef} className={style.rail} aria-label="Career timeline">
          <p className={style.railLabel}>
            Experience <span>2024 — Present</span>
          </p>
          <ol className={style.steps}>
            {workExperience.map((role, index) => (
              <li
                key={role.id}
                className={style.step}
                data-current={active === index}
                data-complete={active > index}
              >
                <a
                  className={style.stepLink}
                  href={`#career-${role.slug}`}
                  aria-current={active === index ? "step" : undefined}
                >
                  <span className={style.dot} data-career-dot aria-hidden="true" />
                  <span className={style.stepCopy}>
                    <span className={style.stepDate}>{role.period}</span>
                    <span className={style.stepTitle}>{role.title}</span>
                  </span>
                  <FiArrowDownRight className={style.stepArrow} aria-hidden="true" />
                </a>
              </li>
            ))}
          </ol>
          <span className={style.track} aria-hidden="true">
            <span ref={progressRef} className={style.progress} />
          </span>
          <p className={style.railHint}>Scroll to explore, or select a role.</p>
        </nav>
        <div className={style.panels}>
          {workExperience.map((role, index) => (
            <article
              key={role.id}
              id={`career-${role.slug}`}
              className={style.panel}
              data-career-panel
              data-active={active === index}
              aria-labelledby={`career-title-${role.id}`}
            >
              <div className={style.panelHeader}>
                <p className={style.chapter}>
                  <span>
                    {String(index + 1).padStart(2, "0")} /{" "}
                    {String(workExperience.length).padStart(2, "0")}
                  </span>
                  {role.endDate === null && <span className={style.current}>Current role</span>}
                </p>
                <h3 id={`career-title-${role.id}`} className={style.title}>
                  {role.title}
                </h3>
                <div className={style.meta}>
                  <p className={style.company}>{role.company}</p>
                  <p className={style.dates}>
                    <time dateTime={role.startDate}>{role.period.split(" – ")[0]}</time>
                    <span> – </span>
                    {role.endDate ? (
                      <time dateTime={role.endDate}>{role.period.split(" – ")[1]}</time>
                    ) : (
                      "Present"
                    )}
                  </p>
                </div>
              </div>
              <div className={style.body} data-motion="section-reveal">
                <ul className={style.highlights}>
                  {role.highlights.map((highlight) => (
                    <li key={highlight}>{highlight}</li>
                  ))}
                </ul>
                <div className={style.systems}>
                  <h4 className={style.systemsLabel}>Selected systems &amp; features</h4>
                  <ul>
                    {role.systems.map((system) => (
                      <li key={system}>{system}</li>
                    ))}
                  </ul>
                </div>
                <ul className={style.tags} aria-label="Technologies">
                  {role.technologies.map((technology) => (
                    <li className={style.tag} key={technology}>
                      {technology}
                    </li>
                  ))}
                </ul>
                <details className={style.additional}>
                  <summary>
                    View additional contributions
                    <FiChevronDown aria-hidden="true" />
                  </summary>
                  <ul>
                    {role.additionalContributions.map((contribution) => (
                      <li key={contribution}>{contribution}</li>
                    ))}
                  </ul>
                </details>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
