import Image from "next/image";
import { EngineeringToolbox } from "@/components/toolbox/EngineeringToolbox";
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
  if (id === 5) return <EngineeringToolbox />;
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
        </div>
      </div>
    </div>
  );
};
