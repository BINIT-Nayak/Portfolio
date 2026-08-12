import Image from "next/image";

import { socialMedia } from "@/data";

import style from "./Footer.module.css";

const EMAIL = "mailto:binitnayak48@gmail.com";
const RESUME = "/assests/Binit_s_Resume.pdf";
const LINKEDIN = "https://www.linkedin.com/in/binitnayak2002/";
const GITHUB = "https://github.com/BINIT-Nayak";

const contactActions = [{ label: "Email Me", href: EMAIL }];

export const Footer = () => {
  return (
    <footer className={style.footer} id="contact">
      <div className={style.footer__grid_container}>
        <Image
          src="/assests/footer-grid.svg"
          alt="grid"
          fill
          sizes="100vw"
          className={style.footer__grid_image}
        />
      </div>

      <div className={style.footer__main_container}>
        <h1 className={style.footer__heading}>
          Let&apos;s build{" "}
          <span className={style.footer__heading__highlight}>scalable products</span> together.
        </h1>
        <p className={style.footer__description}>
          I&apos;m open to Frontend Engineer, React Developer, and Full-Stack Engineer opportunities
          where I can work on production UI systems, product engineering, and modern web
          applications.
        </p>
        <div className={style.footer__actions}>
          {contactActions.map((action) => {
            const isExternal = action.href.startsWith("http");
            return (
              <a
                className={style.footer__action}
                href={action.href}
                key={action.label}
                target={isExternal ? "_blank" : undefined}
                rel={isExternal ? "noopener noreferrer" : undefined}
              >
                {action.label}
              </a>
            );
          })}
        </div>
      </div>
      <div className={style.footer__bottom_container}>
        <div className={style.footer__social_container}>
          {socialMedia.map((info) => (
            <a
              href={info.link}
              key={info.id}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Visit Binit on ${info.id === 1 ? "GitHub" : info.id === 2 ? "X" : "LinkedIn"}`}
            >
              <div key={info.id} className={style.footer__social_icon}>
                <Image src={info.img} alt="" width={20} height={20} />
              </div>
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};
