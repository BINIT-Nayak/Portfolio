"use client";
import { cn } from "@/lib/utils";
import {
  motion,
  useAnimationFrame,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./MovingBorders.module.css";

export function Button({
  borderRadius = "0.5rem",
  children,
  as: Component = "button",
  containerClassName,
  borderClassName,
  duration,
  className,
  ...otherProps
}: {
  borderRadius?: string;
  children: React.ReactNode;
  as?: any;
  containerClassName?: string;
  borderClassName?: string;
  duration?: number;
  className?: string;
  [key: string]: any;
}) {
  return (
    <Component
      className={cn(styles.movingBorderButton, containerClassName)}
      style={{
        borderRadius: borderRadius,
      }}
      {...otherProps}
    >
      <div
        className={styles.movingBorderButton__borderContainer}
        style={{ borderRadius: `calc(${borderRadius} * 0.96)` }}
      >
        <MovingBorder borderRadius={borderRadius} duration={duration}>
          <div className={cn(styles.movingBorderButton__borderGradient, borderClassName)} />
        </MovingBorder>
      </div>

      <div
        className={cn(styles.movingBorderButton__content, className)}
        style={{
          borderRadius: `calc(${borderRadius} * 0.96)`,
        }}
      >
        {children}
      </div>
    </Component>
  );
}

export const MovingBorder = ({
  children,
  borderRadius = "0.5rem",
  duration = 2000,
  ...otherProps
}: {
  children: React.ReactNode;
  borderRadius?: string;
  duration?: number;
  [key: string]: any;
}) => {
  const pathRef = useRef<SVGPathElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const progress = useMotionValue<number>(0);
  const [isVisible, setIsVisible] = useState(false);
  const [size, setSize] = useState({ height: 0, width: 0 });

  useEffect(() => {
    const svg = svgRef.current;

    if (!svg) {
      return;
    }

    const updateSize = () => {
      const rect = svg.getBoundingClientRect();
      setSize({ height: rect.height, width: rect.width });
    };

    updateSize();

    const resizeObserver = new ResizeObserver(updateSize);
    resizeObserver.observe(svg);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    const svg = svgRef.current;

    if (!svg) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      {
        rootMargin: "120px",
        threshold: 0.01,
      }
    );

    observer.observe(svg);

    return () => {
      observer.disconnect();
    };
  }, []);

  const radius = useMemo(() => {
    if (borderRadius.endsWith("rem")) {
      return Number.parseFloat(borderRadius) * 16;
    }

    if (borderRadius.endsWith("px")) {
      return Number.parseFloat(borderRadius);
    }

    return Number.parseFloat(borderRadius) || 8;
  }, [borderRadius]);

  const path = useMemo(() => {
    const inset = 1;
    const width = Math.max(size.width - inset * 2, 0);
    const height = Math.max(size.height - inset * 2, 0);

    if (!width || !height) {
      return "";
    }

    const r = Math.min(radius, width / 2, height / 2);
    const x = inset;
    const y = inset;
    const right = x + width;
    const bottom = y + height;

    return [
      `M ${x + r} ${y}`,
      `H ${right - r}`,
      `Q ${right} ${y} ${right} ${y + r}`,
      `V ${bottom - r}`,
      `Q ${right} ${bottom} ${right - r} ${bottom}`,
      `H ${x + r}`,
      `Q ${x} ${bottom} ${x} ${bottom - r}`,
      `V ${y + r}`,
      `Q ${x} ${y} ${x + r} ${y}`,
      "Z",
    ].join(" ");
  }, [radius, size.height, size.width]);

  useAnimationFrame((time) => {
    if (prefersReducedMotion || !isVisible) {
      return;
    }

    const length = pathRef.current?.getTotalLength();
    if (length) {
      const pxPerMillisecond = length / duration;
      progress.set((time * pxPerMillisecond) % length);
    }
  });

  const x = useTransform(progress, (val) => pathRef.current?.getPointAtLength(val).x);
  const y = useTransform(progress, (val) => pathRef.current?.getPointAtLength(val).y);

  const transform = useMotionTemplate`translateX(${x}px) translateY(${y}px) translateX(-50%) translateY(-50%)`;

  return (
    <>
      <svg
        ref={svgRef}
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        className={styles.movingBorder__svg}
        width="100%"
        height="100%"
        {...otherProps}
      >
        {path && <path d={path} fill="none" ref={pathRef} />}
      </svg>
      <motion.div
        className={cn(
          styles.movingBorder__indicator,
          prefersReducedMotion && styles.movingBorder__indicator_reducedMotion
        )}
        style={{
          transform,
        }}
      >
        {children}
      </motion.div>
    </>
  );
};
