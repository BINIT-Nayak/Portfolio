import { FiArrowUpRight, FiGithub, FiLinkedin, FiMail } from "react-icons/fi";
import { CopyEmail } from "./CopyEmail";
import style from "./Footer.module.css";

const EMAIL = "binitnayak48@gmail.com";

export const Footer = () => (
  <footer
    role="contentinfo"
    className={style.footer}
    id="contact"
    data-tour-target="contact"
    aria-labelledby="contact-heading"
  >
    <div className={style.panel}>
      <p className={style.eyebrow}>Let’s work together</p>
      <h2 className={style.heading} id="contact-heading">
        Have an interesting <span>problem to solve?</span>
      </h2>
      <div className={style.details}>
        <p className={style.description}>
          I’m open to Frontend Engineer, Product Engineer, and Full-Stack Engineer opportunities.
          Let’s build thoughtful products, responsive interfaces, and systems that hold up in
          production.
        </p>
        <div className={style.connections}>
          <div className={style.actions} role="group" aria-label="Contact links">
            <a className={style.primary} href={`mailto:${EMAIL}`}>
              <FiMail aria-hidden="true" /> Email me <FiArrowUpRight aria-hidden="true" />
            </a>
            <a
              className={style.action}
              href="https://www.linkedin.com/in/binitnayak2002/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn (opens in a new tab)"
            >
              <FiLinkedin aria-hidden="true" /> LinkedIn
            </a>
            <a
              className={style.action}
              href="https://github.com/BINIT-Nayak"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub (opens in a new tab)"
            >
              <FiGithub aria-hidden="true" /> GitHub
            </a>
          </div>
          <CopyEmail email={EMAIL} />
        </div>
      </div>
    </div>
    <div className={style.signature}>
      <span>
        Binit Nayak <span aria-hidden="true">/</span> Frontend &amp; Full-Stack Engineer
      </span>
      <span>Hyderabad, India</span>
    </div>
  </footer>
);
