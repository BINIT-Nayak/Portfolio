import type { ReactNode } from "react";

import style from "./Button.module.css";

export const Button = ({
  title,
  icon,
  position,
  handleClick,
  otherClasses,
  href,
}: {
  title: string;
  icon: ReactNode;
  position: string;
  handleClick?: () => void;
  otherClasses?: string;
  href?: string;
}) => {
  const content = (
    <>
      <span className={style.button__shimmer} />

      <span className={`${style.button__content} ${otherClasses ?? ""}`}>
        {position === "left" && icon}
        {title}
        {position === "right" && icon}
      </span>
    </>
  );

  if (href) {
    return (
      <a className={style.button} href={href}>
        {content}
      </a>
    );
  }

  return (
    <button className={style.button} onClick={handleClick}>
      {content}
    </button>
  );
};
