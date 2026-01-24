import { ReactNode } from "react";
import style from "./Button.module.css";

export const Button = ({
  title,
  icon,
  position,
  handleClick,
  otherClasses,
}: {
  title: string;
  icon: ReactNode;
  position: string;
  handleClick?: () => void;
  otherClasses?: string;
}) => {
  return (
    <button className={style.button} onClick={handleClick}>
      <span className={style.shimmer} />

      <span className={`${style.button__content} ${otherClasses}`}>
        {position === "left" && icon}
        {title}
        {position === "right" && icon}
      </span>
    </button>
  );
};
