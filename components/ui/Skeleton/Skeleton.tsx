import { cn } from "@/lib/utils";
import styles from "./Skeleton.module.css";

type SkeletonProps = {
  variant?: "line" | "title" | "media" | "avatar";
  className?: string;
};

/** Decorative placeholder; put aria-busy and a status label on the loading region. */
export function Skeleton({ variant = "line", className }: SkeletonProps) {
  return <span aria-hidden="true" className={cn(styles.skeleton, styles[variant], className)} />;
}
