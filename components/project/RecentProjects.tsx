"use client";

import { FaLocationArrow } from "react-icons/fa6";

import { projects } from "@/data";
import { PinContainer } from "../ui/Pin";
import style from "./RecentProjects.module.css";

const RecentProjects = () => {
  return (
    <div className={style.container} id="projects">
      <h1 className="heading">
        A small selection of{" "}
        <span className="text-purple">recent projects</span>
      </h1>
      <div className={style.wrapper}>
        {projects.map((item) => (
          <div className={style.projectCard} key={item.id}>
            <PinContainer
              title="github.com/BINIT-Nayak"
              href="https://github.com/BINIT-Nayak"
            >
              <div className={style.imageContainer}>
                <div className={style.imageWrapper}>
                  <img src="/assests/bg.png" alt="bgimg" />
                </div>
                <img
                  src={item.img}
                  alt="cover"
                  className={style.projectImage}
                />
              </div>

              <h1 className={style.title}>{item.title}</h1>

              <p className={style.description}>{item.des}</p>

              <div className={style.footer}>
                <div className={style.iconContainer}>
                  {item.iconLists.map((icon, index) => (
                    <div
                      key={index}
                      className={style.iconItem}
                      style={{
                        transform: `translateX(-${5 * index + 2}px)`,
                      }}
                    >
                      <img src={icon} alt="icon5" className="p-2" />
                    </div>
                  ))}
                </div>

                <a href={item.link}>
                  <div className={style.linkSection}>
                    <p className={style.linkText}>Check Repository</p>
                    <FaLocationArrow className={style.linkIcon} />
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

export default RecentProjects;
