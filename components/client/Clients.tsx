import style from "./Clients.module.css";

const strengths = [
  {
    title: "Production UI Ownership",
    description:
      "Build responsive React interfaces, animation-heavy flows, and real-time user experiences across desktop, tablet, and mobile layouts.",
  },
  {
    title: "Reusable Frontend Architecture",
    description:
      "Create shared components, typed contracts, scalable state patterns, and maintainable UI structures that teams can extend safely.",
  },
  {
    title: "Product-First Problem Solving",
    description:
      "Clarify user flows, business rules, design expectations, and edge cases before turning requirements into reliable product behavior.",
  },
  {
    title: "Full-Stack Product Development",
    description:
      "Connect frontend experiences with APIs, data models, caching, authentication, and product workflows across modern web platforms.",
  },
  {
    title: "Quality & Review Discipline",
    description:
      "Use testing, manual QA, debugging, merge-request reviews, and regression-focused validation to keep releases stable.",
  },
  {
    title: "Cross-Functional Delivery",
    description:
      "Collaborate with Product, Design, QA, Backend, Framework, and streaming teams to resolve edge cases and ship production features.",
  },
];

export const Clients = () => {
  return (
    <section id="what-i-bring" className={style.clients}>
      <div className={style.clients__header}>
        <h1 className={style.clients__heading}>
          What I <span className={style.clients__heading__highlight}>Bring</span>
        </h1>
        <p className={style.clients__intro}>
          Practical engineering strengths shaped by production UI ownership, full-stack product
          building, reusable architecture, and disciplined delivery.
        </p>
      </div>

      <div className={style.clients__grid}>
        {strengths.map((strength, index) => (
          <article className={style.clients__card} key={strength.title}>
            <span className={style.clients__number}>{String(index + 1).padStart(2, "0")}</span>
            <div>
              <h2 className={style.clients__title}>{strength.title}</h2>
              <p className={style.clients__description}>{strength.description}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};
