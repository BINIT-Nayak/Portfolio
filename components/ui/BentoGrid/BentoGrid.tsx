"use client";

import Image from "next/image";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import styles from "./BentoGrid.module.css";

import GridGlobe from "../GridGlobe";

type BentoGridItemProps = {
  className?: string;
  id: number;
  title?: string | ReactNode;
  description?: string | ReactNode;
  img?: string;
  imgClassName?: string;
  titleClassName?: string;
  spareImg?: string;
};

const techStackItems = [
  "React",
  "TypeScript",
  "JavaScript",
  "Python",
  "Redux",
  "Next.js",
  "Java",
  "Spring Boot",
  "PostgreSQL",
  "Redis",
  "Kafka",
  "Docker",
  "Jest",
];

export const BentoGrid = ({
  className,
  children,
}: {
  className?: string;
  children?: ReactNode;
}) => {
  return <div className={cn(styles.bentoGrid, className)}>{children}</div>;
};

export const BentoGridItem = ({
  className,
  id,
  title,
  description,
  img,
  imgClassName,
  titleClassName,
  spareImg,
}: BentoGridItemProps) => {
  return (
    <div className={cn(styles.bentoGridItem, className)}>
      <div
        className={
          id === 6 ? styles.bentoGridItem__container_flex : styles.bentoGridItem__container
        }
      >
        <div className={styles.bentoGridItem__imageWrapper}>
          {img && (
            <Image
              src={img}
              alt={typeof title === "string" ? title : "Portfolio feature image"}
              fill
              sizes="(min-width: 1024px) 60vw, 100vw"
              className={cn(styles.bentoGridItem__image, imgClassName)}
            />
          )}
        </div>
        <div
          className={
            id === 5
              ? styles.bentoGridItem__spareImageWrapper_full
              : styles.bentoGridItem__spareImageWrapper
          }
        >
          {spareImg && (
            <Image
              src={spareImg}
              alt=""
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className={styles.bentoGridItem__spareImage}
            />
          )}
        </div>
        <div className={cn(styles.bentoGridItem__titleSection, titleClassName)}>
          <div className={styles.bentoGridItem__description}>{description}</div>
          <div
            className={cn(
              styles.bentoGridItem__title,
              titleClassName?.includes("title-black") && styles.bentoGridItem__title_black
            )}
          >
            {title}
          </div>

          {id === 2 && <GridGlobe />}

          {id === 5 && (
            <div className={styles.bentoGridItem__techStack}>
              {techStackItems.map((item) => (
                <span key={item} className={styles.bentoGridItem__techStackItem}>
                  {item}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
