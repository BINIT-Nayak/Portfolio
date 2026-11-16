import { projects } from "@/data/projects";
import { ProjectActions } from "./ProjectActions";
import { SneakyArchitecture } from "./architecture/SneakyArchitecture";
import { ProjectPreview } from "./ProjectPreview";
import styles from "./RecentProjects.module.css";

export function RecentProjects() {
  return (
    <section className={styles.section} id="projects" aria-labelledby="projects-heading">
      <div className={styles.sectionHeader}>
        <h2 className={styles.heading} id="projects-heading">
          Featured Projects
        </h2>
        <p>Product experiences. Engineering decisions. Working systems.</p>
      </div>
      <div className={styles.showcases}>
        {projects.map((project) => (
          <article
            className={`${styles.showcase} ${styles[project.layout]}`}
            key={project.id}
            aria-labelledby={`project-${project.id}`}
          >
            <header className={styles.projectHeader}>
              <p className={styles.category}>{project.category}</p>
              <h3 id={`project-${project.id}`} className={styles.title}>
                {project.title}
              </h3>
              <p className={styles.subtitle}>{project.subtitle}</p>
              <p className={styles.statement}>{project.statement}</p>
            </header>
            <ProjectPreview project={project} />
            <div className={styles.engineering}>
              <div className={styles.note}>
                <h4 className={styles.noteLabel}>The engineering challenge</h4>
                <p>{project.challenge}</p>
              </div>
              <div className={styles.note}>
                <h4 className={styles.noteLabel}>Architecture</h4>
                <p>{project.architecture}</p>
              </div>
              {project.id === "sneaky" && <SneakyArchitecture />}
              {project.roadmap && (
                <aside className={styles.roadmap}>
                  <h4 className={styles.noteLabel}>On the roadmap</h4>
                  <p>{project.roadmap}</p>
                </aside>
              )}
            </div>
            <dl
              className={styles.capabilities}
              aria-label={`${project.title} concrete capabilities`}
            >
              {project.capabilities.map((capability) => (
                <div key={capability.value}>
                  <dt>{capability.label}</dt>
                  <dd>{capability.value}</dd>
                </div>
              ))}
            </dl>
            <footer className={styles.projectFooter}>
              <ul className={styles.technologies} aria-label={`${project.title} technologies`}>
                {project.techStack.map((tech) => (
                  <li className={styles.tech} key={tech}>
                    {tech}
                  </li>
                ))}
              </ul>
              <ProjectActions actions={project.actions} title={project.title} />
            </footer>
          </article>
        ))}
      </div>
    </section>
  );
}
