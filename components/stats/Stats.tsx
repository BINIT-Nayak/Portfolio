import style from "./Stats.module.css";

const stats = [
  {
    value: "2+",
    label: "Years",
    detail: "Production Experience",
  },
  {
    value: "10+",
    label: "Features",
    detail: "Shipped to Production",
  },
  {
    value: "50+",
    label: "Code Reviews",
    detail: "Improving Quality",
  },
  {
    value: "350+",
    label: "DSA Problems",
    detail: "Solved",
  },
];

export const Stats = () => {
  return (
    <section className={style.stats} aria-label="Professional stats">
      <div className={style.stats__grid}>
        {stats.map((stat) => (
          <div className={style.stats__item} key={stat.label}>
            <p className={style.stats__value}>{stat.value}</p>
            <p className={style.stats__label}>{stat.label}</p>
            <p className={style.stats__detail}>{stat.detail}</p>
          </div>
        ))}
      </div>
    </section>
  );
};
