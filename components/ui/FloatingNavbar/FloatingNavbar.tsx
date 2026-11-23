"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { FiArrowUpRight, FiCommand, FiMenu, FiMoon, FiSearch, FiSun, FiX } from "react-icons/fi";

import { searchCommands, validRecents, rememberCommand } from "@/lib/command-palette.mjs";
import { announceRouteNavigation } from "@/lib/route-transitions.mjs";
import { cn } from "@/lib/utils";
import { getNavigationState, moveCommandSelection } from "@/lib/navigation.mjs";
import styles from "./FloatingNavbar.module.css";

type NavItem = { name: string; link: string };
type Overlay = "menu" | "palette" | null;

export function FloatingNav({ navItems, className }: { navItems: NavItem[]; className?: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [active, setActive] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [overlay, setOverlay] = useState<Overlay>(null);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const [recent, setRecent] = useState<string[]>([]);
  const headerRef = useRef<HTMLElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const id = useId();
  const isHome = pathname === "/";
  const isLight = mounted && resolvedTheme === "light";
  const themeLabel = `Switch to ${isLight ? "dark" : "light"} mode`;
  const destination = (link: string) =>
    link === "#projects"
      ? "/projects"
      : link === "#case-studies"
        ? "/case-studies"
        : isHome
          ? link
          : `/${link}`;
  const commands = useMemo(() => [...navItems, { name: "Contact", link: "#contact" }], [navItems]);
  const results = searchCommands(query, recent);
  const resultCount = results.length;
  const selectedIndex = Math.min(selected, Math.max(0, resultCount - 1));

  useEffect(() => {
    setMounted(true);
    try {
      setRecent(
        validRecents(JSON.parse(sessionStorage.getItem("portfolio-command-recents") ?? "[]"))
      );
    } catch {
      /* Storage may be unavailable. Keep in-memory recents. */
    }
  }, []);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      if (document.body.style.position === "fixed") return;
      const sections = isHome
        ? commands.flatMap((item) => {
            const element = document.getElementById(item.link.slice(1));
            return element ? [{ link: item.link, top: element.getBoundingClientRect().top }] : [];
          })
        : [];
      const state = getNavigationState(
        sections,
        window.scrollY,
        document.documentElement.scrollHeight,
        window.innerHeight,
        headerRef.current?.getBoundingClientRect().bottom ?? 80
      );
      if (progressRef.current) progressRef.current.style.transform = `scaleX(${state.progress})`;
      setScrolled(state.scrolled);
      setActive(
        isHome
          ? state.active
          : pathname.startsWith("/case-studies")
            ? "#case-studies"
            : pathname === "/projects"
              ? "#projects"
              : ""
      );
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    const observer = new ResizeObserver(schedule);
    observer.observe(document.body);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [commands, isHome, pathname]);

  useEffect(() => {
    const shortcut = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        // Do not open over another reading dialog or during IME composition.
        if (
          event.isComposing ||
          (!overlay && document.querySelector('[aria-modal="true"], dialog[open]'))
        )
          return;
        event.preventDefault();
        if (overlay) setOverlay(null);
        else {
          openerRef.current = document.activeElement as HTMLElement;
          setQuery("");
          setSelected(0);
          setOverlay("palette");
        }
      }
    };
    window.addEventListener("keydown", shortcut);
    return () => window.removeEventListener("keydown", shortcut);
  }, [overlay]);

  useEffect(() => {
    if (!overlay) return;
    const dialog = dialogRef.current;
    if (!dialog) return;
    const previous = {
      position: document.body.style.position,
      top: document.body.style.top,
      width: document.body.style.width,
      overflow: document.body.style.overflow,
    };
    const scrollY = window.scrollY;
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";
    document.body.style.overflow = "hidden";
    dialog.showModal();
    (overlay === "palette" ? inputRef.current : closeRef.current)?.focus();
    const desktop = window.matchMedia("(min-width: 1120px)");
    const closeOnDesktop = () => {
      if (overlay === "menu" && desktop.matches) setOverlay(null);
    };
    desktop.addEventListener("change", closeOnDesktop);
    return () => {
      desktop.removeEventListener("change", closeOnDesktop);
      dialog.close();
      Object.assign(document.body.style, previous);
      const behavior = document.documentElement.style.scrollBehavior;
      document.documentElement.style.scrollBehavior = "auto";
      window.scrollTo(0, scrollY);
      document.documentElement.style.scrollBehavior = behavior;
      if (openerRef.current?.isConnected) openerRef.current.focus({ preventScroll: true });
    };
  }, [overlay]);

  const open = (kind: Exclude<Overlay, null>) => {
    openerRef.current = document.activeElement as HTMLElement;
    setQuery("");
    setSelected(0);
    setOverlay(kind);
  };
  const navigate = (link: string) => {
    setOverlay(null);
    // Wait until the dialog cleanup restores the document scroll position.
    requestAnimationFrame(() => {
      if (!isHome || link === "#projects" || link === "#case-studies") {
        const href = destination(link);
        announceRouteNavigation(href);
        router.push(href);
        return;
      }
      const target = document.getElementById(link.slice(1));
      if (!target) return;
      window.history.pushState(null, "", link);
      target.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
      });
      const previousTabIndex = target.getAttribute("tabindex");
      target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
      target.addEventListener(
        "blur",
        () => {
          if (previousTabIndex === null) target.removeAttribute("tabindex");
          else target.setAttribute("tabindex", previousTabIndex);
        },
        { once: true }
      );
    });
  };
  const toggleTheme = () => setTheme(isLight ? "dark" : "light");
  const choose = (index: number) => {
    const command = results[index];
    if (!command || command.disabledReason) return;
    const next = rememberCommand(recent, command.id);
    setRecent(next);
    try {
      sessionStorage.setItem("portfolio-command-recents", JSON.stringify(next));
    } catch {
      /* In-memory history still works. */
    }
    if (command.kind === "section") navigate(command.target);
    else if (command.kind === "study") {
      setOverlay(null);
      requestAnimationFrame(() => {
        if (!isHome && pathname !== "/case-studies") {
          const href = `/case-studies?case-study=${encodeURIComponent(command.target)}`;
          announceRouteNavigation(href);
          router.push(href);
        } else {
          window.dispatchEvent(new CustomEvent("open-case-study", { detail: command.target }));
        }
      });
    } else if (command.kind === "theme") {
      toggleTheme();
      setOverlay(null);
    } else {
      const link = document.createElement("a");
      link.href = command.target;
      if (command.kind === "download") link.download = "Binit-Nayak-Resume.pdf";
      else {
        link.target = "_blank";
        link.rel = "noopener noreferrer";
      }
      document.body.append(link);
      link.click();
      link.remove();
      setOverlay(null);
    }
  };
  const themeControl = (
    <button
      type="button"
      className={styles.iconButton}
      onClick={toggleTheme}
      disabled={!mounted}
      aria-label={themeLabel}
      title={themeLabel}
    >
      {isLight ? <FiMoon aria-hidden="true" /> : <FiSun aria-hidden="true" />}
    </button>
  );

  return (
    <>
      <a href="#main-content" className={styles.skipLink}>
        Skip to content
      </a>
      <header ref={headerRef} className={cn(styles.header, className)} data-scrolled={scrolled}>
        <div className={styles.bar}>
          <Link href="/" className={styles.logo} aria-label="Binit Nayak — home">
            BN<span aria-hidden="true">.</span>
          </Link>
          <nav className={styles.desktopNav} aria-label="Primary">
            {navItems.map((item) => (
              <Link
                key={item.link}
                href={destination(item.link)}
                className={styles.navLink}
                aria-current={active === item.link ? "location" : undefined}
              >
                {item.name}
              </Link>
            ))}
          </nav>
          <div className={styles.actions}>
            <Link
              href={destination("#contact")}
              className={styles.contact}
              aria-current={active === "#contact" ? "location" : undefined}
            >
              Contact <FiArrowUpRight aria-hidden="true" />
            </Link>
            {themeControl}
            <button
              className={styles.commandButton}
              type="button"
              aria-label="Open command palette"
              aria-keyshortcuts="Meta+K Control+K"
              aria-haspopup="dialog"
              onClick={() => open("palette")}
            >
              <FiCommand aria-hidden="true" />
              <kbd>⌘ K</kbd>
            </button>
            <button
              className={styles.menuButton}
              type="button"
              aria-label="Open navigation menu"
              aria-haspopup="dialog"
              aria-expanded={overlay === "menu"}
              aria-controls={`${id}-dialog`}
              onClick={() => open("menu")}
            >
              <FiMenu aria-hidden="true" />
            </button>
          </div>
        </div>
        <div className={styles.progressTrack} aria-hidden="true">
          <div ref={progressRef} className={styles.progress} />
        </div>
      </header>

      <dialog
        data-motion-enter={overlay === "menu" ? "fade-up" : "scale-in"}
        ref={dialogRef}
        id={`${id}-dialog`}
        className={cn(styles.dialog, overlay === "menu" ? styles.drawer : styles.palette)}
        aria-labelledby={`${id}-title`}
        onKeyDown={(event) => {
          if (event.key !== "Tab") return;
          const focusable = Array.from(
            event.currentTarget.querySelectorAll<HTMLElement>(
              "button:not([disabled]), a[href], input"
            )
          );
          const first = focusable[0];
          const last = focusable[focusable.length - 1];
          if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last?.focus();
          } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first?.focus();
          }
        }}
        onCancel={(event) => {
          event.preventDefault();
          setOverlay(null);
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) setOverlay(null);
        }}
      >
        <div className={styles.dialogInner}>
          <div className={styles.dialogHeader}>
            <h2 id={`${id}-title`}>{overlay === "menu" ? "Navigation" : "Jump to…"}</h2>
            <button
              ref={closeRef}
              type="button"
              className={styles.iconButton}
              aria-label={overlay === "menu" ? "Close navigation menu" : "Close command palette"}
              onClick={() => setOverlay(null)}
            >
              <FiX aria-hidden="true" />
            </button>
          </div>
          {overlay === "menu" ? (
            <nav className={styles.mobileNav} aria-label="Mobile navigation">
              {commands.map((item, index) => (
                <a
                  key={item.link}
                  href={destination(item.link)}
                  aria-current={active === item.link ? "location" : undefined}
                  onClick={(event) => {
                    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
                    event.preventDefault();
                    navigate(item.link);
                  }}
                >
                  <span className={styles.linkNumber} aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {item.name}
                  <FiArrowUpRight aria-hidden="true" />
                </a>
              ))}
            </nav>
          ) : (
            <>
              <div className={styles.searchField}>
                <FiSearch aria-hidden="true" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(event) => {
                    setQuery(event.target.value);
                    setSelected(0);
                  }}
                  placeholder="Search commands, projects, or people…"
                  aria-label="Search commands"
                  role="combobox"
                  aria-expanded="true"
                  aria-autocomplete="list"
                  aria-controls={`${id}-results`}
                  aria-activedescendant={resultCount ? `${id}-option-${selectedIndex}` : undefined}
                  onKeyDown={(event) => {
                    if (event.nativeEvent.isComposing) return;
                    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
                      event.preventDefault();
                      const next = moveCommandSelection(
                        selectedIndex,
                        event.key === "ArrowDown" ? 1 : -1,
                        resultCount
                      );
                      setSelected(next);
                      document
                        .getElementById(`${id}-option-${next}`)
                        ?.scrollIntoView({ block: "nearest" });
                    } else if (event.key === "Enter" && resultCount) {
                      event.preventDefault();
                      choose(selectedIndex);
                    }
                  }}
                />
              </div>
              <div
                id={`${id}-results`}
                role="listbox"
                aria-label="Commands"
                className={styles.results}
              >
                {results.map((item, index) => (
                  <div
                    key={item.id}
                    id={`${id}-option-${index}`}
                    role="option"
                    aria-disabled={Boolean(item.disabledReason)}
                    aria-selected={selectedIndex === index}
                    className={styles.result}
                    onPointerMove={() => setSelected(index)}
                    onClick={() => choose(index)}
                  >
                    <span>{item.name}</span>
                    <span className={styles.commandHint}>
                      {!query.trim() && recent.includes(item.id) ? "Recent · " : ""}
                      {item.disabledReason
                        ? "Unavailable"
                        : item.kind === "external"
                          ? "New tab"
                          : item.kind === "download"
                            ? "PDF"
                            : item.kind === "theme"
                              ? isLight
                                ? "Dark"
                                : "Light"
                              : "↵"}
                    </span>
                  </div>
                ))}
              </div>
              <p role="status" className={styles.resultStatus}>
                {results[selectedIndex]?.disabledReason ??
                  (resultCount
                    ? `${resultCount} commands · ↑ ↓ to navigate · Enter to select · Esc to close`
                    : "No commands found. Try Projects, Plinko, or Theme.")}
              </p>
            </>
          )}
        </div>
      </dialog>
    </>
  );
}
