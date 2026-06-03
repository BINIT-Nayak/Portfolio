"use client";

import Image from "next/image";
import { FaLocationArrow } from "react-icons/fa6";

import { projects } from "@/data";

import style from "./RecentProjects.module.css";

const openCaseStudy = (href: string) => {
  const caseStudyId = href.replace("#case-study-", "");
  window.dispatchEvent(new CustomEvent("open-case-study", { detail: caseStudyId }));
};

export const RecentProjects = () => {
  return (
    <div className={style.recent_projects} id="projects">
      <h1 className={style.recent_projects__heading}>
        Featured <span className={style.recent_projects__heading__highlight}>projects</span>
      </h1>
      <div className={style.recent_projects__wrapper}>
        {projects.map((item) => (
          <article
            className={`${style.recent_projects__card} ${
              item.featured ? style.recent_projects__card_featured : ""
            }`}
            key={item.id}
          >
            <div className={style.recent_projects__cardInner}>
              <div className={style.recent_projects__image_container}>
                <div className={style.recent_projects__image_wrapper}>
                  <Image
                    src="/assests/bg.png"
                    alt=""
                    fill
                    sizes="(min-width: 640px) 24rem, 80vw"
                    className={style.recent_projects__background_image}
                  />
                </div>
                <Image
                  src={item.img}
                  alt={`${item.title} project preview`}
                  fill
                  sizes="(min-width: 640px) 24rem, 80vw"
                  className={style.recent_projects__image}
                />
              </div>

              <div className={style.recent_projects__body}>
                <p className={style.recent_projects__eyebrow}>Featured Project</p>
                <h1 className={style.recent_projects__title}>{item.title}</h1>
                <p className={style.recent_projects__subtitle}>{item.subtitle}</p>

                <p className={style.recent_projects__description}>{item.des}</p>

                <div className={style.recent_projects__tech_stack}>
                  {item.techStack.map((tech) => (
                    <span className={style.recent_projects__tech} key={tech}>
                      {tech}
                    </span>
                  ))}
                </div>

                <ul className={style.recent_projects__highlights}>
                  {item.highlights.map((highlight) => (
                    <li className={style.recent_projects__highlight} key={highlight}>
                      {highlight}
                    </li>
                  ))}
                </ul>

                <div className={style.recent_projects__actions}>
                  {item.actions.map((action) =>
                    action.disabled ? (
                      <span
                        aria-disabled="true"
                        className={`${style.recent_projects__action} ${style.recent_projects__action_disabled}`}
                        key={action.label}
                        title="Live demo coming soon"
                      >
                        {action.label}
                      </span>
                    ) : action.href.startsWith("#case-study-") ? (
                      <button
                        className={style.recent_projects__action}
                        key={action.label}
                        type="button"
                        onClick={() => openCaseStudy(action.href)}
                      >
                        {action.label}
                        <FaLocationArrow className={style.recent_projects__link_icon} />
                      </button>
                    ) : (
                      <a
                        className={style.recent_projects__action}
                        href={action.href}
                        key={action.label}
                        target={action.href.startsWith("http") ? "_blank" : undefined}
                        rel={action.href.startsWith("http") ? "noopener noreferrer" : undefined}
                      >
                        {action.label}
                        <FaLocationArrow className={style.recent_projects__link_icon} />
                      </a>
                    )
                  )}
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};
