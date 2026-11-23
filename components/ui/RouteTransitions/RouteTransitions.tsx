"use client";

import { useEffect, useLayoutEffect, useRef, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { isRouteChange } from "@/lib/route-transitions.mjs";
import styles from "./RouteTransitions.module.css";

type Snapshot = { content: HTMLElement; top: number; left: number; width: number; created: number };

/** Navigation stays owned by Next/browser. Only a detached, inert visual copy exits. */
export function RouteTransitions({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const root = useRef<HTMLDivElement>(null);
  const previousPath = useRef(pathname);
  const snapshot = useRef<Snapshot | null>(null);
  const cleanup = useRef<() => void>(() => {});

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let expiry: ReturnType<typeof setTimeout>;
    const capture = () => {
      clearTimeout(expiry);
      snapshot.current = null;
      const element = root.current;
      if (!element || preference.matches || !element.animate) return;
      const rect = element.getBoundingClientRect();
      const content = element.cloneNode(true) as HTMLElement;
      content.setAttribute("aria-hidden", "true");
      content.inert = true;
      content.querySelectorAll("[id]").forEach((node) => node.removeAttribute("id"));
      content.querySelectorAll("script, iframe, video, audio").forEach((node) => node.remove());
      // Canvas pixels are not copied by cloneNode; preserve their current visual frame.
      const originalCanvases = element.querySelectorAll("canvas");
      content.querySelectorAll("canvas").forEach((canvas, index) => {
        try {
          canvas.getContext("2d")?.drawImage(originalCanvases[index], 0, 0);
        } catch {
          /* Static text remains available. */
        }
      });
      snapshot.current = {
        content,
        top: rect.top,
        left: rect.left,
        width: rect.width,
        created: performance.now(),
      };
      // Bound detached DOM retention if a click is cancelled or navigation fails.
      expiry = setTimeout(() => {
        snapshot.current = null;
      }, 15000);
    };
    const click = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.altKey ||
        event.shiftKey
      )
        return;
      const anchor =
        event.target instanceof Element ? event.target.closest<HTMLAnchorElement>("a[href]") : null;
      if (
        !anchor ||
        anchor.hasAttribute("download") ||
        (anchor.target && anchor.target !== "_self")
      )
        return;
      if (isRouteChange(anchor.href, window.location.href)) capture();
    };
    const pop = () => {
      // The URL is already updated, while React still shows the outgoing route.
      if (window.location.pathname !== previousPath.current) capture();
    };
    const programmatic = (event: Event) => {
      if (isRouteChange((event as CustomEvent<string>).detail, window.location.href)) capture();
    };
    const stop = () => {
      if (preference.matches) {
        snapshot.current = null;
        cleanup.current();
      }
    };
    document.addEventListener("click", click, true);
    window.addEventListener("popstate", pop, true);
    window.addEventListener("portfolio:route-start", programmatic);
    preference.addEventListener("change", stop);
    return () => {
      clearTimeout(expiry);
      snapshot.current = null;
      cleanup.current();
      document.removeEventListener("click", click, true);
      window.removeEventListener("popstate", pop, true);
      window.removeEventListener("portfolio:route-start", programmatic);
      preference.removeEventListener("change", stop);
    };
  }, []);

  useLayoutEffect(() => {
    if (pathname === previousPath.current) return;
    previousPath.current = pathname;
    cleanup.current();
    const outgoing = snapshot.current;
    snapshot.current = null;
    const element = root.current;
    if (
      !element ||
      !element.animate ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    const tokens = getComputedStyle(element);
    const duration = parseFloat(tokens.getPropertyValue("--duration-normal")) || 180;
    const easing = tokens.getPropertyValue("--ease-standard").trim() || "ease-out";
    const compact = window.matchMedia("(max-width: 767px)").matches;
    const enter = element.animate(
      [
        { opacity: 0, transform: compact ? "none" : "translateY(var(--motion-distance-small))" },
        { opacity: 1, transform: compact ? "none" : "translateY(0)" },
      ],
      { duration, easing }
    );
    let layer: HTMLDivElement | undefined;
    let exit: Animation | undefined;
    if (outgoing && performance.now() - outgoing.created < 15000) {
      layer = document.createElement("div");
      layer.className = styles.snapshot;
      layer.setAttribute("aria-hidden", "true");
      layer.inert = true;
      Object.assign(outgoing.content.style, {
        position: "absolute",
        top: `${outgoing.top}px`,
        left: `${outgoing.left}px`,
        width: `${outgoing.width}px`,
        margin: "0",
      });
      layer.append(outgoing.content);
      document.body.append(layer);
      exit = layer.animate([{ opacity: 1 }, { opacity: 0 }], { duration, easing });
      exit.onfinish = () => layer?.remove();
    }
    cleanup.current = () => {
      enter.cancel();
      exit?.cancel();
      layer?.remove();
    };
    return () => cleanup.current();
  }, [pathname]);

  return (
    <div ref={root} className={styles.content} data-route-content>
      {children}
    </div>
  );
}
