/* eslint-disable @next/next/no-html-link-for-pages -- A full reload recovers failed router/layout state. */
"use client";

import { useEffect } from "react";
import { reportError } from "@/lib/report-error";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => reportError(error), [error]);
  // Root layout and its stylesheet may have failed; use a self-contained fallback.
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          background: "#101114",
          color: "#eceef2",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <main
          style={{ maxWidth: "40rem", margin: "10vh auto", padding: "1.5rem", lineHeight: 1.7 }}
        >
          <h1>The portfolio couldn’t load.</h1>
          <p>Please try again. Your browser may need to reconnect.</p>
          <button
            type="button"
            onClick={reset}
            style={{ minHeight: 44, padding: "0.5rem 1rem", font: "inherit" }}
          >
            Try again
          </button>
          <p>
            <a href="/" style={{ display: "inline-block", paddingBlock: 12, color: "#a3bffa" }}>
              Back to home
            </a>
          </p>
        </main>
      </body>
    </html>
  );
}
