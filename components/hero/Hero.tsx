import { TourButton } from "@/components/tour/PortfolioTour";
import { FiArrowDownRight, FiArrowUpRight, FiGithub } from "react-icons/fi";
import { EngineeringSystem } from "./EngineeringSystem";
import style from "./Hero.module.css";

export const Hero = () => (
  <section className={style.hero} aria-labelledby="hero-heading">
    <div className={style.copy} data-tour-target="identity">
      <div className={style.identity}>
        <p className={style.name}>Binit Nayak</p>
        <p className={style.role}>Frontend / Full-Stack Engineer</p>
      </div>
      <h1 id="hero-heading" className={style.statement}>
        I build interfaces that <span>behave like systems.</span>
      </h1>
      <p className={style.description}>
        Scalable React applications. Real-time UI. Frontend architecture built for performance. I
        bring these together through full-stack product development, from the first interaction to
        the backend that powers it.
      </p>
      <div className={style.actions} role="group" aria-label="Explore my work">
        <a className={style.primaryAction} href="#projects">
          View My Work <FiArrowDownRight aria-hidden="true" />
        </a>
        <a className={style.action} href="#case-studies">
          Explore Engineering <FiArrowUpRight aria-hidden="true" />
        </a>
        <a
          className={style.github}
          href="https://github.com/BINIT-Nayak"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FiGithub aria-hidden="true" />
          GitHub<span className={style.srOnly}> (opens in a new tab)</span>
        </a>
      </div>
      <TourButton />
      <p className={style.status}>
        <span className={style.statusDot} aria-hidden="true" />
        Building production frontend systems · Hyderabad, India
      </p>
    </div>
    <EngineeringSystem />
  </section>
);
