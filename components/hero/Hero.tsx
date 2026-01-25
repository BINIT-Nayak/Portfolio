import { FaLocationArrow } from "react-icons/fa6";

import { Button } from "../button/Button";
import { Spotlight } from "../ui/Spotlight";
import { TextGenerateEffect } from "../ui/TextGenerateEffect";
import style from "./Hero.module.css";

const Hero = () => {
  return (
    <div className={style.container}>
      <div>
        <Spotlight
          className="-top-40 -left-10 md:-left-32 md:-top-20 h-screen"
          fill="white"
        />
        <Spotlight
          className="h-[80vh] w-[50vw] top-10 left-full"
          fill="purple"
        />
        <Spotlight className="left-80 top-28 h-[80vh] w-[50vw]" fill="blue" />
      </div>

      <div className={style.backgroundGrid}>
        <div className={style.gradientMask} />
      </div>

      <div className={style.contentWrapper}>
        <div className={style.contentBox}>
          <p className={style.tagline}>Unleash the Magic with me</p>

          <TextGenerateEffect
            words="Transforming Concepts into Seamless User Experiences"
            className="text-center text-[40px] md:text-5xl lg:text-6xl"
          />

          <p className={style.description}>
            Hi! I&apos;m Binit, a Software Developer based in India.
          </p>

          <a href="#experience">
            <Button
              title="Show my work"
              icon={<FaLocationArrow />}
              position="right"
            />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Hero;
