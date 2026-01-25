import { FaLocationArrow } from "react-icons/fa6";

import { socialMedia } from "@/data";
import { Button } from "../button/Button";
import style from "./Footer.module.css";

const Footer = () => {
  return (
    <footer className={style.footer} id="contact">
      <div className={style.gridContainer}>
        <img
          src="/assests/footer-grid.svg"
          alt="grid"
          className={style.gridImage}
        />
      </div>

      <div className={style.mainContainer}>
        <h1 className={style.heading}>
          Ready to take <span className="text-purple">your</span> digital
          presence to the next level?
        </h1>
        <p className={style.description}>
          Reach out to me today and let&apos;s discuss how I can help you
          achieve your goals.
        </p>
        <a href="mailto:binitnayak48@gmail.com">
          <Button
            title="Let's get in touch"
            icon={<FaLocationArrow />}
            position="right"
          />
        </a>
      </div>
      <div className={style.bottomContainer}>
        <p className={style.copyrightText}>Copyright © 2024 Binit</p>

        <div className={style.socialContainer}>
          {socialMedia.map((info) => (
            <a href={info.link} key={info.id}>
              <div key={info.id} className={style.socialIcon}>
                <img src={info.img} alt="icons" width={20} height={20} />
              </div>
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
