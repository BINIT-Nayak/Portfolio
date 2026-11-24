/* eslint-disable @next/next/no-html-link-for-pages -- A full reload recovers failed router/layout state. */
"use client";

import { useEffect } from "react";
import { reportError } from "@/lib/report-error";
import styles from "./recovery.module.css";

export default function RouteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => reportError(error), [error]);
  return (
    <main id="main-content" tabIndex={-1} className={styles.panel}>
      <h1>This page couldn’t load.</h1>
      <p>Please try again, or return to the portfolio.</p>
      <div className={styles.actions}>
        <button type="button" onClick={reset}>
          Try again
        </button>
        <a href="/">Back to home</a>
      </div>
    </main>
  );
}
