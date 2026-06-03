"use client";

import { cn, getResponsiveScale } from "@/lib/utils";
import Link from "next/link";
import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
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
  const [scaleValue, setScaleValue] = useState(1);

  useEffect(() => {
    const updateScale = () => {
      setScaleValue(getResponsiveScale());
    };

    updateScale();
    window.addEventListener("resize", updateScale);

    return () => {
      window.removeEventListener("resize", updateScale);
    };
  }, []);

  return (
    <nav
      className={cn(styles.floatingNav, className)}
      style={{ "--nav-scale": scaleValue } as CSSProperties}
      aria-label="Primary"
    >
      {navItems.map((navItem) => (
        <Link key={navItem.link} href={navItem.link} className={styles.floatingNav__item}>
          {navItem.icon && <span className={styles.floatingNav__itemIcon}>{navItem.icon}</span>}
          <span className={styles.floatingNav__itemText}>{navItem.name}</span>
        </Link>
      ))}
    </nav>
  );
};
