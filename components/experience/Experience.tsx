import Image from "next/image";
import { workExperience } from "@/data";
import { Button } from "../ui/MovingBorders/MovingBorders";

import style from "./Experience.module.css";

export const Experience = () => {
  return (
    <div className={style.experience} id="experience">
      <h1 className={style.experience__heading}>
        My <span className={style.experience__heading__highlight}>work experience</span>
      </h1>

      <div className={style.experience__grid}>
        {workExperience.map((card) => (
          <Button
            key={card.id}
            duration={12000 + card.id * 1200}
            className={style.experience__card}
          >
            <div className={style.experience__card_content}>
              <div className={style.experience__image_container}>
                <div className={style.experience__image_frame}>
                  <Image
                    src={card.thumbnail}
                    alt=""
                    width={128}
                    height={128}
                    className={style.experience__image}
                  />
                </div>
                <div>
                  <h1 className={style.experience__title}>{card.title}</h1>
                  <div className={style.experience__meta}>
                    <p className={style.experience__company}>{card.company}</p>
                    <p className={style.experience__period}>{card.period}</p>
                  </div>
                </div>
              </div>
              <div className={style.experience__text_content}>
                <ul className={style.experience__highlights}>
                  {card.highlights.map((highlight) => (
                    <li className={style.experience__highlight} key={highlight}>
                      {highlight}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
};
