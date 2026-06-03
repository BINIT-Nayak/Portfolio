"use client";

import { FaArrowDown } from "react-icons/fa6";

import style from "./Hero.module.css";

export const ScrollExploreIcon = () => {
  return (
    <span className={style.hero__scroll_icon} aria-hidden="true">
      <span className={style.hero__scroll_icon_ring} />
      <FaArrowDown className={style.hero__scroll_icon_arrow} />
    </span>
  );
};
