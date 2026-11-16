import Image from "next/image";
import type { ShowcaseProject } from "@/data/projects";
import styles from "./RecentProjects.module.css";

export function ProjectPreview({ project }: { project: ShowcaseProject }) {
  return (
    <figure className={styles.preview}>
      <div className={styles.stage}>
        <div className={styles.window}>
          <div className={styles.windowBar} aria-hidden="true">
            <span className={styles.windowDots}>
              <i />
              <i />
              <i />
            </span>
            <span>
              {project.title.toLowerCase()} /{" "}
              {project.layout === "journal" ? "prototype" : "product"}
            </span>
            <span className={styles.windowIndex}>↗</span>
          </div>
          <Image
            src={project.img}
            alt={project.imageAlt}
            width={project.imageWidth}
            height={project.imageHeight}
            sizes={
              project.layout === "flagship"
                ? "(min-width: 1280px) 46rem, (min-width: 1024px) 58vw, 92vw"
                : "(min-width: 1280px) 38rem, (min-width: 1024px) 50vw, 92vw"
            }
            className={styles.screenshot}
          />
        </div>
      </div>
      <figcaption className={styles.caption}>{project.imageCaption}</figcaption>
    </figure>
  );
}
