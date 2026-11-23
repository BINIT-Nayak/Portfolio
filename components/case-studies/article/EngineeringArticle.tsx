import Link from "next/link";
import type { ReactNode } from "react";
import type { CaseStudy } from "@/data/case-studies";
import styles from "./EngineeringArticle.module.css";

export function EngineeringArticle({
  study,
  children,
}: {
  study: CaseStudy;
  children?: ReactNode;
}) {
  return (
    <main id="main-content" tabIndex={-1} className={styles.main}>
      <Link className={styles.back} href="/case-studies">
        ← Engineering case studies
      </Link>
      <article>
        <header className={styles.header}>
          <p className={styles.eyebrow}>
            {study.categories[0]} · {study.readTime}
          </p>
          <h1>{study.title}</h1>
          <p className={styles.lead}>{study.summary}</p>
          <ul className={styles.tags} aria-label="Technologies">
            {study.technologies.map((tech) => (
              <li key={tech}>{tech}</li>
            ))}
          </ul>
        </header>
        {children}
        <div className={styles.prose}>
          <section>
            <h2>The problem</h2>
            <p>{study.description}</p>
          </section>
          <section>
            <h2>My contribution</h2>
            <p>{study.role}</p>
          </section>
          <section>
            <h2>How the system works</h2>
            <ol>
              {study.architecture?.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ol>
          </section>
          <section>
            <h2>Failure modes and decisions</h2>
            <ul>
              {study.challengesSolved?.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
          <section>
            <h2>Outcome</h2>
            <p>{study.outcome}</p>
          </section>
          <section>
            <h2>Implementation details and limits</h2>
            <ul>
              {study.details.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
          {study.externalLinks && (
            <nav aria-label="Project sources" className={styles.links}>
              {study.externalLinks.map((link) => (
                <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer">
                  {link.label} ↗
                </a>
              ))}
            </nav>
          )}
        </div>
      </article>
    </main>
  );
}
