"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/** One observer per route, no hidden initial state and no per-element React state. */
export function ViewportMotion() {
  const pathname = usePathname();
  useEffect(() => {
    const targets = Array.from(
      document.querySelectorAll<HTMLElement>("[data-motion]:not([data-motion-state])")
    );
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!("IntersectionObserver" in window) || preference.matches) {
      targets.forEach((target) => {
        target.dataset.motionState = "complete";
      });
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          observer.unobserve(entry.target);
          (entry.target as HTMLElement).dataset.motionState = "revealed";
        }
      },
      { threshold: 0.15 }
    );
    targets.forEach((target) => observer.observe(target));
    const stop = () => {
      if (!preference.matches) return;
      observer.disconnect();
      targets.forEach((target) => {
        target.dataset.motionState = "complete";
      });
    };
    const finishedChildren = new WeakMap<HTMLElement, Set<HTMLElement>>();
    const finish = (event: AnimationEvent) => {
      if (!event.animationName.startsWith("portfolio-")) return;
      const target = event.target as HTMLElement;
      const group = target.closest<HTMLElement>('[data-motion="stagger-list"]');
      if (group && target.parentElement === group) {
        const completed = finishedChildren.get(group) ?? new Set<HTMLElement>();
        completed.add(target);
        finishedChildren.set(group, completed);
        // Remove animation styles once the whole group finishes, including on resize.
        if (completed.size === group.children.length) group.dataset.motionState = "complete";
      } else if (!group && target.hasAttribute("data-motion")) {
        target.dataset.motionState = "complete";
      }
    };
    preference.addEventListener("change", stop);
    document.addEventListener("animationend", finish);
    return () => {
      observer.disconnect();
      preference.removeEventListener("change", stop);
      document.removeEventListener("animationend", finish);
    };
  }, [pathname]);
  return null;
}
