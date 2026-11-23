"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiArrowUpRight, FiBookOpen, FiGithub } from "react-icons/fi";
import type { ProjectAction } from "@/data/projects";
import styles from "./RecentProjects.module.css";

export function ProjectActions({ actions, title }: { actions: ProjectAction[]; title: string }) {
  const pathname = usePathname();
  return (
    <div className={styles.actions} aria-label={`${title} project links`}>
      {actions.map((action) => {
        const isExternal = action.href.startsWith("https://");
        const isStudy = action.href.startsWith("#case-study-");
        const Icon = isStudy
          ? FiBookOpen
          : action.label.includes("GitHub")
            ? FiGithub
            : FiArrowUpRight;
        if (action.disabled)
          return (
            <span className={styles.unavailable} key={action.label} aria-disabled="true">
              <span>{action.label}</span>
              <span className={styles.unavailableNote}>
                {action.disabledReason ?? "Unavailable"}
              </span>
            </span>
          );
        return (
          <Link
            className={styles.action}
            key={action.label}
            href={
              isStudy
                ? `/case-studies?case-study=${encodeURIComponent(action.href.replace("#case-study-", ""))}`
                : action.href
            }
            target={isExternal ? "_blank" : undefined}
            rel={isExternal ? "noopener noreferrer" : undefined}
            aria-label={`${action.label} — ${title}${isExternal ? " (opens in a new tab)" : ""}`}
            onClick={
              isStudy
                ? (event) => {
                    if (pathname !== "/" && pathname !== "/case-studies") return;
                    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
                    event.preventDefault();
                    window.dispatchEvent(
                      new CustomEvent("open-case-study", {
                        detail: action.href.replace("#case-study-", ""),
                      })
                    );
                  }
                : undefined
            }
          >
            {action.label}
            <Icon aria-hidden="true" />
          </Link>
        );
      })}
    </div>
  );
}
