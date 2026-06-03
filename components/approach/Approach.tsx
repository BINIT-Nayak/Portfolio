import { APPROACH_STEPS } from "./constants";

import style from "./Approach.module.css";

export const Approach = () => {
  return (
    <section className={style.approach}>
      <div className={style.approach__header}>
        <h1 className={style.approach__heading}>
          My Engineering <span className={style.approach__heading__highlight}>Approach</span>
        </h1>
      </div>

      <div className={style.approach__cards_container}>
        {APPROACH_STEPS.map((step) => (
          <article className={style.approach__card} key={step.number}>
            <p className={style.approach__number}>{step.number}</p>
            <h2 className={style.approach__title}>{step.title}</h2>
            <p className={style.approach__description}>{step.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
};
