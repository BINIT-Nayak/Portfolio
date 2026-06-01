"use client";

import { useEffect, useRef } from "react";
import { FaArrowDown } from "react-icons/fa6";

import style from "./Hero.module.css";

export const ScrollExploreIcon = () => {
  const iconRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const element = iconRef.current;
    if (!element) return;

    let frameId = 0;
    const start = performance.now();

    const animate = (time: number) => {
      const elapsed = (time - start) / 1000;
      const orbitX = Math.cos(elapsed * 2.4) * 9;
      const orbitY = Math.sin(elapsed * 2.4) * 9;
      const arrowY = Math.sin(elapsed * 3.2) * 4;
      const glow = 0.55 + (Math.sin(elapsed * 2.1) + 1) * 0.22;

      element.style.setProperty("--orbit-x", `${orbitX.toFixed(2)}px`);
      element.style.setProperty("--orbit-y", `${orbitY.toFixed(2)}px`);
      element.style.setProperty("--arrow-y", `${arrowY.toFixed(2)}px`);
      element.style.setProperty("--glow", glow.toFixed(2));

      frameId = requestAnimationFrame(animate);
    };

    frameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(frameId);
  }, []);

  return (
    <span
      ref={iconRef}
      className={style.hero__scroll_icon}
      aria-hidden="true"
    >
      <span className={style.hero__scroll_icon_ring} />
      <span className={style.hero__scroll_icon_dot} />
      <FaArrowDown className={style.hero__scroll_icon_arrow} />
    </span>
  );
};
