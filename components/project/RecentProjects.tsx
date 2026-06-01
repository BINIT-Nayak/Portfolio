"use client";

import Image from "next/image";
import { FaLocationArrow } from "react-icons/fa6";

import { projects } from "@/data";

import style from "./RecentProjects.module.css";

export const RecentProjects = () => {
  return (
    <div className={style.recent_projects} id="projects">
      <h1 className={style.recent_projects__heading}>
        A small selection of{" "}
        <span className={style.recent_projects__heading__highlight}>
          recent projects
        </span>
      </h1>
      <div className={style.recent_projects__wrapper}>
        {projects.map((item) => (
          <article className={style.recent_projects__card} key={item.id}>
            <a
              className={style.recent_projects__cardLink}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
            >
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
                <h1 className={style.recent_projects__title}>{item.title}</h1>

                <p className={style.recent_projects__description}>{item.des}</p>

                <div className={style.recent_projects__footer}>
                  <div className={style.recent_projects__icon_container}>
                    {item.iconLists.map((icon) => (
                      <div key={icon} className={style.recent_projects__icon_item}>
                        <Image
                          src={icon}
                          alt=""
                          width={40}
                          height={40}
                          className={style.recent_projects__icon_image}
                        />
                      </div>
                    ))}
                  </div>

                  <div className={style.recent_projects__link_section}>
                    <p className={style.recent_projects__link_text}>
                      Check Repository
                    </p>
                    <FaLocationArrow
                      className={style.recent_projects__link_icon}
                    />
                  </div>
                </div>
              </div>
            </a>
          </article>
        ))}
      </div>
    </div>
  );
};
