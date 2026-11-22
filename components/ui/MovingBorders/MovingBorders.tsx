import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import styles from "./MovingBorders.module.css";

/** Legacy API retained without the decorative perpetual border animation. */
export function Button({
  children,
  as: Component = "button",
  containerClassName,
  className,
  borderRadius: _borderRadius,
  borderClassName: _borderClassName,
  duration: _duration,
  ...otherProps
}: {
  children: ReactNode;
  as?: any;
  containerClassName?: string;
  className?: string;
  borderRadius?: string;
  borderClassName?: string;
  duration?: number;
  [key: string]: any;
}) {
  return (
    <Component className={cn(styles.button, containerClassName, className)} {...otherProps}>
      {children}
    </Component>
  );
}

/** Deprecated decorative slot; consumers should use semantic borders and shared motion. */
export const MovingBorder = (_props: {
  children: ReactNode;
  borderRadius?: string;
  duration?: number;
  [key: string]: any;
}) => null;
