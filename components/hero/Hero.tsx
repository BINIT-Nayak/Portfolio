import { FaCircleArrowDown } from "react-icons/fa6";

import { Button } from "../button/Button";
import { Spotlight } from "../ui/Spotlight";
import { TextGenerateEffect } from "../ui/TextGenerateEffect";

import style from "./Hero.module.css";

export const Hero = () => {
  return (
    <div className={style.hero}>
      <div>
        <Spotlight className={style.hero__spotlight_white} fill="white" />
        <Spotlight className={style.hero__spotlight_purple} fill="purple" />
        <Spotlight className={style.hero__spotlight_blue} fill="blue" />
        <Spotlight
          className={style.hero__spotlight_purple_right}
          fill="purple"
        />
        <Spotlight className={style.hero__spotlight_blue_right} fill="blue" />
      </div>

      <div className={style.hero__background_grid}>
        <div className={style.hero__gradient_mask} />
      </div>

      <div className={style.hero__content_wrapper}>
        <div className={style.hero__content_box}>
          <p className={style.hero__tagline}>Unleash the Magic with me</p>

          <TextGenerateEffect
            words="Transforming Concepts into Seamless User Experiences"
            className={style.hero__text_generate}
          />

          <p className={style.hero__description}>
            Hi! I&apos;m Binit, a Software Developer based in India.
          </p>

          <div style={{ pointerEvents: "none" }}>
            <Button
              title="Scroll Down to Explore"
              icon={
                <div className={style.hero__arrow_icon}>
                  <FaCircleArrowDown />
                </div>
              }
              position="right"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
