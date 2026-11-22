"use client";

import { useId, useState } from "react";
import { FiArrowUpRight } from "react-icons/fi";
import { toolboxCategories, toolboxTechnologies } from "@/data/engineering-toolbox";
import styles from "./EngineeringToolbox.module.css";

export function EngineeringToolbox() {
  const [selected, setSelected] = useState("React");
  const id = useId();
  const technology = toolboxTechnologies.find((item) => item.name === selected)!;
  return (
    <section className={styles.root} id="engineering-toolbox" aria-labelledby={`${id}-title`}>
      <p className={styles.eyebrow}>Tools in context</p>
      <h2 id={`${id}-title`} className={styles.heading}>
        Engineering Toolbox
      </h2>
      <p className={styles.intro}>
        Select a technology to see the systems, decisions, and delivery work behind it.
      </p>
      <div className={styles.layout}>
        <div className={styles.categories}>
          {toolboxCategories.map((category) => (
            <fieldset className={styles.category} key={category}>
              <legend>{category}</legend>
              <div className={styles.technologies}>
                {toolboxTechnologies
                  .filter((item) => item.category === category)
                  .map((item) => (
                    <button
                      type="button"
                      key={item.name}
                      className={styles.technology}
                      aria-pressed={selected === item.name}
                      aria-controls={`${id}-evidence`}
                      onClick={() => setSelected(item.name)}
                    >
                      {item.name}
                    </button>
                  ))}
              </div>
            </fieldset>
          ))}
        </div>
        <div
          className={styles.evidence}
          id={`${id}-evidence`}
          role="region"
          aria-labelledby={`${id}-selected`}
        >
          <p className={styles.eyebrow}>Selected / {technology.category}</p>
          <h3 id={`${id}-selected`}>{technology.name}</h3>
          <p className={styles.summary}>{technology.summary}</p>
          <h4 className={styles.usedIn}>Used in</h4>
          {technology.evidence.length ? (
            <ul className={styles.examples}>
              {technology.evidence.map((item) => (
                <li className={styles.example} key={item.title}>
                  {item.href ? (
                    <a
                      className={styles.link}
                      href={item.href}
                      onClick={(event) => {
                        if (
                          !item.studyId ||
                          event.metaKey ||
                          event.ctrlKey ||
                          event.shiftKey ||
                          event.altKey
                        )
                          return;
                        event.preventDefault();
                        window.dispatchEvent(
                          new CustomEvent("open-case-study", { detail: item.studyId })
                        );
                      }}
                    >
                      {item.title}
                      <FiArrowUpRight aria-hidden="true" />
                    </a>
                  ) : (
                    <p className={styles.exampleTitle}>{item.title}</p>
                  )}
                  <p>{item.detail}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className={styles.empty}>
              A specific project example for React Testing Library is not yet documented in this
              portfolio.
            </p>
          )}
        </div>
      </div>
      <p className={styles.status} role="status" aria-live="polite" aria-atomic="true">
        {technology.name}:{" "}
        {technology.evidence.length
          ? `showing ${technology.evidence.length} documented ${technology.evidence.length === 1 ? "connection" : "connections"}.`
          : "No project example documented yet."}
      </p>
    </section>
  );
}
