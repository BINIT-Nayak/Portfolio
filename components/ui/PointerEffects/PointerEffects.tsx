"use client";

import { useEffect, useRef } from "react";
import styles from "./PointerEffects.module.css";

const DESKTOP_POINTER = "(min-width: 1024px) and (hover: hover) and (pointer: fine)";

/** One delegated controller for every opted-in surface; no pointer-driven React state. */
export function PointerEffects() {
  const spotlightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const spotlight = spotlightRef.current;
    if (!spotlight) return;
    const root = document.documentElement;
    const desktop = window.matchMedia(DESKTOP_POINTER);
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const coarsePointer = window.matchMedia("(any-pointer: coarse)");
    let detach: (() => void) | undefined;

    const configure = () => {
      detach?.();
      detach = undefined;
      delete root.dataset.pointerEffects;
      // Touch-capable hybrids deliberately get the quiet, static experience too.
      if (
        !desktop.matches ||
        reducedMotion.matches ||
        coarsePointer.matches ||
        navigator.maxTouchPoints > 0
      )
        return;
      root.dataset.pointerEffects = "enabled";
      let frame = 0;
      let x = 0;
      let y = 0;
      let visible = false;
      let current: HTMLElement | null = null;
      let next: HTMLElement | null = null;
      let rect: DOMRect | null = null;
      let geometryDirty = true;
      const resizeObserver = new ResizeObserver(() => {
        geometryDirty = true;
      });

      const clearSurface = (surface: HTMLElement | null) => {
        if (!surface) return;
        delete surface.dataset.pointerActive;
        surface.style.removeProperty("--pointer-x");
        surface.style.removeProperty("--pointer-y");
      };
      const reset = () => {
        cancelAnimationFrame(frame);
        frame = 0;
        visible = false;
        spotlight.dataset.visible = "false";
        clearSurface(current);
        current = next = null;
        rect = null;
        geometryDirty = true;
        resizeObserver.disconnect();
      };
      const flush = () => {
        frame = 0;
        if (!visible || document.hidden) return;
        if (next && !next.isConnected) next = null;
        const changed = current !== next;
        // Geometry reads happen before any style writes, and only on invalidation.
        const measured = next && (changed || geometryDirty) ? next.getBoundingClientRect() : rect;
        if (changed) {
          clearSurface(current);
          resizeObserver.disconnect();
          current = next;
          if (current) resizeObserver.observe(current);
        }
        rect = measured;
        geometryDirty = false;
        spotlight.style.setProperty("--spotlight-x", `${x}px`);
        spotlight.style.setProperty("--spotlight-y", `${y}px`);
        spotlight.dataset.visible = "true";
        if (current && rect) {
          current.style.setProperty("--pointer-x", `${x - rect.left}px`);
          current.style.setProperty("--pointer-y", `${y - rect.top}px`);
          current.dataset.pointerActive = "true";
        }
      };
      const move = (event: PointerEvent) => {
        const target = event.target instanceof Element ? event.target : null;
        if (event.pointerType !== "mouse" || target?.closest('dialog, [aria-modal="true"]')) {
          reset();
          return;
        }
        x = event.clientX;
        y = event.clientY;
        visible = true;
        next = target?.closest<HTMLElement>('[data-interactive-surface="highlight"]') ?? null;
        if (!frame) frame = requestAnimationFrame(flush);
      };
      const leave = (event: PointerEvent) => {
        if (!event.relatedTarget) reset();
      };
      // Hide on scroll rather than chasing a stale target under a stationary cursor.
      const scroll = () => reset();
      const invalidate = () => {
        geometryDirty = true;
      };
      const visibility = () => {
        if (document.hidden) reset();
      };
      const keyboard = (event: KeyboardEvent) => {
        if (event.key === "Tab" || event.key === "Escape") reset();
      };

      window.addEventListener("pointermove", move, { passive: true });
      window.addEventListener("pointerout", leave, { passive: true });
      window.addEventListener("blur", reset);
      window.addEventListener("resize", invalidate, { passive: true });
      window.addEventListener("scroll", scroll, { passive: true, capture: true });
      document.addEventListener("visibilitychange", visibility);
      document.addEventListener("keydown", keyboard);
      detach = () => {
        reset();
        spotlight.style.removeProperty("--spotlight-x");
        spotlight.style.removeProperty("--spotlight-y");
        window.removeEventListener("pointermove", move);
        window.removeEventListener("pointerout", leave);
        window.removeEventListener("blur", reset);
        window.removeEventListener("resize", invalidate);
        window.removeEventListener("scroll", scroll, true);
        document.removeEventListener("visibilitychange", visibility);
        document.removeEventListener("keydown", keyboard);
      };
    };

    configure();
    desktop.addEventListener("change", configure);
    reducedMotion.addEventListener("change", configure);
    coarsePointer.addEventListener("change", configure);
    return () => {
      detach?.();
      delete root.dataset.pointerEffects;
      desktop.removeEventListener("change", configure);
      reducedMotion.removeEventListener("change", configure);
      coarsePointer.removeEventListener("change", configure);
    };
  }, []);

  return (
    <div ref={spotlightRef} className={styles.spotlight} aria-hidden="true" data-visible="false" />
  );
}
