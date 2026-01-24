import { workExperience } from "@/data";
import { Button } from "../ui/MovingBorders";
import style from "./Experience.module.css";

const Experience = () => {
  return (
    <div className={style.container} id="experience">
      <h1 className="heading">
        My <span className="text-purple">work experience</span>
      </h1>

      <div className={style.gridContainer}>
        {workExperience.map((card) => (
          <Button
            key={card.id}
            duration={Math.floor(Math.random() * 10000) + 10000}
            borderRadius="1.75rem"
            style={{
              //   you can generate the color from here https://cssgradient.io/
              background: "rgb(4,7,29)",
              backgroundColor:
                "linear-gradient(90deg, rgba(4,7,29,1) 0%, rgba(12,14,35,1) 100%)",
              borderRadius: `calc(1.75rem* 0.96)`,
            }}
            className="flex-1 text-black dark:text-white border-neutral-200 dark:border-slate-800"
          >
            <div className={style.cardContent}>
              <img
                src={card.thumbnail}
                alt={card.thumbnail}
                className={style.image}
              />
              <div className={style.textContent}>
                <h1 className={style.title}>{card.title}</h1>
                <p className={style.company}>{card.company}</p>
                <p className={style.description}>{card.desc}</p>
              </div>
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default Experience;
