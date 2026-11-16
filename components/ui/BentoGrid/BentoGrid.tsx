import Image from "next/image";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import styles from "./BentoGrid.module.css";

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

export const BentoGridItem = ({ id, title, description, img }: BentoGridItemProps) => {
  return (
    <div className={styles.bentoGridItem} data-interactive-surface="lift">
      <div
        className={
          id === 6 ? styles.bentoGridItem__container_flex : styles.bentoGridItem__container
        }
      >
        <div className={styles.bentoGridItem__imageWrapper}>
          {img && id === 1 && (
            <Image
              src={img}
              alt="Binit Nayak"
              fill
              sizes="(min-width: 1280px) 37rem, (min-width: 768px) 46vw, 92vw"
              className={styles.bentoGridItem__image}
            />
          )}
        </div>
        <div className={styles.bentoGridItem__titleSection}>
          <div className={styles.bentoGridItem__description}>{description}</div>
          <div className={styles.bentoGridItem__title}>{title}</div>

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
