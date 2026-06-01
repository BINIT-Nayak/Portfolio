import Image from "next/image";
import { workExperience } from "@/data";
import { Button } from "../ui/MovingBorders/MovingBorders";

import style from "./Experience.module.css";

export const Experience = () => {
  return (
    <div className={style.experience} id="experience">
      <h1 className={style.experience__heading}>
        My{" "}
        <span className={style.experience__heading__highlight}>
          work experience
        </span>
      </h1>

      <div className={style.experience__grid}>
        {workExperience.map((card) => (
          <Button
            key={card.id}
            duration={12000 + card.id * 1200}
            className={style.experience__card}
          >
            <div className={style.experience__card_content}>
              <Image
                src={card.thumbnail}
                alt=""
                width={128}
                height={128}
                className={style.experience__image}
              />
              <div className={style.experience__text_content}>
                <h1 className={style.experience__title}>{card.title}</h1>
                <p className={style.experience__company}>{card.company}</p>
                <p className={style.experience__description}>{card.desc}</p>
              </div>
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
};
