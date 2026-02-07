"use client";

import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import styles from "./InfiniteCards.module.css";

export const InfiniteMovingCards = ({
  items,
  direction = "left",
  speed = "fast",
  pauseOnHover = true,
  className,
}: {
  items: {
    quote: string;
    name: string;
    title: string;
  }[];
  direction?: "left" | "right";
  speed?: "fast" | "normal" | "slow";
  pauseOnHover?: boolean;
  className?: string;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    addAnimation();
  }, []);
  const [start, setStart] = useState(false);
  function addAnimation() {
    if (containerRef.current && scrollerRef.current) {
      const scrollerContent = Array.from(scrollerRef.current.children);

      scrollerContent.forEach((item) => {
        const duplicatedItem = item.cloneNode(true);
        if (scrollerRef.current) {
          scrollerRef.current.appendChild(duplicatedItem);
        }
      });

      getDirection();
      getSpeed();
      setStart(true);
    }
  }
  const getDirection = () => {
    if (containerRef.current) {
      if (direction === "left") {
        containerRef.current.style.setProperty(
          "--animation-direction",
          "forwards",
        );
      } else {
        containerRef.current.style.setProperty(
          "--animation-direction",
          "reverse",
        );
      }
    }
  };
  const getSpeed = () => {
    if (containerRef.current) {
      if (speed === "fast") {
        containerRef.current.style.setProperty("--animation-duration", "20s");
      } else if (speed === "normal") {
        containerRef.current.style.setProperty("--animation-duration", "40s");
      } else {
        containerRef.current.style.setProperty("--animation-duration", "80s");
      }
    }
  };
  return (
    <div ref={containerRef} className={cn(styles.infiniteCards, className)}>
      <ul
        ref={scrollerRef}
        className={cn(
          styles.infiniteCards__scroller,
          start && styles.infiniteCards__scroller_animate,
          pauseOnHover && styles.infiniteCards__scroller_pausable,
        )}
      >
        {items.map((item, idx) => (
          <li
            key={`${item.name}-${idx}`}
            className={styles.infiniteCards__item}
          >
            <blockquote className={styles.infiniteCards__blockquote}>
              <div className={styles.infiniteCards__hiddenElement}></div>
              <span className={styles.infiniteCards__quote}>{item.quote}</span>
              <div className={styles.infiniteCards__authorSection}>
                <span className={styles.infiniteCards__authorInfo}>
                  <span className={styles.infiniteCards__authorName}>
                    {item.name}
                  </span>
                  <span className={styles.infiniteCards__authorTitle}>
                    {item.title}
                  </span>
                </span>
              </div>
            </blockquote>
          </li>
        ))}
      </ul>
    </div>
  );
};
