import { cn } from "@/lib/utils";
import Link from "next/link";
import type { ReactNode } from "react";
import styles from "./FloatingNavbar.module.css";

export const FloatingNav = ({
  navItems,
  className,
}: {
  navItems: {
    name: string;
    link: string;
    icon?: ReactNode;
  }[];
  className?: string;
}) => {
  return (
    <nav className={cn(styles.floatingNav, className)} aria-label="Primary">
      {navItems.map((navItem) => (
        <Link
          key={navItem.link}
          href={navItem.link}
          className={styles.floatingNav__item}
        >
          {navItem.icon && (
            <span className={styles.floatingNav__itemIcon}>{navItem.icon}</span>
          )}
          <span className={styles.floatingNav__itemText}>{navItem.name}</span>
        </Link>
      ))}
    </nav>
  );
};
