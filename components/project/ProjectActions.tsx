"use client";

import { FiArrowUpRight, FiBookOpen, FiGithub } from "react-icons/fi";
import type { ProjectAction } from "@/data/projects";
import styles from "./RecentProjects.module.css";

export function ProjectActions({ actions, title }: { actions: ProjectAction[]; title: string }) {
  return (
    <div className={styles.actions} aria-label={`${title} project links`}>
      {actions.map((action) => {
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
              <span className={styles.unavailableNote}>In development</span>
            </span>
          );
        return (
          <a
            className={styles.action}
            key={action.label}
            href={action.href}
            target={isStudy ? undefined : "_blank"}
            rel={isStudy ? undefined : "noopener noreferrer"}
            aria-label={`${action.label} — ${title}${isStudy ? "" : " (opens in a new tab)"}`}
            onClick={
              isStudy
                ? (event) => {
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
          </a>
        );
      })}
    </div>
  );
}
