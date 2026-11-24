"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { usePathname, useRouter } from "next/navigation";
import { FiArrowLeft, FiArrowRight, FiCompass, FiX } from "react-icons/fi";
import { portfolioTour } from "@/data/portfolio-tour";
import { announceRouteNavigation } from "@/lib/route-transitions.mjs";
import styles from "./PortfolioTour.module.css";

const TourContext = createContext<(() => void) | null>(null);

export function TourButton() {
  const start = useContext(TourContext);
  return (
    <button type="button" className={styles.start} data-tour-start onClick={() => start?.()}>
      <FiCompass aria-hidden="true" /> Take the quick tour <span>~90 seconds</span>
    </button>
  );
}

export function PortfolioTourProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [index, setIndex] = useState<number | null>(null);
  const [ready, setReady] = useState(false);
  const [missing, setMissing] = useState(false);
  const panel = useRef<HTMLElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const highlighted = useRef<HTMLElement | null>(null);
  const stop = index === null ? null : portfolioTour[index];

  const exit = useCallback((restoreFocus = true) => {
    if (restoreFocus) {
      const target =
        highlighted.current ?? document.querySelector<HTMLElement>("[data-tour-start], main");
      if (target) {
        const previous = target.getAttribute("tabindex");
        target.setAttribute("tabindex", "-1");
        target.focus({ preventScroll: true });
        const restore = () => {
          if (previous === null) target.removeAttribute("tabindex");
          else target.setAttribute("tabindex", previous);
        };
        target.addEventListener("blur", restore, { once: true });
      }
    }
    setIndex(null);
  }, []);

  const explore = () => {
    const target = highlighted.current;
    if (!target) return;
    const previous = target.getAttribute("tabindex");
    target.setAttribute("tabindex", "-1");
    target.focus({ preventScroll: true });
    target.addEventListener(
      "blur",
      () => {
        if (previous === null) target.removeAttribute("tabindex");
        else target.setAttribute("tabindex", previous);
      },
      { once: true }
    );
  };

  const go = useCallback(
    (next: number) => {
      const nextStop = portfolioTour[next];
      if (!nextStop) return;
      if (next === index) {
        heading.current?.focus({ preventScroll: true });
        return;
      }
      setReady(false);
      setMissing(false);
      setIndex(next);
      if (pathname !== nextStop.path) {
        announceRouteNavigation(nextStop.path);
        router.push(nextStop.path, { scroll: false });
      }
    },
    [index, pathname, router]
  );

  // A user navigating elsewhere or opening a modal leaves the tour, not a competing overlay.
  useEffect(() => {
    if (index === null) return;
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !event.defaultPrevented) {
        event.preventDefault();
        exit();
      }
    };
    const history = () => exit(false);
    const link = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      )
        return;
      const anchor =
        event.target instanceof Element ? event.target.closest<HTMLAnchorElement>("a[href]") : null;
      if (anchor && anchor.target !== "_blank") exit(false);
    };
    const observer = new MutationObserver(() => {
      if (document.querySelector("dialog[open]")) exit(false);
    });
    observer.observe(document.body, { subtree: true, attributes: true, attributeFilter: ["open"] });
    window.addEventListener("keydown", escape);
    window.addEventListener("popstate", history);
    document.addEventListener("click", link, true);
    return () => {
      observer.disconnect();
      window.removeEventListener("keydown", escape);
      window.removeEventListener("popstate", history);
      document.removeEventListener("click", link, true);
    };
  }, [index, exit]);

  useEffect(() => {
    if (!stop || pathname !== stop.path) return;
    let completed = false;
    let frame = 0;
    const reveal = () => {
      if (completed) return;
      const target = document.querySelector<HTMLElement>(`[data-tour-target="${stop.target}"]`);
      if (!target) return;
      completed = true;
      observer.disconnect();
      clearTimeout(timeout);
      target.dataset.tourHighlight = "true";
      highlighted.current = target;
      setReady(true);
      frame = requestAnimationFrame(() => {
        target.scrollIntoView({
          block: "start",
          behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
            ? "instant"
            : "smooth",
        });
        heading.current?.focus({ preventScroll: true });
      });
    };
    const observer = new MutationObserver(reveal);
    observer.observe(document.body, { subtree: true, childList: true });
    const timeout = setTimeout(() => {
      observer.disconnect();
      setMissing(true);
    }, 8000);
    reveal();
    return () => {
      observer.disconnect();
      clearTimeout(timeout);
      cancelAnimationFrame(frame);
      highlighted.current?.removeAttribute("data-tour-highlight");
      highlighted.current = null;
    };
  }, [stop, pathname]);

  useEffect(() => {
    if (index === null || !panel.current) return;
    const root = document.documentElement;
    root.dataset.portfolioTour = "active";
    const update = () =>
      root.style.setProperty(
        "--tour-panel-height",
        `${panel.current?.getBoundingClientRect().height ?? 0}px`
      );
    const observer = new ResizeObserver(update);
    observer.observe(panel.current);
    update();
    return () => {
      observer.disconnect();
      delete root.dataset.portfolioTour;
      root.style.removeProperty("--tour-panel-height");
    };
  }, [index]);

  return (
    <TourContext.Provider value={() => go(0)}>
      {children}
      {stop &&
        ready &&
        highlighted.current &&
        createPortal(
          <button
            type="button"
            className={styles.returnLink}
            onClick={() => heading.current?.focus({ preventScroll: true })}
          >
            Back to tour controls
          </button>,
          highlighted.current
        )}
      {stop && index !== null && (
        <aside ref={panel} className={styles.panel} aria-label="90-second portfolio tour">
          <div className={styles.header}>
            <p className={styles.eyebrow}>
              Quick tour · {index + 1} of {portfolioTour.length}
            </p>
            <button
              className={styles.exit}
              type="button"
              onClick={() => exit()}
              aria-label="Exit portfolio tour"
            >
              <FiX aria-hidden="true" /> Exit
            </button>
          </div>
          <div className={styles.copy}>
            <h2 ref={heading} tabIndex={-1} className={styles.heading}>
              {stop.title}
            </h2>
            <p>{stop.description}</p>
            <p className={styles.hint} role="status">
              {missing
                ? "This section is unavailable. You can continue or exit."
                : !ready
                  ? "Loading section…"
                  : "You set the pace. Next moves to the highlighted section."}
            </p>
          </div>
          <button type="button" className={styles.explore} disabled={!ready} onClick={explore}>
            Explore highlighted section
          </button>
          <div className={styles.controls}>
            <button
              className={styles.action}
              type="button"
              onClick={() => go(index - 1)}
              disabled={index === 0 || (!ready && !missing)}
            >
              <FiArrowLeft aria-hidden="true" /> Previous
            </button>
            <button
              className={styles.next}
              type="button"
              disabled={!ready && !missing}
              onClick={() => (index === portfolioTour.length - 1 ? exit() : go(index + 1))}
            >
              {index === portfolioTour.length - 1 ? "Finish tour" : "Next"}
              <FiArrowRight aria-hidden="true" />
            </button>
          </div>
        </aside>
      )}
    </TourContext.Provider>
  );
}
