import { Button } from "../button/Button";
import { Spotlight } from "../ui/Spotlight";
import { TextGenerateEffect } from "../ui/TextGenerateEffect";
import { ScrollExploreIcon } from "./ScrollExploreIcon";

import style from "./Hero.module.css";

const HERO_LINKS = [
  {
    label: "View Projects",
    href: "#projects",
  },
  {
    label: "Case Studies",
    href: "#case-studies",
  },
  {
    label: "View GitHub",
    href: "https://github.com/BINIT-Nayak",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/binitnayak2002/",
  },
];

export const Hero = () => {
  return (
    <div className={style.hero}>
      <div>
        <Spotlight className={style.hero__spotlight_white} fill="white" />
        <Spotlight className={style.hero__spotlight_purple} fill="purple" />
        <Spotlight className={style.hero__spotlight_blue} fill="blue" />
        <Spotlight className={style.hero__spotlight_purple_right} fill="purple" />
        <Spotlight className={style.hero__spotlight_blue_right} fill="blue" />
      </div>

      <div className={style.hero__background_grid}>
        <div className={style.hero__gradient_mask} />
      </div>

      <div className={style.hero__content_wrapper}>
        <div className={style.hero__content_box}>
          <p className={style.hero__tagline}>Full-Stack Engineer</p>

          <TextGenerateEffect words="Hi, I’m Binit Nayak" className={style.hero__text_generate} />

          <div className={style.hero__copy}>
            <p className={style.hero__lead}>
              Frontend / Full-Stack Engineer building scalable React applications, production-grade
              UI systems, and modern web platforms.
            </p>

            <p className={style.hero__description}>
              Currently building real-time gaming experiences at a Tech giant, where I develop
              responsive interfaces, reusable frontend architecture, and animation-heavy UI.
              Passionate about product engineering, I also build full-stack applications using
              Spring Boot, PostgreSQL, Redis, Kafka, and Docker while continuously exploring cloud
              technologies and AI-assisted engineering workflows.
            </p>
          </div>

          <div className={style.hero__cta_group} aria-label="Primary links">
            {HERO_LINKS.map((link) => {
              const isExternal = link.href.startsWith("http");
              return (
                <a
                  key={link.href}
                  className={style.hero__cta}
                  href={link.href}
                  target={isExternal ? "_blank" : undefined}
                  rel={isExternal ? "noopener noreferrer" : undefined}
                >
                  {link.label}
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
