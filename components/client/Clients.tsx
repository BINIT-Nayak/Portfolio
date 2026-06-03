import style from "./Clients.module.css";

const strengths = [
  "Production UI Ownership",
  "Reusable Frontend Architecture",
  "Complex Business Logic",
  "Full-Stack Product Development",
  "Cross-functional Collaboration",
  "Code Review Discipline",
];

export const Clients = () => {
  return (
    <section id="what-i-bring" className={style.clients}>
      <div className={style.clients__header}>
        <h1 className={style.clients__heading}>
          What I <span className={style.clients__heading__highlight}>Bring</span>
        </h1>
        <p className={style.clients__intro}>
          Practical engineering strengths shaped by production UI work, full-stack product building,
          and collaborative delivery.
        </p>
      </div>

      <div className={style.clients__grid}>
        {strengths.map((strength, index) => (
          <article className={style.clients__card} key={strength}>
            <span className={style.clients__number}>{String(index + 1).padStart(2, "0")}</span>
            <h2 className={style.clients__title}>{strength}</h2>
          </article>
        ))}
      </div>
    </section>
  );
};
