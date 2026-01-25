"use client";

import { FaLocationArrow } from "react-icons/fa6";

import { projects } from "@/data";
import { PinContainer } from "../ui/Pin";

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
          <div className={style.recent_projects__card} key={item.id}>
            <PinContainer
              title="github.com/BINIT-Nayak"
              href="https://github.com/BINIT-Nayak"
            >
              <div className={style.recent_projects__image_container}>
                <div className={style.recent_projects__image_wrapper}>
                  <img src="/assests/bg.png" alt="bgimg" />
                </div>
                <img
                  src={item.img}
                  alt="cover"
                  className={style.recent_projects__image}
                />
              </div>

              <h1 className={style.recent_projects__title}>{item.title}</h1>

              <p className={style.recent_projects__description}>{item.des}</p>

              <div className={style.recent_projects__footer}>
                <div className={style.recent_projects__icon_container}>
                  {item.iconLists.map((icon, index) => (
                    <div
                      key={index}
                      className={style.recent_projects__icon_item}
                      style={{
                        transform: `translateX(-${5 * index + 2}px)`,
                      }}
                    >
                      <img
                        src={icon}
                        alt="icon5"
                        className={style.recent_projects__icon_image}
                      />
                    </div>
                  ))}
                </div>

                <a href={item.link}>
                  <div className={style.recent_projects__link_section}>
                    <p className={style.recent_projects__link_text}>
                      Check Repository
                    </p>
                    <FaLocationArrow
                      className={style.recent_projects__link_icon}
                    />
                  </div>
                </a>
              </div>
            </PinContainer>
          </div>
        ))}
      </div>
    </div>
  );
};
