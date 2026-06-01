import Image from "next/image";
import { FaLocationArrow } from "react-icons/fa6";

import { socialMedia } from "@/data";
import { Button } from "../button/Button";

import style from "./Footer.module.css";

const EMAIL = "mailto:binitnayak48@gmail.com";

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
        {/* TODO: Add heading back */}
        <h1 className={style.footer__heading}>
          Ready to take{" "}
          <span className={style.footer__heading__highlight}>your</span> digital
          presence to the next level?
        </h1>
        <p className={style.footer__description}>
          Reach out to me today and let&apos;s discuss how I can help you
          achieve your goals.
        </p>
        <Button
          title="Let's get in touch"
          icon={<FaLocationArrow />}
          position="right"
          href={EMAIL}
        />
      </div>
      <div className={style.footer__bottom_container}>
        {/* <p className={style.footer__copyright_text}>Copyright © 2024 Binit</p> */}

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
